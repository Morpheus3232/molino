"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { ACADEMY_PIECES, type AcademyPiece } from "@/lib/data/academy-content";
import { ICON_MAP } from "../AcademyContent";

export default function AcademyArticleContent({ piece }: { piece: AcademyPiece }) {
  const currentIndex = ACADEMY_PIECES.findIndex((p) => p.slug === piece.slug);
  const prev = currentIndex > 0 ? ACADEMY_PIECES[currentIndex - 1] : null;
  const next = currentIndex < ACADEMY_PIECES.length - 1 ? ACADEMY_PIECES[currentIndex + 1] : null;
  const Icon = ICON_MAP[piece.icon];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/academy" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">La Academia</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{piece.title}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">
              {Icon ? <Icon className="w-7 h-7" /> : null}
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{piece.era}</p>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
            {piece.title}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">{piece.idea}</p>
        </motion.section>

        {/* La historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">La historia</h2>
          </div>
          <div className="space-y-4">
            {piece.story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base text-foreground leading-relaxed max-w-3xl">{paragraph}</p>
            ))}
          </div>
        </motion.section>

        {/* Origen */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Origen</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{piece.origin}</p>
        </motion.section>

        {/* Influencia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Influencia</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {piece.influence.map((inf) => (
              <span key={inf} className="text-xs px-2.5 py-1 rounded-sm bg-accent/10 text-accent">
                {inf}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Cómo lo usa Molino */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Cómo lo usa Molino</p>
            <p className="text-sm text-foreground leading-relaxed">{piece.molino}</p>
          </div>
        </motion.section>

        {/* Transparencia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Transparencia</p>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              Estas tradiciones históricas exploran números y símbolos culturales como herramienta de reflexión personal.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Las interpretaciones pertenecen al campo simbólico y cultural, no constituyen predicciones científicas.
              Este mapa combina numerología, astrología y zodíaco chino de forma transparente y educativa.
            </p>
          </div>
        </motion.section>

        {/* CTA al mapa */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16 text-center">
          <div className="p-8 rounded-md border border-border bg-card shadow-sm">
            <p className="text-sm text-muted mb-4">
              ¿Querés ver cómo se aplica esta tradición en tu perfil?
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Ver mi mapa
            </Link>
          </div>
        </motion.section>

        {/* Navegación entre piezas */}
        <motion.section {...fadeUp} className="flex justify-between items-center pt-8 border-t border-border">
          {prev ? (
            <Link href={`/academy/${prev.slug}`} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; {prev.title}
            </Link>
          ) : <div />}
          <Link href="/academy" className="text-xs uppercase tracking-[0.2em] text-muted font-medium hover:text-accent transition-colors">
            La Academia
          </Link>
          {next ? (
            <Link href={`/academy/${next.slug}`} className="text-sm text-accent hover:text-accent/80 transition-colors text-right">
              {next.title} &rarr;
            </Link>
          ) : <div />}
        </motion.section>

      </main>
    </div>
  );
}
