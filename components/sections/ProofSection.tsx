"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Binary,
  Compass,
  Sparkles,
  Clock,
  Layers,
  Cpu,
  Fingerprint
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
        value: "4",
        badge: "El Constructor",
        formula: "15/06/1990 → 1+5+0+6+1+9+9+0 = 31 → 3+1 = 4",
        meaning: "Capacidad de dar estructura, disciplina, persistencia y construcción sólida.",
        highlight: true,
      },
      {
        label: "Número de Expresión",
        value: "9",
        badge: "El Adaptador",
        formula: "Suma teosófica de letras completas (A=1, B=2... Z=8) reducida mod 9",
        meaning: "Sensibilidad universal, generosidad pragmática y visión de síntesis.",
      },
      {
        label: "Año Personal 2026",
        value: "4",
        badge: "Ciclo de Cimiento",
        formula: "Día (15) + Mes (6) + Año en curso (2026 → 1) = 6 + 6 + 1 = 13 → 4",
        meaning: "Fase de consolidación, orden, estructura y trabajo enfocado a largo plazo.",
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
        meaning: "Mirada orientada al futuro.",
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
        value: "2026–2034",
        badge: "Período de 9 Años",
        formula: "Evolución por Año Personal 4 hacia la consolidación del ciclo 9",
        meaning: "Consolidación estructural y orden progresivo para el desarrollo de proyectos clave.",
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
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-background border-y border-border">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
            <Fingerprint className="w-3.5 h-3.5" aria-hidden="true" />
            Cómo se obtiene el mapa
          </p>

          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
          >
            Así se calcula cada número.
          </h2>

          <p className="text-base sm:text-lg text-muted leading-relaxed font-normal">
            Este es un ejemplo (no tu mapa todavía). Cada número muestra la fórmula que lo genera.
          </p>
        </div>

        {/* Interactive Navigator */}
        <div className="flex justify-center mb-8 border-b border-border">
          <div className="inline-flex max-w-full overflow-x-auto">
            {quadrants.map((quad) => {
              const item = demoData[quad];
              const Icon = item.icon;
              const isActive = activeQuadrant === quad;

              return (
                <button
                  key={quad}
                  onClick={() => setActiveQuadrant(quad)}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 font-heading font-medium text-xs sm:text-sm tracking-wide transition-colors duration-200 whitespace-nowrap ${
                    isActive ? "text-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute inset-x-0 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Stage Display Card */}
        <motion.div
          layout
          className="rounded-md sm:rounded-md border border-border bg-card shadow-sm overflow-hidden"
        >
          {/* Card Meta Bar */}
          <div className="px-6 sm:px-10 py-6 border-b border-border/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CurrentIcon className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    {current.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
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
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-xs transition-colors ${
                showTechnicalDetails
                  ? "bg-accent text-accent-foreground border-accent"
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeQuadrant}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="p-6 sm:p-10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
            >
              {current.data.map((item) => (
                <div
                  key={`${activeQuadrant}-${item.label}`}
                  className={`group relative flex flex-col justify-between p-6 rounded-md border transition-colors duration-200 bg-background/60 ${
                    item.highlight
                      ? "border-border/70 border-l-2 border-l-accent"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  {/* Top: Label + mini tag */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-xs font-mono text-muted">
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
                      <div className="space-y-1">
                        <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold block">
                          Origen del cálculo
                        </span>
                        <p className="font-mono text-xs text-muted leading-tight bg-card p-2 rounded border border-border/60">
                          {item.formula}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Footer Synthesis Callout */}
          <div className="p-6 sm:px-10 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <Layers className="w-4 h-4 text-accent shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <div>
                <p className="font-heading text-sm font-bold text-foreground">
                  Todo está conectado
                </p>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Tu número personal, tus ciclos actuales, tu momento astrológico. Nada es separado. Tu mapa es una síntesis.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-4 self-end sm:self-center">
              <Link
                href="/ejemplo"
                className="font-mono text-xs text-accent hover:underline underline-offset-2 whitespace-nowrap"
              >
                Ver el mapa completo →
              </Link>
              <span className="font-mono text-xs text-muted whitespace-nowrap">Cálculo 100% local</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

