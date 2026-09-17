import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, ImageIcon, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { StudioModeTabs } from "@/components/StudioModeTabs";
import { EnTetePage } from "@/components/EnTetePage";
import { FORMATS_CREATION, MODELES, formatCreation } from "@/lib/creation";
import {
  createCreation,
  deleteCreation,
  duplicateCreation,
  listCreations,
  renameCreation,
} from "@/lib/creation.functions";

export const Route = createFileRoute("/_authenticated/studio/creation/")({
  head: () => ({
    meta: [
      { title: "Studio — Création de visuels | Studio Cami IA" },
      {
        name: "description",
        content:
          "Compose tes visuels de publication : textes, logos, formes et couleurs, entièrement personnalisables.",
      },
      { property: "og:title", content: "Studio — Création de visuels" },
      {
        property: "og:description",
        content: "Un atelier de visuels 100 % personnalisable dans Studio Cami IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalerieCreations,
});

function formatDate(valeur: string) {
  return new Date(valeur).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function GalerieCreations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ouvrirNouveau, setOuvrirNouveau] = useState(false);
  const [modele, setModele] = useState(MODELES[0]!.value);
  const [format, setFormat] = useState<string>(MODELES[0]!.format);

  const fetchListe = useServerFn(listCreations);
  const fnCreate = useServerFn(createCreation);
  const fnDelete = useServerFn(deleteCreation);
  const fnDuplicate = useServerFn(duplicateCreation);
  const fnRename = useServerFn(renameCreation);

  const { data: creations = [], isPending } = useQuery({
    queryKey: ["creations"],
    queryFn: () => fetchListe(),
  });

  const rafraichir = () => queryClient.invalidateQueries({ queryKey: ["creations"] });

  const creer = useMutation({
    mutationFn: async () => {
      const choix = MODELES.find((m) => m.value === modele) ?? MODELES[0]!;
      const dims = formatCreation(format);
      return fnCreate({
        data: {
          nom: choix.value === "vierge" ? "Nouvelle création" : choix.label,
          format: dims.value,
          largeur: dims.largeur,
          hauteur: dims.hauteur,
          document: choix.construire(),
        },
      });
    },
    onSuccess: async ({ id }) => {
      await rafraichir();
      setOuvrirNouveau(false);
      void navigate({ to: "/studio/creation/$id", params: { id } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const supprimer = useMutation({
    mutationFn: (id: string) => fnDelete({ data: { id } }),
    onSuccess: async () => {
      await rafraichir();
      toast.success("Création supprimée.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const dupliquer = useMutation({
    mutationFn: (id: string) => fnDuplicate({ data: { id } }),
    onSuccess: async () => {
      await rafraichir();
      toast.success("Copie créée.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const renommer = useMutation({
    mutationFn: (variables: { id: string; nom: string }) => fnRename({ data: variables }),
    onSuccess: rafraichir,
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 lg:px-8">
        <StudioModeTabs />
        <EnTetePage
          titre="Création"
          description="Compose tes visuels : titres, logos, formes et couleurs, tout est réglable."
          actions={
            <Button
              type="button"
              onClick={() => setOuvrirNouveau((v) => !v)}
              className="h-10 rounded-lg bg-coral px-4 font-semibold text-primary-foreground hover:bg-coral/90"
            >
              <Plus className="h-4 w-4" />
              Nouvelle création
            </Button>
          }
        />

        {ouvrirNouveau ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div>
              <h2 className="text-base font-semibold text-primary">Modèle de départ</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Des compositions pensées pour les contenus IA et design.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MODELES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setModele(m.value);
                      setFormat(m.format);
                    }}
                    className={[
                      "min-h-20 rounded-lg border p-3 text-left transition",
                      modele === m.value
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-background text-primary hover:border-coral",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{m.description}</span>
                    <span className="mt-2 inline-flex rounded bg-muted px-1.5 py-1 text-[10px] font-semibold text-muted-foreground">
                      {m.categorie} · {m.format}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Format</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORMATS_CREATION.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={[
                      "h-10 rounded-lg px-3 text-sm font-medium transition",
                      format === f.value
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-primary hover:border-[var(--coral)]",
                    ].join(" ")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              onClick={() => creer.mutate()}
              disabled={creer.isPending}
              className="h-10 rounded-lg px-5 font-semibold"
            >
              {creer.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Créer et ouvrir
            </Button>
          </section>
        ) : null}

        {isPending ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : creations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucune création pour le moment. Clique sur « Nouvelle création » pour démarrer.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creations.map((creation) => (
              <article
                key={creation.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <Link
                  to="/studio/creation/$id"
                  params={{ id: creation.id }}
                  className="flex aspect-video items-center justify-center bg-muted"
                >
                  {creation.apercu ? (
                    <img
                      src={creation.apercu}
                      alt={creation.nom}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </Link>
                <div className="space-y-2 p-3">
                  <input
                    defaultValue={creation.nom}
                    onBlur={(event) => {
                      const nom = event.target.value.trim();
                      if (nom && nom !== creation.nom) renommer.mutate({ id: creation.id, nom });
                    }}
                    className="w-full rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm font-semibold text-primary hover:border-border focus:border-border focus:outline-none"
                  />
                  <p className="px-1 text-xs text-muted-foreground">
                    {formatCreation(creation.format).label} · {formatDate(creation.updated_at)}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to="/studio/creation/$id"
                      params={{ id: creation.id }}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => dupliquer.mutate(creation.id)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-primary"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Dupliquer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Supprimer « ${creation.nom} » ?`))
                          supprimer.mutate(creation.id);
                      }}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
