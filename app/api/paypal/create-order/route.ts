import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { createOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate } = await req.json();

    if (!name || !birthDate) {
      return NextResponse.json(
        { error: 'name and birthDate are required' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name, birthDate);
    const order = await createOrder(profileHash);

    return NextResponse.json(order);
  } catch (error) {
    console.error('[PayPal Create Order] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 },
    );
  }
}
