CREATE TABLE public.veille_config (
  cle text NOT NULL PRIMARY KEY,
  valeur text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT ALL ON public.veille_config TO service_role;
ALTER TABLE public.veille_config ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA cron TO postgres;

SELECT cron.schedule(
  'veille-quotidienne',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--123c9a16-9332-4cec-99c5-aef31ebacb7a.lovable.app/api/public/veille-cron',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-veille-secret', (SELECT valeur FROM public.veille_config WHERE cle = 'cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);