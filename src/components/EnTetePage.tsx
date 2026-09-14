import type { ReactNode } from "react";

type EnTetePageProps = {
  titre: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** En-tête standard d'une page : même taille, même typo, même espacement partout. */
export function EnTetePage({ titre, description, actions, className }: EnTetePageProps) {
  return (
    <header
      className={[
        "flex flex-wrap items-end justify-between gap-3",
        className ?? "",
      ].join(" ")}
    >
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">{titre}</h1>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
