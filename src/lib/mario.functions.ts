import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MarioResult, PromptRow } from "@/lib/mario";

// TEMPORAIRE : connexion désactivée pour les tests (demande du 2026-08-03).
// Toutes les fonctions ci-dessous utilisent supabaseAdmin (service role, contourne le RLS)
// avec cet utilisateur fictif au lieu de l'utilisateur authentifié réel.
// À l'issue des tests : réintroduire `.middleware([requireSupabaseAuth])` et
// remplacer TEST_USER_ID par context.userId partout ci-dessous.
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

// 5 Mo max en binaire ≈ 6,99M caractères en base64 — plafond large pour laisser
// passer une vraie image de 5 Mo tout en bloquant les payloads absurdes en amont.
const GenerateInput = z.object({
  idee: z.string().min(5, "Décris ton idée en quelques mots de plus."),
  motsCles: z.string().default(""),
  metier: z.string().default(""),
  modele: z.enum(["claude-sonnet-5", "claude-haiku-4-5"]).default("claude-sonnet-5"),
  typePrompt: z.string().default(""),
  ton: z.string().default(""),
  autresInstructions: z.string().default(""),
  image: z
    .object({
      mediaType: z.enum(["image/png", "image/jpeg"]),
      base64: z.string().max(7_000_000),
    })
    .optional(),
});

export const generateMarioPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<MarioResult> => {
    const { callAnthropicMario } = await import("@/lib/mario.server");
    return callAnthropicMario(data);
  });

const SaveInput = z.object({
  titre: z.string().min(1),
  metier: z.string().min(1),
  type_prompt: z.string().default("standard"),
  mots_cles: z.array(z.string()).default([]),
  complexite: z.string().min(1),
  prompt: z.string(),
  note: z.string().default(""),
  etapes_lancement: z.array(z.string()).default([]),
  alerte_pii: z.boolean().default(false),
  idee_source: z.string().default(""),
  date_ajout: z.string().datetime().optional(),
});


export const savePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { date_ajout, ...rest } = data;
    const { data: row, error } = await supabaseAdmin
      .from("prompts")
      .insert({ ...rest, user_id: TEST_USER_ID, ...(date_ajout ? { date_ajout } : {}) })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const listPrompts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PromptRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("prompts")
      .select(
        "id, titre, metier, type_prompt, mots_cles, complexite, prompt, note, etapes_lancement, alerte_pii, favori, date_ajout",
      )
      .eq("user_id", TEST_USER_ID)
      .order("date_ajout", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as PromptRow[];
  },
);

export const deletePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("prompts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleFavori = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), favori: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("prompts")
      .update({ favori: data.favori })
      .eq("id", data.id)
      .eq("user_id", TEST_USER_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
