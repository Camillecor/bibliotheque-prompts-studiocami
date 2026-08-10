import type { ToolLogoName } from "@/components/ToolLogos";
import type { Notes } from "@/lib/toolNotes";
import { AUTRES_TOOL_DETAILS } from "@/lib/toolDetailsData";


export type Tarif = { nom: string; prix: string; inclus: string };
export type Feature = { titre: string; description: string };
export type Limite = { titre: string; description: string };
export type FAQItem = { question: string; reponse: string };
export type Workflow = { declencheur: string; resultat: string; description: string; outils: string[] };
export type PremierPas = { titre: string; description: string };

export type ToolDetail = {
  slug: string;
  nom: string;
  logo: ToolLogoName;
  tagline: string;
  tags: string[];
  notes: Notes;
  ctaLabel: string;
  ctaUrl: string;
  testeLe: string;
  essentiel: string;
  quEstCe: string[];
  quiEstDerriere: string;
  pourQui: { idealPour: string; aEviterSi: string };
  demarrage?: PremierPas[];
  fonctionnalites: Feature[];
  workflows?: Workflow[];
  limites: Limite[];
  conformite: {
    hebergement: string;
    rgpd: string;
    aiAct: string;
    entrainement: string;
    note: string;
  };
  mcp: { disponible: boolean; officiel: boolean; note: string; lien?: string };
  tarifs: Tarif[];
  verdict: string;
  faq: FAQItem[];
};

