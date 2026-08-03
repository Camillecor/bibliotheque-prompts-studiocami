-- TEMPORAIRE : connexion désactivée pour permettre de tester l'app sans compte (2026-08-03).
-- Le user_id fictif utilisé côté serveur (TEST_USER_ID dans mario.functions.ts) ne
-- correspond à aucune ligne réelle de auth.users, donc la contrainte FK doit sauter
-- le temps des tests.
--
-- À restaurer avant de remettre l'authentification en place :
--   ALTER TABLE public.prompts
--     ADD CONSTRAINT prompts_user_id_fkey
--     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prompts DROP CONSTRAINT IF EXISTS prompts_user_id_fkey;
