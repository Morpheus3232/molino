import { createHash } from 'crypto';

const TOKEN_SECRET = process.env.MP_WEBHOOK_SECRET || 'dev-secret';

const kvPromise = (async () => {
  try {
    const mod = await import('@vercel/kv');
    return mod.kv;
  } catch {
    return null;
  }
})();

const devFallback = new Map<string, { profileHash: string; paymentId: string; timestamp: number }>();

async function getKvClient(): Promise<typeof import('@vercel/kv')['kv'] | null> {
  return kvPromise;
}

export async function grantPremiumAccess(profileHash: string, paymentId: string): Promise<void> {
  const key = `premium:${profileHash}`;
  const value = { profileHash, paymentId, timestamp: Date.now() };

  const kv = await getKvClient();
  if (kv) {
    await kv.set(key, JSON.stringify(value));
  } else {
    devFallback.set(key, value);
  }
}

export async function revokePremiumAccess(profileHash: string): Promise<void> {
  const key = `premium:${profileHash}`;

  const kv = await getKvClient();
  if (kv) {
    await kv.del(key);
  } else {
    devFallback.delete(key);
  }
}

export async function hasPremiumAccess(profileHash: string): Promise<boolean> {
  const key = `premium:${profileHash}`;

  const kv = await getKvClient();
  if (kv) {
    const raw = await kv.get(key);
    return raw !== null;
  }

  return devFallback.has(key);
}

export async function getPaymentIdForProfile(profileHash: string): Promise<string | null> {
  const key = `premium:${profileHash}`;

  const kv = await getKvClient();
  if (kv) {
    const raw: any = await kv.get(key);
    if (!raw) return null;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return parsed.paymentId ?? null;
  }

  return devFallback.get(key)?.paymentId ?? null;
}

export function createSignedToken(profileHash: string): string {
  const payload = JSON.stringify({ h: profileHash, t: Date.now() });
  const sig = createHash('sha256')
    .update(payload + TOKEN_SECRET)
    .digest('hex')
    .slice(0, 16);
  return Buffer.from(`${sig}.${payload}`).toString('base64url');
}

export function verifySignedToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const dot = decoded.indexOf('.');
    if (dot === -1) return null;
    const sig = decoded.slice(0, dot);
    const payload = decoded.slice(dot + 1);
    const expected = createHash('sha256')
      .update(payload + TOKEN_SECRET)
      .digest('hex')
      .slice(0, 16);
    if (sig !== expected) return null;
    const data = JSON.parse(payload);
    return data.h ?? null;
  } catch {
    return null;
  }
}
