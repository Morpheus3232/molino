import { vi, describe, test, expect, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

vi.stubEnv('PAYPAL_CLIENT_ID', 'test-client-id');
vi.stubEnv('PAYPAL_CLIENT_SECRET', 'test-client-secret');
vi.stubEnv('PAYPAL_ENVIRONMENT', 'sandbox');
vi.stubEnv('MP_WEBHOOK_SECRET', 'test-webhook-secret');
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

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn(),
  Preference: vi.fn(),
  Payment: vi.fn(),
}));

import { hashProfile } from '@/lib/mercadopago';
import { createOrder, captureOrder, getOrder, validateOrder, getAccessToken, resetAccessTokenCache } from '@/lib/paypal';
import { markPaymentProcessed, isPaymentProcessed, grantPremiumAccess } from '@/lib/kv';
import { POST as createOrderRoute } from '@/app/api/paypal/create-order/route';
import { POST as captureOrderRoute } from '@/app/api/paypal/capture-order/route';
import { POST as recoverRoute } from '@/app/api/paypal/recover/route';

const NAME = 'Juan Perez';
const BIRTH = '1990-01-15';
const HASH = hashProfile(NAME, BIRTH);
const ORDER_ID = 'ORD-8S00000000000000';

function completedOrder(customId = HASH, amount = '8.00', currency = 'USD', status = 'COMPLETED') {
  return {
    id: ORDER_ID,
    status,
    purchase_units: [
      {
        reference_id: 'molino_premium',
        custom_id: customId,
        amount: { currency_code: currency, value: amount },
        payments: {
          captures: [
            { id: 'CAP-123', status: 'COMPLETED', amount: { currency_code: currency, value: amount } },
          ],
        },
      },
    ],
    links: [{ rel: 'self', href: 'https://api.sandbox.paypal.com/v2/checkout/orders/' + ORDER_ID }],
  };
}

type FetchImpl = (url: string, init?: RequestInit) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

function jsonResponse(body: unknown, status = 200, ok = status >= 200 && status < 300) {
  return { ok, status, json: () => Promise.resolve(body) };
}

