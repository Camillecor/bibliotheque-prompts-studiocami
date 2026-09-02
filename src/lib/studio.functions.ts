import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  RESEAU_VALUES,
  STATUT_VALUES,
  type ContenuRow,
  type MediaRow,
  type StatsStudio,
  RESEAUX,
} from "@/lib/studio";

// Même schéma d'auth temporaire que mario.functions.ts / fiches.functions.ts :
// la connexion est désactivée pour les tests, toutes les fonctions utilisent
// cet utilisateur fictif via supabaseAdmin. À remplacer par context.userId
// quand l'authentification sera réactivée.
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

const COLONNES_CONTENU =
  "id, titre, texte, reseau, statut, tags, date_planifiee, date_publication, prompt_id, created_at, updated_at";
const COLONNES_MEDIA = "id, chemin, titre, tags, largeur, hauteur, origine, created_at";

const DUREE_SIGNATURE = 60 * 60; // 1 h

type MediaBrut = Omit<MediaRow, "url">;

async function signerMedias(
  admin: { storage: { from: (b: string) => { createSignedUrls: (paths: string[], expires: number) => Promise<{ data: { path?: string | null; signedUrl?: string | null }[] | null }> } } },
  medias: MediaBrut[],
): Promise<MediaRow[]> {
  if (medias.length === 0) return [];
  const { data } = await admin.storage
    .from("medias")
    .createSignedUrls(medias.map((m) => m.chemin), DUREE_SIGNATURE);

  const parChemin = new Map<string, string>();
  for (const entree of data ?? []) {
    if (entree.path && entree.signedUrl) parChemin.set(entree.path, entree.signedUrl);
  }
  return medias.map((media) => ({ ...media, url: parChemin.get(media.chemin) ?? "" }));
}

/* ------------------------------------------------------------------ contenus */

const ContenuInput = z.object({
  id: z.string().uuid().optional(),
  titre: z.string().trim().max(160).default(""),
  texte: z.string().max(20_000).default(""),
  reseau: z.enum(RESEAU_VALUES).default("instagram"),
  statut: z.enum(STATUT_VALUES).default("brouillon"),
  tags: z.array(z.string().trim().max(40)).max(8).default([]),
  date_planifiee: z.string().datetime().nullable().default(null),
  date_publication: z.string().datetime().nullable().default(null),
  prompt_id: z.string().uuid().nullable().default(null),
  media_ids: z.array(z.string().uuid()).max(6).default([]),
});

export const saveContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContenuInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, media_ids, ...champs } = data;

    let contenuId = id;
    if (contenuId) {
      const { error } = await supabaseAdmin
        .from("contenus")
        .update(champs)
        .eq("id", contenuId)
        .eq("user_id", TEST_USER_ID);
      if (error) throw new Error(error.message);
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("contenus")
        .insert({ ...champs, user_id: TEST_USER_ID })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      contenuId = row.id as string;
    }

    await supabaseAdmin
      .from("contenu_medias")
      .delete()
      .eq("contenu_id", contenuId)
      .eq("user_id", TEST_USER_ID);

    if (media_ids.length > 0) {
      const { error } = await supabaseAdmin.from("contenu_medias").insert(
        media_ids.map((mediaId, index) => ({
          user_id: TEST_USER_ID,
          contenu_id: contenuId as string,
          media_id: mediaId,
          ordre: index,
        })),
      );
      if (error) throw new Error(error.message);
    }

    return { id: contenuId as string };
  });

export const listContenus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContenuRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: contenus, error } = await supabaseAdmin
      .from("contenus")
      .select(COLONNES_CONTENU)
      .eq("user_id", TEST_USER_ID)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const { data: liaisons, error: erreurLiaisons } = await supabaseAdmin
      .from("contenu_medias")
      .select("contenu_id, media_id, ordre")
      .eq("user_id", TEST_USER_ID);
    if (erreurLiaisons) throw new Error(erreurLiaisons.message);

    const { data: medias, error: erreurMedias } = await supabaseAdmin
      .from("medias")
      .select(COLONNES_MEDIA)
      .eq("user_id", TEST_USER_ID);
    if (erreurMedias) throw new Error(erreurMedias.message);

    const signes = await signerMedias(supabaseAdmin, (medias ?? []) as unknown as MediaBrut[]);
    const parId = new Map(signes.map((m) => [m.id, m]));

    const parContenu = new Map<string, MediaRow[]>();
    for (const lien of [...(liaisons ?? [])].sort((a, b) => Number(a.ordre) - Number(b.ordre))) {
      const media = parId.get(lien.media_id as string);
      if (!media) continue;
      const liste = parContenu.get(lien.contenu_id as string) ?? [];
      liste.push(media);
      parContenu.set(lien.contenu_id as string, liste);
    }

    return ((contenus ?? []) as unknown as Omit<ContenuRow, "medias">[]).map((contenu) => ({
      ...contenu,
      medias: parContenu.get(contenu.id) ?? [],
    }));
  },
);

