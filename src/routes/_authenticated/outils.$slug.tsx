import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolLogo } from "@/components/ToolLogos";
import { getToolDetail } from "@/lib/toolDetails";
import { CRITERES, formatNote, noteGlobale } from "@/lib/toolNotes";

export const Route = createFileRoute("/_authenticated/outils/$slug")({
  loader: ({ params }) => {
    const outil = getToolDetail(params.slug);
    if (!outil) throw notFound();
    return outil;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nom} — Outils — Studio Cami IA` },
          { name: "description", content: loaderData.tagline },
        ]
      : [],
  }),
  notFoundComponent: FicheIntrouvable,
  component: OutilDetailPage,
});

function FicheIntrouvable() {
  return (
    <AppShell>
      <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-lg font-bold text-primary">Cette fiche n'existe pas encore.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          On n'a pas encore rédigé le détail de cet outil — reviens à la liste en attendant.
        </p>
        <Link to="/outils" className="cami-btn">
          <ArrowLeft className="h-4 w-4" />
          Retour aux outils
        </Link>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold text-primary">{value}</p>
    </div>
  );
}

function OutilDetailPage() {
  const o = Route.useLoaderData();
  const global = noteGlobale(o.notes);

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <Link
          to="/outils"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Outils
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Hero */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(17,26,61,0.06),0_12px_32px_-18px_rgba(17,26,61,0.35)]">
            <ToolLogo nom={o.logo} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">{o.nom}</h1>
              <span className="flex shrink-0 items-baseline gap-1 rounded-2xl bg-primary px-3 py-1.5 text-primary-foreground">
                <span className="text-xl font-bold">{formatNote(global)}</span>
                <span className="text-xs opacity-60">/10</span>
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{o.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {o.tags.map((tag) => (
                <span key={tag} className="cami-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={o.ctaUrl} target="_blank" rel="noopener noreferrer" className="cami-cta text-sm">
            {o.ctaLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
          <span className="text-xs text-muted-foreground">Testé le {o.testeLe}</span>
        </div>

        {/* Note détaillée */}
        <div className="cami-card mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Note Studio Cami
          </p>
          <div className="mt-3 space-y-3">
            {CRITERES.map((c) => {
              const valeur = o.notes[c.key];
              return (
                <div key={c.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">{c.label}</p>
                    <p className="text-xs font-bold text-primary">{formatNote(valeur)}/10</p>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-[var(--info)]"
                      style={{ width: `${valeur * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Évaluation éditoriale Studio Cami, moyenne arrondie au demi-point.
          </p>
        </div>

        {/* Essentiel */}
        <div className="cami-block-resume mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--info)]">
            ✦ L'essentiel
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{o.essentiel}</p>
        </div>

        {/* Qu'est-ce que */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">Qu'est-ce que {o.nom} ?</h2>
          <div className="mt-3 space-y-3">
            {o.quEstCe.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Qui est derrière */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">Qui est derrière {o.nom} ?</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{o.quiEstDerriere}</p>
        </section>

        {/* Pour qui */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">Pour qui ?</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="cami-block-positif">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--success)]">
                ✓ Idéal pour
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{o.pourQui.idealPour}</p>
            </div>
            <div className="cami-block-alerte">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--warning)]">
                ✕ À éviter si
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{o.pourQui.aEviterSi}</p>
            </div>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">
            Fonctionnalités clés <span className="text-muted-foreground">{o.fonctionnalites.length}</span>
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {o.fonctionnalites.map((f) => (
              <div key={f.titre} className="cami-card">
                <p className="text-sm font-bold text-primary">{f.titre}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limites */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">
            Les limites, la partie honnête{" "}
            <span className="text-muted-foreground">{o.limites.length}</span>
          </h2>
          <div className="mt-3 space-y-3">
            {o.limites.map((l) => (
              <div key={l.titre} className="cami-card">
                <p className="text-sm font-bold text-primary">{l.titre}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conformité & souveraineté */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">Conformité & souveraineté</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatCard label="Hébergement" value={o.conformite.hebergement} />
            <StatCard label="RGPD" value={o.conformite.rgpd} />
            <StatCard label="AI Act" value={o.conformite.aiAct} />
            <StatCard label="Entraînement" value={o.conformite.entrainement} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{o.conformite.note}</p>
        </section>

        {/* MCP */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">MCP (Model Context Protocol)</h2>
          <div className="cami-card mt-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em]"
              style={{
                background: o.mcp.disponible
                  ? "color-mix(in srgb, var(--primary) 14%, white)"
                  : "color-mix(in srgb, var(--muted-foreground) 14%, white)",
                color: o.mcp.disponible ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {o.mcp.disponible ? `✓ MCP disponible${o.mcp.officiel ? " · Officiel" : ""}` : "MCP indisponible"}
            </span>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground">{o.mcp.note}</p>
            {o.mcp.lien ? (
              <a
                href={o.mcp.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--coral)] hover:text-[var(--coral-dark)]"
              >
                Voir la documentation MCP <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </section>

        {/* Tarifs */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">
            Tarifs <span className="text-muted-foreground">{o.tarifs.length} paliers</span>
          </h2>
          <div className="mt-3 space-y-2.5">
            {o.tarifs.map((t) => (
              <div
                key={t.nom}
                className="cami-card flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <p className="w-28 shrink-0 text-sm font-bold text-primary">{t.nom}</p>
                <p className="w-32 shrink-0 text-sm font-bold text-[var(--coral)]">{t.prix}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.inclus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-primary">Le verdict</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{o.verdict}</p>
        </section>

        {/* FAQ */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-primary">
            FAQ {o.nom} <span className="text-muted-foreground">{o.faq.length}</span>
          </h2>
          <div className="mt-3 space-y-3">
            {o.faq.map((item) => (
              <details key={item.question} className="cami-card group">
                <summary className="cursor-pointer list-none text-sm font-bold text-primary">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{item.reponse}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
