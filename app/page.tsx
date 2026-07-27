"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, staggerSection, staggerCard, numberReveal, hoverLift, hoverScale } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Grainient from "@/components/Grainient";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import {
  buildPersonalRecommendations,
  hasPositiveAffinity,
} from "@/lib/engines/personalRecommendationEngine";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import {
  getDayRule,
  YEAR_2026,
  getDayActivity,
  getUpcomingDayActivities,
  getNextDayByCategory,
  type DayActivity,
} from "@/lib/data/symbolic-rules";
import type { UserProfile } from "@/types/user";
import type { PersonalRecommendation } from "@/lib/engines/personalRecommendationEngine";
import { safeNumber } from "@/lib/utils/score";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import { markOnboardingCompleted } from "@/lib/storage/discovery";
import { analytics } from "@/lib/analytics/analytics";

/* ═══ Helpers ═══ */

function formatTodayDate(): string {
  return new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-300";
  if (score >= 55) return "text-sky-300";
  if (score >= 40) return "text-amber-300";
  return "text-rose-300";
}

type IconProps = React.SVGProps<SVGSVGElement>;

const IconBase: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props} />
);

const ENTITY_TYPE_ICONS: Record<string, string> = {
  brand: "✦", country: "◉", city: "◎", university: "⬡", team: "△", movie: "▫", artist: "○",
};

const MONTHS = [
  { value: "01", label: "Ene" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Abr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Ago" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dic" },
];

const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => getCurrentYear() - i);

function getCurrentYear(): number {
  return new Date().getFullYear();
}

const getDaysInMonth = (month: string, year: string): number => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!m || !y) return 31;
  return new Date(y, m, 0).getDate();
}

/* ═══ Reusable section wrapper ═══ */

