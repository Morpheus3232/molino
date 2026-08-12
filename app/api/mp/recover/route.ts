import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, hashProfile } from '@/lib/mercadopago';
import { getProfileHashByPaymentId, getProfileSalt, grantPremiumAccess, savePremiumToken, saveProfileSalt } from '@/lib/kv';
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
      // KV hit is only trusted when the requester proves ownership of the
      // profile (same normalized name+birthDate that produced the hash).
      // Without this check, anyone who knows a paymentId could claim access.
      if (name && birthDate) {
        if (!isValidDate(birthDate)) {
          return NextResponse.json({
            verified: false,
            reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)',
          }, { status: 400 });
        }
        const storedSalt = await getProfileSalt(existingHash);
        const requestedHash = hashProfile(name, birthDate, storedSalt ?? salt);
        if (requestedHash !== existingHash) {
          return NextResponse.json({
            verified: false,
            reason: 'El ID de pago no corresponde a este perfil.',
          }, { status: 400 });
        }
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
