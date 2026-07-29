async function getKvClient() {
  try {
    const mod = await import('@vercel/kv');
    return mod.kv;
  } catch {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('KV client unavailable in production — cannot grant or verify access');
    }
    return null;
  }
}

export async function grantPremiumAccess(profileHash: string, paymentId: string): Promise<void> {
  const kv = await getKvClient();
  if (!kv) return;

  const data = { profileHash, paymentId, timestamp: Date.now() };
  await kv.set(`premium:${profileHash}`, JSON.stringify(data));
}

export async function hasPremiumAccess(profileHash: string): Promise<boolean> {
  const kv = await getKvClient();
  if (!kv) return false;

  const raw = await kv.get(`premium:${profileHash}`);
  return raw !== null;
}

export async function markPaymentProcessed(paymentId: string): Promise<boolean> {
  const kv = await getKvClient();
  if (!kv) return false;

  const key = `processed:payment:${paymentId}`;
  const set = await kv.set(key, '1', { nx: true, ex: 86400 });
  return set === 'OK';
}

export async function isPaymentProcessed(paymentId: string): Promise<boolean> {
  const kv = await getKvClient();
  if (!kv) return false;

  const raw = await kv.get(`processed:payment:${paymentId}`);
  return raw !== null;
}
