/**
 * Situation Guide Engine
 *
 * "Cuando no sabés qué hacer" — practical guidance for common situations
 * (lost, deciding, starting, exhausted, in change, doubting, at a
 * crossroads), grounded in the same real signals the rest of Molino already
 * computes: the archetype's real strength/challenge (ARCHETYPE_DESCRIPTIONS)
 * and the current moment's focus (buildMomentState — Acción/Construcción/
 * Preparación/Descanso, itself derived from real daily-energy + cycle data).
 *
 * No AI. No external APIs. Pure deterministic logic — same discipline as
 * synthesisEngine.ts, kept separate because this is keyed by SITUATION
 * (a user-chosen context) rather than by profile signal.
 */

import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";

export type Situation =
  | "lost"
  | "deciding"
  | "starting"
  | "exhausted"
  | "change"
  | "doubting"
  | "crossroads";

export interface SituationOption {
  key: Situation;
  label: string;
}

export const SITUATIONS: SituationOption[] = [
  { key: "lost", label: "Estoy perdido" },
  { key: "deciding", label: "Tengo que decidir" },
  { key: "starting", label: "Estoy empezando algo" },
  { key: "exhausted", label: "Estoy agotado" },
  { key: "change", label: "Estoy atravesando un cambio" },
  { key: "doubting", label: "Estoy dudando" },
  { key: "crossroads", label: "Tengo que elegir entre dos caminos" },
];

export interface SituationGuidance {
  guidance: string;
  action: string;
}

/**
 * `momentFocus` is buildMomentState(...).focus — one of Acción/Construcción/
 * Preparación/Descanso. Passed in rather than recomputed here so this engine
 * never needs dailyEnergy/cycles wiring of its own; the caller (which already
 * has buildMomentState for the "Qué significa para vos" section) just shares it.
 */
export function getSituationGuidance(
  situation: Situation,
  profile: UserProfile,
  momentFocus: string
): SituationGuidance {
  const strength = profile.archetypeInfo?.strengths?.[0]?.toLowerCase();
  const challenge = profile.archetypeInfo?.challenges?.[0]?.toLowerCase();
  const focus = momentFocus.toLowerCase();
  const gift = strength || "tu forma de encarar las cosas";
  const risk = challenge || "perder de vista tu propio límite";

  switch (situation) {
    case "lost":
      return {
        guidance: `Cuando no sabés hacia dónde ir, tu punto de apoyo real es ${gift} — no una respuesta nueva, sino lo que ya sabés hacer bien. El momento que estás atravesando favorece ${focus}: no es el momento de forzar una dirección definitiva, es el momento de moverte desde lo que ya tenés.`,
        action: `Elegí una sola acción pequeña, guiada por ${gift}, y hacela hoy — no necesitás ver todo el camino para dar el próximo paso.`,
      };
    case "deciding":
      return {
        guidance: `Tu ${risk} es lo que más puede distorsionar esta decisión — no porque esté mal, sino porque aparece justo cuando más presión sentís. El momento favorece ${focus}, así que la pregunta no es "qué es lo correcto en abstracto" sino "qué corresponde hacer ahora mismo".`,
        action: `Antes de decidir, nombrá en una frase qué te está pidiendo tu ${risk} — y decidí de nuevo, sabiendo que esa voz está en la sala.`,
      };
    case "starting":
      return {
        guidance: `Empezar es terreno de ${gift} — es donde esa fortaleza rinde más, sin el desgaste de sostenerla en el tiempo. El momento actual favorece ${focus}, lo que te da una ventana real para arrancar sin esperar el momento "perfecto".`,
        action: `Definí cuál es el primer paso más pequeño posible y dalo esta semana, mientras el impulso inicial todavía está fresco.`,
      };
    case "exhausted":
      return {
        guidance: `El agotamiento no es una falla de carácter — muchas veces es tu ${risk} sostenido demasiado tiempo sin freno. El momento favorece ${focus}: si eso no es "acción", tomalo como información, no como fracaso.`,
        action: `Elegí una sola cosa para soltar esta semana — no todo, una — y notá qué cambia cuando dejás de sostenerla.`,
      };
    case "change":
      return {
        guidance: `En un cambio real, ${gift} es lo primero que se pone a prueba — y también lo primero que te va a sostener del otro lado. El momento favorece ${focus}, que es exactamente lo que un cambio necesita: ni resistirlo del todo ni soltar todo el control de una vez.`,
        action: `Identificá una sola cosa que SÍ podés controlar en este cambio, y ponele toda tu atención ahí esta semana.`,
      };
    case "doubting":
      return {
        guidance: `La duda no siempre significa que algo esté mal — a veces es tu ${risk} pidiendo más certeza de la que la situación puede dar todavía. El momento favorece ${focus}: dejá que eso, no la duda, marque el ritmo.`,
        action: `Escribí qué necesitarías saber para dejar de dudar — si es algo que podés averiguar, hacelo; si no, es información de que la duda no se va a resolver pensando más.`,
      };
    case "crossroads":
      return {
        guidance: `Entre dos caminos, tu ${gift} tiende a inclinarte hacia uno sin que lo notes del todo — vale la pena mirar cuál. El momento favorece ${focus}: un camino que se apoya en eso probablemente te va a costar menos sostener que uno que va contra esa corriente.`,
        action: `Para cada camino, completá la frase "elegir esto me pide sostener ___ incluso cuando no tenga ganas" — el que puedas sostener de verdad es la respuesta más honesta que tenés hoy.`,
      };
  }
}

// Unused export kept for callers that only have raw personalDay/personalYear
// and not a full buildMomentState focus label — mirrors the scale used in
// synthesisEngine.buildMomentState so the two never disagree on what counts
// as "high energy" for this profile.
export function focusFromEnergyScore(energyScore: number): string {
  const score = safeNumber(energyScore, 50);
  if (score >= 75) return "Acción";
  if (score >= 55) return "Construcción";
  if (score >= 40) return "Preparación";
  return "Descanso";
}
