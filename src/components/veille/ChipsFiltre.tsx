export type OptionChip = { value: string; label: string; compte?: number };

export function ChipsFiltre({
  options,
  valeur,
  onChange,
}: {
  options: readonly OptionChip[];
  valeur: string;
  onChange: (valeur: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition",
            valeur === option.value
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-primary hover:border-[var(--coral)] hover:text-[var(--coral)]",
          ].join(" ")}
        >
          {option.label}
          {typeof option.compte === "number" ? (
            <span
              className={
                valeur === option.value ? "text-primary-foreground/70" : "text-muted-foreground"
              }
            >
              {option.compte}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
