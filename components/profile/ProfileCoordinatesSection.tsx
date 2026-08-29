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
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";
import LifePathGlyph from "@/components/ui/LifePathGlyph";

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
          Sin procesos opacos: la regla aritmética y astronómica de cada pilar queda expuesta.
        </p>
      </div>

      <div className="space-y-8 lg:space-y-10">
        {/* ── 01 / Numerología Pitagórica ──────────────────────────── */}
        <motion.article {...editorialReveal} className="group">
          <div className="relative rounded-[--radius-xl] border border-ink/8 bg-card overflow-hidden">
            {/* Barra vertical de acento */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header con número grande */}
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center text-accent">
                    <LifePathGlyph value={lifePath} size={72} />
                  </span>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                      01 · Numerología Pitagórica
                    </span>
                    <span className="block font-mono text-[11px] text-muted mt-0.5">
                      Camino de Vida
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="space-y-4">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] tracking-tight uppercase">
                  {archetypeName}
                </h3>

                <p className="font-serif text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                  {archetype.essence || archetype.description}
                </p>

                {archetype.quote && (
                  <blockquote className="font-serif italic text-sm sm:text-base text-foreground/80 border-l-2 border-accent/40 pl-4 py-1 max-w-xl">
                    &ldquo;{archetype.quote}&rdquo;
                  </blockquote>
                )}

                {/* Badges de Números Maestros */}
                {masterHits.length > 0 && (
                  <div className="pt-3 space-y-2">
                    {masterHits.map((hit) => (
                      <div
                        key={`${hit.position}-${hit.number}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-[--radius-sm]"
                      >
                        <span className="font-mono text-xs font-bold text-accent">
                          Nº Maestro {hit.number}
                        </span>
                        <span className="text-xs text-muted">
                          en {hit.position === "lifePath" ? "Camino de Vida" : hit.position === "expression" ? "Expresión" : "Personalidad"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: fórmula y datos */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-muted/70">
                  <span>
                    Fórmula: Suma de dígitos ({profile.birthDate}) reducida a base 9
                  </span>
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
          </div>
        </motion.article>

        {/* ── 02 / Astrología Occidental ───────────────────────────── */}
        <motion.article {...editorialReveal} className="group">
          <div className="relative rounded-[--radius-xl] border border-ink/8 bg-card overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center text-accent">
                    <AstrologySignIcon
                      sign={profile.sunSign || ""}
                      size={72}
                      className="text-accent"
                    />
                  </span>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                      02 · Astrología Occidental
                    </span>
                    <span className="block font-mono text-[11px] text-muted mt-0.5">
                      Posicionamiento Solar
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-4">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] tracking-tight uppercase">
                  Sol en {profile.sunSign}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 bg-background border border-ink/10 rounded-[--radius-sm] font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    Elemento {profile.sunSignInfo?.element || profile.element}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-background border border-ink/10 rounded-[--radius-sm] font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    Modalidad {profile.sunSignInfo?.modality || profile.modality}
                  </span>
                  {astroInfo?.archetype && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-[--radius-sm] font-mono text-[11px] uppercase tracking-[0.12em] text-accent font-bold">
                      {astroInfo.archetype}
                    </span>
                  )}
                </div>

                <p className="font-serif text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                  {astroInfo?.description ||
                    `Tu energía solar en ${profile.sunSign} expresa la modalidad ${profile.modality?.toLowerCase() || "fundamental"} y el elemento ${profile.element?.toLowerCase() || "natal"}.`}
                </p>

                {astroInfo?.keywords && (
                  <p className="font-mono text-xs text-muted">
                    Rasgos clave: {astroInfo.keywords.join(" · ")}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="text-[11px] font-mono text-muted/70">
                  Geometría celeste: luminaria solar sobre el horizonte en el momento natal
                </span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ── 03 / Zodíaco Chino ──────────────────────────────────── */}
        <motion.article {...editorialReveal} className="group">
          <div className="relative rounded-[--radius-xl] border border-ink/8 bg-card overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center text-accent">
                    <ZodiacAnimalIcon animal={userAnimal} size={72} />
                  </span>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                      03 · Zodíaco Chino
                    </span>
                    <span className="block font-mono text-[11px] text-muted mt-0.5">
                      Ciclo Sexagesimal
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-4">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] tracking-tight uppercase">
                  {display.name} de {chineseElement}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 bg-background border border-ink/10 rounded-[--radius-sm] font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    Polaridad {polarity}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-background border border-ink/10 rounded-[--radius-sm] font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    Tronco {chineseElement}
                  </span>
                </div>

                <p className="font-serif text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                  {animalInfo?.description ||
                    `Nacido bajo la influencia de ${display.name}, integrás la energía del elemento ${chineseElement} en polaridad ${polarity}.`}
                </p>

                {/* Relaciones del ciclo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-background border border-ink/5 rounded-[--radius-md]">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-accent font-bold mb-1.5">
                      Tus dos amigos · 三合
                    </span>
                    <span className="block font-heading text-lg font-bold text-foreground">
                      {allies.length > 0 ? allies.join(" y ") : "Tríada armónica"}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-muted">
                      Cuatro posiciones en el ciclo
                    </span>
                  </div>

                  <div className="p-4 bg-background border border-ink/5 rounded-[--radius-md]">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted font-bold mb-1.5">
                      Tu energía opuesta · 六冲
                    </span>
                    <span className="block font-heading text-lg font-bold text-foreground">
                      {enemy || "Oposición directa"}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-muted">
                      Seis posiciones en el ciclo
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="text-[11px] font-mono text-muted/70">
                  Cálculo luni-solar: corte exacto de Año Nuevo chino (21 de enero a 21 de febrero)
                </span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ── 04 / Ciclos y Tiempo Personal ────────────────────────── */}
        <motion.article {...editorialReveal} className="group">
          <div className="relative rounded-[--radius-xl] border border-ink/8 bg-card overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header con número grande */}
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[56px] sm:text-6xl font-bold leading-none text-accent tabular-nums">
                    {personalYear}
                  </span>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                      04 · Ciclos de Tiempo
                    </span>
                    <span className="block font-mono text-[11px] text-muted mt-0.5">
                      Frecuencia Anual Activa
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-4">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] tracking-tight uppercase">
                  Año Personal {personalYear} · {yearTheme || "Ciclo de Tiempo"}
                </h3>

                <p className="font-serif text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                  El ciclo de nueve años modula cómo se expresa tu Camino de Vida durante el año en curso.
                  Cada año transita una etapa de un ciclo evolutivo de 9 fases.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 bg-background border border-ink/5 rounded-[--radius-md]">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted font-bold mb-1.5">
                      Año Personal
                    </span>
                    <span className="block font-mono text-3xl font-bold text-accent tabular-nums">
                      {personalYear}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      {yearTheme || "Fase anual"}
                    </span>
                  </div>

                  <div className="p-4 bg-background border border-ink/5 rounded-[--radius-md]">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted font-bold mb-1.5">
                      Mes Personal
                    </span>
                    <span className="block font-mono text-3xl font-bold text-foreground tabular-nums">
                      {personalMonth}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      Modulación mensual
                    </span>
                  </div>

                  <div className="p-4 bg-background border border-ink/5 rounded-[--radius-md]">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted font-bold mb-1.5">
                      Día Personal
                    </span>
                    <span className="block font-mono text-3xl font-bold text-foreground tabular-nums">
                      {personalDay}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      Vibración de hoy
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="text-[11px] font-mono text-muted/70">
                  Aritmética teosófica cíclica: Día ({profile.birthDate.split("-")[2] || "1"}) + Mes ({profile.birthDate.split("-")[1] || "1"}) + Año en curso
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}