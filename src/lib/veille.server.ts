// Collecte et résumé de la veille : lecture des flux RSS/Atom, recherche web
// complémentaire et rédaction des résumés par Claude.
//
// Tâches légères (tri, résumé court, classification) : on reste sur Haiku,
// conformément à la règle RSE du projet.

const MODELE_VEILLE = "claude-haiku-4-5";
const MAX_ITEMS_PAR_FLUX = 8;
const MAX_ITEMS_PAR_RUN = 40;

export type ItemBrut = {
  titre: string;
  url: string;
  source: string;
  publie_le: string | null;
  extrait: string;
  origine: "rss" | "web";
};

export type ItemResume = ItemBrut & { resume: string; tags: string[] };

type AnthropicBloc = { type: string; text?: string };

function cleAnthropic(): string {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY n'est pas configurée.");
  }
  return apiKey;
}

/* ------------------------------------------------------------------ RSS */

function decoderEntites(texte: string): string {
  return texte
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function baliseSimple(bloc: string, nom: string): string {
  const match = bloc.match(new RegExp(`<${nom}[^>]*>([\\s\\S]*?)</${nom}>`, "i"));
  return match?.[1] ? decoderEntites(match[1]) : "";
}

function lienDuBloc(bloc: string): string {
  const rss = bloc.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
  if (rss?.[1]) {
    const valeur = decoderEntites(rss[1]);
    if (valeur.startsWith("http")) return valeur;
  }
  const atom = bloc.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  return atom?.[1] ?? "";
}

function dateIso(valeur: string): string | null {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parserFlux(xml: string, source: string): ItemBrut[] {
  const blocs = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
  const items: ItemBrut[] = [];

  for (const bloc of blocs.slice(0, MAX_ITEMS_PAR_FLUX)) {
    const titre = baliseSimple(bloc, "title");
    const url = lienDuBloc(bloc);
    if (!titre || !url.startsWith("http")) continue;
    const extrait =
      baliseSimple(bloc, "description") ||
      baliseSimple(bloc, "summary") ||
      baliseSimple(bloc, "content");
    items.push({
      titre,
      url,
      source,
      publie_le:
        dateIso(baliseSimple(bloc, "pubDate")) ??
        dateIso(baliseSimple(bloc, "updated")) ??
        dateIso(baliseSimple(bloc, "published")),
      extrait: extrait.slice(0, 800),
      origine: "rss",
    });
  }
  return items;
}

export async function lireFlux(source: { nom: string; url: string }): Promise<ItemBrut[]> {
  try {
    const reponse = await fetch(source.url, {
      headers: { "user-agent": "StudioCamiVeille/1.0", accept: "application/rss+xml, text/xml, */*" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!reponse.ok) {
      console.error("[veille] flux indisponible", source.url, reponse.status);
      return [];
    }
    return parserFlux(await reponse.text(), source.nom);
  } catch (erreur) {
    console.error("[veille] lecture flux échouée", source.url, erreur);
    return [];
  }
}

/* ------------------------------------------------------------------ IA */

function extraireJson(brut: string): unknown {
  const debut = brut.indexOf("{");
  const fin = brut.lastIndexOf("}");
  const nettoye = debut !== -1 && fin > debut ? brut.slice(debut, fin + 1) : brut;
  return JSON.parse(nettoye);
}

async function appelClaude(body: Record<string, unknown>): Promise<string> {
  const reponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cleAnthropic(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!reponse.ok) {
    const detail = await reponse.text();
    console.error("[veille] Anthropic error", reponse.status, detail.slice(0, 500));
    if (reponse.status === 429) {
      throw new Error("Trop de requêtes vers l'IA. Réessaie dans quelques instants.");
    }
    throw new Error(`L'appel à l'IA a échoué (${reponse.status}).`);
  }

  const payload = (await reponse.json()) as { content?: AnthropicBloc[] };
  return (payload.content ?? [])
    .filter((bloc) => bloc.type === "text")
    .map((bloc) => bloc.text ?? "")
    .join("")
    .trim();
}

const SYSTEM_RESUME = `Tu es Mario le renard, l'agent de veille de Studio Cami. On te donne une liste d'articles bruts (titre, source, extrait) et les thèmes de veille de l'utilisatrice.

Pour chaque article RÉELLEMENT pertinent pour l'IA, le digital, les nouveaux outils ou les nouvelles pratiques professionnelles :
- reformule le titre en français clair et concret (max 12 mots, jamais de tiret cadratin)
- écris un résumé de 2 à 3 phrases, factuel, en français, qui dit ce qui change concrètement
- attribue 1 à 3 étiquettes parmi : Outil, Modèle, Pratique, Marketing, Étude, Réglementation

N'invente jamais d'information absente de l'extrait. Écarte purement et simplement les articles hors sujet, publicitaires ou vides : ne les renvoie pas.

Réponds UNIQUEMENT avec ce JSON (aucun texte avant/après, aucun markdown) :
{ "items": [ { "index": 0, "titre": "...", "resume": "...", "tags": ["Outil"] } ] }`;

export async function resumerItems(items: ItemBrut[], themes: string[]): Promise<ItemResume[]> {
  if (items.length === 0) return [];

  const liste = items
    .map(
      (item, i) =>
        `${i}. [${item.source}] ${item.titre}\n${item.extrait.slice(0, 400) || "(pas d'extrait)"}`,
    )
    .join("\n\n");

  const brut = await appelClaude({
    model: MODELE_VEILLE,
    max_tokens: 4096,
    system: SYSTEM_RESUME,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Thèmes de veille : ${themes.join(", ") || "IA, digital, outils"}\n\nArticles :\n${liste}`,
          },
        ],
      },
    ],
  });

  try {
    const parsed = extraireJson(brut) as { items?: Record<string, unknown>[] };
    const retenus = Array.isArray(parsed.items) ? parsed.items : [];
    const resumes: ItemResume[] = [];
    for (const entree of retenus) {
      const index = Number(entree["index"]);
      const source = items[index];
      if (!source) continue;
      resumes.push({
        ...source,
        titre: String(entree["titre"] ?? source.titre).slice(0, 200),
        resume: String(entree["resume"] ?? "").slice(0, 1000),
        tags: Array.isArray(entree["tags"])
          ? (entree["tags"] as unknown[]).map(String).slice(0, 3)
          : [],
      });
    }
    return resumes.slice(0, MAX_ITEMS_PAR_RUN);
  } catch (erreur) {
    console.error("[veille] JSON résumé invalide", erreur, brut.slice(0, 400));
    return [];
  }
}

const SYSTEM_WEB = `Tu es Mario le renard, l'agent de veille de Studio Cami. Utilise l'outil de recherche web pour trouver les actualités les plus récentes (moins de 7 jours) sur les thèmes donnés : IA, digital, nouveaux outils et nouvelles pratiques professionnelles.

Renvoie au maximum 6 actualités réellement récentes et utiles. Pour chacune : un titre clair en français (max 12 mots, jamais de tiret cadratin), un résumé factuel de 2 à 3 phrases en français, l'URL exacte de la source trouvée, le nom du site, et 1 à 3 étiquettes parmi : Outil, Modèle, Pratique, Marketing, Étude, Réglementation.

N'invente jamais une URL : n'utilise que des liens réellement rencontrés pendant la recherche. Si tu ne trouves rien de récent, renvoie une liste vide.

Réponds UNIQUEMENT avec ce JSON (aucun texte avant/après, aucun markdown) :
{ "items": [ { "titre": "...", "resume": "...", "url": "https://...", "source": "...", "tags": ["Outil"] } ] }`;

export async function chercherWeb(themes: string[]): Promise<ItemResume[]> {
  if (themes.length === 0) return [];

  const brut = await appelClaude({
    model: MODELE_VEILLE,
    max_tokens: 4096,
    system: SYSTEM_WEB,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Thèmes de veille : ${themes.join(", ")}\nDate du jour : ${new Date().toISOString().slice(0, 10)}`,
          },
        ],
      },
    ],
  });

  try {
    const parsed = extraireJson(brut) as { items?: Record<string, unknown>[] };
    const retenus = Array.isArray(parsed.items) ? parsed.items : [];
    const items: ItemResume[] = [];
    for (const entree of retenus.slice(0, 6)) {
      const url = String(entree["url"] ?? "");
      if (!/^https?:\/\//i.test(url)) continue;
      items.push({
        titre: String(entree["titre"] ?? "").slice(0, 200),
        resume: String(entree["resume"] ?? "").slice(0, 1000),
        url,
        source: String(entree["source"] ?? "Recherche web").slice(0, 120),
        publie_le: null,
        extrait: "",
        origine: "web",
        tags: Array.isArray(entree["tags"])
          ? (entree["tags"] as unknown[]).map(String).slice(0, 3)
          : [],
      });
    }
    return items.filter((item) => item.titre.length > 0);
  } catch (erreur) {
    console.error("[veille] JSON recherche web invalide", erreur, brut.slice(0, 400));
    return [];
  }
}

export const LIMITE_ITEMS_RUN = MAX_ITEMS_PAR_RUN;

/* ------------------------------------------------------------------ run */

// Un seul passage à la fois : le verrou est une ligne `veille_runs` en cours,
// avec expiration au bout de 15 minutes pour ne jamais rester bloqué.
const DUREE_VERROU_MS = 15 * 60 * 1000;

export async function executerVeille(userId: string): Promise<{
  statut: "ok" | "occupe" | "echec";
  nb_items: number;
  message: string;
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: enCours } = await supabaseAdmin
    .from("veille_runs")
    .select("id, demarre_le")
    .eq("user_id", userId)
    .eq("statut", "en_cours")
    .order("demarre_le", { ascending: false })
    .limit(1);

  const verrou = enCours?.[0];
  if (verrou && Date.now() - new Date(verrou.demarre_le).getTime() < DUREE_VERROU_MS) {
    return { statut: "occupe", nb_items: 0, message: "Une veille est déjà en cours." };
  }
  if (verrou) {
    await supabaseAdmin
      .from("veille_runs")
      .update({ statut: "echec", termine_le: new Date().toISOString(), message: "Interrompue." })
      .eq("id", verrou.id);
  }

  const { data: run } = await supabaseAdmin
    .from("veille_runs")
    .insert({ user_id: userId, statut: "en_cours" })
    .select("id")
    .single();
  const runId = run?.id;

  try {
    const [{ data: sources }, { data: themes }] = await Promise.all([
      supabaseAdmin
        .from("veille_sources")
        .select("id, nom, url")
        .eq("user_id", userId)
        .eq("actif", true)
        .limit(30),
      supabaseAdmin
        .from("veille_themes")
        .select("libelle")
        .eq("user_id", userId)
        .eq("actif", true)
        .limit(20),
    ]);

    const listeThemes = (themes ?? []).map((t) => t.libelle);

    const flux = await Promise.all((sources ?? []).map((source) => lireFlux(source)));
    const bruts = flux.flat();

    // Déduplication : on écarte ce qui est déjà en base avant d'appeler l'IA.
    const urls = bruts.map((item) => item.url);
    const deja = new Set<string>();
    for (let i = 0; i < urls.length; i += 100) {
      const { data } = await supabaseAdmin
        .from("veille_items")
        .select("url")
        .eq("user_id", userId)
        .in("url", urls.slice(i, i + 100));
      for (const ligne of data ?? []) deja.add(ligne.url);
    }
    const nouveaux = bruts.filter((item) => !deja.has(item.url)).slice(0, MAX_ITEMS_PAR_RUN);

    const [resumesRss, resumesWeb] = await Promise.all([
      resumerItems(nouveaux, listeThemes),
      chercherWeb(listeThemes).catch((erreur) => {
        console.error("[veille] recherche web indisponible", erreur);
        return [] as ItemResume[];
      }),
    ]);

    const parUrl = new Map<string, ItemResume>();
    for (const item of [...resumesRss, ...resumesWeb]) {
      if (!deja.has(item.url)) parUrl.set(item.url, item);
    }
    const aInserer = [...parUrl.values()].slice(0, MAX_ITEMS_PAR_RUN);

    if (aInserer.length > 0) {
      const { error } = await supabaseAdmin.from("veille_items").upsert(
        aInserer.map((item) => ({
          user_id: userId,
          titre: item.titre,
          resume: item.resume,
          url: item.url,
          source: item.source,
          publie_le: item.publie_le,
          tags: item.tags,
          origine: item.origine,
        })),
        { onConflict: "user_id,url", ignoreDuplicates: true },
      );
      if (error) console.error("[veille] insertion partielle", error.message);
    }

    const maintenant = new Date().toISOString();
    if ((sources ?? []).length > 0) {
      await supabaseAdmin
        .from("veille_sources")
        .update({ derniere_lecture: maintenant })
        .eq("user_id", userId)
        .in(
          "id",
          (sources ?? []).map((s) => s.id),
        );
    }
    if (runId) {
      await supabaseAdmin
        .from("veille_runs")
        .update({ statut: "ok", termine_le: maintenant, nb_items: aInserer.length })
        .eq("id", runId);
    }

    return { statut: "ok", nb_items: aInserer.length, message: "" };
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : "Erreur inconnue";
    console.error("[veille] run échoué", message);
    if (runId) {
      await supabaseAdmin
        .from("veille_runs")
        .update({ statut: "echec", termine_le: new Date().toISOString(), message })
        .eq("id", runId);
    }
    return { statut: "echec", nb_items: 0, message };
  }
}
