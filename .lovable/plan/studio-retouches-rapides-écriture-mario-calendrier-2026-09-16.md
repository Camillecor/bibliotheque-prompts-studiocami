# Studio — retouches rapides : écriture, Mario, calendrier

Trois lots de retouches ciblées, sans changer la structure du Studio ni la base de données.

## 1. Confort d'écriture (onglet Contenus)

- **Brouillon jamais perdu** : le texte en cours est conservé localement dès la frappe ; en revenant sur l'onglet, il est proposé tel quel avec la mention « brouillon récupéré ».
- **Enregistrement automatique** : dès qu'un contenu a été enregistré une première fois, les modifications suivantes partent toutes seules après une courte pause de frappe, avec une petite mention « Enregistré à 14 h 32 ». Le bouton Enregistrer reste pour forcer.
- **Aperçu du post** : un panneau « Aperçu » montre le texte tel qu'il apparaîtra (avatar, nom, coupure « voir plus » d'Instagram/LinkedIn/Facebook, hashtags mis en valeur, vignette du média attaché).
- **Compteur amélioré** : jauge de remplissage colorée (vert / orange / rouge) au lieu du simple chiffre, plus nombre de mots, de hashtags et d'emojis.
- **Raccourcis clavier** : Cmd/Ctrl + S pour enregistrer, Cmd/Ctrl + Entrée pour lancer la génération Mario.

## 2. Mario plus utile

- **Décliner vers les autres réseaux** : un bouton « Décliner » crée, à partir du post courant, une version adaptée pour chacun des deux autres réseaux (longueur, ton, hashtags) et les enregistre comme brouillons liés.
- **Série de posts** : à partir d'une idée, Mario propose 3 posts d'une même série (angles différents) ; on choisit ceux qu'on garde.
- **Hashtags suggérés** : bouton « Hashtags » qui propose 8 à 12 hashtags adaptés au réseau et au sujet, cliquables pour les ajouter au texte ou aux tags.
- **Variantes en un clic** : les boutons existants (Raccourcir, Plus percutant, Plus narratif) gagnent « Ajouter une accroche » et « Ajouter un appel à l'action », et une possibilité de revenir à la version précédente.

## 3. Calendrier plus pratique

- **Vue semaine** : bascule Mois / Semaine, la semaine affichant les contenus par jour avec l'heure.
- **Déplacement plus fluide** : au glisser-déposer, la case survolée s'éclaire, l'heure d'origine est conservée (au lieu de repasser à 9 h) et un « Annuler » s'affiche dans la notification.
- **Créneaux habituels** : on définit ses jours et heures de publication préférés (par exemple mardi 9 h, jeudi 18 h) ; les cases correspondantes sont marquées en pointillés et un dépôt s'aligne automatiquement sur le créneau le plus proche.
- **Prochaines échéances** : en haut du calendrier, un bandeau « Cette semaine » rappelle ce qui est prévu, avec un bouton « Marquer comme publié » direct et une alerte douce sur les contenus planifiés dont la date est passée.

## Détails techniques

- **Client uniquement** pour le confort d'écriture : sauvegarde locale du brouillon (clé `cami:studio-brouillon`), enregistrement différé de 1,2 s via mutation existante `saveContenu`, aperçu en composant `ApercuPost.tsx`, compteur dans `JaugeLongueur.tsx`.
- **Mario** : nouvelles fonctions serveur dans `studio.functions.ts` (`declinerContenu`, `serieContenus`, `suggererHashtags`) appuyées sur de nouveaux prompts système dans `studio.server.ts`, même client Anthropic et même plafonnement (`limiterDebit`, 10/min). Validation Zod stricte sur les entrées, sorties JSON bornées.
- **Calendrier** : vue semaine et bandeau ajoutés dans `studio.calendrier.tsx` ; `planifierContenu` reçoit l'heure conservée ; créneaux habituels stockés localement (clé `cami:studio-creneaux`), pas de table supplémentaire ; annulation = nouvel appel `planifierContenu` avec l'ancienne date.
- **Aucune migration** : les tables `contenus`, `medias`, `contenu_medias` suffisent. La déclinaison crée simplement de nouvelles lignes `contenus`.
- Vérification : `bunx tsgo --noEmit`, prettier, et passage Playwright sur les trois écrans du Studio.

## Ordre de livraison

1. Confort d'écriture (sauvegarde auto, aperçu, jauge, raccourcis)
2. Mario (décliner, série, hashtags, variantes)
3. Calendrier (vue semaine, glisser-déposer, créneaux, échéances)
