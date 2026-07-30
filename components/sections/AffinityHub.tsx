"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useProfile } from "@/lib/hooks/useProfile";
import { useState, useMemo } from "react";
import { fadeUp } from "@/lib/utils/motion";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateAffinity, type AffinityTier } from "@/lib/engines/affinityEngine";
import type { UserProfile } from "@/types/user";

const TIER_LABELS: Record<string, string> = {
  all: "Todas",
  "resonancia-alta": "Alta",
  "afinidad-media": "Media",
  complementarios: "Complementarias",
  desafiante: "Desafiantes",
};

const TIER_STYLES: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
  all: { bg: "bg-card", border: "border-border", accent: "text-accent", icon: "✦" },
  "resonancia-alta": { bg: "bg-[#E8F0FE]", border: "border-blue-200", accent: "text-blue-700", icon: "★" },
  "afinidad-media": { bg: "bg-[#E8F5E9]", border: "border-green-200", accent: "text-green-700", icon: "●" },
  complementarios: { bg: "bg-[#E3F2FD]", border: "border-indigo-200", accent: "text-indigo-700", icon: "◆" },
  desafiante: { bg: "bg-[#FCE4EC]", border: "border-pink-200", accent: "text-pink-700", icon: "▲" },
};

const ENTITY_CATEGORIES = [
  { label: "Países", type: "country" as const, href: "/affinity/country", desc: "Descubrí con qué países resuena tu energía" },
  { label: "Ciudades", type: "city" as const, href: "/affinity/city", desc: "Destinos alineados con tu perfil" },
  { label: "Marcas", type: "brand" as const, href: "/affinity/brand", desc: "Marcas que vibran en tu misma frecuencia" },
  { label: "Universidades", type: "university" as const, href: "/affinity/university", desc: "Instituciones que potencian tu crecimiento" },
];

function getBestTierForCategory(profile: UserProfile, type: string): { tier: AffinityTier; score: number } {
  const entities = SYMBOLIC_ENTITIES.filter((e) => e.type === type);
  if (entities.length === 0 || !profile) {
    return { tier: "complementarios" as AffinityTier, score: 50 };
  }
  const results = entities
    .map((e) => calculateAffinity(profile, e))
    .sort((a, b) => b.score - a.score);
  return { tier: results[0]?.tier || "complementarios", score: results[0]?.score || 50 };
}

export default function AffinityHub() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { profile } = useProfile();
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(() => {
    if (!profile) {
      return ENTITY_CATEGORIES.map((c) => ({ ...c, tier: "complementarios" as AffinityTier, score: 50 }));
    }
    return ENTITY_CATEGORIES.map((c) => {
      const { tier, score } = getBestTierForCategory(profile, c.type);
      return { ...c, tier, score };
    });
  }, [profile]);

  const filteredCategories = useMemo(
    () => (filter === "all" ? categories : categories.filter((c) => c.tier === filter)),
    [categories, filter]
  );

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-10 sm:mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium mb-6">Conexiones</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            ¿Con qué resonás?
          </h2>
        </motion.div>

        {!profile && (
          <motion.p {...fadeUp} className="text-sm text-muted mb-6">
            Creá tu perfil para descubrir tus conexiones personales.
          </motion.p>
        )}

        <div className="flex gap-2 flex-wrap mb-8">
          {Object.keys(TIER_LABELS).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilter(tier)}
              className={`px-4 py-1.5 rounded-none text-xs font-medium transition-all duration-300 ${
                filter === tier
                  ? "bg-accent text-white"
                  : "bg-white/70 text-muted hover:bg-white/90 border border-border"
              }`}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {filteredCategories.map((cat, i) => (
            <motion.button
              key={cat.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              type="button"
              onClick={() => router.push(cat.href)}
              className="group text-left py-6 border-b border-neutral-200/60 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {cat.label}
                </span>
                <span className={`text-[10px] font-mono ${TIER_STYLES[cat.tier]?.accent || "text-muted"}`}>
                  {TIER_LABELS[cat.tier] || cat.tier}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{cat.desc}</p>
              {profile && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted">{cat.score}%</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
