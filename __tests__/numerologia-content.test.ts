import { describe, test, expect } from 'vitest';
import { NUMBERS, MASTER_NUMBERS, MASTER_NUMBERS_NOTE } from '@/lib/data/numerologia-content';

// Regression: the deep-structure fields (coreDrive, behaviorPattern, potential,
// shadow, growthEdge, manifestation, reflectionQuestion) were added for every
// entry in one pass — a missing field on any single number silently breaks
// its /conocimiento/numerologia/[numero] page instead of failing a build.
describe('numerologia-content — estructura profunda', () => {
  test('cada número (1-9, 11, 22, 33) tiene los 7 campos nuevos completos', () => {
    expect(NUMBERS.length).toBe(12);
    for (const n of NUMBERS) {
      expect(n.coreDrive, `número ${n.number}: coreDrive`).toBeTruthy();
      expect(n.behaviorPattern, `número ${n.number}: behaviorPattern`).toBeTruthy();
      expect(n.potential.length, `número ${n.number}: potential`).toBeGreaterThan(0);
      expect(n.shadow, `número ${n.number}: shadow`).toBeTruthy();
      expect(n.growthEdge, `número ${n.number}: growthEdge`).toBeTruthy();
      expect(n.manifestation.decisions, `número ${n.number}: manifestation.decisions`).toBeTruthy();
      expect(n.manifestation.relationships, `número ${n.number}: manifestation.relationships`).toBeTruthy();
      expect(n.manifestation.work, `número ${n.number}: manifestation.work`).toBeTruthy();
      expect(n.reflectionQuestion, `número ${n.number}: reflectionQuestion`).toMatch(/\?/);
    }
  });

  test('los números maestros (11, 22, 33) siguen presentes y sin reducirse', () => {
    expect(MASTER_NUMBERS).toEqual([11, 22, 33]);
    for (const m of MASTER_NUMBERS) {
      expect(NUMBERS.some(n => n.number === m)).toBe(true);
    }
    expect(MASTER_NUMBERS_NOTE.length).toBeGreaterThan(0);
  });

  // No prueba exhaustivamente la voz editorial, pero bloquea las formas más
  // obvias de lenguaje absoluto/determinista que el brief pidió evitar.
  test('el contenido nuevo evita lenguaje absoluto o determinista', () => {
    const forbidden = [
      /vas a ser rico/i,
      /siempre vas a/i,
      /está destinado/i,
      /alma superior/i,
      /te va a pasar/i,
    ];
    const fields = NUMBERS.flatMap(n => [
      n.coreDrive,
      n.behaviorPattern,
      n.shadow,
      n.growthEdge,
      n.manifestation.decisions,
      n.manifestation.relationships,
      n.manifestation.work,
      ...n.potential,
    ]);
    for (const text of fields) {
      for (const pattern of forbidden) {
        expect(text, `"${text}" no debería matchear ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
