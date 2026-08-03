import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, Check, ChevronDown, Hash, Loader2, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PromptView } from "@/components/PromptView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  METIERS,
  MODELES,
  TYPES_PROMPT,
  type MarioResult,
  type ModeleValue,
  type TypePromptValue,
} from "@/lib/mario";
import { generateMarioPrompt, savePrompt } from "@/lib/mario.functions";

const SUGGESTIONS_IDEE = [
  "Un prompt pour rédiger des posts LinkedIn qui convertissent",
  "Un prompt pour préparer un entretien de recrutement structuré",
  "Un prompt pour analyser un contrat et repérer les clauses à risque",
] as const;

function useTypewriterPlaceholder(phrases: readonly string[], active: boolean) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!active) {
      setText("");
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndex % phrases.length] ?? "";
      if (!deleting) {
        charIndex += 1;
        setText(phrase.slice(0, charIndex));
        timeoutId = setTimeout(tick, charIndex >= phrase.length ? 1600 : 32);
        if (charIndex >= phrase.length) deleting = true;
      } else {
        charIndex -= 1;
        setText(phrase.slice(0, charIndex));
        timeoutId = setTimeout(tick, charIndex <= 0 ? 400 : 16);
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex += 1;
        }
      }
    };

    timeoutId = setTimeout(tick, 300);
    return () => clearTimeout(timeoutId);
  }, [active, phrases]);

  return text;
}

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
  const navigate = useNavigate();
  const generate = useServerFn(generateMarioPrompt);
  const save = useServerFn(savePrompt);

  const [idee, setIdee] = useState("");
  const [motsCles, setMotsCles] = useState("");
  const [motsClesOuvert, setMotsClesOuvert] = useState(false);
  const [typePrompt, setTypePrompt] = useState<TypePromptValue | "">("");
  const [modele, setModele] = useState<ModeleValue>("claude-opus-5");
  const [result, setResult] = useState<MarioResult | null>(null);
  const placeholderAnime = useTypewriterPlaceholder(SUGGESTIONS_IDEE, idee.length === 0);

  const [titreEdit, setTitreEdit] = useState("");
  const [metierEdit, setMetierEdit] = useState("Autre");
  const [motsClesEdit, setMotsClesEdit] = useState("");

  const generation = useMutation({
    mutationFn: () => generate({ data: { idee, motsCles, modele, typePrompt } }),
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
            if (peutGenerer) generation.mutate();
          }}
        >
          <textarea
            rows={3}
            value={idee}
            onChange={(event) => setIdee(event.target.value)}
            placeholder={placeholderAnime}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="cami-select-pill inline-flex items-center gap-1.5">
                  Type de prompt :{" "}
                  {TYPES_PROMPT.find((t) => t.value === typePrompt)?.label ?? "Auto"}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-80 rounded-3xl border border-white/60 bg-white/75 p-2 shadow-2xl backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => setTypePrompt("")}
                  className="flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-primary transition hover:bg-secondary"
                >
                  Type de prompt : Auto
                  {typePrompt === "" ? <Check className="h-4 w-4 text-[var(--coral)]" /> : null}
                </button>
                <div className="my-1 h-px bg-border" />
                {TYPES_PROMPT.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTypePrompt(item.value)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-2xl px-3 py-2 text-left transition hover:bg-secondary"
                  >
                    <span className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-primary">
                      {item.label}
                      {typePrompt === item.value ? (
                        <Check className="h-4 w-4 text-[var(--coral)]" />
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <select
                id="modele"
                value={modele}
                onChange={(event) => setModele(event.target.value as ModeleValue)}
                className="cami-select-pill"
                aria-label="Modèle Claude"
              >
                {MODELES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
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
            </div>
          </div>
        </form>

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
