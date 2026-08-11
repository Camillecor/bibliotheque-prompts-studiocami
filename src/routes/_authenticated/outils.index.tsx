import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ToolLogo, type ToolLogoName } from "@/components/ToolLogos";
import { formatNote, noteGlobale, type Notes } from "@/lib/toolNotes";
import { saveOutilPerso, listOutilsPersos, deleteOutilPerso } from "@/lib/outilsPersos.functions";

type Prix = "gratuit" | "freemium" | "payant";
type Outil = {
  nom: string;
  slug: string;
  // Absent pour les outils ajoutés par l'utilisatrice (perso: true) — ils
  // n'ont pas de vrai logo de marque, un avatar générique est affiché à la place.
  logo?: ToolLogoName;
  definition: string;
  prix: Prix;
  souverain?: boolean;
  mcp?: boolean;
  notes?: Notes;
  perso?: boolean;
  id?: string;
};
type SectionCategorie = { categorie: string; outils: Outil[] };
type FAQ = { question: string; reponse: string };

// Taxonomie fine, alignée sur la nomenclature du marché (promptfacile.fr/outils/) —
// seules les catégories où j'ai vraiment un outil sont affichées.
const CATEGORIES_LABELS = [
  "Chatbots",
  "Recherche",
  "Maquettes & UI",
  "Design graphique",
  "Images",
  "Code",
  "Base de données",
  "Sites web",
  "Productivité",
  "Stockage & fichiers",
  "E-mailing",
  "Automatisation",
  "SEO",
  "Rédaction",
  "Voix",
  "Vidéo",
  "Réunions",
  "Slides",
  "Traduction",
  "Correction",
  "Marketing",
  "Agents",
];

