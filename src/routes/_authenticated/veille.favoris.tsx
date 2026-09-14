import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownWideNarrow, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VeilleTabs } from "@/components/VeilleTabs";
import { CarteVeille } from "@/components/veille/CarteVeille";
import { ChipsFiltre, type OptionChip } from "@/components/veille/ChipsFiltre";
import { PanneauSources } from "@/components/veille/PanneauSources";
import { nomDomaine, type VeilleItemRow } from "@/lib/veille";
import { deleteVeilleItem, listVeilleItems, toggleFavoriVeille } from "@/lib/veille.functions";

export const Route = createFileRoute("/_authenticated/veille/favoris")({
  head: () => ({
    meta: [
      { title: "Ma bibliothèque de veille IA | Studio Cami IA" },
      {
        name: "description",
        content:
          "Tous les articles de veille IA que tu as gardés avec l'étoile, classés par mois et filtrables par thème et par source.",
      },
      { property: "og:title", content: "Ma bibliothèque de veille IA" },
      {
        property: "og:description",
        content: "Les articles IA que tu as gardés, rangés et faciles à retrouver.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VeilleBibliothequePage,
});

function dateArticle(item: VeilleItemRow): number {
  return new Date(item.publie_le ?? item.created_at).getTime();
}

function libelleMois(timestamp: number): string {
  const libelle = new Date(timestamp).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  return libelle.charAt(0).toUpperCase() + libelle.slice(1);
}

function VeilleBibliothequePage() {
  const queryClient = useQueryClient();
  const fetchItems = useServerFn(listVeilleItems);
  const basculerFavori = useServerFn(toggleFavoriVeille);
  const supprimer = useServerFn(deleteVeilleItem);

  const [recherche, setRecherche] = useState("");
  const [tag, setTag] = useState("tout");
  const [source, setSource] = useState("tout");
  const [tri, setTri] = useState<"recent" | "source">("recent");

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

  const favoris = useMemo(() => items.filter((item) => item.favori), [items]);

  const optionsTags = useMemo<OptionChip[]>(() => {
    const comptes = new Map<string, number>();
    for (const item of favoris) {
      for (const t of item.tags) comptes.set(t, (comptes.get(t) ?? 0) + 1);
    }
    return [
      { value: "tout", label: "Tous les thèmes", compte: favoris.length },
      ...[...comptes.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([value, compte]) => ({ value, label: value, compte })),
    ];
  }, [favoris]);

  const optionsSources = useMemo<OptionChip[]>(() => {
    const comptes = new Map<string, number>();
    for (const item of favoris) {
      const nom = item.source || nomDomaine(item.url);
      comptes.set(nom, (comptes.get(nom) ?? 0) + 1);
    }
    return [
      { value: "tout", label: "Toutes les sources", compte: favoris.length },
      ...[...comptes.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([value, compte]) => ({ value, label: value, compte })),
    ];
  }, [favoris]);

  const filtres = useMemo(() => {
    const texte = recherche.trim().toLowerCase();
    return favoris
      .filter((item) => {
        if (tag !== "tout" && !item.tags.includes(tag)) return false;
        if (source !== "tout" && (item.source || nomDomaine(item.url)) !== source) return false;
        if (!texte) return true;
        return (
          item.titre.toLowerCase().includes(texte) ||
          item.resume.toLowerCase().includes(texte) ||
          item.source.toLowerCase().includes(texte) ||
          item.tags.some((t) => t.toLowerCase().includes(texte))
        );
      })
      .sort((a, b) => {
        if (tri === "source") {
          const nomA = a.source || nomDomaine(a.url);
          const nomB = b.source || nomDomaine(b.url);
          const compare = nomA.localeCompare(nomB, "fr");
          if (compare !== 0) return compare;
        }
        return dateArticle(b) - dateArticle(a);
      });
  }, [favoris, recherche, tag, source, tri]);

  const groupes = useMemo(() => {
    const parMois = new Map<string, VeilleItemRow[]>();
    for (const item of filtres) {
      const cle = libelleMois(dateArticle(item));
      const liste = parMois.get(cle);
      if (liste) liste.push(item);
      else parMois.set(cle, [item]);
    }
    return [...parMois.entries()];
  }, [filtres]);

  const nbSources = optionsSources.length - 1;

  return (
    <AppShell panel={<PanneauSources />}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">
                Mes articles
              </h1>
              <p className="text-xs text-muted-foreground lg:text-sm">
                {favoris.length} article{favoris.length > 1 ? "s" : ""} gardé
                {favoris.length > 1 ? "s" : ""} · {nbSources} source{nbSources > 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTri(tri === "recent" ? "source" : "recent")}
              className="cami-btn-secondary"
            >
              <ArrowDownWideNarrow className="h-4 w-4" />
              {tri === "recent" ? "Plus récents d'abord" : "Par source"}
            </button>
          </div>
          <VeilleTabs />

          {favoris.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />
                <input
                  value={recherche}
                  onChange={(event) => setRecherche(event.target.value)}
                  placeholder="Rechercher dans mes articles"
                  className="cami-input w-full pl-9"
                />
              </div>
              <ChipsFiltre options={optionsTags} valeur={tag} onChange={setTag} />
              {optionsSources.length > 2 ? (
                <ChipsFiltre options={optionsSources} valeur={source} onChange={setSource} />
              ) : null}
            </div>
          ) : null}
        </header>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : favoris.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
            <img src="/mario-fox-head.png" alt="" aria-hidden="true" className="h-20 w-20" />
            <p className="font-display text-base font-bold text-primary">
              Ta bibliothèque est vide
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Clique sur l'étoile orange d'une actu du fil pour la garder ici et la relire quand tu
              veux.
            </p>
          </div>
        ) : filtres.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à cette recherche.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {groupes.map(([mois, articles]) => (
              <section key={mois} className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {mois} · {articles.length}
                </h2>
                {articles.map((item) => (
                  <CarteVeille
                    key={item.id}
                    item={item}
                    onFavori={(cible) => mutationFavori.mutate(cible)}
                    onSupprimer={(cible) => mutationSuppression.mutate(cible)}
                  />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
