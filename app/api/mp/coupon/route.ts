import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess } from '@/lib/kv';

const COUPON_CODE = process.env.PREMIUM_COUPON || 'MOLINO-DEV';

export async function POST(req: NextRequest) {
  try {
    const { coupon, name, birthDate } = await req.json();

    if (!coupon || !name || !birthDate) {
      return NextResponse.json(
        { valid: false, reason: 'Faltan datos requeridos' },
        { status: 400 },
      );
    }

    if (coupon.trim() !== COUPON_CODE) {
      return NextResponse.json(
        { valid: false, reason: 'Código de cupón inválido' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name, birthDate);
    const paymentId = `coupon_${profileHash}_${Date.now()}`;

    await grantPremiumAccess(profileHash, paymentId);

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[Coupon] Error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Error al procesar el cupón' },
      { status: 500 },
    );
  }
}