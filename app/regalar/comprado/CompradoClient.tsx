"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, Copy, Share2, Gift } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CompradoClient() {
  const [code, setCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("code");
    setCode(c);
  }, []);

  if (!code) {
    return (
      <main className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 text-center px-4">
        <p className="text-sm text-muted">
          No encontramos tu código. Si ya pagaste, revisá tu email — te lo enviamos ahí también.
        </p>
        <Link href="/regalar" className="text-xs font-mono text-accent hover:underline mt-4 inline-block">
          Volver a /regalar →
        </Link>
      </main>
    );
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/regalar/${code}`;

  const copy = async (text: string, setFlag: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlag(true);
      setTimeout(() => setFlag(false), 2200);
      toast.success("Copiado");
    } catch {
      toast.error("No pudimos copiar. Copialo manualmente.");
    }
  };

  const shareMessage = `Te regalé un mapa personal de Molino ✨ Canjealo acá: ${shareUrl}`;

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: shareMessage, url: shareUrl });
        return;
      } catch {
        return; // el usuario canceló
      }
    }
    copy(shareMessage, setCopiedLink);
  };

  return (
    <main className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-xl px-4 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold">Regalo pago</span>
        </span>

        <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
          ¡Listo! Tu regalo está pago.
        </h1>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-card p-6 sm:p-7 text-left">
          <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Tu código</p>
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-background border border-ink/10">
            <span className="font-mono text-lg sm:text-xl font-bold text-foreground tracking-wider">{code}</span>
            <button
              type="button"
              onClick={() => copy(code, setCopiedCode)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline shrink-0"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? "Copiado" : "Copiar"}
            </button>
          </div>

          <p className="text-xs font-mono uppercase tracking-wider text-muted mt-6 mb-2">Enviale este link</p>
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-background border border-ink/10">
            <span className="font-mono text-xs text-foreground truncate">{shareUrl}</span>
            <button
              type="button"
              onClick={() => copy(shareUrl, setCopiedLink)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? "Copiado" : "Copiar"}
            </button>
          </div>

          <Button
            variant="accent"
            size="md"
            fullWidth
            onClick={share}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartir enlace
          </Button>
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <Gift className="w-3.5 h-3.5" />
          El destinatario ingresa su fecha de nacimiento al canjear — vos no necesitás saberla ni compartirla.
        </p>
      </div>
    </main>
  );
}
