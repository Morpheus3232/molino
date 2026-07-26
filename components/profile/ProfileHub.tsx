"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildPersonalRecommendations } from "@/lib/engines/personalRecommendationEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getRelationshipMap, getRelation, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import type { ProfileTab } from "./ProfileTabs";
import { loadDiscoveryState } from "@/lib/storage/discovery";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter: (tab: ProfileTab) => void;
}

const ENTITY_TYPE_ICONS: Record<string, string> = {
  brand: "✧", country: "🌍", city: "🏛️",
  university: "🎓", team: "⚽", movie: "🎬", artist: "🎤",
};

const CARD_BASE = "p-5 sm:p-6 rounded-2xl border border-border bg-card relative overflow-hidden hover:border-accent/30 transition-colors";
const CARD_INSIGHT = "font-serif text-xl sm:text-2xl font-semibold text-accent leading-tight mb-1";

/* ════════════════════════════════════════════════
   HUB CARDS
   ════════════════════════════════════════════════ */

function InsightCard({
  eyebrow,
  insight,
  context,
  accentColor = "var(--element-fire)",
  onCta,
  ctaLabel = "Explorar →",
  children,
}: {
  eyebrow: string;
  insight: React.ReactNode;
  context?: React.ReactNode;
  accentColor?: string;
  onCta?: () => void;
  ctaLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.section className={CARD_BASE}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: accentColor }} />
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">{eyebrow}</p>
      <p className={CARD_INSIGHT}>{insight}</p>
      <div className="text-xs text-muted mb-4">{context}</div>
      {children}
      {onCta && (
        <button type="button" onClick={onCta} className="text-xs font-medium text-accent hover:underline">
          {ctaLabel}
        </button>
      )}
    </motion.section>
  );
}

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const name = typeof profile.name === "string" ? profile.name : "";

  const recommendationMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const topResonances = useMemo(() => {
    return recommendationMap.recommendations
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 3);
  }, [recommendationMap, userAnimal]);

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 2);

  const discovery = loadDiscoveryState();
  const topRec = discovery.hasCompletedOnboarding ? recommendationMap.recommendations[0] : null;

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);
  const intelligenceScore = dailyEnergy.overallScore;
  const intelligenceLabel = dailyEnergy.theme;

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
              {display.name} de {profile.chineseZodiacInfo?.element ?? ""} &middot; {profile.sunSign}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 space-y-6 pb-16 sm:pb-24">
        {/* ═══ TU IDENTIDAD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <InsightCard
            eyebrow="Tu Identidad"
            insight={`Tu arquetipo es ${archetypeName}`}
            context="Según tus sistemas simbólicos"
            accentColor={elementColor}
            onCta={() => onEnter("identity")}
          />
        </motion.div>

        {/* ═══ TU CÍRCULO ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <InsightCard
            eyebrow="Tu Círculo"
            insight={
              sameFriends.length > 0 ? (
                <>Tus aliados: {sameFriends.map((f, i) => (
                  <span key={f.animal}>
                    {i > 0 && ", "}
                    <span className="text-accent">{f.animal}</span>
                  </span>
                ))}</>
              ) : (
                "Tus aliados definen tu círculo"
              )
            }
            context={
              <div className="space-y-2">
                <span>Relaciones del ciclo chino</span>
                {sameFriends.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sameFriends.map((f) => (
                      <span key={f.animal} className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
                        {f.animal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            }
            accentColor={elementColor}
            onCta={() => onEnter("circle")}
          />
        </motion.div>

        {/* ═══ TU MUNDO ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <InsightCard
            eyebrow="Tu Mundo"
            insight={`${recommendationMap.recommendations.filter(r => r.entityAnimal === userAnimal).length} entidades conectan con tu perfil de ${display.name}`}
            context="Marcas, historias y referentes que resuenan"
            accentColor={elementColor}
            onCta={() => onEnter("world")}
          />
        </motion.div>

        {/* ═══ TU INTELIGENCIA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <InsightCard
            eyebrow="Tu Inteligencia"
            insight={`Tu momento: ${intelligenceScore}/100 — ${intelligenceLabel}`}
            context={
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${intelligenceScore}%` }} />
                </div>
                <span>Estado actual de tu mapa simbólico</span>
              </div>
            }
            accentColor={elementColor}
            onCta={() => onEnter("intelligence")}
          />
        </motion.div>

        {/* ═══ PRÓXIMO DESCUBRIMIENTO ═══ */}
        {topRec && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-5 sm:p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all cursor-pointer"
            onClick={() => router.push(`/affinity/${topRec.entity.type}/${topRec.entity.id}`)}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl shrink-0">{topRec.entity.emoji || "◆"}</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">Tu próximo descubrimiento</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {topRec.entity.name} resuena especialmente con tu energía de {display.name}.
            </p>
          </motion.section>
        )}
      </div>
    </div>
  );
}
