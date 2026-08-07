"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getTopAffinityHighlights, calculateAllAffinity, getTierForScore, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES, SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import { useUserContext } from "@/lib/hooks/useUserContext";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

interface WorldScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function WorldScreen({ profile, onNavigate }: WorldScreenProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const userCountry = useUserContext().country;

  // Orden de presentación: score primero (afinidad zodiacal intacta), y
  // como tiebreaker la relevancia cultural — el país del usuario adelanta
  // entidades de su país sin tocar ningún scoring.
  const withCountryPreference = useCallback((results: AffinityResult[]) => {
    const country = userCountry;
    if (!country) return results;
    return [...results].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aMatch = a.entity.country === country ? 1 : 0;
      const bMatch = b.entity.country === country ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [userCountry]);

  const affinityHighlights = useMemo(() => getTopAffinityHighlights(profile), [profile]);

  // Cuántas de TODAS las entidades conocidas resuenan con el animal
  // del usuario — un hecho real y agregado (varía según el animal: cada uno
  // tiene una posición distinta en el ciclo respecto al resto de entidades),
  // no una lista más: es la cifra que abre la sección, antes de listar nada.
  // Umbral score>=60 (afinidad-media o mejor) — no "complementarios": la
  // mayoría de las entidades caen ahí por ser relación "neutral" (score~50),
  // así que incluirlas hacía que ~80% de las 383 entidades "resonaran",
  // vaciando de sentido la cifra.
  const resonanceStats = useMemo(() => {
    const all = calculateAllAffinity(profile, SYMBOLIC_ENTITIES);
    const resonant = all.filter(r => r.score >= 60);
    return { resonant: resonant.length, total: all.length };
  }, [profile]);

  // Afinidad = exclusivamente zodíaco chino (affinityEngine), misma fuente
  // que usa toda la superficie /affinity/*. "Positiva" = tier afinidad-media
  // o mejor, el mismo umbral (score >= 60) que ya define getTierForScore.
  const topCountries = useMemo(
    () => withCountryPreference(
        calculateAllAffinity(profile, SYMBOLIC_ENTITIES.filter(e => e.type === "country"))
      ).filter(r => r.tier !== "desafiante" && r.tier !== "distante")
      .slice(0, 6),
    [profile, withCountryPreference]
  );
  const topBrands = useMemo(
    () => withCountryPreference(
        calculateAllAffinity(profile, SYMBOLIC_ENTITIES.filter(e => e.type === "brand"))
      ).filter(r => r.tier !== "desafiante" && r.tier !== "distante")
      .slice(0, 6),
    [profile, withCountryPreference]
  );

  const userDisplay = getZodiacDisplay(userAnimal);

  return (
    <div
      id="panel-world"
      role="tabpanel"
      aria-labelledby="tab-world"
    >
      {/* Hero */}
      <section className="py-12 sm:pt-16 pb-8">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="label-micro mb-3">Tu Mundo</p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
              Cómo te proyectás hacia afuera
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Lugares, marcas y entornos — no personas — que conectan con tu perfil de{" "}
              <span className="font-medium text-foreground">{userDisplay.name}</span>.
            </p>
            {resonanceStats.total > 0 && (
              <p className="text-sm text-accent mt-5">
                De las {resonanceStats.total} conexiones conocidas, tu {userDisplay.name.toLowerCase()} tiene presencia en {resonanceStats.resonant} — ese es tu mundo, no el de cualquiera.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TOP HIGHLIGHTS — Lo que más resuena
          ═══════════════════════════════════════════════ */}
      {affinityHighlights.length > 0 && (
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Lo que más presencia tiene en tu mapa</h2>
              </div>
            </motion.div>
            <motion.div {...staggerApple} className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10">
              {affinityHighlights.map((result, i) => {
                const tierMeta = TIER_META[result.tier];
                return (
                  <motion.button
                    key={result.entity.id}
                    {...staggerItemSmooth}
                    transition={{ ...staggerDelay, delay: i * 0.08 }}
                    onClick={() => router.push(`/affinity/${result.entity.type}/${result.entity.id}`)}
                    className="text-left p-6 bg-background hover:bg-ink/[0.02] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{result.entity.emoji}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {result.entity.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-1.5 h-1.5 shrink-0" style={{ backgroundColor: result.tier === "resonancia-alta" || result.tier === "afinidad-media" ? "var(--color-accent)" : "var(--color-muted)" }} />
                      <span className="uppercase text-[9px] tracking-wider" style={{ color: result.tier === "resonancia-alta" || result.tier === "afinidad-media" ? "var(--color-accent)" : "var(--color-muted)" }}>
                        {tierMeta.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                      {result.explanation || result.summary}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          TOP PAÍSES — Inline, with data
          ═══════════════════════════════════════════════ */}
      {topCountries.length > 0 && (
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Lugares con mayor presencia en tu mapa</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Estos lugares tienen una conexión simbólica con tu perfil de <span className="font-medium text-foreground">{userDisplay.name}</span>.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {topCountries.map((rec, i) => (
                <EntityCard key={rec.entity.id} rec={rec} index={i} />
              ))}
            </div>

            <motion.div {...smoothReveal} className="mt-6">
              <button
                type="button"
                onClick={() => router.push("/affinity/recommendations/countries")}
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Ver recomendaciones del ciclo actual &rarr;
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          TOP MARCAS — Inline, grouped by category
          ═══════════════════════════════════════════════ */}
      {topBrands.length > 0 && (() => {
        const grouped = topBrands.reduce<Record<string, AffinityResult[]>>((acc, rec) => {
          const cat = rec.entity.category || "Otros";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(rec);
          return acc;
        }, {});
        return (
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Marcas con presencia en tu mapa</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Marcas con una conexión simbólica con tu perfil de <span className="font-medium text-foreground">{userDisplay.name}</span>, organizadas por rubro.
              </p>
            </motion.div>

            <div className="space-y-8">
              {Object.entries(grouped).map(([category, recs]) => (
                <div key={category}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">{category}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recs.map((rec, i) => (
                      <EntityCard key={rec.entity.id} rec={rec} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <motion.div {...smoothReveal} className="mt-6">
              <button
                type="button"
                onClick={() => router.push("/affinity/recommendations/brands")}
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Ver recomendaciones del ciclo actual &rarr;
              </button>
            </motion.div>
          </div>
        </section>
        );
      })()}

      {/* Un único puente hacia afuera: el mapa completo de afinidades.
          "Explorar compatibilidad" y "Aprender más" ya se repetían, casi
          palabra por palabra, en "Tu próximo movimiento" (IntelligenceScreen)
          — cada tab no necesita reofrecer las mismas dos salidas. */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.button
            {...smoothReveal}
            onClick={() => router.push("/affinity")}
            className="w-full text-left p-6 sm:p-8 border border-ink/10 hover:border-accent/40 hover:bg-ink/[0.02] transition-colors group flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Ver el mapa completo de afinidades</p>
              <p className="text-sm text-muted mt-1">Todas las conexiones, no solo las más altas.</p>
            </div>
            <span className="text-accent shrink-0" aria-hidden="true">→</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════ */

function EntityCard({ rec, index }: { rec: AffinityResult; index: number }) {
  const router = useRouter();
  const event = rec.entity.events.find(e => e.primaryForAffinity) ?? rec.entity.events[0];
  const animalDisplay = getZodiacDisplay(rec.entityAnimal);
  const tierMeta = TIER_META[getTierForScore(rec.score)];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
      className="w-full text-left p-5 sm:p-6 border border-ink/10 hover:border-accent/40 hover:bg-ink/[0.02] transition-all group flex flex-col"
    >
      {/* Entidad + animal + nivel de resonancia */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden="true">{rec.entity.emoji}</span>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
              {rec.entity.name}
            </h4>
            <p className="uppercase text-[9px] tracking-[0.15em] text-muted mt-0.5">
              {animalDisplay.name}{event ? ` · ${event.year}` : ""}
            </p>
          </div>
        </div>
        <span
          className="text-[10px] uppercase tracking-[0.1em] shrink-0 px-2 py-1 border rounded-sm"
          style={{ color: tierMeta.color, borderColor: `${tierMeta.color}40` }}
        >
          {tierMeta.label}
        </span>
      </div>

      {/* Historia breve */}
      <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4">
        {rec.entity.description}
      </p>

      {/* Por qué aparece en tu mundo */}
      <div className="mt-auto border-t border-ink/10 pt-3">
        <p className="label-micro mb-1.5">Por qué aparece en tu mundo</p>
        <p className="text-sm text-foreground leading-relaxed">
          {rec.explanation}
        </p>
      </div>
    </motion.button>
  );
}
