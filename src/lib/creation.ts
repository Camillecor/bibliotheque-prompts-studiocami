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
        forme({
          x: 700,
          y: 860,
          l: 300,
          h: 300,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 150,
        }),
        forme({ x: 84, y: 84, l: 212, h: 56, couleur: "#ff6b35", arrondi: 28 }),
        texte({
          texte: "POINT DE VUE",
          x: 84,
          y: 98,
          l: 212,
          h: 30,
          taille: 20,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
        texte({
          texte: "L’IA ne remplace\npas les créatifs.",
          x: 84,
          y: 240,
          l: 912,
          h: 380,
          taille: 92,
          couleur: "#050c9c",
          interligne: 1.04,
        }),
        texte({
          texte: "Elle révèle ceux qui savent poser les bonnes questions.",
          x: 84,
          y: 660,
          l: 780,
          h: 180,
          taille: 42,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#62636f",
          interligne: 1.3,
        }),
        forme({ x: 84, y: 1206, l: 912, h: 2, couleur: "#050c9c" }),
        texte({
          texte: "STUDIO CAMI IA  ·  DESIGN & STRATÉGIE",
          x: 84,
          y: 1242,
          l: 912,
          h: 48,
          taille: 19,
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
          x: 690,
          y: -120,
          l: 520,
          h: 520,
          couleur: "#3abef9",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 145 },
          arrondi: 260,
        }),
        forme({
          x: 878,
          y: 96,
          l: 260,
          h: 260,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 130,
        }),
        texte({
          texte: "GUIDE PRATIQUE  ·  01/06",
          x: 84,
          y: 96,
          l: 620,
          h: 44,
          taille: 23,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "5 prompts IA\nqui font gagner\n1 heure par jour",
          x: 84,
          y: 400,
          l: 900,
          h: 440,
          taille: 112,
          couleur: "#ffffff",
          interligne: 1.02,
        }),
        texte({
          texte: "Des méthodes simples, testées et prêtes à copier.",
          x: 84,
          y: 900,
          l: 760,
          h: 160,
          taille: 40,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#c9d4ff",
          interligne: 1.3,
        }),
        forme({ x: 84, y: 1160, l: 430, h: 74, couleur: "#ff6b35", arrondi: 37 }),
        texte({
          texte: "SWIPE  →",
          x: 84,
          y: 1182,
          l: 430,
          h: 34,
          taille: 24,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "checklist-design",
    label: "Checklist design",
    categorie: "LinkedIn",
    description: "Quatre points numérotés",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#ffffff" },
      calques: [
        texte({
          texte: "CONSEILS D’EXPERT",
          x: 84,
          y: 90,
          l: 620,
          h: 40,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "4 réflexes pour\nun visuel qui tient.",
          x: 84,
          y: 158,
          l: 912,
          h: 250,
          taille: 88,
          couleur: "#050c9c",
          interligne: 1.04,
        }),
        ...[
          "Une seule idée par visuel.",
          "Un contraste franc, pas timide.",
          "Une typo, deux graisses maximum.",
          "Un appel à l’action évident.",
        ].flatMap((item, i) => {
          const y = 440 + i * 190;
          return [
            forme({
              x: 84,
              y,
              l: 912,
              h: 170,
              couleur: "#f1f1f6",
              arrondi: 24,
            }),
            texte({
              texte: `0${i + 1}`,
              x: 124,
              y: y + 52,
              l: 100,
              h: 70,
              taille: 38,
              couleur: "#ff6b35",
            }),
            texte({
              texte: item,
              x: 236,
              y: y + 48,
              l: 720,
              h: 96,
              taille: 38,
              graisse: 600,
              police: "Instrument Sans",
              couleur: "#050c9c",
              interligne: 1.2,
            }),
          ];
        }),
        forme({ x: 84, y: 1214, l: 460, h: 76, couleur: "#050c9c", arrondi: 38 }),
        texte({
          texte: "ENREGISTRE CETTE LISTE",
          x: 84,
          y: 1237,
          l: 460,
          h: 34,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "stat-ia",
    label: "Chiffre clé IA",
    categorie: "LinkedIn",
    description: "Une statistique qui frappe",
    format: "1:1",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#3abef9", vers: "#050c9c", angle: 160 },
      calques: [
        forme({
          x: 760,
          y: 700,
          l: 320,
          h: 320,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 160,
          opacite: 0.9,
        }),
        texte({
          texte: "SIGNAL FAIBLE  ·  2026",
          x: 84,
          y: 90,
          l: 700,
          h: 44,
          taille: 24,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          interlettre: 1,
        }),
        texte({
          texte: "68 %",
          x: 84,
          y: 230,
          l: 912,
          h: 340,
          taille: 240,
          couleur: "#ffffff",
          interligne: 1,
        }),
        texte({
          texte: "des équipes créatives utilisent\ndéjà l’IA chaque semaine.",
          x: 84,
          y: 610,
          l: 780,
          h: 200,
          taille: 50,
          graisse: 600,
          police: "Instrument Sans",
          couleur: "#ffffff",
          interligne: 1.25,
        }),
        forme({ x: 84, y: 906, l: 912, h: 2, couleur: "#ffffff", opacite: 0.4 }),
        texte({
          texte: "STUDIO CAMI IA",
          x: 84,
          y: 940,
          l: 600,
          h: 44,
          taille: 20,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "prompt-card",
    label: "Prompt à garder",
    categorie: "Instagram",
    description: "Carte prompt premium",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#090a18", vers: "#050c9c", angle: 150 },
      calques: [
        forme({
          x: 800,
          y: -110,
          l: 420,
          h: 420,
          couleur: "#3abef9",
          degrade: { de: "#8ce7ff", vers: "#3abef9", angle: 140 },
          arrondi: 210,
          opacite: 0.75,
        }),
        forme({
          x: -130,
          y: 1010,
          l: 400,
          h: 400,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 200,
          opacite: 0.8,
        }),
        texte({
          texte: "PROMPT DESIGN  ·  À COPIER",
          x: 84,
          y: 96,
          l: 700,
          h: 44,
          taille: 24,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "Le prompt\nqui clarifie\ntout.",
          x: 84,
          y: 200,
          l: 880,
          h: 400,
          taille: 104,
          couleur: "#ffffff",
          interligne: 1.02,
        }),
        forme({
          x: 84,
          y: 640,
          l: 912,
          h: 420,
          couleur: "#ffffff",
          arrondi: 32,
          opacite: 0.1,
        }),
        texte({
          texte:
            "RÔLE + OBJECTIF + CONTRAINTES + FORMAT.\n\nDécris qui parle, ce que tu veux obtenir,\nce qui est interdit, et la forme attendue.",
          x: 132,
          y: 692,
          l: 816,
          h: 320,
          taille: 31,
          graisse: 500,
          police: "JetBrains Mono",
          couleur: "#ffffff",
          interligne: 1.5,
        }),
        texte({
          texte: "ENREGISTRE CE POST  ↗",
          x: 84,
          y: 1130,
          l: 700,
          h: 48,
          taille: 26,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "STUDIO CAMI IA  ·  DESIGN & STRATÉGIE",
          x: 84,
          y: 1242,
          l: 912,
          h: 44,
          taille: 19,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#8f9bd8",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "design-tendance",
    label: "Design sans bruit",
    categorie: "Instagram",
    description: "Affiche éditoriale claire",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#f7f4ee" },
      calques: [
        forme({
          x: 700,
          y: -150,
          l: 520,
          h: 520,
          couleur: "#050c9c",
          degrade: { de: "#3abef9", vers: "#050c9c", angle: 145 },
          arrondi: 260,
        }),
        forme({
          x: 780,
          y: 930,
          l: 360,
          h: 360,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 180,
        }),
        texte({
          texte: "DIRECTION CRÉATIVE",
          x: 84,
          y: 96,
          l: 600,
          h: 44,
          taille: 23,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#050c9c",
          interlettre: 1,
        }),
        texte({
          texte: "Le bon design\nne crie pas.\nIl oriente.",
          x: 84,
          y: 380,
          l: 880,
          h: 460,
          taille: 116,
          couleur: "#050c9c",
          interligne: 1.0,
        }),
        texte({
          texte: "Moins d’effets, plus d’intention : c’est ce qui retient l’œil.",
          x: 84,
          y: 900,
          l: 660,
          h: 180,
          taille: 36,
          graisse: 500,
          police: "Instrument Sans",
          couleur: "#62636f",
          interligne: 1.35,
        }),
        forme({ x: 84, y: 1180, l: 520, h: 74, couleur: "#050c9c", arrondi: 37 }),
        texte({
          texte: "STUDIO CAMI IA  ·  À PARTAGER",
          x: 84,
          y: 1202,
          l: 520,
          h: 34,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ffffff",
          align: "center",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "avant-apres",
    label: "Avant / Après IA",
    categorie: "Instagram",
    description: "Comparaison en deux volets",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "couleur", couleur: "#090a18" },
      calques: [
        texte({
          texte: "AVANT  /  APRÈS",
          x: 84,
          y: 90,
          l: 600,
          h: 44,
          taille: 24,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "Le même message,\ndeux exécutions.",
          x: 84,
          y: 170,
          l: 880,
          h: 250,
          taille: 78,
          couleur: "#ffffff",
          interligne: 1.05,
        }),
        forme({
          x: 84,
          y: 470,
          l: 444,
          h: 560,
          couleur: "#ffffff",
          arrondi: 28,
          opacite: 0.08,
        }),
        texte({
          texte: "AVANT",
          x: 124,
          y: 510,
          l: 360,
          h: 40,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "Joli.\nMais sans angle.",
          x: 124,
          y: 580,
          l: 364,
          h: 400,
          taille: 46,
          couleur: "#ffffff",
          interligne: 1.15,
        }),
        forme({
          x: 552,
          y: 470,
          l: 444,
          h: 560,
          couleur: "#050c9c",
          arrondi: 28,
          contour: "#3abef9",
          epaisseurContour: 2,
        }),
        texte({
          texte: "APRÈS",
          x: 592,
          y: 510,
          l: 360,
          h: 40,
          taille: 22,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "Clair.\nUtile.\nMémorable.",
          x: 592,
          y: 580,
          l: 364,
          h: 400,
          taille: 46,
          couleur: "#ffffff",
          interligne: 1.15,
        }),
        texte({
          texte: "CLARTÉ  →  CONTRASTE  →  ACTION",
          x: 84,
          y: 1100,
          l: 912,
          h: 48,
          taille: 26,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "STUDIO CAMI IA",
          x: 84,
          y: 1242,
          l: 912,
          h: 44,
          taille: 19,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#8f9bd8",
          interlettre: 1,
        }),
      ],
    }),
  },
  {
    value: "regles-visuelles",
    label: "3 règles visuelles",
    categorie: "Instagram",
    description: "Trois règles numérotées",
    format: "4:5",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#080914", vers: "#050c9c", angle: 160 },
      calques: [
        forme({
          x: 820,
          y: -120,
          l: 400,
          h: 400,
          couleur: "#3abef9",
          degrade: { de: "#8ce7ff", vers: "#3abef9", angle: 140 },
          arrondi: 200,
          opacite: 0.7,
        }),
        texte({
          texte: "MÉTHODE  ·  3 RÈGLES",
          x: 84,
          y: 96,
          l: 620,
          h: 44,
          taille: 24,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "Trois règles\nqui changent tout.",
          x: 84,
          y: 190,
          l: 880,
          h: 260,
          taille: 91,
          couleur: "#ffffff",
          interligne: 1.05,
        }),
        ...[
          "Une hiérarchie évidente dès la première seconde.",
          "Un contraste franc entre fond et message.",
          "Une respiration : la marge fait partie du design.",
        ].flatMap((regle, i) => {
          const y = 520 + i * 230;
          return [
            forme({
              x: 84,
              y,
              l: 100,
              h: 100,
              couleur: "#ffffff",
              arrondi: 50,
              opacite: 0.08,
              contour: "#3abef9",
              epaisseurContour: 2,
            }),
            texte({
              texte: `0${i + 1}`,
              x: 84,
              y: y + 30,
              l: 100,
              h: 48,
              taille: 30,
              couleur: "#3abef9",
              align: "center",
            }),
            texte({
              texte: regle,
              x: 232,
              y: y + 12,
              l: 740,
              h: 170,
              taille: 32,
              graisse: 500,
              police: "Instrument Sans",
              couleur: "#ffffff",
              interligne: 1.35,
            }),
          ];
        }),
        texte({
          texte: "ENREGISTRE POUR PLUS TARD  ↗",
          x: 84,
          y: 1230,
          l: 912,
          h: 48,
          taille: 26,
          graisse: 700,
          police: "Instrument Sans",
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
    description: "Story verticale 9:16",
    format: "9:16",
    construire: () => ({
      v: 1,
      fond: { type: "degrade", de: "#080914", vers: "#050c9c", angle: 165 },
      calques: [
        forme({
          x: 760,
          y: -110,
          l: 460,
          h: 460,
          couleur: "#3abef9",
          degrade: { de: "#8ce7ff", vers: "#3abef9", angle: 140 },
          arrondi: 230,
          opacite: 0.7,
        }),
        forme({
          x: -140,
          y: 1500,
          l: 420,
          h: 420,
          couleur: "#ff6b35",
          degrade: { de: "#ff9a5f", vers: "#ff6b35", angle: 135 },
          arrondi: 210,
          opacite: 0.8,
        }),
        texte({
          texte: "À TESTER CETTE SEMAINE",
          x: 84,
          y: 210,
          l: 760,
          h: 56,
          taille: 28,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#3abef9",
          interlettre: 1,
        }),
        texte({
          texte: "3 outils IA\nque j’utilise\nchaque jour.",
          x: 84,
          y: 330,
          l: 900,
          h: 520,
          taille: 124,
          couleur: "#ffffff",
          interligne: 1.02,
        }),
        ...["Claude · écriture", "Figma AI · maquettes", "Descript · montage"].flatMap(
          (outil, i) => {
            const y = 950 + i * 220;
            return [
              forme({
                x: 84,
                y,
                l: 912,
                h: 190,
                couleur: "#ffffff",
                arrondi: 28,
                opacite: 0.08,
              }),
              texte({
                texte: outil,
                x: 136,
                y: y + 58,
                l: 800,
                h: 90,
                taille: 40,
                graisse: 600,
                police: "Instrument Sans",
                couleur: "#ffffff",
                interligne: 1.2,
              }),
            ];
          },
        ),
        texte({
          texte: "SWIPE UP  ↗",
          x: 84,
          y: 1700,
          l: 912,
          h: 56,
          taille: 30,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#ff6b35",
          interlettre: 1,
        }),
        texte({
          texte: "STUDIO CAMI IA",
          x: 84,
          y: 1810,
          l: 912,
          h: 48,
          taille: 20,
          graisse: 700,
          police: "Instrument Sans",
          couleur: "#8f9bd8",
          interlettre: 1,
        }),
      ],
    }),
  },
];
