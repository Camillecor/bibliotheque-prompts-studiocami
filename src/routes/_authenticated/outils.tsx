import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ToolLogo, type ToolLogoName } from "@/components/ToolLogos";

type Prix = "gratuit" | "freemium" | "payant";
type Outil = {
  nom: string;
  logo: ToolLogoName;
  definition: string;
  prix: Prix;
  souverain?: boolean;
  mcp?: boolean;
};
type OutilAjoute = Omit<Outil, "logo"> & { id: string; categorie: string };
type SectionCategorie = { categorie: string; outils: Outil[] };
type FAQ = { question: string; reponse: string };

const CLE_OUTILS_AJOUTES = "outils_ia_ajoutes";
const CATEGORIES_LABELS = [
  "Chatbots & assistants",
  "Design & visuel",
  "Dev & no-code",
  "Productivité",
  "Automatisation",
];

function chargerOutilsAjoutes(): OutilAjoute[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_OUTILS_AJOUTES);
    const parsed = brut ? JSON.parse(brut) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Outils IA utilisés au quotidien chez Studio Cami, classés par usage.
const SECTIONS: SectionCategorie[] = [
  {
    categorie: "Chatbots & assistants",
    outils: [
      {
        nom: "Claude",
        logo: "Claude",
        definition: "Assistant d'Anthropic, à l'aise en rédaction longue, code et raisonnement.",
        prix: "freemium",
      },
      {
        nom: "ChatGPT",
        logo: "ChatGPT",
        definition: "Assistant généraliste d'OpenAI, pour écrire, coder et réfléchir au quotidien.",
        prix: "freemium",
      },
      {
        nom: "Mistral AI",
        logo: "Mistral",
        definition: "IA française, rapide, hébergée en Europe.",
        prix: "freemium",
        souverain: true,
      },
      {
        nom: "Perplexity AI",
        logo: "Perplexity",
        definition: "Moteur de réponse IA qui cite toujours ses sources.",
        prix: "freemium",
      },
    ],
  },
  {
    categorie: "Design & visuel",
    outils: [
      {
        nom: "Figma",
        logo: "Figma",
        definition: "Design d'interface : maquettes, prototypes et design system.",
        prix: "freemium",
        mcp: true,
      },
      {
        nom: "Canva",
        logo: "Canva",
        definition: "Création graphique rapide : visuels, présentations, réseaux sociaux.",
        prix: "freemium",
        mcp: true,
      },
      {
        nom: "Midjourney",
        logo: "Midjourney",
        definition: "Générateur d'images IA à la qualité artistique inégalée.",
        prix: "payant",
      },
    ],
  },
  {
    categorie: "Dev & no-code",
    outils: [
      {
        nom: "Claude Code",
        logo: "ClaudeCode",
        definition: "Agent IA en ligne de commande : code, débogue et gère les projets dans le terminal.",
        prix: "freemium",
      },
      {
        nom: "Lovable",
        logo: "Lovable",
        definition: "Génère une app web complète à partir d'une conversation, code et déploiement inclus.",
        prix: "freemium",
        mcp: true,
      },
      {
        nom: "Supabase",
        logo: "Supabase",
        definition: "Backend open-source : base de données, auth et stockage prêts à l'emploi.",
        prix: "freemium",
        mcp: true,
      },
    ],
  },
  {
    categorie: "Productivité",
    outils: [
      {
        nom: "Notion",
        logo: "Notion",
        definition: "Notes, bases de données et docs dans un seul espace de travail.",
        prix: "freemium",
        mcp: true,
      },
      {
        nom: "Google Drive",
        logo: "GoogleDrive",
        definition: "Stockage et partage de fichiers, intégré à la suite Google.",
        prix: "gratuit",
        mcp: true,
      },
      {
        nom: "Gmail",
        logo: "Gmail",
        definition: "Messagerie et automatisation des e-mails pros.",
        prix: "gratuit",
        mcp: true,
      },
    ],
  },
  {
    categorie: "Automatisation",
    outils: [
      {
        nom: "Zapier",
        logo: "Zapier",
        definition: "Connecte les outils entre eux et automatise les tâches répétitives.",
        prix: "freemium",
        mcp: true,
      },
    ],
  },
];

const FAQ: FAQ[] = [
  {
    question: "Pourquoi cette page plutôt qu'un simple favoris de navigateur ?",
    reponse:
      "Parce qu'un outil sans contexte d'usage se ré-oublie en deux semaines. Chaque fiche répond à « à quoi ça sert vraiment », pas juste « comment y accéder ».",
  },
  {
    question: "Que veut dire le badge MCP ?",
    reponse:
      "L'outil est connecté à Claude Code via le Model Context Protocol dans cette session — Claude peut l'utiliser directement, pas seulement en parler.",
  },
  {
    question: "Que veut dire le badge Souverain ?",
    reponse:
      "L'outil est développé et hébergé en Europe, un critère utile quand la conformité RGPD ou l'indépendance vis-à-vis des fournisseurs américains compte pour le projet.",
  },
];

