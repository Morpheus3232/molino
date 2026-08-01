import { describe, it, expect } from 'vitest';
import { calculateAffinity } from '@/lib/engines/affinityEngine';
import { SYMBOLIC_ENTITIES, getEntitiesByType, type EntityType } from '@/lib/data/symbolic-entities';
import { ANIMALS, type Animal } from '@/lib/data/animalRelations';
import type { UserProfile } from '@/types/user';

/**
 * Coverage regression gate: for each Chinese zodiac animal, counts how many
 * entities per category fall into HIGH / MEDIUM / LOW resonance when run
 * through the real affinityEngine. No score/tier is fabricated here —
 * everything comes from calculateAffinity(). The last two `it` blocks assert
 * zero gaps against the 3 alta / 2 media / 1 mala target — they fail the
 * suite if a dataset change drops any animal/category below it.
 *
 * Tier mapping (per affinityEngine.getTierForScore):
 *   HIGH   = resonancia-alta  (score >= 75)
 *   MEDIUM = afinidad-media OR complementarios (45-74)
 *   LOW    = desafiante OR distante (< 45)
 */

function referenceProfileFor(animal: Animal): UserProfile {
  const index = ANIMALS.indexOf(animal);
  const year = 1996 + index; // 1996 = Rata (index 0), consecutive cycle covers all 12
  return {
    name: `Referencia ${animal}`,
    birthDate: `${year}-06-15`,
    birthPlace: 'Buenos Aires, Argentina',
    goal: 'growth',
    chineseZodiac: animal,
    chineseZodiacInfo: { animal, element: 'Madera' },
  } as UserProfile;
}

type Bucket = 'HIGH' | 'MEDIUM' | 'LOW';

function bucketFor(score: number): Bucket {
  if (score >= 75) return 'HIGH';
  if (score >= 45) return 'MEDIUM';
  return 'LOW';
}

const CATEGORY_TYPES: EntityType[] = ['brand', 'city', 'country', 'university', 'team', 'movie', 'artist'];

describe('Affinity coverage per animal (report)', () => {
  const report: Record<string, Record<EntityType, Record<Bucket, number>>> = {};

  for (const animal of ANIMALS) {
    const profile = referenceProfileFor(animal);
    report[animal] = {} as Record<EntityType, Record<Bucket, number>>;

    for (const type of CATEGORY_TYPES) {
      const entities = getEntitiesByType(type);
      const counts: Record<Bucket, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
      for (const entity of entities) {
        const result = calculateAffinity(profile, entity);
        counts[bucketFor(result.score)]++;
      }
      report[animal][type] = counts;
    }
  }

  it('prints the coverage report', () => {
    console.log('\n=== AFFINITY COVERAGE REPORT ===\n');
    console.log(`Total entities: ${SYMBOLIC_ENTITIES.length}`);
    for (const type of CATEGORY_TYPES) {
      console.log(`  ${type}: ${getEntitiesByType(type).length}`);
    }
    console.log('');

    for (const animal of ANIMALS) {
      console.log(`${animal.toUpperCase()}`);
      let totalHigh = 0, totalMedium = 0, totalLow = 0;
      for (const type of CATEGORY_TYPES) {
        const c = report[animal][type];
        totalHigh += c.HIGH;
        totalMedium += c.MEDIUM;
        totalLow += c.LOW;
        console.log(`  ${type.padEnd(12)} alta: ${c.HIGH}  media: ${c.MEDIUM}  mala: ${c.LOW}`);
      }
      console.log(`  ${'TOTAL'.padEnd(12)} alta: ${totalHigh}  media: ${totalMedium}  mala: ${totalLow}`);
      console.log('');
    }

    expect(report).toBeDefined();
  });

  it('reports which animal x category combos are below the 3/2/1 target (across ALL categories combined)', () => {
    const gaps: string[] = [];
    for (const animal of ANIMALS) {
      let totalHigh = 0, totalMedium = 0, totalLow = 0;
      for (const type of CATEGORY_TYPES) {
        const c = report[animal][type];
        totalHigh += c.HIGH;
        totalMedium += c.MEDIUM;
        totalLow += c.LOW;
      }
      if (totalHigh < 3) gaps.push(`${animal}: alta ${totalHigh}/3`);
      if (totalMedium < 2) gaps.push(`${animal}: media ${totalMedium}/2`);
      if (totalLow < 1) gaps.push(`${animal}: mala ${totalLow}/1`);
    }
    console.log('\n=== GAPS (combined across categories) ===');
    console.log(gaps.length ? gaps.join('\n') : 'No gaps.');
    expect(gaps).toEqual([]);
  });

  it('reports which animal x category combos are below the 3/2/1 target (PER category)', () => {
    const gaps: string[] = [];
    for (const type of CATEGORY_TYPES) {
      for (const animal of ANIMALS) {
        const c = report[animal][type];
        const missing: string[] = [];
        if (c.HIGH < 3) missing.push(`alta ${c.HIGH}/3`);
        if (c.MEDIUM < 2) missing.push(`media ${c.MEDIUM}/2`);
        if (c.LOW < 1) missing.push(`mala ${c.LOW}/1`);
        if (missing.length) gaps.push(`${type} / ${animal}: ${missing.join(', ')}`);
      }
    }
    console.log('\n=== GAPS (per category) ===');
    console.log(gaps.length ? gaps.join('\n') : 'No gaps.');
    console.log(`\nTotal gaps: ${gaps.length}`);
    expect(gaps).toEqual([]);
  });
});
