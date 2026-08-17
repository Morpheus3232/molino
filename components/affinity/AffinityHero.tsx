"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import ReadingNumber from "@/components/ui/ReadingNumber";
import EntityVisual from "@/components/ui/EntityVisual";

/**
 * Score hero — animals facing off, resonance number, contextual explanation.
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
  const reducedMotion = useReducedMotion();
  const tierMeta = TIER_META[result.tier];
  // result.explanation ya nombra a la entidad (affinityEngine.getExplanation),
  // en vez de un bucket genérico por score que repetía la misma frase para
  // cualquier entidad que compartiera relación de animal con el usuario.
  const explanation = result.explanation;

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Label */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-6 text-center">
          Cómo resuena · {meta.label}
        </p>
      </div>

      {/* Animals facing each other — approach animation for high scores */}
      <div className="flex items-end justify-center gap-6 sm:gap-10 mb-8">
        {/* Entity — moves right for high scores */}
        <motion.div
          className="text-center"
          animate={reducedMotion ? {} : { x: result.score >= 75 ? 12 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <EntityVisual
            visualType={entity.visualType}
            emoji={entity.emoji}
            imageUrl={entity.imageUrl}
            name={entity.name}
            countryISO={entity.countryISO}
            size={64}
            shape="circle"
            className="mx-auto mb-2"
          />
          <p className="font-heading text-lg sm:text-xl font-semibold text-foreground leading-tight">
            {entity.name}
          </p>
          <p className="text-xs text-muted mt-0.5">{formatAnimalSimple(result.entityAnimal)}</p>
        </motion.div>

        {/* VS divider — fades for high scores */}
        <motion.div
          className="flex flex-col items-center pb-6"
          animate={reducedMotion ? {} : { opacity: result.score >= 75 ? 0.3 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted font-medium">vs</span>
        </motion.div>

        {/* User — moves left for high scores */}
        <motion.div
          className="text-center"
          animate={reducedMotion ? {} : { x: result.score >= 75 ? -12 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-5xl sm:text-6xl block mb-2" role="img" aria-label="Vos">
            🪞
          </span>
          <p className="font-heading text-lg sm:text-xl font-semibold text-foreground leading-tight">
            Vos
          </p>
          <p className="text-xs text-muted mt-0.5">{formatAnimalSimple(result.userAnimal)}</p>
        </motion.div>
      </div>

      {/* Score — número editorial, sin gauge ni badge */}
      <div className="flex justify-center mb-6 text-center">
        <ReadingNumber
          value={result.score}
          label={`Resonancia · ${meta.label}`}
          color={result.tier === "resonancia-alta" || result.tier === "afinidad-media" ? "var(--color-accent)" : "var(--color-muted)"}
          context={tierMeta.label}
          size="xl"
        />
      </div>

      {/* Contextual explanation */}
      <div className="text-center mb-8 px-4">
        <p className="text-sm text-foreground leading-relaxed max-w-md mx-auto">
          {explanation}
        </p>
      </div>

      {/* CTAs — primary Share + secondary Explore */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
