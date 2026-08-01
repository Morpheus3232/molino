"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAllAffinity, calculateAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { getEntitiesByType, type EntityType } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";

interface AffinityTypeContentProps {
  type: EntityType;
  meta: { label: string; plural: string; icon: string; description: string };
  entities: SymbolicEntity[];
}

const AFFINITY_DATE_KEY = "molino.affinity-date.v1";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function AffinityTypeContent({ type, meta, entities }: AffinityTypeContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [search, setSearch] = useState("");
  const [quickDate, setQuickDate] = useState("");
  const [quickResult, setQuickResult] = useState<AffinityResult | null>(null);
  const dateInputRef = useRef<DateInputHandle>(null);

  const isQuickDateValid = Boolean(
    quickDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(quickDate) &&
    (() => {
      const [y] = quickDate.split("-").map(Number);
      const birth = new Date(quickDate + "T00:00:00");
      return y >= 1900 && birth < new Date();
    })()
  );

  const handleQuickDiscover = () => {
    if (!isQuickDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(AFFINITY_DATE_KEY, quickDate);
      }
    } catch {}
    const p = calculateUserProfile("", quickDate);
    if (entities.length > 0) {
      const result = calculateAffinity(p, entities[0]);
      setQuickResult(result);
    }
  };

  const results = useMemo(() => {
    if (!profile) return [];
    return calculateAllAffinity(profile, entities);
  }, [profile, entities]);

  const filtered = useMemo(() => {
    if (!search) return results;
    const q = search.toLowerCase();
    return results.filter((r) => r.entity.name.toLowerCase().includes(q));
  }, [results, search]);

  const sortedEntities = useMemo(() => {
    if (!entities.length) return [];
    if (profile) return filtered;
    return entities.slice(0, 20).map((entity) => {
      const p = calculateUserProfile("", "1990-01-01");
      return calculateAffinity(p, entity);
    }).sort((a, b) => b.score - a.score);
  }, [entities, profile, filtered]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!mounted ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
              <p className="sr-only" role="status" aria-label="Cargando afinidades...">
                Cargando afinidades...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-[var(--skeleton)] border border-ink/10 rounded-md" />
                  ))}
                </div>
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

              {/* HERO */}
              <motion.section {...fadeUp} className="mb-16 sm:mb-20">
                <p className="label-micro text-accent mb-4">Afinidades</p>
                <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
                  ¿Qué {meta.plural.toLowerCase()} resuenan con vos?
                </h1>
                <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
                  Descubrí qué {meta.plural.toLowerCase()} comparten una afinidad simbólica con tu perfil según tu animal del zodíaco chino.
                </p>
                <p className="text-sm text-muted mt-4 max-w-lg">
                  Tu afinidad se calcula comparando tu animal con el animal asociado a cada {meta.plural.toLowerCase()} según su evento histórico principal.
                </p>
              </motion.section>

              {/* QUICK DISCOVERY — solo para quien todavía no tiene perfil */}
              {!profile && (
                <motion.section {...fadeUp} className="mb-16 sm:mb-20">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="font-heading uppercase text-xl sm:text-2xl font-semibold text-foreground mb-2">
                        Descubrí tus afinidades
                      </h2>
                      <p className="text-sm text-muted">
                        Ingresá tu fecha y conocé tu afinidad simbólica con los {meta.plural.toLowerCase()}.
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 rounded-md border border-border bg-card shadow-sm">
                      <DateInput ref={dateInputRef} value={quickDate} onChange={setQuickDate} />

                      <button
                        type="button"
                        onClick={handleQuickDiscover}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3.5 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[48px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 mt-6"
                      >
                        Descubrir mis afinidades →
                      </button>

                      <p className="text-[11px] text-muted text-center mt-3">
                        Sin registro. No guardamos tu fecha.
                      </p>

                      <AnimatePresence>
                        {quickResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 p-5 rounded-md border border-border bg-background flex items-center gap-4"
                          >
                            <span className="text-3xl shrink-0">{quickResult.entity.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading text-base font-semibold text-foreground truncate">
                                {quickResult.entity.name}
                              </p>
                              <p className="text-xs text-muted mt-1">
                                {formatAnimalSimple(quickResult.entityAnimal)}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-heading text-xl font-bold" style={{ color: TIER_META[quickResult.tier].color }}>
                                {quickResult.score}
                              </div>
                              <div className="text-[11px] font-medium uppercase tracking-wider mt-0.5" style={{ color: TIER_META[quickResult.tier].color }}>
                                {TIER_META[quickResult.tier].label}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* RESULTS (when profile exists) */}
              {profile && (
                <motion.section {...fadeUp} className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-px bg-border" aria-hidden="true" />
                    <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus afinidades con {meta.plural.toLowerCase()}</h2>
                  </div>

                  {results.length > 3 && (
                    <div className="mb-8">
                      <SearchInput
                        value={search}
                        onValueChange={setSearch}
                        placeholder={`Buscar ${meta.plural.toLowerCase()}...`}
                        label={`Buscar ${meta.plural.toLowerCase()}`}
                        className="max-w-sm"
                      />
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-16"
                      >
                        <p className="eyebrow-brutalist mb-4">Sin resultados</p>
                        <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                          No se encontraron {meta.plural.toLowerCase()} para &ldquo;{search}&rdquo;.
                        </p>
                        <Button variant="secondary" onClick={() => setSearch("")}>
                          Limpiar búsqueda
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results-list"
                        {...staggerContainer}
                        className="space-y-3"
                      >
                        {filtered.map((result, i) => (
                          <EntityCard
                            key={result.entity.id}
                            result={result}
                            index={i}
                            type={type}
                            onClick={() => router.push(`/affinity/${type}/${result.entity.id}`)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              )}

              {/* EXPLORAR */}
              <motion.section {...fadeUp} className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar por {meta.plural.toLowerCase()}</h2>
                </div>
                <p className="text-sm text-muted mb-8 max-w-xl">
                  Cada {meta.plural.toLowerCase()} tiene un animal asociado según su evento histórico principal. Explorá las afinidades simbólicas y descubrí qué lugares resuenan con diferentes energías.
                </p>

                {sortedEntities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center py-16"
                  >
                    <p className="eyebrow-brutalist mb-4">Exploración en expansión</p>
                    <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                      Los {meta.plural.toLowerCase()} se están incorporando a Molino. Volvé pronto para descubrir tus afinidades.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedEntities.slice(0, 12).map((result, i) => (
                      <motion.button
                        key={result.entity.id}
                        {...staggerItem}
                        onClick={() => router.push(`/affinity/${type}/${result.entity.id}`)}
                        className="text-left p-5 rounded-md border border-border bg-card shadow-sm hover:border-accent transition-all group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl shrink-0">{result.entity.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                              {result.entity.name}
                            </h3>
                            <p className="text-xs text-muted mt-1">
                              {result.entity.country} · {formatAnimalSimple(result.entityAnimal)}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <div className="font-heading text-lg font-bold" style={{ color: TIER_META[result.tier].color }}>
                                {result.score}
                              </div>
                              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: TIER_META[result.tier].color }}>
                                {TIER_META[result.tier].label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.section>

              {/* CTA a descubrimiento personal */}
              {!profile && (
                <motion.section {...fadeUp} className="mb-12 text-center">
                  <div className="p-8 rounded-md border border-border bg-card shadow-sm max-w-lg mx-auto">
                    <p className="text-sm text-foreground mb-2">¿Querés ver tu afinidad personalizada?</p>
                    <p className="text-xs text-muted mb-6">Creá tu perfil sin registro y descubrí tus afinidades.</p>
                    <button
                      type="button"
                      onClick={() => router.push("/onboarding")}
                      className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      Crear mi perfil
                    </button>
                  </div>
                </motion.section>
              )}
            </main>

            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EntityCard({
  result,
  index,
  type,
  onClick,
}: {
  result: AffinityResult;
  index: number;
  type: EntityType;
  onClick: () => void;
}) {
  const tierMeta = TIER_META[result.tier];

  return (
    <motion.button
      {...staggerItem}
      onClick={onClick}
      className="w-full text-left p-6 rounded-md border border-border bg-card shadow-sm hover:border-accent transition-all group flex items-center gap-4 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ backgroundColor: tierMeta.color }} />

      {/* Emoji */}
      <div className="shrink-0">
        <span className="text-3xl">{result.entity.emoji}</span>
      </div>

      {/* Name + Context */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
          {result.entity.name}
        </h3>
        <p className="text-xs text-muted mt-1">
          {result.entity.country} · {formatAnimalSimple(result.entityAnimal)}
        </p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <div className="font-heading text-xl font-bold" style={{ color: tierMeta.color }}>{result.score}</div>
        <div className="text-[11px] font-medium uppercase tracking-wider mt-0.5" style={{ color: tierMeta.color }}>
          {tierMeta.label}
        </div>
      </div>
    </motion.button>
  );
}