function installFetch(routes: { match: (url: string, init?: RequestInit) => boolean; respond: () => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }> }[]) {
  const fetchMock = vi.fn<FetchImpl>(async (url, init) => {
    const hit = routes.find((r) => r.match(String(url), init));
    if (!hit) {
      return jsonResponse({ error: 'not stubbed' }, 404, false);
    }
    return hit.respond();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function tokenRoute() {
  return {
    match: (url: string, init?: RequestInit) => String(url).endsWith('/v1/oauth2/token'),
    respond: () => Promise.resolve(jsonResponse({ access_token: 'test-access-token', expires_in: 3600 })),
  };
}

let requestSeq = 0;
function requestTo(url: string, body: unknown): NextRequest {
  requestSeq += 1;
  return new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `198.51.100.${requestSeq % 254}`,
    },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

beforeEach(() => {
  kvStore.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  resetAccessTokenCache();
});

describe('PayPal create-order', () => {
  test('builds a correct order request and returns the approve link', async () => {
    let capturedBody: any = null;
    const fetchMock = vi.fn<FetchImpl>(async (url, init) => {
      if (String(url).endsWith('/v1/oauth2/token')) {
        return jsonResponse({ access_token: 'tok', expires_in: 3600 });
      }
      if (String(url).endsWith('/v2/checkout/orders')) {
        capturedBody = JSON.parse(String(init?.body));
        return jsonResponse({
          id: ORDER_ID,
          status: 'CREATED',
          links: [
            { rel: 'self', href: 'https://api.sandbox.paypal.com/v2/checkout/orders/' + ORDER_ID },
            { rel: 'approve', href: 'https://www.sandbox.paypal.com/checkoutnow?token=' + ORDER_ID },
          ],
        });
      }
      return jsonResponse({ error: 'unexpected' }, 404, false);
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createOrder(HASH);

    expect(result.id).toBe(ORDER_ID);
    expect(result.approveUrl).toContain('checkoutnow?token=' + ORDER_ID);

    expect(capturedBody.intent).toBe('CAPTURE');
    expect(capturedBody.purchase_units[0].reference_id).toBe('molino_premium');
    expect(capturedBody.purchase_units[0].custom_id).toBe(HASH);
    expect(capturedBody.purchase_units[0].description).toBe('Molino — Premium: Síntesis completa');
    expect(capturedBody.purchase_units[0].amount).toEqual({ currency_code: 'USD', value: '8.00' });
    expect(capturedBody.application_context.brand_name).toBe('Molino');
    expect(capturedBody.application_context.shipping_preference).toBe('NO_SHIPPING');
    expect(capturedBody.application_context.user_action).toBe('PAY_NOW');
    expect(capturedBody.application_context.return_url).toContain('payment_method=paypal');
    expect(capturedBody.application_context.return_url).toContain('payment_status=approved');
    expect(capturedBody.application_context.cancel_url).toContain('payment_status=cancelled');
  });

  test('never leaks personal identifiers in the order payload', async () => {
    let capturedBody: any = null;
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url, init) => {
      if (String(url).endsWith('/v1/oauth2/token')) return jsonResponse({ access_token: 'tok', expires_in: 3600 });
      capturedBody = JSON.parse(String(init?.body));
      return jsonResponse({ id: ORDER_ID, status: 'CREATED', links: [{ rel: 'approve', href: 'https://paypal.example/approve' }] });
    }));

    await createOrder(HASH);

    const raw = JSON.stringify(capturedBody);
    expect(raw).not.toContain('francoviegas173');
    expect(raw).not.toContain('francoviegas');
    expect(raw).not.toContain('paypal.me');
    expect(raw).not.toMatch(/@\w+\.\w+/);
    expect(capturedBody.application_context.brand_name).toBe('Molino');
  });

  test('fails when the order has no approve link', async () => {
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url, init) => {
      if (String(url).endsWith('/v1/oauth2/token')) return jsonResponse({ access_token: 'tok', expires_in: 3600 });
      return jsonResponse({ id: ORDER_ID, status: 'CREATED', links: [] });
    }));

    await expect(createOrder(HASH)).rejects.toThrow('missing the approve link');
  });

  test('fails when PayPal returns an error', async () => {
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url) => {
      if (String(url).endsWith('/v1/oauth2/token')) return jsonResponse({ access_token: 'tok', expires_in: 3600 });
      return jsonResponse({ name: 'INVALID_REQUEST' }, 400, false);
    }));

    await expect(createOrder(HASH)).rejects.toThrow('create order failed');
  });
});

describe('PayPal authentication', () => {
  test('uses Basic auth with client id and secret server-side only', async () => {
    let authHeader = '';
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url, init) => {
      if (String(url).endsWith('/v1/oauth2/token')) {
        authHeader = String((init?.headers as Record<string, string>)['Authorization'] ?? '');
        return jsonResponse({ access_token: 'tok', expires_in: 3600 });
      }
      return jsonResponse({ id: ORDER_ID });
    }));

    await getAccessToken();
    expect(authHeader).toContain('Basic');
    expect(authHeader).toContain(Buffer.from('test-client-id:test-client-secret').toString('base64'));
  });

  test('error de credenciales (invalid_client) da un mensaje claro sobre environment vs. credenciales', async () => {
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url) => {
      if (String(url).endsWith('/v1/oauth2/token')) {
        return jsonResponse({ error: 'invalid_client', error_description: 'Client Authentication failed' }, 401, false);
      }
      return jsonResponse({ error: 'unexpected' }, 404, false);
    }));

    // PAYPAL_ENVIRONMENT='sandbox' en este archivo (línea 6) — invalid_client
    // en sandbox dispara la rama que sugiere que las credenciales son de
    // producción en vez de sandbox.
    await expect(getAccessToken()).rejects.toThrow(/invalid_client/);
  });

  test('nunca expone client secret ni access token en el mensaje de error', async () => {
    vi.stubGlobal('fetch', vi.fn<FetchImpl>(async (url) => {
      if (String(url).endsWith('/v1/oauth2/token')) {
        return jsonResponse({ error: 'invalid_client', error_description: 'Client Authentication failed' }, 401, false);
      }
      return jsonResponse({}, 404, false);
    }));

    try {
      await getAccessToken();
      throw new Error('should have thrown');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      expect(message).not.toContain('test-client-secret');
    }
  });
});

