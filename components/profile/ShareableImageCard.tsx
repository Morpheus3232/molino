"use client";

import { useRef, useState, useCallback } from "react";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { analytics } from "@/lib/analytics/analytics";
import { buildShareableUrl } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

interface ShareableImageCardProps {
  profile: UserProfile;
  currentTab?: string;
}

/**
 * Pieza editorial compartible.
 *
 * Un fragmento del perfil tratado como una pequeña pieza editorial
 * personalizada: marca, número protagonista, sistemas y un cierre.
 * PNG vía html-to-image + share nativo + portapapeles.
 */
export default function ShareableImageCard({ profile, currentTab = "identity" }: ShareableImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const { lifePath, sunSign, element, chineseZodiac, archetype } = profile;
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const chineseElement = profile.chineseZodiacInfo?.element || "";
  const archetypeData = ARCHETYPES[lifePath];
  const archetypeName = archetypeData?.name || archetype;
  const zodiacDisplay = getZodiacDisplay(chineseZodiac);
  // El onboarding es birthDate-first: casi nunca hay un name real. El
  // arquetipo funciona como titular editorial en su lugar.
  const name = profile.name?.trim() || archetypeName || "";
  const firstName = name ? name.split(" ")[0] : archetypeName || "Tu perfil";

  const shareUrl = buildShareableUrl(profile, currentTab);

  const shareText = `Descubrí mi perfil de identidad en Molino.\n¿Querés descubrir el tuyo?`;

  const renderPng = useCallback(async (): Promise<string> => {
    if (!cardRef.current) return "";
    const { toPng } = await import("html-to-image");
    return toPng(cardRef.current, {
      quality: 0.95,
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#F3EDE3",
    });
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    analytics.trackFeatureUsed("share_image_download");
    try {
      const dataUrl = await renderPng();
      const link = document.createElement("a");
      link.download = `molino-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setGenerating(false);
    }
  }, [name, renderPng]);

  const handleShare = useCallback(async () => {
    analytics.trackFeatureUsed("share_image_native");
    if (navigator.share) {
      try {
        if (cardRef.current) {
          setGenerating(true);
          const dataUrl = await renderPng();
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
  }, [name, shareText, shareUrl, renderPng]);

  const rule = "1px solid rgba(15, 15, 16, 0.14)";
  const muted = "#6B6560";
  const ink = "#1A1A1A";

  return (
    <div className="space-y-4">
      {/* The visual card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden"
        style={{ maxWidth: "520px", background: "#F3EDE3" }}
      >
        <div className="p-9 sm:p-11">
          {/* Branding */}
          <div
            className="flex items-center justify-between mb-9"
            style={{ borderBottom: rule, paddingBottom: "18px" }}
          >
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 30 L8 14 L24 14 L22 30 Z" />
                <path d="M7 14 L16 7 L25 14 Z" />
                <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
                <circle cx="16" cy="17.5" r="1.1" />
                <line x1="0" y1="7" x2="32" y2="7" />
                <line x1="16" y1="-3" x2="16" y2="17" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: ink }}>
                Molino
              </span>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: muted }}>
              Mi perfil
            </span>
          </div>

          {/* Identity — sistemas en overline, nombre en display */}
          <div className="mb-9">
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: muted }}>
              {sunSign} · {element} · {zodiacDisplay.name} de {chineseElement}
            </p>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight"
              style={{ color: ink, fontSize: "clamp(38px, 9vw, 48px)" }}
            >
              {firstName}
            </h2>
          </div>

          {/* Número protagonista */}
          <div
            className="flex items-end justify-between py-7"
            style={{ borderTop: rule, borderBottom: rule }}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] mb-1" style={{ color: muted }}>
                Camino de vida
              </p>
              <p className="font-display leading-none tracking-tight" style={{ color: elementColor, fontSize: "76px" }}>
                {lifePath}
              </p>
            </div>
            <div className="text-right pb-1.5">
              <p className="font-heading text-lg font-semibold" style={{ color: ink }}>
                {archetypeName}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.15em] mt-1" style={{ color: muted }}>
                {zodiacDisplay.name} · {chineseElement}
              </p>
            </div>
          </div>

          {/* Lectura */}
          <div className="pt-7">
            <p className="font-heading italic leading-relaxed" style={{ color: "#333333", fontSize: "17px" }}>
              {archetypeData?.quote
                ? `\u201C${archetypeData.quote}\u201D`
                : `Tu energía combina ${element.toLowerCase()}, intuición y visión.`
              }
            </p>
          </div>

          {/* Cierre */}
          <div
            className="mt-8 flex items-end justify-between pt-5"
            style={{ borderTop: rule }}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: elementColor }}>
                Descubrí tu perfil
              </p>
              <p className="font-heading text-base font-semibold mt-1" style={{ color: ink }}>
                molino.app
              </p>
            </div>
            <span className="font-display text-2xl leading-none" style={{ color: elementColor }} aria-hidden="true">
              →
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
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
