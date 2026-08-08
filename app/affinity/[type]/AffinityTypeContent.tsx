"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  calculateAllAffinityForAnimal,
  getRepresentativeAffinitySet,
  TIER_META,
  type AffinityResult,
} from "@/lib/engines/affinityEngine";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import type { EntityType } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getZodiacDisplay, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { useUserContext } from "@/lib/hooks/useUserContext";

interface AffinityTypeContentProps {
  type: EntityType;
  meta: { label: string; plural: string; icon: string; description: string };
  entities: SymbolicEntity[];
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

const GROUPS: { key: "positive" | "mixed" | "negative"; label: string; symbol: string }[] = [
  { key: "positive", label: "Resonantes", symbol: "●" },
  { key: "mixed", label: "Complementarias", symbol: "◐" },
  { key: "negative", label: "Contraste", symbol: "○" },
];

export default function AffinityTypeContent({ type, meta, entities }: AffinityTypeContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const userCountry = useUserContext().country;

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const activeAnimal: Animal = selectedAnimal
    ?? ((profile?.chineseZodiac as Animal) || "Rata");

  const sorted = useMemo(
    () => {
      const results = calculateAllAffinityForAnimal(activeAnimal, entities);
      if (!userCountry) return results;
      // El score queda intacto (afinidad zodiacal pura). El país del usuario
      // solo adelanta entidades de su país como tiebreaker de presentación.
      return [...results].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aMatch = a.entity.country === userCountry ? 1 : 0;
        const bMatch = b.entity.country === userCountry ? 1 : 0;
        return bMatch - aMatch;
      });
    },
    [activeAnimal, entities, userCountry]
  );
  
  // Filter results based on search query
  const filteredSorted = useMemo(() => {
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase().trim();
    return sorted.filter(r => 
      r.entity.name.toLowerCase().includes(query) ||
      r.entity.country.toLowerCase().includes(query) ||
      r.entityAnimal.toLowerCase().includes(query)
    );
  }, [sorted, searchQuery]);
  
  const set = useMemo(() => getRepresentativeAffinitySet(filteredSorted), [filteredSorted]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
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
            <UniversityFooter />
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

              {/* 8 RESULTADOS REPRESENTATIVOS */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAnimal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-ink/10"
                >
                  {GROUPS.map((group) => {
                    const items = set[group.key];
                    if (items.length === 0) return null;
                    return (
                      <div key={group.key} className="py-8 border-b border-ink/10 last:border-b-0">
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-accent text-xs" aria-hidden="true">{group.symbol}</span>
                          <p className="label-micro">{group.label}</p>
                        </div>
                        <div className="space-y-0">
                          {items.map((result) => (
                            <ResultRow key={result.entity.id} result={result} type={type} onClick={() => router.push(`/affinity/${type}/${result.entity.id}`)} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </main>
            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultRow({
  result,
  type,
  onClick,
}: {
  result: AffinityResult;
  type: EntityType;
  onClick: () => void;
}) {
  const tierMeta = TIER_META[result.tier];
  // Presentación editorial: el label del engine se mantiene, el color pasa
  // a tonos de marca (accent/muted) — nunca semáforo verde/rojo.
  const tierColor =
    result.tier === "resonancia-alta" || result.tier === "afinidad-media"
      ? "var(--color-accent)"
      : "var(--color-muted)";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left py-4 border-b border-ink/10 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl shrink-0" aria-hidden="true">{result.entity.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-foreground group-hover:text-accent transition-colors truncate">
            {result.entity.name}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {formatAnimalSimple(result.entityAnimal)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-display font-semibold uppercase tracking-wide" style={{ color: tierColor }}>{tierMeta.label}</p>
        </div>
      </div>
      {result.explanation && (
        <p className="text-sm text-muted leading-relaxed mt-2 ml-10">{result.explanation}</p>
      )}
    </button>
  );
}
