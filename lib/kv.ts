interface KvLike {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, opts?: { nx?: boolean; ex?: number }): Promise<string | null>;
  del(key: string): Promise<unknown>;
}

/**
 * Dev-only fallback store, backed by a gitignored local JSON file
 * (.molino-dev-kv.json). Used ONLY when NODE_ENV !== 'production' and no
 * valid Upstash/Vercel KV credentials are present — grantPremiumAccess,
 * hasPremiumAccess, revokeAccess etc. all run unchanged on top of it, so a
 * coupon-granted local dev session exercises the exact same code path a
 * real Mercado Pago webhook does; only the storage backend differs. Never
 * reachable in production (see getKvClient below).
 */
let devKvFileLock: Promise<void> = Promise.resolve();

function withDevKvLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = devKvFileLock.then(fn);
  devKvFileLock = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function readDevKvStore(): Promise<Record<string, { value: unknown; expiresAt: number | null }>> {
  const { promises: fs } = await import('fs');
  const path = await import('path');
  try {
    const raw = await fs.readFile(path.join(process.cwd(), '.molino-dev-kv.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeDevKvStore(store: Record<string, { value: unknown; expiresAt: number | null }>): Promise<void> {
  const { promises: fs } = await import('fs');
  const path = await import('path');
  await fs.writeFile(path.join(process.cwd(), '.molino-dev-kv.json'), JSON.stringify(store, null, 2), 'utf8');
}

function getLocalDevKvClient(): KvLike {
  return {
    async get<T>(key: string) {
      return withDevKvLock(async () => {
        const store = await readDevKvStore();
        const entry = store[key];
        if (!entry) return null;
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          delete store[key];
          await writeDevKvStore(store);
          return null;
        }
        return entry.value as T;
      });
    },
    async set(key, value, opts) {
      return withDevKvLock(async () => {
        const store = await readDevKvStore();
        const existing = store[key];
        const existingIsLive = existing && !(existing.expiresAt && existing.expiresAt < Date.now());
        if (opts?.nx && existingIsLive) return null;
        store[key] = { value, expiresAt: opts?.ex ? Date.now() + opts.ex * 1000 : null };
        await writeDevKvStore(store);
        return 'OK';
      });
    },
    async del(key) {
      return withDevKvLock(async () => {
        const store = await readDevKvStore();
        delete store[key];
        await writeDevKvStore(store);
      });
    },
  };
}

export async function getKvClient(): Promise<KvLike | null> {
  try {
    const mod = await import('@vercel/kv');
    const url =
      process.env.KV_REST_API_URL ||
      process.env.KV_REST_API_URL_KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL;

    const token =
      process.env.KV_REST_API_TOKEN ||
      process.env.KV_REST_API_URL_KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN;

    // A malformed-but-present value (e.g. a redacted placeholder that isn't
    // a real https:// URL) must never reach the real Upstash client — it
    // would crash-loop on every call. Absent url/token is a DIFFERENT case
    // (left to `mod.kv` below, same as before this fallback existed) so
    // that tests mocking the `@vercel/kv` module's default `kv` export
    // without setting these env vars keep working unchanged.
    const looksMalformed = (!!url || !!token) && !(!!url && !!token && /^https:\/\//.test(url));

    if (looksMalformed) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('KV credentials present but malformed in production — refusing to proceed');
      }
      console.warn('[KV] KV_REST_API_URL/TOKEN present but malformed — using local dev-only fallback store (.molino-dev-kv.json, gitignored, never used in production).');
      return getLocalDevKvClient();
    }

    if (url && token) {
      return mod.createClient({ url, token }) as unknown as KvLike;
    }

    return mod.kv as unknown as KvLike;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error instanceof Error ? error : new Error('KV client unavailable in production');
    }
    console.warn('[KV] Module not available, operating in local dev fallback mode:', error);
    return getLocalDevKvClient();
  }
}

