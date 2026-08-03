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
import { buildPersonalCode, buildPatterns, ELEMENT_PACE } from './synthesisEngine';
import { getFriends, getChallenging, type Animal } from '@/lib/data/animalRelations';

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
    archetypeChallenges: string[];
    archetypeStrengths: string[];
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
  /**
   * Narrative extension, populated only for type "personal_profile" (the paid
   * synthesis). Optional and additive so the other interpretation types
   * (daily_energy, timing, compatibility, decision, pattern) are unaffected.
   */
  opening?: string;
  corePattern?: {
    what: string;
    source: string;
    whyItMatters: string;
  };
  howYouOperate?: string;
  relationalNote?: string;
  closingSynthesis?: string;
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
      // ARCHETYPE_DESCRIPTIONS (numerologyEngine.ts) no tiene un campo
      // `.description` — solo `keywords`/`strengths`/`challenges`. Leer
      // `.description` devolvía siempre '' para cualquier perfil real,
      // apagando en silencio la rama de texto más específica en
      // generateFallbackInterpretation. `keywords` sí existe siempre (3 por
      // arquetipo) — se usa para construir una frase real, no fabricada.
      archetypeDescription: profile.archetypeInfo?.keywords?.length
        ? `Tu arquetipo se define por ${profile.archetypeInfo.keywords.join(', ').toLowerCase()}.`
        : '',
      archetypeChallenges: profile.archetypeInfo?.challenges || [],
      archetypeStrengths: profile.archetypeInfo?.strengths || [],
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
      const personalCode = buildPersonalCode({
        lifePath: userProfile.lifePath,
        expressionNumber: numerology.expressionNumber,
        soulNumber: numerology.soulNumber,
        personalityNumber: numerology.personalityNumber,
      } as UserProfile);
      const animal = chineseZodiac.animal as Animal;
      const friends = getFriends(animal);
      const challenging = getChallenging(animal);
      const relationsBlock = friends.length || challenging.length
        ? `RELACIONES REALES DE TU ANIMAL CHINO (${animal}) — dato tradicional, no inventado:
- Afines: ${friends.map(f => `${f.animal} (${f.label})`).join(', ') || 'sin datos'}
- Desafiantes: ${challenging.map(c => `${c.animal} (${c.label})`).join(', ') || 'sin datos'}`
        : '';

      return `${rolePrompt}

${baseContext}
CÓDIGO PERSONAL (numerología completa):
- Life Path ${personalCode.lifePath.number} — ${personalCode.lifePath.name}: ${personalCode.lifePath.meaning}
${personalCode.expression.number ? `- Expresión ${personalCode.expression.number} — ${personalCode.expression.name}: ${personalCode.expression.meaning}` : ''}
${personalCode.soul.number ? `- Alma ${personalCode.soul.number} — ${personalCode.soul.name}: ${personalCode.soul.meaning}` : ''}
${relationsBlock}
${dailyEnergy ? `MOMENTO ACTUAL:
- Score de energía de hoy: ${dailyEnergy.overallScore}/100
- Tema del día: ${dailyEnergy.theme}` : ''}
${timingCtx ? `TIMING (para la intención "${timingCtx.intention}" que el usuario eligió):
- Score: ${timingCtx.timingScore}/100
- Explicación: ${timingCtx.explanation}` : ''}

TAREA: Escribí la síntesis premium del perfil completo del usuario, como una lectura con arco narrativo — no una lista de datos sueltos.

IMPORTANTE:
- El campo "timing" debe explicar POR QUÉ el momento actual importa dentro de la identidad
  del usuario (archetype, elemento) — no repitas el tema del año/día personal como si fuera
  la novedad, eso ya se le mostró en otra sección.
- Si no hay MOMENTO ACTUAL disponible, no inventes un score ni un tema.
- Si no hay TIMING disponible, no menciones ninguna intención ni recomendación de timing.
- "corePattern": nombrá UN patrón central real (ej. cómo el Life Path y la Expresión, o el
  elemento y el arquetipo, se refuerzan o se tensionan entre sí), decí de qué dos señales sale,
  y por qué importa. No inventes una convergencia si las señales no dicen realmente lo mismo —
  en ese caso describí la señal más fuerte sola.
- "howYouOperate": traducí el perfil a comportamiento observable ("cuando tenés que elegir
  entre X e Y, tu patrón tiende a..."), no a rasgos abstractos ("sos comunicativo").
- "relationalNote": usá SOLO los animales afines/desafiantes reales listados arriba. Si no hay
  relaciones listadas, dejá este campo vacío en vez de inventar una dinámica.
- "closingSynthesis": una o dos frases memorables y compartibles que conecten quién es esta
  persona, dónde está (su momento) y qué hacer ahora. Es el cierre, tiene que poder
  leerse solo, fuera de contexto, y seguir siendo específico de este perfil.
- "tensions": basate en un desafío real del arquetipo o en una fricción entre dos señales
  concretas del perfil — nunca una frase que podría aplicar a cualquier persona.

Generá una respuesta JSON con:
{
  "opening": "Una frase fuerte que sintetice quién es esta persona, derivada del perfil real — no una definición genérica de su Life Path",
  "summary": "Síntesis del perfil en 2-3 oraciones",
  "corePattern": { "what": "el patrón central", "source": "de qué señales sale (ej. Life Path 4 + elemento Tierra)", "whyItMatters": "por qué importa" },
  "alignment": "Cómo los elementos del perfil se conectan entre sí",
  "tensions": ["tensión 1, real y trazable", "tensión 2"],
  "howYouOperate": "Comportamiento observable derivado del perfil, en 2-3 oraciones",
  "relationalNote": "Qué tipo de energías complementan o generan fricción, basado en las relaciones reales del animal chino (vacío si no hay datos)",
  "timing": "Por qué el momento actual importa dentro de la identidad del usuario",
  "suggestedNextStep": "Una acción concreta y personalizada",
  "closingSynthesis": "Cierre memorable y compartible en 1-2 frases",
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "whatToConsider": ["consideración 1", "consideración 2"],
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
  let strengths: string[] = [userProfile.archetype, `Elemento ${userProfile.element}`, `${userProfile.sunSign}`];
  let tensions: string[] = ['Las diferencias son oportunidades de crecimiento.'];
  let whatToConsider: string[] = [
    'Estas interpretaciones se basan en sistemas simbólicos.',
    'Son herramientas de reflexión, no predicciones.',
  ];
  let narrativeExtension: Pick<
    MolinoInterpretation,
    'opening' | 'corePattern' | 'howYouOperate' | 'relationalNote' | 'closingSynthesis'
  > = {};

  switch (type) {
    case 'personal_profile': {
      const dailyEnergy = context.dailyEnergy;
      const { numerology } = context;
      const personalCode = buildPersonalCode({
        lifePath: userProfile.lifePath,
        expressionNumber: numerology.expressionNumber,
        soulNumber: numerology.soulNumber,
        personalityNumber: numerology.personalityNumber,
      } as UserProfile);

      // buildPatterns ya trae el guardrail anti-fabricación de synthesisEngine
      // (assertNotCircular + findSharedTheme) — reusarlo acá evita reinventar
      // esa lógica y garantiza que "Tu motor"/"Tu tensión" nunca inventen una
      // convergencia que no exista en el perfil real.
      const patterns = buildPatterns({
        lifePath: userProfile.lifePath,
        element: userProfile.element,
        sunSign: userProfile.sunSign,
        chineseZodiac: userProfile.chineseZodiac,
        archetypeInfo: { description: numerology.archetypeDescription, challenges: numerology.archetypeChallenges },
        cycles: { personalYear: cycles.personalYear },
      } as UserProfile);
      const motorPattern = patterns.find(p => p.label === 'Tu motor');
      const tensionPattern = patterns.find(p => p.label === 'Tu tensión');

      const animal = userProfile.chineseZodiac as Animal;
      const friends = getFriends(animal);
      const challengingRelations = getChallenging(animal);

      summary = `${userProfile.name ? `${userProfile.name}, tu` : 'Tu'} Life Path ${userProfile.lifePath} (${personalCode.lifePath.name}) es la nota base de tu perfil: ${personalCode.lifePath.meaning} Tu elemento ${userProfile.element} y tu signo ${userProfile.sunSign} lo modulan.`;
      // "Qué significa" tiene que agregar una capa distinta de "Tu patrón
      // central" (corePattern.whyItMatters usa motorPattern.description más
      // abajo) — reusar el mismo texto acá era literal, no una repetición
      // aparente. archetypeDescription es una señal real que hasta ahora no
      // se usaba en ningún lado del fallback.
      alignment = numerology.archetypeDescription
        ? `${numerology.archetypeDescription} Tu elemento ${userProfile.element} y tu signo ${userProfile.sunSign} son la textura con la que esto se expresa día a día.`
        : `Tu energía de ${userProfile.element} y tu enfoque de ${userProfile.archetype} se conectan a través de tu Life Path ${userProfile.lifePath}.`;
      // Si hay energía del día real, explicamos por qué ese momento importa
      // para esta identidad — el tema de año/día y la mecánica elemento→potencia/modula
      // ya se comunican en Moment Insight, así que acá evitamos repetirlas literalmente.
      timing = dailyEnergy
        ? `El tono de ${dailyEnergy.theme.toLowerCase()} (${dailyEnergy.overallScore}/100) puede ser especialmente relevante para tu forma de desenvolverte desde tu ${userProfile.archetype}.`
        : `Tu año personal (${cycles.personalYear}) indica ${yearTheme}. Tu día personal (${cycles.personalDay}) sugiere ${dayTheme}.`;
      suggestedNextStep = getOperatingAction(userProfile.element, userProfile.lifePath, cycles.personalDay, numerology.archetypeChallenges[0], numerology.archetypeStrengths[0]);

      // "Fortalezas" no puede ser una relabel de datos ya mostrados arriba
      // (archetype/elemento/signo) — cada línea agrega una capa real:
      // qué es (archetypeDescription), cómo se nota (ELEMENT_TONE, la misma
      // tabla que usa howYouOperate) y cuándo se vuelve costo (el challenge
      // real del arquetipo, sin repetir la oración completa de "tensions").
      const motorKeyword = motorPattern?.keyword || personalCode.lifePath.name;
      // `strengths` (archetypeInfo.strengths, p.ej. Iniciativa/Coraje) es un
      // campo real distinto de `keywords` (que arma archetypeDescription,
      // usado en "alignment") — evita que Fortalezas y Qué significa
      // terminen citando la misma lista de palabras.
      strengths = [
        numerology.archetypeStrengths.length
          ? `Tu fortaleza central: ${numerology.archetypeStrengths.slice(0, 3).join(', ').toLowerCase()}.`
          : `${motorKeyword} es tu fortaleza central según tu Life Path ${userProfile.lifePath}.`,
        `Con tu elemento ${userProfile.element}, esto se nota en que ${ELEMENT_TONE[userProfile.element] || 'tu forma de avanzar es propia'}.`,
        numerology.archetypeChallenges[0]
          ? `El límite aparece cuando se acumula sin freno: ahí tu ${numerology.archetypeChallenges[0].toLowerCase()} pasa de ser un rasgo a ser un costo.`
          : 'Como toda fortaleza, rinde más cuando se equilibra con momentos de pausa.',
      ];

      tensions = [
        tensionPattern?.description ||
          (numerology.archetypeChallenges[0]
            ? `Tu necesidad de ${numerology.archetypeChallenges[0].toLowerCase()} puede aparecer cuando tu energía está desbalanceada.`
            : 'Todo perfil tiene una zona de crecimiento; la clave es reconocerla a tiempo.'),
      ];
      whatToConsider = [
        'Estas interpretaciones se basan en sistemas simbólicos, no en predicciones científicas.',
        'Son herramientas de reflexión — el patrón que ves acá describe una tendencia, no un destino fijo.',
      ];

      narrativeExtension = {
        opening: `${personalCode.lifePath.name}: ${personalCode.lifePath.meaning}`,
        corePattern: motorPattern
          ? { what: motorPattern.keyword, source: motorPattern.sources.join(' + '), whyItMatters: motorPattern.description }
          : undefined,
        howYouOperate: getOperatingPattern(userProfile.element, userProfile.lifePath, cycles.personalDay, numerology.archetypeChallenges[0], numerology.archetypeStrengths[0]),
        relationalNote: friends.length || challengingRelations.length
          ? `Tu animal chino (${animal}) tiende a complementarse con ${friends.map(f => f.animal).join(', ') || 'perfiles afines'}${challengingRelations.length ? `, y suele generar más fricción con ${challengingRelations.map(c => c.animal).join(', ')}` : ''}.`
          : undefined,
        // Pensado explícitamente para compartirse (screenshot/WhatsApp): corto,
        // en forma de contraste (no de resumen), y sin ningún dato que no
        // esté ya en el perfil. Combina 3 señales reales e independientes
        // (animal chino, Life Path, motor+challenge del arquetipo) — la
        // cardinalidad combinada (12 animales × 12 arquetipos) hace que la
        // frase sea distinta para la enorme mayoría de los perfiles, sin
        // reformular literalmente howYouOperate/suggestedNextStep de arriba
        // (comparten el dato, no la oración).
        closingSynthesis: `${animal} × Life Path ${userProfile.lifePath}: ${(motorPattern?.keyword || personalCode.lifePath.name).toLowerCase()} cuando podés elegir, ${(tensionPattern?.keyword || numerology.archetypeChallenges[0] || 'la duda').toLowerCase()} cuando no.`,
      };
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
    strengths,
    tensions,
    whatToConsider,
    suggestedNextStep,
    confidence: 'Media',
    limitations: [
      'Interpretación generada con datos locales.',
      'Los sistemas simbólicos son herramientas de reflexión, no ciencia.',
    ],
    rawContext: request.context,
    ...narrativeExtension,
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Translates the profile into observable behavior ("cuando tenés que elegir
 * entre X e Y, tu patrón tiende a...") instead of an abstract trait label.
 * Branches on lifePath group first (the dominant signal), then modulates
 * with element — same discipline as decisionsEngine's per-lifePath text,
 * so two different lifePaths never collapse into the same sentence.
 */
// ELEMENT_PACE (fast/slow/fluid per element) now lives in synthesisEngine.ts
// as the single source of truth — buildTensions() there uses the exact same
// mapping to detect a structural pace mismatch, so the narrative here and
// the "Tus Tensiones" section always agree on what counts as a contradiction.

const ELEMENT_TONE: Record<string, string> = {
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
function combineWithElement(branchPace: 'fast' | 'slow', element: string): string {
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
function getOperatingPattern(element: string, lifePath: number, personalDay: number, challenge?: string, strength?: string): string {
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
function getOperatingAction(element: string, lifePath: number, personalDay: number, challenge?: string, strength?: string): string {
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
