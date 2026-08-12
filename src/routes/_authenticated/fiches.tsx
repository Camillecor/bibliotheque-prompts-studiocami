import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import {
  genererFiche,
  ameliorerFiche,
  saveFiche,
  listFiches,
  deleteFiche,
  type FicheRow,
} from "@/lib/fiches.functions";


export const Route = createFileRoute("/_authenticated/fiches")({
  head: () => ({
    meta: [
      { title: "Fiches de reconstruction — Studio Cami IA" },
      {
        name: "description",
        content:
          "Envoie une capture, un lien ou une description d'une fonctionnalité et obtiens une fiche de reconstruction complète en huit sections.",
      },
      { property: "og:title", content: "Fiches de reconstruction — Studio Cami IA" },
      {
        property: "og:description",
        content: "Décortique une fonctionnalité et reconstruis-la avec ta stack.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichesPage,
});

type ImageJointe = { mediaType: "image/png" | "image/jpeg"; base64: string; previewUrl: string; name: string };
const MAX_IMAGES = 4;


/* ------------------------------------------------------------------ */
/* Rendu markdown minimal (titres, tableaux, listes, gras, code)       */
/* ------------------------------------------------------------------ */

function Inline({ texte }: { texte: string }) {
  const morceaux = texte.split(/(\*\*[^*]+\*\*|`[^`]+`|\[(?:Observé|Déduit|Hypothèse)\])/g);
  return (
    <>
      {morceaux.map((m, i) => {
        if (/^\*\*[^*]+\*\*$/.test(m))
          return (
            <strong key={i} className="font-semibold text-[var(--primary)]">
              {m.slice(2, -2)}
            </strong>
          );
        if (/^`[^`]+`$/.test(m))
          return (
            <code key={i} className="rounded bg-secondary px-1 py-0.5 text-[0.85em]">
              {m.slice(1, -1)}
            </code>
          );
        if (m === "[Observé]" || m === "[Déduit]" || m === "[Hypothèse]") {
          const couleur =
            m === "[Observé]" ? "var(--info)" : m === "[Déduit]" ? "var(--primary)" : "var(--coral)";
          return (
            <span
              key={i}
              className="mr-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: couleur, backgroundColor: `color-mix(in srgb, ${couleur} 12%, transparent)` }}
            >
              {m.slice(1, -1)}
            </span>
          );
        }
        return <span key={i}>{m}</span>;
      })}
    </>
  );
}

function cellules(ligne: string) {
  return ligne
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

const COULEURS_ETAPES = ["var(--coral)", "var(--info)", "var(--primary)", "var(--violet)"];

/** Rendu visuel du schéma des étapes : « Titre | Outil | Action | Durée » */
function SchemaEtapes({ items }: { items: string[] }) {
  return (
    <ol className="relative space-y-3">
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-3 bottom-3 hidden w-px bg-border sm:block"
      />
      {items.map((item, index) => {
        const parts = item.split("|").map((p) => p.trim());
        const titre = parts[0] ?? item;
        const outil = parts[1] ?? "";
        const action = parts[2] ?? "";
        const duree = parts[3] ?? "";
        const couleur = COULEURS_ETAPES[index % COULEURS_ETAPES.length] ?? "var(--primary)";
        return (
          <li key={index} className="relative flex gap-3">
            <span
              className="z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                color: couleur,
                backgroundColor: `color-mix(in srgb, ${couleur} 14%, white)`,
                border: `1px solid color-mix(in srgb, ${couleur} 30%, transparent)`,
              }}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[var(--primary)]">
                  <Inline texte={titre} />
                </p>
                {outil ? (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: couleur, backgroundColor: `color-mix(in srgb, ${couleur} 12%, transparent)` }}
                  >
                    {outil}
                  </span>
                ) : null}
                {duree ? (
                  <span className="ml-auto text-[11px] text-muted-foreground">{duree}</span>
                ) : null}
              </div>
              {action ? (
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                  <Inline texte={action} />
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function FicheMarkdown({ markdown }: { markdown: string }) {
  const lignes = markdown.split("\n");
  const blocs: React.ReactNode[] = [];
  let i = 0;
  let cle = 0;
  let sectionCourante = "";


  while (i < lignes.length) {
    const ligne = lignes[i] ?? "";

    if (!ligne.trim()) {
      i += 1;
      continue;
    }

    // Bloc de code
    if (ligne.trim().startsWith("```")) {
      const contenu: string[] = [];
      i += 1;
      while (i < lignes.length && !(lignes[i] ?? "").trim().startsWith("```")) {
        contenu.push(lignes[i] ?? "");
        i += 1;
      }
      i += 1;
      blocs.push(
        <pre
          key={cle++}
          className="overflow-x-auto rounded-2xl bg-[#030873] p-4 text-xs leading-relaxed text-white/90"
        >
          <code>{contenu.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Tableau
    if (ligne.trim().startsWith("|") && (lignes[i + 1] ?? "").includes("---")) {
      const entete = cellules(ligne);
      i += 2;
      const corps: string[][] = [];
      while (i < lignes.length && (lignes[i] ?? "").trim().startsWith("|")) {
        corps.push(cellules(lignes[i] ?? ""));
        i += 1;
      }
      blocs.push(
        <div key={cle++} className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-secondary">
              <tr>
                {entete.map((c, j) => (
                  <th key={j} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                    <Inline texte={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corps.map((r, j) => (
                <tr key={j} className="border-t border-border align-top">
                  {r.map((c, k) => (
                    <td key={k} className="px-3 py-2 text-sm text-foreground/90">
                      <Inline texte={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Titres
    const titre = /^(#{1,4})\s+(.*)$/.exec(ligne);
    if (titre) {
      const niveau = (titre[1] ?? "#").length;
      const texte = titre[2] ?? "";
      sectionCourante = texte;

      blocs.push(
        niveau <= 2 ? (
          <h2 key={cle++} className="mt-2 text-xl font-bold text-[var(--primary)]">
            {texte}
          </h2>
        ) : (
          <h3 key={cle++} className="text-base font-semibold text-[var(--primary)]">
            {texte}
          </h3>
        ),
      );
      i += 1;
      continue;
    }

    // Listes
    if (/^\s*([-*]|\d+\.)\s+/.test(ligne)) {
      const ordonnee = /^\s*\d+\.\s+/.test(ligne);
      const items: string[] = [];
      while (i < lignes.length && /^\s*([-*]|\d+\.)\s+/.test(lignes[i] ?? "")) {
        items.push((lignes[i] ?? "").replace(/^\s*([-*]|\d+\.)\s+/, ""));
        i += 1;
      }
      if (ordonnee && /SCH[ÉE]MA DES [ÉE]TAPES/i.test(sectionCourante)) {
        blocs.push(<SchemaEtapes key={cle++} items={items} />);
        continue;
      }
      const Liste = ordonnee ? "ol" : "ul";

      blocs.push(
        <Liste
          key={cle++}
          className={[
            "space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90",
            ordonnee ? "list-decimal" : "list-disc",
          ].join(" ")}
        >
          {items.map((it, j) => (
            <li key={j}>
              <Inline texte={it} />
            </li>
          ))}
        </Liste>,
      );
      continue;
    }

    // Paragraphe
    const para: string[] = [];
    while (
      i < lignes.length &&
      (lignes[i] ?? "").trim() &&
      !/^(#{1,4})\s/.test(lignes[i] ?? "") &&
      !/^\s*([-*]|\d+\.)\s+/.test(lignes[i] ?? "") &&
      !(lignes[i] ?? "").trim().startsWith("|") &&
      !(lignes[i] ?? "").trim().startsWith("```")
    ) {
      para.push(lignes[i] ?? "");
      i += 1;
    }
    blocs.push(
      <p key={cle++} className="text-sm leading-relaxed text-foreground/90">
        <Inline texte={para.join(" ")} />
      </p>,
    );
  }

  return <div className="space-y-4">{blocs}</div>;
}

/* ------------------------------------------------------------------ */

function FichesPage() {
  const [description, setDescription] = useState("");
  const [lien, setLien] = useState("");
  const [image, setImage] = useState<ImageJointe | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [ficheEnregistreeId, setFicheEnregistreeId] = useState<string | null>(null);
  const inputFichier = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const appelFiche = useServerFn(genererFiche);
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof genererFiche>[0]) => appelFiche(payload),
    onSuccess: (res) => {
      setMarkdown(res.markdown);
      setFicheEnregistreeId(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const fetchFiches = useServerFn(listFiches);
  const { data: fiches = [] } = useQuery({
    queryKey: ["fiches"],
    queryFn: () => fetchFiches(),
  });

  const enregistrerServeur = useServerFn(saveFiche);
  const enregistrement = useMutation({
    mutationFn: (input: { titre: string; description: string; lien: string; markdown: string }) =>
      enregistrerServeur({ data: input }),
    onSuccess: (row) => {
      toast.success("Fiche enregistrée.");
      setFicheEnregistreeId(row.id);
      queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const suppressionServeur = useServerFn(deleteFiche);
  const suppression = useMutation({
    mutationFn: (id: string) => suppressionServeur({ data: { id } }),
    onSuccess: (_res, id) => {
      toast.success("Fiche supprimée.");
      if (ficheEnregistreeId === id) setFicheEnregistreeId(null);
      queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function enregistrerFiche() {
    const titre =
      description.trim().slice(0, 80) || lien.trim() || "Fiche sans titre";
    enregistrement.mutate({ titre, description: description.trim(), lien: lien.trim(), markdown });
  }

  function chargerFiche(fiche: FicheRow) {
    setDescription(fiche.description);
    setLien(fiche.lien);
    setImage(null);
    setMarkdown(fiche.markdown);
    setFicheEnregistreeId(fiche.id);
  }

  function nouvelleFiche() {
    setDescription("");
    setLien("");
    setImage(null);
    setMarkdown("");
    setFicheEnregistreeId(null);
  }

  const fichesRecentes = useMemo(() => fiches.slice(0, 20), [fiches]);

  async function joindreImage(file: File | undefined) {
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.error("Formats acceptés : PNG ou JPG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop lourde (5 Mo maximum).");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
      reader.readAsDataURL(file);
    });
    setImage({
      mediaType: file.type as "image/png" | "image/jpeg",
      base64: dataUrl.split(",")[1] ?? "",
      previewUrl: dataUrl,
      name: file.name,
    });
  }

  function lancer() {
    if (!description.trim() && !lien.trim() && !image) {
      toast.error("Ajoute au moins une description, un lien ou une capture.");
      return;
    }
    mutation.mutate({
      data: {
        description: description.trim(),
        lien: lien.trim(),
        ...(image ? { image: { mediaType: image.mediaType, base64: image.base64 } } : {}),
      },
    } as Parameters<typeof genererFiche>[0]);
  }

  const panneau = (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm font-semibold text-[var(--primary)]">Comment ça marche</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Envoie ce qui t'a marquée : une capture d'écran, un lien, ou juste une description.
          Tu récupères une fiche en huit sections pour reconstruire le mécanisme avec ta stack
          (React, Lovable, Claude API, Make, Notion, Supabase).
        </p>
      </div>
      <div className="space-y-2 rounded-2xl bg-secondary p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
          Étiquettes
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-[var(--info)]">Observé</span> : visible dans ce que
          tu envoies.
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-[var(--primary)]">Déduit</span> : conséquence
          logique.
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-[var(--coral)]">Hypothèse</span> : pari raisonnable,
          à vérifier.
        </p>
      </div>

      {fichesRecentes.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            Mes fiches
          </p>
          <ul className="space-y-0.5">
            {fichesRecentes.map((fiche) => (
              <li key={fiche.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => chargerFiche(fiche)}
                  className="min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-left text-xs text-primary transition hover:bg-secondary"
                  title={fiche.titre}
                >
                  {fiche.titre}
                </button>
                <button
                  type="button"
                  onClick={() => suppression.mutate(fiche.id)}
                  aria-label={`Supprimer « ${fiche.titre} »`}
                  title="Supprimer"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition hover:text-[var(--coral)] focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto w-full max-w-[900px] px-4 py-6 lg:px-8 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-[var(--primary)]">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[var(--primary)]">Fiches de reconstruction</h1>
              <p className="text-xs text-muted-foreground">
                Une fonctionnalité observée, un plan pour la rebâtir toi-même.
              </p>
            </div>
          </div>
          <button type="button" onClick={nouvelleFiche} className="cami-btn min-h-11">
            <Plus className="h-4 w-4" />
            Nouvelle fiche
          </button>
        </header>

        <section className="cami-card mt-6 space-y-4 p-4 lg:p-5">
          <div className="space-y-1.5">
            <label htmlFor="fiche-description" className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              La fonctionnalité qui t'a marquée
            </label>
            <textarea
              id="fiche-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Ex : dans cet outil, dès que je colle une URL, il pré-remplit tout seul le titre, le résumé et les tags de ma fiche."
              className="w-full resize-y rounded-2xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-[var(--info)]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="fiche-lien" className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Lien (optionnel)
              </label>
              <input
                id="fiche-lien"
                value={lien}
                onChange={(e) => setLien(e.target.value)}
                placeholder="https://…"
                className="min-h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--info)]"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Capture d'écran (optionnelle)
              </span>
              <input
                ref={inputFichier}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  void joindreImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {image ? (
                <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-card px-3">
                  <img src={image.previewUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {image.name}
                  </span>
                  <button
                    type="button"
                    aria-label="Retirer la capture"
                    onClick={() => setImage(null)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputFichier.current?.click()}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-3 text-sm font-medium text-[var(--primary)] hover:bg-secondary"
                >
                  <ImagePlus className="h-4 w-4" />
                  Joindre une capture
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={lancer}
            disabled={mutation.isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyse en cours…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer la fiche
              </>
            )}
          </button>
        </section>

        {markdown ? (
          <section className="cami-card mt-6 p-4 lg:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--primary)]">Ta fiche</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={enregistrerFiche}
                  disabled={enregistrement.isPending || ficheEnregistreeId !== null}
                  className="cami-btn min-h-9 disabled:opacity-60"
                >
                  {ficheEnregistreeId ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      Enregistrée
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      {enregistrement.isPending ? "Enregistrement…" : "Enregistrer"}
                    </>
                  )}
                </button>
                <CopyButton value={markdown} label="Copier la fiche" />
              </div>
            </div>
            <FicheMarkdown markdown={markdown} />
          </section>
        ) : (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            La fiche s'affichera ici : une phrase de synthèse, la grille des six couches, le
            mécanisme clé, la reconstruction dans ta stack, les trois paliers, l'atelier, les
            prompts et les usages chez toi.
          </p>
        )}
      </div>
    </AppShell>
  );
}
