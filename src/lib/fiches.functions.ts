import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ImageSchema = z.object({
  mediaType: z.enum(["image/png", "image/jpeg"]),
  base64: z
    .string()
    .max(7_000_000)
    .regex(/^[A-Za-z0-9+/=\r\n]+$/, "Image invalide."),
});

// Lien : uniquement http(s), longueur bornée (bloque javascript: et data:)
const LienSchema = z
  .string()
  .trim()
  .max(2048)
  .default("")
  .refine(
    (v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v),
    "Le lien doit commencer par http:// ou https://.",
  );

const FicheInputSchema = z.object({
  description: z.string().trim().max(8000).default(""),
  lien: LienSchema,
  images: z.array(ImageSchema).max(4).default([]),
});

export const genererFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FicheInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ markdown: string }> => {
    const { callAnthropicFiche } = await import("@/lib/fiches.server");
    return callAnthropicFiche(data);
  });

const AmeliorerInput = z.object({
  markdown: z.string().min(1).max(200_000),
  consigne: z.string().trim().max(2000).default(""),
});

export const ameliorerFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AmeliorerInput.parse(input))
  .handler(async ({ data }): Promise<{ markdown: string }> => {
    const { callAnthropicAmelioration } = await import("@/lib/fiches.server");
    return callAnthropicAmelioration(data);
  });

// Sauvegarde/historique des fiches générées. Même schéma d'auth temporaire
// que mario.functions.ts et outilsPersos.functions.ts (TEST_USER_ID) — à
// remplacer par context.userId quand l'authentification sera réactivée.
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

export type FicheRow = {
  id: string;
  titre: string;
  description: string;
  lien: string;
  markdown: string;
  created_at: string;
};

const COLONNES = "id, titre, description, lien, markdown, created_at";

const SaveFicheInput = z.object({
  id: z.string().uuid().optional(),
  titre: z.string().trim().min(1, "Le titre est obligatoire.").max(120),
  description: z.string().trim().max(8000).default(""),
  lien: LienSchema,
  markdown: z.string().min(1).max(200_000),
});

export const saveFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SaveFicheInput.parse(input))
  .handler(async ({ data }): Promise<FicheRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...champs } = data;

    if (id) {
      const { data: row, error } = await supabaseAdmin
        .from("fiches")
        .update(champs)
        .eq("id", id)
        .eq("user_id", TEST_USER_ID)
        .select(COLONNES)
        .single();
      if (error) throw new Error(error.message);
      return row as FicheRow;
    }

    const { data: row, error } = await supabaseAdmin
      .from("fiches")
      .insert({ ...champs, user_id: TEST_USER_ID })
      .select(COLONNES)
      .single();

    if (error) throw new Error(error.message);
    return row as FicheRow;
  });

export const listFiches = createServerFn({ method: "GET" }).handler(
  async (): Promise<FicheRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("fiches")
      .select(COLONNES)
      .eq("user_id", TEST_USER_ID)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return (data ?? []) as FicheRow[];
  },
);

export const deleteFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("fiches")
      .delete()
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
