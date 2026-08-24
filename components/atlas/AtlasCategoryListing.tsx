"use client";

import { useMemo, useState } from "react";
import type { LightweightEntity } from "@/types/atlas";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { bucketEntitiesByResonance, resonanceReasoning, type ResonanceBucket } from "@/lib/resonance";
import { useProfile } from "@/lib/hooks/useProfile";
import EntityCard from "@/components/atlas/EntityCard";

interface AtlasCategoryListingProps {
  entities: LightweightEntity[];
  countryISO: string;
  category: string;
}

const SECTION_META: Record<ResonanceBucket, { title: string; hint: string; accent: string }> = {
  affine: {
    title: "Alta y Buena Compatibilidad",
    hint: "Mismo animal, animales aliados o par armonioso",
    accent: "border-l-emerald-500/50",
  },
  tension: {
    title: "Energía Opuesta y Tensiones",
    hint: "Posición opuesta en el ciclo o relación de atención",
    accent: "border-l-amber-500/50",
  },
  neutral: {
    title: "Neutras",
    hint: "Sin relación especial según la tradición",
    accent: "border-l-ink/20",
  },
};

/**
 * Atlas category listing — a dynamic compatibility map, not a flat directory.
 * Shows an animal selector (defaulting to the user's session animal) and
 * classifies every entity into Afinidades / Tensiones / Neutras, all computed
 * client-side over the lightweight data using the pure Zodiac engine.
 */
export default function AtlasCategoryListing({ entities, countryISO, category }: AtlasCategoryListingProps) {
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  // Default to the session animal once mounted; fall back to Rata.
  const activeAnimal: Animal =
    selectedAnimal ?? (mounted && profile?.chineseZodiac ? (profile.chineseZodiac as Animal) : "Rata");

  const buckets = useMemo(
    () => bucketEntitiesByResonance(activeAnimal, entities),
    [activeAnimal, entities]
  );

  const sectionOrder: ResonanceBucket[] = ["affine", "tension", "neutral"];

  return (
    <div>
      {/* Animal selector */}
      <div className="mb-8">
        <p className="label-micro mb-3">Tu animal de referencia</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          {ANIMALS.map((animal) => {
            const display = getZodiacDisplay(animal);
            const isActive = animal === activeAnimal;
            return (
              <button
                key={animal}
                type="button"
                onClick={() => setSelectedAnimal(animal)}
                aria-pressed={isActive}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] border text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-ink/10 text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{display.emoji}</span>
                <span className="font-medium">{display.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted mt-3">
          {mounted && profile?.chineseZodiac === activeAnimal
            ? "Este es tu animal según tu mapa."
            : "Seleccioná un animal para ver qué resuena y qué tensa en esta categoría."}
        </p>
      </div>

      {/* Buckets */}
      {sectionOrder.map((bucket) => {
        const items = buckets[bucket];
        const meta = SECTION_META[bucket];
        if (items.length === 0) return null;
        return (
          <section key={bucket} className="mb-10">
            <div className={`border-l-2 pl-4 mb-4 ${meta.accent}`}>
              <h2 className="font-heading text-lg font-semibold text-foreground">{meta.title}</h2>
              <p className="text-xs text-muted mt-0.5">{meta.hint}</p>
              <p className="text-xs text-muted mt-1 font-mono">
                {items.length} {items.length === 1 ? "entidad" : "entidades"}
              </p>
            </div>
            <div className="space-y-3">
              {items.map(({ ...entity }) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  countryISO={countryISO}
                  category={category}
                  resonance={entity.resonance}
                  reasoning={resonanceReasoning(activeAnimal, entity.animal, entity.name)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
