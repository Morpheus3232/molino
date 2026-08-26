"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES } from "@/lib/data";
import { getRelationshipMap, getClashPartner } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { SIGN_INTERPRETATIONS_ES } from "@/lib/data/interpretations/astrology-interpretations";
import { ANIMAL_INTERPRETATIONS_ES } from "@/lib/data/interpretations/chinese-zodiac-interpretations";
import type { WesternSign } from "@/lib/data/facts/astrology-facts";
import type { ChineseAnimal } from "@/lib/data/facts/chinese-zodiac-facts";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { getMasterNumbers, getMasterPositionMeaning, type MasterPosition } from "@/lib/engines/numerologyEngine";
import { safeNumber } from "@/lib/utils/score";
import { editorialReveal } from "@/lib/utils/motion";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface ProfileCoordinatesSectionProps {
  profile: UserProfile;
}

const YANG_ANIMALS = new Set(["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"]);

export default function ProfileCoordinatesSection({ profile }: ProfileCoordinatesSectionProps) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name;

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const polarity = YANG_ANIMALS.has(userAnimal) ? "Yang" : "Yin";

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const allies = relationMap.friends
    .filter((f) => f.type === "triad")
    .map((f) => f.animal);
  const enemy = getClashPartner(userAnimal) || "";

  const sunSign = (profile.sunSign || "Aries") as WesternSign;
  const astroInfo = SIGN_INTERPRETATIONS_ES[sunSign];
  const animalInfo = ANIMAL_INTERPRETATIONS_ES[userAnimal as ChineseAnimal];

  const personalYear = profile.cycles?.personalYear ?? 1;
  const personalMonth = profile.cycles?.personalMonth ?? 1;
  const personalDay = profile.cycles?.personalDay ?? 1;
  const yearTheme = getYearTheme(personalYear);

  const masterHits = useMemo(() => getMasterNumbers(profile), [profile]);

  return (
    <section
      className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-border"
      aria-label="Coordenadas fundamentales del mapa"
    >
      <div className="max-w-3xl mb-16 lg:mb-20">
        <span className="block font-mono text-xs uppercase tracking-[0.25em] text-accent mb-3">
          COORDENADAS FUNDAMENTALES
        </span>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight uppercase leading-[0.95]">
          LOS CUATRO PILARES
          <br />
          DE TU MAPA.
        </h2>
        <p className="mt-4 font-serif text-base sm:text-lg text-muted leading-relaxed">
          Cada sistema calcula una coordenada exacta a partir de tu fecha de nacimiento.
          Sin cajas negras: la regla aritmética y astronómica de cada pilar queda expuesta.
        </p>
      </div>

      <div className="space-y-16 lg:space-y-20">
        {/* ── 01 / Numerología Pitagórica ──────────────────────────── */}
        <motion.article {...editorialReveal} className="border-t border-border pt-12 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 flex items-baseline lg:flex-col gap-4 lg:gap-2">
              <span className="font-mono text-[56px] sm:text-6xl font-bold leading-none text-accent tabular-nums">
                {lifePath}
              </span>
              <div>
                <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  01 / NUMEROLOGÍA PITAGÓRICA
                </span>
                <span className="block font-mono text-xs text-muted/80 mt-0.5">
                  Camino de Vida
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-display text-2xl sm:text-[32px] font-bold text-foreground leading-tight tracking-tight uppercase">
                {archetypeName}
              </h3>

              <p className="font-serif text-base sm:text-[18px] text-muted leading-relaxed">
                {archetype.essence || archetype.description}
              </p>

              {archetype.quote && (
                <p className="font-serif italic text-sm sm:text-base text-foreground/80 border-l-2 border-accent/40 pl-4 py-1">
                  &ldquo;{archetype.quote}&rdquo;
                </p>
              )}

              {/* Badges de Números Maestros si aplican */}
              {masterHits.length > 0 && (
                <div className="pt-2 space-y-2">
                  {masterHits.map((hit) => (
                    <div
                      key={`${hit.position}-${hit.number}`}
                      className="p-3.5 bg-paper-alt border border-accent/30 rounded-md text-xs font-mono text-foreground"
                    >
                      <span className="text-accent font-bold uppercase tracking-wider">
                        Número Maestro {hit.number} en {hit.position === "lifePath" ? "Camino de Vida" : hit.position === "expression" ? "Expresión" : "Personalidad"}
                      </span>
                      <p className="font-serif text-muted text-xs sm:text-sm mt-1 leading-relaxed">
                        {getMasterPositionMeaning(hit.number, hit.position as MasterPosition)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted/70 border-t border-border/60">
                <span>Fórmula: Suma de dígitos ({profile.birthDate}) reducida a base 9</span>
                {profile.expressionNumber && (
                  <>
                    <span className="w-px h-3 bg-border" aria-hidden="true" />
                    <span>Expresión: {profile.expressionNumber}</span>
                  </>
                )}
                {profile.personalityNumber && (
                  <>
                    <span className="w-px h-3 bg-border" aria-hidden="true" />
                    <span>Personalidad: {profile.personalityNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.article>

        {/* ── 02 / Astrología Occidental ───────────────────────────── */}
        <motion.article {...editorialReveal} className="border-t border-border pt-12 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 flex items-baseline lg:flex-col gap-4 lg:gap-2">
              <span className="font-mono text-[56px] sm:text-6xl font-bold leading-none text-accent">
                {profile.sunSignInfo?.symbol || "☉"}
              </span>
              <div>
                <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  02 / ASTROLOGÍA TROPICAL
                </span>
                <span className="block font-mono text-xs text-muted/80 mt-0.5">
                  Posicionamiento Solar
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-display text-2xl sm:text-[32px] font-bold text-foreground leading-tight tracking-tight uppercase">
                Sol en {profile.sunSign}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 bg-paper-alt rounded-sm text-foreground">
                  Elemento {profile.sunSignInfo?.element || profile.element}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 bg-paper-alt rounded-sm text-foreground">
                  Modalidad {profile.sunSignInfo?.modality || profile.modality}
                </span>
                {astroInfo?.archetype && (
                  <span className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 bg-accent/10 text-accent rounded-sm">
                    {astroInfo.archetype}
                  </span>
                )}
              </div>

              <p className="font-serif text-base sm:text-[18px] text-muted leading-relaxed">
                {astroInfo?.description ||
                  `Tu energía solar en ${profile.sunSign} expresa la modalidad ${profile.modality?.toLowerCase() || "fundamental"} y el elemento ${profile.element?.toLowerCase() || "natal"}.`}
              </p>

              {astroInfo?.keywords && (
                <p className="font-mono text-xs text-muted">
                  Rasgos clave: {astroInfo.keywords.join(" · ")}
                </p>
              )}

              <div className="pt-4 text-xs font-mono text-muted/70 border-t border-border/60">
                <span>Geometría celeste: luminaria solar sobre el horizonte en el momento natal</span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ── 03 / Zodíaco Chino ──────────────────────────────────── */}
        <motion.article {...editorialReveal} className="border-t border-border pt-12 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 flex items-baseline lg:flex-col gap-4 lg:gap-2">
              <span className="inline-flex items-center justify-center text-accent">
                <ZodiacAnimalIcon animal={userAnimal} size={56} />
              </span>
              <div>
                <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  03 / ZODÍACO CHINO
                </span>
                <span className="block font-mono text-xs text-muted/80 mt-0.5">
                  Ciclo Sexagesimal
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-display text-2xl sm:text-[32px] font-bold text-foreground leading-tight tracking-tight uppercase">
                {display.name} de {chineseElement}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 bg-paper-alt rounded-sm text-foreground">
                  Polaridad {polarity}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 bg-paper-alt rounded-sm text-foreground">
                  Tronco {chineseElement}
                </span>
              </div>

              <p className="font-serif text-base sm:text-[18px] text-muted leading-relaxed">
                {animalInfo?.description ||
                  `Nacido bajo la influencia de ${display.name}, integrás la energía del elemento ${chineseElement} en polaridad ${polarity}.`}
              </p>

              {/* Relaciones del ciclo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-paper-alt rounded-md border border-border/80">
                  <span className="block font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                    Tus dos amigos (三合 San He)
                  </span>
                  <span className="mt-1 block font-heading text-base font-bold text-foreground">
                    {allies.length > 0 ? allies.join(" y ") : "Tríada armónica"}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    Cuatro posiciones en el ciclo · Misma afinidad elemental oculta
                  </span>
                </div>

                <div className="p-4 bg-paper-alt rounded-md border border-border/80">
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                    Tu energía opuesta (六冲 Liu Chong)
                  </span>
                  <span className="mt-1 block font-heading text-base font-bold text-foreground">
                    {enemy || "Oposición directa"}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    Seis posiciones en el ciclo · Eje polar de máxima tensión
                  </span>
                </div>
              </div>

              <div className="pt-4 text-xs font-mono text-muted/70 border-t border-border/60">
                <span>Cálculo luni-solar: corte exacto de Año Nuevo chino (21 de enero a 21 de febrero)</span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ── 04 / Ciclos y Tiempo Personal ────────────────────────── */}
        <motion.article {...editorialReveal} className="border-t border-border pt-12 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 flex items-baseline lg:flex-col gap-4 lg:gap-2">
              <span className="font-mono text-[56px] sm:text-6xl font-bold leading-none text-accent tabular-nums">
                {personalYear}
              </span>
              <div>
                <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  04 / CICLOS DE TIEMPO
                </span>
                <span className="block font-mono text-xs text-muted/80 mt-0.5">
                  Frecuencia Anual Activa
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-display text-2xl sm:text-[32px] font-bold text-foreground leading-tight tracking-tight uppercase">
                Año Personal {personalYear} · {yearTheme || "Ciclo de Tiempo"}
              </h3>

              <p className="font-serif text-base sm:text-[18px] text-muted leading-relaxed">
                El ciclo de nueve años modula cómo se expresa tu Camino de Vida durante el año en curso.
                Cada año transita una etapa de un ciclo evolutivo de 9 fases.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-paper-alt rounded-md border border-border/80">
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted">
                    Año Personal
                  </span>
                  <span className="mt-1 block font-mono text-2xl font-bold text-accent tabular-nums">
                    {personalYear}
                  </span>
                  <span className="mt-1 block text-xs text-muted font-sans">
                    {yearTheme || "Fase anual"}
                  </span>
                </div>

                <div className="p-4 bg-paper-alt rounded-md border border-border/80">
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted">
                    Mes Personal
                  </span>
                  <span className="mt-1 block font-mono text-2xl font-bold text-foreground tabular-nums">
                    {personalMonth}
                  </span>
                  <span className="mt-1 block text-xs text-muted font-sans">
                    Modulación mensual
                  </span>
                </div>

                <div className="p-4 bg-paper-alt rounded-md border border-border/80">
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted">
                    Día Personal
                  </span>
                  <span className="mt-1 block font-mono text-2xl font-bold text-foreground tabular-nums">
                    {personalDay}
                  </span>
                  <span className="mt-1 block text-xs text-muted font-sans">
                    Vibración de hoy
                  </span>
                </div>
              </div>

              <div className="pt-4 text-xs font-mono text-muted/70 border-t border-border/60">
                <span>Aritmética teosófica cíclica: Día ({profile.birthDate.split("-")[2] || "1"}) + Mes ({profile.birthDate.split("-")[1] || "1"}) + Año en curso</span>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
