import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Terme = { nom: string; definition: string };
type SectionLettre = { lettre: string; termes: Terme[] };
type FAQ = { question: string; reponse: string };

// Contenu repris à l'identique de prompt-engine.fr/glossaire (53 définitions, classées de A à Z).
const SECTIONS: SectionLettre[] = [
  {
    lettre: "A",
    termes: [
      {
        nom: "Agent IA",
        definition:
          "Système autonome utilisant un LLM pour planifier et exécuter des actions en séquence.",
      },
      {
        nom: "Attention",
        definition:
          "Composant des Transformers permettant de pondérer l'importance de chaque token.",
      },
    ],
  },
  {
    lettre: "B",
    termes: [
      {
        nom: "Benchmark LLM",
        definition:
          "Ensemble de tests standardisés évaluant objectivement les capacités du modèle.",
      },
      {
        nom: "Biais de modèle",
        definition:
          "Tendance du LLM à favoriser certains points de vue selon les données d'entraînement.",
      },
    ],
  },
  {
    lettre: "C",
    termes: [
      {
        nom: "Chain-of-Thought (CoT)",
        definition:
          "Technique demandant au modèle d'expliciter ses étapes de raisonnement.",
      },
      {
        nom: "Claude",
        definition: "LLM développé par Anthropic en versions Haiku, Sonnet et Opus.",
      },
      {
        nom: "Constitutional AI",
        definition: "Méthode d'alignement entraînant le modèle à s'auto-critiquer.",
      },
      {
        nom: "Context window",
        definition: "Nombre maximum de tokens qu'un LLM peut traiter en une requête.",
      },
      {
        nom: "Contrainte de format",
        definition: "Instructions spécifiant la forme de la réponse attendue.",
      },
    ],
  },
  {
    lettre: "E",
    termes: [
      {
        nom: "Embedding",
        definition:
          "Représentation vectorielle d'un texte dans un espace numérique multidimensionnel.",
      },
    ],
  },
  {
    lettre: "F",
    termes: [
      {
        nom: "Few-shot prompting",
        definition:
          "Technique fournissant 2 à 10 exemples avant la tâche réelle.",
      },
      {
        nom: "Fine-tuning",
        definition:
          "Réentraînement sur un dataset spécialisé pour améliorer les performances.",
      },
      {
        nom: "Function calling (Tool use)",
        definition: "Capacité à appeler des fonctions externes structurées en JSON.",
      },
    ],
  },
  {
    lettre: "G",
    termes: [
      {
        nom: "GEO (Generative Engine Optimization)",
        definition: "Optimisation du contenu pour les IA conversationnelles.",
      },
      {
        nom: "Gemini",
        definition: "LLM multimodal développé par Google DeepMind.",
      },
      {
        nom: "GPT",
        definition: "Famille de modèles développée par OpenAI.",
      },
      {
        nom: "Guardrails",
        definition: "Mécanismes de sécurité filtrant les sorties nuisibles.",
      },
    ],
  },
  {
    lettre: "H",
    termes: [
      {
        nom: "Hallucination",
        definition:
          "Phénomène où le LLM génère des informations fausses avec confiance.",
      },
    ],
  },
  {
    lettre: "I",
    termes: [
      {
        nom: "Inference",
        definition:
          "Phase d'utilisation d'un modèle entraîné pour générer des réponses.",
      },
      {
        nom: "Instruction prompting",
        definition:
          "Formulation explicite d'une tâche sous forme d'instruction directe.",
      },
      {
        nom: "Iterative prompting",
        definition: "Affinage progressif du prompt en plusieurs cycles.",
      },
    ],
  },
  {
    lettre: "J",
    termes: [
      {
        nom: "Jailbreak",
        definition:
          "Technique visant à contourner les guardrails via des prompts manipulatoires.",
      },
      {
        nom: "JSON mode",
        definition: "Mode forçant le LLM à répondre en JSON valide et parseable.",
      },
    ],
  },
  {
    lettre: "L",
    termes: [
      {
        nom: "LLM (Large Language Model)",
        definition: "Modèle entraîné sur de vastes corpus textuels.",
      },
    ],
  },
  {
    lettre: "M",
    termes: [
      {
        nom: "Méta-prompt",
        definition: "Prompt générant d'autres prompts optimisés.",
      },
      {
        nom: "Mistral",
        definition: "LLM open-source développé par Mistral AI.",
      },
      {
        nom: "Modèle de fondation",
        definition: "LLM pré-entraîné servant de base pour le fine-tuning.",
      },
    ],
  },
  {
    lettre: "N",
    termes: [
      {
        nom: "Negative prompting",
        definition: "Instructions indiquant ce que le modèle ne doit PAS faire.",
      },
    ],
  },
  {
    lettre: "O",
    termes: [
      {
        nom: "One-shot prompting",
        definition: "Fournir exactement un exemple avant la tâche réelle.",
      },
      {
        nom: "Output parsing",
        definition:
          "Extraction et structuration des données depuis la réponse brute.",
      },
    ],
  },
  {
    lettre: "P",
    termes: [
      {
        nom: "Persona prompting",
        definition: "Assignation d'un rôle ou d'une identité précise au modèle.",
      },
      {
        nom: "Prompt",
        definition: "Texte d'entrée déclenchant une génération du LLM.",
      },
      {
        nom: "Prompt chaining",
        definition: "Technique reliant plusieurs prompts en séquence.",
      },
      {
        nom: "Prompt compression",
        definition: "Réduction de la longueur sans perte d'information significative.",
      },
      {
        nom: "Prompt engineering",
        definition:
          "Discipline consistant à concevoir, tester et optimiser les instructions.",
      },
      {
        nom: "Prompt injection",
        definition:
          "Attaque injectant des instructions malveillantes dans un contenu.",
      },
      {
        nom: "Prompt template",
        definition:
          "Structure réutilisable avec variables à substituer dynamiquement.",
      },
    ],
  },
  {
    lettre: "R",
    termes: [
      {
        nom: "RAG (Retrieval-Augmented Generation)",
        definition: "Architecture combinant LLM et base vectorielle.",
      },
      {
        nom: "ReAct",
        definition:
          "Framework alternant raisonnement explicite et action concrète.",
      },
      {
        nom: "RLHF",
        definition:
          "Technique d'entraînement par renforcement à partir de retours humains.",
      },
      {
        nom: "Role prompting",
        definition: "Voir Persona prompting.",
      },
    ],
  },
  {
    lettre: "S",
    termes: [
      {
        nom: "Semantic search",
        definition: "Recherche basée sur le sens plutôt que la correspondance exacte.",
      },
      {
        nom: "Structured output",
        definition: "Sortie formatée selon un schéma prédéfini.",
      },
      {
        nom: "System prompt",
        definition: "Instruction initiale définissant le comportement du modèle.",
      },
    ],
  },
  {
    lettre: "T",
    termes: [
      {
        nom: "Temperature",
        definition:
          "Paramètre contrôlant la créativité et la variabilité des sorties.",
      },
      {
        nom: "Token",
        definition: "Unité de base traitée par un LLM (~¾ mot en anglais).",
      },
      {
        nom: "Top-p (nucleus sampling)",
        definition: "Paramètre sélectionnant un ensemble de tokens.",
      },
      {
        nom: "Transformer",
        definition: "Architecture basée sur le mécanisme d'attention.",
      },
      {
        nom: "Tree of Thoughts (ToT)",
        definition:
          "Extension du CoT explorant plusieurs branches en parallèle.",
      },
    ],
  },
  {
    lettre: "U",
    termes: [
      {
        nom: "User prompt",
        definition:
          "Message envoyé par l'utilisateur dans une conversation avec le LLM.",
      },
    ],
  },
  {
    lettre: "V",
    termes: [
      {
        nom: "Variable de prompt",
        definition: "Placeholder remplacé dynamiquement dans un template.",
      },
      {
        nom: "Vectorisation",
        definition:
          "Transformation d'un texte en embedding pour recherche sémantique.",
      },
    ],
  },
  {
    lettre: "Z",
    termes: [
      {
        nom: "Zero-shot prompting",
        definition: "Demander une tâche sans fournir d'exemples préalables.",
      },
    ],
  },
];

