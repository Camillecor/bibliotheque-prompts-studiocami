import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Flag, X } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ProjetsTabs } from "@/components/ProjetsTabs";
import { PanneauProjets } from "@/components/projets/PanneauProjets";
import { DetailTache } from "@/components/projets/DetailTache";
import {
  STATUTS_TACHE,
  etatEcheance,
  formatEcheance,
  prioriteInfo,
  type StatutTache,
  type TacheRow,
} from "@/lib/projets";
import { changerStatutTache, listProjets, listTaches } from "@/lib/projets.functions";

export const Route = createFileRoute("/_authenticated/projets/tableau")({
  head: () => ({
    meta: [
      { title: "Tableau des tâches — Projets | Studio Cami IA" },
      {
        name: "description",
        content:
          "Visualise tes tâches en colonnes À faire, En cours et Terminé, et fais-les avancer par glisser-déposer.",
      },
      { property: "og:title", content: "Tableau des tâches — Projets" },
      {
        property: "og:description",
        content: "Un tableau clair pour faire avancer tes projets colonne par colonne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjetsTableauPage,
});

function ProjetsTableauPage() {
  const queryClient = useQueryClient();
  const [projetActif, setProjetActif] = useState<string | null>(null);
  const [tacheOuverte, setTacheOuverte] = useState<string | null>(null);
  const [survol, setSurvol] = useState<StatutTache | null>(null);

  const fetchProjets = useServerFn(listProjets);
  const fetchTaches = useServerFn(listTaches);
  const changerStatut = useServerFn(changerStatutTache);

  const projets = useQuery({ queryKey: ["projets"], queryFn: () => fetchProjets() });
  const taches = useQuery({ queryKey: ["taches"], queryFn: () => fetchTaches() });

  const deplacer = useMutation({
    mutationFn: (variables: { id: string; statut: StatutTache }) =>
      changerStatut({ data: variables }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["taches"] }),
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

  const principales = toutes.filter(
    (tache) => !tache.parent_id && (!projetActif || tache.projet_id === projetActif),
  );

  const detail = toutes.find((tache) => tache.id === tacheOuverte) ?? null;

  return (
    <AppShell
      panel={
        <PanneauProjets
          projetActif={projetActif}
          vue={null}
          onProjet={(id) => setProjetActif(id)}
          onVue={() => setProjetActif(null)}
        />
      }
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <ProjetsTabs />

        <header className="mt-5">
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            {projetActif ? (projetsParId.get(projetActif)?.nom ?? "Projet") : "Tableau"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Glisse une carte d'une colonne à l'autre pour changer son statut.
          </p>
        </header>

        <div className="mt-5 grid gap-3 pb-10 md:grid-cols-3">
          {STATUTS_TACHE.map((colonne) => {
            const cartes = principales.filter((tache) => tache.statut === colonne.value);
            return (
              <section
                key={colonne.value}
                onDragOver={(event) => {
                  event.preventDefault();
                  setSurvol(colonne.value);
                }}
                onDragLeave={() => setSurvol(null)}
                onDrop={(event) => {
                  event.preventDefault();
                  setSurvol(null);
                  const id = event.dataTransfer.getData("text/plain");
                  if (id) deplacer.mutate({ id, statut: colonne.value });
                }}
                className={[
                  "rounded-[20px] border bg-card/70 p-3 transition",
                  survol === colonne.value ? "border-[var(--coral)]" : "border-border",
                ].join(" ")}
              >
                <h2 className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {colonne.label}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                    {cartes.length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {cartes.map((tache) => {
                    const priorite = prioriteInfo(tache.priorite);
                    const projet = tache.projet_id ? projetsParId.get(tache.projet_id) : undefined;
                    const etat = etatEcheance(tache.echeance, tache.statut);
                    const sous = sousTachesPar.get(tache.id) ?? [];
                    const faites = sous.filter((s) => s.statut === "termine").length;

                    return (
                      <button
                        key={tache.id}
                        type="button"
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("text/plain", tache.id)}
                        onClick={() => setTacheOuverte(tache.id)}
                        className="w-full rounded-2xl border border-border bg-card p-3 text-left transition hover:border-[var(--coral)]/60"
                        style={{ borderLeft: `3px solid ${projet?.couleur ?? priorite.couleur}` }}
                      >
                        <p className="text-sm font-semibold text-primary">{tache.titre}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          {projet ? (
                            <span
                              className="rounded-full px-2 py-0.5 font-semibold"
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
                                    : "bg-secondary",
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
                          {sous.length > 0 ? (
                            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">
                              {faites}/{sous.length}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}

                  {cartes.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      Aucune tâche
                    </p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
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
