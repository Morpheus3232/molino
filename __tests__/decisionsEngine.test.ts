import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analyzeDecision } from '@/lib/engines/decisionsEngine';
import type { UserProfile } from '@/types/user';

const profile: UserProfile = {
  name: 'Test',
  birthDate: '1990-06-15',
  birthPlace: 'Buenos Aires',
  goal: 'career',
  interests: [],
  onboardingStep: 4,
  completedSections: ['identity'],
  theme: 'light',
  language: 'es',
  notifications: true,
  lifePath: 1,
  sunSign: 'Géminis',
  sunSignInfo: { sign: 'Géminis', element: 'Aire', modality: 'Mutable', symbol: '♊' },
  chineseZodiac: 'Caballo',
  chineseZodiacInfo: { animal: 'Caballo', element: 'Fuego', emoji: '🐎' },
  element: 'Aire',
  modality: 'Mutable',
  luckyNumber: 7,
  archetype: 'El Líder',
  archetypeInfo: { name: 'El Líder', color: '#D4A843', description: '', quote: '', keywords: [], strengths: [], challenges: [] },
  expressionNumber: 3,
  soulNumber: 7,
  personalityNumber: 5,
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

describe('analyzeDecision — question text only affects contextual content, never scores', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-02T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('keeps scores identical but varies contextual content for different signals', () => {
    const accion = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');
    const espera = analyzeDecision(profile, '¿conviene esperar antes de esta oferta de trabajo?', 'career');

    expect(accion.overallScore).toBe(espera.overallScore);
    expect(accion.alignmentScore).toBe(espera.alignmentScore);
    expect(accion.timingScore).toBe(espera.timingScore);
    expect(accion.energyScore).toBe(espera.energyScore);

    expect(accion.recommendation).not.toBe(espera.recommendation);
    expect(accion.reasoning).not.toBe(espera.reasoning);
    expect(accion.considerations).not.toEqual(espera.considerations);
    expect(accion.nextSteps).not.toEqual(espera.nextSteps);
  });

  it('produces identical output to baseline when there is no signal', () => {
    const q1 = analyzeDecision(profile, '¿qué conviene hacer con X?', 'career');
    const q2 = analyzeDecision(profile, 'consulta general', 'career');

    expect(q1.detectedIntent).toBeFalsy();
    expect(q2.detectedIntent).toBeFalsy();

    expect(q1.recommendation).toBe(q2.recommendation);
    expect(q1.reasoning).toBe(q2.reasoning);
    expect(q1.considerations).toEqual(q2.considerations);
    expect(q1.nextSteps).toEqual(q2.nextSteps);
    expect(q1.overallScore).toBe(q2.overallScore);
    expect(q1.alignmentScore).toBe(q2.alignmentScore);
    expect(q1.timingScore).toBe(q2.timingScore);
    expect(q1.energyScore).toBe(q2.energyScore);
  });

  it('is deterministic for repeated identical inputs', () => {
    const a = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');
    const b = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');
    const c = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');
    expect(a).toEqual(b);
    expect(b).toEqual(c);
  });

  it('does not detect a false positive from a bare noun', () => {
    const result = analyzeDecision(profile, '¿casa o trabajo?', 'personal');
    expect(result.detectedIntent).toBeFalsy();
  });

  it('keeps the public DecisionResult contract', () => {
    const result = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');

    const stringFields = ['question', 'category', 'recommendation', 'reasoning', 'moonPhase', 'elementInfluence'] as const;
    const numberFields = ['overallScore', 'alignmentScore', 'timingScore', 'energyScore', 'personalDay', 'personalYear'] as const;
    const arrayFields = ['considerations', 'nextSteps'] as const;

    for (const field of stringFields) {
      expect(typeof result[field]).toBe('string');
    }
    for (const field of numberFields) {
      expect(typeof result[field]).toBe('number');
    }
    for (const field of arrayFields) {
      expect(Array.isArray(result[field])).toBe(true);
    }
    expect(result.question).toBe('¿debería aceptar esta oferta de trabajo?');
    expect(result.category).toBe('career');
  });

  it('exposes detectedIntent only as an optional field', () => {
    const withSignal = analyzeDecision(profile, '¿debería aceptar esta oferta de trabajo?', 'career');
    expect(withSignal.detectedIntent).toBeDefined();
    expect(withSignal.detectedIntent!.kind).toBe('accion');

    const noSignal = analyzeDecision(profile, 'consulta general', 'career');
    expect(noSignal.detectedIntent).toBeUndefined();
  });
});