export async function grantPremiumAccess(profileHash: string, paymentId: string): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;

    const data = { profileHash, paymentId, timestamp: Date.now() };
    await Promise.all([
      kv.set(`premium:${profileHash}`, JSON.stringify(data)),
      kv.set(`payment_access:${paymentId}`, JSON.stringify(data)),
    ]);
  } catch (error) {
    console.error('[KV] Error in grantPremiumAccess:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// ── Device-bound premium token ────────────────────────────────────
//
// A device-bound token prevents the share-URL premium bypass:
// someone who decodes name+birthDate from a shared link can check
// hasPremiumAccess(), but can NOT produce the token that lives only
// in the paying device's localStorage.
//
// Flow:  grantPremiumAccess() → savePremiumToken() → token returned
//        to client → stored in localStorage → sent with AI requests
//        → verified server-side before serving paid content.

const crypto = typeof globalThis.crypto !== 'undefined'
  ? globalThis.crypto
  : require('crypto').webcrypto;

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate and store a device-bound premium token.
 * Called after every successful grantPremiumAccess().
 * Returns the raw token that must be delivered to the client.
 */
export async function savePremiumToken(profileHash: string): Promise<string | null> {
  const token = generateToken();
  try {
    const kv = await getKvClient();
    if (!kv) {
      console.error('[KV_WRITE_FAILED] savePremiumToken: no KV client available');
      return null;
    }
    // 180-day TTL — re-granted on each new payment.
    await kv.set(`premium_token:${profileHash}`, token, { ex: 180 * 86400 });
  } catch (error) {
    console.error('[KV_WRITE_FAILED] Error in savePremiumToken:', error);
    return null;
  }
  return token;
}

/**
 * Verify a device-bound premium token.
 * Returns true ONLY if the token matches the one stored server-side.
 * This prevents share-URL bypass: the token never travels in the URL.
 */
/**
 * Read the device-bound token if one already exists, without rotating it.
 * Only mints a new one (via savePremiumToken) when none exists yet.
 *
 * savePremiumToken() always overwrites — correct for real unlock events
 * (verify/recover/coupon/capture-order), but /api/mp/check is a read-only
 * status confirmation called from multiple independent places in the same
 * page load (PremiumGate.checkServer + usePremiumAccess + polling). Calling
 * savePremiumToken() from there rotated the token on every check, so a token
 * saved to localStorage moments earlier by a real unlock could already be
 * invalid by the time it was used.
 */
export async function getOrCreatePremiumToken(profileHash: string): Promise<string | null> {
  try {
    const kv = await getKvClient();
    if (!kv) {
      console.error('[KV_WRITE_FAILED] getOrCreatePremiumToken: no KV client available');
      return null;
    }
    const existing = await kv.get<string>(`premium_token:${profileHash}`);
    if (existing) return existing;
  } catch (error) {
    console.error('[KV_WRITE_FAILED] Error in getOrCreatePremiumToken:', error);
    return null;
  }
  return savePremiumToken(profileHash);
}

export async function verifyPremiumToken(profileHash: string, token: string): Promise<boolean> {
  if (!token || !profileHash) return false;
  try {
    const kv = await getKvClient();
    if (!kv) return false;
    const stored = await kv.get<string>(`premium_token:${profileHash}`);
    return stored === token;
  } catch (error) {
    console.error('[KV] Error in verifyPremiumToken:', error);
    return false;
  }
}

export async function getProfileHashByPaymentId(paymentId: string): Promise<string | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;

    const raw = await kv.get<string | { profileHash: string }>(`payment_access:${paymentId}`);
    if (!raw) return null;
    if (typeof raw === 'object' && raw && 'profileHash' in raw) {
      return (raw as { profileHash: string }).profileHash;
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return parsed.profileHash || null;
      } catch {
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('[KV] Error in getProfileHashByPaymentId:', error);
    return null;
  }
}

export async function saveProfileSalt(profileHash: string, salt: string): Promise<void> {
  if (!salt) return;
  try {
    const kv = await getKvClient();
    if (!kv) return;
    // Persistido sin TTL: la recuperación de una compra futura (posiblemente
    // desde otro device/navegador) necesita poder recomputar el hash salteado
    // para verificar ownership.
    await kv.set(`profile_salt:${profileHash}`, salt);
  } catch (error) {
    console.error('[KV] Error in saveProfileSalt:', error);
  }
}

export async function getProfileSalt(profileHash: string): Promise<string | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const salt = await kv.get<string>(`profile_salt:${profileHash}`);
    return salt || null;
  } catch (error) {
    console.error('[KV] Error in getProfileSalt:', error);
    return null;
  }
}

