import { Link, useRouterState } from "@tanstack/react-router";
import { PenLine, Palette } from "lucide-react";

/** Deux grands modes du Studio : Rédaction (contenus) et Création (visuels). */
export function StudioModeTabs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const creation = pathname.startsWith("/studio/creation");

  const classes = (actif: boolean) =>
    [
      "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition sm:flex-none",
      actif
        ? "bg-primary text-primary-foreground shadow-sm"
        : "border border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]",
    ].join(" ");

  return (
    <div className="flex gap-2">
      <Link to="/studio" search={{ contenu: undefined }} className={classes(!creation)}>
        <PenLine className="h-4 w-4" />
        Rédaction
      </Link>
      <Link to="/studio/creation" className={classes(creation)}>
        <Palette className="h-4 w-4" />
        Création
      </Link>
    </div>
  );
}
