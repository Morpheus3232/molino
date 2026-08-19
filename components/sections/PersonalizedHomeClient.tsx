"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import type { UserProfile } from "@/types/user";
import { safeNumber, getScoreColor, getScoreLabel } from "@/lib/utils/score";
import { fadeUp } from "@/lib/utils/motion";

/* ═══ Personalized home (with profile) — Client Island ═══ */

export default function PersonalizedHomeClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  const display = profile ? getZodiacDisplay(profile.chineseZodiac ?? "") : { emoji: "", name: "" };
  const lifePath = profile ? safeNumber(profile.lifePath, 1) : 1;
  const archetype = profile ? (ARCHETYPES[lifePath] || ARCHETYPES[1]) : ARCHETYPES[1];
  const energy = useMemo(() => profile ? calculateDailyEnergy(profile, new Date()) : null, [profile]);

  if (!mounted) return null;
  if (!profile) return null;

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="border-t border-ink/10 pt-10 pb-6 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{display.emoji}</span>
            <p className="label-micro">
              {archetype?.name ?? "Tu mapa"} · {display.name}
            </p>
          </motion.div>

          {energy && (
            <motion.div {...fadeUp} className="pb-16 lg:pb-20">
              <Link
                href="/hoy"
                className="group grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 lg:gap-16 items-center border border-ink/10 p-8 lg:p-12 transition-colors hover:bg-ink/[0.02]"
              >
                <div>
                  <p className="label-micro mb-4">Tu energía de hoy</p>
                  <p className="text-5xl sm:text-6xl font-heading font-bold tracking-tight" style={{ color: getScoreColor(energy.overallScore) }}>
                    {getScoreLabel(energy.overallScore)}
                  </p>
                  <p className="text-sm text-muted mt-2">{energy.theme}</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-heading text-foreground leading-relaxed max-w-xl">
                    {energy.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                    Ver mi día completo
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          <p className="label-micro mb-6">Ya conocés tu mapa. Entrá por donde quieras.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
            <Link href="/profile" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
              <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">01</p>
              <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu identidad</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">Tu código, tu elemento y tu animal.</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                VER MI MAPA
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
            <Link href="/profile?tab=world" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
              <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">02</p>
              <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu mundo</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">Países, ciudades y marcas que resuenan contigo.</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                EXPLORAR AFINIDADES
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
            <Link href="/profile?tab=circle" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
              <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">03</p>
              <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu círculo</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">Compatibilidad con otras personas.</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                VER COMPATIBILIDADES
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
            <Link href="/profile?tab=reading" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors sm:col-span-3">
              <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">04</p>
              <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu lectura completa</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">Síntesis de todos los sistemas: quién sos, tu momento y tu timing.</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                LEER SÍNTESIS
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}