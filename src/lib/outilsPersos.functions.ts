import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COMPTE_ID } from "@/lib/compte";
import { erreurBase } from "@/lib/erreurs";

// Outils ajoutés manuellement par l'utilisatrice depuis l'onglet Outils.
// Même schéma d'auth temporaire que mario.functions.ts (COMPTE_ID) — à
// remplacer par context.userId quand l'authentification sera réactivée.

export type OutilPersoRow = {
  id: string;
  nom: string;
  slug: string;
  definition: string;
  prix: "gratuit" | "freemium" | "payant";
  categorie: string;
  created_at: string;
};

const SaveInput = z.object({
  nom: z.string().min(1),
  slug: z.string().min(1),
  definition: z.string().min(1),
  prix: z.enum(["gratuit", "freemium", "payant"]),
  categorie: z.string().min(1),
});

export const saveOutilPerso = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data }): Promise<OutilPersoRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("outils_persos")
      .insert({ ...data, user_id: COMPTE_ID })
      .select("id, nom, slug, definition, prix, categorie, created_at")
      .single();

    if (error) throw erreurBase("outils", error);
    return row as OutilPersoRow;
  });

export const listOutilsPersos = createServerFn({ method: "GET" }).handler(
  async (): Promise<OutilPersoRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("outils_persos")
      .select("id, nom, slug, definition, prix, categorie, created_at")
      .eq("user_id", COMPTE_ID)
      .order("created_at", { ascending: false });

    if (error) throw erreurBase("outils", error);
    return (data ?? []) as OutilPersoRow[];
  },
);

export const deleteOutilPerso = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("outils_persos")
      .delete()
      .eq("id", data.id)
      .eq("user_id", COMPTE_ID);
    if (error) throw erreurBase("outils", error);
    return { ok: true };
  });