const FAQ: FAQ[] = [
  {
    question: "Qu'est-ce que le prompt engineering ?",
    reponse:
      "Le prompt engineering est la discipline consistant à concevoir, tester et optimiser les instructions données aux LLMs (modèles de langage) pour maximiser la qualité et la pertinence des sorties. Un prompt bien structuré inclut un rôle, un contexte, une tâche précise, des contraintes et un format de sortie.",
  },
  {
    question: "Quelle est la différence entre zero-shot et few-shot prompting ?",
    reponse:
      "Le zero-shot prompting demande une tâche sans fournir d'exemples. Le few-shot prompting inclut 2 à 10 exemples (paires input/output) avant la tâche pour guider le modèle. Le few-shot est plus efficace pour les formats complexes ou les styles spécifiques.",
  },
  {
    question: "Comment réduire les hallucinations d'un LLM ?",
    reponse:
      "Pour réduire les hallucinations : utilisez le RAG (Retrieval-Augmented Generation) pour ancrer les réponses dans des documents fiables, demandez au modèle d'indiquer son niveau de confiance, fournissez des sources dans le prompt, et activez le grounding quand disponible.",
  },
  {
    question: "Qu'est-ce qu'une context window ?",
    reponse:
      "La context window est le nombre maximum de tokens qu'un LLM peut traiter en une seule requête (entrée + sortie combinées). Elle varie de 4 000 tokens (anciens modèles) à 2 millions (Gemini 1.5 Pro). Un contexte trop long peut dégrader les performances sur les éléments au milieu.",
  },
  {
    question: "Qu'est-ce que le RAG en IA ?",
    reponse:
      "Le RAG (Retrieval-Augmented Generation) est une architecture combinant un LLM avec une base de données vectorielle. Le système récupère les documents pertinents (retrieval) et les injecte dans le contexte du LLM avant la génération. Résultat : des réponses plus précises et ancrées dans des données réelles, avec moins d'hallucinations.",
  },
];

