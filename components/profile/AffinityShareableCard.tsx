"use client";

import { useRef, useState } from "react";
import { TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";

interface AffinityShareableCardProps {
  result: AffinityResult;
}

/**
 * Generates the viral share text — one-liner optimized for social copy.
 * Must feel personal, be honest, and include "simbólico" + "zodíaco chino".
 */
function buildShareText(result: AffinityResult): string {
  const { entity, entityAnimal, userAnimal, score, relationship } = result;

  if (entityAnimal === userAnimal) {
    return `${entity.name} y vos comparten ${entityAnimal}. ${score}/100 de afinidad simbólica según el zodíaco chino. Descubrí la tuya en Molino.`;
  }

  if (relationship === "armonía natural") {
    return `${entityAnimal} y ${userAnimal}: armonía simbólica. ${score}/100 según el zodíaco chino. Mirá tu afinidad con ${entity.name} en Molino.`;
  }

  if (relationship === "opuestos complementarios") {
    return `${entityAnimal} y ${userAnimal}: opuestos que se atraen. ${score}/100 de afinidad simbólica. Descubrí tu mapa en Molino.`;
  }

  if (relationship === "tríada compatible") {
    return `${entityAnimal} y ${userAnimal}: misma energía, distinta expresión. ${score}/100 según el zodíaco chino. Probá Molino.`;
  }

  return `Afinidad simbólica con ${entity.name}: ${entityAnimal} ↔ ${userAnimal}. ${score}/100 según el zodíaco chino. Descubrila en Molino.`;
}

/**
 * Generates the one-liner explanation shown on the card.
 * Emotional but honest — no scientific claims.
 */
function buildCardExplanation(result: AffinityResult): string {
  const { entity, entityAnimal, userAnimal, relationship } = result;

  if (entityAnimal === userAnimal) {
    return `Compartís el mismo signo simbólico que ${entity.name}: ${entityAnimal}.`;
  }

  if (relationship === "armonía natural") {
    return `${userAnimal} y ${entityAnimal} se complementan de forma natural en el ciclo del zodíaco chino.`;
  }

  if (relationship === "opuestos complementarios") {
    return `${userAnimal} y ${entityAnimal} son opuestos en el ciclo: cada uno tiene lo que el otro necesita.`;
  }

  if (relationship === "tríada compatible") {
    return `${userAnimal} y ${entityAnimal} comparten una energía ocultan en el ciclo del zodíaco chino.`;
  }

  if (relationship === "relación desafiante") {
    return `${userAnimal} y ${entityAnimal} tienen una tensión creativa según la tradición del zodíaco chino.`;
  }

  if (relationship === "tensión creativa") {
    return `La diferencia entre ${userAnimal} y ${entityAnimal} puede generar crecimiento según esta tradición.`;
  }

  return `Vos y ${entity.name} tienen una resonancia simbólica de ${relationship} según el zodíaco chino.`;
}

export default function AffinityShareableCard({ result }: AffinityShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const tierMeta = TIER_META[result.tier];
  const entity = result.entity;
  const event = result.primaryEvent;
  const eventDate = event.date
    ? formatDisplayDate(event.date)
    : `circa ${event.year}`;

  const shareText = buildShareText(result);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Afinidad simbólica con ${entity.name} — Molino`,
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled
      }
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
        className="relative overflow-hidden rounded-2xl border border-border bg-card max-w-full"
        style={{ maxWidth: "480px" }}
      >
        {/* Accent bar */}
        <div className="h-1.5" style={{ backgroundColor: tierMeta.color }} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium mb-1">
              Mi afinidad simbólica
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted/60">
              Según el zodíaco chino
            </p>
          </div>

          {/* Main result — Animals face to face, visual hierarchy */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5 overflow-hidden">
            {/* Entity animal */}
            <div className="text-center flex-1 min-w-0">
              <span className="text-4xl sm:text-5xl block mb-2">{entity.emoji}</span>
              <p className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">{result.entityAnimal}</p>
              <p className="text-[11px] text-muted mt-1 truncate">{entity.name}</p>
            </div>

            {/* Score — central, impactful, never pushes */}
            <div className="flex flex-col items-center shrink-0 px-1">
              <span
                className="font-serif text-4xl sm:text-5xl font-bold leading-none"
                style={{ color: tierMeta.color }}
              >
                {result.score}
              </span>
              <span className="text-[10px] text-muted mt-1">/100</span>
            </div>

            {/* User animal */}
            <div className="text-center flex-1 min-w-0">
              <span className="text-4xl sm:text-5xl block mb-2">🪞</span>
              <p className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">{result.userAnimal}</p>
              <p className="text-[11px] text-muted mt-1">Vos</p>
            </div>
          </div>

          {/* Relationship badge — clean, readable */}
          <div className="text-center mb-6">
            <span
              className="text-[11px] font-medium uppercase tracking-wider px-4 py-1.5 rounded-full"
              style={{ color: tierMeta.color, backgroundColor: `${tierMeta.color}12` }}
            >
              {tierMeta.label} · {result.relationship}
            </span>
          </div>

          {/* One-line viral explanation — THE key line */}
          <div className="mb-6">
            <p className="text-sm sm:text-[15px] text-foreground leading-relaxed text-center font-medium">
              {buildCardExplanation(result)}
            </p>
          </div>

          {/* Event info + confidence — subtle, factual */}
          <div className="flex flex-col items-center gap-1.5 text-[10px] text-muted/70 mb-6">
            <div className="flex items-center justify-center gap-1.5">
              <span>{entity.name}</span>
              <span aria-hidden="true">·</span>
              <span>{eventDate}</span>
            </div>
            {event.confidence === "exacta" && event.date && (
              <span className="inline-flex items-center gap-1 text-[9px] text-green-700 dark:text-green-400">
                <span className="w-1 h-1 rounded-full bg-green-600 dark:bg-green-400" />
                Fecha histórica verificada
              </span>
            )}
            {event.confidence === "alta" && event.date && (
              <span className="inline-flex items-center gap-1 text-[9px] text-green-700 dark:text-green-400">
                <span className="w-1 h-1 rounded-full bg-green-600 dark:bg-green-400" />
                Fecha histórica verificada
              </span>
            )}
            {result.isApproximate && (
              <span className="inline-flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400">
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                Fecha aproximada
              </span>
            )}
            {(event.confidence === "tradicion" || event.confidence === "baja") && !result.isApproximate && (
              <span className="inline-flex items-center gap-1 text-[9px] text-muted/60">
                <span className="w-1 h-1 rounded-full bg-muted/50" />
                Tradición cultural
              </span>
            )}
          </div>

          {/* Transparency block — minimal */}
          <div className="p-3 rounded-lg bg-background/50 mb-5">
            <p className="text-[9px] text-muted/60 leading-relaxed text-center">
              Basado en: fecha de nacimiento · fecha histórica de la entidad · tradición del zodíaco chino
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted">
              Descubrí más afinidades en{" "}
              <span className="font-semibold text-foreground">Molino</span>
            </p>
          </div>

          {/* Disclaimer — minimal, non-intrusive */}
          <p className="text-[8px] text-muted/40 text-center leading-relaxed mb-4">
            Lectura simbólica. No constituye predicción científica.
          </p>

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
        className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
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
            Compartir afinidad
          </>
        )}
      </button>
    </div>
  );
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}
