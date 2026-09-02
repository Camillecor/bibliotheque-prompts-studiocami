import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MarioResult, PromptRow } from "@/lib/mario";
import type { SuggestionIdee } from "@/lib/mario.server";
import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";

// TEMPORAIRE : connexion désactivée pour les tests (demande du 2026-08-03).
// Toutes les fonctions ci-dessous utilisent supabaseAdmin (service role, contourne le RLS)
// avec cet utilisateur fictif au lieu de l'utilisateur authentifié réel.
// À l'issue des tests : réintroduire `.middleware([requireSupabaseAuth])` et
// remplacer COMPTE_ID par context.userId partout ci-dessous.

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

const QuestionsInput = z.object({
  idee: z.string().min(5),
  motsCles: z.string().default(""),
  metier: z.string().default(""),
  typePrompt: z.string().default(""),
  ton: z.string().default(""),
});

export const poserQuestionsMario = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuestionsInput.parse(input))
  .handler(async ({ data }): Promise<{ questions: string[] }> => {
    const { callAnthropicQuestions } = await import("@/lib/mario.server");
    return callAnthropicQuestions(data);
  });

const SuggestionsInput = z.object({
  historique: z
    .array(
      z.object({
        titre: z.string(),
        metier: z.string(),
        type_prompt: z.string().default(""),
        mots_cles: z.array(z.string()).default([]),
      }),
    )
    .max(20),
});

export const suggererIdeesMario = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SuggestionsInput.parse(input))
  .handler(async ({ data }): Promise<{ suggestions: SuggestionIdee[] }> => {
    const { callAnthropicSuggestions } = await import("@/lib/mario.server");
    return callAnthropicSuggestions(data.historique);
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
      .insert({ ...rest, user_id: COMPTE_ID, ...(date_ajout ? { date_ajout } : {}) })
      .select("id")
      .single();

    if (error) throw erreurBase("mario", error);
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
      .eq("user_id", COMPTE_ID)
      .order("date_ajout", { ascending: false });

    if (error) throw erreurBase("mario", error);
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
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("mario", error);
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
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("mario", error);
    return { ok: true };
  });
