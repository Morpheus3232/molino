/**
 * Route-level Mercado Pago tests — simulates MP's SDK responses (no real
 * network calls, no LIVE transactions), for /api/mp/* which previously only
 * had lib-level unit tests (payment-security.test.ts), not route-level ones.
 */
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { createHmac } from 'crypto';
import { NextRequest } from 'next/server';

vi.stubEnv('MP_ACCESS_TOKEN', 'test-access-token');
vi.stubEnv('MP_WEBHOOK_SECRET', 'test-webhook-secret');
// coupon/route.ts reads process.env.PREMIUM_COUPON at module scope (`const
// COUPON_CODE = ...`), evaluated when the module is first imported — ES
// import hoisting runs that before a plain vi.stubEnv() call further down
// this file would take effect, so it needs vi.hoisted() specifically.
vi.hoisted(() => {
  process.env.PREMIUM_COUPON = 'TEST_COUPON';
});
// getBaseUrl() now returns the hardcoded SITE_URL (lib/seo.ts) — no env var
// to stub anymore.

const { kvStore } = vi.hoisted(() => ({ kvStore: new Map<string, unknown>() }));

vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(async (key: string, value: unknown, opts?: { nx?: boolean }) => {
      if (opts?.nx && kvStore.has(key)) return null;
      kvStore.set(key, value);
      return 'OK';
    }),
    get: vi.fn(async (key: string) => kvStore.get(key) ?? null),
    del: vi.fn(async (key: string) => {
      kvStore.delete(key);
      return 1;
    }),
  },
}));

const { mpState } = vi.hoisted(() => ({
  mpState: {
    paymentResponse: null as Record<string, unknown> | null,
    preferenceResponse: null as Record<string, unknown> | null,
  },
}));

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn(),
  // function, no arrow — Preference/Payment se instancian con `new`.
  Preference: vi.fn().mockImplementation(function Preference() {
    return { create: vi.fn(async () => mpState.preferenceResponse) };
  }),
  Payment: vi.fn().mockImplementation(function Payment() {
    return {
      get: vi.fn(async () => mpState.paymentResponse),
      create: vi.fn(async () => mpState.paymentResponse),
    };
  }),
}));

import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess, hasPremiumAccess, verifyPremiumToken, storeGiftCode, getGiftCode, redeemGiftCode } from '@/lib/kv';
import { POST as preferenceRoute } from '@/app/api/mp/preference/route';
import { POST as webhookRoute } from '@/app/api/mp/webhook/route';
import { POST as verifyRoute } from '@/app/api/mp/verify/route';
import { POST as recoverRoute } from '@/app/api/mp/recover/route';
import { POST as checkRoute } from '@/app/api/mp/check/route';
import { POST as couponRoute } from '@/app/api/mp/coupon/route';
import { POST as giftCreateRoute } from '@/app/api/gift/create/route';
import { GET as giftValidRoute } from '@/app/api/gift/[codigo]/route';
import { GET as giftStatusRoute } from '@/app/api/gift/[codigo]/status/route';
import { POST as giftRedeemRoute } from '@/app/api/gift/[codigo]/redeem/route';

const NAME = 'Juan Perez';
const BIRTH = '1990-01-15';
const HASH = hashProfile(NAME, BIRTH);
const PAYMENT_ID = '123456789';

function approvedPayment(overrides: Record<string, unknown> = {}) {
  return {
    status: 'approved',
    status_detail: 'accredited',
    payment_method_id: 'visa',
    transaction_amount: 8,
    currency_id: 'USD',
    date_approved: new Date().toISOString(),
    metadata: { profile_hash: HASH, product: 'molino_premium' },
    external_reference: HASH,
    ...overrides,
  };
}

let requestSeq = 0;
function requestTo(url: string, body: unknown): NextRequest {
  requestSeq += 1;
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `198.51.100.${requestSeq % 254}` },
    body: JSON.stringify(body),
  });
}

