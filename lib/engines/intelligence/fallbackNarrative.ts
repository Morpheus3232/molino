/**
 * Fallback narrative helpers — translate a profile (element + lifePath +
 * challenge/strength) into observable-behavior text for the deterministic
 * fallback's personal_profile case. Only consumed by
 * fallbackInterpretation.ts.
 */

import { ELEMENT_PACE } from '../synthesisEngine';

export const ELEMENT_TONE: Record<string, string> = {
  Fuego: 'actuás primero y ajustás sobre la marcha',
  Tierra: 'necesitás ver el terreno antes de moverte',
  Aire: 'necesitás poder explicarlo con palabras antes de comprometerte',
  Agua: 'seguís lo que sentís aunque no puedas justificarlo todavía',
  Metal: 'buscás la versión más precisa antes de avanzar',
};

/**
 * Combines a lifePath's directional claim ("tiende a moverte primero") with
 * an element's pace. When they point the same way, joins with "y" (reinforces);
 * when they don't, joins with "aunque" (names the real tension instead of
 * producing a sentence that asserts both "you move fast" and "you need to
 * check the terrain first" as if they were the same thing).
 */
export function combineWithElement(branchPace: 'fast' | 'slow', element: string): string {
  const tone = ELEMENT_TONE[element] || 'tu forma de avanzar es propia, no calca un patrón fijo';
  const elementPace = ELEMENT_PACE[element];
  if (!elementPace || elementPace === 'fluid') return `y tu elemento ${element} lo atraviesa a su manera: ${tone}`;
  return elementPace === branchPace
    ? `y tu elemento ${element} lo refuerza: ${tone}`
    : `aunque tu elemento ${element} tira para el otro lado: ${tone}`;
}

/**
 * The [1,8] / [2,6] / [3,5] / [4,7] / [9,11,22,33] grouping is a real
 * numerological convergence, not an arbitrary bucket: 1&8 are the two
 * "material action" numbers, 2&6 the two relational/caretaking numbers,
 * 3&5 the two expression/freedom numbers, 4&7 the two structure numbers,
 * and 9/11/22/33 are the master/completion numbers. Sharing the underlying
 * BEHAVIORAL SHAPE across a group is legitimate — but each member still has
 * its own real archetype challenge/strength (ARCHETYPE_DESCRIPTIONS), so the
 * specific risk and the specific gift named in the sentence must come from
 * THIS profile's actual data, not a placeholder shared by the whole group.
 */
export function getOperatingPattern(element: string, lifePath: number, personalDay: number, challenge?: string, strength?: string): string {
  const risk = challenge?.toLowerCase() || 'perder de vista tu propio límite';
  const gift = strength?.toLowerCase() || 'tu forma de encarar las cosas';
  if ([1, 8].includes(lifePath)) {
    return `Cuando tenés que elegir entre esperar una señal externa o moverte por tu cuenta, tu patrón tiende a moverte primero — es tu ${gift} en acción, ${combineWithElement('fast', element)}. El riesgo específico en tu caso es tu ${risk}: no es la duda lo que te frena, es no delegar a tiempo cuando tu ${risk} toma el volante.`;
  }
  if ([2, 6].includes(lifePath)) {
    return `Cuando tenés que elegir entre lo que necesitás vos y lo que necesita el grupo, tu patrón tiende a priorizar el equilibrio del conjunto — tu ${gift} lo hace posible: ${ELEMENT_TONE[element] || 'tu forma de avanzar es propia'}. El riesgo específico es que tu ${risk} te haga posponer tu propia necesidad hasta que se vuelve urgente.`;
  }
  if ([3, 5].includes(lifePath)) {
    return `Cuando tenés que elegir entre profundizar en una sola cosa o mantener varias opciones abiertas, tu patrón tiende a mantener el movimiento — tu ${gift} necesita ese espacio, ${combineWithElement('fast', element)}. El riesgo específico es que tu ${risk} disperse la energía antes de que algo madure.`;
  }
  if ([4, 7].includes(lifePath)) {
    return `Cuando tenés que elegir entre avanzar con lo que ya sabés o seguir analizando, tu patrón tiende a seguir analizando un poco más — ahí aparece tu ${gift}, ${combineWithElement('slow', element)}. El riesgo específico es que tu ${risk} confunda preparación con postergación.`;
  }
  if ([9, 11, 22, 33].includes(lifePath)) {
    return `Cuando tenés que elegir entre tu propio proceso y lo que el entorno necesita de vos, tu patrón tiende a inclinarte hacia lo colectivo — tu ${gift} te lo pide: ${ELEMENT_TONE[element] || 'tu forma de avanzar es propia'}. El riesgo específico es que tu ${risk} diluya tu propio criterio en el de otros.`;
  }
  return `Cuando tenés que decidir entre avanzar o esperar, ${ELEMENT_TONE[element] || 'tu forma de avanzar es propia'}. Tu día personal (${personalDay}) modula cuánto pesa esa tendencia hoy en particular.`;
}

/**
 * Concrete next action — same grouping logic as getOperatingPattern, but the
 * action itself names this profile's real challenge/strength so it reads as
 * "patrón detectado → tensión → acción" instead of a generic tip that could
 * apply to anyone in the group.
 */
export function getOperatingAction(element: string, lifePath: number, personalDay: number, challenge?: string, strength?: string): string {
  const risk = challenge?.toLowerCase();
  const gift = strength?.toLowerCase();
  if ([1, 8].includes(lifePath)) {
    return risk && gift
      ? `La próxima vez que notes tu ${risk} empujando, dejá pasar un día antes de decidir — tu ${gift} no necesita la urgencia para funcionar.`
      : 'Antes de tu próxima decisión importante, identificá un paso que puedas delegar en vez de asumirlo vos.';
  }
  if ([2, 6].includes(lifePath)) {
    return risk
      ? `Esta semana, nombrá en voz alta una necesidad tuya antes de que tu ${risk} la convierta en resentimiento.`
      : 'Esta semana, nombrá en voz alta una necesidad tuya antes de que se vuelva urgente.';
  }
  if ([3, 5].includes(lifePath)) {
    return risk
      ? `Elegí una sola cosa de las que tenés abiertas y llevala un paso más allá — notá cuándo tu ${risk} te empuja a saltar a la siguiente.`
      : 'Elegí una sola cosa de las que tenés abiertas y llevala un paso más allá de donde la dejaste.';
  }
  if ([4, 7].includes(lifePath)) {
    return risk
      ? `Ponete un límite de tiempo explícito para dejar de analizar — tu ${risk} va a pedir "un poco más", ignorala esta vez.`
      : 'Ponete un límite de tiempo explícito para dejar de analizar y avanzar con lo que ya sabés.';
  }
  if ([9, 11, 22, 33].includes(lifePath)) {
    return risk
      ? `Antes de responder a lo que el entorno te pide, chequeá si es una necesidad real tuya o tu ${risk} actuando por costumbre.`
      : 'Antes de responder a lo que el entorno te pide, chequeá qué es lo que vos necesitás en esto.';
  }
  return `Usá tu día personal (${personalDay}) como referencia para elegir si es momento de actuar o de observar.`;
}
