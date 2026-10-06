// Analyse intelligente de la saisie des tâches (côté client uniquement, aucune dépendance serveur).
// Un texte libre comme « Devis Cami vendredi urgent #devis @Site vitrine »
// est découpé en titre, échéance, priorité, étiquettes et projet.

import type { ProjetRow } from "@/lib/projets";

export type SaisieAnalysee = {
  titre: string;
  echeance: string | null;
  echeanceLabel: string | null;
  priorite: number;
  etiquettes: string[];
  projetId: string | null;
  projetNom: string | null;
};

function sansAccents(texte: string) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normaliser(texte: string) {
  return sansAccents(texte.toLowerCase()).trim();
}

const JOURS_SEMAINE: Record<string, number> = {
  lundi: 1,
  lun: 1,
  mardi: 2,
  mar: 2,
  mercredi: 3,
  mer: 3,
  jeudi: 4,
  jeu: 4,
  vendredi: 5,
  ven: 5,
  samedi: 6,
  sam: 6,
  dimanche: 0,
  dim: 0,
};

const MOIS: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  septembre: 8,
  oct: 9,
  octobre: 9,
  novembre: 10,
  decembre: 11,
};

function debutDeJour(date = new Date()) {
  const copie = new Date(date);
  copie.setHours(9, 0, 0, 0);
  return copie;
}

function finDeJournee(date: Date) {
  const copie = new Date(date);
  copie.setHours(9, 0, 0, 0);
  return copie;
}

/** Prochain jour de semaine demandé, aujourd'hui inclus. */
function prochainJour(jour: number): Date {
  const date = debutDeJour();
  const ecart = (jour - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + ecart);
  return date;
}

function formatCourteDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

/** Extrait et retire les segments reconnus d'un texte libre. */
export function analyserSaisie(brut: string, projets: ProjetRow[]): SaisieAnalysee {
  let texte = ` ${brut.trim()} `;
  const echeance: { date: Date; label: string } | null = { date: new Date(NaN), label: "" };
  let echeanceFinale: { date: Date; label: string } | null = null;
  let priorite = 0;
  const etiquettes: string[] = [];
  let projetId: string | null = null;
  let projetNom: string | null = null;

  const retirer = (motif: RegExp, action: (correspondance: RegExpMatchArray) => void) => {
    texte = texte.replace(motif, (suite, ...args) => {
      const groupes = (args.slice(0, -2) as unknown[]) as RegExpMatchArray;
      action(groupes.length > 0 ? groupes : ([suite] as unknown as RegExpMatchArray));
      return " ";
    });
  };

  // Priorités
  retirer(/\b(urgentissime|urgent|asap|prioritaire)\b/gi, () => {
    priorite = Math.max(priorite, 3);
  });
  retirer(/\b(important)\b/gi, () => {
    priorite = Math.max(priorite, 2);
  });
  retirer(/\b(basse priorite|peu urgent|pas urgent|pas urgent)\b/gi, () => {
    priorite = Math.max(priorite, 1);
  });

  // Dates relatives
  retirer(/\baujourd'?hui\b/gi, (g) => {
    echeance.date = debutDeJour();
    echeance.label = "Aujourd'hui";
    void g;
  });
  retirer(/\bdemain\b/gi, () => {
    const d = debutDeJour();
    d.setDate(d.getDate() + 1);
    echeance.date = d;
    echeance.label = "Demain";
  });
  retirer(/\bapres[- ]?demain\b/gi, () => {
    const d = debutDeJour();
    d.setDate(d.getDate() + 2);
    echeance.date = d;
    echeance.label = "Après-demain";
  });
  retirer(/\bfin de mois\b/gi, () => {
    const d = debutDeJour();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1, 0);
    echeance.date = d;
    echeance.label = "Fin de mois";
  });
  retirer(/\bsemaine prochaine\b/gi, () => {
    const d = debutDeJour();
    d.setDate(d.getDate() + 7);
    echeance.date = d;
    echeance.label = "Semaine prochaine";
  });
  retirer(/\bdans\s+(\d{1,3})\s*(j|jour|jours|sem|semaine|semaines)\b/gi, (g) => {
    const n = Number(g[1]);
    const semaines = /^s/i.test(String(g[2]));
    const d = debutDeJour();
    d.setDate(d.getDate() + (semaines ? n * 7 : n));
    echeance.date = d;
    echeance.label = semaines ? `Dans ${n} semaine(s)` : `Dans ${n} jour(s)`;
  });

  // Jour de semaine (« vendredi », « mardi prochain »)
  retirer(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|lun|mar|mer|jeu|ven|sam|dim)(\s+prochain)?\b/gi, (g) => {
    const jour = JOURS_SEMAINE[normaliser(String(g[1]))];
    if (jour === undefined) return;
    echeance.date = prochainJour(jour);
    echeance.label = formatCourteDate(echeance.date);
  });

  // « 12 octobre », « 12 oct »
  retirer(/\b(\d{1,2})\s+(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|oct|octobre|novembre|decembre)\b/gi, (g) => {
    const jour = Number(g[1]);
    const mois = MOIS[normaliser(String(g[2]))];
    if (!mois === undefined || jour < 1 || jour > 31) return;
    const d = debutDeJour();
    d.setDate(jour);
    d.setMonth(mois);
    if (d < new Date()) d.setFullYear(d.getFullYear() + 1);
    echeance.date = d;
    echeance.label = formatCourteDate(d);
  });

  // « 12/10 », « 12-10-2026 »
  retirer(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/g, (g) => {
    const jour = Number(g[1]);
    const mois = Number(g[2]);
    if (jour < 1 || jour > 31 || mois < 1 || mois > 12) return;
    const d = debutDeJour();
    d.setDate(jour);
    d.setMonth(mois - 1);
    if (g[3]) {
      const annee = Number(g[3]);
      d.setFullYear(annee < 100 ? 2000 + annee : annee);
    } else if (d < new Date()) {
      d.setFullYear(d.getFullYear() + 1);
    }
    echeance.date = d;
    echeance.label = formatCourteDate(d);
  });

  if (!Number.isNaN(echeance.date.getTime())) {
    echeanceFinale = { date: finDeJournee(echeance.date), label: echeance.label };
  }

  // Étiquettes #tag
  retirer(/#([\p{L}\d_-]{1,40})/gu, (g) => {
    const tag = String(g[1]).trim();
    if (tag && etiquettes.length < 8 && !etiquettes.includes(tag)) etiquettes.push(tag);
  });

  // Projet @nom : correspond au nom d'un projet existant (sans accents, préfixe accepté)
  retirer(/@([\p{L}\d][\p{L}\d '_-]{0,39})/gu, (g) => {
    if (projetId) return;
    const saisi = normaliser(String(g[1]));
    if (!saisi) return;
    const trouve = projets.find((projet) => {
      const nom = normaliser(projet.nom);
      return nom === saisi || nom.startsWith(saisi) || saisi.startsWith(nom);
    });
    if (trouve) {
      projetId = trouve.id;
      projetNom = trouve.nom;
    }
  });

  const titre = texte.replace(/\s+/g, " ").trim();
  const echeanceIso = echeanceFinale ? echeanceFinale.date.toISOString() : null;

  return {
    titre,
    echeance: echeanceIso,
    echeanceLabel: echeanceFinale ? echeanceFinale.label : null,
    priorite,
    etiquettes,
    projetId,
    projetNom,
  };
}

