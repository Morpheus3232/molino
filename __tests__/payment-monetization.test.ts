/**
 * Monetization infra: hardened Zod payment validation + server-side isPremium.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  paymentIdentitySchema,
  birthDateSchema,
  mpCurrencySchema,
  mpPaymentStatusSchema,
} from '@/lib/validation/payments';

describe('payment Zod validation', () => {
  test('accepts a valid birthDate', () => {
    expect(birthDateSchema.safeParse('1990-03-15').success).toBe(true);
  });

  test('rejects a future birthDate', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const y = future.getFullYear();
    const m = String(future.getMonth() + 1).padStart(2, '0');
    const d = String(future.getDate()).padStart(2, '0');
    expect(birthDateSchema.safeParse(`${y}-${m}-${d}`).success).toBe(false);
  });

  test('rejects malformed birthDate', () => {
    expect(birthDateSchema.safeParse('1990/03/15').success).toBe(false);
    expect(birthDateSchema.safeParse('15-03-1990').success).toBe(false);
  });

  test('rejects an invalid year (before 1900)', () => {
    expect(birthDateSchema.safeParse('1899-12-31').success).toBe(false);
  });

  test('paymentIdentitySchema requires a valid birthDate and defaults name', () => {
    const ok = paymentIdentitySchema.safeParse({ birthDate: '1990-03-15' });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.name).toBe('');

    const bad = paymentIdentitySchema.safeParse({ birthDate: 'not-a-date' });
    expect(bad.success).toBe(false);
  });

  test('mpCurrencySchema only accepts USD and ARS', () => {
    expect(mpCurrencySchema.safeParse('USD').success).toBe(true);
    expect(mpCurrencySchema.safeParse('ARS').success).toBe(true);
    expect(mpCurrencySchema.safeParse('EUR').success).toBe(false);
  });

  test('mpPaymentStatusSchema only accepts known statuses', () => {
    expect(mpPaymentStatusSchema.safeParse('approved').success).toBe(true);
    expect(mpPaymentStatusSchema.safeParse('rejected').success).toBe(true);
    expect(mpPaymentStatusSchema.safeParse('weird_status').success).toBe(false);
  });
});

describe('server-side isPremium', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('isPremium returns false when called from a client-like environment', async () => {
    // In jsdom (the test environment), typeof window !== 'undefined', so the
    // guard must short-circuit without importing KV.
    const { isPremium } = await import('@/lib/premium');
    expect(await isPremium('some-hash')).toBe(false);
  });
});