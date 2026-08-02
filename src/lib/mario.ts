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
