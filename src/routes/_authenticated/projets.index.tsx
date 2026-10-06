import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  Check,
  Flag,
  Flame,
  Folder,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ProjetsTabs } from "@/components/ProjetsTabs";
import { PanneauProjets } from "@/components/projets/PanneauProjets";
import { DetailTache } from "@/components/projets/DetailTache";
import {
  etatEcheance,
  formatEcheance,
  prioriteInfo,
  type ProjetRow,
  type TacheRow,
  type VueRapide,
} from "@/lib/projets";
import { analyserSaisie, scoreTache, raisonsTache, type SaisieAnalysee } from "@/lib/projetsSaisie";
import {
  listProjets,
  listTaches,
  saveTache,
  changerStatutTache,
  analyserListeAvecMario,
} from "@/lib/projets.functions";

export const Route = createFileRoute("/_authenticated/projets/")({
  head: () => ({
    meta: [
      { title: "Projets — Todo-list intelligente | Studio Cami IA" },
      {
        name: "description",
        content:
          "Saisis tes tâches en langage naturel, laisse Mario classer tes priorités et suis tes échéances sans effort.",
      },
      { property: "og:title", content: "Projets — Todo-list intelligente" },
      {
        property: "og:description",
        content: "Une todo-list qui comprend ce que tu écris et trie tes priorités pour toi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjetsListePage,
});

type Groupe = { cle: string; titre: string; taches: TacheRow[] };

function grouperParEcheance(taches: TacheRow[]): Groupe[] {
  const groupes: Record<string, TacheRow[]> = {
    retard: [],
    aujourdhui: [],
    semaine: [],
    plus_tard: [],
    sans_date: [],
    termine: [],
  };

  const finSemaine = new Date();
  finSemaine.setHours(23, 59, 59, 999);
  finSemaine.setDate(finSemaine.getDate() + 7);

  for (const tache of taches) {
    if (tache.statut === "termine") {
      groupes["termine"]!.push(tache);
      continue;
    }
    if (!tache.echeance) {
      groupes["sans_date"]!.push(tache);
      continue;
    }
    const etat = etatEcheance(tache.echeance, tache.statut);
    if (etat === "retard") groupes["retard"]!.push(tache);
    else if (etat === "aujourdhui") groupes["aujourdhui"]!.push(tache);
    else if (new Date(tache.echeance) <= finSemaine) groupes["semaine"]!.push(tache);
    else groupes["plus_tard"]!.push(tache);
  }

  const libelles: [string, string][] = [
    ["retard", "En retard"],
    ["aujourdhui", "Aujourd'hui"],
    ["semaine", "Cette semaine"],
    ["plus_tard", "Plus tard"],
    ["sans_date", "Sans date"],
    ["termine", "Terminé"],
  ];

  return libelles
    .map(([cle, titre]) => ({
      cle,
      titre,
      taches: [...(groupes[cle] ?? [])].sort(
        (a, b) => scoreTache(b) - scoreTache(a),
      ),
    }))
    .filter((groupe) => groupe.taches.length > 0);
}

export function filtrerTaches(
  taches: TacheRow[],
  projetId: string | null,
  vue: VueRapide | null,
): TacheRow[] {
  const finSemaine = new Date();
  finSemaine.setHours(23, 59, 59, 999);
  finSemaine.setDate(finSemaine.getDate() + 7);

  return taches.filter((tache) => {
    if (tache.parent_id) return false;
    if (projetId && tache.projet_id !== projetId) return false;
    if (!vue) return true;
    if (vue === "termine") return tache.statut === "termine";
    if (tache.statut === "termine") return false;
    const etat = etatEcheance(tache.echeance, tache.statut);
    if (vue === "retard") return etat === "retard";
    if (vue === "aujourdhui") return etat === "aujourdhui";
    return Boolean(tache.echeance) && new Date(tache.echeance as string) <= finSemaine;
  });
}

function LigneTache({
  tache,
  sousTaches,
  projet,
  actif,
  onOuvrir,
  onBasculer,
}: {
  tache: TacheRow;
  sousTaches: TacheRow[];
  projet: ProjetRow | undefined;
  actif: boolean;
  onOuvrir: () => void;
  onBasculer: () => void;
}) {
  const priorite = prioriteInfo(tache.priorite);
  const etat = etatEcheance(tache.echeance, tache.statut);
  const faites = sousTaches.filter((s) => s.statut === "termine").length;
  const termine = tache.statut === "termine";

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-[20px] border bg-card px-3 py-3 transition sm:px-4",
        actif ? "border-[var(--coral)]" : "border-border hover:border-[var(--coral)]/50",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onBasculer}
        aria-label={termine ? "Marquer comme à faire" : "Marquer comme terminé"}
        className={[
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition",
          termine ? "border-[var(--coral)] bg-[var(--coral)] text-white" : "border-border",
        ].join(" ")}
        style={termine ? undefined : { borderColor: priorite.couleur }}
      >
        {termine ? <Check className="h-3.5 w-3.5" /> : null}
      </button>

      <button type="button" onClick={onOuvrir} className="min-w-0 flex-1 text-left">
        <p
          className={[
            "text-sm font-semibold",
            termine ? "text-muted-foreground line-through" : "text-primary",
          ].join(" ")}
        >
          {tache.titre}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          {projet ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${projet.couleur} 14%, white)`,
                color: projet.couleur,
              }}
            >
              {projet.nom}
            </span>
          ) : null}

          {tache.echeance ? (
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                etat === "retard"
                  ? "bg-red-50 text-red-600"
                  : etat === "aujourdhui"
                    ? "bg-orange-50 text-orange-600"
                    : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              <CalendarClock className="h-3 w-3" />
              {formatEcheance(tache.echeance)}
            </span>
          ) : null}

          {tache.priorite > 0 ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${priorite.couleur} 14%, white)`,
                color: priorite.couleur,
              }}
            >
              <Flag className="h-3 w-3" />
              {priorite.label}
            </span>
          ) : null}

          {sousTaches.length > 0 ? (
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">
              {faites}/{sousTaches.length} sous-tâches
            </span>
          ) : null}

          {tache.etiquettes.map((etiquette) => (
            <span key={etiquette} className="rounded-full bg-secondary px-2 py-0.5">
              #{etiquette}
            </span>
          ))}
        </div>

        {sousTaches.length > 0 ? (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[var(--coral)] transition-all"
              style={{ width: `${Math.round((faites / sousTaches.length) * 100)}%` }}
            />
          </div>
        ) : null}
      </button>
    </div>
  );
}

