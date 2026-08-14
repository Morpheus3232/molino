/**
 * Server-side ephemeral profile sharing.
 *
 * The share URL carries ONLY an opaque JWT-like token — never PII (no name,
 * no birthDate, no derived numbers). The actual profile data lives in KV
 * keyed by the token, expires after 24h, and is resolved by the API route
 * `/api/profile/share` (server-only). This replaces the legacy base64url
 * encoding in lib/utils/profileShare.ts (still kept for backwards
 * compatibility with already-shared links), which embedded name + birthDate
 * directly in the URL.
 *
 * Token format: `base64url(header).base64url(payload).signature`, HMAC-SHA256
 * signed with SHARE_SECRET. The payload is NOT encrypted — it only carries
 * the token id (`tid`) and expiry, never profile data. The actual profile is
 * stored in KV under `share:{tid}` with a 24h TTL.
 *
 * This module is server-only: it imports `@vercel/kv` and `crypto`, so it
 * must never be imported from client components. Use the API route instead.
 */

import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

interface TokenPayload {
  /** token id — the KV key suffix */
  tid: string;
  /** issued-at (epoch seconds) */
  iat: number;
  /** expiry (epoch seconds) */
  exp: number;
}

const SHARE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

function getSecret(): string {
  const secret = process.env.SHARE_SECRET || process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    // Never hard-fail share creation at runtime if misconfigured in dev;
    // production deployments must set SHARE_SECRET.
    throw new Error('Missing required environment variable: SHARE_SECRET');
  }
  return secret;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf8');
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

/**
 * Mint a JWT-like share token. The payload carries only the token id and
 * timestamps — no profile PII. Returns the full token string.
 */
export function createShareToken(tid: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { tid, iat: now, exp: now + SHARE_TTL_SECONDS };
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

/**
 * Verify a share token and return its payload, or null if invalid/expired.
 * Timing-safe comparison protects against signature forgery.
 */
export function verifyShareToken(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    const expected = sign(`${header}.${body}`);
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(b64urlDecode(body)) as TokenPayload;
    if (!payload?.tid || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Generate a random token id (the KV key suffix). 16 bytes → 128 bits.
 */
export function generateTokenId(): string {
  return randomBytes(16).toString('hex');
}

export { SHARE_TTL_SECONDS };
