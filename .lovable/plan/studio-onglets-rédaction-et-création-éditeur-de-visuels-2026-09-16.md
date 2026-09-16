# Studio : onglets « Rédaction » et « Création » (éditeur de visuels)

## Ce que tu obtiens

En haut du Studio, deux grands boutons :

- **Rédaction** — tout ce qui existe déjà (contenus, médias, calendrier, statistiques), inchangé.
- **Création** — un nouvel atelier de visuels, façon Canva, pour composer tes images de publication.

## L'atelier « Création »

**Écran d'accueil** : la liste de tes créations enregistrées (aperçu, nom, date, dupliquer, renommer, supprimer) + un bouton « Nouvelle création » qui propose :

- les formats : carré 1:1, portrait 4:5, story 9:16, paysage 16:9, bannière LinkedIn
- des modèles prêts à l'emploi : post citation, annonce, carrousel (page 1 / page 2), story texte, avant/après
- ou une page blanche

**L'éditeur** : une zone de travail centrale, une barre d'outils à gauche pour ajouter des éléments, un panneau de réglages à droite pour l'élément sélectionné.

Éléments qu'on peut ajouter :

- **Texte** : police (une quinzaine de typos Google + tes typos du site), taille, graisse, italique, couleur, alignement, interligne, espacement des lettres, ombre, surlignage de fond, opacité.
- **Image / logo** : soit depuis ta bibliothèque **Médias**, soit par import direct depuis l'ordinateur. Recadrage simple, arrondi des angles, opacité, retournement.
- **Formes** : rectangle, rectangle arrondi, cercle, trait, bulle — couleur, contour, opacité.
- **Fond** : couleur unie, dégradé (2 couleurs, angle réglable), ou image de fond avec voile sombre/clair réglable.

Manipulations : déplacer à la souris ou au doigt, redimensionner par les poignées, pivoter, guides d'alignement magnétiques, ordre des calques (avant/arrière), dupliquer, verrouiller, supprimer, annuler/rétablir (Cmd/Ctrl+Z), zoom.

Palette : tes couleurs de marque (Navy, Coral, Info, blanc, encre) proposées en un clic, plus un sélecteur libre et un champ code couleur.

Sorties : **Enregistrer** (réouvrable et modifiable à tout moment), **Télécharger en PNG** (1x ou 2x), et **Envoyer dans Médias** pour réutiliser le visuel dans un contenu ou le calendrier.

Sur mobile : barre d'outils repliée en bas, panneau de réglages en tiroir, zones tactiles confortables.

## Détails techniques

**Navigation**
- Nouveau composant `StudioModeTabs` (Rédaction / Création) au-dessus des onglets actuels, rendu dans `src/routes/_authenticated/studio.tsx` qui devient une vraie mise en page (actuellement un simple `Outlet`).
- `StudioTabs` (Contenus / Médias / Calendrier / Statistiques) n'apparaît que sous Rédaction.
- Nouvelles routes : `src/routes/_authenticated/studio.creation.index.tsx` (galerie) et `studio.creation.$id.tsx` (éditeur), avec `head()` propre à chacune.

**Données**
- Migration : table `public.creations` (`id`, `compte_id`, `nom`, `format`, `largeur`, `hauteur`, `document` jsonb, `apercu` text, `created_at`, `updated_at`), index sur `compte_id`, `GRANT` pour `authenticated` et `service_role`, RLS activée, politiques alignées sur les tables Studio existantes.
- Document = JSON versionné : `{ v: 1, fond, calques: [...] }`. Les calques (texte, image, forme) sont typés dans `src/lib/creation.ts` avec Zod, partagé client/serveur.
- Aperçu : PNG réduit (~400 px) généré au moment de l'enregistrement, uploadé dans le bucket médias existant ; la ligne stocke son URL.
- Serveur : `src/lib/creation.functions.ts` + `creation.server.ts` (list / get / create / duplicate / rename / save / delete), même modèle `COMPTE_ID`, `supabaseAdmin`, limites de débit et erreurs génériques que `studio.server.ts`.

**Rendu**
- Rendu HTML/CSS absolu (pas de `<canvas>` pour l'édition) : texte net, typos réelles, sélection facile.
- Export PNG via `html-to-image` (`toPng`), police chargée avant export ; l'ajout dans Médias réutilise `uploadMedia`.
- Polices Google chargées par `<link>` dans `src/routes/__root.tsx` (jamais `@import` dans `styles.css`).
- Interactions pointeur (`pointerdown/move/up`) pour souris et tactile, historique annuler/rétablir en mémoire, autosauvegarde locale du document en cours dans `localStorage` comme l'éditeur de texte.

**Découpage de la construction**
1. Onglets Rédaction / Création + routes vides.
2. Table `creations` + fonctions serveur + galerie.
3. Éditeur : moteur de calques, déplacement/redimensionnement, texte, fond.
4. Images/logos (Médias + import) et formes.
5. Modèles prêts à l'emploi, export PNG, envoi dans Médias.
6. Finitions mobile, vérification TypeScript/Prettier et contrôle visuel dans le navigateur.
