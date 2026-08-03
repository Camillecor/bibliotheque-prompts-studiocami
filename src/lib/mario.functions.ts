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
  modele: z.enum(["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"]).default("claude-opus-5"),
  typePrompt: z.string().default(""),
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
  mots_cles: z.array(z.string()).default([]),
  complexite: z.string().min(1),
  version_1: z.object({ prompt: z.string(), note: z.string() }),
  version_2: z.object({ prompt: z.string(), amelioration: z.string() }),
  etapes_lancement: z.array(z.string()).default([]),
  alerte_pii: z.boolean().default(false),
  idee_source: z.string().default(""),
});

export const savePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("prompts")
      .insert({ ...data, user_id: TEST_USER_ID })
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
        "id, titre, metier, mots_cles, complexite, version_1, version_2, etapes_lancement, alerte_pii, date_ajout",
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
