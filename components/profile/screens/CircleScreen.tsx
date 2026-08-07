"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getRelationshipMap, getRelation, type Animal, type AnimalRelation } from "@/lib/data/animalRelations";
import { getFamousByAnimal, type FamousPerson } from "@/lib/data/famousPeople";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import EditorialSection from "@/components/ui/EditorialSection";
import ZodiacMark from "@/components/ui/ZodiacMark";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import { getScoreLabel, getScoreColor } from "@/lib/utils/score";

/**
 * Posiciones radiales (viewBox 0-100) para la composición: vos en el
 * centro, aliados en el arco superior, tensión en el arco inferior.
 * Generado por conteo real de relaciones (getFriends/getChallenging
 * devuelven hasta 3 y 2 respectivamente) en vez de dos slots fijos que
 * truncaban o desperdiciaban espacio según el animal.
 */
function arcSlots(count: number, centerDeg: number, spreadDeg: number, radius = 33): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (count === 1) return [angleToXY(centerDeg, radius)];
  const start = centerDeg - spreadDeg / 2;
  const step = spreadDeg / (count - 1);
  return Array.from({ length: count }, (_, i) => angleToXY(start + i * step, radius));
}

function angleToXY(deg: number, radius: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + radius * Math.sin(rad), y: 50 - radius * Math.cos(rad) };
}

interface CircleScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

