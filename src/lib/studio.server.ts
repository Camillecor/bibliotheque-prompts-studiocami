// Code serveur de l'onglet Studio : rédaction de posts par Mario (Claude) et
// génération de visuels via la passerelle IA de Lovable.
import { RESEAUX, TONS_POST, VARIANTES } from "@/lib/studio";

type BlocTexte = { type?: string; text?: string };

const SYSTEM_POST = `Tu es Mario le renard, l'agent IA de communication de Studio Cami.
Tu rédiges des publications pour les réseaux sociaux en français.

Règles :
- Respecte le réseau visé : ton, longueur, usage des emojis et des hashtags.
- Une accroche forte sur la première ligne, qui donne envie de dérouler.
- Des phrases courtes, du concret, aucun jargon marketing creux.
- Jamais de données personnelles inventées, jamais de fausses statistiques.
- Termine par une invitation claire à réagir quand c'est pertinent.
- N'ajoute aucun commentaire sur ton propre travail.

Réponds UNIQUEMENT avec ce JSON, sans texte autour et sans bloc de code :
{ "titre": "Titre interne court (5-8 mots)", "texte": "Le post complet, sauts de ligne compris", "tags": ["mot1", "mot2", "mot3"] }`;

const SYSTEM_VARIANTE = `Tu es Mario le renard, l'agent IA de communication de Studio Cami.
On te donne une publication existante et une consigne de réécriture. Tu renvoies une nouvelle version du texte qui garde le fond, la langue et le réseau d'origine, mais applique la consigne.

Réponds UNIQUEMENT avec ce JSON, sans texte autour et sans bloc de code :
{ "titre": "Titre interne court (5-8 mots)", "texte": "Le post réécrit", "tags": ["mot1", "mot2", "mot3"] }`;

function cleAnthropic() {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }
  return apiKey;
}

async function appelClaude(system: string, message: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cleAnthropic(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: [{ type: "text", text: message }] }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[studio] Anthropic error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as { content?: BlocTexte[] };
  const brut = (payload.content ?? [])
    .filter((bloc) => bloc.type === "text")
    .map((bloc) => bloc.text ?? "")
    .join("")
    .trim();

  const debut = brut.indexOf("{");
  const fin = brut.lastIndexOf("}");
  const nettoye = debut !== -1 && fin > debut ? brut.slice(debut, fin + 1) : brut;

  try {
    const parsed = JSON.parse(nettoye) as {
      titre?: unknown;
      texte?: unknown;
      tags?: unknown;
    };
    return {
      titre: String(parsed.titre ?? "Publication sans titre").slice(0, 120),
      texte: String(parsed.texte ?? "").trim(),
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 5) : [],
    };
  } catch (error) {
    console.error("[studio] JSON parse failed", error, brut.slice(0, 400));
    throw Object.assign(
      new Error("La réponse de l'IA n'était pas exploitable. Relance la génération."),
      { statusCode: 502 },
    );
  }
}

export async function redigerPost(input: {
  idee: string;
  reseau: string;
  ton: string;
  consignes: string;
}) {
  const reseau = RESEAUX.find((r) => r.value === input.reseau) ?? RESEAUX[0];
  const ton = TONS_POST.find((t) => t.value === input.ton);

  const message = [
    `Réseau visé : ${reseau.label} (maximum ${reseau.limite} caractères).`,
    ton ? `Ton souhaité : ${ton.label}.` : "Ton souhaité : choisis le plus adapté.",
    `Idée de départ : ${input.idee}`,
    input.consignes ? `Consignes supplémentaires : ${input.consignes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return appelClaude(SYSTEM_POST, message);
}

export async function reecrirePost(input: {
  texte: string;
  reseau: string;
  variante: string;
}) {
  const reseau = RESEAUX.find((r) => r.value === input.reseau) ?? RESEAUX[0];
  const variante = VARIANTES.find((v) => v.value === input.variante) ?? VARIANTES[0];

  const consigne =
    variante.value === "raccourcir"
      ? "Réduis nettement la longueur (environ 40 % de moins) sans perdre le message principal."
      : variante.value === "percutant"
        ? "Renforce l'accroche, coupe les phrases longues, va droit au but."
        : "Transforme le post en une courte histoire concrète, avec une situation vécue puis l'enseignement.";

  const message = [
    `Réseau : ${reseau.label} (maximum ${reseau.limite} caractères).`,
    `Consigne : ${consigne}`,
    "Publication actuelle :",
    input.texte,
  ].join("\n");

  return appelClaude(SYSTEM_VARIANTE, message);
}

/**
 * Ouvre le flux de génération d'image de la passerelle IA de Lovable.
 * Le flux SSE est renvoyé tel quel à la route serveur, qui le retransmet au navigateur
 * pour afficher les aperçus progressifs.
 */
export async function ouvrirFluxVisuel(prompt: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("La génération d'images n'est pas disponible : clé IA manquante.");
  }

  return fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-image-2",
      prompt,
      size: "1024x1024",
      quality: "low",
      n: 1,
      stream: true,
      partial_images: 1,
    }),
  });
}

export async function genererVisuelSansFlux(prompt: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("La génération d'images n'est pas disponible : clé IA manquante.");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-image-2",
      prompt,
      size: "1024x1024",
      quality: "low",
      n: 1,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[studio] image gateway error", response.status, detail);
    throw new Error(`La génération du visuel a échoué (${response.status}).`);
  }

  const payload = (await response.json()) as { data?: { b64_json?: string }[] };
  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) throw new Error("La génération du visuel n'a renvoyé aucune image.");
  return b64;
}
