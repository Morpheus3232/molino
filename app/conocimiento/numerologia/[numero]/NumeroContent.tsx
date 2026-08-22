"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { NUMBERS, NUMEROLOGY_DISCLAIMER, MASTER_NUMBERS_NOTE, MASTER_NUMBERS } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";

export default function NumeroContent({ num }: { num: (typeof NUMBERS)[number] | null | undefined }) {
  if (!num) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Número no encontrado</h1>
          <p className="text-muted mt-4">El número no existe en la base de numerología de Molino.</p>
          <Link href="/conocimiento/numerologia" className="mt-6 inline-block text-sm text-accent hover:text-accent/80">&larr; Volver a Numerología</Link>
        </main>
      </div>
    );
  }

  const allNumbers = NUMBERS;
  const currentIndex = allNumbers.findIndex(n => n.number === num.number);
  const prev = currentIndex > 0 ? allNumbers[currentIndex - 1] : null;
  const next = currentIndex < allNumbers.length - 1 ? allNumbers[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/conocimiento/numerologia" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Numerología</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Número {num.number}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
            <p className="number-display text-[6rem] sm:text-[8rem] number-display-accent leading-none">{num.number}</p>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.1]">{num.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {num.keywords.map(kw => (
                  <span key={kw} className="text-xs uppercase tracking-[0.2em] text-muted font-medium px-2 py-0.5 rounded-md border border-border">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Nota de números maestros — solo para 11, 22 y 33 */}
        {MASTER_NUMBERS.includes(num.number) && (
          <motion.section {...fadeUp} className="mb-12 sm:mb-16">
            <div className="p-6 border border-accent/20 bg-accent/[0.03]">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Número maestro</p>
              <p className="text-sm text-foreground leading-relaxed">{MASTER_NUMBERS_NOTE}</p>
            </div>
          </motion.section>
        )}

        {/* Significado */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Significado tradicional</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{num.meaning}</p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Historia y simbolismo</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mb-4">{num.history}</p>
          <p className="text-sm text-muted leading-relaxed max-w-3xl">{num.symbolism}</p>
        </motion.section>

        {/* Fortalezas y Desafíos */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 border border-ink/10">
              <h3 className="font-heading text-lg font-semibold text-accent mb-3">Fortalezas</h3>
              <ul className="space-y-2">
                {num.strengths.map(s => (
                  <li key={s} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border border-ink/10">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Desafíos</h3>
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

        {/* Estructura profunda: impulso, comportamiento, potencial, sombra, aprendizaje */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Estructura profunda</h2>
          </div>
          <div className="space-y-6 max-w-3xl">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Impulso central</p>
              <p className="text-sm text-foreground leading-relaxed">{num.coreDrive}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Cómo suele expresarse</p>
              <p className="text-sm text-foreground leading-relaxed">{num.behaviorPattern}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Potencial</p>
              <ul className="space-y-2">
                {num.potential.map(p => (
                  <li key={p} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Sombra o desequilibrio</p>
              <p className="text-sm text-muted leading-relaxed">{num.shadow}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Qué suele necesitar desarrollar</p>
              <p className="text-sm text-foreground leading-relaxed">{num.growthEdge}</p>
            </div>
          </div>
        </motion.section>

        {/* En la práctica: decisiones, relaciones, trabajo */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">En la práctica</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 border border-ink/10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Decisiones</h3>
              <p className="text-sm text-foreground leading-relaxed">{num.manifestation.decisions}</p>
            </div>
            <div className="p-6 border border-ink/10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Relaciones</h3>
              <p className="text-sm text-foreground leading-relaxed">{num.manifestation.relationships}</p>
            </div>
            <div className="p-6 border border-ink/10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Trabajo</h3>
              <p className="text-sm text-foreground leading-relaxed">{num.manifestation.work}</p>
            </div>
          </div>
        </motion.section>

        {/* Pregunta de reflexión */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <blockquote className="border-l-2 border-accent/40 pl-6 py-1">
            <p className="font-heading text-lg sm:text-xl text-foreground italic leading-relaxed">{num.reflectionQuestion}</p>
          </blockquote>
        </motion.section>

        {/* Interpretación + Ejemplo consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Interpretación de Molino</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mb-6">{num.interpretation}</p>
          <div className="p-6 border border-ink/10">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Ejemplo práctico</h3>
            <p className="text-sm text-foreground leading-relaxed">{num.example}</p>
          </div>
        </motion.section>

        {/* Relación con otros */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Relación con otros números</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{num.relationshipWithOther}</p>
        </motion.section>

        {/* Aviso + Disclaimer consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 border border-ink/10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-sm text-muted leading-relaxed">{num.scientificNote}</p>
            <p className="text-xs text-muted leading-relaxed mt-3">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Herramienta relacionada */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 border border-ink/10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Generá tu mapa</p>
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
            <Link href={`/conocimiento/numerologia/${prev.number}`} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; Número {prev.number} — {prev.title}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/conocimiento/numerologia/${next.number}`} className="text-sm text-accent hover:text-accent/80 transition-colors">
              {next.number} — {next.title} &rarr;
            </Link>
          ) : <div />}
        </motion.section>

      </main>
    </div>
  );
}
