"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import { ANIMALS, getRelation, RELATION_SCORES, type Animal } from "@/lib/data/animalRelations";
import { getZodiacDisplay, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import type { EntityType } from "@/lib/data/symbolic-entities";
import EntityVisual from "@/components/ui/EntityVisual";
import RelationBar from "@/components/affinity/RelationBar";

interface AffinityTypeContentProps {
  type: EntityType;
  meta: { label: string; plural: string; icon: string; description: string };
  entities: LightweightEntity[];
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

type RelationGroupKey = "same" | "triad" | "opposite" | "other";

const GROUPS: { key: RelationGroupKey; label: string }[] = [
  { key: "same", label: "Mismo animal" },
  { key: "triad", label: "Triada" },
  { key: "opposite", label: "Opuesto" },
  { key: "other", label: "Otras conexiones" },
];

const RELATION_GROUP_SCORE: Partial<Record<RelationGroupKey, number>> = {
  same: RELATION_SCORES.same.score,
  triad: RELATION_SCORES.triad.score,
  opposite: RELATION_SCORES.clash.score,
  // "other" agrupa relaciones heterogéneas (armonía natural / neutral / daño)
  // — cada fila ya muestra su propia relación real (result.relationship), no
  // hay un score único que represente al grupo entero.
};

const PAGE_SIZE = 8;

/**
 * Group results by the actual relation type the system calculates — same
 * animal, triad (San He) y opuesto (Liu Chong clash) mantienen su
 * presentación destacada de siempre. Todo lo demás (armonía natural /
 * neutral / daño) cae en "other": una entidad que pasa el filtro de
 * búsqueda SIEMPRE termina en algún grupo, nunca se descarta en silencio
 * (antes, harmonious/neutral/harm no caían en ningún grupo y desaparecían
 * del render aunque el contador de resultados las siguiera contando).
 */
export function groupByRelation(userAnimal: Animal, sorted: LightAffinityResult[]): Record<RelationGroupKey, LightAffinityResult[]> {
  const groups: Record<RelationGroupKey, LightAffinityResult[]> = { same: [], triad: [], opposite: [], other: [] };
  for (const result of sorted) {
    const type = getRelation(userAnimal, result.animal as Animal).type;
    if (type === "same") groups.same.push(result);
    else if (type === "triad") groups.triad.push(result);
    else if (type === "clash") groups.opposite.push(result);
    else groups.other.push(result);
  }
  return groups;
}

export default function AffinityTypeContent({ type, meta, entities }: AffinityTypeContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const userCountry = useUserContext().country;

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const activeAnimal: Animal = selectedAnimal
    ?? ((profile?.chineseZodiac as Animal) || "Rata");

  const sorted = useMemo(
    () => sortLightEntities(activeAnimal, entities, userCountry),
    [activeAnimal, entities, userCountry]
  );

  // Filter results based on search query
  const filteredSorted = useMemo(() => {
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase().trim();
    return sorted.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.country || "").toLowerCase().includes(query) ||
      r.animal.toLowerCase().includes(query)
    );
  }, [sorted, searchQuery]);

  const groups = useMemo(() => groupByRelation(activeAnimal, filteredSorted), [activeAnimal, filteredSorted]);

  const [visibleCounts, setVisibleCounts] = useState<Record<RelationGroupKey, number>>({ same: PAGE_SIZE, triad: PAGE_SIZE, opposite: PAGE_SIZE, other: PAGE_SIZE });
  useEffect(() => {
    setVisibleCounts({ same: PAGE_SIZE, triad: PAGE_SIZE, opposite: PAGE_SIZE, other: PAGE_SIZE });
  }, [activeAnimal, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {!mounted ? (
          <motion.div key="loading" variants={transitionVariants} initial="enter" animate="show" exit="exit">
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
              <p className="sr-only" role="status" aria-label="Cargando afinidades...">
                Cargando afinidades...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10" />
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div key="content" variants={transitionVariants} initial="enter" animate="show" exit="exit">
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">

              {/* HERO */}
              <motion.div {...fadeUp} className="border-t border-ink/10 py-10 sm:py-16">
                <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                  <button type="button" onClick={() => router.push("/affinity")} className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Afinidad</button>
                  <span>›</span>
                  <span className="text-foreground font-medium">{meta.plural}</span>
                </nav>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] tracking-tight">
                  Cómo resuena cada {meta.label.toLowerCase()}
                </h1>
                <p className="text-sm text-muted mt-4 max-w-xl">
                  Elegí un animal del zodíaco chino y mirá con qué {meta.plural.toLowerCase()} aparecen sus patrones.
                </p>
              </motion.div>

              {/* Contexto editorial — qué es y qué no es la resonancia */}
              <div className="border-t border-ink/10 py-8">
                <p className="text-sm text-foreground leading-relaxed max-w-2xl">
                  Cada entidad tiene un animal asociado según su fecha de origen. La resonancia compara ese animal con el de tu mapa.
                </p>
                <p className="text-xs text-muted leading-relaxed mt-3 max-w-2xl">
                  No es una predicción ni una medida de compatibilidad personal. Es una lectura simbólica basada exclusivamente en la relación entre ambos animales del zodíaco chino.
                </p>
              </div>

              {/* SELECTOR DE ANIMAL — 12 animales, siempre visible */}
              <div className="border-t border-ink/10 py-8">
                <p className="label-micro mb-4">Animal</p>
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
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 min-h-[44px] border text-sm transition-colors ${
                          isActive
                            ? "border-accent bg-accent/10 text-foreground"
                            : "border-ink/10 text-muted hover:border-accent/40 hover:text-foreground"
                        }`}
                      >
                        <span className="text-base" aria-hidden="true">{display.emoji}</span>
                        <span className="font-medium">{display.name}</span>
                      </button>
                    );
                  })}
                </div>
                {profile?.chineseZodiac === activeAnimal && !selectedAnimal && (
                  <p className="text-xs text-muted mt-3">Tu animal — {formatAnimalSimple(activeAnimal)}.</p>
                )}
              </div>

              {/* SEARCH — Available for all types, shows before selecting entity */}
              <div className="border-t border-ink/10 py-8">
                <p className="label-micro mb-4">Buscar</p>
                <input
                  type="search"
                  placeholder={`Buscar ${meta.plural.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent rounded-lg"
                  aria-label={`Buscar ${meta.plural.toLowerCase()}`}
                />
                {searchQuery && (
                  <p className="text-xs text-muted mt-2">
                    {filteredSorted.length} resultado{filteredSorted.length !== 1 ? "s" : ""} para &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>

              {/* RESULTADOS AGRUPADOS POR RELACIÓN REAL: mismo animal, triada, opuesto,
                  y el resto (armonía natural / neutral / daño) en "Otras conexiones" —
                  ninguna entidad que pase el filtro de búsqueda queda sin grupo. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAnimal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-ink/10"
                >
                  {GROUPS.map((group) => {
                    const all = groups[group.key];
                    if (all.length === 0) return null;
                    const visible = visibleCounts[group.key];
                    const items = all.slice(0, visible);
                    const hasMore = all.length > visible;
                    return (
                      <div key={group.key} className="py-8 border-b border-ink/10 last:border-b-0">
                        <div className="mb-4">
                          {group.key === "other" ? (
                            <p className="label-micro">{group.label}</p>
                          ) : (
                            <RelationBar score={RELATION_GROUP_SCORE[group.key]!} label={group.label} />
                          )}
                        </div>
                        <div className="space-y-0">
                          {items.map((result) => (
                            <ResultRow key={result.id} result={result} onClick={() => router.push(`/affinity/${type}/${result.id}`)} />
                          ))}
                        </div>
                        {hasMore && (
                          <button
                            type="button"
                            onClick={() => setVisibleCounts((prev) => ({ ...prev, [group.key]: prev[group.key] + PAGE_SIZE }))}
                            className="mt-4 text-sm text-accent hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                          >
                            Ver más
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultRow({
  result,
  onClick,
}: {
  result: LightAffinityResult;
  onClick: () => void;
}) {
  // Presentación editorial: el label del engine se mantiene, el color pasa
  // a tonos de marca (accent/muted) — nunca semáforo verde/rojo.
  const tierColor =
    result.tier === "resonancia-alta" || result.tier === "afinidad-media"
      ? "var(--color-accent)"
      : "var(--color-muted)";

  const tierLabel = result.relationship;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left py-4 border-b border-ink/10 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-start sm:items-center gap-4">
        <EntityVisual visualType={result.visualType as VisualType} emoji={result.emoji} name={result.name} countryISO={result.countryISO} size={40} />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground group-hover:text-accent transition-colors sm:truncate">
              {result.name}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formatAnimalSimple(result.animal)}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-sm font-display font-semibold uppercase tracking-wide" style={{ color: tierColor }}>{tierLabel}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
