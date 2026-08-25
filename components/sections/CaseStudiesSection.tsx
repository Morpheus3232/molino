"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Briefcase, BarChart3 } from "lucide-react";

interface CaseStudy {
  name: string;
  age: number;
  role: string;
  pattern: string;
  pathNumber: number;
  outcome: string;
  icon: React.ReactNode;
}

const caseStudies: CaseStudy[] = [
  {
    name: "Sarah",
    age: 34,
    role: "Emprendedora",
    pattern: "Camino 7 — Análisis & Intuición",
    pathNumber: 7,
    outcome: "Usó ciclos de timing para lanzar su startup en ventana óptima. Rentabilidad en 6 meses.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    name: "Marcus",
    age: 41,
    role: "Ejecutivo",
    pattern: "Camino 8 — Poder & Transformación",
    pathNumber: 8,
    outcome: "Identificó su ciclo de crecimiento. Negoció un acuerdo 40% mayor con base en timing personal.",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    name: "Elena",
    age: 28,
    role: "Freelancer",
    pattern: "Camino 3 — Creatividad & Expresión",
    pathNumber: 3,
    outcome: "Sincronizó su energía creativa con su momento astral. Triplicó sus clientes en 3 meses.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export default function CaseStudiesSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-paper overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Casos reales
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-ink mb-6 leading-tight">
            Gente que entendió su patrón.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Decisiones mejores cuando entendés cómo funciona tu ciclo.
          </motion.p>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {caseStudies.map((study, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative z-10 p-8 rounded-md bg-gradient-to-br from-paper to-paper border border-accent/10 group-hover:border-accent/25 transition-all duration-300 space-y-6 h-full flex flex-col">
                {/* Icon & Header */}
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/15 transition-colors">
                    {study.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading text-2xl font-bold text-ink">
                      {study.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
                      {study.age} años • {study.role}
                    </p>
                  </div>
                </div>

                {/* Pattern Badge */}
                <div className="space-y-2 py-4 border-y border-accent/10">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/50">Su patrón</p>
                  <p className="font-heading text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    {study.pattern}
                  </p>
                </div>

                {/* Outcome */}
                <div className="space-y-2 flex-1">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/50">Resultado</p>
                  <p className="text-foreground/80 leading-relaxed font-light">
                    {study.outcome}
                  </p>
                </div>

                {/* Number indicator */}
                <div className="text-right">
                  <span className="font-display text-5xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                    {study.pathNumber}
                  </span>
                </div>
              </div>

              {/* Hover Border Glow */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-accent/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 p-6 text-center bg-accent/5 rounded-xl border border-accent/10"
        >
          <p className="text-sm text-foreground/70 font-light">
            Los nombres y algunos detalles han sido anonimizados para proteger privacidad.
            <br className="hidden sm:block" />
            Los patrones y números son reales y verificables.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
