import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StudioTabs } from "@/components/StudioTabs";
import { cleJour, formatDateHeure, reseauInfo, type ContenuRow } from "@/lib/studio";
import { changerStatutContenu, listContenus, planifierContenu } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/studio/calendrier")({
  head: () => ({
    meta: [
      { title: "Studio — Calendrier éditorial | Studio Cami IA" },
      {
        name: "description",
        content:
          "Visualise ton mois de publication, glisse tes contenus sur une date et marque-les comme publiés.",
      },
      { property: "og:title", content: "Studio — Calendrier éditorial" },
      {
        property: "og:description",
        content: "Un calendrier relié à tes contenus pour tenir ta régularité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioCalendrierPage,
});

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function grilleDuMois(reference: Date) {
  const premier = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const debut = new Date(premier);
  debut.setDate(premier.getDate() - ((premier.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, index) => {
    const jour = new Date(debut);
    jour.setDate(debut.getDate() + index);
    return jour;
  });
}

function StudioCalendrierPage() {
  const queryClient = useQueryClient();
  const [mois, setMois] = useState(() => new Date());
  const [glisse, setGlisse] = useState<string | null>(null);

  const fetchContenus = useServerFn(listContenus);
  const planifier = useServerFn(planifierContenu);
  const changerStatut = useServerFn(changerStatutContenu);

  const { data: contenus = [], isLoading } = useQuery({
    queryKey: ["studio-contenus"],
    queryFn: () => fetchContenus(),
  });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["studio-contenus"] });
    void queryClient.invalidateQueries({ queryKey: ["studio-stats"] });
  };

  const mutationPlanifier = useMutation({
    mutationFn: async (input: { id: string; date_planifiee: string | null }) =>
      planifier({ data: input }),
    onSuccess: () => {
      invalider();
      toast.success("Contenu planifié");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationPublier = useMutation({
    mutationFn: async (id: string) => changerStatut({ data: { id, statut: "publie" } }),
    onSuccess: () => {
      invalider();
      toast.success("Marqué comme publié");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const parJour = useMemo(() => {
    const carte = new Map<string, ContenuRow[]>();
    for (const contenu of contenus) {
      if (!contenu.date_planifiee) continue;
      const cle = cleJour(new Date(contenu.date_planifiee));
      carte.set(cle, [...(carte.get(cle) ?? []), contenu]);
    }
    return carte;
  }, [contenus]);

  const aPlanifier = contenus.filter((c) => !c.date_planifiee && c.statut !== "publie");
  const jours = grilleDuMois(mois);
  const aujourdhui = cleJour(new Date());

  const deposer = (jour: Date) => {
    if (!glisse) return;
    const date = new Date(jour);
    date.setHours(9, 0, 0, 0);
    mutationPlanifier.mutate({ id: glisse, date_planifiee: date.toISOString() });
    setGlisse(null);
  };

  const panneau = (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-sm font-bold text-primary">À planifier</h2>
      {aPlanifier.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Tout est planifié. Crée un contenu depuis l'onglet Contenus.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {aPlanifier.map((contenu) => {
            const info = reseauInfo(contenu.reseau);
            return (
              <li
                key={contenu.id}
                draggable
                onDragStart={() => setGlisse(contenu.id)}
                onDragEnd={() => setGlisse(null)}
                className="cursor-grab rounded-2xl border border-border bg-card p-3 active:cursor-grabbing"
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: info.couleur }}
                >
                  {info.label}
                </span>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-primary">
                  {contenu.titre || "Sans titre"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[11px] text-muted-foreground">
        Astuce : fais glisser une carte sur une date du calendrier pour la planifier à 9 h.
      </p>
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">
                Calendrier
              </h1>
              <p className="text-xs text-muted-foreground lg:text-sm">
                Ton mois de publication, relié à tes contenus.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Mois précédent"
                onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() - 1, 1))}
                className="cami-icon-btn"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-40 text-center text-sm font-bold capitalize text-primary">
                {mois.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </span>
              <button
                type="button"
                aria-label="Mois suivant"
                onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() + 1, 1))}
                className="cami-icon-btn"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <StudioTabs />
        </header>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement du calendrier…
          </div>
        ) : (
          <div className="cami-card overflow-hidden p-3 sm:p-4">
            <div className="grid grid-cols-7 gap-1.5 pb-2">
              {JOURS.map((jour) => (
                <div
                  key={jour}
                  className="text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                >
                  {jour}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {jours.map((jour) => {
                const cle = cleJour(jour);
                const duMois = jour.getMonth() === mois.getMonth();
                const items = parJour.get(cle) ?? [];
                return (
                  <div
                    key={cle}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => deposer(jour)}
                    className={[
                      "min-h-28 rounded-xl border p-2 transition",
                      duMois ? "border-border bg-card" : "border-transparent bg-muted/40",
                      glisse ? "hover:border-[var(--coral)]" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                        cle === aujourdhui
                          ? "bg-[var(--coral)] text-white"
                          : duMois
                            ? "text-primary"
                            : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {jour.getDate()}
                    </span>
                    <div className="mt-1.5 flex flex-col gap-1.5">
                      {items.map((contenu) => {
                        const info = reseauInfo(contenu.reseau);
                        return (
                          <button
                            key={contenu.id}
                            type="button"
                            draggable
                            onDragStart={() => setGlisse(contenu.id)}
                            onDragEnd={() => setGlisse(null)}
                            onClick={() => setApercu(contenu)}
                            className="w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-[10px] font-semibold leading-tight text-white transition hover:opacity-90"
                            style={{ backgroundColor: info.couleur }}
                            title={`${contenu.titre} — ${formatDateHeure(contenu.date_planifiee ?? "")}`}
                          >
                            <span className="line-clamp-2 block">
                              {contenu.titre || "Sans titre"}
                            </span>
                            <span className="mt-0.5 block text-[9px] opacity-80">
                              {contenu.statut === "publie" ? "✓ publié" : "Voir l'aperçu"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {apercu ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-primary/30 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setApercu(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-[20px] border border-border bg-card p-5 sm:rounded-[20px] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: reseauInfo(apercu.reseau).couleur }}
                >
                  {reseauInfo(apercu.reseau).label} · {statutLabel(apercu.statut)}
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-primary">
                  {apercu.titre || "Sans titre"}
                </h2>
                {apercu.date_planifiee ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateHeure(apercu.date_planifiee)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Fermer l'aperçu"
                onClick={() => setApercu(null)}
                className="cami-icon-btn shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {apercu.medias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {apercu.medias.map((media) => (
                  <img
                    key={media.id}
                    src={media.url}
                    alt={media.titre || "Visuel du contenu"}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ))}
              </div>
            ) : null}

            <p className="whitespace-pre-wrap rounded-2xl border border-border bg-muted p-4 text-sm leading-relaxed text-primary">
              {apercu.texte || "Ce contenu n'a pas encore de texte."}
            </p>

            {apercu.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {apercu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/studio"
                search={{ contenu: apercu.id }}
                className="cami-btn flex-nowrap whitespace-nowrap"
              >
                <Pencil className="h-4 w-4" /> Modifier
              </Link>
              {apercu.statut !== "publie" ? (
                <button
                  type="button"
                  onClick={() => {
                    mutationPublier.mutate(apercu.id);
                    setApercu(null);
                  }}
                  className="cami-btn flex-nowrap whitespace-nowrap"
                >
                  <CheckCircle2 className="h-4 w-4" /> Marquer comme publié
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
