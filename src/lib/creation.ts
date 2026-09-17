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
  categorie: "Essentiels" | "LinkedIn" | "Instagram";
  description: string;
  format: FormatCreationValue;
  construire: () => DocumentCreation;
};

export const MODELES: ModeleCreation[] = [
  {
    value: "vierge",
    label: "Page blanche",
    categorie: "Essentiels",
    description: "Pars d'une toile vierge",
    format: "1:1",
    construire: () => documentVide(),
  },
  {
    value: "opinion-ia",
    label: "Opinion IA",
    categorie: "LinkedIn",
    description: "Une prise de position forte",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#f7f4ee" },
      calques: [
        forme({ x: 72, y: 72, l: 168, h: 48, couleur: "#ff6b35", arrondi: 24 }),
        texte({
          texte: "POINT DE VUE",
          x: 72,
          y: 82,
          l: 168,
          h: 28,
          taille: 20,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
        texte({
          texte: "L’IA ne remplace\npas les créatifs.",
          x: 72,
          y: 210,
          l: 920,
          h: 320,
          taille: 92,
          couleur: "#050c9c",
          interligne: 1.02,
        }),
        texte({
          texte: "Elle révèle ceux qui savent poser les bonnes questions.",
          x: 72,
          y: 570,
          l: 820,
          h: 160,
          taille: 42,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#62636f",
          interligne: 1.25,
        }),
        forme({ x: 72, y: 1120, l: 936, h: 2, couleur: "#050c9c" }),
        texte({
          texte: "STUDIO CAMI IA  ·  DESIGN & STRATÉGIE",
          x: 72,
          y: 1160,
          l: 936,
          h: 52,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#050c9c",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "carrousel-ia",
    label: "Guide IA",
    categorie: "LinkedIn",
    description: "Couverture de carrousel",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#050c9c" },
      calques: [
        forme({ x: 720, y: -90, l: 430, h: 430, couleur: "#3abef9", arrondi: 215 }),
        forme({ x: 850, y: 70, l: 270, h: 270, couleur: "#ff6b35", arrondi: 135 }),
        texte({
          texte: "GUIDE PRATIQUE  ·  01/06",
          x: 72,
          y: 76,
          l: 600,
          h: 48,
          taille: 23,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "5 prompts IA\nqui font gagner\n1 heure par jour",
          x: 72,
          y: 350,
          l: 910,
          h: 500,
          taille: 94,
          couleur: "#ffffff",
          interligne: 1.02,
        }),
        texte({
          texte: "Des méthodes simples, testées et prêtes à copier.",
          x: 72,
          y: 910,
          l: 760,
          h: 130,
          taille: 34,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#f7f4ee",
          interligne: 1.3,
        }),
        forme({ x: 72, y: 1180, l: 132, h: 10, couleur: "#ff6b35", arrondi: 5 }),
      ],
    }),
  },
  {
    value: "checklist-design",
    label: "Checklist design",
    categorie: "LinkedIn",
    description: "Conseils clairs et mémorisables",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#ffffff" },
      calques: [
        texte({
          texte: "Une interface réussie\nen 4 décisions",
          x: 72,
          y: 82,
          l: 900,
          h: 220,
          taille: 74,
          interligne: 1.05,
        }),
        forme({ x: 72, y: 340, l: 936, h: 148, couleur: "#f1f1f6", arrondi: 24 }),
        forme({ x: 72, y: 514, l: 936, h: 148, couleur: "#f1f1f6", arrondi: 24 }),
        forme({ x: 72, y: 688, l: 936, h: 148, couleur: "#f1f1f6", arrondi: 24 }),
        forme({ x: 72, y: 862, l: 936, h: 148, couleur: "#f1f1f6", arrondi: 24 }),
        texte({
          texte: "01  Une intention lisible",
          x: 110,
          y: 382,
          l: 820,
          h: 70,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "02  Une hiérarchie évidente",
          x: 110,
          y: 556,
          l: 820,
          h: 70,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "03  Une action principale",
          x: 110,
          y: 730,
          l: 820,
          h: 70,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "04  Du calme autour du contenu",
          x: 110,
          y: 904,
          l: 820,
          h: 70,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "À enregistrer pour ton prochain projet  →",
          x: 72,
          y: 1190,
          l: 850,
          h: 52,
          taille: 25,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
        }),
      ],
    }),
  },
  {
    value: "stat-ia",
    label: "Chiffre clé IA",
    categorie: "LinkedIn",
    description: "Un chiffre, une idée",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#3abef9" },
      calques: [
        texte({
          texte: "SIGNAL FAIBLE",
          x: 72,
          y: 72,
          l: 400,
          h: 52,
          taille: 24,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#050c9c",
          interlettre: 1,
        }),
        texte({
          texte: "73%",
          x: 62,
          y: 205,
          l: 850,
          h: 300,
          taille: 240,
          police: "Archivo Black",
          couleur: "#050c9c",
        }),
        texte({
          texte: "des bonnes idées commencent\npar une meilleure question.",
          x: 72,
          y: 540,
          l: 880,
          h: 180,
          taille: 52,
          interligne: 1.12,
        }),
        forme({ x: 72, y: 860, l: 936, h: 2, couleur: "#050c9c" }),
        texte({
          texte: "OBSERVATION  ·  STUDIO CAMI IA",
          x: 72,
          y: 910,
          l: 700,
          h: 48,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#050c9c",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "prompt-card",
    label: "Prompt à garder",
    categorie: "Instagram",
    description: "Une ressource à enregistrer",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#f7f4ee" },
      calques: [
        forme({
          x: 62,
          y: 62,
          l: 956,
          h: 956,
          couleur: "#f7f4ee",
          contour: "#050c9c",
          epaisseurContour: 3,
          arrondi: 28,
        }),
        texte({
          texte: "PROMPT DESIGN",
          x: 100,
          y: 110,
          l: 600,
          h: 48,
          taille: 23,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "Transforme une idée\nfloue en concept\nvisuel précis.",
          x: 100,
          y: 240,
          l: 850,
          h: 400,
          taille: 76,
          couleur: "#050c9c",
          interligne: 1.06,
        }),
        forme({ x: 100, y: 740, l: 820, h: 120, couleur: "#050c9c", arrondi: 20 }),
        texte({
          texte: "Rôle + Objectif + Contexte + Format",
          x: 130,
          y: 778,
          l: 760,
          h: 52,
          taille: 27,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
        }),
      ],
    }),
  },
  {
    value: "design-tendance",
    label: "Tendance design",
    categorie: "Instagram",
    description: "Un visuel graphique premium",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#050c9c" },
      calques: [
        forme({ x: 650, y: -150, l: 560, h: 560, couleur: "#ff6b35", arrondi: 280 }),
        forme({ x: 790, y: 70, l: 320, h: 320, couleur: "#3abef9", arrondi: 160 }),
        forme({ x: 85, y: 720, l: 170, h: 170, couleur: "#ff6b35", arrondi: 85 }),
        texte({
          texte: "DESIGN\nSANS BRUIT.",
          x: 82,
          y: 250,
          l: 780,
          h: 330,
          taille: 112,
          couleur: "#ffffff",
          interligne: 0.96,
        }),
        texte({
          texte: "Une idée. Une hiérarchie. Un impact.",
          x: 82,
          y: 620,
          l: 720,
          h: 110,
          taille: 32,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#3abef9",
        }),
        texte({
          texte: "STUDIO CAMI IA",
          x: 620,
          y: 934,
          l: 380,
          h: 42,
          taille: 20,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ffffff",
          align: "right",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "avant-apres",
    label: "Avant / Après IA",
    categorie: "Instagram",
    description: "Montre une transformation",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#ffffff" },
      calques: [
        texte({
          texte: "Même idée.\nMeilleure direction.",
          x: 70,
          y: 65,
          l: 900,
          h: 180,
          taille: 66,
          interligne: 1.02,
        }),
        forme({ x: 70, y: 300, l: 440, h: 570, couleur: "#f1f1f6", arrondi: 24 }),
        forme({ x: 570, y: 300, l: 440, h: 570, couleur: "#050c9c", arrondi: 24 }),
        texte({
          texte: "AVANT",
          x: 105,
          y: 345,
          l: 370,
          h: 52,
          taille: 24,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#62636f",
          interlettre: 1,
        }),
        texte({
          texte: "Une image\njolie mais\nsans message",
          x: 105,
          y: 500,
          l: 340,
          h: 230,
          taille: 48,
          couleur: "#62636f",
          interligne: 1.08,
        }),
        texte({
          texte: "APRÈS",
          x: 605,
          y: 345,
          l: 370,
          h: 52,
          taille: 24,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "Un angle\nclair qui fait\nréagir",
          x: 605,
          y: 500,
          l: 340,
          h: 230,
          taille: 48,
          couleur: "#ffffff",
          interligne: 1.08,
        }),
        texte({
          texte: "CLARTÉ  →  CONTRASTE  →  CONVERSION",
          x: 70,
          y: 958,
          l: 940,
          h: 48,
          taille: 22,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "story-outils",
    label: "Top outils IA",
    categorie: "Instagram",
    description: "Story verticale dynamique",
    format: "9:16",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#12131a" },
      calques: [
        texte({
          texte: "À TESTER CETTE SEMAINE",
          x: 90,
          y: 130,
          l: 820,
          h: 60,
          taille: 28,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "3 outils IA\npour créer\nplus juste.",
          x: 90,
          y: 360,
          l: 850,
          h: 500,
          taille: 118,
          couleur: "#ffffff",
          interligne: 0.98,
        }),
        forme({ x: 90, y: 1040, l: 900, h: 160, couleur: "#050c9c", arrondi: 30 }),
        forme({ x: 90, y: 1230, l: 900, h: 160, couleur: "#050c9c", arrondi: 30 }),
        forme({ x: 90, y: 1420, l: 900, h: 160, couleur: "#050c9c", arrondi: 30 }),
        texte({
          texte: "01  RECHERCHER",
          x: 135,
          y: 1090,
          l: 800,
          h: 60,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "02  STRUCTURER",
          x: 135,
          y: 1280,
          l: 800,
          h: 60,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "03  PRODUIRE",
          x: 135,
          y: 1470,
          l: 800,
          h: 60,
          taille: 34,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "@STUDIOCAMIIA",
          x: 90,
          y: 1760,
          l: 800,
          h: 50,
          taille: 25,
          police: "Instrument Sans",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 1,
        }),
      ],
    }),
  },
];