/** Firma un webhook con el mismo HMAC que verifyWebhookSignature espera. */
function webhookRequest(paymentId: string, body: unknown = { type: 'payment', data: { id: paymentId } }) {
  const bodyStr = JSON.stringify(body);
  const ts = String(Math.floor(Date.now() / 1000));
  const requestId = `req-${paymentId}-${++requestSeq}`;
  const manifest = `id:${paymentId};request-id:${requestId};ts:${ts};`;
  const hash = createHmac('sha256', 'test-webhook-secret').update(manifest).digest('hex');
  const signature = `ts=${ts},v1=${hash}`;
  return new NextRequest('http://localhost/api/mp/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-signature': signature,
      'x-request-id': requestId,
      'x-forwarded-for': `198.51.100.${requestSeq % 254}`,
    },
    body: bodyStr,
  });
}

beforeEach(() => {
  kvStore.clear();
  vi.clearAllMocks();
  mpState.paymentResponse = null;
  mpState.preferenceResponse = null;
});

describe('Mercado Pago preference route', () => {
  test('creates a preference', async () => {
    mpState.preferenceResponse = { id: 'pref-123', init_point: 'https://mp.example/checkout', sandbox_init_point: 'https://mp.example/sandbox' };

    const res = await preferenceRoute(requestTo('http://localhost/api/mp/preference', { name: NAME, birthDate: BIRTH, currencyId: 'USD' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.preferenceId).toBe('pref-123');
    expect(data.checkoutUrl).toBe('https://mp.example/checkout'); // token no empieza con TEST- → producción → init_point
  });

  test('reuses a pending preference within the TTL (evita doble cobro por doble click)', async () => {
    mpState.preferenceResponse = { id: 'pref-123', init_point: 'https://mp.example/checkout', sandbox_init_point: 'https://mp.example/sandbox' };

    const res1 = await preferenceRoute(requestTo('http://localhost/api/mp/preference', { name: NAME, birthDate: BIRTH, currencyId: 'USD' }));
    const data1 = await res1.json();

    // Cambiamos la respuesta simulada del SDK — si el endpoint volviera a
    // crear una preference, data2 sería distinto de data1.
    mpState.preferenceResponse = { id: 'pref-OTHER', init_point: 'https://mp.example/other', sandbox_init_point: 'https://mp.example/other-sandbox' };

    const res2 = await preferenceRoute(requestTo('http://localhost/api/mp/preference', { name: NAME, birthDate: BIRTH, currencyId: 'USD' }));
    const data2 = await res2.json();

    expect(data2.preferenceId).toBe(data1.preferenceId);
  });

  test('400 cuando falta birthDate', async () => {
    const res = await preferenceRoute(requestTo('http://localhost/api/mp/preference', { name: NAME }));
    expect(res.status).toBe(400);
  });
});

describe('Mercado Pago webhook', () => {
  test('firma inválida → 401, no otorga acceso', async () => {
    mpState.paymentResponse = approvedPayment();
    const req = new NextRequest('http://localhost/api/mp/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-signature': 'ts=1,v1=deadbeef', 'x-request-id': 'req-1' },
      body: JSON.stringify({ type: 'payment', data: { id: PAYMENT_ID } }),
    });

    const res = await webhookRoute(req);

    expect(res.status).toBe(401);
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });

  test('pago aprobado → otorga Premium access', async () => {
    mpState.paymentResponse = approvedPayment();

    const res = await webhookRoute(webhookRequest(PAYMENT_ID));

    expect(res.status).toBe(200);
    expect(await hasPremiumAccess(HASH)).toBe(true);
  });

  test('webhook duplicado (mismo payment_id dos veces) → idempotente, acceso se mantiene otorgado', async () => {
    mpState.paymentResponse = approvedPayment();

    const first = await webhookRoute(webhookRequest(PAYMENT_ID));
    const second = await webhookRoute(webhookRequest(PAYMENT_ID));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await hasPremiumAccess(HASH)).toBe(true);
  });

  test('pago rechazado → NO otorga acceso', async () => {
    mpState.paymentResponse = approvedPayment({ status: 'rejected' });

    const res = await webhookRoute(webhookRequest(PAYMENT_ID));
    const data = await res.json();

    expect(data.valid).toBe(false);
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });

  test('pago pendiente → NO otorga acceso', async () => {
    mpState.paymentResponse = approvedPayment({ status: 'pending' });

    const res = await webhookRoute(webhookRequest(PAYMENT_ID));
    const data = await res.json();

    expect(data.valid).toBe(false);
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });

  test('monto/moneda/producto inválido en un pago "aprobado" → NO otorga acceso (metadata falsificada)', async () => {
    mpState.paymentResponse = approvedPayment({ transaction_amount: 1 });

    const res = await webhookRoute(webhookRequest(PAYMENT_ID));
    const data = await res.json();

    expect(data.valid).toBe(false);
    expect(String(data.reason)).toContain('Amount mismatch');
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });

  test('reembolso/contracargo → revoca el acceso', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);
    expect(await hasPremiumAccess(HASH)).toBe(true);

    mpState.paymentResponse = approvedPayment({ status: 'refunded' });
    const res = await webhookRoute(webhookRequest(PAYMENT_ID));
    const data = await res.json();

    expect(data.revoked).toBe(true);
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });

  test('sin payment id en el body → se acusa recibo sin romper (200)', async () => {
    const req = new NextRequest('http://localhost/api/mp/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test' }),
    });

    const res = await webhookRoute(req);
    expect(res.status).toBe(200);
  });
});

