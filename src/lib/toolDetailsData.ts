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
    fonctionnalites: [
      { titre: "Hébergement européen", description: "Infrastructure et traitement des données en Europe, avec un cadre RGPD natif plutôt que par clauses de transfert." },
      { titre: "Modèles ouverts", description: "Plusieurs modèles sont publiés en open weights et peuvent être auto-hébergés, y compris en environnement isolé." },
      { titre: "Vitesse de réponse", description: "Le Chat est l'un des assistants les plus rapides, avec un mode Flash pensé pour les réponses quasi instantanées." },
      { titre: "Codestral", description: "Un modèle spécialisé code, intégrable dans les IDE pour la complétion et la génération." },
      { titre: "Agents et connecteurs", description: "Création d'agents personnalisés capables d'appeler des outils externes et de suivre des instructions persistantes." },
      { titre: "Analyse documentaire", description: "Lecture de PDF, images et tableurs, avec un moteur OCR maison pour les documents scannés." },
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
    fonctionnalites: [
      { titre: "Sources citées systématiquement", description: "Chaque affirmation renvoie à une page web identifiée, ce qui permet de vérifier au lieu de faire confiance." },
      { titre: "Recherche approfondie", description: "Enchaîne des dizaines de requêtes pour produire un rapport structuré sur un sujet, en quelques minutes." },
      { titre: "Spaces", description: "Regroupe recherches, fichiers et instructions autour d'un sujet récurrent, partageable en équipe." },
      { titre: "Choix du modèle", description: "En Pro, on choisit le modèle sous-jacent (Claude, GPT, Gemini…) selon le type de question." },
      { titre: "Recherche sur tes fichiers", description: "Téléverse des PDF ou tableurs pour les interroger au même titre que le web." },
      { titre: "Navigateur Comet", description: "Un navigateur maison qui intègre l'assistant directement dans la navigation." },
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
    fonctionnalites: [
      { titre: "Collaboration temps réel", description: "Plusieurs curseurs sur le même fichier, commentaires ancrés et historique de versions : la revue de design se fait dans l'outil." },
      { titre: "Composants et variantes", description: "Un design system vivant : les composants se propagent à toutes les maquettes qui les utilisent." },
      { titre: "Auto Layout", description: "Des maquettes qui se réagencent comme du CSS Flexbox, indispensable pour le responsive." },
      { titre: "Prototypage interactif", description: "Enchaîne les écrans avec transitions et états pour tester un parcours avant d'écrire une ligne de code." },
      { titre: "Dev Mode", description: "Vue dédiée aux développeurs : mesures, variables, tokens et extraits de code prêts à reprendre." },
      { titre: "Figma Make et IA", description: "Génération de maquettes et de premières versions d'interface à partir d'une description." },
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
    fonctionnalites: [
      { titre: "Bibliothèque de modèles", description: "Des centaines de milliers de mises en page prêtes à l'emploi, dimensionnées pour chaque support." },
      { titre: "Brand Kit", description: "Centralise logos, couleurs et polices de la marque pour garder une cohérence sur tous les visuels." },
      { titre: "Magic Studio", description: "Suite IA : génération d'images, suppression d'arrière-plan, redimensionnement automatique, réécriture de texte." },
      { titre: "Vidéo et animation", description: "Montage simple, transitions et animations de texte, suffisants pour les réseaux sociaux." },
      { titre: "Collaboration et validation", description: "Commentaires, partage et circuits d'approbation pour valider un visuel en équipe." },
      { titre: "Export et planification", description: "Export multi-formats et publication programmée directement vers les réseaux sociaux." },
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
    fonctionnalites: [
      { titre: "Qualité esthétique", description: "Le rendu de lumière, de matière et de composition reste la meilleure référence du marché sur l'image artistique." },
      { titre: "Références de style et de personnage", description: "Les paramètres de référence permettent de garder un style ou un personnage cohérent d'une image à l'autre." },
      { titre: "Éditeur intégré", description: "Retouche par zones, extension du cadre (outpainting) et variations localisées directement dans l'app web." },
      { titre: "Paramètres fins", description: "Ratio, niveau de stylisation, chaos, poids d'image : un contrôle précis pour qui prend le temps de l'apprendre." },
      { titre: "Moodboards", description: "Regroupe des références visuelles pour orienter le modèle vers une direction artistique donnée." },
      { titre: "Génération vidéo", description: "Animation courte à partir d'une image générée, pour des usages sociaux." },
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
    fonctionnalites: [
      { titre: "Accès direct au projet", description: "Lit et modifie les fichiers, lance les commandes et les tests : l'agent travaille sur le vrai dépôt, pas sur des extraits collés." },
      { titre: "Modifications multi-fichiers", description: "Gère des changements cohérents traversant plusieurs modules, ce qu'un assistant de complétion ne sait pas faire." },
      { titre: "Fichier d'instructions projet", description: "Un fichier de consignes à la racine transmet conventions, scripts et règles internes à chaque session." },
      { titre: "Support MCP natif", description: "Se connecte à Figma, Notion, une base de données ou tout serveur MCP pour aller chercher le contexte manquant." },
      { titre: "Sous-agents et tâches parallèles", description: "Délègue des sous-tâches à des agents séparés pour explorer plusieurs pistes en parallèle." },
      { titre: "Intégration Git et GitHub", description: "Crée des branches, rédige les messages de commit et ouvre des pull requests." },
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
    fonctionnalites: [
      { titre: "PostgreSQL complet", description: "Une vraie base relationnelle avec extensions, vues, triggers et fonctions SQL — pas une abstraction propriétaire." },
      { titre: "API générée automatiquement", description: "Chaque table est immédiatement accessible en REST, avec des bibliothèques clientes typées." },
      { titre: "Authentification intégrée", description: "E-mail, mot de passe, magic link et fournisseurs OAuth (Google, GitHub…) configurables en quelques clics." },
      { titre: "Row Level Security", description: "Les règles d'accès s'écrivent en SQL au niveau de la ligne : la sécurité reste dans la base, pas dans le code client." },
      { titre: "Stockage de fichiers", description: "Buckets publics ou privés avec politiques d'accès et transformation d'images." },
      { titre: "Temps réel", description: "Abonnement aux changements de la base pour synchroniser une interface sans rafraîchissement." },
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
    fonctionnalites: [
      { titre: "Application complète en conversation", description: "Interface, routes, base de données et logique serveur générées à partir de descriptions en langage naturel." },
      { titre: "Aperçu en direct", description: "Chaque modification est visible immédiatement dans un aperçu fonctionnel, pas dans une maquette." },
      { titre: "Back-end intégré", description: "Base de données, authentification, stockage et fonctions serveur activables sans configuration manuelle." },
      { titre: "Synchronisation GitHub", description: "Le code reste du React/TypeScript standard, synchronisable avec un dépôt et reprenable par un développeur." },
      { titre: "Publication en un clic", description: "Mise en ligne immédiate avec une URL publique, et branchement d'un domaine personnalisé." },
      { titre: "IA intégrée", description: "Passerelle vers des modèles de génération de texte et d'images utilisables dans l'app sans gérer de clés API." },
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
    fonctionnalites: [
      { titre: "Bases de données multi-vues", description: "Une même collection s'affiche en table, kanban, calendrier, timeline ou galerie selon le besoin du moment." },
      { titre: "Relations et rollups", description: "Relie deux bases entre elles et agrège les données liées, ce qui permet de construire de vrais systèmes." },
      { titre: "Modèles et duplication", description: "Un immense écosystème de modèles publics, duplicables en un clic pour démarrer sans partir de zéro." },
      { titre: "Notion AI", description: "Rédaction, résumé et recherche sémantique sur l'ensemble de l'espace de travail." },
      { titre: "Collaboration et permissions", description: "Commentaires, mentions et droits fins page par page, y compris pour des invités externes." },
      { titre: "Publication web", description: "Publie une page en site public, utile pour une documentation ou une base de connaissances." },
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
    fonctionnalites: [
      { titre: "Recherche par contenu", description: "Indexation du texte des documents, PDF et images : on retrouve un fichier par son contenu, pas seulement par son nom." },
      { titre: "Collaboration temps réel", description: "Docs, Sheets et Slides s'éditent à plusieurs simultanément, avec commentaires et suggestions." },
      { titre: "Partage granulaire", description: "Droits par fichier ou dossier, liens à durée limitée et restrictions de téléchargement." },
      { titre: "Historique de versions", description: "Retour à n'importe quel état antérieur d'un document, sans manipulation complexe." },
      { titre: "Drive pour ordinateur", description: "Synchronisation locale avec fichiers à la demande, sans occuper tout le disque." },
      { titre: "Intégration Gemini", description: "Résumé et interrogation des documents stockés depuis l'assistant intégré à Workspace." },
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
    fonctionnalites: [
      { titre: "Antispam et sécurité", description: "Filtrage réputé pour sa précision, avec détection du phishing et alertes sur les expéditeurs suspects." },
      { titre: "Recherche puissante", description: "Opérateurs de recherche avancés pour retrouver un message précis dans des années d'archives." },
      { titre: "Libellés et filtres", description: "Automatisation du tri à la réception : étiquetage, archivage, transfert ou marquage selon des règles." },
      { titre: "Réponses assistées", description: "Suggestions de réponse et rédaction assistée par Gemini dans les offres Workspace." },
      { titre: "Alias et domaine personnalisé", description: "Envoi depuis une adresse professionnelle sur ton propre nom de domaine avec Workspace." },
      { titre: "Intégration Agenda et Meet", description: "Création de rendez-vous et de visioconférences directement depuis un message." },
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
    fonctionnalites: [
      { titre: "Plus de 7 000 intégrations", description: "Le catalogue le plus large du marché : la quasi-totalité des outils SaaS courants sont pris en charge." },
      { titre: "Constructeur visuel", description: "Enchaînement d'étapes en glisser-déposer, avec test unitaire de chaque étape avant activation." },
      { titre: "Logique conditionnelle", description: "Filtres, chemins conditionnels et délais pour des scénarios qui dépassent la simple chaîne linéaire." },
      { titre: "Tables et Interfaces", description: "Bases de données légères et formulaires internes pour construire un petit outil sans autre logiciel." },
      { titre: "Étapes de code", description: "Insertion de JavaScript ou Python quand une transformation n'est pas prévue par les connecteurs." },
      { titre: "Agents IA", description: "Automatisations où un modèle décide de l'action à déclencher en fonction du contenu reçu." },
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
};
