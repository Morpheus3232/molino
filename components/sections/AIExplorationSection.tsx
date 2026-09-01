"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";
import Link from "next/link";

const AI_STEPS = [
  {
    icon: Lightbulb,
    title: "Tu mapa es el input",
    body: "Enviás tu perfil —patrones, cruces, tensiones— como contexto. La IA no adivina: razona sobre datos que ya tenés.",
  },
  {
    icon: Sparkles,
    title: "Razona, no inventa",
    body: "El modelo trabaja con tus coordenadas simbólicas. Lo que genera es una interpretación, no una predicción. Siempre hay incertidumbre declarada.",
  },
  {
    icon: ArrowRight,
    title: "Volvés al mapa",
    body: "Cada respuesta se vincula al origen: qué sistema y qué punto del mapa la produjo. Sin cajas negras.",
  },
];

export default function AIExplorationSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-background border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            La IA con contexto
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Tu mapa alimenta la conversación.
            <em className="text-gradient-warm"> No al revés.</em>
          </h2>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-10 border-b border-border">
          <div className="inline-flex max-w-full overflow-x-auto">
            {AI_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-4 font-heading font-medium text-sm tracking-wide transition-colors duration-200 whitespace-nowrap ${
                    activeStep === i ? "text-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  {activeStep === i && (
                    <motion.div
                      layoutId="aiTabUnderline"
                      className="absolute inset-x-0 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait" initial={false}>
          {(() => {
            const Icon = AI_STEPS[activeStep].icon;
            return (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0.1, 1] }}
                className="rounded-lg border border-border bg-card p-7 sm:p-9"
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-display italic text-xl text-foreground">
                      {AI_STEPS[activeStep].title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {AI_STEPS[activeStep].body}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            La IA no reemplaza el mapa: lo extiende. Tu lectura gratuita ya
            trae la síntesis determinista; la conversación añade la interpretación
            escrita y la respuesta a tu pregunta.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-paper text-sm font-heading font-bold uppercase tracking-[0.08em] hover:bg-accent-hover active:scale-[0.98] transition-colors"
            >
              Ver Lectura Pro
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}