import { NextRequest, NextResponse } from 'next/server';
import { getGiftCode } from '@/lib/kv';

/**
 * Estado de un código para el DESTINATARIO, antes de mostrarle el
 * formulario de canje — nunca expone paymentId ni el profileHash de quién
 * ya lo canjeó, solo si puede seguir adelante.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const gift = await getGiftCode(codigo);

  if (!gift) {
    return NextResponse.json({ valid: false, reason: 'not_found' });
  }
  if (gift.redeemed) {
    return NextResponse.json({ valid: false, reason: 'already_redeemed' });
  }
  return NextResponse.json({ valid: true });
}
