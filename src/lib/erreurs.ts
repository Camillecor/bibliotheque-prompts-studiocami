// Gestion uniforme des erreurs côté serveur.
//
// Les messages bruts de la base ou des API externes peuvent révéler la
// structure interne (noms de tables, contraintes, clés). On les journalise
// côté serveur et on renvoie au navigateur un message générique en français.

export type ErreurBase = { message?: string | null };

/** Journalise l'erreur technique et renvoie l'erreur à lever côté client. */
export function erreurBase(contexte: string, erreur: ErreurBase): Error {
  console.error(`[${contexte}]`, erreur.message ?? erreur);
  return Object.assign(new Error("L'opération a échoué. Réessaie dans un instant."), {
    statusCode: 500,
  });
}

/** Erreur destinée à l'utilisateur : le message est volontairement affichable. */
export function erreurUtilisateur(message: string, statusCode = 400): Error {
  return Object.assign(new Error(message), { statusCode });
}
