/**
 * Generic Daily Energy — Energía base del día para usuarios sin perfil.
 *
 * Calcula una energía genérica basada en el día de la semana.
 * Determinística: misma fecha = mismo resultado.
 */

export interface GenericDailyData {
  energy: string;
  focus: string;
  caution: string;
  vibe: string;
}

const VIBES_BY_DAY: GenericDailyData[] = [
  { energy: "Renovadora", focus: "Comenzar proyectos nuevos", caution: "No procrastines lo importante", vibe: "Inicio" },
  { energy: "Creativa", focus: "Arte, expresión o ideas nuevas", caution: "Evita conflictos innecesarios", vibe: "Expresión" },
  { energy: "Analítica", focus: "Planificación y estrategia", caution: "No te atasques en detalles", vibe: "Claridad" },
  { energy: "Colaborativa", focus: "Trabajo en equipo y conexión", caution: "No delegues todo tu peso", vibe: "Unión" },
  { energy: "Productiva", focus: "Cerrar tareas pendientes", caution: "No microgestiones a otros", vibe: "Acción" },
  { energy: "Social", focus: "Conectar con personas clave", caution: "No descuides prioridades propias", vibe: "Cercanía" },
  { energy: "Reflexiva", focus: "Escucha interna y descanso", caution: "Evita decisiones impulsivas", vibe: "Silencio" },
];

export function getGenericDailyEnergy(date: Date): GenericDailyData {
  const dayOfWeek = date.getDay();
  return VIBES_BY_DAY[dayOfWeek];
}
