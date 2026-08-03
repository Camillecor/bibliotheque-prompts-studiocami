import { AlertTriangle, ListOrdered, Sparkles, Wand2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

type PromptViewData = {
  titre: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  version_1: { prompt?: string; note?: string };
  version_2: { prompt?: string; amelioration?: string };
  etapes_lancement: string[];
  alerte_pii?: boolean;
};

export function PromptView({ data }: { data: PromptViewData }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold md:text-3xl">{data.titre}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="cami-pill">{data.metier}</span>
          <span className="cami-pill">Complexité : {data.complexite}</span>
          {data.mots_cles.length > 0 ? (
            <span className="cami-pill text-muted-foreground">
              Mots-clés : {data.mots_cles.join(", ")}
            </span>
          ) : null}
        </div>
      </div>

      {data.alerte_pii ? (
        <div className="cami-block-alerte flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
          <p className="text-sm font-medium text-foreground">
            Vigilance : cette idée touche à des données personnelles (PII). Anonymise tes exemples
            et évite d'injecter des données réelles dans le prompt.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="cami-block-resume space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-4 w-4 text-[var(--info)]" />
              Version 1
            </h3>
            <CopyButton value={data.version_1.prompt ?? ""} />
          </div>
          <pre className="whitespace-pre-wrap rounded-2xl bg-card/70 p-4 text-sm leading-relaxed text-foreground">
            {data.version_1.prompt}
          </pre>
          {data.version_1.note ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Ce que couvre cette V1 : </span>
              {data.version_1.note}
            </p>
          ) : null}
        </section>

        <section className="cami-block-amelioration space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Wand2 className="h-4 w-4 text-[var(--coral)]" />
              Version 2 — améliorée
            </h3>
            <CopyButton value={data.version_2.prompt ?? ""} />
          </div>
          <pre className="whitespace-pre-wrap rounded-2xl bg-card/70 p-4 text-sm leading-relaxed text-primary">
            {data.version_2.prompt}
          </pre>
          {data.version_2.amelioration ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--coral)_28%,transparent)] bg-card/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--coral)]">
                Ce qui a changé
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{data.version_2.amelioration}</p>
            </div>
          ) : null}
        </section>
      </div>

      {data.etapes_lancement.length > 0 ? (
        <section className="cami-block-positif space-y-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <ListOrdered className="h-4 w-4 text-[var(--success)]" />
            Étapes pour lancer ce prompt
          </h3>
          <ol className="space-y-2">
            {data.etapes_lancement.map((etape, index) => (
              <li key={etape} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_28%,transparent)] text-xs font-bold text-[var(--success)]">
                  {index + 1}
                </span>
                <span>{etape}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
