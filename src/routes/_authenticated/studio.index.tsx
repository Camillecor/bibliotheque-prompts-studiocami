import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StudioTabs } from "@/components/StudioTabs";
import { CopyButton } from "@/components/CopyButton";
import {
  RESEAUX,
  STATUTS,
  TONS_POST,
  VARIANTES,
  formatDateHeure,
  reseauInfo,
  statutLabel,
  type ContenuRow,
  type ReseauValue,
  type StatutValue,
} from "@/lib/studio";
import {
  deleteContenu,
  listContenus,
  listMedias,
  redigerContenu,
  reecrireContenu,
  saveContenu,
} from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/studio/")({
  validateSearch: (search: Record<string, unknown>) => ({
    contenu: typeof search["contenu"] === "string" ? (search["contenu"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Studio — Production de contenu | Studio Cami IA" },
      {
        name: "description",
        content:
          "Rédige tes publications avec Mario, associe tes visuels et planifie-les, le tout au même endroit.",
      },
      { property: "og:title", content: "Studio — Production de contenu" },
      {
        property: "og:description",
        content: "Rédaction assistée, médias et planification dans Studio Cami IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioContenusPage,
});

type Brouillon = {
  id?: string;
  titre: string;
  texte: string;
  reseau: ReseauValue;
  statut: StatutValue;
  tags: string[];
  datePlanifiee: string; // valeur d'input datetime-local
  mediaIds: string[];
};

const BROUILLON_VIDE: Brouillon = {
  titre: "",
  texte: "",
  reseau: "linkedin",
  statut: "brouillon",
  tags: [],
  datePlanifiee: "",
  mediaIds: [],
};

function isoVersInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const p = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

function inputVersIso(valeur: string) {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function StudioContenusPage() {
  const queryClient = useQueryClient();
  const [brouillon, setBrouillon] = useState<Brouillon>(BROUILLON_VIDE);
  const [idee, setIdee] = useState("");
  const [ton, setTon] = useState<string>("professionnel");
  const [nouveauTag, setNouveauTag] = useState("");
  const [selecteurMedias, setSelecteurMedias] = useState(false);

  const fetchContenus = useServerFn(listContenus);
  const fetchMedias = useServerFn(listMedias);
  const enregistrer = useServerFn(saveContenu);
  const supprimer = useServerFn(deleteContenu);
  const rediger = useServerFn(redigerContenu);
  const reecrire = useServerFn(reecrireContenu);

  const { data: contenus = [], isLoading } = useQuery({
    queryKey: ["studio-contenus"],
    queryFn: () => fetchContenus(),
  });
  const { data: medias = [] } = useQuery({
    queryKey: ["studio-medias"],
    queryFn: () => fetchMedias(),
  });

  const reseau = reseauInfo(brouillon.reseau);
  const longueur = brouillon.texte.length;
  const depassement = longueur > reseau.limite;

  const mediasChoisis = useMemo(
    () =>
      brouillon.mediaIds
        .map((id) => medias.find((m) => m.id === id))
        .filter((m): m is (typeof medias)[number] => Boolean(m)),
    [brouillon.mediaIds, medias],
  );

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["studio-contenus"] });
    void queryClient.invalidateQueries({ queryKey: ["studio-stats"] });
  };

  const mutationEnregistrer = useMutation({
    mutationFn: async (valeurs: Brouillon) =>
      enregistrer({
        data: {
          ...(valeurs.id ? { id: valeurs.id } : {}),
          titre: valeurs.titre || valeurs.texte.split("\n")[0]?.slice(0, 120) || "Sans titre",
          texte: valeurs.texte,
          reseau: valeurs.reseau,
          statut: valeurs.datePlanifiee && valeurs.statut === "brouillon" ? "planifie" : valeurs.statut,
          tags: valeurs.tags,
          date_planifiee: inputVersIso(valeurs.datePlanifiee),
          date_publication: null,
          prompt_id: null,
          media_ids: valeurs.mediaIds,
        },
      }),
    onSuccess: (resultat) => {
      setBrouillon((etat) => ({ ...etat, id: resultat.id }));
      invalider();
      toast.success("Contenu enregistré");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationSupprimer = useMutation({
    mutationFn: async (id: string) => supprimer({ data: { id } }),
    onSuccess: (_r, id) => {
      if (brouillon.id === id) setBrouillon(BROUILLON_VIDE);
      invalider();
      toast.success("Contenu supprimé");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationRediger = useMutation({
    mutationFn: async () =>
      rediger({ data: { idee, reseau: brouillon.reseau, ton, consignes: "" } }),
    onSuccess: (resultat) => {
      setBrouillon((etat) => ({
        ...etat,
        titre: etat.titre || resultat.titre,
        texte: resultat.texte,
        tags: etat.tags.length > 0 ? etat.tags : resultat.tags,
      }));
      toast.success("Mario a rédigé une proposition");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationVariante = useMutation({
    mutationFn: async (variante: string) =>
      reecrire({ data: { texte: brouillon.texte, reseau: brouillon.reseau, variante: variante as "raccourcir" } }),
    onSuccess: (resultat) => {
      setBrouillon((etat) => ({ ...etat, texte: resultat.texte }));
      toast.success("Nouvelle version proposée");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const chargerContenu = (contenu: ContenuRow) => {
    setBrouillon({
      id: contenu.id,
      titre: contenu.titre,
      texte: contenu.texte,
      reseau: contenu.reseau as ReseauValue,
      statut: contenu.statut as StatutValue,
      tags: contenu.tags ?? [],
      datePlanifiee: isoVersInput(contenu.date_planifiee),
      mediaIds: contenu.medias.map((m) => m.id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ajouterTag = () => {
    const propre = nouveauTag.trim().toLowerCase().replace(/^#/, "");
    if (!propre || brouillon.tags.includes(propre) || brouillon.tags.length >= 8) return;
    setBrouillon((etat) => ({ ...etat, tags: [...etat.tags, propre] }));
    setNouveauTag("");
  };

  useEffect(() => {
    if (!selecteurMedias) return;
    const fermer = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelecteurMedias(false);
    };
    window.addEventListener("keydown", fermer);
    return () => window.removeEventListener("keydown", fermer);
  }, [selecteurMedias]);

  // Ouverture directe d'un contenu depuis le calendrier (/studio?contenu=id)
  const { contenu: contenuDemande } = Route.useSearch();
  const navigate = Route.useNavigate();
  useEffect(() => {
    if (!contenuDemande) return;
    const cible = contenus.find((c) => c.id === contenuDemande);
    if (!cible) return;
    chargerContenu(cible);
    void navigate({ search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contenuDemande, contenus]);

  const panneau = (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-primary">Mes contenus</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
          {contenus.length}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
        </div>
      ) : contenus.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Aucun contenu pour l'instant. Décris une idée et laisse Mario rédiger.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto pr-1">
          {contenus.map((contenu) => {
            const info = reseauInfo(contenu.reseau);
            return (
              <li key={contenu.id}>
                <div
                  className={[
                    "group rounded-2xl border p-3 transition",
                    brouillon.id === contenu.id
                      ? "border-[var(--coral)] bg-card"
                      : "border-border bg-card hover:border-[var(--info)]",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => chargerContenu(contenu)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                      <span style={{ color: info.couleur }}>{info.label}</span>
                      <span className="text-muted-foreground">· {statutLabel(contenu.statut)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold text-primary">
                      {contenu.titre || "Sans titre"}
                    </p>
                    {contenu.date_planifiee ? (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatDateHeure(contenu.date_planifiee)}
                      </p>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => mutationSupprimer.mutate(contenu.id)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">Studio</h1>
              <p className="text-xs text-muted-foreground lg:text-sm">
                Rédige, illustre et planifie tes publications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBrouillon(BROUILLON_VIDE)}
              className="cami-btn-secondary flex-nowrap whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Nouveau contenu
            </button>
          </div>
          <StudioTabs />
        </header>

        {/* Rédaction assistée */}
        <section className="cami-card p-4">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
            <Sparkles className="h-4 w-4 text-[var(--coral)]" /> Mario rédige pour toi
          </h2>
          <textarea
            value={idee}
            onChange={(event) => setIdee(event.target.value)}
            rows={2}
            placeholder="Ton idée : « retour d'expérience sur l'automatisation de ma facturation »"
            className="mt-3 w-full resize-none rounded-2xl border border-border bg-muted p-3 text-sm text-primary outline-none focus:border-[var(--info)]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={ton}
              onChange={(event) => setTon(event.target.value)}
              className="cami-select"
            >
              {TONS_POST.map((option) => (
                <option key={option.value} value={option.value}>
                  Ton {option.label.toLowerCase()}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={idee.trim().length < 5 || mutationRediger.isPending}
              onClick={() => mutationRediger.mutate()}
              className="cami-btn-secondary flex-nowrap whitespace-nowrap disabled:pointer-events-none disabled:opacity-50"
            >
              {mutationRediger.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Générer le post
            </button>
          </div>
        </section>

        {/* Éditeur */}
        <section className="cami-card flex flex-col gap-4 p-4">
          <input
            value={brouillon.titre}
            onChange={(event) => setBrouillon((etat) => ({ ...etat, titre: event.target.value }))}
            placeholder="Titre interne"
            className="w-full rounded-2xl border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-primary outline-none focus:border-[var(--info)]"
          />

          <div className="flex flex-wrap gap-2">
            {RESEAUX.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBrouillon((etat) => ({ ...etat, reseau: option.value }))}
                className={[
                  "min-h-11 rounded-full border px-3 text-xs font-semibold transition sm:min-h-9",
                  brouillon.reseau === option.value
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-primary hover:border-[var(--coral)]",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div>
            <textarea
              value={brouillon.texte}
              onChange={(event) => setBrouillon((etat) => ({ ...etat, texte: event.target.value }))}
              rows={12}
              placeholder="Écris ton post ici, ou laisse Mario proposer une première version."
              className="w-full resize-y rounded-2xl border border-border bg-muted p-3 text-sm leading-relaxed text-primary outline-none focus:border-[var(--info)]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span
                className={[
                  "text-[11px] font-semibold",
                  depassement ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}
              >
                {longueur} / {reseau.limite} caractères
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={brouillon.texte} />
                {VARIANTES.map((variante) => (
                  <button
                    key={variante.value}
                    type="button"
                    disabled={brouillon.texte.trim().length < 10 || mutationVariante.isPending}
                    onClick={() => mutationVariante.mutate(variante.value)}
                    className="min-h-11 rounded-full border border-border bg-card px-3 text-xs font-semibold text-primary transition hover:border-[var(--coral)] hover:text-[var(--coral)] disabled:pointer-events-none disabled:opacity-50 sm:min-h-9"
                  >
                    {variante.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Hashtags
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {brouillon.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    aria-label={`Retirer ${tag}`}
                    onClick={() =>
                      setBrouillon((etat) => ({
                        ...etat,
                        tags: etat.tags.filter((t) => t !== tag),
                      }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={nouveauTag}
                onChange={(event) => setNouveauTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    ajouterTag();
                  }
                }}
                placeholder="Ajouter un hashtag"
                className="min-h-11 rounded-full border border-border bg-muted px-3 text-xs text-primary outline-none focus:border-[var(--info)] sm:min-h-9"
              />
            </div>
          </div>

          {/* Médias liés */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Visuels
              </p>
              <button
                type="button"
                onClick={() => setSelecteurMedias((etat) => !etat)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--info)]"
              >
                <ImagePlus className="h-4 w-4" />
                {selecteurMedias ? "Fermer" : "Choisir dans mes médias"}
              </button>
            </div>

            {mediasChoisis.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {mediasChoisis.map((media) => (
                  <div key={media.id} className="relative">
                    <img
                      src={media.url}
                      alt={media.titre || "Visuel"}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Retirer le visuel"
                      onClick={() =>
                        setBrouillon((etat) => ({
                          ...etat,
                          mediaIds: etat.mediaIds.filter((id) => id !== media.id),
                        }))
                      }
                      className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {selecteurMedias ? (
              medias.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Ta bibliothèque de médias est vide. Ajoute des images depuis l'onglet Médias.
                </p>
              ) : (
                <div className="mt-2 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                  {medias.map((media) => {
                    const choisi = brouillon.mediaIds.includes(media.id);
                    return (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() =>
                          setBrouillon((etat) => ({
                            ...etat,
                            mediaIds: choisi
                              ? etat.mediaIds.filter((id) => id !== media.id)
                              : [...etat.mediaIds, media.id].slice(0, 6),
                          }))
                        }
                        className={[
                          "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                          choisi ? "border-[var(--coral)]" : "border-transparent",
                        ].join(" ")}
                      >
                        <img
                          src={media.url}
                          alt={media.titre || "Visuel"}
                          className="h-full w-full object-cover"
                        />
                        {choisi ? (
                          <CheckCircle2 className="absolute right-1 top-1 h-4 w-4 text-[var(--coral)]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )
            ) : null}
          </div>

          {/* Planification */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Date de publication prévue
              </span>
              <input
                type="datetime-local"
                value={brouillon.datePlanifiee}
                onChange={(event) =>
                  setBrouillon((etat) => ({ ...etat, datePlanifiee: event.target.value }))
                }
                className="min-h-11 rounded-2xl border border-border bg-muted px-3 text-sm text-primary outline-none focus:border-[var(--info)]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Statut
              </span>
              <select
                value={brouillon.statut}
                onChange={(event) =>
                  setBrouillon((etat) => ({ ...etat, statut: event.target.value as StatutValue }))
                }
                className="min-h-11 rounded-2xl border border-border bg-muted px-3 text-sm text-primary outline-none focus:border-[var(--info)]"
              >
                {STATUTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            disabled={brouillon.texte.trim().length === 0 || mutationEnregistrer.isPending}
            onClick={() => mutationEnregistrer.mutate(brouillon)}
            className="cami-btn-primary-full flex-nowrap whitespace-nowrap disabled:pointer-events-none disabled:opacity-50"
          >
            {mutationEnregistrer.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {brouillon.id ? "Mettre à jour le contenu" : "Enregistrer le contenu"}
          </button>
        </section>
      </div>
    </AppShell>
  );
}
