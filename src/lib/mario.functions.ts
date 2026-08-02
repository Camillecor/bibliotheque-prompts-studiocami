import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { MarioResult, PromptRow } from "@/lib/mario";

const GenerateInput = z.object({
  idee: z.string().min(5, "Décris ton idée en quelques mots de plus."),
  motsCles: z.string().default(""),
  metier: z.string().default(""),
  modele: z.enum(["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"]).default("claude-opus-5"),
});

export const generateMarioPrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
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
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("prompts")
      .insert({ ...data, user_id: context.userId })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const listPrompts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PromptRow[]> => {
    const { data, error } = await context.supabase
      .from("prompts")
      .select(
        "id, titre, metier, mots_cles, complexite, version_1, version_2, etapes_lancement, alerte_pii, date_ajout",
      )
      .order("date_ajout", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as PromptRow[];
  });

export const deletePrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("prompts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
