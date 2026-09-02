import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MarioResult, PromptRow } from "@/lib/mario";
import type { SuggestionIdee } from "@/lib/mario.server";
import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";

// Application mono-compte, sans authentification : toutes les requêtes sont
// filtrées sur COMPTE_ID côté serveur et cet identifiant n'est jamais accepté
// depuis le navigateur. Les entrées sont bornées pour éviter les charges utiles
// abusives, et les appels IA sont limités en débit (voir securite.server.ts).
const GenerateInput = z.object({
  idee: z.string().trim().min(5, "Décris ton idée en quelques mots de plus.").max(4000),
  motsCles: z.string().trim().max(500).default(""),
  metier: z.string().trim().max(120).default(""),
  modele: z.enum(["claude-sonnet-5", "claude-haiku-4-5"]).default("claude-sonnet-5"),
  typePrompt: z.string().trim().max(80).default(""),
  ton: z.string().trim().max(80).default(""),
  autresInstructions: z.string().trim().max(4000).default(""),
  image: z
    .object({
      mediaType: z.enum(["image/png", "image/jpeg"]),
      // ~5 Mo binaires : large pour une vraie photo, bloque les charges absurdes.
      base64: z
        .string()
        .max(7_000_000)
        .regex(/^[A-Za-z0-9+/=\r\n]+$/, "Image invalide."),
    })
    .optional(),
});


export const generateMarioPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<MarioResult> => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("mario:generer", 10, 60_000);

    const { callAnthropicMario } = await import("@/lib/mario.server");
    return callAnthropicMario(data);
  });

const QuestionsInput = z.object({
  idee: z.string().trim().min(5).max(4000),
  motsCles: z.string().trim().max(500).default(""),
  metier: z.string().trim().max(120).default(""),
  typePrompt: z.string().trim().max(80).default(""),
  ton: z.string().trim().max(80).default(""),
});


export const poserQuestionsMario = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuestionsInput.parse(input))
  .handler(async ({ data }): Promise<{ questions: string[] }> => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("mario:questions", 20, 60_000);

    const { callAnthropicQuestions } = await import("@/lib/mario.server");
    return callAnthropicQuestions(data);
  });

const SuggestionsInput = z.object({
  historique: z
    .array(
      z.object({
        titre: z.string().trim().max(160),
        metier: z.string().trim().max(120),
        type_prompt: z.string().trim().max(80).default(""),
        mots_cles: z.array(z.string().trim().max(60)).max(12).default([]),
      }),
    )
    .max(20),
});

export const suggererIdeesMario = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SuggestionsInput.parse(input))
  .handler(async ({ data }): Promise<{ suggestions: SuggestionIdee[] }> => {
    const { limiterDebit } = await import("@/lib/securite.server");
    limiterDebit("mario:suggestions", 10, 60_000);

    const { callAnthropicSuggestions } = await import("@/lib/mario.server");
    return callAnthropicSuggestions(data.historique);
  });

const SaveInput = z.object({
  titre: z.string().trim().min(1).max(160),
  metier: z.string().trim().min(1).max(120),
  type_prompt: z.string().trim().max(80).default("standard"),
  mots_cles: z.array(z.string().trim().max(60)).max(12).default([]),
  complexite: z.string().trim().min(1).max(40),
  prompt: z.string().max(100_000),
  note: z.string().max(20_000).default(""),
  etapes_lancement: z.array(z.string().max(2000)).max(20).default([]),
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
