import { NextRequest, NextResponse } from 'next/server';
import { getGiftCode } from '@/lib/kv';

/**
 * Estado de un código para el COMPRADOR — puede consultar si ya fue
 * canjeado, pero nunca quién lo canjeó (no se expone redeemedProfileHash,
 * el comprador no tiene por qué saber la identidad hasheada de a quién
 * regaló, mucho menos indirectamente derivar su fecha de nacimiento).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const gift = await getGiftCode(codigo);

  if (!gift) {
    return NextResponse.json({ found: false });
  }
  return NextResponse.json({ found: true, redeemed: gift.redeemed });
}
