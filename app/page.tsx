"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
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
import DatePicker from "@/components/ui/DatePicker";
import { saveSession } from "@/lib/storage/ephemeral";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { IconLock } from "@/components/ui/Icons";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import { markOnboardingCompleted } from "@/lib/storage/discovery";
import { analytics } from "@/lib/analytics/analytics";

const AffinityHub = dynamic(() => import("@/components/sections/AffinityHub"), {
  ssr: true,
  loading: () => <div className="py-20 sm:py-24 lg:py-28 bg-[#EFEBE1]"><div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12"><div className="animate-pulse space-y-4"><div className="h-10 bg-neutral-200 rounded w-32" /><div className="h-12 bg-neutral-200 rounded w-64" /></div></div></div>,
});
const ConceptsIndex = dynamic(() => import("@/components/sections/ConceptsIndex"), {
  ssr: true,
  loading: () => <div className="py-20 sm:py-24 lg:py-28 bg-foreground"><div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12"><div className="animate-pulse space-y-4"><div className="h-10 bg-neutral-800 rounded w-32" /><div className="h-12 bg-neutral-800 rounded w-80" /></div></div></div>,
});

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
  brand: "\u2726", country: "\u25C9", city: "\u25CE", university: "\u2B21", team: "\u25B3", movie: "\u25AB", artist: "\u25CB",
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

/* ═══════════════════════════════════════════════════════════════
   HERO — editorial, full presence, discovery ritual
   ═══════════════════════════════════════════════════════════════ */