function FamousPersonCard({ person, index, userAnimal }: { person: FamousPerson; index: number; userAnimal: Animal }) {
  return (
    <motion.div
      {...staggerItemSmooth}
      transition={{ delay: staggerDelay(index, 0.06), duration: 0.35 }}
      className="group p-4 rounded-xl border border-ink/10 bg-background hover:border-accent/30 hover:bg-accent/5 transition-all"
    >
      <div className="flex items-start gap-3">
        <ZodiacMark
          animal={userAnimal}
          color="var(--color-accent)"
          size="sm"
          showLabel={false}
          hidePosition={false}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{person.name}</p>
          <p className="text-sm text-muted leading-relaxed mt-0.5">
            {person.field}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted">{person.year}</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted/50">·</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted">{person.country}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CircleScreen({ profile, onNavigate }: CircleScreenProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const userCountry = useUserContext().country;
  const [reduceMotion] = useState(false);

  const display = getZodiacDisplay(userAnimal);
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  
  // Aliados: tríada + armoniosos (no solo tríada)
  const allies: AnimalRelation[] = useMemo(
    () => [...relationMap.friends.filter(f => f.type === "triad"), ...relationMap.friends.filter(f => f.type === "harmonious")],
    [relationMap.friends]
  );
  const tensions: AnimalRelation[] = relationMap.challenging;
  
  // Arcos más amplios para mejor legibilidad
  const allySlots = useMemo(() => arcSlots(allies.length, 0, allies.length > 1 ? 130 : 0, 36), [allies.length]);
  const tensionSlots = useMemo(() => arcSlots(tensions.length, 180, tensions.length > 1 ? 100 : 0, 36), [tensions.length]);

  const sameAnimalFamous = useMemo(
    () => getFamousByAnimal(userAnimal, userYear),
    [userAnimal, userYear]
  );
  const rankedFamous = useMemo(() => {
    const country = userCountry;
    const ageTolerance = 10;
    return [...sameAnimalFamous].sort((a, b) => {
      const aSame = a.country === country ? 1 : 0;
      const bSame = b.country === country ? 1 : 0;
      if (aSame !== bSame) return bSame - aSame;
      const aAge = Math.abs(a.year - userYear) <= ageTolerance ? 1 : 0;
      const bAge = Math.abs(b.year - userYear) <= ageTolerance ? 1 : 0;
      if (aAge !== bAge) return bAge - aAge;
      return a.name.localeCompare(b.name);
    });
  }, [sameAnimalFamous, userCountry, userYear]);

  return (
    <div
      id="panel-circle"
      role="tabpanel"
      aria-labelledby="tab-circle"
    >
      {/* Hero */}
      <section className="py-12 sm:pt-16 pb-8">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
              TU CÍRCULO
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] tracking-tight text-foreground">
              LAS ENERGÍAS
              <br />
              QUE TE RODEAN.
            </h1>
            <p className="text-base lg:text-lg text-muted mt-8 max-w-xl leading-relaxed">
              Algunas energías amplifican tu camino.
              Otras muestran dónde aparece la tensión.
            </p>
            {(sameAnimalFamous.length) > 0 && (
              <p className="text-sm text-accent mt-5">
                Encontramos {sameAnimalFamous.length} figuras históricas que comparten tu {display.name.toLowerCase()} — tu círculo real, no una lista al azar.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TU RED ZODIACAL — composición radial, no grid de cards.
          Vos en el centro; aliados arriba; tensión abajo
          (oposición). La relación se ve en la posición, no hay que leer
          un párrafo para entenderla.
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        tone="ink"
        eyebrow="TU RED ZODIACAL"
        title="QUIÉN TE RODEA."
        texture="circle"
      >
        <div className="relative mx-auto max-w-lg aspect-square mt-8 mb-6">
          {/* Background cycle ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-paper)"
              strokeWidth="0.5"
              opacity="0.15"
            />
            {/* 12 positions markers */}
            {Array.from({ length: 12 }, (_, i) => {
              const pos = i + 1;
              const angle = ((pos - 1) * 30 - 90) * (Math.PI / 180);
              const x = 50 + 42 * Math.cos(angle);
              const y = 50 + 42 * Math.sin(angle);
              return (
                <g key={pos} className="group">
                  <circle cx={x} cy={y} r="2.5" fill="var(--color-paper)" opacity="0.2" />
                  <text
                    x={50 + 48 * Math.cos(angle)}
                    y={50 + 48 * Math.sin(angle) + 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
                    fill="var(--color-paper)"
                    opacity="0.25"
                    fontFamily="var(--font-mono)"
                    className="group-hover:opacity-100 transition-opacity"
                  >
                    {pos}
                  </text>
                </g>
              );
            })}
            
            {/* Connection lines - allies */}
            {allies.map((rel, i) => (
              <motion.line
                key={`line-ally-${rel.animal}`}
                initial={{ opacity: 0, strokeDasharray: "100", strokeDashoffset: "100" }}
                animate={{ opacity: 1, strokeDasharray: "0", strokeDashoffset: "0" }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                x1="50"
                y1="50"
                x2={allySlots[i].x}
                y2={allySlots[i].y}
                stroke="var(--color-accent-light)"
                strokeWidth={0.5 + (rel.score / 100) * 1.2}
                opacity={0.3 + (rel.score / 100) * 0.4}
                strokeLinecap="round"
              />
            ))}
            
            {/* Connection lines - tensions */}
            {tensions.map((rel, i) => (
              <motion.line
                key={`line-tension-${rel.animal}`}
                initial={{ opacity: 0, strokeDasharray: "100", strokeDashoffset: "100" }}
                animate={{ opacity: 1, strokeDasharray: "0", strokeDashoffset: "0" }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                x1="50"
                y1="50"
                x2={tensionSlots[i].x}
                y2={tensionSlots[i].y}
                stroke="var(--color-paper)"
                strokeWidth="0.6"
                strokeDasharray="3 3"
                opacity={0.45 - (rel.score / 100) * 0.2}
                strokeLinecap="round"
              />
            ))}

            {/* Score rings - visual weight indicators */}
            {allies.map((rel, i) => {
              const scoreRadius = 36 + (rel.score / 100) * 8;
              const angle = Math.atan2(allySlots[i].y - 50, allySlots[i].x - 50);
              const x = 50 + scoreRadius * Math.cos(angle);
              const y = 50 + scoreRadius * Math.sin(angle);
              return (
                <motion.circle
                  key={`score-ally-${rel.animal}`}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 3 + (rel.score / 100) * 2, opacity: 0.6 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                  cx={x}
                  cy={y}
                  fill="var(--color-accent-light)"
                />
              );
            })}
          </svg>

          {/* Center - User */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
            style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
          >
            <ZodiacMark animal={userAnimal} color="var(--color-accent)" size="xl" showLabel={false} hidePosition={false} variant="emoji" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light text-center mt-3">Vos</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 text-center">{display.name}</p>
          </motion.div>

          {/* Allies - upper arc */}
          {allies.map((rel, i) => (
            <motion.div
              key={rel.animal}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute group cursor-pointer"
              style={{ left: `${allySlots[i].x}%`, top: `${allySlots[i].y}%`, transform: "translate(-50%,-50%)" }}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            >
              <ZodiacMark
                animal={rel.animal}
                color="var(--color-accent-light)"
                size="md"
                showLabel={true}
                hidePosition={false}
              />
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="font-mono text-[9px] uppercase tracking-[0.15em] text-accent-light/70 text-center mt-2 whitespace-nowrap"
              >
                {rel.label}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="font-mono text-[8px] uppercase tracking-[0.1em] text-paper/40 text-center mt-1"
              >
                {getScoreLabel(rel.score)}
              </motion.p>
            </motion.div>
          ))}

          {/* Tensions - lower arc */}
          {tensions.map((rel, i) => (
            <motion.div
              key={rel.animal}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
              style={{ left: `${tensionSlots[i].x}%`, top: `${tensionSlots[i].y}%`, transform: "translate(-50%,-50%)" }}
            >
              <ZodiacMark
                animal={rel.animal}
                color="var(--color-paper)"
                size="md"
                showLabel={true}
                hidePosition={false}
              />
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className="font-mono text-[9px] uppercase tracking-[0.15em] text-paper/40 text-center mt-2 whitespace-nowrap"
              >
                {rel.label}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="font-mono text-[8px] uppercase tracking-[0.1em] text-paper/30 text-center mt-1"
              >
                {getScoreLabel(rel.score)}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-paper/50 italic text-center max-w-sm mx-auto mt-4">
          Tensión según la tradición del zodíaco chino — no son predicciones.
        </p>
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          FAMOSOS DEL MISMO ANIMAL
          ═══════════════════════════════════════════════ */}
      {sameAnimalFamous.length > 0 && (
        <EditorialSection
          eyebrow="EN EL MISMO CICLO"
          title={<>OTROS {display.name.toUpperCase()}<br />EN LA HISTORIA.</>}
          intro="Personas nacidas en el mismo animal zodiacal chino, aunque sean de otros años."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-8">
            {rankedFamous.slice(0, 6).map((person, i) => (
              <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} />
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <p className="text-xs text-muted text-center italic">
            Esta lectura es una interpretación simbólica basada en tradiciones culturales. No sustituye juicio propio.
          </p>
        </div>
      </section>
    </div>
  );
}