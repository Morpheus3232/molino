"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { NUMBERS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";

export default function NumeroContent() {
  const router = useRouter();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const numId = params.numero as string;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  if (!num) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Número no encontrado</h1>
          <p className="text-muted mt-4">El número {numId} no existe en la base de numerología de Molino.</p>
          <button onClick={() => router.push("/conocimiento/numerologia")} className="mt-6 text-sm text-accent hover:text-accent/80">&larr; Volver a Numerología</button>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  const allNumbers = NUMBERS;
  const currentIndex = allNumbers.findIndex(n => n.number === num.number);
  const prev = currentIndex > 0 ? allNumbers[currentIndex - 1] : null;
  const next = currentIndex < allNumbers.length - 1 ? allNumbers[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/conocimiento/numerologia" className="hover:text-accent transition-colors">Numerología</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Número {num.number}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
            <p className="number-display text-[6rem] sm:text-[8rem] number-display-accent leading-none">{num.number}</p>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">{num.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {num.keywords.map(kw => (
                  <span key={kw} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-md border border-border">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Significado */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Significado tradicional</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{num.meaning}</p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y simbolismo</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mb-4">{num.history}</p>
          <p className="text-sm text-muted leading-relaxed max-w-3xl">{num.symbolism}</p>
        </motion.section>

        {/* Fortalezas y Desafíos */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
              <ul className="space-y-2">
                {num.strengths.map(s => (
                  <li key={s} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Desafíos</p>
              <ul className="space-y-2">
                {num.challenges.map(c => (
                  <li key={c} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-muted mt-0.5">&bull;</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Interpretación + Ejemplo consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Interpretación de Molino</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mb-6">{num.interpretation}</p>
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Ejemplo práctico</p>
            <p className="text-sm text-foreground leading-relaxed">{num.example}</p>
          </div>
        </motion.section>

        {/* Relación con otros */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Relación con otros números</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{num.relationshipWithOther}</p>
        </motion.section>

        {/* Aviso + Disclaimer consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-sm text-muted leading-relaxed">{num.scientificNote}</p>
            <p className="text-xs text-muted leading-relaxed mt-3">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Herramienta relacionada */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Calculá tu mapa numérico</p>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Descubrí todos tus números: Camino de Vida, Expresión, Alma y Personalidad.
            </p>
            <Link href="/herramientas/camino-de-vida" className="text-sm font-medium text-accent hover:underline">
              Ir a la calculadora →
            </Link>
          </div>
        </motion.section>

        {/* Navegación entre números */}
        <motion.section {...fadeUp} className="flex justify-between items-center pt-8 border-t border-border">
          {prev ? (
            <button onClick={() => router.push(`/conocimiento/numerologia/numero-${prev.number}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; Número {prev.number} — {prev.title}
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => router.push(`/conocimiento/numerologia/numero-${next.number}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              {next.number} — {next.title} &rarr;
            </button>
          ) : <div />}
        </motion.section>

      </main>
      <UniversityFooter />
    </div>
  );
}
