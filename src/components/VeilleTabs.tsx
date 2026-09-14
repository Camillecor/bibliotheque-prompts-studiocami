import { Link, useRouterState } from "@tanstack/react-router";
import { Library, Rss } from "lucide-react";

const ONGLETS = [
  { to: "/veille", label: "Fil d'actus", icon: Rss, exact: true },
  { to: "/veille/favoris", label: "Articles", icon: Library, exact: false },
] as const;

export function VeilleTabs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
      {ONGLETS.map((onglet) => {
        const actif = onglet.exact
          ? pathname === onglet.to || pathname === "/veille/"
          : pathname.startsWith(onglet.to);
        return (
          <Link
            key={onglet.to}
            to={onglet.to}
            className={[
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
              actif
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]",
            ].join(" ")}
          >
            <onglet.icon className="h-4 w-4" />
            {onglet.label}
          </Link>
        );
      })}
    </nav>
  );
}
