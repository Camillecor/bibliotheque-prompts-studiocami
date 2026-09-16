type JaugeLongueurProps = {
  texte: string;
  limite: number;
};

const REGEX_EMOJI = /\p{Extended_Pictographic}/gu;

/** Jauge de remplissage + repères d'écriture (mots, hashtags, emojis). */
export function JaugeLongueur({ texte, limite }: JaugeLongueurProps) {
  const longueur = texte.length;
  const ratio = limite > 0 ? longueur / limite : 0;
  const mots = texte.trim() ? texte.trim().split(/\s+/).length : 0;
  const hashtags = (texte.match(/(^|\s)#[\p{L}0-9_]+/gu) ?? []).length;
  const emojis = (texte.match(REGEX_EMOJI) ?? []).length;

  const couleur =
    ratio > 1 ? "var(--destructive)" : ratio > 0.85 ? "var(--coral)" : "var(--success)";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-valuenow={Math.min(longueur, limite)}
        aria-label="Remplissage du post"
      >
        <span
          className="block h-full rounded-full transition-all"
          style={{
            width: `${Math.min(ratio, 1) * 100}%`,
            backgroundColor: couleur,
          }}
        />
      </div>
      <p className="text-[11px] font-semibold text-muted-foreground">
        <span style={{ color: ratio > 0.85 ? couleur : undefined }}>
          {longueur} / {limite} caractères
        </span>
        <span className="mx-1.5 opacity-40">·</span>
        {mots} mot{mots > 1 ? "s" : ""}
        <span className="mx-1.5 opacity-40">·</span>
        {hashtags} hashtag{hashtags > 1 ? "s" : ""}
        <span className="mx-1.5 opacity-40">·</span>
        {emojis} emoji{emojis > 1 ? "s" : ""}
      </p>
    </div>
  );
}
