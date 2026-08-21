"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { fadeUpDelayed } from "@/lib/utils/motion";
import Link from "next/link";

interface ComparisonFeature {
  feature: string;
  molino: string;
  traditional: string;
}

const features: ComparisonFeature[] = [
  {
    feature: "¿Qué hace?",
    molino: "Estructura tu realidad: identifica patrones, tensiones y ciclos. Para decidir mejor.",
    traditional: "Predice el futuro o revela 'destino'. Requiere fe.",
  },
  {
    feature: "¿Se guardan tus datos?",
    molino: "No. Todo ocurre en tu navegador. Cálculo local, privacidad radical.",
    traditional: "Sí. Se vende información, emails a listas, monetizan tu perfil.",
  },
  {
    feature: "¿Por qué confiar?",
    molino: "Fórmulas visibles, fuentes verificables. Podes auditar cada número.",
    traditional: "Se vende la magia. 'Confía en nosotros'. Sin trazabilidad.",
  },
  {
    feature: "¿Para quién?",
    molino: "Gente curiosa que quiere entender cómo es, no gurús que digan qué hacer.",
    traditional: "Buscadores de respuestas externas. Seguidores de métodos.",
  },
];

const fadeUp = { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

export default function ClaritySection() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-8 bg-ink/2 border-t border-b border-ink/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Tu inteligencia personal.{" "}
            <span className="text-accent">Sin gurús.</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Molino es diferente a la astrología tradicional. No es magia, es estructura.
            No es predicción, es perspectiva.
          </p>
        </motion.div>

        {/* Tabla comparativa */}
        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
        >
          {/* Molino column */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <motion.h3
              {...fadeUpDelayed(0.05)}
              className="font-heading font-bold text-xl text-emerald-600 mb-6 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Molino
            </motion.h3>
            <div className="space-y-6">
              {features.map((f, i) => (
                <motion.div key={i} {...fadeUpDelayed(0.08 + i * 0.03)}>
                  <p className="text-sm font-mono text-muted mb-2">{f.feature}</p>
                  <p className="text-foreground leading-relaxed">{f.molino}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Astrología tradicional column */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
            <motion.h3
              {...fadeUpDelayed(0.05)}
              className="font-heading font-bold text-xl text-orange-600 mb-6 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Astrología Tradicional
            </motion.h3>
            <div className="space-y-6">
              {features.map((f, i) => (
                <motion.div key={i} {...fadeUpDelayed(0.08 + i * 0.03)}>
                  <p className="text-sm font-mono text-muted mb-2">{f.feature}</p>
                  <p className="text-foreground leading-relaxed">{f.traditional}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3 Pilares */}
        <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 border-t border-ink/10">
          {[
            {
              icon: "🔍",
              title: "Estructura",
              desc: "Numerología pitagórica, astrología solar, zodíaco chino. Sistemas probados. Sin improvisation.",
            },
            {
              icon: "🛡️",
              title: "Privacidad",
              desc: "Cálculo 100% local. Tus datos no salen de tu navegador. Código abierto para auditar.",
            },
            {
              icon: "⚡",
              title: "Accionable",
              desc: "No predice. Te da perspectiva para tomar decisiones mejor informadas EN SERIO.",
            },
          ].map((pillar, i) => (
            <motion.div
              key={i}
              {...fadeUpDelayed(0.1 + i * 0.05)}
              className="text-center"
            >
              <div className="text-4xl mb-3">{pillar.icon}</div>
              <h4 className="font-heading font-bold text-lg text-foreground mb-2">
                {pillar.title}
              </h4>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Micro CTA */}
        <motion.div {...fadeUp} className="text-center pt-8 border-t border-ink/10">
          <p className="text-sm text-muted mb-4">
            Quieres saber más sobre los métodos que usamos?
          </p>
          <Link
            href="/metodos-y-fuentes"
            className="inline-flex items-center gap-2 font-heading font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Ver fórmulas y fuentes →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
