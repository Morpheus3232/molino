"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import type { LightweightEntity } from "@/types/atlas";
import type { EntityType } from "@/lib/data/symbolic-entities";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { sortLightEntities } from "@/lib/affinity-light";
import { useProfile } from "@/lib/hooks/useProfile";
import { Globe2, Building2, Sparkles, Trophy, GraduationCap, Mic2, Clapperboard, ArrowRight, type LucideIcon } from "lucide-react";

interface LocalizedAffinityHubProps {
  catalog: LightweightEntity[];
}

const CATEGORY_META: Record<EntityType, { label: string; plural: string; icon: LucideIcon; color: string }> = {
  country: { label: "País", plural: "Países", icon: Globe2, color: "text-cyan-400" },
  city: { label: "Ciudad", plural: "Ciudades", icon: Building2, color: "text-blue-400" },
  brand: { label: "Marca", plural: "Marcas", icon: Sparkles, color: "text-amber-400" },
  team: { label: "Equipo", plural: "Equipos", icon: Trophy, color: "text-emerald-400" },
  university: { label: "Universidad", plural: "Universidades", icon: GraduationCap, color: "text-violet-400" },
  artist: { label: "Artista", plural: "Artistas", icon: Mic2, color: "text-rose-400" },
  movie: { label: "Película", plural: "Películas", icon: Clapperboard, color: "text-orange-400" },
};

export default function LocalizedAffinityHub({ catalog }: LocalizedAffinityHubProps) {
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const { country } = useUserContext();

  // Group entities by type and sort by country preference + affinity
  const byTypeLocalized = useMemo(() => {
    if (!profile || !mounted) return {} as Record<EntityType, LightweightEntity[]>;

    const userAnimal = profile.chineseZodiac || "";
    const grouped: Record<EntityType, LightweightEntity[]> = {
      country: [],
      city: [],
      brand: [],
      team: [],
      university: [],
      artist: [],
      movie: [],
    };

    catalog.forEach((e) => {
      if (e.type in grouped) {
        grouped[e.type as EntityType].push(e);
      }
    });

    // For each category, sort by: same animal first, then country boost, then affinity score
    const result: Record<EntityType, LightweightEntity[]> = {
      country: [],
      city: [],
      brand: [],
      team: [],
      university: [],
      artist: [],
      movie: [],
    };
    Object.entries(grouped).forEach(([type, entities]) => {
      const sorted = sortLightEntities(userAnimal, entities, country);
      // Take top 3
      result[type as EntityType] = sorted.slice(0, 3);
    });

    return result;
  }, [profile, catalog, country, mounted]);

  if (!profile || !mounted) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-ink/10">
      <motion.div {...fadeUp} className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
          Exploración Localizada
        </p>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          Afinidades en tu región
        </h2>
        <p className="text-xs text-muted mt-2">
          Descubrí qué entidades de tu país comparten tu energía.
        </p>
      </motion.div>

      <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(Object.entries(byTypeLocalized) as [EntityType, LightweightEntity[]][]).map(
          ([type, entities]) => {
            if (entities.length === 0) return null;
            const meta = CATEGORY_META[type];
            const Icon = meta.icon;

            return (
              <motion.div key={type} {...staggerItem} className="p-6 rounded-lg bg-card border border-ink/10 hover:border-accent/30 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${meta.color}`} aria-hidden="true" />
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
                    {meta.plural}
                  </h3>
                </div>

                <div className="space-y-2 mb-4">
                  {entities.map((e) => (
                    <Link
                      key={e.id}
                      href={`/affinity/${e.type}/${e.id}`}
                      className="flex items-center gap-2 p-2 rounded-md bg-background/40 hover:bg-background/80 transition-colors group"
                    >
                      <span className="text-lg">{e.emoji || "🔮"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors truncate">
                          {e.name}
                        </p>
                        <p className="text-[10px] text-muted">{e.country}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/affinity/${type}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline group"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            );
          }
        )}
      </motion.div>
    </section>
  );
}
