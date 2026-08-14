"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

interface SocialShareBarProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export default function SocialShareBar({
  title,
  text,
  url,
  className = "",
}: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "https://molino.app";
  };

  const handleCopy = () => {
    const targetUrl = getShareUrl();
    navigator.clipboard.writeText(`${text} — ${targetUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    const targetUrl = getShareUrl();
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title,
          text,
          url: targetUrl,
        });
      } catch {
        // User dismissed or cancelled
      }
    } else {
      handleCopy();
    }
  };

  const shareUrl = getShareUrl();
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;

  const hasNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label="Compartir en redes sociales"
    >
      {/* WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors"
        title="Compartir por WhatsApp"
        aria-label="Compartir por WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* X / Twitter Button */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
        title="Compartir en X / Twitter"
        aria-label="Compartir en X / Twitter"
      >
        <span className="font-bold text-xs" aria-hidden="true">𝕏</span>
        <span>Compartir</span>
      </a>

      {/* Native Web Share API if supported */}
      {hasNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/25 text-accent text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          title="Compartir en apps nativas"
          aria-label="Más opciones para compartir"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Más</span>
        </button>
      )}

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
        title="Copiar enlace"
        aria-label="Copiar enlace al portapapeles"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-muted" />
            <span>Copiar enlace</span>
          </>
        )}
      </button>
    </div>
  );
}
