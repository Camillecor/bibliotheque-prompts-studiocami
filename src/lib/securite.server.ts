// Garde-fous serveur pour une application sans authentification.
//
// Sans connexion, chaque fonction serveur est un point d'entrée public : on
// limite donc le débit par adresse IP pour éviter qu'un tiers vide le quota
// d'IA, sature le stockage ou martèle la base.
import { getRequest } from "@tanstack/react-start/server";

import { erreurUtilisateur } from "@/lib/erreurs";

type Compteur = { nombre: number; expiration: number };

// Fenêtre glissante en mémoire du worker. Volontairement simple : elle bloque
// les abus automatisés sans base de données ni dépendance supplémentaire.
const compteurs = new Map<string, Compteur>();
const TAILLE_MAX = 5000;

function identifiantAppelant(): string {
  try {
    const requete = getRequest();
    const entetes = requete?.headers;
    const ip =
      entetes?.get("cf-connecting-ip") ??
      entetes?.get("x-real-ip") ??
      entetes?.get("x-forwarded-for")?.split(",")[0]?.trim();
    return ip || "inconnu";
  } catch {
    return "inconnu";
  }
}

function nettoyer(maintenant: number) {
  if (compteurs.size < TAILLE_MAX) return;
  for (const [cle, compteur] of compteurs) {
    if (compteur.expiration <= maintenant) compteurs.delete(cle);
  }
}

/**
 * Autorise au plus `max` appels par `fenetreMs` pour une action donnée.
 * Lève une erreur 429 lisible par l'utilisatrice au-delà.
 */
export function limiterDebit(action: string, max: number, fenetreMs: number): void {
  const maintenant = Date.now();
  nettoyer(maintenant);

  const cle = `${action}:${identifiantAppelant()}`;
  const compteur = compteurs.get(cle);

  if (!compteur || compteur.expiration <= maintenant) {
    compteurs.set(cle, { nombre: 1, expiration: maintenant + fenetreMs });
    return;
  }

  compteur.nombre += 1;
  if (compteur.nombre > max) {
    const secondes = Math.max(1, Math.ceil((compteur.expiration - maintenant) / 1000));
    throw erreurUtilisateur(
      `Trop de demandes d'affilée. Réessaie dans ${secondes} seconde${secondes > 1 ? "s" : ""}.`,
      429,
    );
  }
}
