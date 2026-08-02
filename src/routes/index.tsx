import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, Hash, Loader2, Save, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
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
  const [motsClesOuvert, setMotsClesOuvert] = useState(false);
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

  const peutGenerer = idee.trim().length >= 5 && !generation.isPending;

  return (
    <AppShell>
      <div className="tech-grid-bg relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem]">
        <div className="glow-orb -left-20 -top-16 h-72 w-72 bg-[var(--info)]" />
        <div className="glow-orb -right-16 top-24 h-64 w-64 bg-[var(--coral)]" />

        <div className="relative mx-auto max-w-2xl py-6 text-center md:py-12">
          <span className="cami-pill">
            <span className="live-dot">
              <span className="live-dot-ping" />
              <span className="live-dot-core" />
            </span>
            Bibliothèque de prompts de Studio Cami IA
          </span>
          <h1 className="font-display mt-5 text-3xl leading-tight md:text-5xl">
            Transforme une idée
            <br />
            en prompt IA structuré
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Décris ton besoin et Mario, mon agent IA produit un prompt avec sa méthode.
          </p>
        </div>

        <form
          className="cami-card-hero relative mx-auto mt-8 max-w-3xl"
          onSubmit={(event) => {
            event.preventDefault();
            if (user && peutGenerer) generation.mutate();
          }}
        >
          <textarea
            rows={3}
            value={idee}
            onChange={(event) => setIdee(event.target.value)}
            placeholder="Décris ton besoin de prompt — comme tu le dirais à un collègue."
            className="w-full resize-none border-0 bg-transparent text-lg text-primary outline-none placeholder:text-muted-foreground"
          />

          {motsClesOuvert ? (
            <input
              value={motsCles}
              onChange={(event) => setMotsCles(event.target.value)}
              placeholder="Mots-clés, séparés par une virgule (optionnel)"
              className="mt-1 w-full border-0 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70"
            />
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <select
                id="metier"
                value={metier}
                onChange={(event) => setMetier(event.target.value)}
                className="cami-select-pill"
                aria-label="Métier"
              >
                <option value="">Métier : Mario décide</option>
                {METIERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setMotsClesOuvert((v) => !v)}
                aria-pressed={motsClesOuvert}
                title="Ajouter des mots-clés"
                className={[
                  "cami-icon-btn",
                  motsClesOuvert ? "bg-secondary text-[var(--primary-dark)]" : "",
                ].join(" ")}
              >
                <Hash className="h-4 w-4" />
              </button>
            </div>

            {user ? (
              <button
                type="submit"
                disabled={!peutGenerer}
                aria-label="Générer le prompt"
                className="cami-submit-btn"
              >
                {generation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            ) : null}
          </div>
        </form>

        {!user ? (
          <div className="glass-card mx-auto mt-4 flex max-w-3xl flex-col items-start gap-3 p-6">
            <p className="text-sm font-medium text-primary">
              Connecte-toi pour générer des prompts et les ranger dans ta bibliothèque.
            </p>
            <button type="button" className="cami-btn" onClick={() => navigate({ to: "/auth" })}>
              <Sparkles className="h-4 w-4" />
              Se connecter
            </button>
          </div>
        ) : null}

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            En 3 étapes
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                titre: "Décris ton besoin",
                texte: "En français, comme tu le dirais à un collègue. Pas de jargon requis.",
              },
              {
                titre: "Mario génère 2 versions",
                texte: "Un prompt MARIO complet, une version améliorée et les étapes de lancement.",
              },
              {
                titre: "Sauvegarde et retrouve-le",
                texte: "Classé par métier et mots-clés, disponible à tout moment dans ta bibliothèque.",
              },
            ].map((etape, index) => (
              <div key={etape.titre} className="cami-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-chic text-sm text-[var(--primary-dark)]">
                  {index + 1}
                </span>
                <h2 className="mt-4 text-base font-bold">{etape.titre}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{etape.texte}</p>
              </div>
            ))}
          </div>
        </section>

        {result ? (
          <div className="cami-card mx-auto mt-16 max-w-5xl space-y-8">
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

            <div className="space-y-4 border-t border-border pt-6">
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
      </div>
    </AppShell>
  );
}
