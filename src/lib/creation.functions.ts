import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";
import type { CreationComplete, CreationRow, DocumentCreation } from "@/lib/creation";
import type { Json } from "@/integrations/supabase/types";

// Application mono-compte : le filtrage sur COMPTE_ID est fait côté serveur
// uniquement, jamais d'après une valeur venue du navigateur.

const COLONNES = "id, nom, format, largeur, hauteur, apercu, created_at, updated_at";

const Base = z.object({
  id: z.string().uuid(),
  x: z.number(),
  y: z.number(),
  l: z.number(),
  h: z.number(),
  rotation: z.number(),
  opacite: z.number().min(0).max(1),
  verrouille: z.boolean(),
});

const CalqueSchema = z.union([
  Base.extend({
    type: z.literal("texte"),
    texte: z.string().max(4000),
    police: z.string().max(60),
    taille: z.number(),
    graisse: z.number(),
    italique: z.boolean(),
    souligne: z.boolean(),
    couleur: z.string().max(40),
    align: z.enum(["left", "center", "right"]),
    interligne: z.number(),
    interlettre: z.number(),
    ombre: z.boolean(),
    fondTexte: z.string().max(40).nullable(),
  }),
  Base.extend({
    type: z.literal("image"),
    url: z.string().max(3_000_000),
    arrondi: z.number(),
    retourne: z.boolean(),
    ajustement: z.enum(["cover", "contain"]),
  }),
  Base.extend({
    type: z.literal("forme"),
    forme: z.enum(["rect", "cercle", "trait"]),
    couleur: z.string().max(40),
    contour: z.string().max(40).nullable(),
    epaisseurContour: z.number(),
    arrondi: z.number(),
  }),
]);

const DocumentSchema = z.object({
  v: z.literal(1),
  fond: z.union([
    z.object({ type: z.literal("couleur"), couleur: z.string().max(40) }),
    z.object({
      type: z.literal("degrade"),
      de: z.string().max(40),
      vers: z.string().max(40),
      angle: z.number(),
    }),
    z.object({
      type: z.literal("image"),
      url: z.string().max(3_000_000),
      voile: z.number().min(0).max(1),
      voileCouleur: z.string().max(40),
    }),
  ]),
  calques: z.array(CalqueSchema).max(80),
});

export const listCreations = createServerFn({ method: "GET" }).handler(
  async (): Promise<CreationRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("creations")
      .select(COLONNES)
      .eq("user_id", COMPTE_ID)
      .order("updated_at", { ascending: false })
      .limit(300);
    if (error) throw erreurBase("creation", error);
    return (data ?? []) as unknown as CreationRow[];
  },
);

export const getCreation = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data: entree }): Promise<CreationComplete> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("creations")
      .select(`${COLONNES}, document`)
      .eq("id", entree.id)
      .eq("user_id", COMPTE_ID)
      .maybeSingle();
    if (error) throw erreurBase("creation", error);
    if (!data) throw Object.assign(new Error("Création introuvable."), { statusCode: 404 });
    return data as unknown as CreationComplete;
  });

const CreerInput = z.object({
  nom: z.string().trim().max(120).default("Sans titre"),
  format: z.string().trim().max(40).default("1:1"),
  largeur: z.number().int().min(100).max(5000),
  hauteur: z.number().int().min(100).max(5000),
  document: DocumentSchema,
});

export const createCreation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CreerInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("creation:creer", 60, 60_000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("creations")
      .insert({ ...data, document: data.document as unknown as Json, user_id: COMPTE_ID })
      .select("id")
      .single();
    if (error) throw erreurBase("creation", error);
    return { id: row.id as string };
  });

const SauverInput = z.object({
  id: z.string().uuid(),
  nom: z.string().trim().max(120).optional(),
  document: DocumentSchema.optional(),
  apercu: z.string().max(2_000_000).optional(),
});

export const saveCreation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SauverInput.parse(input))
  .handler(async ({ data }) => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("creation:sauver", 120, 60_000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, nom, document, apercu } = data;
    const champs: { nom?: string; document?: Json; apercu?: string } = {};
    if (nom !== undefined) champs.nom = nom;
    if (document !== undefined) champs.document = document as unknown as Json;
    if (apercu !== undefined) champs.apercu = apercu;
    const { error } = await supabaseAdmin
      .from("creations")
      .update(champs)
      .eq("id", id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("creation", error);
    return { ok: true };
  });

export const renameCreation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), nom: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("creations")
      .update({ nom: data.nom })
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("creation", error);
    return { ok: true };
  });

export const duplicateCreation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: source, error } = await supabaseAdmin
      .from("creations")
      .select("nom, format, largeur, hauteur, document, apercu")
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID)
      .maybeSingle();
    if (error) throw erreurBase("creation", error);
    if (!source) throw Object.assign(new Error("Création introuvable."), { statusCode: 404 });

    const { data: row, error: erreurInsert } = await supabaseAdmin
      .from("creations")
      .insert({
        ...source,
        nom: `${String(source.nom).slice(0, 100)} (copie)`,
        user_id: COMPTE_ID,
      })
      .select("id")
      .single();
    if (erreurInsert) throw erreurBase("creation", erreurInsert);
    return { id: row.id as string };
  });

export const deleteCreation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("creations")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("creation", error);
    return { ok: true };
  });

export type { DocumentCreation };
