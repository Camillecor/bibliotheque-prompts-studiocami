import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, FileText, Library, Link2, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { listFiches, deleteFiche, type FicheRow } from "@/lib/fiches.functions";

export const Route = createFileRoute("/_authenticated/mes-fiches")({
  head: () => ({
    meta: [
      { title: "Bibliothèque de fiches — Studio Cami IA" },
      {
        name: "description",
        content:
          "Retrouve, cherche et rouvre toutes tes fiches de reconstruction enregistrées dans Studio Cami IA.",
      },
      { property: "og:title", content: "Bibliothèque de fiches — Studio Cami IA" },
      {
        property: "og:description",
        content: "Toutes tes fiches de reconstruction enregistrées, cherchables en un endroit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MesFichesPage,
});

type Tri = "recent" | "ancien" | "titre";

function extraitResume(markdown: string) {
  const lignes = markdown.split("\n");
  for (let i = 0; i < lignes.length; i += 1) {
    const l = (lignes[i] ?? "").trim();
    if (!l || l.startsWith("#") || l.startsWith("|") || l.startsWith("```")) continue;
    return l.replace(/\*\*|`|\[(?:Observé|Déduit|Hypothèse)\]/g, "").slice(0, 180);
  }
  return "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MesFichesPage() {
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState<Tri>("recent");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchFiches = useServerFn(listFiches);
  const { data: fiches = [], isLoading } = useQuery({
    queryKey: ["fiches"],
    queryFn: () => fetchFiches(),
  });

  const suppressionServeur = useServerFn(deleteFiche);
  const suppression = useMutation({
    mutationFn: (id: string) => suppressionServeur({ data: { id } }),
    onSuccess: () => {
      toast.success("Fiche supprimée.");
      queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const base = q
      ? fiches.filter((f) =>
          [f.titre, f.description, f.lien, f.markdown].join(" ").toLowerCase().includes(q),
        )
      : [...fiches];
    return base.sort((a, b) => {
      if (tri === "titre") return a.titre.localeCompare(b.titre, "fr");
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return tri === "ancien" ? da - db : db - da;
    });
  }, [fiches, recherche, tri]);

  function ouvrir(fiche: FicheRow) {
    void navigate({ to: "/fiches", search: { fiche: fiche.id } });
  }

  const panneau = (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm font-semibold text-[var(--primary)]">Bibliothèque de fiches</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Chaque fiche enregistrée depuis l'onglet Fiches se retrouve ici. Clique pour la rouvrir,
          la modifier puis la mettre à jour.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="fiches-recherche"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]"
        >
          Rechercher
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--primary)]" />
          <input
            id="fiches-recherche"
            value={recherche}
            maxLength={120}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Titre, mot-clé, contenu…"
            className="min-h-11 w-full rounded-2xl border border-border bg-card pl-9 pr-3 text-sm text-[var(--primary)] outline-none focus:border-[var(--info)]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="fiches-tri"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]"
        >
          Trier
        </label>
        <select
          id="fiches-tri"
          value={tri}
          onChange={(e) => setTri(e.target.value as Tri)}
          className="min-h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm text-[var(--primary)] outline-none focus:border-[var(--info)]"
        >
          <option value="recent">Plus récentes</option>
          <option value="ancien">Plus anciennes</option>
          <option value="titre">Titre (A → Z)</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        {resultats.length} fiche{resultats.length > 1 ? "s" : ""} sur {fiches.length}
      </p>
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto w-full max-w-[900px] px-4 py-6 lg:px-8 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-[var(--primary)]">
              <Library className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[var(--primary)]">Bibliothèque de fiches</h1>
              <p className="text-xs text-muted-foreground">
                Toutes tes fiches de reconstruction enregistrées.
              </p>
            </div>
          </div>
          <Link to="/fiches" className="cami-btn min-h-11">
            <FileText className="h-4 w-4" />
            Nouvelle fiche
          </Link>
        </header>

        {isLoading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </p>
        ) : resultats.length === 0 ? (
          <div className="cami-card mt-6 p-6 text-center">
            <p className="text-sm font-semibold text-[var(--primary)]">
              {fiches.length === 0 ? "Aucune fiche enregistrée" : "Aucun résultat"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {fiches.length === 0
                ? "Génère une fiche depuis l'onglet Fiches puis clique sur « Enregistrer la fiche générée »."
                : "Essaie un autre mot-clé."}
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {resultats.map((fiche) => (
              <li key={fiche.id} className="cami-card flex flex-col gap-2 p-4">
                <div className="flex items-start gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[var(--primary)]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => ouvrir(fiche)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-[var(--primary)]">
                      {fiche.titre}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatDate(fiche.created_at)}
                    </p>
                  </button>
                </div>

                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {extraitResume(fiche.markdown)}
                </p>

                {fiche.lien ? (
                  <a
                    href={fiche.lien}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 truncate text-[11px] text-[var(--info)] hover:underline"
                  >
                    <Link2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{fiche.lien}</span>
                  </a>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => ouvrir(fiche)}
                    className="cami-btn min-h-9 text-xs"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Ouvrir
                  </button>
                  <CopyButton value={fiche.markdown} label="Copier" />
                  <button
                    type="button"
                    onClick={() => suppression.mutate(fiche.id)}
                    disabled={suppression.isPending}
                    aria-label={`Supprimer « ${fiche.titre} »`}
                    title="Supprimer"
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-[var(--coral)] disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
