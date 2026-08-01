/**
 * Orientation — TU MOMENTO / ORIENTACIÓN
 *
 * Compone exclusivamente outputs de los engines existentes (dailyEnergyEngine,
 * synthesisEngine.buildMomentState, timingEngine) en una orientación editorial
 * breve y accionable.
 *
 * La acción es determinista: se deriva del mismo número que define el tema del
 * día (personalDay) que usa dailyEnergyEngine. Nada aquí inventa un motor nuevo.
 */

import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { MomentState } from "@/lib/engines/synthesisEngine";
import type { TimingResult } from "@/lib/engines/timingEngine";

export interface OrientationEvidence {
  label: string;
  value: string;
}

export interface OrientationData {
  /** Fecha en formato editorial. Ej: "31 de julio". */
  dateLabel: string;
  /** Tema del día (del engine). Ej: "Expresión". */
  theme: string;
  /** Lectura editorial del día (descripción del engine). */
  expression: string;
  /** Una sola línea accionable, determinista por tema de día. */
  orientation: string;
  /** Evidencia breve que ancla la lectura en los datos. */
  evidence: OrientationEvidence[];
}

/** Acciones editoriales fijas por tema de día personal (mismo key que THEME_BY_PERSONAL_DAY). */
const ORIENTATION_BY_PERSONAL_DAY: Record<number, string> = {
  1: "Iniciá eso que venís pensando desde hace tiempo. El primer paso cuenta hoy.",
  2: "Acercate a alguien con quien querés conversar. Las alianzas se tejen hoy.",
  3: "Escribí durante cinco minutos aquello que venís postergando.",
  4: "Ordená una sola área de tu trabajo o tu casa. La estructura despeja el camino.",
  5: "Proponete un cambio pequeño pero concreto. La variedad te realimenta.",
  6: "Escribí o llamá a alguien a quien cuidás. La cercanía es tu forma de avanzar.",
  7: "Reservá un momento de silencio antes de decidir. La respuesta está más adentro.",
  8: "Tomá el liderazgo en algo que espera tu firma. Es un día de poder personal.",
  9: "Soltá una cosa que ya cumplió su ciclo. Dejar espacio también es avanzar.",
  11: "Prestá atención a las señales de hoy. Tu intuición está especialmente afinada.",
  22: "Concretá un plan a gran escala. Hoy podés verlo en su totalidad.",
  33: "Usá tu energía para ayudar a alguien sin esperar nada a cambio.",
};

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  if (!day || !month) return dateStr;
  return `${day} de ${MONTH_NAMES[month - 1] || ""}`.trim();
}

function pickTopArea(daily: DailyEnergyResult): { label: string; value: string } | null {
  const entries = Object.entries(daily.areas) as Array<
    [keyof DailyEnergyResult["areas"], { score: number; label: string }]
  >;
  if (entries.length === 0) return null;
  const top = entries.reduce((a, b) => (b[1].score > a[1].score ? b : a));
  if (top[1].score < 60) return null;
  const names: Record<string, string> = {
    work: "Trabajo",
    relationships: "Relaciones",
    creativity: "Creatividad",
    decisions: "Decisiones",
  };
  return { label: names[top[0]] || top[0], value: top[1].label };
}

export function buildOrientation(
  dailyEnergy: DailyEnergyResult,
  momentState: MomentState | undefined,
  timing?: TimingResult | null
): OrientationData {
  const action =
    ORIENTATION_BY_PERSONAL_DAY[dailyEnergy.personalDay] ||
    "Dedicá unos minutos a decidir una sola cosa importante y avanzá con ella.";

  const evidence: OrientationEvidence[] = [
    ...(momentState ? [{ label: "Foco", value: momentState.focus }] : []),
    { label: "Luna", value: dailyEnergy.moonPhase.phase },
    { label: "Año personal", value: String(dailyEnergy.personalYear) },
  ];

  const topArea = pickTopArea(dailyEnergy);
  if (topArea) {
    evidence.push({ label: topArea.label, value: topArea.value });
  }

  if (timing && timing.recommendedWindow) {
    evidence.push({ label: "Timing", value: timing.recommendedWindow });
  }

  return {
    dateLabel: formatDateLabel(dailyEnergy.date),
    theme: dailyEnergy.theme,
    expression: dailyEnergy.description,
    orientation: action,
    evidence,
  };
}
