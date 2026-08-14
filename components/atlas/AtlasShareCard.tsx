"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Share2, Check, Copy } from "lucide-react";
import EntityVisual from "@/components/ui/EntityVisual";
import { nodeToPng, downloadPng, sanitizeFilenamePart } from "@/lib/utils/exportImage";
import type { LightweightEntity } from "@/types/atlas";

/**
 * AtlasShareCard — a shareable, download-ready visual card for an Atlas entity
 * or an affinity finding. Square "story/post" format.
 *
 * Rendering is on-demand (only on click): the heavy html-to-image module is
 * imported lazily inside nodeToPng, so it never penalizes initial load. Native
 * Web Share (navigator.share) is used when available; otherwise the generated
 * PNG + link fall back to clipboard copy with a subtle toast. No third-party
 * tracking SDKs.
 */

interface AtlasShareCardProps {
  entity: LightweightEntity;
  /** Optional dominant/pattern line, e.g. "Afinidad: resonancia alta". */
  headline?: string;
  /** Optional sub-line, e.g. "Animal del zodíaco chino: Dragón". */
  subline?: string;
  /** Deep link the card points to. */
  url?: string;
}

export default function AtlasShareCard({ entity, headline, subline, url }: AtlasShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = [
    headline ?? `Mi afinidad simbólica con ${entity.name}`,
    subline,
    "Leé tu mapa en Molino ✨",
  ]
    .filter(Boolean)
    .join(" · ");

  const shareUrl = url ?? `${typeof window !== "undefined" ? window.location.origin : ""}/atlas`;

  const renderPng = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    // nodeToPng lazy-imports html-to-image and renders at pixelRatio 2.
    return nodeToPng(cardRef.current, "square");
  };

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const dataUrl = await renderPng();
      if (!dataUrl) return;
      const namePart = sanitizeFilenamePart(entity.name);
      downloadPng(dataUrl, `molino-${namePart || "atlas"}.png`);
      toast.success("Tarjeta descargada");
    } catch {
      toast.error("No pudimos generar la tarjeta.");
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const dataUrl = await renderPng();
      if (!dataUrl) {
        setBusy(false);
        return;
      }
      // Try native Web Share with the image file if supported.
      if (typeof navigator !== "undefined" && navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `molino-${sanitizeFilenamePart(entity.name) || "atlas"}.png`, { type: "image/png" });
        try {
          await navigator.share({
            title: headline ?? `Afinidad con ${entity.name} — Molino`,
            text: shareText,
            url: shareUrl,
            files: [file],
          });
          toast.success("Tarjeta compartida");
          return;
        } catch {
          // User dismissed — fall through to link copy silently.
        }
      }
      // Fallback: copy link + text.
      await navigator.clipboard.writeText(`${shareText} — ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No pudimos compartir. Intentá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* The card — square, story/post format */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[480px] aspect-square overflow-hidden rounded-2xl border border-ink/10 bg-paper-alt text-foreground"
      >
        {/* Accent glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col h-full p-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center bg-ink text-paper">
                <span className="font-serif text-lg font-bold leading-none text-gold">M</span>
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em]">Molino</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Atlas</span>
          </div>

          {/* Center — entity visual + copy */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
            <EntityVisual
              visualType={entity.visualType}
              emoji={entity.emoji}
              imageUrl={entity.imageUrl}
              name={entity.name}
              countryISO={entity.countryISO}
              size={96}
              shape="circle"
            />
            <div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {entity.name}
              </p>
              {headline && <p className="text-sm text-accent mt-2 font-medium">{headline}</p>}
              {subline && <p className="text-sm text-muted mt-1">{subline}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 border-t border-ink/10 flex items-center justify-between text-xs text-muted">
            <span>Lectura simbólica del zodíaco chino</span>
            <span className="font-mono">molino.app</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm bg-accent text-accent-foreground min-h-[44px] disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {busy ? "Generando…" : "Descargar tarjeta"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px] disabled:opacity-60"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Compartir
            </>
          )}
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2200);
              toast.success("Enlace copiado");
            } catch {
              toast.error("No pudimos copiar el enlace.");
            }
          }}
          className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm border border-ink/10 bg-transparent text-muted hover:border-accent hover:text-foreground min-h-[44px]"
        >
          <Copy className="w-4 h-4" />
          Copiar enlace
        </button>
      </div>
    </div>
  );
}
