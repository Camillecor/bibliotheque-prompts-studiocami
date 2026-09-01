# Nouvel onglet « Studio » — communication de bout en bout

Un onglet inspiré d'Auguste : on crée le contenu, on prépare le visuel, on le place dans un calendrier éditorial, on le marque comme publié, et on suit ses statistiques d'activité. Tout reste dans l'esprit actuel de l'app (Mario, cartes arrondies, navy / coral / info, Bricolage Grotesque pour les titres).

## Structure

Un onglet **Studio** dans le rail de gauche, avec quatre sous-parties reliées entre elles :

```text
Studio
├── Contenus     produire le texte du post (Mario)
├── Médias       bibliothèque d'images + retouches + visuels IA
├── Calendrier   planifier les contenus, vue mois et semaine
└── Statistiques activité : produit / planifié / publié
```

Le fil rouge : un **contenu** est l'objet central. Il porte un texte, un réseau cible, un statut (brouillon / planifié / publié), une date planifiée et un ou plusieurs médias attachés. Le calendrier, la liste des contenus et les statistiques regardent tous cette même donnée — donc tout est lié par construction.

## 1. Contenus

- Liste des contenus avec filtres (réseau, statut, période) et recherche.
- Éditeur d'un contenu : réseau cible (LinkedIn, Instagram, Facebook, X, newsletter), texte avec compteur de caractères adapté au réseau, hashtags, médias attachés, date planifiée.
- **Génération par Mario** : à partir d'une idée courte, du réseau visé et du ton, Mario propose le texte (mêmes appels Claude que le générateur de prompts, avec un prompt système dédié « post réseau social »). Boutons « Régénérer », « Raccourcir », « Rendre plus percutant ».
- Réutilisation d'un prompt de la bibliothèque comme point de départ : le contenu peut être créé à partir d'un prompt existant.

## 2. Médias

- **Bibliothèque** : upload d'images, vignettes en grille, titre, tags, recherche, suppression. Stockage dans un espace de fichiers dédié à l'app.
- **Retouches simples** dans le navigateur : recadrage aux formats réseaux (1:1, 4:5, 16:9, 9:16), texte en surimpression (police, taille, couleur de la charte), fond uni ou dégradé de la charte, léger réglage luminosité/contraste. La version retouchée est enregistrée comme nouveau média, l'original est conservé.
- **Visuel généré par IA** : à partir du texte du post ou d'une description, génération d'une image (aperçu progressif pendant la génération), puis enregistrement dans la bibliothèque et attachement au contenu.

## 3. Calendrier éditorial

- Vue **mois** et vue **semaine**, chaque case affichant les contenus planifiés (pastille de couleur par réseau, vignette du média, début du texte).
- Glisser-déposer pour replanifier un contenu ; clic pour ouvrir l'éditeur.
- Encart « À planifier » listant les brouillons sans date, qu'on dépose directement dans une case.
- Bouton « Marquer comme publié » sur chaque contenu du jour.

## 4. Statistiques

Tableau de bord sur l'activité dans l'app (aucune donnée réseau externe pour l'instant) :
- Compteurs : contenus produits, planifiés, publiés, médias dans la bibliothèque.
- Courbe des publications par semaine sur les 12 dernières semaines.
- Répartition par réseau et par thème/tag.
- Régularité : jours publiés vs jours prévus sur le mois, et prochaine échéance.

## Détails techniques

**Base de données** (migration, RLS + GRANT comme les tables existantes, accès via `supabaseAdmin` et le `TEST_USER_ID` déjà utilisé partout tant que la connexion est désactivée) :
- `contenus` : `id`, `user_id`, `titre`, `texte`, `reseau`, `statut`, `tags[]`, `date_planifiee`, `date_publication`, `prompt_id` (référence facultative vers `prompts`), `created_at`, `updated_at`.
- `medias` : `id`, `user_id`, `chemin` (fichier), `titre`, `tags[]`, `largeur`, `hauteur`, `origine` (upload / retouche / ia), `media_parent_id`, `created_at`.
- `contenu_medias` : table de liaison `contenu_id` / `media_id` / `ordre`.
- Un espace de stockage privé `medias` avec URLs signées pour l'affichage.

**Serveur** — `src/lib/studio.functions.ts` (CRUD contenus / médias / liaisons / statistiques agrégées) et `src/lib/studio.server.ts` :
- `callAnthropicPost` pour la rédaction et les variantes (même client Anthropic que `mario.server.ts`).
- `genererVisuel` via la passerelle IA de Lovable en mode streaming, avec aperçus progressifs floutés jusqu'à l'image finale.
- Validation Zod stricte sur toutes les entrées (longueurs bornées, énumérations pour réseau et statut, types d'image restreints à PNG/JPEG/WebP, taille plafonnée).

**Routes** — `src/routes/_authenticated/studio.tsx` (layout avec `<Outlet />` et les onglets internes) plus `studio.index.tsx` (redirige vers Contenus), `studio.contenus.tsx`, `studio.medias.tsx`, `studio.calendrier.tsx`, `studio.statistiques.tsx`. Entrée « Studio » ajoutée au rail et au menu burger de `AppShell.tsx`, filtres de chaque écran placés dans le panneau latéral `panel` déjà prévu par le shell.

**Front** — React Query pour toutes les lectures/écritures avec invalidation croisée (modifier un contenu rafraîchit calendrier et statistiques). Éditeur d'image en canvas natif, sans dépendance lourde. Calendrier construit à la main avec `date-fns` (déjà présent) plutôt qu'une librairie de calendrier, pour coller à la charte. Recharts pour les courbes de statistiques (déjà dans le projet via shadcn).

**Découpage de livraison** — la fonctionnalité est large ; je propose de la construire en trois passes : (1) contenus + calendrier, (2) médias (bibliothèque, retouches, visuels IA), (3) statistiques et finitions responsive.

## Hors périmètre

Pas de publication automatique sur les réseaux ni de récupération des vues/likes : le calendrier planifie et on marque manuellement comme publié. L'authentification reste désactivée (utilisateur de test partagé).
