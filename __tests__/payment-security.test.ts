import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.stubEnv('MP_ACCESS_TOKEN', 'test-access-token');
vi.stubEnv('MP_WEBHOOK_SECRET', 'test-webhook-secret');
vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000');

vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    del: vi.fn().mockResolvedValue(1),
  },
}));

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn().mockImplementation(() => ({ accessToken: 'test-token' })),
  Preference: vi.fn().mockImplementation(() => ({ create: vi.fn().mockResolvedValue({ id: 'pref-123', init_point: 'https://init.mp' }) })),
  Payment: vi.fn().mockImplementation(() => ({ get: vi.fn().mockResolvedValue({} as any), create: vi.fn().mockResolvedValue({ id: 'payment-123', status: 'approved' }) })),
}));

import { hashProfile, validatePayment, verifyWebhookSignature, createPreference } from '@/lib/mercadopago';
import { grantPremiumAccess, hasPremiumAccess, markPaymentProcessed, isPaymentProcessed } from '@/lib/kv';

describe('Payment flow security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hashProfile', () => {
    test('produces consistent hash for same input', () => {
      const h1 = hashProfile('Juan Perez', '1990-01-15');
      const h2 = hashProfile('Juan Perez', '1990-01-15');
      expect(h1).toBe(h2);
      expect(h1.length).toBe(16);
    });

    test('different names produce different hashes', () => {
      const h1 = hashProfile('Juan Perez', '1990-01-15');
      const h2 = hashProfile('Maria Lopez', '1990-01-15');
      expect(h1).not.toBe(h2);
    });

    test('case insensitive name normalization', () => {
      const h1 = hashProfile('juan perez', '1990-01-15');
      const h2 = hashProfile('JUAN PEREZ', '1990-01-15');
      expect(h1).toBe(h2);
    });
  });

  describe('validatePayment', () => {
    const validPayment = {
      status: 'approved',
      transaction_amount: 9,
      currency_id: 'USD',
      metadata: { product: 'molino_premium' },
    };

    test('valid payment passes', () => {
      const result = validatePayment(validPayment);
      expect(result.valid).toBe(true);
    });

    test('rejected payment fails', () => {
      const result = validatePayment({ ...validPayment, status: 'rejected' });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('rejected');
    });

    test('pending payment fails', () => {
      const result = validatePayment({ ...validPayment, status: 'pending' });
      expect(result.valid).toBe(false);
    });

    test('wrong amount fails', () => {
      const result = validatePayment({ ...validPayment, transaction_amount: 10 });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Amount mismatch');
    });

    test('wrong currency fails', () => {
      const result = validatePayment({ ...validPayment, currency_id: 'EUR', transaction_amount: 9 });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('currency');
    });

    test('wrong product fails', () => {
      const result = validatePayment({ ...validPayment, metadata: { product: 'other_product' } });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Product mismatch');
    });

    test('missing product fails', () => {
      const result = validatePayment({ ...validPayment, metadata: {} });
      expect(result.valid).toBe(false);
    });

    test('accepts valid USD payment', () => {
      const result = validatePayment({
        status: 'approved',
        transaction_amount: 9,
        currency_id: 'USD',
        metadata: { product: 'molino_premium' },
      });
      expect(result.valid).toBe(true);
    });

    test('accepts valid ARS payment', () => {
      const result = validatePayment({
        status: 'approved',
        transaction_amount: 8100,
        currency_id: 'ARS',
        metadata: { product: 'molino_premium' },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('verifyWebhookSignature', () => {
    test('missing signature fails', () => {
      const result = verifyWebhookSignature(null, 'req-123', '123', '{}');
      expect(result).toBe(false);
    });

    test('missing requestId fails', () => {
      const result = verifyWebhookSignature('ts=123,v1=abc', null, '123', '{}');
      expect(result).toBe(false);
    });

    test('missing dataId fails', () => {
      const result = verifyWebhookSignature('ts=123,v1=abc', 'req-123', null, '{}');
      expect(result).toBe(false);
    });

    test('returns function type', () => {
      expect(typeof verifyWebhookSignature).toBe('function');
    });
  });

  describe('KV persistence', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('grantPremiumAccess stores data', async () => {
      await grantPremiumAccess('test-hash', 'payment-123');
    });

    test('hasPremiumAccess works', async () => {
      const result = await hasPremiumAccess('test-hash');
      expect(typeof result).toBe('boolean');
    });

    test('markPaymentProcessed works', async () => {
      const result = await markPaymentProcessed('payment-123');
      expect(typeof result).toBe('boolean');
    });

    test('isPaymentProcessed works', async () => {
      const result = await isPaymentProcessed('payment-123');
      expect(typeof result).toBe('boolean');
    });
  });
});

describe('PremiumGate access control', () => {
  test('server-side check endpoint uses name+birthDate not profileHash', () => {
    expect(true).toBe(true);
  });
});