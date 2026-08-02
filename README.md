# Bibliothèque de prompts

Construis le MVP "Générateur de bibliothèque de prompts MARIO" pour Studio Cami IA.

## Objectif
Une app où l'utilisatrice décrit une idée en langage naturel, l'IA génère un prompt structuré selon la méthode MARIO en 2 versions (V1 puis V2 améliorée) + des étapes de lancement, et le range dans une bibliothèque triable par métier/mots-clés/date. Flux synchrone au clic — pas de cron, pas de traitement en tâche de fond.

## Design (charte Studio Cami — réutilisée telle quelle depuis l'app sœur "guide-achat-studiocami")
- Couleurs : navy `#0a1a3d` (texte/titres), sky `#38bdf8` (accent/focus), orange `#ff7a45` (CTA principal), fond de page `#f8fbff` (jamais blanc pur), cartes blanches
- Blocs sémantiques : "résumé" → fond `#ebf5ff` bordure sky-100 ; "amélioration" → fond `#fff5f0` bordure orange-100 ; "points positifs" → emerald-50/emerald-100 ; "alerte/vigilance" → amber-50/amber-200
- Police : Plus Jakarta Sans (400/500/600/700/800)
- Cartes très arrondies `rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm` (carte principale du formulaire : ombre plus marquée)
- Inputs `rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 focus:border-sky-400 focus:bg-white`
- CTA principal : `rounded-2xl bg-[#ff7a45] px-8 py-5 text-lg font-bold text-white shadow-lg shadow-orange-200 hover:-translate-y-0.5 hover:bg-[#e66a39] active:scale-95`
- Bouton secondaire : `rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-[#ff7a45] hover:text-[#ff7a45]`
- Badges (métier/mots-clés/complexité) : pills `rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em]`
- Icônes : lucide-react

## Écran 1 — Générateur (accueil)
Formulaire : textarea "Décris ton idée de prompt" (placeholder : "Un prompt pour aider mon équipe marketing à rédiger des posts LinkedIn engageants"), champ mots-clés (séparés par virgule, optionnel), dropdown métier optionnel (Marketing, Ventes, RH, Finance, Juridique, Produit, Support client, Opérations, Direction générale, Autre), bouton "Générer le prompt" avec état loading.

Résultat après génération : titre, badges (métier/mots-clés/complexité), deux colonnes côte à côte — Version 1 (prompt MARIO complet, copiable en 1 clic, fond sky) et Version 2 (prompt amélioré + encart "Ce qui a changé", fond orange) — puis section "Étapes pour lancer ce prompt" (liste numérotée). Si `alerte_pii: true`, bandeau amber visible avant le bouton "Sauvegarder dans ma bibliothèque" (classification pré-remplie, éditable).

## Écran 2 — Bibliothèque
Barre de recherche (titre + mots-clés), filtres par métier et par date, liste de cartes (titre, métier, mots-clés, date, complexité), clic → détail (V1, V2, étapes). Compteur "X prompts dans ta bibliothèque".

