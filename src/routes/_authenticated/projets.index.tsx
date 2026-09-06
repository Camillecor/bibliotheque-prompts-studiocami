import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  Check,
  Flag,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ProjetsTabs } from "@/components/ProjetsTabs";
import { PanneauProjets } from "@/components/projets/PanneauProjets";
import { DetailTache } from "@/components/projets/DetailTache";
import {
  PRIORITES,
  etatEcheance,
  formatEcheance,
  prioriteInfo,
  type ProjetRow,
  type TacheRow,
  type VueRapide,
} from "@/lib/projets";
import { listProjets, listTaches, saveTache, changerStatutTache } from "@/lib/projets.functions";

export const Route = createFileRoute("/_authenticated/projets/")({
  head: () => ({
    meta: [
      { title: "Projets — Tâches et échéances | Studio Cami IA" },
      {
        name: "description",
        content:
          "Organise tes projets, coche tes tâches, suis tes échéances et laisse Mario découper tes objectifs.",
      },
      { property: "og:title", content: "Projets — Tâches et échéances" },
      {
        property: "og:description",
        content: "Un espace de gestion de projet relié à tes contenus, fiches et prompts.",
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
    .map(([cle, titre]) => ({ cle, titre, taches: groupes[cle] ?? [] }))
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

function ProjetsListePage() {
  const queryClient = useQueryClient();
  const [projetActif, setProjetActif] = useState<string | null>(null);
  const [vue, setVue] = useState<VueRapide | null>(null);
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [tacheOuverte, setTacheOuverte] = useState<string | null>(null);

  const fetchProjets = useServerFn(listProjets);
  const fetchTaches = useServerFn(listTaches);
  const enregistrer = useServerFn(saveTache);
  const changerStatut = useServerFn(changerStatutTache);

  const projets = useQuery({ queryKey: ["projets"], queryFn: () => fetchProjets() });
  const taches = useQuery({ queryKey: ["taches"], queryFn: () => fetchTaches() });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["taches"] });
  };

  const ajout = useMutation({
    mutationFn: (titre: string) =>
      enregistrer({
        data: {
          titre,
          projet_id: projetActif,
          priorite: 0,
          statut: "a_faire",
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
    () => new Map((projets.data ?? []).map((projet) => [projet.id, projet])),
    [projets.data],
  );

  const visibles = useMemo(
    () => filtrerTaches(toutes, projetActif, vue),
    [toutes, projetActif, vue],
  );
  const groupes = useMemo(() => grouperParEcheance(visibles), [visibles]);
  const detail = toutes.find((tache) => tache.id === tacheOuverte) ?? null;

  const titre = vue
    ? { aujourdhui: "Aujourd'hui", semaine: "Cette semaine", retard: "En retard", termine: "Terminé" }[vue]
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
          }}
          onVue={(valeur) => {
            setVue(valeur);
            setProjetActif(null);
          }}
        />
      }
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-7">
        <ProjetsTabs />

        <header className="mt-5">
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">{titre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {visibles.filter((t) => t.statut !== "termine").length} tâche(s) en cours
          </p>
        </header>

        <form
          className="mt-4 flex items-center gap-2 rounded-[20px] border border-border bg-card px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            const titreTache = nouvelleTache.trim();
            if (!titreTache) return;
            ajout.mutate(titreTache);
          }}
        >
          <Plus className="h-4 w-4 shrink-0 text-[var(--coral)]" />
          <input
            value={nouvelleTache}
            onChange={(event) => setNouvelleTache(event.target.value)}
            placeholder="Ajouter une tâche…"
            className="min-h-11 w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={ajout.isPending || !nouvelleTache.trim()}
            className="cami-btn-accent shrink-0 disabled:opacity-50"
          >
            {ajout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
          </button>
        </form>

        {taches.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
        ) : groupes.length === 0 ? (
          <div className="mt-8 rounded-[20px] border border-dashed border-border bg-card px-5 py-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-[var(--coral)]" />
            <p className="mt-3 text-sm font-semibold text-primary">Aucune tâche ici</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajoute une tâche ci-dessus, ou demande à Mario de découper un objectif dans le
              panneau de droite.
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

export { PRIORITES };
