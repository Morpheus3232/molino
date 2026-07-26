"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import {
  buildPersonalRecommendations,
  hasPositiveAffinity,
} from "@/lib/engines/personalRecommendationEngine";
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

function getEnergyIcon(score: number): React.ReactNode {
  if (score >= 75) return <IconBase className="text-3xl"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" /></IconBase>;
  if (score >= 55) return <IconBase className="text-3xl"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></IconBase>;
  if (score >= 40) return <IconBase className="text-3xl"><circle cx="12" cy="12" r="10" /></IconBase>;
  return <IconBase className="text-3xl"><circle cx="12" cy="12" r="10" strokeDasharray="4 4" /></IconBase>;
}

function getEnergyCopy(score: number, theme: string): { title: string; detail: string } {
  if (score >= 75) {
    return {
      title: "Tu energía hoy está en su punto más alto",
      detail: `Con ${score}/100, tu energía favorece la acción y la toma de decisiones. Tema del día: ${theme}.`,
    };
  }
  if (score >= 55) {
    return {
      title: `Hoy tu energía es ${theme || "equilibrada"}`,
      detail: `Con ${score}/100, es un buen momento para avanzar en lo que tenés entre manos.`,
    };
  }
  return {
    title: "Hoy es un día para pausar y observar",
    detail: `Con ${score}/100, tu energía favorece la reflexión. Aprovechá para revisar tus patrones.`,
  };
}

type IconProps = React.SVGProps<SVGSVGElement>;

const IconBase: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props} />
);

const ENTITY_TYPE_ICONS: Record<string, string> = {
  brand: "✦", country: "◉", city: "◎", university: "⬡", team: "△", movie: "▫", artist: "○",
};

/* ═══ Reusable section wrapper ═══ */

