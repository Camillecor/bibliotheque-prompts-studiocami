import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Search, Sparkles, Trash2, Upload, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StudioTabs } from "@/components/StudioTabs";
import { FORMATS_MEDIA, type MediaRow } from "@/lib/studio";
import { deleteMedia, listMedias, majMedia, uploadMedia } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/studio/medias")({
  head: () => ({
    meta: [
      { title: "Studio — Bibliothèque de médias | Studio Cami IA" },
      {
        name: "description",
        content:
          "Range tes images, retouche-les en quelques clics et génère des visuels par IA pour tes publications.",
      },
      { property: "og:title", content: "Studio — Bibliothèque de médias" },
      {
        property: "og:description",
        content: "Upload, retouches simples et visuels IA dans Studio Cami IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioMediasPage,
});

const TAILLE_MAX = 10 * 1024 * 1024;

function fichierVersBase64(fichier: File) {
  return new Promise<string>((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error("Lecture du fichier impossible."));
    lecteur.onload = () => {
      const resultat = String(lecteur.result ?? "");
      resolve(resultat.slice(resultat.indexOf(",") + 1));
    };
    lecteur.readAsDataURL(fichier);
  });
}

function dimensionsImage(source: string) {
  return new Promise<{ largeur: number; hauteur: number }>((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ largeur: image.naturalWidth, hauteur: image.naturalHeight });
    image.onerror = () => resolve({ largeur: 0, hauteur: 0 });
    image.src = source;
  });
}

function chargerImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Impossible de charger l'image."));
    image.src = url;
  });
}

type Retouche = {
  media: MediaRow;
  format: string;
  luminosite: number;
  contraste: number;
  saturation: number;
  rotation: number;
};

