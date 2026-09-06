CREATE TABLE public.projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nom text NOT NULL,
  couleur text NOT NULL DEFAULT '#ff6b35',
  icone text NOT NULL DEFAULT 'folder',
  ordre integer NOT NULL DEFAULT 0,
  archive boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projets TO authenticated;
GRANT ALL ON public.projets TO service_role;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projets" ON public.projets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.taches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  projet_id uuid REFERENCES public.projets(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.taches(id) ON DELETE CASCADE,
  titre text NOT NULL,
  note text NOT NULL DEFAULT '',
  statut text NOT NULL DEFAULT 'a_faire',
  priorite integer NOT NULL DEFAULT 0,
  echeance timestamptz,
  etiquettes text[] NOT NULL DEFAULT '{}'::text[],
  ordre integer NOT NULL DEFAULT 0,
  termine_le timestamptz,
  contenu_id uuid REFERENCES public.contenus(id) ON DELETE SET NULL,
  fiche_id uuid REFERENCES public.fiches(id) ON DELETE SET NULL,
  prompt_id uuid REFERENCES public.prompts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.taches TO authenticated;
GRANT ALL ON public.taches TO service_role;
ALTER TABLE public.taches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own taches" ON public.taches FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX taches_projet_id_idx ON public.taches (projet_id);
CREATE INDEX taches_parent_id_idx ON public.taches (parent_id);
CREATE INDEX taches_echeance_idx ON public.taches (echeance);

CREATE TRIGGER projets_set_updated_at BEFORE UPDATE ON public.projets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER taches_set_updated_at BEFORE UPDATE ON public.taches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();