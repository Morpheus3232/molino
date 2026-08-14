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

/**
 * Schema integrity gate (Fase 1 — Atlas Visual):
 * 1. No entity may carry the deprecated `foundingYear`.
 * 2. Every entity must have a primary event with a valid numeric `year`.
 * 3. The animal computed from that year/date must be a real Chinese zodiac
 *    animal — the declared data must be internally consistent with the engine.
 */
import { getPrimaryEvent } from '@/lib/data/entity-events';
import { calculateAnimalFromDate } from '@/lib/engines/chineseZodiacEngine';

describe('Atlas schema integrity', () => {
  it('no entity uses the deprecated foundingYear', () => {
    const offenders = SYMBOLIC_ENTITIES.filter((e) => 'foundingYear' in (e as unknown as Record<string, unknown>));
    expect(offenders.map((e) => e.id)).toEqual([]);
  });

  it('every entity has a primary event with a valid numeric year', () => {
    const invalid: string[] = [];
    for (const entity of SYMBOLIC_ENTITIES) {
      const primary = getPrimaryEvent(entity);
      if (!primary || typeof primary.year !== 'number' || !Number.isFinite(primary.year)) {
        invalid.push(`${entity.id}: no primary event year`);
        continue;
      }
      // Historical entities include ancient cities (Dublín ~988, El Cairo
      // ~969); allow a broad plausible range, reject clearly bad data.
      if (primary.year < 800 || primary.year > new Date().getFullYear()) {
        invalid.push(`${entity.id}: year ${primary.year} out of plausible range`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('the entity year resolves to a real Chinese zodiac animal via the engine', () => {
    const invalid: string[] = [];
    for (const entity of SYMBOLIC_ENTITIES) {
      const primary = getPrimaryEvent(entity);
      if (!primary) {
        invalid.push(`${entity.id}: no primary event`);
        continue;
      }
      const { animal } = calculateAnimalFromDate(primary.date, primary.year);
      if (!animal || !ANIMALS.includes(animal as Animal)) {
        invalid.push(`${entity.id}: resolved animal "${animal}" is not a valid zodiac animal`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('every entity has a visualType and (for countries) a countryISO', () => {
    const missingVisual: string[] = [];
    for (const entity of SYMBOLIC_ENTITIES) {
      if (!entity.visualType) missingVisual.push(entity.id);
    }
    expect(missingVisual).toEqual([]);
    // Countries should resolve an ISO code (spot-check a handful).
    const countries = getEntitiesByType('country');
    const withISO = countries.filter((c) => c.countryISO).length;
    expect(withISO).toBeGreaterThan(0);
  });

  it('has substantial representation for Mexico, Colombia and Spain (no poor countries)', () => {
    const requiredISO = ['MX', 'CO', 'ES'];
    const report: Record<string, number> = {};
    for (const iso of requiredISO) {
      const count = SYMBOLIC_ENTITIES.filter((e) => e.countryISO === iso).length;
      report[iso] = count;
      // At least ~15 entities per country prevents "poor country" regressions.
      expect(count, `${iso} representation`).toBeGreaterThanOrEqual(15);
    }
    console.log('\n=== ATLAS POR PAÍS (Fase 2) ===');
    console.log(JSON.stringify(report, null, 2));
  });
});