export const deleteContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contenus")
      .delete()
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const PlanifierInput = z.object({
  id: z.string().uuid(),
  date_planifiee: z.string().datetime().nullable(),
});

export const planifierContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanifierInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contenus")
      .update({
        date_planifiee: data.date_planifiee,
        statut: data.date_planifiee ? "planifie" : "brouillon",
      })
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID)
      .neq("statut", "publie");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const StatutInput = z.object({
  id: z.string().uuid(),
  statut: z.enum(STATUT_VALUES),
});

export const changerStatutContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => StatutInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contenus")
      .update({
        statut: data.statut,
        date_publication: data.statut === "publie" ? new Date().toISOString() : null,
      })
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* -------------------------------------------------------------------- médias */

const ImageInput = z.object({
  mediaType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  base64: z
    .string()
    .max(14_000_000)
    .regex(/^[A-Za-z0-9+/=\r\n]+$/, "Image invalide."),
  titre: z.string().trim().max(120).default(""),
  tags: z.array(z.string().trim().max(40)).max(8).default([]),
  largeur: z.number().int().min(0).max(20000).default(0),
  hauteur: z.number().int().min(0).max(20000).default(0),
  origine: z.enum(["upload", "retouche", "ia"]).default("upload"),
  media_parent_id: z.string().uuid().nullable().default(null),
});

function base64VersOctets(base64: string) {
  const propre = base64.replace(/\s/g, "");
  const binaire = atob(propre);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i += 1) octets[i] = binaire.charCodeAt(i);
  return octets;
}

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ImageInput.parse(input))
  .handler(async ({ data }): Promise<MediaRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const extension =
      data.mediaType === "image/png" ? "png" : data.mediaType === "image/webp" ? "webp" : "jpg";
    const chemin = `${TEST_USER_ID}/${crypto.randomUUID()}.${extension}`;

    const { error: erreurUpload } = await supabaseAdmin.storage
      .from("medias")
      .upload(chemin, base64VersOctets(data.base64), {
        contentType: data.mediaType,
        upsert: false,
      });
    if (erreurUpload) throw new Error(erreurUpload.message);

    const { data: row, error } = await supabaseAdmin
      .from("medias")
      .insert({
        user_id: TEST_USER_ID,
        chemin,
        titre: data.titre,
        tags: data.tags,
        largeur: data.largeur,
        hauteur: data.hauteur,
        origine: data.origine,
        media_parent_id: data.media_parent_id,
      })
      .select(COLONNES_MEDIA)
      .single();
    if (error) throw new Error(error.message);

    const [signe] = await signerMedias(supabaseAdmin, [row as unknown as MediaBrut]);
    return signe as MediaRow;
  });

export const listMedias = createServerFn({ method: "GET" }).handler(
  async (): Promise<MediaRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("medias")
      .select(COLONNES_MEDIA)
      .eq("user_id", TEST_USER_ID)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return signerMedias(supabaseAdmin, (data ?? []) as unknown as MediaBrut[]);
  },
);

const MajMediaInput = z.object({
  id: z.string().uuid(),
  titre: z.string().trim().max(120),
  tags: z.array(z.string().trim().max(40)).max(8).default([]),
});

export const majMedia = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MajMediaInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("medias")
      .update({ titre: data.titre, tags: data.tags })
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("medias")
      .select("chemin")
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID)
      .maybeSingle();

    if (row?.chemin) {
      await supabaseAdmin.storage.from("medias").remove([row.chemin as string]);
    }

    const { error } = await supabaseAdmin
      .from("medias")
      .delete()
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------- Mario IA */

const RedactionInput = z.object({
  idee: z.string().trim().min(5, "Décris ton idée en quelques mots de plus.").max(4000),
  reseau: z.enum(RESEAU_VALUES).default("instagram"),
  ton: z.string().trim().max(40).default(""),
  consignes: z.string().trim().max(2000).default(""),
});

export const redigerContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RedactionInput.parse(input))
  .handler(async ({ data }) => {
    const { redigerPost } = await import("@/lib/studio.server");
    return redigerPost(data);
  });

