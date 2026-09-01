// Modèle partagé de l'onglet Studio (contenus, médias, calendrier, statistiques).
// Ce fichier est importable côté client comme côté serveur : aucune dépendance serveur ici.

export const RESEAUX = [
  { value: "linkedin", label: "LinkedIn", limite: 3000, couleur: "#0a66c2" },
  { value: "instagram", label: "Instagram", limite: 2200, couleur: "#e1306c" },
  { value: "facebook", label: "Facebook", limite: 5000, couleur: "#1877f2" },
  { value: "x", label: "X", limite: 280, couleur: "#0f172a" },
  { value: "newsletter", label: "Newsletter", limite: 12000, couleur: "#ff6b35" },
] as const;

export type ReseauValue = (typeof RESEAUX)[number]["value"];

export const RESEAU_VALUES = RESEAUX.map((r) => r.value) as [ReseauValue, ...ReseauValue[]];

export function reseauInfo(value: string) {
  return RESEAUX.find((r) => r.value === value) ?? RESEAUX[0];
}

export const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "planifie", label: "Planifié" },
  { value: "publie", label: "Publié" },
] as const;

export type StatutValue = (typeof STATUTS)[number]["value"];

export const STATUT_VALUES = STATUTS.map((s) => s.value) as [StatutValue, ...StatutValue[]];

export function statutLabel(value: string) {
  return STATUTS.find((s) => s.value === value)?.label ?? "Brouillon";
}

export const TONS_POST = [
  { value: "professionnel", label: "Professionnel" },
  { value: "inspirant", label: "Inspirant" },
  { value: "pedagogique", label: "Pédagogique" },
  { value: "direct", label: "Direct" },
  { value: "complice", label: "Complice" },
] as const;

export type TonPostValue = (typeof TONS_POST)[number]["value"];

export const VARIANTES = [
  { value: "raccourcir", label: "Raccourcir" },
  { value: "percutant", label: "Plus percutant" },
  { value: "storytelling", label: "Plus narratif" },
] as const;

export type VarianteValue = (typeof VARIANTES)[number]["value"];

export const FORMATS_MEDIA = [
  { value: "1:1", label: "Carré 1:1", ratio: 1 },
  { value: "4:5", label: "Portrait 4:5", ratio: 4 / 5 },
  { value: "16:9", label: "Paysage 16:9", ratio: 16 / 9 },
  { value: "9:16", label: "Story 9:16", ratio: 9 / 16 },
] as const;

export type FormatMediaValue = (typeof FORMATS_MEDIA)[number]["value"];

export type ContenuRow = {
  id: string;
  titre: string;
  texte: string;
  reseau: string;
  statut: string;
  tags: string[];
  date_planifiee: string | null;
  date_publication: string | null;
  prompt_id: string | null;
  created_at: string;
  updated_at: string;
  medias: MediaRow[];
};

export type MediaRow = {
  id: string;
  chemin: string;
  titre: string;
  tags: string[];
  largeur: number;
  hauteur: number;
  origine: string;
  created_at: string;
  url: string;
};

export type StatsStudio = {
  total: number;
  brouillons: number;
  planifies: number;
  publies: number;
  medias: number;
  parSemaine: { semaine: string; publies: number; planifies: number }[];
  parReseau: { reseau: string; label: string; couleur: string; total: number }[];
  parTag: { tag: string; total: number }[];
  joursPublies: number;
  joursDuMois: number;
  prochaine: { titre: string; date: string; reseau: string } | null;
};

export function formatDateHeure(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function cleJour(date: Date) {
  const mois = `${date.getMonth() + 1}`.padStart(2, "0");
  const jour = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${mois}-${jour}`;
}
