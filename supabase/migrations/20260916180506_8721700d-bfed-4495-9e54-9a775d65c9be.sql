CREATE TABLE public.creations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  nom text NOT NULL DEFAULT 'Sans titre',
  format text NOT NULL DEFAULT '1:1',
  largeur integer NOT NULL DEFAULT 1080,
  hauteur integer NOT NULL DEFAULT 1080,
  document jsonb NOT NULL DEFAULT '{"v":1}'::jsonb,
  apercu text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX creations_user_id_updated_at_idx ON public.creations (user_id, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.creations TO authenticated;
GRANT ALL ON public.creations TO service_role;

ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own creations"
ON public.creations FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER creations_set_updated_at
BEFORE UPDATE ON public.creations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();