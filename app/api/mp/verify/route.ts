import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, hashProfile } from '@/lib/mercadopago';
import { hasPremiumAccess, grantPremiumAccess, savePremiumToken, getProfileHashByPaymentId } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/verify'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { paymentId, name, birthDate } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 },
      );
    }

    const calculatedHash = name && birthDate ? hashProfile(name, birthDate) : undefined;

    // Fast path: the paymentId is already linked to this profile in KV.
    // Only trust it when the requester proves ownership of the profile
    // (same name+birthDate that produced the hash). This also prevents
    // someone who decodes a shared profile URL from claiming access with
    // an arbitrary paymentId.
    if (calculatedHash) {
      const linkedHash = await getProfileHashByPaymentId(String(paymentId).trim());
      if (linkedHash === calculatedHash) {
        const inKv = await hasPremiumAccess(calculatedHash);
        if (inKv) {
          const premiumToken = await savePremiumToken(calculatedHash);
          return NextResponse.json({
            verified: true,
            source: 'kv',
            status: 'approved',
            premiumToken,
          });
        }
      }
    }

    const payment = await getPaymentStatus(String(paymentId));

    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json({
        verified: false,
        reason: validation.reason,
        status: payment.status,
        source: 'mp-api',
      });
    }

    const metadataHash = payment.metadata?.profile_hash as string | undefined;

    // If both metadata hash and calculated hash exist, they must match.
    // This prevents a user from claiming another person's payment by
    // providing their own PII when metadata contains a different hash.
    if (metadataHash && calculatedHash && metadataHash !== calculatedHash) {
      return NextResponse.json({
        verified: false,
        reason: 'El ID de pago no corresponde a este perfil.',
      }, { status: 400 });
    }

    const targetHash = metadataHash || calculatedHash;

    if (!targetHash) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu nombre y fecha de nacimiento registrados.',
      }, { status: 400 });
    }

    await grantPremiumAccess(targetHash, String(paymentId));
    const premiumToken = await savePremiumToken(targetHash);

    return NextResponse.json({
      verified: true,
      source: 'mp-api',
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount,
      premiumToken,
    });
  } catch (error) {
    console.error('[MP Verify] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 },
    );
  }
}
