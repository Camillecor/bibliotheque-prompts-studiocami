import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Génération d'un visuel par IA. La route relaie le flux de la passerelle IA
// pour que le navigateur affiche les aperçus progressifs pendant le rendu.
//
// Sécurité : l'application n'a pas d'authentification, cette route est donc
// publique. On valide strictement l'entrée, on limite le débit par IP et on ne
// renvoie jamais le détail technique de la passerelle au navigateur.
const CorpsSchema = z.object({
  prompt: z.string().trim().min(5).max(2000),
  stream: z.boolean().optional(),
});

export const Route = createFileRoute("/api/studio-visuel")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { limiterDebit } = await import("@/lib/securite.server");
        try {
          limiterDebit("studio:visuel", 8, 60_000);
        } catch (error) {
          return new Response((error as Error).message, { status: 429 });
        }

        let corps: unknown;
        try {
          corps = await request.json();
        } catch {
          return new Response("Requête invalide.", { status: 400 });
        }

        const analyse = CorpsSchema.safeParse(corps);
        if (!analyse.success) {
          return new Response("Décris le visuel souhaité en quelques mots.", { status: 400 });
        }

        const consigne = `${analyse.data.prompt}. Illustration soignée, sans texte incrusté, adaptée aux réseaux sociaux.`;

        if (analyse.data.stream === false) {
          const { genererVisuelSansFlux } = await import("@/lib/studio.server");
          try {
            const b64 = await genererVisuelSansFlux(consigne);
            return Response.json({ data: [{ b64_json: b64 }] });
          } catch (error) {
            console.error("[studio-visuel] génération", error);
            return new Response("La génération du visuel a échoué.", { status: 502 });
          }
        }

        const { ouvrirFluxVisuel } = await import("@/lib/studio.server");
        let reponse: Response;
        try {
          reponse = await ouvrirFluxVisuel(consigne);
        } catch (error) {
          console.error("[studio-visuel] passerelle indisponible", error);
          return new Response("La génération du visuel est indisponible.", { status: 502 });
        }

        if (!reponse.ok || !reponse.body) {
          const detail = await reponse.text().catch(() => "");
          console.error("[studio-visuel] gateway error", reponse.status, detail);
          const statut = reponse.status === 429 ? 429 : 502;
          return new Response(
            statut === 429
              ? "Trop de visuels demandés d'affilée. Réessaie dans un instant."
              : "La génération du visuel a échoué.",
            { status: statut },
          );
        }

        return new Response(reponse.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