function HeroWithForm() {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(getCurrentYear() - 25));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);

   const displayDay = day || "18";
  const displayMonth = month ? MONTHS.find(m => m.value === month)?.label || "ABR" : "ABR";
  const displayYear = year || "1990";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!parsedDay || !parsedMonth || !parsedYear) {
      setError("Seleccion\u00E1 d\u00EDa, mes y a\u00F1o");
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
      setError("Hubo un error. Intent\u00E1 de nuevo.");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden">
       <div className="absolute inset-0 overflow-hidden select-none pointer-events-none" aria-hidden="true">
         <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(6rem,18vw,18rem)] font-serif font-bold leading-none tracking-tighter text-foreground/[0.03] select-none text-right pr-5 sm:pr-8 lg:pr-12 z-0">
           {displayDay}<br/>{displayMonth}<br/>{displayYear}
         </div>
       </div>

       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full py-20 sm:py-28 lg:py-32 relative z-10">
        <motion.div {...fadeUp} className="max-w-4xl mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-6">Inteligencia Personal</p>
          <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl xl:text-[9rem] font-medium tracking-tight text-foreground leading-[0.8] mb-6">
            Tu mapa<br/>personal
          </h1>
          <p className="text-xl sm:text-2xl text-muted max-w-2xl leading-relaxed mb-3">
            Tres sistemas. Una lectura sobre vos.
          </p>
          <p className="text-base sm:text-lg text-muted/60">
            Numerología · Astrología · Zodiaco Chino
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-8 sm:p-10">
            <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">¿Cuándo naciste?</p>
            <p className="text-sm text-muted/60 mb-6">Tu fecha de nacimiento contiene más información de la que imaginás.</p>
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <DatePicker
                   day={day}
                   month={month}
                   year={year}
                   onDayChange={setDay}
                   onMonthChange={setMonth}
                   onYearChange={setYear}
                   daysInMonth={daysInMonth}
                   currentYear={getCurrentYear()}
                 />
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
                {loading ? "Descubriendo..." : "Descubrir mi mapa \u2192"}
              </motion.button>

              <p className="text-[11px] text-muted/40 text-center">Sin registro · Sin guardar datos · Sin rastreo</p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — Los tres sistemas (editorial dark)
   ═══════════════════════════════════════════════════════════════ */

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
  const systems = [
    { num: "01", title: "Numerología", desc: "Los números. Tu estructura interior.", href: "/conocimiento/numerologia", type: "numerologia" },
    { num: "02", title: "Astrología", desc: "El cielo. Tu momento de nacimiento.", href: "/conocimiento/astrologia", type: "astrologia" },
    { num: "03", title: "Zodiaco Chino", desc: "Los ciclos. Tu energía en el tiempo.", href: "/conocimiento/zodiaco-chino", type: "zodiaco-chino" },
  ];
   return (
     <section className="py-20 sm:py-24 lg:py-28 bg-foreground text-background">
       <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
         <motion.div {...fadeUp} className="mb-10 sm:mb-14">
           <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5">Los tres sistemas</p>
           <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0] text-background">
             Una misma persona.<br/>Tres formas de observarla.
           </h2>
         </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/10">
          {systems.map((item, i) => (
            <motion.button
              key={item.num}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              type="button"
              onClick={() => router.push(item.href)}
              className="group relative text-left p-8 sm:p-10 lg:p-14 bg-foreground hover:bg-foreground/95 transition-colors duration-500"
            >
              <span className="block font-serif text-[8rem] sm:text-[10rem] lg:text-[12rem] font-bold leading-none tracking-tighter text-background/[0.04] mb-8 select-none">
                {item.num}
              </span>
              <div className="relative z-10">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-background mb-3 group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                <p className="text-base sm:text-lg text-background/60 leading-relaxed max-w-xs">{item.desc}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-background/40 group-hover:text-background/80 transition-colors duration-300">
                  Explorar
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — Journey horizontal timeline
   ═══════════════════════════════════════════════════════════════ */

function Journey() {
  const items = [
    { num: "01", title: "Descubrí", desc: "Creá tu perfil" },
    { num: "02", title: "Entendé", desc: "Conocé tu mapa" },
    { num: "03", title: "Explorá", desc: "Descubrí tus patrones" },
    { num: "04", title: "Conectá", desc: "Compará con el mundo" },
    { num: "05", title: "Reflexioná", desc: "Tomá perspectiva" },
  ];
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#F7F5EF]">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5">Cómo funciona</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            Un recorrido en cinco pasos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0 items-start">
            {items.map((item, i) => (
              <motion.div
                key={item.num}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center px-2 md:px-6 relative"
              >
                {i < items.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border/50 -translate-x-1/2" aria-hidden="true" />
                )}
                <span className="font-serif text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-accent/15 mb-3 select-none leading-none">{item.num}</span>
                <p className="font-serif text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">{item.title}</p>
                <p className="text-sm sm:text-base text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — Tools regrouped
   ═══════════════════════════════════════════════════════════════ */

function ToolsAndDiscovery() {
  const router = useRouter();
  const { toggleFavorite } = useFavorites();
  const groups = [
    {
      label: "Tu Identidad",
      items: [
        { title: "Camino de Vida", desc: "Tu estructura interior", href: "/herramientas/camino-de-vida" },
        { title: "Signo Solar", desc: "Tu signo zodiacal", href: "/herramientas/signo-solar" },
        { title: "Zodiaco Chino", desc: "Tu animal y elemento", href: "/herramientas/zodiaco-chino" },
        { title: "Número de la Suerte", desc: "Tu número personal", href: "/conocimiento/numerologia" },
      ],
    },
    {
      label: "Tus Relaciones",
      items: [
        { title: "Compatibilidad", desc: "Conectá dos perfiles", href: "/herramientas/compatibilidad" },
      ],
    },
    {
      label: "Tu Mundo",
      items: [
        { title: "Países", desc: "Afinidad simbólica", href: "/affinity/country" },
        { title: "Ciudades", desc: "Destinos por zodiaco", href: "/affinity/city" },
        { title: "Marcas", desc: "Marcas que resuenan", href: "/affinity/brand" },
        { title: "Universidades", desc: "Instituciones por afinidad", href: "/affinity/university" },
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-foreground text-background">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5">Explorá</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0] text-background">
            Más allá de tu mapa
          </h2>
        </motion.div>

         <div className="space-y-14 lg:space-y-20">
          {groups.map((group, groupIndex) => (
            <div key={group.label}>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-background mb-6">
                {group.label}
              </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {group.items.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className={`group text-left rounded-xl border transition-all duration-300 hover:shadow-md h-full ${
                      groupIndex === 0
                        ? "border-accent/20 bg-accent/5 p-6 sm:p-7 hover:border-accent/40"
                        : "border-border/30 bg-card/60 p-6 sm:p-7 hover:border-accent/30 hover:shadow-md"
                    }`}
                  >
                    <p className={`font-serif text-lg sm:text-xl font-semibold mb-2 transition-colors duration-300 ${
                      groupIndex === 0 ? "text-background" : "text-background group-hover:text-accent"
                    }`}>{item.title}</p>
                    <p className="text-sm text-background/50 leading-relaxed">{item.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-background/30 group-hover:text-background/60 transition-colors">
                        <IconLock className="w-3 h-3" />
                        Requiere perfil
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.title); }}
                        className="text-background/30 hover:text-accent transition-colors duration-200"
                        aria-label={`Guardar ${item.title} en favoritos`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-serif text-lg sm:text-xl font-normal text-muted/80 mb-2">
            Todo el contenido está protegido.
          </p>
          <p className="text-sm text-muted/50 mb-8">
            Creá tu perfil para desbloquear todas las herramientas.
          </p>
          <button
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center gap-3 px-10 py-4 text-base font-medium rounded-full bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300"
          >
            Crear mi perfil
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */

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
      <main className="pb-32" id="main-content">
        <GenericHome />
      </main>
      <UniversityFooter />
    </div>
  );
}

/* ═══ Generic home (no profile) ═══ */

function GenericHome() {
  return (
    <>
      <HeroWithForm />
      <SystemsPreview />
      <Journey />
      <AffinityHub />
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
      <section className="py-20 sm:py-28 lg:py-36 bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">Tu mapa personal</p>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-foreground leading-[0.85] mb-6">
              {name ? `Bienvenido/a, ${name}` : `Sos ${display.name}`}
            </h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-base sm:text-lg text-muted mb-8">
              <span>{display.name}</span>
              <span className="text-border/40">·</span>
              <span>{element}</span>
              <span className="text-border/40">·</span>
              <span>{archetype.name}</span>
            </div>
            <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-10 py-5 text-lg bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 min-h-[64px]">
              Ver mi perfil completo \u2192
            </motion.button>
          </motion.div>
        </div>
      </section>

      <SystemsPreview />
      <Journey />
      <AffinityHub />
      <ToolsAndDiscovery />
      <ConceptsIndex />

      <section className="py-24 sm:py-32 bg-background border-t border-border/20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-4 leading-[1.1]">¿Querés ver el detalle completo?</p>
            <p className="text-base sm:text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
              Identidad, mundo, círculo e inteligencia en un solo lugar.
            </p>
            <motion.button {...hoverScale} type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out px-12 py-6 text-lg bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:brightness-110 min-h-[64px]">
              Ver mi perfil completo \u2192
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
