"use client";

import { motion } from "framer-motion";
import { getZodiacPosition, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";

interface ZodiacMarkProps {
  animal: string;
  /** Color de acento del anillo y del tick de posición. */
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Si se muestra el nombre del animal debajo de la marca. */
  showLabel?: boolean;
  /** Si es true, oculta el número de posición del ciclo (1-12). */
  hidePosition?: boolean;
  /** Modo: "ring" (anillo con posición) o "emoji" (emoji grande + posición sutil) */
  variant?: "ring" | "emoji";
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 56, ring: 1.5, number: "text-lg", label: "text-[9px] mt-1.5" },
  md: { box: 84, ring: 2, number: "text-3xl", label: "text-[10px] mt-2.5" },
  lg: { box: 128, ring: 2, number: "text-5xl", label: "text-xs mt-3" },
  xl: { box: 176, ring: 2.5, number: "text-7xl", label: "text-xs mt-4" },
};

/**
 * Marca tipográfica del animal del zodíaco chino — reemplaza el emoji nativo
 * (que se ve inconsistente y de baja fidelidad a tamaños grandes: un mismo
 * caballo se renderiza distinto en cada plataforma). En su lugar: la
 * posición 1-12 del animal en el ciclo, como protagonista numérico — el
 * mismo lenguaje visual que ya usa Molino para Camino de Vida — con un
 * tick en el anillo marcando esa posición dentro del ciclo completo.
 * Una sola familia visual para los 12 animales: mismo anillo, misma
 * tipografía, solo cambian el número, el ángulo del tick y el color.
 */
export default function ZodiacMark({ animal, color, size = "md", showLabel = true, hidePosition = false, variant = "ring", className = "" }: ZodiacMarkProps) {
  const position = getZodiacPosition(animal);
  const display = getZodiacDisplay(animal);
  const { box, ring, number, label } = SIZE_MAP[size];
  const angle = position ? ((position - 1) * 30 - 90) * (Math.PI / 180) : 0;

  // For emoji variant at large sizes, use the emoji as protagonist
  const useEmoji = variant === "emoji" && size === "xl";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{ width: box, height: box }}
        role="img"
        aria-label={`${display.name} — posición ${position} del ciclo`}
      >
        {useEmoji ? (
          <span className="text-[120px] leading-none" aria-hidden="true">{display.emoji}</span>
        ) : (
          <>
            <svg className="absolute inset-0" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r={50 - ring}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={ring}
                opacity={0.08}
              />
              {position && !hidePosition && (
                <line
                  x1="50"
                  y1="50"
                  x2={50 + (50 - ring) * Math.cos(angle)}
                  y2={50 + (50 - ring) * Math.sin(angle)}
                  stroke={color}
                  strokeWidth={ring * 0.8}
                  strokeLinecap="round"
                />
              )}
            </svg>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center w-full h-full"
            >
              <span className={number} style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                {position ?? "?"}
              </span>
            </motion.div>
          </>
        )}
      </div>

      {showLabel && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={label}
        >
          {display.name}
        </motion.p>
      )}
    </div>
  );
}