function ApercuSaisie({ saisie }: { saisie: SaisieAnalysee }) {
  const detecte =
    saisie.echeanceLabel ||
    saisie.priorite > 0 ||
    saisie.etiquettes.length > 0 ||
    saisie.projetNom;
  if (!detecte) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
      <span className="text-muted-foreground">Détecté :</span>
      {saisie.echeanceLabel ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 font-semibold text-orange-600">
          <CalendarClock className="h-3 w-3" />
          {saisie.echeanceLabel}
        </span>
      ) : null}
      {saisie.priorite > 0 ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold"
          style={{
            backgroundColor: `color-mix(in srgb, ${prioriteInfo(saisie.priorite).couleur} 14%, white)`,
            color: prioriteInfo(saisie.priorite).couleur,
          }}
        >
          <Flag className="h-3 w-3" />
          {prioriteInfo(saisie.priorite).label}
        </span>
      ) : null}
      {saisie.projetNom ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold text-primary">
          <Folder className="h-3 w-3" />
          {saisie.projetNom}
        </span>
      ) : null}
      {saisie.etiquettes.map((etiquette) => (
        <span
          key={etiquette}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold text-primary"
        >
          <Tag className="h-3 w-3" />
          {etiquette}
        </span>
      ))}
    </div>
  );
}

