"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, hoverScale, numberReveal } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import HeroNew from "@/components/sections/HeroNew";

/* ═══ Helpers ═══ */

const scrollReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ═══ Reusable section wrapper ═══ */

function Section({ eyebrow, title, subtitle, children, className = "" }: { eyebrow?: string; title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) {
  return (
    <motion.section {...scrollReveal} className={`section-spacing ${className}`}>
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

/* ═══ Grupo 1: Los tres sistemas ═══ */

function SystemIcon({ type }: { type: string }) {
  if (type === "numerologia") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-accent/40" />
        <path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-accent" />
        <circle cx="24" cy="24" r="2" fill="currentColor" className="text-accent" />
      </svg>
    );
  }
  if (type === "astrologia") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-accent/40" />
        <circle cx="18" cy="18" r="2" fill="currentColor" className="text-accent" />
        <circle cx="30" cy="20" r="1.5" fill="currentColor" className="text-accent" />
        <circle cx="22" cy="30" r="2" fill="currentColor" className="text-accent" />
        <path d="M18 18l12-2M30 20l-8 10M22 30l6-12" stroke="currentColor" strokeWidth="1.2" className="text-accent/70" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true">
      <path d="M24 6c8 10 8 26 0 36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-accent" />
      <path d="M16 14c4 4 6 10 6 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent/60" />
      <path d="M32 14c-4 4-6 10-6 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent/60" />
      <circle cx="24" cy="38" r="2" fill="currentColor" className="text-accent" />
    </svg>
  );
}

function SystemsPreview() {
  const router = useRouter();
  return (
    <Section
      eyebrow="Los tres sistemas"
      title="Una misma persona. Tres formas de observarla."
      subtitle="Numerología, astrología y zodiaco chino combinados en una misma lectura."
      className="relative"
    >
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {[
          { num: "01", title: "Numerología", desc: "El lenguaje de los números", href: "/conocimiento/numerologia", accent: "var(--element-fire)", type: "numerologia" },
          { num: "02", title: "Astrología", desc: "El mapa del cielo de tu nacimiento", href: "/conocimiento/astrologia", accent: "var(--layer-astrology)", type: "astrologia" },
          { num: "03", title: "Zodiaco Chino", desc: "Los ciclos de la energía", href: "/conocimiento/zodiaco-chino", accent: "var(--layer-moment)", type: "zodiaco-chino" },
        ].map((item) => (
          <motion.button
          key={item.num}
          variants={staggerItem}
          type="button"
          onClick={() => router.push(item.href)}
          className="group text-left py-6 border-b border-neutral-200/60 hover:border-accent transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <motion.span {...numberReveal} className="text-[10px] font-mono tracking-[0.25em] text-muted">
              {item.num}
            </motion.span>
            <span className="text-accent/70">{SystemIcon({ type: item.type })}</span>
          </div>
          <p className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{item.title}</p>
          <p className="mt-1 text-sm text-muted leading-relaxed">{item.desc}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
            Explorar <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
          </span>
          </motion.button>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══ Grupo 2: Cómo funciona ═══ */

function Journey() {
  const items = [
    { num: "01", title: "Descubrí", desc: "Creá tu perfil" },
    { num: "02", title: "Entendé", desc: "Conocé tu mapa" },
    { num: "03", title: "Explorá", desc: "Descubrí tus patrones" },
    { num: "04", title: "Conectá", desc: "Compará con el mundo" },
    { num: "05", title: "Reflexioná", desc: "Tomá perspectiva" },
  ];
  return (
    <Section
      eyebrow="Cómo funciona"
      title="Un recorrido en cinco pasos"
      subtitle="De tu fecha de nacimiento a una lectura completa de identidad, patrones y conexiones."
    >
      <motion.div variants={staggerContainer} className="space-y-6 sm:space-y-8">
        {items.map((item) => (
          <motion.div
            key={item.num}
            variants={staggerItem}
            className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8 pb-6 border-b border-neutral-200/60 last:border-b-0"
          >
            <span className="text-sm font-mono tracking-[0.15em] text-muted">
              {item.num}
            </span>
            <div>
              <p className="font-serif text-base sm:text-lg font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══ Grupo 3: Herramientas + descubrimiento compacto ═══ */

function ToolsAndDiscovery() {
  const router = useRouter();
  const calculatorLinks = [
    { title: "Camino de Vida", desc: "Tu número numerológico", href: "/herramientas/camino-de-vida" },
    { title: "Signo Solar", desc: "Tu signo zodiacal", href: "/herramientas/signo-solar" },
    { title: "Zodíaco Chino", desc: "Tu animal y elemento", href: "/herramientas/zodiaco-chino" },
    { title: "Compatibilidad", desc: "Conectá dos perfiles", href: "/herramientas/compatibilidad" },
  ];
  const explorationLinks = [
    { title: "Países", desc: "Afinidad simbólica por país", href: "/affinity/country" },
    { title: "Marcas", desc: "Marcas que resuenan con tu perfil", href: "/affinity/brand" },
    { title: "Universidades", desc: "Instituciones por afinidad", href: "/affinity/university" },
    { title: "Ciudades", desc: "Destinos por zodiaco", href: "/affinity/city" },
  ];

  return (
    <Section
      eyebrow="Explorá"
      title="Herramientas y afinidades"
      subtitle="Accesos directos para seguir investigando tu perfil."
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">Calculá al instante</p>
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-8">
        {calculatorLinks.map((item) => (
          <motion.button
            key={item.href}
            variants={staggerItem}
            type="button"
            onClick={() => router.push(item.href)}
            className="group text-left py-5 border-b border-neutral-200/60 hover:border-accent transition-colors"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{item.title}</p>
            <p className="mt-1 text-xs text-muted leading-relaxed">{item.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">Explorá conexiones</p>
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {explorationLinks.map((item) => (
          <motion.button
            key={item.href}
            variants={staggerItem}
            type="button"
            onClick={() => router.push(item.href)}
            className="group text-left py-5 border-b border-neutral-200/60 hover:border-accent transition-colors"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{item.title}</p>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.desc}</p>
          </motion.button>
        ))}
      </motion.div>
    </Section>
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
