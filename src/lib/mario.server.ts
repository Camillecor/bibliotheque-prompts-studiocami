import { TONS, TYPES_PROMPT } from "@/lib/mario";

export const MARIO_SYSTEM_PROMPT = `[M] MISE EN SITUATION
Tu es un expert senior en prompt engineering, spécialisé dans la méthode MARIO
(Mettre en situation, Attente, Règles, Informations, Output). Tu travailles pour
Studio Cami IA, une bibliothèque de prompts d'entreprise organisée par métier
(marketing, ventes, RH, finance, juridique, produit, etc.).

[A] ATTENTE PRINCIPALE
À partir d'une idée brute donnée par l'utilisateur (texte libre + mots-clés +
métier optionnel), tu dois :
1. Réfléchir mentalement à un premier jet, puis le retravailler pour ne
   restituer QUE la version finale, aboutie et directement utilisable — pas
   de brouillon intermédiaire visible dans ta réponse.
2. Générer ce prompt final structuré au format MARIO, optimisé pour utiliser
   le moins de tokens possible tout en restant structuré et de niveau expert.
3. Expliquer en 3 à 5 étapes claires comment lancer ce prompt / ce projet
   concrètement (quel outil, quel modèle Claude utiliser, quelles infos
   préparer avant de lancer)
4. Proposer une classification pour la bibliothèque : métier, 3 à 5 mots-clés,
   niveau de complexité (simple / moyen / complexe)

[R] RÈGLES ET CONTRAINTES
- Respecte STRICTEMENT la structure MARIO : le prompt généré doit contenir les
  5 sections, avec leur intitulé COMPLET entre crochets (jamais la lettre
  seule) — dans cet ordre exact : [M - MISE EN CONTEXTE ET RÔLE],
  [A - ATTENTES], [R - RÈGLES], [I - INFORMATIONS CLÉS], [O - OBJECTIF ULTIME].
  Même si l'idée de départ est vague, pose des hypothèses raisonnables et
  signale-les.
- Dans le champ "prompt", fais démarrer chaque section MARIO sur son propre
  paragraphe (jamais tout sur une seule ligne ni un seul bloc compact).
- N'utilise jamais de tiret cadratin (—) dans le prompt généré, quelle que
  soit la génération : ni dans le titre, ni dans le prompt, ni dans les
  étapes de lancement. Utilise une virgule, un point ou des parenthèses à la
  place.
- Le titre (titre_prompt) doit être explicite et concret : il doit dire
  clairement de quoi parle le prompt, avec le sujet réel et le contexte
  (ex. "Post LinkedIn sur le marché du travail 2025"). Jamais un titre vague
  ou générique (évite "Post LinkedIn", "Rédaction d'article" seuls).
- Reste concis : le prompt généré ne dépasse pas 200 mots.
- N'invente jamais de données sensibles ou personnelles dans les exemples.
- Si l'idée de l'utilisateur touche à des données personnelles (PII), signale-le
  avant de générer le prompt.
- Chaque fois qu'une information nécessaire au prompt est manquante, ambiguë,
  ou dépend d'un choix propre à l'utilisatrice (nom d'entreprise, ton exact,
  longueur précise, date, chiffre, nom de produit, public cible précis, etc.),
  insère la balise littérale [À PRÉCISER] directement à l'endroit concerné
  dans le texte du prompt généré, au lieu d'inventer une valeur par défaut.
  N'en abuse pas : uniquement pour les informations réellement bloquantes,
  jamais pour des détails raisonnablement déductibles du contexte.
- Si un ton est indiqué (professionnel, créatif, technique, pédagogique),
  imprègne-en la section [R - RÈGLES] du prompt généré et le style de
  rédaction lui-même. Si aucun ton n'est indiqué, choisis le plus adapté au
  besoin.
- Si l'utilisateur fournit des instructions supplémentaires (au-delà des
  mots-clés et du ton), ajoute-les sous une sixième section à la toute fin du
  prompt généré : [AUTRES INSTRUCTIONS]. N'ajoute cette section que si des
  instructions supplémentaires ont réellement été transmises.
- Privilégie un français professionnel, clair, sans jargon technique inutile.
- Ne propose jamais plus de 5 mots-clés — la bibliothèque doit rester
  cherchable, pas noyée sous les tags.
- Réponds UNIQUEMENT au format JSON structuré ci-dessous (aucun texte hors JSON,
  aucun markdown, aucun bloc de code autour) — l'app parse la réponse
  directement.

[I] INFORMATIONS COMPLÉMENTAIRES
L'utilisateur est un(e) Product Builder IA / solopreneur qui construit sa
bibliothèque de prompts personnelle en portfolio. Métiers courants pour la
classification : Marketing, Ventes, RH, Finance, Juridique, Produit, Support
client, Opérations, Direction générale, Autre.

[O] FORMAT DE SORTIE
Réponds uniquement avec ce JSON (pas de texte avant/après) :
{
  "titre_prompt": "Titre explicite et concret, ex: 'Post LinkedIn sur le marché du travail 2025' (5-10 mots)",
  "metier": "Un des métiers listés ci-dessus",
  "mots_cles": ["mot1", "mot2", "mot3"],
  "complexite": "simple | moyen | complexe",
  "prompt": "[M - MISE EN CONTEXTE ET RÔLE] ... [A - ATTENTES] ... [R - RÈGLES] ... [I - INFORMATIONS CLÉS] ... [O - OBJECTIF ULTIME] ...",
  "note": "Ce qui rend ce prompt efficace (2-3 phrases)",
  "etapes_lancement": ["Étape 1 : ...", "Étape 2 : ...", "Étape 3 : ..."],
  "alerte_pii": false
}`;

