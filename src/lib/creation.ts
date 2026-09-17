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
  degrade?: { de: string; vers: string; angle: number } | undefined;
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
  const { taille = 84, ...proprietes } = partiel;
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
    taille: Math.round(taille * 1.15),
    graisse: 800,
    italique: false,
    souligne: false,
    couleur: "#050c9c",
    align: "left",
    interligne: 1.15,
    interlettre: -1,
    ombre: false,
    fondTexte: null,
    ...proprietes,
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
    degrade: undefined,
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
        forme({
          x: 700,
          y: -110,
          l: 480,
          h: 480,
          couleur: "#3abef9",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 145 },
          arrondi: 240,
        }),
        forme({
          x: 842,
          y: 62,
          l: 292,
          h: 292,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 146,
        }),
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
          taille: 112,
          couleur: "#ffffff",
          interligne: 1.02,
        }),
        texte({
          texte: "Des méthodes simples, testées et prêtes à copier.",
          x: 72,
          y: 910,
          l: 760,
          h: 130,
          taille: 40,
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
          taille: 88,
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
          taille: 38,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "02  Une hiérarchie évidente",
          x: 110,
          y: 556,
          l: 820,
          h: 70,
          taille: 38,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "03  Une action principale",
          x: 110,
          y: 730,
          l: 820,
          h: 70,
          taille: 38,
          police: "Instrument Sans",
          graisse: 700,
        }),
        texte({
          texte: "04  Du calme autour du contenu",
          x: 110,
          y: 904,
          l: 820,
          h: 70,
          taille: 38,
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
          taille: 270,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#050c9c",
        }),
        texte({
          texte: "des bonnes idées commencent\npar une meilleure question.",
          x: 72,
          y: 540,
          l: 880,
          h: 180,
          taille: 60,
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
    description: "Couverture à forte valeur perçue",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#090a18", vers: "#050c9c", angle: 145 },
      calques: [
        forme({
          x: 760,
          y: -180,
          l: 520,
          h: 520,
          forme: "cercle",
          couleur: "#3abef9",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 140 },
          arrondi: 260,
          opacite: 0.86,
        }),
        forme({
          x: -180,
          y: 1020,
          l: 460,
          h: 460,
          forme: "cercle",
          couleur: "#ff6b35",
          degrade: { de: "#ffb27a", vers: "#ff6b35", angle: 135 },
          arrondi: 230,
          opacite: 0.78,
        }),
        forme({
          x: 72,
          y: 930,
          l: 936,
          h: 248,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 30,
          opacite: 0.1,
        }),
        texte({
          texte: "PROMPT DESIGN  ·  À COPIER",
          x: 76,
          y: 82,
          l: 650,
          h: 44,
          taille: 24,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 2,
        }),
        texte({
          texte: "UNE IDÉE\nFLOUE → UN\nVISUEL FORT.",
          x: 72,
          y: 300,
          l: 900,
          h: 430,
          taille: 104,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 0.98,
        }),
        texte({
          texte: "RÔLE  +  OBJECTIF  +  CONTEXTE  +  FORMAT",
          x: 120,
          y: 1000,
          l: 840,
          h: 52,
          taille: 27,
          graisse: 600,
          police: "Bricolage Grotesque",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
        texte({
          texte: "ENREGISTRE CE POST  ↗",
          x: 72,
          y: 1246,
          l: 520,
          h: 42,
          taille: 22,
          graisse: 700,
          police: "Bricolage Grotesque",
          couleur: "#ff6b35",
          interlettre: 2,
        }),
      ],
    }),
  },
  {
    value: "design-tendance",
    label: "Tendance design",
    categorie: "Instagram",
    description: "Une opinion qui arrête le scroll",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#080914", vers: "#050c9c", angle: 155 },
      calques: [
        forme({
          x: 650,
          y: -120,
          l: 610,
          h: 610,
          forme: "cercle",
          couleur: "#3abef9",
          degrade: { de: "#8ce7ff", vers: "#050c9c", angle: 145 },
          arrondi: 305,
          opacite: 0.88,
        }),
        forme({
          x: 800,
          y: 80,
          l: 330,
          h: 330,
          forme: "cercle",
          couleur: "#ff6b35",
          degrade: { de: "#ffb27a", vers: "#ff6b35", angle: 145 },
          arrondi: 165,
        }),
        forme({
          x: 72,
          y: 1010,
          l: 936,
          h: 176,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 28,
          opacite: 0.1,
        }),
        texte({
          texte: "DIRECTION CRÉATIVE  ·  01",
          x: 76,
          y: 84,
          l: 580,
          h: 44,
          taille: 23,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 2,
        }),
        texte({
          texte: "LE BON\nDESIGN NE\nCRIE PAS.",
          x: 72,
          y: 300,
          l: 920,
          h: 450,
          taille: 116,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 0.97,
        }),
        texte({
          texte: "Il rend l’idée impossible à ignorer.",
          x: 116,
          y: 1064,
          l: 850,
          h: 62,
          taille: 36,
          graisse: 500,
          police: "Bricolage Grotesque",
          couleur: "#ffffff",
        }),
        texte({
          texte: "STUDIO CAMI IA  ·  À PARTAGER",
          x: 72,
          y: 1252,
          l: 660,
          h: 38,
          taille: 21,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 2,
        }),
      ],
    }),
  },
  {
    value: "avant-apres",
    label: "Avant / Après IA",
    categorie: "Instagram",
    description: "Comparaison claire et partageable",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#090a18" },
      calques: [
        forme({
          x: 790,
          y: -130,
          l: 420,
          h: 420,
          forme: "cercle",
          couleur: "#3abef9",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 145 },
          arrondi: 210,
          opacite: 0.75,
        }),
        texte({
          texte: "MÊME IDÉE.\nMEILLEURE DIRECTION.",
          x: 72,
          y: 90,
          l: 900,
          h: 230,
          taille: 78,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 1,
        }),
        forme({
          x: 72,
          y: 390,
          l: 430,
          h: 650,
          couleur: "#ffffff",
          contour: "#62636f",
          epaisseurContour: 2,
          arrondi: 30,
          opacite: 0.08,
        }),
        forme({
          x: 578,
          y: 390,
          l: 430,
          h: 650,
          couleur: "#050c9c",
          contour: "#3abef9",
          epaisseurContour: 3,
          arrondi: 30,
        }),
        texte({
          texte: "AVANT",
          x: 112,
          y: 438,
          l: 340,
          h: 52,
          taille: 24,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
          interlettre: 2,
        }),
        texte({
          texte: "JOLI.\nMAIS SANS\nANGLE.",
          x: 112,
          y: 620,
          l: 350,
          h: 260,
          taille: 50,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 1.05,
          opacite: 0.58,
        }),
        texte({
          texte: "APRÈS",
          x: 618,
          y: 438,
          l: 340,
          h: 52,
          taille: 24,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 2,
        }),
        texte({
          texte: "CLAIR.\nUTILE.\nMÉMORABLE.",
          x: 618,
          y: 620,
          l: 350,
          h: 270,
          taille: 48,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 1.05,
        }),
        texte({
          texte: "CLARTÉ  →  CONTRASTE  →  ACTION",
          x: 72,
          y: 1190,
          l: 936,
          h: 48,
          taille: 24,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ff6b35",
          align: "center",
          interlettre: 2,
        }),
      ],
    }),
  },
  {
    value: "regles-visuelles",
    label: "3 règles visuelles",
    categorie: "Instagram",
    description: "Liste pédagogique à enregistrer",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#080914", vers: "#050c9c", angle: 150 },
      calques: [
        forme({
          x: 730,
          y: -150,
          l: 530,
          h: 530,
          forme: "cercle",
          couleur: "#3abef9",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 140 },
          arrondi: 265,
          opacite: 0.8,
        }),
        texte({
          texte: "CONSEILS D’EXPERT",
          x: 72,
          y: 82,
          l: 520,
          h: 42,
          taille: 22,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 2,
        }),
        texte({
          texte: "3 RÈGLES\nPOUR DES\nVISUELS FORTS",
          x: 72,
          y: 230,
          l: 900,
          h: 410,
          taille: 91,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 0.98,
        }),
        forme({
          x: 72,
          y: 745,
          l: 84,
          h: 84,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 22,
          opacite: 0.1,
        }),
        forme({
          x: 72,
          y: 860,
          l: 84,
          h: 84,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 22,
          opacite: 0.1,
        }),
        forme({
          x: 72,
          y: 975,
          l: 84,
          h: 84,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 22,
          opacite: 0.1,
        }),
        texte({
          texte: "01",
          x: 72,
          y: 765,
          l: 84,
          h: 42,
          taille: 29,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#3abef9",
          align: "center",
        }),
        texte({
          texte: "02",
          x: 72,
          y: 880,
          l: 84,
          h: 42,
          taille: 29,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#3abef9",
          align: "center",
        }),
        texte({
          texte: "03",
          x: 72,
          y: 995,
          l: 84,
          h: 42,
          taille: 29,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#3abef9",
          align: "center",
        }),
        texte({
          texte: "UNE HIÉRARCHIE IMMÉDIATE",
          x: 190,
          y: 766,
          l: 760,
          h: 42,
          taille: 28,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "DU CALME AUTOUR DU MESSAGE",
          x: 190,
          y: 881,
          l: 760,
          h: 42,
          taille: 28,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "UN CONTRASTE QUI GUIDE L’ŒIL",
          x: 190,
          y: 996,
          l: 760,
          h: 42,
          taille: 28,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "ENREGISTRE POUR PLUS TARD  ↗",
          x: 72,
          y: 1240,
          l: 650,
          h: 42,
          taille: 22,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 2,
        }),
      ],
    }),
  },
  {
    value: "story-outils",
    label: "Top outils IA",
    categorie: "Instagram",
    description: "Story séquencée et immersive",
    format: "9:16",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#080914", vers: "#050c9c", angle: 165 },
      calques: [
        forme({
          x: 660,
          y: -130,
          l: 620,
          h: 620,
          forme: "cercle",
          couleur: "#3abef9",
          degrade: { de: "#8ce7ff", vers: "#050c9c", angle: 145 },
          arrondi: 310,
          opacite: 0.82,
        }),
        forme({
          x: -210,
          y: 1530,
          l: 520,
          h: 520,
          forme: "cercle",
          couleur: "#ff6b35",
          degrade: { de: "#ffb27a", vers: "#ff6b35", angle: 135 },
          arrondi: 260,
          opacite: 0.75,
        }),
        texte({
          texte: "À TESTER CETTE SEMAINE",
          x: 90,
          y: 130,
          l: 820,
          h: 60,
          taille: 28,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#3abef9",
          interlettre: 2,
        }),
        texte({
          texte: "3 OUTILS IA\nPOUR CRÉER\nPLUS JUSTE.",
          x: 90,
          y: 360,
          l: 850,
          h: 500,
          taille: 124,
          police: "Bricolage Grotesque",
          graisse: 800,
          couleur: "#ffffff",
          interligne: 0.98,
        }),
        forme({
          x: 90,
          y: 1040,
          l: 900,
          h: 160,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 30,
          opacite: 0.1,
        }),
        forme({
          x: 90,
          y: 1230,
          l: 900,
          h: 160,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 30,
          opacite: 0.1,
        }),
        forme({
          x: 90,
          y: 1420,
          l: 900,
          h: 160,
          couleur: "#ffffff",
          contour: "#3abef9",
          epaisseurContour: 2,
          arrondi: 30,
          opacite: 0.1,
        }),
        texte({
          texte: "01  RECHERCHER",
          x: 135,
          y: 1090,
          l: 800,
          h: 60,
          taille: 40,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "02  STRUCTURER",
          x: 135,
          y: 1280,
          l: 800,
          h: 60,
          taille: 40,
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ffffff",
        }),
        texte({
          texte: "03  PRODUIRE",
          x: 135,
          y: 1470,
          l: 800,
          h: 60,
          taille: 40,
          police: "Bricolage Grotesque",
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
          police: "Bricolage Grotesque",
          graisse: 700,
          couleur: "#ff6b35",
          interlettre: 1,
        }),
      ],
    }),
  },
];
