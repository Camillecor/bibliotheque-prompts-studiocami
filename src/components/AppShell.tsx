import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Library, LogOut, Menu, Wand2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/studio-cami-logo.svg.asset.json";

const NAV_ITEMS = [
  { title: "Générateur", url: "/", icon: Wand2, exact: true },
  { title: "Bibliothèque", url: "/bibliotheque", icon: Library, exact: false },
] as const;

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.url}
      onClick={onNavigate}
      className={[
        "flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm font-semibold transition",
        active
          ? "border-l-[var(--coral)] bg-secondary text-[var(--primary-dark)]"
          : "border-l-transparent text-muted-foreground hover:bg-muted hover:text-primary",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1 py-4">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.url}
          item={item}
          onNavigate={onNavigate}
          active={item.exact ? pathname === item.url : pathname.startsWith(item.url)}
        />
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const [open, setOpen] = useState(false);

  const initiales = (user?.email ?? "")
    .split(/[.@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Ouvrir le menu"
            className="rounded-full p-1.5 text-primary transition hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-[var(--primary-dark)]">
                {initiales || "SC"}
              </span>
              <button
                type="button"
                aria-label="Se déconnecter"
                className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-[var(--coral)]"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/auth" });
                }}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="cami-btn py-1.5 text-xs">
              Se connecter
            </Link>
          )}
          <Link to="/" aria-label="Studio Cami — accueil" className="flex items-center">
            <img src={logoAsset.url} alt="Studio Cami" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <aside className="fixed left-0 top-12 bottom-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarNav pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-[rgba(17,26,61,0.4)]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-60 border-r border-sidebar-border bg-sidebar">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <span className="font-chic text-sm uppercase tracking-[0.16em] text-primary">
                Menu
              </span>
              <button
                type="button"
                aria-label="Fermer"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="pt-12 lg:pl-60">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
