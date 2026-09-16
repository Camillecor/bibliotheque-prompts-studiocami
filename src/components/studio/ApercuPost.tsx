import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send, ThumbsUp } from "lucide-react";
import { reseauInfo, type MediaRow } from "@/lib/studio";

type ApercuPostProps = {
  texte: string;
  reseau: string;
  tags: string[];
  medias: MediaRow[];
};

// Longueur affichée avant la coupure « voir plus » selon le réseau.
const COUPURES: Record<string, number> = {
  instagram: 125,
  linkedin: 210,
  facebook: 250,
};

function Ligne({ texte }: { texte: string }) {
  const morceaux = texte.split(/(#[\p{L}0-9_]+)/gu);
  return (
    <>
      {morceaux.map((morceau, index) =>
        morceau.startsWith("#") ? (
          <span key={index} className="font-semibold text-[var(--info)]">
            {morceau}
          </span>
        ) : (
          <span key={index}>{morceau}</span>
        ),
      )}
    </>
  );
}

/** Aperçu du post tel qu'il apparaîtra sur le réseau choisi. */
export function ApercuPost({ texte, reseau, tags, medias }: ApercuPostProps) {
  const [deplie, setDeplie] = useState(false);
  const info = reseauInfo(reseau);
  const coupure = COUPURES[reseau] ?? 200;

  const complet = [texte.trim(), tags.map((tag) => `#${tag}`).join(" ")]
    .filter(Boolean)
    .join("\n\n");
  const tropLong = complet.length > coupure;
  const affiche = !deplie && tropLong ? `${complet.slice(0, coupure).trimEnd()}…` : complet;
  const visuel = medias[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2.5 p-3">
        <img src="/mario-fox-head.png" alt="" className="h-9 w-9 rounded-full bg-secondary" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-primary">Studio Cami</p>
          <p className="text-[10px] font-semibold" style={{ color: info.couleur }}>
            {info.label} · maintenant
          </p>
        </div>
      </div>

      {reseau === "instagram" && visuel ? (
        <img src={visuel.url} alt="" className="aspect-square w-full object-cover" />
      ) : null}

      <div className="px-3 py-2.5">
        {complet ? (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-primary">
            <Ligne texte={affiche} />
            {tropLong && !deplie ? (
              <button
                type="button"
                onClick={() => setDeplie(true)}
                className="ml-1 text-[13px] font-semibold text-muted-foreground"
              >
                voir plus
              </button>
            ) : null}
          </p>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            Ton texte s'affichera ici, comme sur le réseau.
          </p>
        )}
      </div>

      {reseau !== "instagram" && visuel ? (
        <img src={visuel.url} alt="" className="max-h-64 w-full object-cover" />
      ) : null}

      <div className="flex items-center gap-4 border-t border-border/70 px-3 py-2 text-muted-foreground">
        {reseau === "instagram" ? (
          <>
            <Heart className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
            <Send className="h-4 w-4" />
          </>
        ) : (
          <>
            <ThumbsUp className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
            <Repeat2 className="h-4 w-4" />
          </>
        )}
      </div>
    </div>
  );
}
