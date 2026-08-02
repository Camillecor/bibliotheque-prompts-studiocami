import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Sparkles, Wand2 } from "lucide-react";
import { Header } from "@/components/Header";
import { PromptView } from "@/components/PromptView";
import { useAuth } from "@/hooks/useAuth";
import { METIERS, type MarioResult } from "@/lib/mario";
import { generateMarioPrompt, savePrompt } from "@/lib/mario.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Générateur de prompts MARIO — Studio Cami IA" },
      {
        name: "description",
        content:
          "Transforme une idée en prompt structuré MARIO en deux versions, avec étapes de lancement et classement automatique dans ta bibliothèque.",
      },
      { property: "og:title", content: "Générateur de prompts MARIO — Studio Cami IA" },
      {
        property: "og:description",
        content:
          "Décris ton idée, obtiens un prompt MARIO en V1 et V2 améliorée, puis range-le dans ta bibliothèque.",
      },
    ],
  }),
  component: GeneratorPage,
});

function GeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const generate = useServerFn(generateMarioPrompt);
  const save = useServerFn(savePrompt);

  const [idee, setIdee] = useState("");
  const [motsCles, setMotsCles] = useState("");
  const [metier, setMetier] = useState("");
  const [result, setResult] = useState<MarioResult | null>(null);

  const [titreEdit, setTitreEdit] = useState("");
  const [metierEdit, setMetierEdit] = useState("Autre");
  const [motsClesEdit, setMotsClesEdit] = useState("");

  const generation = useMutation({
    mutationFn: () => generate({ data: { idee, motsCles, metier } }),
    onSuccess: (data) => {
      setResult(data);
      setTitreEdit(data.titre_prompt);
      setMetierEdit(data.metier);
      setMotsClesEdit(data.mots_cles.join(", "));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const sauvegarde = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error("Aucun prompt à sauvegarder.");
      return save({
        data: {
          titre: titreEdit.trim() || result.titre_prompt,
          metier: metierEdit,
          mots_cles: motsClesEdit
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
            .slice(0, 5),
          complexite: result.complexite,
          version_1: result.version_1,
          version_2: result.version_2,
          etapes_lancement: result.etapes_lancement,
          alerte_pii: result.alerte_pii,
          idee_source: idee,
        },
      });
    },
    onSuccess: () => {
      toast.success("Prompt ajouté à ta bibliothèque");
      navigate({ to: "/bibliotheque" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="cami-pill">Méthode MARIO</span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
            Transforme une idée en prompt structuré
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Décris ton idée en français. L'IA produit un prompt MARIO complet, une version
            améliorée, et les étapes concrètes pour le lancer.
          </p>
        </div>

        <div className="cami-card-hero mx-auto mt-8 max-w-3xl space-y-5">
          <div>
            <label htmlFor="idee" className="mb-2 block text-sm font-semibold text-navy">
              Décris ton idée de prompt
            </label>
            <textarea
              id="idee"
              rows={4}
              value={idee}
              onChange={(event) => setIdee(event.target.value)}
              placeholder="Un prompt pour aider mon équipe marketing à rédiger des posts LinkedIn engageants"
              className="cami-input resize-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="motscles" className="mb-2 block text-sm font-semibold text-navy">
                Mots-clés <span className="font-normal text-slate-400">(optionnel)</span>
              </label>
              <input
                id="motscles"
                value={motsCles}
                onChange={(event) => setMotsCles(event.target.value)}
                placeholder="linkedin, copywriting, b2b"
                className="cami-input"
              />
            </div>
            <div>
              <label htmlFor="metier" className="mb-2 block text-sm font-semibold text-navy">
                Métier <span className="font-normal text-slate-400">(optionnel)</span>
              </label>
              <select
                id="metier"
                value={metier}
                onChange={(event) => setMetier(event.target.value)}
                className="cami-input"
              >
                <option value="">Laisser l'IA décider</option>
                {METIERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {user ? (
            <button
              type="button"
              className="cami-cta w-full"
              disabled={generation.isPending || idee.trim().length < 5}
              onClick={() => generation.mutate()}
            >
              {generation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Générer le prompt
                </>
              )}
            </button>
          ) : (
            <div className="cami-block-resume flex flex-col items-start gap-3">
              <p className="text-sm font-medium text-navy">
                Connecte-toi pour générer des prompts et les ranger dans ta bibliothèque.
              </p>
              <button type="button" className="cami-btn" onClick={() => navigate({ to: "/auth" })}>
                <Sparkles className="h-4 w-4" />
                Se connecter
              </button>
            </div>
          )}
        </div>

        {result ? (
          <div className="cami-card mx-auto mt-8 max-w-5xl space-y-8">
            <PromptView
              data={{
                titre: result.titre_prompt,
                metier: result.metier,
                mots_cles: result.mots_cles,
                complexite: result.complexite,
                version_1: result.version_1,
                version_2: result.version_2,
                etapes_lancement: result.etapes_lancement,
                alerte_pii: result.alerte_pii,
              }}
            />

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold">Classement dans la bibliothèque</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="titre-edit" className="mb-2 block text-sm font-semibold">
                    Titre
                  </label>
                  <input
                    id="titre-edit"
                    value={titreEdit}
                    onChange={(event) => setTitreEdit(event.target.value)}
                    className="cami-input"
                  />
                </div>
                <div>
                  <label htmlFor="metier-edit" className="mb-2 block text-sm font-semibold">
                    Métier
                  </label>
                  <select
                    id="metier-edit"
                    value={metierEdit}
                    onChange={(event) => setMetierEdit(event.target.value)}
                    className="cami-input"
                  >
                    {METIERS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mots-edit" className="mb-2 block text-sm font-semibold">
                    Mots-clés
                  </label>
                  <input
                    id="mots-edit"
                    value={motsClesEdit}
                    onChange={(event) => setMotsClesEdit(event.target.value)}
                    className="cami-input"
                  />
                </div>
              </div>

              <button
                type="button"
                className="cami-cta w-full md:w-auto"
                disabled={sauvegarde.isPending}
                onClick={() => sauvegarde.mutate()}
              >
                {sauvegarde.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Sauvegarder dans ma bibliothèque
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
