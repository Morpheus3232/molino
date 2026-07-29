import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, verifyWebhookSignature } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-signature');
    const body = await req.text();

    if (!verifyWebhookSignature(signature, body)) {
      console.warn('[MP Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);

    console.log('[MP Webhook] Event:', {
      type: data.type,
      action: data.action,
      data: data.data,
    });

    if (data.type === 'payment' && data.data?.id) {
      const paymentId = String(data.data.id);
      const payment = await getPaymentStatus(paymentId);

      console.log('[MP Webhook] Payment details:', {
        id: paymentId,
        status: payment.status,
        method: payment.payment_method_id,
        amount: payment.transaction_amount,
        metadata: payment.metadata,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[MP Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'MP webhook endpoint' });
}
