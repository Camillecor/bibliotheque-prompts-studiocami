// Modèles partagés de l'onglet « Veille IA ».

export type VeilleItemRow = {
  id: string;
  titre: string;
  resume: string;
  url: string;
  source: string;
  publie_le: string | null;
  tags: string[];
  favori: boolean;
  origine: string;
  created_at: string;
};

export type VeilleSourceRow = {
  id: string;
  nom: string;
  url: string;
  actif: boolean;
  derniere_lecture: string | null;
};

export type VeilleThemeRow = {
  id: string;
  libelle: string;
  actif: boolean;
};

export type VeilleRunRow = {
  id: string;
  demarre_le: string;
  termine_le: string | null;
  statut: string;
  nb_items: number;
  message: string;
};

export const FILTRES_VEILLE = [
  { value: "tout", label: "Tout" },
  { value: "aujourdhui", label: "Aujourd'hui" },
  { value: "semaine", label: "Cette semaine" },
  { value: "favoris", label: "Mes favoris" },
] as const;

export type FiltreVeille = (typeof FILTRES_VEILLE)[number]["value"];

const COULEURS_TAG: Record<string, string> = {
  Outil: "#ff6b35",
  Modèle: "#050c9c",
  Pratique: "#3abef9",
  Marketing: "#a855f7",
  Étude: "#16a34a",
  Réglementation: "#e11d48",
};

export function couleurTag(tag: string): string {
  return COULEURS_TAG[tag] ?? "#62636f";
}

export function formatDateVeille(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatHeureVeille(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function nomDomaine(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
