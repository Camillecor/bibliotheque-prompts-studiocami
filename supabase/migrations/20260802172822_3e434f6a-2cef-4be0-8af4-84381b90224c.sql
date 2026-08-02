CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  titre TEXT NOT NULL,
  metier TEXT NOT NULL DEFAULT 'Autre',
  mots_cles TEXT[] NOT NULL DEFAULT '{}',
  complexite TEXT NOT NULL DEFAULT 'moyen',
  version_1 JSONB NOT NULL DEFAULT '{}'::jsonb,
  version_2 JSONB NOT NULL DEFAULT '{}'::jsonb,
  etapes_lancement JSONB NOT NULL DEFAULT '[]'::jsonb,
  alerte_pii BOOLEAN NOT NULL DEFAULT false,
  idee_source TEXT,
  date_ajout TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own prompts"
  ON public.prompts FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX prompts_user_date_idx ON public.prompts (user_id, date_ajout DESC);