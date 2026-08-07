"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Comprendé cómo decidís",
    description: "Tu número de vida revela patrones de decisión que ya están operando en tu día a día.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Conectá con tu entorno",
    description: "Tus conexiones más fuertes tienen un impacto real en tu energía y tus elecciones.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Orientate con claridad",
    description: "Elegí los momentos justos para avanzar, descansar y conectar.",
  },
];

export default function QueDescubris() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.p {...fadeUp} className="eyebrow-brutalist mb-10 text-center">
          QUÉ VAS A DESCUBRIR
        </motion.p>

        <motion.p {...fadeUp} className="font-heading text-2xl sm:text-3xl font-semibold text-foreground text-center mb-16 max-w-2xl mx-auto leading-tight">
          Entendé cómo decidís. Descubrí tus afinidades. Elegí mejores momentos.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink/5 text-accent mb-6">
                {benefit.icon}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted/70 leading-relaxed max-w-xs mx-auto">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="text-center mt-16">
          <Link
            href="/biblioteca"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors"
          >
            EXPLORAR LA BIBLIOTECA
            <ArrowRight className="w-3 h-3 inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}