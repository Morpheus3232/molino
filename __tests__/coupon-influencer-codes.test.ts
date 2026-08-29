/**
 * Un código por influencer: varios códigos válidos a la vez, cada canje
 * contado por código, la misma persona contada una sola vez.
 */
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.hoisted(() => {
  process.env.MP_WEBHOOK_SECRET = 'test-webhook-secret';
  process.env.PREMIUM_COUPON = 'VALEN,CAFECONSOMBRA';
  process.env.COUPON_STATS_SECRET = 'stats-secret';
});

const { kvStore } = vi.hoisted(() => ({ kvStore: new Map<string, unknown>() }));

vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(async (key: string, value: unknown, opts?: { nx?: boolean }) => {
      if (opts?.nx && kvStore.has(key)) return null;
      kvStore.set(key, value);
      return 'OK';
    }),
    get: vi.fn(async (key: string) => kvStore.get(key) ?? null),
    del: vi.fn(async (key: string) => { kvStore.delete(key); return 1; }),
  },
}));

import { POST, GET } from '@/app/api/mp/coupon/route';

// IP distinta por llamada: el rate limit real es 3 canjes por IP cada 5
// minutos, y el test hace más que eso a propósito.
let call = 0;
const redeem = (coupon: string, salt: string) =>
  POST(new NextRequest('http://localhost/api/mp/coupon', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${++call}` },
    body: JSON.stringify({ coupon, name: 'Test', birthDate: '1990-01-01', salt }),
  }));

const stats = (secret: string) =>
  GET(new NextRequest(`http://localhost/api/mp/coupon?secret=${secret}`));

/** Mismo endpoint, pero como lo pide un navegador. */
const statsPage = (secret: string) =>
  GET(new NextRequest(`http://localhost/api/mp/coupon?secret=${secret}`, {
    headers: { accept: 'text/html,application/xhtml+xml' },
  }));

beforeEach(() => kvStore.clear());

describe('códigos por influencer', () => {
  test('acepta cualquiera de los códigos configurados', async () => {
    expect((await (await redeem('VALEN', 's1')).json()).valid).toBe(true);
    expect((await (await redeem('CAFECONSOMBRA', 's2')).json()).valid).toBe(true);
  });

  test('rechaza un código que no está en la lista', async () => {
    const res = await redeem('OTROCODIGO', 's3');
    expect(res.status).toBe(400);
    expect((await res.json()).valid).toBe(false);
  });

  test('es case-insensitive (el teclado del celular capitaliza)', async () => {
    expect((await (await redeem('cafeconsombra', 's4')).json()).valid).toBe(true);
  });

  test('cuenta un canje por código y no duplica la misma persona', async () => {
    await redeem('CAFECONSOMBRA', 'a1');
    await redeem('CAFECONSOMBRA', 'a2');
    await redeem('CAFECONSOMBRA', 'a1'); // misma persona otra vez
    await redeem('VALEN', 'b1');

    const { codes } = await (await stats('stats-secret')).json();
    expect(codes).toEqual({ VALEN: 1, CAFECONSOMBRA: 2 });
  });

  test('las métricas no son públicas', async () => {
    expect((await stats('mal')).status).toBe(404);
    expect((await statsPage('mal')).status).toBe(404);
  });

  test('desde el navegador devuelve una pantalla, desde curl JSON', async () => {
    await redeem('VALEN', 'c1');
    await redeem('CAFECONSOMBRA', 'c2');
    await redeem('CAFECONSOMBRA', 'c3');

    const page = await statsPage('stats-secret');
    expect(page.headers.get('content-type')).toContain('text/html');
    const html = await page.text();
    expect(html).toContain('CAFECONSOMBRA');
    expect(html).toContain('>3<');            // total
    expect(html).toContain('>2<');            // el código de más canjes
    expect(html.indexOf('CAFECONSOMBRA')).toBeLessThan(html.indexOf('VALEN')); // ordenado por canjes

    const json = await stats('stats-secret');
    expect(json.headers.get('content-type')).toContain('application/json');
  });
});
