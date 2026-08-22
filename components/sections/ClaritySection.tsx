"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  SlidersHorizontal,
  Lock,
  Binary,
  Compass,
  Cpu,
  Layers
} from "lucide-react";
import Link from "next/link";

interface ComparisonItem {
  category: string;
  molinoTitle: string;
  molinoDesc: string;
  traditionalTitle: string;
  traditionalDesc: string;
}

const comparisonRows: ComparisonItem[] = [
  {
    category: "¿Qué hace?",
    molinoTitle: "Estructura tu realidad",
    molinoDesc: "Identifica patrones matemáticos, tensiones arquetípicas y ciclos activos para tomar mejores decisiones.",
    traditionalTitle: "Predicción y destino",
    traditionalDesc: "Promete adivinar el futuro o revelar un 'destino inmutable' que requiere fe ciega.",
  },
  {
    category: "¿Se guardan tus datos?",
    molinoTitle: "0% Almacenamiento externo",
    molinoDesc: "Todo ocurre en tu navegador local (Web Workers). Cálculo 100% privado, sin bases de datos ni registro.",
    traditionalTitle: "Comercialización de PII",
    traditionalDesc: "Venta de listas de correos, monetización de perfiles en la nube y seguimiento de publicidad.",
  },
  {
    category: "¿Por qué confiar?",
    molinoTitle: "Fórmulas auditables y abiertas",
    molinoDesc: "Fórmulas pitagóricas visibles y fuentes documentadas. Podés auditar y comprobar cada número.",
    traditionalTitle: "Caja negra y misticismo",
    traditionalDesc: "Se vende el 'misterio' y la fe en un intermediario. Sin trazabilidad comprobable.",
  },
  {
    category: "¿Para quién es?",
    molinoTitle: "Curiosos y analistas",
    molinoDesc: "Para quien busca herramientas de autoconocimiento lúcido y autonomía, sin depender de nadie.",
    traditionalTitle: "Buscadores de respuestas externas",
    traditionalDesc: "Para quienes buscan un oráculo o un gurú que les dicte qué hacer con sus vidas.",
  },
];

const pillars = [
  {
    icon: Binary,
    title: "Estructura",
    subtitle: "Rigor Simbólico",
    description: "Tres sistemas verificados: numerología pitagórica, astrología tropical y zodíaco chino. Método y cálculo matemático, no improvisación.",
    badge: "100% Determinista"
  },
  {
    icon: Shield,
    title: "Utilidad",
    subtitle: "Perspectiva Práctica",
    description: "No predice futuros mágicos. Brinda claridad sobre tus ciclos para negociar, decidir y sincronizar mejor tu energía.",
    badge: "Orientación Real"
  },
  {
    icon: Zap,
    title: "Enfoque",
    subtitle: "Autonomía Radical",
    description: "Pensado para el curioso que quiere entender sus propios patrones, no para seguidores pasivos de gurús.",
    badge: "Sin Intermediarios"
  },
];

export default function ClaritySection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-8 bg-background border-b border-border overflow-hidden">
      {/* Subtle Background Mesh / Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-accent/[0.025] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              ¿Cuál es la diferencia?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
          >
            Tu inteligencia personal.
            <br />
            <span className="text-accent">Sin gurús.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-muted leading-relaxed font-normal"
          >
            Molino estructura tu realidad mediante métodos comprobables. No adivinación: claridad para tomar mejores decisiones.
          </motion.p>
        </div>

        {/* ── High-Contrast Comparison Matrix ── */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden mb-24">
          {/* Table Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border/80 bg-background/50">
            {/* Molino Header */}
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    Molino
                  </h3>
                  <span className="font-mono text-xs text-accent font-semibold">
                    Estructura probada & transparente
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent uppercase tracking-wider">
                Auditable
              </span>
            </div>

            {/* Traditional Astrology Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/10 border border-border flex items-center justify-center text-muted">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-muted">
                    Astrología Tradicional
                  </h3>
                  <span className="font-mono text-xs text-muted/70">
                    Caja negra sin trazabilidad
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-mono text-muted bg-muted/10 uppercase tracking-wider">
                Opaco
              </span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-border/60">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`grid grid-cols-1 md:grid-cols-2 transition-colors duration-200 ${
                  hoveredIdx === idx ? "bg-accent/[0.02]" : ""
                }`}
              >
                {/* Left: Molino Benefit */}
                <div className="p-6 sm:p-8 md:border-r border-border/60 space-y-2 bg-gradient-to-r from-accent/[0.02] to-transparent">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold block">
                    {row.category}
                  </span>
                  <p className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {row.molinoTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal">
                    {row.molinoDesc}
                  </p>
                </div>

                {/* Right: Traditional Friction */}
                <div className="p-6 sm:p-8 space-y-2 bg-background/20 opacity-80">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block">
                    {row.category}
                  </span>
                  <p className="font-heading text-base sm:text-lg font-semibold text-muted line-through decoration-border">
                    {row.traditionalTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
                    {row.traditionalDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Three Pillars Section (Elevated 3D-feel Cards) ── */}
        <div className="space-y-12 mb-20">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted font-bold block mb-2">
              Arquitectura del Método
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Tres pilares fundamentales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="group relative flex flex-col justify-between p-8 rounded-3xl border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-5">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-border/50 text-muted group-hover:text-foreground transition-colors">
                        {pillar.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h4 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                        {pillar.title}
                      </h4>
                      <p className="font-mono text-xs text-accent mt-0.5 font-medium">
                        {pillar.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-mono text-muted/80 group-hover:text-accent transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Verificado por Molino</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Call To Action to Methods & Sources ── */}
        <div className="text-center">
          <Link
            href="/metodos-y-fuentes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:border-accent hover:text-accent font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all duration-200 group"
          >
            <span>Ver fórmulas y fuentes</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