function StudioMediasPage() {
  const queryClient = useQueryClient();
  const [recherche, setRecherche] = useState("");
  const [promptIA, setPromptIA] = useState("");
  const [apercuIA, setApercuIA] = useState<{ url: string; final: boolean } | null>(null);
  const [generationEnCours, setGenerationEnCours] = useState(false);
  const [retouche, setRetouche] = useState<Retouche | null>(null);
  const [enTraitement, setEnTraitement] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputFichier = useRef<HTMLInputElement | null>(null);

  const fetchMedias = useServerFn(listMedias);
  const envoyer = useServerFn(uploadMedia);
  const mettreAJour = useServerFn(majMedia);
  const supprimer = useServerFn(deleteMedia);

  const { data: medias = [], isLoading } = useQuery({
    queryKey: ["studio-medias"],
    queryFn: () => fetchMedias(),
  });

  const invalider = () => {
    void queryClient.invalidateQueries({ queryKey: ["studio-medias"] });
    void queryClient.invalidateQueries({ queryKey: ["studio-stats"] });
  };

  const filtres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return medias;
    return medias.filter(
      (media) =>
        media.titre.toLowerCase().includes(terme) ||
        (media.tags ?? []).some((tag) => tag.toLowerCase().includes(terme)),
    );
  }, [medias, recherche]);

  type EntreeMedia = {
    mediaType: "image/png" | "image/jpeg" | "image/webp";
    base64: string;
    titre: string;
    tags: string[];
    largeur: number;
    hauteur: number;
    origine: "upload" | "retouche" | "ia";
    media_parent_id: string | null;
  };

  const mutationUpload = useMutation({
    mutationFn: async (input: EntreeMedia) => envoyer({ data: input }),
    onSuccess: () => {
      invalider();
      toast.success("Média ajouté");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationSupprimer = useMutation({
    mutationFn: async (id: string) => supprimer({ data: { id } }),
    onSuccess: () => {
      invalider();
      toast.success("Média supprimé");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mutationTitre = useMutation({
    mutationFn: async (input: { id: string; titre: string; tags: string[] }) =>
      mettreAJour({ data: input }),
    onSuccess: invalider,
    onError: (error: Error) => toast.error(error.message),
  });

  const gererFichiers = async (fichiers: FileList | null) => {
    if (!fichiers) return;
    for (const fichier of Array.from(fichiers).slice(0, 6)) {
      if (!fichier.type.startsWith("image/")) {
        toast.error(`${fichier.name} n'est pas une image.`);
        continue;
      }
      if (fichier.size > TAILLE_MAX) {
        toast.error(`${fichier.name} dépasse 10 Mo.`);
        continue;
      }
      const type =
        fichier.type === "image/png"
          ? "image/png"
          : fichier.type === "image/webp"
            ? "image/webp"
            : "image/jpeg";
      const base64 = await fichierVersBase64(fichier);
      const { largeur, hauteur } = await dimensionsImage(`data:${type};base64,${base64}`);
      await mutationUpload.mutateAsync({
        mediaType: type,
        base64,
        titre: fichier.name.replace(/\.[^.]+$/, "").slice(0, 120),
        tags: [],
        largeur,
        hauteur,
        origine: "upload",
        media_parent_id: null,
      });
    }
  };

  /* ---------------------------------------------------------------- IA */

  const genererVisuel = async () => {
    if (promptIA.trim().length < 5) return;
    setGenerationEnCours(true);
    setApercuIA(null);
    try {
      const reponse = await fetch("/api/studio-visuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptIA }),
      });
      if (!reponse.ok || !reponse.body) {
        throw new Error((await reponse.text()) || "La génération a échoué.");
      }

      const lecteur = reponse.body.pipeThrough(new TextDecoderStream()).getReader();
      let tampon = "";
      let vuUnEvenement = false;
      let termine = false;
      let erreur: string | undefined;

      const traiterBloc = (bloc: string) => {
        const lignes = bloc.split("\n");
        const nomEvenement = lignes.find((l) => l.startsWith("event:"))?.slice(6).trim() ?? "";
        const donnees = lignes
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trim())
          .join("");
        if (!donnees || donnees === "[DONE]") return;
        let charge: {
          type?: string;
          b64_json?: string;
          error?: { message?: string };
        };
        try {
          charge = JSON.parse(donnees);
        } catch {
          return;
        }
        if (nomEvenement === "error" || charge.type === "error") {
          vuUnEvenement = true;
          erreur = charge.error?.message ?? "La génération a échoué.";
          return;
        }
        if (!charge.b64_json) return;
        vuUnEvenement = true;
        const final = nomEvenement.endsWith("completed") || charge.type?.endsWith("completed") === true;
        if (final) termine = true;
        setApercuIA({ url: `data:image/png;base64,${charge.b64_json}`, final });
      };

      while (true) {
        const { value, done } = await lecteur.read();
        if (done) break;
        tampon += value;
        let separation = tampon.indexOf("\n\n");
        while (separation !== -1) {
          traiterBloc(tampon.slice(0, separation));
          tampon = tampon.slice(separation + 2);
          separation = tampon.indexOf("\n\n");
        }
      }
      if (tampon.trim()) traiterBloc(tampon);

      if (erreur) throw new Error(erreur);

      if (!vuUnEvenement) {
        // Flux vide : on rejoue une seule fois la même requête sans streaming.
        const rejeu = await fetch("/api/studio-visuel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptIA, stream: false }),
        });
        if (!rejeu.ok) throw new Error((await rejeu.text()) || "La génération a échoué.");
        const json = (await rejeu.json()) as { data?: { b64_json?: string }[] };
        const b64 = json.data?.[0]?.b64_json;
        if (!b64) throw new Error("Aucune image n'a été renvoyée.");
        setApercuIA({ url: `data:image/png;base64,${b64}`, final: true });
      } else if (!termine) {
        throw new Error("La génération s'est interrompue avant la fin.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setGenerationEnCours(false);
    }
  };

  const enregistrerVisuelIA = async () => {
    if (!apercuIA?.final) return;
    const base64 = apercuIA.url.slice(apercuIA.url.indexOf(",") + 1);
    const { largeur, hauteur } = await dimensionsImage(apercuIA.url);
    await mutationUpload.mutateAsync({
      mediaType: "image/png",
      base64,
      titre: promptIA.slice(0, 120),
      tags: ["ia"],
      largeur,
      hauteur,
      origine: "ia",
      media_parent_id: null,
    });
    setApercuIA(null);
    setPromptIA("");
  };

  /* --------------------------------------------------------- retouches */

  useEffect(() => {
    if (!retouche) return;
    let annule = false;

    void (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const image = await chargerImage(retouche.media.url);
        if (annule) return;
        const ratio =
          FORMATS_MEDIA.find((f) => f.value === retouche.format)?.ratio ??
          image.naturalWidth / image.naturalHeight;

        const pivote = retouche.rotation % 180 !== 0;
        const largeurSource = pivote ? image.naturalHeight : image.naturalWidth;
        const hauteurSource = pivote ? image.naturalWidth : image.naturalHeight;

        // Recadrage centré au format demandé.
        let largeurCrop = largeurSource;
        let hauteurCrop = largeurSource / ratio;
        if (hauteurCrop > hauteurSource) {
          hauteurCrop = hauteurSource;
          largeurCrop = hauteurSource * ratio;
        }

        canvas.width = Math.round(largeurCrop);
        canvas.height = Math.round(hauteurCrop);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.filter = `brightness(${retouche.luminosite}%) contrast(${retouche.contraste}%) saturate(${retouche.saturation}%)`;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((retouche.rotation * Math.PI) / 180);
        ctx.drawImage(
          image,
          -image.naturalWidth / 2,
          -image.naturalHeight / 2,
          image.naturalWidth,
          image.naturalHeight,
        );
        ctx.restore();
      } catch (error) {
        toast.error((error as Error).message);
      }
    })();

    return () => {
      annule = true;
    };
  }, [retouche]);

  const enregistrerRetouche = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !retouche) return;
    setEnTraitement(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      await mutationUpload.mutateAsync({
        mediaType: "image/png",
        base64: dataUrl.slice(dataUrl.indexOf(",") + 1),
        titre: `${retouche.media.titre || "Visuel"} — retouché`.slice(0, 120),
        tags: retouche.media.tags ?? [],
        largeur: canvas.width,
        hauteur: canvas.height,
        origine: "retouche",
        media_parent_id: retouche.media.id,
      });
      setRetouche(null);
    } finally {
      setEnTraitement(false);
    }
  };

  const panneau = (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-sm font-bold text-primary">Générer un visuel</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Décris l'image dont tu as besoin, Mario s'occupe du rendu.
        </p>
      </div>
      <textarea
        value={promptIA}
        onChange={(event) => setPromptIA(event.target.value)}
        rows={3}
        placeholder="Un bureau lumineux avec un carnet et un café, ambiance douce"
        className="w-full resize-none rounded-2xl border border-border bg-muted p-3 text-xs text-primary outline-none focus:border-[var(--info)]"
      />
      <button
        type="button"
        disabled={promptIA.trim().length < 5 || generationEnCours}
        onClick={() => void genererVisuel()}
        className="cami-btn-secondary disabled:pointer-events-none disabled:opacity-50"
      >
        {generationEnCours ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Générer l'image
      </button>

      {apercuIA ? (
        <div className="flex flex-col gap-2">
          <img
            src={apercuIA.url}
            alt="Aperçu du visuel généré"
            className={[
              "w-full rounded-2xl transition",
              apercuIA.final ? "" : "blur-md",
            ].join(" ")}
          />
          <button
            type="button"
            disabled={!apercuIA.final || mutationUpload.isPending}
            onClick={() => void enregistrerVisuelIA()}
            className="cami-btn-secondary disabled:pointer-events-none disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Ajouter à mes médias
          </button>
        </div>
      ) : null}
    </div>
  );

  return (
    <AppShell panel={panneau}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">Médias</h1>
              <p className="text-xs text-muted-foreground lg:text-sm">
                Tes images, tes retouches et tes visuels générés.
              </p>
            </div>
            <button
              type="button"
              onClick={() => inputFichier.current?.click()}
              className="cami-btn-secondary"
            >
              <Upload className="h-4 w-4" /> Importer des images
            </button>
            <input
              ref={inputFichier}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(event) => {
                void gererFichiers(event.target.files);
                event.target.value = "";
              }}
            />
          </div>
          <StudioTabs />
        </header>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Chercher un média par titre ou tag"
            className="min-h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-primary outline-none focus:border-[var(--info)]"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement des médias…
          </div>
        ) : filtres.length === 0 ? (
          <p className="cami-card p-6 text-center text-sm text-muted-foreground">
            Aucun média pour l'instant. Importe une image ou génère un visuel.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtres.map((media) => (
              <article key={media.id} className="cami-card overflow-hidden">
                <img
                  src={media.url}
                  alt={media.titre || "Visuel"}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-col gap-2 p-2.5">
                  <input
                    defaultValue={media.titre}
                    onBlur={(event) => {
                      const valeur = event.target.value.trim();
                      if (valeur !== media.titre) {
                        mutationTitre.mutate({
                          id: media.id,
                          titre: valeur,
                          tags: media.tags ?? [],
                        });
                      }
                    }}
                    placeholder="Titre"
                    className="w-full rounded-xl border border-transparent bg-muted px-2 py-1 text-xs font-semibold text-primary outline-none focus:border-[var(--info)]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {media.origine}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Retoucher"
                        onClick={() =>
                          setRetouche({
                            media,
                            format: "1:1",
                            luminosite: 100,
                            contraste: 100,
                            saturation: 100,
                            rotation: 0,
                          })
                        }
                        className="cami-icon-btn"
                      >
                        <Wand2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Supprimer"
                        onClick={() => mutationSupprimer.mutate(media.id)}
                        className="cami-icon-btn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Atelier de retouche */}
      {retouche ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary">Retoucher le visuel</h2>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setRetouche(null)}
                className="cami-icon-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <canvas
              ref={canvasRef}
              className="mt-4 max-h-[45dvh] w-full rounded-2xl border border-border object-contain"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-semibold text-primary">
                Format
                <select
                  value={retouche.format}
                  onChange={(event) =>
                    setRetouche((etat) => (etat ? { ...etat, format: event.target.value } : etat))
                  }
                  className="min-h-11 rounded-2xl border border-border bg-muted px-3 text-sm outline-none focus:border-[var(--info)]"
                >
                  {FORMATS_MEDIA.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-primary">
                Rotation
                <select
                  value={retouche.rotation}
                  onChange={(event) =>
                    setRetouche((etat) =>
                      etat ? { ...etat, rotation: Number(event.target.value) } : etat,
                    )
                  }
                  className="min-h-11 rounded-2xl border border-border bg-muted px-3 text-sm outline-none focus:border-[var(--info)]"
                >
                  {[0, 90, 180, 270].map((angle) => (
                    <option key={angle} value={angle}>
                      {angle}°
                    </option>
                  ))}
                </select>
              </label>

              {(
                [
                  ["luminosite", "Luminosité"],
                  ["contraste", "Contraste"],
                  ["saturation", "Saturation"],
                ] as const
              ).map(([cle, label]) => (
                <label key={cle} className="flex flex-col gap-1 text-xs font-semibold text-primary">
                  {label} — {retouche[cle]}%
                  <input
                    type="range"
                    min={40}
                    max={180}
                    value={retouche[cle]}
                    onChange={(event) =>
                      setRetouche((etat) =>
                        etat ? { ...etat, [cle]: Number(event.target.value) } : etat,
                      )
                    }
                    className="accent-[var(--coral)]"
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              disabled={enTraitement || mutationUpload.isPending}
              onClick={() => void enregistrerRetouche()}
              className="cami-btn-primary-full mt-5 disabled:pointer-events-none disabled:opacity-50"
            >
              {enTraitement || mutationUpload.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Enregistrer comme nouveau média
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
