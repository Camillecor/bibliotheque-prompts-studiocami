import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Circle,
  Copy,
  Download,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  Lock,
  Minus,
  Redo2,
  Save,
  Search,
  Shapes,
  Square,
  Trash2,
  Type,
  Undo2,
  Unlock,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  COULEURS_MARQUE,
  MODELES,
  POLICES,
  formatCreation,
  nouvelId,
  type Calque,
  type CalqueForme,
  type CalqueImage,
  type CalqueTexte,
  type CreationComplete,
  type DocumentCreation,
  type Fond,
} from "@/lib/creation";
import { saveCreation } from "@/lib/creation.functions";
import { listMedias, uploadMedia } from "@/lib/studio.functions";

/* ------------------------------------------------------------------ helpers */

const MAX_IMPORT = 1600;

function estSvg(source: string) {
  return source.startsWith("data:image/svg+xml") || /\.svg($|\?)/i.test(source);
}

function chargerImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image illisible."));
    image.src = source;
  });
}

/**
 * Prépare une image (PNG, JPG, WebP ou SVG) pour l'éditeur : les SVG sont
 * gardés tels quels pour rester nets, les autres sont réduits et embarqués.
 */
async function preparerImage(
  source: string,
): Promise<{ url: string; largeur: number; hauteur: number }> {
  const image = await chargerImage(source);
  const largeurSource = image.naturalWidth || 800;
  const hauteurSource = image.naturalHeight || 800;

  if (estSvg(source)) {
    return { url: source, largeur: largeurSource, hauteur: hauteurSource };
  }

  const ratio = Math.min(1, MAX_IMPORT / Math.max(largeurSource, hauteurSource));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(largeurSource * ratio));
  canvas.height = Math.max(1, Math.round(hauteurSource * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible de préparer l'image.");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { url: canvas.toDataURL("image/png"), largeur: canvas.width, hauteur: canvas.height };
}

function fichierVersUrl(fichier: File) {
  return new Promise<string>((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error("Lecture impossible."));
    lecteur.onload = () => resolve(String(lecteur.result ?? ""));
    lecteur.readAsDataURL(fichier);
  });
}

/**
 * Récupère les polices Google utilisées par la page et les intègre directement
 * (en données) pour que l'export PNG conserve exactement les mêmes typographies.
 */
let cachePolices: Promise<string> | null = null;
function cssPolices() {
  if (cachePolices) return cachePolices;
  cachePolices = (async () => {
    const liens = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    ).filter((lien) => lien.href.startsWith("https://fonts.googleapis.com"));
    const morceaux = await Promise.all(
      liens.map(async (lien) => {
        try {
          const css = await (await fetch(lien.href)).text();
          const urls = Array.from(new Set(css.match(/https:\/\/fonts\.gstatic\.com[^)]+/g) ?? []));
          let resultat = css;
          await Promise.all(
            urls.map(async (url) => {
              try {
                const blob = await (await fetch(url)).blob();
                const donnee = await new Promise<string>((resolve) => {
                  const lecteur = new FileReader();
                  lecteur.onload = () => resolve(String(lecteur.result ?? ""));
                  lecteur.readAsDataURL(blob);
                });
                resultat = resultat.split(url).join(donnee);
              } catch {
                /* police ignorée */
              }
            }),
          );
          return resultat;
        } catch {
          return "";
        }
      }),
    );
    return morceaux.join("\n");
  })();
  return cachePolices;
}

function fondCss(fond: Fond): React.CSSProperties {
  if (fond.type === "couleur") return { background: fond.couleur };
  if (fond.type === "degrade")
    return { background: `linear-gradient(${fond.angle}deg, ${fond.de}, ${fond.vers})` };
  return { backgroundImage: `url(${fond.url})`, backgroundSize: "cover" };
}

