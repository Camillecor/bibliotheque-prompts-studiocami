export type Notes = {
  fonctionnalites: number;
  facilite: number;
  valeur: number;
  confiance: number;
};

export const CRITERES: { key: keyof Notes; label: string }[] = [
  { key: "fonctionnalites", label: "Fonctionnalités" },
  { key: "facilite", label: "Facilité d'usage" },
  { key: "valeur", label: "Rapport qualité-prix" },
  { key: "confiance", label: "Fiabilité & confiance" },
];

// Moyenne des 4 critères, arrondie au demi-point — même logique que la note
// affichée sur les cartes et sur la fiche détail d'un outil.
export function noteGlobale(notes: Notes): number {
  const moyenne = (notes.fonctionnalites + notes.facilite + notes.valeur + notes.confiance) / 4;
  return Math.round(moyenne * 2) / 2;
}

export function formatNote(valeur: number): string {
  return Number.isInteger(valeur) ? String(valeur) : valeur.toFixed(1).replace(".", ",");
}
