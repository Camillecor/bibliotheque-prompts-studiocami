import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VeilleTabs } from "@/components/VeilleTabs";
import { CarteVeille } from "@/components/veille/CarteVeille";
import { PanneauSources } from "@/components/veille/PanneauSources";
import type { VeilleItemRow } from "@/lib/veille";
import { deleteVeilleItem, listVeilleItems, toggleFavoriVeille } from "@/lib/veille.functions";

export const Route = createFileRoute("/_authenticated/veille/favoris")({
  head: () => ({
    meta: [
      { title: "Veille IA — Mes favoris | Studio Cami IA" },
      {
        name: "description",
        content: "Retrouve les actus IA et digitales que tu as gardées de côté pour les relire.",
      },
      { property: "og:title", content: "Veille IA — Mes favoris" },
      {
        property: "og:description",
        content: "Les actualités IA que tu as gardées, rangées au même endroit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VeilleFavorisPage,
});

function VeilleFavorisPage() {
  const queryClient = useQueryClient();
  const fetchItems = useServerFn(listVeilleItems);
  const basculerFavori = useServerFn(toggleFavoriVeille);
  const supprimer = useServerFn(deleteVeilleItem);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["veille-items"],
    queryFn: () => fetchItems(),
  });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["veille-items"] });
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

  const favoris = items.filter((item) => item.favori);

  return (
    <AppShell panel={<PanneauSources />}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">
              Mes favoris
            </h1>
            <p className="text-xs text-muted-foreground lg:text-sm">
              Les actus que tu as gardées pour plus tard.
            </p>
          </div>
          <VeilleTabs />
        </header>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : favoris.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
            <img src="/mario-fox-head.png" alt="" aria-hidden="true" className="h-20 w-20" />
            <p className="font-display text-base font-bold text-primary">Aucun favori</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Clique sur l'étoile d'une actu du fil pour la garder ici.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favoris.map((item) => (
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
