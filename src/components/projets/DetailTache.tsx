import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  PRIORITES,
  STATUTS_TACHE,
  inputDepuisIso,
  isoDepuisInput,
  type ProjetRow,
  type StatutTache,
  type TacheRow,
} from "@/lib/projets";
import { changerStatutTache, deleteTache, saveTache } from "@/lib/projets.functions";

export function DetailTache({
  tache,
  sousTaches,
  projets,
  onFerme,
}: {
  tache: TacheRow;
  sousTaches: TacheRow[];
  projets: ProjetRow[];
  onFerme: () => void;
}) {
  const queryClient = useQueryClient();
  const [titre, setTitre] = useState(tache.titre);
  const [note, setNote] = useState(tache.note);
  const [statut, setStatut] = useState<StatutTache>(tache.statut as StatutTache);
  const [priorite, setPriorite] = useState(tache.priorite);
  const [echeance, setEcheance] = useState(inputDepuisIso(tache.echeance));
  const [etiquettes, setEtiquettes] = useState(tache.etiquettes.join(", "));
  const [projetId, setProjetId] = useState(tache.projet_id ?? "");
  const [nouvelleSous, setNouvelleSous] = useState("");

  useEffect(() => {
    setTitre(tache.titre);
    setNote(tache.note);
    setStatut(tache.statut as StatutTache);
    setPriorite(tache.priorite);
    setEcheance(inputDepuisIso(tache.echeance));
    setEtiquettes(tache.etiquettes.join(", "));
    setProjetId(tache.projet_id ?? "");
  }, [tache]);

  const enregistrer = useServerFn(saveTache);
  const supprimer = useServerFn(deleteTache);
  const changerStatutFn = useServerFn(changerStatutTache);

  const rafraichir = () => {
    void queryClient.invalidateQueries({ queryKey: ["taches"] });
  };

  const sauvegarde = useMutation({
    mutationFn: () =>
      enregistrer({
        data: {
          id: tache.id,
          projet_id: projetId || null,
          parent_id: tache.parent_id,
          titre: titre.trim() || tache.titre,
          note,
          statut,
          priorite,
          echeance: isoDepuisInput(echeance),
          etiquettes: etiquettes
            .split(",")
            .map((valeur) => valeur.trim())
            .filter(Boolean)
            .slice(0, 8),
          ordre: tache.ordre,
          contenu_id: tache.contenu_id,
          fiche_id: tache.fiche_id,
          prompt_id: tache.prompt_id,
        },
      }),
    onSuccess: () => {
      toast.success("Tâche enregistrée");
      rafraichir();
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const suppression = useMutation({
    mutationFn: () => supprimer({ data: { id: tache.id } }),
    onSuccess: () => {
      onFerme();
      rafraichir();
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const ajoutSous = useMutation({
    mutationFn: (valeur: string) =>
      enregistrer({
        data: {
          titre: valeur,
          parent_id: tache.id,
          projet_id: tache.projet_id,
          ordre: sousTaches.length,
        },
      }),
    onSuccess: () => {
      setNouvelleSous("");
      rafraichir();
    },
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const basculeSous = useMutation({
    mutationFn: (sous: TacheRow) =>
      changerStatutFn({
        data: { id: sous.id, statut: sous.statut === "termine" ? "a_faire" : "termine" },
      }),
    onSuccess: rafraichir,
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  const supprimerSous = useMutation({
    mutationFn: (id: string) => supprimer({ data: { id } }),
    onSuccess: rafraichir,
    onError: (erreur: Error) => toast.error(erreur.message),
  });

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <input
        value={titre}
        onChange={(event) => setTitre(event.target.value)}
        maxLength={200}
        className="cami-input min-h-11 w-full text-base font-semibold"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Projet
          </span>
          <select
            value={projetId}
            onChange={(event) => setProjetId(event.target.value)}
            className="cami-select min-h-11 w-full"
          >
            <option value="">Sans projet</option>
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.nom}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Statut
          </span>
          <select
            value={statut}
            onChange={(event) => setStatut(event.target.value as StatutTache)}
            className="cami-select min-h-11 w-full"
          >
            {STATUTS_TACHE.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Priorité
          </span>
          <select
            value={priorite}
            onChange={(event) => setPriorite(Number(event.target.value))}
            className="cami-select min-h-11 w-full"
          >
            {PRIORITES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Échéance
          </span>
          <input
            type="datetime-local"
            value={echeance}
            onChange={(event) => setEcheance(event.target.value)}
            className="cami-input min-h-11 w-full"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Étiquettes (séparées par des virgules)
        </span>
        <input
          value={etiquettes}
          onChange={(event) => setEtiquettes(event.target.value)}
          placeholder="newsletter, urgent"
          className="cami-input min-h-11 w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Note
        </span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="cami-input w-full resize-y"
        />
      </label>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Sous-tâches
        </h3>
        <div className="space-y-1.5">
          {sousTaches.map((sous) => (
            <div
              key={sous.id}
              className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2"
            >
              <button
                type="button"
                onClick={() => basculeSous.mutate(sous)}
                aria-label={sous.statut === "termine" ? "Rouvrir" : "Terminer"}
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                  sous.statut === "termine"
                    ? "border-[var(--coral)] bg-[var(--coral)] text-white"
                    : "border-border",
                ].join(" ")}
              >
                {sous.statut === "termine" ? <Check className="h-3 w-3" /> : null}
              </button>
              <span
                className={[
                  "min-w-0 flex-1 truncate text-sm",
                  sous.statut === "termine" ? "text-muted-foreground line-through" : "text-primary",
                ].join(" ")}
              >
                {sous.titre}
              </span>
              <button
                type="button"
                aria-label="Supprimer la sous-tâche"
                onClick={() => supprimerSous.mutate(sous.id)}
                className="cami-icon-btn shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const valeur = nouvelleSous.trim();
            if (!valeur) return;
            ajoutSous.mutate(valeur);
          }}
        >
          <input
            value={nouvelleSous}
            onChange={(event) => setNouvelleSous(event.target.value)}
            placeholder="Ajouter une sous-tâche…"
            className="cami-input min-h-11 w-full"
          />
          <button
            type="submit"
            disabled={ajoutSous.isPending || !nouvelleSous.trim()}
            className="cami-btn-secondary shrink-0 disabled:opacity-50"
          >
            {ajoutSous.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </form>
      </section>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <button
          type="button"
          disabled={sauvegarde.isPending}
          onClick={() => sauvegarde.mutate()}
          className="cami-btn-accent disabled:opacity-50"
        >
          {sauvegarde.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Enregistrer
        </button>
        <button
          type="button"
          disabled={suppression.isPending}
          onClick={() => suppression.mutate()}
          className="cami-btn-secondary ml-auto text-red-600 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
}
