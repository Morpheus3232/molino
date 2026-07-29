import { NextRequest, NextResponse } from 'next/server';
import { createPreference } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { profileHash, currencyId } = await req.json();

    if (!profileHash) {
      return NextResponse.json(
        { error: 'profileHash is required' },
        { status: 400 }
      );
    }

    const preference = await createPreference(profileHash, currencyId);

    return NextResponse.json(preference);
  } catch (error) {
    console.error('[MP] Preference error:', error);
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 }
    );
  }
}
