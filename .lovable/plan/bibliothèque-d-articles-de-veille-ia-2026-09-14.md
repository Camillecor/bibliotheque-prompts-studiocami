# Bibliothèque d'articles de Veille IA

Transformer l'onglet "Mes favoris" en véritable bibliothèque des articles gardés avec l'étoile orange, pensée pour être relue et retrouvée des semaines plus tard.

## Ce que tu verras

Un onglet "Articles" dans la Veille IA, qui rassemble tous les articles étoilés :

- **Une barre de recherche** sur le titre, le résumé, la source et les mots-clés.
- **Des filtres rapides par thème** (Outil, Modèle, Pratique, Marketing, Étude, Réglementation) et **par source**, affichés en pastilles avec le nombre d'articles.
- **Un tri** : plus récents d'abord, ou par source.
- **Un regroupement par mois** ("Septembre 2026", "Août 2026") pour retrouver facilement une période.
- **Des cartes d'article** identiques au fil d'actus : titre, résumé, mots-clés colorés, source et date, "Lire la source", étoile orange pleine (cliquer dessus retire l'article de la bibliothèque) et corbeille.
- **Un compteur** en haut : nombre d'articles gardés, nombre de sources représentées.
- **Un état vide** avec Mario qui explique qu'il suffit de cliquer sur l'étoile d'une actu du fil.

Le fil d'actus reste inchangé : l'étoile orange y sert toujours à envoyer un article dans la bibliothèque.

## Détails techniques

- Renommer l'onglet `Mes favoris` en `Articles` dans `src/components/VeilleTabs.tsx` (icône `Library`), route inchangée : `/veille/favoris`.
- Réécrire `src/routes/_authenticated/veille.favoris.tsx` : même requête `listVeilleItems` (clé `veille-items`, cache partagé avec le fil), filtrage `favori === true` côté client, puis recherche / filtres tag + source / tri / regroupement par mois via `useMemo`.
- Extraire les pastilles de filtre déjà utilisées dans `veille.index.tsx` en un petit composant partagé `src/components/veille/ChipsFiltre.tsx` pour garder un style identique sur les deux pages.
- Regroupement par mois calculé sur `publie_le ?? created_at`, libellés via `toLocaleDateString("fr-FR", { month: "long", year: "numeric" })`.
- Réutiliser `CarteVeille` tel quel (l'étoile est déjà coral/orange remplie quand `favori` est vrai) et les mutations existantes `toggleFavoriVeille` / `deleteVeilleItem`.
- Panneau droit : conserver `PanneauSources`.
- Métadonnées `head()` de la page mises à jour (titre "Ma bibliothèque de veille IA").
- Aucun changement de base de données : le champ `favori` de `veille_items` suffit.
