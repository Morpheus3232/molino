"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { getCalendarDayContent } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import { fadeUp } from "@/lib/utils/motion";
import ReminderOptIn from "@/components/calendar/ReminderOptIn";

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
  const todayNumber = useMemo(() => getCalendarDayContent(toLocalDateKey(new Date())), []);
  const element = typeof profile?.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const activities = useMemo(
    () => todayNumber.purpose.split(",").map((a) => a.trim()).filter(Boolean),
    [todayNumber.purpose]
  );

  if (!mounted) return null;
  if (!profile) return null;

  return (
    <>
      <ReminderOptIn birthDate={profile?.birthDate} />
      <section className="bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="border-t border-ink/10 pt-10 pb-6 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{display.emoji}</span>
            <p className="label-micro">
              {archetype?.name ?? "Tu mapa"} · {display.name}
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="pb-16 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 lg:gap-16 items-center border border-ink/10 p-8 lg:p-12">
              <div className="flex items-center gap-6">
                <div className="relative shrink-0" aria-hidden="true">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-25 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${elementColor}, transparent 70%)` }}
                  />
                  <span className="relative block text-6xl sm:text-7xl leading-none">{display.emoji}</span>
                </div>
                <div>
                  <p className="label-micro mb-2">Hoy es día</p>
                  <p
                    className="text-5xl sm:text-6xl font-heading font-bold tracking-tight"
                    style={{ color: elementColor }}
                  >
                    {todayNumber.number}
                  </p>
                  <p className="label-micro mt-4 mb-1">Arquetipo del día</p>
                  <p className="text-base sm:text-lg font-heading text-foreground">{todayNumber.title}</p>
                </div>
              </div>
              <div>
                <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                  {activities.join(" · ")}
                </p>
                <Link
                  href="/calendario"
                  className="group mt-6 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase hover:underline underline-offset-4"
                  style={{ color: elementColor }}
                >
                  Ver calendario numerológico
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
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