// Fiches détaillées, une par outil. Gabarit validé sur Claude — à compléter
// pour les autres entrées de src/routes/_authenticated/outils.tsx au même format.
export const TOOL_DETAILS: Record<string, ToolDetail> = {
  claude: {
    slug: "claude",
    nom: "Claude",
    logo: "Claude",
    tagline: "L'assistant d'Anthropic, à l'aise en rédaction longue, code et raisonnement.",
    tags: ["Chatbots", "IA générative"],
    notes: { fonctionnalites: 9, facilite: 8, valeur: 8, confiance: 8.5 },
    ctaLabel: "Essayer Claude →",
    ctaUrl: "https://claude.ai",
    testeLe: "9 août 2026",
    essentiel:
      "Claude est l'assistant IA d'Anthropic, décliné en trois modèles (Haiku, Sonnet, Opus) plus le modèle expérimental Fable. Il se distingue par ses réponses longues bien structurées, son niveau en code (via Claude Code, son agent en ligne de commande) et le protocole MCP qu'Anthropic a créé pour connecter l'IA à des outils externes. Version gratuite limitée, formule Pro à 20 €/mois, formules Max pour un usage intensif.",
    quEstCe: [
      "Claude est un modèle de langage conversationnel, accessible via claude.ai, une app desktop/mobile, une extension navigateur et une API. Contrairement à un chatbot généraliste centré sur la rapidité de réponse, Claude est pensé pour les tâches qui demandent de tenir un raisonnement long : analyser un document de 50 pages, refactoriser une base de code, ou tenir une conversation à enjeux sur plusieurs heures sans perdre le fil.",
      "Deux fonctionnalités structurent l'usage quotidien : les Projects, qui permettent de regrouper des documents et des instructions personnalisées autour d'un contexte de travail récurrent, et les Artifacts, qui isolent le code ou le contenu généré dans un panneau à part pour l'itérer sans polluer la conversation.",
    ],
    quiEstDerriere:
      "Claude est développé par Anthropic, fondée en 2021 par d'anciens membres d'OpenAI (dont Dario et Daniela Amodei) autour d'une mission affichée de sécurité de l'IA. L'entreprise est financée notamment par Amazon et Google, et publie ses propres recherches sur l'alignement et l'interprétabilité des modèles.",
    pourQui: {
      idealPour:
        "Rédaction longue, code (seul ou via Claude Code), analyse de documents volumineux, et tout usage pro où la qualité de raisonnement compte plus que la vitesse de réponse.",
      aEviterSi:
        "Tu cherches un usage 100 % gratuit et illimité, ou un outil pensé pour la génération d'images (Claude ne génère pas d'images nativement).",
    },
    demarrage: [
      {
        titre: "Personnalise tes instructions",
        description:
          "Dans les réglages, les instructions personnalisées donnent un contexte permanent (métier, ton, contraintes) à chaque nouvelle conversation, sans avoir à le répéter à chaque fois.",
      },
      {
        titre: "Crée un Project pour ton activité récurrente",
        description:
          "Regroupe les documents de référence et les instructions propres à un contexte de travail donné (un client, un produit, une méthodologie) dans un Project, plutôt que de tout redonner à chaque session.",
      },
      {
        titre: "Ajoute un CLAUDE.md à tes projets de code",
        description:
          "Pour Claude Code : un fichier CLAUDE.md à la racine du repo documente les conventions du projet (stack, style, contraintes) et est lu automatiquement en début de session — l'équivalent d'un onboarding pour l'agent.",
      },
      {
        titre: "Explore les Skills",
        description:
          "Les Skills sont des paquets d'instructions réutilisables (une checklist, un format de sortie, une procédure) que Claude peut charger à la demande — utile pour standardiser une tâche que tu refais souvent.",
      },
      {
        titre: "Connecte les MCP utiles à ton usage",
        description:
          "Notion, Gmail, Google Drive, Figma, Zapier… chaque connecteur MCP ajoute une capacité concrète (voir la section MCP plus bas). Commence par un seul outil du quotidien plutôt que tout connecter d'un coup.",
      },
      {
        titre: "Choisis le bon modèle selon la tâche",
        description:
          "Haiku pour la rapidité et le coût, Sonnet pour l'usage quotidien équilibré, Opus pour les tâches complexes qui demandent le plus de raisonnement.",
      },
    ],
    fonctionnalites: [
      {
        titre: "Fenêtre de contexte étendue",
        description:
          "Jusqu'à 200 000 tokens de contexte selon le modèle, soit l'équivalent de plusieurs centaines de pages en une seule conversation — utile pour analyser un gros document ou une base de code entière sans la découper.",
      },
      {
        titre: "Claude Code",
        description:
          "Agent IA en ligne de commande qui lit, modifie et exécute du code directement dans le terminal, avec accès au système de fichiers du projet. C'est l'outil qui a servi à construire cette page.",
      },
      {
        titre: "Artifacts",
        description:
          "Isole le code, un document ou une page web générée dans un panneau dédié, éditable et prévisualisable en direct, séparé du fil de conversation.",
      },
      {
        titre: "Projects",
        description:
          "Regroupe des documents de référence et des instructions personnalisées pour un contexte de travail récurrent, afin de ne pas tout redonner à chaque conversation.",
      },
      {
        titre: "MCP (Model Context Protocol)",
        description:
          "Protocole ouvert créé par Anthropic pour connecter Claude à des outils et données externes (fichiers, bases de données, autres apps) de façon standardisée.",
      },
      {
        titre: "Vision et lecture de documents",
        description:
          "Analyse des images, PDF, feuilles de calcul et captures d'écran directement dans la conversation, sans étape d'OCR séparée.",
      },
    ],
    workflows: [
      {
        declencheur: "Une idée décrite en langage naturel",
        resultat: "Un site à jour, en ligne",
        description:
          "Claude Code écrit le code, committe, pousse sur GitHub et déclenche un redéploiement (Lovable, Vercel, Netlify…) dans la même session — sans étape manuelle entre l'idée et la mise en ligne. C'est exactement comme ça que cette fiche a été construite.",
        outils: ["Claude Code", "GitHub", "Lovable"],
      },
      {
        declencheur: "Une réunion ou un brainstorm",
        resultat: "Des tâches structurées dans Notion",
        description:
          "Connecté à Notion via MCP, Claude crée une page, remplit une base de données ou met à jour un statut directement depuis la conversation, sans repasser par l'interface Notion.",
        outils: ["Notion"],
      },
      {
        declencheur: "Une boîte Gmail qui déborde",
        resultat: "Des brouillons de réponse prêts à valider",
        description:
          "Via le MCP Gmail, Claude lit les e-mails en attente, les résume et prépare des brouillons — un premier passage automatisé sur le tri, pas un pilote automatique complet : tu valides avant envoi.",
        outils: ["Gmail"],
      },
      {
        declencheur: "Un nouveau prompt sauvegardé dans la bibliothèque",
        resultat: "Une notification ou un suivi ailleurs",
        description:
          "En combinant Claude (génération, classification) avec Zapier (déclencheurs et actions), plusieurs outils s'enchaînent sans code : par exemple un ajout automatique dans un tableau de suivi ou une alerte Slack.",
        outils: ["Zapier"],
      },
      {
        declencheur: "Une maquette Figma",
        resultat: "Des specs ou du code prêt à intégrer",
        description:
          "Avec le MCP Figma, Claude lit la structure, les textes et les composants d'une maquette pour en extraire des spécifications ou une première implémentation — un pont direct entre design et développement, sans ressaisie manuelle.",
        outils: ["Figma"],
      },
      {
        declencheur: "Une pull request ouverte",
        resultat: "Une revue de code avant merge",
        description:
          "Claude Code peut tourner hors session interactive — dans une pipeline CI/CD par exemple — pour relire une pull request, signaler les problèmes ou proposer des corrections avant qu'un humain ne valide le merge.",
        outils: ["Claude Code", "GitHub"],
      },
    ],
    limites: [
      {
        titre: "Pas de génération d'images",
        description:
          "Claude ne génère pas d'images nativement — il faut passer par un outil dédié (Midjourney, etc.) pour cette partie du workflow.",
      },
      {
        titre: "Limites d'usage sur les formules payantes",
        description:
          "Même les formules Pro et Max ont des plafonds d'usage (messages par fenêtre de temps), pensés pour un usage intensif mais pas illimité.",
      },
      {
        titre: "Entraînement sur les données activé par défaut",
        description:
          "Depuis septembre 2025, les conversations des comptes grand public (Free/Pro/Max) servent à l'entraînement sauf désactivation manuelle dans les réglages de confidentialité.",
      },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA (pro) / droits RGPD standards (grand public)",
      aiAct: "Cadre de risque publié par Anthropic",
      entrainement: "Actif par défaut sur les comptes grand public (opt-out possible)",
      note: "Anthropic est basée aux États-Unis ; les transferts de données hors UE s'appuient sur des clauses contractuelles types (SCC). Les offres Claude for Work / Enterprise / Education n'utilisent pas les données client pour l'entraînement. Sur les comptes grand public, la conservation passe à 5 ans si l'entraînement est activé, contre 30 jours si désactivé.",
    },
    mcp: {
      disponible: true,
      officiel: true,
      note: "Claude est le créateur du Model Context Protocol (lancé fin 2024) — le support est natif dans l'app desktop et via l'API, avec un écosystème de serveurs MCP tiers en pleine expansion.",
      lien: "https://modelcontextprotocol.io",
    },
    tarifs: [
      {
        nom: "Free",
        prix: "Gratuit",
        inclus: "Accès web/mobile/desktop, usage limité qui se réinitialise sur une fenêtre glissante de 5h.",
      },
      {
        nom: "Pro",
        prix: "20 € / mois",
        inclus: "Usage élargi, accès aux modèles avancés, Projects, Artifacts, Claude Code inclus en usage standard.",
      },
      {
        nom: "Max 5x",
        prix: "100 € / mois",
        inclus: "Mêmes fonctionnalités que Pro avec des plafonds d'usage environ 5 fois plus élevés.",
      },
      {
        nom: "Max 20x",
        prix: "200 € / mois",
        inclus: "Plafonds d'usage environ 20 fois plus élevés que Pro, pour un usage professionnel intensif.",
      },
    ],
    verdict:
      "Claude tient sa place de référence pour la rédaction longue, l'analyse de documents et le code — Claude Code en particulier a changé la façon dont on peut travailler avec un agent IA en ligne de commande. Le vrai point d'attention est la confidentialité : sur les comptes grand public, l'entraînement sur tes conversations est activé par défaut depuis septembre 2025, donc le réflexe est d'aller vérifier ce réglage si c'est un sujet sensible pour toi. Pour un usage pro régulier avec du code, le forfait Pro à 20 €/mois est le bon point d'entrée.",
    faq: [
      {
        question: "Claude est-il gratuit ?",
        reponse:
          "Oui, avec un usage limité qui se réinitialise toutes les 5 heures. Pour un usage régulier, le forfait Pro démarre à 20 €/mois.",
      },
      {
        question: "Claude garde-t-il mes conversations pour entraîner ses modèles ?",
        reponse:
          "Sur les comptes grand public (Free/Pro/Max), oui par défaut depuis septembre 2025 — tu peux désactiver ce réglage dans les paramètres de confidentialité. Les offres pro (Claude for Work, Enterprise, Education) n'utilisent pas tes données pour l'entraînement.",
      },
      {
        question: "Quelle est la différence entre Claude et Claude Code ?",
        reponse:
          "Claude est l'assistant conversationnel (web, mobile, desktop). Claude Code est un agent en ligne de commande qui utilise les mêmes modèles mais travaille directement dans ton terminal, avec accès au système de fichiers pour lire, modifier et exécuter du code.",
      },
      {
        question: "C'est quoi le MCP dont tout le monde parle ?",
        reponse:
          "Le Model Context Protocol, créé par Anthropic fin 2024 : un standard ouvert pour connecter une IA à des outils et données externes (fichiers, bases de données, autres applications) de façon uniforme, plutôt qu'une intégration sur mesure par outil.",
      },
    ],
  },
};

export function getToolDetail(slug: string): ToolDetail | undefined {
  return TOOL_DETAILS[slug] ?? AUTRES_TOOL_DETAILS[slug];
}

