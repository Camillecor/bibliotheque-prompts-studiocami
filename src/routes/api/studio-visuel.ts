import { createFileRoute } from "@tanstack/react-router";

// Génération d'un visuel par IA. La route relaie le flux de la passerelle IA
// pour que le navigateur affiche les aperçus progressifs pendant le rendu.
export const Route = createFileRoute("/api/studio-visuel")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let corps: unknown;
        try {
          corps = await request.json();
        } catch {
          return new Response("Requête invalide", { status: 400 });
        }

        const { prompt, stream } = (corps ?? {}) as { prompt?: unknown; stream?: unknown };
        if (typeof prompt !== "string" || prompt.trim().length < 5 || prompt.length > 2000) {
          return new Response("Décris le visuel souhaité en quelques mots.", { status: 400 });
        }

        const consigne = `${prompt.trim()}. Illustration soignée, sans texte incrusté, adaptée aux réseaux sociaux.`;

        if (stream === false) {
          const { genererVisuelSansFlux } = await import("@/lib/studio.server");
          try {
            const b64 = await genererVisuelSansFlux(consigne);
            return Response.json({ data: [{ b64_json: b64 }] });
          } catch (error) {
            return new Response((error as Error).message, { status: 502 });
          }
        }

        const { ouvrirFluxVisuel } = await import("@/lib/studio.server");
        let reponse: Response;
        try {
          reponse = await ouvrirFluxVisuel(consigne);
        } catch (error) {
          return new Response((error as Error).message, { status: 500 });
        }

        if (!reponse.ok || !reponse.body) {
          const detail = await reponse.text().catch(() => "");
          console.error("[studio-visuel] gateway error", reponse.status, detail);
          return new Response(detail || "La génération du visuel a échoué.", {
            status: reponse.status,
          });
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
