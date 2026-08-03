import { NextRequest, NextResponse } from 'next/server';
import { createPreference, hashProfile } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, currencyId } = await req.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: 'birthDate is required' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name ?? '', birthDate);
    const preference = await createPreference(profileHash, name ?? '', currencyId);

    return NextResponse.json(preference);
  } catch (error) {
    console.error('[MP Preference] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 },
    );
  }
}
