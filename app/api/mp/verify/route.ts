import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 }
      );
    }

    const payment = await getPaymentStatus(paymentId);

    return NextResponse.json({
      verified: payment.status === 'approved',
      status: payment.status,
      status_detail: payment.status_detail,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      metadata: payment.metadata,
    });
  } catch (error) {
    console.error('[MP Verify] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
