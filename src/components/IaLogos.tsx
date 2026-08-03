export const IA_LOGO_NAMES = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
  "Meta",
  "Mistral",
  "Perplexity",
] as const;

export type IaLogoName = (typeof IA_LOGO_NAMES)[number];

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

function LogoGemini() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <defs>
        <linearGradient id="geminiGrad" x1="2" y1="4" x2="22" y2="20">
          <stop stopColor="#4C8DF6" />
          <stop offset="0.55" stopColor="#B06AF5" />
          <stop offset="1" stopColor="#F45C6E" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 Q13 10 22 12 Q13 14 12 22 Q11 14 2 12 Q11 10 12 2 Z"
        fill="url(#geminiGrad)"
      />
    </svg>
  );
}

function LogoCopilot() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect x="2" y="2" width="9" height="9" fill="#F35325" />
      <rect x="13" y="2" width="9" height="9" fill="#81BC06" />
      <rect x="2" y="13" width="9" height="9" fill="#05A6F0" />
      <rect x="13" y="13" width="9" height="9" fill="#FFBA08" />
    </svg>
  );
}

function LogoMeta() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <defs>
        <linearGradient id="metaGrad" x1="4" y1="12" x2="20" y2="12">
          <stop stopColor="#0064E1" />
          <stop offset="1" stopColor="#0082FB" />
        </linearGradient>
      </defs>
      <path
        d="M4 12c0-3 2-5 4.5-5S12 9 12 12s1.5 5 4 5 4.5-2 4.5-5-2-5-4.5-5S12 9 12 12s-1.5 5-4 5S4 15 4 12Z"
        stroke="url(#metaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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

const LOGO_COMPONENTS: Record<IaLogoName, () => JSX.Element> = {
  ChatGPT: LogoOpenAI,
  Claude: LogoClaude,
  Gemini: LogoGemini,
  Copilot: LogoCopilot,
  Meta: LogoMeta,
  Mistral: LogoMistral,
  Perplexity: LogoPerplexity,
};

export function IaLogo({ nom }: { nom: IaLogoName }) {
  const Logo = LOGO_COMPONENTS[nom];
  return <Logo />;
}
