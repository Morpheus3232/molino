import type { UserProfile } from "@/types/user";
import { PERSONAL_YEAR_MEANINGS } from "./dailyEnergyEngine";
import { getMoonSign } from "./astrologyEngine";

const YEAR_CYCLE_NAMES: Record<number, { name: string; essence: string }> = {
  1: { name: "Ciclo de Inicio", essence: "siembra, iniciativa y nuevos rumbos" },
  2: { name: "Ciclo de Cooperación", essence: "paciencia, acuerdos y consolidación vincular" },
  3: { name: "Ciclo de Expresión", essence: "visibilidad, creatividad y comunicación" },
  4: { name: "Ciclo de Cimiento", essence: "estructura y consolidación" },
  5: { name: "Ciclo de Cambio", essence: "libertad, movimiento y adaptación" },
  6: { name: "Ciclo de Armonía", essence: "responsabilidad, cuidado y equilibrio" },
  7: { name: "Ciclo de Introspección", essence: "claridad interna y sabiduría" },
  8: { name: "Ciclo de Cosecha", essence: "decisiones materiales y resultados concretos" },
  9: { name: "Ciclo de Cierre", essence: "balance, soltar lo innecesario y síntesis" },
  11: { name: "Ciclo Maestro de Visión", essence: "intuición elevada y alineación con tu propósito" },
  22: { name: "Ciclo Maestro Constructor", essence: "materialización a gran escala de tus proyectos" },
  33: { name: "Ciclo Maestro de Servicio", essence: "guía, trascendencia y madurez espiritual" },
};

export interface ChatHookData {
  personalYear: number;
  yearCycleName: string;
  yearEssence: string;
  lifePath: number;
  sunSign: string;
  moonSign: string;
  chineseAnimal: string;
  chineseElement: string;
  hookSentence: string;
  suggestedStarters: string[];
}

/**
 * Genera el gancho contextual inicial para el Hero del chat.
 * Demuestra de inmediato que Molino YA conoce el mapa completo del usuario.
 */
export function generateChatContextualHook(profile: UserProfile): ChatHookData {
  const personalYear = profile.cycles?.personalYear || 1;
  const cycleInfo = YEAR_CYCLE_NAMES[personalYear] || {
    name: PERSONAL_YEAR_MEANINGS[personalYear]?.theme || "Ciclo de Evolución",
    essence: "crecimiento consciente",
  };

  const lifePath = profile.lifePath || 1;
  const sunSign = profile.sunSign || "Aries";
  const moonSign = getMoonSign(profile.birthDate, profile.birthTime);
  const chineseAnimal = profile.chineseZodiac || "";
  const chineseElement = profile.chineseZodiacInfo?.element || "";

  const hookSentence = `Veo que estás en tu Año Personal ${personalYear} (${cycleInfo.name}) con Camino de Vida ${lifePath} y Sol en ${sunSign}. Este es un momento de ${cycleInfo.essence}. ¿Qué querés explorar?`;

  const suggestedStarters = [
    `¿Cómo influye mi Año Personal ${personalYear} en mis decisiones actuales?`,
    `¿Qué contradicción hay entre mi Sol en ${sunSign} y mi Camino de Vida ${lifePath}?`,
    `¿Cómo afecta mi ${chineseAnimal ? `${chineseAnimal} de ${chineseElement || "su elemento"}` : "signo"} a mi forma de trabajar?`,
    `¿Cómo aprovechar este momento para dar un paso importante?`,
  ];

  return {
    personalYear,
    yearCycleName: cycleInfo.name,
    yearEssence: cycleInfo.essence,
    lifePath,
    sunSign,
    moonSign,
    chineseAnimal,
    chineseElement,
    hookSentence,
    suggestedStarters,
  };
}
