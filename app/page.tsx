"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, hoverScale } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import HeroNew from "@/components/sections/HeroNew";
import SystemsPreview from "@/components/sections/SystemsPreview";
import Journey from "@/components/sections/Journey";
import ToolsAndDiscovery from "@/components/sections/ToolsAndDiscovery";
import ConceptsIndex from "@/components/sections/ConceptsIndex";

function Section({ eyebrow, title, subtitle, children, className = "" }: { eyebrow?: string; title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className={`section-spacing ${className}`}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {(eyebrow || title) && (
          <div className="mb-8 sm:mb-10">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-heading uppercase text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.section>
  );
}

/* ═══ Grupo 5: CTA final único ═══ */

function FinalCTA() {
  const router = useRouter();

  return (
    <Section className="!pt-12 !pb-20">
      <div className="relative p-8 sm:p-10 lg:p-12 text-center bg-card">
        <p className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Listo para ver tu perfil completo?</p>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8">
          Identidad, mundo, círculo e inteligencia en un solo lugar.
        </p>
        <motion.button {...hoverScale} type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[48px]">
          Crear mi perfil
        </motion.button>
      </div>
    </Section>
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
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10">
        <UniversityHeader />
        <HeroNew />
        <main className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-28" id="main-content">
          {mounted && profile ? <PersonalizedHome profile={profile} /> : <GenericHome />}
        </main>
        <UniversityFooter />
      </div>
    </div>
  );
}

/* ═══ Generic home (no profile) ═══ */

function GenericHome() {
  const router = useRouter();

  return (
    <>
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
  const router = useRouter();
  const display = getZodiacDisplay(profile.chineseZodiac ?? "");
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const name = typeof profile.name === "string" ? profile.name : "";
  const element = typeof profile.element === "string" ? profile.element : "";

  return (
    <>
      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />

      <Section className="!pt-12 !pb-20">
        <motion.div {...fadeUp} className="p-8 sm:p-10 lg:p-12 text-center">
          <p className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Querés ver el detalle completo?</p>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8">
            Identidad, mundo, círculo e inteligencia en un solo lugar.
          </p>
          <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Ver mi perfil completo
          </motion.button>
        </motion.div>
      </Section>
    </>
  );
}
