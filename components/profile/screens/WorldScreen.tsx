"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getTopAffinityHighlights, TIER_META } from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import { formatAnimalSimple, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import {
  buildPersonalRecommendations,
  hasPositiveAffinity,
  type PersonalRecommendation,
} from "@/lib/engines/personalRecommendationEngine";
import CrossLinks from "@/components/profile/CrossLinks";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

interface WorldScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function WorldScreen({ profile, onNavigate }: WorldScreenProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;

  const affinityHighlights = useMemo(() => getTopAffinityHighlights(profile), [profile]);
  const map = useMemo(() => buildPersonalRecommendations(profile), [profile]);

  // Get top 10 countries and top 10 brands with positive affinity only
  const topCountries = useMemo(
    () => (map.byCategory["country"] ?? [])
      .filter(r => hasPositiveAffinity(r.priority))
      .slice(0, 10),
    [map]
  );
  const topBrands = useMemo(
    () => (map.byCategory["brand"] ?? [])
      .filter(r => hasPositiveAffinity(r.priority))
      .slice(0, 10),
    [map]
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
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted font-medium mb-3">Tu Mundo</p>
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
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus mejores matches</h2>
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
                    className="text-left p-5 bg-background hover:bg-black/[0.02] transition-colors group"
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
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Países que resuenan con vos</h2>
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
                Ver todos los países &rarr;
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          TOP MARCAS — Inline, grouped by category
          ═══════════════════════════════════════════════ */}
      {topBrands.length > 0 && (() => {
        const grouped = topBrands.reduce<Record<string, PersonalRecommendation[]>>((acc, rec) => {
          const cat = rec.entity.category || "Otros";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(rec);
          return acc;
        }, {});
        return (
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Marcas que vibran con vos</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Marcas con mayor resonancia según tu energía y el ciclo actual, organizadas por rubro.
              </p>
            </motion.div>

            <div className="space-y-8">
              {Object.entries(grouped).map(([category, recs]) => (
                <div key={category}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">{category}</p>
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
                Ver todas las marcas &rarr;
              </button>
            </motion.div>
          </div>
        </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════
          EXPLORAR MÁS
          ═══════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar más</h2>
            </div>
          </motion.div>
          <motion.div {...staggerApple} className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10">
            <motion.button
              {...staggerItemSmooth}
              onClick={() => router.push("/affinity")}
              className="text-left p-5 bg-background hover:bg-black/[0.02] transition-colors group"
            >
              <span className="text-xl block mb-2">✦</span>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Todas las entidades</p>
              <p className="text-sm text-muted mt-1">Explorá el mapa completo de afinidades.</p>
            </motion.button>
            <motion.button
              {...staggerItemSmooth}
              transition={{ ...staggerDelay, delay: 0.08 }}
              onClick={() => router.push("/explore")}
              className="text-left p-5 bg-background hover:bg-black/[0.02] transition-colors group"
            >
              <span className="text-xl block mb-2">🔍</span>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Explorar compatibilidad</p>
              <p className="text-sm text-muted mt-1">Buscá personas, países y conceptos.</p>
            </motion.button>
            <motion.button
              {...staggerItemSmooth}
              transition={{ ...staggerDelay, delay: 0.16 }}
              onClick={() => router.push("/academy")}
              className="text-left p-5 bg-background hover:bg-black/[0.02] transition-colors group"
            >
              <span className="text-xl block mb-2">📚</span>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Aprender más</p>
              <p className="text-sm text-muted mt-1">Numerología, astrología y zodiaco chino.</p>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Cross-links */}
      {onNavigate && (
        <CrossLinks
          links={[
            { label: "¿Quién comparte tu energía?", description: "Aliados, opuestos y personas de tu mismo signo.", onClick: () => onNavigate("circle") },
            { label: "Explorá tu mapa profundo", description: "Síntesis, patrones y dimensiones de tu perfil.", onClick: () => onNavigate("intelligence") },
            { label: "Volvé a tu identidad", description: "Revisá tu perfil base y arquetipo.", onClick: () => onNavigate("identity") },
          ]}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════ */

function CountryCard({ rec, index }: { rec: PersonalRecommendation; index: number }) {
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
      className="w-full text-left p-4 sm:p-5 border-b border-ink/10 last:border-b-0 hover:bg-black/[0.02] transition-all group"
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
            <span className="text-sm font-semibold text-muted">{rec.totalScore}</span>
          </div>
          <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-2">
            {rec.entity.country} · {animalDisplay.name} · {rec.entityAnimal}
          </p>

          {/* Historical fact — separated */}
          {event && (
            <div className="p-3 bg-black/[0.02] mb-2">
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
          <p className="text-sm text-muted/70 leading-relaxed italic">
            {rec.explanation}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function BrandCard({ rec, index }: { rec: PersonalRecommendation; index: number }) {
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
      className="w-full text-left p-4 sm:p-5 border-b border-ink/10 last:border-b-0 hover:bg-black/[0.02] transition-all group"
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
            <span className="text-sm font-semibold text-muted">{rec.totalScore}</span>
          </div>
          <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-2">
            {rec.entity.country} · {animalDisplay.name} · {rec.entityAnimal}
          </p>

          {event && (
            <div className="p-3 bg-black/[0.02] mb-2">
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mb-1">Dato histórico</p>
              <p className="text-sm text-foreground leading-relaxed">
                {rec.entity.description}
              </p>
              <p className="uppercase text-[9px] tracking-[0.15em] text-muted mt-1">
                {event.label} ({event.year})
              </p>
            </div>
          )}

          <p className="text-sm text-muted/70 leading-relaxed italic">
            {rec.explanation}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
