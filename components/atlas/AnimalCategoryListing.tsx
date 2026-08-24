"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import type { LightweightEntity } from "@/types/atlas";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";

const CATEGORY_LABELS: Record<string, string> = {
  country: "Países",
  city: "Ciudades",
  brand: "Marcas",
  team: "Equipos",
  university: "Universidades",
  artist: "Famosos",
  movie: "Películas",
};

interface AnimalCategoryListingProps {
  animal: string;
  category: string;
  entities: LightweightEntity[];
}

export default function AnimalCategoryListing({ animal, category, entities }: AnimalCategoryListingProps) {
  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);
  const catLabel = CATEGORY_LABELS[category] ?? category;

  const profile = useMemo(() => {
    try { return getAnimalProfile(animal as Animal); } catch { return null; }
  }, [animal]);
  const animalEmoji = profile?.emoji ?? "";

  const sorted = useMemo(() => {
    const copy = [...entities];
    if (userCountryISO) {
      copy.sort((a, b) => {
        const aMatch = a.countryISO === userCountryISO ? 1 : 0;
        const bMatch = b.countryISO === userCountryISO ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return copy;
  }, [entities, userCountryISO]);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[
            { href: "/atlas", label: "Atlas" },
            { href: `/atlas/explorar/${animal}`, label: animal },
            { label: catLabel },
          ]}
        />

        <motion.header className="mb-12" {...fadeUp}>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            {animal}
          </p>

          <div className="flex items-end gap-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
              {catLabel}
            </h1>
            {animalEmoji && (
              <span className="text-2xl leading-none opacity-25 shrink-0" aria-hidden="true">
                {animalEmoji}
              </span>
            )}
          </div>

          <p className="text-sm text-muted mt-3">
            {entities.length} {entities.length === 1 ? "entidad" : "entidades"} con animal {animal} — priorizando tu país.
          </p>
        </motion.header>

        <section aria-label={`${catLabel} de ${animal}`} className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/15 hidden sm:block" aria-hidden="true" />

          <div className="sm:pl-10 space-y-2">
            {sorted.map((e, i) => (
              <motion.div
                key={e.id}
                {...fadeUpDelayed(i * 0.03)}
              >
                <Link
                  href={`/affinity/${e.type}/${e.id}`}
                  className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-ink/[0.03] transition-colors group"
                >
                  <span className="text-lg leading-none shrink-0 select-none" role="img" aria-label={e.name}>
                    {e.emoji || "🔮"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {e.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted truncate max-w-[120px] text-right">
                    {e.country || ""}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {sorted.length === 0 && (
          <motion.div {...fadeUpDelayed(0.1)} className="text-center py-16">
            <p className="text-sm text-muted">
              No hay {catLabel.toLowerCase()} registradas para {animal} en este momento.
            </p>
          </motion.div>
        )}

        <div className="mt-16 pt-12 border-t border-ink/10">
          <Link
            href={`/atlas/explorar/${animal}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">←</span>
            <span>Volver a {animal}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
