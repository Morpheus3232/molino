"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { buildPersonalTimeline, type PersonalTimeline } from "@/lib/engines/personalTimelineEngine";
import { analyzeTiming, findBestDates, type TimingIntention } from "@/lib/engines/timingEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { formatAnimalEmoji } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, heroReveal, cardReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import { ELEMENT_COLORS } from "@/lib/data/constants";

interface EnhancedMomentSectionProps {
  profile: UserProfile;
}

const INTENTION_CARDS: { intention: TimingIntention; emoji: string; label: string }[] = [
  { intention: "start_project", emoji: "🚀", label: "Iniciar proyecto" },
  { intention: "make_decision", emoji: "🎯", label: "Tomar decisión" },
  { intention: "launch_something", emoji: "✨", label: "Lanzar algo" },
  { intention: "publish_something", emoji: "📝", label: "Publicar" },
  { intention: "change_job", emoji: "💼", label: "Cambiar trabajo" },
  { intention: "sign_agreement", emoji: "📋", label: "Firmar acuerdo" },
];

const MOON_EMOJIS: Record<string, string> = {
  "Nueva": "🌑",
  "Creciente": "🌒",
  "Primero Cuarto": "🌓",
  "Llena": "🌕",
  "Menguante": "🌖",
  "Cuarto Menguante": "🌗",
};

export default function EnhancedMomentSection({ profile }: EnhancedMomentSectionProps) {
  const timeline = useMemo(() => buildPersonalTimeline(profile), [profile]);
  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);
  const elementColor = ELEMENT_COLORS[profile.chineseZodiacInfo?.element ?? "Fuego"] ?? "#C49A2A";

  // Get timing for today with default intention
  const todayTiming = useMemo(() => analyzeTiming(profile, new Date(), "make_decision"), [profile]);

  // Find best dates in next 14 days
  const bestDates = useMemo(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    return findBestDates(profile, start, end, "make_decision", 5);
  }, [profile]);

  // Moon phase
  const moonPhase = todayTiming.moonPhase;
  const moonEmoji = MOON_EMOJIS[moonPhase] ?? "🌙";

  // Element influence
  const elementInfluence = todayTiming.elementInfluence;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu momento actual</h2>
          </div>
        </motion.div>

        {/* Main moment card */}
        <motion.div {...heroReveal} className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-1.5" style={{ backgroundColor: elementColor }} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Year animal */}
                <div className="text-center shrink-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">{timeline.currentYear}</p>
                  <span className="text-5xl block mb-1">{formatAnimalEmoji(timeline.yearAnimal)}</span>
                  <p className="font-serif text-lg font-semibold text-foreground">Año del {timeline.yearAnimal}</p>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                      Año Personal {timeline.personalYear}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                      Año Universal {timeline.universalYear}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                      {moonEmoji} {moonPhase}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">
                    {timeline.cycleDescription}
                  </p>
                  <p className="text-xs text-muted/70">
                    {timeline.cycleLabel}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  {timeline.timeline.map((point, i) => (
                    <div key={point.year} className="flex flex-col items-center">
                      <span className={`text-xs font-medium ${point.isCurrent ? "text-foreground" : "text-muted"}`}>
                        {point.year}
                      </span>
                      <span className={`text-[10px] mt-1 ${point.isCurrent ? "text-accent" : "text-muted/60"}`}>
                        {point.label}
                      </span>
                      {point.isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-accent mt-1" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="relative h-px bg-border mt-2 mx-8">
                  <div className="absolute left-0 h-px bg-accent" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Energy + Timing + Element grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Daily Energy */}
          {dailyEnergy && (
            <motion.div {...cardReveal} className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Energía del día</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {dailyEnergy.overallScore >= 80 ? "⚡" : dailyEnergy.overallScore >= 60 ? "🔋" : "🪫"}
                </span>
                <div>
                  <p className="font-serif text-xl font-bold text-foreground">{dailyEnergy.overallScore}/100</p>
                  <p className="text-xs text-muted">{dailyEnergy.theme}</p>
                </div>
              </div>
              <p className="text-xs text-muted/70 leading-relaxed">{dailyEnergy.description}</p>
            </motion.div>
          )}

          {/* Timing Score */}
          <motion.div {...cardReveal} className="p-5 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Momento para decidir</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {todayTiming.timingScore >= 70 ? "🟢" : todayTiming.timingScore >= 50 ? "🟡" : "🟠"}
              </span>
              <div>
                <p className="font-serif text-xl font-bold text-foreground">{todayTiming.timingScore}/100</p>
                <p className="text-xs text-muted">{todayTiming.theme}</p>
              </div>
            </div>
            <p className="text-xs text-muted/70 leading-relaxed">{todayTiming.recommendedWindow}</p>
          </motion.div>

          {/* Element influence */}
          <motion.div {...cardReveal} className="p-5 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu elemento</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {profile.chineseZodiacInfo?.element === "Fuego" ? "🔥" :
                 profile.chineseZodiacInfo?.element === "Agua" ? "💧" :
                 profile.chineseZodiacInfo?.element === "Tierra" ? "🌍" :
                 profile.chineseZodiacInfo?.element === "Madera" ? "🌳" : "⚙️"}
              </span>
              <div>
                <p className="font-serif text-lg font-bold text-foreground">{profile.chineseZodiacInfo?.element ?? "—"}</p>
                <p className="text-xs text-muted">Elemento</p>
              </div>
            </div>
            <p className="text-xs text-muted/70 leading-relaxed">{elementInfluence}</p>
          </motion.div>
        </div>

        {/* Intentions grid */}
        <motion.div {...staggerApple} className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Intenciones</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {INTENTION_CARDS.map((intention, i) => {
              const timing = analyzeTiming(profile, new Date(), intention.intention);
              return (
                <motion.div
                  key={intention.intention}
                  {...staggerItemSmooth}
                  transition={{ delay: staggerDelay(i, 0.04) }}
                  className="p-3 rounded-xl border border-border bg-background/50 text-center"
                >
                  <span className="text-lg block mb-1">{intention.emoji}</span>
                  <p className="text-[9px] font-medium text-foreground mb-1 leading-tight">{intention.label}</p>
                  <p className="text-sm font-bold" style={{ color: timing.timingScore >= 70 ? "#2D5A3D" : timing.timingScore >= 50 ? "#D4A843" : "#B45309" }}>
                    {timing.timingScore}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Best upcoming dates */}
        {bestDates.length > 0 && (
          <motion.div {...cardReveal} className="mt-6 p-5 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Próximos momentos favorables</p>
            <div className="flex flex-wrap gap-2">
              {bestDates.map((date, i) => (
                <div
                  key={date.date}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50"
                >
                  <span className="text-xs font-medium text-foreground">
                    {new Date(date.date + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: date.timingScore >= 70 ? "#2D5A3D" : "#D4A843" }}>
                    {date.timingScore}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
