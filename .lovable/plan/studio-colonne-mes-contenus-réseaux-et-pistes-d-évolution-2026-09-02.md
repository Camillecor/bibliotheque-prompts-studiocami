# Studio — colonne « Mes contenus », réseaux, et pistes d'évolution

## 1. Refonte de la colonne « Mes contenus »

Aujourd'hui la colonne est une simple liste de cartes plates, avec un bouton « Supprimer » toujours visible et aucun repère visuel fort.

Nouvelle version, dans la DA du site (navy / coral / info, cartes arrondies, Bricolage Grotesque pour les titres) :

- **En-tête** : titre « Mes contenus », compteur, et un champ de recherche compact.
- **Filtres rapides** : pastilles Tous / Brouillons / Planifiés / Publiés, avec le compte de chaque statut.
- **Groupement par statut** avec petits intertitres, pour retrouver l'essentiel d'un coup d'œil.
- **Carte de contenu retravaillée** :
  - liseré de couleur du réseau sur le bord gauche,
  - vignette du premier média (ou pastille du réseau si aucun visuel),
  - titre sur deux lignes max, puis extrait du texte,
  - ligne du bas : badge de statut coloré (brouillon gris, planifié info, publié succès) et date planifiée,
  - actions (Modifier, Dupliquer, Supprimer) dans un petit menu au survol, plus visibles au doigt sur mobile,
  - état actif nettement marqué (bordure coral + fond légèrement teinté) pour le contenu en cours d'édition.
- **État vide** illustré avec Mario et une phrase d'amorce.
- Marges et espacements harmonisés avec le reste du panneau (mêmes paddings que la bibliothèque).

## 2. Réseaux sociaux

Nouvelle liste, dans cet ordre : **Instagram, LinkedIn, Facebook**. X et Newsletter sont retirés partout (éditeur, filtres, calendrier, statistiques).

Instagram devient le réseau par défaut d'un nouveau contenu. Les contenus déjà enregistrés sur X ou Newsletter, s'il en existe, continuent de s'afficher avec leur étiquette d'origine pour ne rien perdre ; à la réouverture, l'éditeur propose de les basculer sur un réseau valide.

## 3. Pistes pour compléter et sécuriser le Studio

À valider — je peux en intégrer une ou plusieurs dans une prochaine passe :

**Compléter**
- Séries et déclinaisons : à partir d'un contenu, générer les variantes adaptées à chaque réseau en un clic.
- Modèles de posts réutilisables (accroche, structure, appel à l'action) et fils de plusieurs posts.
- Meilleures heures de publication suggérées, et rappel de la prochaine échéance.
- Aperçu fidèle du rendu Instagram / LinkedIn / Facebook avant planification.
- Passerelle avec la bibliothèque de prompts : transformer un prompt enregistré en contenu.

**Sécuriser**
- Réactiver la connexion : aujourd'hui tout passe par un utilisateur de test partagé, donc les contenus ne sont pas cloisonnés par personne.
- Corbeille avec restauration sous 30 jours plutôt qu'une suppression définitive.
- Historique des versions d'un contenu, avec retour à une version précédente.
- Sauvegarde automatique du brouillon en cours (aucune perte en cas de fermeture d'onglet).
- Export de sauvegarde (contenus + médias) au format fichier.

**Améliorer**
- Vue liste type tableau en complément du calendrier (tri, sélection multiple, actions groupées).
- Recherche globale au clavier (⌘K) sur contenus et médias.
- Compteur de caractères et alerte de dépassement par réseau, déjà présent, étendu aux hashtags et emojis.
- Statistiques enrichies : régularité par réseau, meilleur jour de publication, séries de semaines actives.

## Détails techniques

- `src/lib/studio.ts` : `RESEAUX` réduit à instagram / linkedin / facebook dans cet ordre ; `reseauInfo()` renvoie une étiquette neutre pour une valeur inconnue (contenus historiques) au lieu de retomber sur le premier réseau.
- `src/lib/studio.functions.ts` et `src/lib/studio.server.ts` : validations Zod alignées sur la nouvelle énumération pour les écritures, lecture tolérante pour l'existant ; `parReseau` dans les statistiques suit la nouvelle liste.
- `src/routes/_authenticated/studio.index.tsx` : extraction du panneau dans un composant `PanneauContenus` (recherche, filtres de statut, groupement, cartes retravaillées) ; réseau par défaut `instagram`.
- Aucune migration de base nécessaire : `reseau` reste une colonne texte.