/* ------------------------------------------------------------- petits blocs */

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ChoixCouleur({
  valeur,
  onChange,
}: {
  valeur: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {COULEURS_MARQUE.map((couleur) => (
          <button
            key={couleur.valeur}
            type="button"
            title={couleur.nom}
            onClick={() => onChange(couleur.valeur)}
            className={[
              "h-7 w-7 rounded-full border",
              valeur === couleur.valeur
                ? "border-[var(--coral)] ring-2 ring-[var(--coral)]"
                : "border-border",
            ].join(" ")}
            style={{ background: couleur.valeur }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={valeur ?? "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
        />
        <input
          value={valeur ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-9 w-full rounded-lg border border-border bg-background px-2 font-mono text-xs"
        />
      </div>
    </div>
  );
}

const inputClasse =
  "min-h-9 w-full rounded-lg border border-border bg-background px-2 text-sm text-primary";

/* -------------------------------------------------------------------- rendu */

function RenduCalque({ calque }: { calque: Calque }) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: calque.x,
    top: calque.y,
    width: calque.l,
    height: calque.h,
    transform: `rotate(${calque.rotation}deg)`,
    opacity: calque.opacite,
  };

  if (calque.type === "texte") {
    return (
      <div
        style={{
          ...base,
          display: "flex",
          alignItems: "flex-start",
          justifyContent:
            calque.align === "center"
              ? "center"
              : calque.align === "right"
                ? "flex-end"
                : "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: `'${calque.police}', sans-serif`,
            fontSize: calque.taille,
            fontWeight: calque.graisse,
            fontStyle: calque.italique ? "italic" : "normal",
            textDecoration: calque.souligne ? "underline" : "none",
            color: calque.couleur,
            textAlign: calque.align,
            lineHeight: calque.interligne,
            letterSpacing: `${calque.interlettre}px`,
            textShadow: calque.ombre ? "0 6px 24px rgba(0,0,0,0.35)" : "none",
            background: calque.fondTexte ?? "transparent",
            padding: calque.fondTexte ? "0.1em 0.3em" : 0,
            borderRadius: calque.fondTexte ? "0.12em" : 0,
            whiteSpace: "pre-wrap",
            width: "100%",
            display: "block",
          }}
        >
          {calque.texte}
        </span>
      </div>
    );
  }

  if (calque.type === "image") {
    return (
      <img
        src={calque.url}
        alt=""
        style={{
          ...base,
          objectFit: calque.ajustement,
          borderRadius: calque.arrondi,
          transform: `${base.transform} scaleX(${calque.retourne ? -1 : 1})`,
        }}
      />
    );
  }

  if (calque.forme === "trait") {
    return (
      <div
        style={{
          ...base,
          background: calque.couleur,
          borderRadius: calque.arrondi,
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...base,
        background: calque.couleur,
        border: calque.contour ? `${calque.epaisseurContour}px solid ${calque.contour}` : "none",
        borderRadius: calque.forme === "cercle" ? "50%" : calque.arrondi,
      }}
    />
  );
}

function ApercuTemplate({ document, format }: { document: DocumentCreation; format: string }) {
  const dimensions = formatCreation(format);
  return (
    <div
      className="relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted shadow-sm"
      style={{
        aspectRatio: `${dimensions.largeur} / ${dimensions.hauteur}`,
        maxHeight: 250,
      }}
    >
      <svg
        viewBox={`0 0 ${dimensions.largeur} ${dimensions.hauteur}`}
        className="block h-full w-full"
        aria-hidden="true"
      >
        <foreignObject width={dimensions.largeur} height={dimensions.hauteur}>
          <div
            style={{
              width: dimensions.largeur,
              height: dimensions.hauteur,
              position: "relative",
              overflow: "hidden",
              ...fondCss(document.fond),
            }}
          >
            {document.calques.map((calque) => (
              <RenduCalque key={calque.id} calque={calque} />
            ))}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ éditeur */

type Props = { creation: CreationComplete };

export function EditeurCreation({ creation }: Props) {
  const [doc, setDoc] = useState<DocumentCreation>(creation.document);
  const [selection, setSelection] = useState<string | null>(null);
  const [historique, setHistorique] = useState<DocumentCreation[]>([]);
  const [futur, setFutur] = useState<DocumentCreation[]>([]);
  const [zoomAuto, setZoomAuto] = useState(1);
  const [ouvrirMedias, setOuvrirMedias] = useState(false);
  const [enregistreA, setEnregistreA] = useState<string | null>(null);
  const [outilActif, setOutilActif] = useState<"templates" | "elements">("templates");
  const [rechercheTemplate, setRechercheTemplate] = useState("");
  const [categorieTemplate, setCategorieTemplate] = useState<"Tous" | "LinkedIn" | "Instagram">(
    "Tous",
  );

  const scèneRef = useRef<HTMLDivElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const fichierRef = useRef<HTMLInputElement | null>(null);
  // « calque » : l'image devient un élément déplaçable ; « fond » : elle remplit l'arrière-plan.
  const cibleImport = useRef<"calque" | "fond">("calque");

  const fnSave = useServerFn(saveCreation);
  const fnMedias = useServerFn(listMedias);
  const fnUpload = useServerFn(uploadMedia);

  const { data: medias = [] } = useQuery({
    queryKey: ["medias"],
    queryFn: () => fnMedias(),
    enabled: ouvrirMedias,
  });

  /* zoom automatique selon la largeur disponible */
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const calculer = () => {
      const dispo = zone.clientWidth - 8;
      const hauteurDispo = Math.max(320, window.innerHeight - 260);
      setZoomAuto(Math.min(dispo / creation.largeur, hauteurDispo / creation.hauteur, 1));
    };
    calculer();
    const observer = new ResizeObserver(calculer);
    observer.observe(zone);
    window.addEventListener("resize", calculer);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculer);
    };
  }, [creation.largeur, creation.hauteur]);

  const appliquer = useCallback((maj: (d: DocumentCreation) => DocumentCreation) => {
    setDoc((actuel) => {
      setHistorique((h) => [...h.slice(-40), actuel]);
      setFutur([]);
      return maj(actuel);
    });
  }, []);

  const majCalque = useCallback(
    (id: string, champs: Partial<Calque>) => {
      appliquer((d) => ({
        ...d,
        calques: d.calques.map((c) => (c.id === id ? ({ ...c, ...champs } as Calque) : c)),
      }));
    },
    [appliquer],
  );

  const annuler = () => {
    setHistorique((h) => {
      if (h.length === 0) return h;
      const precedent = h[h.length - 1]!;
      setFutur((f) => [doc, ...f]);
      setDoc(precedent);
      return h.slice(0, -1);
    });
  };

  const retablir = () => {
    setFutur((f) => {
      if (f.length === 0) return f;
      const suivant = f[0]!;
      setHistorique((h) => [...h, doc]);
      setDoc(suivant);
      return f.slice(1);
    });
  };

  useEffect(() => {
    const clavier = (event: KeyboardEvent) => {
      const cible = event.target as HTMLElement | null;
      if (cible && /input|textarea/i.test(cible.tagName)) return;
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) retablir();
        else annuler();
      }
      if ((event.key === "Delete" || event.key === "Backspace") && selection) {
        event.preventDefault();
        supprimerCalque(selection);
      }
    };
    window.addEventListener("keydown", clavier);
    return () => window.removeEventListener("keydown", clavier);
  });

  /* ------------------------------------------------------------- ajout */

  const ajouter = (calque: Calque) => {
    appliquer((d) => ({ ...d, calques: [...d.calques, calque] }));
    setSelection(calque.id);
  };

  const ajouterTexte = () =>
    ajouter({
      id: nouvelId(),
      type: "texte",
      texte: "Ton texte ici",
      x: Math.round(creation.largeur * 0.1),
      y: Math.round(creation.hauteur * 0.4),
      l: Math.round(creation.largeur * 0.8),
      h: 200,
      rotation: 0,
      opacite: 1,
      verrouille: false,
      police: "Bricolage Grotesque",
      taille: Math.round(creation.largeur / 14),
      graisse: 800,
      italique: false,
      souligne: false,
      couleur: "#050c9c",
      align: "left",
      interligne: 1.15,
      interlettre: -1,
      ombre: false,
      fondTexte: null,
    } satisfies CalqueTexte);

  const ajouterForme = (forme: CalqueForme["forme"]) =>
    ajouter({
      id: nouvelId(),
      type: "forme",
      forme,
      x: Math.round(creation.largeur * 0.2),
      y: Math.round(creation.hauteur * 0.2),
      l: Math.round(creation.largeur * 0.4),
      h: forme === "trait" ? 12 : Math.round(creation.largeur * 0.4),
      rotation: 0,
      opacite: 1,
      verrouille: false,
      couleur: "#ff6b35",
      contour: null,
      epaisseurContour: 0,
      arrondi: forme === "trait" ? 6 : 0,
    } satisfies CalqueForme);

  const ajouterImage = async (source: string) => {
    try {
      const { url, largeur: lSource, hauteur: hSource } = await preparerImage(source);
      const largeur = Math.round(creation.largeur * 0.5);
      const hauteur = Math.round((largeur * hSource) / (lSource || largeur));
      ajouter({
        id: nouvelId(),
        type: "image",
        url,
        x: Math.round((creation.largeur - largeur) / 2),
        y: Math.round((creation.hauteur - hauteur) / 2),
        l: largeur,
        h: hauteur,
        rotation: 0,
        opacite: 1,
        verrouille: false,
        arrondi: 0,
        retourne: false,
        ajustement: estSvg(url) ? "contain" : "cover",
      } satisfies CalqueImage);
      setOuvrirMedias(false);
    } catch {
      toast.error("Cette image n'a pas pu être ajoutée.");
    }
  };

  /** Place une image en fond de la création (import ou bibliothèque Médias). */
  const definirFondImage = async (source: string) => {
    try {
      const { url } = await preparerImage(source);
      appliquer((d) => ({
        ...d,
        fond:
          d.fond.type === "image"
            ? { ...d.fond, url }
            : { type: "image", url, voile: 0, voileCouleur: "#000000" },
      }));
      setSelection(null);
      setOuvrirMedias(false);
    } catch {
      toast.error("Cette image n'a pas pu être utilisée en fond.");
    }
  };

  /** Transforme le calque image sélectionné en fond de la création. */
  const calqueVersFond = (calque: CalqueImage) => {
    appliquer((d) => ({
      ...d,
      fond: { type: "image", url: calque.url, voile: 0, voileCouleur: "#000000" },
      calques: d.calques.filter((c) => c.id !== calque.id),
    }));
    setSelection(null);
  };

  const supprimerCalque = (id: string) => {
    appliquer((d) => ({ ...d, calques: d.calques.filter((c) => c.id !== id) }));
    setSelection(null);
  };

  const dupliquerCalque = (id: string) => {
    const source = doc.calques.find((c) => c.id === id);
    if (!source) return;
    const copie = { ...source, id: nouvelId(), x: source.x + 24, y: source.y + 24 } as Calque;
    ajouter(copie);
  };

  const deplacerCalque = (id: string, sens: -1 | 1) => {
    appliquer((d) => {
      const index = d.calques.findIndex((c) => c.id === id);
      const cible = index + sens;
      if (index === -1 || cible < 0 || cible >= d.calques.length) return d;
      const calques = [...d.calques];
      const [element] = calques.splice(index, 1);
      calques.splice(cible, 0, element!);
      return { ...d, calques };
    });
  };

  const appliquerTemplate = (modele: (typeof MODELES)[number]) => {
    if (doc.calques.length > 0 && !confirm("Remplacer le visuel actuel par ce template ?")) return;
    const source = modele.construire();
    const dimensionsSource = formatCreation(modele.format);
    const ratioX = creation.largeur / dimensionsSource.largeur;
    const ratioY = creation.hauteur / dimensionsSource.hauteur;
    const ratioTexte = Math.min(ratioX, ratioY);
    const adapte: DocumentCreation = {
      ...source,
      calques: source.calques.map((calque) => ({
        ...calque,
        id: nouvelId(),
        x: Math.round(calque.x * ratioX),
        y: Math.round(calque.y * ratioY),
        l: Math.round(calque.l * ratioX),
        h: Math.round(calque.h * ratioY),
        ...(calque.type === "texte" ? { taille: Math.round(calque.taille * ratioTexte) } : {}),
      })),
    };
    appliquer(() => adapte);
    setSelection(null);
    toast.success(`Template « ${modele.label} » appliqué.`);
  };

  /* --------------------------------------------------- déplacement souris */

  const interaction = useRef<{
    mode: "deplacer" | "redimensionner" | "pivoter";
    id: string;
    departX: number;
    departY: number;
    calque: Calque;
    centreX: number;
    centreY: number;
  } | null>(null);

  const demarrer = (
    event: React.PointerEvent,
    mode: "deplacer" | "redimensionner" | "pivoter",
    calque: Calque,
  ) => {
    if (calque.verrouille) return;
    event.preventDefault();
    event.stopPropagation();
    scèneRef.current?.setPointerCapture(event.pointerId);
    const rect = scèneRef.current?.getBoundingClientRect();
    interaction.current = {
      mode,
      id: calque.id,
      departX: event.clientX,
      departY: event.clientY,
      calque,
      centreX: (rect?.left ?? 0) + (calque.x + calque.l / 2) * zoomAuto,
      centreY: (rect?.top ?? 0) + (calque.y + calque.h / 2) * zoomAuto,
    };
    setSelection(calque.id);
  };

  const bouger = (event: React.PointerEvent) => {
    const etat = interaction.current;
    if (!etat) return;
    const dx = (event.clientX - etat.departX) / zoomAuto;
    const dy = (event.clientY - etat.departY) / zoomAuto;

    if (etat.mode === "deplacer") {
      const x = Math.max(0, Math.min(creation.largeur - etat.calque.l, etat.calque.x + dx));
      const y = Math.max(0, Math.min(creation.hauteur - etat.calque.h, etat.calque.y + dy));
      setDoc((d) => ({
        ...d,
        calques: d.calques.map((c) =>
          c.id === etat.id ? { ...c, x: Math.round(x), y: Math.round(y) } : c,
        ),
      }));
      return;
    }

    if (etat.mode === "redimensionner") {
      const angle = (-etat.calque.rotation * Math.PI) / 180;
      const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
      const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
      const largeur = Math.max(
        16,
        Math.min(creation.largeur - etat.calque.x, etat.calque.l + localX),
      );
      const hauteurLibre = Math.max(
        8,
        Math.min(creation.hauteur - etat.calque.y, etat.calque.h + localY),
      );
      const hauteur =
        etat.calque.type === "image"
          ? Math.max(
              8,
              Math.min(creation.hauteur - etat.calque.y, largeur / (etat.calque.l / etat.calque.h)),
            )
          : hauteurLibre;
      setDoc((d) => ({
        ...d,
        calques: d.calques.map((c) =>
          c.id === etat.id
            ? {
                ...c,
                l: Math.round(largeur),
                h: Math.round(hauteur),
              }
            : c,
        ),
      }));
      return;
    }

    const angle =
      (Math.atan2(event.clientY - etat.centreY, event.clientX - etat.centreX) * 180) / Math.PI + 90;
    setDoc((d) => ({
      ...d,
      calques: d.calques.map((c) => (c.id === etat.id ? { ...c, rotation: Math.round(angle) } : c)),
    }));
  };

  const terminer = () => {
    if (interaction.current) {
      const depart = interaction.current.calque;
      interaction.current = null;
      setHistorique((h) => [
        ...h.slice(-40),
        { ...doc, calques: doc.calques.map((c) => (c.id === depart.id ? depart : c)) },
      ]);
      setFutur([]);
    }
  };

  /* ----------------------------------------------------------- export */

  const rendre = useCallback(
    async (pixelRatio: number) => {
      const noeud = scèneRef.current;
      if (!noeud) throw new Error("Zone de travail introuvable.");
      if ("fonts" in document) await (document as Document).fonts.ready;
      return toPng(noeud, {
        pixelRatio,
        width: creation.largeur,
        height: creation.hauteur,
        style: { transform: "none", transformOrigin: "top left" },
        cacheBust: true,
        fontEmbedCSS: await cssPolices(),
      });
    },
    [creation.largeur, creation.hauteur],
  );

  const enregistrer = useMutation({
    mutationFn: async () => {
      let apercu = "";
      try {
        apercu = await rendre(Math.min(0.4, 400 / creation.largeur));
      } catch {
        apercu = "";
      }
      await fnSave({ data: { id: creation.id, document: doc, ...(apercu ? { apercu } : {}) } });
    },
    onSuccess: () => {
      setEnregistreA(
        new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      );
      toast.success("Création enregistrée.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const telecharger = useMutation({
    mutationFn: async (ratio: number) => {
      const url = await rendre(ratio);
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = `${creation.nom.replace(/[^\w-]+/g, "-").toLowerCase() || "creation"}.png`;
      lien.click();
    },
    onError: () => toast.error("L'export a échoué."),
  });

  const envoyerDansMedias = useMutation({
    mutationFn: async () => {
      const url = await rendre(1);
      const base64 = url.slice(url.indexOf(",") + 1);
      await fnUpload({
        data: {
          mediaType: "image/png",
          base64,
          titre: creation.nom,
          tags: ["creation"],
          largeur: creation.largeur,
          hauteur: creation.hauteur,
          origine: "retouche",
          media_parent_id: null,
        },
      });
    },
    onSuccess: () => toast.success("Visuel ajouté à ta bibliothèque Médias."),
    onError: (error: Error) => toast.error(error.message),
  });

  const calqueActif = useMemo(
    () => doc.calques.find((c) => c.id === selection) ?? null,
    [doc.calques, selection],
  );
  const modelesVisibles = useMemo(() => {
    const recherche = rechercheTemplate.trim().toLocaleLowerCase("fr");
    return MODELES.filter((modele) => {
      const categorieOk =
        categorieTemplate === "Tous" ||
        modele.categorie === categorieTemplate ||
        modele.categorie === "Essentiels";
      const rechercheOk =
        !recherche ||
        `${modele.label} ${modele.description} ${modele.categorie}`
          .toLocaleLowerCase("fr")
          .includes(recherche);
      return categorieOk && rechercheOk;
    });
  }, [categorieTemplate, rechercheTemplate]);

  /* ------------------------------------------------------------- rendu UI */

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
        <Button
          type="button"
          onClick={() => enregistrer.mutate()}
          disabled={enregistrer.isPending}
          className="h-10 rounded-lg px-4 font-semibold"
        >
          {enregistrer.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Enregistrer
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => telecharger.mutate(1)}
          className="h-10 rounded-lg px-4 font-semibold"
        >
          <Download className="h-4 w-4" />
          PNG
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => telecharger.mutate(2)}
          className="h-10 rounded-lg px-4 font-semibold"
        >
          <Download className="h-4 w-4" />
          PNG 2x
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => envoyerDansMedias.mutate()}
          disabled={envoyerDansMedias.isPending}
          className="h-10 rounded-lg px-4 font-semibold"
        >
          {envoyerDansMedias.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Envoyer dans Médias
        </Button>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          {enregistreA ? (
            <span className="text-xs text-muted-foreground">Enregistré à {enregistreA}</span>
          ) : null}
          <button
            type="button"
            onClick={annuler}
            disabled={historique.length === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary disabled:opacity-40"
            aria-label="Annuler"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={retablir}
            disabled={futur.length === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary disabled:opacity-40"
            aria-label="Rétablir"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[19rem_minmax(0,1fr)_19rem]">
        {/* outils et templates */}
        <aside className="order-2 min-w-0 overflow-hidden rounded-xl border border-border bg-card xl:order-1">
          <div className="grid grid-cols-2 border-b border-border p-2">
            <button
              type="button"
              onClick={() => setOutilActif("templates")}
              className={ongletOutil(outilActif === "templates")}
            >
              <LayoutTemplate className="h-4 w-4" /> Templates
            </button>
            <button
              type="button"
              onClick={() => setOutilActif("elements")}
              className={ongletOutil(outilActif === "elements")}
            >
              <Shapes className="h-4 w-4" /> Éléments
            </button>
          </div>
          {outilActif === "templates" ? (
            <div className="space-y-4 p-3">
              <div>
                <h2 className="text-base font-semibold text-primary">Templates</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Choisis un point de départ.</p>
              </div>
              <label className="flex h-10 items-center gap-2 rounded-lg bg-muted px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  value={rechercheTemplate}
                  onChange={(event) => setRechercheTemplate(event.target.value)}
                  placeholder="Rechercher un template"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {(["Tous", "LinkedIn", "Instagram"] as const).map((categorie) => (
                  <button
                    key={categorie}
                    type="button"
                    onClick={() => setCategorieTemplate(categorie)}
                    className={[
                      "h-8 shrink-0 rounded-full px-3 text-xs font-semibold transition",
                      categorieTemplate === categorie
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-primary",
                    ].join(" ")}
                  >
                    {categorie}
                  </button>
                ))}
              </div>
              <div className="grid max-h-[31rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-1">
                {modelesVisibles.map((modele) => {
                  const document = modele.construire();
                  return (
                    <button
                      key={modele.value}
                      type="button"
                      onClick={() => appliquerTemplate(modele)}
                      className="group min-w-0 space-y-2 rounded-lg border border-border bg-background p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[var(--coral)] hover:shadow-sm"
                    >
                      <ApercuTemplate document={document} format={modele.format} />
                      <span className="flex min-w-0 items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-primary">
                            {modele.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                            {modele.description}
                          </span>
                        </span>
                        <span className="shrink-0 rounded bg-muted px-1.5 py-1 text-[9px] font-semibold text-muted-foreground">
                          {modele.format}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 xl:grid-cols-1">
              <button type="button" onClick={ajouterTexte} className={boutonOutil}>
                <Type className="h-4 w-4" /> Texte
              </button>
              <button type="button" onClick={() => ajouterForme("rect")} className={boutonOutil}>
                <Square className="h-4 w-4" /> Rectangle
              </button>
              <button type="button" onClick={() => ajouterForme("cercle")} className={boutonOutil}>
                <Circle className="h-4 w-4" /> Cercle
              </button>
              <button type="button" onClick={() => ajouterForme("trait")} className={boutonOutil}>
                <Minus className="h-4 w-4" /> Trait
              </button>
              <button
                type="button"
                onClick={() => {
                  cibleImport.current = "calque";
                  setOuvrirMedias(true);
                }}
                className={boutonOutil}
              >
                <ImagePlus className="h-4 w-4" /> Médias
              </button>
              <button
                type="button"
                onClick={() => {
                  cibleImport.current = "calque";
                  fichierRef.current?.click();
                }}
                className={boutonOutil}
              >
                <Upload className="h-4 w-4" /> Importer
              </button>
            </div>
          )}
          <input
            ref={fichierRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.svg"
            className="hidden"
            onChange={async (event) => {
              const fichier = event.target.files?.[0];
              event.target.value = "";
              if (!fichier) return;
              const source = await fichierVersUrl(fichier);
              if (cibleImport.current === "fond") await definirFondImage(source);
              else await ajouterImage(source);
            }}
          />
        </aside>

        {/* zone de travail */}
        <div
          ref={zoneRef}
          className="order-1 flex min-h-[22rem] min-w-0 items-start justify-center overflow-hidden rounded-xl border border-border bg-muted p-3 sm:p-5 xl:order-2"
          onPointerMove={bouger}
          onPointerUp={terminer}
          onPointerCancel={terminer}
        >
          <div
            style={{
              width: creation.largeur * zoomAuto,
              height: creation.hauteur * zoomAuto,
            }}
            className="relative"
          >
            <div
              ref={scèneRef}
              onPointerDown={() => setSelection(null)}
              style={{
                width: creation.largeur,
                height: creation.hauteur,
                transform: `scale(${zoomAuto})`,
                transformOrigin: "top left",
                position: "relative",
                overflow: "hidden",
                touchAction: "none",
                ...fondCss(doc.fond),
              }}
            >
              {doc.fond.type === "image" ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: doc.fond.voileCouleur,
                    opacity: doc.fond.voile,
                  }}
                />
              ) : null}

              {doc.calques.map((calque) => (
                <div
                  key={calque.id}
                  className="touch-none"
                  onPointerDown={(e) => demarrer(e, "deplacer", calque)}
                >
                  <RenduCalque calque={calque} />
                  {selection === calque.id ? (
                    <div
                      style={{
                        position: "absolute",
                        left: calque.x,
                        top: calque.y,
                        width: calque.l,
                        height: calque.h,
                        transform: `rotate(${calque.rotation}deg)`,
                        outline: `${Math.round(2 / zoomAuto)}px solid #ff6b35`,
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        onPointerDown={(e) => demarrer(e, "redimensionner", calque)}
                        style={{
                          position: "absolute",
                          right: -12 / zoomAuto,
                          bottom: -12 / zoomAuto,
                          width: 24 / zoomAuto,
                          height: 24 / zoomAuto,
                          borderRadius: "50%",
                          background: "#ff6b35",
                          pointerEvents: "auto",
                          cursor: "nwse-resize",
                        }}
                      />
                      <span
                        onPointerDown={(e) => demarrer(e, "pivoter", calque)}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: -34 / zoomAuto,
                          width: 22 / zoomAuto,
                          height: 22 / zoomAuto,
                          marginLeft: -11 / zoomAuto,
                          borderRadius: "50%",
                          background: "#050c9c",
                          pointerEvents: "auto",
                          cursor: "grab",
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* panneau de réglages */}
        <aside className="order-3 min-w-0 space-y-4 rounded-xl border border-border bg-card p-3 xl:max-h-[calc(100dvh-15rem)] xl:overflow-y-auto">
          {calqueActif ? (
            <ReglagesCalque
              calque={calqueActif}
              onChange={(champs) => majCalque(calqueActif.id, champs)}
              onSupprimer={() => supprimerCalque(calqueActif.id)}
              onDupliquer={() => dupliquerCalque(calqueActif.id)}
              onOrdre={(sens) => deplacerCalque(calqueActif.id, sens)}
              onFond={calqueActif.type === "image" ? () => calqueVersFond(calqueActif) : undefined}
            />
          ) : (
            <ReglagesFond
              fond={doc.fond}
              onChange={(fond) => appliquer((d) => ({ ...d, fond }))}
              onImage={() => {
                cibleImport.current = "fond";
                fichierRef.current?.click();
              }}
              onMedias={() => {
                cibleImport.current = "fond";
                setOuvrirMedias(true);
              }}
            />
          )}
        </aside>
      </div>

      {ouvrirMedias ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-primary">Ta bibliothèque Médias</p>
              <button
                type="button"
                onClick={() => setOuvrirMedias(false)}
                className="min-h-10 rounded-full border border-border px-3 text-sm font-semibold text-primary"
              >
                Fermer
              </button>
            </div>
            {medias.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune image pour l'instant dans tes Médias.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {medias.map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() =>
                      void (cibleImport.current === "fond"
                        ? definirFondImage(media.url)
                        : ajouterImage(media.url))
                    }
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    <img
                      src={media.url}
                      alt={media.titre}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const boutonOutil =
  "inline-flex min-h-11 min-w-0 items-center justify-start gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-primary transition hover:border-[var(--coral)] hover:text-[var(--coral)]";

const ongletOutil = (actif: boolean) =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs font-bold transition ${actif ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`;

/* --------------------------------------------------------- panneaux réglages */

function ReglagesFond({
  fond,
  onChange,
  onImage,
  onMedias,
}: {
  fond: Fond;
  onChange: (fond: Fond) => void;
  onImage: () => void;
  onMedias: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-primary">Fond</p>
      <div className="flex gap-2">
        {(
          [
            ["couleur", "Uni"],
            ["degrade", "Dégradé"],
            ["image", "Image"],
          ] as const
        ).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              if (type === fond.type) return;
              if (type === "couleur") onChange({ type: "couleur", couleur: "#f7f4ee" });
              else if (type === "degrade")
                onChange({ type: "degrade", de: "#050c9c", vers: "#3abef9", angle: 135 });
              else onChange({ type: "image", url: "", voile: 0.25, voileCouleur: "#000000" });
            }}
            className={[
              "min-h-9 flex-1 rounded-lg border px-2 text-xs font-semibold",
              fond.type === type
                ? "border-[var(--coral)] text-[var(--coral)]"
                : "border-border text-primary",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {fond.type === "couleur" ? (
        <ChoixCouleur
          valeur={fond.couleur}
          onChange={(couleur) => onChange({ ...fond, couleur })}
        />
      ) : null}

      {fond.type === "degrade" ? (
        <div className="space-y-3">
          <Champ label="Couleur de départ">
            <ChoixCouleur valeur={fond.de} onChange={(de) => onChange({ ...fond, de })} />
          </Champ>
          <Champ label="Couleur d'arrivée">
            <ChoixCouleur valeur={fond.vers} onChange={(vers) => onChange({ ...fond, vers })} />
          </Champ>
          <Champ label={`Angle : ${fond.angle}°`}>
            <input
              type="range"
              min={0}
              max={360}
              value={fond.angle}
              onChange={(e) => onChange({ ...fond, angle: Number(e.target.value) })}
              className="w-full"
            />
          </Champ>
        </div>
      ) : null}

      {fond.type === "image" ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Choisis une image de fond (PNG, JPG ou SVG) depuis ton ordinateur ou ta bibliothèque
            Médias.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onImage}
              className="min-h-10 flex-1 rounded-xl border border-border text-sm font-semibold text-primary"
            >
              Importer
            </button>
            <button
              type="button"
              onClick={onMedias}
              className="min-h-10 flex-1 rounded-xl border border-border text-sm font-semibold text-primary"
            >
              Médias
            </button>
          </div>
          {fond.url ? (
            <img
              src={fond.url}
              alt="Aperçu du fond"
              className="h-24 w-full rounded-xl border border-border object-cover"
            />
          ) : null}
          <Champ label="Adresse de l'image">
            <input
              value={fond.url.startsWith("data:") ? "" : fond.url}
              onChange={(e) => onChange({ ...fond, url: e.target.value })}
              className={inputClasse}
              placeholder="https://…"
            />
          </Champ>

          <Champ label={`Voile : ${Math.round(fond.voile * 100)} %`}>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(fond.voile * 100)}
              onChange={(e) => onChange({ ...fond, voile: Number(e.target.value) / 100 })}
              className="w-full"
            />
          </Champ>
          <Champ label="Couleur du voile">
            <ChoixCouleur
              valeur={fond.voileCouleur}
              onChange={(voileCouleur) => onChange({ ...fond, voileCouleur })}
            />
          </Champ>
        </div>
      ) : null}
    </div>
  );
}

function ReglagesCalque({
  calque,
  onChange,
  onSupprimer,
  onDupliquer,
  onOrdre,
  onFond,
}: {
  calque: Calque;
  onChange: (champs: Partial<Calque>) => void;
  onSupprimer: () => void;
  onDupliquer: () => void;
  onOrdre: (sens: -1 | 1) => void;
  onFond?: (() => void) | undefined;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-primary">
          {calque.type === "texte" ? "Texte" : calque.type === "image" ? "Image" : "Forme"}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onOrdre(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary"
            aria-label="Avancer"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onOrdre(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary"
            aria-label="Reculer"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ verrouille: !calque.verrouille })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary"
            aria-label="Verrouiller"
          >
            {calque.verrouille ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onDupliquer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary"
            aria-label="Dupliquer"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSupprimer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-destructive"
            aria-label="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {calque.type === "texte" ? (
        <div className="space-y-3">
          <Champ label="Contenu">
            <textarea
              value={calque.texte}
              onChange={(e) => onChange({ texte: e.target.value } as Partial<CalqueTexte>)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm text-primary"
            />
          </Champ>
          <Champ label="Police">
            <select
              value={calque.police}
              onChange={(e) => onChange({ police: e.target.value } as Partial<CalqueTexte>)}
              className={inputClasse}
            >
              {POLICES.map((police) => (
                <option key={police} value={police}>
                  {police}
                </option>
              ))}
            </select>
          </Champ>
          <div className="grid grid-cols-2 gap-2">
            <Champ label="Taille">
              <input
                type="number"
                value={calque.taille}
                onChange={(e) =>
                  onChange({ taille: Number(e.target.value) } as Partial<CalqueTexte>)
                }
                className={inputClasse}
              />
            </Champ>
            <Champ label="Graisse">
              <select
                value={calque.graisse}
                onChange={(e) =>
                  onChange({ graisse: Number(e.target.value) } as Partial<CalqueTexte>)
                }
                className={inputClasse}
              >
                {[300, 400, 500, 600, 700, 800, 900].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Champ>
          </div>
          <div className="flex gap-2">
            {(["left", "center", "right"] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ align } as Partial<CalqueTexte>)}
                className={[
                  "min-h-9 flex-1 rounded-lg border text-xs font-semibold",
                  calque.align === align
                    ? "border-[var(--coral)] text-[var(--coral)]"
                    : "border-border text-primary",
                ].join(" ")}
              >
                {align === "left" ? "Gauche" : align === "center" ? "Centre" : "Droite"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ italique: !calque.italique } as Partial<CalqueTexte>)}
              className={`min-h-9 flex-1 rounded-lg border text-xs font-semibold italic ${calque.italique ? "border-[var(--coral)] text-[var(--coral)]" : "border-border text-primary"}`}
            >
              Italique
            </button>
            <button
              type="button"
              onClick={() => onChange({ souligne: !calque.souligne } as Partial<CalqueTexte>)}
              className={`min-h-9 flex-1 rounded-lg border text-xs font-semibold underline ${calque.souligne ? "border-[var(--coral)] text-[var(--coral)]" : "border-border text-primary"}`}
            >
              Souligné
            </button>
            <button
              type="button"
              onClick={() => onChange({ ombre: !calque.ombre } as Partial<CalqueTexte>)}
              className={`min-h-9 flex-1 rounded-lg border text-xs font-semibold ${calque.ombre ? "border-[var(--coral)] text-[var(--coral)]" : "border-border text-primary"}`}
            >
              Ombre
            </button>
          </div>
          <Champ label="Couleur du texte">
            <ChoixCouleur
              valeur={calque.couleur}
              onChange={(couleur) => onChange({ couleur } as Partial<CalqueTexte>)}
            />
          </Champ>
          <Champ label="Surlignage">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    fondTexte: calque.fondTexte ? null : "#ff6b35",
                  } as Partial<CalqueTexte>)
                }
                className="min-h-9 rounded-lg border border-border px-3 text-xs font-semibold text-primary"
              >
                {calque.fondTexte ? "Retirer" : "Ajouter"}
              </button>
              {calque.fondTexte ? (
                <input
                  type="color"
                  value={calque.fondTexte}
                  onChange={(e) => onChange({ fondTexte: e.target.value } as Partial<CalqueTexte>)}
                  className="h-9 w-12 rounded border border-border"
                />
              ) : null}
            </div>
          </Champ>
          <div className="grid grid-cols-2 gap-2">
            <Champ label={`Interligne ${calque.interligne.toFixed(2)}`}>
              <input
                type="range"
                min={80}
                max={220}
                value={Math.round(calque.interligne * 100)}
                onChange={(e) =>
                  onChange({ interligne: Number(e.target.value) / 100 } as Partial<CalqueTexte>)
                }
                className="w-full"
              />
            </Champ>
            <Champ label={`Lettres ${calque.interlettre}px`}>
              <input
                type="range"
                min={-10}
                max={20}
                value={calque.interlettre}
                onChange={(e) =>
                  onChange({ interlettre: Number(e.target.value) } as Partial<CalqueTexte>)
                }
                className="w-full"
              />
            </Champ>
          </div>
        </div>
      ) : null}

      {calque.type === "image" ? (
        <div className="space-y-3">
          {onFond ? (
            <button
              type="button"
              onClick={onFond}
              className="min-h-10 w-full rounded-xl border border-border text-sm font-semibold text-primary"
            >
              Utiliser comme fond
            </button>
          ) : null}

          <Champ label={`Angles arrondis : ${calque.arrondi}px`}>
            <input
              type="range"
              min={0}
              max={400}
              value={calque.arrondi}
              onChange={(e) =>
                onChange({ arrondi: Number(e.target.value) } as Partial<CalqueImage>)
              }
              className="w-full"
            />
          </Champ>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ retourne: !calque.retourne } as Partial<CalqueImage>)}
              className="min-h-9 flex-1 rounded-lg border border-border text-xs font-semibold text-primary"
            >
              Retourner
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ajustement: calque.ajustement === "cover" ? "contain" : "cover",
                } as Partial<CalqueImage>)
              }
              className="min-h-9 flex-1 rounded-lg border border-border text-xs font-semibold text-primary"
            >
              {calque.ajustement === "cover" ? "Remplir" : "Entier"}
            </button>
          </div>
        </div>
      ) : null}

      {calque.type === "forme" ? (
        <div className="space-y-3">
          <Champ label="Couleur">
            <ChoixCouleur
              valeur={calque.couleur}
              onChange={(couleur) => onChange({ couleur } as Partial<CalqueForme>)}
            />
          </Champ>
          <Champ label={`Angles arrondis : ${calque.arrondi}px`}>
            <input
              type="range"
              min={0}
              max={400}
              value={calque.arrondi}
              onChange={(e) =>
                onChange({ arrondi: Number(e.target.value) } as Partial<CalqueForme>)
              }
              className="w-full"
            />
          </Champ>
          <Champ label="Contour">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    contour: calque.contour ? null : "#050c9c",
                    epaisseurContour: calque.contour ? 0 : 6,
                  } as Partial<CalqueForme>)
                }
                className="min-h-9 rounded-lg border border-border px-3 text-xs font-semibold text-primary"
              >
                {calque.contour ? "Retirer" : "Ajouter"}
              </button>
              {calque.contour ? (
                <input
                  type="color"
                  value={calque.contour}
                  onChange={(e) => onChange({ contour: e.target.value } as Partial<CalqueForme>)}
                  className="h-9 w-12 rounded border border-border"
                />
              ) : null}
            </div>
          </Champ>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Champ label={`Opacité ${Math.round(calque.opacite * 100)} %`}>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(calque.opacite * 100)}
            onChange={(e) => onChange({ opacite: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </Champ>
        <Champ label={`Rotation ${calque.rotation}°`}>
          <input
            type="range"
            min={-180}
            max={180}
            value={calque.rotation}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className="w-full"
          />
        </Champ>
      </div>
    </div>
  );
}
