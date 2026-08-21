"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Shield, Zap } from "lucide-react";
import Link from "next/link";

interface ComparisonRow {
  label: string;
  molino: string;
  traditional: string;
}

const comparisonData: ComparisonRow[] = [
  {
    label: "¿Qué hace?",
    molino: "Estructura tu realidad: identifica patrones, tensiones y ciclos. Para decidir mejor.",
    traditional: "Predice el futuro o revela 'destino'. Requiere fe.",
  },
  {
    label: "¿Se guardan tus datos?",
    molino: "No. Todo ocurre en tu navegador. Cálculo local, privacidad radical.",
    traditional: "Sí. Se vende información, emails a listas, monetizan tu perfil.",
  },
  {
    label: "¿Por qué confiar?",
    molino: "Fórmulas visibles, fuentes verificables. Podes auditar cada número.",
    traditional: "Se vende la magia. 'Confía en nosotros'. Sin trazabilidad.",
  },
  {
    label: "¿Para quién?",
    molino: "Gente curiosa que quiere entender cómo es, no gurús que digan qué hacer.",
    traditional: "Buscadores de respuestas externas. Seguidores de métodos.",
  },
];

const pillars = [
  {
    icon: Search,
    title: "Estructura",
    description: "Tres sistemas verificados: numerología, astrología, zodíaco chino. Métodos, no improvisación.",
  },
  {
    icon: Shield,
    title: "Utilidad",
    description: "No predice futuro. Te da perspectiva para decidir mejor. Herramienta, no magia.",
  },
  {
    icon: Zap,
    title: "Enfoque",
    description: "Para el curioso que quiere entender. No para seguidores de gurús.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ClaritySection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              ¿Cuál es la diferencia?
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-ink mb-6 leading-tight">
            Tu inteligencia personal.
            <br />
            <span className="text-accent">Sin gurús.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Molino estructura tu realidad. No predice, te da perspectiva para decidir mejor.
          </motion.p>
        </motion.div>

        {/* Comparison Grid — Clean and Professional */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Molino Column */}
            <motion.div variants={itemVariants} className="space-y-12">
              <div className="space-y-2 pb-8 border-b border-accent/20">
                <h3 className="font-heading text-2xl font-bold text-ink">Molino</h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/70">Estructura probada</p>
              </div>

              {comparisonData.map((row, idx) => (
                <motion.div
                  key={`molino-${idx}`}
                  variants={itemVariants}
                  className="space-y-3 group"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60 group-hover:text-accent/70 transition-colors">
                    {row.label}
                  </p>
                  <p className="font-light text-lg leading-relaxed text-foreground/85 group-hover:text-foreground transition-colors">
                    {row.molino}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Traditional Astrology Column */}
            <motion.div variants={itemVariants} className="space-y-12">
              <div className="space-y-2 pb-8 border-b border-ink/10">
                <h3 className="font-heading text-2xl font-bold text-ink/40">Astrología Tradicional</h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/40">Sin transparencia</p>
              </div>

              {comparisonData.map((row, idx) => (
                <motion.div
                  key={`traditional-${idx}`}
                  variants={itemVariants}
                  className="space-y-3 opacity-60 group"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/40 group-hover:text-muted/60 transition-colors">
                    {row.label}
                  </p>
                  <p className="font-light text-lg leading-relaxed text-foreground/50 group-hover:text-foreground/60 transition-colors line-through decoration-ink/20">
                    {row.traditional}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent mb-24" />
        </motion.div>

        {/* Three Pillars — Elevated */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
              Tres pilares
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Subtle background card */}
                  <div className="absolute inset-0 bg-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10 p-8 space-y-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/15 transition-colors duration-300">
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h4 className="font-heading text-2xl font-bold text-ink leading-tight">
                      {pillar.title}
                    </h4>

                    {/* Description */}
                    <p className="font-light text-base leading-relaxed text-foreground/75 group-hover:text-foreground transition-colors duration-300">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-accent/10 group-hover:border-accent/25 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA to Methods */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 text-center"
        >
          <Link
            href="/metodos-y-fuentes"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium text-sm uppercase tracking-[0.1em] group"
          >
            Ver fórmulas y fuentes
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
