import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, hashProfile } from '@/lib/mercadopago';
import { getProfileHashByPaymentId, grantPremiumAccess, savePremiumToken, saveProfileSalt } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/recover'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { paymentId, name, birthDate, salt } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'El ID de pago es requerido' },
        { status: 400 },
      );
    }

    const cleanPaymentId = String(paymentId).trim();

    const existingHash = await getProfileHashByPaymentId(cleanPaymentId);
    if (existingHash) {
      // Ownership is trusted from the paymentId itself: it only resolves to
      // a profileHash here if it was a real, validated MP transaction (see
      // grantPremiumAccess call sites). birthDate is UX friction to avoid an
      // empty-form submit, not a server-side cryptographic check — recover
      // no longer requires the exact same name that was typed at checkout.
      if (birthDate && !isValidDate(birthDate)) {
        return NextResponse.json({
          verified: false,
          reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)',
        }, { status: 400 });
      }
      return NextResponse.json({
        verified: true,
        profileHash: existingHash,
        premiumToken: await savePremiumToken(existingHash),
        source: 'kv',
      });
    }

    const payment = await getPaymentStatus(cleanPaymentId);
    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json({
        verified: false,
        reason: validation.reason,
        status: payment.status,
      }, { status: 400 });
    }

    const profileHash =
      (payment.metadata?.profile_hash as string | undefined) ||
      (name && birthDate ? hashProfile(name, birthDate, salt) : undefined);

    if (!profileHash) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu nombre y fecha de nacimiento registrados.',
      }, { status: 400 });
    }

    if (birthDate && !isValidDate(birthDate)) {
      return NextResponse.json({
        verified: false,
        reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)',
      }, { status: 400 });
    }

    if (salt) await saveProfileSalt(profileHash, salt);
    await grantPremiumAccess(profileHash, cleanPaymentId);
    const premiumToken = await savePremiumToken(profileHash);

    return NextResponse.json({
      verified: true,
      profileHash,
      premiumToken,
      source: 'mp-api',
    });
  } catch (error) {
    console.error('[MP Recover] Error:', error);
    return NextResponse.json(
      { error: 'No se pudo recuperar la compra. Verificá que el ID de pago sea correcto.' },
      { status: 500 },
    );
  }
}
