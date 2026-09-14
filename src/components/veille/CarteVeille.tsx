import { ExternalLink, Star, Trash2 } from "lucide-react";

import { couleurTag, formatDateVeille, nomDomaine, type VeilleItemRow } from "@/lib/veille";

export function CarteVeille({
  item,
  onFavori,
  onSupprimer,
}: {
  item: VeilleItemRow;
  onFavori: (item: VeilleItemRow) => void;
  onSupprimer: (item: VeilleItemRow) => void;
}) {
  return (
    <article className="glass-card flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-bold leading-snug text-primary">{item.titre}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={item.favori ? "Retirer des favoris" : "Garder cette actu"}
            onClick={() => onFavori(item)}
            className="rounded-xl p-2 transition hover:bg-secondary"
          >
            <Star
              className={`h-4 w-4 ${item.favori ? "fill-[var(--coral)] text-[var(--coral)]" : "text-muted-foreground"}`}
            />
          </button>
          <button
            type="button"
            aria-label="Supprimer cette actu"
            onClick={() => onSupprimer(item)}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-secondary hover:text-[var(--coral)]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.resume ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{item.resume}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              backgroundColor: `color-mix(in srgb, ${couleurTag(tag)} 14%, white)`,
              color: couleurTag(tag),
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-[11px] text-muted-foreground">
          {item.source || nomDomaine(item.url)}
          {item.publie_le ? ` · ${formatDateVeille(item.publie_le)}` : ""}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[var(--coral)] hover:underline"
        >
          Lire la source <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
