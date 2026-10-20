"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { relacionCon, type MapRelation } from "@/lib/engines/personalMapEngine";
import { TIER_META } from "@/lib/engines/affinityEngine";
import { getZodiacDisplay, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";

interface AffinityTypeContentProps {
  meta: { label: string; plural: string; icon: string; description: string };
  entities: LightweightEntity[];
  initialAnimal?: string;
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

type RelationGroupKey = MapRelation;

// Orden de lectura de CLAUDE.md: tu propio signo → tus dos amigos → tu
// enemigo (lo que conviene evitar) → el resto del ciclo.
const GROUPS: { key: RelationGroupKey; label: string; chinese: string; note?: string }[] = [
  { key: "mismo", label: "Tu propio signo", chinese: "本命" },
  { key: "amigo", label: "Tus dos amigos", chinese: "三合 San He" },
  { key: "enemigo", label: "Tu enemigo", chinese: "六冲 Liu Chong", note: "Lo que conviene evitar." },
  { key: "otro", label: "El resto del ciclo", chinese: "" },
];

const PAGE_SIZE = 8;

/**
 * Agrupa por las cuatro casillas del ciclo (relacionCon, la misma regla que
 * Mi Mapa). Liu He y Liu Hai caen en "otro". Una entidad que pasa el filtro
 * de búsqueda SIEMPRE termina en algún grupo, nunca se descarta en silencio.
 */
export function groupByRelation(userAnimal: Animal, sorted: LightAffinityResult[]): Record<RelationGroupKey, LightAffinityResult[]> {
  const groups: Record<RelationGroupKey, LightAffinityResult[]> = { mismo: [], amigo: [], enemigo: [], otro: [] };
  for (const result of sorted) groups[relacionCon(userAnimal, result.animal)].push(result);
  return groups;
}

export default function AffinityTypeContent({ meta, entities, initialAnimal }: AffinityTypeContentProps) {
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const userCountry = useUserContext().country;

  const validInitial = (initialAnimal && ANIMALS.includes(initialAnimal as Animal))
    ? (initialAnimal as Animal)
    : null;

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(validInitial);
  const [searchQuery, setSearchQuery] = useState("");
  const activeAnimal: Animal = selectedAnimal
    ?? ((profile?.chineseZodiac as Animal) || "Rata");

  useEffect(() => {
    if (validInitial) {
      setSelectedAnimal(validInitial);
    }
  }, [validInitial]);

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

  const [visibleCounts, setVisibleCounts] = useState<Record<RelationGroupKey, number>>({ mismo: PAGE_SIZE, amigo: PAGE_SIZE, enemigo: PAGE_SIZE, otro: PAGE_SIZE });
  useEffect(() => {
    setVisibleCounts({ mismo: PAGE_SIZE, amigo: PAGE_SIZE, enemigo: PAGE_SIZE, otro: PAGE_SIZE });
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
              <motion.div {...fadeUp} className="border-t border-ink/10 py-6 sm:py-8">
                <nav className="flex items-center gap-2 text-xs text-muted mb-4" aria-label="Breadcrumb">
                  <Link href="/affinity" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Afinidad</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">{meta.plural}</span>
                </nav>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[0.95] tracking-tight">
                  Cómo resuena cada {meta.label.toLowerCase()}
                </h1>
                <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">
                  Cada entidad tiene un signo según su fecha de origen. Se compara signo contra signo con el tuyo: tu propio signo, tus dos amigos, tu enemigo o el resto del ciclo. Una lectura simbólica, no una predicción.
                </p>
              </motion.div>

              {/* SELECTOR DE ANIMAL — 12 animales, siempre visible */}
              <div className="border-t border-ink/10 py-8">
                <p className="label-micro mb-4">Signo</p>
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
                  <p className="text-xs text-muted mt-3">Tu signo — {formatAnimalSimple(activeAnimal)}.</p>
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

              {/* RESULTADOS AGRUPADOS POR CASILLA: tu signo, tus dos amigos, tu
                  enemigo y el resto del ciclo — ninguna entidad que pase el
                  filtro de búsqueda queda sin grupo. */}
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
                          <h2 className="font-heading text-lg font-semibold text-foreground">
                            {group.label}
                            {group.chinese && <span className="text-sm font-normal text-muted"> · {group.chinese}</span>}
                            <span className="text-sm font-normal text-muted"> · {all.length}</span>
                          </h2>
                          {group.note && <p className="text-sm text-muted mt-1">{group.note}</p>}
                        </div>
                        <div className="space-y-0">
                          {items.map((result) => (
                            <ResultRow key={result.id} result={result} href={`/affinity/${result.type}/${result.id}`} />
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
  href,
}: {
  result: LightAffinityResult;
  href: string;
}) {
  // Tonos de marca (accent/muted) — nunca semáforo verde/rojo.
  const { color: tierColor, label: tierLabel } = TIER_META[result.tier];

  return (
    <Link
      href={href}
      className="block w-full text-left py-4 border-b border-ink/10 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-start sm:items-center gap-4">
        <EntityVisual
          visualType={result.visualType as VisualType}
          emoji={result.emoji}
          imageUrl={result.imageUrl}
          name={result.name}
          type={result.type}
          category={result.category}
          countryISO={result.countryISO}
          size={40}
        />
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
            <p className="text-sm font-display font-semibold label-caps" style={{ color: tierColor }}>{tierLabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
