"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import type { UserProfile } from "@/types/user";
import { safeNumber, getScoreColor, getScoreLabel } from "@/lib/utils/score";
import HeroNew from "@/components/sections/HeroNew";
import SystemsPreview from "@/components/sections/SystemsPreview";
import Journey from "@/components/sections/Journey";
import ConceptsIndex from "@/components/sections/ConceptsIndex";

/* ═══ Main ═══ */

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <HeroNew hasProfile={mounted && !!profile} />
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
          {mounted && profile ? (
            // Solo se monta después de resolver mounted+profile: es un cambio
            // real de rama, así que recibe una entrada sutil.
            <motion.div key="personalized" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              <PersonalizedHome profile={profile} />
            </motion.div>
          ) : (
            // Es la rama que ya pinta el server (mounted=false ahí también),
            // así que nunca debe animar: initial={false} evita el fundido
            // artificial y, al ser una rama condicional simple (no
            // AnimatePresence), React jamás mantiene esta rama montada en
            // paralelo con PersonalizedHome.
            <motion.div key="generic" initial={false} animate={{ opacity: 1, y: 0 }}>
              <GenericHome />
            </motion.div>
          )}
        </main>
        <UniversityFooter />
      </div>
    </div>
  );
}

/* ═══ Generic home (no profile) ═══ */

function GenericHome() {
  return (
    <>
      <SystemsPreview />
      <Journey />
      <ConceptsIndex />
    </>
  );
}

/* ═══ Personalized home (with profile) ═══ */

function PersonalizedHome({ profile }: { profile: UserProfile }) {
  const display = getZodiacDisplay(profile.chineseZodiac ?? "");
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];

  const energy = useMemo(() => calculateDailyEnergy(profile, new Date()), [profile]);

  return (
    <>
      {/* Usuario recurrente: lo primero que ve es lo suyo, no el pitch
          genérico de "qué es Molino" — eso ya lo conoce. */}
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

      <Journey hasProfile />
      <ConceptsIndex />
    </>
  );
}
