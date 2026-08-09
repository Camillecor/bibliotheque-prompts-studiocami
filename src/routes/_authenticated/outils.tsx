import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout passthrough : /outils rend outils.index.tsx (liste), /outils/$slug
// rend outils.$slug.tsx (fiche détail) — chaque route enfant gère son propre
// AppShell, ce fichier ne fait que router vers le bon enfant via <Outlet />.
export const Route = createFileRoute("/_authenticated/outils")({
  component: () => <Outlet />,
});
