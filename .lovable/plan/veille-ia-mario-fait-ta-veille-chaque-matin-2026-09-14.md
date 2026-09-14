# Veille IA : Mario fait ta veille chaque matin

Un nouvel onglet "Veille IA" dans lequel Mario rassemble chaque matin ce qui bouge en IA, digital, nouveaux outils et nouvelles pratiques, et te le résume en un fil d'actus lisible en 5 minutes.

## Ce que tu verras

**Page Veille IA**
- En haut : date du jour, nombre de nouveautés, bouton "Relancer la veille" (si tu veux rafraîchir à la main).
- Le fil d'actus : une carte par actu avec le titre reformulé en clair, un résumé de 2 à 3 lignes, le nom de la source + la date, 1 à 3 étiquettes (ex. "Outil", "Modèle", "Pratique", "Marketing"), un lien "Lire la source" et une étoile "Garder".
- Filtres simples au-dessus du fil : Tout / Aujourd'hui / Cette semaine / Mes favoris, plus une recherche.
- Chargement pendant que Mario travaille, et un état vide avec Mario si rien de neuf.

**Panneau de droite : Mes sources**
- Tes flux (blogs, newsletters) : ajouter une adresse, la renommer, l'activer/désactiver, la supprimer.
- Tes thèmes de veille (mots-clés) : ceux que Mario utilise pour chercher en plus sur le web.
- Une petite ligne "Dernière veille : aujourd'hui à 07h05".

**Onglet secondaire : Mes favoris**
- Les actus que tu as gardées, triées par date, avec la même carte et la possibilité de retirer le favori.

## Comment ça marche pour toi

Chaque matin vers 7h, Mario relit tes flux, cherche en complément sur le web sur tes thèmes, écarte les doublons et ce que tu as déjà vu, puis écrit les résumés. Tu ouvres l'onglet et tout est prêt. Rien à lancer.

Au premier lancement, une petite liste de sources IA francophones et anglophones est déjà en place (tu peux tout modifier), et des thèmes de départ : IA générative, nouveaux outils IA, automatisation, marketing digital.

## Détails techniques

Base de données (une migration, avec droits et RLS sur le compte technique existant) :
- `veille_sources` : id, user_id, nom, url du flux, actif, dernière lecture.
- `veille_themes` : id, user_id, libellé, actif.
- `veille_items` : id, user_id, titre, résumé, url (unique par compte pour la déduplication), source, publié_le, tags text[], favori, créé_le.
- `veille_runs` : id, user_id, démarré_le, terminé_le, statut, nb_items, message d'erreur — sert aussi de verrou anti-doublon (un seul run à la fois) et d'état de pause.

Serveur :
- `src/lib/veille.ts` : types partagés, étiquettes, filtres.
- `src/lib/veille.server.ts` : lecture et parsing des flux RSS/Atom (fetch + parse XML léger, sans dépendance Node), recherche web complémentaire, puis appel Claude (Haiku pour le tri/résumé court, conformément à la règle du projet) qui renvoie un JSON borné : titre, résumé, tags, pertinence.
- `src/lib/veille.functions.ts` : `listVeille`, `listSources`, `saveSource`, `deleteSource`, `listThemes`, `saveTheme`, `deleteTheme`, `toggleFavoriVeille`, `lancerVeille` — mêmes conventions que le Studio (`COMPTE_ID`, `erreurBase`, validation Zod, `limiterDebit` sur `lancerVeille`, 3/60s).
- `src/routes/api/public/veille-cron.ts` : point d'entrée appelé chaque matin par une tâche planifiée, protégé par un secret d'en-tête. Lot borné (max 40 items par run), verrou en base, déduplication par URL, arrêt net et run marqué en échec si l'IA est indisponible.
- Planification quotidienne via pg_cron sur l'URL stable du projet.

Interface :
- `src/routes/_authenticated/veille.tsx` (layout + onglets Fil / Favoris), `veille.index.tsx`, `veille.favoris.tsx`, panneau droit `src/components/veille/PanneauSources.tsx`, onglets via un `VeilleTabs` calqué sur `StudioTabs`.
- Entrée "Veille IA" (icône `Rss`) ajoutée à `NAV_ITEMS` dans `AppShell.tsx` (rail desktop + menu mobile).
- DA existante conservée : cartes `glass-card`, Bricolage Grotesque pour les titres, coral pour les accents, marges harmonisées avec le Studio.

Un secret sera nécessaire pour protéger l'appel planifié ; je te le demanderai au moment de la mise en place.
