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
  { value: "claude-haiku-4-5", label: "Haiku 4.5", note: "Rapide, léger" },
  { value: "claude-sonnet-5", label: "Sonnet 5", note: "Équilibré" },
  { value: "claude-opus-5", label: "Opus 5", note: "Le plus créatif" },
] as const;

export type ModeleValue = (typeof MODELES)[number]["value"];

export type MarioResult = {
  titre_prompt: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  version_1: { prompt: string; note: string };
  version_2: { prompt: string; amelioration: string };
  etapes_lancement: string[];
  alerte_pii: boolean;
};

export type PromptRow = {
  id: string;
  titre: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  version_1: { prompt?: string; note?: string };
  version_2: { prompt?: string; amelioration?: string };
  etapes_lancement: string[];
  alerte_pii: boolean;
  date_ajout: string;
};

export function formatDateFr(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
