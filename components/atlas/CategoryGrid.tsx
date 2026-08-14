"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Building2, Trophy, GraduationCap, Mic2, Clapperboard, type LucideIcon } from "lucide-react";
import type { AtlasCategory } from "@/lib/data/atlas-queries";
import type { EntityType } from "@/lib/data/symbolic-entities";

const CATEGORY_ICONS: Record<EntityType, LucideIcon> = {
  brand: Sparkles,
  city: Building2,
  team: Trophy,
  university: GraduationCap,
  artist: Mic2,
  movie: Clapperboard,
  country: Building2,
};

interface CategoryGridProps {
  countryISO: string;
  categories: AtlasCategory[];
}

export default function CategoryGrid({ countryISO, categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, i) => {
        const Icon = CATEGORY_ICONS[category.type] ?? Sparkles;
        return (
          <motion.div
            key={category.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4), ease: "easeOut" }}
          >
            <Link
              href={`/atlas/${countryISO}/${category.type}`}
              className="group flex flex-col gap-3 p-6 rounded-2xl border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-colors min-h-[140px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {category.plural}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted mt-1">
                  {category.count} {category.count === 1 ? "entidad" : "entidades"}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
