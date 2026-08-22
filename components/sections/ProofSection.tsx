"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Binary,
  Compass,
  Sparkles,
  Clock,
  Layers,
  ChevronRight,
  Cpu,
  Fingerprint,
  Info
} from "lucide-react";

type MapQuadrant = "numerology" | "astrology" | "zodiac" | "timeline";

interface QuadrantItem {
  label: string;
  value: string;
  badge?: string;
  formula: string;
  meaning: string;
  highlight?: boolean;
}

interface QuadrantData {
  id: MapQuadrant;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  data: QuadrantItem[];
}

const demoData: Record<MapQuadrant, QuadrantData> = {
  numerology: {
    id: "numerology",
    title: "Numerología",
    subtitle: "Sistema Pitagórico Tradicional",
    icon: Binary,
    badge: "Vibración Base",
    description:
      "Decodificación matemática exacta a partir de tu fecha natal y reducción teosófica de tu nombre.",
    data: [
      {
        label: "Camino de Vida",
        value: "7",
        badge: "Arquetipo Místico",
        formula: "15/06/1990 → 1+5+6+1+9+9+0 = 31 → 3+1 = 4 → Esencia 7",
        meaning: "Búsqueda de verdad interior, profundidad reflexiva y pensamiento analítico.",
        highlight: true,
      },
      {
        label: "Número de Expresión",
        value: "9",
        badge: "Potencial Máximo",
        formula: "Suma teosófica de letras completas (A=1, B=2... Z=8) mod 9",
        meaning: "Sensibilidad universal, generosidad pragmática e impulso de legado.",
      },
      {
        label: "Año Personal 2026",
        value: "5",
        badge: "Ciclo Activo",
        formula: "Día natal (15) + Mes (6) + Año en curso (2026 = 10 = 1) = 23 → 5",
        meaning: "Fase de dinamismo, adaptabilidad, expansión y cambios de rumbo decisivos.",
      },
    ],
  },
  astrology: {
    id: "astrology",
    title: "Astrología",
    subtitle: "Carta Natal Occidental / Tropical",
    icon: Compass,
    badge: "Geometría Celeste",
    description:
      "Posicionamiento de luminarias y casas sobre el horizonte exacto de nacimiento.",
    data: [
      {
        label: "Signo Solar",
        value: "Géminis ♊",
        badge: "Sol en 24°",
        formula: "Tránsito del Sol en el zodíaco tropical al 15 de junio",
        meaning: "Curiosidad intelectual inagotable, agilidad verbal y versatilidad mental.",
        highlight: true,
      },
      {
        label: "Elemento Dominante",
        value: "Aire",
        badge: "48% Carta",
        formula: "Ponderación de planetas en signos de Géminis, Libra y Acuario",
        meaning: "Prioridad a las conexiones conceptuales, el diálogo y la perspectiva lógica.",
      },
      {
        label: "Ascendente (Casa 1)",
        value: "Acuario ♒",
        badge: "Horizonte Este",
        formula: "Cálculo de hora solar y latitud geográfica de nacimiento",
        meaning: "Enfoque vanguardista, autonomía radical y mirada orientada al futuro.",
      },
    ],
  },
  zodiac: {
    id: "zodiac",
    title: "Zodíaco Chino",
    subtitle: "Ciclo Sexagenario BaZi",
    icon: Sparkles,
    badge: "Energía Elemental",
    description:
      "Las 12 Ramas Terrestres y los 5 Troncos Celestiales en perfecta sincronía cósmica.",
    data: [
      {
        label: "Animal Guardián",
        value: "Caballo 🐴",
        badge: "Wu (午)",
        formula: "Año solar chino Geng-Wu (庚午 - 1990)",
        meaning: "Ímpetu noble, deseo de autonomía y energía vital orientada a la acción veloz.",
        highlight: true,
      },
      {
        label: "Elemento Regente",
        value: "Metal",
        badge: "Geng (庚)",
        formula: "Tronco celeste de terminación '0' en el calendario solar chino",
        meaning: "Estructura firme, disciplina inquebrantable y capacidad de ejecución tenaz.",
      },
      {
        label: "Polaridad de Rama",
        value: "Yang",
        badge: "Fuerza Proactiva",
        formula: "Orientación solar y distribución de polaridades en el pilar anual",
        meaning: "Tendencia natural a tomar la iniciativa y manifestar ideas en el plano exterior.",
      },
    ],
  },
  timeline: {
    id: "timeline",
    title: "Timeline & Ciclos",
    subtitle: "Sincronía Temporal Dinámica",
    icon: Clock,
    badge: "Proyección Viva",
    description:
      "Cruce en tiempo real entre tus ritmos numerológicos y los tránsitos mayores del año.",
    data: [
      {
        label: "Ciclo Mayor Activo",
        value: "2026–2035",
        badge: "Período de 9 Años",
        formula: "Apertura por Año Personal 5 hacia la consolidación del ciclo 9",
        meaning: "Transformación estructural: redefinición de metas profesionales y relaciones clave.",
        highlight: true,
      },
      {
        label: "Momento Actual",
        value: "Expansión",
        badge: "Q3 / Q4 2026",
        formula: "Intersección de tránsitos solares con tu vibración mensual 8",
        meaning: "Alta receptividad para lanzar proyectos, negociar y capitalizar oportunidades.",
      },
      {
        label: "Ventana Óptima",
        value: "Julio — Septiembre",
        badge: "Pico de Claridad",
        formula: "Confluencia de Sol en fuego y tu mes personal armónico",
        meaning: "Momento óptimo para decisiones irreversibles y acuerdos de largo alcance.",
      },
    ],
  },
};

