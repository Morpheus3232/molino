"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CalculationProofData } from "@/lib/calculations/proof";

interface CalculationProofProps {
  /** Nombre del cálculo. Ej: "Camino de Vida". */
  label: string;
  /** Pasos deterministas generados por lib/calculations/proof.ts. */
  data: CalculationProofData;
  className?: string;
}

/**
 * Prueba de cálculo — transparencia editorial.
 *
 * Expone, de forma discreta y opcional, los pasos deterministas que Molino usa
 * para calcular un número. Sin modal, sin card, sin emojis: una hairline y una
 * etiqueta micro que se expande en el lugar.
 */
export default function CalculationProof({ label, data, className = "" }: CalculationProofProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`proof-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="group flex items-center gap-3 text-left"
      >
        <span
          className="w-4 h-px bg-ink/15 group-hover:bg-accent transition-colors"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-accent transition-colors">
          {open ? "Ocultar" : "¿Cómo se calculó?"}
        </span>
        <span
          className="font-heading text-sm text-muted group-hover:text-accent transition-colors"
          aria-hidden="true"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`proof-${label.toLowerCase().replace(/\s+/g, "-")}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-6">
              <div className="mb-4">
                <p className="label-micro text-muted mb-1">{label}</p>
                <p className="text-sm text-muted leading-relaxed">
                  Así se llegó a este número, con tu fecha de nacimiento.
                </p>
              </div>

              <div className="border-t border-ink/10">
                {data.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-6 py-4 border-b border-ink/10 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{step.label}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-1.5">
                        {step.expression}
                      </p>
                    </div>
                    <span className="font-heading text-xl sm:text-2xl text-accent shrink-0">
                      {step.result}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline justify-between gap-6 pt-5">
                <p className="font-heading text-base font-semibold text-foreground">Resultado</p>
                <span className="font-display text-3xl text-foreground">{data.result}</span>
              </div>

              <p className="mt-5 text-xs text-muted leading-relaxed">{data.note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
