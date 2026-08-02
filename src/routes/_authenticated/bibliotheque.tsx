import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Search, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { PromptView } from "@/components/PromptView";
import { METIERS, formatDateFr, type PromptRow } from "@/lib/mario";
import { deletePrompt, listPrompts } from "@/lib/mario.functions";

export const Route = createFileRoute("/_authenticated/bibliotheque")({
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
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
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
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                Ajouté le {formatDateFr(selection.date_ajout)}
              </p>
              <PromptView
                data={{
                  titre: selection.titre,
                  metier: selection.metier,
                  mots_cles: selection.mots_cles ?? [],
                  complexite: selection.complexite,
                  version_1: selection.version_1 ?? {},
                  version_2: selection.version_2 ?? {},
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
                <p className="mt-2 text-sm text-slate-600">
                  {(data ?? []).length} prompt{(data ?? []).length > 1 ? "s" : ""} dans ta
                  bibliothèque
                </p>
              </div>
            </div>

            <div className="cami-card mt-6 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={recherche}
                  onChange={(event) => setRecherche(event.target.value)}
                  placeholder="Rechercher un titre ou un mot-clé"
                  className="cami-input pl-11"
                />
              </div>
              <select
                value={metierFiltre}
                onChange={(event) => setMetierFiltre(event.target.value)}
                className="cami-input"
              >
                <option value="">Tous les métiers</option>
                {METIERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={tri}
                onChange={(event) => setTri(event.target.value as Tri)}
                className="cami-input"
              >
                <option value="recent">Plus récents d'abord</option>
                <option value="ancien">Plus anciens d'abord</option>
              </select>
            </div>

            {isLoading ? (
              <div className="mt-10 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="cami-block-resume mt-6 text-center text-sm text-slate-600">
                Aucun prompt pour l'instant. Génère ton premier prompt depuis le générateur.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => setSelection(prompt)}
                    className="cami-card text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                      {formatDateFr(prompt.date_ajout)}
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-snug">{prompt.titre}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="cami-pill">{prompt.metier}</span>
                      <span className="cami-pill text-slate-500">{prompt.complexite}</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      {(prompt.mots_cles ?? []).map((mot) => `#${mot}`).join("  ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
