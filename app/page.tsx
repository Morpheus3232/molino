"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
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

/* ═══ CTA final ═══ */

function FinalCTA() {
  const router = useRouter();

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-ink/10"
        >
          <div className="accent-block py-16 sm:py-20 px-8 sm:px-12 lg:px-16 text-center">
            <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] mb-4">
              ¿LISTO PARA DESCUBRIR
              <br />
              TU MAPA PERSONAL?
            </p>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              Identidad, mundo, círculo e inteligencia en un solo lugar.
            </p>
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="btn bg-white text-accent hover:bg-white/90 font-bold text-sm tracking-wider uppercase px-10 py-4"
            >
              DESCUBRIR MI MAPA →
            </button>
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
        <main className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-28" id="main-content">
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

      <section className="bg-background">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <motion.div
            {...fadeUp}
            className="border-t border-ink/10"
          >
            <div className="accent-block py-16 sm:py-20 px-8 sm:px-12 lg:px-16 text-center">
              <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] mb-4">
                ¿QUERÉS VER
                <br />
                TU MAPA COMPLETO?
              </p>
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
                Identidad, mundo, círculo e inteligencia en un solo lugar.
              </p>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="btn bg-white text-accent hover:bg-white/90 font-bold text-sm tracking-wider uppercase px-10 py-4"
              >
                VER MI MAPA COMPLETO →
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
