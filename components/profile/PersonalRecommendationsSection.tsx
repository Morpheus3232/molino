"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  buildPersonalRecommendations,
  type PersonalRecommendation,
  type PriorityLevel,
} from "@/lib/engines/personalRecommendationEngine";
import { ENTITY_TYPES, type EntityType } from "@/lib/data/symbolic-entities";
import { formatAnimalEmoji, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import {
  smoothReveal,
  heroReveal,
  cardReveal,
  staggerApple,
  staggerItemSmooth,
  staggerDelay,
} from "@/lib/utils/premiumMotion";
import RecommendationCard from "./RecommendationCard";
import PriorityBadge from "./PriorityBadge";

interface PersonalRecommendationsSectionProps {
  profile: UserProfile;
}

const CATEGORY_FILTERS: { key: EntityType | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "Todas", emoji: "✦" },
  { key: "brand", label: "Marcas", emoji: "🏷" },
  { key: "country", label: "Destinos", emoji: "🌎" },
  { key: "city", label: "Ciudades", emoji: "🏙" },
  { key: "university", label: "Universidades", emoji: "🏛" },
  { key: "team", label: "Equipos", emoji: "⚽" },
  { key: "movie", label: "Películas", emoji: "🎬" },
  { key: "artist", label: "Artistas", emoji: "🎵" },
];

export default function PersonalRecommendationsSection({ profile }: PersonalRecommendationsSectionProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<EntityType | "all">("all");

  const map = useMemo(() => buildPersonalRecommendations(profile), [profile]);

  const userAnimal = (profile.chineseZodiac ?? "") as string;

  const filtered = useMemo(() => {
    if (filter === "all") return map.recommendations;
    return map.byCategory[filter] ?? [];
  }, [map, filter]);

  // Top 3 recommendations
  const top3 = useMemo(() => map.recommendations.slice(0, 3), [map]);

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Recomendaciones para mí</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Basado en tu signo{" "}
            <span className="font-medium text-foreground">{formatAnimalSimple(userAnimal)}</span>{" "}
            y el ciclo actual.
          </p>
        </motion.div>

        {/* Top 3 highlight */}
        {top3.length > 0 && (
          <motion.div {...heroReveal} className="mt-8">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">Top 3</span>
                <span className="text-[10px] text-muted">·Mayor resonancia con tu perfil</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {top3.map((rec, i) => (
                  <motion.button
                    key={rec.entity.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
                    className="text-center p-4 rounded-xl border border-border bg-background/50 hover:border-accent/50 transition-all group"
                  >
                    <span className="text-3xl block mb-2">{rec.entity.emoji}</span>
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {rec.entity.name}
                    </p>
                    <p className="text-xs text-muted mt-1">{formatAnimalSimple(rec.entityAnimal)}</p>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <span className="font-serif text-lg font-bold text-foreground">{rec.totalScore}</span>
                      <span className="text-[9px] text-muted">/100</span>
                    </div>
                    <PriorityBadge priority={rec.priority} showLabel={false} />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats bar */}
        <motion.div {...cardReveal} className="mt-6 flex flex-wrap gap-3">
          <StatChip label="Máxima afinidad" count={map.stats.maxAffinity} color="#2D5A3D" />
          <StatChip label="Favorable" count={map.stats.highAffinity} color="#4A6FA5" />
          <StatChip label="Neutral" count={map.stats.neutral} color="#D4A843" />
          <StatChip label="Contraste" count={map.stats.contrast} color="#B45309" />
        </motion.div>

        {/* Category filters */}
        <motion.div {...smoothReveal} className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilter(cat.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat.key
                  ? "bg-foreground text-background"
                  : "bg-muted/10 text-muted hover:bg-muted/20"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Priority groups */}
        <div className="mt-8 space-y-8">
          {([5, 4, 3, 2] as PriorityLevel[]).map((priority) => {
            const items = filtered.filter(r => r.priority === priority);
            if (items.length === 0) return null;

            const meta = PRIORITY_META[priority];
            return (
              <motion.div key={priority} {...smoothReveal}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm" style={{ color: PRIORITY_COLORS[priority] }}>{meta.stars}</span>
                  <h3 className="text-sm font-medium text-foreground">{meta.label}</h3>
                  <span className="text-xs text-muted">({items.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.slice(0, 6).map((rec, i) => (
                    <RecommendationCard key={rec.entity.id} rec={rec} index={i} />
                  ))}
                </div>
                {items.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-3 text-xs text-muted hover:text-accent transition-colors"
                  >
                    Ver todas las {items.length} →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Explore more */}
        <motion.div {...smoothReveal} className="mt-10">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explora también</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ExploreLink
                emoji="🏷"
                title="Marcas de tu energía"
                onClick={() => router.push("/affinity/recommendations/brands")}
              />
              <ExploreLink
                emoji="🌎"
                title="Destinos compatibles"
                onClick={() => router.push("/affinity/recommendations/countries")}
              />
              <ExploreLink
                emoji="🏛"
                title="Mapa completo"
                onClick={() => router.push("/affinity")}
              />
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-8">
          <p className="text-[10px] text-muted/50 text-center leading-relaxed">
            Recomendaciones basadas en tradiciones del zodíaco chino. No constituyen predicción científica ni determinan resultados reales.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════

const PRIORITY_META: Record<PriorityLevel, { label: string; stars: string }> = {
  5: { label: "Máxima afinidad",       stars: "★★★★★" },
  4: { label: "Afinidad favorable",     stars: "★★★★☆" },
  3: { label: "Neutral",                stars: "★★★☆☆" },
  2: { label: "Mayor contraste",        stars: "★★☆☆☆" },
  1: { label: "Energía desafiante",     stars: "★☆☆☆☆" },
};

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  5: "#2D5A3D",
  4: "#4A6FA5",
  3: "#D4A843",
  2: "#B45309",
  1: "#9CA3AF",
};

function StatChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-medium text-foreground">{count}</span>
    </div>
  );
}

function ExploreLink({ emoji, title, onClick }: { emoji: string; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-4 rounded-xl border border-border bg-background/50 hover:border-accent/50 transition-colors group"
    >
      <span className="text-xl block mb-2">{emoji}</span>
      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{title}</p>
    </button>
  );
}
