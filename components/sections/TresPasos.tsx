"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import { fadeUpDelayed } from "@/lib/utils/motion";

const steps = [
  {
    number: 1,
    title: "Ingresá tu fecha",
    description: "Tu fecha de nacimiento. Nada más.",
    subtitle: "El único dato que necesitamos",
  },
  {
    number: 2,
    title: "Cruzamos los patrones",
    description: "Tres sistemas convergen en una sola lectura, sin contradecirse.",
    subtitle: "Numerología, astrología, zodíaco chino",
  },
  {
    number: 3,
    title: "Ganás perspectiva",
    description: "Tus tensiones, tus ciclos y tus afinidades, en un solo lugar.",
    subtitle: "Tu mapa personal de autoconocimiento",
  },
];

export default function TresPasos() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUpDelayed(0)}
          className="type-h2 text-center mb-2"
        >
          De tu fecha de nacimiento a tu claridad
        </motion.h2>

        <motion.p
          {...fadeUpDelayed(0.05)}
          className="type-caption text-center text-muted mb-12"
        >
          Tres pasos. Sin registro. Sin datos personales.
        </motion.p>

        <Divider variant="accent" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              {...fadeUpDelayed(0.1 + i * 0.1)}
              className="flex flex-col"
            >
              {/* Step Number — Editorial Style */}
              <div className="mb-6">
                <div className="type-display text-accent/40 mb-2">
                  {String(step.number).padStart(2, "0")}
                </div>
              </div>

              {/* Content */}
              <h3 className="type-h3 mb-2">{step.title}</h3>

              <p className="type-caption text-muted mb-4">
                {step.subtitle}
              </p>

              <Divider variant="rule" className="my-6" />

              <p className="type-body text-muted/80 leading-relaxed flex-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <Divider variant="star" className="my-12" />
      </div>
    </section>
  );
}