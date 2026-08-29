"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Share2, Check, Copy } from "lucide-react";
import EntityVisual from "@/components/ui/EntityVisual";
import PersonalSigil from "@/components/ui/PersonalSigil";
import { nodeToPng, dataUrlToBlob, sanitizeFilenamePart } from "@/lib/utils/exportImage";
import type { LightweightEntity } from "@/types/atlas";

/**
 * AtlasShareCard — a shareable visual card for an Atlas entity or an affinity
 * finding. Square "story/post" format.
 *
 * Rendering is on-demand (only on click): the heavy html-to-image module is
 * imported lazily inside nodeToPng, so it never penalizes initial load. Native
 * Web Share (navigator.share) is used when available, with the rendered PNG
 * attached as a file; otherwise it falls back to copying the link with a
 * subtle toast. No local download — the image is never persisted to disk,
 * only handed to the native share sheet or discarded. No third-party
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
  ]
    .filter(Boolean)
    .join(" · ");

  const shareUrl = url ?? `${typeof window !== "undefined" ? window.location.origin : ""}/atlas`;

  const renderPng = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    // nodeToPng lazy-imports html-to-image and renders at pixelRatio 2.
    return nodeToPng(cardRef.current, "square");
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
        const blob = dataUrlToBlob(dataUrl);
        const file = new File([blob], `molino-${sanitizeFilenamePart(entity.name) || "atlas"}.png`, { type: "image/png" });
        try {
          await navigator.share({
            title: headline ?? `Afinidad con ${entity.name}`,
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
        className="relative w-full max-w-[480px] aspect-square overflow-hidden rounded-xl border border-ink/10 bg-paper-alt text-foreground"
      >
        {/* Sello Personal determinístico de fondo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 480 480" className="w-full h-full">
            <PersonalSigil
              lifePath={entity.year ? entity.year % 9 || 9 : 4}
              birthDay={entity.year ? entity.year % 28 || 1 : 18}
              birthMonth={4}
              width={480}
              height={480}
            />
          </svg>
        </div>

        <div className="relative flex flex-col h-full p-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em]">Mapa personal</span>
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
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
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

export { default as AtlasShareCardSVG } from "./AtlasShareCardSVG";

