import { NextRequest, NextResponse } from 'next/server';
import { processPayment } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { profileHash, paymentData } = await req.json();

    if (!profileHash || !paymentData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
      { status: 500 }
    );
  }
}
