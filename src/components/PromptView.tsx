import { AlertTriangle, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

type PromptViewData = {
  titre: string;
  metier: string;
  mots_cles: string[];
  complexite: string;
  prompt: string;
  note?: string | undefined;
  etapes_lancement: string[];
  alerte_pii?: boolean;
};

export function PromptView({ data }: { data: PromptViewData }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="cami-step-badge">1</span>
          <h2 className="text-2xl font-extrabold md:text-3xl">{data.titre}</h2>
        </div>
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

      <div className="flex justify-center">
        <CopyButton value={data.prompt} label="Copier le prompt" className="cami-copy-btn" />
      </div>

      {data.note ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Pourquoi ce prompt fonctionne : </span>
          {data.note}
        </p>
      ) : null}

      {data.etapes_lancement.length > 0 ? (
        <section className="space-y-4">
          <h3 className="flex items-center gap-3 text-lg font-bold">
            <span className="cami-step-badge bg-[var(--success)]">2</span>
            Je suis ces étapes pour lancer mon prompt
          </h3>
          <ol>
            {data.etapes_lancement.map((etape, index) => {
              const estDerniere = index === data.etapes_lancement.length - 1;
              return (
                <li key={etape} className="flex gap-4 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--success)] bg-card text-xs font-bold text-[var(--success)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!estDerniere ? (
                      <span className="mt-1 w-px flex-1 bg-[color-mix(in_srgb,var(--success)_35%,transparent)]" />
                    ) : null}
                  </div>
                  <div className="cami-block-positif flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {etape.replace(/^Étape\s*\d+\s*:\s*/i, "")}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
