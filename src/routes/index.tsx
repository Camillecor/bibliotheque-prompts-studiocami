import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUp,
  Check,
  Hash,
  ImagePlus,
  ListPlus,
  Loader2,
  Plus,
  Save,
  Search,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PromptView } from "@/components/PromptView";
import foxAi from "@/assets/fox-ai.png.asset.json";
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
  formatDateFr,
  type MarioResult,
  type ModeleValue,
  type TonValue,
  type TypePromptValue,
} from "@/lib/mario";
import {
  generateMarioPrompt,
  listPrompts,
  poserQuestionsMario,
  savePrompt,
} from "@/lib/mario.functions";


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

const SUGGESTIONS_METIER = [
  {
    titre: "Rédiger un post Instagram",
    description: "qui capte l'attention et donne envie de réagir…",
    tags: ["Instagram", "Post"],
    prefill:
      "Un prompt pour rédiger un post Instagram qui capte l'attention et donne envie de réagir.",
  },
  {
    titre: "Préparer ma candidature",
    description: "lettre de motivation adaptée à une offre d'emploi…",
    tags: ["Emploi", "Lettre"],
    prefill:
      "Un prompt pour préparer ma candidature avec une lettre de motivation adaptée à une offre d'emploi.",
  },
  {
    titre: "Écrire un communiqué de presse",
    description: "clair, factuel et prêt à diffuser…",
    tags: ["Presse", "Communiqué"],
    prefill:
      "Un prompt pour écrire un communiqué de presse clair, factuel et prêt à diffuser.",
  },
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
  const [typeEdit, setTypeEdit] = useState<TypePromptValue>("standard");
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

  // Flux conversationnel : Mario pose 3 questions avant la génération finale.
  const [phase, setPhase] = useState<"idee" | "questions">("idee");
  const [questions, setQuestions] = useState<string[]>([]);
  const [reponses, setReponses] = useState<string[]>([]);
  const [reponseCourante, setReponseCourante] = useState("");

  const generation = useMutation({
    mutationFn: (instructionsOverride?: string) =>
      generate({
        data: {
          idee,
          motsCles,
          modele,
          typePrompt,
          ton,
          autresInstructions: instructionsOverride ?? autresInstructions,
          image: image ? { mediaType: image.mediaType, base64: image.base64 } : undefined,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      setTitreEdit(data.titre_prompt);
      setMetierEdit(data.metier);
      setTypeEdit(typePrompt === "" ? "standard" : typePrompt);
      setMotsClesEdit(data.mots_cles.join(", "));
      setDateEdit(new Date().toISOString().slice(0, 10));
    },

    onError: (error: Error) => toast.error(error.message),
  });

  const poserQuestions = useServerFn(poserQuestionsMario);
  const demandeQuestions = useMutation({
    mutationFn: () =>
      poserQuestions({ data: { idee, motsCles, metier: metierEdit, typePrompt, ton } }),
    onSuccess: (data) => {
      setQuestions(data.questions);
      setReponses([]);
      setReponseCourante("");
      setPhase("questions");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function envoyerReponse() {
    const reponse = reponseCourante.trim();
    if (!reponse || generation.isPending) return;
    const nouvellesReponses = [...reponses, reponse];
    setReponses(nouvellesReponses);
    setReponseCourante("");

    if (nouvellesReponses.length >= questions.length) {
      const echange = questions
        .map((q, i) => `Q${i + 1}: ${q}\nR${i + 1}: ${nouvellesReponses[i] ?? ""}`)
        .join("\n");
      const bloc = `Précisions apportées en échangeant avec Mario :\n${echange}`;
      const combine = autresInstructions.trim()
        ? `${autresInstructions.trim()}\n\n${bloc}`
        : bloc;
      setAutresInstructions(combine);
      generation.mutate(combine);
    }
  }


  const sauvegarde = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error("Aucun prompt à sauvegarder.");
      return save({
        data: {
          titre: titreEdit.trim() || result.titre_prompt,
          metier: metierEdit,
          type_prompt: typeEdit,

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


  // Panneau contextuel : historique récent, lu depuis le cache React Query déjà préchargé.
  const fetchPrompts = useServerFn(listPrompts);
  const { data: prompts } = useQuery({ queryKey: ["prompts"], queryFn: () => fetchPrompts() });
  const [recherche, setRecherche] = useState("");

  const groupesHistorique = useMemo(() => {
    const aujourdhui = new Date().toISOString().slice(0, 10);
    const limite = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filtres = (prompts ?? [])
      .filter((p) => p.titre.toLowerCase().includes(recherche.trim().toLowerCase()))
      .slice(0, 6);

    const jour = filtres.filter((p) => String(p.date_ajout).slice(0, 10) === aujourdhui);
    const semaine = filtres.filter(
      (p) =>
        String(p.date_ajout).slice(0, 10) !== aujourdhui &&
        new Date(p.date_ajout).getTime() >= limite,
    );

    return [
      { titre: "Aujourd'hui", items: jour },
      { titre: "7 derniers jours", items: semaine },
    ].filter((g) => g.items.length > 0);
  }, [prompts, recherche]);

  const stats = useMemo(() => {
    const liste = prompts ?? [];
    const total = liste.length;
    const limite7j = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const cetteSemaine = liste.filter(
      (p) => new Date(p.date_ajout).getTime() >= limite7j,
    ).length;
    const metierComptes = new Map<string, number>();
    for (const p of liste) {
      metierComptes.set(p.metier, (metierComptes.get(p.metier) ?? 0) + 1);
    }
    let metierActif = "—";
    let max = 0;
    for (const [metier, count] of metierComptes) {
      if (count > max) {
        max = count;
        metierActif = metier;
      }
    }
    const dernier = liste
      .slice()
      .sort((a, b) => new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime())[0];
    return {
      total,
      cetteSemaine,
      metierActif,
      dernier: dernier ? formatDateFr(dernier.date_ajout) : "Aucun",
    };
  }, [prompts]);

  function nouveauPrompt() {
    setIdee("");
    setMotsCles("");
    setMotsClesOuvert(false);
    setAutresInstructions("");
    setAutresInstructionsOuvert(false);
    setTypePrompt("");
    setImage(null);
    setResult(null);
    setTitreEdit("");
    setMotsClesEdit("");
    setPhase("idee");
    setQuestions([]);
    setReponses([]);
    setReponseCourante("");
  }


  return (
    <AppShell
      panel={
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex flex-col items-center gap-2">
            <img src={foxAi.url} alt="" aria-hidden="true" className="w-14" />
            <p className="text-center text-xs text-muted-foreground">
              Mario le renard génère des prompts IA performants.
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              placeholder="Rechercher dans l'historique…"
              aria-label="Rechercher dans l'historique"
              className="w-full rounded-full border border-border bg-muted py-2 pl-9 pr-3 text-xs text-primary outline-none transition focus:border-[var(--info)] focus:bg-card"
            />
          </div>

          <div className="space-y-4 overflow-y-auto">
            {groupesHistorique.map((groupe) => (
              <div key={groupe.titre}>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {groupe.titre}
                </p>
                <ul className="space-y-0.5">
                  {groupe.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ to: "/bibliotheque", search: { id: item.id } })
                        }
                        className="w-full truncate rounded-lg px-2 py-1.5 text-left text-xs text-primary transition hover:bg-muted"
                      >
                        {item.titre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h2 className="text-lg font-semibold">Générateur de prompt</h2>
        <button type="button" onClick={nouveauPrompt} className="cami-btn">
          <Plus className="h-4 w-4" />
          Nouveau prompt
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 pt-4 sm:grid-cols-4 md:px-10">
        {[
          { label: "Prompts dans ma bibliothèque", valeur: stats.total },
          { label: "Ajoutés cette semaine", valeur: stats.cetteSemaine },
          { label: "Métier le plus actif", valeur: stats.metierActif },
          { label: "Dernier ajout", valeur: stats.dernier },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-chic text-lg font-semibold text-primary">{item.valeur}</p>
          </div>
        ))}
      </div>

      <div
        className={[
          "px-6 py-4",
          result ? "" : "flex min-h-[calc(100vh-150px)] items-center justify-center",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[820px]">
          <form
            className="cami-card-hero relative w-full"
            onSubmit={(event) => {
              event.preventDefault();
              if (phase === "questions") {
                envoyerReponse();
                return;
              }
              if (peutGenerer) demandeQuestions.mutate();
            }}
          >

          {phase === "questions" ? (
            <div className="mb-4 space-y-3">
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl bg-[var(--coral)] px-3.5 py-2 text-sm text-white">
                  {idee}
                </p>
              </div>
              {questions.slice(0, reponses.length + 1).map((question, index) => (
                <div key={question} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <img src={foxAi.url} alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
                    <p
                      className={[
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                        index === reponses.length
                          ? "bg-secondary font-semibold text-primary"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {question}
                    </p>
                  </div>
                  {reponses[index] ? (
                    <div className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl bg-[var(--coral)] px-3.5 py-1.5 text-xs text-white">
                        {reponses[index]}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <textarea
            rows={2}
            value={phase === "questions" ? reponseCourante : idee}
            onChange={(event) =>
              phase === "questions"
                ? setReponseCourante(event.target.value)
                : setIdee(event.target.value)
            }
            placeholder={phase === "questions" ? "Ta réponse…" : placeholderAnime}
            className="min-h-[85px] w-full resize-none border-0 bg-transparent text-lg text-primary outline-none placeholder:text-sm placeholder:text-muted-foreground"
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
              disabled={
                phase === "questions"
                  ? reponseCourante.trim().length === 0 || generation.isPending
                  : !peutGenerer || demandeQuestions.isPending
              }
              aria-label={phase === "questions" ? "Envoyer ma réponse" : "Générer le prompt"}
              className="cami-submit-btn ml-auto shrink-0 h-8 w-8 md:ml-0 md:h-10 md:w-10 lg:ml-auto"
            >
              {generation.isPending || demandeQuestions.isPending ? (

                <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
              ) : (
                <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </button>
          </div>
        </form>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {SUGGESTIONS_METIER.map((s) => (
                <button
                  key={s.titre}
                  type="button"
                  onClick={() => setIdee(s.prefill)}
                  className="rounded-2xl border border-border bg-card p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[var(--coral)]"
                >
                  <p className="text-sm font-bold text-primary">{s.titre}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className="cami-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>


        {result ? (
          <div
            ref={resultRef}
            id="prompt-genere"
            className="mx-auto mt-16 max-w-5xl scroll-mt-20 space-y-8"
          >
            <PromptView
              editable
              onPromptChange={(prompt) =>
                setResult((precedent) => (precedent ? { ...precedent, prompt } : precedent))
              }
              data={{
                titre: titreEdit || result.titre_prompt,
                metier: metierEdit,
                type_prompt: typeEdit,
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
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label htmlFor="type-edit" className="mb-2 block text-sm font-semibold">
                    Type
                  </label>
                  <select
                    id="type-edit"
                    value={typeEdit}
                    onChange={(event) => setTypeEdit(event.target.value as TypePromptValue)}
                    className="cami-input"
                  >
                    {TYPES_PROMPT.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
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
                <div className="sm:col-span-2">
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
    </AppShell>
  );
}
