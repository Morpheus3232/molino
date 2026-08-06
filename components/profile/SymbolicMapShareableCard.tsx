"use client";

import { useRef, useState } from "react";
import { formatAnimalSimple, formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import type { Animal, AnimalRelation } from "@/lib/data/animalRelations";
import type { YearResonance } from "@/lib/engines/yearCycleEngine";

interface SymbolicMapShareableCardProps {
  userAnimal: Animal;
  userYear: number;
  element?: string;
  yearAnimal: Animal;
  year: number;
  yearResonance: YearResonance;
  friends: AnimalRelation[];
  challenging: AnimalRelation[];
}

export default function SymbolicMapShareableCard({
  userAnimal,
  userYear,
  element,
  yearAnimal,
  year,
  yearResonance,
  friends,
  challenging,
}: SymbolicMapShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const display = getZodiacDisplay(userAnimal);

  const shareText = `Mi mapa simbólico ${year}: ${display.name}. Aliados: ${friends.map(f => formatAnimalSimple(f.animal)).join(", ")}. Según el zodíaco chino. Leé el tuyo en Molino.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi mapa simbólico — Molino`,
          text: shareText,
          url: window.location.origin,
        });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* The card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-md border border-ink/10 bg-card max-w-full"
        style={{ maxWidth: "480px" }}
      >
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#C49A2A] to-[#D4A843]" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted font-medium">
              Mi mapa simbólico {year}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Según el zodíaco chino
            </p>
          </div>

          {/* Main animal — hero */}
          <div className="text-center mb-6">
            <span className="text-6xl sm:text-7xl block mb-2">{display.emoji}</span>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{display.name}</p>
            <p className="text-xs text-muted mt-1">Mi energía base{element ? ` · ${element}` : ""}</p>
          </div>

          {/* Allies */}
          {friends.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Mis aliados</p>
              <div className="flex flex-wrap gap-2">
                {friends.map((rel) => (
                  <div key={rel.animal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background">
                    <span className="text-sm">{formatAnimalEmoji(rel.animal)}</span>
                    <span className="text-xs font-medium text-foreground">{rel.animal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenging */}
          {challenging.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Energías para observar</p>
              <div className="flex flex-wrap gap-2">
                {challenging.map((rel) => (
                  <div key={rel.animal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background">
                    <span className="text-sm">{formatAnimalEmoji(rel.animal)}</span>
                    <span className="text-xs font-medium text-foreground">{rel.animal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Year resonance */}
          <div className="p-4 rounded-md bg-background mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{formatAnimalEmoji(yearAnimal)}</span>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{year} — Año del {yearAnimal}</p>
                <p className="text-xs text-muted">{yearResonance.label}</p>
              </div>
              <span className="text-xs font-medium" style={{ color: yearResonance.color }}>
                {yearResonance.type === "alignment" ? "Alta" : yearResonance.type === "harmony" ? "Media" : yearResonance.type === "neutral" ? "Neutra" : "Baja"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted">
              Mirá tu mapa en{" "}
              <span className="font-semibold text-foreground">Molino</span>
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-[8px] text-muted text-center leading-relaxed mb-4">
            Lectura simbólica. No constituye predicción científica.
          </p>

          {/* Footer */}
          <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
                <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent-light)" textAnchor="middle">M</text>
              </svg>
              <span className="text-xs font-medium text-muted">Molino</span>
            </div>
            <span className="text-[9px] text-muted">Mapa personal de autoconocimiento</span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm bg-accent text-accent-foreground min-h-[44px]"
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copiado
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
            Compartir mapa
          </>
        )}
      </button>
    </div>
  );
}
