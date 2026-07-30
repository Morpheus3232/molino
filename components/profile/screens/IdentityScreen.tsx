"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import {
  buildPersonalCode,
  buildDimensions,
} from "@/lib/engines/synthesisEngine";
import { buildIdentityProfile } from "@/lib/engines/perspectivesEngine";
import IdentityCard from "@/components/profile/IdentityCard";
import PersonalScoreCard from "@/components/profile/PersonalScoreCard";
import ConvergentSection from "@/components/profile/ConvergentSection";
import KnowledgeConnections from "@/components/academy/KnowledgeConnections";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getFamousByAnimal } from "@/lib/data/famousPeople";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import CrossLinks from "@/components/profile/CrossLinks";
import ShareableImageCard from "@/components/profile/ShareableImageCard";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import dynamic from "next/dynamic";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

interface IdentityScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function IdentityScreen({ profile, onNavigate }: IdentityScreenProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const lifePath = safeNumber(profile.lifePath, 1);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const sunSignSymbol = ZODIAC_SYMBOLS[sunSign] || "\u2648";
  const element = typeof profile.element === "string" ? profile.element : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetype = ARCHETYPES[lifePath];
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const personalCode = useMemo(() => buildPersonalCode(profile), [profile]);
  const dimensions = useMemo(() => buildDimensions(profile), [profile]);
  const identityProfile = useMemo(() => buildIdentityProfile(profile), [profile]);

  const zodiacDisplay = getZodiacDisplay(chineseZodiac);
  const userYear = parseInt(birthDate?.split("-")[0] || "0", 10);

  // Famous people sharing the user's energy
  const famousByAnimal = useMemo(() => getFamousByAnimal(chineseZodiac, userYear), [chineseZodiac, userYear]);
  const matchingFamous = useMemo(() => {
    // Prefer people matching BOTH animal AND sign
    const both = famousByAnimal.filter(p => p.westernSign === sunSign);
    if (both.length > 0) return both[0];
    // Fall back to just animal match
    if (famousByAnimal.length > 0) return famousByAnimal[0];
    return null;
  }, [famousByAnimal, sunSign]);

  // Format date: "1990-03-15" → "15 de marzo de 1990"
  const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const formattedDate = (() => {
    if (!birthDate) return "";
    const parts = birthDate.split("-");
    if (parts.length !== 3) return birthDate;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    if (!day || !month || !year) return birthDate;
    return `${day} de ${MONTH_NAMES[month - 1]} de ${year}`;
  })();

  const codeEntries = [
    personalCode.lifePath,
    personalCode.expression,
    personalCode.soul,
    personalCode.personality,
  ];
  const codeLabels = ["Camino de Vida", "Expresión", "Alma", "Personalidad"];

  // Identity cards data
  const identityCards = [
    { label: "Camino de Vida", value: `${lifePath}`, icon: "🔢", color: "var(--element-fire)" },
    { label: "Signo Solar", value: `${sunSignSymbol} ${sunSign}`, icon: "☀", color: "var(--layer-astrology)" },
    { label: "Animal Chino", value: `${zodiacDisplay.name}`, icon: zodiacDisplay.emoji, color: "var(--layer-moment)" },
    { label: "Elemento", value: `${element}`, icon: "🌿", color: elementColor },
  ];

  return (
    <div
      id="panel-identity"
      role="tabpanel"
      aria-labelledby="tab-identity"
      className="bg-background"
    >
      {/* ═══════════════════════════════════════════════
          REVEAL HERO — The big moment
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16">
          {/* Animal emoji — THE reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-6"
          >
            <span className="inline-block text-[100px] sm:text-[120px] leading-none drop-shadow-sm" role="img" aria-label={chineseZodiac}>
              {zodiacDisplay.emoji}
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
              {name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted">
              {formattedDate} · {zodiacDisplay.name} de {chineseElement}
            </p>
          </motion.div>

          {/* Identity cards — visual, not text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {identityCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                className="relative p-4 sm:p-5 border border-ink/10 text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: card.color }} />
                <span className="text-2xl block mb-2">{card.icon}</span>
                <p className="font-display text-lg sm:text-xl text-foreground">{card.value}</p>
                <p className="uppercase text-[9px] tracking-[0.18em] text-muted mt-1">{card.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Archetype — the synthesis */}
          {archetype && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink/[0.03] border border-ink/20">
                <span className="text-sm">{sunSignSymbol}</span>
                <p className="uppercase text-[10px] tracking-[0.2em] text-accent">
                  Tu arquetipo es {archetype.name}
                </p>
              </div>
              {archetype.quote && (
                <p className="text-sm text-muted mt-3 italic max-w-md mx-auto">&ldquo;{archetype.quote}&rdquo;</p>
              )}
            </motion.div>
          )}

          {/* Famous person — "compartís energía con..." */}
          {matchingFamous && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-3 px-4 py-3 border border-ink/10">
                <span className="text-xl">{matchingFamous.emoji}</span>
                <div className="text-left">
                  <p className="uppercase text-[9px] tracking-[0.15em] text-muted">Compartís tu energía con</p>
                  <p className="text-sm font-medium text-foreground">{matchingFamous.name}</p>
                  <p className="uppercase text-[9px] tracking-[0.15em] text-muted/60">
                    {matchingFamous.field} · {matchingFamous.country}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TUS 4 SISTEMAS — Visual pills
          ═══════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus sistemas</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
            {identityProfile.perspectives.map((persp, i) => (
              <motion.div
                key={persp.system}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-5 bg-background"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{persp.icon}</span>
                  <p className="uppercase text-[10px] tracking-[0.2em]" style={{ color: persp.color }}>
                    {persp.systemLabel}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {persp.headline}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-1 line-clamp-2">
                  {persp.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Convergences — brief */}
          {identityProfile.convergences.length > 0 && (
            <motion.div {...smoothReveal} className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Dónde coinciden</p>
              <div className="space-y-2">
                {identityProfile.convergences.slice(0, 3).map((conv, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-ink/10">
                    <div className="w-1.5 h-1.5 bg-accent mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{conv.theme}</p>
                      <p className="uppercase text-[9px] tracking-[0.15em] text-muted mt-0.5">{conv.systems.join(" + ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CÓDIGO PERSONAL — Card grid
          ═══════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu código personal</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
            {codeEntries.map((entry, i) => (
              <motion.div
                key={codeLabels[i]}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-5 bg-background"
              >
                <div className="flex items-start gap-4">
                  <p className="text-4xl sm:text-5xl font-semibold text-accent shrink-0">{entry.number}</p>
                  <div className="min-w-0">
                    <p className="uppercase text-[10px] tracking-[0.2em] text-muted">{codeLabels[i]}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{entry.name}</p>
                    <p className="text-sm text-muted leading-relaxed mt-1">{entry.meaning}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONVERGENCIA + DIMENSIONES
          ═══════════════════════════════════════════════ */}
      <ConvergentSection profile={profile} />

      {/* Cards at bottom */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <IdentityCard profile={profile} />
          <PersonalScoreCard profile={profile} />
          <KnowledgeConnections profile={profile} />
        </div>
      </section>

      {/* Share */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compartir</h2>
            </div>
            <p className="text-sm text-muted mb-6">Esto merece ser compartido.</p>
          </motion.div>
          <ShareableImageCard profile={profile} currentTab="identity" />
        </div>
      </section>

      {/* Cross-links */}
      {onNavigate && (
        <CrossLinks
          links={[
            { label: "Descubrí qué resuena con vos", description: "Marcas, destinos y entidades que conectan con tu perfil.", onClick: () => onNavigate("world") },
            { label: "¿Quién comparte tu energía?", description: "Aliados, opuestos y personas de tu mismo signo.", onClick: () => onNavigate("circle") },
            { label: "Explorá tu mapa profundo", description: "Síntesis, patrones y dimensiones de tu perfil.", onClick: () => onNavigate("intelligence") },
          ]}
        />
      )}
    </div>
  );
}