/* ------------------------------------------------------------------ scoring */

export type TachePourScore = {
  statut: string;
  priorite: number;
  echeance: string | null;
  created_at: string;
};

export type EtatEcheanceScore = "aucune" | "retard" | "aujourdhui" | "avenir" | "semaine";

export function etatEcheanceScore(echeance: string | null, statut: string): EtatEcheanceScore {
  if (!echeance || statut === "termine") return "aucune";
  const date = new Date(echeance);
  const maintenant = new Date();
  const finAujourdhui = new Date(maintenant);
  finAujourdhui.setHours(23, 59, 59, 999);
  const finSemaine = new Date(finAujourdhui);
  finSemaine.setDate(finSemaine.getDate() + 6);
  if (date < new Date(maintenant).setHours(0, 0, 0, 0)) return "retard";
  if (date <= finAujourdhui) return "aujourdhui";
  if (date <= finSemaine) return "semaine";
  return "avenir";
}

/** Score de priorité : plus il est haut, plus la tâche mérite l'attention. */
export function scoreTache(tache: TachePourScore, sousFaites = 0, sousTotal = 0): number {
  if (tache.statut === "termine") return -1;
  let score = tache.priorite * 10;
  const etat = etatEcheanceScore(tache.echeance, tache.statut);
  if (etat === "retard") score += 100;
  else if (etat === "aujourdhui") score += 60;
  else if (etat === "semaine") score += 30;
  if (sousTotal > 0 && sousFaites === sousTotal) score += 8;
  const ancienneteJours = Math.floor(
    (Date.now() - new Date(tache.created_at).getTime()) / 86_400_000,
  );
  score += Math.min(10, ancienneteJours * 0.5);
  return score;
}

/** Raisons lisibles expliquant le score, de la plus forte à la plus faible. */
export function raisonsTache(tache: TachePourScore, sousFaites = 0, sousTotal = 0): string[] {
  const raisons: string[] = [];
  const etat = etatEcheanceScore(tache.echeance, tache.statut);
  if (etat === "retard") raisons.push("En retard");
  if (etat === "aujourdhui") raisons.push("Échéance aujourd'hui");
  if (etat === "semaine") raisons.push("Cette semaine");
  if (tache.priorite === 3) raisons.push("Haute priorité");
  else if (tache.priorite === 2) raisons.push("Priorité moyenne");
  if (sousTotal > 0 && sousFaites === sousTotal) raisons.push("Sous-tâches finies");
  return raisons;
}
