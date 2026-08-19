import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    premiumEnabled: process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true',
    paypalEnabled: process.env.NEXT_PUBLIC_PAYPAL_ENABLED === 'true',
    mercadoPagoEnabled: process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === 'true',
    premiumPriceUsd: Number(process.env.NEXT_PUBLIC_PREMIUM_PRICE_USD) || 8,
  });
}