describe('PayPal validateOrder', () => {
  test('accepts a valid completed order', () => {
    const validation = validateOrder(completedOrder(), HASH);
    expect(validation.valid).toBe(true);
  });

  test('rejects non-completed orders', () => {
    const validation = validateOrder(completedOrder(HASH, '8.00', 'USD', 'APPROVED'), HASH);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('APPROVED');
  });

  test('rejects a wrong amount', () => {
    const validation = validateOrder(completedOrder(HASH, '10.00'), HASH);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Amount mismatch');
  });

  test('rejects a non-USD currency', () => {
    const validation = validateOrder(completedOrder(HASH, '8.00', 'EUR'), HASH);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('currency');
  });

  test('rejects an order not associated with the profile (custom_id mismatch)', () => {
    const validation = validateOrder(completedOrder('other-hash'), HASH);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not associated');
  });

  test('rejects a different product reference_id', () => {
    const order = completedOrder();
    order.purchase_units![0].reference_id = 'other_product';
    const validation = validateOrder(order, HASH);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Product mismatch');
  });

  test('rejects a missing amount', () => {
    const order = completedOrder();
    order.purchase_units![0].amount = undefined as any;
    order.purchase_units![0].payments = undefined as any;
    const validation = validateOrder(order, HASH);
    expect(validation.valid).toBe(false);
  });

  test('uses the capture amount as fallback when unit amount is absent', () => {
    const order = completedOrder();
    order.purchase_units![0].amount = undefined as any;
    const validation = validateOrder(order, HASH);
    expect(validation.valid).toBe(true);
  });

  test('amount must be exactly 8.00 — rejects 8.0 string variants', () => {
    const validation = validateOrder(completedOrder(HASH, '8'), HASH);
    expect(validation.valid).toBe(false);
  });
});

