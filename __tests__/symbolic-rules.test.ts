import { describe, it, expect } from 'vitest';
import {
  getDayRule,
  getZodiacArchetype,
  isYearOne,
  getYearInterpretation,
  sumDigits,
  getNumberLossPrevention,
  getZodiacPowerPath,
  getZodiacArchetypalTrait,
  DAY_RULES,
  ZODIAC_ARCHETYPES,
  YEAR_2026,
  NUMBER_SYMBOLISM,
  PRICE_RECOMMENDATION,
  ENEMY_YEAR_GUIDANCE,
  NUMBER_LOSS_PREVENTION,
  ZODIAC_POWER_PATHS,
  ZODIAC_ARCHETYPAL_TRAITS,
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

describe('NUMBER_LOSS_PREVENTION', () => {
  it('has all numbers 1-9', () => {
    for (let i = 1; i <= 9; i++) {
      expect(NUMBER_LOSS_PREVENTION[i]).toBeDefined();
      expect(NUMBER_LOSS_PREVENTION[i].number).toBe(i);
    }
  });

  it('has master numbers 11, 22, 33', () => {
    expect(NUMBER_LOSS_PREVENTION[11]).toBeDefined();
    expect(NUMBER_LOSS_PREVENTION[22]).toBeDefined();
    expect(NUMBER_LOSS_PREVENTION[33]).toBeDefined();
  });

  it('1 should not lose enfoque', () => {
    expect(NUMBER_LOSS_PREVENTION[1].asset).toBe('enfoque');
  });

  it('11 should not lose intuición', () => {
    expect(NUMBER_LOSS_PREVENTION[11].asset).toBe('intuición');
  });

  it('33 should not lose influencia', () => {
    expect(NUMBER_LOSS_PREVENTION[33].asset).toBe('influencia');
  });
});

describe('getNumberLossPrevention', () => {
  it('returns prevention for known number', () => {
    const result = getNumberLossPrevention(7);
    expect(result).not.toBeNull();
    expect(result!.asset).toBe('foco');
  });

  it('returns null for unknown number', () => {
    expect(getNumberLossPrevention(42)).toBeNull();
  });
});

describe('ZODIAC_POWER_PATHS', () => {
  it('has all 12 animals', () => {
    expect(Object.keys(ZODIAC_POWER_PATHS)).toHaveLength(12);
  });

  it('Gato uses mental games', () => {
    expect(ZODIAC_POWER_PATHS['Gato'].powerPath).toContain('juegos mentales');
  });

  it('Rata uses powerful friends', () => {
    expect(ZODIAC_POWER_PATHS['Rata'].powerPath).toContain('amigos poderosos');
  });

  it('Tigre uses force', () => {
    expect(ZODIAC_POWER_PATHS['Tigre'].powerPath).toContain('fuerza');
  });

  it('all animals have a powerPath', () => {
    for (const [animal, data] of Object.entries(ZODIAC_POWER_PATHS)) {
      expect(data.animal).toBe(animal);
      expect(data.powerPath.length).toBeGreaterThan(0);
    }
  });
});

describe('getZodiacPowerPath', () => {
  it('returns power path for known animal', () => {
    const result = getZodiacPowerPath('Gato');
    expect(result).not.toBeNull();
    expect(result!.powerPath).toContain('juegos mentales');
  });

  it('returns null for unknown animal', () => {
    expect(getZodiacPowerPath('Unicornio')).toBeNull();
  });
});

describe('ZODIAC_ARCHETYPAL_TRAITS', () => {
  it('has all 12 animals', () => {
    expect(Object.keys(ZODIAC_ARCHETYPAL_TRAITS)).toHaveLength(12);
  });

  it('Gato is el fisiólogo', () => {
    expect(ZODIAC_ARCHETYPAL_TRAITS['Gato'].trait).toBe('el fisiólogo');
  });

  it('Mono is el más inteligente', () => {
    expect(ZODIAC_ARCHETYPAL_TRAITS['Mono'].trait).toBe('el más inteligente');
  });

  it('Dragón is el líder', () => {
    expect(ZODIAC_ARCHETYPAL_TRAITS['Dragón'].trait).toBe('el líder');
  });

  it('some animals have null trait (prepared but not invented)', () => {
    expect(ZODIAC_ARCHETYPAL_TRAITS['Buey'].trait).toBeNull();
    expect(ZODIAC_ARCHETYPAL_TRAITS['Perro'].trait).toBeNull();
    expect(ZODIAC_ARCHETYPAL_TRAITS['Cerdo'].trait).toBeNull();
  });

  it('all entries have correct animal key', () => {
    for (const [animal, data] of Object.entries(ZODIAC_ARCHETYPAL_TRAITS)) {
      expect(data.animal).toBe(animal);
    }
  });
});

describe('getZodiacArchetypalTrait', () => {
  it('returns trait for known animal', () => {
    const result = getZodiacArchetypalTrait('Gato');
    expect(result).not.toBeNull();
    expect(result!.trait).toBe('el fisiólogo');
  });

  it('returns null trait for animal without one', () => {
    const result = getZodiacArchetypalTrait('Buey');
    expect(result).not.toBeNull();
    expect(result!.trait).toBeNull();
  });

  it('returns null for unknown animal', () => {
    expect(getZodiacArchetypalTrait('Unicornio')).toBeNull();
  });
});