describe('Mercado Pago verify route (retorno del checkout)', () => {
  test('verifica un pago aprobado y otorga acceso', async () => {
    mpState.paymentResponse = approvedPayment();

    const res = await verifyRoute(requestTo('http://localhost/api/mp/verify', { paymentId: PAYMENT_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(true);
    expect(typeof data.premiumToken).toBe('string');
    expect(await hasPremiumAccess(HASH)).toBe(true);
  });

  test('rechaza un pago no aprobado', async () => {
    mpState.paymentResponse = approvedPayment({ status: 'rejected' });

    const res = await verifyRoute(requestTo('http://localhost/api/mp/verify', { paymentId: PAYMENT_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(false);
    expect(await hasPremiumAccess(HASH)).toBe(false);
  });
});

describe('Mercado Pago recover route', () => {
  test('recupera desde KV cuando el pago ya fue procesado', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);

    const res = await recoverRoute(requestTo('http://localhost/api/mp/recover', { paymentId: PAYMENT_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(true);
    expect(data.source).toBe('kv');
  });

  test('recupera vía API de MP cuando no está en KV', async () => {
    mpState.paymentResponse = approvedPayment();

    const res = await recoverRoute(requestTo('http://localhost/api/mp/recover', { paymentId: PAYMENT_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(true);
    expect(data.source).toBe('mp-api');
  });

  test('rechaza un pago inválido', async () => {
    mpState.paymentResponse = approvedPayment({ status: 'rejected' });

    const res = await recoverRoute(requestTo('http://localhost/api/mp/recover', { paymentId: 'nope', name: NAME, birthDate: BIRTH }));
    expect(res.status).toBe(400);
  });
});

describe('Mercado Pago check route (Premium access — única fuente de verdad)', () => {
  test('refleja hasPremiumAccess: false antes de pagar, true después de otorgar', async () => {
    const before = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    expect((await before.json()).premium).toBe(false);

    await grantPremiumAccess(HASH, PAYMENT_ID);

    const after = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    expect((await after.json()).premium).toBe(true);
  });

  // Regression: a returning visit can be premium (hasPremiumAccess) yet have
  // no valid device-bound token (cleared localStorage, new browser) — the
  // gate showed "unlocked" while every AI call 403'd underneath it. The
  // check route must re-issue a token whenever it confirms premium.
  test('reemite premiumToken cada vez que confirma acceso, no solo la primera vez', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);

    const res = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.premium).toBe(true);
    expect(typeof data.premiumToken).toBe('string');
    expect(data.premiumToken.length).toBeGreaterThan(0);
  });

  test('no devuelve premiumToken cuando no hay acceso', async () => {
    const res = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.premium).toBe(false);
    expect(data.premiumToken).toBeUndefined();
  });
});

describe('Regresión: /api/mp/check no debe rotar un token ya emitido', () => {
  test('sin token existente, /api/mp/check crea uno', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);

    const res = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(typeof data.premiumToken).toBe('string');
    expect(await verifyPremiumToken(HASH, data.premiumToken)).toBe(true);
  });

  test('con un token existente, /api/mp/check NO lo rota', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);
    const first = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const firstToken = (await first.json()).premiumToken;

    const second = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const secondToken = (await second.json()).premiumToken;

    expect(secondToken).toBe(firstToken);
  });

  test('dos checks consecutivos devuelven el mismo token', async () => {
    await grantPremiumAccess(HASH, PAYMENT_ID);
    const first = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH })).then((r) => r.json());
    const second = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH })).then((r) => r.json());
    expect(first.premiumToken).toBe(second.premiumToken);
  });

  // El bug real reportado: canjear ABDUZCAN entrega un token, pero el mismo
  // page load dispara /api/mp/check desde otro componente (usePremiumAccess,
  // PremiumGate.checkServer/poll) — ese segundo llamado rotaba el token y
  // dejaba inválido el que el frontend acababa de guardar.
  test('el token emitido por /api/mp/coupon sigue siendo válido después de un /api/mp/check posterior', async () => {
    const coupon = await couponRoute(
      requestTo('http://localhost/api/mp/coupon', { coupon: 'TEST_COUPON', name: NAME, birthDate: BIRTH })
    );
    const { premiumToken: couponToken } = await coupon.json();
    expect(await verifyPremiumToken(HASH, couponToken)).toBe(true);

    // Simula el segundo chequeo independiente que ocurre en la misma carga de página.
    const check = await checkRoute(requestTo('http://localhost/api/mp/check', { name: NAME, birthDate: BIRTH }));
    const { premiumToken: checkToken } = await check.json();

    expect(checkToken).toBe(couponToken);
    expect(await verifyPremiumToken(HASH, couponToken)).toBe(true);
  });
});

