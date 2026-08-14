/**
 * Resonance classification — Chinese Zodiac buckets for the Atlas.
 */
import { describe, test, expect } from 'vitest';
import {
  classifyResonance,
  bucketEntitiesByResonance,
  bucketForRelation,
  type ResonanceBucket,
} from '@/lib/resonance';

describe('classifyResonance', () => {
  test('same animal is affine', () => {
    const r = classifyResonance('Rata', 'Rata');
    expect(r.bucket).toBe('affine');
    expect(r.relationType).toBe('same');
  });

  test('San He triad partners are affine', () => {
    // Rata-Dragón-Mono form a triad.
    expect(classifyResonance('Rata', 'Dragón').bucket).toBe('affine');
    expect(classifyResonance('Rata', 'Mono').bucket).toBe('affine');
  });

  test('Liu He harmonious pair is affine', () => {
    // Rata-Buey harmonious pair.
    expect(classifyResonance('Rata', 'Buey').bucket).toBe('affine');
  });

  test('direct opposition (Liu Chong) is tension', () => {
    // Rata-Caballo are direct opposites.
    const r = classifyResonance('Rata', 'Caballo');
    expect(r.bucket).toBe('tension');
    expect(r.relationType).toBe('clash');
  });

  test('Liu Hai harm is tension', () => {
    // Rata-Cabra is a harm pair.
    expect(classifyResonance('Rata', 'Cabra').bucket).toBe('tension');
  });

  test('unrelated animals are neutral', () => {
    // Rata-Tigre have no special relation.
    expect(classifyResonance('Rata', 'Tigre').bucket).toBe('neutral');
  });

  test('missing animal falls back to neutral', () => {
    const r = classifyResonance('', 'Rata');
    expect(r.bucket).toBe('neutral');
    expect(r.score).toBe(50);
  });

  test('bucketForRelation maps all relation types', () => {
    expect(bucketForRelation('same')).toBe('affine');
    expect(bucketForRelation('triad')).toBe('affine');
    expect(bucketForRelation('harmonious')).toBe('affine');
    expect(bucketForRelation('clash')).toBe('tension');
    expect(bucketForRelation('harm')).toBe('tension');
    expect(bucketForRelation('neutral')).toBe('neutral');
  });
});

describe('bucketEntitiesByResonance', () => {
  const entities = [
    { id: 'a', name: 'Rata-like', animal: 'Rata' },
    { id: 'b', name: 'Dragon', animal: 'Dragón' },
    { id: 'c', name: 'Horse', animal: 'Caballo' },
    { id: 'd', name: 'Tiger', animal: 'Tigre' },
  ];

  test('splits into affine / tension / neutral for a reference animal', () => {
    const { affine, tension, neutral } = bucketEntitiesByResonance('Rata', entities);
    // Rata vs Rata(same), Dragón(triad) → affine; Caballo(clash) → tension; Tigre → neutral.
    expect(affine.map((e) => e.id)).toContain('a');
    expect(affine.map((e) => e.id)).toContain('b');
    expect(tension.map((e) => e.id)).toEqual(['c']);
    expect(neutral.map((e) => e.id)).toEqual(['d']);
  });

  test('each result carries a resonance classification', () => {
    const { affine } = bucketEntitiesByResonance('Rata', entities);
    expect(affine[0].resonance).toMatchObject({ bucket: 'affine' as ResonanceBucket });
  });

  test('affine bucket sorts by score descending', () => {
    // same (95) beats triad (85).
    const { affine } = bucketEntitiesByResonance('Rata', entities);
    expect(affine[0].id).toBe('a');
  });
});