export async function revokeAccess(profileHash: string, paymentId: string): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;

    await Promise.all([
      kv.del(`premium:${profileHash}`),
      kv.del(`payment_access:${paymentId}`),
    ]);
  } catch (error) {
    console.error('[KV] Error in revokeAccess:', error);
  }
}

export async function hasPremiumAccess(profileHash: string): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (!kv) return false;

    const raw = await kv.get(`premium:${profileHash}`);
    return raw !== null;
  } catch (error) {
    console.error('[KV] Error in hasPremiumAccess:', error);
    return false;
  }
}

export async function markPaymentProcessed(paymentId: string): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (!kv) return false;

    const key = `processed:payment:${paymentId}`;
    const set = await kv.set(key, '1', { nx: true, ex: 86400 });
    return set === 'OK';
  } catch (error) {
    console.error('[KV] Error in markPaymentProcessed:', error);
    return false;
  }
}

// ── Ephemeral profile share storage (lib/share.ts) ────────────────────────
//
// The share token itself carries no PII; the profile data lives here keyed by
// the token id with a 24h TTL. This is what lets share URLs stay PII-free.

export interface StoredShareProfile {
  /** name (optional — onboarding is birthDate-first) */
  n?: string;
  /** birthDate YYYY-MM-DD */
  b: string;
  /** profile hash (kept as ID / recovery handle) */
  h: string;
}

const SHARE_TTL = 24 * 60 * 60; // 24 hours

/**
 * Store a shared profile under a token id. Returns true on success.
 */
export async function storeShareProfile(tid: string, profile: StoredShareProfile): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (!kv) return false;
    await kv.set(`share:${tid}`, JSON.stringify(profile), { ex: SHARE_TTL });
    return true;
  } catch (error) {
    console.error('[KV] Error in storeShareProfile:', error);
    return false;
  }
}

/**
 * Resolve a shared profile by token id. Returns null if missing/expired.
 */
export async function resolveShareProfile(tid: string): Promise<StoredShareProfile | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const raw = await kv.get<string>(`share:${tid}`);
    if (!raw) return null;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) as StoredShareProfile : raw as StoredShareProfile;
    if (!parsed?.b) return null;
    return parsed;
  } catch (error) {
    console.error('[KV] Error in resolveShareProfile:', error);
    return null;
  }
}

// ── Gift codes (regalar Molino) ────────────────────────────────────────────
//
// El comprador de un regalo no conoce la fecha de nacimiento del
// destinatario, así que no puede calcular su profileHash en el momento de
// la compra (ver hashProfile en lib/mercadopago.ts). El pago solo puede
// dejar un código canjeable; grantPremiumAccess recién se llama en el
// canje, cuando el destinatario aporta su propia fecha. Mismo patrón que
// storeShareProfile/resolveShareProfile arriba (guardar-por-clave con TTL),
// solo que acá el registro es mutable una vez (no-canjeado → canjeado).

export interface StoredGiftCode {
  paymentId: string;
  createdAt: number;
  redeemed: boolean;
  redeemedProfileHash?: string;
  redeemedAt?: number;
}

const GIFT_TTL = 30 * 24 * 60 * 60; // 30 días sin canjear

/** Guarda un código de regalo recién pagado como válido y no canjeado. */
export async function storeGiftCode(code: string, paymentId: string): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (!kv) return false;
    const data: StoredGiftCode = { paymentId, createdAt: Date.now(), redeemed: false };
    await kv.set(`gift:${code}`, JSON.stringify(data), { ex: GIFT_TTL });
    return true;
  } catch (error) {
    console.error('[KV] Error in storeGiftCode:', error);
    return false;
  }
}

