# Refonte responsive de l’atelier Création

## Ce que tu obtiens

- Une page Création alignée avec les autres écrans : largeur maîtrisée, marges régulières et en-tête propre sur ordinateur comme sur mobile.
- Un atelier inspiré de Canva : barre d’actions compacte, colonne d’outils, colonne **Templates**, grande zone de création centrale et réglages contextuels.
- Des images, logos, textes et formes réellement manipulables dans la création : sélection, déplacement fluide à la souris ou au doigt, redimensionnement et rotation.
- Une navigation mobile adaptée : outils et Templates accessibles sans écraser la zone de création, réglages placés sous le visuel.

## Mise en page

- La galerie utilisera le même conteneur et les mêmes marges que les autres pages du Studio.
- L’éditeur aura une structure responsive sans débordement horizontal :
  - ordinateur large : outils + Templates à gauche, création au centre, réglages à droite ;
  - tablette : outils/Templates au-dessus, création puis réglages ;
  - mobile : commandes défilables, création centrée, panneaux en sections compactes.
- Les modèles existants seront présentés avec de vraies miniatures et pourront être appliqués au document ouvert après confirmation.

## Interactions

- Le déplacement sera attaché directement à chaque élément et continuera même si le pointeur sort momentanément de la zone.
- Les coordonnées seront limitées à la zone de création pour éviter de perdre un élément hors du visuel.
- Les images garderont leurs proportions pendant le redimensionnement ; textes et formes resteront librement redimensionnables.
- Le tactile désactivera le défilement uniquement pendant une manipulation.

## Vérification

- Contrôle visuel de la galerie et de l’éditeur aux formats ordinateur et mobile.
- Test d’ajout et de déplacement d’une image, d’application d’un Template et des commandes principales.
- Vérification TypeScript et formatage du code.
