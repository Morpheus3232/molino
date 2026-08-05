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
import MapaIdentity from "@/components/profile/MapaIdentity";
import MapaMundo from "@/components/profile/MapaMundo";
import MapaCirculo from "@/components/profile/MapaCirculo";
import type { ProfileTab } from "./ProfileTabs";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter?: (tab: ProfileTab) => void;
}

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
          HERO — revelación, no ficha técnica.
          Orden: apertura narrativa → arquetipo → contexto.
          ═══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 15%, ${elementColor}16, transparent 72%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[860px] px-5 sm:px-8 lg:px-12 pt-24 sm:pt-36 pb-24 sm:pb-32">
          <motion.div {...heroItem(0)}>
            <p className="label-micro text-muted">Mi mapa personal</p>
          </motion.div>

          <motion.div {...heroItem(0.15)} className="mt-14">
            <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed max-w-[560px]">
              {opening[0]}
              <br />
              {opening[1]}
            </p>
          </motion.div>

          {/* Pausa visual: la pregunta prepara la revelación. */}
          <motion.div {...heroItem(0.45)} className="mt-16">
            <p className="text-base sm:text-lg italic text-muted leading-relaxed max-w-[520px]">
              {question}
            </p>
          </motion.div>

          {/* El momento: el arquetipo es la revelación. */}
          <motion.div {...heroItem(0.8)} className="mt-16 sm:mt-20">
            <h1 className="font-display text-[clamp(3rem,11vw,8rem)] tracking-tight text-foreground leading-[0.9] uppercase">
              {archetypeName}
            </h1>
            <p className="mt-6 text-lg sm:text-xl italic text-foreground/75 leading-relaxed max-w-[520px]">
              {essence}
            </p>
          </motion.div>

          <motion.div {...heroItem(1.1)} className="mt-10">
            <p className="text-sm sm:text-base text-muted tracking-wide">
              {display.name} de {chineseElement} · Camino de Vida {lifePath}
            </p>
          </motion.div>

          <motion.div {...heroItem(1.3)} className="mt-10">
            <button
              type="button"
              onClick={() => onEnter?.("identity")}
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            >
              Comenzar la lectura →
            </button>
          </motion.div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 01 · TU IDENTIDAD
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <MapaIdentity profile={profile} onNavigate={onEnter} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 02 · TU MUNDO
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <MapaMundo profile={profile} worldCount={worldCount} onNavigate={onEnter} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 03 · TU CÍRCULO
          ═══════════════════════════════════════════════ */}
      <motion.div {...chapterReveal}>
        <MapaCirculo profile={profile} allies={allies} onNavigate={onEnter} />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          CAPÍTULO 04 · TU INTELIGENCIA
          Evolución natural del mapa — no un muro.
          ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-10">
              04
            </p>
            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] uppercase tracking-tight text-foreground leading-[0.95] max-w-[650px]">
              La lectura profunda
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-[600px]">
              Hasta ahora viste las piezas. Aquí aparece la conversación
              entre ellas — tu identidad, tus ciclos y tus patrones
              vistos como un solo sistema.
            </p>
            <button
              type="button"
              onClick={() => onEnter?.("intelligence")}
              className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            >
              Continuar la lectura →
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
