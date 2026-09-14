DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('veille-quotidienne') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'veille-quotidienne');

SELECT cron.schedule(
  'veille-quotidienne',
  '0 5 * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://project--123c9a16-9332-4cec-99c5-aef31ebacb7a.lovable.app/api/public/veille-cron',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-veille-secret', (SELECT valeur FROM public.veille_config WHERE cle = 'cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);