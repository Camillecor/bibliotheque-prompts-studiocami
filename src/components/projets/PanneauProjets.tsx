import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CalendarDays, CheckCircle2, Folder, Loader2, Plus, Sparkles, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { COULEURS_PROJET, VUES_RAPIDES, type VueRapide } from "@/lib/projets";
import {
  ajouterTachesEnLot,
  decouperAvecMario,
  deleteProjet,
  listProjets,
  listTaches,
  saveProjet,
} from "@/lib/projets.functions";

const ICONES_VUE = {
  aujourdhui: Sun,
  semaine: CalendarDays,
  retard: AlertTriangle,
  termine: CheckCircle2,
} as const;

type TacheProposee = {
  titre: string;
  note: string;
  priorite: number;
  jours: number;
  sous_taches: string[];
};

export function PanneauProjets({
  projetActif,
  vue,
  onProjet,
  onVue,
}: {
  projetActif: string | null;
  vue: VueRapide | null;
  onProjet: (id: string | null) => void;
  onVue: (vue: VueRapide) => void;
}) {
  const queryClient = useQueryClient();
  const [nouveauProjet, setNouveauProjet] = useState("");
  const [couleur, setCouleur] = useState<string>(COULEURS_PROJET[0]);
  const [objectif, setObjectif] = useState("");
  const [propositions, setPropositions] = useState<TacheProposee[]>([]);

  const fetchProjets = useServerFn(listProjets);
  const fetchTaches = useServerFn(listTaches);
  const enregistrerProjet = useServerFn(saveProjet);
  const supprimerProjet = useServerFn(deleteProjet);
  const decouper = useServerFn(decouperAvecMario);
  const ajouterLot = useServerFn(ajouterTachesEnLot);

  const projets = useQuery({ queryKey: ["projets"], queryFn: () => fetchProjets() });
  const taches = useQuery({ queryKey: ["taches"], queryFn: () => fetchTaches() });

  const compte = (projetId: string) =>
    (taches.data ?? []).filter(
      (tache) => tache.projet_id === projetId && !tache.parent_id && tache.statut !== "termine",
    ).length;

  const creation = useMutation({
    mutationFn: (nom: string) => enregistrerProjet({ data: { nom, couleur, icone: "folder" } }),
    onSuccess: () => {
      setNouveauProjet("");
      void queryClient.invalidateQueries({ queryKey: ["projets"] });
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const suppression = useMutation({
    mutationFn: (id: string) => supprimerProjet({ data: { id } }),
    onSuccess: () => {
      onProjet(null);
      void queryClient.invalidateQueries({ queryKey: ["projets"] });
      void queryClient.invalidateQueries({ queryKey: ["taches"] });
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const decoupage = useMutation({
    mutationFn: (texte: string) => decouper({ data: { objectif: texte, contexte: "", projet_id: projetActif } }),
    onSuccess: (resultat) => {
      setPropositions(resultat.taches);
      if (resultat.taches.length === 0) toast.error("Mario n'a rien proposé, reformule l'objectif.");
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const ajoutLot = useMutation({
    mutationFn: () =>
      ajouterLot({
        data: {
          projet_id: projetActif,
          taches: propositions.map((tache) => {
            const echeance = new Date();
            echeance.setDate(echeance.getDate() + tache.jours);
            echeance.setHours(9, 0, 0, 0);
            return {
              titre: tache.titre,
              note: tache.note,
              priorite: tache.priorite,
              echeance: echeance.toISOString(),
              sous_taches: tache.sous_taches,
            };
          }),
        },
      }),
    onSuccess: (resultat) => {
      setPropositions([]);
      setObjectif("");
      toast.success(`${resultat.ajoutees} tâche(s) ajoutée(s)`);
      void queryClient.invalidateQueries({ queryKey: ["taches"] });
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5">
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Vues rapides
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {VUES_RAPIDES.map((item) => {
            const Icone = ICONES_VUE[item.value];
            const actif = vue === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onVue(item.value)}
                className={[
                  "flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                  actif
                    ? "border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral)]"
                    : "border-border bg-card text-primary hover:border-[var(--coral)]/50",
                ].join(" ")}
              >
                <Icone className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Mes projets
        </h2>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onProjet(null)}
            className={[
              "flex min-h-11 w-full items-center gap-2 rounded-2xl px-3 text-sm font-semibold transition",
              !projetActif && !vue ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary",
            ].join(" ")}
          >
            <Folder className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">Toutes mes tâches</span>
          </button>

          {(projets.data ?? []).map((projet) => (
            <div key={projet.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onProjet(projet.id)}
                className={[
                  "flex min-h-11 flex-1 items-center gap-2 rounded-2xl px-3 text-sm font-semibold transition",
                  projetActif === projet.id
                    ? "bg-primary text-primary-foreground"
                    : "text-primary hover:bg-secondary",
                ].join(" ")}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: projet.couleur }}
                />
                <span className="min-w-0 flex-1 truncate text-left">{projet.nom}</span>
                <span className="shrink-0 text-xs opacity-70">{compte(projet.id)}</span>
              </button>
              <button
                type="button"
                aria-label={`Supprimer ${projet.nom}`}
                onClick={() => suppression.mutate(projet.id)}
                className="cami-icon-btn opacity-0 transition group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <form
          className="mt-3 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            const nom = nouveauProjet.trim();
            if (!nom) return;
            creation.mutate(nom);
          }}
        >
          <input
            value={nouveauProjet}
            onChange={(event) => setNouveauProjet(event.target.value)}
            placeholder="Nouveau projet…"
            maxLength={80}
            className="cami-input min-h-11 w-full"
          />
          <div className="flex items-center gap-2">
            {COULEURS_PROJET.map((valeur) => (
              <button
                key={valeur}
                type="button"
                aria-label={`Couleur ${valeur}`}
                onClick={() => setCouleur(valeur)}
                className={[
                  "h-6 w-6 rounded-full border-2 transition",
                  couleur === valeur ? "border-primary" : "border-transparent",
                ].join(" ")}
                style={{ backgroundColor: valeur }}
              />
            ))}
            <button
              type="submit"
              disabled={creation.isPending || !nouveauProjet.trim()}
              className="cami-btn-secondary ml-auto disabled:opacity-50"
            >
              {creation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Créer
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[20px] border border-border bg-secondary/40 p-3">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[var(--coral)]" />
          Découper avec Mario
        </h2>
        <textarea
          value={objectif}
          onChange={(event) => setObjectif(event.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Ex. Lancer ma newsletter mensuelle avant fin du mois"
          className="cami-input mt-2 w-full resize-y"
        />
        <button
          type="button"
          disabled={decoupage.isPending || objectif.trim().length < 5}
          onClick={() => decoupage.mutate(objectif.trim())}
          className="cami-btn-accent mt-2 w-full justify-center disabled:opacity-50"
        >
          {decoupage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Proposer des tâches
        </button>

        {propositions.length > 0 ? (
          <div className="mt-3 space-y-2">
            {propositions.map((tache, index) => (
              <div key={`${tache.titre}-${index}`} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-primary">{tache.titre}</p>
                  <button
                    type="button"
                    aria-label="Retirer cette proposition"
                    onClick={() => setPropositions((liste) => liste.filter((_, i) => i !== index))}
                    className="cami-icon-btn shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {tache.note ? (
                  <p className="mt-1 text-xs text-muted-foreground">{tache.note}</p>
                ) : null}
                {tache.sous_taches.length > 0 ? (
                  <ul className="mt-1.5 list-disc pl-4 text-xs text-muted-foreground">
                    {tache.sous_taches.map((sous) => (
                      <li key={sous}>{sous}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-1.5 text-[11px] text-muted-foreground">Dans {tache.jours} jour(s)</p>
              </div>
            ))}
            <button
              type="button"
              disabled={ajoutLot.isPending}
              onClick={() => ajoutLot.mutate()}
              className="cami-btn-primary-full justify-center disabled:opacity-50"
            >
              {ajoutLot.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Ajouter ces tâches
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