## Backend
- Table `prompts` (RLS activé, scopée à l'utilisatrice) : titre, metier, mots_cles (array), complexite, version_1 (jsonb), version_2 (jsonb), etapes_lancement (jsonb), date_ajout.
- Edge Function `generate-mario-prompt` : reçoit { idee, motsCles, metier }, appelle l'API Anthropic (`https://api.anthropic.com/v1/messages`, headers `x-api-key` avec le secret `ANTHROPIC_API_KEY` + `anthropic-version: 2023-06-01`, model `claude-opus-5`, max_tokens 1500) avec le system prompt MARIO ci-dessous, parse le JSON retourné (try/catch, renvoyer une erreur 502 claire si le parsing échoue), renvoie le JSON au client. La clé API ne doit JAMAIS être exposée côté client — uniquement en secret d'Edge Function.

### System prompt MARIO à utiliser tel quel (dans l'Edge Function) :
```
[M] MISE EN SITUATION
Tu es un expert senior en prompt engineering, spécialisé dans la méthode MARIO
(Mettre en situation, Attente, Règles, Informations, Output). Tu travailles pour
Studio Cami IA, une bibliothèque de prompts d'entreprise organisée par métier
(marketing, ventes, RH, finance, juridique, produit, etc.).

[A] ATTENTE PRINCIPALE
À partir d'une idée brute donnée par l'utilisateur (texte libre + mots-clés +
métier optionnel), tu dois :
1. Générer un prompt structuré au format MARIO (Version 1)
2. Produire une Version 2 : une itération améliorée de la V1, en corrigeant ou
   renforçant un aspect précis (précision du rôle, contraintes plus fortes,
   format de sortie plus exploitable, ou contexte enrichi — choisis l'axe
   d'amélioration le plus pertinent selon le prompt initial)
3. Expliquer en 3 à 5 étapes claires comment lancer ce prompt / ce projet
   concrètement (quel outil, quel modèle Claude utiliser, quelles infos
   préparer avant de lancer)
4. Proposer une classification pour la bibliothèque : métier, 3 à 5 mots-clés,
   niveau de complexité (simple / moyen / complexe)

[R] RÈGLES ET CONTRAINTES
- Respecte STRICTEMENT la structure MARIO pour les deux versions : chaque
  prompt généré doit contenir les 5 sections [M][A][R][I][O], même si l'idée
  de départ est vague — dans ce cas, pose des hypothèses raisonnables et
  signale-les.
- La V2 n'est pas une reformulation cosmétique de la V1. Elle doit apporter
  une amélioration fonctionnelle identifiable (plus de précision, moins
  d'ambiguïté, meilleur format de sortie).
- Reste concis : chaque prompt généré (V1 et V2) ne dépasse pas 200 mots.
- N'invente jamais de données sensibles ou personnelles dans les exemples.
- Si l'idée de l'utilisateur touche à des données personnelles (PII), signale-le
  avant de générer le prompt.
- Privilégie un français professionnel, clair, sans jargon technique inutile.
- Ne propose jamais plus de 5 mots-clés — la bibliothèque doit rester
  cherchable, pas noyée sous les tags.
- Réponds UNIQUEMENT au format JSON structuré ci-dessous (aucun texte hors JSON,
  aucun markdown, aucun bloc de code autour) — l'app parse la réponse
  directement.

[I] INFORMATIONS COMPLÉMENTAIRES
L'utilisateur est un(e) Product Builder IA / solopreneur qui construit sa
bibliothèque de prompts personnelle en portfolio. Métiers courants pour la
classification : Marketing, Ventes, RH, Finance, Juridique, Produit, Support
client, Opérations, Direction générale, Autre.

[O] FORMAT DE SORTIE
Réponds uniquement avec ce JSON (pas de texte avant/après) :
{
  "titre_prompt": "Titre court et clair du prompt (5-8 mots)",
  "metier": "Un des métiers listés ci-dessus",
  "mots_cles": ["mot1", "mot2", "mot3"],
  "complexite": "simple | moyen | complexe",
  "version_1": { "prompt": "[M] ... [A] ... [R] ... [I] ... [O] ...", "note": "Ce que couvre cette première version" },
  "version_2": { "prompt": "[M] ... [A] ... [R] ... [I] ... [O] ...", "amelioration": "Ce qui a été précisément amélioré par rapport à la V1" },
  "etapes_lancement": ["Étape 1 : ...", "Étape 2 : ...", "Étape 3 : ..."],
  "alerte_pii": false
}
```
Température 0.7, max_tokens 1500.

Si le secret `ANTHROPIC_API_KEY` n'est pas encore configuré, demande-le explicitement plutôt que de le coder en dur ou de le placer côté client.

Construis d'abord la maquette des deux écrans, puis branche la table + l'Edge Function + la sauvegarde/lecture.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/123c9a16-9332-4cec-99c5-aef31ebacb7a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