function Section({ eyebrow, title, subtitle, children, className = "" }: { eyebrow?: string; title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) {
  return (
    <motion.section {...fadeUp} className={`mb-20 sm:mb-32 ${className}`}>
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

/* ═══ Grupo 0: Hero + onboarding inline ═══ */

function HeroWithForm() {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(getCurrentYear() - 25));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
  const yearOptions = useMemo(() => Array.from({ length: 100 }, (_, i) => getCurrentYear() - i), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!parsedDay || !parsedMonth || !parsedYear) {
      setError("Seleccioná día, mes y año");
      setLoading(false);
      return;
    }

    try {
      const birthDate = `${parsedYear}-${String(parsedMonth).padStart(2, "0")}-${String(parsedDay).padStart(2, "0")}`;
      const calculated = calculateUserProfile("", birthDate);
      const newProfile: UserProfile = {
        ...calculated,
        birthPlace: "",
        birthTime: undefined,
        goal: "life",
        interests: [],
        onboardingStep: 1,
        completedSections: ["identity"],
        theme: "light",
        language: "es",
        notifications: true,
      };

      saveSession({
        name: newProfile.name,
        birthDate: newProfile.birthDate,
        birthPlace: newProfile.birthPlace,
        birthTime: newProfile.birthTime,
        goal: newProfile.goal,
        interests: newProfile.interests,
        onboardingStep: newProfile.onboardingStep,
        completedSections: newProfile.completedSections,
        theme: newProfile.theme,
        language: newProfile.language,
        notifications: newProfile.notifications,
      });
      saveProfileToStorage(newProfile);
      window.dispatchEvent(new Event("molino-profile-created"));
      markOnboardingCompleted();
      analytics.trackProfileCreated(newProfile);

      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Hubo un error. Intentá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <Section className="-mt-4 sm:-mt-6 py-16 sm:py-20 lg:py-24">
      <div className="rounded-3xl border border-border bg-card/60 p-8 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Value prop */}
          <motion.div {...fadeUp}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Inteligencia Personal</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[0.95] mb-6">
              Descubrí tu mapa
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-xl leading-relaxed mb-8">
              Tu mapa personal revela quién sos a partir de tu fecha de nacimiento.
            </p>
            <p className="text-xs text-muted">
              Sin registro. Sin guardar datos personales.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }} className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Día</p>
                  <div className="relative">
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      id="birth-day"
                      name="day"
                      className="w-full appearance-none px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px] font-serif transition-all duration-200 ease-out"
                      required
                      aria-label="Día"
                    >
                      <option value="">Día</option>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={String(d)}>{d}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Mes</p>
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      id="birth-month"
                      name="month"
                      className="w-full appearance-none px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px] font-serif transition-all duration-200 ease-out"
                      required
                      aria-label="Mes"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Año</p>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      id="birth-year"
                      name="year"
                      className="w-full appearance-none px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px] font-serif transition-all duration-200 ease-out"
                      required
                      aria-label="Año"
                    >
                      <option value="">Año</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500">
                  {error}
                </motion.p>
              )}

              <motion.button
                {...hoverScale}
                type="submit"
                disabled={loading || !day || !month || !year}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-10 py-5 text-lg bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 min-h-[64px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Descubriendo..." : "Descubrir mi mapa →"}
              </motion.button>

              {!(day && month && year) && (
                <p className="text-[11px] text-muted text-center">Completá los 3 campos para continuar</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </Section>
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
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <motion.div {...staggerSection} className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {[
          { num: "01", title: "Numerología", desc: "El lenguaje de los números", href: "/conocimiento/numerologia", accent: "var(--element-fire)", type: "numerologia" },
          { num: "02", title: "Astrología", desc: "El mapa del cielo de tu nacimiento", href: "/conocimiento/astrologia", accent: "var(--layer-astrology)", type: "astrologia" },
          { num: "03", title: "Zodiaco Chino", desc: "Los ciclos de la energía", href: "/conocimiento/zodiaco-chino", accent: "var(--layer-moment)", type: "zodiaco-chino" },
        ].map((item) => (
          <motion.button
            key={item.num}
            {...staggerCard}
            {...hoverLift}
            type="button"
            onClick={() => router.push(item.href)}
            className="group relative text-left rounded-2xl border border-border bg-card/60 p-6 sm:p-8 transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-xl h-full"
          >
            <div className="flex items-center justify-between mb-5">
              <motion.span {...numberReveal} className="text-[10px] font-mono tracking-[0.25em] text-muted">
                {item.num}
              </motion.span>
              <span className="text-accent/90">{SystemIcon({ type: item.type })}</span>
            </div>
            <p className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{item.title}</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">{item.desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-muted group-hover:text-foreground transition-colors">
              Explorar
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
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
      subtitle="De los datos de tu nacimiento a una lectura integrada de identidad, patrones y relaciones."
      className="relative"
    >
      <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-px bg-border/70" aria-hidden="true" />
      <motion.div {...staggerSection} className="space-y-8 sm:space-y-10">
        {items.map((item) => (
          <motion.div
            key={item.num}
            {...staggerCard}
            className="relative grid grid-cols-[auto_1fr] gap-6 sm:gap-10"
          >
            <motion.div {...numberReveal} className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-bold shadow-md">
              {item.num}
            </motion.div>
            <div className="pb-1">
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
  const primaryTools = [
    { title: "Camino de Vida", desc: "Tu número numerológico", href: "/herramientas/camino-de-vida" },
    { title: "Signo Solar", desc: "Tu signo zodiacal", href: "/herramientas/signo-solar" },
    { title: "Zodíaco Chino", desc: "Tu animal y elemento", href: "/herramientas/zodiaco-chino" },
    { title: "Compatibilidad", desc: "Conectá dos perfiles", href: "/herramientas/compatibilidad" },
  ];
  const secondaryTools = [
    { title: "Número de la Suerte", desc: "Tu número personal", href: "/conocimiento/numerologia" },
    { title: "Países", desc: "Afinidad simbólica", href: "/affinity/country" },
    { title: "Marcas", desc: "Marcas que resuenan", href: "/affinity/brand" },
    { title: "Universidades", desc: "Instituciones por afinidad", href: "/affinity/university" },
    { title: "Ciudades", desc: "Destinos por zodiaco", href: "/affinity/city" },
  ];

  return (
    <Section
      eyebrow="Explorá"
      title="Herramientas y afinidades"
      subtitle="Accesos directos para seguir investigando tu perfil."
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {primaryTools.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className="group text-left rounded-2xl border border-accent/15 bg-card/80 p-5 sm:p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg h-full"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</p>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {secondaryTools.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className="group text-left rounded-xl border border-border bg-card/40 p-3 sm:p-4 transition-all duration-200 hover:border-foreground/15 hover:bg-card/60 h-full"
          >
            <p className="text-xs font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</p>
            <p className="mt-1 text-[11px] text-muted leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>
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
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <motion.div {...staggerSection} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {concepts.map((concept) => (
          <motion.button
            key={concept.title}
            {...staggerCard}
            {...hoverLift}
            type="button"
            onClick={() => router.push(concept.href)}
            className="group text-left rounded-2xl border border-border bg-card/60 p-4 sm:p-5 transition-all duration-200 ease-out hover:border-foreground/15 hover:bg-card h-full"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{concept.title}</p>
            <span className="mt-2 inline-flex items-center text-xs text-muted group-hover:text-foreground transition-colors duration-200">
              Explorar
              <span className="ml-1.5 inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══ Main ═══ */

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Grainient
        timeSpeed={0.12}
        contrast={1.15}
        grainAmount={0.06}
        grainScale={2.5}
        zoom={1.3}
        warpAmplitude={35}
        warpFrequency={4}
        blendSoftness={0.08}
      />
      <UniversityHeader />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-28" id="main-content">
        <GenericHome />
      </main>
      <UniversityFooter />
    </div>
  );
}

/* ═══ Generic home (no profile) ═══ */

function GenericHome() {
  const router = useRouter();

  return (
    <>
      <HeroWithForm />

      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />
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
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 sm:p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu mapa personal</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            {name ? `Bienvenido/a, ${name}` : `Sos ${display.name}`}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
            {display.emoji} {display.name} · {element} · {archetype.name}
          </p>
          <div className="mt-5">
            <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-10 py-5 text-lg bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 min-h-[64px]">
              Ver mi perfil completo
            </motion.button>
          </div>
        </motion.div>
      </Section>
      
      <SystemsPreview />
      <Journey />
      <ToolsAndDiscovery />
      <ConceptsIndex />

      <Section className="pb-10">
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-b from-accent/[0.04] to-background p-8 sm:p-10 lg:p-12 text-center">
          <div
            className="absolute inset-0 -z-10 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(212,168,67,0.25) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Querés ver el detalle completo?</p>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8">
            Identidad, mundo, círculo e inteligencia en un solo lugar.
          </p>
          <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-10 py-5 text-lg bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 min-h-[64px]">
            Ver mi perfil completo
          </motion.button>
        </motion.div>
      </Section>
    </>
  );
}
