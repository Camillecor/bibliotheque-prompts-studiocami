import { createFileRoute } from "@tanstack/react-router";

import { COMPTE_ID } from "@/lib/compte";

// Point d'entrée appelé chaque matin par la tâche planifiée.
// Protégé par un secret d'en-tête : sans lui, la requête est refusée.
export const Route = createFileRoute("/api/public/veille-cron")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const attendu = process.env["VEILLE_CRON_SECRET"];
        const fourni = request.headers.get("x-veille-secret");
        if (!attendu || !fourni || fourni !== attendu) {
          return new Response("Non autorisé", { status: 401 });
        }

        const { executerVeille } = await import("@/lib/veille.server");
        const resultat = await executerVeille(COMPTE_ID);

        return Response.json(
          { statut: resultat.statut, nb_items: resultat.nb_items },
          { status: resultat.statut === "echec" ? 500 : 200 },
        );
      },
    },
  },
});
