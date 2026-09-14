import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Rss, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteVeilleSource,
  deleteVeilleTheme,
  dernierRunVeille,
  listVeilleSources,
  listVeilleThemes,
  saveVeilleSource,
  saveVeilleTheme,
} from "@/lib/veille.functions";
import { formatHeureVeille, nomDomaine } from "@/lib/veille";

export function PanneauSources() {
  const queryClient = useQueryClient();
  const [nom, setNom] = useState("");
  const [url, setUrl] = useState("");
  const [theme, setTheme] = useState("");

  const fetchSources = useServerFn(listVeilleSources);
  const fetchThemes = useServerFn(listVeilleThemes);
  const fetchRun = useServerFn(dernierRunVeille);
  const enregistrerSource = useServerFn(saveVeilleSource);
  const supprimerSource = useServerFn(deleteVeilleSource);
  const enregistrerTheme = useServerFn(saveVeilleTheme);
  const supprimerTheme = useServerFn(deleteVeilleTheme);

  const { data: sources = [], isLoading: chargementSources } = useQuery({
    queryKey: ["veille-sources"],
    queryFn: () => fetchSources(),
  });
  const { data: themes = [] } = useQuery({
    queryKey: ["veille-themes"],
    queryFn: () => fetchThemes(),
  });
  const { data: run } = useQuery({ queryKey: ["veille-run"], queryFn: () => fetchRun() });

  const invalider = (cle: string) => queryClient.invalidateQueries({ queryKey: [cle] });

  const mutationSource = useMutation({
    mutationFn: async (input: { id?: string; nom: string; url: string; actif: boolean }) =>
      enregistrerSource({ data: input }),
    onSuccess: () => {
      void invalider("veille-sources");
      setNom("");
      setUrl("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationSuppressionSource = useMutation({
    mutationFn: async (id: string) => supprimerSource({ data: { id } }),
    onSuccess: () => void invalider("veille-sources"),
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationTheme = useMutation({
    mutationFn: async (input: { id?: string; libelle: string; actif: boolean }) =>
      enregistrerTheme({ data: input }),
    onSuccess: () => {
      void invalider("veille-themes");
      setTheme("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationSuppressionTheme = useMutation({
    mutationFn: async (id: string) => supprimerTheme({ data: { id } }),
    onSuccess: () => void invalider("veille-themes"),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-6 p-5">
      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
          <Rss className="h-4 w-4 text-[var(--coral)]" /> Mes sources
        </h2>

        {chargementSources ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement…
          </p>
        ) : sources.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Ajoute l'adresse d'un blog ou d'une newsletter pour que Mario la relise chaque matin.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex items-start gap-2 rounded-2xl border border-border bg-card p-3"
              >
                <label className="flex flex-1 cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={source.actif}
                    onChange={(event) =>
                      mutationSource.mutate({
                        id: source.id,
                        nom: source.nom,
                        url: source.url,
                        actif: event.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 accent-[var(--coral)]"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-primary">
                      {source.nom}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {nomDomaine(source.url)}
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  aria-label={`Supprimer ${source.nom}`}
                  onClick={() => mutationSuppressionSource.mutate(source.id)}
                  className="rounded-xl p-1.5 text-muted-foreground transition hover:text-[var(--coral)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!nom.trim() || !url.trim()) return;
            mutationSource.mutate({ nom: nom.trim(), url: url.trim(), actif: true });
          }}
        >
          <input
            value={nom}
            onChange={(event) => setNom(event.target.value)}
            placeholder="Nom de la source"
            className="cami-input"
          />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://… (adresse du flux)"
            className="cami-input"
          />
          <button type="submit" className="cami-btn-secondary" disabled={mutationSource.isPending}>
            <Plus className="h-4 w-4" /> Ajouter la source
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
          <Tag className="h-4 w-4 text-[var(--coral)]" /> Mes thèmes
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Mario cherche aussi sur le web à partir de ces mots-clés.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-primary"
            >
              {item.libelle}
              <button
                type="button"
                aria-label={`Retirer ${item.libelle}`}
                onClick={() => mutationSuppressionTheme.mutate(item.id)}
                className="text-muted-foreground transition hover:text-[var(--coral)]"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (theme.trim().length < 2) return;
            mutationTheme.mutate({ libelle: theme.trim(), actif: true });
          }}
        >
          <input
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder="Nouveau thème"
            className="cami-input flex-1"
          />
          <button
            type="submit"
            aria-label="Ajouter le thème"
            className="cami-icon-btn"
            disabled={mutationTheme.isPending}
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </section>

      <p className="text-[11px] text-muted-foreground">
        {run?.termine_le
          ? `Dernière veille : ${formatHeureVeille(run.termine_le)}`
          : "Première veille pas encore lancée."}
      </p>
    </div>
  );
}
