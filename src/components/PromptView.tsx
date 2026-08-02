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
          {data.mots_cles.map((mot) => (
            <span key={mot} className="cami-pill text-slate-500">
              #{mot}
            </span>
          ))}
        </div>
      </div>

      {data.alerte_pii ? (
        <div className="cami-block-alerte flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-900">
            Vigilance : cette idée touche à des données personnelles (PII). Anonymise tes exemples
            et évite d'injecter des données réelles dans le prompt.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="cami-block-resume space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Version 1
            </h3>
            <CopyButton value={data.version_1.prompt ?? ""} />
          </div>
          <pre className="whitespace-pre-wrap rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-navy">
            {data.version_1.prompt}
          </pre>
          {data.version_1.note ? (
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-navy">Ce que couvre cette V1 : </span>
              {data.version_1.note}
            </p>
          ) : null}
        </section>

        <section className="cami-block-amelioration space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Wand2 className="h-4 w-4 text-[#ff7a45]" />
              Version 2 — améliorée
            </h3>
            <CopyButton value={data.version_2.prompt ?? ""} />
          </div>
          <pre className="whitespace-pre-wrap rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-navy">
            {data.version_2.prompt}
          </pre>
          {data.version_2.amelioration ? (
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#ff7a45]">
                Ce qui a changé
              </p>
              <p className="mt-1 text-sm text-slate-600">{data.version_2.amelioration}</p>
            </div>
          ) : null}
        </section>
      </div>

      {data.etapes_lancement.length > 0 ? (
        <section className="cami-block-positif space-y-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <ListOrdered className="h-4 w-4 text-emerald-600" />
            Étapes pour lancer ce prompt
          </h3>
          <ol className="space-y-2">
            {data.etapes_lancement.map((etape, index) => (
              <li key={etape} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
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
