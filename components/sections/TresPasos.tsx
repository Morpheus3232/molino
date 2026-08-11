"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";

const steps = [
  {
    number: "1",
    title: "Ingresá tu fecha",
    description: "Tu fecha de nacimiento. Nada más.",
  },
  {
    number: "2",
    title: "Cruzamos los patrones",
    description: "Tres sistemas convergen en una sola lectura, sin contradecirse.",
  },
  {
    number: "3",
    title: "Ganás perspectiva",
    description: "Tus tensiones, tus ciclos y tus afinidades, en un solo lugar.",
  },
];

export default function TresPasos() {
  return (
    <section className="bg-card border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2 {...fadeUp} className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center mb-16">
          De tu fecha de nacimiento a tu claridad.
        </motion.h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="hidden md:block absolute top-6 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-ink/10" aria-hidden="true" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
              className="relative text-center md:text-left"
            >
              <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-background border border-ink/15 font-mono text-sm text-accent mb-6">
                {step.number}
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted/70 leading-relaxed max-w-xs mx-auto md:mx-0">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}