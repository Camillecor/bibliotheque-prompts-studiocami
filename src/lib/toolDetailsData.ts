import type { ToolDetail } from "@/lib/toolDetails";

// Fiches détaillées des outils (hors Claude, défini dans toolDetails.ts).
// Même gabarit pour tous : essentiel, présentation, éditeur, pour qui,
// fonctionnalités, limites, conformité, MCP, tarifs, verdict, FAQ.
export const AUTRES_TOOL_DETAILS: Record<string, ToolDetail> = {
  chatgpt: {
    slug: "chatgpt",
    nom: "ChatGPT",
    logo: "ChatGPT",
    tagline: "L'assistant généraliste d'OpenAI, pour écrire, coder et réfléchir au quotidien.",
    tags: ["Chatbots", "IA générative"],
    notes: { fonctionnalites: 9.5, facilite: 9, valeur: 7.5, confiance: 8 },
    ctaLabel: "Essayer ChatGPT →",
    ctaUrl: "https://chat.openai.com",
    testeLe: "9 août 2026",
    essentiel:
      "ChatGPT est l'assistant IA d'OpenAI et le plus utilisé au monde. C'est le couteau suisse : texte, code, images (via DALL·E/GPT Image), voix, recherche web, analyse de fichiers et agents personnalisés (GPTs) dans une seule interface. Version gratuite généreuse, formule Plus à 20 €/mois, Pro pour les usages intensifs.",
    quEstCe: [
      "ChatGPT est une interface conversationnelle branchée sur les modèles GPT d'OpenAI, accessible sur le web, en app mobile et desktop, ainsi que via une API. Sa force n'est pas d'être le meilleur sur un point précis, mais d'être correct partout : rédiger un e-mail, résumer un PDF, générer une image, analyser un tableur, chercher une info à jour sur le web.",
      "Deux briques structurent l'usage avancé : les GPTs, des assistants personnalisés avec instructions et fichiers de référence, et le mode Projects/mémoire, qui permet de conserver un contexte de travail d'une conversation à l'autre.",
    ],
    quiEstDerriere:
      "ChatGPT est développé par OpenAI, fondée en 2015 à San Francisco et dirigée par Sam Altman. L'entreprise est fortement adossée à Microsoft, qui héberge une partie de l'infrastructure sur Azure et intègre ses modèles dans Copilot.",
    pourQui: {
      idealPour:
        "Un usage polyvalent au quotidien : rédaction, brainstorming, images, analyse de fichiers et recherche web dans un seul outil.",
      aEviterSi:
        "Tu as besoin d'un hébergement européen strict, ou d'un modèle spécialisé sur une seule tâche (image artistique, code agentique long).",
    },
    demarrage: [
      {
        titre: "Personnalise tes instructions",
        description:
          "Dans Réglages > Personnalisation, décris ton métier, ton ton attendu et tes contraintes une bonne fois pour toutes, plutôt que de les répéter à chaque conversation.",
      },
      {
        titre: "Choisis ce que la mémoire retient",
        description:
          "Active ou désactive la mémoire entre conversations selon que tu veux un assistant qui se souvient de ton contexte ou des sessions cloisonnées.",
      },
      {
        titre: "Crée un GPT pour une tâche récurrente",
        description:
          "Un GPT personnalisé avec instructions et fichiers de référence évite de tout redonner à chaque fois — utile pour une tâche que tu refais chaque semaine.",
      },
      {
        titre: "Regroupe par Projects",
        description:
          "Range les conversations et fichiers d'un même sujet dans un Project pour garder le contexte au même endroit.",
      },
      {
        titre: "Connecte les outils utiles",
        description:
          "Dans Réglages > Connecteurs, branche Google Drive, GitHub ou d'autres sources selon ton usage réel, plutôt que de tout activer.",
      },
      {
        titre: "Choisis le bon mode selon la tâche",
        description:
          "Réponse rapide pour le quotidien, réflexion approfondie (o-series) pour les problèmes qui demandent un vrai raisonnement.",
      },
    ],
    fonctionnalites: [
      {
        titre: "Multimodal complet",
        description:
          "Texte, image, voix et fichiers dans la même conversation : tu peux dicter, montrer une capture d'écran et demander une image en retour.",
      },
      {
        titre: "Recherche web intégrée",
        description:
          "ChatGPT va chercher l'information à jour sur le web et cite ses sources, utile dès que la question dépasse la date de coupure du modèle.",
      },
      {
        titre: "GPTs personnalisés",
        description:
          "Crée des assistants dédiés avec leurs propres instructions et documents de référence, partageables avec ton équipe.",
      },
      {
        titre: "Analyse de données",
        description:
          "Exécute du code Python sur tes fichiers pour nettoyer un tableur, produire un graphique ou vérifier un calcul.",
      },
      {
        titre: "Génération d'images",
        description:
          "Crée et retouche des visuels directement dans le fil, sans passer par un outil séparé.",
      },
      {
        titre: "Mémoire entre conversations",
        description:
          "Retient tes préférences et le contexte de tes projets d'une session à l'autre, désactivable dans les réglages.",
      },
    ],
    workflows: [
      {
        declencheur: "Une question qui dépasse la date de coupure",
        resultat: "Une réponse à jour, sourcée",
        description:
          "La recherche web intégrée va chercher l'info en direct et cite ses sources, sans changer d'outil.",
        outils: ["Web"],
      },
      {
        declencheur: "Un fichier PDF ou un tableur uploadé",
        resultat: "Une analyse ou un graphique",
        description:
          "L'analyse de données exécute du code Python sur le fichier pour nettoyer, croiser ou visualiser les chiffres.",
        outils: ["Python"],
      },
      {
        declencheur: "Un brief marketing décrit en une phrase",
        resultat: "Un visuel prêt à publier",
        description:
          "La génération d'images intégrée produit et retouche le visuel directement dans la conversation.",
        outils: ["Images"],
      },
      {
        declencheur: "Une tâche que ton équipe refait chaque semaine",
        resultat: "Un GPT personnalisé partageable",
        description:
          "Instructions et fichiers de référence encapsulés dans un GPT dédié, réutilisable par toute l'équipe.",
        outils: [],
      },
      {
        declencheur: "Une réunion enregistrée en vocal",
        resultat: "Un compte-rendu structuré",
        description:
          "Le mode vocal transcrit et la rédaction assistée structure directement le compte-rendu.",
        outils: [],
      },
      {
        declencheur: "Un fichier stocké sur Google Drive",
        resultat: "Une réponse enrichie de son contenu",
        description:
          "Le connecteur Drive donne à ChatGPT accès direct au fichier sans le retélécharger.",
        outils: ["Google Drive"],
      },
    ],
    limites: [
      {
        titre: "Qualité variable selon le modèle",
        description:
          "Le modèle utilisé par défaut change selon la formule et la charge : deux réponses au même prompt peuvent différer nettement en profondeur.",
      },
      {
        titre: "Entraînement activé par défaut",
        description:
          "Sur les comptes grand public, les conversations peuvent servir à améliorer les modèles sauf désactivation manuelle dans les réglages.",
      },
      {
        titre: "Hébergement hors UE",
        description:
          "Les données transitent par des serveurs américains, ce qui demande un cadrage contractuel pour les usages sensibles.",
      },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA (Team/Enterprise)",
      aiAct: "Documentation modèle publiée par OpenAI",
      entrainement: "Actif par défaut (grand public), opt-out possible",
      note: "OpenAI est basée aux États-Unis ; les transferts hors UE reposent sur des clauses contractuelles types. Les offres Team, Enterprise et API n'utilisent pas les données client pour l'entraînement par défaut.",
    },
    mcp: {
      disponible: true,
      officiel: true,
      note: "OpenAI a adopté le Model Context Protocol : les connecteurs et le mode développeur permettent de brancher ChatGPT à des serveurs MCP externes.",
      lien: "https://modelcontextprotocol.io",
    },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Accès aux modèles standards, recherche web et images avec des limites d'usage." },
      { nom: "Plus", prix: "20 € / mois", inclus: "Modèles avancés, limites élargies, GPTs, analyse de données et modes vocaux." },
      { nom: "Pro", prix: "200 € / mois", inclus: "Accès quasi illimité aux modèles de raisonnement les plus lourds." },
      { nom: "Team", prix: "~25 € / utilisateur / mois", inclus: "Espace de travail partagé, administration et exclusion de l'entraînement." },
    ],
    verdict:
      "Si tu ne dois avoir qu'un seul abonnement IA, c'est probablement celui-là : ChatGPT couvre le plus large spectre d'usages avec la meilleure prise en main. Il se fait dépasser sur des points précis — Claude sur la rédaction longue et le code, Perplexity sur la recherche sourcée — mais reste la valeur sûre polyvalente. Pense à vérifier le réglage d'entraînement sur les données si tu y mets du contenu client.",
    faq: [
      { question: "ChatGPT est-il gratuit ?", reponse: "Oui, avec des limites d'usage. La formule Plus à 20 €/mois débloque les modèles avancés et des quotas nettement plus élevés." },
      { question: "ChatGPT s'entraîne-t-il sur mes conversations ?", reponse: "Sur les comptes grand public, oui par défaut. Tu peux le désactiver dans les réglages de données, et les offres Team/Enterprise l'excluent d'office." },
      { question: "Quelle différence avec Claude ?", reponse: "ChatGPT est plus polyvalent (images, voix, recherche). Claude est plus solide sur la rédaction longue, l'analyse de gros documents et le code." },
      { question: "Peut-on l'utiliser en entreprise en Europe ?", reponse: "Oui, via les offres Team/Enterprise avec DPA et clauses contractuelles types, mais l'hébergement reste hors UE." },
    ],
  },

  mistral: {
    slug: "mistral",
    nom: "Mistral AI",
    logo: "Mistral",
    tagline: "L'IA française, rapide et hébergée en Europe.",
    tags: ["Chatbots", "Souverain"],
    notes: { fonctionnalites: 7, facilite: 7.5, valeur: 8.5, confiance: 8.5 },
    ctaLabel: "Essayer Le Chat →",
    ctaUrl: "https://chat.mistral.ai",
    testeLe: "9 août 2026",
    essentiel:
      "Mistral AI est l'acteur européen de référence des modèles de langage. Son assistant Le Chat est rapide, hébergé en Europe, et une partie de ses modèles est publiée en open weights. C'est le choix évident quand la souveraineté des données pèse dans la décision.",
    quEstCe: [
      "Mistral AI développe une famille de modèles de langage (Mistral Large, Small, Codestral pour le code, Pixtral pour la vision) accessibles via l'assistant Le Chat, une API et, pour certains, en téléchargement libre pour être exécutés sur ta propre infrastructure.",
      "Le Chat offre l'essentiel d'un assistant moderne : recherche web, analyse de documents, génération d'images, agents personnalisés et exécution de code, le tout avec des temps de réponse parmi les plus rapides du marché.",
    ],
    quiEstDerriere:
      "Mistral AI a été fondée en 2023 à Paris par d'anciens chercheurs de Meta et DeepMind (Arthur Mensch, Guillaume Lample, Timothée Lacroix). C'est aujourd'hui le champion européen de l'IA générative, avec un positionnement assumé sur l'ouverture et la souveraineté.",
    pourQui: {
      idealPour:
        "Les organisations françaises et européennes soumises à des exigences RGPD fortes, et tous ceux qui veulent des réponses rapides à coût maîtrisé.",
      aEviterSi:
        "Tu cherches le meilleur niveau absolu en raisonnement complexe ou l'écosystème le plus riche en intégrations tierces.",
    },
    demarrage: [
      {
        titre: "Choisis ton point d'entrée",
        description:
          "Le Chat pour un usage conversationnel, l'API pour intégrer Mistral dans un produit — les deux donnent accès aux mêmes modèles.",
      },
      {
        titre: "Active le mode Flash pour le quotidien",
        description:
          "Pour les questions courantes, le mode rapide donne des réponses quasi instantanées sans sacrifier l'essentiel.",
      },
      {
        titre: "Teste Codestral dans ton éditeur",
        description:
          "L'extension IDE branche le modèle spécialisé code directement dans ton flux de développement, pour la complétion et la génération.",
      },
      {
        titre: "Crée un agent avec des instructions persistantes",
        description:
          "Un agent personnalisé garde un rôle et des règles fixes d'une conversation à l'autre, sans les répéter.",
      },
      {
        titre: "Vérifie si l'open weights te concerne",
        description:
          "Si la souveraineté est critique, certains modèles Mistral sont téléchargeables et exécutables sur ta propre infrastructure.",
      },
      {
        titre: "Connecte un MCP si besoin de données externes",
        description:
          "Le Chat et l'API supportent les connecteurs MCP pour brancher une source de données tierce à l'agent.",
      },
    ],
    fonctionnalites: [
      { titre: "Hébergement européen", description: "Infrastructure et traitement des données en Europe, avec un cadre RGPD natif plutôt que par clauses de transfert." },
      { titre: "Modèles ouverts", description: "Plusieurs modèles sont publiés en open weights et peuvent être auto-hébergés, y compris en environnement isolé." },
      { titre: "Vitesse de réponse", description: "Le Chat est l'un des assistants les plus rapides, avec un mode Flash pensé pour les réponses quasi instantanées." },
      { titre: "Codestral", description: "Un modèle spécialisé code, intégrable dans les IDE pour la complétion et la génération." },
      { titre: "Agents et connecteurs", description: "Création d'agents personnalisés capables d'appeler des outils externes et de suivre des instructions persistantes." },
      { titre: "Analyse documentaire", description: "Lecture de PDF, images et tableurs, avec un moteur OCR maison pour les documents scannés." },
    ],
    workflows: [
      {
        declencheur: "Une question urgente en pleine journée de travail",
        resultat: "Une réponse quasi instantanée",
        description:
          "Le mode Flash de Le Chat privilégie la vitesse sans sortir du raisonnable pour les questions courantes.",
        outils: ["Le Chat"],
      },
      {
        declencheur: "Un document scanné illisible par un moteur classique",
        resultat: "Un texte exploitable",
        description:
          "L'OCR maison de Mistral extrait le texte des documents scannés directement dans la conversation.",
        outils: ["Le Chat"],
      },
      {
        declencheur: "Une fonction à écrire dans l'IDE",
        resultat: "Une complétion pertinente",
        description:
          "Codestral s'intègre à l'éditeur pour proposer complétion et génération de code en contexte.",
        outils: ["Codestral"],
      },
      {
        declencheur: "Un besoin d'agent métier avec accès à des outils",
        resultat: "Un agent Mistral autonome",
        description:
          "Les agents personnalisés peuvent appeler des outils externes et suivre des instructions persistantes.",
        outils: ["Agents Mistral"],
      },
      {
        declencheur: "Des données clients sensibles à traiter",
        resultat: "Un traitement 100 % hébergé en UE",
        description:
          "L'infrastructure française de Mistral évite tout transfert hors Union européenne, sans montage contractuel.",
        outils: ["Le Chat"],
      },
    ],
    limites: [
      { titre: "Un cran en dessous sur le raisonnement", description: "Sur les tâches les plus complexes, les modèles restent en retrait par rapport aux meilleurs modèles américains." },
      { titre: "Écosystème plus jeune", description: "Moins d'intégrations tierces, d'extensions et de ressources communautaires que ChatGPT ou Claude." },
      { titre: "Documentation en évolution rapide", description: "La gamme de modèles change vite, ce qui demande de revérifier régulièrement quel modèle utiliser." },
    ],
    conformite: {
      hebergement: "Union européenne (France)",
      rgpd: "Conforme, données traitées en UE",
      aiAct: "Alignement affiché sur le règlement européen",
      entrainement: "Désactivable ; exclu sur les offres pro",
      note: "Mistral AI est une société française : les données restent en Europe, sans transfert hors UE nécessaire. C'est l'argument central pour les administrations et les secteurs régulés.",
    },
    mcp: { disponible: true, officiel: true, note: "Le Chat et l'API supportent les connecteurs MCP pour brancher des sources de données externes.", lien: "https://docs.mistral.ai" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Accès à Le Chat avec des limites d'usage quotidiennes." },
      { nom: "Pro", prix: "~15 € / mois", inclus: "Limites élargies, modèles avancés, fonctionnalités agents." },
      { nom: "Team", prix: "~25 € / utilisateur / mois", inclus: "Espace partagé, administration et bibliothèques d'équipe." },
      { nom: "API", prix: "À l'usage", inclus: "Facturation au token, tarifs parmi les plus bas du marché." },
    ],
    verdict:
      "Mistral n'est pas le modèle le plus puissant du marché, et ce n'est pas son terrain de jeu. Sa proposition est claire : rapide, abordable, hébergé en Europe, avec des modèles ouverts en option. Pour tout ce qui touche à des données clients ou à un contexte public, c'est le premier réflexe à avoir — quitte à garder Claude ou ChatGPT à côté pour les tâches les plus exigeantes.",
    faq: [
      { question: "Mes données restent-elles en Europe ?", reponse: "Oui, Mistral traite et héberge les données en Union européenne, sans transfert hors UE nécessaire." },
      { question: "Peut-on auto-héberger les modèles ?", reponse: "Une partie de la gamme est publiée en open weights et peut tourner sur ta propre infrastructure, y compris hors ligne." },
      { question: "Le Chat est-il gratuit ?", reponse: "Oui avec des limites quotidiennes ; la formule Pro autour de 15 €/mois élargit l'usage." },
    ],
  },

  perplexity: {
    slug: "perplexity",
    nom: "Perplexity AI",
    logo: "Perplexity",
    tagline: "Le moteur de réponse IA qui cite toujours ses sources.",
    tags: ["Recherche", "IA générative"],
    notes: { fonctionnalites: 7.5, facilite: 8.5, valeur: 7, confiance: 7.5 },
    ctaLabel: "Essayer Perplexity →",
    ctaUrl: "https://www.perplexity.ai",
    testeLe: "9 août 2026",
    essentiel:
      "Perplexity remplace la recherche Google pour les questions qui demandent une synthèse. Chaque réponse est construite à partir de pages web réelles, avec les sources numérotées en regard de chaque affirmation. Gratuit pour un usage courant, 20 €/mois pour la version Pro et ses recherches approfondies.",
    quEstCe: [
      "Perplexity est un moteur de réponse : au lieu d'une liste de liens, tu obtiens une synthèse rédigée avec des notes de bas de page cliquables. Le modèle interroge le web en direct, lit les pages retenues et compose la réponse à partir de leur contenu.",
      "Au-delà de la recherche simple, l'outil propose un mode Recherche approfondie qui enchaîne plusieurs requêtes pour produire un rapport structuré, et des Spaces pour regrouper des recherches et des fichiers autour d'un même sujet.",
    ],
    quiEstDerriere:
      "Perplexity AI a été fondée en 2022 à San Francisco par Aravind Srinivas, ancien chercheur d'OpenAI. L'entreprise s'est imposée rapidement comme l'alternative crédible aux moteurs de recherche traditionnels sur les requêtes complexes.",
    pourQui: {
      idealPour: "La veille, la recherche factuelle, l'analyse concurrentielle et tout travail où l'on doit pouvoir remonter à la source.",
      aEviterSi: "Tu cherches un assistant de rédaction créative ou un partenaire de travail sur des documents longs.",
    },
    demarrage: [
      {
        titre: "Pose ta première question factuelle",
        description:
          "Observe comment chaque affirmation renvoie à une source cliquable — c'est le réflexe à prendre avant de faire confiance à la réponse.",
      },
      {
        titre: "Passe en Recherche approfondie pour un vrai sujet",
        description:
          "Quand la question mérite plus qu'une réponse courte, ce mode enchaîne les requêtes pour produire un rapport structuré.",
      },
      {
        titre: "Crée un Space pour une veille récurrente",
        description:
          "Regroupe recherches, fichiers et instructions autour d'un sujet que tu suis dans la durée.",
      },
      {
        titre: "Choisis le modèle sous-jacent en Pro",
        description:
          "Sélectionne Claude, GPT ou un autre modèle selon le type de question posée.",
      },
      {
        titre: "Téléverse un document pour l'interroger",
        description:
          "Un PDF ou un tableur devient une source au même titre que le web, avec citations précises.",
      },
      {
        titre: "Installe Comet si tu veux l'assistant partout",
        description:
          "Le navigateur maison intègre Perplexity directement dans la navigation quotidienne.",
      },
    ],
    fonctionnalites: [
      { titre: "Sources citées systématiquement", description: "Chaque affirmation renvoie à une page web identifiée, ce qui permet de vérifier au lieu de faire confiance." },
      { titre: "Recherche approfondie", description: "Enchaîne des dizaines de requêtes pour produire un rapport structuré sur un sujet, en quelques minutes." },
      { titre: "Spaces", description: "Regroupe recherches, fichiers et instructions autour d'un sujet récurrent, partageable en équipe." },
      { titre: "Choix du modèle", description: "En Pro, on choisit le modèle sous-jacent (Claude, GPT, Gemini…) selon le type de question." },
      { titre: "Recherche sur tes fichiers", description: "Téléverse des PDF ou tableurs pour les interroger au même titre que le web." },
      { titre: "Navigateur Comet", description: "Un navigateur maison qui intègre l'assistant directement dans la navigation." },
    ],
    workflows: [
      {
        declencheur: "Un sujet de veille à suivre dans la durée",
        resultat: "Un Space centralisant recherches et fichiers",
        description:
          "Toutes les recherches sur un même sujet restent groupées, avec l'historique et les documents associés.",
        outils: ["Spaces"],
      },
      {
        declencheur: "Une question concurrentielle complexe",
        resultat: "Un rapport structuré et sourcé",
        description:
          "La Recherche approfondie enchaîne les requêtes nécessaires et compose un vrai rapport, pas une réponse courte.",
        outils: ["Recherche approfondie"],
      },
      {
        declencheur: "Un PDF fournisseur ou un contrat",
        resultat: "Une réponse vérifiable à partir du document",
        description:
          "Le fichier téléversé devient une source interrogeable au même titre qu'une page web.",
        outils: ["Fichiers"],
      },
      {
        declencheur: "Une actualité sectorielle à surveiller",
        resultat: "Une synthèse envoyée automatiquement",
        description:
          "En combinant l'API Perplexity avec Zapier, une recherche programmée peut alimenter un canal Slack ou un e-mail.",
        outils: ["API", "Zapier"],
      },
      {
        declencheur: "Une question à trancher en réunion",
        resultat: "Une réponse avec sources partageables en direct",
        description:
          "Le lien de la réponse, citations incluses, se partage tel quel pour trancher sans débat sur la fiabilité.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Dépendant de la qualité des sources", description: "Si les pages trouvées sont médiocres, la synthèse l'est aussi : les citations rassurent mais ne valident pas le fond." },
      { titre: "Faible sur la création", description: "Ce n'est pas un outil de rédaction longue ni de travail itératif sur un document." },
      { titre: "Contenu francophone moins bien couvert", description: "Les sources anglophones sont privilégiées, ce qui peut biaiser les réponses sur des sujets franco-français." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Droits RGPD standards, DPA sur les offres Enterprise",
      aiAct: "Pas de cadre public détaillé",
      entrainement: "Désactivable dans les réglages",
      note: "Perplexity est une société américaine. Le mode Incognito et l'option d'exclusion de l'entraînement limitent la conservation, mais les données transitent hors UE.",
    },
    mcp: { disponible: true, officiel: true, note: "Perplexity expose un serveur MCP de recherche, permettant à un agent comme Claude d'utiliser son moteur pour aller chercher des sources.", lien: "https://docs.perplexity.ai" },
    tarifs: [
      { nom: "Standard", prix: "Gratuit", inclus: "Recherches illimitées en mode simple, quelques recherches Pro par jour." },
      { nom: "Pro", prix: "20 € / mois", inclus: "Recherches Pro élargies, choix du modèle, recherche approfondie, upload de fichiers." },
      { nom: "Max", prix: "~200 € / mois", inclus: "Quotas maximum, accès prioritaire aux nouveautés et modèles les plus lourds." },
    ],
    verdict:
      "Perplexity a gagné une place fixe dans mon quotidien pour une raison simple : quand je dois pouvoir citer, je n'ouvre pas ChatGPT. La version gratuite couvre déjà beaucoup de besoins ; le Pro se justifie surtout pour la recherche approfondie, qui remplace vraiment une demi-journée de veille. À utiliser en complément, pas en remplacement, d'un assistant généraliste.",
    faq: [
      { question: "En quoi c'est différent de Google ?", reponse: "Google renvoie des liens, Perplexity rédige la réponse à partir de ces liens et cite chaque source utilisée." },
      { question: "Les sources sont-elles fiables ?", reponse: "Elles sont réelles et vérifiables, mais leur qualité varie : le réflexe reste de cliquer sur les citations importantes." },
      { question: "La version gratuite suffit-elle ?", reponse: "Pour de la recherche courante, oui. Le Pro devient utile dès que tu fais de la veille structurée ou des rapports." },
    ],
  },

  figma: {
    slug: "figma",
    nom: "Figma",
    logo: "Figma",
    tagline: "Le standard du design d'interface : maquettes, prototypes et design system.",
    tags: ["Maquettes & UI", "Collaboration"],
    notes: { fonctionnalites: 9, facilite: 7, valeur: 7.5, confiance: 8.5 },
    ctaLabel: "Essayer Figma →",
    ctaUrl: "https://www.figma.com",
    testeLe: "9 août 2026",
    essentiel:
      "Figma est l'outil de référence pour concevoir une interface : maquettes, prototypes cliquables, design system partagé, le tout collaboratif en temps réel dans le navigateur. Gratuit pour les petits projets, environ 15 €/mois par éditeur ensuite.",
    quEstCe: [
      "Figma est un éditeur de design vectoriel pensé pour l'interface : on y dessine des écrans, on les relie en prototype, on documente les composants réutilisables, et plusieurs personnes travaillent sur le même fichier simultanément.",
      "L'écosystème s'est élargi avec FigJam pour les ateliers et le brainstorming, Figma Slides pour les présentations, et Dev Mode qui expose les mesures, tokens et bouts de code destinés aux développeurs.",
    ],
    quiEstDerriere:
      "Figma a été fondée en 2012 par Dylan Field et Evan Wallace. Après un rachat par Adobe abandonné en 2023, l'entreprise est restée indépendante et est entrée en bourse en 2025.",
    pourQui: {
      idealPour: "Concevoir une interface à plusieurs, maintenir un design system, et transmettre proprement des maquettes au développement.",
      aEviterSi: "Tu as juste besoin de visuels marketing rapides — Canva est plus direct — ou d'un outil de retouche photo.",
    },
    demarrage: [
      {
        titre: "Explore Auto Layout avant de dessiner",
        description:
          "Comprendre comment les cadres se réagencent comme du CSS Flexbox évite de tout refaire une fois les premières maquettes posées.",
      },
      {
        titre: "Construis 3 ou 4 composants réutilisables",
        description:
          "Poser les bases d'un design system dès le départ, même minimal, structure tout ce qui suit.",
      },
      {
        titre: "Relie tes écrans en prototype",
        description:
          "Enchaîne quelques transitions pour tester un parcours avant d'écrire la moindre ligne de code.",
      },
      {
        titre: "Ouvre Dev Mode et regarde ce qu'il expose",
        description:
          "Mesures, variables et extraits de code : comprendre ce que récupère un développeur change la façon de nommer et structurer tes calques.",
      },
      {
        titre: "Connecte le serveur MCP officiel",
        description:
          "Une fois branché, un agent comme Claude Code peut lire directement une maquette pour en produire le code.",
      },
      {
        titre: "Essaie FigJam pour un atelier",
        description:
          "Utile dès qu'il s'agit de brainstormer ou cadrer un projet à plusieurs avant de passer aux maquettes.",
      },
    ],
    fonctionnalites: [
      { titre: "Collaboration temps réel", description: "Plusieurs curseurs sur le même fichier, commentaires ancrés et historique de versions : la revue de design se fait dans l'outil." },
      { titre: "Composants et variantes", description: "Un design system vivant : les composants se propagent à toutes les maquettes qui les utilisent." },
      { titre: "Auto Layout", description: "Des maquettes qui se réagencent comme du CSS Flexbox, indispensable pour le responsive." },
      { titre: "Prototypage interactif", description: "Enchaîne les écrans avec transitions et états pour tester un parcours avant d'écrire une ligne de code." },
      { titre: "Dev Mode", description: "Vue dédiée aux développeurs : mesures, variables, tokens et extraits de code prêts à reprendre." },
      { titre: "Figma Make et IA", description: "Génération de maquettes et de premières versions d'interface à partir d'une description." },
    ],
    workflows: [
      {
        declencheur: "Une maquette validée en revue",
        resultat: "Une première implémentation en code",
        description:
          "Le serveur MCP Figma donne à Claude Code accès direct à la structure de la maquette pour générer l'interface correspondante.",
        outils: ["MCP Figma", "Claude Code"],
      },
      {
        declencheur: "Un brief client décrit en quelques lignes",
        resultat: "Un prototype cliquable en une session",
        description:
          "Figma Make génère une première version d'interface à partir d'une description, à affiner ensuite à la main.",
        outils: ["Figma Make"],
      },
      {
        declencheur: "Un composant modifié dans la bibliothèque",
        resultat: "Toutes les maquettes qui l'utilisent mises à jour",
        description:
          "Les variantes et composants se propagent automatiquement partout où ils sont utilisés.",
        outils: [],
      },
      {
        declencheur: "Une session de brainstorm en équipe",
        resultat: "Des idées organisées en tableau visuel",
        description:
          "FigJam capture le brut d'un atelier avant qu'il ne devienne des maquettes structurées.",
        outils: ["FigJam"],
      },
      {
        declencheur: "Une maquette figée pour développement",
        resultat: "Des specs et tokens prêts pour le développeur",
        description:
          "Dev Mode expose mesures, variables et extraits de code directement exploitables.",
        outils: ["Dev Mode"],
      },
    ],
    limites: [
      { titre: "Courbe d'apprentissage réelle", description: "Auto Layout, contraintes et variables demandent plusieurs semaines pour être maîtrisés." },
      { titre: "Coût qui grimpe en équipe", description: "La facturation par siège éditeur devient significative dès qu'on dépasse quelques designers." },
      { titre: "Dépendant du navigateur", description: "Les gros fichiers peuvent ralentir, et le mode hors ligne reste limité." },
    ],
    conformite: {
      hebergement: "États-Unis (option UE en Enterprise)",
      rgpd: "Conforme via DPA",
      aiAct: "Fonctions IA documentées, désactivables",
      entrainement: "Désactivable au niveau organisation",
      note: "Figma propose un DPA et des clauses contractuelles types. L'entraînement des fonctions IA sur le contenu des fichiers peut être désactivé au niveau de l'organisation.",
    },
    mcp: { disponible: true, officiel: true, note: "Figma publie un serveur MCP officiel : un agent comme Claude Code peut lire une maquette et en extraire la structure pour générer le code correspondant.", lien: "https://www.figma.com/developers" },
    tarifs: [
      { nom: "Starter", prix: "Gratuit", inclus: "3 fichiers de design, collaborateurs illimités en lecture." },
      { nom: "Professional", prix: "~15 € / éditeur / mois", inclus: "Fichiers illimités, bibliothèques partagées, Dev Mode." },
      { nom: "Organization", prix: "~45 € / éditeur / mois", inclus: "Design system centralisé, analytics et administration avancée." },
    ],
    verdict:
      "Figma reste l'outil qu'on ne remplace pas : le rapport entre ce qu'il permet et ce que coûtent les alternatives n'a pas d'équivalent. Le vrai gain récent, c'est le serveur MCP — pouvoir demander à un agent de lire directement une maquette pour en produire le code change la façon de travailler entre design et développement. Prévois du temps d'apprentissage : c'est un outil profond, pas un éditeur de visuels rapide.",
    faq: [
      { question: "Figma est-il gratuit ?", reponse: "Oui pour trois fichiers de design, ce qui suffit à un projet solo. Au-delà, il faut compter environ 15 €/mois par éditeur." },
      { question: "Faut-il être designer pour l'utiliser ?", reponse: "Non pour commenter ou consulter. Oui, en pratique, pour construire des maquettes propres avec Auto Layout et composants." },
      { question: "Peut-on générer du code depuis Figma ?", reponse: "Dev Mode donne des extraits utilisables, et le serveur MCP permet à un agent IA de lire la maquette pour produire du code cohérent." },
    ],
  },

  canva: {
    slug: "canva",
    nom: "Canva",
    logo: "Canva",
    tagline: "La création graphique rapide : visuels, présentations et réseaux sociaux.",
    tags: ["Design graphique", "Productivité"],
    notes: { fonctionnalites: 8, facilite: 9.5, valeur: 8, confiance: 8 },
    ctaLabel: "Essayer Canva →",
    ctaUrl: "https://www.canva.com",
    testeLe: "9 août 2026",
    essentiel:
      "Canva permet de produire un visuel correct en quelques minutes sans compétence en design, grâce à des milliers de modèles et à une interface glisser-déposer. Gratuit dans une version déjà complète, environ 12 €/mois pour Canva Pro et sa Brand Kit.",
    quEstCe: [
      "Canva est un éditeur graphique en ligne construit autour des modèles : tu pars d'une mise en page existante — post Instagram, présentation, affiche, CV — et tu remplaces textes et images. Tout se fait dans le navigateur, sans installation.",
      "La suite s'est élargie bien au-delà du visuel : présentations animées, montage vidéo simple, documents, sites web d'une page, et une couche IA (Magic Studio) pour générer des images, effacer un fond ou réécrire un texte.",
    ],
    quiEstDerriere:
      "Canva a été fondée en 2013 en Australie par Melanie Perkins, Cliff Obrecht et Cameron Adams. C'est aujourd'hui l'une des plus grosses entreprises de logiciel non américaines, avec des centaines de millions d'utilisateurs.",
    pourQui: {
      idealPour: "Les indépendants, TPE et équipes marketing qui doivent produire beaucoup de visuels cohérents sans passer par un designer.",
      aEviterSi: "Tu conçois des interfaces produit ou tu as besoin d'un contrôle typographique fin : Figma ou la suite Adobe sont plus adaptés.",
    },
    demarrage: [
      {
        titre: "Configure ton Brand Kit avant tout",
        description:
          "Logo, couleurs et polices centralisés une fois pour éviter la dérive graphique sur chaque nouveau visuel.",
      },
      {
        titre: "Pars d'un modèle proche de ton besoin",
        description:
          "Adapter un modèle existant va toujours plus vite qu'une page blanche, à condition de le personnaliser vraiment.",
      },
      {
        titre: "Teste Magic Studio sur un visuel existant",
        description:
          "Suppression de fond ou génération d'image : une façon rapide de voir ce que la couche IA apporte concrètement.",
      },
      {
        titre: "Programme tes publications",
        description:
          "Planifie la sortie d'un visuel directement vers les réseaux sociaux depuis Canva.",
      },
      {
        titre: "Mets en place un circuit de validation",
        description:
          "Dès que plusieurs personnes produisent, les commentaires et l'approbation évitent les allers-retours par e-mail.",
      },
      {
        titre: "Connecte le MCP Canva si tu utilises un agent IA",
        description:
          "Un assistant comme Claude peut alors créer ou modifier un design à partir d'une instruction.",
      },
    ],
    fonctionnalites: [
      { titre: "Bibliothèque de modèles", description: "Des centaines de milliers de mises en page prêtes à l'emploi, dimensionnées pour chaque support." },
      { titre: "Brand Kit", description: "Centralise logos, couleurs et polices de la marque pour garder une cohérence sur tous les visuels." },
      { titre: "Magic Studio", description: "Suite IA : génération d'images, suppression d'arrière-plan, redimensionnement automatique, réécriture de texte." },
      { titre: "Vidéo et animation", description: "Montage simple, transitions et animations de texte, suffisants pour les réseaux sociaux." },
      { titre: "Collaboration et validation", description: "Commentaires, partage et circuits d'approbation pour valider un visuel en équipe." },
      { titre: "Export et planification", description: "Export multi-formats et publication programmée directement vers les réseaux sociaux." },
    ],
    workflows: [
      {
        declencheur: "Un brief visuel décrit à Claude",
        resultat: "Un visuel généré dans Canva",
        description:
          "Le connecteur MCP Canva permet à l'agent de créer directement le design à partir de l'instruction.",
        outils: ["MCP Canva"],
      },
      {
        declencheur: "Une photo produit brute",
        resultat: "Un visuel prêt pour les réseaux",
        description:
          "Magic Studio retire le fond et redimensionne automatiquement pour chaque format social.",
        outils: ["Magic Studio"],
      },
      {
        declencheur: "Un post à décliner sur 5 formats",
        resultat: "Un seul design, redimensionné partout",
        description:
          "Le redimensionnement magique adapte automatiquement la mise en page à chaque plateforme.",
        outils: [],
      },
      {
        declencheur: "Un visuel à valider avant publication",
        resultat: "Un circuit d'approbation tracé",
        description:
          "Commentaires et validation intégrés évitent de faire circuler des fichiers par e-mail.",
        outils: [],
      },
      {
        declencheur: "Une campagne qui revient chaque mois",
        resultat: "Un calendrier de publication automatisé",
        description:
          "La publication programmée diffuse les visuels aux dates prévues sans intervention manuelle.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Effet « déjà vu »", description: "Les modèles étant très utilisés, un visuel peu retravaillé ressemble à des milliers d'autres." },
      { titre: "Contrôle typographique limité", description: "Peu de finesse sur le crénage, la grille et la gestion typographique avancée." },
      { titre: "Fonctions clés réservées au Pro", description: "Brand Kit, suppression d'arrière-plan et redimensionnement magique nécessitent l'abonnement." },
    ],
    conformite: {
      hebergement: "Australie / États-Unis",
      rgpd: "Conforme via DPA",
      aiAct: "Fonctions IA identifiées dans l'interface",
      entrainement: "Contenus utilisateurs exclus par défaut",
      note: "Canva applique un DPA et des clauses contractuelles types pour les transferts. Les designs des utilisateurs ne sont pas utilisés pour entraîner les modèles génératifs sans consentement explicite.",
    },
    mcp: { disponible: true, officiel: true, note: "Canva propose un connecteur MCP permettant à un assistant IA de créer et modifier des designs à partir d'une instruction.", lien: "https://www.canva.dev" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Modèles de base, 5 Go de stockage, édition et export standards." },
      { nom: "Pro", prix: "~12 € / mois", inclus: "Brand Kit, Magic Studio complet, modèles premium, 1 To de stockage." },
      { nom: "Teams", prix: "~10 € / utilisateur / mois", inclus: "Espace partagé, validation, gestion des droits d'équipe." },
    ],
    verdict:
      "Canva ne remplacera jamais un vrai travail de direction artistique, mais ce n'est pas la question : il fait gagner un temps considérable sur les 80 % de visuels courants. Le Brand Kit du Pro est ce qui fait réellement la différence, parce qu'il empêche la dérive graphique quand plusieurs personnes produisent. Le piège à éviter : rester collé aux modèles sans les adapter à ta marque.",
    faq: [
      { question: "La version gratuite suffit-elle ?", reponse: "Pour un usage occasionnel, oui. Dès que tu produis régulièrement pour une marque, le Brand Kit du Pro devient vite indispensable." },
      { question: "Peut-on utiliser les visuels commercialement ?", reponse: "Oui, sous réserve des conditions de licence Canva, notamment pour les éléments premium et les images sous licence." },
      { question: "Canva remplace-t-il Figma ?", reponse: "Non : Canva sert la communication visuelle, Figma la conception d'interfaces et les design systems." },
    ],
  },

  midjourney: {
    slug: "midjourney",
    nom: "Midjourney",
    logo: "Midjourney",
    tagline: "Le générateur d'images IA à la qualité artistique la plus reconnaissable.",
    tags: ["Images", "IA générative"],
    notes: { fonctionnalites: 8.5, facilite: 6, valeur: 6.5, confiance: 7.5 },
    ctaLabel: "Essayer Midjourney →",
    ctaUrl: "https://www.midjourney.com",
    testeLe: "9 août 2026",
    essentiel:
      "Midjourney reste la référence sur la qualité esthétique des images générées : lumière, matière et composition y sont d'un autre niveau. En contrepartie, aucune formule gratuite (à partir de 10 $/mois), une syntaxe de paramètres à apprendre et un contrôle moins précis que les concurrents.",
    quEstCe: [
      "Midjourney génère des images à partir d'une description textuelle. Historiquement piloté depuis Discord, il dispose désormais d'une application web complète avec galerie, éditeur et gestion des styles.",
      "Sa singularité est esthétique : là où d'autres modèles produisent des images correctes mais neutres, Midjourney impose un rendu travaillé — c'est un atout pour l'illustration et le moodboard, un défaut quand on veut un visuel strictement neutre.",
    ],
    quiEstDerriere:
      "Midjourney est un laboratoire indépendant fondé en 2021 par David Holz, cofondateur de Leap Motion. L'entreprise est autofinancée, avec une équipe volontairement réduite et aucune levée de fonds externe.",
    pourQui: {
      idealPour: "L'illustration, les moodboards, les univers visuels de marque et tout ce qui demande une image avec du caractère.",
      aEviterSi: "Tu as besoin de texte lisible dans l'image, de rendus strictement fidèles à un brief technique, ou d'un usage gratuit.",
    },
    demarrage: [
      {
        titre: "Lance ta première génération simple",
        description:
          "Pas de formule gratuite : choisis un plan, puis commence par un prompt court pour comprendre le style par défaut.",
      },
      {
        titre: "Apprends 3 ou 4 paramètres clés",
        description:
          "--ar pour le ratio, --stylize pour l'intensité artistique, --chaos pour la variété : ça suffit pour commencer à diriger le résultat.",
      },
      {
        titre: "Crée une référence de style",
        description:
          "Fixe une direction artistique cohérente que tu pourras réutiliser sur plusieurs images.",
      },
      {
        titre: "Utilise l'éditeur intégré pour retoucher",
        description:
          "Corriger une zone coûte moins cher et va plus vite que régénérer l'image entière.",
      },
      {
        titre: "Passe en mode privé si nécessaire",
        description:
          "Sur les formules Pro et supérieures, tes générations ne sont plus visibles dans la galerie publique.",
      },
      {
        titre: "Prévois un second outil pour le texte",
        description:
          "Midjourney reste peu fiable sur le texte dans l'image : ajoute-le ensuite dans Canva ou Figma.",
      },
    ],
    fonctionnalites: [
      { titre: "Qualité esthétique", description: "Le rendu de lumière, de matière et de composition reste la meilleure référence du marché sur l'image artistique." },
      { titre: "Références de style et de personnage", description: "Les paramètres de référence permettent de garder un style ou un personnage cohérent d'une image à l'autre." },
      { titre: "Éditeur intégré", description: "Retouche par zones, extension du cadre (outpainting) et variations localisées directement dans l'app web." },
      { titre: "Paramètres fins", description: "Ratio, niveau de stylisation, chaos, poids d'image : un contrôle précis pour qui prend le temps de l'apprendre." },
      { titre: "Moodboards", description: "Regroupe des références visuelles pour orienter le modèle vers une direction artistique donnée." },
      { titre: "Génération vidéo", description: "Animation courte à partir d'une image générée, pour des usages sociaux." },
    ],
    workflows: [
      {
        declencheur: "Une direction artistique à définir",
        resultat: "Un moodboard de références cohérentes",
        description:
          "Les références de style regroupées orientent le modèle vers une identité visuelle stable.",
        outils: [],
      },
      {
        declencheur: "Une image générée à finaliser",
        resultat: "Un visuel complet avec texte lisible",
        description:
          "L'image sert de base, le texte final s'ajoute ensuite dans un outil dédié.",
        outils: ["Canva"],
      },
      {
        declencheur: "Un personnage à réutiliser sur plusieurs visuels",
        resultat: "Une cohérence de personnage maintenue",
        description:
          "La référence de personnage garde les traits identiques d'une génération à l'autre.",
        outils: [],
      },
      {
        declencheur: "Un visuel à décliner en variations",
        resultat: "Plusieurs versions ciblées",
        description:
          "Les variations localisées modifient une zone précise sans regénérer l'ensemble.",
        outils: [],
      },
      {
        declencheur: "Une image statique qui doit vivre",
        resultat: "Une courte animation",
        description:
          "La génération vidéo transforme l'image fixe en clip court pour les usages sociaux.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Aucune offre gratuite", description: "Il faut payer dès la première image, sans période d'essai réelle." },
      { titre: "Texte dans l'image peu fiable", description: "Les mots générés restent souvent déformés : mieux vaut ajouter le texte ensuite dans un autre outil." },
      { titre: "Images publiques par défaut", description: "Sur les formules d'entrée, les générations sont visibles dans la galerie communautaire ; le mode privé est réservé aux offres supérieures." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Droits standards, pas de DPA grand public",
      aiAct: "Peu de documentation publique",
      entrainement: "Générations utilisées pour l'amélioration du service",
      note: "Le statut juridique des données d'entraînement fait l'objet de contentieux aux États-Unis. Pour un usage commercial sensible, vérifie les conditions de licence de ta formule et le mode privé.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel : l'intégration passe par des solutions tierces non supportées." },
    tarifs: [
      { nom: "Basic", prix: "10 $ / mois", inclus: "Environ 200 générations par mois, mode rapide limité." },
      { nom: "Standard", prix: "30 $ / mois", inclus: "15 h de mode rapide et générations illimitées en mode relax." },
      { nom: "Pro", prix: "60 $ / mois", inclus: "30 h de mode rapide et mode privé (images non publiques)." },
      { nom: "Mega", prix: "120 $ / mois", inclus: "60 h de mode rapide, mode privé, usage professionnel intensif." },
    ],
    verdict:
      "Midjourney garde une avance nette sur la beauté des images, et c'est la seule raison de le choisir — sur tous les autres critères (prix, contrôle, intégration, texte), les concurrents font mieux. Si l'image est au cœur de ton activité, l'abonnement Standard se rentabilise vite. Sinon, la génération d'images de ChatGPT ou de Canva suffit largement pour un usage occasionnel.",
    faq: [
      { question: "Y a-t-il une version gratuite ?", reponse: "Non, l'abonnement démarre à 10 $/mois et il n'existe pas d'essai gratuit stable." },
      { question: "Peut-on utiliser les images commercialement ?", reponse: "Oui pour les abonnés, dans les limites des conditions d'utilisation ; les entreprises au-delà d'un certain chiffre d'affaires doivent prendre une formule supérieure." },
      { question: "Faut-il encore passer par Discord ?", reponse: "Non, l'application web permet désormais de tout faire, même si Discord reste disponible." },
    ],
  },

  "claude-code": {
    slug: "claude-code",
    nom: "Claude Code",
    logo: "ClaudeCode",
    tagline: "L'agent IA en ligne de commande : code, débogue et gère les projets dans le terminal.",
    tags: ["Code", "Agents"],
    notes: { fonctionnalites: 9, facilite: 7, valeur: 8, confiance: 8.5 },
    ctaLabel: "Installer Claude Code →",
    ctaUrl: "https://claude.com/product/claude-code",
    testeLe: "9 août 2026",
    essentiel:
      "Claude Code est l'agent de développement d'Anthropic : il vit dans ton terminal, lit ton dépôt, modifie les fichiers, exécute les tests et fait les commits. Inclus dans les abonnements Claude Pro et Max, ou facturé à l'usage via l'API.",
    quEstCe: [
      "Claude Code s'installe en ligne de commande et travaille directement dans un projet : il explore l'arborescence, comprend les conventions du code existant, applique des modifications sur plusieurs fichiers et vérifie son travail en lançant les commandes du projet.",
      "Il se pilote en langage naturel — « ajoute l'authentification », « corrige ce test qui échoue » — et se configure via un fichier d'instructions à la racine du dépôt, plus des serveurs MCP pour lui donner accès à des outils externes.",
    ],
    quiEstDerriere:
      "Claude Code est développé par Anthropic, l'éditeur de Claude, et repose sur les mêmes modèles. L'outil est aussi disponible en extension pour VS Code et JetBrains, ainsi qu'en intégration GitHub.",
    pourQui: {
      idealPour: "Les développeurs qui veulent déléguer des tâches complètes (refactoring, migration, correction de bugs) plutôt que de la complétion ligne à ligne.",
      aEviterSi: "Tu débutes en programmation : sans savoir relire le code produit, le risque d'accumuler de la dette technique est réel.",
    },
    demarrage: [
      {
        titre: "Installe l'agent à la racine d'un projet existant",
        description:
          "Claude Code explore l'arborescence et les conventions déjà en place dès la première session.",
      },
      {
        titre: "Écris un fichier d'instructions projet",
        description:
          "Stack, conventions, scripts de test : ce fichier est lu automatiquement au démarrage de chaque session.",
      },
      {
        titre: "Commence par une tâche encadrée",
        description:
          "Un fix de bug ou un petit refactor calibre la confiance avant de déléguer des tâches plus larges.",
      },
      {
        titre: "Travaille toujours sur une branche dédiée",
        description:
          "Jamais directement sur main : chaque diff doit pouvoir être relu et écarté sans risque.",
      },
      {
        titre: "Connecte les serveurs MCP utiles au projet",
        description:
          "GitHub, une base de données, Figma : chaque connecteur ajoute une source de contexte que l'agent peut interroger.",
      },
      {
        titre: "Explore les sous-agents sur les grosses tâches",
        description:
          "Utile pour paralléliser l'exploration d'une base de code ou comparer plusieurs approches.",
      },
    ],
    fonctionnalites: [
      { titre: "Accès direct au projet", description: "Lit et modifie les fichiers, lance les commandes et les tests : l'agent travaille sur le vrai dépôt, pas sur des extraits collés." },
      { titre: "Modifications multi-fichiers", description: "Gère des changements cohérents traversant plusieurs modules, ce qu'un assistant de complétion ne sait pas faire." },
      { titre: "Fichier d'instructions projet", description: "Un fichier de consignes à la racine transmet conventions, scripts et règles internes à chaque session." },
      { titre: "Support MCP natif", description: "Se connecte à Figma, Notion, une base de données ou tout serveur MCP pour aller chercher le contexte manquant." },
      { titre: "Sous-agents et tâches parallèles", description: "Délègue des sous-tâches à des agents séparés pour explorer plusieurs pistes en parallèle." },
      { titre: "Intégration Git et GitHub", description: "Crée des branches, rédige les messages de commit et ouvre des pull requests." },
    ],
    workflows: [
      {
        declencheur: "Une idée décrite en langage naturel",
        resultat: "Un site codé, poussé et déployé",
        description:
          "L'agent écrit le code, committe, pousse sur GitHub et déclenche le redéploiement dans la même session.",
        outils: ["GitHub", "Lovable"],
      },
      {
        declencheur: "Une pull request ouverte",
        resultat: "Une revue de code avant merge",
        description:
          "Exécuté hors session interactive dans une CI, l'agent relit, signale ou corrige avant validation humaine.",
        outils: ["GitHub", "CI/CD"],
      },
      {
        declencheur: "Un test qui échoue en CI",
        resultat: "Un correctif proposé et vérifié",
        description:
          "L'agent identifie la cause, applique un correctif et relance les tests jusqu'à ce qu'ils passent.",
        outils: ["CI/CD"],
      },
      {
        declencheur: "Une migration de librairie à mener",
        resultat: "Les fichiers concernés mis à jour en masse",
        description:
          "Les modifications multi-fichiers cohérentes remplacent le remplacement manuel fichier par fichier.",
        outils: [],
      },
      {
        declencheur: "Un schéma de base à faire évoluer",
        resultat: "Une migration SQL écrite et appliquée",
        description:
          "Le MCP Supabase donne à l'agent accès direct au schéma pour écrire la migration correspondante.",
        outils: ["MCP Supabase"],
      },
      {
        declencheur: "Une maquette Figma prête",
        resultat: "Une implémentation UI cohérente",
        description:
          "Le MCP Figma permet à l'agent de lire la structure de la maquette pour produire l'interface.",
        outils: ["MCP Figma"],
      },
    ],
    limites: [
      { titre: "Consommation de quota rapide", description: "Les sessions longues épuisent vite les plafonds d'usage, y compris sur les formules Max." },
      { titre: "Relecture indispensable", description: "L'agent est convaincant même quand il se trompe : chaque diff doit être relu avant d'être validé." },
      { titre: "Terminal requis", description: "L'usage suppose d'être à l'aise en ligne de commande et avec Git." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA (offres pro)",
      aiAct: "Cadre de risque publié par Anthropic",
      entrainement: "Exclu sur les offres Work/Enterprise",
      note: "Le code envoyé transite par les serveurs d'Anthropic aux États-Unis. Pour du code propriétaire sensible, privilégie une offre Work/Enterprise qui exclut l'usage des données pour l'entraînement.",
    },
    mcp: { disponible: true, officiel: true, note: "Claude Code est le client MCP de référence : ajout de serveurs en une commande, et gestion des permissions outil par outil.", lien: "https://modelcontextprotocol.io" },
    tarifs: [
      { nom: "Inclus Pro", prix: "20 € / mois", inclus: "Usage standard de Claude Code avec les plafonds de la formule Pro." },
      { nom: "Max 5x", prix: "100 € / mois", inclus: "Plafonds environ 5 fois supérieurs, adaptés à un usage quotidien." },
      { nom: "Max 20x", prix: "200 € / mois", inclus: "Plafonds environ 20 fois supérieurs, pour un usage professionnel intensif." },
      { nom: "API", prix: "À l'usage", inclus: "Facturation au token, sans plafond mais sans forfait." },
    ],
    verdict:
      "Claude Code est l'outil qui a le plus changé ma façon de développer cette année : on passe de « l'IA m'aide à écrire une fonction » à « je décris une tâche et je relis un diff ». La contrepartie est réelle — quotas qui fondent et nécessité absolue de relire — mais le gain sur les tâches répétitives et les migrations est difficile à contester. Le forfait Max 5x est le point d'équilibre pour un usage quotidien.",
    faq: [
      { question: "Faut-il un abonnement séparé ?", reponse: "Non, Claude Code est inclus dans les formules Claude Pro et Max ; l'API reste une option pour un usage à la consommation." },
      { question: "Peut-il casser mon projet ?", reponse: "Il peut se tromper, oui. Travaille sur une branche Git dédiée et relis systématiquement les modifications avant de fusionner." },
      { question: "Quelle différence avec un Copilot ?", reponse: "Copilot complète le code que tu écris ; Claude Code exécute une tâche complète de bout en bout, en modifiant plusieurs fichiers et en lançant les tests." },
    ],
  },

  supabase: {
    slug: "supabase",
    nom: "Supabase",
    logo: "Supabase",
    tagline: "Le backend open-source : base de données, auth et stockage prêts à l'emploi.",
    tags: ["Base de données", "Développement"],
    notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 8.5, confiance: 8 },
    ctaLabel: "Essayer Supabase →",
    ctaUrl: "https://supabase.com",
    testeLe: "9 août 2026",
    essentiel:
      "Supabase fournit en quelques minutes tout le back-end d'une application : base PostgreSQL, authentification, stockage de fichiers, temps réel et fonctions serveur. Open-source, généreux en gratuit, environ 25 $/mois par projet ensuite.",
    quEstCe: [
      "Supabase est une plateforme construite autour de PostgreSQL : au lieu d'un service propriétaire, tu obtiens une vraie base de données relationnelle, exposée automatiquement en API REST et temps réel, avec une console d'administration.",
      "Autour de la base viennent les briques habituelles d'un back-end : authentification (e-mail, OAuth, magic link), stockage de fichiers, fonctions serverless et une couche de sécurité par Row Level Security qui applique les règles d'accès au niveau de chaque ligne.",
    ],
    quiEstDerriere:
      "Supabase a été fondée en 2020 par Paul Copplestone et Ant Wilson, avec un positionnement d'alternative open-source à Firebase. Le cœur du produit est publié sous licence libre et peut être auto-hébergé.",
    pourQui: {
      idealPour: "Les projets web et mobiles qui veulent un back-end complet sans l'administrer, tout en gardant une vraie base SQL et la possibilité de partir ailleurs.",
      aEviterSi: "Ton besoin est un simple formulaire ou un site vitrine : la mise en place d'un back-end serait disproportionnée.",
    },
    demarrage: [
      {
        titre: "Crée un projet et choisis la région",
        description:
          "Une région européenne à la création évite d'avoir à migrer plus tard pour des raisons de souveraineté.",
      },
      {
        titre: "Modélise ton schéma avant de coder l'app",
        description:
          "L'éditeur de table visuel ou le SQL direct — le temps passé ici évite une dette de modélisation.",
      },
      {
        titre: "Active Row Level Security sur chaque table",
        description:
          "Non négociable avant la mise en production : une table sans politique est soit inaccessible, soit ouverte à tous.",
      },
      {
        titre: "Configure l'authentification",
        description:
          "E-mail, magic link ou OAuth (Google, GitHub) se règlent en quelques clics dans l'interface.",
      },
      {
        titre: "Connecte le serveur MCP officiel",
        description:
          "Un agent IA peut alors inspecter le schéma et écrire des migrations directement.",
      },
      {
        titre: "Regarde du côté des Edge Functions",
        description:
          "Pour toute logique serveur qui ne rentre pas dans une simple requête à la base.",
      },
    ],
    fonctionnalites: [
      { titre: "PostgreSQL complet", description: "Une vraie base relationnelle avec extensions, vues, triggers et fonctions SQL — pas une abstraction propriétaire." },
      { titre: "API générée automatiquement", description: "Chaque table est immédiatement accessible en REST, avec des bibliothèques clientes typées." },
      { titre: "Authentification intégrée", description: "E-mail, mot de passe, magic link et fournisseurs OAuth (Google, GitHub…) configurables en quelques clics." },
      { titre: "Row Level Security", description: "Les règles d'accès s'écrivent en SQL au niveau de la ligne : la sécurité reste dans la base, pas dans le code client." },
      { titre: "Stockage de fichiers", description: "Buckets publics ou privés avec politiques d'accès et transformation d'images." },
      { titre: "Temps réel", description: "Abonnement aux changements de la base pour synchroniser une interface sans rafraîchissement." },
    ],
    workflows: [
      {
        declencheur: "Un besoin de backend décrit à un agent",
        resultat: "Un schéma et des migrations écrits automatiquement",
        description:
          "Le MCP Supabase donne à l'agent accès direct pour inspecter et faire évoluer la base.",
        outils: ["MCP Supabase", "Claude Code"],
      },
      {
        declencheur: "Un nouvel utilisateur qui s'inscrit",
        resultat: "Une ligne de profil créée automatiquement",
        description:
          "Un trigger SQL déclenché à l'inscription crée les enregistrements associés sans code applicatif.",
        outils: [],
      },
      {
        declencheur: "Un fichier uploadé par un utilisateur",
        resultat: "Une image transformée automatiquement",
        description:
          "Le Storage applique des transformations (redimensionnement, format) à la volée.",
        outils: [],
      },
      {
        declencheur: "Un changement de données en base",
        resultat: "Une interface synchronisée sans rafraîchissement",
        description:
          "L'abonnement en temps réel pousse les changements directement à l'interface connectée.",
        outils: [],
      },
      {
        declencheur: "Une requête API qui revient souvent",
        resultat: "Une Edge Function qui l'encapsule",
        description:
          "La logique se centralise côté serveur plutôt que d'être dupliquée côté client.",
        outils: [],
      },
    ],
    limites: [
      { titre: "RLS à maîtriser absolument", description: "Une table sans politique correcte est soit inaccessible, soit ouverte : c'est la principale source d'erreurs de sécurité." },
      { titre: "Connaissances SQL nécessaires", description: "L'outil récompense ceux qui savent modéliser une base ; sans cela, la dette s'accumule vite." },
      { titre: "Projets gratuits mis en pause", description: "Un projet inactif sur l'offre gratuite est suspendu après une période d'inactivité." },
    ],
    conformite: {
      hebergement: "Régions au choix, dont l'UE",
      rgpd: "Conforme, DPA disponible, sous-traitance documentée",
      aiAct: "Non applicable directement",
      entrainement: "Aucune utilisation des données client",
      note: "Le choix de région à la création du projet permet de garder les données en Union européenne. Le produit étant open-source, l'auto-hébergement reste une porte de sortie.",
    },
    mcp: { disponible: true, officiel: true, note: "Supabase publie un serveur MCP officiel qui permet à un agent IA d'inspecter le schéma, écrire des migrations et interroger la base.", lien: "https://supabase.com/docs/guides/getting-started/mcp" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "2 projets actifs, 500 Mo de base, 1 Go de stockage, mise en pause si inactif." },
      { nom: "Pro", prix: "25 $ / mois / projet", inclus: "8 Go de base, sauvegardes quotidiennes, pas de mise en pause." },
      { nom: "Team", prix: "599 $ / mois", inclus: "SSO, contrôles de conformité, sauvegardes longue durée." },
    ],
    verdict:
      "Supabase est le meilleur compromis actuel entre rapidité de démarrage et absence d'enfermement : tu construis vite, mais tu restes sur du PostgreSQL standard, exportable et auto-hébergeable. Le point de vigilance est unique et il est majeur : les politiques Row Level Security. Bien faites, la sécurité est solide ; oubliées, la base est exposée. C'est le back-end qui fait tourner cette application.",
    faq: [
      { question: "Supabase est-il vraiment open-source ?", reponse: "Oui, le cœur du produit est publié sous licence libre et peut être auto-hébergé, ce qui limite le risque d'enfermement." },
      { question: "Les données peuvent-elles rester en Europe ?", reponse: "Oui, la région se choisit à la création du projet et des régions européennes sont disponibles." },
      { question: "Quelle différence avec Firebase ?", reponse: "Firebase repose sur une base NoSQL propriétaire ; Supabase s'appuie sur PostgreSQL, avec du SQL standard et une portabilité bien meilleure." },
    ],
  },

  lovable: {
    slug: "lovable",
    nom: "Lovable",
    logo: "Lovable",
    tagline: "Génère une application web complète à partir d'une conversation, code et déploiement inclus.",
    tags: ["Sites web", "Agents"],
    notes: { fonctionnalites: 8, facilite: 8.5, valeur: 7, confiance: 7 },
    ctaLabel: "Essayer Lovable →",
    ctaUrl: "https://lovable.dev",
    testeLe: "9 août 2026",
    essentiel:
      "Lovable transforme une description en application web fonctionnelle : interface, back-end, base de données et mise en ligne. Idéal pour prototyper vite ou lancer un produit simple, avec un vrai code React qu'on peut récupérer sur GitHub. Formule gratuite limitée, environ 25 $/mois ensuite.",
    quEstCe: [
      "Lovable est un agent de développement en interface web : tu décris ce que tu veux, il écrit le code, l'exécute et te montre l'application en direct dans un aperçu. Chaque échange fait évoluer le projet, et l'historique permet de revenir en arrière.",
      "Le back-end est intégré via Lovable Cloud (base de données, authentification, fonctions serveur, stockage) et l'IA générative via une passerelle intégrée, ce qui évite de gérer soi-même les clés et les fournisseurs.",
    ],
    quiEstDerriere:
      "Lovable est une entreprise suédoise fondée à Stockholm en 2023 par Anton Osika et Fabian Hedin. Elle est devenue l'une des scale-ups européennes à la croissance la plus rapide sur le créneau du développement assisté par IA.",
    pourQui: {
      idealPour: "Prototyper une idée en quelques heures, lancer un outil interne ou un MVP, sans monter une équipe technique.",
      aEviterSi: "Tu construis un produit à forte complexité métier ou avec des contraintes d'architecture très spécifiques.",
    },
    demarrage: [
      {
        titre: "Décris ton idée en une phrase claire",
        description:
          "Une consigne précise pour la première génération vaut mieux qu'un roman : tu affines ensuite par itérations.",
      },
      {
        titre: "Active Lovable Cloud dès que tu as des données",
        description:
          "Base de données, authentification et stockage s'activent sans configuration manuelle.",
      },
      {
        titre: "Synchronise le projet avec GitHub tôt",
        description:
          "Avant que le code ne devienne trop volumineux pour être relu d'un coup, connecte le dépôt.",
      },
      {
        titre: "Groupe tes demandes plutôt que les multiplier",
        description:
          "Chaque échange consomme des crédits : une consigne précise et complète coûte moins cher que cinq petites.",
      },
      {
        titre: "Publie une version imparfaite tôt",
        description:
          "Tester en public accélère les retours, bien plus qu'un projet peaufiné en interne pendant des semaines.",
      },
      {
        titre: "Connecte un MCP externe si besoin",
        description:
          "Pour que l'app générée puisse dialoguer avec un outil tiers pendant sa construction.",
      },
    ],
    fonctionnalites: [
      { titre: "Application complète en conversation", description: "Interface, routes, base de données et logique serveur générées à partir de descriptions en langage naturel." },
      { titre: "Aperçu en direct", description: "Chaque modification est visible immédiatement dans un aperçu fonctionnel, pas dans une maquette." },
      { titre: "Back-end intégré", description: "Base de données, authentification, stockage et fonctions serveur activables sans configuration manuelle." },
      { titre: "Synchronisation GitHub", description: "Le code reste du React/TypeScript standard, synchronisable avec un dépôt et reprenable par un développeur." },
      { titre: "Publication en un clic", description: "Mise en ligne immédiate avec une URL publique, et branchement d'un domaine personnalisé." },
      { titre: "IA intégrée", description: "Passerelle vers des modèles de génération de texte et d'images utilisables dans l'app sans gérer de clés API." },
    ],
    workflows: [
      {
        declencheur: "Une idée décrite en langage naturel",
        resultat: "Une app fonctionnelle en ligne",
        description:
          "Interface, back-end et base de données générés et déployés dans la même conversation.",
        outils: ["Lovable Cloud"],
      },
      {
        declencheur: "Un projet Lovable qui grossit",
        resultat: "Du code repris par un développeur",
        description:
          "La synchronisation GitHub expose du React/TypeScript standard, sans verrouillage propriétaire.",
        outils: ["GitHub"],
      },
      {
        declencheur: "Un besoin de données persistantes",
        resultat: "Une base et une authentification actives",
        description:
          "Lovable Cloud active base de données, auth et stockage sans configuration manuelle.",
        outils: [],
      },
      {
        declencheur: "Un bug signalé après publication",
        resultat: "Un correctif appliqué dans la foulée",
        description:
          "Le bug se décrit en langage naturel dans la même session, sans repartir de zéro.",
        outils: [],
      },
      {
        declencheur: "Un outil tiers à intégrer à l'app",
        resultat: "Une connexion fonctionnelle",
        description:
          "Un serveur MCP externe donne à l'agent l'accès nécessaire pendant la construction.",
        outils: ["MCP"],
      },
    ],
    limites: [
      { titre: "Consommation de crédits", description: "Chaque échange consomme des crédits : un projet nourri d'allers-retours coûte vite plus cher que prévu." },
      { titre: "Qualité dépendante des consignes", description: "Plus la demande est floue, plus le résultat dérive : le cadrage écrit fait toute la différence." },
      { titre: "Complexité plafonnée", description: "Sur des architectures métier lourdes, il faut tôt ou tard reprendre la main sur le code." },
    ],
    conformite: {
      hebergement: "UE / États-Unis selon les services",
      rgpd: "Société européenne, DPA disponible",
      aiAct: "Éditeur soumis au cadre européen",
      entrainement: "Code des projets non utilisé par défaut",
      note: "Lovable est une entreprise suédoise, donc directement soumise au RGPD et au règlement européen sur l'IA. Les données applicatives dépendent des services back-end activés et de leur région.",
    },
    mcp: { disponible: true, officiel: true, note: "Lovable peut se connecter à des serveurs MCP externes pour donner à l'agent l'accès à des outils et données tiers pendant la construction.", lien: "https://docs.lovable.dev" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Quelques crédits quotidiens, projets publics, prise en main complète." },
      { nom: "Pro", prix: "~25 $ / mois", inclus: "Crédits mensuels, projets privés, domaine personnalisé, suppression du badge." },
      { nom: "Business", prix: "~50 $ / utilisateur / mois", inclus: "Espaces d'équipe, rôles, contrôles avancés et davantage de crédits." },
    ],
    verdict:
      "Lovable est l'outil qui rend la distance entre l'idée et la première version réellement courte — cette application en est la preuve. Sa force est de produire du vrai code exportable, pas une plateforme fermée. Le vrai coût n'est pas l'abonnement mais les crédits : mieux vaut écrire des demandes précises et groupées que multiplier les micro-échanges. Pour un MVP ou un outil interne, c'est difficile à battre.",
    faq: [
      { question: "Le code m'appartient-il ?", reponse: "Oui, le projet peut être synchronisé sur GitHub et repris par n'importe quel développeur React." },
      { question: "Faut-il savoir coder ?", reponse: "Non pour démarrer. Savoir lire du code aide beaucoup dès que le projet grossit ou qu'un bug résiste." },
      { question: "Comment sont facturés les crédits ?", reponse: "Chaque échange avec l'agent consomme des crédits inclus dans la formule mensuelle ; des recharges sont possibles." },
    ],
  },

  notion: {
    slug: "notion",
    nom: "Notion",
    logo: "Notion",
    tagline: "Notes, bases de données et documentation dans un seul espace de travail.",
    tags: ["Productivité", "Collaboration"],
    notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 8, confiance: 8.5 },
    ctaLabel: "Essayer Notion →",
    ctaUrl: "https://www.notion.so",
    testeLe: "9 août 2026",
    essentiel:
      "Notion réunit notes, wiki, bases de données et gestion de projet dans un même espace, entièrement modulable. Gratuit pour un usage individuel, environ 10 €/mois par personne en équipe, plus un supplément pour Notion AI.",
    quEstCe: [
      "Notion repose sur un principe simple : tout est une page, et toute page peut contenir des blocs — texte, tableau, base de données, vue kanban, calendrier. Cette souplesse permet de construire aussi bien un carnet de notes qu'un CRM maison.",
      "Les bases de données sont le vrai moteur de l'outil : une même collection de données peut être affichée en table, en tableau kanban, en calendrier ou en galerie, avec filtres, tris et relations entre bases.",
    ],
    quiEstDerriere:
      "Notion Labs a été fondée en 2013 à San Francisco par Ivan Zhao et Simon Last. L'outil s'est imposé auprès des startups et des indépendants avant de se déployer en entreprise.",
    pourQui: {
      idealPour: "Centraliser la documentation, les process et le suivi de projets d'une petite équipe ou d'une activité indépendante.",
      aEviterSi: "Tu veux un outil prêt à l'emploi sans configuration, ou une gestion de projet très structurée avec dépendances et charge : un outil dédié sera plus direct.",
    },
    demarrage: [
      {
        titre: "Duplique un modèle proche de ton besoin",
        description:
          "Partir d'une base existante va plus vite qu'une page vide, quitte à la simplifier ensuite.",
      },
      {
        titre: "Construis une base de données avant les pages",
        description:
          "C'est le vrai moteur de l'outil : les pages viennent après, pas l'inverse.",
      },
      {
        titre: "Relie deux bases avec une relation et un rollup",
        description:
          "Le premier vrai système apparaît quand deux bases se répondent, pas avant.",
      },
      {
        titre: "Configure les permissions avant d'inviter des externes",
        description:
          "Les droits page par page évitent les mauvaises surprises une fois l'espace partagé.",
      },
      {
        titre: "Active Notion AI si utile à ton usage",
        description:
          "Rédaction, résumé et recherche sémantique sur l'ensemble de l'espace, en supplément payant.",
      },
      {
        titre: "Connecte le serveur MCP officiel",
        description:
          "Un agent comme Claude peut alors lire, créer et mettre à jour tes pages directement.",
      },
    ],
    fonctionnalites: [
      { titre: "Bases de données multi-vues", description: "Une même collection s'affiche en table, kanban, calendrier, timeline ou galerie selon le besoin du moment." },
      { titre: "Relations et rollups", description: "Relie deux bases entre elles et agrège les données liées, ce qui permet de construire de vrais systèmes." },
      { titre: "Modèles et duplication", description: "Un immense écosystème de modèles publics, duplicables en un clic pour démarrer sans partir de zéro." },
      { titre: "Notion AI", description: "Rédaction, résumé et recherche sémantique sur l'ensemble de l'espace de travail." },
      { titre: "Collaboration et permissions", description: "Commentaires, mentions et droits fins page par page, y compris pour des invités externes." },
      { titre: "Publication web", description: "Publie une page en site public, utile pour une documentation ou une base de connaissances." },
    ],
    workflows: [
      {
        declencheur: "Une réunion ou un brainstorm",
        resultat: "Des tâches structurées créées dans Notion",
        description:
          "Le MCP Notion permet à Claude de créer des pages ou remplir une base directement depuis la conversation.",
        outils: ["MCP Notion", "Claude"],
      },
      {
        declencheur: "Une nouvelle ligne ajoutée dans une base",
        resultat: "Une notification déclenchée ailleurs",
        description:
          "Zapier surveille les changements et déclenche une action dans un autre outil.",
        outils: ["Zapier"],
      },
      {
        declencheur: "Un document à rendre accessible en externe",
        resultat: "Une page publiée en site public",
        description:
          "La publication web transforme une page Notion en documentation accessible sans compte.",
        outils: [],
      },
      {
        declencheur: "Un projet à suivre au quotidien",
        resultat: "Une vue kanban générée depuis les mêmes données",
        description:
          "La même base de données s'affiche en table, calendrier ou kanban selon le besoin du moment.",
        outils: [],
      },
      {
        declencheur: "Une question sur le contenu de l'espace",
        resultat: "Une réponse sourcée depuis tes propres pages",
        description:
          "Notion AI cherche et synthétise à partir du contenu réellement présent dans l'espace de travail.",
        outils: ["Notion AI"],
      },
    ],
    limites: [
      { titre: "Temps de configuration", description: "La liberté a un prix : construire un espace vraiment utile demande plusieurs heures de mise en place." },
      { titre: "Lenteur sur les gros espaces", description: "Les bases volumineuses et les pages très imbriquées deviennent lentes, notamment sur mobile." },
      { titre: "Notion AI facturé à part", description: "La couche IA est un supplément par utilisateur, en plus de l'abonnement de base." },
    ],
    conformite: {
      hebergement: "États-Unis (option UE en Enterprise)",
      rgpd: "Conforme via DPA",
      aiAct: "Fonctions IA documentées",
      entrainement: "Contenus clients non utilisés pour l'entraînement",
      note: "Notion s'engage à ne pas utiliser le contenu des espaces de travail pour entraîner ses modèles. L'hébergement par défaut reste américain, avec DPA et clauses contractuelles types.",
    },
    mcp: { disponible: true, officiel: true, note: "Notion publie un serveur MCP officiel : un agent IA peut lire, créer et mettre à jour des pages et des bases de données de l'espace de travail.", lien: "https://developers.notion.com" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Usage individuel illimité, invités limités, historique court." },
      { nom: "Plus", prix: "~10 € / utilisateur / mois", inclus: "Espaces d'équipe, historique étendu, invités supplémentaires." },
      { nom: "Business", prix: "~18 € / utilisateur / mois", inclus: "SAML SSO, espaces privés, analytics avancés." },
      { nom: "Notion AI", prix: "~8 € / utilisateur / mois", inclus: "Rédaction, résumé et recherche IA sur tout l'espace." },
    ],
    verdict:
      "Notion est excellent pour qui accepte de le construire, et frustrant pour qui attend une solution clé en main. La bascule se fait quand on comprend les bases de données relationnelles : à partir de là, l'outil remplace trois ou quatre logiciels. Avec le serveur MCP, il devient aussi une mémoire consultable par un agent IA — c'est ce qui lui donne aujourd'hui sa vraie valeur dans un flux de travail assisté.",
    faq: [
      { question: "La version gratuite est-elle suffisante ?", reponse: "Pour un usage individuel, oui, elle est très généreuse. Les limites arrivent avec le travail en équipe et les invités." },
      { question: "Notion peut-il remplacer un gestionnaire de projet ?", reponse: "Pour une petite équipe, oui. Sur des projets avec dépendances et charge à planifier, un outil dédié reste plus adapté." },
      { question: "Mes données servent-elles à entraîner l'IA ?", reponse: "Non, Notion indique ne pas utiliser le contenu des espaces de travail pour entraîner ses modèles." },
    ],
  },

  "google-drive": {
    slug: "google-drive",
    nom: "Google Drive",
    logo: "GoogleDrive",
    tagline: "Stockage et partage de fichiers, au cœur de l'écosystème Google.",
    tags: ["Stockage & fichiers", "Collaboration"],
    notes: { fonctionnalites: 7, facilite: 9, valeur: 9, confiance: 9 },
    ctaLabel: "Ouvrir Google Drive →",
    ctaUrl: "https://drive.google.com",
    testeLe: "9 août 2026",
    essentiel:
      "Google Drive est le stockage en ligne le plus universel : 15 Go gratuits partagés avec Gmail et Photos, une recherche redoutablement efficace et l'intégration directe avec Docs, Sheets et Slides. Environ 2 €/mois pour 100 Go.",
    quEstCe: [
      "Google Drive stocke les fichiers dans le cloud et les synchronise entre les appareils. Sa force réelle n'est pas le stockage brut mais l'intégration : Docs, Sheets et Slides y vivent nativement, avec collaboration en temps réel et historique de versions.",
      "La recherche est le vrai différenciant : Drive indexe le contenu des documents, y compris le texte présent dans les images et les PDF scannés, ce qui permet de retrouver un fichier sans se souvenir de son nom.",
    ],
    quiEstDerriere:
      "Google Drive est un service de Google, lancé en 2012. Il constitue le socle de fichiers de Google Workspace, la suite bureautique utilisée par des millions d'organisations.",
    pourQui: {
      idealPour: "Toute personne déjà dans l'écosystème Google, pour partager des fichiers et travailler à plusieurs sur des documents.",
      aEviterSi: "Tu as des exigences de souveraineté strictes ou tu manipules des données très sensibles sans chiffrement de bout en bout.",
    },
    demarrage: [
      {
        titre: "Pose une structure de dossiers simple",
        description:
          "Quelques dossiers de haut niveau suffisent : la recherche par contenu fait le reste.",
      },
      {
        titre: "Configure les droits de partage par défaut",
        description:
          "Avant d'inviter des externes, décide qui peut éditer, commenter ou seulement voir.",
      },
      {
        titre: "Installe Drive pour ordinateur",
        description:
          "Avec les fichiers à la demande, l'accès local ne sature pas le disque.",
      },
      {
        titre: "Compte sur l'historique de versions comme filet",
        description:
          "Un retour en arrière est toujours possible sans manipulation complexe.",
      },
      {
        titre: "Connecte le MCP si tu utilises un agent IA",
        description:
          "Claude peut alors chercher et lire tes fichiers pour s'en servir comme source de contexte.",
      },
      {
        titre: "Passe sur Workspace pour un usage pro",
        description:
          "Domaine personnalisé et garanties contractuelles sur les données, dès qu'il s'agit d'un usage professionnel.",
      },
    ],
    fonctionnalites: [
      { titre: "Recherche par contenu", description: "Indexation du texte des documents, PDF et images : on retrouve un fichier par son contenu, pas seulement par son nom." },
      { titre: "Collaboration temps réel", description: "Docs, Sheets et Slides s'éditent à plusieurs simultanément, avec commentaires et suggestions." },
      { titre: "Partage granulaire", description: "Droits par fichier ou dossier, liens à durée limitée et restrictions de téléchargement." },
      { titre: "Historique de versions", description: "Retour à n'importe quel état antérieur d'un document, sans manipulation complexe." },
      { titre: "Drive pour ordinateur", description: "Synchronisation locale avec fichiers à la demande, sans occuper tout le disque." },
      { titre: "Intégration Gemini", description: "Résumé et interrogation des documents stockés depuis l'assistant intégré à Workspace." },
    ],
    workflows: [
      {
        declencheur: "Une question sur un document existant",
        resultat: "Une réponse sourcée depuis le contenu réel",
        description:
          "Le connecteur MCP donne à Claude accès direct aux fichiers du Drive pour répondre à partir de leur contenu.",
        outils: ["MCP", "Claude"],
      },
      {
        declencheur: "Un PDF scanné égaré dans les dossiers",
        resultat: "Retrouvé par son contenu",
        description:
          "La recherche indexe le texte des documents et des images, pas seulement les noms de fichiers.",
        outils: [],
      },
      {
        declencheur: "Un document à faire avancer à plusieurs",
        resultat: "Une collaboration en temps réel",
        description:
          "Docs, Sheets et Slides s'éditent simultanément avec commentaires et suggestions.",
        outils: [],
      },
      {
        declencheur: "Un nouveau fichier déposé dans un dossier surveillé",
        resultat: "Une action déclenchée ailleurs",
        description:
          "Zapier peut réagir à l'ajout d'un fichier pour notifier ou classer automatiquement.",
        outils: ["Zapier"],
      },
      {
        declencheur: "Un dossier de projet actif",
        resultat: "Une sauvegarde et un historique automatiques",
        description:
          "Chaque modification est tracée, avec retour possible à un état antérieur sans effort.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Quota partagé", description: "Les 15 Go gratuits sont mutualisés entre Drive, Gmail et Photos : la saturation arrive plus vite qu'on ne croit." },
      { titre: "Pas de chiffrement de bout en bout", description: "Google peut techniquement accéder aux contenus, ce qui exclut certains usages confidentiels." },
      { titre: "Formats Google propriétaires", description: "Un Doc exporté vers Word perd souvent une partie de sa mise en forme." },
    ],
    conformite: {
      hebergement: "Mondial, régionalisable en Workspace",
      rgpd: "Conforme via DPA Google Workspace",
      aiAct: "Fonctions IA encadrées côté Workspace",
      entrainement: "Contenus Workspace exclus de l'entraînement",
      note: "Sur les offres Workspace, Google s'engage contractuellement à ne pas utiliser les contenus pour la publicité ni l'entraînement, et permet de restreindre la région de stockage. Les comptes personnels gratuits offrent moins de garanties.",
    },
    mcp: { disponible: true, officiel: true, note: "Un connecteur MCP permet à un assistant IA de rechercher et lire les fichiers du Drive pour s'en servir comme source de contexte.", lien: "https://developers.google.com/drive" },
    tarifs: [
      { nom: "Gratuit", prix: "0 €", inclus: "15 Go partagés entre Drive, Gmail et Google Photos." },
      { nom: "Google One 100 Go", prix: "~2 € / mois", inclus: "100 Go, partage familial et sauvegardes étendues." },
      { nom: "Google One 2 To", prix: "~10 € / mois", inclus: "2 To, fonctions avancées et support prioritaire." },
      { nom: "Workspace", prix: "~6 € / utilisateur / mois", inclus: "Domaine personnalisé, administration, 30 Go et plus par utilisateur." },
    ],
    verdict:
      "Drive n'est pas le stockage le plus sécurisé ni le plus souverain, mais c'est celui que tout le monde sait déjà utiliser — et cette universalité vaut beaucoup dans un flux de travail partagé. La recherche par contenu reste sa meilleure fonctionnalité, largement sous-exploitée. Pour des documents réellement confidentiels, garde une solution chiffrée à côté.",
    faq: [
      { question: "Les 15 Go gratuits sont-ils vraiment gratuits ?", reponse: "Oui, mais ils sont partagés avec Gmail et Google Photos, ce qui les rend vite insuffisants." },
      { question: "Mes fichiers servent-ils à entraîner l'IA de Google ?", reponse: "Sur les offres Workspace, non : Google l'exclut contractuellement. Les comptes personnels offrent moins de garanties." },
      { question: "Peut-on travailler hors ligne ?", reponse: "Oui, avec l'application de bureau ou le mode hors connexion activé dans le navigateur." },
    ],
  },

  gmail: {
    slug: "gmail",
    nom: "Gmail",
    logo: "Gmail",
    tagline: "La messagerie de référence, du compte perso à l'e-mail pro sur domaine.",
    tags: ["E-mailing", "Productivité"],
    notes: { fonctionnalites: 7, facilite: 9, valeur: 9, confiance: 9 },
    ctaLabel: "Ouvrir Gmail →",
    ctaUrl: "https://mail.google.com",
    testeLe: "9 août 2026",
    essentiel:
      "Gmail combine un filtrage antispam d'une efficacité rare, une recherche instantanée et un système de libellés et filtres qui permet d'automatiser le tri. Gratuit en compte personnel, environ 6 €/mois par utilisateur pour un e-mail professionnel sur ton propre domaine.",
    quEstCe: [
      "Gmail est le service de messagerie de Google, utilisé aussi bien en compte personnel gratuit qu'en version professionnelle avec un nom de domaine via Google Workspace. L'interface web est la référence, complétée par des applications mobiles.",
      "Son organisation repose sur les libellés plutôt que sur des dossiers : un même message peut porter plusieurs étiquettes, et des filtres automatiques appliquent libellés, archivage ou transfert dès la réception.",
    ],
    quiEstDerriere:
      "Gmail est un service de Google, lancé en 2004. C'est aujourd'hui la messagerie la plus utilisée au monde, avec plus d'un milliard et demi de comptes actifs.",
    pourQui: {
      idealPour: "Les indépendants et petites structures qui veulent une messagerie professionnelle fiable, sans administrer de serveur mail.",
      aEviterSi: "Tu as besoin d'une messagerie chiffrée de bout en bout ou hébergée en Europe par principe.",
    },
    demarrage: [
      {
        titre: "Crée tes premiers filtres",
        description:
          "Étiquetage et archivage automatiques dès la réception, plutôt qu'un tri manuel répété.",
      },
      {
        titre: "Passe sur Workspace pour une adresse pro",
        description:
          "Un domaine personnalisé et des garanties contractuelles, à partir de quelques euros par mois.",
      },
      {
        titre: "Configure des alias utiles",
        description:
          "Sépare les inscriptions et newsletters de la correspondance importante sans changer d'adresse.",
      },
      {
        titre: "Active les réponses assistées si tu es sur Workspace",
        description:
          "Les suggestions de réponse accélèrent le traitement des messages courants.",
      },
      {
        titre: "Connecte le MCP Gmail",
        description:
          "Un agent comme Claude peut alors lire, trier et préparer des brouillons avec ton autorisation explicite.",
      },
      {
        titre: "Vérifie les réglages de confidentialité",
        description:
          "Surtout en compte gratuit, où les garanties contractuelles sont moins étendues qu'en Workspace.",
      },
    ],
    fonctionnalites: [
      { titre: "Antispam et sécurité", description: "Filtrage réputé pour sa précision, avec détection du phishing et alertes sur les expéditeurs suspects." },
      { titre: "Recherche puissante", description: "Opérateurs de recherche avancés pour retrouver un message précis dans des années d'archives." },
      { titre: "Libellés et filtres", description: "Automatisation du tri à la réception : étiquetage, archivage, transfert ou marquage selon des règles." },
      { titre: "Réponses assistées", description: "Suggestions de réponse et rédaction assistée par Gemini dans les offres Workspace." },
      { titre: "Alias et domaine personnalisé", description: "Envoi depuis une adresse professionnelle sur ton propre nom de domaine avec Workspace." },
      { titre: "Intégration Agenda et Meet", description: "Création de rendez-vous et de visioconférences directement depuis un message." },
    ],
    workflows: [
      {
        declencheur: "Une boîte de réception qui déborde",
        resultat: "Des brouillons de réponse prêts à valider",
        description:
          "Le MCP Gmail permet à Claude de lire, résumer et préparer des réponses que tu valides avant envoi.",
        outils: ["MCP Gmail", "Claude"],
      },
      {
        declencheur: "Un e-mail avec pièce jointe importante",
        resultat: "Un fichier classé automatiquement dans Drive",
        description:
          "Zapier peut extraire et ranger les pièces jointes sans intervention manuelle.",
        outils: ["Zapier", "Google Drive"],
      },
      {
        declencheur: "Un message d'un expéditeur récurrent",
        resultat: "Un libellé et un archivage automatiques",
        description:
          "Les filtres appliquent la règle dès la réception, sans repasser derrière.",
        outils: [],
      },
      {
        declencheur: "Une demande client qui revient souvent",
        resultat: "Un modèle de réponse réutilisable",
        description:
          "Un brouillon type, adapté à chaque cas plutôt que réécrit à chaque fois.",
        outils: [],
      },
      {
        declencheur: "Un nouveau lead qui écrit par e-mail",
        resultat: "Une ligne créée dans un tableur ou un CRM",
        description:
          "Zapier capture les informations du message pour alimenter le suivi commercial.",
        outils: ["Zapier"],
      },
    ],
    limites: [
      { titre: "Pas de chiffrement de bout en bout par défaut", description: "Le chiffrement côté client existe seulement sur certaines offres entreprise." },
      { titre: "Stockage partagé", description: "Les pièces jointes consomment le même quota que Drive et Photos." },
      { titre: "Onglets automatiques imparfaits", description: "Le tri en catégories (Promotions, Réseaux sociaux) enterre parfois des messages importants." },
    ],
    conformite: {
      hebergement: "Mondial, régionalisable en Workspace",
      rgpd: "Conforme via DPA Google Workspace",
      aiAct: "Fonctions Gemini encadrées côté Workspace",
      entrainement: "Contenus Workspace exclus de l'entraînement",
      note: "En Workspace, Google s'engage à ne pas analyser les e-mails à des fins publicitaires ni d'entraînement. Les comptes gratuits relèvent de conditions grand public, moins protectrices.",
    },
    mcp: { disponible: true, officiel: true, note: "Un connecteur MCP permet à un assistant IA de lire, rechercher et rédiger des e-mails avec l'autorisation explicite du compte.", lien: "https://developers.google.com/gmail" },
    tarifs: [
      { nom: "Gratuit", prix: "0 €", inclus: "Adresse @gmail.com, 15 Go partagés avec Drive et Photos." },
      { nom: "Workspace Starter", prix: "~6 € / utilisateur / mois", inclus: "Adresse sur domaine personnalisé, 30 Go, administration." },
      { nom: "Workspace Standard", prix: "~12 € / utilisateur / mois", inclus: "2 To par utilisateur, enregistrement Meet, contrôles avancés." },
    ],
    verdict:
      "Gmail est l'outil qu'on n'évalue plus vraiment tant il est installé, et c'est justement pour ça qu'il mérite un réglage sérieux : filtres et libellés bien configurés font gagner plusieurs heures par mois. Pour une activité professionnelle, l'offre Workspace à 6 €/mois est le minimum, ne serait-ce que pour l'adresse sur ton domaine et les garanties contractuelles associées.",
    faq: [
      { question: "Peut-on avoir une adresse pro sur son domaine ?", reponse: "Oui, via Google Workspace à partir d'environ 6 €/mois par utilisateur." },
      { question: "Google lit-il mes e-mails ?", reponse: "En Workspace, l'analyse à des fins publicitaires ou d'entraînement est exclue contractuellement. En compte gratuit, les traitements automatiques sont plus larges." },
      { question: "Comment mieux organiser sa boîte ?", reponse: "En créant des filtres qui appliquent un libellé et archivent automatiquement à la réception, plutôt qu'en triant à la main." },
    ],
  },

  zapier: {
    slug: "zapier",
    nom: "Zapier",
    logo: "Zapier",
    tagline: "Connecte tes outils entre eux et automatise les tâches répétitives.",
    tags: ["Automatisation", "Productivité"],
    notes: { fonctionnalites: 8.5, facilite: 7.5, valeur: 6.5, confiance: 8 },
    ctaLabel: "Essayer Zapier →",
    ctaUrl: "https://zapier.com",
    testeLe: "9 août 2026",
    essentiel:
      "Zapier relie plus de 7 000 applications entre elles sans écrire de code : un événement dans un outil déclenche une action dans un autre. C'est la solution la plus complète en nombre d'intégrations, mais aussi la plus chère dès que le volume augmente.",
    quEstCe: [
      "Zapier fonctionne sur un principe de déclencheur et d'actions : « quand un formulaire est rempli, crée une ligne dans le tableur et envoie un message ». Ces enchaînements, appelés Zaps, se construisent visuellement, étape par étape.",
      "Au-delà des automatisations simples, la plateforme propose des conditions, des filtres, des délais, des boucles, du code personnalisé et, depuis peu, des agents IA capables de décider de l'action à effectuer selon le contexte.",
    ],
    quiEstDerriere:
      "Zapier a été fondée en 2011 par Wade Foster, Bryan Helmig et Mike Knoop. C'est une entreprise américaine entièrement distribuée, pionnière et toujours leader du marché de l'automatisation sans code.",
    pourQui: {
      idealPour: "Automatiser des tâches administratives récurrentes entre des outils SaaS, sans équipe technique.",
      aEviterSi: "Ton volume d'automatisations est élevé et ton budget serré : une alternative auto-hébergée sera nettement moins chère.",
    },
    demarrage: [
      {
        titre: "Choisis un premier Zap simple à deux étapes",
        description:
          "Un déclencheur, une action : le temps de comprendre la mécanique avant de complexifier.",
      },
      {
        titre: "Teste chaque étape avant d'activer",
        description:
          "Le test unitaire par étape évite de découvrir un problème une fois le Zap en production.",
      },
      {
        titre: "Ajoute de la logique conditionnelle ensuite",
        description:
          "Filtres et chemins conditionnels une fois que l'automatisation simple fonctionne, pas avant.",
      },
      {
        titre: "Surveille l'historique d'exécution",
        description:
          "Repérer une erreur tôt évite qu'elle passe inaperçue pendant des semaines.",
      },
      {
        titre: "Regarde Tables et Interfaces pour les petits besoins",
        description:
          "Une base légère et un formulaire interne, sans ajouter un outil de plus.",
      },
      {
        titre: "Connecte le MCP Zapier si tu utilises un agent IA",
        description:
          "L'agent accède alors à plus de 7 000 actions applicatives comme à une télécommande universelle.",
      },
    ],
    fonctionnalites: [
      { titre: "Plus de 7 000 intégrations", description: "Le catalogue le plus large du marché : la quasi-totalité des outils SaaS courants sont pris en charge." },
      { titre: "Constructeur visuel", description: "Enchaînement d'étapes en glisser-déposer, avec test unitaire de chaque étape avant activation." },
      { titre: "Logique conditionnelle", description: "Filtres, chemins conditionnels et délais pour des scénarios qui dépassent la simple chaîne linéaire." },
      { titre: "Tables et Interfaces", description: "Bases de données légères et formulaires internes pour construire un petit outil sans autre logiciel." },
      { titre: "Étapes de code", description: "Insertion de JavaScript ou Python quand une transformation n'est pas prévue par les connecteurs." },
      { titre: "Agents IA", description: "Automatisations où un modèle décide de l'action à déclencher en fonction du contenu reçu." },
    ],
    workflows: [
      {
        declencheur: "Un formulaire rempli par un prospect",
        resultat: "Une ligne créée et une notification envoyée",
        description:
          "Un Zap simple ajoute la donnée dans un tableur et prévient l'équipe sur Slack.",
        outils: [],
      },
      {
        declencheur: "Un nouveau prompt sauvegardé dans la bibliothèque",
        resultat: "Un ajout dans un tableau de suivi",
        description:
          "Zapier détecte l'événement et met à jour un tableau de bord externe sans code.",
        outils: [],
      },
      {
        declencheur: "Un événement dans un outil du quotidien",
        resultat: "Une action déclenchée dans un autre",
        description:
          "Le principe de base : un déclencheur ici, une action là, sans écrire une ligne de code.",
        outils: [],
      },
      {
        declencheur: "Un contenu à trier selon son intention",
        resultat: "Une décision prise automatiquement",
        description:
          "Les agents IA de Zapier choisissent l'action à déclencher en fonction du contenu reçu.",
        outils: ["Agents Zapier"],
      },
      {
        declencheur: "Une tâche manuelle répétée chaque semaine",
        resultat: "Un Zap qui l'élimine définitivement",
        description:
          "Une fois identifiée et modélisée, la tâche répétitive n'a plus besoin d'intervention humaine.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Coût par tâche", description: "La facturation à la tâche exécutée devient rapidement lourde sur des volumes importants." },
      { titre: "Débogage parfois opaque", description: "Une erreur dans une étape intermédiaire peut être difficile à diagnostiquer sur un Zap complexe." },
      { titre: "Dépendance aux API tierces", description: "Un changement chez un éditeur peut casser un Zap sans avertissement." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA, clauses contractuelles types",
      aiAct: "Fonctions IA documentées",
      entrainement: "Données client non utilisées pour l'entraînement",
      note: "Zapier transporte des données entre applications : chaque Zap doit être pensé en fonction de la sensibilité des informations qui y transitent, avec un stockage limité aux données d'exécution.",
    },
    mcp: { disponible: true, officiel: true, note: "Zapier expose un serveur MCP qui donne à un agent IA l'accès à ses milliers d'actions applicatives, ce qui en fait un pont universel vers les outils SaaS.", lien: "https://zapier.com/mcp" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "100 tâches par mois, Zaps à deux étapes uniquement." },
      { nom: "Professional", prix: "~30 $ / mois", inclus: "Zaps multi-étapes, logique conditionnelle, connecteurs premium." },
      { nom: "Team", prix: "~100 $ / mois", inclus: "Espace partagé, connexions d'applications communes, gestion des accès." },
    ],
    verdict:
      "Zapier reste la solution la plus rapide pour automatiser quelque chose aujourd'hui, sans réfléchir à l'infrastructure — et son catalogue d'intégrations n'a pas d'équivalent. Le sujet est le prix : dès que les volumes montent, la facture grimpe vite et une alternative auto-hébergée devient rationnelle. Son serveur MCP change toutefois la donne : il transforme Zapier en télécommande universelle pour un agent IA.",
    faq: [
      { question: "Faut-il savoir coder ?", reponse: "Non, la construction est visuelle. Les étapes de code ne servent que pour des transformations avancées." },
      { question: "Le plan gratuit suffit-il ?", reponse: "Pour tester, oui : 100 tâches par mois et des Zaps à deux étapes. Un usage réel bascule vite sur une formule payante." },
      { question: "Quelle alternative moins chère ?", reponse: "Make est souvent plus économique à volume égal, et n8n peut être auto-hébergé pour un coût très bas." },
    ],
  },

  "google-gemini": {
    slug: "google-gemini",
    nom: "Google Gemini",
    logo: "GoogleGemini",
    tagline: "L'IA multimodale de Google, intégrée à tout l'écosystème Workspace.",
    tags: ["Chatbots", "IA générative"],
    notes: { fonctionnalites: 8.5, facilite: 8, valeur: 8, confiance: 8 },
    ctaLabel: "Essayer Gemini →",
    ctaUrl: "https://gemini.google.com",
    testeLe: "10 août 2026",
    essentiel:
      "Gemini est l'assistant IA de Google : multimodal, connecté en direct à la recherche et à tout Workspace (Gmail, Docs, Sheets, Drive). Gratuit avec Gemini 2.5 Flash et un accès limité à 2.5 Pro, AI Plus à 7,99 €/mois, AI Pro à 19,99 €/mois pour l'usage quotidien sérieux, AI Ultra à 99,99 €/mois pour l'intensif.",
    quEstCe: [
      "Gemini est le modèle de langage multimodal de Google, accessible via l'app dédiée, la recherche Google, et intégré nativement dans Gmail, Docs, Sheets et Slides pour qui utilise Workspace. Sa force distinctive est cette intégration profonde : demander un résumé d'un fil d'e-mails ou générer un tableau à partir d'un Doc se fait sans changer d'outil.",
      "Au-delà du chat, Gemini couvre la Recherche approfondie (rapports multi-sources), Gemini Live (conversation vocale en continu), Canvas (édition collaborative de documents et de code) et les Gems, des agents personnalisés avec instructions et fichiers dédiés.",
    ],
    quiEstDerriere:
      "Gemini est développé par Google DeepMind, la division de recherche IA de Google née de la fusion entre Google Brain et DeepMind en 2023. C'est le modèle qui a remplacé Bard et qui irrigue désormais l'ensemble des produits Google.",
    pourQui: {
      idealPour:
        "Toute personne déjà installée dans Google Workspace, qui veut une IA qui lit ses e-mails, ses docs et ses feuilles de calcul sans étape d'export-import.",
      aEviterSi:
        "Tu es hors de l'écosystème Google et cherches surtout un assistant de code ou de rédaction longue pure : Claude ou ChatGPT restent plus directs sur ces usages.",
    },
    demarrage: [
      {
        titre: "Connecte ton compte Google",
        description:
          "Gemini utilise directement le contexte de Gmail, Drive et Calendar dès que tu l'autorises — pas de configuration séparée à faire.",
      },
      {
        titre: "Crée un Gem pour un usage récurrent",
        description:
          "Un agent personnalisé avec instructions et fichiers de référence, pour ne pas repartir de zéro à chaque conversation.",
      },
      {
        titre: "Teste Gemini directement dans un Doc ou un Sheet",
        description:
          "L'icône Gemini dans la barre latérale de Workspace évite d'ouvrir une fenêtre de chat séparée pour une tâche ponctuelle.",
      },
      {
        titre: "Essaie Gemini Live pour un brainstorm oral",
        description:
          "Utile en déplacement ou pour réfléchir à voix haute sans taper, avec une conversation qui reste fluide.",
      },
      {
        titre: "Passe à AI Pro si tu dépasses les limites gratuites",
        description:
          "19,99 €/mois débloque l'accès élargi à Gemini Pro et à la Recherche approfondie sans les plafonds serrés du gratuit.",
      },
      {
        titre: "Explore Canvas pour un document ou un prototype",
        description:
          "Édition collaborative en direct, utile pour itérer sur un texte long ou un bout de code sans sortir du fil de conversation.",
      },
    ],
    fonctionnalites: [
      { titre: "Intégration Workspace native", description: "Gemini lit et agit sur Gmail, Docs, Sheets et Slides directement depuis la barre latérale, sans export manuel." },
      { titre: "Recherche approfondie", description: "Produit un rapport structuré à partir de dizaines de sources web, comparable à un travail de veille de plusieurs heures." },
      { titre: "Gemini Live", description: "Conversation vocale en continu, avec partage d'écran ou de caméra pour un contexte visuel en direct." },
      { titre: "Canvas", description: "Espace d'édition collaborative pour affiner un document ou un extrait de code avec l'IA en temps réel." },
      { titre: "Gems", description: "Agents personnalisés avec instructions et fichiers dédiés, l'équivalent des GPTs ou Projects chez la concurrence." },
      { titre: "Multimodalité", description: "Traite texte, image, audio et vidéo dans une même conversation, avec une fenêtre de contexte très large." },
    ],
    workflows: [
      {
        declencheur: "Un fil d'e-mails Gmail qui s'éternise",
        resultat: "Un résumé actionnable en quelques lignes",
        description: "Gemini lit le fil directement dans Gmail et en extrait les décisions et actions à prendre, sans copier-coller.",
        outils: ["Gmail"],
      },
      {
        declencheur: "Un tableau de données brut dans Sheets",
        resultat: "Une analyse et des formules générées",
        description: "Demande directement dans Sheets une analyse ou une formule complexe, sans quitter le tableur.",
        outils: ["Google Sheets"],
      },
      {
        declencheur: "Un sujet à défricher en profondeur",
        resultat: "Un rapport structuré et sourcé",
        description: "La Recherche approfondie enchaîne les requêtes nécessaires et compile un vrai rapport, pas une réponse courte.",
        outils: [],
      },
      {
        declencheur: "Une réunion à préparer en marchant",
        resultat: "Des notes vocales organisées",
        description: "Gemini Live permet de réfléchir à voix haute et d'obtenir une synthèse structurée sans taper.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Limites gratuites strictes", description: "L'accès à Gemini 2.5 Pro reste plafonné sur le plan gratuit, avec un retour au modèle Flash une fois le quota atteint." },
      { titre: "Moins pertinent hors Workspace", description: "L'essentiel de la valeur ajoutée repose sur l'intégration Google : sans Workspace, l'avantage face à ChatGPT ou Claude s'amenuise." },
      { titre: "Confidentialité à vérifier", description: "Sur les comptes personnels, l'activité peut être utilisée pour améliorer les modèles sauf désactivation explicite dans les réglages." },
    ],
    conformite: {
      hebergement: "Mondial, régionalisable en Workspace",
      rgpd: "Conforme via DPA Google Workspace",
      aiAct: "Cadre de risque publié par Google",
      entrainement: "Désactivable ; exclu par défaut sur Workspace",
      note: "Sur les comptes Workspace, Google s'engage contractuellement à ne pas utiliser les échanges pour l'entraînement des modèles. Sur les comptes personnels, un réglage explicite d'activité Gemini permet de contrôler cet usage.",
    },
    mcp: { disponible: true, officiel: true, note: "Le Gemini CLI et l'API Gemini supportent nativement le Model Context Protocol pour connecter le modèle à des outils et données externes.", lien: "https://ai.google.dev" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Gemini 2.5 Flash, accès limité à 2.5 Pro, Deep Research, Gemini Live, Canvas et Gems." },
      { nom: "AI Plus", prix: "7,99 € / mois", inclus: "Limites élargies et stockage Google One inclus." },
      { nom: "AI Pro", prix: "19,99 € / mois", inclus: "Accès étendu à Gemini Pro, Recherche approfondie renforcée, 2 To de stockage." },
      { nom: "AI Ultra", prix: "99,99 € / mois", inclus: "Limites maximales, accès prioritaire aux nouveaux modèles, 30 To de stockage." },
    ],
    verdict:
      "Gemini se juge à l'aune de ce à quoi il est connecté : isolé, c'est un bon généraliste parmi d'autres ; branché à Gmail, Docs et Sheets, c'est l'IA qui demande le moins de friction au quotidien pour qui vit déjà dans Workspace. Le plan Free est correct pour tester, mais bascule vite sur des tâches un peu sérieuses — AI Pro à 19,99 €/mois est le point d'entrée réaliste pour un usage professionnel régulier.",
    faq: [
      { question: "Gemini est-il gratuit ?", reponse: "Oui, avec Gemini 2.5 Flash et un accès limité à 2.5 Pro. Pour un usage régulier sans plafond serré, AI Pro à 19,99 €/mois est recommandé." },
      { question: "Faut-il Google Workspace pour l'utiliser ?", reponse: "Non, Gemini fonctionne seul via l'app ou le web. Mais sa vraie force apparaît avec Workspace, où il agit directement dans Gmail, Docs et Sheets." },
      { question: "Quelle différence avec Google AI Studio ?", reponse: "AI Studio est un environnement de prototypage pour développeurs qui veulent tester l'API Gemini ; l'app Gemini est l'assistant grand public prêt à l'emploi." },
    ],
  },

  notebooklm: {
    slug: "notebooklm",
    nom: "NotebookLM",
    logo: "NotebookLM",
    tagline: "Transforme des documents en notes et podcasts interactifs sourcés.",
    tags: ["Recherche", "IA générative"],
    notes: { fonctionnalites: 8, facilite: 8.5, valeur: 9, confiance: 8 },
    ctaLabel: "Essayer NotebookLM →",
    ctaUrl: "https://notebooklm.google.com",
    testeLe: "10 août 2026",
    essentiel:
      "NotebookLM transforme un ensemble de documents (PDF, sites, vidéos YouTube, notes) en un assistant de recherche qui ne répond qu'à partir de ces sources, chaque affirmation étant citée. Sa fonction la plus connue génère un podcast audio à deux voix qui discute du contenu. Gratuit avec des limites généreuses, NotebookLM Plus inclus dans Google AI Pro.",
    quEstCe: [
      "NotebookLM fonctionne par « notebook » : tu importes une sélection de sources (jusqu'à 50 documents par notebook), et le modèle ne répond qu'à partir de ce corpus, avec citation systématique du passage source. C'est l'inverse d'un chatbot généraliste — le périmètre de connaissance est volontairement restreint à ce que tu as fourni.",
      "Au-delà du chat sourcé, NotebookLM génère des résumés, des guides d'étude, des chronologies, des cartes mentales, et surtout un « Audio Overview » : un podcast de quelques minutes où deux voix IA discutent naturellement du contenu des sources, utile pour s'approprier un sujet en écoutant plutôt qu'en lisant.",
    ],
    quiEstDerriere:
      "NotebookLM est un produit de Google, lancé en 2023 sous le nom de code « Project Tailwind » avant son nom actuel. Il s'appuie sur les modèles Gemini et s'est fait connaître grand public grâce à la fonction podcast, devenue virale début 2024.",
    pourQui: {
      idealPour:
        "Synthétiser un corpus de documents (rapports, articles, notes de cours, transcriptions) en gardant une traçabilité stricte vers les sources.",
      aEviterSi:
        "Tu as besoin d'une IA généraliste qui va chercher de l'information au-delà de ce que tu lui fournis — NotebookLM reste volontairement cantonné à ses sources.",
    },
    demarrage: [
      {
        titre: "Crée un premier notebook sur un sujet précis",
        description: "Un notebook = un sujet ou un projet, pas un fourre-tout — la qualité des réponses dépend de la cohérence des sources importées.",
      },
      {
        titre: "Importe des sources variées",
        description: "PDF, liens web, vidéos YouTube (la transcription est extraite automatiquement) et texte collé peuvent cohabiter dans un même notebook.",
      },
      {
        titre: "Pose une première question et vérifie les citations",
        description: "Chaque réponse renvoie au passage exact de la source — un réflexe à prendre dès le départ pour évaluer la fiabilité du corpus.",
      },
      {
        titre: "Génère un Audio Overview",
        description: "Le podcast à deux voix donne une vue d'ensemble rapide, utile avant de creuser un point précis par écrit.",
      },
      {
        titre: "Utilise les guides d'étude et chronologies",
        description: "Pratique pour préparer une présentation ou réviser un dossier volumineux sans tout relire linéairement.",
      },
      {
        titre: "Partage le notebook si besoin",
        description: "Un notebook peut être partagé en lecture avec d'autres personnes, utile pour une base de connaissance d'équipe.",
      },
    ],
    fonctionnalites: [
      { titre: "Réponses strictement sourcées", description: "Chaque affirmation cite le passage exact du document d'origine, contrairement à un chatbot qui puise dans ses connaissances générales." },
      { titre: "Audio Overview", description: "Génère un podcast de quelques minutes où deux voix IA discutent naturellement du contenu des sources importées." },
      { titre: "Guides d'étude et chronologies", description: "Synthèses automatiques adaptées à la révision ou à la préparation d'une présentation." },
      { titre: "Sources multiples", description: "Jusqu'à 50 documents par notebook : PDF, sites web, vidéos YouTube transcrites, texte collé." },
      { titre: "Cartes mentales", description: "Visualisation des relations entre les concepts clés extraits du corpus de sources." },
      { titre: "Partage de notebook", description: "Un notebook peut être partagé en lecture, utile pour constituer une base de connaissance consultable en équipe." },
    ],
    workflows: [
      {
        declencheur: "Un tas de PDF de recherche épars",
        resultat: "Une synthèse sourcée interrogeable",
        description:
          "Importe les documents comme sources et pose des questions avec citation exacte du passage d'origine.",
        outils: [],
      },
      {
        declencheur: "Un cours ou une formation à réviser",
        resultat: "Un podcast audio de synthèse",
        description:
          "L'Audio Overview transforme des notes denses en discussion à écouter, utile pour une première prise de contact avec un sujet.",
        outils: [],
      },
      {
        declencheur: "Plusieurs rapports concurrents à comparer",
        resultat: "Une chronologie ou une carte mentale",
        description:
          "Génère automatiquement une vue structurée des points clés extraits de l'ensemble des sources.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Périmètre volontairement fermé", description: "NotebookLM ne va pas chercher d'information hors des sources fournies — un choix de conception, pas un bug, mais qui surprend au début." },
      { titre: "Gestion de sources parfois rigide", description: "Réorganiser ou fusionner des notebooks existants reste limité comparé à un vrai outil de gestion documentaire." },
      { titre: "Podcast en anglais plus abouti", description: "L'Audio Overview reste très solide en anglais ; la version française progresse mais s'entend encore moins naturelle." },
    ],
    conformite: {
      hebergement: "Mondial, régionalisable en Workspace",
      rgpd: "Conforme via DPA Google Workspace",
      aiAct: "Cadre de risque publié par Google",
      entrainement: "Sources non utilisées pour l'entraînement des modèles",
      note: "Google indique explicitement que le contenu des notebooks n'est pas utilisé pour entraîner ses modèles IA. Les comptes Workspace bénéficient en plus des garanties contractuelles standards de la suite.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — l'accès reste limité à l'interface NotebookLM elle-même." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "100 notebooks, 50 sources par notebook, quota quotidien de requêtes et d'Audio Overviews." },
      { nom: "NotebookLM Plus", prix: "Inclus dans AI Pro (19,99 €/mois)", inclus: "Quotas nettement élargis, plus de notebooks, personnalisation de l'Audio Overview, partage en équipe." },
    ],
    verdict:
      "NotebookLM occupe une niche que peu d'outils couvrent aussi bien : transformer un tas de documents épars en une base interrogeable et sourcée. Le podcast fait le buzz, mais l'usage le plus solide reste la synthèse fiable d'un corpus pour un dossier, une veille ou une préparation de cours. Le plan gratuit suffit largement pour un usage individuel — inutile de payer avant d'en sentir vraiment la limite.",
    faq: [
      { question: "NotebookLM est-il gratuit ?", reponse: "Oui, avec des quotas déjà généreux (100 notebooks, 50 sources chacun). NotebookLM Plus est inclus dans l'abonnement Google AI Pro à 19,99 €/mois." },
      { question: "Le podcast fonctionne-t-il en français ?", reponse: "Oui, mais le rendu est encore un peu moins naturel qu'en anglais, langue sur laquelle la fonction a été le plus optimisée." },
      { question: "Mes documents servent-ils à entraîner l'IA de Google ?", reponse: "Non, Google indique explicitement ne pas utiliser le contenu des notebooks pour l'entraînement de ses modèles." },
    ],
  },

  photoroom: {
    slug: "photoroom",
    nom: "Photoroom",
    logo: "Photoroom",
    tagline: "Détoure et crée des visuels produits en un instant.",
    tags: ["Design graphique", "Images"],
    notes: { fonctionnalites: 7.5, facilite: 9, valeur: 8, confiance: 8 },
    ctaLabel: "Essayer Photoroom →",
    ctaUrl: "https://www.photoroom.com",
    testeLe: "10 août 2026",
    essentiel:
      "Photoroom détoure et met en scène des visuels produits ou portraits en quelques secondes, sans compétence en retouche photo. Pensé pour l'e-commerce et le social, avec un plan gratuit limité (watermark) et un Pro à environ 7,50 €/mois en annuel.",
    quEstCe: [
      "Photoroom est un éditeur photo spécialisé dans la suppression et le remplacement d'arrière-plan par IA : une photo de produit prise au téléphone devient un visuel professionnel sur fond neutre ou une mise en scène générée, en quelques clics.",
      "Au-delà du détourage, l'outil propose plus de 1 000 templates pour les fiches produit et les visuels sociaux, l'édition par lot pour traiter un catalogue entier, et des modèles IA pour générer des arrière-plans ou retoucher des portraits.",
    ],
    quiEstDerriere:
      "Photoroom est une entreprise française fondée à Paris en 2019 par Matthieu Rouif et Eloi Andaluz Fernandez. L'application s'est imposée comme un outil de référence pour les vendeurs e-commerce, avec plusieurs millions d'utilisateurs.",
    pourQui: {
      idealPour:
        "Les vendeurs e-commerce et créateurs de contenu qui doivent produire beaucoup de visuels produits propres et cohérents, sans studio photo ni logiciel de retouche complexe.",
      aEviterSi:
        "Tu as besoin d'un contrôle créatif fin type Photoshop, ou de créer des visuels marketing complets avec mise en page texte élaborée — Canva est alors plus adapté.",
    },
    demarrage: [
      {
        titre: "Importe une première photo produit",
        description: "Une photo prise au téléphone, même avec un fond quelconque, suffit pour tester la détourure automatique.",
      },
      {
        titre: "Teste un arrière-plan généré par IA",
        description: "Plutôt qu'un fond neutre, essaie une mise en scène générée pour voir l'écart de qualité perçue sur une fiche produit.",
      },
      {
        titre: "Explore les templates pour ton usage",
        description: "Fiche produit e-commerce, post Instagram, bannière : les modèles pré-dimensionnés évitent de repartir de zéro.",
      },
      {
        titre: "Passe en édition par lot dès plusieurs produits",
        description: "Traiter un catalogue entier d'un coup fait gagner un temps considérable comparé à une retouche image par image.",
      },
      {
        titre: "Passe au plan Pro pour retirer le watermark",
        description: "Indispensable dès qu'un visuel est destiné à un usage commercial réel, pas seulement à un test.",
      },
    ],
    fonctionnalites: [
      { titre: "Détourage automatique", description: "Suppression d'arrière-plan en un clic, avec une précision élevée même sur des contours complexes (cheveux, transparences)." },
      { titre: "Arrière-plans générés par IA", description: "Remplace le fond par une mise en scène générée cohérente avec le produit, sans séance photo supplémentaire." },
      { titre: "Édition par lot", description: "Applique le même traitement à des dizaines d'images en une fois, pensé pour les catalogues e-commerce." },
      { titre: "Bibliothèque de templates", description: "Plus de 1 000 modèles pré-dimensionnés pour fiches produit, réseaux sociaux et publicités." },
      { titre: "Retouche portrait", description: "Amélioration de photos de personnes : éclairage, arrière-plan, netteté." },
      { titre: "API Remove Background", description: "Intégration du détourage directement dans un catalogue ou un site via API, facturée à l'image." },
    ],
    workflows: [
      {
        declencheur: "Un catalogue de 200 photos produits brutes",
        resultat: "200 visuels prêts en quelques minutes",
        description:
          "L'édition par lot applique le même traitement de détourage et de mise en scène à tout le catalogue d'un coup.",
        outils: [],
      },
      {
        declencheur: "Une photo prise au téléphone",
        resultat: "Un visuel avec mise en scène générée",
        description:
          "Remplace le fond neutre par un environnement IA cohérent avec le produit, sans nouvelle prise de vue.",
        outils: [],
      },
      {
        declencheur: "Un besoin de détourage à grande échelle",
        resultat: "Une intégration automatisée au catalogue",
        description:
          "L'API Remove Background traite les images directement depuis le système e-commerce, sans passer par l'interface.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Watermark en gratuit", description: "Le plan gratuit appose un filigrane et interdit l'usage commercial des exports." },
      { titre: "Contrôle créatif limité", description: "Reste un outil de production rapide, pas un éditeur de retouche fine comme Photoshop." },
      { titre: "Crédits IA à surveiller", description: "Les fonctions avancées (arrière-plans générés) consomment un quota de crédits distinct du nombre d'exports." },
    ],
    conformite: {
      hebergement: "France / Union européenne",
      rgpd: "Conforme, société française",
      aiAct: "Éditeur soumis au cadre européen",
      entrainement: "Non précisé publiquement pour les visuels utilisateurs",
      note: "Photoroom est une entreprise française, directement soumise au RGPD et au règlement européen sur l'IA sans montage contractuel de transfert.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel — l'intégration passe par l'API Photoroom classique, facturée séparément par appel." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "Détourage de base avec filigrane, usage non commercial." },
      { nom: "Pro", prix: "~7,50 € / mois", inclus: "Export sans filigrane haute résolution, édition par lot jusqu'à 500 images, 1 000+ templates." },
      { nom: "Max", prix: "~21 € / mois", inclus: "Modèles IA avancés, capacités de lot plus larges." },
      { nom: "Ultra", prix: "~82,50 € / mois", inclus: "Flux automatisés à très gros volume." },
    ],
    verdict:
      "Photoroom fait une chose très bien : transformer une photo produit médiocre en visuel présentable, vite. Pour un catalogue e-commerce ou des visuels sociaux réguliers, le Pro à 7,50 €/mois se rentabilise dès qu'il évite une seule séance photo. Ce n'est pas un outil de design complet — pour la mise en page et la charte graphique, il se complète bien avec Canva plutôt que de le remplacer.",
    faq: [
      { question: "Photoroom est-il gratuit ?", reponse: "Oui, mais avec un filigrane sur les exports et sans usage commercial. Le plan Pro à environ 7,50 €/mois lève ces limites." },
      { question: "Quelle différence avec Canva ?", reponse: "Photoroom est spécialisé dans le détourage et la mise en scène de produits ; Canva couvre un usage de design plus large (présentations, réseaux sociaux, documents)." },
      { question: "Peut-on traiter un catalogue entier ?", reponse: "Oui, l'édition par lot permet d'appliquer le même traitement à plusieurs centaines d'images en une fois sur les plans payants." },
    ],
  },

  semrush: {
    slug: "semrush",
    nom: "Semrush",
    logo: "Semrush",
    tagline: "La boîte à outils SEO ultime pour dominer Google.",
    tags: ["SEO", "Marketing"],
    notes: { fonctionnalites: 9, facilite: 6.5, valeur: 6.5, confiance: 8.5 },
    ctaLabel: "Essayer Semrush →",
    ctaUrl: "https://www.semrush.com",
    testeLe: "10 août 2026",
    essentiel:
      "Semrush est la suite SEO et marketing digital la plus complète du marché : recherche de mots-clés, audit technique, suivi de position, analyse concurrentielle et, depuis 2025, un module de visibilité dans les moteurs IA. Pas de plan gratuit exploitable, Pro à partir d'environ 117 €/mois en annuel.",
    quEstCe: [
      "Semrush regroupe sous un même abonnement des dizaines d'outils : recherche et suivi de mots-clés, audit technique de site, analyse de backlinks, veille concurrentielle (quels mots-clés rankent tes concurrents, quelles publicités ils diffusent), et gestion de campagnes de contenu.",
      "Le bundle Semrush One, lancé fin 2025, ajoute une couche de suivi de la visibilité dans les moteurs de réponse IA (ChatGPT, Gemini, Perplexity) en complément du SEO classique — une réponse directe à la montée du GEO (Generative Engine Optimization).",
    ],
    quiEstDerriere:
      "Semrush a été fondée en 2008 par Oleg Shchegolev et Dmitranya Melerzanov, initialement en Russie puis basée à Boston. L'entreprise est cotée en bourse depuis 2021 et sert plus de 10 millions d'utilisateurs dans le monde.",
    pourQui: {
      idealPour:
        "Les agences, consultants SEO et équipes marketing qui pilotent une stratégie de contenu et de référencement sur plusieurs sites, avec un vrai besoin de données concurrentielles.",
      aEviterSi:
        "Tu gères un seul petit site avec un besoin SEO basique — le coût et la richesse fonctionnelle de Semrush sont largement disproportionnés pour cet usage.",
    },
    demarrage: [
      {
        titre: "Lance un audit de site en premier",
        description: "L'audit technique identifie rapidement les problèmes prioritaires (vitesse, liens cassés, indexation) avant toute stratégie de contenu.",
      },
      {
        titre: "Configure le suivi de position sur tes mots-clés cœur",
        description: "Une dizaine de mots-clés stratégiques suffisent pour commencer à mesurer une évolution dans le temps.",
      },
      {
        titre: "Analyse un concurrent direct",
        description: "L'outil de recherche organique d'un domaine concurrent révèle ses mots-clés porteurs et ses pages les plus performantes.",
      },
      {
        titre: "Explore le Content Marketing Toolkit",
        description: "Utile pour transformer une analyse de mots-clés en calendrier éditorial concret, disponible dès le plan Guru.",
      },
      {
        titre: "Regarde le module de visibilité IA si pertinent",
        description: "Si ta marque doit apparaître dans les réponses de ChatGPT ou Gemini, le bundle Semrush One suit cette visibilité en complément du SEO classique.",
      },
    ],
    fonctionnalites: [
      { titre: "Recherche de mots-clés", description: "Volumes, difficulté, intentions de recherche et suggestions associées pour construire une stratégie de contenu." },
      { titre: "Audit technique de site", description: "Détecte les problèmes de performance, d'indexation et de structure qui freinent le référencement." },
      { titre: "Suivi de position", description: "Évolution quotidienne du classement sur les mots-clés suivis, y compris en local et sur mobile." },
      { titre: "Analyse concurrentielle", description: "Mots-clés, backlinks et stratégie publicitaire des concurrents, visibles en quelques clics." },
      { titre: "Content Marketing Toolkit", description: "De l'idée éditoriale au brief de rédaction, avec suggestions optimisées pour le référencement." },
      { titre: "Visibilité dans les moteurs IA", description: "Suit la présence d'une marque dans les réponses de ChatGPT, Gemini et autres moteurs génératifs." },
    ],
    workflows: [
      {
        declencheur: "Un nouveau concurrent identifié",
        resultat: "Sa stratégie de mots-clés dévoilée",
        description:
          "L'analyse de domaine révèle ses pages et mots-clés les plus performants en quelques clics.",
        outils: [],
      },
      {
        declencheur: "Un site en perte de trafic organique",
        resultat: "Les causes techniques identifiées",
        description:
          "L'audit technique priorise les corrections à plus fort impact plutôt qu'une liste de problèmes non hiérarchisée.",
        outils: [],
      },
      {
        declencheur: "Une marque à suivre dans les réponses des IA",
        resultat: "Un suivi de visibilité GEO",
        description:
          "Semrush One mesure la présence de la marque dans ChatGPT et Gemini en complément du SEO classique.",
        outils: ["Semrush One"],
      },
    ],
    limites: [
      { titre: "Coût d'entrée élevé", description: "Aucun plan réellement exploitable en dessous d'une centaine d'euros par mois, contrairement à des alternatives plus ciblées." },
      { titre: "Complexité pour les débutants", description: "La richesse fonctionnelle demande un vrai temps de prise en main avant d'en tirer de la valeur." },
      { titre: "Limites de projets et de mots-clés", description: "Le plan Pro plafonne à 5 projets et 500 mots-clés suivis, vite atteint dès plusieurs sites gérés." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA, clauses contractuelles types",
      aiAct: "Fonctions IA documentées",
      entrainement: "Non applicable (outil d'analyse, pas de contenu généré à partir de données client)",
      note: "Semrush est une société américaine cotée en bourse, avec un DPA standard pour les clients européens. Les données analysées sont majoritairement publiques (classements, backlinks), limitant le risque sur des données confidentielles.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — l'accès programmatique passe par l'API Semrush classique." },
    tarifs: [
      { nom: "Pro", prix: "~117 € / mois (annuel)", inclus: "5 projets, 500 mots-clés suivis, recherche et audit de base." },
      { nom: "Guru", prix: "~208 € / mois (annuel)", inclus: "15 projets, 1 500 mots-clés, Content Marketing Toolkit, données historiques." },
      { nom: "Business", prix: "~417 € / mois (annuel)", inclus: "Accès API, Share of Voice, limites étendues pour grandes équipes." },
      { nom: "Semrush One", prix: "À partir de 199 $ / mois", inclus: "Bundle SEO classique + suivi de visibilité dans les moteurs IA." },
    ],
    verdict:
      "Semrush est l'outil qu'on adopte quand le SEO devient une vraie discipline dans l'entreprise, pas un outil qu'on teste par curiosité vu son prix. La profondeur des données concurrentielles justifie le coût pour une agence ou une équipe qui pilote plusieurs sites ; pour un usage plus modeste, il vaut mieux commencer par des alternatives plus légères et migrer vers Semrush une fois le besoin confirmé.",
    faq: [
      { question: "Y a-t-il une version gratuite ?", reponse: "Un essai de 7 jours existe sur les plans payants, mais il n'y a pas de plan gratuit exploitable au-delà d'un usage très basique." },
      { question: "Semrush ou Ahrefs ?", reponse: "Les deux sont comparables en profondeur. Semrush a l'avantage d'une suite plus large (contenu, publicité, réseaux sociaux) ; Ahrefs est souvent jugé plus précis sur les backlinks." },
      { question: "Le module IA remplace-t-il le SEO classique ?", reponse: "Non, il le complète : le suivi de visibilité dans les moteurs IA s'ajoute au référencement Google traditionnel, qui reste l'essentiel du trafic pour la plupart des sites en 2026." },
    ],
  },

  "jasper-ai": {
    slug: "jasper-ai",
    nom: "Jasper AI",
    logo: "JasperAI",
    tagline: "Plateforme de copywriting IA pensée pour les marques.",
    tags: ["Rédaction", "Marketing"],
    notes: { fonctionnalites: 7.5, facilite: 8, valeur: 6, confiance: 7.5 },
    ctaLabel: "Essayer Jasper →",
    ctaUrl: "https://www.jasper.ai",
    testeLe: "10 août 2026",
    essentiel:
      "Jasper est une plateforme de rédaction IA pensée pour les équipes marketing : mémoire de marque, campagnes multicanal et modèles orientés conversion. Aucun plan gratuit, Creator à 39 $/mois, Pro à 59-69 $/mois par siège.",
    quEstCe: [
      "Jasper génère du contenu marketing — articles de blog, publicités, e-mails, posts sociaux — en s'appuyant sur une « Brand Voice » configurée une fois : ton, vocabulaire à éviter, positionnement. L'objectif est de produire du contenu cohérent avec la marque sans reformuler chaque brief.",
      "Au-delà de la génération de texte, la plateforme couvre des campagnes complètes (décliner un message clé en plusieurs formats et canaux) et s'intègre à des workflows d'équipe avec des espaces de travail partagés.",
    ],
    quiEstDerriere:
      "Jasper (anciennement Jarvis) a été fondé en 2021 par Dave Rogenmoser, Chris Hull et John Philip Morgan à Austin, Texas. C'est l'un des premiers outils de rédaction IA grand public, avec un positionnement resté centré sur le marketing d'entreprise.",
    pourQui: {
      idealPour:
        "Les équipes marketing qui produisent beaucoup de contenu multicanal et veulent une cohérence de ton garantie par une mémoire de marque configurée une fois.",
      aEviterSi:
        "Tu es seul avec un besoin ponctuel de rédaction : ChatGPT ou Claude couvrent le même besoin sans abonnement dédié à 39-69 $/mois.",
    },
    demarrage: [
      {
        titre: "Configure ta Brand Voice avant de rédiger",
        description: "Quelques exemples de contenus existants suffisent pour que Jasper capture le ton et le vocabulaire de la marque.",
      },
      {
        titre: "Teste un template proche de ton besoin",
        description: "La bibliothèque de modèles (post LinkedIn, description produit, objet d'e-mail) va plus vite qu'une page blanche pour démarrer.",
      },
      {
        titre: "Décline un message clé en plusieurs formats",
        description: "Une fois un message validé, génère ses variantes pour chaque canal plutôt que de réécrire à chaque fois.",
      },
      {
        titre: "Configure un espace de travail d'équipe",
        description: "Utile dès que plusieurs personnes rédigent pour la même marque et doivent partager mémoire et modèles.",
      },
      {
        titre: "Relis systématiquement avant publication",
        description: "Le contenu généré reste un premier jet : la valeur ajoutée humaine se joue dans la relecture et l'angle final.",
      },
    ],
    fonctionnalites: [
      { titre: "Brand Voice", description: "Mémorise le ton, le vocabulaire et les règles de marque pour générer du contenu cohérent sans tout redéfinir à chaque prompt." },
      { titre: "Bibliothèque de templates", description: "Modèles orientés marketing : articles de blog, publicités, e-mails, descriptions produit." },
      { titre: "Campagnes multicanal", description: "Décline un message clé en plusieurs formats adaptés à chaque canal de diffusion." },
      { titre: "Espaces de travail d'équipe", description: "Partage de mémoire de marque et de modèles entre plusieurs rédacteurs sur un même compte." },
      { titre: "Vérification de plagiat", description: "Contrôle intégré pour s'assurer de l'originalité du contenu généré avant publication." },
      { titre: "Extension navigateur", description: "Génère du texte directement dans d'autres outils (CMS, réseaux sociaux) sans repasser par l'interface Jasper." },
    ],
    workflows: [
      {
        declencheur: "Un message clé validé en interne",
        resultat: "Décliné sur cinq canaux",
        description:
          "Génère automatiquement les variantes adaptées à chaque format — e-mail, post social, publicité — à partir du même message.",
        outils: [],
      },
      {
        declencheur: "Une nouvelle recrue dans l'équipe rédaction",
        resultat: "Un ton de marque respecté dès le premier texte",
        description:
          "La Brand Voice configurée une fois garantit la cohérence sans brief détaillé à chaque nouvelle demande.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Aucun plan gratuit", description: "Impossible de tester au-delà d'un essai limité de 7 jours — un frein pour évaluer l'outil sérieusement avant d'engager un budget." },
      { titre: "Prix élevé pour un usage solo", description: "39 à 69 $/mois par siège reste cher comparé à un abonnement ChatGPT ou Claude pour la même tâche de rédaction brute." },
      { titre: "Qualité proche des modèles génériques", description: "Le contenu produit reste comparable à celui d'un bon prompt sur ChatGPT — la vraie valeur ajoutée est l'organisation, pas la qualité d'écriture pure." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA sur les offres Business",
      aiAct: "Peu de documentation publique détaillée",
      entrainement: "Contenus clients non utilisés pour l'entraînement",
      note: "Jasper est une société américaine ; les transferts hors UE reposent sur des clauses contractuelles types. L'entreprise indique ne pas utiliser le contenu généré par les clients pour entraîner ses modèles sous-jacents.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — l'intégration passe par l'extension navigateur ou les connecteurs natifs Jasper." },
    tarifs: [
      { nom: "Creator", prix: "39 $ / mois", inclus: "Un utilisateur, crédits limités, templates de base, Brand Voice simple." },
      { nom: "Pro", prix: "59-69 $ / mois", inclus: "Campagnes multicanal, espaces de travail d'équipe, davantage de crédits." },
      { nom: "Business", prix: "Sur devis (~900 $/mois pour petites équipes)", inclus: "Fonctionnalités de collaboration avancées, accès API, support dédié." },
    ],
    verdict:
      "Jasper a du sens pour une équipe marketing qui produit en volume et veut une cohérence de marque garantie sans qu'un rédacteur ne dérape sur le ton. Pour un usage individuel ou occasionnel, le rapport qualité-prix ne tient pas face à un abonnement Claude ou ChatGPT à 20 €/mois qui couvre la même tâche de rédaction, sans la couche « marque » en plus.",
    faq: [
      { question: "Jasper est-il meilleur que ChatGPT pour écrire ?", reponse: "Pas fondamentalement en qualité de texte — l'avantage de Jasper est la mémoire de marque et les workflows d'équipe, pas la prose elle-même." },
      { question: "Y a-t-il un essai gratuit ?", reponse: "Oui, 7 jours sur les plans Creator et Pro, mais pas de plan gratuit permanent." },
      { question: "Peut-on l'utiliser en français ?", reponse: "Oui, Jasper génère du contenu dans plusieurs langues dont le français, avec une qualité correcte mais parfois moins naturelle qu'en anglais." },
    ],
  },

  elevenlabs: {
    slug: "elevenlabs",
    nom: "ElevenLabs",
    logo: "ElevenLabs",
    tagline: "Les voix IA les plus réalistes du marché.",
    tags: ["Voix", "IA générative"],
    notes: { fonctionnalites: 9, facilite: 8, valeur: 7.5, confiance: 8.5 },
    ctaLabel: "Essayer ElevenLabs →",
    ctaUrl: "https://elevenlabs.io",
    testeLe: "10 août 2026",
    essentiel:
      "ElevenLabs génère des voix IA d'un réalisme rarement égalé : synthèse vocale, clonage de voix et doublage multilingue. Gratuit avec 10 000 crédits mensuels (environ 10 minutes), Creator à 22 $/mois pour débloquer le clonage vocal professionnel, jusqu'à Business à 990 $/mois.",
    quEstCe: [
      "ElevenLabs transforme du texte en voix, avec un niveau de naturel — intonation, respiration, émotion — qui reste la référence du secteur. L'outil couvre aussi le clonage de voix (recréer une voix à partir d'un échantillon audio) et le doublage automatique d'une vidéo dans une autre langue en conservant le ton de la voix originale.",
      "L'offre s'est élargie vers l'agent vocal complet : Conversational AI permet de construire un assistant vocal qui répond en temps réel par téléphone ou dans une app, utile pour du support client ou des lignes d'assistance automatisées.",
    ],
    quiEstDerriere:
      "ElevenLabs a été fondée en 2022 à Londres par Piotr Dabkowski et Mati Staniszewski, deux anciens ingénieurs de Google et Palantir, avec l'ambition explicite de rendre la synthèse vocale indiscernable d'une voix humaine.",
    pourQui: {
      idealPour:
        "La production de contenu audio (podcasts, voix off, doublage) et les usages nécessitant un agent vocal réaliste, en français comme dans une trentaine d'autres langues.",
      aEviterSi:
        "Ton besoin se limite à une voix off ponctuelle et basique : les outils de synthèse vocale intégrés à d'autres plateformes (Canva, Synthesia) peuvent suffire sans abonnement séparé.",
    },
    demarrage: [
      {
        titre: "Teste une voix de la bibliothèque",
        description: "Des dizaines de voix pré-entraînées couvrent déjà de nombreux usages avant d'envisager un clonage personnalisé.",
      },
      {
        titre: "Génère un premier extrait avec réglages d'émotion",
        description: "Stabilité, similarité et exagération de style se règlent finement pour coller au ton recherché.",
      },
      {
        titre: "Passe au Creator pour le clonage professionnel",
        description: "Nécessaire dès que tu veux recréer une voix spécifique (la tienne ou celle d'un client, avec son consentement) plutôt qu'utiliser une voix de bibliothèque.",
      },
      {
        titre: "Essaie le doublage automatique sur une courte vidéo",
        description: "Une bonne façon de mesurer la qualité avant de l'utiliser sur un contenu long ou stratégique.",
      },
      {
        titre: "Explore Conversational AI si tu veux un agent vocal",
        description: "Utile pour un usage plus poussé (support client, ligne téléphonique automatisée) au-delà de la simple génération de voix.",
      },
    ],
    fonctionnalites: [
      { titre: "Synthèse vocale ultra-réaliste", description: "Intonation, respiration et émotion rendent la voix générée difficile à distinguer d'un enregistrement humain." },
      { titre: "Clonage de voix", description: "Recrée une voix spécifique à partir de quelques minutes d'échantillon audio, avec vérification de consentement." },
      { titre: "Doublage multilingue", description: "Traduit et double automatiquement une vidéo dans une autre langue en conservant le ton de la voix originale." },
      { titre: "Conversational AI", description: "Construit un agent vocal complet capable de répondre en temps réel par téléphone ou dans une app." },
      { titre: "Bibliothèque de voix communautaire", description: "Des milliers de voix partagées par d'autres utilisateurs, utilisables selon les conditions de licence." },
      { titre: "API développeur", description: "Intégration directe dans une app ou un produit, avec facturation à l'usage au-delà du forfait inclus." },
    ],
    workflows: [
      {
        declencheur: "Un script de podcast",
        resultat: "Un épisode audio complet",
        description:
          "Génère la voix avec intonation naturelle, sans studio d'enregistrement ni comédien voix off.",
        outils: [],
      },
      {
        declencheur: "Une vidéo de formation en français",
        resultat: "Disponible en dix langues",
        description:
          "Le doublage automatique conserve le ton de la voix originale dans chaque langue cible.",
        outils: [],
      },
      {
        declencheur: "Un besoin de ligne téléphonique automatisée",
        resultat: "Un agent vocal qui répond en temps réel",
        description:
          "Conversational AI construit l'agent complet, du script à la voix, pour un premier niveau de support.",
        outils: ["Conversational AI"],
      },
    ],
    limites: [
      { titre: "Coûts additionnels fréquents", description: "LLM, téléphonie et usage au-delà du forfait sont facturés séparément dès qu'on dépasse la simple génération de voix." },
      { titre: "Plan gratuit très limité", description: "10 000 crédits mensuels ne couvrent qu'environ 10 minutes de génération, insuffisant pour un usage régulier." },
      { titre: "Risques d'usage détourné", description: "La qualité du clonage de voix pose une vraie question éthique, encadrée par une vérification mais pas totalement infaillible." },
    ],
    conformite: {
      hebergement: "Royaume-Uni / États-Unis",
      rgpd: "Conforme via DPA, clauses contractuelles types",
      aiAct: "Documentation sur l'usage responsable de la voix publiée",
      entrainement: "Politique variable selon le plan, à vérifier",
      note: "ElevenLabs est basée au Royaume-Uni, hors Union européenne post-Brexit ; un DPA et des clauses contractuelles types encadrent les transferts de données pour les clients européens.",
    },
    mcp: { disponible: true, officiel: true, note: "ElevenLabs publie un serveur MCP officiel permettant à un agent IA de générer de la voix, du son ou de piloter Conversational AI directement.", lien: "https://elevenlabs.io/docs" },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "10 000 crédits/mois (~10 min de voix), voix de bibliothèque limitées." },
      { nom: "Starter", prix: "5 $ / mois", inclus: "Crédits élargis, premier niveau utilisable pour du contenu publiable." },
      { nom: "Creator", prix: "22 $ / mois", inclus: "121 000 crédits, clonage de voix professionnel débloqué." },
      { nom: "Pro", prix: "99 $ / mois", inclus: "Volume adapté à une petite équipe, accès prioritaire aux nouveaux modèles." },
      { nom: "Scale", prix: "299-330 $ / mois", inclus: "2 millions de crédits, adapté à une production régulière à grande échelle." },
    ],
    verdict:
      "ElevenLabs reste la référence quand la qualité de voix ne doit pas trahir l'IA — pour un podcast, une voix off ou un doublage qui doit sonner naturel, l'écart avec la concurrence s'entend. Le vrai budget à anticiper n'est pas le plan affiché mais les coûts additionnels (téléphonie, LLM, dépassement) dès qu'on va vers un agent vocal complet plutôt qu'une simple génération de voix.",
    faq: [
      { question: "ElevenLabs est-il gratuit ?", reponse: "Un plan gratuit existe avec 10 000 crédits mensuels, soit environ 10 minutes de voix — suffisant pour tester, pas pour un usage régulier." },
      { question: "Peut-on cloner sa propre voix ?", reponse: "Oui, à partir du plan Creator (22 $/mois), avec un processus de vérification du consentement." },
      { question: "Le doublage fonctionne-t-il bien en français ?", reponse: "Oui, le français fait partie des langues les mieux couvertes, avec une qualité proche de l'anglais." },
    ],
  },

  synthesia: {
    slug: "synthesia",
    nom: "Synthesia",
    logo: "Synthesia",
    tagline: "Transforme du texte en vidéos présentées par un avatar.",
    tags: ["Vidéo", "IA générative"],
    notes: { fonctionnalites: 8, facilite: 7.5, valeur: 6.5, confiance: 8 },
    ctaLabel: "Essayer Synthesia →",
    ctaUrl: "https://www.synthesia.io",
    testeLe: "10 août 2026",
    essentiel:
      "Synthesia transforme un script texte en vidéo présentée par un avatar IA parlant, dans plus de 140 langues, sans caméra ni studio. Pensé pour la formation et la communication d'entreprise. Gratuit limité à 10 minutes/mois avec filigrane, Starter à 29 $/mois, Creator à 89 $/mois.",
    quEstCe: [
      "Synthesia génère une vidéo à partir d'un texte : tu choisis un avatar (plus de 230 disponibles, ou un avatar personnel créé à partir de tes propres enregistrements), colles ton script, et l'outil produit une vidéo où l'avatar parle avec un mouvement labial synchronisé, dans la langue de ton choix.",
      "Le cas d'usage dominant est la formation d'entreprise et la communication interne : modules de formation, annonces, tutoriels produit — des contenus qui demandent d'être mis à jour régulièrement et où retourner filmer à chaque fois serait coûteux.",
    ],
    quiEstDerriere:
      "Synthesia a été fondée en 2017 à Londres par Victor Riparbelli, Steffen Tjerrild et Matthias Niessner. L'entreprise s'est imposée comme le leader de la vidéo à avatar IA pour l'entreprise, valorisée plus d'un milliard de dollars.",
    pourQui: {
      idealPour:
        "La formation d'entreprise, les communications internes et les tutoriels produit qui doivent être traduits en plusieurs langues sans reproduction de tournage.",
      aEviterSi:
        "Tu cherches une vidéo créative ou narrative avec une vraie mise en scène — l'avatar reste figé dans un cadre fixe, peu adapté à un contenu cinématographique.",
    },
    demarrage: [
      {
        titre: "Choisis un avatar proche de ton besoin",
        description: "La bibliothèque de plus de 230 avatars couvre déjà large ; un avatar personnel se crée ensuite si l'identité de marque l'exige.",
      },
      {
        titre: "Rédige ton script avant de générer",
        description: "La qualité du rendu dépend directement d'un script bien écrit, pensé pour être parlé et pas seulement lu.",
      },
      {
        titre: "Teste une traduction automatique",
        description: "Génère la même vidéo dans une autre langue pour évaluer la qualité de synchronisation labiale avant un déploiement multilingue.",
      },
      {
        titre: "Utilise un template pour démarrer plus vite",
        description: "Les modèles pré-construits pour la formation ou l'onboarding structurent le script avant même de commencer à écrire.",
      },
      {
        titre: "Passe au Creator si tu as besoin d'avatars personnels multiples",
        description: "Nécessaire pour une identité de marque cohérente sur plusieurs porte-paroles vidéo.",
      },
    ],
    fonctionnalites: [
      { titre: "Avatars IA réalistes", description: "Plus de 230 avatars pré-entraînés, ou un avatar personnel créé à partir de quelques minutes d'enregistrement." },
      { titre: "Plus de 140 langues", description: "Une même vidéo se décline automatiquement dans de nombreuses langues avec synchronisation labiale adaptée." },
      { titre: "Templates de formation", description: "Modèles pré-structurés pour l'onboarding, la conformité et les tutoriels produit." },
      { titre: "Édition type PowerPoint", description: "Interface de montage simple, pensée pour qui n'a jamais fait de montage vidéo." },
      { titre: "API et intégration", description: "Génération de vidéos à la volée depuis un système tiers, utile pour des contenus personnalisés à grande échelle." },
      { titre: "Interactive Video", description: "Ajoute des embranchements et des questions dans la vidéo pour un format de formation interactif." },
    ],
    workflows: [
      {
        declencheur: "Un module de formation à mettre à jour chaque trimestre",
        resultat: "Une vidéo régénérée en quelques minutes",
        description:
          "Modifie le script, l'avatar régénère la vidéo sans nouveau tournage ni comédien à rappeler.",
        outils: [],
      },
      {
        declencheur: "Une annonce interne à diffuser largement",
        resultat: "Traduite en vingt langues automatiquement",
        description:
          "Une même vidéo se décline dans toutes les langues nécessaires avec synchronisation labiale adaptée.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Rendu encore perceptible comme IA", description: "Malgré les progrès, un œil averti distingue encore souvent un avatar Synthesia d'un vrai présentateur." },
      { titre: "Minutes de vidéo plafonnées", description: "Chaque plan limite le nombre de minutes générées par mois, contrairement à un abonnement à usage illimité." },
      { titre: "Peu adapté au récit créatif", description: "Le format reste celui d'un présentateur cadré, sans mise en scène ni mouvement de caméra." },
    ],
    conformite: {
      hebergement: "Royaume-Uni / États-Unis",
      rgpd: "Conforme via DPA",
      aiAct: "Encadrement spécifique sur les avatars et le consentement de voix/image",
      entrainement: "Contenus clients non utilisés pour l'entraînement sans consentement",
      note: "Synthesia impose un processus de consentement explicite pour la création d'un avatar personnel, avec vérification d'identité — une réponse directe aux risques de deepfake.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel — l'intégration programmatique passe par l'API Synthesia classique." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "10 minutes de vidéo/mois, 9 avatars, filigrane et logo Synthesia." },
      { nom: "Starter", prix: "29 $ / mois", inclus: "10 minutes/mois, 125+ avatars, 3 avatars personnels, sans filigrane." },
      { nom: "Creator", prix: "89 $ / mois", inclus: "30 minutes/mois, 180+ avatars, 5 avatars personnels, accès API, vidéo interactive." },
      { nom: "Enterprise", prix: "Sur devis", inclus: "Minutes illimitées, SSO, export SCORM pour LMS." },
    ],
    verdict:
      "Synthesia résout un vrai problème pour les équipes formation et communication interne : produire et maintenir à jour des vidéos multilingues sans studio ni tournage répété. Le compromis assumé est le rendu — encore identifiable comme IA — contre une vitesse et une scalabilité qu'aucun tournage classique n'égale. Pour du contenu créatif ou de marque grand public, ce n'est pas le bon outil.",
    faq: [
      { question: "Les avatars sont-ils crédibles ?", reponse: "De mieux en mieux, mais un œil attentif reconnaît encore souvent un avatar Synthesia — largement suffisant pour de la formation interne, plus discutable pour du contenu de marque public." },
      { question: "Peut-on créer un avatar de soi-même ?", reponse: "Oui, à partir du plan Starter, avec un processus de consentement et de vérification d'identité." },
      { question: "Combien de langues sont couvertes ?", reponse: "Plus de 140, avec une synchronisation labiale adaptée à chacune — un des points forts de l'outil pour du contenu international." },
    ],
  },

  granola: {
    slug: "granola",
    nom: "Granola",
    logo: "Granola",
    tagline: "Tu prends tes notes, l'IA écrit le compte-rendu, sans robot dans ta visio.",
    tags: ["Réunions", "Productivité"],
    notes: { fonctionnalites: 7.5, facilite: 9, valeur: 7.5, confiance: 7.5 },
    ctaLabel: "Essayer Granola →",
    ctaUrl: "https://www.granola.ai",
    testeLe: "10 août 2026",
    essentiel:
      "Granola enregistre l'audio de tes réunions et transforme tes notes manuscrites (même minimales) en compte-rendu structuré, sans bot visible qui rejoint l'appel. Basic gratuit avec historique glissant de 30 jours, Business à 14 $/utilisateur/mois pour l'historique illimité.",
    quEstCe: [
      "Granola tourne en arrière-plan pendant une visio (Zoom, Meet, Teams) et capture l'audio localement, sans qu'un bot n'apparaisse dans la liste des participants — une différence notable avec la plupart des assistants de réunion IA. Pendant la réunion, tu prends tes propres notes, même très courtes ; à la fin, l'IA les enrichit avec ce qui a été dit pour produire un compte-rendu complet.",
      "Le résultat ressemble à des notes que tu aurais prises toi-même en étant parfaitement attentif, pas à une transcription brute. L'outil propose aussi un chat pour interroger l'historique de tes réunions passées, et des intégrations vers Notion, Slack et le CRM pour pousser automatiquement les comptes-rendus.",
    ],
    quiEstDerriere:
      "Granola est développée par une startup basée à Londres et San Francisco, fondée par une équipe d'anciens de DeepMind et Meta. L'outil s'est fait connaître par le bouche-à-oreille dans les milieux tech avant de s'ouvrir plus largement en 2025.",
    pourQui: {
      idealPour:
        "Les professionnels qui enchaînent les réunions et veulent un compte-rendu fiable sans avoir à taper frénétiquement pendant que quelqu'un parle.",
      aEviterSi:
        "Tes réunions se tiennent principalement en présentiel sans micro d'ordinateur, ou tu as besoin d'un bot qui transcrit aussi les appels où tu n'es pas présent.",
    },
    demarrage: [
      {
        titre: "Installe l'app desktop et autorise le micro",
        description: "Granola capture l'audio localement pendant que tu es dans l'appel, sans navigateur ni extension supplémentaire.",
      },
      {
        titre: "Prends des notes minimales pendant la réunion",
        description: "Quelques mots-clés suffisent : l'IA s'appuie dessus pour structurer le compte-rendu final autour de ce qui t'a semblé important.",
      },
      {
        titre: "Relis et ajuste le compte-rendu généré",
        description: "Le premier compte-rendu généré est un bon point de départ, pas un texte final à envoyer sans relecture.",
      },
      {
        titre: "Connecte Notion ou Slack",
        description: "Pousse automatiquement les comptes-rendus vers ton outil de suivi habituel plutôt que de les copier-coller.",
      },
      {
        titre: "Utilise le chat pour retrouver une décision passée",
        description: "Interroge l'historique de réunions en langage naturel plutôt que de rechercher dans une liste de comptes-rendus.",
      },
    ],
    fonctionnalites: [
      { titre: "Capture sans bot visible", description: "Aucun participant supplémentaire n'apparaît dans l'appel, contrairement à la plupart des assistants de réunion concurrents." },
      { titre: "Notes enrichies par l'IA", description: "Combine tes notes manuscrites avec l'audio pour produire un compte-rendu structuré, pas une simple transcription." },
      { titre: "Chat sur l'historique", description: "Interroge l'ensemble de tes réunions passées en langage naturel pour retrouver une décision ou un engagement." },
      { titre: "Intégrations natives", description: "Envoie automatiquement les comptes-rendus vers Notion, HubSpot, Slack ou Zapier." },
      { titre: "Modèles de compte-rendu", description: "Adapte la structure de sortie selon le type de réunion (point d'équipe, entretien, appel commercial)." },
      { titre: "Fonctionne multi-plateforme", description: "Compatible Zoom, Google Meet, Microsoft Teams et les appels en personne via le micro de l'ordinateur." },
    ],
    workflows: [
      {
        declencheur: "Une réunion client qui vient de se terminer",
        resultat: "Un compte-rendu envoyé automatiquement",
        description:
          "Connecté à Notion ou Slack, le compte-rendu part sans étape manuelle de copier-coller.",
        outils: ["Notion", "Slack"],
      },
      {
        declencheur: "Plusieurs mois de réunions passées",
        resultat: "Une décision retrouvée en une question",
        description:
          "Le chat sur l'historique retrouve un engagement pris plusieurs semaines auparavant, sans reparcourir chaque compte-rendu.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Historique glissant sur le plan gratuit", description: "Le plan Basic ne conserve l'accès qu'aux 30 derniers jours de notes, au-delà elles restent capturées mais moins accessibles." },
      { titre: "Dépend de la qualité audio", description: "Un environnement bruyant ou un micro de mauvaise qualité dégrade la précision du compte-rendu généré." },
      { titre: "Moins pertinent en présentiel pur", description: "L'outil est pensé pour les visios : les réunions physiques sans ordinateur ouvert en profitent moins directement." },
    ],
    conformite: {
      hebergement: "États-Unis / Royaume-Uni",
      rgpd: "Conforme via DPA sur les offres payantes",
      aiAct: "Peu de documentation publique détaillée",
      entrainement: "Opt-out possible sur l'entraînement modèle en Enterprise",
      note: "Sur le plan Enterprise, Granola propose un opt-out explicite de l'entraînement des modèles sur les données de l'équipe — une garantie moins formalisée sur les plans individuels.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — les intégrations passent par les connecteurs natifs (Notion, Slack, Zapier)." },
    tarifs: [
      { nom: "Basic", prix: "Gratuit", inclus: "Réunions illimitées, notes IA, chat, historique glissant de 30 jours." },
      { nom: "Business", prix: "14 $ / utilisateur / mois", inclus: "Historique illimité, modèles avancés, intégrations Notion/HubSpot/Slack/Zapier." },
      { nom: "Enterprise", prix: "À partir de 35 $ / utilisateur / mois", inclus: "SSO, opt-out d'entraînement à l'échelle de l'équipe, accès API, support prioritaire." },
    ],
    verdict:
      "Granola a trouvé un vrai angle différenciant : ne pas ajouter de bot visible dans la réunion, ce qui évite le malaise de « l'IA qui écoute » côté interlocuteur. Le plan gratuit est honnête et suffit pour un usage individuel léger ; l'historique illimité du Business à 14 $/mois devient vite indispensable dès que les réunions s'accumulent et qu'on veut pouvoir y revenir plusieurs mois après.",
    faq: [
      { question: "Granola est-il gratuit ?", reponse: "Oui, avec réunions illimitées mais un historique limité aux 30 derniers jours. Le Business à 14 $/mois lève cette limite." },
      { question: "Les autres participants voient-ils que j'utilise Granola ?", reponse: "Non, contrairement à un bot de transcription classique, Granola ne rejoint pas l'appel comme participant visible." },
      { question: "Fonctionne-t-il pour des réunions en français ?", reponse: "Oui, la transcription et la génération de compte-rendu supportent le français, avec une qualité proche de l'anglais." },
    ],
  },

  n8n: {
    slug: "n8n",
    nom: "n8n",
    logo: "N8n",
    tagline: "L'automatisation open source, flexible et auto-hébergeable.",
    tags: ["Automatisation", "Code"],
    notes: { fonctionnalites: 9, facilite: 6.5, valeur: 9, confiance: 8 },
    ctaLabel: "Essayer n8n →",
    ctaUrl: "https://n8n.io",
    testeLe: "10 août 2026",
    essentiel:
      "n8n est l'alternative open source à Zapier : mêmes principes de déclencheurs et d'actions, mais avec la possibilité d'auto-héberger gratuitement et d'écrire du code custom directement dans un workflow. Cloud Starter à 24 €/mois, Pro à 60 €/mois, ou self-hosted à coût d'infrastructure seul.",
    quEstCe: [
      "n8n construit des automatisations sous forme de workflows visuels — nœuds reliés entre eux, chacun représentant un déclencheur ou une action. La différence avec Zapier tient dans l'ouverture : le cœur du produit est open source, auto-hébergeable sur ton propre serveur, et chaque nœud peut être complété par du code JavaScript ou Python directement inséré dans le flux.",
      "Le catalogue de connecteurs (environ 400 intégrations natives) reste plus modeste que celui de Zapier, mais n8n compense par un nœud HTTP générique qui permet de se connecter à n'importe quelle API, même sans connecteur dédié — une flexibilité que peu de concurrents no-code offrent.",
    ],
    quiEstDerriere:
      "n8n GmbH est une entreprise allemande fondée à Berlin en 2019 par Jan Oberhauser, ancien responsable produit chez une entreprise d'automatisation industrielle. Le nom signifie « nodemation » (n + 8 lettres + n), reflet de son approche par nœuds.",
    pourQui: {
      idealPour:
        "Les profils techniques ou semi-techniques qui veulent une automatisation flexible, avec la possibilité d'auto-héberger pour maîtriser les coûts et les données.",
      aEviterSi:
        "Tu veux une prise en main immédiate sans aucune notion technique — l'interface, plus proche du développement que Zapier, demande une vraie phase d'apprentissage.",
    },
    demarrage: [
      {
        titre: "Choisis entre Cloud et self-hosted",
        description: "Le Cloud simplifie le démarrage sans serveur à gérer ; le self-hosted (Docker) est gratuit mais demande une base technique pour l'installer et le maintenir.",
      },
      {
        titre: "Construis un premier workflow à deux nœuds",
        description: "Un déclencheur, une action : comprendre cette mécanique de base avant d'ajouter de la logique conditionnelle.",
      },
      {
        titre: "Explore le nœud HTTP générique",
        description: "Utile dès qu'un service n'a pas de connecteur natif — c'est souvent ce qui distingue n8n d'un outil no-code plus fermé.",
      },
      {
        titre: "Ajoute un nœud de code si besoin",
        description: "JavaScript ou Python directement dans le workflow pour une transformation de données qu'aucun connecteur ne prévoit.",
      },
      {
        titre: "Teste chaque nœud individuellement",
        description: "L'exécution pas à pas permet de vérifier les données à chaque étape avant d'activer le workflow complet en production.",
      },
      {
        titre: "Connecte un serveur MCP si tu utilises un agent IA",
        description: "n8n peut à la fois consommer et exposer des capacités MCP, utile pour brancher un agent comme Claude à tes automatisations.",
      },
    ],
    fonctionnalites: [
      { titre: "Open source et auto-hébergeable", description: "Le cœur du produit est gratuit à faire tourner sur ta propre infrastructure, sans limite artificielle de workflows ou d'utilisateurs." },
      { titre: "Nœud HTTP générique", description: "Connecte n'importe quelle API même sans intégration native dédiée, contrairement à des outils plus fermés." },
      { titre: "Nœuds de code intégrés", description: "JavaScript et Python directement dans le workflow pour des transformations que l'interface visuelle seule ne permet pas." },
      { titre: "Support MCP natif", description: "Peut consommer des serveurs MCP externes et exposer ses propres workflows comme outils MCP pour un agent IA." },
      { titre: "Logique avancée", description: "Boucles, branches conditionnelles, gestion d'erreurs et sous-workflows pour des automatisations complexes." },
      { titre: "Exécutions illimitées en self-hosted", description: "Sans le modèle de facturation à la tâche de la plupart des concurrents, le volume n'est limité que par ton infrastructure." },
    ],
    workflows: [
      {
        declencheur: "Un nouvel outil sans connecteur natif",
        resultat: "Connecté quand même",
        description:
          "Le nœud HTTP générique se branche à n'importe quelle API, même sans intégration dédiée.",
        outils: [],
      },
      {
        declencheur: "Un agent Claude qui doit exécuter une action externe",
        resultat: "Un workflow n8n déclenché",
        description:
          "Expose un workflow n8n comme outil MCP directement consommable par l'agent.",
        outils: ["MCP", "Claude"],
      },
      {
        declencheur: "Une automatisation Zapier devenue coûteuse en volume",
        resultat: "Migrée en self-hosted à coût quasi nul",
        description:
          "Même principe de déclencheur/action, sans facturation à la tâche exécutée.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Courbe d'apprentissage plus raide", description: "L'approche par nœuds et la possibilité de coder demandent plus de familiarité technique qu'un outil comme Zapier." },
      { titre: "Catalogue de connecteurs plus restreint", description: "Environ 400 intégrations natives contre plusieurs milliers chez Zapier, compensées par le nœud HTTP générique mais avec plus de configuration manuelle." },
      { titre: "Maintenance en self-hosted", description: "Héberger soi-même signifie gérer les mises à jour, la sécurité et la disponibilité du serveur — un vrai engagement technique." },
    ],
    conformite: {
      hebergement: "Allemagne (Cloud) ou infrastructure au choix (self-hosted)",
      rgpd: "Conforme, société allemande, hébergement UE par défaut",
      aiAct: "Non applicable directement (outil d'orchestration)",
      entrainement: "Non applicable (pas de modèle IA propriétaire entraîné sur les workflows)",
      note: "n8n GmbH est une société allemande ; le Cloud héberge par défaut en Europe, et le self-hosted permet de garder l'intégralité des données et des exécutions sur une infrastructure choisie par l'utilisateur — l'option de souveraineté la plus forte parmi les outils d'automatisation.",
    },
    mcp: { disponible: true, officiel: true, note: "n8n propose un nœud MCP natif dans les deux sens : consommer des serveurs MCP externes dans un workflow, ou exposer un workflow n8n comme outil MCP pour un agent IA.", lien: "https://docs.n8n.io" },
    tarifs: [
      { nom: "Self-hosted", prix: "Gratuit", inclus: "Toutes les fonctionnalités open source, workflows et exécutions illimités, coût d'infrastructure à ta charge." },
      { nom: "Cloud Starter", prix: "24 € / mois", inclus: "2 500 exécutions/mois, workflows et utilisateurs illimités, 1 projet partagé." },
      { nom: "Cloud Pro", prix: "60 € / mois", inclus: "10 000 exécutions/mois, meilleures limites de performance." },
      { nom: "Business", prix: "800 € / mois", inclus: "Volumes élevés, fonctionnalités d'équipe et de gouvernance avancées." },
    ],
    verdict:
      "n8n est l'automatisation qu'on choisit quand Zapier commence à coûter cher ou à sembler trop fermé. Le self-hosted gratuit change vraiment l'équation économique pour qui a la fibre technique — et le support MCP natif, dans les deux sens, en fait un pont naturel entre agents IA et automatisations classiques. Le vrai coût n'est pas l'abonnement mais le temps d'apprentissage : compte plusieurs jours avant d'être aussi à l'aise qu'avec un outil no-code plus guidé.",
    faq: [
      { question: "n8n est-il vraiment gratuit ?", reponse: "Oui en self-hosted, sans limite de workflows ni d'exécutions — seul le coût du serveur reste à ta charge. Le Cloud, lui, est payant dès le premier euro." },
      { question: "n8n ou Zapier ?", reponse: "Zapier va plus vite à prendre en main et a un catalogue de connecteurs plus large. n8n coûte nettement moins cher à volume élevé et offre plus de flexibilité technique (code, self-hosting, MCP)." },
      { question: "Faut-il savoir coder pour utiliser n8n ?", reponse: "Non pour les automatisations simples, l'interface reste visuelle. Mais savoir écrire un peu de JavaScript aide beaucoup dès que les besoins se complexifient." },
    ],
  },

  cursor: {
    slug: "cursor",
    nom: "Cursor",
    logo: "Cursor",
    tagline: "L'éditeur de code qui code avec toi, pas juste pour toi.",
    tags: ["Code", "Agents"],
    notes: { fonctionnalites: 9, facilite: 7.5, valeur: 7.5, confiance: 8.5 },
    ctaLabel: "Essayer Cursor →",
    ctaUrl: "https://cursor.com",
    testeLe: "10 août 2026",
    essentiel:
      "Cursor est un éditeur de code construit sur VS Code, avec l'IA intégrée au cœur de l'expérience plutôt qu'ajoutée en extension : complétion prédictive, chat sur la base de code, et un mode agent qui modifie plusieurs fichiers de façon autonome. Hobby gratuit, Pro à 20 $/mois avec système de crédits.",
    quEstCe: [
      "Cursor reprend l'interface familière de VS Code (extensions, thèmes, raccourcis compatibles) et y intègre l'IA à trois niveaux : la Tab, une complétion qui anticipe plusieurs lignes et même le fichier suivant à éditer ; le Chat, pour poser des questions sur la base de code ou demander une modification ciblée ; et l'Agent, qui prend en charge une tâche complète en modifiant plusieurs fichiers, en exécutant des commandes et en corrigeant ses propres erreurs.",
      "Depuis juin 2025, la facturation fonctionne par crédits : chaque plan payant inclut un pool de crédits égal à son prix, consommé uniquement quand tu choisis manuellement un modèle frontière (Claude, GPT). Le mode Auto, qui laisse Cursor choisir le modèle, reste illimité sur tous les plans payants.",
    ],
    quiEstDerriere:
      "Cursor est développé par Anysphere, une startup fondée en 2022 à San Francisco par Michael Truell, Sualeh Asif, Arvid Lunnemark et Aman Sanger, tous issus du MIT. L'entreprise s'est imposée comme l'un des éditeurs de code IA les plus utilisés, avec une valorisation dépassant plusieurs milliards de dollars.",
    pourQui: {
      idealPour:
        "Les développeurs qui veulent un éditeur complet avec l'IA nativement intégrée, plutôt qu'un agent séparé en ligne de commande comme Claude Code.",
      aEviterSi:
        "Tu es déjà à l'aise avec Claude Code ou un autre agent CLI dans ton terminal et n'as pas besoin d'un environnement graphique dédié en plus.",
    },
    demarrage: [
      {
        titre: "Importe ta configuration VS Code",
        description: "Extensions, thèmes et raccourcis se migrent en un clic, pour ne rien perdre de tes habitudes existantes.",
      },
      {
        titre: "Laisse la Tab compléter pendant que tu codes",
        description: "La complétion prédictive fonctionne sans rien demander explicitement — le vrai gain de temps quotidien est souvent là, pas dans le chat.",
      },
      {
        titre: "Utilise le Chat pour comprendre une base de code inconnue",
        description: "Poser des questions sur un fichier ou une fonction va plus vite que de tout lire ligne par ligne en arrivant sur un projet.",
      },
      {
        titre: "Confie une tâche complète à l'Agent",
        description: "Commence par une tâche encadrée (petit refactor, correction de bug) pour évaluer la fiabilité avant de déléguer plus large.",
      },
      {
        titre: "Reste en mode Auto pour un usage sans surprise de facturation",
        description: "Le mode Auto est illimité sur les plans payants ; réserve le choix manuel d'un modèle frontière aux tâches qui le justifient vraiment.",
      },
      {
        titre: "Configure un fichier de règles projet",
        description: "Comme un CLAUDE.md, un fichier de règles Cursor transmet conventions et contraintes à chaque session sans les répéter.",
      },
    ],
    fonctionnalites: [
      { titre: "Tab prédictive", description: "Complétion qui anticipe plusieurs lignes, voire le prochain fichier à éditer, bien au-delà d'une simple autocomplétion." },
      { titre: "Chat sur la base de code", description: "Pose des questions ou demande des modifications ciblées avec le contexte complet du projet." },
      { titre: "Mode Agent", description: "Prend en charge une tâche de bout en bout : modification multi-fichiers, exécution de commandes, correction d'erreurs." },
      { titre: "Compatible VS Code", description: "Extensions, thèmes et raccourcis existants fonctionnent directement, sans réapprentissage de l'éditeur." },
      { titre: "Choix du modèle", description: "Bascule entre plusieurs modèles frontière (Claude, GPT) selon la tâche, ou laisse le mode Auto choisir." },
      { titre: "Fichier de règles projet", description: "Transmet conventions et contraintes du projet à chaque session, comme un fichier d'instructions persistant." },
    ],
    workflows: [
      {
        declencheur: "Une base de code inconnue à explorer",
        resultat: "Comprise en quelques questions",
        description:
          "Le Chat répond avec le contexte complet du projet, sans avoir à tout lire fichier par fichier.",
        outils: [],
      },
      {
        declencheur: "Un refactor qui touche dix fichiers",
        resultat: "Traité en une seule tâche",
        description:
          "Le mode Agent modifie tous les fichiers concernés de façon cohérente, en une session.",
        outils: [],
      },
      {
        declencheur: "Un outil MCP externe (Figma, base de données)",
        resultat: "Accessible directement dans l'éditeur",
        description:
          "Cursor se connecte comme client MCP pour donner à l'IA le contexte de l'outil externe.",
        outils: ["MCP"],
      },
    ],
    limites: [
      { titre: "Système de crédits peu lisible", description: "Le coût réel dépend du modèle choisi et de l'usage : les power users dépassent régulièrement le forfait de base, avec un coût effectif de 40-50 $/mois sur le plan Pro." },
      { titre: "Dépendance à un environnement graphique", description: "Contrairement à un agent CLI, Cursor demande d'ouvrir l'éditeur — moins adapté à un usage scripté ou en CI." },
      { titre: "Relecture toujours nécessaire", description: "L'Agent peut se tromper avec assurance : chaque modification mérite une vraie relecture avant d'être validée." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA sur les offres Teams/Enterprise",
      aiAct: "Peu de documentation publique détaillée",
      entrainement: "Opt-out possible du mode « Privacy » sans conservation du code",
      note: "Cursor propose un mode Privacy qui désactive la conservation et l'utilisation du code pour l'entraînement — un réglage à vérifier explicitement pour du code propriétaire sensible.",
    },
    mcp: { disponible: true, officiel: true, note: "Cursor est l'un des clients MCP de référence : connexion à des serveurs MCP externes en quelques clics, avec gestion des permissions par outil.", lien: "https://docs.cursor.com" },
    tarifs: [
      { nom: "Hobby", prix: "Gratuit", inclus: "Agent et complétion Tab en usage limité, suffisant pour évaluer l'outil." },
      { nom: "Pro", prix: "20 $ / mois", inclus: "Tab illimitée, agent étendu, 20 $ de crédits modèles frontière inclus." },
      { nom: "Pro+", prix: "60 $ / mois", inclus: "Pool de crédits plus large pour un usage intensif." },
      { nom: "Ultra", prix: "200 $ / mois", inclus: "Crédits maximisés pour un usage professionnel très intensif." },
      { nom: "Teams", prix: "40 $ / utilisateur / mois", inclus: "Facturation centralisée, SSO, contrôles d'administration." },
    ],
    verdict:
      "Cursor est le choix naturel pour qui veut l'IA directement dans son éditeur plutôt que dans un terminal séparé — la Tab prédictive à elle seule justifie souvent l'abonnement pour un développeur qui code au quotidien. Le système de crédits demande un peu de vigilance pour ne pas voir la facture grimper au-delà du forfait affiché ; le mode Auto illimité reste le réflexe le plus sûr pour un usage sans surprise.",
    faq: [
      { question: "Cursor ou Claude Code ?", reponse: "Cursor est un éditeur complet avec l'IA intégrée visuellement ; Claude Code est un agent en ligne de commande qui vit dans le terminal. Les deux se complètent bien plutôt que de s'exclure." },
      { question: "Le plan gratuit suffit-il ?", reponse: "Pour évaluer l'outil, oui. Pour un usage quotidien réel, le plan Pro à 20 $/mois devient vite nécessaire face aux limites du Hobby." },
      { question: "Le système de crédits peut-il faire exploser la facture ?", reponse: "Le mode Auto reste illimité sur les plans payants. Le risque de dépassement vient du choix manuel répété d'un modèle frontière au-delà du pool de crédits inclus." },
    ],
  },

  gamma: {
    slug: "gamma",
    nom: "Gamma",
    logo: "Gamma",
    tagline: "Crée présentations et sites web en partant d'un prompt.",
    tags: ["Slides", "IA générative"],
    notes: { fonctionnalites: 8, facilite: 9, valeur: 8, confiance: 7.5 },
    ctaLabel: "Essayer Gamma →",
    ctaUrl: "https://gamma.app",
    testeLe: "10 août 2026",
    essentiel:
      "Gamma génère des présentations, documents et pages web à partir d'un simple prompt ou d'un plan, avec une mise en page automatique qui reste éditable. Gratuit avec 400 crédits à l'inscription (non renouvelés), Plus à 9 $/mois, Pro à 18 $/mois pour un usage régulier.",
    quEstCe: [
      "Gamma part d'une idée en texte libre ou d'un plan structuré, et génère un support visuel complet — slides, document ou site one-page — avec une mise en page automatique cohérente. Contrairement à PowerPoint ou Google Slides, il n'y a pas de grille figée : le contenu se réorganise en cartes qui s'adaptent au texte.",
      "Une fois la génération initiale faite, l'édition reste manuelle et fine : réécriture de sections, changement de thème visuel, régénération d'une carte précise. L'outil couvre aussi les modèles d'image avancés pour illustrer automatiquement chaque section, et l'export vers PDF, PowerPoint ou une URL publique partageable.",
    ],
    quiEstDerriere:
      "Gamma a été fondée en 2020 par Grant Lee, Jon Noronha et James Fend, avec le soutien d'Accel. L'entreprise s'est fait connaître en démocratisant la génération de présentations par IA avant que ce cas d'usage ne devienne courant chez la concurrence.",
    pourQui: {
      idealPour:
        "Produire rapidement une présentation ou un document propre à partir d'une idée brute, sans passer du temps sur la mise en page.",
      aEviterSi:
        "Tu dois respecter une charte graphique d'entreprise très stricte avec un contrôle pixel-perfect — PowerPoint ou Figma restent plus adaptés à ce niveau de précision.",
    },
    demarrage: [
      {
        titre: "Pars d'un prompt court plutôt que d'un texte complet",
        description: "Gamma structure mieux à partir d'une intention claire (« présentation de 8 slides sur X pour un client ») qu'à partir d'un pavé de texte à réorganiser.",
      },
      {
        titre: "Choisis un thème avant de peaufiner le contenu",
        description: "Le thème visuel influence la longueur et le style du texte généré ; le fixer tôt évite de tout réajuster après coup.",
      },
      {
        titre: "Régénère carte par carte plutôt que tout le document",
        description: "Si une section ne convient pas, la régénérer isolément préserve le travail déjà validé sur le reste.",
      },
      {
        titre: "Exporte en PDF pour une diffusion figée",
        description: "Utile dès que le document doit être transmis tel quel sans risque d'édition ultérieure.",
      },
      {
        titre: "Passe au Plus si tu dépasses les 400 crédits initiaux",
        description: "Les crédits gratuits ne se renouvellent pas mensuellement, contrairement à la plupart des plans freemium — un point à anticiper.",
      },
    ],
    fonctionnalites: [
      { titre: "Génération à partir d'un prompt", description: "Transforme une idée en texte libre en présentation, document ou site structuré avec mise en page automatique." },
      { titre: "Cartes adaptatives", description: "Le contenu se réorganise en cartes qui s'ajustent au texte, sans grille figée façon PowerPoint." },
      { titre: "Modèles d'image avancés", description: "Illustre automatiquement chaque section avec des visuels générés cohérents avec le thème choisi." },
      { titre: "Export multi-format", description: "PDF, PowerPoint ou URL publique partageable directement depuis l'interface." },
      { titre: "Analytics de partage", description: "Suit qui consulte une présentation partagée et jusqu'où, utile pour du contenu commercial." },
      { titre: "Domaines personnalisés", description: "Sur les plans supérieurs, héberge les pages Gamma générées sur un nom de domaine propre." },
    ],
    workflows: [
      {
        declencheur: "Une idée de présentation client",
        resultat: "Un support complet en quelques minutes",
        description:
          "Génère slides et mise en page cohérente à partir d'un simple prompt.",
        outils: [],
      },
      {
        declencheur: "Un document à publier rapidement en ligne",
        resultat: "Une page web partageable",
        description:
          "Exporte directement en URL publique, sans hébergement ni configuration séparée.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Crédits gratuits non renouvelés", description: "Les 400 crédits du plan gratuit sont offerts une seule fois à l'inscription, pas rechargés chaque mois." },
      { titre: "Contrôle de mise en page limité", description: "Le système de cartes adaptatives va vite mais offre moins de précision qu'un outil de design traditionnel pour un rendu pixel-perfect." },
      { titre: "Modèle économique par crédits", description: "Chaque génération ou régénération consomme des crédits, ce qui demande de surveiller sa consommation sur un usage intensif." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA sur les offres payantes",
      aiAct: "Peu de documentation publique détaillée",
      entrainement: "Non précisé publiquement pour le contenu utilisateur",
      note: "Gamma est une société américaine ; les transferts hors UE reposent sur des clauses contractuelles types standards pour les clients européens.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — la génération passe uniquement par l'interface ou l'API Gamma." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "400 crédits à l'inscription (non renouvelés), fonctionnalités de base." },
      { nom: "Plus", prix: "9 $ / mois", inclus: "1 000 crédits mensuels, jusqu'à 20 cartes par prompt, retrait du branding Gamma." },
      { nom: "Pro", prix: "18 $ / mois", inclus: "4 000 crédits, jusqu'à 60 cartes, modèles d'image premium, API, 10 domaines personnalisés." },
      { nom: "Ultra", prix: "90 $ / mois", inclus: "20 000 crédits, jusqu'à 75 cartes, modèles avancés texte/image/vidéo, 100 domaines." },
    ],
    verdict:
      "Gamma résout bien un problème précis : passer d'une idée à un support présentable en quelques minutes, sans les allers-retours habituels de mise en page. Pour un draft rapide, une proposition commerciale ou un support de réunion interne, c'est redoutablement efficace. Pour un document de marque qui doit respecter une charte graphique stricte au pixel près, il reste un point de départ à finaliser ailleurs, pas un outil de production finale.",
    faq: [
      { question: "Gamma remplace-t-il PowerPoint ?", reponse: "Pour une génération rapide et un usage informel, largement. Pour un contrôle de mise en page très précis ou une charte graphique stricte, PowerPoint garde l'avantage." },
      { question: "Les crédits gratuits se renouvellent-ils ?", reponse: "Non, les 400 crédits offerts à l'inscription ne sont pas rechargés chaque mois — au-delà, un plan payant devient nécessaire." },
      { question: "Peut-on exporter en PowerPoint ?", reponse: "Oui, l'export PDF et PowerPoint est disponible directement depuis l'interface, en plus du partage par URL." },
    ],
  },

  deepl: {
    slug: "deepl",
    nom: "DeepL",
    logo: "DeepL",
    tagline: "La traduction IA la plus naturelle, point.",
    tags: ["Traduction", "Rédaction"],
    notes: { fonctionnalites: 8.5, facilite: 9, valeur: 8.5, confiance: 9 },
    ctaLabel: "Essayer DeepL →",
    ctaUrl: "https://www.deepl.com",
    testeLe: "10 août 2026",
    essentiel:
      "DeepL reste la référence en traduction automatique : un rendu plus naturel que Google Translate sur la plupart des paires de langues européennes, avec un vrai souci des nuances de registre. Gratuit avec 50 000 caractères/mois, Individual à environ 8,74 €/mois en annuel, jusqu'à Business pour les équipes.",
    quEstCe: [
      "DeepL traduit du texte, des documents entiers (Word, PowerPoint, PDF) en conservant la mise en forme, et propose DeepL Write, un correcteur de style qui reformule un texte pour le rendre plus clair ou plus adapté à un ton donné — dans la langue source, sans même traduire.",
      "La différence perçue avec les traducteurs génériques tient à la gestion du contexte et du registre : DeepL choisit plus souvent la formulation qu'un locuteur natif utiliserait naturellement, là où d'autres outils produisent une traduction correcte mais mécanique.",
    ],
    quiEstDerriere:
      "DeepL a été fondée en 2017 à Cologne, en Allemagne, par Jarosław Kutyłowski, sur la base de la technologie de l'ancien moteur de recherche linguistique Linguee. L'entreprise reste indépendante et rentable, un profil rare parmi les acteurs IA.",
    pourQui: {
      idealPour:
        "Toute production de contenu multilingue professionnel — e-mails, documents, contenu marketing — où la qualité de formulation compte autant que l'exactitude du sens.",
      aEviterSi:
        "Tu as besoin de couvrir des langues très rares ou peu représentées : DeepL couvre moins de langues que Google Translate, avec un focus sur les langues européennes et asiatiques principales.",
    },
    demarrage: [
      {
        titre: "Teste une traduction de document complet",
        description: "Glisse un PDF ou un Word directement dans l'interface pour voir la mise en forme conservée, pas seulement le texte brut.",
      },
      {
        titre: "Essaie DeepL Write sur un texte déjà rédigé",
        description: "Utile même sans besoin de traduction, pour reformuler un e-mail ou un texte dans sa propre langue.",
      },
      {
        titre: "Installe l'extension navigateur ou l'app desktop",
        description: "Un raccourci clavier pour traduire n'importe quel texte sélectionné évite l'aller-retour vers l'onglet DeepL.",
      },
      {
        titre: "Passe à Individual si tu dépasses 50 000 caractères/mois",
        description: "Le plan gratuit suffit pour un usage ponctuel, mais un usage professionnel régulier l'atteint vite.",
      },
      {
        titre: "Configure un glossaire pour un vocabulaire spécifique",
        description: "Utile pour garantir la cohérence de termes techniques ou de marque d'une traduction à l'autre.",
      },
    ],
    fonctionnalites: [
      { titre: "Traduction au registre naturel", description: "Choisit la formulation la plus proche de ce qu'un locuteur natif écrirait, pas seulement une traduction mot à mot correcte." },
      { titre: "Traduction de documents complets", description: "Word, PowerPoint et PDF traduits en conservant intégralement la mise en forme d'origine." },
      { titre: "DeepL Write", description: "Reformule et améliore un texte dans sa langue d'origine, sans traduction, pour un rendu plus clair ou mieux adapté au ton visé." },
      { titre: "Glossaires personnalisés", description: "Garantit la cohérence terminologique sur du vocabulaire technique ou de marque récurrent." },
      { titre: "Extension et app native", description: "Traduction accessible partout via raccourci clavier, sans changer d'onglet ou d'application." },
      { titre: "API de traduction", description: "Intégration directe dans un produit ou un workflow, facturée séparément à la caractère." },
    ],
    workflows: [
      {
        declencheur: "Un document professionnel en français",
        resultat: "Traduit en dix langues, mise en forme conservée",
        description:
          "La traduction de documents complets préserve la mise en page d'origine, sans reprise manuelle.",
        outils: [],
      },
      {
        declencheur: "Un texte déjà écrit mais peu clair",
        resultat: "Reformulé plus clairement",
        description:
          "DeepL Write améliore le style directement dans la langue d'origine, sans même traduire.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Moins de langues que Google Translate", description: "La couverture reste concentrée sur les langues européennes et asiatiques principales, avec des angles morts sur les langues plus rares." },
      { titre: "Add-on Write payant en plus", description: "La version avancée de DeepL Write coûte un supplément sur les plans Individual et Team, en plus de l'abonnement de base." },
      { titre: "Nuances culturelles parfois manquées", description: "Comme tout traducteur automatique, certains jeux de mots ou références culturelles très spécifiques restent difficiles à rendre parfaitement." },
    ],
    conformite: {
      hebergement: "Allemagne (Union européenne)",
      rgpd: "Conforme nativement, société et hébergement allemands",
      aiAct: "Alignement affiché sur le règlement européen",
      entrainement: "Textes traduits non utilisés pour l'entraînement sur les offres Pro",
      note: "DeepL est une entreprise allemande qui héberge en Union européenne : le meilleur profil de souveraineté parmi les outils de traduction grand public, sans montage contractuel de transfert nécessaire.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel à ce jour — l'intégration programmatique passe par l'API DeepL classique." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "50 000 caractères/mois, jusqu'à 3 traductions de documents/mois." },
      { nom: "Individual", prix: "~8,74 € / mois (annuel)", inclus: "300 000 caractères/mois, documents illimités." },
      { nom: "Team", prix: "~28,74 € / utilisateur / mois (annuel)", inclus: "1 million de caractères, gestion d'équipe, glossaires partagés." },
      { nom: "Business", prix: "~57,49 € / utilisateur / mois (annuel)", inclus: "Caractères illimités (usage raisonnable), administration avancée." },
    ],
    verdict:
      "DeepL reste le réflexe le plus fiable pour une traduction professionnelle qui doit sonner juste, pas seulement être exacte — l'écart avec Google Translate s'entend particulièrement sur le français, l'allemand et les langues latines. Le plan gratuit couvre déjà un usage ponctuel généreux ; l'Individual à moins de 9 €/mois devient vite rentable dès que la traduction de documents devient une tâche régulière.",
    faq: [
      { question: "DeepL est-il meilleur que Google Translate ?", reponse: "Sur la plupart des langues européennes, oui en naturel de formulation. Google Translate garde l'avantage sur le nombre de langues couvertes, notamment les plus rares." },
      { question: "Mes documents sont-ils hébergés en Europe ?", reponse: "Oui, DeepL est une entreprise allemande qui héberge nativement en Union européenne, sans transfert international nécessaire." },
      { question: "DeepL Write est-il inclus dans l'abonnement de base ?", reponse: "Une version limitée est incluse gratuitement ; la version complète est un supplément payant sur les plans Individual et Team." },
    ],
  },

  merciapp: {
    slug: "merciapp",
    nom: "MerciApp",
    logo: "MerciApp",
    tagline: "Le correcteur d'orthographe français dopé à l'IA.",
    tags: ["Correction", "Rédaction"],
    notes: { fonctionnalites: 7, facilite: 9, valeur: 8.5, confiance: 8 },
    ctaLabel: "Essayer MerciApp →",
    ctaUrl: "https://merciapp.com",
    testeLe: "10 août 2026",
    essentiel:
      "MerciApp est un correcteur exclusivement dédié au français, qui va au-delà de l'orthographe pour capter les subtilités de la langue : accords complexes, homophones, tournures stylistiques et typographie. Gratuit avec fonctionnalités limitées, formules payantes de 8 € à 80 €/mois selon le volume.",
    quEstCe: [
      "MerciApp corrige l'orthographe, la grammaire et le style d'un texte français, avec une attention particulière aux pièges classiques de la langue : accords du participe passé, homophones, ponctuation et espaces typographiques français (avant les deux-points, par exemple), que les correcteurs anglophones généralistes traitent mal.",
      "Au-delà de la correction, l'outil propose des reformulations stylistiques et une extension navigateur qui corrige directement dans Gmail, LinkedIn ou tout champ de texte, sans changer d'application.",
    ],
    quiEstDerriere:
      "MerciApp est une entreprise française, positionnée comme l'alternative francophone à Grammarly — un outil pensé dès le départ pour les subtilités du français plutôt qu'adapté après coup d'un correcteur anglophone.",
    pourQui: {
      idealPour:
        "Toute rédaction professionnelle en français où les fautes d'accord ou de typographie ne sont pas une option — communication client, contenu de marque, documents officiels.",
      aEviterSi:
        "Tu rédiges principalement en anglais ou dans une autre langue : l'outil est volontairement mono-langue et n'a pas vocation à couvrir d'autres usages.",
    },
    demarrage: [
      {
        titre: "Installe l'extension navigateur",
        description: "La correction s'active directement dans Gmail, LinkedIn ou n'importe quel champ de texte, sans copier-coller vers un outil séparé.",
      },
      {
        titre: "Colle un texte existant pour voir le niveau de détail",
        description: "Un texte déjà relu manuellement révèle vite les subtilités que MerciApp capte en plus (accords, typographie) par rapport à un correcteur généraliste.",
      },
      {
        titre: "Explore les suggestions de reformulation",
        description: "Au-delà des fautes, l'outil propose des alternatives stylistiques pour varier ou clarifier une phrase.",
      },
      {
        titre: "Active l'autocorrection si le volume le justifie",
        description: "Fonctionnalité réservée aux comptes payants, utile pour un usage intensif où la relecture manuelle de chaque suggestion prendrait trop de temps.",
      },
      {
        titre: "Compare avec ta pratique actuelle avant de payer",
        description: "Le plan gratuit couvre déjà l'essentiel des fonctionnalités jusqu'à 600 mots analysés par jour — largement de quoi juger la pertinence avant d'engager un abonnement.",
      },
    ],
    fonctionnalites: [
      { titre: "Correction spécialisée français", description: "Accords complexes, homophones et incohérences de sens détectés avec une précision supérieure à un correcteur généraliste multilingue." },
      { titre: "Typographie française", description: "Respecte les règles typographiques françaises (espaces insécables, guillemets français) souvent ignorées par les outils anglophones." },
      { titre: "Reformulation stylistique", description: "Propose des alternatives pour varier ou clarifier une phrase, pas seulement corriger une faute." },
      { titre: "Extension navigateur", description: "Correction active directement dans Gmail, LinkedIn et la plupart des champs de texte web." },
      { titre: "Autocorrection automatique", description: "Sur les plans payants, corrige certaines erreurs directement sans validation manuelle systématique." },
      { titre: "Alertes de style", description: "Signale les répétitions, lourdeurs ou tournures à risque dans un texte long, réservé aux comptes payants." },
    ],
    workflows: [
      {
        declencheur: "Un e-mail professionnel rédigé vite",
        resultat: "Relu et corrigé avant envoi",
        description:
          "L'extension navigateur corrige directement dans Gmail, sans copier-coller vers un outil séparé.",
        outils: ["Gmail"],
      },
      {
        declencheur: "Un document officiel en français",
        resultat: "Une typographie irréprochable",
        description:
          "Applique les règles typographiques françaises souvent ignorées par les correcteurs anglophones.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Volume limité en gratuit", description: "600 mots analysés et 3 reformulations par jour sur le plan gratuit, vite atteint pour une rédaction professionnelle régulière." },
      { titre: "Mono-langue par design", description: "Aucune couverture d'autres langues — un choix assumé, mais qui exclut l'usage pour qui rédige aussi en anglais ou ailleurs." },
      { titre: "Moins connu que Grammarly", description: "Écosystème d'intégrations et communauté plus restreints que les correcteurs anglophones dominants." },
    ],
    conformite: {
      hebergement: "France",
      rgpd: "Conforme nativement, société française",
      aiAct: "Éditeur soumis au cadre européen",
      entrainement: "Non précisé publiquement pour les textes utilisateurs",
      note: "MerciApp est une entreprise française : les textes analysés restent traités sous juridiction européenne, sans montage contractuel de transfert international nécessaire.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel — l'usage reste centré sur l'extension navigateur et l'interface web." },
    tarifs: [
      { nom: "Free", prix: "Gratuit", inclus: "600 mots analysés/jour, 3 reformulations/jour, correction de base." },
      { nom: "Individuel", prix: "8-80 € / mois selon usage", inclus: "Autocorrection, alertes de style, volume élargi." },
      { nom: "Équipe", prix: "12-120 € / mois selon usage", inclus: "Gestion multi-utilisateurs pour des équipes de rédaction." },
    ],
    verdict:
      "MerciApp comble un vrai manque : les correcteurs généralistes traitent souvent le français comme une langue secondaire, avec des angles morts sur les accords complexes et la typographie. Pour une activité qui produit du contenu français professionnel en volume, la précision gagnée justifie largement le prix d'entrée ; pour un usage occasionnel, le plan gratuit à 600 mots/jour suffit déjà à éviter l'essentiel des fautes qui abîment une image professionnelle.",
    faq: [
      { question: "MerciApp est-il meilleur que Grammarly pour le français ?", reponse: "Oui sur les subtilités spécifiquement françaises (accords, typographie) — Grammarly reste centré sur l'anglais et traite le français de façon plus basique." },
      { question: "L'essai gratuit est-il limité dans le temps ?", reponse: "Un essai de 30 jours existe sur les abonnements payants, en plus du plan gratuit permanent à fonctionnalités réduites." },
      { question: "Fonctionne-t-il dans Word ou Google Docs ?", reponse: "Le fonctionnement principal passe par l'extension navigateur et l'interface web, couvrant Google Docs ; l'intégration Word dépend des dernières évolutions du produit à vérifier directement." },
    ],
  },

  beehiiv: {
    slug: "beehiiv",
    nom: "Beehiiv",
    logo: "Beehiiv",
    tagline: "La plateforme de newsletter pensée pour grandir.",
    tags: ["Marketing", "Rédaction"],
    notes: { fonctionnalites: 8, facilite: 8, valeur: 7.5, confiance: 7.5 },
    ctaLabel: "Essayer Beehiiv →",
    ctaUrl: "https://www.beehiiv.com",
    testeLe: "10 août 2026",
    essentiel:
      "Beehiiv est une plateforme de newsletter conçue pour la croissance et la monétisation, pas seulement l'envoi d'e-mails : réseau publicitaire intégré, abonnements payants sans commission, et automatisations. Gratuit jusqu'à 2 500 abonnés, Scale à partir de 43 $/mois en annuel.",
    quEstCe: [
      "Beehiiv combine l'essentiel d'un outil d'e-mailing (éditeur, automatisations, segmentation) avec des fonctionnalités pensées spécifiquement pour les créateurs de newsletter : une page web dédiée à la publication en plus de l'e-mail, un système d'abonnements payants sans prélever de commission sur les revenus, et un réseau publicitaire qui connecte les newsletters à des annonceurs.",
      "L'outil se distingue par son modèle de tarification par paliers d'abonnés plutôt qu'au nombre d'e-mails envoyés, et par des fonctionnalités de croissance intégrées (recommandations croisées entre newsletters, programme de parrainage) absentes des outils d'e-mailing généralistes.",
    ],
    quiEstDerriere:
      "Beehiiv a été fondée en 2021 par Tyler Denk et Jacob Braude, deux anciens de l'équipe newsletter de Morning Brew. L'expérience directe de la croissance d'une newsletter à plusieurs millions d'abonnés a directement influencé les fonctionnalités de croissance intégrées au produit.",
    pourQui: {
      idealPour:
        "Lancer et faire grandir une newsletter comme un vrai média, avec l'ambition de la monétiser via la publicité ou des abonnements payants.",
      aEviterSi:
        "Tu as besoin d'un outil d'e-mail marketing classique pour une base client existante (promotions, transactionnel) plutôt que de construire une audience de newsletter — Mailchimp ou Klaviyo restent plus adaptés à cet usage.",
    },
    demarrage: [
      {
        titre: "Configure ta newsletter et ta page web",
        description: "Beehiiv crée automatiquement une page publique en plus du canal e-mail, utile pour l'archivage et le référencement.",
      },
      {
        titre: "Importe ta liste existante si tu en as une",
        description: "La migration depuis un autre outil d'e-mailing se fait directement dans les réglages d'import.",
      },
      {
        titre: "Active le programme de recommandation",
        description: "Le mécanisme de parrainage entre lecteurs est l'un des leviers de croissance les plus efficaces de la plateforme, à activer tôt.",
      },
      {
        titre: "Explore le réseau publicitaire une fois une audience constituée",
        description: "Pertinent à partir de quelques milliers d'abonnés engagés, pas dès le lancement.",
      },
      {
        titre: "Teste les automatisations sur une séquence de bienvenue",
        description: "Un premier cas d'usage simple avant de construire des parcours plus complexes.",
      },
    ],
    fonctionnalites: [
      { titre: "Page web dédiée", description: "Chaque newsletter dispose d'un site public en plus du canal e-mail, utile pour l'archivage et l'acquisition via la recherche." },
      { titre: "Abonnements payants sans commission", description: "Contrairement à Substack, Beehiiv ne prélève aucun pourcentage sur les revenus d'abonnement payant." },
      { titre: "Réseau publicitaire intégré", description: "Connecte les newsletters à des annonceurs directement dans la plateforme, sans démarchage manuel." },
      { titre: "Automatisations et segmentation", description: "Séquences d'e-mails déclenchées et segments d'audience pour des campagnes ciblées." },
      { titre: "Programme de recommandation", description: "Mécanisme de parrainage entre lecteurs, un des leviers de croissance organique les plus efficaces de l'outil." },
      { titre: "Sondages et enquêtes", description: "Collecte du feedback lecteur directement intégrée aux e-mails, sans outil tiers." },
    ],
    workflows: [
      {
        declencheur: "Un nouvel article de newsletter",
        resultat: "Envoyé et publié en ligne",
        description:
          "Un seul geste alimente à la fois l'e-mail et la page web publique associée.",
        outils: [],
      },
      {
        declencheur: "Une audience qui atteint une taille critique",
        resultat: "Monétisée sans commission",
        description:
          "Active les abonnements payants ou le réseau publicitaire une fois l'audience constituée, sans prélèvement sur les revenus d'abonnement.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Paliers de prix par abonnés", description: "Le coût augmente à des seuils fixes (2 500, 5 000, 10 000...) plutôt que progressivement, ce qui peut créer des sauts de facturation nets." },
      { titre: "Moins pertinent pour l'e-mail transactionnel", description: "L'outil est pensé pour la newsletter éditoriale, pas pour des campagnes promotionnelles e-commerce classiques." },
      { titre: "Trois sièges seulement sur Scale", description: "Une équipe plus large doit passer sur Max ou Enterprise pour ajouter des collaborateurs." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA, clauses contractuelles types",
      aiAct: "Non applicable directement (outil d'e-mailing)",
      entrainement: "Non applicable (pas de modèle IA propriétaire entraîné sur le contenu)",
      note: "Beehiiv est une société américaine ; les transferts hors UE reposent sur des clauses contractuelles types standards pour les clients européens.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel — les intégrations passent par Zapier ou l'API Beehiiv classique." },
    tarifs: [
      { nom: "Launch", prix: "Gratuit", inclus: "Jusqu'à 2 500 abonnés, envois illimités, page web, landing pages." },
      { nom: "Scale", prix: "~43 $ / mois (annuel)", inclus: "Réseau publicitaire, abonnements payants, automatisations, 3 sièges." },
      { nom: "Max", prix: "~96 $ / mois (annuel)", inclus: "Retrait du branding Beehiiv, support prioritaire, accès à la formation NewsletterXP." },
      { nom: "Enterprise", prix: "Sur devis (au-delà de 100 000 abonnés)", inclus: "Accompagnement dédié et fonctionnalités sur mesure." },
    ],
    verdict:
      "Beehiiv fait un pari clair : traiter la newsletter comme un média à monétiser, pas comme un simple canal d'e-mailing. Pour qui a l'ambition de construire une audience et d'en tirer des revenus publicitaires ou d'abonnement, l'absence de commission sur les abonnements payants change vraiment l'équation économique face à Substack. Pour du simple e-mail marketing lié à une activité existante, l'outil apporte moins de valeur qu'un Mailchimp ou un Klaviyo plus centrés sur ce cas d'usage.",
    faq: [
      { question: "Beehiiv est-il gratuit ?", reponse: "Oui jusqu'à 2 500 abonnés, avec envois illimités. Au-delà, les paliers payants démarrent autour de 43 $/mois en facturation annuelle." },
      { question: "Beehiiv prend-il une commission sur les abonnements payants ?", reponse: "Non, contrairement à Substack, Beehiiv ne prélève aucun pourcentage sur les revenus d'abonnements payants générés." },
      { question: "Peut-on migrer depuis Mailchimp ou Substack ?", reponse: "Oui, l'import de liste existante est pris en charge directement dans les réglages, sans perte de données d'abonnés." },
    ],
  },

  lindy: {
    slug: "lindy",
    nom: "Lindy",
    logo: "Lindy",
    tagline: "Crée des assistants IA qui gèrent tes tâches en pilote automatique.",
    tags: ["Agents", "Productivité"],
    notes: { fonctionnalites: 7.5, facilite: 7, valeur: 7, confiance: 7 },
    ctaLabel: "Essayer Lindy →",
    ctaUrl: "https://www.lindy.ai",
    testeLe: "10 août 2026",
    essentiel:
      "Lindy construit des assistants IA autonomes (« Lindies ») qui gèrent des tâches complètes : trier une boîte mail, qualifier des leads, répondre au téléphone. Positionné comme un assistant exécutif IA plutôt qu'un simple outil d'automatisation. Plus à 49,99 $/mois, Pro à 99,99 $/mois, sans plan gratuit permanent.",
    quEstCe: [
      "Lindy permet de construire des agents IA — appelés Lindies — qui exécutent des tâches de bout en bout plutôt que de simples automatisations linéaires : lire et trier une boîte de réception, qualifier et relancer des prospects, ou répondre à des appels téléphoniques avec une voix IA. Chaque Lindy se configure en langage naturel, avec des déclencheurs et des outils qu'il peut utiliser de façon autonome.",
      "Depuis début 2026, l'offre s'est resserrée autour d'un positionnement d'assistant exécutif personnel plutôt que de plateforme d'automatisation généraliste, avec des forfaits Plus, Pro et Max qui se distinguent par le volume d'usage et le nombre de boîtes mail gérées simultanément.",
    ],
    quiEstDerriere:
      "Lindy a été fondée par Flo Crivello, ancien de Uber et Y Combinator, avec l'ambition de créer des agents IA capables de remplacer des tâches administratives entières plutôt que de simplement les assister.",
    pourQui: {
      idealPour:
        "Déléguer des tâches répétitives complètes (tri de boîte mail, qualification de leads, prise de rendez-vous) à un agent autonome plutôt que de les automatiser étape par étape.",
      aEviterSi:
        "Tu as un besoin d'automatisation simple et prévisible : un outil comme Zapier ou n8n reste plus transparent et moins cher pour des workflows linéaires classiques.",
    },
    demarrage: [
      {
        titre: "Choisis une tâche à fort volume répétitif",
        description: "Le tri d'e-mails ou la qualification de leads sont de bons premiers cas d'usage pour évaluer la fiabilité d'un Lindy avant de déléguer plus large.",
      },
      {
        titre: "Configure le Lindy en langage naturel",
        description: "Décris la tâche et les règles à suivre comme tu les expliquerais à un assistant humain, avant d'affiner avec des cas particuliers.",
      },
      {
        titre: "Teste sur un périmètre restreint avant de généraliser",
        description: "Limiter le Lindy à une boîte mail secondaire ou un segment de leads permet de vérifier son comportement sans risque sur l'ensemble de l'activité.",
      },
      {
        titre: "Ajoute une validation humaine sur les actions sensibles",
        description: "Pour l'envoi d'e-mails ou les décisions à conséquence, garder un point de validation évite les erreurs coûteuses en pilote automatique complet.",
      },
      {
        titre: "Passe à Pro si tu ajoutes le computer use",
        description: "Nécessaire pour un Lindy qui doit naviguer sur des interfaces web au-delà des intégrations natives disponibles.",
      },
    ],
    fonctionnalites: [
      { titre: "Agents configurables en langage naturel", description: "Décris la tâche et les règles comme à un assistant humain, sans logique de workflow visuel à construire nœud par nœud." },
      { titre: "Gestion de boîte mail autonome", description: "Trie, priorise et rédige des réponses directement dans la boîte de réception connectée." },
      { titre: "Qualification de leads", description: "Analyse et priorise les prospects entrants selon des critères définis, avec relance automatique." },
      { titre: "Assistant vocal téléphonique", description: "Répond à des appels avec une voix IA, utile pour un premier niveau de support ou de qualification." },
      { titre: "Computer use", description: "Sur les plans supérieurs, le Lindy peut naviguer et agir sur des interfaces web comme le ferait un humain." },
      { titre: "Choix de modèle", description: "Sélectionne le modèle IA sous-jacent selon la complexité de la tâche à déléguer." },
    ],
    workflows: [
      {
        declencheur: "Une boîte mail qui déborde chaque matin",
        resultat: "Triée et priorisée automatiquement",
        description:
          "Le Lindy classe les messages et répond aux demandes simples selon des règles définies à l'avance.",
        outils: [],
      },
      {
        declencheur: "Des leads entrants à qualifier",
        resultat: "Priorisés et relancés sans intervention",
        description:
          "Qualification automatique selon des critères configurés, avec relance des prospects les plus prometteurs.",
        outils: [],
      },
    ],
    limites: [
      { titre: "Aucun plan gratuit permanent", description: "Depuis la restructuration 2026, seul un essai de 7 jours est disponible avant de passer sur un forfait payant à partir de 49,99 $/mois." },
      { titre: "Coût réel supérieur à l'affiché", description: "L'ajout d'appels vocaux, de plusieurs numéros de téléphone ou de workflows à haute fréquence fait grimper la facture au-delà du forfait de base." },
      { titre: "Fiabilité à surveiller sur les tâches critiques", description: "Comme tout agent autonome, une supervision reste nécessaire sur les actions à conséquence (envoi d'e-mail, décision commerciale)." },
    ],
    conformite: {
      hebergement: "États-Unis",
      rgpd: "Conforme via DPA sur les offres supérieures",
      aiAct: "Peu de documentation publique détaillée",
      entrainement: "Non précisé publiquement pour les données de tâches",
      note: "Lindy est une société américaine ; les transferts hors UE reposent sur des clauses contractuelles types standards pour les clients européens.",
    },
    mcp: { disponible: false, officiel: false, note: "Pas de serveur MCP officiel documenté à ce jour — les connexions passent par les intégrations natives de la plateforme." },
    tarifs: [
      { nom: "Plus", prix: "49,99 $ / mois", inclus: "Usage standard, jusqu'à 2 boîtes mail gérées." },
      { nom: "Pro", prix: "99,99 $ / mois", inclus: "Environ 3x plus d'usage, 3 boîtes mail, computer use, choix de modèle." },
      { nom: "Max", prix: "199,99 $ / mois", inclus: "Environ 7x plus d'usage, 5 boîtes mail gérées simultanément." },
    ],
    verdict:
      "Lindy vise plus haut qu'un simple outil d'automatisation : déléguer une tâche entière à un agent plutôt que d'enchaîner des étapes prévisibles. C'est aussi ce qui le rend plus cher et moins transparent que Zapier ou n8n sur des besoins simples. À réserver aux tâches vraiment répétitives et à fort volume où l'autonomie de l'agent justifie le prix d'entrée, avec une supervision humaine maintenue sur tout ce qui a des conséquences réelles.",
    faq: [
      { question: "Lindy est-il gratuit ?", reponse: "Non, plus depuis début 2026 — seul un essai de 7 jours est disponible avant de passer sur un forfait payant à partir de 49,99 $/mois." },
      { question: "Lindy ou Zapier/n8n ?", reponse: "Zapier et n8n excellent sur des automatisations linéaires prévisibles. Lindy vise des tâches plus complexes qui demandent une forme de jugement autonome, avec un coût et un risque d'erreur plus élevés en contrepartie." },
      { question: "Peut-on faire confiance à un Lindy pour répondre à des clients ?", reponse: "Avec supervision, oui pour un premier niveau. Une validation humaine reste recommandée sur les échanges à enjeu avant tout envoi automatique complet." },
    ],
  },
};
