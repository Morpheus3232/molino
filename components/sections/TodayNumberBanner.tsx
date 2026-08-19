"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import type { UserProfile } from "@/types/user";
import { fadeUpDelayed } from "@/lib/utils/motion";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";

/**
 * Arriba de todo del home para usuarios con perfil guardado: el número del
 * día numerológico actual, con la cuenta completa de la reducción y su
 * arquetipo — sin nada de identidad del usuario (eso ya lo cubre el resto
 * de la página). Un solo acento de color derivado del elemento del usuario,
 * sin emojis ni dibujos.
 */
export default function TodayNumberBanner() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const todayNumber = useMemo(() => getCalendarDayContent(todayKey), [todayKey]);
  const breakdown = useMemo(() => getDateNumberBreakdown(todayKey), [todayKey]);
  // Mismo hook que usa /hoy (HoyClient.tsx) — null-safe, no requiere perfil
  // no nulo. Se llama sin condicionar (regla de hooks) antes del early return.
  const daily = useDailyEnergy(profile);

  if (!mounted || !profile?.birthDate) return null;

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  return (
    <section className="bg-background border-b border-ink/10">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 py-12 sm:py-16 text-center">
        <motion.p {...fadeUpDelayed(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">
          Hoy es día
        </motion.p>

        <motion.p
          {...fadeUpDelayed(0.05)}
          className="font-display text-[clamp(4rem,14vw,6.5rem)] leading-[0.85] tracking-tight"
          style={{ color: elementColor }}
        >
          {todayNumber.number}
        </motion.p>

        <motion.p {...fadeUpDelayed(0.1)} className="font-mono text-xs sm:text-sm text-muted mt-4">
          {formatDateNumberBreakdown(breakdown)}
          {breakdown.isMaster && <span className="ml-2 text-accent">· número maestro</span>}
        </motion.p>

        <motion.div {...fadeUpDelayed(0.15)} className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Arquetipo del día</p>
          <p className="font-heading text-2xl sm:text-3xl text-foreground tracking-tight">{todayNumber.title}</p>
        </motion.div>

        <motion.p
          {...fadeUpDelayed(0.2)}
          className="text-base sm:text-lg text-foreground leading-relaxed mt-5 max-w-lg mx-auto"
        >
          {todayNumber.description}
        </motion.p>

        {/* Fase lunar — dato puntual, mismo lenguaje que el meter de
            "Intensidad del patrón" de la síntesis paga: label-micro + texto,
            sin card. El emoji es dato de contenido, no ícono de UI. */}
        {daily?.moonPhase && (
          <motion.p {...fadeUpDelayed(0.22)} className="mt-6 flex items-center justify-center gap-2">
            <span className="label-micro">Fase lunar</span>
            <span className="text-sm text-foreground">
              {daily.moonPhase.emoji} {daily.moonPhase.phase}
            </span>
          </motion.p>
        )}

        {/* Tu foco de hoy / Evitá hoy — mismo trazo accent/border que ya usan
            Fortalezas/Zonas de atención en la síntesis paga (MolinoInterpretation.tsx),
            sin el bloque de Consejo del Momento ni el CTA al Journal de DailyFocus.tsx. */}
        {daily && (
          <motion.div
            {...fadeUpDelayed(0.24)}
            className="mt-8 pt-6 border-t border-ink/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-lg mx-auto"
          >
            <div>
              <p className="label-micro mb-3">Tu foco de hoy</p>
              <div className="flex items-start gap-3">
                <span className="w-4 h-px bg-accent mt-[0.65em] shrink-0" aria-hidden="true" />
                <p className="text-base text-foreground leading-relaxed">{daily.focusAction}</p>
              </div>
            </div>
            <div>
              <p className="label-micro mb-3">Evitá hoy</p>
              <div className="flex items-start gap-3">
                <span className="w-4 h-px bg-border mt-[0.65em] shrink-0" aria-hidden="true" />
                <p className="text-base text-muted leading-relaxed">{daily.avoidAction}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.p {...fadeUpDelayed(0.25)} className="text-sm text-muted mt-4">
          {todayNumber.tags.join(" · ")}
        </motion.p>

        <motion.div {...fadeUpDelayed(0.3)} className="mt-8 pt-6 border-t border-ink/10">
          <Link
            href="/calendario"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase hover:underline underline-offset-4"
            style={{ color: elementColor }}
          >
            Ver calendario numerológico
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
