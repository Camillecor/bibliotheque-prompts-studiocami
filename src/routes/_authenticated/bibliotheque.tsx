import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowLeft,
  Building2,
  Coins,
  Headphones,
  Layers,
  Loader2,
  Megaphone,
  Package,
  Scale,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PromptView } from "@/components/PromptView";
import {
  METIERS,
  TYPES_PROMPT,
  formatDateFr,
  labelTypePrompt,
  type PromptRow,
} from "@/lib/mario";
import { deletePrompt, listPrompts, toggleFavori } from "@/lib/mario.functions";

export const Route = createFileRoute("/_authenticated/bibliotheque")({
  validateSearch: z.object({ id: z.string().uuid().optional() }),
  head: () => ({
    meta: [
      { title: "Ma bibliothèque de prompts — Studio Cami IA" },
      {
        name: "description",
        content:
          "Retrouve, filtre et relis tous tes prompts MARIO : métier, mots-clés, date et complexité.",
      },
      { property: "og:title", content: "Ma bibliothèque de prompts — Studio Cami IA" },
      {
        property: "og:description",
        content: "Tous tes prompts MARIO classés par métier, mots-clés et date.",
      },
    ],
  }),
  component: LibraryPage,
});

type Tri = "recent" | "ancien" | "alpha" | "complexite" | "favoris";

const ORDRE_COMPLEXITE: Record<string, number> = { simple: 0, moyen: 1, complexe: 2 };

const ICONES_METIER: Record<string, typeof Sparkles> = {
  Marketing: Megaphone,
  Ventes: TrendingUp,
  RH: Users,
  Finance: Coins,
  Juridique: Scale,
  Produit: Package,
  "Support client": Headphones,
  "Opérations": Layers,
  "Direction générale": Building2,
  Autre: Sparkles,
};

function IconeMetier({ metier }: { metier: string }) {
  const Icon = ICONES_METIER[metier] ?? Sparkles;
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted"
    >
      <Icon className="h-[18px] w-[18px] text-primary" />
    </span>
  );
}

