/**
 * Resonancia del Atlas — las mismas casillas que Mi Mapa (relacionCon):
 *   - mismo:   tu propio signo.
 *   - amigo:   tus dos amigos (三合 San He).
 *   - enemigo: tu enemigo (六冲 Liu Chong), presentado como qué conviene evitar.
 *   - otro:    el resto del ciclo. El Atlas NO lo recomienda ni lo lista:
 *              Liu He y Liu Hai caen acá, fuera del modelo (ver CLAUDE.md).
 *
 * Puro y client-safe: el Atlas reclasifica al cambiar de signo.
 *
 * VOZ: el razonamiento es una observación refutable sobre un cruce concreto
 * de signos, nunca una validación genérica.
 */

import { relacionCon, type MapRelation } from "@/lib/engines/personalMapEngine";

export type ResonanceBucket = MapRelation;

/** Las casillas que el Atlas muestra, en orden. "otro" no se muestra. */
export const ATLAS_BUCKETS: readonly ResonanceBucket[] = ["mismo", "amigo", "enemigo"] as const;

export interface ResonanceInfo {
  bucket: ResonanceBucket;
  label: string;
}

const LABELS: Record<ResonanceBucket, string> = {
  mismo: "Tu propio signo",
  amigo: "Amigo",
  enemigo: "Enemigo",
  otro: "Resto del ciclo",
};

export function classifyResonance(referenceAnimal: string, entityAnimal: string): ResonanceInfo {
  const bucket = relacionCon(referenceAnimal, entityAnimal);
  return { bucket, label: LABELS[bucket] };
}

export function resonanceReasoning(referenceAnimal: string, entityAnimal: string, entityName?: string): string {
  if (!referenceAnimal || !entityAnimal) return "No hay suficiente información para cruzar estos dos puntos.";
  const who = entityName ?? entityAnimal;
  switch (relacionCon(referenceAnimal, entityAnimal)) {
    case "mismo":
      return `${who} nació en ${entityAnimal}, tu propio signo.`;
    case "amigo":
      return `${who} es ${entityAnimal}, uno de los dos amigos (三合) de ${referenceAnimal}.`;
    case "enemigo":
      return `${who} es ${entityAnimal}, el enemigo (六冲) de ${referenceAnimal}: lo que conviene evitar.`;
    default:
      return `${who} es ${entityAnimal}: el resto del ciclo, sin relación especial con ${referenceAnimal}.`;
  }
}

/**
 * Reparte las entidades en las cuatro casillas. "otro" se devuelve para que
 * quien llama pueda contarlo, pero el Atlas no lo lista.
 */
export function bucketEntitiesByResonance<T extends { animal: string }>(
  referenceAnimal: string,
  entities: T[],
): Record<ResonanceBucket, (T & { resonance: ResonanceInfo })[]> {
  const out: Record<ResonanceBucket, (T & { resonance: ResonanceInfo })[]> = { mismo: [], amigo: [], enemigo: [], otro: [] };
  for (const entity of entities) {
    const resonance = classifyResonance(referenceAnimal, entity.animal);
    out[resonance.bucket].push({ ...entity, resonance });
  }
  return out;
}
