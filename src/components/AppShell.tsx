import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Library, Menu, Plus, X } from "lucide-react";
import { listPrompts } from "@/lib/mario.functions";
import logoAsset from "@/assets/studio-cami-logo.svg.asset.json";

function NavLink({
  to,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  to: string;
  icon: typeof Library;
  label: string;
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        "cami-side-item",
        active
          ? "bg-secondary text-[var(--primary-dark)]"
          : "text-muted-foreground hover:bg-muted hover:text-primary",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function RecentsList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const fetchPrompts = useServerFn(listPrompts);
  const { data } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => fetchPrompts(),
  });

  const recents = (data ?? []).slice(0, 5);
  if (recents.length === 0) return null;

  return (
    <div className="mt-4 border-t border-sidebar-border pt-4">
      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        Récents
      </p>
      <ul className="space-y-0.5">
        {recents.map((prompt) => (
          <li key={prompt.id}>
            <Link
              to="/bibliotheque"
              search={{ id: prompt.id }}
              onClick={onNavigate}
              className="block truncate px-4 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-primary"
              title={prompt.titre}
            >
              {prompt.titre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col py-3">
      <div className="space-y-1 px-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="cami-side-item bg-muted font-semibold text-primary hover:bg-secondary"
        >
          <Plus className="h-4 w-4" />
          Nouveau prompt
        </Link>
        <NavLink
          to="/bibliotheque"
          icon={Library}
          label="Bibliothèque"
          active={pathname.startsWith("/bibliotheque")}
          onNavigate={onNavigate}
        />
      </div>
      <RecentsList onNavigate={onNavigate} />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const [open, setOpen] = useState(false);

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

        <Link to="/" aria-label="Studio Cami — accueil" className="flex items-center gap-2">
          <img src="/mario-fox-head.png" alt="" className="h-8 w-8 rounded-full" />
          <img src={logoAsset.url} alt="Studio Cami" className="h-8 w-auto" />
        </Link>
      </header>

      <aside className="fixed left-0 top-12 bottom-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
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
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="pt-12 lg:pl-60">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
