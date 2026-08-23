"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import { calculateDailyEnergy, calculateUniversalDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { buildOrientation, type OrientationEvidence } from "@/lib/utils/orientation";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import { toLocalDateKey } from "@/lib/session/dailyHistory";

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
  /** Línea de acción del día — ahora deriva de buildOrientation() (Fase 6A), no de una plantilla concatenada ad-hoc. */
  dailyAdvice: string;
  /** Evidencia trazable detrás de dailyAdvice (Foco/Luna/Año personal/área top) — mismo motor, ver lib/utils/orientation.ts. */
  orientationEvidence: OrientationEvidence[];
  nextDaysForecast: DayForecast[];
  /** false cuando no hay perfil — el tema/score vienen de
   * calculateUniversalDailyEnergy (mismo para cualquier visitante ese día),
   * no de personalDay/personalYear/personalMonth. Esos 3 campos igual están
   * poblados (con dailyNumber/0) solo para que el resto de los componentes
   * (WeekPreview, FOCUS_BY_PERSONAL_DAY) no tengan que ramificar por null —
   * la UI decide qué mostrar leyendo este flag, no esos números. */
  isPersonalized: boolean;
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

/**
 * Afinidad del día — fetch liviano a /api/hoy/afinidad-del-dia (Fase P0.1):
 * enriquece orientationEvidence con UNA entidad real, sin cargar
 * SYMBOLIC_ENTITIES en el bundle de /hoy. Enriquecimiento, no dependencia
 * crítica: si falla o tarda, el Consejo del Momento ya renderizado con
 * `base` no se ve afectado — esto solo agrega un ítem más a la evidencia
 * cuando (y si) llega.
 */
function useAffinityOfTheDay(animal: string | undefined, dateKey: string): OrientationEvidence | null {
  const [evidence, setEvidence] = useState<OrientationEvidence | null>(null);

  useEffect(() => {
    setEvidence(null);
    if (!animal) return;

    const controller = new AbortController();
    const url = `/api/hoy/afinidad-del-dia?animal=${encodeURIComponent(animal)}&date=${encodeURIComponent(dateKey)}`;

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { entity?: { name: string } | null; relationLabel?: string } | null) => {
        if (!data?.entity || !data.relationLabel) return;
        setEvidence({ label: "Hoy resuena", value: `${data.entity.name} (${data.relationLabel})` });
      })
      .catch(() => {
        // Silencioso a propósito: la Afinidad es enriquecimiento, no crítica para /hoy.
      });

    return () => controller.abort();
  }, [animal, dateKey]);

  return evidence;
}

export function useDailyEnergy(
  profile: UserProfile | null,
  targetDate: Date = new Date()
): EnrichedDailyEnergy | null {
  const base = useMemo(() => {
    try {
      if (!profile) {
        const universal = calculateUniversalDailyEnergy(targetDate);
        const actions = FOCUS_BY_PERSONAL_DAY[universal.dailyNumber] || FOCUS_BY_PERSONAL_DAY[1];
        const universalResult: DailyEnergyResult = {
          date: universal.date,
          overallScore: universal.overallScore,
          theme: universal.theme,
          description: universal.description,
          strengths: universal.strengths,
          cautions: universal.cautions,
          areas: universal.areas,
          moonPhase: universal.moonPhase,
          personalDay: universal.dailyNumber,
          personalYear: 0,
          personalMonth: 0,
          elementInfluence: "",
          explanation: universal.description,
        };
        const orientation = buildOrientation(universalResult, undefined, null);
        // Sin perfil no hay Año Personal real (personalYear se fuerza a 0
        // arriba solo para no ramificar el resto de los componentes) —
        // mostrar "Año personal: 0" sería un dato falso, no ausente.
        orientation.evidence = orientation.evidence.filter((e) => e.label !== "Año personal");

        const nextDaysForecast: DayForecast[] = [];
        for (let i = 1; i <= 3; i++) {
          const nextDate = new Date(targetDate);
          nextDate.setDate(nextDate.getDate() + i);
          const nextUniversal = calculateUniversalDailyEnergy(nextDate);
          nextDaysForecast.push({
            date: nextUniversal.date,
            dayName: DAY_NAMES_ES[nextDate.getDay()],
            dayNumber: nextDate.getDate(),
            personalDay: nextUniversal.dailyNumber,
            theme: nextUniversal.theme,
            score: nextUniversal.overallScore,
            moonEmoji: nextUniversal.moonPhase?.emoji || "🌙",
          });
        }

        return {
          ...universalResult,
          isPersonalized: false,
          focusAction: actions.focus,
          avoidAction: actions.avoid,
          dailyAdvice: orientation.orientation,
          orientationEvidence: orientation.evidence,
          nextDaysForecast,
        };
      }

      const daily = calculateDailyEnergy(profile, targetDate);
      const personalDay = daily.personalDay || 1;

      const actions =
        FOCUS_BY_PERSONAL_DAY[personalDay] || FOCUS_BY_PERSONAL_DAY[1];

      const momentState = buildMomentState(profile, daily.overallScore, daily.theme);
      const orientation = buildOrientation(daily, momentState, null);

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
        isPersonalized: true,
        focusAction: actions.focus,
        avoidAction: actions.avoid,
        dailyAdvice: orientation.orientation,
        orientationEvidence: orientation.evidence,
        nextDaysForecast,
      };
    } catch {
      return null;
    }
  }, [profile, targetDate]);

  // Sin perfil, animal es undefined → useAffinityOfTheDay no hace fetch y
  // devuelve null siempre (regla P0.1: sin perfil, orientationEvidence no cambia).
  const affinityEvidence = useAffinityOfTheDay(profile?.chineseZodiac, toLocalDateKey(targetDate));

  if (!base) return null;
  if (!affinityEvidence) return base;
  return { ...base, orientationEvidence: [...base.orientationEvidence, affinityEvidence] };
}
