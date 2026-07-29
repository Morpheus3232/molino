import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, hashProfile } from '@/lib/mercadopago';
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
      return NextResponse.json({
        verified: true,
        profileHash: existingHash,
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
      (name && birthDate ? hashProfile(name, birthDate) : undefined);

    if (!profileHash) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu nombre y fecha de nacimiento registrados.',
      }, { status: 400 });
    }

    await grantPremiumAccess(profileHash, cleanPaymentId);

    return NextResponse.json({
      verified: true,
      profileHash,
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
