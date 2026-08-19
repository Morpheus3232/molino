"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { ProfileTab } from "./ProfileTabs";

interface MapaIdentityProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

/* Preguntas emocionales por Camino de Vida — capa de presentación.
   No toca engines ni cálculos. Si un camino no tiene texto, cae en fallback. */
const LIFEPATH_QUESTIONS: Record<number, string> = {
  1: "¿Qué comienza cuando decidís ser el primero?",
  2: "¿Qué se encuentra en el punto donde todos pueden verse?",
  3: "¿Qué se vuelve posible cuando lo sentís en palabras?",
  4: "¿Qué se sostiene cuando empezás a construir?",
  5: "¿Qué sucede cuando tu necesidad de libertad se convierte en dirección?",
  6: "¿Qué florece cuando cuidás lo cercano?",
  7: "¿Qué ocurre cuando la búsqueda de respuestas se vuelve tu camino?",
  8: "¿Qué se materializa cuando dirigís tu fuerza?",
  9: "¿Qué queda cuando servís a algo más grande?",
  11: "¿Qué percibís antes de que los demás lo vean?",
  22: "¿Qué se vuelve real cuando lo imaginás en grande?",
  33: "¿Qué despierta cuando acompañás a otros?",
};

const FALLBACK_QUESTION = "¿Qué camino aparece cuando escuchás tu propia lectura?";

/* Texto de patrón por Camino de Vida — el "por qué importa" antes del dato. */
const LIFEPATH_PATTERN: Record<number, string> = {
  1: "Tu patrón aparece cuando algo se detiene y algo tiene que empezar.",
  2: "Tu patrón aparece en los puntos donde dos mundos necesitan encontrarse.",
  3: "Tu patrón aparece cuando lo que sentís por dentro pide salir.",
  4: "Tu patrón aparece cuando una idea necesita volverse sólida.",
  5: "Tu patrón aparece cuando todo parece establecido y algo busca abrir una puerta.",
  6: "Tu patrón aparece cuando lo cercano necesita ser cuidado.",
  7: "Tu patrón aparece cuando la superficie deja de alcanzar.",
  8: "Tu patrón aparece cuando la visión pide convertirse en resultado.",
  9: "Tu patrón aparece cuando un ciclo necesita cerrarse.",
  11: "Tu patrón aparece antes de que lo visible confirme lo que intuyes.",
  22: "Tu patrón aparece cuando el sueño es grande y pide forma concreta.",
  33: "Tu patrón aparece cuando el aprendizaje busca transmitirse.",
};

const FALLBACK_PATTERN = "Tu patrón aparece en los momentos en que tu energía pide un rumbo propio.";

function getLifePathQuestion(lifePath: number) {
  return LIFEPATH_QUESTIONS[lifePath] ?? FALLBACK_QUESTION;
}

function getLifePathPattern(lifePath: number) {
  return LIFEPATH_PATTERN[lifePath] ?? FALLBACK_PATTERN;
}

export default function MapaIdentity({ profile, onNavigate }: MapaIdentityProps) {
  const reduceMotion = useSafeReducedMotion();
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[860px] px-5 sm:px-8 lg:px-12">
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-10">
            01 · Tu identidad
          </p>

          <h2 className="font-display text-[clamp(1.5rem,4.5vw,3rem)] tracking-tight text-foreground leading-[1.05] max-w-[620px]">
            {getLifePathQuestion(lifePath)}
          </h2>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            El arquetipo de tu mapa
          </p>
          <p className="mt-3 font-heading text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
            {archetype.name}
          </p>

          <p className="mt-8 text-base sm:text-lg text-muted leading-relaxed max-w-[600px]">
            {getLifePathPattern(lifePath)}
          </p>

          <div className="mt-10 flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Camino de Vida
            </span>
            <span className="font-heading text-xl sm:text-2xl text-foreground tracking-tight">
              {lifePath}
            </span>
            <span className="text-sm text-muted mt-2 max-w-[480px]">
              tu forma simbólica de avanzar
            </span>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("identity")}
              className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            >
              Leer la lectura completa →
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
