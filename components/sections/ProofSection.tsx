"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Eye, EyeOff } from "lucide-react";

type MapQuadrant = "numerology" | "astrology" | "zodiac" | "timeline";

interface QuadrantData {
  title: string;
  subtitle: string;
  data: { label: string; value: string; formula?: string }[];
}

const demoData: Record<MapQuadrant, QuadrantData> = {
  numerology: {
    title: "Numerología",
    subtitle: "Pitagórica",
    data: [
      { label: "Camino de Vida", value: "7", formula: "(15/06/1990) → 1+5+6+1+9+9+0 = 31 → 3+1 = 4" },
      { label: "Número de Expresión", value: "9", formula: "Suma de letras del nombre" },
      { label: "Año Personal 2026", value: "5", formula: "Ciclo activo de cambio" },
    ],
  },
  astrology: {
    title: "Astrología",
    subtitle: "Tropical / Occidental",
    data: [
      { label: "Signo Solar", value: "Géminis ♊", formula: "15 de junio" },
      { label: "Elemento", value: "Aire", formula: "Comunicación, pensamiento" },
      { label: "Casa 1", value: "Asc. Acuario", formula: "Presentación personal" },
    ],
  },
  zodiac: {
    title: "Zodíaco Chino",
    subtitle: "Ciclo Sexagenario",
    data: [
      { label: "Animal", value: "Caballo 🐴", formula: "Nac. 1990" },
      { label: "Elemento", value: "Metal", formula: "Determinismo estructural" },
      { label: "Rama", value: "Yang", formula: "Energía activa" },
    ],
  },
  timeline: {
    title: "Tu Timeline",
    subtitle: "Ciclos personales",
    data: [
      { label: "Próximo Ciclo Numerológico", value: "2026-2035", formula: "Año Personal 5 → período de transformación" },
      { label: "Momento Actual", value: "Fase de Crecimiento", formula: "Alineado con tu Año Personal" },
      { label: "Ventanas Óptimas", value: "Jul-Sep 2026", formula: "Basado en ciclos y transitos" },
    ],
  },
};

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

export default function ProofSection() {
  const [activeQuadrant, setActiveQuadrant] = useState<MapQuadrant>("numerology");
  const [showFormulas, setShowFormulas] = useState(false);

  const quadrants: MapQuadrant[] = ["numerology", "astrology", "zodiac", "timeline"];
  const current = demoData[activeQuadrant];

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink overflow-hidden">
      <div className="max-w-5xl mx-auto">
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
              Así se ve tu mapa
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-paper mb-6 leading-tight">
            Datos reales en tiempo real.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-paper/70 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Tu mapa se actualiza en vivo. Cada número tiene su origen. Nada es inventado.
          </motion.p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 justify-center">
            {quadrants.map((quad) => {
              const labels: Record<MapQuadrant, string> = {
                numerology: "Numerología",
                astrology: "Astrología",
                zodiac: "Zodíaco Chino",
                timeline: "Timeline",
              };
              const isActive = activeQuadrant === quad;
              return (
                <button
                  key={quad}
                  onClick={() => setActiveQuadrant(quad)}
                  className={`px-5 py-2 rounded-lg font-heading font-semibold text-sm uppercase tracking-[0.1em] transition-all duration-300 ${
                    isActive
                      ? "bg-accent text-ink shadow-[0_0_20px_rgba(154,74,24,0.4)]"
                      : "bg-ink/20 text-paper/70 border border-ink/10 hover:bg-ink/30 hover:text-paper"
                  }`}
                >
                  {labels[quad]}
                </button>
              );
            })}
          </div>

          {/* Data Display Card */}
          <motion.div
            key={activeQuadrant}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-ink/40 to-ink/20 border border-accent/10 backdrop-blur-sm space-y-8"
          >
            {/* Section Header */}
            <div className="space-y-2 pb-8 border-b border-accent/10">
              <h3 className="font-heading text-3xl font-bold text-paper">
                {current.title}
              </h3>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60">
                {current.subtitle}
              </p>
            </div>

            {/* Data Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {current.data.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="space-y-3 group"
                >
                  {/* Label */}
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50 group-hover:text-accent/70 transition-colors">
                    {item.label}
                  </p>

                  {/* Value */}
                  <p className="font-display text-3xl sm:text-4xl font-bold text-paper leading-tight">
                    {item.value}
                  </p>

                  {/* Formula (collapsible) */}
                  {item.formula && (
                    <motion.div
                      initial={false}
                      animate={{ height: showFormulas ? "auto" : 0, opacity: showFormulas ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-mono text-xs text-paper/40 leading-relaxed pt-3 border-t border-accent/5">
                        {item.formula}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Toggle Formulas Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowFormulas(!showFormulas)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/15 hover:border-accent/30 transition-all duration-200 font-heading font-semibold text-sm uppercase tracking-[0.1em]"
            >
              {showFormulas ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  Ver detalles técnicos
                </>
              )}
            </button>
          </div>

          {/* Info box */}
          <div className="p-6 rounded-lg bg-accent/5 border border-accent/10 space-y-3">
            <div className="flex gap-3">
              <Eye className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-semibold text-paper text-sm">Todo está conectado</p>
                <p className="text-paper/60 text-sm leading-relaxed mt-1">
                  Tu número personal, tus ciclos actuales, tu momento astrológico. Nada es separado. Tu mapa es una síntesis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