// Avatar générique pour un outil ajouté par l'utilisatrice, en l'absence de
// vrai logo de marque — cercle de couleur avec l'initiale du nom.
function AvatarOutilPerso({ nom, role }: { nom: string; role: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center text-xs font-bold"
      style={{
        background: `color-mix(in srgb, var(${role}) 16%, white)`,
        color: `var(${role})`,
      }}
    >
      {nom.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

// Outils IA utilisés au quotidien chez Studio Cami, classés par usage.
const SECTIONS: SectionCategorie[] = [
  {
    categorie: "Chatbots",
    outils: [
      {
        nom: "Claude",
        slug: "claude",
        logo: "Claude",
        definition: "Assistant d'Anthropic, à l'aise en rédaction longue, code et raisonnement.",
        prix: "freemium",
        notes: { fonctionnalites: 9, facilite: 8, valeur: 8, confiance: 8.5 },
      },
      {
        nom: "ChatGPT",
        slug: "chatgpt",
        logo: "ChatGPT",
        definition: "Assistant généraliste d'OpenAI, pour écrire, coder et réfléchir au quotidien.",
        prix: "freemium",
        notes: { fonctionnalites: 9.5, facilite: 9, valeur: 7.5, confiance: 8 },
      },
      {
        nom: "Mistral AI",
        slug: "mistral",
        logo: "Mistral",
        definition: "IA française, rapide, hébergée en Europe.",
        prix: "freemium",
        souverain: true,
        notes: { fonctionnalites: 7, facilite: 7.5, valeur: 8.5, confiance: 8.5 },
      },
      {
        nom: "Google Gemini",
        slug: "google-gemini",
        logo: "GoogleGemini",
        definition: "IA multimodale de Google, intégrée à tout l'écosystème Workspace.",
        prix: "freemium",
        notes: { fonctionnalites: 8.5, facilite: 8, valeur: 8, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Recherche",
    outils: [
      {
        nom: "Perplexity AI",
        slug: "perplexity",
        logo: "Perplexity",
        definition: "Moteur de réponse IA qui cite toujours ses sources.",
        prix: "freemium",
        notes: { fonctionnalites: 7.5, facilite: 8.5, valeur: 7, confiance: 7.5 },
      },
      {
        nom: "NotebookLM",
        slug: "notebooklm",
        logo: "NotebookLM",
        definition: "Transforme des documents en notes et podcasts interactifs sourcés.",
        prix: "freemium",
        notes: { fonctionnalites: 8, facilite: 8.5, valeur: 9, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Maquettes & UI",
    outils: [
      {
        nom: "Figma",
        slug: "figma",
        logo: "Figma",
        definition: "Design d'interface : maquettes, prototypes et design system.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 9, facilite: 7, valeur: 7.5, confiance: 8.5 },
      },
    ],
  },
  {
    categorie: "Design graphique",
    outils: [
      {
        nom: "Canva",
        slug: "canva",
        logo: "Canva",
        definition: "Création graphique rapide : visuels, présentations, réseaux sociaux.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 8, facilite: 9.5, valeur: 8, confiance: 8 },
      },
      {
        nom: "Photoroom",
        slug: "photoroom",
        logo: "Photoroom",
        definition: "Détoure et crée des visuels produits en un instant.",
        prix: "freemium",
        souverain: true,
        notes: { fonctionnalites: 7.5, facilite: 9, valeur: 8, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Images",
    outils: [
      {
        nom: "Midjourney",
        slug: "midjourney",
        logo: "Midjourney",
        definition: "Générateur d'images IA à la qualité artistique inégalée.",
        prix: "payant",
        notes: { fonctionnalites: 8.5, facilite: 6, valeur: 6.5, confiance: 7.5 },
      },
    ],
  },
  {
    categorie: "Code",
    outils: [
      {
        nom: "Claude Code",
        slug: "claude-code",
        logo: "ClaudeCode",
        definition: "Agent IA en ligne de commande : code, débogue et gère les projets dans le terminal.",
        prix: "freemium",
        notes: { fonctionnalites: 9, facilite: 7, valeur: 8, confiance: 8.5 },
      },
      {
        nom: "Cursor",
        slug: "cursor",
        logo: "Cursor",
        definition: "L'éditeur de code qui code avec toi, pas juste pour toi.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 9, facilite: 7.5, valeur: 7.5, confiance: 8.5 },
      },
    ],
  },
  {
    categorie: "Base de données",
    outils: [
      {
        nom: "Supabase",
        slug: "supabase",
        logo: "Supabase",
        definition: "Backend open-source : base de données, auth et stockage prêts à l'emploi.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 8.5, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Sites web",
    outils: [
      {
        nom: "Lovable",
        slug: "lovable",
        logo: "Lovable",
        definition: "Génère une app web complète à partir d'une conversation, code et déploiement inclus.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 8, facilite: 8.5, valeur: 7, confiance: 7 },
      },
    ],
  },
  {
    categorie: "Productivité",
    outils: [
      {
        nom: "Notion",
        slug: "notion",
        logo: "Notion",
        definition: "Notes, bases de données et docs dans un seul espace de travail.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 8, confiance: 8.5 },
      },
    ],
  },
  {
    categorie: "Stockage & fichiers",
    outils: [
      {
        nom: "Google Drive",
        slug: "google-drive",
        logo: "GoogleDrive",
        definition: "Stockage et partage de fichiers, intégré à la suite Google.",
        prix: "gratuit",
        mcp: true,
        notes: { fonctionnalites: 7, facilite: 9, valeur: 9, confiance: 9 },
      },
    ],
  },
  {
    categorie: "E-mailing",
    outils: [
      {
        nom: "Gmail",
        slug: "gmail",
        logo: "Gmail",
        definition: "Messagerie et automatisation des e-mails pros.",
        prix: "gratuit",
        mcp: true,
        notes: { fonctionnalites: 7, facilite: 9, valeur: 9, confiance: 9 },
      },
    ],
  },
  {
    categorie: "Automatisation",
    outils: [
      {
        nom: "Zapier",
        slug: "zapier",
        logo: "Zapier",
        definition: "Connecte les outils entre eux et automatise les tâches répétitives.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 6.5, confiance: 8 },
      },
      {
        nom: "n8n",
        slug: "n8n",
        logo: "N8n",
        definition: "Automatisation open source, flexible et auto-hébergeable.",
        prix: "freemium",
        souverain: true,
        mcp: true,
        notes: { fonctionnalites: 9, facilite: 6.5, valeur: 9, confiance: 8 },
      },
    ],
  },
  {
    categorie: "SEO",
    outils: [
      {
        nom: "Semrush",
        slug: "semrush",
        logo: "Semrush",
        definition: "La boîte à outils SEO ultime pour dominer Google.",
        prix: "freemium",
        notes: { fonctionnalites: 9, facilite: 6.5, valeur: 6.5, confiance: 8.5 },
      },
    ],
  },
  {
    categorie: "Rédaction",
    outils: [
      {
        nom: "Jasper AI",
        slug: "jasper-ai",
        logo: "JasperAI",
        definition: "Plateforme de copywriting IA pensée pour les marques.",
        prix: "payant",
        notes: { fonctionnalites: 7.5, facilite: 8, valeur: 6, confiance: 7.5 },
      },
    ],
  },
  {
    categorie: "Voix",
    outils: [
      {
        nom: "ElevenLabs",
        slug: "elevenlabs",
        logo: "ElevenLabs",
        definition: "Les voix IA les plus réalistes du marché.",
        prix: "freemium",
        mcp: true,
        notes: { fonctionnalites: 9, facilite: 8, valeur: 7.5, confiance: 8.5 },
      },
    ],
  },
  {
    categorie: "Vidéo",
    outils: [
      {
        nom: "Synthesia",
        slug: "synthesia",
        logo: "Synthesia",
        definition: "Transforme du texte en vidéos présentées par un avatar.",
        prix: "freemium",
        notes: { fonctionnalites: 8, facilite: 7.5, valeur: 6.5, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Réunions",
    outils: [
      {
        nom: "Granola",
        slug: "granola",
        logo: "Granola",
        definition: "Tu prends tes notes, l'IA écrit le compte-rendu, sans robot dans ta visio.",
        prix: "freemium",
        notes: { fonctionnalites: 7.5, facilite: 9, valeur: 7.5, confiance: 7.5 },
      },
    ],
  },
  {
    categorie: "Slides",
    outils: [
      {
        nom: "Gamma",
        slug: "gamma",
        logo: "Gamma",
        definition: "Crée présentations et sites web en partant d'un prompt.",
        prix: "freemium",
        notes: { fonctionnalites: 8, facilite: 9, valeur: 8, confiance: 7.5 },
      },
    ],
  },
  {
    categorie: "Traduction",
    outils: [
      {
        nom: "DeepL",
        slug: "deepl",
        logo: "DeepL",
        definition: "La traduction IA la plus naturelle, point.",
        prix: "freemium",
        souverain: true,
        notes: { fonctionnalites: 8.5, facilite: 9, valeur: 8.5, confiance: 9 },
      },
    ],
  },
  {
    categorie: "Correction",
    outils: [
      {
        nom: "MerciApp",
        slug: "merciapp",
        logo: "MerciApp",
        definition: "Le correcteur d'orthographe français dopé à l'IA.",
        prix: "freemium",
        souverain: true,
        notes: { fonctionnalites: 7, facilite: 9, valeur: 8.5, confiance: 8 },
      },
    ],
  },
  {
    categorie: "Marketing",
    outils: [
      {
        nom: "Beehiiv",
        slug: "beehiiv",
        logo: "Beehiiv",
        definition: "La plateforme de newsletter pensée pour grandir.",
        prix: "freemium",
        notes: { fonctionnalites: 8, facilite: 8, valeur: 7.5, confiance: 7.5 },
      },
    ],
  },
  {
    categorie: "Agents",
    outils: [
      {
        nom: "Lindy",
        slug: "lindy",
        logo: "Lindy",
        definition: "Crée des assistants IA qui gèrent tes tâches en pilote automatique.",
        prix: "freemium",
        notes: { fonctionnalites: 7.5, facilite: 7, valeur: 7, confiance: 7 },
      },
    ],
  },
];

const FAQ: FAQ[] = [
  {
    question: "Pourquoi cette page plutôt qu'un simple favoris de navigateur ?",
    reponse:
      "Parce qu'un outil sans contexte d'usage se ré-oublie en deux semaines. Chaque fiche répond à « à quoi ça sert vraiment », pas juste « comment y accéder ».",
  },
  {
    question: "Que veut dire le badge MCP ?",
    reponse:
      "L'outil est connecté à Claude Code via le Model Context Protocol dans cette session — Claude peut l'utiliser directement, pas seulement en parler.",
  },
  {
    question: "Que veut dire le badge Souverain ?",
    reponse:
      "L'outil est développé et hébergé en Europe, un critère utile quand la conformité RGPD ou l'indépendance vis-à-vis des fournisseurs américains compte pour le projet.",
  },
  {
    question: "Comment la note sur 10 est-elle calculée ?",
    reponse:
      "C'est la moyenne de 4 critères notés séparément — Fonctionnalités, Facilité d'usage, Rapport qualité-prix, Fiabilité & confiance — arrondie au demi-point. Le détail des 4 sous-notes est visible sur la fiche de chaque outil. C'est une évaluation éditoriale, pas un calcul automatisé : elle est à corriger si l'expérience réelle diverge.",
  },
];

const PRIX_LABEL: Record<Prix, string> = {
  gratuit: "Gratuit",
  freemium: "Freemium",
  payant: "Payant",
};
const PRIX_ROLE: Record<Prix, string> = {
  gratuit: "--success",
  freemium: "--info",
  payant: "--coral",
};

const ROLES = ["--info", "--coral", "--primary", "--warning", "--success"] as const;

export const Route = createFileRoute("/_authenticated/outils/")({
  head: () => ({
    meta: [
      { title: "Outils IA — Studio Cami IA" },
      {
        name: "description",
        content: "Les outils IA utilisés chez Studio Cami, classés par usage, avec prix et disponibilité MCP.",
      },
    ],
  }),
  component: OutilsPage,
});

function OutilsPage() {
  const [recherche, setRecherche] = useState("");
  const [categorieActive, setCategorieActive] = useState<string | null>(null);

  const fetchOutilsPersos = useServerFn(listOutilsPersos);
  const addOutilPerso = useServerFn(saveOutilPerso);
  const removeOutilPerso = useServerFn(deleteOutilPerso);
  const queryClient = useQueryClient();

  const { data: outilsAjoutes = [] } = useQuery({
    queryKey: ["outils_persos"],
    queryFn: () => fetchOutilsPersos(),
  });

  const ajout = useMutation({
    mutationFn: (input: { nom: string; slug: string; definition: string; prix: Prix; categorie: string }) =>
      addOutilPerso({ data: input }),
    onSuccess: (row) => {
      toast.success(`« ${row.nom} » ajouté aux outils.`);
      queryClient.invalidateQueries({ queryKey: ["outils_persos"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const suppressionOutil = useMutation({
    mutationFn: (id: string) => removeOutilPerso({ data: { id } }),
    onSuccess: () => {
      toast.success("Outil supprimé.");
      queryClient.invalidateQueries({ queryKey: ["outils_persos"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const sectionsCombinees = useMemo(() => {
    if (outilsAjoutes.length === 0) return SECTIONS;
    const parCategorie = new Map<string, Outil[]>();
    for (const section of SECTIONS) parCategorie.set(section.categorie, [...section.outils]);
    for (const op of outilsAjoutes) {
      const liste = parCategorie.get(op.categorie) ?? [];
      liste.push({ nom: op.nom, slug: op.slug, definition: op.definition, prix: op.prix, id: op.id, perso: true });
      parCategorie.set(op.categorie, liste);
    }
    return CATEGORIES_LABELS.map((categorie) => ({
      categorie,
      outils: parCategorie.get(categorie) ?? [],
    })).filter((section) => section.outils.length > 0);
  }, [outilsAjoutes]);

  const totalOutils = useMemo(
    () => sectionsCombinees.reduce((somme, section) => somme + section.outils.length, 0),
    [sectionsCombinees],
  );

  const sectionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return sectionsCombinees
      .map((section) => ({
        ...section,
        outils: section.outils
          .filter(
            (o) =>
              !terme ||
              o.nom.toLowerCase().includes(terme) ||
              o.definition.toLowerCase().includes(terme),
          )
          .slice()
          .sort(
            (a, b) => (b.notes ? noteGlobale(b.notes) : -1) - (a.notes ? noteGlobale(a.notes) : -1),
          ),
      }))
      .filter((section) => section.outils.length > 0);
  }, [recherche, sectionsCombinees]);

  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState<string>(CATEGORIES_LABELS[0] ?? "");
  const [nouveauPrix, setNouveauPrix] = useState<Prix>("freemium");
  const [nouvelleDefinition, setNouvelleDefinition] = useState("");

  function ajouterOutil(event: React.FormEvent) {
    event.preventDefault();
    const nom = nouveauNom.trim();
    const definition = nouvelleDefinition.trim();

    if (!nom || !definition) {
      toast.error("Renseigne au moins le nom et une courte description.");
      return;
    }

    const slugBase = nom.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `perso-${slugBase || "outil"}-${Date.now().toString(36)}`;

    ajout.mutate({ nom, slug, definition, prix: nouveauPrix, categorie: nouvelleCategorie });

    setNouveauNom("");
    setNouvelleDefinition("");
    setNouveauPrix("freemium");
  }

  const resultatsCount = sectionsFiltrees.reduce(
    (somme, section) => somme + section.outils.length,
    0,
  );

  const sectionsAffichees = categorieActive
    ? sectionsFiltrees.filter((section) => section.categorie === categorieActive)
    : sectionsFiltrees;

  const hautDePageRef = useRef<HTMLDivElement>(null);
  const [afficherRemonter, setAfficherRemonter] = useState(false);

  useEffect(() => {
    const noeud = hautDePageRef.current;
    if (!noeud) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAfficherRemonter(!(entry?.isIntersecting ?? true)),
      { threshold: 0 },
    );
    observer.observe(noeud);
    return () => observer.disconnect();
  }, []);

  function remonterEnHaut() {
    hautDePageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppShell>
      <div ref={hautDePageRef} aria-hidden="true" className="h-px" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold sm:text-lg">Outils</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un outil"
            aria-label="Rechercher un outil"
            className="h-11 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm text-primary outline-none transition focus:border-[var(--info)] focus:bg-card sm:h-auto sm:w-64 sm:py-2 sm:text-xs"
          />
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Mes outils IA</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {totalOutils} outils que j'utilise vraiment, classés par usage — pour retrouver le
            bon réflexe en un clic.
            {recherche.trim() ? (
              <span className="ml-1 font-semibold text-primary">
                {resultatsCount} résultat{resultatsCount > 1 ? "s" : ""} pour « {recherche} »
              </span>
            ) : null}
          </p>
        </div>

        <form onSubmit={ajouterOutil} className="cami-card mb-8 space-y-2 p-3 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Ajouter un outil
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              value={nouveauNom}
              onChange={(event) => setNouveauNom(event.target.value)}
              placeholder="Nom de l'outil"
              aria-label="Nom de l'outil"
              className="cami-input h-9 min-w-[140px] flex-[2] px-3 py-0 text-sm"
            />
            <select
              value={nouvelleCategorie}
              onChange={(event) => setNouvelleCategorie(event.target.value)}
              aria-label="Catégorie"
              className="cami-input h-9 flex-1 px-2 py-0 text-sm"
            >
              {CATEGORIES_LABELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={nouveauPrix}
              onChange={(event) => setNouveauPrix(event.target.value as Prix)}
              aria-label="Prix"
              className="cami-input h-9 px-2 py-0 text-sm"
            >
              <option value="gratuit">Gratuit</option>
              <option value="freemium">Freemium</option>
              <option value="payant">Payant</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={nouvelleDefinition}
              onChange={(event) => setNouvelleDefinition(event.target.value)}
              placeholder="En une phrase, à quoi ça sert"
              aria-label="Description"
              className="cami-input h-9 flex-1 px-3 py-0 text-sm"
            />
            <button
              type="submit"
              aria-label="Ajouter cet outil"
              title="Ajouter cet outil"
              className="cami-submit-btn h-9 w-9 shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav aria-label="Filtrer par catégorie" className="mb-8 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategorieActive(null)}
            aria-pressed={categorieActive === null}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition hover:-translate-y-0.5 ${
              categorieActive === null
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]"
            }`}
          >
            Tout
            <span className="opacity-60">· {resultatsCount}</span>
          </button>
          {CATEGORIES_LABELS.map((categorie, index) => {
            const section = sectionsFiltrees.find((s) => s.categorie === categorie);
            if (!section) return null;
            const role = ROLES[index % ROLES.length];
            const actif = categorieActive === categorie;
            return (
              <button
                key={categorie}
                type="button"
                onClick={() => setCategorieActive(actif ? null : categorie)}
                aria-pressed={actif}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition hover:-translate-y-0.5 ${
                  actif
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: `var(${role})` }}
                  aria-hidden="true"
                />
                {categorie}
                <span className="opacity-60">· {section.outils.length}</span>
              </button>
            );
          })}
        </nav>


        {sectionsAffichees.length === 0 ? (
          <div className="cami-block-resume text-center text-sm text-muted-foreground">
            Aucun outil ne correspond à « {recherche} ».
          </div>
        ) : (
          <div className="space-y-8">
            {sectionsAffichees.map((section) => {
              const roleIndex = CATEGORIES_LABELS.indexOf(section.categorie);
              const role = ROLES[roleIndex % ROLES.length];
              return (
                <section
                  key={section.categorie}
                  id={`categorie-${roleIndex}`}
                  className="scroll-mt-24"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, var(${role}) 14%, white)`,
                        color: `var(${role})`,
                      }}
                    >
                      {section.outils.length}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {section.categorie}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.outils.map((o, index) => {
                      const contenu = (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                                {o.logo ? (
                                  <ToolLogo nom={o.logo} />
                                ) : (
                                  <AvatarOutilPerso nom={o.nom} role={role} />
                                )}
                              </span>
                              <p className="truncate text-sm font-bold text-primary">{o.nom}</p>
                            </div>
                            {o.notes ? (
                              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                                {formatNote(noteGlobale(o.notes))}
                                <span className="opacity-60">/10</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            {o.definition}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {index === 0 && o.notes ? (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                                style={{
                                  background: `color-mix(in srgb, var(${role}) 16%, white)`,
                                  color: `var(${role})`,
                                }}
                              >
                                ★ Top {section.categorie}
                              </span>
                            ) : null}
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                              style={{
                                background: `color-mix(in srgb, var(${PRIX_ROLE[o.prix]}) 14%, white)`,
                                color: `var(${PRIX_ROLE[o.prix]})`,
                              }}
                            >
                              {PRIX_LABEL[o.prix]}
                            </span>
                            {o.souverain ? (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                                style={{
                                  background: "color-mix(in srgb, var(--violet) 14%, white)",
                                  color: "var(--violet)",
                                }}
                              >
                                Souverain
                              </span>
                            ) : null}
                            {o.mcp ? (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                                style={{
                                  background: "color-mix(in srgb, var(--primary) 14%, white)",
                                  color: "var(--primary)",
                                }}
                              >
                                MCP
                              </span>
                            ) : null}
                            {o.perso ? (
                              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                                Ajouté par moi
                              </span>
                            ) : null}
                          </div>
                        </>
                      );

                      if (o.perso) {
                        return (
                          <div key={o.id ?? o.nom} className="cami-card group relative block">
                            {contenu}
                            <button
                              type="button"
                              onClick={() => o.id && suppressionOutil.mutate(o.id)}
                              aria-label={`Supprimer ${o.nom}`}
                              title="Supprimer"
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition hover:border-[var(--coral)] hover:text-[var(--coral)] focus-visible:opacity-100 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={o.nom}
                          to="/outils/$slug"
                          params={{ slug: o.slug }}
                          className="cami-card block transition hover:-translate-y-0.5 hover:border-[var(--coral)]"
                        >
                          {contenu}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="mt-12 space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-primary">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.question} className="cami-card">
                <p className="text-sm font-bold text-primary">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{item.reponse}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {afficherRemonter ? (
        <button
          type="button"
          onClick={remonterEnHaut}
          aria-label="Remonter en haut de la page"
          title="Remonter en haut"
          className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_8px_20px_-8px_rgba(17,26,61,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </AppShell>
  );
}
