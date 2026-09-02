import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarClock, FileText, Images, Loader2, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StudioTabs } from "@/components/StudioTabs";
import { formatDateHeure, reseauInfo } from "@/lib/studio";
import { statsStudio } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/studio/statistiques")({
  head: () => ({
    meta: [
      { title: "Studio — Statistiques d'activité | Studio Cami IA" },
      {
        name: "description",
        content:
          "Suis ton rythme de production : contenus créés, publiés, répartition par réseau et régularité.",
      },
      { property: "og:title", content: "Studio — Statistiques d'activité" },
      {
        property: "og:description",
        content: "Ton activité de création de contenu, en un coup d'œil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioStatistiquesPage,
});

function Compteur({
  icone: Icone,
  valeur,
  label,
}: {
  icone: typeof FileText;
  valeur: number | string;
  label: string;
}) {
  return (
    <div className="cami-card flex items-center gap-3 p-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-[var(--coral)]">
        <Icone className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-none text-primary">{valeur}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function StudioStatistiquesPage() {
  const fetchStats = useServerFn(statsStudio);
  const { data, isLoading } = useQuery({
    queryKey: ["studio-stats"],
    queryFn: () => fetchStats(),
  });

  const panneau = (
    <div className="flex flex-col gap-3 max-lg:p-4">
      <h2 className="font-display text-sm font-bold text-primary">Prochaine publication</h2>
      {data?.prochaine ? (
        <div className="rounded-2xl border border-border bg-card p-3">
          <span
            className="text-[10px] font-bold uppercase tracking-wide"
            style={{ color: reseauInfo(data.prochaine.reseau).couleur }}
          >
            {reseauInfo(data.prochaine.reseau).label}
          </span>
          <p className="mt-1 text-xs font-semibold text-primary">{data.prochaine.titre}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {formatDateHeure(data.prochaine.date)}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Rien de planifié pour l'instant. Utilise le calendrier pour poser une date.
        </p>
      )}

      {data && data.parTag.length > 0 ? (
        <>
          <h2 className="mt-2 font-display text-sm font-bold text-primary">Thèmes récurrents</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.parTag.map((tag) => (
              <span
                key={tag.tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary"
              >
                #{tag.tag} · {tag.total}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">
              Statistiques
            </h1>
            <p className="text-xs text-muted-foreground lg:text-sm">
              Ton activité de création dans l'app, pas les chiffres des réseaux.
            </p>
          </div>
          <StudioTabs />
        </header>

        {isLoading || !data ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Calcul de tes statistiques…
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Compteur icone={FileText} valeur={data.total} label="Contenus créés" />
              <Compteur icone={Send} valeur={data.publies} label="Publiés" />
              <Compteur icone={CalendarClock} valeur={data.planifies} label="Planifiés" />
              <Compteur icone={Images} valeur={data.medias} label="Médias" />
            </section>

            <section className="cami-card p-4">
              <h2 className="font-display text-sm font-bold text-primary">
                Rythme des 12 dernières semaines
              </h2>
              <div className="mt-3 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.parSemaine}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="semaine" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="publies"
                      name="Publiés"
                      stroke="var(--coral)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="planifies"
                      name="Planifiés"
                      stroke="var(--info)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="cami-card p-4">
                <h2 className="font-display text-sm font-bold text-primary">
                  Répartition par réseau
                </h2>
                {data.parReseau.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Aucun contenu enregistré pour l'instant.
                  </p>
                ) : (
                  <div className="mt-3 h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.parReseau}
                          dataKey="total"
                          nameKey="label"
                          innerRadius={45}
                          outerRadius={80}
                        >
                          {data.parReseau.map((entree) => (
                            <Cell key={entree.reseau} fill={entree.couleur} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="cami-card p-4">
                <h2 className="font-display text-sm font-bold text-primary">Thèmes les plus utilisés</h2>
                {data.parTag.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Ajoute des hashtags à tes contenus pour voir apparaître tes thèmes.
                  </p>
                ) : (
                  <div className="mt-3 h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.parTag} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                        <YAxis
                          type="category"
                          dataKey="tag"
                          width={90}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip />
                        <Bar dataKey="total" fill="var(--violet)" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </div>

            <section className="cami-card p-4">
              <h2 className="font-display text-sm font-bold text-primary">Régularité du mois</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Tu as publié {data.joursPublies} jour{data.joursPublies > 1 ? "s" : ""} sur{" "}
                {data.joursDuMois} ce mois-ci.
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-[var(--coral)] transition-all"
                  style={{
                    width: `${Math.round((data.joursPublies / Math.max(data.joursDuMois, 1)) * 100)}%`,
                  }}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
