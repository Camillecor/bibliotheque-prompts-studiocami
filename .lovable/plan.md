# Onglet « Projets » — gestion de tâches façon TickTick

Un nouvel onglet dans le rail de navigation, entre « Studio » et le reste, pour piloter tes projets et tes tâches, relié à tes contenus, fiches et prompts, avec l'aide de Mario.

## Ce que tu pourras faire

**Projets (listes)**
- Créer des projets avec un nom, une couleur et une icône.
- Colonne de gauche : la liste de tes projets + vues rapides « Aujourd'hui », « Cette semaine », « En retard », « Terminé ».

**Tâches**
- Ajouter une tâche en une ligne, cocher pour la terminer.
- Chaque tâche a : titre, note libre, date d'échéance (+ heure), priorité (Aucune / Basse / Moyenne / Haute), étiquettes, statut.
- Sous-tâches à cocher, avec une petite barre de progression sur la tâche parente.
- Rappels visuels : pastille rouge « en retard », orange « aujourd'hui », neutre « à venir » ; les priorités hautes ressortent en coral.

**Deux affichages**
- Vue liste : tâches groupées par échéance ou par priorité, cases à cocher, tri.
- Vue tableau (Kanban) : colonnes À faire / En cours / Terminé, glisser-déposer d'une colonne à l'autre (le statut suit).

**Lien avec le reste de l'app**
- Depuis une tâche : « Relier à… » un contenu du Studio, une fiche ou un prompt de la bibliothèque.
- L'élément relié s'affiche en pastille cliquable et ouvre la page correspondante.
- Depuis un contenu du Studio, un bouton « Créer une tâche » pré-remplit le titre et la date planifiée.

**Mario**
- Bouton « Découper avec Mario » : tu décris un objectif, Mario propose une liste de tâches (titres, sous-tâches, dates suggérées, priorités) que tu peux ajuster puis ajouter d'un coup au projet.

## Détails techniques

Base de données (une migration) :
- `projets` : `nom`, `couleur`, `icone`, `ordre`, `archive`, `user_id`, horodatages.
- `taches` : `projet_id`, `titre`, `note`, `statut` (`a_faire` / `en_cours` / `termine`), `priorite` (0–3), `echeance timestamptz`, `etiquettes text[]`, `ordre`, `termine_le`, `parent_id` (auto-référence pour les sous-tâches), plus `contenu_id`, `fiche_id`, `prompt_id` nullables vers les tables existantes.
- GRANT `authenticated` + `service_role`, RLS activée avec la même politique `auth.uid() = user_id` que les autres tables, trigger `set_updated_at` sur les deux tables.

Code :
- `src/lib/projets.ts` : constantes partagées (statuts Kanban, priorités, couleurs, vues rapides).
- `src/lib/projets.functions.ts` : CRUD projets/tâches/sous-tâches, réordonnancement, bascule de statut, liaison, le tout filtré sur `COMPTE_ID`, erreurs via `erreurBase`, validation Zod bornée.
- `src/lib/projets.server.ts` : appel Anthropic « découpage d'objectif » renvoyant un JSON de tâches, avec `limiterDebit("projets:decouper", 6, 60_000)`.
- Routes : `_authenticated/projets.tsx` (layout + onglets Liste / Tableau à la manière de `StudioTabs`), `projets.index.tsx` (vue liste), `projets.tableau.tsx` (Kanban).
- `AppShell.tsx` : entrée « Projets » (icône `ListChecks`) dans le rail desktop et le menu mobile ; panneau droit = détail de la tâche sélectionnée (note, sous-tâches, échéance, priorité, liaisons).
- Glisser-déposer natif HTML5 (pas de nouvelle dépendance), même DA que le Studio : cartes `rounded-[20px]`, ombres douces, coral pour les actions principales.
