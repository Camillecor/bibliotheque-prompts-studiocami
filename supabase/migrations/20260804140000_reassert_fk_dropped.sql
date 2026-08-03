-- Le prompt du 2026-08-03 a déjà retiré cette contrainte, mais l'erreur
-- "violates foreign key constraint prompts_user_id_fkey" reçue le 2026-08-04
-- montre qu'elle est encore active en base : cette migration réaffirme la
-- suppression de façon idempotente pour forcer la convergence.
--
-- À restaurer avant de remettre l'authentification en place :
--   ALTER TABLE public.prompts
--     ADD CONSTRAINT prompts_user_id_fkey
--     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prompts DROP CONSTRAINT IF EXISTS prompts_user_id_fkey;
