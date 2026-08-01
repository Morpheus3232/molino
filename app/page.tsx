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
import { safeNumber, getScoreColor } from "@/lib/utils/score";
import Button from "@/components/ui/Button";
import HeroNew from "@/components/sections/HeroNew";
import SystemsPreview from "@/components/sections/SystemsPreview";
import Journey from "@/components/sections/Journey";
import ToolsAndDiscovery from "@/components/sections/ToolsAndDiscovery";
import ConceptsIndex from "@/components/sections/ConceptsIndex";
import DecisionEntryPrompt from "@/components/sections/DecisionEntryPrompt";

/** Mismo criterio que /hoy — la energía se lee como nivel, no como score. */
function getEnergyLevel(score: number): string {
  if (score >= 75) return "ALTA";
  if (score >= 55) return "MEDIA";
  return "BAJA";
}

// Feature flag — paso 1 del roadmap de PRODUCT-BREAKTHROUGH.md (sección 19,
// "Semanas 1-2"). Controla si la home de un usuario NUEVO (sin perfil
// guardado) muestra la pregunta de entrada "¿Qué te trae por acá hoy?" antes
// del contenido genérico de siempre. En false, la home no cambia en nada.
const DECISION_FIRST_HOME_ENABLED = false;

/* ═══ CTA final ═══ */

function FinalCTA() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-ink/10"
        >
          <div className="accent-block py-16 px-8 sm:px-12 lg:px-16 text-center">
            <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] mb-4">
              ¿LISTO PARA DESCUBRIR
              <br />
              TU MAPA PERSONAL?
            </p>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              Identidad, mundo, círculo e inteligencia en un solo lugar.
            </p>
            <Button asChild variant="inverse" size="lg">
              <Link href="/onboarding" aria-label="Descubrir mi mapa personal: ir al onboarding">
                DESCUBRIR MI MAPA →
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
        <HeroNew />
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
          {mounted && profile ? <PersonalizedHome profile={profile} /> : <GenericHome />}
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
      {DECISION_FIRST_HOME_ENABLED && <DecisionEntryPrompt />}
      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />
      <FinalCTA />
    </>
  );
}

/* ═══ Personalized home (with profile) ═══ */

function PersonalizedHome({ profile }: { profile: UserProfile }) {
  const display = getZodiacDisplay(profile.chineseZodiac ?? "");
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const name = typeof profile.name === "string" ? profile.name : "";
  const element = typeof profile.element === "string" ? profile.element : "";

  const energy = useMemo(() => calculateDailyEnergy(profile, new Date()), [profile]);

  return (
    <>
      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />

      {energy && (
        <section className="bg-background">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...fadeUp} className="border-t border-ink/10 py-16">
              <div className="text-center mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu energía de hoy</p>
                <Link
                  href="/hoy"
                  className="group inline-flex items-center gap-3"
                >
                  <span className={`text-5xl sm:text-6xl font-heading font-bold tracking-tight ${getScoreColor(energy.overallScore)}`}>
                    {getEnergyLevel(energy.overallScore)}
                  </span>
                  <span className="text-xs font-mono tracking-wider text-muted group-hover:text-accent transition-colors">
                    VER DETALLE →
                  </span>
                </Link>
                <p className="text-lg font-heading text-foreground mt-4">{energy.theme}</p>
                <p className="text-sm text-muted mt-2 max-w-lg mx-auto">{energy.description}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div
            {...fadeUp}
            className="border-t border-ink/10"
          >
            <div className="accent-block py-16 px-8 sm:px-12 lg:px-16 text-center">
              <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] mb-4">
                ¿QUERÉS VER
                <br />
                TU MAPA COMPLETO?
              </p>
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
                Identidad, mundo, círculo e inteligencia en un solo lugar.
              </p>
              <Button asChild variant="inverse" size="lg">
                <Link href="/profile">VER MI MAPA COMPLETO →</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
