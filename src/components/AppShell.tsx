import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Library, Plus } from "lucide-react";
import logoAsset from "@/assets/studio-cami-logo.svg.asset.json";

function NavLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof Library;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={[
        "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
        active
          ? "bg-secondary text-[var(--primary-dark)]"
          : "text-muted-foreground hover:bg-muted hover:text-primary",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-4 bg-transparent px-4 backdrop-blur-sm">
        <Link to="/" aria-label="Studio Cami — accueil" className="flex items-center gap-2">
          <img src="/mario-fox-head.png" alt="" className="h-8 w-8 rounded-full" />
          <img src={logoAsset.url} alt="Studio Cami" className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" icon={Plus} label="Nouveau prompt" active={pathname === "/"} />
          <NavLink
            to="/bibliotheque"
            icon={Library}
            label="Bibliothèque"
            active={pathname.startsWith("/bibliotheque")}
          />
        </nav>
      </header>

      <main className="pt-14">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
