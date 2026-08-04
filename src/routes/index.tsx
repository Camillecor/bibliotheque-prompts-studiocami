import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Hash,
  ImagePlus,
  ListPlus,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { IaLogo, IA_LOGO_NAMES } from "@/components/IaLogos";
import { PromptView } from "@/components/PromptView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  METIERS,
  MODELES,
  TONS,
  TYPES_PROMPT,
  type MarioResult,
  type ModeleValue,
  type TonValue,
  type TypePromptValue,
} from "@/lib/mario";
import { generateMarioPrompt, savePrompt } from "@/lib/mario.functions";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 Mo
const IMAGE_SIGNATURES: { mediaType: "image/png" | "image/jpeg"; bytes: number[] }[] = [
  { mediaType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mediaType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

type ImageAttachment = { mediaType: "image/png" | "image/jpeg"; base64: string; previewUrl: string; name: string };

// Sécurité : le nom de fichier et le type MIME déclarés par le navigateur ne sont pas fiables
// (un exécutable renommé en .png passerait ce filtre). On relit les premiers octets du fichier
// pour vérifier la vraie signature PNG/JPEG avant d'accepter quoi que ce soit.
async function validerEtLireImage(file: File): Promise<ImageAttachment | null> {
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error("Image trop lourde (5 Mo maximum).");
    return null;
  }
  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    toast.error("Seuls les formats PNG ou JPG sont acceptés.");
    return null;
  }

  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const signatureValide = IMAGE_SIGNATURES.some(
    (sig) => sig.mediaType === file.type && sig.bytes.every((b, i) => header[i] === b),
  );
  if (!signatureValide) {
    toast.error("Ce fichier n'est pas une vraie image PNG/JPG valide — envoi refusé.");
    return null;
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const base64 = dataUrl.split(",")[1] ?? "";
  return {
    mediaType: file.type as "image/png" | "image/jpeg",
    base64,
    previewUrl: dataUrl,
    name: file.name,
  };
}

const SUGGESTIONS_IDEE = [
  "Un prompt pour rédiger des posts LinkedIn qui convertissent…",
  "Un prompt pour préparer un entretien de recrutement structuré…",
  "Un prompt pour analyser un contrat et repérer les clauses à risque…",
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
      { title: "Générateur de page de bibliothèque de prompts triable — Studio Cami IA" },
      {
        name: "description",
        content:
          "Transforme une idée en prompt structuré MARIO optimisé, avec étapes de lancement et classement dans une bibliothèque triable.",
      },
      {
        property: "og:title",
        content: "Générateur de page de bibliothèque de prompts triable — Studio Cami IA",
      },
      {
        property: "og:description",
        content:
          "Décris ton idée, obtiens un prompt MARIO optimisé, puis range-le dans ta bibliothèque triable.",
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
  const [ton, setTon] = useState<TonValue>(TONS[0].value);
  const [modele, setModele] = useState<ModeleValue>("claude-sonnet-5");
  const [autresInstructions, setAutresInstructions] = useState("");
  const [autresInstructionsOuvert, setAutresInstructionsOuvert] = useState(false);
  const [image, setImage] = useState<ImageAttachment | null>(null);
  const [imageEnCours, setImageEnCours] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<MarioResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const placeholderAnime = useTypewriterPlaceholder(SUGGESTIONS_IDEE, idee.length === 0);

  const [titreEdit, setTitreEdit] = useState("");
  const [metierEdit, setMetierEdit] = useState("Autre");
  const [motsClesEdit, setMotsClesEdit] = useState("");
  const [dateEdit, setDateEdit] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImageEnCours(true);
    try {
      const attachment = await validerEtLireImage(file);
      if (attachment) setImage(attachment);
    } finally {
      setImageEnCours(false);
    }
  }

  const generation = useMutation({
    mutationFn: () =>
      generate({
        data: {
          idee,
          motsCles,
          modele,
          typePrompt,
          ton,
          autresInstructions,
          image: image ? { mediaType: image.mediaType, base64: image.base64 } : undefined,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      setTitreEdit(data.titre_prompt);
      setMetierEdit(data.metier);
      setMotsClesEdit(data.mots_cles.join(", "));
      setDateEdit(new Date().toISOString().slice(0, 10));
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
          prompt: result.prompt,
          note: result.note,
          etapes_lancement: result.etapes_lancement,
          alerte_pii: result.alerte_pii,
          idee_source: idee,
          date_ajout: new Date(`${dateEdit}T12:00:00`).toISOString(),
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
      <div className="tech-grid-bg relative mx-auto w-full max-w-5xl rounded-[2rem]">
        <div className="glow-orb -left-20 -top-16 h-72 w-72 bg-[var(--info)]" />
        <div className="glow-orb -right-16 top-24 h-64 w-64 bg-[var(--coral)]" />

        <div className="grid items-center gap-8 py-6 md:py-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <img
            src="/mario-fox-point.png"
            alt="Mario, la mascotte de Studio Cami IA"
            className="mx-auto w-48 sm:w-56 lg:mx-0 lg:w-full"
          />

          <div className="text-center lg:text-left">
            <span className="cami-pill">
              <span className="live-dot">
                <span className="live-dot-ping" />
                <span className="live-dot-core" />
              </span>
              GÉNÉRATEUR DE PROMPT • BIBLIOTHÈQUE • GLOSSAIRE
            </span>
            <h1 className="font-display mt-5 text-3xl leading-tight md:text-5xl">
              Transforme ton idée
              <br />
              en un prompt IA structuré
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Décris ton besoin.
              <br />
              Mario le renard, mon super agent, te génère un prompt structuré et optimisé.
            </p>

            <form
              className="cami-card-hero relative mx-auto mt-8 w-full max-w-2xl lg:mx-0"
              onSubmit={(event) => {
                event.preventDefault();
                if (peutGenerer) generation.mutate();
              }}
            >
          <textarea
            rows={2}
            value={idee}
            onChange={(event) => setIdee(event.target.value)}
            placeholder={placeholderAnime}
            className="w-full resize-none border-0 bg-transparent text-lg text-primary outline-none placeholder:text-sm placeholder:text-muted-foreground"
          />

          {motsClesOuvert ? (
            <input
              value={motsCles}
              onChange={(event) => setMotsCles(event.target.value)}
              placeholder="Mots-clés, séparés par une virgule (optionnel)"
              className="mt-1 w-full border-0 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70"
            />
          ) : null}

          {autresInstructionsOuvert ? (
            <textarea
              rows={2}
              value={autresInstructions}
              onChange={(event) => setAutresInstructions(event.target.value)}
              placeholder="Autres instructions à respecter (optionnel)"
              className="mt-1 w-full resize-none border-0 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70"
            />
          ) : null}

          {image ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-border bg-muted px-3 py-2">
              <img src={image.previewUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
              <span className="max-w-[10rem] truncate text-xs text-muted-foreground">{image.name}</span>
              <button
                type="button"
                aria-label="Retirer l'image"
                onClick={() => setImage(null)}
                className="rounded-full p-0.5 text-muted-foreground transition hover:text-[var(--coral)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="cami-select-pill inline-flex w-fit items-center gap-1.5"
                >
                  Type :{" "}
                  {TYPES_PROMPT.find((t) => t.value === typePrompt)?.label ?? "Auto"}
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
                  Type : Auto
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

            <select
              id="ton"
              value={ton}
              onChange={(event) => setTon(event.target.value as TonValue)}
              className="cami-select-pill"
              aria-label="Ton du prompt"
            >
              {TONS.map((item) => (
                <option key={item.value} value={item.value}>
                  Ton : {item.label}
                </option>
              ))}
            </select>
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
              type="button"
              onClick={() => setAutresInstructionsOuvert((v) => !v)}
              aria-pressed={autresInstructionsOuvert}
              title="Ajouter d'autres instructions"
              className={[
                "cami-icon-btn",
                autresInstructionsOuvert ? "bg-secondary text-[var(--primary-dark)]" : "",
              ].join(" ")}
            >
              <ListPlus className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageEnCours}
              aria-pressed={!!image}
              title="Joindre une image (PNG ou JPG, 5 Mo max)"
              className={[
                "cami-icon-btn",
                image ? "bg-secondary text-[var(--primary-dark)]" : "",
              ].join(" ")}
            >
              {imageEnCours ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
            </button>
            <button
              type="submit"
              disabled={!peutGenerer}
              aria-label="Générer le prompt"
              className="cami-submit-btn ml-auto shrink-0"
            >
              {generation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Compatible avec toutes les IA
          </p>
          <div className="cami-marquee-mask relative mt-5 overflow-hidden">
            <div className="cami-marquee-track flex w-max items-center gap-3">
              {[...IA_LOGO_NAMES, ...IA_LOGO_NAMES].map((nom, index) => (
                <span
                  key={`${nom}-${index}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary"
                >
                  <IaLogo nom={nom} />
                  {nom}
                </span>
              ))}
            </div>
          </div>
        </div>

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
                titre: "Mario génère ton prompt",
                texte: "Un prompt MARIO complet, déjà optimisé, avec les étapes pour le lancer.",
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
          <div
            ref={resultRef}
            id="prompt-genere"
            className="cami-card mx-auto mt-16 max-w-5xl scroll-mt-20 space-y-8"
          >
            <PromptView
              data={{
                titre: result.titre_prompt,
                metier: result.metier,
                mots_cles: result.mots_cles,
                complexite: result.complexite,
                prompt: result.prompt,
                note: result.note,
                etapes_lancement: result.etapes_lancement,
                alerte_pii: result.alerte_pii,
              }}
            />

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="flex items-center gap-3 text-lg font-bold">
                <span className="cami-step-badge bg-[var(--coral)]">3</span>
                Je range mon nouveau prompt dans ma bibliothèque
              </h3>
              <div className="flex flex-col gap-4">
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
                <div>
                  <label htmlFor="date-edit" className="mb-2 block text-sm font-semibold">
                    Date
                  </label>
                  <input
                    id="date-edit"
                    type="date"
                    value={dateEdit}
                    onChange={(event) => setDateEdit(event.target.value)}
                    className="cami-input"
                  />
                </div>
              </div>

              <button
                type="button"
                className="cami-save-btn"
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
