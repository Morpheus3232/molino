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
export default function ZodiacMark({ animal, color, size = "md", showLabel = true, hidePosition = false, className = "" }: ZodiacMarkProps) {
  const position = getZodiacPosition(animal);
  const display = getZodiacDisplay(animal);
  const { box, ring, number, label } = SIZE_MAP[size];
  const angle = position ? ((position - 1) / 12) * 360 - 90 : -90;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-full flex items-center justify-center shrink-0"
        style={{
          width: box,
          height: box,
          border: `${ring}px solid color-mix(in srgb, ${color} 35%, transparent)`,
        }}
        aria-hidden="true"
      >
        {/* Tick de posición sobre el anillo */}
        {position > 0 && (
          <span
            className="absolute rounded-full"
            style={{
              width: box * 0.06,
              height: box * 0.06,
              backgroundColor: color,
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translate(${box / 2}px) rotate(${-angle}deg) translate(-50%, -50%)`,
            }}
          />
        )}
        {hidePosition ? (
          <span className={`font-display leading-none tracking-tight ${number}`} style={{ color }}>
            {display.emoji}
          </span>
        ) : (
          <span className={`font-display leading-none tracking-tight ${number}`} style={{ color }}>
            {position || "—"}
          </span>
        )}
      </motion.div>
      {showLabel && (
        <p className={`font-mono uppercase tracking-[0.2em] text-muted font-medium ${label}`}>
          {display.name}
        </p>
      )}
    </div>
  );
}
