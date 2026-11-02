"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo, useState } from "react";
import type { LightweightEntity } from "@/types/atlas";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { bucketEntitiesByResonance, resonanceReasoning, ATLAS_BUCKETS } from "@/lib/resonance";
import { useProfile } from "@/lib/hooks/useProfile";
import EntityCard from "@/components/atlas/EntityCard";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface AtlasCategoryListingProps {
  entities: LightweightEntity[];
  countryISO: string;
  category: string;
}

// Las tres casillas del sitio, en orden: tu propio signo, tus dos amigos y tu
// enemigo (lo que conviene evitar). El resto del ciclo no se recomienda.
const SECTION_META = (L: Pick2): Record<"mismo" | "amigo" | "enemigo", { title: string; hint: string; accent: string }> => ({
  mismo: {
    title: L("Tu propio signo", "Your own sign"),
    hint: L("Nacieron o se fundaron en tu mismo signo.", "Born or founded in your same sign."),
    accent: "border-l-vermilion",
  },
  amigo: {
    title: L("Tus dos amigos · 三合 San He", "Your two friends · 三合 San He"),
    hint: L("Los dos signos que completan tu tríada.", "The two signs that complete your triad."),
    accent: "border-l-ink",
  },
  enemigo: {
    title: L("Tu enemigo · 六冲 Liu Chong", "Your enemy · 六冲 Liu Chong"),
    hint: L("El signo de enfrente en el ciclo: lo que conviene evitar.", "The sign across the cycle: what's best avoided."),
    accent: "border-l-ink/30",
  },
});

/**
 * Atlas category listing — a dynamic compatibility map, not a flat directory.
 * Shows an animal selector (defaulting to the user's session animal) and
 * classifies every entity into Afinidades / Tensiones / Neutras, all computed
 * client-side over the lightweight data using the pure Zodiac engine.
 */
export default function AtlasCategoryListing({ entities, countryISO, category }: AtlasCategoryListingProps) {
  const L = useL();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  // Default to the session animal once mounted; fall back to Rata.
  const activeAnimal: Animal =
    selectedAnimal ?? (mounted && profile?.chineseZodiac ? (profile.chineseZodiac as Animal) : "Rata");

  // Fecha exacta o no se muestra: un origen fechado solo por año puede caer
  // en el signo anterior.
  const exact = useMemo(() => entities.filter((e) => !e.isApproximate), [entities]);
  const buckets = useMemo(
    () => bucketEntitiesByResonance(activeAnimal, exact),
    [activeAnimal, exact]
  );

  const sectionOrder = ATLAS_BUCKETS as readonly ("mismo" | "amigo" | "enemigo")[];
  const shown = sectionOrder.reduce((n, k) => n + buckets[k].length, 0);

  return (
    <div>
      {/* Animal selector */}
      <div className="mb-8">
        <p className="label-micro mb-3">{L("Tu animal de referencia", "Your reference animal")}</p>
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
                <ZodiacAnimalIcon
                  animal={animal}
                  size={18}
                  className={`shrink-0 ${isActive ? "text-accent" : "text-muted"}`}
                />
                <span className="font-medium">{L.t(display.name)}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted mt-3">
          {L.t(mounted && profile?.chineseZodiac === activeAnimal
            ? L("Este es tu animal según tu mapa.", "This is your animal according to your map.")
            : L("Elegí un signo: se muestran solo el propio, sus dos amigos y su enemigo.", "Pick a sign: only its own, its two friends and its enemy are shown."))}
        </p>
      </div>

      {/* Buckets */}
      {sectionOrder.map((bucket) => {
        const items = buckets[bucket];
        const meta = SECTION_META(L)[bucket];
        if (items.length === 0) return null;
        return (
          <section key={bucket} className="mb-10">
            <div className={`border-l-2 pl-4 mb-4 ${meta.accent}`}>
              <h2 className="font-heading text-lg font-semibold text-foreground">{L.t(meta.title)}</h2>
              <p className="text-xs text-muted mt-0.5">{L.t(meta.hint)}</p>
              <p className="text-xs text-muted mt-1 font-mono">
                {L(`${items.length} ${items.length === 1 ? "entidad" : "entidades"}`, `${items.length} ${items.length === 1 ? "entity" : "entities"}`)}
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
      {shown === 0 && (
        <p className="text-base text-muted">
          {L(
            `Para ${activeAnimal} no hay nada de su signo, de sus amigos ni de su enemigo en esta categoría.`,
            `For ${L.t(activeAnimal)} there's nothing of its sign, its friends or its enemy in this category.`,
          )}
        </p>
      )}
    </div>
  );
}
