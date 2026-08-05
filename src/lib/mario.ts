export const METIERS = [
  "Marketing",
  "Ventes",
  "RH",
  "Finance",
  "Juridique",
  "Produit",
  "Support client",
  "Opérations",
  "Direction générale",
  "Autre",
] as const;

export type Metier = (typeof METIERS)[number];

export const MODELES = [
  { value: "claude-haiku-4-5", label: "Haiku 4.5", note: "Rapide, économique" },
  { value: "claude-sonnet-5", label: "Sonnet 5", note: "Équilibré (recommandé)" },
] as const;

export type ModeleValue = (typeof MODELES)[number]["value"];

export const TYPES_PROMPT = [
  { value: "standard", label: "Standard", description: "Passe-partout pour toute tâche" },
  { value: "article", label: "Article", description: "Articles, billets de blog, posts longs" },
  { value: "redaction", label: "Rédaction", description: "Emails, posts courts, textes divers" },
  { value: "email", label: "Email", description: "Relances, séquences, réponses clients" },
  { value: "interface", label: "Interface", description: "Maquettes, UI, UX, design produit" },
  { value: "presentation", label: "Présentation", description: "Slides, pitch, storytelling" },
  { value: "recherche", label: "Recherche", description: "Analyser, enquêter, résumer" },
  { value: "planification", label: "Planification", description: "Explorer, structurer, cadrer" },
  { value: "agent", label: "Agent", description: "Persona, assistant sur-mesure" },
  { value: "image", label: "Image", description: "Visuels, illustrations, graphismes" },
  { value: "video", label: "Vidéo", description: "Clips, animations, scènes" },
  { value: "code", label: "Code", description: "Développement, débogage, refactoring" },
  { value: "automatisation", label: "Automatisation", description: "Zapier, n8n, Make, workflows" },
] as const;

export type TypePromptValue = (typeof TYPES_PROMPT)[number]["value"];

export function labelTypePrompt(value: string) {
  return TYPES_PROMPT.find((item) => item.value === value)?.label ?? "Standard";
}


export const TONS = [
  { value: "professionnel", label: "Professionnel" },
  { value: "creatif", label: "Créatif" },
  { value: "technique", label: "Technique" },
  { value: "pedagogique", label: "Pédagogique" },
] as const;

export type TonValue = (typeof TONS)[number]["value"];

export type MarioResult = {
  titre_prompt: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  prompt: string;
  note: string;
  etapes_lancement: string[];
  alerte_pii: boolean;
};

export type PromptRow = {
  id: string;
  titre: string;
  metier: string;
  type_prompt?: string;

  mots_cles: string[];
  complexite: string;
  prompt: string;
  note?: string;
  etapes_lancement: string[];
  alerte_pii: boolean;
  favori: boolean;
  date_ajout: string;
};

export function formatDateFr(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
