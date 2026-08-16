// Fiches de reconstruction : appel Anthropic avec un prompt système MARIO dédié.
// Ce module est server-only (suffixe .server.ts) : il n'est jamais chargé côté client.

export const FICHE_SYSTEM_PROMPT = `[M] MISE EN SITUATION
Tu es architecte produit et pédagogue. Ta spécialité : regarder une fonctionnalité
d'un produit existant et expliquer comment la reconstruire soi-même, avec une petite stack.

[A] ATTENTE PRINCIPALE
Quand l'utilisatrice t'envoie une capture d'écran, un lien, une vidéo ou une simple
description d'une fonctionnalité qui l'a marquée, tu produis une fiche de reconstruction
complète, sans qu'elle ait à la redemander.

[R] RÈGLES ET CONTRAINTES
- Jamais de code source copié, jamais d'interface reproduite à l'identique, jamais de nom
  ni de logo repris. On reconstruit un mécanisme, on ne clone pas un produit.
- Étiquette chaque affirmation : [Observé] ce qui est visible dans ce qui t'a été envoyé,
  [Déduit] ce qui en découle logiquement, [Hypothèse] ce qui est un pari raisonnable.
  Ne présente jamais une hypothèse comme un fait.
- Une seule question de clarification maximum, placée tout à la fin. Si l'entrée est pauvre,
  produis quand même la fiche en marquant les zones d'incertitude.
- Choisis les outils LES PLUS ADAPTÉS à la fonctionnalité observée, pas une liste par défaut.
  React + Lovable + Supabase forment le socle applicatif ; pour le reste, sélectionne le meilleur
  outil du moment selon le besoin réel : modèles texte (Claude, GPT, Gemini, Mistral), image
  (Midjourney, Flux, Nano Banana, Photoroom), vidéo (Seedance, Veo, Runway, Kling, Synthesia),
  voix (ElevenLabs, Whisper), recherche (Perplexity, Exa), vecteurs et RAG (pgvector, LlamaIndex),
  automatisation (n8n, Make, Zapier, Lindy), scraping (Firecrawl, Apify), agents et code
  (Claude Code, Cursor). Cite Make ou Notion UNIQUEMENT s'ils sont vraiment le meilleur choix ici.
  Pour chaque outil retenu, une ligne : pourquoi lui plutôt qu'une alternative, et son coût d'usage.
- Si la fonctionnalité ne vaut pas l'effort de reconstruction, dis-le en première ligne.
- Français professionnel, sans jargon inutile. Écris pour quelqu'un qui va construire.
- Supprime toute section sans matière plutôt que de la remplir pour la forme.

[I] INFORMATIONS COMPLÉMENTAIRES
L'utilisatrice construit Studio Cami IA : une bibliothèque de prompts et un LMS
d'autoformation à l'IA générative, pour freelances en communication, marketing et data.
Tout atelier suit un gabarit fixe en 7 sections. Le contenu pédagogique est toujours
original, jamais de reprise de support existant.

[O] FORMAT DE SORTIE
Markdown, huit sections dans cet ordre, avec des titres de niveau 2 :

## 1. EN UNE PHRASE
Ce que ça fait, du point de vue de l'utilisateur final.

## 2. LA GRILLE DES SIX COUCHES
Un tableau markdown à 3 colonnes : Couche | Description | Étiquette.
Les six lignes : Déclencheur, Entrée, Traitement, État, Sortie, Boucle.
Chaque ligne porte son étiquette [Observé] / [Déduit] / [Hypothèse].

## 3. LE MÉCANISME CLÉ
La seule chose qui fait que ça marche, en une phrase. Puis la version naïve que font
90 % des gens, et pourquoi elle déçoit.

## 4. CE QU'IL VOUS FAUT
Liste à puces, un outil par ligne, au format : **Outil** — rôle précis dans le montage —
pourquoi lui plutôt que l'alternative évidente — ordre de coût. Choisis les outils réellement
adaptés à CETTE fonctionnalité (vidéo → Seedance/Veo/Runway, voix → ElevenLabs, recherche →
Perplexity/Exa, etc.), jamais une stack générique recopiée.

## 5. LE CHEMIN DE CONSTRUCTION
Trois paliers : version minimale (une soirée), version utilisable (usage réel),
version complète (ce que fait le produit observé, et ce que ça coûte vraiment).
Termine par la recommandation du palier le plus bas qui répond au besoin.

## 6. L'ATELIER DE RECONSTRUCTION
Gabarit en 7 sections : objectif, prérequis, déroulé numéroté, livrable,
critère de réussite chiffré, piège fréquent, variante avancée.
Le critère de réussite est chiffré ou n'existe pas.

## 7. PROMPTS ET OSSATURE DE CODE
Section obligatoirement complète, avec ces quatre sous-titres de niveau 3 :

### 7.1 Prompt système (format MARIO)
Le prompt système complet, prêt à coller, dans un bloc de code, avec les cinq balises
[M] [A] [R] [I] [O]. Pas de résumé : le texte intégral. Si plusieurs appels modèle sont
nécessaires, un bloc par appel, chacun précédé d'une ligne indiquant à quoi il sert.

### 7.2 Entrées et sortie attendue
Le format d'entrée envoyé au modèle et le schéma JSON exact attendu en sortie,
dans un bloc de code. Ajoute la règle de repli si le modèle renvoie du texte non conforme.

### 7.3 Ossature de code
Une ossature commentée par brique (appel modèle côté serveur, stockage, affichage),
30 lignes maximum par bloc, lignes courtes (moins de 80 caractères) pour rester lisible
sur mobile. Commentaires en français, pas d'implémentation complète.

### 7.4 Réglages et tests
Modèle conseillé, température, max_tokens, coût approximatif par appel, et deux ou trois
cas de test avec le résultat attendu.


## 8. OÙ ÇA SERT CHEZ MOI
Deux ou trois usages concrets dans Studio Cami. Si la réponse honnête est
« nulle part pour l'instant », dis-le.

## 9. SCHÉMA DES ÉTAPES
Le pas à pas de reconstruction, sous forme de liste numérotée de 5 à 9 étapes.
Chaque étape tient sur UNE seule ligne, au format strict :
N. Titre court | Outil | Ce que tu fais concrètement | Durée estimée
Aucune sous-liste, aucun paragraphe dans cette section.

## 10. AMÉLIORER ET OPTIMISER
Trois sous-parties en listes à puces courtes :
- Qualité : ce qui rend le résultat nettement meilleur.
- Coût et performance : ce qui réduit les appels modèle, la latence, la facture.
- Pièges à éviter : ce qui casse en usage réel et comment s'en prémunir.

Aucun texte hors de ces sections, à l'exception de l'éventuelle ligne d'avertissement
en toute première ligne si la fonctionnalité ne vaut pas l'effort, et de l'unique
question de clarification en toute fin.`;

