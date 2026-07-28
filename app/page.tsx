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

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

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
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
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

/* ═══ Grupo 4: Conceptos clave ═══ */

function ConceptsIndex() {
  const router = useRouter();
  const concepts = [
    { title: "Arquetipos", href: "/conocimiento/numerologia" },
    { title: "Elementos", href: "/conocimiento/astrologia" },
    { title: "Ciclos", href: "/profile" },
    { title: "Números maestros", href: "/conocimiento/numerologia" },
    { title: "Modalidades", href: "/conocimiento/astrologia" },
    { title: "Compatibilidad", href: "/compatibility/countries" },
  ];
  return (
    <Section
      eyebrow="Conceptos clave"
      title="Una guía para seguir leyendo"
    >
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {concepts.map((concept) => (
          <motion.button
            key={concept.title}
            variants={staggerItem}
            type="button"
            onClick={() => router.push(concept.href)}
            className="group text-left py-5 border-b border-neutral-200/60 hover:border-accent transition-colors"
          >
            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200">{concept.title}</p>
            <span className="mt-1 inline-flex items-center text-xs text-muted group-hover:text-foreground transition-colors duration-200">
              Explorar <span className="ml-1 inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══ Grupo 5: CTA final único ═══ */

function FinalCTA() {
  const router = useRouter();

  return (
    <Section className="!pt-12 !pb-20">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12 text-center bg-cream">
        <p className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Listo para ver tu perfil completo?</p>
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
      <Section className="-mb-4 sm:-mb-6">
        <motion.div {...fadeUp} className="py-8 sm:py-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu mapa personal</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            {name ? `Bienvenido/a, ${name}` : `Sos ${display.name}`}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
            {display.emoji} {display.name} · {element} · {archetype.name}
          </p>
          <div className="mt-5">
            <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="btn-primary transition-all duration-200 ease-out hover:shadow-sm">
              Ver mi perfil completo
            </motion.button>
          </div>
        </motion.div>
      </Section>

      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />

      <Section className="!pt-12 !pb-20">
        <motion.div {...fadeUp} className="p-8 sm:p-10 lg:p-12 text-center">
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Querés ver el detalle completo?</p>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8">
            Identidad, mundo, círculo e inteligencia en un solo lugar.
          </p>
          <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="btn-primary transition-all duration-200 ease-out hover:shadow-sm">
            Ver mi perfil completo
          </motion.button>
        </motion.div>
      </Section>
    </>
  );
}
