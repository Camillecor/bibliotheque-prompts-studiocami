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
    const correspondance = /^\s*(\[[^\]]+\])\s*(.*)$/.exec(ligne);
    if (correspondance) {
      if (courante) sections.push(courante);
      const header = correspondance[1] as string;
      courante = { header, body: correspondance[2] ?? "", couleur: couleurPourHeader(header) };
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
        <h2 className="flex items-center gap-3 text-lg font-bold">
          <span className="cami-step-badge">1</span>
          J'obtiens mon prompt avec la méthode MARIO
        </h2>
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
        <section className="rounded-2xl bg-[var(--primary)] p-5 md:p-6">
          <textarea
            value={data.prompt}
            onChange={(event) => onPromptChange?.(event.target.value)}
            aria-label="Prompt généré"
            rows={Math.max(8, data.prompt.split("\n").length)}
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-white/60"
          />
        </section>
      ) : (
        <section className="cami-code-card">
          <div className="glow-orb -right-10 -top-10 h-40 w-40 bg-[var(--info)] opacity-20" />
          <div className="cami-code-chrome relative">
            <span className="cami-code-dot bg-[#ff5f57]" />
            <span className="cami-code-dot bg-[#febc2e]" />
            <span className="cami-code-dot bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">prompt-mario.md</span>
            <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--primary)] sm:inline-flex">
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
          <ol className="space-y-2.5">
            {data.etapes_lancement.map((etape, index) => (
              <li key={etape} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-xs font-bold text-[var(--success)]">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {etape.replace(/^Étape\s*\d+\s*:\s*/i, "")}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