// ── Gifting (regalar Molino) ────────────────────────────────────────────
//
// El comprador no conoce la fecha de nacimiento del destinatario, así que
// la preferencia de un regalo se crea con gift_code en vez de profile_hash
// (createGiftPreference, lib/mercadopago.ts). El webhook deja el código
// listo para canjear sin otorgar acceso a nadie; grantPremiumAccess recién
// se llama en /api/gift/[codigo]/redeem, cuando el destinatario aporta su
// propia fecha.

function getRequestTo(url: string): NextRequest {
  requestSeq += 1;
  return new NextRequest(url, {
    method: 'GET',
    headers: { 'x-forwarded-for': `198.51.100.${requestSeq % 254}` },
  });
}

const GIFT_CODE = 'MOLINO-TEST-CODE';
const GIFT_PAYMENT_ID = '999888777';

describe('lib/kv.ts — storeGiftCode / getGiftCode / redeemGiftCode', () => {
  test('un código recién guardado existe y no está canjeado', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    const stored = await getGiftCode(GIFT_CODE);
    expect(stored).not.toBeNull();
    expect(stored?.redeemed).toBe(false);
    expect(stored?.paymentId).toBe(GIFT_PAYMENT_ID);
  });

  test('canjear un código válido devuelve success y el paymentId original', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    const result = await redeemGiftCode(GIFT_CODE, HASH);
    expect(result.success).toBe(true);
    if (result.success) expect(result.paymentId).toBe(GIFT_PAYMENT_ID);

    const stored = await getGiftCode(GIFT_CODE);
    expect(stored?.redeemed).toBe(true);
    expect(stored?.redeemedProfileHash).toBe(HASH);
  });

  test('canjear el mismo código dos veces falla la segunda vez con already_redeemed', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    await redeemGiftCode(GIFT_CODE, HASH);

    const second = await redeemGiftCode(GIFT_CODE, 'otro-hash-distinto');
    expect(second.success).toBe(false);
    if (!second.success) expect(second.reason).toBe('already_redeemed');
  });

  test('canjear un código inexistente falla con not_found', async () => {
    const result = await redeemGiftCode('MOLINO-NUNCA-EXISTIO', HASH);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe('not_found');
  });
});

