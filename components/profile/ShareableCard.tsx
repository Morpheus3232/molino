"use client";

import { useRef, useState } from "react";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { analytics } from "@/lib/analytics/analytics";
import { buildShareableUrl } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

interface ShareableCardProps {
  profile: UserProfile;
}

export default function ShareableCard({ profile }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { name, birthDate, lifePath, sunSign, element, chineseZodiac, archetype } = profile;
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const sunSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
  const archetypeData = ARCHETYPES[lifePath];
  const archetypeName = archetypeData?.name || archetype;

  const shareUrl = buildShareableUrl(profile, "identity");
  const shareText = `Descubrí mi perfil de identidad en Molino.\n¿Querés descubrir el tuyo?`;

  const handleShare = async () => {
    analytics.trackFeatureUsed("share_profile");
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi perfil — ${name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* The card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
        style={{ maxWidth: "480px" }}
      >
        {/* Accent bar */}
        <div className="h-1.5" style={{ backgroundColor: elementColor }} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium mb-1">Mi perfil</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted mt-1">{birthDate}</p>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-serif font-bold shrink-0" style={{ backgroundColor: elementColor, color: "var(--color-background)" }}>
              {lifePath}
            </div>
          </div>

          {/* Archetype */}
          <div className="mb-6 p-4 rounded-xl bg-background">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Arquetipo</p>
            <p className="font-serif text-xl font-semibold" style={{ color: elementColor }}>{archetypeName}</p>
            {archetypeData?.quote && (
              <p className="text-sm text-muted mt-2 italic">&ldquo;{archetypeData.quote}&rdquo;</p>
            )}
          </div>

          {/* Core numbers */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Camino de Vida", value: lifePath },
              { label: "Expresión", value: profile.expressionNumber || "—" },
              { label: "Alma", value: profile.soulNumber || "—" },
              { label: "Personalidad", value: profile.personalityNumber || "—" },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-background">
                <p className="text-xl font-serif font-semibold" style={{ color: elementColor }}>{item.value}</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Identity line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-6">
            <span>{sunSymbol} {sunSign}</span>
            <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
            <span>{element}</span>
            <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
            <span>{chineseZodiac}</span>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
                <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
              </svg>
              <span className="text-xs font-medium text-muted">Molino</span>
            </div>
            <span className="text-[9px] text-muted">Inteligencia Personal</span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Enlace copiado
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartir mi perfil
          </>
        )}
      </button>
    </div>
  );
}
