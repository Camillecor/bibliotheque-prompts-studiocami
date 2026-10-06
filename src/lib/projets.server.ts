// Code serveur de l'onglet Projets : découpage d'un objectif en tâches par Mario.

type BlocTexte = { type?: string; text?: string };

const SYSTEM_DECOUPAGE = `Tu es Mario le renard, l'agent IA de Studio Cami.
On te donne un objectif. Tu le découpes en tâches concrètes, actionnables et ordonnées, en français.

Règles :
- Entre 4 et 10 tâches principales, jamais plus.
- Un titre de tâche = un verbe d'action + un livrable clair, 10 mots maximum.
- Ajoute des sous-tâches uniquement quand la tâche le mérite (3 maximum).
- priorite : 0 (aucune) à 3 (haute). Réserve 3 aux tâches bloquantes.
- jours : nombre de jours à partir d'aujourd'hui pour l'échéance suggérée (entier >= 0).
- N'invente aucune donnée personnelle, aucun chiffre, aucun nom de client.

Réponds UNIQUEMENT avec ce JSON, sans texte autour et sans bloc de code :
{ "taches": [ { "titre": "…", "note": "…", "priorite": 2, "jours": 3, "sous_taches": ["…"] } ] }`;

function cleAnthropic() {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute la clé dans Project Settings → Secrets.",
    );
  }
  return apiKey;
}

export type TacheProposee = {
  titre: string;
  note: string;
  priorite: number;
  jours: number;
  sous_taches: string[];
};

export async function decouperObjectif(input: {
  objectif: string;
  contexte: string;
}): Promise<{ taches: TacheProposee[] }> {
  const message = [
    `Objectif : ${input.objectif}`,
    input.contexte ? `Contexte utile : ${input.contexte}` : "",
    "Découpe cet objectif en tâches.",
  ]
    .filter(Boolean)
    .join("\n\n");

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
      system: SYSTEM_DECOUPAGE,
      messages: [{ role: "user", content: [{ type: "text", text: message }] }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[projets] Anthropic error", response.status, detail);
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
    const parsed = JSON.parse(nettoye) as { taches?: unknown };
    const liste = Array.isArray(parsed.taches) ? parsed.taches : [];
    const taches = liste.slice(0, 10).map((brute) => {
      const t = (brute ?? {}) as Record<string, unknown>;
      const sous = Array.isArray(t["sous_taches"]) ? (t["sous_taches"] as unknown[]) : [];
      return {
        titre: String(t["titre"] ?? "Tâche").trim().slice(0, 160) || "Tâche",
        note: String(t["note"] ?? "").trim().slice(0, 2000),
        priorite: Math.min(3, Math.max(0, Number(t["priorite"] ?? 0) || 0)),
        jours: Math.min(180, Math.max(0, Number(t["jours"] ?? 0) || 0)),
        sous_taches: sous.slice(0, 3).map((s) => String(s).trim().slice(0, 160)).filter(Boolean),
      };
    });
    return { taches };
  } catch (error) {
    console.error("[projets] JSON parse failed", error, brut.slice(0, 400));
    throw Object.assign(
      new Error("La réponse de l'IA n'était pas exploitable. Relance le découpage."),
      { statusCode: 502 },
    );
  }
}

/* ------------------------------------------------- Analyse de la liste (Mario) */

const SYSTEM_ANALYSE = `Tu es Mario le renard, l'agent IA de Studio Cami.
On te donne la liste des tâches ouvertes d'un utilisateur (titre, priorité, échéance, projet, avancement des sous-tâches).
Tu analyses cette liste comme un assistant productif et tu réponds en français.

Règles :
- focus : les 5 tâches au maximum à traiter en priorité, classées de la plus urgente à la moins urgente.
- raison : une explication courte (8 mots maximum), concrète, liée aux données (retard, échéance, priorité, dépendances).
- conseils : 3 conseils courts et actionnables au maximum (tâche sans échéance à dater, tâche trop vague à découper, tâche obsolète à supprimer, priorités à arbitrer). Chaque conseil cite la tâche concernée entre guillets.
- N'invente aucune tâche, aucune donnée personnelle, aucun chiffre.

Réponds UNIQUEMENT avec ce JSON, sans texte autour et sans bloc de code :
{ "focus": [ { "id": "uuid", "raison": "…" } ], "conseils": ["…"] }`;

type TacheAnalyse = {
  id: string;
  titre: string;
  priorite: number;
  echeance: string | null;
  projet: string | null;
  sous_faites: number;
  sous_total: number;
};

export type AnalyseListe = {
  focus: { id: string; raison: string }[];
  conseils: string[];
};

export async function analyserListeTaches(taches: TacheAnalyse[]): Promise<AnalyseListe> {
  const message = [
    "Voici mes tâches ouvertes :",
    JSON.stringify(taches, null, 2),
    "Classe mes priorités et donne-moi tes conseils.",
  ].join("\n\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cleAnthropic(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM_ANALYSE,
      messages: [{ role: "user", content: [{ type: "text", text: message }] }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[projets] Anthropic analyse error", response.status, detail);
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
    const parsed = JSON.parse(nettoye) as Record<string, unknown>;
    const focusBrut = Array.isArray(parsed["focus"]) ? parsed["focus"] : [];
    const idsValides = new Set(taches.map((t) => t.id));
    const focus = focusBrut
      .slice(0, 5)
      .map((entree) => {
        const e = (entree ?? {}) as Record<string, unknown>;
        return {
          id: String(e["id"] ?? ""),
          raison: String(e["raison"] ?? "").trim().slice(0, 120),
        };
      })
      .filter((e) => idsValides.has(e.id) && e.raison.length > 0);
    const conseils = (Array.isArray(parsed["conseils"]) ? parsed["conseils"] : [])
      .slice(0, 3)
      .map((c) => String(c).trim().slice(0, 240))
      .filter(Boolean);
    return { focus, conseils };
  } catch (error) {
    console.error("[projets] JSON analyse parse failed", error, brut.slice(0, 400));
    throw Object.assign(
      new Error("La réponse de l'IA n'était pas exploitable. Relance l'analyse."),
      { statusCode: 502 },
    );
  }
}
