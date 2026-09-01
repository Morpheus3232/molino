"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const DATA_POINTS = [
  { label: "Camino de Vida", value: "4", system: "Numerología" },
  { label: "Signo Solar", value: "Géminis", system: "Astrología" },
  { label: "Animal", value: "Caballo", system: "Zodíaco Chino" },
];

const SYNTHESIS_LINES = [
  "Aire + Metal → mentalidad que ejecuta.",
  "Mutable + Yang → se adapta mientras avanza.",
  "El cuarto Arcano aparece como recurso: autoridad interior.",
];

export default function SynthesisSection() {
  const [showSynthesis, setShowSynthesis] = useState(false);

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink/[0.02] border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Datos vs lectura
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Los datos no hablan solos.
            <em className="text-gradient-warm"> La síntesis, sí.</em>
          </h2>
        </div>

        {/* Data side */}
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted mb-6">
            Tu mapa en datos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DATA_POINTS.map((dp) => (
              <motion.div
                key={dp.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                className="rounded-lg border border-border bg-card p-6 space-y-3"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {dp.system}
                </span>
                <div className="font-display text-2xl font-bold text-foreground">
                  {dp.value}
                </div>
                <p className="text-sm text-muted">{dp.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Synthesis reveal */}
        <div className="relative">
          <button
            onClick={() => setShowSynthesis(!showSynthesis)}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent/30 text-accent font-heading font-semibold text-sm uppercase tracking-wider hover:bg-accent/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {showSynthesis ? "Ocultar síntesis" : "Ver la síntesis"}
            <ArrowRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                showSynthesis ? "rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {showSynthesis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-8 rounded-lg border border-border bg-card p-7 sm:p-9 space-y-5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                    <h3 className="font-display italic text-xl text-foreground">
                      Lo que emerge al cruzar los tres
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {SYNTHESIS_LINES.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted leading-relaxed pt-2 border-t border-border">
                    La síntesis no es un promedio. Es la lectura que surge cuando los tres
                    sistemas se cruzan — y lo que NO se puede afirmar con esa información.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-sm text-muted leading-relaxed max-w-2xl">
          El mapa te da los datos crudos. La lectura los pone en relación.
          La IA no inventa: trabaja sobre esa síntesis para responder tu pregunta.
        </p>
      </div>
    </section>
  );
}