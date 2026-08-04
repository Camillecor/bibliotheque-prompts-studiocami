import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Library, Plus } from "lucide-react";
import { listPrompts } from "@/lib/mario.functions";
import logoAsset from "@/assets/studio-cami-logo.svg.asset.json";

// Précharge silencieusement la bibliothèque dès qu'on est sur l'app (peu importe l'écran),
// pour que le clic sur "Bibliothèque" retrouve les données déjà en cache React Query
// au lieu de déclencher un aller-retour réseau à ce moment-là. Ne rend rien à l'écran.
function PrechargementBibliotheque() {
  const fetchPrompts = useServerFn(listPrompts);
  useQuery({ queryKey: ["prompts"], queryFn: () => fetchPrompts() });
  return null;
}

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
      <PrechargementBibliotheque />
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-4 bg-transparent px-4 lg:h-16 lg:gap-6">
        {/* Flou progressif : maximal en haut de la navbar, nul sous celle-ci
            pour fondre doucement dans le contenu qui défile. Le calque dépasse
            la hauteur de la navbar (h-[120px]) et est masqué par un dégradé
            vertical : opaque jusqu'à ~47% (bas de la navbar), puis transparent. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[120px]"
          style={{
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 47%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 47%, transparent 100%)",
          }}
        />
        <Link
          to="/"
          aria-label="Studio Cami — accueil"
          className="flex shrink-0 items-center gap-2 transition duration-200 hover:opacity-80 lg:gap-3"
        >
          <img
            src="/mario-fox-head.png"
            alt=""
            className="h-8 w-8 object-contain lg:h-12 lg:w-12"
          />
          <img
            src={logoAsset.url}
            alt="Studio Cami"
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          <NavLink to="/" icon={Plus} label="Nouveau prompt" active={pathname === "/"} />
          <NavLink
            to="/bibliotheque"
            icon={Library}
            label="Bibliothèque"
            active={pathname.startsWith("/bibliotheque")}
          />
        </nav>
      </header>

      <main className="pt-14 lg:pt-16">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
