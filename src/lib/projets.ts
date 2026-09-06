// Modèle partagé de l'onglet Projets (gestion de tâches).
// Importable côté client comme côté serveur : aucune dépendance serveur ici.

export const STATUTS_TACHE = [
  { value: "a_faire", label: "À faire" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
] as const;

export type StatutTache = (typeof STATUTS_TACHE)[number]["value"];

export const STATUT_TACHE_VALUES = STATUTS_TACHE.map((s) => s.value) as [
  StatutTache,
  ...StatutTache[],
];

export function statutTacheLabel(value: string) {
  return STATUTS_TACHE.find((s) => s.value === value)?.label ?? "À faire";
}

export const PRIORITES = [
  { value: 0, label: "Aucune", couleur: "#9aa0ae" },
  { value: 1, label: "Basse", couleur: "#3abef9" },
  { value: 2, label: "Moyenne", couleur: "#f59e0b" },
  { value: 3, label: "Haute", couleur: "#ff6b35" },
] as const;

export function prioriteInfo(valeur: number) {
  return PRIORITES.find((p) => p.value === valeur) ?? PRIORITES[0];
}

export const COULEURS_PROJET = [
  "#ff6b35",
  "#050c9c",
  "#3abef9",
  "#16a34a",
  "#a855f7",
  "#e11d48",
] as const;

export const VUES_RAPIDES = [
  { value: "aujourdhui", label: "Aujourd'hui" },
  { value: "semaine", label: "Cette semaine" },
  { value: "retard", label: "En retard" },
  { value: "termine", label: "Terminé" },
] as const;

export type VueRapide = (typeof VUES_RAPIDES)[number]["value"];

export type TacheRow = {
  id: string;
  projet_id: string | null;
  parent_id: string | null;
  titre: string;
  note: string;
  statut: string;
  priorite: number;
  echeance: string | null;
  etiquettes: string[];
  ordre: number;
  termine_le: string | null;
  contenu_id: string | null;
  fiche_id: string | null;
  prompt_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjetRow = {
  id: string;
  nom: string;
  couleur: string;
  icone: string;
  ordre: number;
  archive: boolean;
  created_at: string;
  updated_at: string;
};

export function debutDeJour(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Statut d'échéance d'une tâche : en retard, aujourd'hui, à venir ou aucune. */
export function etatEcheance(
  echeance: string | null,
  statut: string,
): "aucune" | "retard" | "aujourdhui" | "avenir" {
  if (!echeance || statut === "termine") return "aucune";
  const date = new Date(echeance);
  const debutAujourdhui = debutDeJour();
  const debutDemain = new Date(debutAujourdhui);
  debutDemain.setDate(debutDemain.getDate() + 1);
  if (date < debutAujourdhui) return "retard";
  if (date < debutDemain) return "aujourdhui";
  return "avenir";
}

export function formatEcheance(iso: string) {
  const date = new Date(iso);
  const avecHeure = date.getHours() !== 0 || date.getMinutes() !== 0;
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    ...(avecHeure ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** Convertit une valeur d'input datetime-local en ISO, et inversement. */
export function isoDepuisInput(valeur: string): string | null {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function inputDepuisIso(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const p = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}
