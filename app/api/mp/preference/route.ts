import { NextRequest, NextResponse } from 'next/server';
import { createPreference, hashProfile } from '@/lib/mercadopago';
import { getPendingPreference, savePendingPreference } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { mpCurrencySchema, paymentIdentitySchema } from '@/lib/validation/payments';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/preference'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json().catch(() => ({}));
    const identity = paymentIdentitySchema.safeParse(body);
    if (!identity.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { currencyId, plan, returnPath } = body;
    const { name, birthDate, salt } = identity.data;
    const profileHash = hashProfile(name, birthDate, salt);

    // Idempotency: if a preference was already created for this profile
    // within the last 30 minutes, reuse it instead of creating a
    // duplicate. This prevents double-charge when the user double-clicks
    // "Pagar" or the browser retries a slow request.
    const existing = await getPendingPreference(profileHash);
    if (existing) {
      console.log(`[MP Preference] Reusing existing preference for ${profileHash}: ${existing.preferenceId}`);
      return NextResponse.json(existing);
    }

    const result = await createPreference(
      profileHash,
      mpCurrencySchema.safeParse(currencyId).data,
      profileHash, // external_reference: deterministic per profile
      plan ?? null,
      typeof returnPath === 'string' ? returnPath : undefined,
    );

    if (result.preferenceId && result.checkoutUrl) {
      await savePendingPreference(profileHash, result.preferenceId, result.checkoutUrl);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MP Preference] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 },
    );
  }
}
