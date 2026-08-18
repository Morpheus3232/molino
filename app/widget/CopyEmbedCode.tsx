"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const EMBED_CODE = `<iframe
  src="https://www.molino.app/embed"
  width="100%"
  height="440"
  style="border:none;border-radius:20px;overflow:hidden;"
  title="Molino — Calculadora de Mapa Personal"
  loading="lazy"
></iframe>`;

export default function CopyEmbedCode() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-bold">
          Código para pegar en tu sitio
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent hover:underline"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "¡Copiado!" : "Copiar al portapapeles"}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-foreground/90 overflow-x-auto whitespace-pre">
        <code>{EMBED_CODE}</code>
      </pre>
    </div>
  );
}
