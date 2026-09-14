import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";
import { limiterDebit } from "@/lib/securite.server";
import type {
  VeilleItemRow,
  VeilleRunRow,
  VeilleSourceRow,
  VeilleThemeRow,
} from "@/lib/veille";

// Application mono-compte : le filtrage sur COMPTE_ID est fait côté serveur
// uniquement, jamais d'après une valeur du navigateur.

const COLONNES_ITEM =
  "id, titre, resume, url, source, publie_le, tags, favori, origine, created_at";
const COLONNES_SOURCE = "id, nom, url, actif, derniere_lecture";
const COLONNES_THEME = "id, libelle, actif";
const COLONNES_RUN = "id, demarre_le, termine_le, statut, nb_items, message";

/* ------------------------------------------------------------------ lecture */

export const listVeilleItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<VeilleItemRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("veille_items")
      .select(COLONNES_ITEM)
      .eq("user_id", COMPTE_ID)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw erreurBase("veille", error);
    return (data ?? []) as VeilleItemRow[];
  },
);

export const listVeilleSources = createServerFn({ method: "GET" }).handler(
  async (): Promise<VeilleSourceRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("veille_sources")
      .select(COLONNES_SOURCE)
      .eq("user_id", COMPTE_ID)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw erreurBase("veille", error);
    return (data ?? []) as VeilleSourceRow[];
  },
);

export const listVeilleThemes = createServerFn({ method: "GET" }).handler(
  async (): Promise<VeilleThemeRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("veille_themes")
      .select(COLONNES_THEME)
      .eq("user_id", COMPTE_ID)
      .order("created_at", { ascending: true })
      .limit(30);
    if (error) throw erreurBase("veille", error);
    return (data ?? []) as VeilleThemeRow[];
  },
);

export const dernierRunVeille = createServerFn({ method: "GET" }).handler(
  async (): Promise<VeilleRunRow | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("veille_runs")
      .select(COLONNES_RUN)
      .eq("user_id", COMPTE_ID)
      .order("demarre_le", { ascending: false })
      .limit(1);
    if (error) throw erreurBase("veille", error);
    return ((data ?? [])[0] as VeilleRunRow | undefined) ?? null;
  },
);

/* ------------------------------------------------------------------ sources */

const SourceInput = z.object({
  id: z.string().uuid().optional(),
  nom: z.string().trim().min(1).max(80),
  url: z
    .string()
    .trim()
    .max(500)
    .refine((valeur) => /^https?:\/\//i.test(valeur), "Adresse de flux invalide."),
  actif: z.boolean().default(true),
});

export const saveVeilleSource = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SourceInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...champs } = data;

    if (id) {
      const { error } = await supabaseAdmin
        .from("veille_sources")
        .update(champs)
        .eq("id", id)
        .eq("user_id", COMPTE_ID);
      if (error) throw erreurBase("veille", error);
      return { id };
    }

    const { data: cree, error } = await supabaseAdmin
      .from("veille_sources")
      .insert({ ...champs, user_id: COMPTE_ID })
      .select("id")
      .single();
    if (error) throw erreurBase("veille", error);
    return { id: cree.id };
  });

export const deleteVeilleSource = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("veille_sources")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("veille", error);
    return { ok: true };
  });

/* ------------------------------------------------------------------ thèmes */

const ThemeInput = z.object({
  id: z.string().uuid().optional(),
  libelle: z.string().trim().min(2).max(60),
  actif: z.boolean().default(true),
});

export const saveVeilleTheme = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ThemeInput.parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...champs } = data;

    if (id) {
      const { error } = await supabaseAdmin
        .from("veille_themes")
        .update(champs)
        .eq("id", id)
        .eq("user_id", COMPTE_ID);
      if (error) throw erreurBase("veille", error);
      return { id };
    }

    const { data: cree, error } = await supabaseAdmin
      .from("veille_themes")
      .insert({ ...champs, user_id: COMPTE_ID })
      .select("id")
      .single();
    if (error) throw erreurBase("veille", error);
    return { id: cree.id };
  });

export const deleteVeilleTheme = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("veille_themes")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("veille", error);
    return { ok: true };
  });

/* ------------------------------------------------------------------ actions */

export const toggleFavoriVeille = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), favori: z.boolean() }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("veille_items")
      .update({ favori: data.favori })
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("veille", error);
    return { ok: true };
  });

export const deleteVeilleItem = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("veille_items")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("veille", error);
    return { ok: true };
  });

export const lancerVeille = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ statut: string; nb_items: number; message: string }> => {
    limiterDebit("veille:lancer", 3, 60_000);
    const { executerVeille } = await import("@/lib/veille.server");
    return executerVeille(COMPTE_ID);
  },
);
