import type { UserProfile } from '@/types/user';
import { buildPersonalCode, buildPatterns } from '../synthesisEngine';
import { getFriends, getChallenging, type Animal } from '@/lib/data/animalRelations';
import { ELEMENT_TONE, getOperatingPattern, getOperatingAction } from './fallbackNarrative';
import {
  getDayTheme,
  getYearTheme,
  getDayAlignment,
  getDayAction,
  getTimingAdvice,
  getProfileTimingAlignment,
  getDecisionAdvice,
  getDayDecisionTiming,
} from './fallbackThemes';
import type { InterpretationRequest, MolinoInterpretation } from './types';

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
  // El disclaimer epistemológico vive en limitations (se muestra una vez en la
  // línea de confianza). whatToConsider queda para contenido propio de cada
  // tipo — no repite la misma advertencia dos veces en la UI.
  let whatToConsider: string[] = [];
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

      summary = `${userProfile.name ? `${userProfile.name}, tu` : 'Tu'} Life Path ${userProfile.lifePath} (${personalCode.lifePath.name}) es la nota base de tu perfil: ${personalCode.lifePath.meaning}. Tu elemento ${userProfile.element} y tu signo ${userProfile.sunSign} lo modulan.`;
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
        'Interpretá esto como una lente, no como un diagnóstico: señala una tendencia, no un destino fijo.',
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

    // Sin IA no hay forma honesta de responder una pregunta abierta en
    // lenguaje natural — el fallback determinista no inventa una respuesta,
    // solo confirma qué datos reales tiene disponibles para cuando la IA
    // vuelva a estar disponible (mismo principio que "no fabricar" del resto
    // del engine, aplicado a un caso donde la única respuesta honesta es
    // "no puedo responder esto todavía").
    case 'question':
      summary = request.question
        ? `Todavía no pudimos generar una respuesta a "${request.question}" — necesita interpretación de IA, que no está disponible en este momento.`
        : 'No pudimos generar una respuesta — intentá de nuevo en un momento.';
      alignment = `Mientras tanto, tu Life Path ${userProfile.lifePath} (${userProfile.archetype}) y tu animal chino ${userProfile.chineseZodiac} son los datos base que Molino ya tiene calculados sobre vos.`;
      timing = '';
      suggestedNextStep = 'Volvé a intentar en unos segundos.';
      whatToConsider = [];
      break;

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

