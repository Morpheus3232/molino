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
  const yearOptions = useMemo(() => Array.from({ length: 100 }, (_, i) => getCurrentYear() - i), []);

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
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(6rem,18vw,18rem)] font-serif font-bold leading-none tracking-tighter text-foreground/[0.03] select-none text-right pr-5 sm:pr-8 lg:pr-12">
          {displayDay}<br/>{displayMonth}<br/>{displayYear}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full py-20 sm:py-28 lg:py-32">
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-2.5">Día</p>
                  <div className="relative">
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      id="birth-day"
                      name="day"
                      className="w-full appearance-none px-4 py-4 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:border-accent min-h-[56px] font-serif transition-all duration-200 ease-out"
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
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-2.5">Mes</p>
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      id="birth-month"
                      name="month"
                      className="w-full appearance-none px-4 py-4 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:border-accent min-h-[56px] font-serif transition-all duration-200 ease-out"
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
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-2.5">Año</p>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      id="birth-year"
                      name="year"
                      className="w-full appearance-none px-4 py-4 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:border-accent min-h-[56px] font-serif transition-all duration-200 ease-out"
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
    <section className="py-24 sm:py-32 lg:py-40 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">Los tres sistemas</p>
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
    <section className="py-24 sm:py-32 lg:py-40 bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">Cómo funciona</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            Un recorrido en cinco pasos
          </h2>
        </motion.div>

        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[54px] h-px bg-border/60" aria-hidden="true" />
            <div className="grid grid-cols-5 gap-0 relative">
              {items.map((item, i) => (
                <motion.div
                  key={item.num}
                  {...fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center px-4 lg:px-8"
                >
                  <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-accent/[0.07] mb-2 select-none leading-none">{item.num}</span>
                  <div className="relative z-10 w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-5 border border-accent/20">
                    <span className="text-lg font-bold text-accent">{item.num}</span>
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">{item.title}</p>
                  <p className="text-sm sm:text-base text-muted leading-relaxed max-w-[180px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" aria-hidden="true" />
          <div className="space-y-10">
            {items.map((item, i) => (
              <motion.div
                key={item.num}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="relative pl-16"
              >
                <div className="absolute left-3 top-1 z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-foreground">{item.num}</span>
                </div>
                <p className="font-serif text-xl font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — Affinity visual hub
   ═══════════════════════════════════════════════════════════════ */

function AffinityHub() {
  const router = useRouter();
  const spokes = [
    { label: "Países", href: "/affinity/country", desc: "Descubrí con qué países resuena tu energía" },
    { label: "Ciudades", href: "/affinity/city", desc: "Destinos alineados con tu perfil" },
    { label: "Marcas", href: "/affinity/brand", desc: "Marcas que vibran en tu misma frecuencia" },
  ];
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-background border-t border-border/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">Conexiones</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            ¿Con qué resonás?
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-foreground flex items-center justify-center shadow-xl">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-background tracking-tight">Tu</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {spokes.map((spoke) => (
                <button
                  key={spoke.label}
                  type="button"
                  onClick={() => router.push(spoke.href)}
                  className="group text-left rounded-2xl border border-border bg-card/60 p-6 sm:p-7 transition-all duration-300 hover:border-accent/30 hover:shadow-lg h-full"
                >
                  <p className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{spoke.label}</p>
                  <p className="text-sm text-muted leading-relaxed">{spoke.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted/60 group-hover:text-foreground transition-colors">
                    Explorar
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted/50 text-center lg:text-left">Creá tu perfil para descubrir tus conexiones personales.</p>
          </div>
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
    <section className="py-24 sm:py-32 lg:py-40 bg-background border-t border-border/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">Explorá</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            Más allá de tu mapa
          </h2>
        </motion.div>

        {groups.map((group) => (
          <div key={group.label} className="mb-12 sm:mb-16 last:mb-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted/50 font-medium mb-6">{group.label}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {group.items.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="group text-left rounded-2xl border border-border bg-card/60 p-6 sm:p-7 transition-all duration-300 hover:border-accent/30 hover:shadow-lg h-full"
                >
                  <p className="text-base sm:text-lg font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — Library (dark)
   ═══════════════════════════════════════════════════════════════ */

function ConceptsIndex() {
  const router = useRouter();
  const entries = [
    { title: "Arquetipos", desc: "Los patrones universales de la personalidad", href: "/conocimiento/numerologia" },
    { title: "Ciclos", desc: "Los ritmos de tu año personal", href: "/profile" },
    { title: "Elementos", desc: "Las energías que te componen", href: "/conocimiento/astrologia" },
  ];
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-5">La Biblioteca</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0] text-background">
            Una guía para entender el lenguaje detrás de tu mapa.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/10 mb-14 sm:mb-16">
          {entries.map((entry, i) => (
            <motion.button
              key={entry.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              type="button"
              onClick={() => router.push(entry.href)}
              className="group text-left p-8 sm:p-10 lg:p-12 bg-foreground hover:bg-foreground/95 transition-colors duration-500"
            >
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-background mb-3 group-hover:text-accent transition-colors duration-300">{entry.title}</p>
              <p className="text-base sm:text-lg text-background/60 leading-relaxed max-w-sm">{entry.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-background/40 group-hover:text-background/80 transition-colors duration-300">
                Explorar
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div {...fadeUp} className="text-center">
          <button
            type="button"
            onClick={() => router.push("/biblioteca")}
            className="inline-flex items-center gap-2 text-sm font-medium text-background/50 hover:text-background transition-colors duration-200"
          >
            Ver toda la biblioteca
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
          </button>
        </motion.div>
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
