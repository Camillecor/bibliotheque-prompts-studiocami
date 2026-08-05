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

function RailButton({
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
      aria-label={label}
      title={label}
      className={[
        "flex h-11 w-11 items-center justify-center rounded-full transition duration-200 hover:-translate-y-0.5",
        active
          ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(17,26,61,0.45)]"
          : "border border-border bg-card text-primary shadow-[0_1px_2px_rgba(17,26,61,0.06),0_8px_18px_-14px_rgba(17,26,61,0.35)]",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

/** Décor très subtil : quelques traits courbés en arrière-plan de la colonne centrale. */
function DecorLignes() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1200 800"
      fill="none"
    >
      <path
        d="M-50 180 C 250 60, 600 300, 1250 120"
        stroke="var(--info)"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M-50 460 C 300 340, 700 620, 1250 420"
        stroke="var(--info)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      <path
        d="M-50 700 C 350 620, 750 820, 1250 660"
        stroke="var(--info)"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function AppShell({ children, panel }: { children: ReactNode; panel?: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      <PrechargementBibliotheque />
      <DecorLignes />

      {/* Rail de navigation */}
      <aside className="z-10 flex w-[76px] shrink-0 flex-col items-center gap-6 border-r border-border bg-card py-5">
        <Link to="/" aria-label="Studio Cami — accueil" className="transition hover:opacity-80">
          <img src={logoAsset.url} alt="Studio Cami" className="w-12" />
        </Link>

        <nav className="flex flex-col items-center gap-3">
          <RailButton to="/" icon={Plus} label="Générateur" active={pathname === "/"} />
          <RailButton
            to="/bibliotheque"
            icon={Library}
            label="Bibliothèque"
            active={pathname.startsWith("/bibliotheque")}
          />
        </nav>
      </aside>

      {/* Contenu principal */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            "radial-gradient(1100px 700px at 12% 0%, color-mix(in srgb, var(--info) 12%, transparent), transparent 60%), radial-gradient(900px 650px at 90% 15%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 55%), radial-gradient(900px 700px at 50% 105%, color-mix(in srgb, var(--coral) 7%, transparent), transparent 60%)",
        }}
      >
        {children}
      </main>

      {/* Panneau contextuel */}
      {panel ? (
        <aside className="z-10 hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-card lg:block">
          {panel}
        </aside>
      ) : null}
    </div>
  );
}
