"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { type AffinityResult } from "@/lib/engines/affinityEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import EntityVisual from "@/components/ui/EntityVisual";

/**
 * Discovery hero — entidad, la conexión concreta con el usuario (relación
 * de animal zodiacal), y la evidencia histórica detrás de esa relación. Sin
 * framing de "vs"/compatibilidad: no enfrenta a la entidad con el usuario,
 * muestra algo del mundo que se conecta con su mapa.
 * Shared by the with-profile flow and the P0 quick-entry flow.
 */
export default function AffinityHero({
  result,
  entity,
  meta,
  type,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}) {
  const router = useRouter();

  return (
    <motion.section
      className="mb-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Entity */}
      <EntityVisual
        visualType={entity.visualType}
        emoji={entity.emoji}
        imageUrl={entity.imageUrl}
        name={entity.name}
        countryISO={entity.countryISO}
        type={type}
        category={entity.category}
        size={72}
        shape="circle"
        className="mx-auto mb-4"
      />
      <p className="font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-6">
        {entity.name}
      </p>

      {/* Framing — conexión, no comparación */}
      <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
        Una conexión con vos
      </p>
      <p className="text-sm text-foreground font-medium mb-8">
        {formatAnimalSimple(result.entityAnimal)} · {result.relationship}
      </p>

      {/* Evidencia — historia detrás de la relación */}
      <div className="mb-8 px-4">
        <p className="text-sm text-foreground leading-relaxed max-w-md mx-auto">
          {result.primaryEvent.description}
        </p>
      </div>

      {/* CTA — seguir descubriendo */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => router.push(`/affinity/compare?from=${entity.id}`)}
          className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Explorar otra entidad
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
}
