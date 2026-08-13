"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { calculateDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { safeNumber } from "@/lib/utils/score";

export interface DayForecast {
  date: string;
  dayName: string;
  dayNumber: number;
  personalDay: number;
  theme: string;
  score: number;
  moonEmoji: string;
}

export interface EnrichedDailyEnergy extends DailyEnergyResult {
  focusAction: string;
  avoidAction: string;
  dailyAdvice: string;
  nextDaysForecast: DayForecast[];
}

const FOCUS_BY_PERSONAL_DAY: Record<number, { focus: string; avoid: string }> = {
  1: {
    focus: "Tomar la iniciativa en proyectos postergados, definir límites claros y dar el primer paso sin esperar aprobación externa.",
    avoid: "La impaciencia con el ritmo de los demás, el aislamiento defensivo o la rigidez.",
  },
  2: {
    focus: "Escuchar activamente, facilitar acuerdos en equipo y nutrir los vínculos más cercanos con empatía y calma.",
    avoid: "Asumir responsabilidades ajenas por compromiso, dudar excesivamente o evitar decir lo que pensás.",
  },
  3: {
    focus: "Expresar tus ideas sin filtro de autocrítica, comunicar proyectos creativos y compartir momentos de disfrute.",
    avoid: "Dispersar tu energía en demasiadas tareas abiertas o caer en la exageración.",
  },
  4: {
    focus: "Organizar tu espacio, ordenar finanzas o agendas y avanzar de forma metódica en tareas que requieren concentración.",
    avoid: "La terquedad frente a imprevistos o sobreexigirte con estándares inalcanzables.",
  },
  5: {
    focus: "Probar caminos nuevos, flexibilizar tu rutina y abrazar oportunidades inesperadas de aprendizaje o viaje.",
    avoid: "Decisiones impulsivas que comprometan tu estabilidad a largo plazo o la inconsistencia.",
  },
  6: {
    focus: "Cuidar tu entorno inmediato, resolver asuntos familiares o del hogar y practicar la generosidad consciente.",
    avoid: "Caer en el control de las decisiones de los otros o cargar con culpas innecesarias.",
  },
  7: {
    focus: "Darte espacios de silencio, estudiar, investigar a fondo y profundizar en tu autoconocimiento.",
    avoid: "Forzar reuniones sociales agotadoras o caer en el escepticismo paralizante.",
  },
  8: {
    focus: "Negociar con firmeza, liderar iniciativas estratégicas y ordenar la gestión de tus recursos materiales.",
    avoid: "Imponer tu voluntad por la fuerza, la soberbia o descuidar la salud física.",
  },
  9: {
    focus: "Cerrar ciclos pendientes, ordenar y depurar lo que ya no te sirve y perdonar para alivianar tu carga.",
    avoid: "Aferrarte al pasado con nostalgia o postergar una despedida necesaria.",
  },
  11: {
    focus: "Prestar atención a tus corazonadas, canalizar ideas visionarias e inspirar a quienes te rodean con autenticidad.",
    avoid: "La sobreestimulación mental, la ansiedad o dudar de tu propia intuición.",
  },
  22: {
    focus: "Materializar planes de gran escala, coordinar grupos de trabajo y transformar sueños en estructuras reales.",
    avoid: "El perfeccionismo abrumador o perder de vista el bienestar cotidiano.",
  },
  33: {
    focus: "Brindar apoyo incondicional, servir desde el corazón y elevar la energía de tu entorno con compasión.",
    avoid: "El desgaste emocional extremo o descuidar tus propias necesidades básicas.",
  },
};

const DAY_NAMES_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function useDailyEnergy(
  profile: UserProfile | null,
  targetDate: Date = new Date()
): EnrichedDailyEnergy | null {
  return useMemo(() => {
    if (!profile) return null;

    try {
      const daily = calculateDailyEnergy(profile, targetDate);
      const personalDay = daily.personalDay || 1;
      const lifePath = safeNumber(profile.lifePath, 1);

      const actions =
        FOCUS_BY_PERSONAL_DAY[personalDay] || FOCUS_BY_PERSONAL_DAY[1];

      // Contextual personalized advice
      const dailyAdvice = `Combinando tu vibración natal (${lifePath}) con la energía de ${daily.theme.toLowerCase()} (Día ${personalDay}) bajo la luna ${daily.moonPhase?.phase.toLowerCase() || "actual"}, el universo te invita a ${actions.focus.toLowerCase().slice(0, 100)}...`;

      // 3-day forecast
      const nextDaysForecast: DayForecast[] = [];
      for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + i);

        const nextDaily = calculateDailyEnergy(profile, nextDate);
        const dayIdx = nextDate.getDay();

        nextDaysForecast.push({
          date: nextDaily.date,
          dayName: DAY_NAMES_ES[dayIdx],
          dayNumber: nextDate.getDate(),
          personalDay: nextDaily.personalDay,
          theme: nextDaily.theme,
          score: nextDaily.overallScore,
          moonEmoji: nextDaily.moonPhase?.emoji || "🌙",
        });
      }

      return {
        ...daily,
        focusAction: actions.focus,
        avoidAction: actions.avoid,
        dailyAdvice,
        nextDaysForecast,
      };
    } catch {
      return null;
    }
  }, [profile, targetDate]);
}
