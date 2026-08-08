"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { calculateAllAffinity } from "@/lib/engines/affinityEngine";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import MapVisualization from "@/components/profile/MapVisualization";
import ProfileSummaryTable from "@/components/profile/ProfileSummaryTable";
import WorldConnections from "@/components/profile/WorldConnections";
import CircleAlignment from "@/components/profile/CircleAlignment";
import FullReadingAccordion from "@/components/profile/FullReadingAccordion";
import ActionButtons from "@/components/profile/ActionButtons";
import type { ProfileTab } from "./ProfileTabs";

/* ═══════════════════════════════════════════════════
   Capa de presentación local del hero.
   Copy narrativo por arquetipo — NO toca engines ni
   cálculos: solo da voz a un valor ya calculado.
   Si un arquetipo no tiene texto, cae en el fallback.
   ═══════════════════════════════════════════════════ */
const ARCHETYPE_OPENINGS: Record<number, { opening: string[]; question: string; essence: string }> = {
  1: {
    opening: [
      "Hay personas que esperan que el mundo les muestre el camino.",
      "Otras lo construyen.",
    ],
    question: "¿Qué comienza cuando decidís ser el primero?",
    essence: "Una identidad que encuentra impulso en los comienzos.",
  },
  2: {
    opening: [
      "Hay personas que imponen su verdad.",
      "Otras encuentran el punto donde todos pueden verse.",
    ],
    question: "¿Qué se encuentra en el punto donde todos pueden verse?",
    essence: "Una identidad que une lo que parece separado.",
  },
  3: {
    opening: [
      "Hay personas que guardan lo que sienten.",
      "Otras lo convierten en palabra.",
    ],
    question: "¿Qué se vuelve posible cuando lo sentís en palabras?",
    essence: "Una identidad que se vuelve visible cuando se expresa.",
  },
  4: {
    opening: [
      "Hay personas que imaginan posibilidades.",
      "Otras tienen la energía para convertirlas en realidad.",
    ],
    question: "¿Qué se sostiene cuando empezás a construir?",
    essence: "Una identidad que convierte ideas en cimientos.",
  },
  5: {
    opening: [
      "Hay personas que encuentran respuestas siguiendo caminos conocidos.",
      "Otras necesitan explorar lo que todavía no existe.",
    ],
    question: "¿Dónde aparece tu energía?",
    essence: "Una identidad que encuentra crecimiento cuando transforma el cambio en camino.",
  },
  6: {
    opening: [
      "Hay personas que buscan ser cuidadas.",
      "Otras encuentran su fuerza cuidando lo cercano.",
    ],
    question: "¿Qué florece cuando cuidás lo cercano?",
    essence: "Una identidad que se fortalece cuidando a quienes la rodean.",
  },
  7: {
    opening: [
      "Hay personas que se quedan en la superficie.",
      "Otras necesitan llegar al fondo de las cosas.",
    ],
    question: "¿Qué se revela cuando llegás al fondo?",
    essence: "Una identidad que busca el sentido detrás de lo visible.",
  },
  8: {
    opening: [
      "Hay personas que sueñan en pequeño.",
      "Otras aprenden a construir lo que imaginan.",
    ],
    question: "¿Qué se materializa cuando dirigís tu fuerza?",
    essence: "Una identidad que aprende a dirigir su propio poder.",
  },
  9: {
    opening: [
      "Hay personas que viven para sí.",
      "Otras encuentran su sentido en lo colectivo.",
    ],
    question: "¿Qué queda cuando servís a algo más grande?",
    essence: "Una identidad que se realiza en lo colectivo.",
  },
  11: {
    opening: [
      "Hay personas que siguen lo evidente.",
      "Otras perciben lo que todavía no tiene forma.",
    ],
    question: "¿Qué percibís antes de que los demás lo vean?",
    essence: "Una identidad que percibe antes de entender.",
  },
  22: {
    opening: [
      "Hay personas que imaginan grandes cosas.",
      "Otras encuentran el modo de hacerlas reales.",
    ],
    question: "¿Qué se vuelve real cuando lo imaginás en grande?",
    essence: "Una identidad que materializa lo que otros solo sueñan.",
  },
  33: {
    opening: [
      "Hay personas que aprenden para sí.",
      "Otras aprenden para acompañar a otros.",
    ],
    question: "¿Qué despierta cuando acompañás a otros?",
    essence: "Una identidad que guía elevando a quienes la rodean.",
  },
};

