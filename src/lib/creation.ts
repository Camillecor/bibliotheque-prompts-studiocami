// Modèle partagé de l'atelier « Création » du Studio : documents de visuels.
// Importable côté client comme côté serveur : aucune dépendance serveur ici.

export const FORMATS_CREATION = [
  { value: "1:1", label: "Carré 1:1", largeur: 1080, hauteur: 1080 },
  { value: "4:5", label: "Portrait 4:5", largeur: 1080, hauteur: 1350 },
  { value: "9:16", label: "Story 9:16", largeur: 1080, hauteur: 1920 },
  { value: "16:9", label: "Paysage 16:9", largeur: 1920, hauteur: 1080 },
  { value: "linkedin", label: "Bannière LinkedIn", largeur: 1584, hauteur: 396 },
] as const;

export type FormatCreationValue = (typeof FORMATS_CREATION)[number]["value"];

export function formatCreation(value: string) {
  return FORMATS_CREATION.find((f) => f.value === value) ?? FORMATS_CREATION[0];
}

export const POLICES = [
  "Instrument Sans",
  "Figtree",
  "Bricolage Grotesque",
  "JetBrains Mono",
  "Anton",
  "Archivo Black",
  "Bebas Neue",
  "Caveat",
  "DM Serif Display",
  "Lora",
  "Montserrat",
  "Oswald",
  "Pacifico",
  "Playfair Display",
  "Poppins",
  "Raleway",
  "Space Grotesk",
] as const;

export const COULEURS_MARQUE = [
  { nom: "Navy", valeur: "#050c9c" },
  { nom: "Coral", valeur: "#ff6b35" },
  { nom: "Info", valeur: "#3abef9" },
  { nom: "Encre", valeur: "#12131a" },
  { nom: "Gris", valeur: "#62636f" },
  { nom: "Crème", valeur: "#f7f4ee" },
  { nom: "Blanc", valeur: "#ffffff" },
  { nom: "Noir", valeur: "#000000" },
];

/* ------------------------------------------------------------------- calques */

export type Fond =
  | { type: "couleur"; couleur: string }
  | { type: "degrade"; de: string; vers: string; angle: number }
  | { type: "image"; url: string; voile: number; voileCouleur: string };

type Base = {
  id: string;
  x: number;
  y: number;
  l: number;
  h: number;
  rotation: number;
  opacite: number;
  verrouille: boolean;
};

export type CalqueTexte = Base & {
  type: "texte";
  texte: string;
  police: string;
  taille: number;
  graisse: number;
  italique: boolean;
  souligne: boolean;
  couleur: string;
  align: "left" | "center" | "right";
  interligne: number;
  interlettre: number;
  ombre: boolean;
  fondTexte: string | null;
};

export type CalqueImage = Base & {
  type: "image";
  url: string;
  arrondi: number;
  retourne: boolean;
  ajustement: "cover" | "contain";
};

export type CalqueForme = Base & {
  type: "forme";
  forme: "rect" | "cercle" | "trait";
  couleur: string;
  contour: string | null;
  epaisseurContour: number;
  arrondi: number;
};

export type Calque = CalqueTexte | CalqueImage | CalqueForme;

export type DocumentCreation = {
  v: 1;
  fond: Fond;
  calques: Calque[];
};

export type CreationRow = {
  id: string;
  nom: string;
  format: string;
  largeur: number;
  hauteur: number;
  apercu: string;
  created_at: string;
  updated_at: string;
};

export type CreationComplete = CreationRow & { document: DocumentCreation };

export function nouvelId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function documentVide(): DocumentCreation {
  return { v: 1, fond: { type: "couleur", couleur: "#f7f4ee" }, calques: [] };
}

/* ------------------------------------------------------------------ modèles */

function texte(partiel: Partial<CalqueTexte> & { texte: string }): CalqueTexte {
  return {
    id: nouvelId(),
    type: "texte",
    x: 90,
    y: 90,
    l: 900,
    h: 240,
    rotation: 0,
    opacite: 1,
    verrouille: false,
    police: "Bricolage Grotesque",
    taille: 84,
    graisse: 800,
    italique: false,
    souligne: false,
    couleur: "#050c9c",
    align: "left",
    interligne: 1.15,
    interlettre: -1,
    ombre: false,
    fondTexte: null,
    ...partiel,
  };
}

function forme(partiel: Partial<CalqueForme>): CalqueForme {
  return {
    id: nouvelId(),
    type: "forme",
    forme: "rect",
    x: 0,
    y: 0,
    l: 300,
    h: 300,
    rotation: 0,
    opacite: 1,
    verrouille: false,
    couleur: "#ff6b35",
    contour: null,
    epaisseurContour: 0,
    arrondi: 0,
    ...partiel,
  };
}

