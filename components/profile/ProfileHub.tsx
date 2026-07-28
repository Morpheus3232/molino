"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildPersonalRecommendations, type PersonalRecommendation } from "@/lib/engines/personalRecommendationEngine";
import { getRelationshipMap, ANIMALS } from "@/lib/data/animalRelations";
import { getFamousByAnimal } from "@/lib/data/famousPeople";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { buildPersonalCode } from "@/lib/engines/synthesisEngine";
import { safeNumber } from "@/lib/utils/score";
import { generateProfileHash, storeSharedProfile } from "@/lib/profile/hash";
import { toast } from "sonner";
import Grainient from "@/components/Grainient";

function getAnimalDecades(animal: string, start = 1900, end = 2030): string[] {
  const index = ANIMALS.indexOf(animal as any);
  if (index === -1) return [];
  const decades: string[] = [];
  for (let y = start; y <= end; y++) {
    if ((((y - 1900) % 12) + 12) % 12 === index) {
      decades.push(`${Math.floor(y / 10)}0s`);
    }
  }
  return decades;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "hsl(42, 70%, 45%)";
  if (score >= 65) return "hsl(42, 50%, 55%)";
  if (score >= 50) return "hsl(42, 30%, 60%)";
  return "hsl(0, 0%, 60%)";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Alta";
  if (score >= 65) return "Buena";
  if (score >= 50) return "Media";
  return "Baja";
}

interface ProfileHubProps {
  profile: UserProfile;
}

