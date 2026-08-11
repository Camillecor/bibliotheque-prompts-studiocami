-- Fiches de reconstruction générées depuis l'onglet Fiches. Jusqu'ici la
-- fiche générée ne vivait que dans le useState de la page : changer d'onglet
-- ou rafraîchir la perdait définitivement, sans aucun historique. Cette table
-- permet de l'enregistrer explicitement, sur le même modèle que `prompts`.
--
-- Comme pour `prompts` et `outils_persos`, pas de contrainte FK vers
-- auth.users tant que l'authentification est désactivée pour les tests
-- (TEST_USER_ID) — voir 20260803150000_disable_auth_for_testing.sql.

CREATE TABLE public.fiches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titre TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  lien TEXT NOT NULL DEFAULT '',
  markdown TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fiches TO authenticated;
GRANT ALL ON public.fiches TO service_role;

ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own fiches"
  ON public.fiches FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX fiches_user_created_idx ON public.fiches (user_id, created_at DESC);
