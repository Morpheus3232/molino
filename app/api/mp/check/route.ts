import { NextRequest, NextResponse } from 'next/server';
import { hasPremiumAccess } from '@/lib/kv';
import { hashProfile } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate } = await req.json();

    if (!name || !birthDate) {
      return NextResponse.json(
        { error: 'name and birthDate are required' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name, birthDate);
    const premium = await hasPremiumAccess(profileHash);

    return NextResponse.json({ premium });
  } catch (error) {
    console.error('[MP Check] Error:', error);
    return NextResponse.json(
      { error: 'Check failed', premium: false },
      { status: 500 },
    );
  }
}
