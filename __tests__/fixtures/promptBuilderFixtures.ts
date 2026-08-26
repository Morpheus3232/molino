/**
 * Fixed, deterministic fixtures for buildIntelligencePrompt content tests
 * (see prompt-builder-content.test.ts). Shared by the snapshot-generation
 * step and the permanent test file so both build the exact same requests.
 */
import type { MolinoContext, InterpretationRequest } from '@/lib/engines/intelligenceEngine';

export const FIXTURE_NAME = 'Lucía Fernández';

export const BASE_CONTEXT: MolinoContext = {
  userProfile: {
    name: FIXTURE_NAME,
    lifePath: 7,
    archetype: 'El Buscador',
    sunSign: 'Piscis',
    element: 'Agua',
    modality: 'Mutable',
    chineseZodiac: 'Caballo',
    chineseElement: 'Fuego',
    expressionNumber: 3,
    personalityNumber: 5,
    personalYear: 3,
    personalMonth: 7,
    personalDay: 5,
  },
  numerology: {
    lifePath: 7,
    expressionNumber: 3,
    personalityNumber: 5,
    archetype: 'El Buscador',
    archetypeDescription: 'Tu arquetipo se define por introspección, sabiduría, análisis.',
    archetypeChallenges: ['Aislamiento'],
    archetypeStrengths: ['Intuición', 'Profundidad', 'Discernimiento'],
  },
  astrology: { sunSign: 'Piscis', element: 'Agua', modality: 'Mutable', symbol: '♓' },
  chineseZodiac: { animal: 'Caballo', element: 'Fuego' },
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
};

const DAILY_ENERGY = {
  date: '2026-08-17',
  overallScore: 72,
  theme: 'Expresión',
  description: 'desc',
  strengths: ['Creatividad', 'Comunicación'],
  cautions: ['Dispersión'],
  areas: {
    work: { score: 70, label: 'Buena' },
    relationships: { score: 65, label: 'Estable' },
    creativity: { score: 85, label: 'Alta' },
    decisions: { score: 60, label: 'Moderada' },
  },
  moonPhase: { phase: 'Luna creciente', emoji: '🌒', description: 'crecimiento' },
  personalDay: 5,
  personalYear: 3,
  personalMonth: 7,
  elementInfluence: 'Agua',
  explanation: 'explicación',
};

const TIMING = {
  date: '2026-08-17',
  intention: 'start_project' as const,
  timingScore: 80,
  theme: 'Iniciación',
  favorableDimensions: ['Creatividad', 'Comunicación'],
  challengingDimensions: ['Paciencia'],
  explanation: 'Buen momento para iniciar.',
  recommendedWindow: 'Próximos 7 días',
  caveats: ['Evitar decisiones apuradas'],
  personalDay: 5,
  personalYear: 3,
  moonPhase: 'Luna creciente',
  elementInfluence: 'Agua',
};

const COMPATIBILITY = {
  user: {},
  target: {},
  scores: { numerology: 70, westernAstrology: 60, chineseAstrology: 80, archetype: 65, element: 75, overall: 70 },
  strengths: ['Comunicación fluida'],
  challenges: ['Ritmos distintos'],
  narrative: '',
  insight: '',
};

const ENTITY = {
  id: 'test-entity',
  name: 'Buenos Aires',
  category: 'city' as const,
  emoji: '🏙️',
  symbolism: {},
  context: {
    description: 'Una ciudad de contrastes y pasión.',
    keyThemes: ['Pasión', 'Contraste', 'Cultura'],
  },
};

const DECISION = {
  question: '¿Debería cambiar de trabajo este año?',
  category: 'career' as const,
  overallScore: 68,
  alignmentScore: 70,
  timingScore: 65,
  energyScore: 70,
  recommendation: 'Favorable con cautela',
  reasoning: 'Tu ciclo actual favorece el cambio, pero requiere preparación.',
  considerations: ['Estabilidad financiera', 'Timing del mercado'],
  nextSteps: ['Actualizar tu perfil profesional', 'Conversar con tu red de contactos'],
  personalDay: 5,
  personalYear: 3,
  moonPhase: 'Luna creciente',
  elementInfluence: 'Agua',
};

export const FIXTURE_REQUESTS: Record<string, InterpretationRequest> = {
  personal_profile: {
    type: 'personal_profile',
    context: { ...BASE_CONTEXT, dailyEnergy: DAILY_ENERGY as any, timing: TIMING as any },
  },
  daily_energy: {
    type: 'daily_energy',
    context: { ...BASE_CONTEXT, dailyEnergy: DAILY_ENERGY as any },
  },
  timing: {
    type: 'timing',
    context: { ...BASE_CONTEXT, timing: TIMING as any },
  },
  compatibility: {
    type: 'compatibility',
    context: { ...BASE_CONTEXT, compatibility: COMPATIBILITY as any, entity: ENTITY as any },
  },
  decision: {
    type: 'decision',
    context: { ...BASE_CONTEXT, decision: DECISION as any },
  },
  question: {
    type: 'question',
    context: BASE_CONTEXT,
    question: '¿Es un buen momento para empezar algo nuevo?',
  },
  pattern: {
    type: 'pattern',
    context: BASE_CONTEXT,
  },
  default: {
    // Not a real InterpretationType — exercises the `default` branch of the
    // switch, which is reachable at runtime from an unvalidated request body.
    type: 'unknown_type' as InterpretationRequest['type'],
    context: BASE_CONTEXT,
  },
};
