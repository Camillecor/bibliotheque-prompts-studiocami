import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FicheInputSchema = z.object({
  description: z.string().default(""),
  lien: z.string().default(""),
  image: z
    .object({
      mediaType: z.enum(["image/png", "image/jpeg"]),
      base64: z.string().max(7_000_000),
    })
    .optional(),
});

export const genererFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FicheInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ markdown: string }> => {
    const { callAnthropicFiche } = await import("@/lib/fiches.server");
    return callAnthropicFiche(data);
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

const SaveFicheInput = z.object({
  titre: z.string().min(1),
  description: z.string().default(""),
  lien: z.string().default(""),
  markdown: z.string().min(1),
});

export const saveFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SaveFicheInput.parse(input))
  .handler(async ({ data }): Promise<FicheRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("fiches")
      .insert({ ...data, user_id: TEST_USER_ID })
      .select("id, titre, description, lien, markdown, created_at")
      .single();

    if (error) throw new Error(error.message);
    return row as FicheRow;
  });

export const listFiches = createServerFn({ method: "GET" }).handler(
  async (): Promise<FicheRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("fiches")
      .select("id, titre, description, lien, markdown, created_at")
      .eq("user_id", TEST_USER_ID)
      .order("created_at", { ascending: false });

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
