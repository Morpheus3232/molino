import { NextRequest, NextResponse } from 'next/server';
import { processPayment, hashProfile } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, paymentData } = await req.json();

    if (!name || !birthDate || !paymentData) {
      return NextResponse.json(
        { error: 'name, birthDate, and paymentData are required' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name, birthDate);
    const result = await processPayment({ profileHash, paymentData });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MP Process] Error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        status: 'rejected',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
