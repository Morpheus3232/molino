import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { getOrder, validateOrder } from '@/lib/paypal';
import { getProfileHashByPaymentId, getProfileSalt, grantPremiumAccess, savePremiumToken, saveProfileSalt } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'paypal/recover'), PAYMENT_RATE_LIMIT);
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
      if (birthDate) {
        if (!isValidDate(birthDate)) {
          return NextResponse.json({
            verified: false,
            reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)',
          }, { status: 400 });
        }
        const storedSalt = await getProfileSalt(existingHash);
        const requestedHash = hashProfile(name ?? '', birthDate, storedSalt ?? salt);
        if (requestedHash !== existingHash) {
          return NextResponse.json({
            verified: false,
            reason: 'El ID de pago no corresponde a este perfil.',
          }, { status: 400 });
        }
      }
      const kvPremiumToken = await savePremiumToken(existingHash);
      if (!kvPremiumToken) {
        return NextResponse.json({
          error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
        }, { status: 503 });
      }
      return NextResponse.json({
        verified: true,
        profileHash: existingHash,
        premiumToken: kvPremiumToken,
        source: 'kv',
      });
    }

    if (!birthDate) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu fecha de nacimiento.',
      }, { status: 400 });
    }

    if (!isValidDate(birthDate)) {
      return NextResponse.json({
        verified: false,
        reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)',
      }, { status: 400 });
    }

    const profileHash = hashProfile(name ?? '', birthDate, salt);

    let order;
    try {
      order = await getOrder(cleanPaymentId);
    } catch {
      return NextResponse.json({
        verified: false,
        reason: 'No se encontró una compra válida de PayPal con este ID.',
      }, { status: 400 });
    }

    const validation = validateOrder(order, profileHash);
    if (!validation.valid) {
      return NextResponse.json({
        verified: false,
        reason: validation.reason,
        status: order.status,
      }, { status: 400 });
    }

    if (salt) await saveProfileSalt(profileHash, salt);
    await grantPremiumAccess(profileHash, cleanPaymentId);
    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
      }, { status: 503 });
    }

    return NextResponse.json({
      verified: true,
      profileHash,
      premiumToken,
      source: 'paypal-api',
    });
  } catch (error) {
    console.error('[PayPal Recover] Error:', error);
    return NextResponse.json(
      { error: 'No se pudo recuperar la compra. Verificá que el ID de pago sea correcto.' },
      { status: 500 },
    );
  }
}
