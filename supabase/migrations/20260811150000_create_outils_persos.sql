-- Outils ajoutés par l'utilisatrice depuis le formulaire "Ajouter un outil" de
-- l'onglet Outils. Remplace le stockage localStorage précédent (perdu au
-- changement de navigateur, jamais synchronisé) par une vraie table, sur le
-- même modèle que `prompts`.
--
-- Comme pour `prompts`, pas de contrainte FK vers auth.users tant que
-- l'authentification est désactivée pour les tests (TEST_USER_ID dans
-- src/lib/mario.functions.ts) — voir 20260803150000_disable_auth_for_testing.sql.
-- À ajouter en même temps que la FK de `prompts` sera restaurée :
--   ALTER TABLE public.outils_persos
--     ADD CONSTRAINT outils_persos_user_id_fkey
--     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE TABLE public.outils_persos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  slug TEXT NOT NULL,
  definition TEXT NOT NULL,
  prix TEXT NOT NULL DEFAULT 'freemium' CHECK (prix IN ('gratuit', 'freemium', 'payant')),
  categorie TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.outils_persos TO authenticated;
GRANT ALL ON public.outils_persos TO service_role;

ALTER TABLE public.outils_persos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own outils_persos"
  ON public.outils_persos FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX outils_persos_user_created_idx ON public.outils_persos (user_id, created_at DESC);
