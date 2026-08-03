-- On passe d'un couple version_1/version_2 à un unique prompt final (déjà amélioré),
-- suite à la décision de ne plus proposer qu'une seule version optimisée à l'utilisateur.
ALTER TABLE public.prompts
  ADD COLUMN prompt TEXT NOT NULL DEFAULT '',
  ADD COLUMN note TEXT NOT NULL DEFAULT '';

ALTER TABLE public.prompts
  DROP COLUMN version_1,
  DROP COLUMN version_2;