const VarianteInput = z.object({
  texte: z.string().trim().min(10).max(20_000),
  reseau: z.enum(RESEAU_VALUES).default("instagram"),
  variante: z.enum(["raccourcir", "percutant", "storytelling"]),
});

export const reecrireContenu = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VarianteInput.parse(input))
  .handler(async ({ data }) => {
    const { reecrirePost } = await import("@/lib/studio.server");
    return reecrirePost(data);
  });

/* --------------------------------------------------------------- statistiques */

export const statsStudio = createServerFn({ method: "GET" }).handler(
  async (): Promise<StatsStudio> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: contenus, error } = await supabaseAdmin
      .from("contenus")
      .select("statut, reseau, tags, date_planifiee, date_publication, titre")
      .eq("user_id", TEST_USER_ID)
      .limit(2000);
    if (error) throw new Error(error.message);

    const { count: nbMedias } = await supabaseAdmin
      .from("medias")
      .select("id", { count: "exact", head: true })
      .eq("user_id", TEST_USER_ID);

    const lignes = (contenus ?? []) as unknown as {
      statut: string;
      reseau: string;
      tags: string[];
      date_planifiee: string | null;
      date_publication: string | null;
      titre: string;
    }[];

    const maintenant = new Date();

    // 12 dernières semaines, du lundi au dimanche.
    const semaines: { semaine: string; debut: Date; fin: Date; publies: number; planifies: number }[] = [];
    const lundi = new Date(maintenant);
    const decalage = (lundi.getDay() + 6) % 7;
    lundi.setDate(lundi.getDate() - decalage);
    lundi.setHours(0, 0, 0, 0);
    for (let i = 11; i >= 0; i -= 1) {
      const debut = new Date(lundi);
      debut.setDate(debut.getDate() - i * 7);
      const fin = new Date(debut);
      fin.setDate(fin.getDate() + 7);
      semaines.push({
        semaine: debut.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        debut,
        fin,
        publies: 0,
        planifies: 0,
      });
    }

    const parReseau = new Map<string, number>();
    const parTag = new Map<string, number>();
    const joursPublies = new Set<string>();
    let brouillons = 0;
    let planifies = 0;
    let publies = 0;
    let prochaine: StatsStudio["prochaine"] = null;

    for (const ligne of lignes) {
      if (ligne.statut === "publie") publies += 1;
      else if (ligne.statut === "planifie") planifies += 1;
      else brouillons += 1;

      parReseau.set(ligne.reseau, (parReseau.get(ligne.reseau) ?? 0) + 1);
      for (const tag of ligne.tags ?? []) {
        const propre = tag.trim().toLowerCase();
        if (propre) parTag.set(propre, (parTag.get(propre) ?? 0) + 1);
      }

      if (ligne.date_publication) {
        const date = new Date(ligne.date_publication);
        const creneau = semaines.find((s) => date >= s.debut && date < s.fin);
        if (creneau) creneau.publies += 1;
        if (
          date.getMonth() === maintenant.getMonth() &&
          date.getFullYear() === maintenant.getFullYear()
        ) {
          joursPublies.add(`${date.getDate()}`);
        }
      }

      if (ligne.date_planifiee) {
        const date = new Date(ligne.date_planifiee);
        const creneau = semaines.find((s) => date >= s.debut && date < s.fin);
        if (creneau) creneau.planifies += 1;
        if (ligne.statut !== "publie" && date >= maintenant) {
          if (!prochaine || date < new Date(prochaine.date)) {
            prochaine = {
              titre: ligne.titre || "Publication sans titre",
              date: ligne.date_planifiee,
              reseau: ligne.reseau,
            };
          }
        }
      }
    }

    return {
      total: lignes.length,
      brouillons,
      planifies,
      publies,
      medias: nbMedias ?? 0,
      parSemaine: semaines.map(({ semaine, publies: p, planifies: pl }) => ({
        semaine,
        publies: p,
        planifies: pl,
      })),
      parReseau: RESEAUX.map((reseau) => ({
        reseau: reseau.value,
        label: reseau.label,
        couleur: reseau.couleur,
        total: parReseau.get(reseau.value) ?? 0,
      })).filter((r) => r.total > 0),
      parTag: [...parTag.entries()]
        .map(([tag, total]) => ({ tag, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8),
      joursPublies: joursPublies.size,
      joursDuMois: new Date(
        maintenant.getFullYear(),
        maintenant.getMonth() + 1,
        0,
      ).getDate(),
      prochaine,
    };
  },
);