const FALLBACK_OPENING = {
  opening: [
    "Hay personas que leen su historia en voz baja.",
    "Otras la escuchan con atención.",
  ],
  question: "¿Dónde aparece tu energía?",
  essence: "Una identidad que tu mapa invita a explorar.",
};

function getArchetypeCopy(lifePath: number) {
  return ARCHETYPE_OPENINGS[lifePath] ?? FALLBACK_OPENING;
}

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const reduceMotion = useSafeReducedMotion();

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const elementColor =
    ELEMENT_COLORS[chineseElement] ||
    ELEMENT_COLORS[typeof profile.element === "string" ? profile.element : ""] ||
    "var(--element-fire)";

  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name;
  const { opening, question, essence } = getArchetypeCopy(lifePath);

  const worldCount = useMemo(() => {
    const results = calculateAllAffinity(profile, SYMBOLIC_ENTITIES);
    return results.filter((r) => r.score >= 60).length;
  }, [profile]);

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const allies = relationMap.friends.filter((f) => f.type === "triad").map((f) => f.animal);

  /* Motion — fade + translateY, 300-500ms, sin desplazamiento si
     el usuario prefiere menos movimiento. */
  const heroItem = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.1 : 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const chapterReveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════
          HERO — Dashboard visual, no novela.
          Radar chart protagonista + datos concretos.
          ═══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${elementColor}12, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-14 sm:pb-20">
          {/* Two-column: Radar chart left + Identity right */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-center">
            {/* Radar chart — el protagonista */}
            <motion.div {...heroItem(0.15)} className="flex justify-center">
              <MapVisualization profile={profile} className="w-80 h-80 sm:w-96 sm:h-96" />
            </motion.div>

            {/* Identity block */}
            <div className="text-center lg:text-left">
              {/* Archetype — large, immediate */}
              <motion.div {...heroItem(0.3)}>
                <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] sm:text-[clamp(3rem,7vw,5.5rem)] tracking-tight text-foreground leading-[0.9] uppercase">
                  {archetypeName}
                </h1>
              </motion.div>

              {/* Concrete data row */}
              <motion.div {...heroItem(0.5)} className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#6B4C7A" }} />
                  <span className="font-mono text-sm text-foreground tracking-wide">Camino de Vida {lifePath}</span>
                </span>
                <span className="text-ink/20">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#2E5C8A" }} />
                  <span className="font-mono text-sm text-foreground tracking-wide">{profile.sunSign}</span>
                </span>
                <span className="text-ink/20">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#C49A2A" }} />
                  <span className="font-mono text-sm text-foreground tracking-wide">{display.name} de {chineseElement}</span>
                </span>
              </motion.div>

              {/* Essence — una línea, editorial */}
              <motion.p {...heroItem(0.7)} className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-lg italic">
                {essence}
              </motion.p>

              {/* Poetic opening — sutil, al fondo */}
              <motion.div {...heroItem(0.9)} className="mt-8 pt-6 border-t border-ink/10">
                <p className="text-sm text-muted/70 leading-relaxed max-w-md">
                  {opening[0]} {opening[1]}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          RESUMEN POR SISTEMA — Datos concretos
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal} className="py-8 sm:py-12 border-t border-ink/10">
        <ProfileSummaryTable profile={profile} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 02 · TU MUNDO
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <WorldConnections profile={profile} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 03 · TU CÍRCULO
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <CircleAlignment profile={profile} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 04 · TU LECTURA PROFUNDA — Desbloqueada
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <FullReadingAccordion profile={profile} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          ACCIONES — Exportar, compartir, navegar
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <ActionButtons profile={profile} />
      </motion.div>
    </div>
  );
}

interface ProfileHubProps {
  profile: UserProfile;
  onEnter?: (tab: ProfileTab) => void;
}