type AnthropicContentBlock = { type: string; text?: string };

export type FicheImage = { mediaType: "image/png" | "image/jpeg"; base64: string };

export type FicheInput = {
  description: string;
  lien: string;
  images?: FicheImage[] | undefined;
};

type AnthropicMessage = { role: "user" | "assistant"; content: unknown };

async function unAppel(
  apiKey: string,
  system: string,
  messages: AnthropicMessage[],
): Promise<{ texte: string; coupe: boolean }> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[fiches] Anthropic error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as {
    content?: AnthropicContentBlock[];
    stop_reason?: string;
  };

  const texte = (payload.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("");

  return { texte, coupe: payload.stop_reason === "max_tokens" };
}

async function appelAnthropic(
  system: string,
  content: Array<Record<string, unknown>>,
): Promise<{ markdown: string }> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }

  const messages: AnthropicMessage[] = [{ role: "user", content }];
  let markdown = "";

  // Jusqu'à 2 reprises : si la réponse est coupée, on demande la suite exacte
  // pour que les dix sections soient toujours complètes.
  for (let tentative = 0; tentative < 3; tentative += 1) {
    const { texte, coupe } = await unAppel(apiKey, system, messages);
    markdown += texte;
    if (!coupe) break;
    messages.push({ role: "assistant", content: texte });
    messages.push({
      role: "user",
      content:
        "Continue exactement où tu t'es arrêté, sans répéter ce qui précède, " +
        "sans phrase d'introduction, jusqu'à la fin de la section 10.",
    });
  }

  markdown = markdown.trim();
  if (!markdown) throw new Error("L'IA n'a rien renvoyé, réessaie.");
  return { markdown };
}

export async function callAnthropicFiche(input: FicheInput): Promise<{ markdown: string }> {
  const images = input.images ?? [];
  const userMessage = [
    `Fonctionnalité observée : ${input.description || "(non décrite, appuie-toi sur les autres éléments)"}`,
    input.lien ? `Lien de référence : ${input.lien}` : "Lien de référence : (aucun)",
    images.length
      ? `${images.length} capture(s) d'écran jointe(s) : décris ce que tu y vois avant d'en déduire quoi que ce soit, et croise les captures entre elles.`
      : "Capture d'écran : (aucune)",
  ].join("\n");

  const content: Array<Record<string, unknown>> = [];
  for (const image of images) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: image.mediaType, data: image.base64 },
    });
  }
  content.push({ type: "text", text: userMessage });

  return appelAnthropic(FICHE_SYSTEM_PROMPT, content);
}

export async function callAnthropicAmelioration(input: {
  markdown: string;
  consigne: string;
}): Promise<{ markdown: string }> {
  const system = `${FICHE_SYSTEM_PROMPT}

[CONSIGNE SUPPLÉMENTAIRE]
On te donne une fiche déjà produite. Tu la réécris en entier, dans le même format
(dix sections, mêmes titres, mêmes étiquettes), en la rendant plus précise, plus
actionnable et plus économe : étapes plus concrètes, critères chiffrés, sections
10 enrichie. Ne supprime aucune section. Ne commente pas ton travail.`;

  return appelAnthropic(system, [
    {
      type: "text",
      text: `Fiche existante à améliorer :\n\n${input.markdown}\n\nAxe demandé : ${
        input.consigne || "améliore globalement la précision et l'optimisation"
      }`,
    },
  ]);
}

