// Identifiant du compte unique de l'application.
//
// L'application fonctionne volontairement sans authentification : toutes les
// données appartiennent à ce compte technique. Les fonctions serveur filtrent
// systématiquement sur cette valeur pour qu'aucune requête ne puisse toucher
// d'autres lignes, et l'identifiant n'est jamais accepté depuis le client.
export const COMPTE_ID = "00000000-0000-0000-0000-000000000001";
