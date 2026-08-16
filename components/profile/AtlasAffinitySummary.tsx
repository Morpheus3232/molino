"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
            <h2 id="atlas-affinity-title" className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
              {totalEntities} afinidades para {animalName}
            </h2>
          </div>
        </motion.div>

        <div className="space-y-6 max-w-2xl">
          {sections.map((section) => (
            <div key={section.type}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                {section.label}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {section.entities.map((e, i) => (
                  <span key={e.id}>
                    <Link
                      href={`/affinity/${e.type}/${e.id}`}
                      className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      <span aria-hidden="true">{e.emoji || "🔮"}</span>
                      {e.name}
                      {e.origin && (
                        <span className="text-muted/70 text-[11px] whitespace-nowrap"> — {e.origin}</span>
                      )}
                    </Link>
                    {i < section.entities.length - 1 && (
                      <span className="text-muted/30 mx-1.5" aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
              </p>
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
