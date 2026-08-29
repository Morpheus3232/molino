import { NextResponse } from 'next/server';
import {
  getBtcAddress,
  isBtcEnabled,
  fetchBtcUsdRate,
  usdToSats,
  satsToBtc,
  buildPaymentUri,
  BTC_PRODUCT_PRICE_USD,
} from '@/lib/bitcoin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Cuánto BTC pagar y a dónde.
 *
 * La dirección sale de la env var BTC_ADDRESS: se rota sin deploy y nunca
 * viaja en el repo. Sin esa variable el pago en BTC queda deshabilitado y la
 * UI no lo ofrece — no hay dirección por defecto.
 *
 * La cotización NO se guarda por orden. Al verificar el pago se recalcula con
 * el precio de ese momento y se aplica una tolerancia (ver lib/bitcoin.ts),
 * así no hay estado que expire ni ventana que vencer.
 */
export async function GET() {
  if (!isBtcEnabled()) {
    return NextResponse.json({ enabled: false }, { status: 503 });
  }

  try {
    const address = getBtcAddress();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let rate: number;
    try {
      rate = await fetchBtcUsdRate(controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    const sats = usdToSats(BTC_PRODUCT_PRICE_USD, rate);

    return NextResponse.json({
      enabled: true,
      address,
      sats,
      btc: satsToBtc(sats).toFixed(8),
      usd: BTC_PRODUCT_PRICE_USD,
      rate,
      uri: buildPaymentUri(address, sats),
    });
  } catch (error) {
    console.error('[BTC quote]', error);
    return NextResponse.json(
      { enabled: true, error: 'No pudimos cotizar BTC en este momento. Probá de nuevo en un minuto.' },
      { status: 503 },
    );
  }
}
