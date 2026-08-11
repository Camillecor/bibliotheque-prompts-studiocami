import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, FileText, Library, Menu, Plus, SlidersHorizontal, Wrench, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { listPrompts } from "@/lib/mario.functions";
import logoAsset from "@/assets/studio-cami-logo.svg.asset.json";

const NAV_ITEMS = [
  { to: "/", icon: Plus, label: "Générateur de prompt" },
  { to: "/fiches", icon: FileText, label: "Fiches" },
  { to: "/bibliotheque", icon: Library, label: "Bibliothèque" },
  { to: "/glossaire", icon: BookOpen, label: "Glossaire" },
  { to: "/outils", icon: Wrench, label: "Outils" },
];



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
  labelClassName = "",
}: {
  to: string;
  icon: typeof Library;
  label: string;
  active: boolean;
  labelClassName?: string;
}) {
  return (
    <Link to={to} aria-label={label} title={label} className="flex flex-col items-center gap-1.5">
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition duration-200 hover:-translate-y-0.5",
          active
            ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(17,26,61,0.45)]"
            : "border border-border bg-card text-primary shadow-[0_1px_2px_rgba(17,26,61,0.06),0_8px_18px_-14px_rgba(17,26,61,0.35)]",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span
        className={[
          "text-center text-[10px] font-medium leading-tight text-muted-foreground",
          labelClassName,
        ].join(" ")}
      >
        {label}
      </span>
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
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-background">
      <PrechargementBibliotheque />
      <DecorLignes />

      {/* Rail de navigation (desktop) */}
      <aside className="z-10 hidden w-[92px] shrink-0 flex-col items-center gap-6 border-r border-border bg-card py-5 lg:flex">
        <Link to="/" aria-label="Studio Cami — accueil" className="transition hover:opacity-80">
          <img src={logoAsset.url} alt="Studio Cami" className="w-12" />
        </Link>

        <nav className="flex flex-col items-center gap-3">
          <RailButton
            to="/"
            icon={Plus}
            label="Générateur de prompt"
            active={pathname === "/"}
            labelClassName="w-16"
          />
          <RailButton
            to="/bibliotheque"
            icon={Library}
            label="Bibliothèque"
            active={pathname.startsWith("/bibliotheque")}
          />
          <RailButton
            to="/glossaire"
            icon={BookOpen}
            label="Glossaire"
            active={pathname.startsWith("/glossaire")}
          />
          <RailButton
            to="/outils"
            icon={Wrench}
            label="Outils"
            active={pathname.startsWith("/outils")}
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
        {/* Barre mobile : burger + logo + panneau contextuel */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border bg-card/90 px-3 py-2 backdrop-blur lg:hidden">
          <Sheet open={menuOuvert} onOpenChange={setMenuOuvert}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={menuOuvert}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
              >
                {menuOuvert ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[82vw] max-w-xs p-0">
              <SheetHeader className="border-b border-border px-4 py-3 text-left">
                <SheetTitle className="text-base">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const actif =
                    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOuvert(false)}
                      className={[
                        "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition",
                        actif
                          ? "bg-primary text-primary-foreground"
                          : "text-primary hover:bg-secondary",
                      ].join(" ")}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="min-w-0 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" aria-label="Studio Cami — accueil" className="flex h-11 shrink-0 items-center">
            <img src={logoAsset.url} alt="Studio Cami" className="w-9" />
          </Link>

          {panel ? (
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Options"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold text-primary"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Options</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
                <SheetHeader className="border-b border-border px-4 py-3 text-left">
                  <SheetTitle className="text-base">Options</SheetTitle>
                </SheetHeader>
                {panel}
              </SheetContent>
            </Sheet>
          ) : (
            <span className="h-11 w-11" aria-hidden="true" />
          )}
        </div>

        {children}
      </main>

      {/* Panneau contextuel (desktop) */}
      {panel ? (
        <aside className="z-10 hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-card lg:block">
          {panel}
        </aside>
      ) : null}
    </div>
  );
}