const ROLES = ["--info", "--coral", "--primary", "--warning", "--success"] as const;

export const Route = createFileRoute("/_authenticated/glossaire")({
  head: () => ({
    meta: [
      { title: "Glossaire du prompt engineering — Studio Cami IA" },
      {
        name: "description",
        content:
          "53 définitions claires sur le prompt engineering, les LLMs et l'IA générative, classées de A à Z.",
      },
    ],
  }),
  component: GlossairePage,
});

function GlossairePage() {
  const [recherche, setRecherche] = useState("");

  const totalTermes = useMemo(
    () => SECTIONS.reduce((somme, section) => somme + section.termes.length, 0),
    [],
  );

  const sectionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return SECTIONS;
    return SECTIONS.map((section) => ({
      ...section,
      termes: section.termes.filter(
        (t) =>
          t.nom.toLowerCase().includes(terme) || t.definition.toLowerCase().includes(terme),
      ),
    })).filter((section) => section.termes.length > 0);
  }, [recherche]);

  const resultatsCount = sectionsFiltrees.reduce(
    (somme, section) => somme + section.termes.length,
    0,
  );

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold sm:text-lg">Glossaire</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un terme"
            aria-label="Rechercher un terme du glossaire"
            className="h-11 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm text-primary outline-none transition focus:border-[var(--info)] focus:bg-card sm:h-auto sm:w-64 sm:py-2 sm:text-xs"
          />
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Glossaire du prompt engineering
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {totalTermes} définitions claires sur le prompt engineering, les LLMs et l'IA
            générative, classées de A à Z.
            {recherche.trim() ? (
              <span className="ml-1 font-semibold text-primary">
                {resultatsCount} résultat{resultatsCount > 1 ? "s" : ""} pour « {recherche} »
              </span>
            ) : null}
          </p>
        </div>

        {sectionsFiltrees.length === 0 ? (
          <div className="cami-block-resume text-center text-sm text-muted-foreground">
            Aucun terme ne correspond à « {recherche} ».
          </div>
        ) : (
          <div className="space-y-8">
            {sectionsFiltrees.map((section, sectionIndex) => {
              const role = ROLES[sectionIndex % ROLES.length];
              return (
                <section key={section.lettre}>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, var(${role}) 14%, white)`,
                        color: `var(${role})`,
                      }}
                    >
                      {section.lettre}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {section.termes.length} terme{section.termes.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.termes.map((t) => (
                      <div key={t.nom} className="cami-card">
                        <p className="text-sm font-bold text-primary">{t.nom}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {t.definition}
                        </p>
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
    </AppShell>
  );
}