const quadrants: MapQuadrant[] = ["numerology", "astrology", "zodiac", "timeline"];

export default function ProofSection() {
  const [activeQuadrant, setActiveQuadrant] = useState<MapQuadrant>("numerology");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const current = demoData[activeQuadrant];
  const CurrentIcon = current.icon;

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-background border-y border-border overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/[0.03] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <Fingerprint className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Así se ve tu mapa
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
          >
            Datos reales en tiempo real.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-muted leading-relaxed font-normal"
          >
            Tu mapa se actualiza en vivo. Cada número tiene su origen comprobable. Nada es inventado.
          </motion.p>
        </div>

        {/* Interactive Navigator Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm max-w-full overflow-x-auto">
            {quadrants.map((quad) => {
              const item = demoData[quad];
              const Icon = item.icon;
              const isActive = activeQuadrant === quad;

              return (
                <button
                  key={quad}
                  onClick={() => setActiveQuadrant(quad)}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-heading font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-accent font-bold"
                      : "text-muted hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-xl"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-accent" : "text-muted"}`} />
                  <span className="relative z-10">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Stage Display Card */}
        <motion.div
          layout
          className="rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
        >
          {/* Card Meta Bar */}
          <div className="px-6 sm:px-10 py-6 border-b border-border/70 flex flex-wrap items-center justify-between gap-4 bg-background/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    {current.title}
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-accent/10 text-accent">
                    {current.badge}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">
                  {current.subtitle}
                </p>
              </div>
            </div>

            {/* Technical toggle button */}
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                showTechnicalDetails
                  ? "bg-accent text-accent-foreground border-accent shadow-sm"
                  : "bg-background border-border text-muted hover:text-foreground hover:border-accent/40"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{showTechnicalDetails ? "Ocultar fórmulas" : "Ver detalles técnicos"}</span>
            </button>
          </div>

          {/* Card Subtitle description */}
          <div className="px-6 sm:px-10 pt-6 pb-2 text-xs sm:text-sm text-muted">
            {current.description}
          </div>

          {/* 3 Pillars Data Grid */}
          <div className="p-6 sm:p-10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="wait">
              {current.data.map((item, idx) => (
                <motion.div
                  key={`${activeQuadrant}-${item.label}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
                    item.highlight
                      ? "bg-gradient-to-b from-accent/[0.04] to-card border-accent/30 shadow-[0_4px_24px_-12px_rgba(var(--accent-rgb),0.12)]"
                      : "bg-background/60 border-border/70 hover:border-border hover:bg-background"
                  }`}
                >
                  {/* Top: Label + mini tag */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-border/40 text-muted group-hover:text-foreground transition-colors">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Prominent Value */}
                    <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight py-1">
                      {item.value}
                    </div>

                    {/* Interpretation meaning */}
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal">
                      {item.meaning}
                    </p>
                  </div>

                  {/* Formula / Calculation Breakdown (Technical Detail) */}
                  {showTechnicalDetails && (
                    <div className="mt-5 pt-4 border-t border-border/50">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold block">
                          Origen del cálculo
                        </span>
                        <p className="font-mono text-[11px] text-muted leading-tight bg-card p-2 rounded border border-border/60">
                          {item.formula}
                        </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer Synthesis Callout */}
          <div className="p-6 sm:px-10 border-t border-border/70 bg-background/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5 sm:mt-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-foreground">
                  Todo está conectado
                </p>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Tu número personal, tus ciclos actuales, tu momento astrológico. Nada es separado. Tu mapa es una síntesis.
                </p>
              </div>
            </div>

            <div className="shrink-0 font-mono text-xs text-muted flex items-center gap-1 self-end sm:self-center">
              <span>0% almacenamiento en nube</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

