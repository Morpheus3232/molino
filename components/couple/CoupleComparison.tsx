"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  calculateCoupleCompatibility,
  type CoupleCompatibilityResult,
} from "@/lib/engines/coupleEngine";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import {
  Sparkles,
  Heart,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Compass,
  Zap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SocialShareBar from "@/components/ui/SocialShareBar";

interface CoupleComparisonProps {
  profileA: UserProfile;
  profileB: UserProfile;
  onReset?: () => void;
  className?: string;
}

function PersonCard({
  profile,
  badgeLabel,
  colorScheme = "gold",
}: {
  profile: UserProfile;
  badgeLabel: string;
  colorScheme?: "gold" | "blue";
}) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name || "El Caminante";
  const sunSign = profile.sunSign || "Aries";
  const sunSymbol = ZODIAC_SYMBOLS[sunSign] || "☀️";
  const zodiacDisplay = getZodiacDisplay(profile.chineseZodiac);
  const element = profile.chineseZodiacInfo?.element || profile.element || "Fuego";
  const name = profile.name?.trim() || archetypeName;

  const accentColor = colorScheme === "gold" ? "#D4A843" : "#60A5FA";
  const accentBorder = colorScheme === "gold" ? "border-amber-500/30" : "border-blue-500/30";
  const accentBg = colorScheme === "gold" ? "bg-amber-500/10" : "bg-blue-500/10";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 bg-card ${accentBorder} shadow-sm relative flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full font-bold ${accentBg}`}
            style={{ color: accentColor }}
          >
            {badgeLabel}
          </span>
          {profile.birthDate && (
            <span className="font-mono text-xs text-muted">
              {profile.birthDate}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl sm:text-2xl text-foreground uppercase tracking-tight">
          {name}
        </h3>
        <p className="text-xs text-muted mt-0.5 italic">
          {archetype.quote || archetype.description}
        </p>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {/* Life Path */}
          <div className="p-2.5 rounded-xl bg-background/80 border border-ink/5 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Camino
            </span>
            <span className="font-mono text-lg font-bold" style={{ color: accentColor }}>
              {lifePath}
            </span>
          </div>

          {/* Sun Sign */}
          <div className="p-2.5 rounded-xl bg-background/80 border border-ink/5 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Solar
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">
              {sunSymbol} {sunSign}
            </span>
          </div>

          {/* Chinese Zodiac */}
          <div className="p-2.5 rounded-xl bg-background/80 border border-ink/5 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Zodíaco
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground block truncate">
              {zodiacDisplay.emoji} {zodiacDisplay.name}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/5 text-[11px] font-mono text-muted flex items-center justify-between">
        <span>Elemento {element}</span>
        <span>Arquetipo #{lifePath}</span>
      </div>
    </div>
  );
}

export default function CoupleComparison({
  profileA,
  profileB,
  onReset,
  className = "",
}: CoupleComparisonProps) {
  const [copied, setCopied] = useState(false);

  const result = useMemo<CoupleCompatibilityResult>(
    () => calculateCoupleCompatibility(profileA, profileB),
    [profileA, profileB]
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/pareja?a=${profileA.birthDate}&b=${profileB.birthDate}`;
  }, [profileA.birthDate, profileB.birthDate]);

  const handleShareLink = useCallback(async () => {
    const text = `Comparativa de mapas en Molino: ${result.summary}\nMirá el resultado acá:`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Modo Pareja — Molino",
          text,
          url: shareUrl,
        });
        return;
      } catch {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result.summary, shareUrl]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Synergy Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-xl text-center relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-accent animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
            Resonancia de la Pareja
          </span>
        </div>

        {/* Score Number Display */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-tight text-foreground">
            {result.score}%
          </div>
          <span className="font-mono text-sm sm:text-base text-accent font-semibold mt-1 max-w-md">
            {result.level}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed mt-2">
          {result.summary}
        </p>

        {/* Actions Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-ink/10">
          <Button
            variant="ghost"
            onClick={handleShareLink}
            className="flex items-center gap-2 px-4"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                ¡Enlace copiado!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Compartir comparativa
              </>
            )}
          </Button>

          {onReset && (
            <Button
              variant="ghost"
              onClick={onReset}
              className="flex items-center gap-1.5 text-muted hover:text-foreground text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Nueva comparación
            </Button>
          )}
        </div>

        {/* Social Share Bar */}
        <div className="mt-4 flex items-center justify-center">
          <SocialShareBar
            title={`Sinergia de Pareja (${result.score}%): ${result.level}`}
            text={`Comparativa en Molino: ${result.summary}`}
            url={shareUrl}
          />
        </div>
      </motion.div>

      {/* Side-by-side Maps (Desktop side by side, Mobile stacked) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <PersonCard profile={profileA} badgeLabel="Persona A" colorScheme="gold" />
        <PersonCard profile={profileB} badgeLabel="Persona B" colorScheme="blue" />
      </div>

      {/* Connection Points (Sinergias) */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Puntos de Conexión & Sinergia
            </h3>
            <p className="text-xs text-muted">
              Donde las energías de ambos fluyen de forma natural y complementaria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.connections.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 rounded-2xl bg-background border border-ink/5 hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                    {c.system}
                  </span>
                  {c.score && (
                    <span className="font-mono text-xs font-bold text-foreground bg-ink/5 px-2 py-0.5 rounded">
                      {c.score} pts
                    </span>
                  )}
                </div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  {c.title}
                </h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {c.description}
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
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Puntos de Atención & Desafíos
            </h3>
            <p className="text-xs text-muted">
              Diferencias de ritmo o polaridad que representan oportunidades de crecimiento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {result.challenges.map((ch) => (
            <div
              key={ch.id}
              className="p-4 sm:p-5 rounded-2xl bg-background border border-ink/5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                  Área: {ch.area}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {ch.description}
              </p>
              <div className="mt-3 pt-2 border-t border-ink/5 text-xs text-muted flex items-start gap-2">
                <span className="text-accent font-bold">💡 Consejo:</span>
                <span>{ch.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Dynamic Daily Advice */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Compass className="w-5 h-5 text-accent" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Síntesis para la Dinámica Cotidiana
          </h3>
        </div>
        <blockquote className="text-sm sm:text-base text-foreground/90 italic leading-relaxed border-l-2 border-accent pl-4 py-1">
          &ldquo;{result.dailyAdvice}&rdquo;
        </blockquote>
      </motion.section>
    </div>
  );
}
