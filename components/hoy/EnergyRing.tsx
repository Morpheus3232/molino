"use client";

import { useId } from "react";

interface EnergyRingProps {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}

/**
 * Anillo de energía SVG — el score del día como un dial visual.
 * Determinístico, sin animaciones infinitas: solo una transición de
 * entrada suave (strokeDashoffset) y respeta prefers-reduced-motion.
 */
export default function EnergyRing({ score, size = 220, stroke = 14, label }: EnergyRingProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `energy-ring-${uid}`;

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(1, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  const color =
    clamped >= 75
      ? "var(--score-excellent)"
      : clamped >= 55
        ? "var(--score-good)"
        : clamped >= 40
          ? "var(--score-neutral)"
          : "var(--score-poor)";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Energía del día: ${clamped} de 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.08"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <span className="font-display text-5xl sm:text-6xl tracking-tight leading-none" style={{ color }}>
          {clamped}
        </span>
        {label && (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}