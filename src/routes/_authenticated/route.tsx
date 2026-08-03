import { createFileRoute, Outlet } from "@tanstack/react-router";

// TEMPORAIRE : garde de connexion désactivée pour les tests (2026-08-03).
// À restaurer avant de remettre l'authentification en place :
//   import { supabase } from "@/integrations/supabase/client";
//   beforeLoad: async () => {
//     const { data, error } = await supabase.auth.getUser();
//     if (error || !data.user) throw redirect({ to: "/auth" });
//     return { user: data.user };
//   },
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
