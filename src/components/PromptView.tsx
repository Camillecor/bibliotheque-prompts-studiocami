import { useEffect, useRef } from "react";
import { AlertTriangle, Download, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { labelTypePrompt } from "@/lib/mario";

type PromptViewData = {
  titre: string;
  metier: string;
  type_prompt?: string | undefined;
  mots_cles: string[];
  complexite: string;
  prompt: string;
  note?: string | undefined;
  etapes_lancement: string[];
  alerte_pii?: boolean;
};

type Section = {
  header: string | null;
  body: string;
  couleur: string;
};

const COULEURS: { motif: RegExp; couleur: string }[] = [
  { motif: /^\[\s*M\b/i, couleur: "var(--info)" },
  { motif: /^\[\s*A\s*[-–]/i, couleur: "var(--coral)" },
  { motif: /^\[\s*R\b/i, couleur: "var(--success, #16a34a)" },
  { motif: /^\[\s*I\b/i, couleur: "#a855f7" },
  { motif: /^\[\s*O\b/i, couleur: "var(--warning, #f59e0b)" },
  { motif: /^\[\s*AUTRES/i, couleur: "#64748b" },
];

function couleurPourHeader(header: string) {
  return COULEURS.find((c) => c.motif.test(header))?.couleur ?? "var(--info)";
}

export function decouperSections(prompt: string): Section[] {
  const lignes = prompt.split("\n");
  const sections: Section[] = [];
  let courante: Section | null = null;
  const preambule: string[] = [];

  for (const ligne of lignes) {
    const estHeader = /^\s*\[[^\]]+\]\s*$/.test(ligne);
    if (estHeader) {
      if (courante) sections.push(courante);
      const header = ligne.trim();
      courante = { header, body: "", couleur: couleurPourHeader(header) };
    } else if (courante) {
      courante.body += (courante.body ? "\n" : "") + ligne;
    } else {
      preambule.push(ligne);
    }
  }
  if (courante) sections.push(courante);

  const texteIntro = preambule.join("\n").trim();
  if (texteIntro) {
    sections.unshift({ header: null, body: texteIntro, couleur: "var(--info)" });
  }
  return sections;
}

function recomposer(sections: Section[]) {
  return sections
    .map((s) => (s.header ? `${s.header}\n${s.body.replace(/^\n+/, "")}` : s.body))
    .join("\n\n")
    .trim();
}

function titreLisible(header: string) {
  const nu = header.replace(/^\[|\]$/g, "").trim();
  const [lettre, ...reste] = nu.split(/\s*[-–]\s*/);
  const suite = reste.join(" - ");
  if (!suite) return nu.charAt(0) + nu.slice(1).toLowerCase();
  return `${lettre} — ${suite.charAt(0) + suite.slice(1).toLowerCase()}`;
}

function versMarkdown(data: PromptViewData) {
  const sections = decouperSections(data.prompt);
  const corps = sections
    .map((s) => (s.header ? `## ${titreLisible(s.header)}\n\n${s.body.trim()}` : s.body.trim()))
    .join("\n\n");
  return `# ${data.titre}\n\n${corps}\n`;
}

function slugifier(titre: string) {
  return (
    titre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "prompt"
  );
}

function telecharger(nom: string, contenu: string, mime: string) {
  const blob = new Blob([contenu], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nom;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
}

function AutoTextarea({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground outline-none"
    />
  );
}

export function PromptView({
  data,
  editable = false,
  onPromptChange,
}: {
  data: PromptViewData;
  editable?: boolean;
  onPromptChange?: (prompt: string) => void;
}) {
  const sections = decouperSections(data.prompt);
  const slug = slugifier(data.titre);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="cami-step-badge">1</span>
          <h2 className="text-2xl font-extrabold md:text-3xl">{data.titre}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="cami-pill">{data.metier}</span>
          {data.type_prompt ? (
            <span className="cami-pill">Type : {labelTypePrompt(data.type_prompt)}</span>
          ) : null}
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

      {editable ? (
        <section className="space-y-3 rounded-3xl border border-border bg-card p-4 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Prompt modifiable — chaque section MARIO a sa couleur
          </p>
          {sections.map((section, index) => (
            <div
              key={`${section.header ?? "intro"}-${index}`}
              className="rounded-2xl border-l-4 p-4"
              style={{
                borderLeftColor: section.couleur,
                backgroundColor: `color-mix(in srgb, ${section.couleur} 8%, transparent)`,
              }}
            >
              {section.header ? (
                <p
                  className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: section.couleur }}
                >
                  {section.header}
                </p>
              ) : null}
              <AutoTextarea
                ariaLabel={section.header ?? "Introduction du prompt"}
                value={section.body}
                onChange={(valeur) => {
                  const copie = sections.map((s, i) => (i === index ? { ...s, body: valeur } : s));
                  onPromptChange?.(recomposer(copie));
                }}
              />
            </div>
          ))}
        </section>
      ) : (
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
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <CopyButton value={data.prompt} label="Copier le prompt" className="cami-copy-btn" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="cami-btn inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-56 rounded-3xl border border-white/60 bg-white/75 p-2 shadow-2xl backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => telecharger(`${slug}.txt`, data.prompt, "text/plain")}
              className="flex w-full flex-col items-start gap-0.5 rounded-2xl px-3 py-2 text-left transition hover:bg-secondary"
            >
              <span className="text-sm font-semibold text-primary">Exporter en .txt</span>
              <span className="text-xs text-muted-foreground">Texte brut du prompt</span>
            </button>
            <button
              type="button"
              onClick={() => telecharger(`${slug}.md`, versMarkdown(data), "text/markdown")}
              className="flex w-full flex-col items-start gap-0.5 rounded-2xl px-3 py-2 text-left transition hover:bg-secondary"
            >
              <span className="text-sm font-semibold text-primary">Exporter en .md</span>
              <span className="text-xs text-muted-foreground">Markdown avec titres MARIO</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
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