describe('PayPal capture-order route', () => {
  test('successful capture verifies, grants access and returns order id', async () => {
    installFetch([
      tokenRoute(),
      { match: (url) => String(url).includes('/capture'), respond: () => Promise.resolve(jsonResponse(completedOrder())) },
    ]);

    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.verified).toBe(true);
    expect(data.orderId).toBe(ORDER_ID);
    expect(data.idempotent).toBe(false);

    const premiumEntry = kvStore.get(`premium:${HASH}`);
    expect(premiumEntry).toBeTruthy();
    expect(kvStore.get(`payment_access:${ORDER_ID}`)).toBeTruthy();
    expect(JSON.parse(String(premiumEntry)).profileHash).toBe(HASH);
  });

  test('duplicate capture is idempotent and does not grant twice', async () => {
    installFetch([
      tokenRoute(),
      { match: (url) => String(url).includes('/capture'), respond: () => Promise.resolve(jsonResponse(completedOrder())) },
    ]);

    const first = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    expect((await first.json()).idempotent).toBe(false);

    const second = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await second.json();
    expect(data.verified).toBe(true);
    expect(data.idempotent).toBe(true);

    const premiumSets = vi.mocked((await import('@vercel/kv')).kv.set).mock.calls.filter(([key]) => String(key).startsWith('premium:'));
    expect(premiumSets).toHaveLength(1);
  });

  test('rejects a capture with the wrong amount', async () => {
    installFetch([
      tokenRoute(),
      { match: (url) => String(url).includes('/capture'), respond: () => Promise.resolve(jsonResponse(completedOrder(HASH, '99.00'))) },
    ]);

    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.verified).toBe(false);
    expect(data.reason).toContain('Amount mismatch');
    expect(kvStore.has(`premium:${HASH}`)).toBe(false);
  });

  test('rejects when the profile hash does not match the order', async () => {
    installFetch([
      tokenRoute(),
      { match: (url) => String(url).includes('/capture'), respond: () => Promise.resolve(jsonResponse(completedOrder('some-other-hash'))) },
    ]);

    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.verified).toBe(false);
    expect(kvStore.has(`premium:${HASH}`)).toBe(false);
  });

  test('handles ORDER_ALREADY_CAPTURED by fetching the order', async () => {
    installFetch([
      tokenRoute(),
      {
        match: (url) => String(url).includes('/capture'),
        respond: () => Promise.resolve(jsonResponse({ name: 'ORDER_ALREADY_CAPTURED' }, 422, false)),
      },
      { match: (url) => String(url).includes('/v2/checkout/orders/') && String(url).endsWith(ORDER_ID), respond: () => Promise.resolve(jsonResponse(completedOrder())) },
    ]);

    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.verified).toBe(true);
    expect(kvStore.get(`premium:${HASH}`)).toBeTruthy();
  });

  test('returns 400 when required fields are missing', async () => {
    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: '', name: NAME, birthDate: BIRTH }));
    expect(res.status).toBe(400);
  });

  test('returns 500 when PayPal is unreachable', async () => {
    installFetch([
      tokenRoute(),
      { match: () => true, respond: () => Promise.resolve(jsonResponse({ error: 'boom' }, 500, false)) },
    ]);

    const res = await captureOrderRoute(requestTo('http://localhost/api/paypal/capture-order', { orderId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    expect(res.status).toBe(500);
  });
});

describe('PayPal recover route', () => {
  test('recovers from KV when the order was already processed', async () => {
    await grantPremiumAccess(HASH, ORDER_ID);
    const res = await recoverRoute(requestTo('http://localhost/api/paypal/recover', { paymentId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(true);
    expect(data.source).toBe('kv');
  });

  test('recovers via PayPal API when not in KV', async () => {
    installFetch([
      tokenRoute(),
      { match: (url) => String(url).endsWith('/v2/checkout/orders/' + ORDER_ID), respond: () => Promise.resolve(jsonResponse(completedOrder())) },
    ]);

    const res = await recoverRoute(requestTo('http://localhost/api/paypal/recover', { paymentId: ORDER_ID, name: NAME, birthDate: BIRTH }));
    const data = await res.json();

    expect(data.verified).toBe(true);
    expect(data.source).toBe('paypal-api');
    expect(kvStore.get(`payment_access:${ORDER_ID}`)).toBeTruthy();
  });

  test('rejects when the order is invalid or missing', async () => {
    installFetch([
      tokenRoute(),
      { match: () => true, respond: () => Promise.resolve(jsonResponse({ name: 'RESOURCE_NOT_FOUND' }, 404, false)) },
    ]);

    const res = await recoverRoute(requestTo('http://localhost/api/paypal/recover', { paymentId: 'NOPE', name: NAME, birthDate: BIRTH }));
    expect(res.status).toBe(400);
  });
});

describe('KV idempotency primitives', () => {
  test('markPaymentProcessed returns true the first time and false afterwards', async () => {
    expect(await markPaymentProcessed('order-1')).toBe(true);
    expect(await markPaymentProcessed('order-1')).toBe(false);
    expect(await isPaymentProcessed('order-1')).toBe(true);
  });
});

describe('profile hash parity across providers', () => {
  test('PayPal uses the same hashProfile as Mercado Pago', async () => {
    const mpHash = hashProfile('María  José', '1988-06-23');
    const ppHash = hashProfile('maria jose', '1988-06-23');
    expect(ppHash).toBe(mpHash);
    expect(ppHash.length).toBe(16);
  });
});
