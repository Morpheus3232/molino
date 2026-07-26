"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildPersonalRecommendations } from "@/lib/engines/personalRecommendationEngine";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import type { ProfileTab } from "./ProfileTabs";
import DailyInsights from "./DailyInsights";
import { loadDiscoveryState } from "@/lib/storage/discovery";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter: (tab: ProfileTab) => void;
}

interface DoorData {
  tab: ProfileTab;
  icon: string;
  label: string;
  description: string;
  preview: string;
  color: string;
}

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const name = typeof profile.name === "string" ? profile.name : "";

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile, new Date()), [profile]);
  const recommendationMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const totalRecs = recommendationMap.recommendations.length;

  const doors: DoorData[] = useMemo(() => [
    {
      tab: "identity",
      icon: display.emoji,
      label: "Tu Identidad",
      description: "Quién sos según tus sistemas simbólicos",
      preview: archetypeName ? `Tu arquetipo es ${archetypeName}` : `${display.name} de ${profile.chineseZodiacInfo?.element ?? ""}`,
      color: elementColor,
    },
    {
      tab: "world",
      icon: "🌎",
      label: "Tu Mundo",
      description: "Marcas, destinos y entidades que resuenan con vos",
      preview: `${totalRecs} entidades conectan con tu perfil de ${display.name}`,
      color: "var(--element-earth)",
    },
    {
      tab: "circle",
      icon: "⬡",
      label: "Tu Círculo",
      description: "Aliados, contrastes y personas que comparten tu energía",
      preview: `Tus aliados: ${display.name} se conecta con Tigre, Perro y Cabra`,
      color: "var(--layer-cycles)",
    },
    {
      tab: "intelligence",
      icon: "◆",
      label: "Tu Inteligencia",
      description: "Síntesis, patrones, dimensiones y conexiones profundas",
      preview: `Tu momento: ${dailyEnergy.overallScore}/100 — ${dailyEnergy.theme}`,
      color: "var(--layer-numerology)",
    },
  ], [display, archetypeName, profile.chineseZodiacInfo?.element, totalRecs, dailyEnergy, elementColor]);

  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-8">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-5xl sm:text-6xl block mb-4">{display.emoji}</span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
              {name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted">
              {display.name} de {profile.chineseZodiacInfo?.element ?? ""} · {profile.sunSign}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subtitle */}
      <section className="pb-6">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-muted max-w-md mx-auto"
          >
            Descubrí las diferentes dimensiones de tu mapa personal.
          </motion.p>
        </div>
      </section>

      {/* Daily Insights — "Hoy en Molino" */}
      <DailyInsights profile={profile} onNavigate={onEnter} />

      {/* "Tu próximo descubrimiento" — subtle recommendation */}
      {(() => {
        const discovery = loadDiscoveryState();
        if (!discovery.hasCompletedOnboarding) return null;
        const topRec = recommendationMap.recommendations[0];
        if (!topRec) return null;
        return (
          <section className="py-4 sm:py-6">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-accent/30 transition-all cursor-pointer"
                onClick={() => router.push(`/affinity/${topRec.entity.type}/${topRec.entity.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{topRec.entity.emoji || "✦"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Tu próximo descubrimiento</p>
                    <p className="text-sm text-foreground">
                      {topRec.entity.name} resuena especialmente con tu energía.
                    </p>
                  </div>
                  <span className="text-xs text-accent group-hover:translate-x-1 transition-transform shrink-0">→</span>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* 4 Doors Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {doors.map((door, i) => (
              <motion.button
                key={door.tab}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                onClick={() => onEnter(door.tab)}
                className="group relative text-left p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-accent/40 transition-all duration-300 overflow-hidden"
              >
                {/* Color accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: door.color }} />

                {/* Icon */}
                <span className="text-3xl sm:text-4xl block mb-4">{door.icon}</span>

                {/* Title */}
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {door.label}
                </h2>

                {/* Description */}
                <p className="text-sm text-muted mb-4 leading-relaxed">
                  {door.description}
                </p>

                {/* Preview datum */}
                <div className="p-3 rounded-xl bg-background/50 mb-5">
                  <p className="text-xs text-muted leading-relaxed">{door.preview}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  <span>Explorar</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <section className="pb-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
          <p className="text-[11px] text-muted/50">
            Molino — Inteligencia Personal. Todo el contenido es educativo.
          </p>
        </div>
      </section>
    </div>
  );
}