/** Estado actual de un código de regalo. null si no existe o expiró. */
export async function getGiftCode(code: string): Promise<StoredGiftCode | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const raw = await kv.get<string>(`gift:${code}`);
    if (!raw) return null;
    return typeof raw === 'string' ? (JSON.parse(raw) as StoredGiftCode) : (raw as StoredGiftCode);
  } catch (error) {
    console.error('[KV] Error in getGiftCode:', error);
    return null;
  }
}

/**
 * Canjea un código para `profileHash`. No es atómico (read-then-write, igual
 * que el resto de este archivo — ver incrementDailyCost más abajo): dos
 * canjes simultáneos del mismo código son un caso de probabilidad
 * despreciable para un código comprado por una sola persona, no vale la
 * complejidad de una operación atómica para evitarlo.
 */
export async function redeemGiftCode(
  code: string,
  profileHash: string
): Promise<{ success: true; paymentId: string } | { success: false; reason: 'not_found' | 'already_redeemed' }> {
  const existing = await getGiftCode(code);
  if (!existing) return { success: false, reason: 'not_found' };
  if (existing.redeemed) return { success: false, reason: 'already_redeemed' };

  try {
    const kv = await getKvClient();
    if (kv) {
      const updated: StoredGiftCode = {
        ...existing,
        redeemed: true,
        redeemedProfileHash: profileHash,
        redeemedAt: Date.now(),
      };
      await kv.set(`gift:${code}`, JSON.stringify(updated), { ex: GIFT_TTL });
    }
  } catch (error) {
    console.error('[KV] Error marking gift code redeemed:', error);
  }

  return { success: true, paymentId: existing.paymentId };
}

/**
 * Best-effort running total of estimated AI spend, bucketed by UTC day.
 * NOT billing-critical (no atomic increment in the KvLike interface, so this
 * is read-modify-write — under real concurrent writes it can undercount by a
 * few generations) — it exists so there's at least a queryable number for
 * "roughly how much are we spending" before a proper cost dashboard exists
 * (see the [premium_interpretation_served] telemetry comment in
 * app/api/intelligence/interpret/route.ts, same gap). Never throws in
 * production: losing a cost data point must never fail the actual AI
 * request it's tracking.
 */
export async function incrementDailyCost(usd: number): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;

    const day = new Date().toISOString().slice(0, 10);
    const key = `ai_cost:${day}`;
    const current = (await kv.get<number>(key)) || 0;
    // 40-day TTL: enough to compare week-over-week without accumulating
    // indefinitely in a store that isn't meant to be a real time-series DB.
    await kv.set(key, current + usd, { ex: 40 * 86400 });
  } catch (error) {
    console.error('[KV] Error in incrementDailyCost:', error);
  }
}

export async function getDailyCost(day: string): Promise<number> {
  try {
    const kv = await getKvClient();
    if (!kv) return 0;
    return (await kv.get<number>(`ai_cost:${day}`)) || 0;
  } catch (error) {
    console.error('[KV] Error in getDailyCost:', error);
    return 0;
  }
}

/** Daily cap on explicit "Regenerar" clicks on the premium synthesis (see
 * MolinoInterpretation's handleRegenerate) — each click is a fresh real
 * OpenRouter call with real cost, unlike the automatic first generation
 * a user gets just by opening the reading. Per-profileHash, resets daily. */
export const REGENERATE_DAILY_LIMIT = 5;

/** Same read-modify-write caveat as incrementDailyCost (no atomic increment
 * in KvLike) — acceptable here too: a soft UX cap, not a billing-critical
 * or security boundary. Never throws: losing a counter increment must never
 * fail the regenerate request it's tracking. */
