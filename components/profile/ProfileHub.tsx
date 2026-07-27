"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildPersonalRecommendations, hasPositiveAffinity } from "@/lib/engines/personalRecommendationEngine";
import { getRelationshipMap } from "@/lib/data/animalRelations";
import { getFamousByAnimal } from "@/lib/data/famousPeople";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { buildPersonalCode } from "@/lib/engines/synthesisEngine";
import { safeNumber } from "@/lib/utils/score";
import type { ProfileTab } from "./ProfileTabs";
import { ANIMALS } from "@/lib/data/animalRelations";

function getAnimalYears(animal: string, start = 1900, end = 2030): number[] {
  const index = ANIMALS.indexOf(animal as any);
  if (index === -1) return [];
  const years: number[] = [];
  for (let y = start; y <= end; y++) {
    if ((((y - 1900) % 12) + 12) % 12 === index) years.push(y);
  }
  return years;
}
import { loadDiscoveryState } from "@/lib/storage/discovery";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter: (tab: ProfileTab) => void;
}

export default function ProfileHub({ profile }: ProfileHubProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const name = typeof profile.name === "string" ? profile.name : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";

  const personalCode = useMemo(() => buildPersonalCode(profile), [profile]);
  const codeEntries = [
    { num: personalCode.expression.number, label: "Expresión" },
    { num: personalCode.soul.number, label: "Alma" },
    { num: personalCode.personality.number, label: "Personalidad" },
  ].filter(e => e.num !== 0);

  const identityCards = [
    { value: `${lifePath}`, label: "Camino de Vida", icon: "🔢" },
    { value: `${ZODIAC_SYMBOLS[sunSign] || "\u2648"} ${sunSign}`, label: "Signo Solar", icon: "☀" },
    { value: display.name, label: "Animal Chino", icon: display.emoji },
    { value: element, label: "Elemento", icon: "🌿" },
  ];

  const recommendationMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const positiveRecs = useMemo(() => recommendationMap.recommendations.filter(r => hasPositiveAffinity(r.priority)), [recommendationMap]);

  const topCountries = useMemo(
    () => (recommendationMap.byCategory.country ?? [])
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 5),
    [recommendationMap, userAnimal]
  );
  const topBrands = useMemo(
    () => (recommendationMap.byCategory.brand ?? [])
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 5),
    [recommendationMap, userAnimal]
  );
  const topCities = useMemo(
    () => (recommendationMap.byCategory.city ?? [])
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 5),
    [recommendationMap, userAnimal]
  );

  const relationMap = useMemo(() => getRelationshipMap(userAnimal as any), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 5);

  const discovery = loadDiscoveryState();
  const topRec = discovery.hasCompletedOnboarding ? positiveRecs[0] : null;

  const userYear = parseInt(birthDate?.split("-")[0] || "0", 10);
  const sameAnimalFamous = useMemo(
    () => getFamousByAnimal(userAnimal as any, userYear).slice(0, 5),
    [userAnimal, userYear]
  );

  const userSignSymbol = ZODIAC_SYMBOLS[sunSign] || "\u2648";

  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      <section className="pt-16 sm:pt-24 pb-8 sm:pb-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl sm:text-7xl block mb-4">{display.emoji}</span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              {name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted">
              {display.name} de {profile.chineseZodiacInfo?.element ?? ""} &middot; {sunSign} {userSignSymbol}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pb-16 sm:pb-24 space-y-6">
        {/* ═══ IDENTITY — full width ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="p-5 sm:p-6 rounded-2xl border border-border bg-card relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: elementColor }} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu Identidad</p>
          <p className="font-serif text-xl sm:text-2xl font-semibold text-accent leading-tight mb-1">
            Sos {archetypeName}
          </p>
          {archetype?.quote && (
            <p className="text-sm text-muted italic mb-4">&ldquo;{archetype.quote}&rdquo;</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {identityCards.map((card) => (
              <div key={card.label} className="p-3 sm:p-4 rounded-xl border border-accent/10 bg-accent/5 text-center">
                <span className="text-2xl block mb-1">{card.icon}</span>
                <p className="font-serif text-base sm:text-lg font-semibold text-foreground">{card.value}</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {codeEntries.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {codeEntries.map((entry) => (
                <div key={entry.label} className="text-center p-2.5 rounded-lg bg-card border border-border">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{entry.num}</p>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mt-0.5">{entry.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Row 2: CIRCLE + WORLD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ═══ CIRCLE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-5 sm:p-6 rounded-2xl border border-border bg-card relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: "var(--element-water)" }} />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu Círculo</p>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-accent leading-tight mb-3">
              Tus aliados
            </p>
            {sameFriends.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {sameFriends.map((f) => {
                  const years = getAnimalYears(f.animal);
                  return (
                    <div key={f.animal} className="px-3 py-1.5 rounded-full bg-accent/10 text-center">
                      <p className="text-accent text-xs font-medium">{f.animal}</p>
                      <p className="text-[9px] text-muted mt-0.5 whitespace-nowrap">{years.join(" · ")}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {sameAnimalFamous.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-2">Famosos como vos</p>
                <div className="space-y-1.5">
                  {sameAnimalFamous.map((f) => (
                    <p key={f.name} className="text-sm text-foreground">
                      {f.name} <span className="text-muted">· {f.field}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ═══ WORLD ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-5 sm:p-6 rounded-2xl border border-border bg-card relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: "var(--element-air)" }} />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu Mundo</p>
            {topCountries.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium mb-2">Países que resuenan</p>
                <div className="space-y-1.5">
                  {topCountries.map((r) => (
                    <div key={r.entity.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-accent/5 transition-colors">
                      <span className="text-base shrink-0">{r.entity.emoji || "🌍"}</span>
                      <p className="text-sm font-medium text-foreground flex-1">{r.entity.name}</p>
                      <span className="text-[11px] font-semibold text-accent">{r.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topCities.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium mb-2">Ciudades que resuenan</p>
                <div className="space-y-1.5">
                  {topCities.map((r) => (
                    <div key={r.entity.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-accent/5 transition-colors">
                      <span className="text-base shrink-0">{r.entity.emoji || "🏛"}</span>
                      <p className="text-sm font-medium text-foreground flex-1">{r.entity.name}</p>
                      <span className="text-[11px] font-semibold text-accent">{r.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topBrands.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium mb-2">Marcas que resuenan</p>
                <div className="space-y-1.5">
                  {topBrands.map((r) => (
                    <div key={r.entity.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-accent/5 transition-colors">
                      <span className="text-base shrink-0">{r.entity.emoji || "✧"}</span>
                      <p className="text-sm font-medium text-foreground flex-1">{r.entity.name}</p>
                      <span className="text-[11px] font-semibold text-accent">{r.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topCountries.length === 0 && topCities.length === 0 && topBrands.length === 0 && (
              <p className="text-sm text-muted">Todavía no hay conexiones calculadas.</p>
            )}
          </motion.div>
        </div>

        {/* ═══ NEXT DISCOVERY ═══ */}
        {topRec && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
