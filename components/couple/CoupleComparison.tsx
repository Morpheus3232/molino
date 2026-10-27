"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  calculateCoupleCompatibility,
  type CoupleCompatibilityResult,
} from "@/lib/engines/coupleEngine";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES, archetypeDisplayName } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import PersonalSynergySigil from "@/components/ui/PersonalSynergySigil";
import {
  Heart,
  AlertTriangle,
  Compass,
  Zap,
  ArrowRight,
} from "lucide-react";

interface CoupleComparisonProps {
  profileA: UserProfile;
  profileB: UserProfile;
  onReset?: () => void;
  className?: string;
}

export function PersonCard({
  profile,
  badgeLabel,
  colorScheme = "gold",
}: {
  profile: UserProfile;
  badgeLabel: string;
  colorScheme?: "gold" | "blue";
}) {
  const L = useL();
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetypeDisplayName(archetype.name || L("El Caminante", "The Wanderer"));
  const sunSign = profile.sunSign || "Aries";
  const sunSymbol = ZODIAC_SYMBOLS[sunSign] || "☀";
  const zodiacDisplay = getZodiacDisplay(profile.chineseZodiac);
  const element = profile.chineseZodiacInfo?.element || profile.element || "Fuego";
  const name = profile.name?.trim() || archetypeName;

  const isGold = colorScheme === "gold";
  const accentBorder = isGold ? "border-gold/30" : "border-ink/20";
  const accentBg = isGold ? "bg-gold/10 text-foreground" : "bg-ink/5 text-foreground";

  return (
    <div className={`rounded-xl border p-5 sm:p-6 bg-card ${accentBorder} shadow-sm relative flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-sm px-2.5 py-0.5 rounded-full font-bold label-caps ${accentBg}`}
          >
            {L.t(badgeLabel)}
          </span>
          {profile.birthDate && (
            <span className="font-mono text-xs text-muted">
              {L.t(profile.birthDate)}
            </span>
          )}
        </div>

        <h3 className="section-title text-foreground">
          {L.t(name)}
        </h3>
        <p className="text-xs text-muted mt-0.5 italic">
          {L.t(archetype.quote || archetype.description)}
        </p>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {/* Life Path */}
          <div className="p-2.5 rounded-lg bg-background border border-ink/5 text-center">{L(<>
            <span className="text-sm text-muted block label-caps">
              Camino
            </span>
            <span className={`font-mono text-lg font-bold ${isGold ? "text-gold" : "text-accent"}`}>
              {L.t(lifePath)}
            </span>
          </>, <><span className="text-sm text-muted block label-caps">Path</span><span className={`font-mono text-lg font-bold ${isGold ? "text-gold" : "text-accent"}`}>{L.t(lifePath)}</span></>)}</div>

          {/* Sun Sign */}
          <div className="p-2.5 rounded-lg bg-background border border-ink/5 text-center">{L(<>
            <span className="text-sm text-muted block label-caps">
              Solar
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">
              {L.t(sunSymbol)} {L.t(sunSign)}
            </span>
          </>, <><span className="text-sm text-muted block label-caps">Sun</span><span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">{L.t(sunSymbol)} {L.t(sunSign)}</span></>)}</div>

          {/* Chinese Zodiac */}
          <div className="p-2.5 rounded-lg bg-background border border-ink/5 text-center">{L(<>
            <span className="text-sm text-muted block label-caps">
              Zodíaco
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">
              {L.t(zodiacDisplay.emoji)} {L.t(zodiacDisplay.name)}
            </span>
          </>, <><span className="text-sm text-muted block label-caps">Zodiac</span><span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">{L.t(zodiacDisplay.emoji)} {L.t(zodiacDisplay.name)}</span></>)}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/5 text-[11px] font-mono text-muted flex items-center justify-between">{L(<>
        <span>Elemento {L.t(element)}</span>
        <span>Arquetipo #{L.t(lifePath)}</span>
      </>, <><span>{L.t(element)} element</span><span>Archetype #{L.t(lifePath)}</span></>)}</div>
    </div>
  );
}

export default function CoupleComparison({
  profileA,
  profileB,
  onReset,
  className = "",
}: CoupleComparisonProps) {
  const L = useL();
  const result = useMemo<CoupleCompatibilityResult>(
    () => calculateCoupleCompatibility(profileA, profileB),
    [profileA, profileB]
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Synergy Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-xl text-center relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-sm text-accent font-bold label-caps">{L("Resonancia de la Pareja", "The Couple's Resonance")}</span>
        </div>

        {/* Level Display — sin número crudo, el nivel ya es descriptivo */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground max-w-lg leading-tight">
            {L.t(result.level)}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed mt-2">
          {L.t(result.summary)}
        </p>

        {/* Sello de Sinergia y Patrón de Interferencia */}
        {profileA.birthDate && profileB.birthDate && (
          <div className="mt-8 pt-6 border-t border-ink/10 max-w-sm sm:max-w-md mx-auto">
            <PersonalSynergySigil
              dateA={profileA.birthDate}
              dateB={profileB.birthDate}
              nameA={profileA.name}
              nameB={profileB.name}
              width={480}
              height={480}
              className="text-foreground"
            />
          </div>
        )}
      </motion.div>

      {/* Side-by-side Maps (Desktop side by side, Mobile stacked) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <PersonCard profile={profileA} badgeLabel={L("Persona A", "Person A")} colorScheme="gold" />
        <PersonCard profile={profileB} badgeLabel={L("Persona B", "Person B")} colorScheme="blue" />
      </div>

      {/* Connection Points (Sinergias) */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L(<>
              Puntos de Conexión & Sinergia
            </>, <>Points of Connection & Synergy</>)}</h3>
            <p className="text-xs text-muted">{L("Donde las energías de ambos fluyen de forma natural y complementaria.", "Where both people's energies flow in a natural, complementary way.")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.connections.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 rounded-lg bg-background border border-ink/5 hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm text-accent font-semibold label-caps">
                    {L.t(c.system)}
                  </span>
                  {c.score && (
                    <span className="font-mono text-xs font-bold text-foreground bg-ink/5 px-2 py-0.5 rounded">
                      {c.score} pts
                    </span>
                  )}
                </div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  {L.t(c.title)}
                </h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {L.t(c.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Challenges & Friction Points */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L(<>
              Puntos de Atención & Desafíos
            </>, <>Points of Attention & Challenges</>)}</h3>
            <p className="text-xs text-muted">{L("Diferencias de ritmo o polaridad que representan oportunidades de crecimiento.", "Differences in rhythm or polarity that represent opportunities for growth.")}</p>
          </div>
        </div>

        <div className="space-y-4">
          {result.challenges.map((ch) => (
            <div
              key={ch.id}
              className="p-4 sm:p-5 rounded-lg bg-background border border-ink/5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">{L(<>
                <span className="text-sm text-warning font-semibold label-caps">
                  Área: {L.t(ch.area)}
                </span>
              </>, <><span className="text-sm text-warning font-semibold label-caps">Area: {L.t(ch.area)}</span></>)}</div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {L.t(ch.description)}
              </p>
              <div className="mt-3 pt-2 border-t border-ink/5 text-xs text-muted flex items-start gap-2">{L(<>
                <span className="text-accent font-bold">💡 Consejo:</span>
                <span>{L.t(ch.recommendation)}</span>
              </>, <><span className="text-accent font-bold">💡 Tip:</span><span>{L.t(ch.recommendation)}</span></>)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Dynamic Daily Advice */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Compass className="w-5 h-5 text-accent" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">{L("Síntesis para la Dinámica Cotidiana", "Synthesis for Everyday Dynamics")}</h3>
        </div>
        <blockquote className="text-sm sm:text-base text-foreground/90 italic leading-relaxed border-l-2 border-accent pl-4 py-1">
          &ldquo;{L.t(result.dailyAdvice)}&rdquo;
        </blockquote>
      </motion.section>

      {/* Share */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-center mt-6"
      >
        <button
          type="button"
          onClick={() => {
            const text = L(`Comparativa de Molino: ${profileA.name} + ${profileB.name}`, `Molino comparison: ${L.t(profileA.name)} + ${L.t(profileB.name)}`);
            if (navigator.share) {
              navigator.share({ title: text, text }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text).catch(() => {});
            }
          }}
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-wider text-muted hover:text-accent transition-colors border border-border hover:border-accent rounded-md"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {L("Compartir comparativa", "Share comparison")}
        </button>
      </motion.div>
    </div>
  );
}
