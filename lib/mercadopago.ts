import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createHmac } from 'crypto';

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export function hashProfile(name: string, birthDate: string): string {
  return createHmac('sha256', process.env.MP_WEBHOOK_SECRET || 'dev-secret')
    .update(`${name.toLowerCase().trim()}|${birthDate}`)
    .digest('hex')
    .slice(0, 16);
}

export async function createPreference(profileHash: string, currencyId = 'USD') {
  const preference = new Preference(mpClient);

  const item = {
    id: `molino_premium_${profileHash}`,
    title: 'Molino — Mapa Personal Completo',
    quantity: 1,
    unit_price: currencyId === 'USD' ? 9 : 8100,
    currency_id: currencyId,
    description: 'Acceso completo: numerología profunda, afinidad geográfica, compatibilidad y timing.',
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const response = await preference.create({
    body: {
      items: [item],
      back_urls: {
        success: `${baseUrl}/profile?payment_status=approved&profile_hash=${profileHash}`,
        failure: `${baseUrl}/profile?payment_status=failed&profile_hash=${profileHash}`,
        pending: `${baseUrl}/profile?payment_status=pending&profile_hash=${profileHash}`,
      },
      auto_return: 'approved',
      metadata: {
        profile_hash: profileHash,
        product: 'molino_premium',
        version: 'bricks_v1',
      },
      statement_descriptor: 'MOLINO',
    },
  });

  return {
    preferenceId: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point,
  };
}

export async function getPaymentStatus(paymentId: string) {
  const payment = new Payment(mpClient);
  const response = await payment.get({ id: Number(paymentId) });

  return {
    status: response.status,
    status_detail: response.status_detail,
    payment_method_id: response.payment_method_id,
    transaction_amount: response.transaction_amount,
    date_approved: response.date_approved,
    metadata: response.metadata,
  };
}

export async function processPayment({
  profileHash,
  paymentData,
}: {
  profileHash: string;
  paymentData: {
    transaction_amount: number;
    payment_method_id: string;
    token: string;
    installments?: number;
    issuer_id?: number;
    payer: { email: string };
  };
}) {
  const payment = new Payment(mpClient);

  const response = await payment.create({
    body: {
      ...paymentData,
      description: 'Molino — Mapa Personal Completo',
      metadata: {
        profile_hash: profileHash,
        product: 'molino_premium',
      },
    },
  });

  return {
    id: String(response.id),
    status: response.status,
    status_detail: response.status_detail,
  };
}

export function verifyWebhookSignature(signature: string | null, body: string): boolean {
  if (!signature || !process.env.MP_WEBHOOK_SECRET) return false;

  try {
    const parts = signature.split(',');
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1] || '';
    const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1] || '';

    const manifest = `id:;request-id:;ts:${ts};` + body;
    const expected = createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
      .update(manifest)
      .digest('hex');

    return hash === expected;
  } catch {
    return false;
  }
}
