import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copier" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="cami-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copié !" : label}
    </button>
  );
}
