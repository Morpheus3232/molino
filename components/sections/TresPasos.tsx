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
    title: "Generamos tu mapa",
    description: "Tres sistemas convergen en una lectura.",
  },
  {
    number: "3",
    title: "Descubrí tu identidad",
    description: "Número, mundo, círculo. Todo en un lugar.",
  },
];

export default function TresPasos() {
  return (
    <section className="bg-card border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.p {...fadeUp} className="eyebrow-brutalist mb-10 text-center">
          ¿CÓMO FUNCIONA?
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
              className="text-center"
            >
              <div className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-accent/30 mb-4 leading-[0.8]">
                {step.number}
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted/70 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}