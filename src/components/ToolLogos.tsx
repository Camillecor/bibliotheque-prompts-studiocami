// Vraies icônes de chaque outil, servies depuis public/tool-logos/.
export const TOOL_LOGO_NAMES = [
  "Claude",
  "ChatGPT",
  "Mistral",
  "Perplexity",
  "Figma",
  "Canva",
  "Midjourney",
  "Lovable",
  "Supabase",
  "ClaudeCode",
  "Notion",
  "GoogleDrive",
  "Gmail",
  "Zapier",
] as const;

export type ToolLogoName = (typeof TOOL_LOGO_NAMES)[number];

const LOGO_FILES: Record<ToolLogoName, string> = {
  Claude: "claude",
  ChatGPT: "chatgpt",
  Mistral: "mistral",
  Perplexity: "perplexity",
  Figma: "figma",
  Canva: "canva",
  Midjourney: "midjourney",
  Lovable: "lovable",
  Supabase: "supabase",
  ClaudeCode: "claude-code",
  Notion: "notion",
  GoogleDrive: "google-drive",
  Gmail: "gmail",
  Zapier: "zapier",
};

export function ToolLogo({ nom }: { nom: ToolLogoName }) {
  return (
    <img
      src={`/tool-logos/${LOGO_FILES[nom]}.png`}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}
