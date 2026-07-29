"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useReducedMotion } from "@/lib/utils/motion";
import { ArrowRight, PenTool, Search, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Ingresá tu fecha",
    description: "Solo necesitamos tu fecha de nacimiento. Sin registro, sin cookies, sin datos personales.",
    icon: PenTool,
    cta: "Empezar",
    href: "/",
  },
  {
    number: "02",
    title: "Descubrí tu mapa",
    description: "Analizamos tu numerología, astrología y zodíaco chino. Tres sistemas, una sola lectura integrada.",
    icon: Search,
    cta: "Ver ejemplo",
    href: "/profile",
  },
  {
    number: "03",
    title: "Compartí o descargá",
    description: "Generá tu tarjeta visual, descargala como imagen o compartila. Tu mapa, tus reglas.",
    icon: Download,
    cta: "Probar",
    href: "/onboarding",
  },
];

export default function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="how-it-works-heading" className="py-20 md:py-28 lg:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            Cómo funciona
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            En tres pasos tenés tu mapa personal de autoconocimiento. Sin fricción, sin compromiso.
          </p>
        </div>

        <div
          className="grid md:grid-cols-3 gap-8 md:gap-12"
          role="list"
          aria-label="Pasos para generar tu mapa"
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              role="listitem"
              className="group relative p-6 md:p-8 bg-card border border-border rounded-2xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute top-4 right-4 text-muted-foreground/30 font-mono text-2xl font-bold">
                {step.number}
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-6 group-hover:bg-accent group-hover:text-background transition-colors">
                  <step.icon className="w-6 h-6" aria-hidden="true" />
                </div>

                <h3 className="text-xl md:text-2xl font-display font-semibold mb-4">
                  {step.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>

                <motion.button
                  className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:gap-3 transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  whileHover={{ x: 4 }}
                  onClick={() => window.location.href = step.href}
                >
                  {step.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}