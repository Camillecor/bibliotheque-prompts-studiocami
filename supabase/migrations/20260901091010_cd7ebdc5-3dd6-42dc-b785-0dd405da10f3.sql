CREATE TABLE public.contenus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  titre text NOT NULL DEFAULT '',
  texte text NOT NULL DEFAULT '',
  reseau text NOT NULL DEFAULT 'linkedin',
  statut text NOT NULL DEFAULT 'brouillon',
  tags text[] NOT NULL DEFAULT '{}'::text[],
  date_planifiee timestamptz,
  date_publication timestamptz,
  prompt_id uuid REFERENCES public.prompts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contenus TO authenticated;
GRANT ALL ON public.contenus TO service_role;
ALTER TABLE public.contenus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own contenus" ON public.contenus FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX contenus_user_date_idx ON public.contenus (user_id, date_planifiee);

CREATE TABLE public.medias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  chemin text NOT NULL,
  titre text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}'::text[],
  largeur integer NOT NULL DEFAULT 0,
  hauteur integer NOT NULL DEFAULT 0,
  origine text NOT NULL DEFAULT 'upload',
  media_parent_id uuid REFERENCES public.medias(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.medias TO authenticated;
GRANT ALL ON public.medias TO service_role;
ALTER TABLE public.medias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own medias" ON public.medias FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX medias_user_created_idx ON public.medias (user_id, created_at DESC);

CREATE TABLE public.contenu_medias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contenu_id uuid NOT NULL REFERENCES public.contenus(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES public.medias(id) ON DELETE CASCADE,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contenu_id, media_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contenu_medias TO authenticated;
GRANT ALL ON public.contenu_medias TO service_role;
ALTER TABLE public.contenu_medias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own contenu_medias" ON public.contenu_medias FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER contenus_set_updated_at
BEFORE UPDATE ON public.contenus
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();