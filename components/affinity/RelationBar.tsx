"use client";

import { useMemo } from "react";

interface RelationBarProps {
  /** Score categórico del motor (ej. 95 para same, 85 para triad, 30 para clash). */
  score: number;
  /** Etiqueta textual visible (ej. "Alta compatibilidad", "Buena compatibilidad", "Energía opuesta"). */
  label: string;
  className?: string;
}

/**
 * Marcador editorial de afinidad.
 *
 * Reemplaza la antigua barra tipo batería de 10 segmentos por un marcador
 * horizontal fino con indicador geométrico y tipografía editorial. Comunica
 * claramente el nivel de compatibilidad sin depender únicamente del color,
 * manteniendo legibilidad en escala de grises y responsive total.
 */
export default function RelationBar({ score, label, className = "" }: RelationBarProps) {
  // Clampeado seguro entre 0 y 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Descripción textual accesible para lectores de pantalla
  const ariaLabel = `${label} (${normalizedScore}/100)`;

  // Nivel de intensidad categórica
  const tierClass = useMemo(() => {
    if (normalizedScore >= 90) return "text-accent border-accent/30 bg-accent/10";
    if (normalizedScore >= 70) return "text-foreground border-ink/20 bg-ink/5";
    if (normalizedScore <= 35) return "text-muted border-ink/20 bg-ink/5";
    return "text-muted border-ink/15 bg-ink/5";
  }, [normalizedScore]);

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-3 sm:gap-4 ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Etiqueta principal */}
      <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-foreground uppercase">
        {label}
      </span>

      {/* Marcador editorial con línea fina y punto indicador */}
      <div className="flex items-center gap-2">
        <div className="relative w-20 sm:w-28 h-[2px] bg-ink/15 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 bg-accent transition-all duration-300 ease-out"
            style={{ width: `${normalizedScore}%` }}
          />
        </div>

        {/* Indicador numérico discreto en tipografía mono */}
        <span
          className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-semibold ${tierClass}`}
        >
          {normalizedScore >= 90 ? "Alta" : normalizedScore >= 70 ? "Buena" : normalizedScore <= 35 ? "Opuesta" : "Base"}
        </span>
      </div>
    </div>
  );
}
