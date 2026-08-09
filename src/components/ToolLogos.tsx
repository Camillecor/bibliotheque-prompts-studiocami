import type { ReactElement } from "react";

// Marques stylisées, dans le même esprit que src/components/IaLogos.tsx :
// des formes abstraites inspirées de chaque identité, pas les logos officiels.
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

function LogoClaude() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="11"
          y="1.5"
          width="2"
          height="7"
          rx="1"
          fill="#D97757"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function LogoClaudeCode() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="11"
          y="2.5"
          width="2"
          height="6"
          rx="1"
          fill="#D97757"
          opacity="0.55"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <path
        d="M9.5 9.5 7 12l2.5 2.5M14.5 9.5 17 12l-2.5 2.5"
        fill="none"
        stroke="#D97757"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoOpenAI() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect
          key={deg}
          x="10.5"
          y="2"
          width="3"
          height="8.5"
          rx="1.5"
          fill="#0b1330"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function LogoMistral() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="mistralGrad" x1="6" y1="2" x2="18" y2="22">
          <stop stopColor="#FF7000" />
          <stop offset="1" stopColor="#FFA700" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c2 4 6 6 6 11a6 6 0 1 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 .8 0 1-1 1-2 0-2-1-4 1-8Z"
        fill="url(#mistralGrad)"
      />
    </svg>
  );
}

function LogoPerplexity() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#20808D" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M4.5 7.5l15 9M4.5 16.5l15-9" strokeLinecap="round" />
    </svg>
  );
}

function LogoFigma() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="9" cy="6" r="3" fill="#F24E1E" />
      <circle cx="15" cy="9" r="3" fill="#A259FF" />
      <circle cx="9" cy="15" r="3" fill="#1ABCFE" />
      <circle cx="9" cy="21" r="3" fill="#0ACF83" />
    </svg>
  );
}

function LogoCanva() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="canvaGrad" x1="3" y1="4" x2="21" y2="20">
          <stop stopColor="#00C4CC" />
          <stop offset="1" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#canvaGrad)" />
      <path
        d="M8 13.2c0 2.6 1.9 4 4 4 1.3 0 2.3-.5 3-1.2M8 13.2c0-2.6 1.9-4.6 4.2-4.6 1 0 1.8.3 2.4.8"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoMidjourney() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M2 17c2.5-7 5-11 7-11 1.6 0 2 2.4 3 2.4S13.4 6 15 6c2 0 4.5 4 7 11-3-2-5-3-10-3s-7 1-10 3Z"
        fill="#0b0b0f"
      />
    </svg>
  );
}

function LogoLovable() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="lovableGrad" x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#FF6B9D" />
          <stop offset="1" stopColor="#E8425F" />
        </linearGradient>
      </defs>
      <path
        d="M12 20.5 4.8 13.3a5 5 0 1 1 7.2-6.9 5 5 0 1 1 7.2 6.9L12 20.5Z"
        fill="url(#lovableGrad)"
      />
    </svg>
  );
}

function LogoSupabase() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="supaGrad" x1="4" y1="2" x2="20" y2="22">
          <stop stopColor="#3ECF8E" />
          <stop offset="1" stopColor="#249361" />
        </linearGradient>
      </defs>
      <path d="M13 2 4 14h7l0 8 9-12h-7l0-8Z" fill="url(#supaGrad)" />
    </svg>
  );
}

function LogoNotion() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#0b0b0f" />
      <path
        d="M8 7v10l2-1V9.5l4.5 6.5H16V6l-2 1v6.5L9.6 6H8Z"
        fill="#fff"
      />
    </svg>
  );
}

function LogoGoogleDrive() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M8.5 3h7l7 12-3.5 6h-7Z" fill="#FFCF63" />
      <path d="M8.5 3 2 15l3.5 6 6.5-11.2Z" fill="#00AC47" />
      <path d="M5.5 21h13l-3.5-6h-6Z" fill="#2684FC" />
    </svg>
  );
}

function LogoGmail() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#fff" stroke="#E0E0E0" />
      <path d="M2 6.5 12 14 22 6.5" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 6.5v11.5h4v-8.2Z" fill="#4285F4" />
      <path d="M22 6.5v11.5h-4v-8.2Z" fill="#34A853" />
    </svg>
  );
}

function LogoZapier() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect
          key={deg}
          x="11"
          y="2.5"
          width="2"
          height="7.5"
          rx="1"
          fill="#FF4A00"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.4" fill="#201515" />
    </svg>
  );
}

const LOGO_COMPONENTS: Record<ToolLogoName, () => ReactElement> = {
  Claude: LogoClaude,
  ChatGPT: LogoOpenAI,
  Mistral: LogoMistral,
  Perplexity: LogoPerplexity,
  Figma: LogoFigma,
  Canva: LogoCanva,
  Midjourney: LogoMidjourney,
  Lovable: LogoLovable,
  Supabase: LogoSupabase,
  ClaudeCode: LogoClaudeCode,
  Notion: LogoNotion,
  GoogleDrive: LogoGoogleDrive,
  Gmail: LogoGmail,
  Zapier: LogoZapier,
};

export function ToolLogo({ nom }: { nom: ToolLogoName }) {
  const Logo = LOGO_COMPONENTS[nom];
  return <Logo />;
}
