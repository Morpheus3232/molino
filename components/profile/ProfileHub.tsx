"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildPersonalRecommendations } from "@/lib/engines/personalRecommendationEngine";
import { getRelationshipMap, ANIMALS } from "@/lib/data/animalRelations";
import { getFamousByAnimal } from "@/lib/data/famousPeople";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { buildPersonalCode } from "@/lib/engines/synthesisEngine";
import { safeNumber } from "@/lib/utils/score";
import type { ProfileTab } from "./ProfileTabs";

function getAnimalYears(animal: string, start = 1900, end = 2030): number[] {
  const index = ANIMALS.indexOf(animal as any);
  if (index === -1) return [];
  const years: number[] = [];
  for (let y = start; y <= end; y++) {
    if ((((y - 1900) % 12) + 12) % 12 === index) years.push(y);
  }
  return years;
}

const worldCategories = [
  { key: "countries" as const, label: "Países", fallbackEmoji: "🌍", data: null as any },
  { key: "cities" as const, label: "Ciudades", fallbackEmoji: "🏛", data: null as any },
  { key: "brands" as const, label: "Marcas", fallbackEmoji: "✧", data: null as any },
  { key: "autos" as const, label: "Autos", fallbackEmoji: "🚗", data: null as any },
];

interface ProfileHubProps {
  profile: UserProfile;
  onEnter: (tab: ProfileTab) => void;
}

export default function ProfileHub({ profile }: ProfileHubProps) {
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
    { value: `${profile.luckyNumber}`, label: "Nº de la Suerte", icon: "🍀" },
  ];

  const recommendationMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);

  const topCountries = useMemo(
    () => (recommendationMap.byCategory.country ?? [])
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 4),
    [recommendationMap, userAnimal]
  );
  const topBrands = useMemo(
    () => (recommendationMap.byCategory.brand ?? [])
      .filter(r => r.entityAnimal === userAnimal && r.entity.category !== "autos")
      .slice(0, 4),
    [recommendationMap, userAnimal]
  );
  const topAutoBrands = useMemo(
    () => (recommendationMap.byCategory.brand ?? [])
      .filter(r => r.entityAnimal === userAnimal && r.entity.category === "autos")
      .slice(0, 4),
    [recommendationMap, userAnimal]
  );
  const topCities = useMemo(
    () => (recommendationMap.byCategory.city ?? [])
      .filter(r => r.entityAnimal === userAnimal)
      .slice(0, 4),
    [recommendationMap, userAnimal]
  );

  const relationMap = useMemo(() => getRelationshipMap(userAnimal as any), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 3);

  const userYear = parseInt(birthDate?.split("-")[0] || "0", 10);
  const sameAnimalFamous = useMemo(
    () => getFamousByAnimal(userAnimal as any, userYear).slice(0, 4),
    [userAnimal, userYear]
  );

  const userSignSymbol = ZODIAC_SYMBOLS[sunSign] || "\u2648";

  return (
    <div className="min-h-screen bg-[#F3EDE3]">
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-5xl sm:text-6xl block mb-3">{display.emoji}</span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
              {name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted">
              {display.name} de {profile.chineseZodiacInfo?.element ?? ""} &middot; {sunSign} {userSignSymbol}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pb-16 sm:pb-24 space-y-5">
        {/* ═══ IDENTITY ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="p-4 sm:p-5 rounded-2xl border border-border bg-card relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: elementColor }} />
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu Identidad</p>
          <p className="font-serif text-lg sm:text-xl font-semibold text-accent leading-tight mb-1">
            Sos {archetypeName}
          </p>
          {archetype?.quote && (
            <p className="text-xs text-muted italic mb-3">&ldquo;{archetype.quote}&rdquo;</p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {identityCards.map((card) => (
              <div key={card.label} className="p-2 sm:p-3 rounded-xl border border-accent/10 bg-accent/5 text-center">
                <span className="text-lg sm:text-xl block mb-0.5">{card.icon}</span>
                <p className="font-serif text-xs sm:text-sm font-semibold text-foreground truncate">{card.value}</p>
                <p className="text-[8px] uppercase tracking-[0.15em] text-muted font-medium mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {codeEntries.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {codeEntries.map((entry) => (
                <div key={entry.label} className="text-center px-3 py-1.5 rounded-lg bg-card border border-border">
                  <p className="text-base sm:text-lg font-bold text-foreground">{entry.num}</p>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-muted font-medium">{entry.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Row 2: CIRCLE + WORLD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ═══ CIRCLE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-4 sm:p-5 rounded-2xl border border-border bg-card relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: "var(--element-water)" }} />
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu Círculo</p>
            <p className="font-serif text-lg sm:text-xl font-semibold text-accent leading-tight mb-3">
              Tus aliados
            </p>
            {sameFriends.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {sameFriends.map((f) => {
                  const years = getAnimalYears(f.animal);
                  return (
                    <div key={f.animal} className="px-3 py-1.5 rounded-full bg-accent/10 text-center">
                      <p className="text-accent text-xs font-medium">{f.animal}</p>
                      <p className="text-[8px] text-muted mt-0.5 whitespace-nowrap">{years.join(" · ")}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {sameAnimalFamous.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mb-2">Famosos como vos</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {sameAnimalFamous.map((f) => (
                    <p key={f.name} className="text-xs text-foreground truncate">
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
            className="p-4 sm:p-5 rounded-2xl border border-border bg-card relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: "var(--element-air)" }} />
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu Mundo</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { items: topCountries, label: "Países", emoji: "🌍" },
                { items: topCities, label: "Ciudades", emoji: "🏛" },
                { items: topBrands, label: "Marcas", emoji: "✧" },
                { items: topAutoBrands, label: "Autos", emoji: "🚗" },
              ].map(section => section.items.length > 0 && (
                <div key={section.label}>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-accent font-medium mb-1.5">{section.label}</p>
                  <div className="space-y-1">
                    {section.items.map((r: any) => (
                      <div key={r.entity.id} className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-accent/5 transition-colors">
                        <span className="text-sm shrink-0">{r.entity.emoji || section.emoji}</span>
                        <p className="text-xs font-medium text-foreground flex-1 truncate">{r.entity.name}</p>
                        <span className="text-[10px] font-semibold text-accent shrink-0">{r.totalScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {!topCountries.length && !topCities.length && !topBrands.length && !topAutoBrands.length && (
              <p className="text-xs text-muted">Todavía no hay conexiones calculadas.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