describe('Webhook — rama gift_code', () => {
  test('pago aprobado con gift_code (sin profile_hash) deja el código listo, sin otorgar premium a nadie', async () => {
    mpState.paymentResponse = approvedPayment({ metadata: { gift_code: GIFT_CODE, product: 'molino_premium' }, external_reference: GIFT_CODE });

    const res = await webhookRoute(webhookRequest(GIFT_PAYMENT_ID));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.gift).toBe(true);

    const stored = await getGiftCode(GIFT_CODE);
    expect(stored?.redeemed).toBe(false);
    expect(await hasPremiumAccess(HASH)).toBe(false); // nadie recibe acceso todavía
  });

  test('el flujo normal (profile_hash, sin gift_code) sigue funcionando sin cambios', async () => {
    mpState.paymentResponse = approvedPayment();
    const res = await webhookRoute(webhookRequest(PAYMENT_ID));
    expect(res.status).toBe(200);
    expect(await hasPremiumAccess(HASH)).toBe(true);
  });
});

describe('API routes de gifting', () => {
  test('POST /api/gift/create genera un gift_code y una preferencia', async () => {
    mpState.preferenceResponse = { id: 'pref-gift-1', init_point: 'https://mp.example/gift-checkout', sandbox_init_point: 'https://mp.example/gift-sandbox' };

    const res = await giftCreateRoute(requestTo('http://localhost/api/gift/create', {}));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.giftCode).toMatch(/^MOLINO-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(data.checkoutUrl).toBe('https://mp.example/gift-checkout');
  });

  test('GET /api/gift/[codigo] — válido cuando existe y no fue canjeado', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    const res = await giftValidRoute(getRequestTo(`http://localhost/api/gift/${GIFT_CODE}`), { params: Promise.resolve({ codigo: GIFT_CODE }) });
    const data = await res.json();
    expect(data.valid).toBe(true);
  });

  test('GET /api/gift/[codigo] — inválido cuando no existe', async () => {
    const res = await giftValidRoute(getRequestTo('http://localhost/api/gift/NOPE'), { params: Promise.resolve({ codigo: 'NOPE' }) });
    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.reason).toBe('not_found');
  });

  test('POST /api/gift/[codigo]/redeem otorga premium al hash calculado con la fecha del destinatario', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);

    const res = await giftRedeemRoute(
      requestTo(`http://localhost/api/gift/${GIFT_CODE}/redeem`, { name: NAME, birthDate: BIRTH }),
      { params: Promise.resolve({ codigo: GIFT_CODE }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.redeemed).toBe(true);
    expect(typeof data.premiumToken).toBe('string');
    expect(await hasPremiumAccess(HASH)).toBe(true);
  });

  test('POST /api/gift/[codigo]/redeem con código ya canjeado devuelve 400', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    await giftRedeemRoute(requestTo(`http://localhost/api/gift/${GIFT_CODE}/redeem`, { name: NAME, birthDate: BIRTH }), { params: Promise.resolve({ codigo: GIFT_CODE }) });

    const second = await giftRedeemRoute(
      requestTo(`http://localhost/api/gift/${GIFT_CODE}/redeem`, { name: 'Otra Persona', birthDate: '1985-03-20' }),
      { params: Promise.resolve({ codigo: GIFT_CODE }) }
    );
    expect(second.status).toBe(400);
    const data = await second.json();
    expect(data.reason).toBe('already_redeemed');
  });

  test('GET /api/gift/[codigo]/status refleja el estado de canje para el comprador, sin exponer el hash del destinatario', async () => {
    await storeGiftCode(GIFT_CODE, GIFT_PAYMENT_ID);
    const before = await giftStatusRoute(getRequestTo(`http://localhost/api/gift/${GIFT_CODE}/status`), { params: Promise.resolve({ codigo: GIFT_CODE }) });
    expect((await before.json()).redeemed).toBe(false);

    await redeemGiftCode(GIFT_CODE, HASH);

    const after = await giftStatusRoute(getRequestTo(`http://localhost/api/gift/${GIFT_CODE}/status`), { params: Promise.resolve({ codigo: GIFT_CODE }) });
    const afterData = await after.json();
    expect(afterData.redeemed).toBe(true);
    expect(afterData.redeemedProfileHash).toBeUndefined();
  });
});
