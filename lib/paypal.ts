import { hashProfile, getBaseUrl } from '@/lib/mercadopago';
import { resolvePlanUsdPrice, type BillingCycle } from '@/components/pricing/pricing-data';

const PRODUCT_ID = 'molino_premium';
const PRODUCT_PRICE_USD = '8.00';
const PRODUCT_CURRENCY = 'USD';
const BRAND_NAME = process.env.PAYPAL_BRAND_NAME || 'Molino';

/** reference_id para un plan pagado (ej. "molino_pro_monthly"). */
export function planProductId(planId: string, cycle: BillingCycle): string {
  return `molino_${planId}_${cycle}`;
}

const PLAN_PRODUCT_RE = /^molino_([a-z]+)_(monthly|yearly)$/;

/** Precio USD esperado (string con 2 decimales) para un product id. */
export function expectedAmountFor(product: string): string | null {
  if (product === PRODUCT_ID) return PRODUCT_PRICE_USD;
  const match = PLAN_PRODUCT_RE.exec(product);
  if (match) {
    const price = resolvePlanUsdPrice(match[1], match[2] as BillingCycle);
    if (price > 0) return price.toFixed(2);
  }
  return null;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalCapture {
  id?: string;
  status?: string;
  amount?: PayPalAmount;
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  custom_id?: string;
  amount?: PayPalAmount;
  payments?: { captures?: PayPalCapture[] };
}

export interface PayPalOrder {
  id: string;
  status: string;
  purchase_units?: PayPalPurchaseUnit[];
  links?: { rel: string; href: string }[];
}

export interface PayPalCreateOrderResult {
  id: string;
  approveUrl: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getPaypalBaseUrl(): string {
  const env = (process.env.PAYPAL_ENVIRONMENT || '').toLowerCase();
  if (env === 'live') {
    return 'https://api-m.paypal.com';
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'PAYPAL_ENVIRONMENT must be "live" in production. Current value: ' +
        (process.env.PAYPAL_ENVIRONMENT || '(not set)'),
    );
  }
  return 'https://api-m.sandbox.paypal.com';
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export function resetAccessTokenCache(): void {
  cachedToken = null;
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = getRequiredEnv('PAYPAL_CLIENT_ID');
  const clientSecret = getRequiredEnv('PAYPAL_CLIENT_SECRET');
  const environment = (process.env.PAYPAL_ENVIRONMENT || '').toLowerCase();

  const res = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorCode = errorData.error || 'unknown_error';
    const errorDescription = errorData.error_description || '';
    
    // Detectar mismatch entre credenciales y environment
    if (environment === 'live' && errorCode === 'invalid_client') {
      throw new Error(
        'PayPal authentication failed: invalid_client. ' +
        'PAYPAL_ENVIRONMENT=live pero PAYPAL_CLIENT_ID/SECRET parecen ser de sandbox. ' +
        'Verificá que las credenciales sean de producción (live) en developer.paypal.com.'
      );
    }
    if (environment === 'sandbox' && errorCode === 'invalid_client') {
      throw new Error(
        'PayPal authentication failed: invalid_client. ' +
        'PAYPAL_ENVIRONMENT=sandbox pero PAYPAL_CLIENT_ID/SECRET parecen ser de producción. ' +
        'Verificá que las credenciales sean de sandbox en developer.paypal.com.'
      );
    }
    
    throw new Error(`PayPal authentication failed with status ${res.status}: ${errorCode} - ${errorDescription}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

export async function createOrder(
  profileHash: string,
  plan?: { id: string; cycle: BillingCycle } | null,
): Promise<PayPalCreateOrderResult> {
  const token = await getAccessToken();
  // Misma protección que Mercado Pago (getBaseUrl lanza en producción si no
  // está configurada) — antes caía en el mismo fallback silencioso a
  // localhost. `tab=intelligence` no existe más: /profile es hoy un scroll
  // único (ProfileHub), no hay tabs — PremiumGate lee payment_status/
  // payment_method/token del querystring sin importar qué otros params haya.
  const baseUrl = getBaseUrl();
  const returnUrl = `${baseUrl}/profile?payment_method=paypal&payment_status=approved`;
  const cancelUrl = `${baseUrl}/profile?payment_method=paypal&payment_status=cancelled`;

  const isPlan = !!plan && plan.id !== 'gratis';
  const referenceId = isPlan ? planProductId(plan!.id, plan!.cycle) : PRODUCT_ID;
  const amount = expectedAmountFor(referenceId) ?? PRODUCT_PRICE_USD;

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: referenceId,
        description: isPlan
          ? `Molino — Plan ${plan!.id} (${plan!.cycle})`
          : 'Molino — Premium: Síntesis completa',
        custom_id: profileHash,
        amount: { currency_code: PRODUCT_CURRENCY, value: amount },
      },
    ],
    application_context: {
      brand_name: BRAND_NAME,
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING',
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  const res = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`PayPal create order failed with status ${res.status}`);
  }

  const data = (await res.json()) as PayPalOrder;
  const approveLink = data.links?.find((l) => l.rel === 'approve')?.href;

  if (!approveLink) {
    throw new Error('PayPal order is missing the approve link');
  }

  return { id: data.id, approveUrl: approveLink };
}

export async function captureOrder(orderId: string): Promise<PayPalOrder> {
  const token = await getAccessToken();

  const res = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    },
  );

  const data = (await res.json().catch(() => null)) as PayPalOrder | null;

  if (!res.ok) {
    if ((data as { name?: string } | null)?.name === 'ORDER_ALREADY_CAPTURED') {
      return getOrder(orderId);
    }
    throw new Error(`PayPal capture failed with status ${res.status}`);
  }

  return data as PayPalOrder;
}

export async function getOrder(orderId: string): Promise<PayPalOrder> {
  const token = await getAccessToken();

  const res = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`PayPal get order failed with status ${res.status}`);
  }

  return (await res.json()) as PayPalOrder;
}

export interface OrderValidation {
  valid: boolean;
  reason?: string;
}

function captureAmount(order: PayPalOrder): PayPalAmount | null {
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  return capture?.amount ?? null;
}

export function validateOrder(order: PayPalOrder, profileHash: string): OrderValidation {
  if (order.status !== 'COMPLETED') {
    return { valid: false, reason: `Order status is '${order.status}', expected 'COMPLETED'` };
  }

  const unit = order.purchase_units?.[0];
  if (!unit) {
    return { valid: false, reason: 'Order is missing purchase units' };
  }

  const referenceId = unit.reference_id ?? '';
  const expectedAmount = expectedAmountFor(referenceId);
  if (expectedAmount === null) {
    return { valid: false, reason: `Product mismatch: got '${referenceId || 'undefined'}'` };
  }

  if (unit.custom_id !== profileHash) {
    return { valid: false, reason: 'Order is not associated with this profile' };
  }

  const amount = unit.amount ?? captureAmount(order);
  if (!amount) {
    return { valid: false, reason: 'Order is missing the amount' };
  }

  if (amount.currency_code !== PRODUCT_CURRENCY) {
    return { valid: false, reason: `Unexpected currency: ${amount.currency_code}` };
  }

  if (amount.value !== expectedAmount) {
    return { valid: false, reason: `Amount mismatch: got ${amount.value}, expected ${expectedAmount}` };
  }

  const capture = unit.payments?.captures?.[0];
  if (capture && capture.status !== 'COMPLETED') {
    return { valid: false, reason: `Capture status is '${capture.status}', expected 'COMPLETED'` };
  }

  return { valid: true };
}
