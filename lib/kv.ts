async function getKvClient() {
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

    if (url && token) {
      return mod.createClient({ url, token });
    }

    return mod.kv;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('KV client unavailable in production — cannot grant or verify access');
    }
    console.warn('[KV] Module not available, operating in fallback mode:', error);
    return null;
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
