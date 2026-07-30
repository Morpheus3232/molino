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
import EditorialSection from "@/components/ui/EditorialSection";
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
        <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-12 sm:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent text-center mb-6"
          >
            MI MAPA PERSONAL
          </motion.p>

          {/* Animal emoji — THE reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-6"
          >
            <span className="inline-block text-[110px] sm:text-[140px] leading-none" role="img" aria-label={chineseZodiac}>
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
            <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-tight text-foreground uppercase">
              {name}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted">
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
                className="relative p-4 sm:p-6 rounded-md border border-border bg-card shadow-sm text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: card.color }} />
                <span className="text-2xl block mb-2">{card.icon}</span>
                <p className="font-display text-lg sm:text-xl text-foreground">{card.value}</p>
                <p className="font-mono uppercase text-[9px] tracking-[0.18em] text-muted mt-1">{card.label}</p>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-accent/[0.06] border border-accent/20">
                <span className="text-sm">{sunSignSymbol}</span>
                <p className="font-mono uppercase text-[10px] tracking-[0.2em] text-accent">
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
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-md border border-border bg-card shadow-sm">
                <span className="text-xl">{matchingFamous.emoji}</span>
                <div className="text-left">
                  <p className="font-mono uppercase text-[9px] tracking-[0.15em] text-muted">Compartís tu energía con</p>
                  <p className="text-sm font-medium text-foreground">{matchingFamous.name}</p>
                  <p className="font-mono uppercase text-[9px] tracking-[0.15em] text-muted">
                    {matchingFamous.field} · {matchingFamous.country}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TUS 4 SISTEMAS — negro full-bleed
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        tone="ink"
        eyebrow="TUS SISTEMAS"
        title={<>CUATRO LECTURAS.<br />UNA MISMA PERSONA.</>}
        texture="circle"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-paper/15 pt-px">
          {identityProfile.perspectives.map((persp, i) => (
            <motion.div
              key={persp.system}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-8 lg:p-10 bg-ink"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{persp.icon}</span>
                <p className="font-mono uppercase text-[10px] tracking-[0.2em]" style={{ color: persp.color }}>
                  {persp.systemLabel}
                </p>
              </div>
              <p className="text-base font-medium text-paper">
                {persp.headline}
              </p>
              <p className="text-sm text-paper/60 leading-relaxed mt-2 line-clamp-2">
                {persp.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Convergences — brief */}
        {identityProfile.convergences.length > 0 && (
          <motion.div {...smoothReveal} className="p-8 lg:p-10 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">
              DÓNDE COINCIDEN
            </p>
            <div className="space-y-2">
              {identityProfile.convergences.slice(0, 3).map((conv, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-md border border-paper/15 bg-paper/[0.03]">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-paper">{conv.theme}</p>
                    <p className="font-mono uppercase text-[9px] tracking-[0.15em] text-paper/50 mt-0.5">
                      {conv.systems.join(" + ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          CÓDIGO PERSONAL — Card grid
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        eyebrow="TU CÓDIGO PERSONAL"
        title={<>LOS NÚMEROS<br />QUE TE DEFINEN.</>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 pt-px">
          {codeEntries.map((entry, i) => (
            <motion.div
              key={codeLabels[i]}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-8 lg:p-10 bg-background"
            >
              <div className="flex items-start gap-4">
                <p className="font-display text-4xl sm:text-5xl text-accent shrink-0">{entry.number}</p>
                <div className="min-w-0">
                  <p className="font-mono uppercase text-[10px] tracking-[0.2em] text-muted">{codeLabels[i]}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{entry.name}</p>
                  <p className="text-sm text-muted leading-relaxed mt-1">{entry.meaning}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          CONVERGENCIA + DIMENSIONES
          ═══════════════════════════════════════════════ */}
      <ConvergentSection profile={profile} />

      {/* Cards at bottom */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <IdentityCard profile={profile} />
          <PersonalScoreCard profile={profile} />
          <KnowledgeConnections profile={profile} />
        </div>
      </section>

      {/* Share */}
      <EditorialSection tone="paperAlt" eyebrow="COMPARTIR" title="ESTO MERECE SER COMPARTIDO.">
        <div className="pt-8">
          <ShareableImageCard profile={profile} currentTab="identity" />
        </div>
      </EditorialSection>

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
