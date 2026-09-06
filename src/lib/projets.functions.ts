import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";
import { STATUT_TACHE_VALUES, type ProjetRow, type TacheRow } from "@/lib/projets";

// Application mono-compte, sans authentification : le filtrage sur COMPTE_ID
// est fait côté serveur uniquement, jamais d'après une valeur du navigateur.

const COLONNES_PROJET = "id, nom, couleur, icone, ordre, archive, created_at, updated_at";
const COLONNES_TACHE =
  "id, projet_id, parent_id, titre, note, statut, priorite, echeance, etiquettes, ordre, termine_le, contenu_id, fiche_id, prompt_id, created_at, updated_at";

/* ------------------------------------------------------------------- projets */

const ProjetInput = z.object({
  id: z.string().uuid().optional(),
  nom: z.string().trim().min(1).max(80),
  couleur: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide.")
    .default("#ff6b35"),
  icone: z.string().trim().max(40).default("folder"),
  ordre: z.number().int().min(0).max(999).default(0),
});

export const saveProjet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProjetInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...champs } = data;

    if (id) {
      const { error } = await supabaseAdmin
        .from("projets")
        .update(champs)
        .eq("id", id)
        .eq("user_id", COMPTE_ID);
      if (error) throw erreurBase("projets", error);
      return { id };
    }

    const { data: cree, error } = await supabaseAdmin
      .from("projets")
      .insert({ ...champs, user_id: COMPTE_ID })
      .select("id")
      .single();
    if (error) throw erreurBase("projets", error);
    return { id: cree.id as string };
  });

export const listProjets = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjetRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("projets")
      .select(COLONNES_PROJET)
      .eq("user_id", COMPTE_ID)
      .eq("archive", false)
      .order("ordre", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw erreurBase("projets", error);
    return (data ?? []) as unknown as ProjetRow[];
  },
);

export const deleteProjet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("projets")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("projets", error);
    return { ok: true };
  });

/* -------------------------------------------------------------------- tâches */

const TacheInput = z.object({
  id: z.string().uuid().optional(),
  projet_id: z.string().uuid().nullable().default(null),
  parent_id: z.string().uuid().nullable().default(null),
  titre: z.string().trim().min(1).max(200),
  note: z.string().max(10_000).default(""),
  statut: z.enum(STATUT_TACHE_VALUES).default("a_faire"),
  priorite: z.number().int().min(0).max(3).default(0),
  echeance: z.string().datetime().nullable().default(null),
  etiquettes: z.array(z.string().trim().max(40)).max(8).default([]),
  ordre: z.number().int().min(0).max(9999).default(0),
  contenu_id: z.string().uuid().nullable().default(null),
  fiche_id: z.string().uuid().nullable().default(null),
  prompt_id: z.string().uuid().nullable().default(null),
});

export const saveTache = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TacheInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...champs } = data;
    const avecFin = {
      ...champs,
      termine_le: champs.statut === "termine" ? new Date().toISOString() : null,
    };

    if (id) {
      const { error } = await supabaseAdmin
        .from("taches")
        .update(avecFin)
        .eq("id", id)
        .eq("user_id", COMPTE_ID);
      if (error) throw erreurBase("projets", error);
      return { id };
    }

    const { data: cree, error } = await supabaseAdmin
      .from("taches")
      .insert({ ...avecFin, user_id: COMPTE_ID })
      .select("id")
      .single();
    if (error) throw erreurBase("projets", error);
    return { id: cree.id as string };
  });

export const listTaches = createServerFn({ method: "GET" }).handler(
  async (): Promise<TacheRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("taches")
      .select(COLONNES_TACHE)
      .eq("user_id", COMPTE_ID)
      .order("ordre", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(2000);
    if (error) throw erreurBase("projets", error);
    return (data ?? []) as unknown as TacheRow[];
  },
);

export const changerStatutTache = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        statut: z.enum(STATUT_TACHE_VALUES),
        ordre: z.number().int().min(0).max(9999).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("taches")
      .update({
        statut: data.statut,
        termine_le: data.statut === "termine" ? new Date().toISOString() : null,
        ...(data.ordre === undefined ? {} : { ordre: data.ordre }),
      })
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("projets", error);
    return { ok: true };
  });

export const deleteTache = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("taches")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("projets", error);
    return { ok: true };
  });

/* ---------------------------------------------------------------- Mario / IA */

const DecoupageInput = z.object({
  objectif: z.string().trim().min(5).max(2000),
  contexte: z.string().trim().max(2000).default(""),
  projet_id: z.string().uuid().nullable().default(null),
});

export const decouperAvecMario = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DecoupageInput.parse(input))
  .handler(async ({ data }) => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("projets:decouper", 6, 60_000);

    const { decouperObjectif } = await import("@/lib/projets.server");
    return decouperObjectif({ objectif: data.objectif, contexte: data.contexte });
  });

const AjoutLotInput = z.object({
  projet_id: z.string().uuid().nullable().default(null),
  taches: z
    .array(
      z.object({
        titre: z.string().trim().min(1).max(200),
        note: z.string().max(4000).default(""),
        priorite: z.number().int().min(0).max(3).default(0),
        echeance: z.string().datetime().nullable().default(null),
        sous_taches: z.array(z.string().trim().min(1).max(200)).max(5).default([]),
      }),
    )
    .min(1)
    .max(12),
});

export const ajouterTachesEnLot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AjoutLotInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: crees, error } = await supabaseAdmin
      .from("taches")
      .insert(
        data.taches.map((tache, index) => ({
          user_id: COMPTE_ID,
          projet_id: data.projet_id,
          titre: tache.titre,
          note: tache.note,
          priorite: tache.priorite,
          echeance: tache.echeance,
          ordre: index,
        })),
      )
      .select("id");
    if (error) throw erreurBase("projets", error);

    const sous = (crees ?? []).flatMap((parent, index) =>
      (data.taches[index]?.sous_taches ?? []).map((titre, rang) => ({
        user_id: COMPTE_ID,
        projet_id: data.projet_id,
        parent_id: parent.id as string,
        titre,
        ordre: rang,
      })),
    );

    if (sous.length > 0) {
      const { error: erreurSous } = await supabaseAdmin.from("taches").insert(sous);
      if (erreurSous) throw erreurBase("projets", erreurSous);
    }

    return { ajoutees: (crees ?? []).length + sous.length };
  });
