"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  /** Si se pasa, ignora la señal global de carga (uso puntual, ej. dentro de un flujo ya en curso). */
  spinning?: boolean;
  /** Modo ráfaga: las aspas giran con aceleración suave (inicio lento, viento empuja), pensado para el intro del sitio. */
  wind?: boolean;
}

/**
 * Marca de Molino: un molino de viento con aspas móviles.
 *
 * Modos:
 *  - `wind`: ráfaga de entrada — giro con easeInOut (arranque suave, como si
 *    el viento empujara). Uso: intro/splash de carga del sitio.
 *  - `spinning` o señal global de carga: giro lineal continuo durante
 *    procesos reales (verificación de pago, generación del mapa).
 *  - Sin nada: quieto (decoración, no animación permanente).
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
      {/* Torre */}
      <path d="M10 30 L10.8 13.5 L21.2 13.5 L22 30 Z" />
      {/* Puerta */}
      <path d="M14 30 L14 25.5 Q16 24 18 25.5 L18 30 Z" />
      {/* Listones de la torre */}
      <line x1="11.4" y1="19" x2="20.6" y2="19" strokeWidth="0.5" />
      <line x1="10.9" y1="23" x2="21.1" y2="23" strokeWidth="0.5" />
      <line x1="10.6" y1="27" x2="21.4" y2="27" strokeWidth="0.5" />
      {/* Cabezal del molino */}
      <path d="M11.5 13.5 L12 9.5 L20 9.5 L20.5 13.5 Z" />
      {/* Eje */}
      <circle cx="16" cy="9" r="1.6" />

      {/* Aspas — giran alrededor del eje (16, 9) */}
      <motion.g
        style={{ transformOrigin: "16px 9px" }}
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
        {[0, 90, 180, 270].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 16 9)`}>
            {/* Mástil */}
            <line x1="16" y1="9" x2="16" y2="1.8" strokeWidth="0.9" />
            {/* Vela */}
            <path d="M14.8 2.6 L17.2 2.6 L16.6 7.2 L15.4 7.2 Z" fill="currentColor" stroke="none" opacity="0.85" />
          </g>
        ))}
      </motion.g>
    </svg>
  );
}
