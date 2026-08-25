# Tester un prompt directement dans l'app

Ajouter un bouton « Tester ce prompt » qui remplit les variables manquantes, lance Claude, affiche le résultat et permet de le garder comme exemple attaché au prompt.

## Ce que ça donne pour toi

1. Depuis un prompt (juste après génération sur l'accueil, ou depuis le détail dans la bibliothèque), tu cliques sur **Tester ce prompt**.
2. Mario repère les trous du prompt — les `[À PRÉCISER]` et autres champs entre crochets — et affiche un mini-formulaire avec un champ par variable (rien à remplir s'il n'y en a pas).
3. Tu choisis le modèle (Haiku rapide / Sonnet équilibré, comme ailleurs dans l'app) et tu lances.
4. Le résultat s'affiche dessous : copiable, exportable, avec le prompt exact qui a été envoyé (variables remplacées) visible en repli.
5. Bouton **Garder comme exemple** : l'essai est enregistré et rattaché au prompt. Le détail d'un prompt dans la bibliothèque affiche alors ses essais (date, modèle, extrait), avec suppression possible.

Les essais servent aussi de preuve de qualité : sur une carte de la bibliothèque, une petite pastille indique qu'un prompt a déjà été testé.

## Détails techniques

**Base de données** — nouvelle table `essais` : `id`, `prompt_id` (référence `prompts`, `on delete cascade`), `user_id`, `variables` (jsonb), `prompt_final` (text), `modele` (text), `reponse` (text), `created_at`. RLS activée + GRANT comme les autres tables ; accès via `supabaseAdmin` et le `TEST_USER_ID` existant, pour rester cohérent avec `prompts`, `fiches` et `outils_persos` tant que l'authentification est désactivée.

**Serveur** — dans `src/lib/mario.server.ts`, une fonction `callAnthropicEssai` (même client Anthropic, `max_tokens` 4096, pas de system prompt MARIO : on envoie le prompt de l'utilisatrice tel quel comme message). Dans `src/lib/mario.functions.ts` :
- `testerPrompt` (validation Zod : `prompt` borné, `variables` en record de chaînes bornées, `modele` restreint à l'enum existant) — exécute et renvoie `{ reponse, prompt_final }`, sans écrire en base.
- `saveEssai`, `listEssais({ prompt_id })`, `deleteEssai` pour la persistance.

**Extraction des variables** — helper pur dans `src/lib/mario.ts` (`extraireVariables(prompt)`) : capture les segments `[À PRÉCISER]`, `[XXX]` en majuscules ou `{{var}}`, en ignorant les en-têtes de sections MARIO `[M] [A] [R] [I] [O]` déjà gérés par `decouperSections`. Testable isolément.

**UI** — nouveau composant `src/components/EssaiPrompt.tsx` (formulaire variables + sélecteur de modèle + état loading + résultat + actions), monté sous `PromptView` via une nouvelle prop optionnelle `essai` pour ne rien casser dans les usages existants. Branché dans `src/routes/index.tsx` (après génération) et `src/routes/_authenticated/bibliotheque.tsx` (vue détail, avec la liste des essais enregistrés). Style repris de l'existant : `cami-card`, blocs sémantiques, boutons coral, zones tactiles 44px sur mobile.

**Garde-fous** — pas de clé API côté client, longueurs d'entrée bornées côté serveur, message d'erreur clair si `ANTHROPIC_API_KEY` manque ou si Claude renvoie une erreur, et invalidation React Query de `["essais", promptId]` après enregistrement/suppression.

## Hors périmètre

L'authentification reste désactivée (`TEST_USER_ID` partagé) — à réactiver dans un chantier séparé avant tout partage public.