const PRIX_LABEL: Record<Prix, string> = {
  gratuit: "Gratuit",
  freemium: "Freemium",
  payant: "Payant",
};
const PRIX_ROLE: Record<Prix, string> = {
  gratuit: "--success",
  freemium: "--info",
  payant: "--coral",
};

const ROLES = ["--info", "--coral", "--primary", "--warning", "--success"] as const;

export const Route = createFileRoute("/_authenticated/outils")({
  head: () => ({
    meta: [
      { title: "Outils IA — Studio Cami IA" },
      {
        name: "description",
        content: "Les outils IA utilisés chez Studio Cami, classés par usage, avec prix et disponibilité MCP.",
      },
    ],
  }),
  component: OutilsPage,
});

function OutilsPage() {
  const [recherche, setRecherche] = useState("");
  const [outilsAjoutes, setOutilsAjoutes] = useState<OutilAjoute[]>(() => chargerOutilsAjoutes());

  const sectionsCombinees = useMemo(() => {
    if (outilsAjoutes.length === 0) return SECTIONS;
    const parCategorie = new Map<string, Outil[]>();
    for (const section of SECTIONS) parCategorie.set(section.categorie, [...section.outils]);
    for (const { id: _id, categorie, ...reste } of outilsAjoutes) {
      const liste = parCategorie.get(categorie) ?? [];
      liste.push({ ...reste, logo: "Claude" });
      parCategorie.set(categorie, liste);
    }
    return CATEGORIES_LABELS.map((categorie) => ({
      categorie,
      outils: parCategorie.get(categorie) ?? [],
    })).filter((section) => section.outils.length > 0);
  }, [outilsAjoutes]);

  const totalOutils = useMemo(
    () => sectionsCombinees.reduce((somme, section) => somme + section.outils.length, 0),
    [sectionsCombinees],
  );

  const sectionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return sectionsCombinees;
    return sectionsCombinees
      .map((section) => ({
        ...section,
        outils: section.outils.filter(
          (o) =>
            o.nom.toLowerCase().includes(terme) || o.definition.toLowerCase().includes(terme),
        ),
      }))
      .filter((section) => section.outils.length > 0);
  }, [recherche, sectionsCombinees]);

  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState(CATEGORIES_LABELS[0]);
  const [nouveauPrix, setNouveauPrix] = useState<Prix>("freemium");
  const [nouvelleDefinition, setNouvelleDefinition] = useState("");

  function ajouterOutil(event: React.FormEvent) {
    event.preventDefault();
    const nom = nouveauNom.trim();
    const definition = nouvelleDefinition.trim();

    if (!nom || !definition) {
      toast.error("Renseigne au moins le nom et une courte description.");
      return;
    }

    const nouveau: OutilAjoute = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nom,
      definition,
      prix: nouveauPrix,
      categorie: nouvelleCategorie,
    };

    setOutilsAjoutes((precedent) => {
      const suivant = [...precedent, nouveau];
      try {
        window.localStorage.setItem(CLE_OUTILS_AJOUTES, JSON.stringify(suivant));
      } catch {
        // stockage indisponible (navigation privée…) — l'outil reste ajouté pour la session en cours
      }
      return suivant;
    });

    setNouveauNom("");
    setNouvelleDefinition("");
    setNouveauPrix("freemium");
    toast.success(`« ${nom} » ajouté aux outils.`);
  }

  const resultatsCount = sectionsFiltrees.reduce(
    (somme, section) => somme + section.outils.length,
    0,
  );

  const hautDePageRef = useRef<HTMLDivElement>(null);
  const [afficherRemonter, setAfficherRemonter] = useState(false);

  useEffect(() => {
    const noeud = hautDePageRef.current;
    if (!noeud) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAfficherRemonter(!(entry?.isIntersecting ?? true)),
      { threshold: 0 },
    );
    observer.observe(noeud);
    return () => observer.disconnect();
  }, []);

  function remonterEnHaut() {
    hautDePageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppShell>
      <div ref={hautDePageRef} aria-hidden="true" className="h-px" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold sm:text-lg">Outils</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un outil"
            aria-label="Rechercher un outil"
            className="h-11 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm text-primary outline-none transition focus:border-[var(--info)] focus:bg-card sm:h-auto sm:w-64 sm:py-2 sm:text-xs"
          />
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Mes outils IA</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {totalOutils} outils que j'utilise vraiment, classés par usage — pour retrouver le
            bon réflexe en un clic.
            {recherche.trim() ? (
              <span className="ml-1 font-semibold text-primary">
                {resultatsCount} résultat{resultatsCount > 1 ? "s" : ""} pour « {recherche} »
              </span>
            ) : null}
          </p>
        </div>

        <form onSubmit={ajouterOutil} className="cami-card mb-8 space-y-2 p-3 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Ajouter un outil
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              value={nouveauNom}
              onChange={(event) => setNouveauNom(event.target.value)}
              placeholder="Nom de l'outil"
              aria-label="Nom de l'outil"
              className="cami-input h-9 min-w-[140px] flex-[2] px-3 py-0 text-sm"
            />
            <select
              value={nouvelleCategorie}
              onChange={(event) => setNouvelleCategorie(event.target.value)}
              aria-label="Catégorie"
              className="cami-input h-9 flex-1 px-2 py-0 text-sm"
            >
              {CATEGORIES_LABELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={nouveauPrix}
              onChange={(event) => setNouveauPrix(event.target.value as Prix)}
              aria-label="Prix"
              className="cami-input h-9 px-2 py-0 text-sm"
            >
              <option value="gratuit">Gratuit</option>
              <option value="freemium">Freemium</option>
              <option value="payant">Payant</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={nouvelleDefinition}
              onChange={(event) => setNouvelleDefinition(event.target.value)}
              placeholder="En une phrase, à quoi ça sert"
              aria-label="Description"
              className="cami-input h-9 flex-1 px-3 py-0 text-sm"
            />
            <button
              type="submit"
              aria-label="Ajouter cet outil"
              title="Ajouter cet outil"
              className="cami-submit-btn h-9 w-9 shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav aria-label="Aller à une catégorie" className="mb-8 flex flex-wrap gap-1.5">
          {CATEGORIES_LABELS.map((categorie, index) => {
            const disponible = sectionsFiltrees.some((s) => s.categorie === categorie);
            const role = ROLES[index % ROLES.length];
            return disponible ? (
              <a
                key={categorie}
                href={`#categorie-${index}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-bold text-primary transition hover:-translate-y-0.5 hover:border-[var(--coral)] hover:text-[var(--coral)]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: `var(${role})` }}
                  aria-hidden="true"
                />
                {categorie}
              </a>
            ) : null;
          })}
        </nav>

        {sectionsFiltrees.length === 0 ? (
          <div className="cami-block-resume text-center text-sm text-muted-foreground">
            Aucun outil ne correspond à « {recherche} ».
          </div>
        ) : (
          <div className="space-y-8">
            {sectionsFiltrees.map((section) => {
              const roleIndex = CATEGORIES_LABELS.indexOf(section.categorie);
              const role = ROLES[roleIndex % ROLES.length];
              return (
                <section
                  key={section.categorie}
                  id={`categorie-${roleIndex}`}
                  className="scroll-mt-24"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, var(${role}) 14%, white)`,
                        color: `var(${role})`,
                      }}
                    >
                      {section.outils.length}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {section.categorie}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.outils.map((o) => (
                      <div key={o.nom} className="cami-card">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
                              <ToolLogo nom={o.logo} />
                            </span>
                            <p className="truncate text-sm font-bold text-primary">{o.nom}</p>
                          </div>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                            style={{
                              background: `color-mix(in srgb, var(${PRIX_ROLE[o.prix]}) 14%, white)`,
                              color: `var(${PRIX_ROLE[o.prix]})`,
                            }}
                          >
                            {PRIX_LABEL[o.prix]}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {o.definition}
                        </p>
                        {o.souverain || o.mcp ? (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {o.souverain ? (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                                style={{
                                  background: "color-mix(in srgb, var(--violet) 14%, white)",
                                  color: "var(--violet)",
                                }}
                              >
                                Souverain
                              </span>
                            ) : null}
                            {o.mcp ? (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]"
                                style={{
                                  background: "color-mix(in srgb, var(--primary) 14%, white)",
                                  color: "var(--primary)",
                                }}
                              >
                                MCP
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="mt-12 space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-primary">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.question} className="cami-card">
                <p className="text-sm font-bold text-primary">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{item.reponse}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {afficherRemonter ? (
        <button
          type="button"
          onClick={remonterEnHaut}
          aria-label="Remonter en haut de la page"
          title="Remonter en haut"
          className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_8px_20px_-8px_rgba(17,26,61,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </AppShell>
  );
}
