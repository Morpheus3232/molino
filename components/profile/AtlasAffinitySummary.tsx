"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import type { AtlasSection } from "@/lib/affinity-light";
import { fadeUp } from "@/lib/utils/motion";

interface AtlasAffinitySummaryProps {
  /** Top categorías del animal del usuario, ya curadas (buildAtlasSections().sameAnimal). */
  sections: AtlasSection[];
  animalSlug: string;
  animalName: string;
}

/**
 * Resumen compacto de "tu animal en el mundo" — versión condensada del Atlas
 * completo, pensada para vivir dentro de Mi Mapa sin repetir su experiencia
 * de exploración. Todo el texto visible de entrada, sin accordion.
 */
export default function AtlasAffinitySummary({ sections, animalSlug, animalName }: AtlasAffinitySummaryProps) {
  if (sections.length === 0) return null;

  const totalEntities = sections.reduce((sum, s) => sum + s.entities.length, 0);

  return (
    <section className="py-12 border-t border-ink/10" aria-labelledby="atlas-affinity-title">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-2">
              Tu animal en el mundo
            </p>
            <h2 id="atlas-affinity-title" className="font-heading text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
              {totalEntities} afinidades para {animalName}
            </h2>
          </div>

          <Link
            href={`/atlas/explorar/${animalSlug}`}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-muted bg-ink/5 border border-ink/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto hover:border-accent/40 hover:text-accent transition-colors"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Atlas de {animalName}</span>
          </Link>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.type}>
              {/* Título de categoría linkeado a su listado en el Atlas —
                  section.type ya es el slug que espera la ruta
                  /atlas/explorar/[animal]/[category] */}
              <Link
                href={`/atlas/explorar/${animalSlug}/${section.type}`}
                className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3 hover:text-accent transition-colors"
              >
                {section.label}
                <ArrowRight
                  className="w-3 h-3 opacity-40 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  aria-hidden="true"
                />
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.entities.map((e) => (
                  <Link
                    key={e.id}
                    href={`/affinity/${e.type}/${e.id}`}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-ink/10 bg-card hover:border-accent/40 transition-colors"
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{e.emoji || "🔮"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{e.name}</p>
                      {e.origin && (
                        <p className="text-[11px] text-muted truncate">{e.origin}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/atlas/explorar/${animalSlug}`}
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4"
        >
          Ver todo en Atlas
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
