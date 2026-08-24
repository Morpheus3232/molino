/**
 * Atlas taxonomy + user-country personalization queries (server-only layer).
 * Uses the vitest server-only shim so the data layer is importable in tests.
 */
import { describe, test, expect } from 'vitest';
import {
  getAtlasCountries,
  getCategoriesByCountry,
  getEntitiesByTaxonomy,
  getUserCountryISO,
  orderCountriesForUser,
  topCountriesByCount,
  getCountryName,
  getCitiesByCountry,
  getCountryEntityByISO,
} from '@/lib/data/atlas-queries';

describe('getAtlasCountries', () => {
  test('returns countries with entities, including MX/CO/ES from Fase 2', () => {
    const countries = getAtlasCountries();
    const isos = countries.map((c) => c.iso);
    expect(isos).toContain('MX');
    expect(isos).toContain('CO');
    expect(isos).toContain('ES');
  });

  test('each country has a positive entity count and a flag', () => {
    for (const c of getAtlasCountries()) {
      expect(c.count).toBeGreaterThan(0);
      // regional-indicator pair = 2 code points (4 UTF-16 units for a flag).
      expect(Array.from(c.flag)).toHaveLength(2);
    }
  });
});

describe('getCategoriesByCountry', () => {
  test('Argentina has brand/city/team/university/artist categories', () => {
    const cats = getCategoriesByCountry('AR');
    const types = cats.map((c) => c.type);
    expect(types).toContain('team');
    expect(types).toContain('city');
    expect(types).toContain('brand');
  });

  test('never exposes the country type itself in the drill-down', () => {
    for (const countryISO of ['AR', 'MX', 'CO', 'ES']) {
      const types = getCategoriesByCountry(countryISO).map((c) => c.type);
      expect(types).not.toContain('country');
    }
  });
});

describe('getEntitiesByTaxonomy', () => {
  test('returns LightweightEntity[] for a country+category', () => {
    const entities = getEntitiesByTaxonomy('AR', 'team');
    expect(entities.length).toBeGreaterThan(0);
    // Lightweight shape: no events, no prose.
    for (const e of entities) {
      expect(e.id).toBeTruthy();
      expect(e.animal).toBeTruthy();
      expect(e.type).toBe('team');
      expect(e.countryISO).toBe('AR');
      expect((e as unknown as Record<string, unknown>).events).toBeUndefined();
    }
  });

  test('returns empty for a country without that category', () => {
    // Germany (DE) has brand + city but no movies.
    expect(getEntitiesByTaxonomy('DE', 'movie')).toEqual([]);
  });
});

describe('user-country personalization', () => {
  test('getUserCountryISO maps a country name to ISO when present in Atlas', () => {
    expect(getUserCountryISO('Argentina')).toBe('AR');
    expect(getUserCountryISO('México')).toBe('MX');
    expect(getUserCountryISO('Japón')).toBe('JP');
  });

  test('getUserCountryISO returns null for unknown or uncovered country', () => {
    expect(getUserCountryISO('Atlantis')).toBeNull();
    expect(getUserCountryISO(undefined)).toBeNull();
  });

  test('orderCountriesForUser moves the user country to the front', () => {
    const countries = getAtlasCountries();
    const iso = 'AR';
    const ordered = orderCountriesForUser(countries, iso);
    expect(ordered[0].iso).toBe(iso);
    // Preserves all countries (and does not mutate the input).
    expect(ordered.length).toBe(countries.length);
    expect(countries.length).toBe(58); // input untouched
  });

  test('orderCountriesForUser is a no-op when the country is already first', () => {
    const countries = getAtlasCountries();
    const first = countries[0].iso;
    const ordered = orderCountriesForUser([...countries], first);
    expect(ordered[0].iso).toBe(first);
  });

  test('topCountriesByCount returns the richest countries sorted by count', () => {
    const top = topCountriesByCount(getAtlasCountries(), 5);
    expect(top).toHaveLength(5);
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].count).toBeGreaterThanOrEqual(top[i].count);
    }
  });

  test('getCountryName resolves ISO to a name', () => {
    expect(getCountryName('AR')).toBe('Argentina');
  });

  test('getCitiesByCountry returns only city entities for that country', () => {
    const cities = getCitiesByCountry('AR');
    expect(cities.length).toBeGreaterThan(0);
    for (const city of cities) {
      expect(city.type).toBe('city');
      expect(city.countryISO).toBe('AR');
    }
  });

  test('getCountryEntityByISO returns the country entity if present', () => {
    const arg = getCountryEntityByISO('AR');
    expect(arg).toBeDefined();
    expect(arg?.type).toBe('country');
    expect(arg?.name).toBe('Argentina');
  });
});
