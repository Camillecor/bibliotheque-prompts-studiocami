import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Pause, Play, RotateCcw, SkipForward, Timer } from "lucide-react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/pomodoro")({
  head: () => ({
    meta: [
      { title: "Pomodoro — Minuteur de concentration | Studio Cami IA" },
      {
        name: "description",
        content:
          "Lance des sessions de concentration de 25 minutes, alterne avec des pauses et suis ton temps de travail du jour.",
      },
      { property: "og:title", content: "Pomodoro — Minuteur de concentration" },
      {
        property: "og:description",
        content: "Un minuteur simple pour enchaîner concentration et pauses, avec le suivi du jour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PomodoroPage,
});

type Phase = "focus" | "pause" | "pause_longue";

const PHASES: Record<Phase, { label: string; couleur: string }> = {
  focus: { label: "Concentration", couleur: "var(--coral)" },
  pause: { label: "Pause courte", couleur: "var(--info)" },
  pause_longue: { label: "Pause longue", couleur: "var(--primary)" },
};

type Reglages = { focus: number; pause: number; pauseLongue: number; cycles: number };

const REGLAGES_DEFAUT: Reglages = { focus: 25, pause: 5, pauseLongue: 15, cycles: 4 };

const CLE_REGLAGES = "cami:pomodoro:reglages";
const CLE_JOURNAL = "cami:pomodoro:journal";

type Journal = { jour: string; sessions: number; minutes: number };

function jourCourant() {
  return new Date().toISOString().slice(0, 10);
}

function formatTemps(secondes: number) {
  const m = Math.floor(Math.max(0, secondes) / 60);
  const s = Math.max(0, secondes) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function bip() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
    setTimeout(() => void ctx.close(), 900);
  } catch {
    /* le son n'est qu'un confort, on ignore l'échec */
  }
}

function PomodoroPage() {
  const [reglages, setReglages] = useState<Reglages>(REGLAGES_DEFAUT);
  const [phase, setPhase] = useState<Phase>("focus");
  const [restant, setRestant] = useState(REGLAGES_DEFAUT.focus * 60);
  const [enCours, setEnCours] = useState(false);
  const [faits, setFaits] = useState(0);
  const [journal, setJournal] = useState<Journal>({ jour: jourCourant(), sessions: 0, minutes: 0 });
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Lecture des préférences enregistrées après l'hydratation (évite tout décalage serveur/navigateur).
  useEffect(() => {
    try {
      const r = localStorage.getItem(CLE_REGLAGES);
      if (r) {
        const parse = { ...REGLAGES_DEFAUT, ...(JSON.parse(r) as Partial<Reglages>) };
        setReglages(parse);
        setRestant(parse.focus * 60);
      }
      const j = localStorage.getItem(CLE_JOURNAL);
      if (j) {
        const parse = JSON.parse(j) as Journal;
        if (parse.jour === jourCourant()) setJournal(parse);
      }
    } catch {
      /* stockage indisponible : on garde les valeurs par défaut */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_REGLAGES, JSON.stringify(reglages));
    } catch {
      /* ignore */
    }
  }, [reglages]);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_JOURNAL, JSON.stringify(journal));
    } catch {
      /* ignore */
    }
  }, [journal]);

  const dureePhase = useCallback(
    (p: Phase) =>
      (p === "focus" ? reglages.focus : p === "pause" ? reglages.pause : reglages.pauseLongue) * 60,
    [reglages],
  );

  const passerPhase = useCallback(
    (auto: boolean) => {
      const actuelle = phaseRef.current;
      if (actuelle === "focus") {
        const total = faits + 1;
        setFaits(total);
        if (auto) {
          setJournal((j) => {
            const base = j.jour === jourCourant() ? j : { jour: jourCourant(), sessions: 0, minutes: 0 };
            return {
              jour: base.jour,
              sessions: base.sessions + 1,
              minutes: base.minutes + reglages.focus,
            };
          });
        }
        const suivante: Phase = total % reglages.cycles === 0 ? "pause_longue" : "pause";
        setPhase(suivante);
        setRestant(dureePhase(suivante));
      } else {
        setPhase("focus");
        setRestant(dureePhase("focus"));
      }
      setEnCours(false);
    },
    [dureePhase, faits, reglages.cycles, reglages.focus],
  );

  useEffect(() => {
    if (!enCours) return;
    const id = window.setInterval(() => {
      setRestant((s) => {
        if (s <= 1) {
          bip();
          window.setTimeout(() => passerPhase(true), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [enCours, passerPhase]);

  const total = dureePhase(phase);
  const progression = total > 0 ? 1 - restant / total : 0;
  const couleur = PHASES[phase].couleur;

  const titreOnglet = useMemo(() => `${formatTemps(restant)} · ${PHASES[phase].label}`, [restant, phase]);
  useEffect(() => {
    document.title = `${titreOnglet} — Pomodoro | Studio Cami IA`;
  }, [titreOnglet]);

  function majReglage(cle: keyof Reglages, valeur: number) {
    const borne = Math.min(cle === "cycles" ? 8 : 90, Math.max(1, Math.round(valeur)));
    setReglages((r) => {
      const suivant = { ...r, [cle]: borne };
      if (
        (cle === "focus" && phase === "focus") ||
        (cle === "pause" && phase === "pause") ||
        (cle === "pauseLongue" && phase === "pause_longue")
      ) {
        setEnCours(false);
        setRestant(borne * 60);
      }
      return suivant;
    });
  }

  const rayon = 86;
  const circonference = 2 * Math.PI * rayon;

  const panneau = (
    <div className="space-y-5 p-4">
      <div>
        <h2 className="font-display text-lg font-bold text-primary">Réglages</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Durées en minutes. Un changement remet la phase en cours à zéro.
        </p>
      </div>

      <div className="space-y-3">
        {(
          [
            { cle: "focus", label: "Concentration" },
            { cle: "pause", label: "Pause courte" },
            { cle: "pauseLongue", label: "Pause longue" },
            { cle: "cycles", label: "Sessions avant pause longue" },
          ] as const
        ).map((champ) => (
          <label key={champ.cle} className="block">
            <span className="mb-1 block text-xs font-semibold text-primary">{champ.label}</span>
            <input
              type="number"
              min={1}
              max={champ.cle === "cycles" ? 8 : 90}
              value={reglages[champ.cle]}
              onChange={(e) => majReglage(champ.cle, Number(e.target.value))}
              className="min-h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm font-semibold text-primary"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Aujourd’hui
        </p>
        <p className="mt-2 font-display text-2xl font-bold text-primary">
          {journal.sessions} session{journal.sessions > 1 ? "s" : ""}
        </p>
        <p className="text-sm text-muted-foreground">{journal.minutes} minutes de concentration</p>
        <button
          type="button"
          onClick={() => setJournal({ jour: jourCourant(), sessions: 0, minutes: 0 })}
          className="mt-3 text-xs font-semibold text-[var(--coral)] hover:underline"
        >
          Remettre le compteur du jour à zéro
        </button>
      </div>
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-primary">
            <Timer className="h-3.5 w-3.5" />
            Pomodoro
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary sm:text-3xl">
            Minuteur de concentration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enchaîne des blocs de travail et des pauses, sans quitter ton studio.
          </p>
        </header>

        <section className="rounded-[24px] border border-border bg-card p-5 shadow-[0_1px_2px_rgba(17,26,61,0.06),0_18px_40px_-30px_rgba(17,26,61,0.5)] sm:p-8">
          <div className="flex flex-col items-center gap-6">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${couleur} 14%, white)`,
                color: couleur,
              }}
            >
              {phase === "focus" ? <Timer className="h-3.5 w-3.5" /> : <Coffee className="h-3.5 w-3.5" />}
              {PHASES[phase].label}
            </span>

            <div className="relative">
              <svg width="208" height="208" viewBox="0 0 208 208" className="-rotate-90">
                <circle cx="104" cy="104" r={rayon} fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle
                  cx="104"
                  cy="104"
                  r={rayon}
                  fill="none"
                  stroke={couleur}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circonference}
                  strokeDashoffset={circonference * (1 - progression)}
                  style={{ transition: "stroke-dashoffset 0.5s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-5xl font-bold tabular-nums text-primary">
                  {formatTemps(restant)}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {faits} session{faits > 1 ? "s" : ""} terminée{faits > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setEnCours((v) => !v)}
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--coral)] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(255,107,53,0.9)] transition hover:-translate-y-0.5"
              >
                {enCours ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {enCours ? "Mettre en pause" : "Démarrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnCours(false);
                  setRestant(dureePhase(phase));
                }}
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-5 text-sm font-semibold text-primary transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={() => passerPhase(false)}
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-5 text-sm font-semibold text-primary transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
              >
                <SkipForward className="h-4 w-4" />
                Phase suivante
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Sessions du jour", valeur: String(journal.sessions) },
            { label: "Minutes concentrées", valeur: String(journal.minutes) },
            {
              label: "Prochaine pause longue",
              valeur: `dans ${reglages.cycles - (faits % reglages.cycles)}`,
            },
          ].map((carte) => (
            <div key={carte.label} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-display text-2xl font-bold text-primary">{carte.valeur}</p>
              <p className="text-xs text-muted-foreground">{carte.label}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