function LibraryPage() {
  const { id: idDeepLink } = Route.useSearch();
  const fetchPrompts = useServerFn(listPrompts);
  const removePrompt = useServerFn(deletePrompt);
  const changeFavori = useServerFn(toggleFavori);
  const queryClient = useQueryClient();

  const [recherche, setRecherche] = useState("");
  const [metierFiltre, setMetierFiltre] = useState<string[]>([]);
  const [typeFiltre, setTypeFiltre] = useState<string[]>([]);
  const [complexiteFiltre, setComplexiteFiltre] = useState("");
  const [favorisUniquement, setFavorisUniquement] = useState(false);
  const [tri, setTri] = useState<Tri>("recent");
  const [typeListeOuverte, setTypeListeOuverte] = useState(false);
  const [selection, setSelection] = useState<PromptRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => fetchPrompts(),
  });

  useEffect(() => {
    if (!idDeepLink || !data) return;
    const trouve = data.find((prompt) => prompt.id === idDeepLink);
    if (trouve) setSelection(trouve);
  }, [idDeepLink, data]);

  const suppression = useMutation({
    mutationFn: (id: string) => removePrompt({ data: { id } }),
    onSuccess: () => {
      toast.success("Prompt supprimé");
      setSelection(null);
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const favori = useMutation({
    mutationFn: (vars: { id: string; favori: boolean }) => changeFavori({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prompts"] }),
    onError: (error: Error) => toast.error(error.message),
  });

  const prompts = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return (data ?? [])
      .filter((prompt) => {
        const matchTerme =
          !terme ||
          prompt.titre.toLowerCase().includes(terme) ||
          (prompt.mots_cles ?? []).some((mot) => mot.toLowerCase().includes(terme));
        const matchMetier = metierFiltre.length === 0 || metierFiltre.includes(prompt.metier);
        const matchType =
          typeFiltre.length === 0 || (prompt.type_prompt ? typeFiltre.includes(prompt.type_prompt) : false);
        const matchComplexite = !complexiteFiltre || prompt.complexite === complexiteFiltre;
        const matchFavori = !favorisUniquement || Boolean(prompt.favori);
        return matchTerme && matchMetier && matchType && matchComplexite && matchFavori;
      })
      .sort((a, b) => {
        if (tri === "alpha") return a.titre.localeCompare(b.titre, "fr");
        if (tri === "complexite")
          return (ORDRE_COMPLEXITE[a.complexite] ?? 1) - (ORDRE_COMPLEXITE[b.complexite] ?? 1);
        const diff = new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime();
        if (tri === "favoris") {
          if (Boolean(a.favori) !== Boolean(b.favori)) return a.favori ? -1 : 1;
          return diff;
        }
        return tri === "recent" ? diff : -diff;
      });
  }, [data, recherche, metierFiltre, typeFiltre, complexiteFiltre, favorisUniquement, tri]);

  function toggleMetier(metier: string) {
    setMetierFiltre((p) => (p.includes(metier) ? p.filter((m) => m !== metier) : [...p, metier]));
  }

  function toggleType(type: string) {
    setTypeFiltre((p) => (p.includes(type) ? p.filter((t) => t !== type) : [...p, type]));
  }

  const filtresActifs =
    recherche.trim().length > 0 ||
    metierFiltre.length > 0 ||
    typeFiltre.length > 0 ||
    complexiteFiltre.length > 0 ||
    favorisUniquement;

  function reinitialiserFiltres() {
    setRecherche("");
    setMetierFiltre([]);
    setTypeFiltre([]);
    setComplexiteFiltre("");
    setFavorisUniquement(false);
  }

  const panneauFiltres = (
    <div className="space-y-6 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
          placeholder="Catégorie"
          aria-label="Filtrer par catégorie"
          className="cami-input pl-11"
        />
      </div>

      <select
        value={tri}
        onChange={(event) => setTri(event.target.value as Tri)}
        aria-label="Trier"
        className="cami-input"
      >
        <option value="recent">Plus récents d'abord</option>
        <option value="ancien">Plus anciens d'abord</option>
        <option value="alpha">Alphabétique (A → Z)</option>
        <option value="complexite">Complexité (simple → complexe)</option>
        <option value="favoris">Favoris d'abord</option>
      </select>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={favorisUniquement}
          onChange={(event) => setFavorisUniquement(event.target.checked)}
          className="h-4 w-4 rounded border-border accent-[var(--coral)]"
        />
        <span>Favoris uniquement</span>
      </label>


      {filtresActifs ? (
        <button
          type="button"
          onClick={reinitialiserFiltres}
          className="text-xs font-semibold text-[var(--coral)] hover:underline"
        >
          Réinitialiser les filtres
        </button>
      ) : null}

      <div className="border-t border-border pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          Métier
        </p>
        <div className="mt-3 space-y-2">
          {METIERS.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={metierFiltre.includes(item)}
                onChange={() => toggleMetier(item)}
                className="h-4 w-4 rounded border-border accent-[var(--coral)]"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          Type
        </p>
        <div className="mt-3 space-y-2">
          {(typeListeOuverte ? TYPES_PROMPT : TYPES_PROMPT.slice(0, 6)).map((item) => (
            <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={typeFiltre.includes(item.value)}
                onChange={() => toggleType(item.value)}
                className="h-4 w-4 rounded border-border accent-[var(--coral)]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        {TYPES_PROMPT.length > 6 ? (
          <button
            type="button"
            onClick={() => setTypeListeOuverte((v) => !v)}
            className="mt-3 text-xs font-semibold text-[var(--coral)] hover:underline"
          >
            {typeListeOuverte ? "Réduire" : "Tout afficher"}
          </button>
        ) : null}
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          Complexité
        </p>
        <div className="mt-3 space-y-2">
          {["simple", "moyen", "complexe"].map((niveau) => (
            <label
              key={niveau}
              className="flex cursor-pointer items-center gap-2 text-sm capitalize"
            >
              <input
                type="radio"
                name="complexite-filtre"
                checked={complexiteFiltre === niveau}
                onChange={() => setComplexiteFiltre(niveau)}
                className="h-4 w-4 border-border accent-[var(--coral)]"
              />
              <span>{niveau}</span>
            </label>
          ))}
        </div>
        {complexiteFiltre ? (
          <button
            type="button"
            onClick={() => setComplexiteFiltre("")}
            className="mt-3 text-xs font-semibold text-[var(--coral)] hover:underline"
          >
            Effacer
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <AppShell panel={selection ? undefined : panneauFiltres}>
      {selection ? (
        <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="cami-btn min-h-11 flex-1 sm:flex-none"
              onClick={() => setSelection(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la bibliothèque
            </button>
            <button
              type="button"
              className="cami-btn min-h-11 flex-1 sm:flex-none"
              disabled={suppression.isPending}
              onClick={() => suppression.mutate(selection.id)}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
          <div className="cami-card">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Ajouté le {formatDateFr(selection.date_ajout)}
            </p>
            <PromptView
              data={{
                titre: selection.titre,
                metier: selection.metier,
                type_prompt: selection.type_prompt,
                mots_cles: selection.mots_cles ?? [],

                complexite: selection.complexite,
                prompt: selection.prompt ?? "",
                note: selection.note,
                etapes_lancement: selection.etapes_lancement ?? [],
                alerte_pii: selection.alerte_pii,
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
            <h2 className="text-base font-semibold sm:text-lg">Bibliothèque de prompts</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Recherche"
                aria-label="Rechercher un prompt"
                className="h-11 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm text-primary outline-none transition focus:border-[var(--info)] focus:bg-card sm:h-auto sm:w-56 sm:py-2 sm:pr-12 sm:text-xs"
              />
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground sm:inline">
                ⌘K
              </span>
            </div>
          </div>

          <div className="px-4 py-6 md:px-6 md:py-8">
            <p className="mb-4 text-sm text-muted-foreground">
              {prompts.length} résultat{prompts.length > 1 ? "s" : ""} sur{" "}
              {(data ?? []).length} prompt{(data ?? []).length > 1 ? "s" : ""}
            </p>


            {isLoading ? (
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="cami-block-resume text-center text-sm text-muted-foreground">
                Aucun prompt pour l'instant. Génère ton premier prompt depuis le générateur.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => setSelection(prompt)}
                    className="cami-card text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                        {formatDateFr(prompt.date_ajout)}
                      </p>
                      <span
                        role="switch"
                        tabIndex={0}
                        aria-checked={prompt.favori}
                        aria-label="Marquer comme favori"
                        onClick={(event) => {
                          event.stopPropagation();
                          favori.mutate({ id: prompt.id, favori: !prompt.favori });
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            favori.mutate({ id: prompt.id, favori: !prompt.favori });
                          }
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition ${
                          prompt.favori ? "bg-[var(--coral)]" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                            prompt.favori ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </span>
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <IconeMetier metier={prompt.metier} />
                      <h2 className="text-lg font-bold leading-snug">{prompt.titre}</h2>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="cami-pill">{prompt.metier}</span>
                      {prompt.type_prompt ? (
                        <span className="cami-pill">{labelTypePrompt(prompt.type_prompt)}</span>
                      ) : null}
                      <span className="cami-pill text-muted-foreground">{prompt.complexite}</span>
                    </div>
                    {(prompt.mots_cles ?? []).length > 0 ? (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Mots-clés : {(prompt.mots_cles ?? []).join(", ")}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
