import { describe, it, expect } from 'vitest';
import { calculateLuckyNumber } from '@/lib/calculations';

describe('calculateLuckyNumber', () => {
  it('18/04/1990 → 49', () => {
    expect(calculateLuckyNumber(4, 1990)).toBe(49);
  });

  it('25/07/1980 → 78', () => {
    expect(calculateLuckyNumber(7, 1980)).toBe(78);
  });

  it('10/12/2000 → 12', () => {
    expect(calculateLuckyNumber(12, 2000)).toBe(12);
  });

  it('03/09/2024 → 94', () => {
    expect(calculateLuckyNumber(9, 2024)).toBe(94);
  });

  it('05/10/1980 → 18', () => {
    expect(calculateLuckyNumber(10, 1980)).toBe(18);
  });

  it('22/01/2000 → 12', () => {
    expect(calculateLuckyNumber(1, 2000)).toBe(12);
  });

  it('15/08/1970 → 87', () => {
    expect(calculateLuckyNumber(8, 1970)).toBe(87);
  });

  it('month 12 → first digit 1', () => {
    expect(calculateLuckyNumber(12, 1999)).toBe(19);
  });

  it('month 01 → first digit 0, fallback to 1', () => {
    expect(calculateLuckyNumber(1, 1999)).toBe(19);
  });

  it('year 2010 → last non-zero digit is 1', () => {
    expect(calculateLuckyNumber(6, 2010)).toBe(61);
  });

  it('year 200 → last non-zero digit is 2', () => {
    expect(calculateLuckyNumber(3, 200)).toBe(32);
  });

  it('year 1000 → last non-zero digit is 1', () => {
    expect(calculateLuckyNumber(11, 1000)).toBe(11);
  });

  it('does not reduce to single digit', () => {
    const result = calculateLuckyNumber(4, 1990);
    expect(result).toBe(49);
    expect(result).not.toBe(13);
    expect(result).not.toBe(4);
  });
});
