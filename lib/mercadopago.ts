import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createHmac, timingSafeEqual } from 'crypto';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const PRODUCT_PRICE_USD = 8;
const PRODUCT_PRICE_ARS = 8100;
const PRODUCT_CURRENCY_USD = 'USD';
const PRODUCT_CURRENCY_ARS = 'ARS';
const PRODUCT_ID = 'molino_premium';

export function getMpClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN || getRequiredEnv('MP_ACCESS_TOKEN');
  return new MercadoPagoConfig({ accessToken });
}

export function getWebhookSecret(): string {
  return process.env.MP_WEBHOOK_SECRET || getRequiredEnv('MP_WEBHOOK_SECRET');
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashProfile(name: string, birthDate: string): string {
  const secret = getWebhookSecret();
  const normalizedName = normalizeName(name);
  return createHmac('sha256', secret)
    .update(`${normalizedName}|${birthDate}`)
    .digest('hex')
    .slice(0, 16);
}

export function requireSecrets(): void {
  getRequiredEnv('MP_ACCESS_TOKEN');
  getRequiredEnv('MP_WEBHOOK_SECRET');
}

export async function createPreference(profileHash: string, name: string, currencyId = 'USD') {
  const preference = new Preference(getMpClient());

  const price = currencyId === PRODUCT_CURRENCY_USD ? PRODUCT_PRICE_USD : PRODUCT_PRICE_ARS;

  const item = {
    id: `${PRODUCT_ID}_${profileHash}`,
    title: 'Molino — Mapa Personal Completo',
    quantity: 1,
    unit_price: price,
    currency_id: currencyId,
    description: 'Acceso completo: numerología profunda, afinidad geográfica, compatibilidad y timing.',
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const response = await preference.create({
    body: {
      items: [item],
      back_urls: {
        success: `${baseUrl}/profile?payment_status=approved`,
        failure: `${baseUrl}/profile?payment_status=failed`,
        pending: `${baseUrl}/profile?payment_status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/mp/webhook`,
      metadata: {
        profile_hash: profileHash,
        product: PRODUCT_ID,
        version: 'bricks_v1',
        customer_name: name,
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
  const payment = new Payment(getMpClient());
  const response = await payment.get({ id: Number(paymentId) });

  return {
    status: (response.status ?? 'unknown') as string,
    status_detail: response.status_detail,
    payment_method_id: response.payment_method_id,
    transaction_amount: response.transaction_amount as number,
    currency_id: (response.currency_id ?? 'USD') as string,
    date_approved: response.date_approved,
    metadata: response.metadata as Record<string, unknown> | undefined,
    external_reference: response.external_reference as string | undefined,
  };
}

export interface PaymentValidation {
  valid: boolean;
  reason?: string;
}

export function validatePayment(payment: {
  status: string;
  transaction_amount: number;
  currency_id: string;
  metadata?: Record<string, unknown> | null;
}): PaymentValidation {
  if (payment.status !== 'approved') {
    return { valid: false, reason: `Payment status is '${payment.status}', expected 'approved'` };
  }

  if (payment.currency_id !== PRODUCT_CURRENCY_USD && payment.currency_id !== PRODUCT_CURRENCY_ARS) {
    return { valid: false, reason: `Unexpected currency: ${payment.currency_id}` };
  }

  const expectedAmount = payment.currency_id === PRODUCT_CURRENCY_USD ? PRODUCT_PRICE_USD : PRODUCT_PRICE_ARS;
  if (payment.transaction_amount !== expectedAmount) {
    return {
      valid: false,
      reason: `Amount mismatch: got ${payment.transaction_amount} ${payment.currency_id}, expected ${expectedAmount}`,
    };
  }

  const product = payment.metadata?.product as string | undefined;
  if (product !== PRODUCT_ID) {
    return { valid: false, reason: `Product mismatch: got '${product ?? 'undefined'}', expected '${PRODUCT_ID}'` };
  }

  return { valid: true };
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
  const payment = new Payment(getMpClient());

  const response = await payment.create({
    body: {
      ...paymentData,
      description: 'Molino — Mapa Personal Completo',
      metadata: {
        profile_hash: profileHash,
        product: PRODUCT_ID,
      },
    },
  });

  return {
    id: String(response.id),
    status: response.status,
    status_detail: response.status_detail,
  };
}

export function verifyWebhookSignature(
  signature: string | null,
  requestId: string | null,
  dataId: string | null,
  body: string,
): boolean {
  if (!signature || !requestId || !dataId) return false;

  let secret: string;
  try {
    secret = getWebhookSecret();
  } catch {
    return false;
  }

  try {
    const parts = signature.split(',');
    const ts = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1]?.trim();
    const hash = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1]?.trim();

    if (!ts || !hash) return false;

    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const expected = createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    if (expected.length !== hash.length) return false;

    return timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
  } catch {
    return false;
  }
}
