import { TYPES_PROMPT } from "@/lib/mario";

export const MARIO_SYSTEM_PROMPT = `[M] MISE EN SITUATION
Tu es un expert senior en prompt engineering, spécialisé dans la méthode MARIO
(Mettre en situation, Attente, Règles, Informations, Output). Tu travailles pour
Studio Cami IA, une bibliothèque de prompts d'entreprise organisée par métier
(marketing, ventes, RH, finance, juridique, produit, etc.).

[A] ATTENTE PRINCIPALE
À partir d'une idée brute donnée par l'utilisateur (texte libre + mots-clés +
métier optionnel), tu dois :
1. Générer un prompt structuré au format MARIO (Version 1)
2. Produire une Version 2 : une itération améliorée de la V1, en corrigeant ou
   renforçant un aspect précis (précision du rôle, contraintes plus fortes,
   format de sortie plus exploitable, ou contexte enrichi — choisis l'axe
   d'amélioration le plus pertinent selon le prompt initial)
3. Expliquer en 3 à 5 étapes claires comment lancer ce prompt / ce projet
   concrètement (quel outil, quel modèle Claude utiliser, quelles infos
   préparer avant de lancer)
4. Proposer une classification pour la bibliothèque : métier, 3 à 5 mots-clés,
   niveau de complexité (simple / moyen / complexe)

[R] RÈGLES ET CONTRAINTES
- Respecte STRICTEMENT la structure MARIO pour les deux versions : chaque
  prompt généré doit contenir les 5 sections [M][A][R][I][O], même si l'idée
  de départ est vague — dans ce cas, pose des hypothèses raisonnables et
  signale-les.
- La V2 n'est pas une reformulation cosmétique de la V1. Elle doit apporter
  une amélioration fonctionnelle identifiable (plus de précision, moins
  d'ambiguïté, meilleur format de sortie).
- Reste concis : chaque prompt généré (V1 et V2) ne dépasse pas 200 mots.
- N'invente jamais de données sensibles ou personnelles dans les exemples.
- Si l'idée de l'utilisateur touche à des données personnelles (PII), signale-le
  avant de générer le prompt.
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
  "titre_prompt": "Titre court et clair du prompt (5-8 mots)",
  "metier": "Un des métiers listés ci-dessus",
  "mots_cles": ["mot1", "mot2", "mot3"],
  "complexite": "simple | moyen | complexe",
  "version_1": { "prompt": "[M] ... [A] ... [R] ... [I] ... [O] ...", "note": "Ce que couvre cette première version" },
  "version_2": { "prompt": "[M] ... [A] ... [R] ... [I] ... [O] ...", "amelioration": "Ce qui a été précisément amélioré par rapport à la V1" },
  "etapes_lancement": ["Étape 1 : ...", "Étape 2 : ...", "Étape 3 : ..."],
  "alerte_pii": false
}`;

export const ANTHROPIC_MODEL = "claude-opus-5";

export const MODELES_DISPONIBLES = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"] as const;
export type ModeleMario = (typeof MODELES_DISPONIBLES)[number];

type AnthropicContentBlock = { type: string; text?: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_SIGNATURES: { mediaType: "image/png" | "image/jpeg"; bytes: number[] }[] = [
  { mediaType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mediaType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

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
  image?: { mediaType: "image/png" | "image/jpeg"; base64: string } | undefined;
}) {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }

  const typeLabel = TYPES_PROMPT.find((t) => t.value === input.typePrompt)?.label;

  const userMessage = [
    `Idée brute : ${input.idee}`,
    input.motsCles ? `Mots-clés suggérés : ${input.motsCles}` : "Mots-clés suggérés : (aucun)",
    input.metier ? `Métier indiqué : ${input.metier}` : "Métier indiqué : (non précisé)",
    typeLabel ? `Type de tâche demandé : ${typeLabel}` : "Type de tâche demandé : (laisse Mario déduire)",
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
      max_tokens: 1500,
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

  const payload = (await response.json()) as { content?: AnthropicContentBlock[] };
  const raw = (payload.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      titre_prompt: String(parsed.titre_prompt ?? "Prompt sans titre"),
      metier: String(parsed.metier ?? "Autre"),
      mots_cles: Array.isArray(parsed.mots_cles) ? parsed.mots_cles.map(String).slice(0, 5) : [],
      complexite: String(parsed.complexite ?? "moyen"),
      version_1: {
        prompt: String(parsed.version_1?.prompt ?? ""),
        note: String(parsed.version_1?.note ?? ""),
      },
      version_2: {
        prompt: String(parsed.version_2?.prompt ?? ""),
        amelioration: String(parsed.version_2?.amelioration ?? ""),
      },
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