export default function ProfileHub({ profile }: ProfileHubProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
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

  const relationMap = useMemo(() => getRelationshipMap(userAnimal as any), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 3);

  const userYear = parseInt(birthDate?.split("-")[0] || "0", 10);
  const sameAnimalFamous = useMemo(
    () => getFamousByAnimal(userAnimal as any, userYear).slice(0, 5),
    [userAnimal, userYear]
  );

  const userSignSymbol = ZODIAC_SYMBOLS[sunSign] || "\u2648";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpand = (label: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const sections = useMemo(() => {
    const taken = new Set<string>();

    function pickSection(
      all: PersonalRecommendation[],
      label: string,
      emoji: string,
    ): { items: PersonalRecommendation[]; label: string; emoji: string } {
      const pool = all.filter(r => !taken.has(r.entity.name));
      if (pool.length === 0) return { items: [], label, emoji };

      const sorted = [...pool].sort((a, b) => b.totalScore - a.totalScore);
      const top = sorted.slice(0, 5);
      const good = sorted.slice(5, 8);
      const worst = sorted
        .slice(-2)
        .filter(r => !top.includes(r) && !good.includes(r));
      const items = [...top, ...good, ...worst].slice(0, 10);
      items.forEach(r => taken.add(r.entity.name));
      return { items, label, emoji };
    }

    return [
      pickSection(recommendationMap.byCategory.country ?? [], "Países", "🌍"),
      pickSection(recommendationMap.byCategory.city ?? [], "Ciudades", "🏛"),
      pickSection(
        (recommendationMap.byCategory.brand ?? []).filter(r => !r.entity.keyThemes?.includes("Lujo")),
        "Marcas", "✧"
      ),
    ];
  }, [recommendationMap]);

  const handleShareProfile = async () => {
    try {
      const hash = await generateProfileHash(profile);
      storeSharedProfile(profile, hash);
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/perfil/${hash}`;

      if (navigator.share) {
        await navigator.share({
          title: `${name} — Mi mapa en Molino`,
          text: "Descubrí mi mapa personal en Molino",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado", {
          description: "Compartí tu perfil con quien quieras",
        });
      }
    } catch {
      toast.error("No se pudo compartir el perfil");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Grainient
        timeSpeed={0.12}
        contrast={1.15}
        grainAmount={0.06}
        grainScale={2.5}
        zoom={1.3}
        warpAmplitude={35}
        color1="#EADCC4"
        color2="#F5EDE0"
        color3="#D4BE90"
      />

      <div className="relative z-10">
        {/* ══════ HERO + IDENTITY (editorial) ══════ */}
        <section className="pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium">
                    Mi Mapa Personal
                  </p>
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted/50 hover:text-accent transition-colors font-medium"
                    aria-label="Compartir perfil"
                  >
                    <Share2 className="h-3 w-3" />
                    Compartir
                  </button>
                </div>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight text-foreground leading-[0.9] mb-4">
                  {name}
                </h1>
                <p className="text-base sm:text-lg text-muted/70 max-w-xl leading-relaxed mb-8">
                  Tu identidad simbólica, tus patrones y tus afinidades.
                </p>

                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-1">Signo Solar</p>
                    <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">{userSignSymbol} {sunSign}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-1">Animal Chino</p>
                    <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">{display.emoji} {display.name} de {profile.chineseZodiacInfo?.element ?? ""}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-1">Camino de Vida</p>
                    <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">{lifePath}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted/50 font-medium mb-1">Nº de la Suerte</p>
                    <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">{profile.luckyNumber}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40">
                  <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/80" style={{ color: elementColor }}>
                    Sos {archetypeName}
                  </p>
                  {archetype?.quote && (
                    <p className="text-sm sm:text-base text-muted/70 italic mt-2 max-w-lg leading-relaxed">
                      &ldquo;{archetype.quote}&rdquo;
                    </p>
                  )}
                </div>

                {codeEntries.length > 0 && (
                  <div className="flex flex-wrap gap-5 mt-6 pt-6 border-t border-border/40">
                    {codeEntries.map((entry) => (
                      <div key={entry.label}>
                        <p className="font-serif text-2xl font-bold text-foreground">{entry.num}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted/50 font-medium">{entry.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-5 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-full bg-card/60 backdrop-blur-sm border border-border/60 flex items-center justify-center">
                    <span className="text-6xl sm:text-7xl lg:text-8xl">{display.emoji}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pb-20 sm:pb-32 space-y-10">

          {/* ══════ CIRCLE — dato de color ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">{display.emoji}</span>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground">Tu Círculo</p>
              <span className="text-xs sm:text-sm text-muted/50">— Tus aliados</span>
              <div className="flex-1 border-t border-border/30" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sameFriends.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {sameFriends.map((f) => {
                    const decades = getAnimalDecades(f.animal);
                    return (
                      <div key={f.animal}>
                        <p className="font-serif text-base font-semibold text-foreground mb-2">{f.animal}</p>
                        <div className="flex gap-1.5 flex-wrap max-w-[320px]">
                          {decades.slice(0, 10).map((d, di) => (
                            <span key={d} className="text-[10px] text-muted/50 font-mono" style={{ opacity: 1 - (di / 10) * 0.6 }}>{d}</span>
                          ))}
                          {decades.length > 10 && <span className="text-[10px] text-muted/40 font-mono">+{decades.length - 10} más</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {sameAnimalFamous.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-muted/50 font-medium mb-3">Famosos como vos</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {sameAnimalFamous.map((f) => (
                      <div key={f.name} className="flex items-center gap-2">
                        <span className="text-base shrink-0">{f.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-tight">{f.name}</p>
                          <p className="text-[10px] text-muted/50">{f.field} · {f.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ══════ WORLD — editorial premium ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium">Tu Mundo</p>
              <div className="flex-1 border-t border-border/30" />
            </div>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground leading-tight mb-8">
              Lugares, ciudades y marcas que resuenan con tu energía.
            </p>

            <div className="flex flex-col space-y-10">
              {sections.map((section) => {
                const isExpanded = expanded.has(section.label);
                const visible = isExpanded
                  ? section.items
                  : section.items.filter((r: any) => r.totalScore >= 50).slice(0, 3);
                const hidden = section.items.length - visible.length;

                return (
                  <div key={section.label}>
                    <div className="flex items-center gap-4 mb-5">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-muted/60 font-semibold">{section.label}</p>
                      <div className="flex-1 border-t border-border/20" />
                    </div>

                    <div className="space-y-1">
                      {visible.map((r: any, idx: number) => {
                        const isBaja = r.totalScore < 50;
                        const showBorder = idx < visible.length - 1;
                        return (
                          <div
                            key={r.entity.id}
                            className={`group flex items-center gap-4 py-3 sm:py-3.5 transition-all duration-200 hover:bg-card/40 hover:rounded-lg hover:px-3 -mx-3 ${showBorder ? "border-b border-border/10" : ""}`}
                          >
                            <span className="w-8 text-center shrink-0 text-base">{r.entity.emoji || section.emoji}</span>

                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm sm:text-base font-semibold text-foreground group-hover:text-accent transition-colors" title={r.entity.name}>
                                {r.entity.name}
                              </p>
                              <p className="text-[10px] text-muted/50 mt-0.5">
                                {r.entity.type === "country" ? "País" : r.entity.type === "city" ? "Ciudad" : "Marca"} · {r.entity.foundingYear ? `Fundado en ${r.entity.foundingYear}` : ""}
                              </p>
                            </div>

                            <div className="hidden sm:block w-28 lg:w-36">
                              <div className="relative h-1 rounded-full bg-border/30 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500 group-hover:scale-y-150 group-hover:origin-bottom"
                                  style={{
                                    width: `${Math.min(100, Math.max(0, r.totalScore))}%`,
                                    backgroundColor: getScoreColor(r.totalScore),
                                  }}
                                />
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-lg sm:text-xl font-bold leading-none font-serif" style={{ color: getScoreColor(r.totalScore) }}>
                                {r.totalScore}
                              </p>
                              <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] mt-0.5 font-medium" style={{ color: getScoreColor(r.totalScore) }}>
                                {getScoreLabel(r.totalScore)}
                              </p>
                            </div>

                            {isBaja && (
                              <span className="text-[10px] text-red-400/60 shrink-0 hidden sm:inline" title="Energía desafiante">⚡</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!isExpanded && hidden > 0 && (
                      <button
                        onClick={() => toggleExpand(section.label)}
                        className="group mt-3 text-[11px] text-muted/50 hover:text-accent transition-colors font-medium flex items-center gap-1.5"
                      >
                        <span>Ver los {hidden} restantes</span>
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    )}

                    {isExpanded && (
                      <button
                        onClick={() => toggleExpand(section.label)}
                        className="group mt-3 text-[11px] text-muted/50 hover:text-accent transition-colors font-medium flex items-center gap-1.5"
                      >
                        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                        <span>Mostrar menos</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {sections.every(s => s.items.length === 0) && (
              <p className="text-sm text-muted/60">Todavía no hay conexiones calculadas.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
