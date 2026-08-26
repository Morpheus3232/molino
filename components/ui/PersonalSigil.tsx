"use client";

import React, { useMemo } from "react";

export interface PersonalSigilProps {
  lifePath: number;
  birthDay: number;
  birthMonth: number;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

/**
 * PersonalSigil — Sello Personal Determinístico
 *
 * Genera un entramado geométrico de ondas armónicas calculado de forma 100% pura
 * a partir de la fecha de nacimiento (Camino de Vida, Día y Mes).
 * Misma fecha = exactamente el mismo patrón.
 */
export default function PersonalSigil({
  lifePath,
  birthDay,
  birthMonth,
  width = 880,
  height = 1800,
  className,
  color = "inherit",
}: PersonalSigilProps) {
  const paths = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const items: string[] = [];

    // Cantidad de anillos modulada por el Camino de Vida (4 a 8 anillos)
    const validLifePath = Number(lifePath) || 4;
    const validDay = Number(birthDay) || 1;
    const validMonth = Number(birthMonth) || 1;

    const rings = Math.max(4, Math.min(8, (validLifePath % 5) + 4));
    const waves = Math.max(3, (validDay % 7) + 3);
    const amplitude = 12 + (validMonth % 6) * 4;

    for (let r = 1; r <= rings; r++) {
      const baseRadius = r * 65;
      const points: string[] = [];
      const steps = 96;

      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const waveOffset = Math.sin(theta * waves + r * 0.9) * amplitude;
        const currentRadius = baseRadius + waveOffset;
        const x = cx + Math.cos(theta) * currentRadius;
        const y = cy + Math.sin(theta) * currentRadius;

        if (i === 0) {
          points.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
        } else {
          points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
      }
      points.push("Z");
      items.push(points.join(" "));
    }

    return items;
  }, [lifePath, birthDay, birthMonth, width, height]);

  return (
    <g
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className={className}
      style={{ color: color !== "inherit" ? color : undefined }}
    >
      {paths.map((d, idx) => (
        <path key={idx} d={d} />
      ))}
      <circle cx={width / 2} cy={height / 2} r="6" fill="currentColor" />
    </g>
  );
}
