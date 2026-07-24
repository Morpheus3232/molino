"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import {
  buildPersonalRecommendations,
  type PersonalRecommendation,
} from "@/lib/engines/personalRecommendationEngine";
import { ENTITY_TYPES, type EntityType } from "@/lib/data/symbolic-entities";
import { formatAnimalEmoji, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface EcosystemSectionProps {
  profile: UserProfile;
}

const TOP_CATEGORIES: { type: EntityType; emoji: string; label: string }[] = [
  { type: "brand", emoji: "🏷", label: "Marcas" },
  { type: "country", emoji: "🌎", label: "Destinos" },
  { type: "city", emoji: "🏙", label: "Ciudades" },
];

export default function EcosystemSection({ profile }: EcosystemSectionProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;

  const map = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const topRecs = useMemo(() => map.recommendations.slice(0, 6), [map]);

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Lo que vibra contigo</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Tu <span className="font-medium text-foreground">{formatAnimalSimple(userAnimal)}</span> se conecta con estas entidades según la tradición.
          </p>
        </motion.div>

        {/* Top matches */}
        <motion.div {...staggerApple} className="mt-8 space-y-4">
          {topRecs.map((rec, i) => (
            <motion.button
              key={rec.entity.id}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.08), duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
              className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-accent/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{rec.entity.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {rec.entity.name}
                    </h3>
                    <span className="text-[10px] text-muted shrink-0">{ENTITY_TYPES[rec.entity.type]?.label}</span>
                  </div>
                  <p className="text-xs text-muted mb-1">{formatAnimalSimple(rec.entityAnimal)}</p>
                  <p className="text-xs text-muted/70 leading-relaxed line-clamp-2">{rec.explanation}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-xl font-bold text-foreground">{rec.totalScore}</p>
                  <p className="text-[10px] text-muted">/100</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Category links */}
        <motion.div {...smoothReveal} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TOP_CATEGORIES.map((cat) => {
            const count = map.byCategory[cat.type]?.length ?? 0;
            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => router.push(`/affinity/recommendations/${cat.type === "country" ? "countries" : cat.type === "brand" ? "brands" : cat.type}`)}
                className="text-left p-4 rounded-xl border border-border bg-background/50 hover:border-accent/50 transition-colors group"
              >
                <span className="text-xl block mb-2">{cat.emoji}</span>
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{cat.label}</p>
                <p className="text-xs text-muted mt-1">{count} entidades</p>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