export async function incrementRegenerationCount(profileHash: string): Promise<number> {
  try {
    const kv = await getKvClient();
    if (!kv) return 0;
    const day = new Date().toISOString().slice(0, 10);
    const key = `regen_count:${day}:${profileHash}`;
    const next = ((await kv.get<number>(key)) || 0) + 1;
    // 2-day TTL: comfortably past UTC midnight rollover without lingering.
    await kv.set(key, next, { ex: 2 * 86400 });
    return next;
  } catch (error) {
    console.error('[KV] Error in incrementRegenerationCount:', error);
    return 0;
  }
}

export async function getRegenerationCount(profileHash: string): Promise<number> {
  try {
    const kv = await getKvClient();
    if (!kv) return 0;
    const day = new Date().toISOString().slice(0, 10);
    return (await kv.get<number>(`regen_count:${day}:${profileHash}`)) || 0;
  } catch (error) {
    console.error('[KV] Error in getRegenerationCount:', error);
    return 0;
  }
}

export async function isPaymentProcessed(paymentId: string): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (!kv) return false;

    const raw = await kv.get(`processed:payment:${paymentId}`);
    return raw !== null;
  } catch (error) {
    console.error('[KV] Error in isPaymentProcessed:', error);
    return false;
  }
}

// ── One-time recovery link (magic link sent in the confirmation email) ──
//
// The confirmation email never carries the real premium_token — only this
// short-lived, single-use token, which /api/premium/claim exchanges for the
// real token server-side. Prevents the permanent token from ever sitting in
// plaintext in an inbox.

const RECOVERY_LINK_TTL = 15 * 60; // 15 minutes

/**
 * Mint a one-time recovery link token for profileHash and store it.
 * Returns the raw token to embed in the confirmation email URL.
 */
export async function createRecoveryLinkToken(profileHash: string): Promise<string> {
  const token = generateToken();
  try {
    const kv = await getKvClient();
    if (!kv) return token;
    await kv.set(`recovery_link:${token}`, profileHash, { ex: RECOVERY_LINK_TTL });
  } catch (error) {
    console.error('[KV] Error in createRecoveryLinkToken:', error);
  }
  return token;
}

/**
 * Consume a recovery link token: returns the profileHash and deletes the key
 * so the link can't be reused. Returns null if missing/expired.
 */
export async function consumeRecoveryLinkToken(rawToken: string): Promise<string | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const profileHash = await kv.get<string>(`recovery_link:${rawToken}`);
    if (!profileHash) return null;
    await kv.del(`recovery_link:${rawToken}`);
    return profileHash;
  } catch (error) {
    console.error('[KV] Error in consumeRecoveryLinkToken:', error);
    return null;
  }
}

// ── Preference dedup (prevents double-charge from double-click) ─────

const PENDING_PREFERENCE_TTL = 30 * 60; // 30 minutes

export interface PendingPreference {
  preferenceId: string;
  checkoutUrl: string;
  createdAt: number;
}

/**
 * Store a newly-created preference so concurrent/repeated requests for
 * the same checkout intent (identified by profileHash) can reuse it
 * instead of creating a duplicate.
 */
export async function savePendingPreference(
  profileHash: string,
  preferenceId: string,
  checkoutUrl: string,
): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;
    const key = `pending_pref:${profileHash}`;
    const data: PendingPreference = { preferenceId, checkoutUrl, createdAt: Date.now() };
    await kv.set(key, JSON.stringify(data), { ex: PENDING_PREFERENCE_TTL });
  } catch (error) {
    console.error('[KV] Error in savePendingPreference:', error);
  }
}

/**
 * Return an existing pending preference for this profile if one was
 * created within the last PENDING_PREFERENCE_TTL seconds, or null.
 */
export async function getPendingPreference(
  profileHash: string,
): Promise<PendingPreference | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const key = `pending_pref:${profileHash}`;
    const raw = await kv.get<string>(key);
    if (!raw) return null;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) as PendingPreference : raw as PendingPreference;
    if (!parsed?.preferenceId || !parsed?.checkoutUrl) return null;
    return parsed;
  } catch (error) {
    console.error('[KV] Error in getPendingPreference:', error);
    return null;
  }
}
