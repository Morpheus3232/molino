"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { resolveYearCycle, calculateYearResonance } from "@/lib/engines/yearCycleEngine";
import { buildPersonalRecommendations } from "@/lib/engines/personalRecommendationEngine";
import { getFamousByAnimal, getFamousBySign } from "@/lib/data/famousPeople";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { type Animal } from "@/lib/data/animalRelations";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "./ProfileTabs";

interface DailyInsight {
  title: string;
  detail: string;
  source: string;
  cta: string;
  target?: ProfileTab;
  href?: string;
  color: string;
  icon: string;
}

interface DailyInsightsProps {
  profile: UserProfile;
  onNavigate: (tab: ProfileTab) => void;
}

export default function DailyInsights({ profile, onNavigate }: DailyInsightsProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const userSunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);

  const insights = useMemo<DailyInsight[]>(() => {
    const result: DailyInsight[] = [];
    const now = new Date();

    // ─── Insight 1: IDENTIDAD — Energy or moment ───
    const dailyEnergy = calculateDailyEnergy(profile, now);
    const energyScore = dailyEnergy.overallScore ?? 50;

    if (energyScore >= 80) {
      result.push({
        title: "Tu energía hoy está en su punto más alto",
        detail: `Con ${energyScore}/100, tu energía del día favorece la acción y la toma de decisiones. ${dailyEnergy.theme ? `Tu tema: ${dailyEnergy.theme}.` : ""}`,
        source: "Energía diaria",
        cta: "Ver tu energía completa",
        target: "identity",
        color: "#2D5A3D",
        icon: "⚡",
      });
    } else if (energyScore >= 60) {
      result.push({
        title: `Hoy tu energía es ${dailyEnergy.theme || "equilibrada"}`,
        detail: `Con ${energyScore}/100, es un buen momento para avanzar en lo que tenés entre manos. ${dailyEnergy.description || ""}`,
        source: "Energía diaria",
        cta: "Explorá tu momento",
        target: "identity",
        color: "#4A6FA5",
        icon: "🔋",
      });
    } else {
      result.push({
        title: "Hoy es un día para pausar y observar",
        detail: `Con ${energyScore}/100, tu energía favorece la reflexión. Aprovechá para revisar tus patrones.`,
        source: "Energía diaria",
        cta: "Conocé tu momento",
        target: "identity",
        color: "#D4A843",
        icon: "🌙",
      });
    }

    // ─── Insight 2: MUNDO — Best affinity entity ───
    const recMap = buildPersonalRecommendations(profile);
    const topRec = recMap.recommendations[0];
    if (topRec) {
      const relLabel = topRec.natalRelation;
      const entityHref = `/affinity/${topRec.entity.type}/${topRec.entity.id}`;
      result.push({
        title: `${topRec.entity.name} es tu mayor afinidad`,
        detail: `${topRec.entity.name} (${topRec.entityAnimal}) tiene una relación de ${relLabel} con tu ${display.name}. ${topRec.explanation || ""}`,
        source: "Afinidad simbólica",
        cta: `Descubrir por qué resuenás con ${topRec.entity.name}`,
        href: entityHref,
        color: "#2D5A3D",
        icon: topRec.entity.emoji || "✦",
      });
    }

    // ─── Insight 3: CÍRCULO — Famous person or zodiac connection ───
    const yearCycle = resolveYearCycle(userAnimal as Animal);
    const yearResonance = calculateYearResonance(userAnimal as Animal, yearCycle.yearAnimal);

    // Try to find a famous person of the same animal
    const sameAnimalFamous = getFamousByAnimal(userAnimal as Animal, userYear);
    // Try to find a famous person of the same western sign
    const sameSignFamous = getFamousBySign(userSunSign as any, userYear);

    if (sameAnimalFamous.length > 0) {
      const person = sameAnimalFamous[0];
      result.push({
        title: `${person.name} nació en un año de ${display.name}`,
        detail: `${person.name} (${person.year}) es ${display.name} como vos. ${person.field} · ${person.country}. Según la tradición, comparten la misma energía base.`,
        source: "Zodiaco chino",
        cta: "Ver tu círculo zodiacal",
        target: "circle",
        color: "#6B4C7A",
        icon: person.emoji,
      });
    } else if (sameSignFamous.length > 0) {
      const person = sameSignFamous[0];
      result.push({
        title: `${person.name} comparte tu signo ${userSunSign}`,
        detail: `${person.name} (${person.year}) es ${userSunSign} como vos. ${person.field} · ${person.country}.`,
        source: "Astrología occidental",
        cta: "Explorá tu círculo occidental",
        target: "circle",
        color: "#6B4C7A",
        icon: person.emoji,
      });
    } else if (yearResonance.type === "alignment") {
      result.push({
        title: `Tu ${display.name} está alineado con el ciclo del año`,
        detail: `${yearCycle.yearAnimal} domina el ciclo actual. Tu animal comparte la misma energía, lo que amplifica tu identidad.`,
        source: "Ciclo anual",
        cta: "Explorá tu círculo",
        target: "circle",
        color: "#2D5A3D",
        icon: "🔥",
      });
    } else if (yearResonance.type === "harmony") {
      result.push({
        title: `Tu ${display.name} se conecta con ${yearCycle.yearAnimal} este año`,
        detail: "Una energía de colaboración y expansión según la tradición.",
        source: "Ciclo anual",
        cta: "Ver tu inteligencia",
        target: "intelligence",
        color: "#4A6FA5",
        icon: "🌊",
      });
    } else {
      result.push({
        title: `Tu ${display.name} y ${yearCycle.yearAnimal}: un año de observación`,
        detail: "Un período para construir silenciosamente y adaptarte al ciclo.",
        source: "Ciclo anual",
        cta: "Entendé tu momento",
        target: "intelligence",
        color: "#D4A843",
        icon: "🌿",
      });
    }

    return result;
  }, [profile, userAnimal, display, userSunSign, userYear]);

  if (insights.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-accent" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium">Tu energía de hoy</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        <motion.div {...staggerApple} className="space-y-3">
          {insights.map((insight, i) => (
            <motion.button
              key={insight.title}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.08), duration: 0.4 }}
              onClick={() => insight.href ? router.push(insight.href) : onNavigate(insight.target!)}
              className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-accent/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{insight.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1 group-hover:text-accent transition-colors">
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted/70 leading-relaxed mb-2">
                    {insight.detail}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted/50">{insight.source}</span>
                    <span className="text-xs text-accent group-hover:translate-x-1 transition-transform inline-block">
                      {insight.cta} →
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
