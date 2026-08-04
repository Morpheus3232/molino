import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { getOrder, validateOrder } from '@/lib/paypal';
import { getProfileHashByPaymentId, grantPremiumAccess } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, name, birthDate } = await req.json();

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
        const requestedHash = hashProfile(name ?? '', birthDate);
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
        source: 'kv',
      });
    }

    if (!birthDate) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu fecha de nacimiento.',
      }, { status: 400 });
    }

    const profileHash = hashProfile(name ?? '', birthDate);

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

    await grantPremiumAccess(profileHash, cleanPaymentId);

    return NextResponse.json({
      verified: true,
      profileHash,
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
