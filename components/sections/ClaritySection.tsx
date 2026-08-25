"use client";

import React from "react";
import {
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

interface MethodItem {
  category: string;
  title: string;
  description: string;
}

// Antes esto era una comparación "Molino vs Astrología Tradicional" —
// se reemplazó por el método de Molino hecho visible, sin retratar otras
// disciplinas como opacas o deshonestas (Molino usa astrología como uno de
// sus tres sistemas; atacarla como categoría era inconsistente).
const methodRows: MethodItem[] = [
  {
    category: "¿Qué hace?",
    title: "Estructura tu realidad",
    description: "Identifica patrones matemáticos, tensiones arquetípicas y ciclos activos para orientar decisiones. No promete adivinar el futuro.",
  },
  {
    category: "¿Se guardan tus datos?",
    title: "Tu mapa básico no sale de tu navegador",
    description: "El cálculo ocurre 100% en tu dispositivo (Web Workers), sin registro. Si activás Premium o IA, guardamos un hash irreversible de tu perfil — nunca tu fecha en claro.",
  },
  {
    category: "¿Cómo se verifica?",
    title: "Fórmulas visibles y documentadas",
    description: "Fórmulas pitagóricas visibles y fuentes documentadas. Podés revisar y comprobar cada número en /metodos-y-fuentes.",
  },
  {
    category: "¿Para quién es?",
    title: "Curiosos y analistas",
    description: "Para quien busca herramientas de autoconocimiento lúcido — el mapa muestra el método, la decisión sigue siendo tuya.",
  },
];

export default function ClaritySection() {
  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-8 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <p className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            El método
          </p>

          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
          >
            Tu inteligencia personal, con método visible.
          </h2>

          <p className="text-base sm:text-lg text-muted leading-relaxed font-normal">
            Estructura patrones a partir de tu fecha con métodos verificables. No es adivinación: es información para pensar tus propias decisiones.
          </p>
        </div>

        {/* ── El método, hecho visible ── */}
        <div className="rounded-md border border-border bg-card overflow-hidden mb-16">
          <div className="p-6 sm:p-8 border-b border-border/80 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Cómo se construye el mapa
              </h3>
              <span className="font-mono text-xs text-muted">
                Documentado en /metodos-y-fuentes
              </span>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {methodRows.map((row, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 transition-colors duration-200 hover:bg-ink/[0.02]"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-muted font-bold block sm:pt-1">
                  {row.category}
                </span>
                <div className="space-y-2">
                  <p className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {row.title}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal max-w-xl">
                    {row.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Call To Action to Methods & Sources ── */}
        <div className="text-center">
          <Link
            href="/metodos-y-fuentes"
            className="inline-flex items-center gap-2 font-mono text-xs text-accent hover:underline underline-offset-2 group"
          >
            <span>Ver fórmulas y fuentes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

