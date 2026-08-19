"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  spinning?: boolean;
  wind?: boolean;
}

const HUB = { x: 50, y: 38 };

/** Un aspa (vela), dibujada apuntando hacia arriba desde el eje (0,0). */
function Blade({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle})`}>
      {/* halo de separación — para que el aspa se lea en frente de la torre */}
      <path
        d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z"
        fill="none"
        stroke="var(--color-paper, #0A0A0C)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* celosía — travesaños de la vela */}
      <line x1="-3" y1="-5" x2="3" y2="-5" stroke="var(--color-paper, #0A0A0C)" strokeWidth="0.8" strokeOpacity="0.6" />
      <line x1="-4" y1="-11" x2="4" y2="-11" stroke="var(--color-paper, #0A0A0C)" strokeWidth="0.8" strokeOpacity="0.6" />
      <line x1="-2" y1="-20" x2="2" y2="-20" stroke="var(--color-paper, #0A0A0C)" strokeWidth="0.8" strokeOpacity="0.6" />
    </g>
  );
}

/**
 * Molino de viento — torre sólida y cuatro aspas con celosía.
 * Diseño moderno/minimalista/realista: silueta llena, no wireframe.
 * La torre y el gorro quedan quietos. Solo el rotor (4 aspas) gira.
 *
 * - wind: arranque con viento (easeInOut, el rotor acelera como una ráfaga)
 * - spinning: rotación lineal continua (procesos de carga reales)
 * - sin nada: quieto
 */
export default function Logo({ className = "w-6 h-6", spinning, wind }: LogoProps) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => subscribeLoading(setGlobalLoading), []);

  const isWind = wind && !reducedMotion;
  const isSpinning = !wind && (spinning ?? globalLoading) && !reducedMotion;

  const rotorStyle: CSSProperties = {
    transformOrigin: `${HUB.x}px ${HUB.y}px`,
    transition: isWind || isSpinning ? undefined : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    animation: isWind
      ? "molino-rotor-spin 1.8s cubic-bezier(0.16, 0.84, 0.44, 1) infinite"
      : isSpinning
        ? "molino-rotor-spin 1.1s linear infinite"
        : "none",
    transform: isWind || isSpinning ? undefined : "rotate(0deg)",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ BASE — línea de tierra ═══ */}
      <line x1="24" y1="96.5" x2="80" y2="96.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />

      {/* ═══ TORRE — silueta cónica sólida, QUIETA ═══ */}
      <path d="M34,96 L66,96 L56,46 L44,46 Z" fill="currentColor" fillOpacity="0.95" stroke="none" />
      {/* vetas sutiles de la torre */}
      <line x1="38.5" y1="80" x2="61.5" y2="80" stroke="var(--color-paper, #0A0A0C)" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="41" y1="63" x2="59" y2="63" stroke="var(--color-paper, #0A0A0C)" strokeWidth="0.8" strokeOpacity="0.3" />
      {/* puerta */}
      <rect x="46" y="84" width="8" height="12" rx="1.5" fill="var(--color-paper, #0A0A0C)" fillOpacity="0.45" />

      {/* ═══ GORRO — cúpula redondeada, quieta ═══ */}
      <path d={`M44,46 Q${HUB.x},34 56,46 Z`} fill="currentColor" stroke="none" />

      {/* ═══ ROTOR — el único elemento que gira (animación CSS, no framer-motion:
           motion.g nunca aplicó la rotación sobre este <g> SVG en pruebas) ═══ */}
      <g style={rotorStyle}>
        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          <Blade angle={45} />
          <Blade angle={135} />
          <Blade angle={225} />
          <Blade angle={315} />
          {/* cubo central */}
          <circle cx="0" cy="0" r="3.2" fill="currentColor" stroke="var(--color-paper, #0A0A0C)" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}