export const ANTHROPIC_MODEL = "claude-sonnet-5";

export const MODELES_DISPONIBLES = ["claude-sonnet-5", "claude-haiku-4-5"] as const;
export type ModeleMario = (typeof MODELES_DISPONIBLES)[number];

type AnthropicContentBlock = { type: string; text?: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_SIGNATURES: { mediaType: "image/png" | "image/jpeg"; bytes: number[] }[] = [
  { mediaType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mediaType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

// Le modèle est invité à insérer des sauts de ligne à l'intérieur du champ JSON
// "prompt" (pour aérer les sections MARIO), mais il lui arrive d'y écrire de
// vrais caractères de contrôle (retour à la ligne brut) au lieu de la séquence
// échappée \n : ça casse JSON.parse. On repasse donc sur le texte brut pour
// échapper tout caractère de contrôle rencontré à l'intérieur d'une chaîne,
// sans toucher au JSON structurel autour.
function echapperSautsDeLigneDansLesChaines(raw: string): string {
  let resultat = "";
  let dansUneChaine = false;
  let echappement = false;
  for (const caractere of raw) {
    if (dansUneChaine) {
      if (echappement) {
        resultat += caractere;
        echappement = false;
        continue;
      }
      if (caractere === "\\") {
        resultat += caractere;
        echappement = true;
        continue;
      }
      if (caractere === '"') {
        dansUneChaine = false;
        resultat += caractere;
        continue;
      }
      if (caractere === "\n") {
        resultat += "\\n";
        continue;
      }
      if (caractere === "\r") {
        resultat += "\\r";
        continue;
      }
      if (caractere === "\t") {
        resultat += "\\t";
        continue;
      }
      resultat += caractere;
      continue;
    }
    if (caractere === '"') {
      dansUneChaine = true;
    }
    resultat += caractere;
  }
  return resultat;
}

// Garantit une ligne vide avant chaque section MARIO ([M - ...], [A - ...], etc.),
// quel que soit ce que le modèle a réellement produit (rien, un seul retour à la
// ligne, ou déjà une ligne vide) : la lisibilité ne dépend plus de sa docilité.
function formaterSautsDeSectionMario(prompt: string): string {
  return prompt
    .replace(/\s*(\[[A-ZÀ-Ý]\s*-\s*[^\]]+\])/g, "\n\n$1")
    .replace(/^\n+/, "")
    .trim();
}

// Sécurité : le client a déjà validé le fichier, mais un appel direct à cette fonction
// (hors navigateur) pourrait contourner ce filtre. On ne fait donc jamais confiance à
// mediaType déclaré : on décode le base64 et on relit les vrais octets d'en-tête avant
// d'accepter l'image, et on plafonne sa taille réelle décodée.
function verifierImage(image: { mediaType: "image/png" | "image/jpeg"; base64: string }) {
  const buffer = Buffer.from(image.base64, "base64");
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image invalide ou trop lourde (5 Mo maximum).");
  }
  const signatureValide = IMAGE_SIGNATURES.some(
    (sig) => sig.mediaType === image.mediaType && sig.bytes.every((b, i) => buffer[i] === b),
  );
  if (!signatureValide) {
    throw new Error("Le fichier joint n'est pas une image PNG/JPEG valide.");
  }
  return buffer;
}

export async function callAnthropicMario(input: {
  idee: string;
  motsCles: string;
  metier: string;
  modele: ModeleMario;
  typePrompt: string;
  ton: string;
  autresInstructions: string;
  image?: { mediaType: "image/png" | "image/jpeg"; base64: string } | undefined;
}) {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }

  const typeLabel = TYPES_PROMPT.find((t) => t.value === input.typePrompt)?.label;
  const tonLabel = TONS.find((t) => t.value === input.ton)?.label;

  const userMessage = [
    `Idée brute : ${input.idee}`,
    input.motsCles ? `Mots-clés suggérés : ${input.motsCles}` : "Mots-clés suggérés : (aucun)",
    input.metier ? `Métier indiqué : ${input.metier}` : "Métier indiqué : (non précisé)",
    typeLabel ? `Type de tâche demandé : ${typeLabel}` : "Type de tâche demandé : (laisse Mario déduire)",
    tonLabel ? `Ton souhaité : ${tonLabel}` : "Ton souhaité : (laisse Mario déduire le plus adapté)",
    input.autresInstructions
      ? `Instructions supplémentaires : ${input.autresInstructions}`
      : "",
    input.image ? "Une image de référence est jointe : appuie-toi dessus si pertinent." : "",
  ]
    .filter(Boolean)
    .join("\n");

  const content: Array<Record<string, unknown>> = [];
  if (input.image) {
    verifierImage(input.image);
    content.push({
      type: "image",
      source: { type: "base64", media_type: input.image.mediaType, data: input.image.base64 },
    });
  }
  content.push({ type: "text", text: userMessage });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: input.modele,
      max_tokens: 4096,
      system: MARIO_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[mario] Anthropic error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as {
    content?: AnthropicContentBlock[];
    stop_reason?: string;
  };

  if (payload.stop_reason === "max_tokens") {
    console.error("[mario] Anthropic response truncated (stop_reason=max_tokens)");
    throw Object.assign(
      new Error("La réponse de l'IA a été coupée car trop longue, réessaie."),
      { statusCode: 502 },
    );
  }

  const raw = (payload.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  // Le modèle peut ajouter du texte ou des balises ``` autour du JSON : on isole
  // la sous-chaîne entre la première { et la dernière } avant de parser.
  const debut = raw.indexOf("{");
  const fin = raw.lastIndexOf("}");
  const cleaned =
    debut !== -1 && fin > debut
      ? raw.slice(debut, fin + 1)
      : raw
          .replace(/^```(?:json)?/i, "")
          .replace(/```$/, "")
          .trim();

  try {
    const parsed = JSON.parse(echapperSautsDeLigneDansLesChaines(cleaned));
    return {
      titre_prompt: String(parsed.titre_prompt ?? "Prompt sans titre"),
      metier: String(parsed.metier ?? "Autre"),
      mots_cles: Array.isArray(parsed.mots_cles) ? parsed.mots_cles.map(String).slice(0, 5) : [],
      complexite: String(parsed.complexite ?? "moyen"),
      prompt: formaterSautsDeSectionMario(String(parsed.prompt ?? "")),
      note: String(parsed.note ?? ""),
      etapes_lancement: Array.isArray(parsed.etapes_lancement)
        ? parsed.etapes_lancement.map(String)
        : [],
      alerte_pii: Boolean(parsed.alerte_pii),
    };
  } catch (error) {
    console.error("[mario] JSON parse failed", error, raw.slice(0, 500));
    throw Object.assign(
      new Error("La réponse de l'IA n'était pas un JSON valide. Relance la génération."),
      { statusCode: 502 },
    );
  }
}

export const MARIO_QUESTIONS_SYSTEM_PROMPT = `Tu es Mario le renard, l'agent IA de Studio Cami. Un utilisateur vient de décrire une idée de prompt IA. Avant de générer le prompt final structuré (méthode MARIO), pose-lui exactement 3 questions courtes et concrètes pour affiner sa demande (ex : précision sur le ton, la longueur, le public cible, un exemple concret, une contrainte spécifique à respecter). Les questions doivent être adaptées à l'idée donnée, jamais génériques ni interchangeables d'une idée à l'autre.

Réponds UNIQUEMENT avec ce JSON (aucun texte avant/après, aucun markdown) :
{ "questions": ["Question 1 ?", "Question 2 ?", "Question 3 ?"] }`;

// Tâche légère (reformulation courte, pas de génération créative) : on reste sur
// Haiku, conformément à la règle RSE du projet (Haiku pour le tagging/classification,
// Sonnet/Opus réservés à la génération).
export async function callAnthropicQuestions(input: {
  idee: string;
  motsCles: string;
  metier: string;
  typePrompt: string;
  ton: string;
}): Promise<{ questions: string[] }> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }

  const typeLabel = TYPES_PROMPT.find((t) => t.value === input.typePrompt)?.label;
  const tonLabel = TONS.find((t) => t.value === input.ton)?.label;

  const userMessage = [
    `Idée brute : ${input.idee}`,
    input.motsCles ? `Mots-clés suggérés : ${input.motsCles}` : "",
    input.metier ? `Métier indiqué : ${input.metier}` : "",
    typeLabel ? `Type de tâche demandé : ${typeLabel}` : "",
    tonLabel ? `Ton souhaité : ${tonLabel}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: MARIO_QUESTIONS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: [{ type: "text", text: userMessage }] }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[mario] Anthropic questions error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as { content?: AnthropicContentBlock[] };
  const raw = (payload.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  const debut = raw.indexOf("{");
  const fin = raw.lastIndexOf("}");
  const cleaned = debut !== -1 && fin > debut ? raw.slice(debut, fin + 1) : raw;

  try {
    const parsed = JSON.parse(echapperSautsDeLigneDansLesChaines(cleaned));
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.map(String).slice(0, 3)
      : [];
    if (questions.length === 0) throw new Error("Aucune question générée.");
    return { questions };
  } catch (error) {
    console.error("[mario] JSON parse failed (questions)", error, raw.slice(0, 500));
    throw Object.assign(
      new Error("Mario n'a pas réussi à formuler ses questions. Réessaie."),
      { statusCode: 502 },
    );
  }
}

export type SuggestionIdee = {
  titre: string;
  description: string;
  tags: string[];
  prefill: string;
};

export const MARIO_SUGGESTIONS_SYSTEM_PROMPT = `Tu es Mario le renard, l'agent IA de Studio Cami. On te donne un résumé des prompts déjà sauvegardés par l'utilisateur (titres, métiers, types, mots-clés). À partir de ces habitudes, propose exactement 3 NOUVELLES idées de prompts pertinentes pour cette personne, différentes de ce qu'elle a déjà, dans le même esprit (mêmes métiers dominants ou métiers adjacents cohérents avec son historique).

Chaque suggestion doit avoir :
- "titre" : un intitulé d'action court (3 à 6 mots, ex. "Rédiger un post Instagram")
- "description" : la suite de la phrase du titre, courte, terminée par "…" (ex. "qui capte l'attention et donne envie de réagir…")
- "tags" : 1 à 2 mots-clés courts (ex. ["Instagram", "Post"])
- "prefill" : une phrase complète commençant par "Un prompt pour " qui reprend le titre et la description

Réponds UNIQUEMENT avec ce JSON (aucun texte avant/après, aucun markdown) :
{ "suggestions": [ { "titre": "...", "description": "...", "tags": ["..."], "prefill": "..." }, { "titre": "...", "description": "...", "tags": ["..."], "prefill": "..." }, { "titre": "...", "description": "...", "tags": ["..."], "prefill": "..." } ] }`;

// Tâche légère (classification/reformulation à partir d'un historique, pas de génération créative
// longue) : on reste sur Haiku, conformément à la règle RSE du projet.
export async function callAnthropicSuggestions(
  historique: { titre: string; metier: string; type_prompt: string; mots_cles: string[] }[],
): Promise<{ suggestions: SuggestionIdee[] }> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }

  const resume = historique
    .map((p, i) => {
      const details = [
        `métier : ${p.metier}`,
        p.type_prompt ? `type : ${p.type_prompt}` : "",
        p.mots_cles.length ? `mots-clés : ${p.mots_cles.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(", ");
      return `${i + 1}. "${p.titre}" (${details})`;
    })
    .join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 768,
      system: MARIO_SUGGESTIONS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: `Prompts déjà sauvegardés par l'utilisateur :\n${resume}` }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[mario] Anthropic suggestions error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as { content?: AnthropicContentBlock[] };
  const raw = (payload.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  const debut = raw.indexOf("{");
  const fin = raw.lastIndexOf("}");
  const cleaned = debut !== -1 && fin > debut ? raw.slice(debut, fin + 1) : raw;

  try {
    const parsed = JSON.parse(echapperSautsDeLigneDansLesChaines(cleaned));
    const brutes = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];
    const suggestions: SuggestionIdee[] = brutes
      .map((s: Record<string, unknown>) => ({
        titre: String(s.titre ?? ""),
        description: String(s.description ?? ""),
        tags: Array.isArray(s.tags) ? s.tags.map(String).slice(0, 3) : [],
        prefill: String(s.prefill ?? ""),
      }))
      .filter((s: SuggestionIdee) => s.titre.length > 0 && s.prefill.length > 0);
    return { suggestions };
  } catch (error) {
    console.error("[mario] JSON parse failed (suggestions)", error, raw.slice(0, 500));
    throw Object.assign(
      new Error("Mario n'a pas réussi à générer des suggestions. Réessaie."),
      { statusCode: 502 },
    );
  }
}
