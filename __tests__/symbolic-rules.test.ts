import { describe, it, expect } from 'vitest';
import {
  getDayRule,
  getZodiacArchetype,
  isYearOne,
  getYearInterpretation,
  sumDigits,
  DAY_RULES,
  ZODIAC_ARCHETYPES,
  YEAR_2026,
  NUMBER_SYMBOLISM,
  PRICE_RECOMMENDATION,
  ENEMY_YEAR_GUIDANCE,
} from '@/lib/data/symbolic-rules';

describe('DAY_RULES', () => {
  it('day 1 has correct theme', () => {
    expect(DAY_RULES[1].theme).toBe('Iniciación');
    expect(DAY_RULES[1].favors).toContain('Empezar proyectos');
  });

  it('day 6 has correct theme', () => {
    expect(DAY_RULES[6].theme).toBe('Familia');
    expect(DAY_RULES[6].favors).toContain('Conexión familiar');
  });

  it('day 7 has correct theme', () => {
    expect(DAY_RULES[7].theme).toBe('Aprendizaje');
    expect(DAY_RULES[7].favors).toContain('Estudiar');
  });

  it('day 11 warns about travel', () => {
    expect(DAY_RULES[11].watchOut).toContain('Viajes importantes');
  });

  it('day 28 is associated with wealth', () => {
    expect(DAY_RULES[28].theme).toBe('Riqueza');
    expect(DAY_RULES[28].favors).toContain('Negocios');
  });
});

describe('getDayRule', () => {
  it('returns rule for known day', () => {
    expect(getDayRule(1)).not.toBeNull();
    expect(getDayRule(1)!.theme).toBe('Iniciación');
  });

  it('returns null for unknown day', () => {
    expect(getDayRule(15)).toBeNull();
  });
});

describe('ZODIAC_ARCHETYPES', () => {
  it('has all 12 signs', () => {
    expect(Object.keys(ZODIAC_ARCHETYPES)).toHaveLength(12);
  });

  it('Aries is El Pionero', () => {
    expect(ZODIAC_ARCHETYPES['Aries'].archetype).toBe('El Pionero');
    expect(ZODIAC_ARCHETYPES['Aries'].archetypeEn).toBe('The Pioneer');
  });

  it('Acuario is El Visionario', () => {
    expect(ZODIAC_ARCHETYPES['Acuario'].archetype).toBe('El Visionario');
    expect(ZODIAC_ARCHETYPES['Acuario'].archetypeEn).toBe('The Visionary');
  });

  it('Piscis is El Poeta', () => {
    expect(ZODIAC_ARCHETYPES['Piscis'].archetype).toBe('El Poeta');
  });
});

describe('getZodiacArchetype', () => {
  it('returns archetype for known sign', () => {
    const result = getZodiacArchetype('Leo');
    expect(result).not.toBeNull();
    expect(result!.archetype).toBe('La Estrella');
  });

  it('returns null for unknown sign', () => {
    expect(getZodiacArchetype('Desconocido')).toBeNull();
  });
});

describe('isYearOne', () => {
  it('2026 is a year 1', () => {
    expect(isYearOne(2026)).toBe(true);
  });

  it('2025 is not a year 1', () => {
    expect(isYearOne(2025)).toBe(false);
  });

  it('2017 is a year 1 (2+0+1+7=10→1)', () => {
    expect(isYearOne(2017)).toBe(true);
  });
});

describe('getYearInterpretation', () => {
  it('2026 returns year 1 interpretation', () => {
    const result = getYearInterpretation(2026);
    expect(result).not.toBeNull();
    expect(result!.reducedTo).toBe(1);
    expect(result!.theme).toBe('Iniciativa y acción');
  });

  it('other years return generic interpretation', () => {
    const result = getYearInterpretation(2025);
    expect(result).not.toBeNull();
    expect(result!.reducedTo).toBe(9);
  });
});

describe('YEAR_2026', () => {
  it('reduces to 1', () => {
    expect(YEAR_2026.reducedTo).toBe(1);
  });

  it('has interpretation', () => {
    expect(YEAR_2026.interpretation).toContain('año 1');
  });
});

describe('NUMBER_SYMBOLISM', () => {
  it('28 is the number of wealth', () => {
    expect(NUMBER_SYMBOLISM[28].meaning).toBe('Riqueza');
    expect(NUMBER_SYMBOLISM[28].domain).toBe('finanzas');
  });
});

describe('PRICE_RECOMMENDATION', () => {
  it('recommends prices that sum to 8', () => {
    expect(PRICE_RECOMMENDATION.rule).toContain('8');
  });
});

describe('ENEMY_YEAR_GUIDANCE', () => {
  it('has guidance text', () => {
    expect(ENEMY_YEAR_GUIDANCE.interpretation).toContain('resistencia');
    expect(ENEMY_YEAR_GUIDANCE.advice.length).toBeGreaterThan(0);
  });
});

describe('sumDigits', () => {
  it('reduces 2026 to 1', () => {
    expect(sumDigits(2026)).toBe(1);
  });

  it('reduces 1990 to 1', () => {
    expect(sumDigits(1990)).toBe(1);
  });

  it('single digit returns itself', () => {
    expect(sumDigits(5)).toBe(5);
  });
});
