/**
 * Atlas curation tests.
 * Validates the entity selection layer (global + local).
 */
import { describe, test, expect } from 'vitest';
import type { LightweightEntity } from '@/types/atlas';
import { getCuratedLocalFromPool, CURATION_SECTION_ORDER, FEATURED_COUNTRY_ISOS } from '@/lib/data/atlas-curation-helpers';
import { getCuratedGlobalEntities } from '@/lib/data/atlas-curation';
import { getAllAtlasEntities } from '@/lib/data/atlas-queries';

function makeEntity(overrides: Partial<LightweightEntity> = {}): LightweightEntity {
  return {
    id: overrides.id ?? "test",
    name: overrides.name ?? "Test",
    animal: overrides.animal ?? "Rata",
    isApproximate: overrides.isApproximate ?? false,
    visualType: overrides.visualType ?? "logo",
    emoji: overrides.emoji ?? "🧪",
    country: overrides.country ?? "Argentina",
    countryISO: overrides.countryISO ?? "AR",
    type: overrides.type ?? "brand",
  };
}

describe('getCuratedGlobalEntities', () => {
  test('returns all expected category keys', () => {
    const curated = getCuratedGlobalEntities();
    for (const type of CURATION_SECTION_ORDER) {
      expect(Array.isArray(curated[type])).toBe(true);
    }
  });

  test('has at least some entities per category', () => {
    const curated = getCuratedGlobalEntities();
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += curated[type].length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('all entities have required fields', () => {
    const curated = getCuratedGlobalEntities();
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of curated[type]) {
        expect(e.id).toBeTruthy();
        expect(e.name).toBeTruthy();
        expect(e.animal).toBeTruthy();
        expect(e.type).toBeTruthy();
        expect(e.type).not.toBe("country");
      }
    }
  });

  test('no duplicates within or across categories', () => {
    const curated = getCuratedGlobalEntities();
    const allIds = new Set<string>();
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of curated[type]) {
        expect(allIds.has(e.id)).toBe(false);
        allIds.add(e.id);
      }
    }
  });

  test('deterministic — same output on repeated calls', () => {
    const a = getCuratedGlobalEntities();
    const b = getCuratedGlobalEntities();
    for (const type of CURATION_SECTION_ORDER) {
      expect(a[type].map((e) => e.id)).toEqual(b[type].map((e) => e.id));
    }
  });
});

describe('getCuratedLocalFromPool', () => {
  const global = getCuratedGlobalEntities();
  const all = getAllAtlasEntities();

  test('returns AR entities when country is AR', () => {
    const local = getCuratedLocalFromPool(all, "AR", global);
    expect(local).toBeDefined();
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of local[type] ?? []) {
        expect(e.countryISO).toBe("AR");
        total++;
      }
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns MX entities when country is MX', () => {
    const local = getCuratedLocalFromPool(all, "MX", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of local[type] ?? []) {
        expect(e.countryISO).toBe("MX");
        total++;
      }
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns CL entities when country is CL', () => {
    const local = getCuratedLocalFromPool(all, "CL", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += (local[type] ?? []).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns ES entities when country is ES', () => {
    const local = getCuratedLocalFromPool(all, "ES", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += (local[type] ?? []).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns CO entities when country is CO', () => {
    const local = getCuratedLocalFromPool(all, "CO", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += (local[type] ?? []).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns UY entities when country is UY', () => {
    const local = getCuratedLocalFromPool(all, "UY", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += (local[type] ?? []).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('returns PE entities when country is PE', () => {
    const local = getCuratedLocalFromPool(all, "PE", global);
    let total = 0;
    for (const type of CURATION_SECTION_ORDER) {
      total += (local[type] ?? []).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  test('no overlap between local and global', () => {
    const local = getCuratedLocalFromPool(all, "AR", global);
    const globalIds = new Set<string>();
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of global[type] ?? []) globalIds.add(e.id);
    }
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of local[type] ?? []) {
        expect(globalIds.has(e.id)).toBe(false);
      }
    }
  });

  test('empty country returns empty', () => {
    const local = getCuratedLocalFromPool(all, "XX", global);
    for (const type of CURATION_SECTION_ORDER) {
      expect(local[type]?.length ?? 0).toBe(0);
    }
  });

  test('deterministic', () => {
    const a = getCuratedLocalFromPool(all, "AR", global);
    const b = getCuratedLocalFromPool(all, "AR", global);
    for (const type of CURATION_SECTION_ORDER) {
      expect((a[type] ?? []).map((e) => e.id)).toEqual((b[type] ?? []).map((e) => e.id));
    }
  });

  test('all entities still accessible via getAllAtlasEntities (not removed)', () => {
    const allIds = new Set(all.map((e) => e.id));
    const local = getCuratedLocalFromPool(all, "AR", global);
    // Verify that curated entities exist in the full dataset
    for (const type of CURATION_SECTION_ORDER) {
      for (const e of local[type] ?? []) {
        expect(allIds.has(e.id)).toBe(true);
      }
    }
  });
});

describe('FEATURED_COUNTRY_ISOS', () => {
  test('contains the 7 expected Latin American + Spanish countries', () => {
    expect(FEATURED_COUNTRY_ISOS).toEqual(["AR", "MX", "ES", "CL", "CO", "UY", "PE"]);
  });
});
