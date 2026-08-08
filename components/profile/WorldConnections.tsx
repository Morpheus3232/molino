"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import { calculateAllAffinity } from "@/lib/engines/affinityEngine";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { useMemo } from "react";

interface WorldConnectionsProps {
  profile: UserProfile;
}

function EntityCard({ entity, score, tier, type }: { entity: any; score: number; tier: string; type: string }) {
  const tierColors: Record<string, string> = {
    resonante: "#10B981",
    afin: "#3B82F6",
    neutral: "#6B7280",
    desafiante: "#F59E0B",
    distante: "#EF4444",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border border-ink/10 rounded-lg bg-background"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden="true">{entity.emoji || "📍"}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{entity.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono" style={{ color: tierColors[tier] || "#6B7280" }}>
              {tier.toUpperCase()} · {score}%
            </span>
            <span className="text-xs text-muted">{type}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EntityRank({
  title,
  entities,
}: {
  title: string;
  entities: Array<{ entity: any; score: number; tier: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <h3 className="label-micro text-accent">{title}</h3>
      <div className="space-y-2">
        {entities.slice(0, 5).map((item, i) => (
          <EntityCard
            key={`${item.entity.id}-${i}`}
            entity={item.entity}
            score={item.score}
            tier={item.tier}
            type={item.entity.type}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function WorldConnections({ profile }: WorldConnectionsProps) {
  const { countryResonances, cityResonances, brandResonances } = useMemo(() => {
    const all = calculateAllAffinity(profile, SYMBOLIC_ENTITIES);
    const countries = all.filter((r) => r.entity.type === "country").sort((a, b) => b.score - a.score);
    const cities = all.filter((r) => r.entity.type === "city").sort((a, b) => b.score - a.score);
    const brands = all.filter((r) => r.entity.type === "brand").sort((a, b) => b.score - a.score);
    return { countryResonances: countries, cityResonances: cities, brandResonances: brands };
  }, [profile]);

  const totalConnections = countryResonances.length + cityResonances.length + brandResonances.length;

  return (
    <section className="py-10 sm:py-12 border-t border-ink/10" aria-labelledby="world-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" } as const}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            02 · Tu mundo
          </p>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 id="world-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05]">
              Tu Mundo
            </h2>
            <Link
              href="/affinity"
              className="text-sm font-mono text-accent hover:underline shrink-0"
            >
              Ver todas las {totalConnections} conexiones →
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <EntityRank
            title="PAÍSES RESONANTES"
            entities={countryResonances}
          />
          <EntityRank
            title="CIUDADES CONECTADAS"
            entities={cityResonances}
          />
          <EntityRank
            title="MARCAS AFINES"
            entities={brandResonances}
          />
        </div>
      </div>
    </section>
  );
}