export type ModeleCreation = {
  value: string;
  label: string;
  format: FormatCreationValue;
  construire: () => DocumentCreation;
};

export const MODELES: ModeleCreation[] = [
  {
    value: "vierge",
    label: "Page blanche",
    format: "1:1",
    construire: () => documentVide(),
  },
  {
    value: "citation",
    label: "Post citation",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#050c9c" },
      calques: [
        forme({ x: 90, y: 200, l: 120, h: 10, couleur: "#ff6b35", arrondi: 8 }),
        texte({
          texte: "« Une idée claire vaut mieux\nqu'un long discours. »",
          x: 90,
          y: 280,
          l: 900,
          h: 420,
          taille: 78,
          couleur: "#ffffff",
        }),
        texte({
          texte: "Studio Cami IA",
          x: 90,
          y: 880,
          l: 600,
          h: 80,
          taille: 34,
          graisse: 600,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 2,
        }),
      ],
    }),
  },
  {
    value: "annonce",
    label: "Annonce",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#050c9c", vers: "#3abef9", angle: 135 },
      calques: [
        texte({
          texte: "NOUVEAU",
          x: 90,
          y: 140,
          l: 500,
          h: 80,
          taille: 34,
          graisse: 800,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 6,
        }),
        texte({
          texte: "Un atelier pour créer\ntes visuels en 10 minutes",
          x: 90,
          y: 250,
          l: 900,
          h: 400,
          taille: 86,
          couleur: "#ffffff",
        }),
        forme({
          x: 90,
          y: 720,
          l: 460,
          h: 110,
          couleur: "#ff6b35",
          arrondi: 55,
        }),
        texte({
          texte: "Je découvre",
          x: 90,
          y: 748,
          l: 460,
          h: 60,
          taille: 38,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
        }),
      ],
    }),
  },
  {
    value: "carrousel1",
    label: "Carrousel — page 1",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#f7f4ee" },
      calques: [
        texte({
          texte: "3 astuces\npour gagner\ndu temps",
          x: 90,
          y: 200,
          l: 880,
          h: 560,
          taille: 110,
        }),
        forme({ x: 90, y: 820, l: 200, h: 12, couleur: "#ff6b35", arrondi: 8 }),
        texte({
          texte: "Fais glisser →",
          x: 90,
          y: 1180,
          l: 600,
          h: 70,
          taille: 34,
          graisse: 600,
          police: "Instrument Sans",
          couleur: "#62636f",
        }),
      ],
    }),
  },
  {
    value: "carrousel2",
    label: "Carrousel — page 2",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#ffffff" },
      calques: [
        texte({
          texte: "01",
          x: 90,
          y: 140,
          l: 300,
          h: 160,
          taille: 120,
          couleur: "#ff6b35",
        }),
        texte({
          texte: "Prépare tes visuels\nen série",
          x: 90,
          y: 320,
          l: 880,
          h: 300,
          taille: 72,
        }),
        texte({
          texte: "Un modèle, trois variantes, et ta semaine de publications est prête.",
          x: 90,
          y: 650,
          l: 880,
          h: 260,
          taille: 40,
          graisse: 400,
          police: "Instrument Sans",
          couleur: "#62636f",
          interligne: 1.4,
          interlettre: 0,
        }),
      ],
    }),
  },
  {
    value: "story",
    label: "Story texte",
    format: "9:16",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#12131a" },
      calques: [
        texte({
          texte: "Ton idée\ndu jour",
          x: 100,
          y: 620,
          l: 880,
          h: 400,
          taille: 120,
          couleur: "#ffffff",
        }),
        forme({ x: 100, y: 1080, l: 240, h: 12, couleur: "#ff6b35", arrondi: 8 }),
        texte({
          texte: "@studiocami",
          x: 100,
          y: 1700,
          l: 600,
          h: 70,
          taille: 36,
          graisse: 600,
          police: "Instrument Sans",
          couleur: "#3abef9",
        }),
      ],
    }),
  },
  {
    value: "avant-apres",
    label: "Avant / Après",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#f7f4ee" },
      calques: [
        forme({ x: 60, y: 260, l: 440, h: 560, couleur: "#e7e3da", arrondi: 32 }),
        forme({ x: 580, y: 260, l: 440, h: 560, couleur: "#050c9c", arrondi: 32 }),
        texte({
          texte: "AVANT",
          x: 60,
          y: 180,
          l: 440,
          h: 70,
          taille: 40,
          police: "Instrument Sans",
          couleur: "#62636f",
          align: "center",
          interlettre: 4,
        }),
        texte({
          texte: "APRÈS",
          x: 580,
          y: 180,
          l: 440,
          h: 70,
          taille: 40,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          align: "center",
          interlettre: 4,
        }),
      ],
    }),
  },
];
