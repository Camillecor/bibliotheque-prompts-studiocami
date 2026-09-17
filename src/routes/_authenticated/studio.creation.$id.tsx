import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { EditeurCreation } from "@/components/studio/EditeurCreation";
import { getCreation } from "@/lib/creation.functions";

export const Route = createFileRoute("/_authenticated/studio/creation/$id")({
  head: () => ({
    meta: [
      { title: "Éditeur de visuel | Studio Cami IA" },
      {
        name: "description",
        content: "Modifie ton visuel : textes, images, formes, couleurs et export PNG.",
      },
      { property: "og:title", content: "Éditeur de visuel — Studio Cami IA" },
      {
        property: "og:description",
        content: "Compose et exporte tes visuels de publication.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageEditeur,
});

function PageEditeur() {
  const { id } = Route.useParams();
  const fnGet = useServerFn(getCreation);

  const { data, isPending, isError } = useQuery({
    queryKey: ["creation", id],
    queryFn: () => fnGet({ data: { id } }),
  });

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[100rem] space-y-4 px-4 py-5 lg:px-6 lg:py-6">
        <Link
          to="/studio/creation"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux créations
        </Link>
        {isPending ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">Cette création est introuvable.</p>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-primary">{data.nom}</h1>
            <EditeurCreation creation={data} />
          </>
        )}
      </div>
    </AppShell>
  );
}
