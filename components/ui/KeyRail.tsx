"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

/**
 * KeyRail — la clave de 8 dígitos (DD/MM/AAAA).
 *
 * Los ocho dígitos tienen presencia propia: cada celda se enciende con un
 * micro-asiento (scale+fade) cuando se escribe, mostrando que "estos números
 * están haciendo algo". Los separadores estructurales separan día/mes/año sin
 * romper la lectura continua de la clave.
 */
const CELLS = [
  { kind: "d", label: "DÍA", group: 0 },
  { kind: "d", label: "DÍA", group: 0 },
  { kind: "gap", label: "", group: 0 },
  { kind: "m", label: "MES", group: 1 },
  { kind: "m", label: "MES", group: 1 },
  { kind: "gap", label: "", group: 1 },
  { kind: "y", label: "AÑO", group: 2 },
  { kind: "y", label: "AÑO", group: 2 },
  { kind: "y", label: "AÑO", group: 2 },
  { kind: "y", label: "AÑO", group: 2 },
];

export default function KeyRail({ digits }: { digits: string }) {
  const reduceMotion = useSafeReducedMotion();
  // digits: "DDMMYYYY" (8 chars) o vacío; rendereamos espacios para cada dígito.
  const sequence = CELLS.map((cell, i) =>
    cell.kind === "gap" ? null : digits[i] ?? ""
  );

  return (
    <div className="mx-auto mt-4 select-none" aria-hidden="true">
      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
        {sequence.map((digit, i) => {
          const meta = CELLS[i];
          if (!meta) return null;
          const filled = digit !== "";
          return (
            <motion.div
              key={i}
              initial={false}
              animate={
                !filled
                  ? { opacity: reduceMotion ? 1 : 0.35, scale: 0.92 }
                  : { opacity: 1, scale: 1 }
              }
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
              className={`flex h-10 w-7 items-center justify-center border-b font-mono text-lg tabular-nums transition-colors duration-300 sm:h-12 sm:w-9 sm:text-2xl ${
                filled
                  ? "border-accent/70 text-foreground"
                  : "border-border/70 text-muted"
              }`}
            >
              {filled ? digit : "·"}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1 sm:gap-1.5">
        {CELLS.map((cell, i) => {
          if (cell.kind === "gap") {
            return <span key={i} className="w-1.5" aria-hidden="true" />;
          }
          return (
            <span
              key={i}
              className="w-7 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted/60 sm:w-9"
            >
              {cell.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
