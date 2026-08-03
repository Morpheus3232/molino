/**
 * Molino Intelligence Engine
 *
 * Central layer that aggregates deterministic data from all modules
 * and provides structured context for AI interpretation.
 *
 * PRINCIPLE: Deterministic data → Structured context → AI interpretation → Actionable explanation
 *
 * The AI never invents calculations. It interprets data that Molino already computed.
 */

import type { UserProfile } from '@/types/user';
import type { CompatibilityResult } from './compatibilityEngine';
import type { DailyEnergyResult } from './dailyEnergyEngine';
import type { TimingResult } from './timingEngine';
import type { DecisionResult } from './decisionsEngine';
import type { EntityProfile } from '@/lib/data/entities';

// ============================================================
// SHARED CONTEXT TYPES
// ============================================================

export interface MolinoContext {
  userProfile: {
    name: string;
    lifePath: number;
    archetype: string;
    sunSign: string;
    element: string;
    modality: string;
    chineseZodiac: string;
    chineseElement: string;
    expressionNumber?: number;
    soulNumber?: number;
    personalityNumber?: number;
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
  numerology: {
    lifePath: number;
    expressionNumber?: number;
    soulNumber?: number;
    personalityNumber?: number;
    archetype: string;
    archetypeDescription: string;
  };
  astrology: {
    sunSign: string;
    element: string;
    modality: string;
    symbol: string;
  };
  chineseZodiac: {
    animal: string;
    element: string;
  };
  cycles: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
  dailyEnergy?: DailyEnergyResult;
  timing?: TimingResult;
  compatibility?: CompatibilityResult;
  entity?: EntityProfile;
  decision?: DecisionResult;
}

export type InterpretationType =
  | 'personal_profile'
  | 'daily_energy'
  | 'timing'
  | 'compatibility'
  | 'decision'
  | 'pattern';

/** A prior question/answer pair from the current chat session only — never persisted. */
export interface ConversationTurn {
  question: string;
  answer: string;
}

export interface InterpretationRequest {
  type: InterpretationType;
  context: MolinoContext;
  question?: string;
  template?: string;
  conversationHistory?: ConversationTurn[];
}

export interface MolinoInterpretation {
  summary: string;
  alignment: string;
  timing: string;
  strengths: string[];
  tensions: string[];
  whatToConsider: string[];
  suggestedNextStep: string;
  confidence: string;
  limitations: string[];
  rawContext: MolinoContext;
}

// ============================================================
// CONTEXT BUILDER
// ============================================================

/**
 * Build a MolinoContext from user profile and optional modules.
 * All data is deterministic - no AI calls here.
 */
export function buildMolinoContext(
  profile: UserProfile,
  options: {
    dailyEnergy?: DailyEnergyResult;
    timing?: TimingResult;
    compatibility?: CompatibilityResult;
    entity?: EntityProfile;
    decision?: DecisionResult;
  } = {}
): MolinoContext {
  return {
    userProfile: {
      name: profile.name || '',
      lifePath: profile.lifePath,
      archetype: profile.archetype,
      sunSign: profile.sunSign,
      element: profile.element,
      modality: profile.modality,
      chineseZodiac: profile.chineseZodiac,
      chineseElement: profile.chineseZodiacInfo?.element || '',
      expressionNumber: profile.expressionNumber,
      soulNumber: profile.soulNumber,
      personalityNumber: profile.personalityNumber,
      personalYear: profile.cycles?.personalYear || 0,
      personalMonth: profile.cycles?.personalMonth || 0,
      personalDay: profile.cycles?.personalDay || 0,
    },
    numerology: {
      lifePath: profile.lifePath,
      expressionNumber: profile.expressionNumber,
      soulNumber: profile.soulNumber,
      personalityNumber: profile.personalityNumber,
      archetype: profile.archetype,
      archetypeDescription: profile.archetypeInfo?.description || '',
    },
    astrology: {
      sunSign: profile.sunSign,
      element: profile.element,
      modality: profile.modality,
      symbol: profile.sunSignInfo?.symbol || '',
    },
    chineseZodiac: {
      animal: profile.chineseZodiac,
      element: profile.chineseZodiacInfo?.element || '',
    },
    cycles: {
      personalYear: profile.cycles?.personalYear || 0,
      personalMonth: profile.cycles?.personalMonth || 0,
      personalDay: profile.cycles?.personalDay || 0,
    },
    dailyEnergy: options.dailyEnergy,
    timing: options.timing,
    compatibility: options.compatibility,
    entity: options.entity,
    decision: options.decision,
  };
}

// ============================================================
// PROMPT BUILDER
// ============================================================

/**
 * Build a structured prompt for AI interpretation.
 * The prompt includes all deterministic data from MolinoContext.
 * The AI's role is to INTERPRET, not to CALCULATE.
 */
export function buildIntelligencePrompt(request: InterpretationRequest): string {
  const { type, context, question, template, conversationHistory } = request;
  const { userProfile, numerology, astrology, chineseZodiac, cycles } = context;

  const conversationContext = conversationHistory?.length
    ? `\nCONVERSACIÓN PREVIA (misma sesión — la pregunta actual puede ser continuación de esto):\n${conversationHistory
        .map((turn, i) => `${i + 1}. Usuario preguntó: "${turn.question}"\n   Molino respondió: "${turn.answer}"`)
        .join('\n')}\n`
    : '';

  const baseContext = `
CONTEXTO DEL USUARIO:
- Nombre: ${userProfile.name}
- Life Path: ${userProfile.lifePath}
- Arquetipo: ${userProfile.archetype}
- Signo Solar: ${astrology.sunSign} (${astrology.element}, ${astrology.modality})
- Zodiaco Chino: ${chineseZodiac.animal} (${chineseZodiac.element})
- Elemento: ${userProfile.element}
- Año personal: ${cycles.personalYear}
- Mes personal: ${cycles.personalMonth}
- Día personal: ${cycles.personalDay}
${numerology.expressionNumber ? `- Expresión: ${numerology.expressionNumber}` : ''}
${numerology.soulNumber ? `- Alma: ${numerology.soulNumber}` : ''}
${numerology.personalityNumber ? `- Personalidad: ${numerology.personalityNumber} (en Molino se calcula solo desde el día de nacimiento, no desde el nombre; para el 9 representa capacidad de adaptación — no uses el significado clásico de "número de personalidad" por consonantes)` : ''}
`;

  const rolePrompt = `Eres el Motor de Inteligencia de Molino. Tu rol es interpretar datos deterministas calculados por los sistemas simbólicos de Molino (numerología, astrología, zodiaco chino, ciclos).

PRINCIPIOS:
- Solo interpretás datos que Molino ya calculó. No inventás cálculos.
- Presentás los datos como herramientas de reflexión, no como predicciones científicas.
- Usás lenguaje de autoconocimiento, no de certeza.
- Sos serio, profesional y filosófico.
- Hablás en español neutro.
- Si un dato no está disponible, lo decís explícitamente.`;

  switch (type) {
    case 'personal_profile': {
      const dailyEnergy = context.dailyEnergy;
      const timingCtx = context.timing;
      return `${rolePrompt}

${baseContext}
${dailyEnergy ? `MOMENTO ACTUAL:
- Score de energía de hoy: ${dailyEnergy.overallScore}/100
- Tema del día: ${dailyEnergy.theme}` : ''}
${timingCtx ? `TIMING (para la intención "${timingCtx.intention}" que el usuario eligió):
- Score: ${timingCtx.timingScore}/100
- Explicación: ${timingCtx.explanation}` : ''}

TAREA: Interpretá el perfil personal completo del usuario dentro de su mapa simbólico.

IMPORTANTE:
- El campo "timing" de tu respuesta debe explicar POR QUÉ el momento actual importa dentro
  de la identidad del usuario (archetype, elemento) — no repitas el tema del año/día
  personal como si fuera la novedad, eso ya se le mostró en otra sección.
- Si no hay MOMENTO ACTUAL disponible, no inventes un score ni un tema.
- Si no hay TIMING disponible, no menciones ninguna intención ni recomendación de timing.

Generá una respuesta JSON con:
{
  "summary": "Síntesis del perfil en 2-3 oraciones",
  "alignment": "Cómo los elementos del perfil se conectan entre sí",
  "timing": "Por qué el momento actual importa dentro de la identidad del usuario",
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "tensions": ["tensión 1", "tensión 2"],
  "whatToConsider": ["consideración 1", "consideración 2"],
  "suggestedNextStep": "Una acción concreta y personalizada",
  "confidence": "Alta/Media/Baja - basado en los datos disponibles",
  "limitations": ["limitación 1"]
}`;
    }

    case 'daily_energy':
      const energy = context.dailyEnergy;
      return `${rolePrompt}

${baseContext}
${energy ? `ENERGÍA DIARIA:
- Score: ${energy.overallScore}/100
- Tema: ${energy.theme}
- Fase lunar: ${energy.moonPhase.phase} (${energy.moonPhase.emoji})
- Fortalezas del día: ${energy.strengths.join(', ')}
- Precauciones: ${energy.cautions.join(', ')}
- Área trabajo: ${energy.areas.work.score}% (${energy.areas.work.label})
- Área relaciones: ${energy.areas.relationships.score}% (${energy.areas.relationships.label})
- Área creatividad: ${energy.areas.creativity.score}% (${energy.areas.creativity.label})
- Área decisiones: ${energy.areas.decisions.score}% (${energy.areas.decisions.label})` : 'No hay datos de energía diaria disponibles.'}

TAREA: Interpretá la energía diaria del usuario.

Generá una respuesta JSON con:
{
  "summary": "Síntesis de la energía del día en 2-3 oraciones",
  "alignment": "Cómo la energía se conecta con el perfil del usuario",
  "timing": "Qué tipo de acciones favorece hoy",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1", "consideración 2"],
  "suggestedNextStep": "Una acción concreta para hoy",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;

    case 'timing':
      const timing = context.timing;
      return `${rolePrompt}

${baseContext}
${timing ? `TIMING:
- Score: ${timing.timingScore}/100
- Intención: ${timing.intention}
- Personal Day: ${timing.personalDay}
- Año personal: ${timing.personalYear}
- Fase lunar: ${timing.moonPhase}
- Dimensiones favorables: ${timing.favorableDimensions.join(', ')}
- Dimensiones desafiantes: ${timing.challengingDimensions.join(', ')}` : 'No hay datos de timing disponibles.'}

TAREA: Interpretá el timing para la intención del usuario.

Generá una respuesta JSON con:
{
  "summary": "Síntesis del timing en 2-3 oraciones",
  "alignment": "Cómo el timing se conecta con el perfil",
  "timing": "Qué tipo de acciones favorece este momento",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1", "consideración 2"],
  "suggestedNextStep": "Una acción concreta basada en el timing",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;

    case 'compatibility':
      const compat = context.compatibility;
      const entity = context.entity;
      return `${rolePrompt}

${baseContext}
${compat && entity ? `COMPATIBILIDAD CON ${entity.name.toUpperCase()}:
- Score total: ${compat.scores.overall}%
- Numerología: ${compat.scores.numerology}%
- Astrología: ${compat.scores.westernAstrology}%
- Zodiaco Chino: ${compat.scores.chineseAstrology}%
- Arquetipo: ${compat.scores.archetype}%
- Elemento: ${compat.scores.element}%
- Fortalezas: ${compat.strengths.join(', ')}
- Desafíos: ${compat.challenges.join(', ')}

ENTIDAD:
- Nombre: ${entity.name}
- Categoría: ${entity.category}
- Descripción: ${entity.context.description}
- Temas clave: ${entity.context.keyThemes.join(', ')}` : 'No hay datos de compatibilidad disponibles.'}

TAREA: Interpretá la compatibilidad entre el usuario y la entidad.

Generá una respuesta JSON con:
{
  "summary": "Síntesis de la compatibilidad en 2-3 oraciones",
  "alignment": "Cómo se conectan el perfil y la entidad",
  "timing": "Qué sugiere la compatibilidad para el momento actual",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1", "consideración 2"],
  "suggestedNextStep": "Una acción concreta basada en la compatibilidad",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;

    case 'decision':
      const decision = context.decision;
      return `${rolePrompt}

${baseContext}
${conversationContext}${decision ? `DECISIÓN:
- Pregunta: ${decision.question}
- Categoría: ${decision.category}
- Score general: ${decision.overallScore}/100
- Alineación: ${decision.alignmentScore}/100
- Timing: ${decision.timingScore}/100
- Energía: ${decision.energyScore}/100
- Recomendación: ${decision.recommendation}
- Razonamiento: ${decision.reasoning}
- Consideraciones: ${decision.considerations.join(', ')}
- Próximos pasos: ${decision.nextSteps.join(', ')}` : 'No hay datos de decisión disponibles.'}

TAREA: Interpretá la decisión del usuario en el contexto de su perfil y momento actual.
${conversationHistory?.length ? 'Si la pregunta actual hace referencia implícita a algo de la conversación previa (ej. "¿y si lo hago en marzo?"), interpretala como continuación de esa conversación, no como una pregunta aislada.' : ''}

Generá una respuesta JSON con:
{
  "summary": "Síntesis de la decisión en 2-3 oraciones",
  "alignment": "Cómo la decisión se conecta con el perfil del usuario",
  "timing": "Qué sugiere el momento actual para esta decisión",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1", "consideración 2", "consideración 3"],
  "suggestedNextStep": "Una acción concreta y personalizada",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;

    case 'pattern':
      return `${rolePrompt}

${baseContext}

TAREA: Interpretá los patrones del perfil del usuario.

Generá una respuesta JSON con:
{
  "summary": "Síntesis de los patrones en 2-3 oraciones",
  "alignment": "Cómo los patrones se conectan entre sí",
  "timing": "Qué sugieren los ciclos sobre los patrones",
  "strengths": ["patrón 1", "patrón 2"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1", "consideración 2"],
  "suggestedNextStep": "Una acción concreta para trabajar con los patrones",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;

    default:
      return `${rolePrompt}

${baseContext}

TAREA: Interpretá la información disponible del usuario.

Generá una respuesta JSON con:
{
  "summary": "Síntesis en 2-3 oraciones",
  "alignment": "Cómo se conectan los datos",
  "timing": "Qué sugieren los ciclos",
  "strengths": ["fortaleza 1"],
  "tensions": ["tensión 1"],
  "whatToConsider": ["consideración 1"],
  "suggestedNextStep": "Una acción concreta",
  "confidence": "Alta/Media/Baja",
  "limitations": ["limitación 1"]
}`;
  }
}

// ============================================================
// AI INTERPRETATION (Server-side only)
// ============================================================

/**
 * Generate AI interpretation using structured context.
 * This function calls the API route which handles the actual AI call.
 * Client-side safe.
 */
export async function generateIntelligenceInterpretation(
  request: InterpretationRequest,
  provider: 'openai' | 'claude' = 'openai'
): Promise<MolinoInterpretation> {
  try {
    const response = await fetch('/api/ai/interpretation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: request.context.userProfile,
        target: request.context.entity || { name: 'Análisis general' },
        result: request.context.compatibility || {
          user: request.context.userProfile,
          target: {},
          scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
          strengths: [],
          challenges: [],
          narrative: '',
          insight: '',
        },
        provider,
        template: request.template || buildIntelligencePrompt(request),
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const interpretation = data.interpretation;

    return {
      summary: interpretation.narrative || '',
      alignment: interpretation.detailedInsights?.[0] || '',
      timing: interpretation.detailedInsights?.[1] || '',
      // recommendations[0] ya se usa en suggestedNextStep — strengths toma el resto
      // para no repetir literalmente el mismo texto en dos bloques distintos.
      strengths: interpretation.recommendations?.slice(1, 4) || [],
      tensions: interpretation.reflectionQuestions?.slice(0, 2) || [],
      whatToConsider: interpretation.detailedInsights?.slice(2, 5) || [],
      suggestedNextStep: interpretation.recommendations?.[0] || '',
      confidence: 'Media',
      limitations: ['Interpretación basada en sistemas simbólicos, no predicciones científicas.'],
      rawContext: request.context,
    };
  } catch (error) {
    console.error('Error en Intelligence Engine:', error);
    return generateFallbackInterpretation(request);
  }
}

/**
 * Generate fallback interpretation when AI is unavailable.
 * Uses deterministic data to create a structured response.
 */
export function generateFallbackInterpretation(
  request: InterpretationRequest
): MolinoInterpretation {
  const { type, context } = request;
  const { userProfile, cycles } = context;

  const dayTheme = getDayTheme(cycles.personalDay);
  const yearTheme = getYearTheme(cycles.personalYear);

  let summary = '';
  let alignment = '';
  let timing = '';
  let suggestedNextStep = '';

  switch (type) {
    case 'personal_profile': {
      const dailyEnergy = context.dailyEnergy;
      summary = `${userProfile.name} tiene un Life Path ${userProfile.lifePath} como ${userProfile.archetype}. Su elemento ${userProfile.element} y signo ${userProfile.sunSign} crean una personalidad única.`;
      alignment = `Los elementos de tu perfil se conectan a través de tu energía de ${userProfile.element} y tu enfoque de ${userProfile.archetype}.`;
      // Si hay energía del día real, explicamos por qué ese momento importa
      // para esta identidad — el tema de año/día y la mecánica elemento→potencia/modula
      // ya se comunican en Moment Insight, así que acá evitamos repetirlas literalmente.
      timing = dailyEnergy
        ? `El tono de ${dailyEnergy.theme.toLowerCase()} (${dailyEnergy.overallScore}/100) puede ser especialmente relevante para tu forma de desenvolverte desde tu ${userProfile.archetype}.`
        : `Tu año personal (${cycles.personalYear}) indica ${yearTheme}. Tu día personal (${cycles.personalDay}) sugiere ${dayTheme}.`;
      suggestedNextStep = 'Explorá las diferentes capas de tu perfil para entender cómo se conectan.';
      break;
    }

    case 'daily_energy':
      summary = `Hoy es un día de ${dayTheme}. Tu energía está orientada hacia la acción y la reflexión.`;
      alignment = `Tu elemento ${userProfile.element} interactúa con la energía del día de manera ${getDayAlignment(cycles.personalDay)}.`;
      timing = `Este es un buen momento para ${getDayAction(cycles.personalDay)}.`;
      suggestedNextStep = 'Dedicá unos minutos a reflexionar sobre qué área de tu vida necesita atención hoy.';
      break;

    case 'timing':
      summary = `El timing actual sugiere ${getTimingAdvice(cycles.personalDay, cycles.personalYear)}.`;
      alignment = `Tu perfil de ${userProfile.archetype} se ${getProfileTimingAlignment(cycles.personalDay)} con este momento.`;
      timing = `Tu día personal (${cycles.personalDay}) favorece ${getDayAction(cycles.personalDay)}.`;
      suggestedNextStep = 'Evaluá si el momento es favorable para tu intención específica.';
      break;

    case 'decision': {
      // Si hay un DecisionResult real (analyzeDecision ya corrió sobre la pregunta
      // del usuario), usamos su razonamiento — así el fallback sigue respondiendo
      // a lo que la persona preguntó, en vez de un consejo genérico por lifePath/día.
      const decision = context.decision;
      if (decision) {
        summary = `Sobre "${decision.question}": ${decision.reasoning}`;
        alignment = `Tu energía de ${userProfile.archetype} y tu elemento ${userProfile.element} influyen en cómo procesás esta decisión.`;
        timing = `El día personal (${cycles.personalDay}) ${getDayDecisionTiming(cycles.personalDay)}.`;
        suggestedNextStep = decision.nextSteps[0] || 'Considerá los pros y contras desde la perspectiva de tu perfil.';
      } else {
        summary = `Para esta decisión, tu perfil sugiere ${getDecisionAdvice(userProfile.lifePath, cycles.personalDay)}.`;
        alignment = `Tu energía de ${userProfile.archetype} y tu elemento ${userProfile.element} influyen en cómo procesás esta decisión.`;
        timing = `El día personal (${cycles.personalDay}) ${getDayDecisionTiming(cycles.personalDay)}.`;
        suggestedNextStep = 'Considerá los pros y contras desde la perspectiva de tu perfil.';
      }
      break;
    }

    default:
      summary = `Tu perfil de ${userProfile.archetype} con Life Path ${userProfile.lifePath} muestra una energía única.`;
      alignment = 'Los elementos de tu perfil se conectan de manera coherente.';
      timing = `Tu año personal (${cycles.personalYear}) indica ${yearTheme}.`;
      suggestedNextStep = 'Explorá las diferentes dimensiones de tu perfil.';
  }

  return {
    summary,
    alignment,
    timing,
    strengths: [userProfile.archetype, `Elemento ${userProfile.element}`, `${userProfile.sunSign}`],
    tensions: ['Las diferencias son oportunidades de crecimiento.'],
    whatToConsider: [
      'Estas interpretaciones se basan en sistemas simbólicos.',
      'Son herramientas de reflexión, no predicciones.',
    ],
    suggestedNextStep,
    confidence: 'Media',
    limitations: [
      'Interpretación generada con datos locales.',
      'Los sistemas simbólicos son herramientas de reflexión, no ciencia.',
    ],
    rawContext: request.context,
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getDayTheme(personalDay: number): string {
  const themes: Record<number, string> = {
    1: 'iniciación y acción',
    2: 'cooperación y conexión',
    3: 'expresión y creatividad',
    4: 'construcción y disciplina',
    5: 'cambio y aventura',
    6: 'armonía y cuidado',
    7: 'introspección y sabiduría',
    8: 'manifestación y poder',
    9: 'cierre y compasión',
    11: 'intuición elevada',
    22: 'construcción a gran escala',
    33: 'servicio y amor',
  };
  return themes[personalDay] || 'energía mixta';
}

function getYearTheme(personalYear: number): string {
  const themes: Record<number, string> = {
    1: 'nuevos comienzos',
    2: 'cooperación y relaciones',
    3: 'expresión y creatividad',
    4: 'trabajo y estabilidad',
    5: 'cambio y aventura',
    6: 'responsabilidad y hogar',
    7: 'introspección y sabiduría',
    8: 'manifestación y poder',
    9: 'cierre y compasión',
    11: 'intuición elevada',
    22: 'construcción a gran escala',
    33: 'servicio y amor',
  };
  return themes[personalYear] || 'crecimiento';
}

function getDayAlignment(personalDay: number): string {
  if ([1, 4, 8].includes(personalDay)) return 'constructiva';
  if ([2, 6].includes(personalDay)) return 'cooperativa';
  if ([3, 5].includes(personalDay)) return 'expresiva';
  if ([7, 9].includes(personalDay)) return 'reflectiva';
  return 'equilibrada';
}

function getDayAction(personalDay: number): string {
  const actions: Record<number, string> = {
    1: 'comenzar algo nuevo',
    2: 'conectar con otros',
    3: 'comunicar y crear',
    4: 'organizar y trabajar',
    5: 'explorar y adaptarse',
    6: 'cuidar de quienes te rodean',
    7: 'mirar hacia adentro',
    8: 'asumir liderazgo',
    9: 'completar y soltar',
  };
  return actions[personalDay] || 'reflexionar y actuar con consciencia';
}

function getTimingAdvice(personalDay: number, personalYear: number): string {
  if (personalDay === 1 || personalDay === 8) return 'un momento favorable para acciones importantes';
  if (personalDay === 7 || personalDay === 9) return 'un momento para reflexionar antes de actuar';
  if (personalDay === 5) return 'un momento de cambio e imprevisibilidad';
  return 'un momento equilibrado para avanzar';
}

function getProfileTimingAlignment(personalDay: number): string {
  if ([1, 4, 8].includes(personalDay)) return 'alinea bien';
  if ([2, 6].includes(personalDay)) return 'necesita cooperación';
  if ([7, 9].includes(personalDay)) return 'requiere reflexión';
  return 'está en equilibrio';
}

function getDecisionAdvice(lifePath: number, personalDay: number): string {
  if (lifePath === 1 || lifePath === 8) return 'confianza en tu capacidad de decisión';
  if (lifePath === 2 || lifePath === 6) return 'considerar a otros en tu proceso';
  if (lifePath === 7) return 'análisis profundo antes de decidir';
  return 'un enfoque equilibrado';
}

function getDayDecisionTiming(personalDay: number): string {
  if ([1, 8].includes(personalDay)) return 'favorece las decisiones firmes';
  if ([2, 6].includes(personalDay)) return 'favorece las decisiones cooperativas';
  if ([7, 9].includes(personalDay)) return 'favorece la reflexión antes de decidir';
  return 'ofrece un equilibrio para decidir';
}
