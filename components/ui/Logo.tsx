"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  /** Si se pasa, ignora la señal global de carga (uso puntual, ej. dentro de un flujo ya en curso). */
  spinning?: boolean;
}

/**
 * Marca de Molino: un molino de viento cuyas aspas giran únicamente durante
 * procesos reales (verificación de pago, generación del mapa) — no como
 * decoración permanente. Sin `spinning` explícito, se suscribe a la señal
 * global de carga (ver lib/utils/loadingSignal.ts) para que el logo del
 * header reaccione a cualquier proceso en curso en la app.
 */
export default function Logo({ className = "w-6 h-6", spinning }: LogoProps) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => subscribeLoading(setGlobalLoading), []);

  const isSpinning = (spinning ?? globalLoading) && !reducedMotion;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 30 L8 14 L24 14 L22 30 Z" />
      <path d="M7 14 L16 7 L25 14 Z" />
      <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
      <circle cx="16" cy="17.5" r="1.1" />
      <motion.g
        style={{ transformOrigin: "16px 7px" }}
        animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isSpinning
            ? { duration: 1.1, ease: "linear", repeat: Infinity }
            : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      >
        <line x1="0" y1="7" x2="32" y2="7" />
        <line x1="16" y1="-3" x2="16" y2="17" />
        <line x1="0" y1="4.5" x2="32" y2="4.5" strokeWidth="0.5" />
        <line x1="0" y1="9.5" x2="32" y2="9.5" strokeWidth="0.5" />
        <line x1="13" y1="-3" x2="13" y2="17" strokeWidth="0.5" />
        <line x1="19" y1="-3" x2="19" y2="17" strokeWidth="0.5" />
      </motion.g>
    </svg>
  );
}
