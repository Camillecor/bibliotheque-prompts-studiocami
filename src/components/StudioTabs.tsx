import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Images, PenLine } from "lucide-react";

const ONGLETS = [
  { to: "/studio", label: "Contenus", icon: PenLine, exact: true },
  { to: "/studio/medias", label: "Médias", icon: Images, exact: false },
  { to: "/studio/calendrier", label: "Calendrier", icon: CalendarDays, exact: false },
  { to: "/studio/statistiques", label: "Statistiques", icon: BarChart3, exact: false },
] as const;

export function StudioTabs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
      {ONGLETS.map((onglet) => {
        const actif = onglet.exact
          ? pathname === onglet.to || pathname === "/studio/"
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
