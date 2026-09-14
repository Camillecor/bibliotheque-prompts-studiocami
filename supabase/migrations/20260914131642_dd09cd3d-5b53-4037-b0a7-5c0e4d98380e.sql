CREATE TABLE public.veille_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  nom text NOT NULL,
  url text NOT NULL,
  actif boolean NOT NULL DEFAULT true,
  derniere_lecture timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veille_sources TO authenticated;
GRANT ALL ON public.veille_sources TO service_role;
ALTER TABLE public.veille_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own veille_sources" ON public.veille_sources FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER veille_sources_set_updated_at BEFORE UPDATE ON public.veille_sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE UNIQUE INDEX veille_sources_user_url_idx ON public.veille_sources (user_id, url);

CREATE TABLE public.veille_themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  libelle text NOT NULL,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veille_themes TO authenticated;
GRANT ALL ON public.veille_themes TO service_role;
ALTER TABLE public.veille_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own veille_themes" ON public.veille_themes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER veille_themes_set_updated_at BEFORE UPDATE ON public.veille_themes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.veille_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  titre text NOT NULL,
  resume text NOT NULL DEFAULT '',
  url text NOT NULL,
  source text NOT NULL DEFAULT '',
  publie_le timestamp with time zone,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  favori boolean NOT NULL DEFAULT false,
  origine text NOT NULL DEFAULT 'rss',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veille_items TO authenticated;
GRANT ALL ON public.veille_items TO service_role;
ALTER TABLE public.veille_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own veille_items" ON public.veille_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER veille_items_set_updated_at BEFORE UPDATE ON public.veille_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE UNIQUE INDEX veille_items_user_url_idx ON public.veille_items (user_id, url);
CREATE INDEX veille_items_created_idx ON public.veille_items (user_id, created_at DESC);

CREATE TABLE public.veille_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  demarre_le timestamp with time zone NOT NULL DEFAULT now(),
  termine_le timestamp with time zone,
  statut text NOT NULL DEFAULT 'en_cours',
  nb_items integer NOT NULL DEFAULT 0,
  message text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veille_runs TO authenticated;
GRANT ALL ON public.veille_runs TO service_role;
ALTER TABLE public.veille_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own veille_runs" ON public.veille_runs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER veille_runs_set_updated_at BEFORE UPDATE ON public.veille_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX veille_runs_user_idx ON public.veille_runs (user_id, demarre_le DESC);

INSERT INTO public.veille_sources (user_id, nom, url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Le Monde Informatique - IA', 'https://www.lemondeinformatique.fr/flux-rss/thematique/intelligence-artificielle/rss.xml'),
  ('00000000-0000-0000-0000-000000000001', 'MIT Technology Review - AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed'),
  ('00000000-0000-0000-0000-000000000001', 'OpenAI News', 'https://openai.com/news/rss.xml'),
  ('00000000-0000-0000-0000-000000000001', 'Google AI Blog', 'https://blog.google/technology/ai/rss/'),
  ('00000000-0000-0000-0000-000000000001', 'TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/');

INSERT INTO public.veille_themes (user_id, libelle) VALUES
  ('00000000-0000-0000-0000-000000000001', 'IA générative'),
  ('00000000-0000-0000-0000-000000000001', 'nouveaux outils IA'),
  ('00000000-0000-0000-0000-000000000001', 'automatisation'),
  ('00000000-0000-0000-0000-000000000001', 'marketing digital');