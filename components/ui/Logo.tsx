"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  spinning?: boolean;
  wind?: boolean;
}

/**
 * Molino de campo — molinete americano clásico.
 * La torre queda quieta. Solo el rotor gira.
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

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ TORRE — celosía, QUIETA ═══ */}
      <line x1="11" y1="30" x2="14.5" y2="13" />
      <line x1="21" y1="30" x2="17.5" y2="13" />
      {/* Travesaños */}
      <line x1="12" y1="26" x2="20" y2="26" strokeWidth="0.5" />
      <line x1="12.8" y1="22" x2="19.2" y2="22" strokeWidth="0.5" />
      <line x1="13.5" y1="18" x2="18.5" y2="18" strokeWidth="0.5" />

      {/* Plataforma */}
      <line x1="14" y1="12.5" x2="18" y2="12.5" strokeWidth="1.6" />

      {/* ═══ COLA DEL MOLINO — quieta, apunta al viento ═══ */}
      <line x1="16" y1="8.5" x2="25" y2="8.5" strokeWidth="0.7" />
      <path d="M24 6 L24 11 L27 8.5 Z" fill="currentColor" stroke="none" opacity="0.7" />

      {/* ═══ ROTOR — el único elemento que gira ═══ */}
      <motion.g
        style={{ transformOrigin: "16px 8.5px" }}
        animate={
          isWind
            ? { rotate: 360 }
            : isSpinning
              ? { rotate: 360 }
              : { rotate: 0 }
        }
        transition={
          isWind
            ? { duration: 1.8, ease: [0.16, 0.84, 0.44, 1], repeat: Infinity }
            : isSpinning
              ? { duration: 1.1, ease: "linear", repeat: Infinity }
              : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      >
        {/* Anillo del rotor */}
        <circle cx="16" cy="8.5" r="4.5" strokeWidth="0.9" />
        {/* 10 aspas — líneas desde el centro al anillo */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const r = 4.5;
          return (
            <line
              key={angle}
              x1={16}
              y1={8.5}
              x2={16 + r * Math.cos(rad)}
              y2={8.5 + r * Math.sin(rad)}
              strokeWidth="0.65"
            />
          );
        })}
        {/* Cubo central */}
        <circle cx="16" cy="8.5" r="1" fill="currentColor" stroke="none" />
      </motion.g>
    </svg>
  );
}
