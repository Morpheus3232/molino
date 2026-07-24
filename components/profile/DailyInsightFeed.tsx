"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { resolveYearCycle, calculateYearResonance } from "@/lib/engines/yearCycleEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getAnimalProfile, type Animal } from "@/lib/data/animalRelations";
import { formatAnimalEmoji, formatAnimalSimple, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface DailyInsightFeedProps {
  profile: UserProfile;
}

interface Insight {
  period: string;
  title: string;
  detail: string;
  icon: string;
  color: string;
}

export default function DailyInsightFeed({ profile }: DailyInsightFeedProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;

  const insights = useMemo(() => {
    const yearCycle = resolveYearCycle(userAnimal);
    const yearResonance = calculateYearResonance(userAnimal, yearCycle.yearAnimal);
    const display = getZodiacDisplay(userAnimal);
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    const result: Insight[] = [];

    // Today insight
    if (yearResonance.type === "alignment") {
      result.push({
        period: "Hoy",
        title: `Tu animal comparte el ciclo con ${yearCycle.yearAnimal}`,
        detail: "Un momento de alineación según la tradición. Energía de identidad y movimiento.",
        icon: "🔥",
        color: "#2D5A3D",
      });
    } else if (yearResonance.type === "harmony") {
      result.push({
        period: "Hoy",
        title: `Tu ${display.name} se conecta con ${yearCycle.yearAnimal}`,
        detail: "Una energía de colaboración y expansión según la tradición.",
        icon: "🌊",
        color: "#4A6FA5",
      });
    } else if (yearResonance.type === "adaptation") {
      result.push({
        period: "Hoy",
        title: `Tu ${display.name} y ${yearCycle.yearAnimal} requieren equilibrio`,
        detail: "Un momento para actuar con estrategia y mayor consciencia.",
        icon: "🌿",
        color: "#B45309",
      });
    } else {
      result.push({
        period: "Hoy",
        title: `Tu ${display.name} en un ciclo de observación`,
        detail: "Un período de construcción silenciosa y adaptación.",
        icon: "🌙",
        color: "#D4A843",
      });
    }

    // Daily energy insight
    const dailyEnergy = calculateDailyEnergy(profile);
    if (dailyEnergy) {
      const energyScore = dailyEnergy.overallScore ?? 50;
      const energyLevel = energyScore >= 80 ? "alta" : energyScore >= 60 ? "media" : "baja";
      result.push({
        period: "Hoy",
        title: `Energía personal: ${energyLevel}`,
        detail: dailyEnergy.description ?? `Tu energía del día está en nivel ${energyLevel} según tus patrones.`,
        icon: energyScore >= 80 ? "⚡" : energyScore >= 60 ? "🔋" : "🪫",
        color: energyScore >= 80 ? "#2D5A3D" : energyScore >= 60 ? "#4A6FA5" : "#D4A843",
      });
    }

    // This week insight
    if (dayOfWeek === 1) {
      result.push({
        period: "Esta semana",
        title: "Nuevo comienzo semanal",
        detail: "El lunes es un buen día para revisar tus patrones y ajustar tu dirección.",
        icon: "📅",
        color: "#4A6FA5",
      });
    } else if (dayOfWeek === 5) {
      result.push({
        period: "Esta semana",
        title: "Cierre de ciclo semanal",
        detail: "Reflexioná sobre lo que descubriste esta semana según tus patrones.",
        icon: "🔄",
        color: "#C49A2A",
      });
    }

    // Monthly insight
    if (dayOfMonth <= 7) {
      result.push({
        period: "Este mes",
        title: "Inicio de un nuevo ciclo mensual",
        detail: "Cada mes trae una nueva energía según el calendario simbólico.",
        icon: "🌙",
        color: "#D4A843",
      });
    }

    return result;
  }, [userAnimal, profile]);

  if (insights.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu feed de hoy</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Insight personalizado según tu perfil y el momento actual.
          </p>
        </motion.div>

        {/* Insight cards */}
        <motion.div {...staggerApple} className="mt-6 space-y-3">
          {insights.map((insight, i) => (
            <motion.div
              key={`${insight.period}-${insight.title}`}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.1), duration: 0.4 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: insight.color, backgroundColor: `${insight.color}12` }}>
                      {insight.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{insight.title}</p>
                  <p className="text-xs text-muted/70 leading-relaxed">{insight.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