function Section({ eyebrow, title, subtitle, children, className = "" }: { eyebrow?: string; title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) {
  return (
    <motion.section {...fadeUp} className={`mb-20 sm:mb-28 ${className}`}>
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

/* ═══ Grupo 1: Hero + energía consolidada ═══ */

function DailyEnergyHero({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const energy = useMemo(() => calculateDailyEnergy(profile, today), [profile, today]);
  const dayRule = useMemo(() => getDayRule(energy.personalDay), [energy.personalDay]);
  const energyCopy = getEnergyCopy(energy.overallScore, energy.theme);
  const todayStr = useMemo(() => formatTodayDate(), []);
  const display = getZodiacDisplay(profile.chineseZodiac ?? "");
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const name = typeof profile.name === "string" ? profile.name : "";
  const element = typeof profile.element === "string" ? profile.element : "";

  return (
    <Section className="-mb-4 sm:-mb-6">
      <div className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
          {/* Bienvenida */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu mapa personal</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              {name ? `Bienvenido/a, ${name}` : `Sos ${display.name}`}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
              {display.emoji} {display.name} · {element} · {archetype.name}
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => router.push("/profile")} className="btn-primary transition-all duration-200 hover:shadow-md">
                Ver mi perfil completo
              </button>
              <button type="button" onClick={() => router.push("/explore")} className="btn-secondary transition-all duration-200 hover:shadow-md">
                Explorar Molino
              </button>
            </div>
          </div>

          {/* Energía de hoy - consolidada */}
          <div className="w-full lg:w-[380px] shrink-0 rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">{todayStr}</p>
                <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground">{energyCopy.title}</p>
              </div>
              <span className="shrink-0 mt-1">{getEnergyIcon(energy.overallScore)}</span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`font-serif text-3xl sm:text-4xl font-bold ${getScoreColor(energy.overallScore)}`}>
                {energy.overallScore}
              </span>
              <span className="text-muted text-sm">/100</span>
              <span className="text-xs text-muted ml-2">Día {energy.personalDay} · {energy.theme}</span>
            </div>

            <p className="text-sm text-muted leading-relaxed mb-5">{energyCopy.detail}</p>

            {dayRule && (
              <div className="border-t border-border pt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Hoy favorece</p>
                <div className="flex flex-wrap gap-2">
                  {dayRule.favors.map((f) => (
                    <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">{f}</span>
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2 mt-3">Evitá</p>
                <div className="flex flex-wrap gap-2">
                  {dayRule.watchOut.map((w) => (
                    <span key={w} className="text-xs px-3 py-1.5 rounded-full bg-background text-muted font-medium border border-border">{w}</span>
                  ))}
                </div>
              </div>
            )}

            {energy.overallScore >= 65 && (
              <p className="mt-3 text-xs text-muted">Es un buen momento para combinar ambas energías.</p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══ Grupo 2: Timeline / Calendario unificado ═══ */

function UnifiedCalendar({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const dayOfMonth = today.getDate();
  const todayActivity = useMemo(() => getDayActivity(dayOfMonth), [dayOfMonth]);
  const upcoming = useMemo(() => getUpcomingDayActivities(today, 5), [today]);
  const nextByCategory = useMemo(() => getNextDayByCategory(today), []);
  const todayStr = useMemo(() => formatTodayDate(), []);

  const categories = Object.entries({
    "Negocios y dinero": { icon: "◈", label: "Negocios y dinero" },
    "Comunicación": { icon: "❖", label: "Comunicarte" },
    "Ley y orden": { icon: "⬡", label: "Orden, trámites y estructura" },
    "Viajes y movimiento": { icon: "△", label: "Viajar o salir" },
    "Hogar y familia": { icon: "◇", label: "Hogar y familia" },
    "Nuevos comienzos": { icon: "○", label: "Empezar algo nuevo" },
    "Estudio y aprendizaje": { icon: "□", label: "Estudio y aprendizaje" },
  });

  const intentEntries = categories
    .map(([category, meta]) => {
      const next = nextByCategory[category];
      if (!next) return null;
      return { label: `${meta.label} · día ${next.day}`, icon: meta.icon, date: next.date };
    })
    .filter(Boolean) as { label: string; icon: string; date: Date }[];

  const hasCalendar = Boolean(todayActivity) || upcoming.length > 0 || intentEntries.length > 0;

  if (!hasCalendar) return null;

  return (
    <Section eyebrow="Calendario simbólico" title="Próximos días y momentos recomendados" subtitle="Una sola vista para ver el momento actual, los próximos días destacados y las mejores fechas por intención.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Hoy + próximos días */}
        <div className="space-y-4">
          {todayActivity && (
            <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">{todayStr}</p>
              <p className="font-serif text-xl font-semibold text-foreground">{todayActivity.category}</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">{todayActivity.description}</p>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Buen momento para</p>
                <div className="flex flex-wrap gap-2">
                  {todayActivity.favors.map((f) => (
                    <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Próximos días destacados</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcoming.filter(a => a.day !== dayOfMonth).slice(0, 4).map((activity) => (
                  <div key={`${activity.day}-${activity.category}`} className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base shrink-0">{activity.icon}</span>
                      <p className="text-sm font-medium text-foreground">
                        {activity.day} — {activity.category}
                      </p>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Días clave por intención */}
        {intentEntries.length > 0 && (
          <div className="rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Días clave por intención</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intentEntries.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-base text-muted">{item.icon}</span>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </div>
                  <span className="text-xs text-muted tabular-nums">
                    {item.date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button type="button" onClick={() => router.push("/timing")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.04] text-accent hover:bg-accent/10 min-h-[44px]">
          Ver calendario completo →
        </button>
      </div>
    </Section>
  );
}

/* ═══ Grupo 3: Descubrimiento unificado ═══ */

function DiscoveryUnified({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const recMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const positiveRecs = useMemo(() => recMap.recommendations.filter(r => hasPositiveAffinity(r.priority)), [recMap]);

  const topResonances: PersonalRecommendation[] = useMemo(() => {
    const sameAnimalFirst = positiveRecs
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 3);
    if (sameAnimalFirst.length >= 3) return sameAnimalFirst;
    const others = positiveRecs
      .filter(r => r.entityAnimal !== userAnimal)
      .slice(0, 3 - sameAnimalFirst.length);
    return [...sameAnimalFirst, ...others];
  }, [positiveRecs, userAnimal]);

  const discovery = positiveRecs[1] ?? null;
  const luckyNumber = profile.luckyNumber;
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];

  return (
    <Section title="Descubrí más sobre vos">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Afinidades */}
        {topResonances.length > 0 && (
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Afinidades relevantes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topResonances.map((rec) => (
                <button
                  key={rec.entity.id}
                  type="button"
                  onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
                  className="card-list text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{rec.entity.emoji || ENTITY_TYPE_ICONS[rec.entity.type] || "✦"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{rec.entity.name}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">{rec.explanation}</p>
                    </div>
                    <span className="text-xs text-muted group-hover:text-foreground transition-colors mt-1 shrink-0">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Columna lateral: próximo descubrimiento + número suerte */}
        <div className="space-y-4">
          {discovery && (
            <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu próximo descubrimiento</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{discovery.entity.emoji || "◈"}</span>
                <p className="text-sm font-medium text-foreground">{discovery.entity.name}</p>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-4">{discovery.explanation}</p>
              <button type="button" onClick={() => router.push(`/affinity/${discovery.entity.type}/${discovery.entity.id}`)} className="inline-flex items-center text-xs font-medium text-accent hover:underline">
                Explorar →
              </button>
            </div>
          )}

          {luckyNumber != null && (
            <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu número de la suerte</p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{luckyNumber}</span>
                <span className="text-xs text-muted">Camino {safeNumber(profile.lifePath, 0)}</span>
              </div>
              <p className="mt-2 text-xs text-muted">{archetype.name} — {archetype.description}</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ═══ Grupo 4: CTA final único ═══ */

function FinalCTA() {
  const router = useRouter();

  return (
    <Section className="pb-10">
      <div className="rounded-3xl border border-border bg-card/60 p-8 sm:p-10 lg:p-12 text-center">
        <p className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">¿Querés ver el detalle completo?</p>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-8">
          Identidad, mundo, círculo e inteligencia en un solo lugar.
        </p>
        <button type="button" onClick={() => router.push("/profile")} className="btn-primary transition-all duration-200 hover:shadow-md">
          Ver mi perfil completo
        </button>
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
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-28" id="main-content">
        {mounted && profile ? (
          <>
            <DailyEnergyHero profile={profile} />
            <UnifiedCalendar profile={profile} />
            <DiscoveryUnified profile={profile} />
            <FinalCTA />
          </>
        ) : (
          <GenericHome />
        )}
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
      <Section className="-mb-4 sm:-mb-6">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Inteligencia Personal</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              Conocé tu mapa.
              <br />
              <span className="text-muted">Entendé tus patrones.</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
              Una síntesis de numerología, astrología y zodiaco chino para explorar tus patrones, ciclos y conexiones.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-7 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[48px]">
              Crear mi perfil
            </button>
            <button type="button" onClick={() => router.push("/explore")} className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-7 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent min-h-[48px]">
              Explorar Molino
            </button>
          </div>
        </div>
      </Section>

      <SymbolicCalendarSection />
      <SystemsPreview />
      <Journey />
      <ToolsGrid />
      <AffinityExplore />
      <ConceptsIndex />

      <Section className="pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
          <div>
            <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">Tu mapa es el comienzo.</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">Creá tu perfil personal y explorá las conexiones entre identidad, patrones, timing y decisiones.</p>
          </div>
          <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Crear mi perfil
          </button>
        </div>
      </Section>
    </>
  );
}

/* ═══ Componentes genéricos para home sin perfil ═══ */

function SymbolicCalendarSection() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const dayOfMonth = today.getDate();
  const todayActivity = useMemo(() => getDayActivity(dayOfMonth), [dayOfMonth]);
  const upcoming = useMemo(() => getUpcomingDayActivities(today, 5), [today]);

  return (
    <Section
      eyebrow="¿Qué representa hoy?"
      subtitle="Cada día tiene una energía simbólica diferente. Descubrí qué días son mejores para empezar algo nuevo, viajar, estudiar, hacer negocios o dedicar tiempo a tu familia."
    >
      {todayActivity && (
        <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">
                {formatTodayDate()} — Día {dayOfMonth}
              </p>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                {todayActivity.category}
              </p>
              <p className="mt-3 text-sm text-muted leading-relaxed">{todayActivity.description}</p>

              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Buen momento para</p>
                <div className="flex flex-wrap gap-2">
                  {todayActivity.favors.map((f) => (
                    <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Próximos días destacados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcoming.filter(a => a.day !== dayOfMonth).slice(0, 4).map((activity) => (
              <div key={`${activity.day}-${activity.category}`} className="rounded-xl border border-border bg-card/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base shrink-0">{activity.icon}</span>
                  <p className="text-sm font-medium text-foreground">
                    {activity.day} — {activity.category}
                  </p>
                </div>
                <p className="text-xs text-muted leading-relaxed">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <button type="button" onClick={() => router.push("/timing")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.04] text-accent hover:bg-accent/10 min-h-[44px]">
          Ver calendario completo →
        </button>
      </div>
    </Section>
  );
}

function SystemsPreview() {
  const router = useRouter();
  return (
    <Section
      eyebrow="Los tres sistemas"
      title="Una misma persona. Tres formas de observarla."
      subtitle="Numerología, astrología y zodiaco chino combinados en una misma lectura."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {[
          { num: "01", title: "Numerología", desc: "El lenguaje de los números", href: "/conocimiento/numerologia", accent: "var(--element-fire)" },
          { num: "02", title: "Astrología", desc: "El mapa del cielo de tu nacimiento", href: "/conocimiento/astrologia", accent: "var(--layer-astrology)" },
          { num: "03", title: "Zodiaco Chino", desc: "Los ciclos de la energía", href: "/conocimiento/zodiaco-chino", accent: "var(--layer-moment)" },
        ].map((item) => (
          <button
            key={item.num}
            type="button"
            onClick={() => router.push(item.href)}
            className="group relative text-left rounded-2xl border border-border bg-card/60 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
          >
            <span className="text-[10px] font-mono tracking-[0.25em] text-muted">{item.num}</span>
            <p className="mt-4 font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">{item.desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-accent">
              Explorar
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}

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
      <div className="relative">
        <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-px bg-border/70" aria-hidden="true" />
        <div className="space-y-8 sm:space-y-10">
          {items.map((item) => (
            <div key={item.num} className="relative grid grid-cols-[auto_1fr] gap-6 sm:gap-10">
              <div className="relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-background text-[11px] font-mono tracking-[0.2em] text-muted">
                {item.num}
              </div>
              <div className="pb-1">
                <p className="font-serif text-base sm:text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ToolsGrid() {
  const router = useRouter();
  const tools = [
    { title: "Camino de Vida", desc: "Tu número numerológico", href: "/herramientas/camino-de-vida" },
    { title: "Signo Solar", desc: "Tu signo zodiacal", href: "/herramientas/signo-solar" },
    { title: "Zodíaco Chino", desc: "Tu animal y elemento", href: "/herramientas/zodiaco-chino" },
    { title: "Compatibilidad", desc: "Conectá dos perfiles", href: "/herramientas/compatibilidad" },
  ];
  return (
    <Section
      eyebrow="Calculá tu identidad"
      title="Herramientas directas"
      subtitle="Sin registro. Sin guardar datos. Resultado inmediato."
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tools.map((tool) => (
          <button
            key={tool.href}
            type="button"
            onClick={() => router.push(tool.href)}
            className="group text-left rounded-2xl border border-border bg-card/60 p-5 sm:p-6 transition-all duration-300 hover:border-foreground/15 hover:shadow-lg"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{tool.title}</p>
            <p className="mt-2 text-xs text-muted leading-relaxed">{tool.desc}</p>
          </button>
        ))}
      </div>
    </Section>
  );
}

function AffinityExplore() {
  const router = useRouter();
  const items = [
    { label: "Países", href: "/affinity/country" },
    { label: "Marcas", href: "/affinity/brand" },
    { label: "Universidades", href: "/affinity/university" },
    { label: "Ciudades", href: "/affinity/city" },
  ];
  return (
    <Section
      title="¿Con qué resonás?"
      subtitle="Tu perfil no termina en vos. También podés explorar cómo resonás con el mundo."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className="group text-left rounded-2xl border border-border bg-card/60 p-5 sm:p-6 transition-all duration-300 hover:border-foreground/15 hover:shadow-lg"
          >
            <p className="text-sm font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{item.label}</p>
            <span className="mt-3 inline-flex items-center text-xs text-accent">
              Explorar
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {concepts.map((concept) => (
          <button
            key={concept.title}
            type="button"
            onClick={() => router.push(concept.href)}
            className="group text-left rounded-2xl border border-border bg-card/40 px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300 hover:border-foreground/15 hover:bg-card"
          >
            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{concept.title}</p>
            <span className="mt-2 inline-flex items-center text-xs text-muted group-hover:text-foreground transition-colors">
              Explorar
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}
