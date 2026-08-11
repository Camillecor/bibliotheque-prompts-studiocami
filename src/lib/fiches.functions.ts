import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FicheInputSchema = z.object({
  description: z.string().default(""),
  lien: z.string().default(""),
  image: z
    .object({
      mediaType: z.enum(["image/png", "image/jpeg"]),
      base64: z.string().max(7_000_000),
    })
    .optional(),
});

export const genererFiche = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FicheInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ markdown: string }> => {
    const { callAnthropicFiche } = await import("@/lib/fiches.server");
    return callAnthropicFiche(data);
  });
