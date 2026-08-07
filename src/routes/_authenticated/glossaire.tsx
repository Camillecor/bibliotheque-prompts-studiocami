import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";

type Terme = { nom: string; definition: string; niveau?: "debutant" | "avance" };
type TermeAjoute = Terme & { id: string; lettre: string };
type SectionLettre = { lettre: string; termes: Terme[] };
type FAQ = { question: string; reponse: string };

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CLE_TERMES_AJOUTES = "glossaire_termes_ajoutes";

function normaliserLettre(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .charAt(0)
    .toUpperCase();
}

function chargerTermesAjoutes(): TermeAjoute[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_TERMES_AJOUTES);
    const parsed = brut ? JSON.parse(brut) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Contenu du glossaire : prompt engineering, IA, communication, marketing, no-code et JavaScript, classé de A à Z.
const SECTIONS: SectionLettre[] = [
  {
    lettre: "A",
    termes: [
      {
        nom: "A/B testing",
        definition:
          "Méthode comparant deux variantes d'un même contenu pour identifier la plus performante.",
        niveau: "avance",
      },
      {
        nom: "Agent IA",
        definition:
          "Système autonome utilisant un LLM pour planifier et exécuter des actions en séquence.",
      },
      {
        nom: "Agentique",
        definition:
          "Qualifie tout ce qui touche aux agents IA : un système est agentique s'il prend des décisions intermédiaires et exécute des actions de façon autonome.",
        niveau: "avance",
      },
      {
        nom: "AGI",
        definition:
          "Stade hypothétique d'une IA capable de raisonner à un niveau humain sur n'importe quel sujet, d'apprendre seule et de transférer ses connaissances entre domaines.",
        niveau: "avance",
      },
      {
        nom: "AI Act",
        definition:
          "Règlement européen sur l'IA, premier cadre juridique de ce type au monde, entré en vigueur en août 2024, qui classe les usages par niveau de risque.",
        niveau: "avance",
      },
      {
        nom: "Algorithme",
        definition:
          "Suite d'instructions transformant des données d'entrée en résultat ; en IA, désigne la recette d'apprentissage ou de décision du modèle.",
        niveau: "debutant",
      },
      {
        nom: "Alignement",
        definition:
          "Champ de recherche visant à faire en sorte qu'une IA fasse ce que les humains veulent vraiment, au-delà de la lettre de leurs instructions.",
        niveau: "avance",
      },
      {
        nom: "API",
        definition:
          "Interface permettant à deux logiciels d'échanger des données selon des règles définies.",
        niveau: "debutant",
      },
      {
        nom: "API REST",
        definition:
          "Style d'architecture d'API s'appuyant sur les méthodes HTTP standards pour manipuler des ressources.",
        niveau: "avance",
      },
      {
        nom: "Array (tableau)",
        definition:
          "Structure de données ordonnée regroupant plusieurs valeurs sous un seul nom.",
        niveau: "debutant",
      },
      {
        nom: "Assistant IA (copilote)",
        definition:
          "IA intégrée dans un outil de travail qui épaule l'utilisateur en contexte : code, résumés, brouillons.",
        niveau: "debutant",
      },
      {
        nom: "Async/await",
        definition:
          "Syntaxe JavaScript simplifiant l'écriture de code asynchrone en attendant qu'une promesse se résolve.",
        niveau: "avance",
      },
      {
        nom: "Attention",
        definition:
          "Composant des Transformers permettant de pondérer l'importance de chaque token.",
      },
      {
        nom: "Automatisation (workflow)",
        definition:
          "Enchaînement automatique de tâches entre plusieurs outils, sans intervention manuelle.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "B",
    termes: [
      {
        nom: "Benchmark LLM",
        definition:
          "Ensemble de tests standardisés évaluant objectivement les capacités du modèle.",
      },
      {
        nom: "Biais de modèle",
        definition:
          "Tendance du LLM à favoriser certains points de vue selon les données d'entraînement.",
      },
      {
        nom: "Brand content",
        definition:
          "Contenu de marque conçu pour informer ou divertir plutôt que vendre directement.",
        niveau: "avance",
      },
      {
        nom: "Brief créatif",
        definition:
          "Document synthétique définissant l'objectif, la cible et le message clé avant une création.",
        niveau: "debutant",
      },
      {
        nom: "Builder visuel",
        definition:
          "Outil permettant de construire une interface par glisser-déposer plutôt qu'en codant.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "C",
    termes: [
      {
        nom: "Call-to-action (CTA)",
        definition:
          "Élément incitant l'utilisateur à effectuer une action précise, comme cliquer ou s'inscrire.",
        niveau: "debutant",
      },
      {
        nom: "Chain-of-Thought (CoT)",
        definition:
          "Technique demandant au modèle d'expliciter ses étapes de raisonnement.",
      },
      {
        nom: "Chatbot",
        definition:
          "Interface de conversation avec une IA, du plus simple au plus sophistiqué — la porte d'entrée grand public de l'IA depuis 2023.",
        niveau: "debutant",
      },
      {
        nom: "Claude",
        definition: "LLM développé par Anthropic en versions Haiku, Sonnet et Opus.",
      },
      {
        nom: "Clonage de voix",
        definition:
          "Reproduction d'une voix précise à partir de quelques secondes d'enregistrement — légitime avec consentement, problématique sans.",
        niveau: "avance",
      },
      {
        nom: "Closure",
        definition:
          "Fonction JavaScript qui conserve l'accès aux variables de son contexte de création même après son exécution.",
        niveau: "avance",
      },
      {
        nom: "Communication de crise",
        definition:
          "Ensemble des actions de communication déployées pour protéger une réputation face à un incident.",
        niveau: "avance",
      },
      {
        nom: "Computer use",
        definition:
          "Capacité d'un agent IA à piloter un ordinateur comme le ferait un humain : voir l'écran, cliquer, taper, naviguer dans des applications.",
        niveau: "avance",
      },
      {
        nom: "Constitutional AI",
        definition: "Méthode d'alignement entraînant le modèle à s'auto-critiquer.",
      },
      {
        nom: "Context window",
        definition: "Nombre maximum de tokens qu'un LLM peut traiter en une requête.",
      },
      {
        nom: "Contrainte de format",
        definition: "Instructions spécifiant la forme de la réponse attendue.",
      },
      {
        nom: "CPC (coût par clic)",
        definition:
          "Prix payé par un annonceur chaque fois qu'un internaute clique sur une publicité.",
        niveau: "debutant",
      },
      {
        nom: "CTR (taux de clic)",
        definition:
          "Proportion de personnes ayant cliqué sur un lien ou une publicité parmi celles qui l'ont vue.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "D",
    termes: [
      {
        nom: "Dataset",
        definition:
          "Ensemble de données structuré utilisé pour entraîner ou évaluer un modèle d'IA.",
        niveau: "debutant",
      },
      {
        nom: "Deep Learning",
        definition:
          "Branche du machine learning basée sur des réseaux de neurones à plusieurs couches.",
        niveau: "debutant",
      },
      {
        nom: "Distillation",
        definition:
          "Entraîner un petit modèle à imiter les réponses d'un grand modèle, pour obtenir une version plus rapide et moins coûteuse.",
        niveau: "avance",
      },
      {
        nom: "DOM (Document Object Model)",
        definition:
          "Représentation en arbre d'une page web que le code JavaScript peut lire et modifier.",
        niveau: "debutant",
      },
      {
        nom: "Données d'entraînement",
        definition:
          "Textes, images ou sons utilisés pour entraîner un modèle — sujets à débat sur les droits d'auteur et les données personnelles.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "E",
    termes: [
      {
        nom: "Embedding",
        definition:
          "Représentation vectorielle d'un texte dans un espace numérique multidimensionnel.",
      },
      {
        nom: "Entraînement",
        definition:
          "Phase où un modèle apprend en ajustant des milliards de réglages internes sur d'immenses volumes de données — un processus long et coûteux.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "F",
    termes: [
      {
        nom: "Few-shot prompting",
        definition:
          "Technique fournissant 2 à 10 exemples avant la tâche réelle.",
      },
      {
        nom: "Fine-tuning",
        definition:
          "Réentraînement sur un dataset spécialisé pour améliorer les performances.",
      },
      {
        nom: "Fonction",
        definition:
          "Bloc de code réutilisable, exécuté à la demande, qui peut recevoir des paramètres et retourner un résultat.",
        niveau: "debutant",
      },
      {
        nom: "Function calling (Tool use)",
        definition: "Capacité à appeler des fonctions externes structurées en JSON.",
      },
      {
        nom: "Funnel de conversion",
        definition:
          "Parcours structuré en étapes menant un prospect de la découverte à l'achat.",
        niveau: "avance",
      },
    ],
  },
  {
    lettre: "G",
    termes: [
      {
        nom: "GEO (Generative Engine Optimization)",
        definition:
          "Optimisation du contenu pour qu'il soit repris par les IA conversationnelles — une forme de référencement complémentaire au SEO et au SEA.",
        niveau: "avance",
      },
      {
        nom: "Gemini",
        definition: "LLM multimodal développé par Google DeepMind.",
      },
      {
        nom: "Génération d'images",
        definition:
          "Production d'images à partir d'une description textuelle, avec un contrôle croissant et un photoréalisme atteint dès 2024.",
        niveau: "debutant",
      },
      {
        nom: "Génération vidéo",
        definition:
          "Création de clips de quelques secondes à partir d'un prompt ou d'une image — une frontière actuelle de l'IA créative, encore inégale sur la durée.",
        niveau: "avance",
      },
      {
        nom: "GPT",
        definition: "Famille de modèles développée par OpenAI.",
      },
      {
        nom: "Growth hacking",
        definition:
          "Approche marketing combinant expérimentation rapide et leviers techniques pour accélérer la croissance.",
        niveau: "avance",
      },
      {
        nom: "Guardrails",
        definition: "Mécanismes de sécurité filtrant les sorties nuisibles.",
      },
    ],
  },
  {
    lettre: "H",
    termes: [
      {
        nom: "Hallucination",
        definition:
          "Phénomène où le LLM génère des informations fausses avec confiance.",
      },
    ],
  },
  {
    lettre: "I",
    termes: [
      {
        nom: "IA étroite (ANI)",
        definition:
          "IA conçue et performante pour un domaine délimité, comme la traduction, les échecs ou la génération d'images.",
        niveau: "debutant",
      },
      {
        nom: "IA générative",
        definition:
          "Intelligence artificielle capable de créer du texte, des images ou du code plutôt que de simplement classifier.",
        niveau: "debutant",
      },
      {
        nom: "Inbound marketing",
        definition:
          "Stratégie attirant les clients via du contenu utile plutôt que de la publicité intrusive.",
        niveau: "avance",
      },
      {
        nom: "Inference",
        definition:
          "Phase d'utilisation d'un modèle entraîné pour générer des réponses.",
      },
      {
        nom: "Instruction prompting",
        definition:
          "Formulation explicite d'une tâche sous forme d'instruction directe.",
      },
      {
        nom: "Intelligence artificielle (IA)",
        definition:
          "Programmes informatiques capables d'accomplir des tâches qui demandent normalement l'intelligence humaine, du filtrage anti-spam aux assistants conversationnels.",
        niveau: "debutant",
      },
      {
        nom: "Iterative prompting",
        definition: "Affinage progressif du prompt en plusieurs cycles.",
      },
    ],
  },
  {
    lettre: "J",
    termes: [
      {
        nom: "Jailbreak",
        definition:
          "Technique visant à contourner les guardrails via des prompts manipulatoires.",
      },
      {
        nom: "JSON mode",
        definition: "Mode forçant le LLM à répondre en JSON valide et parseable.",
      },
    ],
  },
  {
    lettre: "K",
    termes: [
      {
        nom: "KPI (indicateur clé de performance)",
        definition:
          "Métrique chiffrée permettant de mesurer l'atteinte d'un objectif business.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "L",
    termes: [
      {
        nom: "Landing page",
        definition:
          "Page web dédiée à la conversion d'un visiteur suite à un clic publicitaire ou un lien.",
        niveau: "debutant",
      },
      {
        nom: "Lead",
        definition:
          "Contact ayant manifesté un intérêt commercial, potentiellement convertible en client.",
        niveau: "debutant",
      },
      {
        nom: "Ligne éditoriale",
        definition:
          "Ensemble de règles définissant le ton, les sujets et le style d'une marque sur ses contenus.",
        niveau: "debutant",
      },
      {
        nom: "LLM (Large Language Model)",
        definition: "Modèle entraîné sur de vastes corpus textuels.",
      },
      {
        nom: "Low-code",
        definition:
          "Approche de développement combinant interfaces visuelles et code léger pour plus de flexibilité.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "M",
    termes: [
      {
        nom: "Machine Learning",
        definition:
          "Sous-domaine de l'IA où un système apprend des motifs à partir de données plutôt que de règles codées.",
        niveau: "debutant",
      },
      {
        nom: "MCP (Model Context Protocol)",
        definition:
          "Protocole ouvert standardisant la connexion entre une IA et des services externes, lancé par Anthropic fin 2024.",
        niveau: "avance",
      },
      {
        nom: "Méta-prompt",
        definition: "Prompt générant d'autres prompts optimisés.",
      },
      {
        nom: "Mistral",
        definition: "LLM open-source développé par Mistral AI.",
      },
      {
        nom: "Modèle",
        definition:
          "Résultat concret d'un entraînement : un fichier volumineux contenant tout ce que le système a appris.",
        niveau: "debutant",
      },
      {
        nom: "Modèle de diffusion",
        definition:
          "Famille de modèles qui génèrent des images en partant d'un bruit aléatoire et en le transformant progressivement en image nette.",
        niveau: "avance",
      },
      {
        nom: "Modèle de fondation",
        definition: "LLM pré-entraîné servant de base pour le fine-tuning.",
      },
      {
        nom: "Modèle de raisonnement",
        definition:
          "LLM entraîné à « réfléchir avant de répondre » étape par étape, excellent en maths et en code, au prix d'un temps de réponse plus long.",
        niveau: "avance",
      },
      {
        nom: "Multimodal",
        definition:
          "Modèle capable de traiter plusieurs types de données — texte, image, audio, vidéo — en entrée comme en sortie.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "N",
    termes: [
      {
        nom: "Negative prompting",
        definition: "Instructions indiquant ce que le modèle ne doit PAS faire.",
      },
      {
        nom: "No-code",
        definition:
          "Approche permettant de créer une application sans écrire de code, via des interfaces visuelles.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "O",
    termes: [
      {
        nom: "One-shot prompting",
        definition: "Fournir exactement un exemple avant la tâche réelle.",
      },
      {
        nom: "Open source",
        definition:
          "Au sens strict : code, poids et données d'entraînement rendus publics, permettant l'auto-hébergement et l'indépendance vis-à-vis d'un fournisseur.",
        niveau: "avance",
      },
      {
        nom: "Opt-out",
        definition:
          "Réglage permettant de refuser que ses conversations ou fichiers servent à entraîner les modèles de l'éditeur — un réflexe prioritaire en usage professionnel.",
        niveau: "debutant",
      },
      {
        nom: "Orchestration",
        definition:
          "Coordination de plusieurs modèles, outils ou agents au sein d'un même processus — le travail d'outils comme n8n ou Make.",
        niveau: "avance",
      },
      {
        nom: "Output parsing",
        definition:
          "Extraction et structuration des données depuis la réponse brute.",
      },
      {
        nom: "Overfitting (surapprentissage)",
        definition:
          "Défaut d'un modèle trop ajusté à ses données d'entraînement, peu performant sur de nouvelles données.",
        niveau: "avance",
      },
    ],
  },
  {
    lettre: "P",
    termes: [
      {
        nom: "Paramètres",
        definition:
          "Réglages internes appris pendant l'entraînement, qui encodent la « connaissance » du modèle — comptés en milliards.",
        niveau: "avance",
      },
      {
        nom: "Persona (marketing)",
        definition:
          "Profil semi-fictif représentant un segment type de clientèle, utilisé pour orienter les décisions marketing.",
        niveau: "debutant",
      },
      {
        nom: "Persona prompting",
        definition: "Assignation d'un rôle ou d'une identité précise au modèle.",
      },
      {
        nom: "Poids ouverts",
        definition:
          "Modèle dont le fichier de paramètres est téléchargeable, modifiable et redistribuable selon une licence donnée — Llama, Mistral, DeepSeek, Qwen.",
        niveau: "avance",
      },
      {
        nom: "Promise",
        definition:
          "Objet JavaScript représentant le résultat futur, encore inconnu, d'une opération asynchrone.",
        niveau: "avance",
      },
      {
        nom: "Prompt",
        definition: "Texte d'entrée déclenchant une génération du LLM.",
      },
      {
        nom: "Prompt chaining",
        definition: "Technique reliant plusieurs prompts en séquence.",
      },
      {
        nom: "Prompt compression",
        definition: "Réduction de la longueur sans perte d'information significative.",
      },
      {
        nom: "Prompt engineering",
        definition:
          "Discipline consistant à concevoir, tester et optimiser les instructions.",
      },
      {
        nom: "Prompt injection",
        definition:
          "Attaque injectant des instructions malveillantes dans un contenu.",
      },
      {
        nom: "Prompt template",
        definition:
          "Structure réutilisable avec variables à substituer dynamiquement.",
      },
    ],
  },
  {
    lettre: "R",
    termes: [
      {
        nom: "RAG (Retrieval-Augmented Generation)",
        definition: "Architecture combinant LLM et base vectorielle.",
      },
      {
        nom: "ReAct",
        definition:
          "Framework alternant raisonnement explicite et action concrète.",
      },
      {
        nom: "Réseau de neurones",
        definition:
          "Modèle mathématique inspiré du cerveau, composé de couches de neurones artificiels interconnectés.",
        niveau: "avance",
      },
      {
        nom: "RGPD et IA",
        definition:
          "Le règlement européen sur les données personnelles s'applique pleinement à l'IA : base légale, information, droits d'accès et d'effacement.",
        niveau: "avance",
      },
      {
        nom: "RLHF",
        definition:
          "Technique d'entraînement par renforcement à partir de retours humains.",
      },
      {
        nom: "Role prompting",
        definition: "Voir Persona prompting.",
      },
    ],
  },
  {
    lettre: "S",
    termes: [
      {
        nom: "SEA (référencement payant)",
        definition:
          "Achat d'espaces publicitaires sur les moteurs de recherche, facturé au clic ou à l'impression.",
        niveau: "avance",
      },
      {
        nom: "Semantic search",
        definition: "Recherche basée sur le sens plutôt que la correspondance exacte.",
      },
      {
        nom: "SEO (référencement naturel)",
        definition:
          "Ensemble de techniques visant à améliorer la visibilité d'un site dans les moteurs de recherche.",
        niveau: "debutant",
      },
      {
        nom: "Slop",
        definition:
          "Terme péjoratif désignant le contenu produit en masse par l'IA sans relecture ni valeur ajoutée : articles génériques, images kitsch qui saturent le web.",
        niveau: "avance",
      },
      {
        nom: "Souveraineté numérique",
        definition:
          "Capacité d'un pays ou d'une organisation à maîtriser ses outils et ses données sans dépendre d'acteurs étrangers.",
        niveau: "avance",
      },
      {
        nom: "Storytelling",
        definition:
          "Technique consistant à raconter une histoire pour rendre un message mémorable et engageant.",
        niveau: "debutant",
      },
      {
        nom: "Structured output",
        definition: "Sortie formatée selon un schéma prédéfini.",
      },
      {
        nom: "Synthèse vocale (TTS)",
        definition:
          "Transformation d'un texte en voix parlée, avec intonations et émotions, souvent multilingue.",
        niveau: "debutant",
      },
      {
        nom: "System prompt",
        definition: "Instruction initiale définissant le comportement du modèle.",
      },
    ],
  },
  {
    lettre: "T",
    termes: [
      {
        nom: "Temperature",
        definition:
          "Paramètre contrôlant la créativité et la variabilité des sorties.",
      },
      {
        nom: "Token",
        definition: "Unité de base traitée par un LLM (~¾ mot en anglais).",
      },
      {
        nom: "Top-p (nucleus sampling)",
        definition: "Paramètre sélectionnant un ensemble de tokens.",
      },
      {
        nom: "Transformer",
        definition: "Architecture basée sur le mécanisme d'attention.",
      },
      {
        nom: "Tree of Thoughts (ToT)",
        definition:
          "Extension du CoT explorant plusieurs branches en parallèle.",
      },
      {
        nom: "TypeScript",
        definition:
          "Sur-ensemble de JavaScript ajoutant un typage statique optionnel pour fiabiliser le code.",
        niveau: "avance",
      },
    ],
  },
  {
    lettre: "U",
    termes: [
      {
        nom: "User prompt",
        definition:
          "Message envoyé par l'utilisateur dans une conversation avec le LLM.",
      },
      {
        nom: "Upscaling",
        definition:
          "Augmentation de la résolution d'une image ou d'une vidéo par IA, qui invente les détails manquants de façon plausible.",
        niveau: "avance",
      },
    ],
  },
  {
    lettre: "V",
    termes: [
      {
        nom: "Variable (JavaScript)",
        definition:
          "Emplacement nommé en mémoire permettant de stocker et réutiliser une valeur dans un programme.",
        niveau: "debutant",
      },
      {
        nom: "Variable de prompt",
        definition: "Placeholder remplacé dynamiquement dans un template.",
      },
      {
        nom: "Vectorisation",
        definition:
          "Transformation d'un texte en embedding pour recherche sémantique.",
      },
      {
        nom: "Vibecoding",
        definition:
          "Pratique consistant à construire un logiciel en dialoguant avec un assistant IA plutôt qu'en écrivant le code à la main.",
        niveau: "debutant",
      },
    ],
  },
  {
    lettre: "W",
    termes: [
      {
        nom: "Watermark",
        definition:
          "Signature invisible insérée dans un contenu généré par IA pour permettre son identification ultérieure — progressivement exigée par les régulateurs.",
        niveau: "avance",
      },
      {
        nom: "Webhook",
        definition:
          "Notification automatique envoyée par une application vers une URL dès qu'un événement se produit.",
        niveau: "avance",
      },
    ],
  },
  {
    lettre: "Z",
    termes: [
      {
        nom: "Zero-shot prompting",
        definition: "Demander une tâche sans fournir d'exemples préalables.",
      },
    ],
  },
];

const FAQ: FAQ[] = [
  {
    question: "Qu'est-ce que le prompt engineering ?",
    reponse:
      "Le prompt engineering est la discipline consistant à concevoir, tester et optimiser les instructions données aux LLMs (modèles de langage) pour maximiser la qualité et la pertinence des sorties. Un prompt bien structuré inclut un rôle, un contexte, une tâche précise, des contraintes et un format de sortie.",
  },
  {
    question: "Quelle est la différence entre zero-shot et few-shot prompting ?",
    reponse:
      "Le zero-shot prompting demande une tâche sans fournir d'exemples. Le few-shot prompting inclut 2 à 10 exemples (paires input/output) avant la tâche pour guider le modèle. Le few-shot est plus efficace pour les formats complexes ou les styles spécifiques.",
  },
  {
    question: "Comment réduire les hallucinations d'un LLM ?",
    reponse:
      "Pour réduire les hallucinations : utilisez le RAG (Retrieval-Augmented Generation) pour ancrer les réponses dans des documents fiables, demandez au modèle d'indiquer son niveau de confiance, fournissez des sources dans le prompt, et activez le grounding quand disponible.",
  },
  {
    question: "Qu'est-ce qu'une context window ?",
    reponse:
      "La context window est le nombre maximum de tokens qu'un LLM peut traiter en une seule requête (entrée + sortie combinées). Elle varie de 4 000 tokens (anciens modèles) à 2 millions (Gemini 1.5 Pro). Un contexte trop long peut dégrader les performances sur les éléments au milieu.",
  },
  {
    question: "Qu'est-ce que le RAG en IA ?",
    reponse:
      "Le RAG (Retrieval-Augmented Generation) est une architecture combinant un LLM avec une base de données vectorielle. Le système récupère les documents pertinents (retrieval) et les injecte dans le contexte du LLM avant la génération. Résultat : des réponses plus précises et ancrées dans des données réelles, avec moins d'hallucinations.",
  },
];

const ROLES = ["--info", "--coral", "--primary", "--warning", "--success"] as const;

export const Route = createFileRoute("/_authenticated/glossaire")({
  head: () => ({
    meta: [
      { title: "Glossaire du prompt engineering — Studio Cami IA" },
      {
        name: "description",
        content:
          "Définitions claires sur le prompt engineering, l'IA, la communication, le marketing, le no-code et JavaScript, classées de A à Z.",
      },
    ],
  }),
  component: GlossairePage,
});

function GlossairePage() {
  const [recherche, setRecherche] = useState("");

  const [termesAjoutes, setTermesAjoutes] = useState<TermeAjoute[]>(() => chargerTermesAjoutes());

  const sectionsCombinees = useMemo(() => {
    if (termesAjoutes.length === 0) return SECTIONS;
    const parLettre = new Map<string, Terme[]>();
    for (const section of SECTIONS) parLettre.set(section.lettre, [...section.termes]);
    for (const terme of termesAjoutes) {
      const liste = parLettre.get(terme.lettre) ?? [];
      liste.push(terme);
      parLettre.set(terme.lettre, liste);
    }
    return ALPHABET.map((lettre) => ({
      lettre,
      termes: (parLettre.get(lettre) ?? [])
        .slice()
        .sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    })).filter((section) => section.termes.length > 0);
  }, [termesAjoutes]);

  const totalTermes = useMemo(
    () => sectionsCombinees.reduce((somme, section) => somme + section.termes.length, 0),
    [sectionsCombinees],
  );

  const sectionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return sectionsCombinees;
    return sectionsCombinees
      .map((section) => ({
        ...section,
        termes: section.termes.filter(
          (t) =>
            t.nom.toLowerCase().includes(terme) || t.definition.toLowerCase().includes(terme),
        ),
      }))
      .filter((section) => section.termes.length > 0);
  }, [recherche, sectionsCombinees]);

  const [nouveauMot, setNouveauMot] = useState("");
  const [nouvelleLettre, setNouvelleLettre] = useState("");
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [nouveauNiveau, setNouveauNiveau] = useState<"" | "debutant" | "avance">("");
  const lettreModifieeManuellement = useRef(false);

  function changerMot(valeur: string) {
    setNouveauMot(valeur);
    if (!lettreModifieeManuellement.current) {
      const lettre = normaliserLettre(valeur);
      setNouvelleLettre(/^[A-Z]$/.test(lettre) ? lettre : "");
    }
  }

  function changerLettre(valeur: string) {
    lettreModifieeManuellement.current = true;
    setNouvelleLettre(normaliserLettre(valeur));
  }

  function ajouterTerme(event: React.FormEvent) {
    event.preventDefault();
    const mot = nouveauMot.trim();
    const texte = nouveauTexte.trim();
    const lettre = nouvelleLettre.trim().toUpperCase();

    if (!mot || !texte || !/^[A-Z]$/.test(lettre)) {
      toast.error("Renseigne au moins le mot, une lettre (A-Z) et la définition.");
      return;
    }

    const nouveau: TermeAjoute = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nom: mot,
      definition: texte,
      lettre,
      ...(nouveauNiveau ? { niveau: nouveauNiveau } : {}),
    };

    setTermesAjoutes((precedent) => {
      const suivant = [...precedent, nouveau];
      try {
        window.localStorage.setItem(CLE_TERMES_AJOUTES, JSON.stringify(suivant));
      } catch {
        // stockage indisponible (navigation privée…) — le mot reste ajouté pour la session en cours
      }
      return suivant;
    });

    setNouveauMot("");
    setNouvelleLettre("");
    setNouveauTexte("");
    setNouveauNiveau("");
    lettreModifieeManuellement.current = false;
    toast.success(`« ${mot} » ajouté au glossaire.`);
  }

  const resultatsCount = sectionsFiltrees.reduce(
    (somme, section) => somme + section.termes.length,
    0,
  );

  const lettresDisponibles = useMemo(
    () => new Set(sectionsFiltrees.map((section) => section.lettre)),
    [sectionsFiltrees],
  );

  const hautDePageRef = useRef<HTMLDivElement>(null);
  const [afficherRemonter, setAfficherRemonter] = useState(false);

  useEffect(() => {
    const noeud = hautDePageRef.current;
    if (!noeud) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAfficherRemonter(!(entry?.isIntersecting ?? true)),
      { threshold: 0 },
    );
    observer.observe(noeud);
    return () => observer.disconnect();
  }, []);

  function remonterEnHaut() {
    hautDePageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppShell>
      <div ref={hautDePageRef} aria-hidden="true" className="h-px" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold sm:text-lg">Glossaire</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un terme"
            aria-label="Rechercher un terme du glossaire"
            className="h-11 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm text-primary outline-none transition focus:border-[var(--info)] focus:bg-card sm:h-auto sm:w-64 sm:py-2 sm:text-xs"
          />
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Glossaire du prompt engineering
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {totalTermes} définitions claires sur le prompt engineering, les LLMs et l'IA
            générative, classées de A à Z.
            {recherche.trim() ? (
              <span className="ml-1 font-semibold text-primary">
                {resultatsCount} résultat{resultatsCount > 1 ? "s" : ""} pour « {recherche} »
              </span>
            ) : null}
          </p>
        </div>

        <form onSubmit={ajouterTerme} className="cami-card mb-8 space-y-2 p-3 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Ajouter un mot
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              value={nouveauMot}
              onChange={(event) => changerMot(event.target.value)}
              placeholder="Mot"
              aria-label="Mot à ajouter"
              className="cami-input h-9 min-w-[120px] flex-[2] px-3 py-0 text-sm"
            />
            <input
              value={nouvelleLettre}
              onChange={(event) => changerLettre(event.target.value)}
              placeholder="Lettre"
              aria-label="Lettre"
              maxLength={1}
              className="cami-input h-9 w-14 px-2 py-0 text-center text-sm uppercase"
            />
            <select
              value={nouveauNiveau}
              onChange={(event) =>
                setNouveauNiveau(event.target.value as "" | "debutant" | "avance")
              }
              aria-label="Niveau"
              className="cami-input h-9 flex-1 px-2 py-0 text-sm"
            >
              <option value="">Niveau</option>
              <option value="debutant">Débutant</option>
              <option value="avance">Avancé</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={nouveauTexte}
              onChange={(event) => setNouveauTexte(event.target.value)}
              placeholder="Définition en une phrase"
              aria-label="Définition"
              className="cami-input h-9 flex-1 px-3 py-0 text-sm"
            />
            <button
              type="submit"
              aria-label="Ajouter au glossaire"
              title="Ajouter au glossaire"
              className="cami-submit-btn h-9 w-9 shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav aria-label="Aller à une lettre" className="mb-8 flex flex-wrap gap-1.5">
          {ALPHABET.map((lettre) => {
            const disponible = lettresDisponibles.has(lettre);
            return disponible ? (
              <a
                key={lettre}
                href={`#lettre-${lettre}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary transition hover:-translate-y-0.5 hover:border-[var(--coral)] hover:text-[var(--coral)]"
              >
                {lettre}
              </a>
            ) : (
              <span
                key={lettre}
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-muted-foreground/40"
              >
                {lettre}
              </span>
            );
          })}
        </nav>

        {sectionsFiltrees.length === 0 ? (
          <div className="cami-block-resume text-center text-sm text-muted-foreground">
            Aucun terme ne correspond à « {recherche} ».
          </div>
        ) : (
          <div className="space-y-8">
            {sectionsFiltrees.map((section, sectionIndex) => {
              const role = ROLES[sectionIndex % ROLES.length];
              return (
                <section key={section.lettre} id={`lettre-${section.lettre}`} className="scroll-mt-24">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, var(${role}) 14%, white)`,
                        color: `var(${role})`,
                      }}
                    >
                      {section.lettre}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {section.termes.length} terme{section.termes.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.termes.map((t) => (
                      <div key={t.nom} className="cami-card">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-primary">{t.nom}</p>
                          {t.niveau ? (
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                              style={{
                                background:
                                  t.niveau === "debutant"
                                    ? "color-mix(in srgb, var(--success) 14%, white)"
                                    : "color-mix(in srgb, var(--coral) 14%, white)",
                                color:
                                  t.niveau === "debutant" ? "var(--success)" : "var(--coral)",
                              }}
                            >
                              {t.niveau === "debutant" ? "Débutant" : "Avancé"}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {t.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="mt-12 space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-primary">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.question} className="cami-card">
                <p className="text-sm font-bold text-primary">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{item.reponse}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {afficherRemonter ? (
        <button
          type="button"
          onClick={remonterEnHaut}
          aria-label="Remonter en haut de la page"
          title="Remonter en haut"
          className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_8px_20px_-8px_rgba(17,26,61,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </AppShell>
  );
}
