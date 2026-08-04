import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PromptView } from "@/components/PromptView";
import {
  METIERS,
  TYPES_PROMPT,
  formatDateFr,
  labelTypePrompt,
  type PromptRow,
} from "@/lib/mario";
import { deletePrompt, listPrompts } from "@/lib/mario.functions";

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

type Tri = "recent" | "ancien";

function LibraryPage() {
  const { id: idDeepLink } = Route.useSearch();
  const fetchPrompts = useServerFn(listPrompts);
  const removePrompt = useServerFn(deletePrompt);
  const queryClient = useQueryClient();

  const [recherche, setRecherche] = useState("");
  const [metierFiltre, setMetierFiltre] = useState("");
  const [tri, setTri] = useState<Tri>("recent");
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

  const prompts = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return (data ?? [])
      .filter((prompt) => {
        const matchTerme =
          !terme ||
          prompt.titre.toLowerCase().includes(terme) ||
          (prompt.mots_cles ?? []).some((mot) => mot.toLowerCase().includes(terme));
        const matchMetier = !metierFiltre || prompt.metier === metierFiltre;
        return matchTerme && matchMetier;
      })
      .sort((a, b) => {
        const diff = new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime();
        return tri === "recent" ? diff : -diff;
      });
  }, [data, recherche, metierFiltre, tri]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl">
        {selection ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" className="cami-btn" onClick={() => setSelection(null)}>
                <ArrowLeft className="h-4 w-4" />
                Retour à la bibliothèque
              </button>
              <button
                type="button"
                className="cami-btn"
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold md:text-4xl">Ma bibliothèque</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prompts.length} résultat{prompts.length > 1 ? "s" : ""} sur{" "}
                  {(data ?? []).length} prompt{(data ?? []).length > 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                className="cami-btn lg:hidden"
                onClick={() => setFiltresOuverts((v) => !v)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
              <aside
                className={`cami-card space-y-6 lg:sticky lg:top-20 ${
                  filtresOuverts ? "block" : "hidden lg:block"
                }`}
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={recherche}
                    onChange={(event) => setRecherche(event.target.value)}
                    placeholder="Rechercher un titre ou un mot-clé"
                    className="cami-input pl-11"
                  />
                </div>

                <select
                  value={tri}
                  onChange={(event) => setTri(event.target.value as Tri)}
                  className="cami-input"
                >
                  <option value="recent">Plus récents d'abord</option>
                  <option value="ancien">Plus anciens d'abord</option>
                  <option value="alpha">Alphabétique (A → Z)</option>
                  <option value="complexite">Complexité (simple → complexe)</option>
                </select>

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
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
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
                      <label
                        key={item.value}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
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
              </aside>

              <div>
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
                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {formatDateFr(prompt.date_ajout)}
                        </p>
                        <h2 className="mt-2 text-lg font-bold leading-snug">{prompt.titre}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="cami-pill">{prompt.metier}</span>
                          {prompt.type_prompt ? (
                            <span className="cami-pill">{labelTypePrompt(prompt.type_prompt)}</span>
                          ) : null}
                          <span className="cami-pill text-muted-foreground">
                            {prompt.complexite}
                          </span>
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
            </div>
          </>

        )}
      </div>
    </AppShell>
  );
}
