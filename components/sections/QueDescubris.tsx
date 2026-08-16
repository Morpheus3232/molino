"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Divider from "@/components/ui/Divider";
import { fadeUpDelayed } from "@/lib/utils/motion";

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Comprendé cómo decidís",
    description: "Tu número de vida ofrece una perspectiva sobre patrones de decisión que ya están operando en tu día a día.",
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
    description: "Elegí los momentos que podés explorar para avanzar, descansar y conectar.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    ),
    title: "Acceso sin barreras",
    description: "Generá tu mapa sin pagar, sin registrarte y sin dejar datos personales.",
  },
];

export default function QueDescubris() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUpDelayed(0)}
          className="type-h2 text-center mb-4"
        >
          Lo que descubrís en Molino
        </motion.h2>

        <motion.p
          {...fadeUpDelayed(0.05)}
          className="type-caption text-center text-muted mb-12"
        >
          Autoconocimiento práctico y estructurado
        </motion.p>

        <Divider variant="star" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              {...fadeUpDelayed(0.1 + i * 0.08)}
              className="flex flex-col"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent/8 text-accent mb-6 border border-accent/15">
                {benefit.icon}
              </div>
              <h3 className="type-h4 mb-3">{benefit.title}</h3>
              <p className="type-body text-muted/80 leading-relaxed flex-1">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <Divider variant="accent" className="my-12" />

        <motion.div
          {...fadeUpDelayed(0.5)}
          className="text-center"
        >
          <Link
            href="/biblioteca"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold tracking-wider uppercase text-accent hover:text-accent-hover transition-colors"
          >
            Métodos y Fuentes
            <ArrowRight className="w-4 h-4 transition-transform duration-200 hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}