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
  "GoogleGemini",
  "NotebookLM",
  "Photoroom",
  "Semrush",
  "JasperAI",
  "ElevenLabs",
  "Synthesia",
  "Granola",
  "N8n",
  "Cursor",
  "Gamma",
  "DeepL",
  "MerciApp",
  "Beehiiv",
  "Lindy",
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
  GoogleGemini: "google-gemini",
  NotebookLM: "notebooklm",
  Photoroom: "photoroom",
  Semrush: "semrush",
  JasperAI: "jasper-ai",
  ElevenLabs: "elevenlabs",
  Synthesia: "synthesia",
  Granola: "granola",
  N8n: "n8n",
  Cursor: "cursor",
  Gamma: "gamma",
  DeepL: "deepl",
  MerciApp: "merciapp",
  Beehiiv: "beehiiv",
  Lindy: "lindy",
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
