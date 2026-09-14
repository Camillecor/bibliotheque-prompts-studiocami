import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VeilleTabs } from "@/components/VeilleTabs";
import { CarteVeille } from "@/components/veille/CarteVeille";
import { PanneauSources } from "@/components/veille/PanneauSources";
import { FILTRES_VEILLE, type FiltreVeille, type VeilleItemRow } from "@/lib/veille";
import {
  deleteVeilleItem,
  lancerVeille,
  listVeilleItems,
  toggleFavoriVeille,
} from "@/lib/veille.functions";

export const Route = createFileRoute("/_authenticated/veille/")({
  head: () => ({
    meta: [
      { title: "Veille IA — Mario fait ta veille | Studio Cami IA" },
      {
        name: "description",
        content:
          "Chaque matin, Mario relit tes sources et le web, puis te résume l'essentiel de l'IA, du digital et des nouveaux outils.",
      },
      { property: "og:title", content: "Veille IA — Mario fait ta veille" },
      {
        property: "og:description",
        content: "Un fil d'actus IA résumées, prêt chaque matin, lisible en 5 minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VeillePage,
});

function debutDuJour(): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function VeillePage() {
  const queryClient = useQueryClient();
  const [filtre, setFiltre] = useState<FiltreVeille>("tout");
  const [recherche, setRecherche] = useState("");

  const fetchItems = useServerFn(listVeilleItems);
  const basculerFavori = useServerFn(toggleFavoriVeille);
  const supprimer = useServerFn(deleteVeilleItem);
  const relancer = useServerFn(lancerVeille);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["veille-items"],
    queryFn: () => fetchItems(),
  });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["veille-items"] });
    void queryClient.invalidateQueries({ queryKey: ["veille-run"] });
  };

  const mutationFavori = useMutation({
    mutationFn: async (item: VeilleItemRow) =>
      basculerFavori({ data: { id: item.id, favori: !item.favori } }),
    onSuccess: invalider,
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationSuppression = useMutation({
    mutationFn: async (item: VeilleItemRow) => supprimer({ data: { id: item.id } }),
    onSuccess: invalider,
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationRelance = useMutation({
    mutationFn: async () => relancer(),
    onSuccess: (resultat) => {
      invalider();
      if (resultat.statut === "occupe") {
        toast.info("Mario est déjà en train de faire ta veille.");
      } else if (resultat.statut === "echec") {
        toast.error("La veille n'a pas pu aller au bout. Réessaie dans un instant.");
      } else {
        toast.success(
          resultat.nb_items > 0
            ? `${resultat.nb_items} nouvelle${resultat.nb_items > 1 ? "s" : ""} actu${resultat.nb_items > 1 ? "s" : ""}`
            : "Rien de neuf pour le moment",
        );
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filtres = useMemo(() => {
    const texte = recherche.trim().toLowerCase();
    const debutJour = debutDuJour();
    const debutSemaine = debutJour - 6 * 24 * 60 * 60 * 1000;

    return items.filter((item) => {
      const date = new Date(item.created_at).getTime();
      if (filtre === "aujourdhui" && date < debutJour) return false;
      if (filtre === "semaine" && date < debutSemaine) return false;
      if (filtre === "favoris" && !item.favori) return false;
      if (!texte) return true;
      return (
        item.titre.toLowerCase().includes(texte) ||
        item.resume.toLowerCase().includes(texte) ||
        item.source.toLowerCase().includes(texte) ||
        item.tags.some((tag) => tag.toLowerCase().includes(texte))
      );
    });
  }, [items, filtre, recherche]);

  const nouveautes = items.filter(
    (item) => new Date(item.created_at).getTime() >= debutDuJour(),
  ).length;

  return (
    <AppShell panel={<PanneauSources />}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">
                Veille IA
              </h1>
              <p className="text-xs capitalize text-muted-foreground lg:text-sm">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                {" · "}
                <span className="lowercase">
                  {nouveautes} nouveauté{nouveautes > 1 ? "s" : ""} aujourd'hui
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => mutationRelance.mutate()}
              disabled={mutationRelance.isPending}
              className="cami-btn-secondary"
            >
              {mutationRelance.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Relancer la veille
            </button>
          </div>
          <VeilleTabs />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />
              <input
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Rechercher dans ma veille"
                className="cami-input w-full pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTRES_VEILLE.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFiltre(option.value)}
                  className={[
                    "inline-flex min-h-11 items-center rounded-full px-3.5 text-xs font-semibold transition",
                    filtre === option.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {isLoading || mutationRelance.isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {mutationRelance.isPending ? "Mario lit tes sources…" : "Chargement de ta veille…"}
          </div>
        ) : filtres.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
            <img src="/mario-fox-head.png" alt="" aria-hidden="true" className="h-20 w-20" />
            <p className="font-display text-base font-bold text-primary">
              Rien à te montrer pour l'instant
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ajoute des sources dans le panneau de droite, puis lance la veille : Mario te résume
              tout.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtres.map((item) => (
              <CarteVeille
                key={item.id}
                item={item}
                onFavori={(cible) => mutationFavori.mutate(cible)}
                onSupprimer={(cible) => mutationSuppression.mutate(cible)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
