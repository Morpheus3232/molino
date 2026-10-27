"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import { useMemo } from "react";
import EntityVisual from "@/components/ui/EntityVisual";
import { useRevealFallback } from "@/lib/hooks/useRevealFallback";

import { TIER_META, type AffinityTier } from "@/lib/engines/affinityEngine";
const TYPE_LABEL = (L: Pick2): Record<string, string> => ({
  brand: L("Marca", "Brand"),
  city: "Ciudad",
  country: "País",
  university: L("Universidad", "University"),
  team: L("Equipo", "Team"),
  movie: L("Película", "Movie"),
  artist: L("Famoso", "Famous person"),
});

interface WorldConnectionsProps {
  profile: UserProfile;
  catalog: LightweightEntity[];
}

function EntityCard({ entity, tier }: { entity: LightAffinityResult; tier: AffinityTier }) {
  const L = useL();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border border-ink/10 rounded-lg bg-background"
    >
      <div className="flex items-start gap-3">
        <EntityVisual
          visualType={entity.visualType as "emoji" | "logo" | "portrait" | "flag" | "album"}
          emoji={entity.emoji}
          imageUrl={entity.imageUrl}
          name={entity.name}
          type={entity.type}
          category={entity.category}
          countryISO={entity.countryISO}
          size={24}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{entity.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: TIER_META[tier].color }}>
              {TIER_META[tier].label}
            </span>
            <span className="text-xs text-muted">{TYPE_LABEL(L)[entity.type] || entity.type}</span>
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
  entities: LightAffinityResult[];
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
            key={`${item.id}-${i}`}
            entity={item}
            tier={item.tier}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function WorldConnections({ profile, catalog }: WorldConnectionsProps) {
  const L = useL();
  const { countryResonances, cityResonances, brandResonances } = useMemo(() => {
    const all = sortLightEntities(profile.chineseZodiac || "", catalog);
    const countries = all.filter((r) => r.type === "country").sort((a, b) => b.score - a.score);
    const cities = all.filter((r) => r.type === "city").sort((a, b) => b.score - a.score);
    const brands = all.filter((r) => r.type === "brand").sort((a, b) => b.score - a.score);
    return { countryResonances: countries, cityResonances: cities, brandResonances: brands };
  }, [profile, catalog]);

  const totalConnections = countryResonances.length + cityResonances.length + brandResonances.length;
  // Failsafe anti-blanco: si whileInView no dispara Y la sección ya está
  // cerca del viewport, animate fuerza visible tras 1.5s — ver
  // useRevealFallback. Below-the-fold sigue dependiendo de whileInView.
  const { ref, forceVisible } = useRevealFallback<HTMLDivElement>();

  return (
    <section className="py-10 sm:py-12 border-t border-ink/10" aria-labelledby="world-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          {...(forceVisible
            ? { animate: { opacity: 1, y: 0 } }
            : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" } as const })}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <p className="text-sm text-muted mb-4 label-caps">{L("02 · Tu mundo", "02 · Your world")}</p>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 id="world-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05]">{L("Tu Mundo", "Your World")}</h2>
            <Link
              href="/affinity"
              className="text-sm font-mono text-accent hover:underline shrink-0"
            >{L(<>
              Ver todas las {totalConnections} conexiones →
            </>, <>See all {totalConnections} connections →</>)}</Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <EntityRank
            title={L("PAÍSES RESONANTES", "RESONANT COUNTRIES")}
            entities={countryResonances}
          />
          <EntityRank
            title={L("CIUDADES CONECTADAS", "CONNECTED CITIES")}
            entities={cityResonances}
          />
          <EntityRank
            title={L("MARCAS AFINES", "KINDRED BRANDS")}
            entities={brandResonances}
          />
        </div>
      </div>
    </section>
  );
}