function ProjetsListePage() {
  const queryClient = useQueryClient();
  const [projetActif, setProjetActif] = useState<string | null>(null);
  const [vue, setVue] = useState<VueRapide | null>(null);
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [tacheOuverte, setTacheOuverte] = useState<string | null>(null);
  const [analyse, setAnalyse] = useState<{ focus: { id: string; raison: string }[]; conseils: string[] } | null>(
    null,
  );

  const fetchProjets = useServerFn(listProjets);
  const fetchTaches = useServerFn(listTaches);
  const enregistrer = useServerFn(saveTache);
  const changerStatut = useServerFn(changerStatutTache);
  const analyser = useServerFn(analyserListeAvecMario);

  const projets = useQuery({ queryKey: ["projets"], queryFn: () => fetchProjets() });
  const taches = useQuery({ queryKey: ["taches"], queryFn: () => fetchTaches() });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["taches"] });
  };

  const listeProjets = projets.data ?? [];
  const saisie = useMemo(
    () => analyserSaisie(nouvelleTache, listeProjets),
    [nouvelleTache, listeProjets],
  );

  const ajout = useMutation({
    mutationFn: (aAnalyser: SaisieAnalysee) =>
      enregistrer({
        data: {
          titre: aAnalyser.titre,
          projet_id: aAnalyser.projetId ?? projetActif,
          priorite: aAnalyser.priorite,
          statut: "a_faire",
          echeance: aAnalyser.echeance,
          etiquettes: aAnalyser.etiquettes,
        },
      }),
    onSuccess: () => {
      setNouvelleTache("");
      invalider();
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const bascule = useMutation({
    mutationFn: (tache: TacheRow) =>
      changerStatut({
        data: { id: tache.id, statut: tache.statut === "termine" ? "a_faire" : "termine" },
      }),
    onSuccess: invalider,
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const analyseMario = useMutation({
    mutationFn: () => analyser(),
    onSuccess: (resultat) => {
      if (resultat.focus.length === 0 && resultat.conseils.length === 0) {
        toast.info("Aucune tâche ouverte à analyser. Ajoute d'abord une tâche.");
        return;
      }
      setAnalyse(resultat);
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const toutes = taches.data ?? [];
  const sousTachesPar = useMemo(() => {
    const carte = new Map<string, TacheRow[]>();
    for (const tache of toutes) {
      if (!tache.parent_id) continue;
      const liste = carte.get(tache.parent_id) ?? [];
      liste.push(tache);
      carte.set(tache.parent_id, liste);
    }
    return carte;
  }, [toutes]);

  const projetsParId = useMemo(
    () => new Map(listeProjets.map((projet) => [projet.id, projet])),
    [listeProjets],
  );

  const visibles = useMemo(
    () => filtrerTaches(toutes, projetActif, vue),
    [toutes, projetActif, vue],
  );
  const groupes = useMemo(() => grouperParEcheance(visibles), [visibles]);
  const detail = toutes.find((tache) => tache.id === tacheOuverte) ?? null;

  const focus = useMemo(() => {
    if (vue === "termine") return [];
    return visibles
      .filter((tache) => tache.statut !== "termine")
      .map((tache) => {
        const sous = sousTachesPar.get(tache.id) ?? [];
        const faites = sous.filter((s) => s.statut === "termine").length;
        return { tache, score: scoreTache(tache, faites, sous.length), raisons: raisonsTache(tache, faites, sous.length) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [visibles, vue, sousTachesPar]);

  const titre = vue
    ? {
        aujourdhui: "Aujourd'hui",
        semaine: "Cette semaine",
        retard: "En retard",
        termine: "Terminé",
      }[vue]
    : projetActif
      ? (projetsParId.get(projetActif)?.nom ?? "Projet")
      : "Toutes mes tâches";

  return (
    <AppShell
      panel={
        <PanneauProjets
          projetActif={projetActif}
          vue={vue}
          onProjet={(id) => {
            setProjetActif(id);
            setVue(null);
            setAnalyse(null);
          }}
          onVue={(valeur) => {
            setVue(valeur);
            setProjetActif(null);
            setAnalyse(null);
          }}
        />
      }
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-7">
        <ProjetsTabs />

        <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">{titre}</h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {visibles.filter((t) => t.statut !== "termine").length} tâche(s) en cours
            </p>
          </div>
          <button
            type="button"
            onClick={() => analyseMario.mutate()}
            disabled={analyseMario.isPending}
            className="cami-btn-accent shrink-0 disabled:opacity-50"
          >
            {analyseMario.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Analyse Mario
          </button>
        </header>

        <form
          className="mt-4 rounded-[20px] border border-border bg-card px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            const titreTache = saisie.titre.trim();
            if (!titreTache) return;
            ajout.mutate(saisie);
          }}
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 shrink-0 text-[var(--coral)]" />
            <input
              value={nouvelleTache}
              onChange={(event) => setNouvelleTache(event.target.value)}
              placeholder="Ajouter une tâche… (ex. Devis Cami vendredi urgent #client)"
              className="min-h-11 w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={ajout.isPending || !saisie.titre.trim()}
              className="cami-btn-accent shrink-0 disabled:opacity-50"
            >
              {ajout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </button>
          </div>
          <ApercuSaisie saisie={saisie} />
        </form>

        {analyse ? (
          <section className="mt-5 rounded-[20px] border border-[var(--coral)]/40 bg-[var(--coral)]/5 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--coral)]">
                <Flame className="h-3.5 w-3.5" />
                Mario a classé tes priorités
              </h2>
              <button
                type="button"
                onClick={() => setAnalyse(null)}
                aria-label="Fermer l'analyse"
                className="cami-icon-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="mt-3 space-y-2">
              {analyse.focus.map((entree, index) => {
                const tache = toutes.find((t) => t.id === entree.id);
                if (!tache) return null;
                return (
                  <li key={entree.id}>
                    <button
                      type="button"
                      onClick={() => setTacheOuverte(entree.id)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 text-left transition hover:border-[var(--coral)]/60"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-primary">
                          {tache.titre}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {entree.raison}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {analyse.conseils.length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                {analyse.conseils.map((conseil, index) => (
                  <li key={index} className="flex gap-2">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[var(--coral)]" />
                    {conseil}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {focus.length > 1 && !analyse ? (
          <section className="mt-5 rounded-[20px] border border-[var(--coral)]/40 bg-[var(--coral)]/5 p-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--coral)]">
              <Flame className="h-3.5 w-3.5" />
              Focus du moment
            </h2>
            <div className="mt-3 space-y-2">
              {focus.map(({ tache, raisons }, index) => (
                <button
                  key={tache.id}
                  type="button"
                  onClick={() => setTacheOuverte(tache.id)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 text-left transition hover:border-[var(--coral)]/60"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-primary">{tache.titre}</span>
                    {raisons.length > 0 ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {raisons.join(" · ")}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {taches.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
        ) : groupes.length === 0 ? (
          <div className="mt-8 rounded-[20px] border border-dashed border-border bg-card px-5 py-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-[var(--coral)]" />
            <p className="mt-3 text-sm font-semibold text-primary">Aucune tâche ici</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Ajoute une tâche ci-dessus avec une date et une priorité en langage naturel, ou
              demande à Mario de découper un objectif dans le panneau de droite.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6 pb-10">
            {groupes.map((groupe) => (
              <section key={groupe.cle}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {groupe.titre} · {groupe.taches.length}
                </h2>
                <div className="space-y-2">
                  {groupe.taches.map((tache) => (
                    <LigneTache
                      key={tache.id}
                      tache={tache}
                      sousTaches={sousTachesPar.get(tache.id) ?? []}
                      projet={tache.projet_id ? projetsParId.get(tache.projet_id) : undefined}
                      actif={tacheOuverte === tache.id}
                      onOuvrir={() => setTacheOuverte(tache.id)}
                      onBasculer={() => bascule.mutate(tache)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {detail ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[24px] border border-border bg-card sm:rounded-[24px]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-bold text-primary">Détail de la tâche</p>
              <button
                type="button"
                onClick={() => setTacheOuverte(null)}
                aria-label="Fermer"
                className="cami-icon-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DetailTache
              tache={detail}
              sousTaches={sousTachesPar.get(detail.id) ?? []}
              projets={projets.data ?? []}
              onFerme={() => setTacheOuverte(null)}
            />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
