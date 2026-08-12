"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import {
  SOURCES,
  CATEGORY_LABELS,
  type BibliotecaSource,
} from "@/lib/data/biblioteca-content";
import { TYPE_META } from "../BibliotecaContent";

export default function BibliotecaSourceContent({ source }: { source: BibliotecaSource }) {
  const meta = TYPE_META[source.type];
  const related = SOURCES.filter(
    (s) => s.category === source.category && s.slug !== source.slug
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/biblioteca" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Biblioteca</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{source.title}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span
              className="font-mono text-xs font-semibold tracking-wider uppercase px-2 py-0.5"
              style={{ background: `${meta.color}15`, color: meta.color }}
            >
              {meta.label}
            </span>
            <span
              className={`font-mono text-xs tracking-wider uppercase px-2 py-0.5 ${
                source.era === "ancestral" ? "bg-accent/10 text-accent" : "bg-ink/5 text-muted"
              }`}
            >
              {source.era === "ancestral" ? "Tradición ancestral" : "Contemporáneo"}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted px-2 py-0.5 border border-ink/10">
              {CATEGORY_LABELS[source.category] || source.category}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            {source.title}
          </h1>
          <p className="text-sm sm:text-base text-muted">{source.author} · {source.year}</p>
        </motion.section>

        {/* Descripción */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Qué es</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{source.description}</p>
        </motion.section>

        {/* Método */}
        {source.summary && (
          <motion.section {...fadeUp} className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Método</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed max-w-3xl">{source.summary}</p>
          </motion.section>
        )}

        {/* Reseña */}
        {source.review && (
          <motion.section {...fadeUp} className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Reseña de Molino</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed max-w-3xl">{source.review}</p>
          </motion.section>
        )}

        {/* Etiquetas + link externo */}
        {(source.tags?.length || source.link) && (
          <motion.section {...fadeUp} className="mb-12 sm:mb-16">
            <div className="flex flex-wrap items-center gap-2">
              {(source.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs tracking-wider uppercase bg-background border border-ink/10 px-2 py-0.5 text-muted"
                >
                  #{tag}
                </span>
              ))}
              {source.link && (
                <a
                  href={source.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs tracking-wider uppercase px-2 py-0.5 text-accent hover:text-accent/80 border border-accent/30 transition-colors"
                >
                  Fuente externa ↗
                </a>
              )}
            </div>
          </motion.section>
        )}

        {/* CTA al mapa */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16 text-center">
          <div className="p-8 rounded-md border border-border bg-card shadow-sm">
            <p className="text-sm text-muted mb-4">
              ¿Querés ver cómo este sistema se aplica en tu perfil?
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Ver mi mapa
            </Link>
          </div>
        </motion.section>

        {/* Relacionadas */}
        {related.length > 0 && (
          <motion.section {...fadeUp} className="pt-8 border-t border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-4">
              Seguir explorando · {CATEGORY_LABELS[source.category] || source.category}
            </p>
            <div className="space-y-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/biblioteca/${rel.slug}`}
                  className="block text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  {rel.title} →
                </Link>
              ))}
            </div>
          </motion.section>
        )}

      </main>
    </div>
  );
}
