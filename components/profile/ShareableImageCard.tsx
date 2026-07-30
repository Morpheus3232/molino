"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { analytics } from "@/lib/analytics/analytics";
import { buildShareableUrl } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

interface ShareableImageCardProps {
  profile: UserProfile;
  currentTab?: string;
}

export default function ShareableImageCard({ profile, currentTab = "identity" }: ShareableImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const { name, lifePath, sunSign, element, chineseZodiac, archetype } = profile;
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const sunSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
  const archetypeData = ARCHETYPES[lifePath];
  const archetypeName = archetypeData?.name || archetype;
  const zodiacDisplay = getZodiacDisplay(chineseZodiac);

  const shareUrl = buildShareableUrl(profile, currentTab);

  const shareText = `Descubrí mi perfil de identidad en Molino.\n¿Querés descubrir el tuyo?`;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    analytics.trackFeatureUsed("share_image_download");
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#F3EDE3",
      });
      const link = document.createElement("a");
      link.download = `molino-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setGenerating(false);
    }
  }, [name]);

  const handleShare = useCallback(async () => {
    analytics.trackFeatureUsed("share_image_native");
    if (navigator.share) {
      try {
        if (cardRef.current) {
          setGenerating(true);
          const dataUrl = await toPng(cardRef.current, {
            quality: 0.95,
            pixelRatio: 3,
            cacheBust: true,
            backgroundColor: "#F3EDE3",
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `molino-${name.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: `Mi perfil — ${name}`,
              text: shareText,
              url: shareUrl,
              files: [file],
            });
          } else {
            await navigator.share({
              title: `Mi perfil — ${name}`,
              text: shareText,
              url: shareUrl,
            });
          }
        } else {
          await navigator.share({
            title: `Mi perfil — ${name}`,
            text: shareText,
            url: shareUrl,
          });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      } finally {
        setGenerating(false);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      analytics.trackFeatureUsed("share_image_clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [name, shareText, shareUrl]);

  return (
    <div className="space-y-4">
      {/* The visual card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-lg border border-ink/10"
        style={{
          maxWidth: "480px",
          background: "linear-gradient(180deg, #F3EDE3 0%, #EDE5D8 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div className="p-8 sm:p-10">
          {/* Molino branding */}
          <div className="flex items-center gap-2 mb-8">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke={elementColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 30 L8 14 L24 14 L22 30 Z" />
              <path d="M7 14 L16 7 L25 14 Z" />
              <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
              <circle cx="16" cy="17.5" r="1.1" />
              <line x1="0" y1="7" x2="32" y2="7" />
              <line x1="16" y1="-3" x2="16" y2="17" />
              <line x1="0" y1="4.5" x2="32" y2="4.5" strokeWidth="0.5" />
              <line x1="0" y1="9.5" x2="32" y2="9.5" strokeWidth="0.5" />
              <line x1="13" y1="-3" x2="13" y2="17" strokeWidth="0.5" />
              <line x1="19" y1="-3" x2="19" y2="17" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Name */}
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-1" style={{ color: "#1a1a1a" }}>
            {name.split(" ")[0]}
          </h2>

          {/* Animal + Element */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{zodiacDisplay.emoji}</span>
            <div>
              <p className="font-heading text-lg font-semibold" style={{ color: elementColor }}>
                {zodiacDisplay.name} de {element}
              </p>
              <p className="text-xs" style={{ color: "#666" }}>
                {sunSymbol} {sunSign} · Camino {lifePath}
              </p>
            </div>
          </div>

          {/* Quote / Insight */}
          <div className="py-6 border-t border-b" style={{ borderColor: `${elementColor}30` }}>
            <p className="font-heading text-lg italic leading-relaxed" style={{ color: "#333" }}>
              {archetypeData?.quote
                ? `\u201C${archetypeData.quote}\u201D`
                : `Tu energía combina ${element.toLowerCase()}, intuición y visión.`
              }
            </p>
          </div>

          {/* Archetype badge */}
          <div className="mt-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-sm text-xs font-medium" style={{ backgroundColor: `${elementColor}15`, color: elementColor }}>
              {archetypeName}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: `${elementColor}20` }}>
            <p className="text-xs font-medium" style={{ color: elementColor }}>
              Descubrí tu perfil en
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: "#1a1a1a" }}>
              molino.app
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm bg-accent text-white hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {generating ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Generando...
            </>
          ) : copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Enlace copiado
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Compartir
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm border border-ink/10 bg-card hover:bg-background disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar imagen
        </button>
      </div>
    </div>
  );
}
