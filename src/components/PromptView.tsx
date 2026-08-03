import { AlertTriangle, ListOrdered, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

type PromptViewData = {
  titre: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  prompt: string;
  note?: string;
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

      <section className="cami-code-card">
        <div className="glow-orb -right-10 -top-10 h-40 w-40 bg-[var(--info)] opacity-20" />
        <div className="cami-code-chrome relative">
          <span className="cami-code-dot bg-[#ff5f57]" />
          <span className="cami-code-dot bg-[#febc2e]" />
          <span className="cami-code-dot bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-white/50">prompt-mario.md</span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--info)] sm:inline-flex">
            <Sparkles className="h-3 w-3" />
            MARIO
          </span>
        </div>
        <pre className="cami-code-body relative">{data.prompt}</pre>
      </section>

      <div className="flex justify-center sm:justify-end">
        <CopyButton value={data.prompt} label="Copier le prompt" className="cami-copy-btn" />
      </div>

      {data.note ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Pourquoi ce prompt fonctionne : </span>
          {data.note}
        </p>
      ) : null}

      {data.etapes_lancement.length > 0 ? (
        <section className="cami-block-positif space-y-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <ListOrdered className="h-4 w-4 text-[var(--success)]" />
            Étapes pour lancer ce prompt
          </h3>
          <ol className="space-y-2">
            {data.etapes_lancement.map((etape, index) => (
              <li key={etape} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_18%,white)] text-xs font-bold text-[var(--success)]">
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
