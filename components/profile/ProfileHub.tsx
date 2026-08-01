"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { calculateAllAffinity, type AffinityResult } from "@/lib/engines/affinityEngine";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { emojiBounce, hoverEmoji } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "./ProfileTabs";
import { loadDiscoveryState } from "@/lib/session/discovery";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter?: (tab: ProfileTab) => void;
}

const colBorder = "border-ink/10";
const cellPad = "p-8 lg:p-12";

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const name = typeof profile.name === "string" ? profile.name : "";

  // Afinidad = exclusivamente zodíaco chino (affinityEngine), misma fuente que /affinity, /hoy y WorldScreen.
  const affinityResults = useMemo(() => calculateAllAffinity(profile, SYMBOLIC_ENTITIES), [profile]);
  const positiveAffinities = useMemo(
    () => affinityResults.filter((r) => r.tier === "resonancia-alta" || r.tier === "afinidad-media"),
    [affinityResults]
  );

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 2);

  const hasCompletedOnboarding = useMemo(() => loadDiscoveryState().hasCompletedOnboarding, []);
  const topRec: AffinityResult | null = hasCompletedOnboarding ? positiveAffinities[0] ?? null : null;

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);
  const intelligenceScore = dailyEnergy.overallScore;
  const intelligenceLabel = dailyEnergy.theme;

  const sections = [
    {
      key: "identity" as ProfileTab,
      eyebrow: "Tu Identidad",
      title: `Tu arquetipo es ${archetype.name}`,
      subtitle: `Camino de Vida ${lifePath} (tu número guía) · ${display.name} de ${profile.chineseZodiacInfo?.element ?? ""}`,
      detail: `${profile.sunSign} · ${profile.chineseZodiac}`,
    },
    {
      key: "circle" as ProfileTab,
      eyebrow: "Tu Círculo",
      title: sameFriends.length > 0
        ? `Tus aliados: ${sameFriends.map(f => f.animal).join(", ")}`
        : "Tus aliados definen tu círculo",
      subtitle: "Relaciones del ciclo chino",
      detail: sameFriends.length > 0 ? sameFriends.map(f => f.animal).join(" · ") : "",
    },
    {
      key: "world" as ProfileTab,
      eyebrow: "Tu Mundo",
      title: `${affinityResults.filter(r => r.entityAnimal === userAnimal).length} entidades conectan con tu perfil`,
      subtitle: "Marcas, historias y referentes que resuenan",
      detail: "",
    },
    {
      key: "intelligence" as ProfileTab,
      eyebrow: "Tu Inteligencia",
      title: `${intelligenceScore}/100 — ${intelligenceLabel}`,
      subtitle: "Estado actual de tu mapa simbólico",
      detail: "",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${elementColor}15, transparent 70%)` }} />
        <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="label-micro mb-8"
            >
              Mi mapa personal
            </motion.p>

            <motion.div
              {...emojiBounce}
              className="relative mb-6"
            >
              <div
                className="absolute inset-0 scale-[2] blur-3xl opacity-20 rounded-full"
                style={{ backgroundColor: elementColor }}
              />
              <motion.span
                className="relative block text-7xl sm:text-8xl lg:text-9xl leading-none select-none"
                role="img"
                aria-label={display.name}
                {...hoverEmoji}
              >
                {display.emoji}
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(2.75rem,9vw,7rem)] tracking-tight text-foreground leading-[0.9] uppercase"
            >
              {name || archetype.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase text-xs tracking-[0.15em] text-muted">Animal</span>
                <span className="text-base text-muted font-medium">{display.name} de {profile.chineseZodiacInfo?.element ?? ""}</span>
              </div>
              <span className="hidden sm:inline text-muted">|</span>
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase text-xs tracking-[0.15em] text-muted">Signo</span>
                <span className="text-base text-muted font-medium">{profile.sunSign}</span>
              </div>
              <span className="hidden sm:inline text-muted">|</span>
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase text-xs tracking-[0.15em] text-muted">Camino</span>
                <span className="text-base text-muted font-medium">{lifePath}</span>
              </div>
          </motion.div>
        </div>
      </div>
    </section>

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pb-20 sm:pb-24">
        <div className="flex flex-wrap border-t border-ink/10">
          {sections.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className={`w-full md:w-1/2 flex flex-col ${i % 2 === 0 ? `md:border-r ${colBorder}` : ""} border-b ${colBorder}`}
            >
              <button
                type="button"
                onClick={() => onEnter?.(section.key)}
                disabled={!onEnter}
                className={`group flex-1 text-left ${cellPad} transition-colors ${
                  section.key === "identity" ? "bg-accent/[0.04] hover:bg-accent/[0.07]" : "hover:bg-ink/[0.03]"
                }`}
              >
                <p
                  className={`font-mono text-[0.7rem] font-semibold uppercase tracking-[0.25em] mb-4 ${
                    section.key === "identity" ? "text-accent" : "text-muted"
                  }`}
                >
                  {section.eyebrow}
                </p>
                <p
                  className={`font-display uppercase text-foreground mb-3 leading-[0.95] group-hover:text-accent transition-colors ${
                    section.key === "identity" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {section.title}
                </p>
                <p className="text-sm text-muted">{section.subtitle}</p>
                {section.detail && (
                  <p className="text-xs text-muted mt-2">{section.detail}</p>
                )}
                {onEnter && (
                  <span className="mt-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-accent inline-flex items-center gap-2">
                    Explorar
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="border-b border-ink/10">
          <Link
            href="/profile/insights"
            className="block w-full text-left px-6 sm:px-8 py-6 sm:py-8 group"
          >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted font-medium mb-2">Un paso más</p>
            <p className="text-sm text-foreground group-hover:text-accent transition-colors">
              Ver tus insights completos →
            </p>
          </Link>
        </div>

        {topRec && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="border-b border-ink/10"
          >
            <Link
              href={`/affinity/${topRec.entity.type}/${topRec.entity.id}`}
              className="block w-full text-left px-6 sm:px-8 py-6 sm:py-8 group"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted font-medium mb-2">Tu próximo descubrimiento</p>
              <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                {topRec.entity.name} resuena especialmente con tu energía de {display.name}.
              </p>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
