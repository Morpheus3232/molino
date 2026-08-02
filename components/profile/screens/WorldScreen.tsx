"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getTopAffinityHighlights, calculateAllAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES, SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { formatAnimalSimple, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

interface WorldScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function WorldScreen({ profile, onNavigate }: WorldScreenProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;

  const affinityHighlights = useMemo(() => getTopAffinityHighlights(profile), [profile]);

  // Afinidad = exclusivamente zodíaco chino (affinityEngine), misma fuente
  // que usa toda la superficie /affinity/*. "Positiva" = tier afinidad-media
  // o mejor, el mismo umbral (score >= 60) que ya define getTierForScore.
  const topCountries = useMemo(
    () => calculateAllAffinity(profile, SYMBOLIC_ENTITIES.filter(e => e.type === "country"))
      .filter(r => r.tier !== "desafiante" && r.tier !== "distante")
      .slice(0, 10),
    [profile]
  );
  const topBrands = useMemo(
    () => calculateAllAffinity(profile, SYMBOLIC_ENTITIES.filter(e => e.type === "brand"))
      .filter(r => r.tier !== "desafiante" && r.tier !== "distante")
      .slice(0, 10),
    [profile]
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
              Descubrí qué resuena con vos
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Marcas, destinos y ciudades que conectan con tu perfil de{" "}
              <span className="font-medium text-foreground">{userDisplay.name}</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TOP HIGHLIGHTS — The 3 best matches
          ═══════════════════════════════════════════════ */}
      {affinityHighlights.length > 0 && (
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Tus mejores matches</h2>
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
                      <span className="text-lg font-semibold text-foreground">{result.score}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {result.entity.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-1.5 h-1.5 shrink-0" style={{ backgroundColor: tierMeta.color }} />
                      <span className="uppercase text-[9px] tracking-wider" style={{ color: tierMeta.color }}>
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
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Países que resuenan con vos</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Estos países tienen mayor afinidad simbólica con tu perfil de <span className="font-medium text-foreground">{userDisplay.name}</span>.
              </p>
            </motion.div>

            <div className="space-y-3">
              {topCountries.map((rec, i) => (
                <CountryCard key={rec.entity.id} rec={rec} index={i} />
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
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Marcas que vibran con vos</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Marcas con mayor afinidad simbólica con tu perfil de <span className="font-medium text-foreground">{userDisplay.name}</span>, organizadas por rubro.
              </p>
            </motion.div>

            <div className="space-y-8">
              {Object.entries(grouped).map(([category, recs]) => (
                <div key={category}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">{category}</p>
                  <div className="space-y-3">
                    {recs.map((rec, i) => (
                      <BrandCard key={rec.entity.id} rec={rec} index={i} />
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
              <p className="text-sm text-muted mt-1">Todas las entidades, no solo tus mejores matches.</p>
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

function CountryCard({ rec, index }: { rec: AffinityResult; index: number }) {
  const router = useRouter();
  const event = rec.entity.events.find(e => e.primaryForAffinity) ?? rec.entity.events[0];
  const animalDisplay = getZodiacDisplay(rec.entityAnimal);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
      className="w-full text-left p-4 sm:p-6 border-b border-ink/10 last:border-b-0 hover:bg-ink/[0.02] transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center shrink-0">
          <span className="text-3xl">{rec.entity.emoji}</span>
          <span className="text-xl mt-1">{animalDisplay.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
              {rec.entity.name}
            </h4>
            <span className="text-sm font-semibold text-muted">{rec.score}</span>
          </div>
          <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-2">
            {rec.entity.country} · {animalDisplay.name} · {rec.entityAnimal}
          </p>

          {/* Historical fact — separated */}
          {event && (
            <div className="p-3 bg-ink/[0.02] mb-2">
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-1">Dato histórico</p>
              <p className="text-sm text-foreground leading-relaxed">
                {rec.entity.description}
              </p>
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mt-1">
                {event.label} ({event.year}) · {event.confidence === "exacta" ? "Fecha exacta" : event.confidence === "alta" ? "Alta precisión" : "Aproximado"}
              </p>
            </div>
          )}

          {/* Why it appears — symbolic */}
          <p className="text-sm text-muted leading-relaxed italic">
            {rec.explanation}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function BrandCard({ rec, index }: { rec: AffinityResult; index: number }) {
  const router = useRouter();
  const event = rec.entity.events.find(e => e.primaryForAffinity) ?? rec.entity.events[0];
  const animalDisplay = getZodiacDisplay(rec.entityAnimal);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
      className="w-full text-left p-4 sm:p-6 border-b border-ink/10 last:border-b-0 hover:bg-ink/[0.02] transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center shrink-0">
          <span className="text-3xl">{rec.entity.emoji}</span>
          <span className="text-xl mt-1">{animalDisplay.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
              {rec.entity.name}
            </h4>
            <span className="text-sm font-semibold text-muted">{rec.score}</span>
          </div>
          <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-2">
            {rec.entity.country} · {animalDisplay.name} · {rec.entityAnimal}
          </p>

          {event && (
            <div className="p-3 bg-ink/[0.02] mb-2">
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-1">Dato histórico</p>
              <p className="text-sm text-foreground leading-relaxed">
                {rec.entity.description}
              </p>
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mt-1">
                {event.label} ({event.year})
              </p>
            </div>
          )}

          <p className="text-sm text-muted leading-relaxed italic">
            {rec.explanation}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
