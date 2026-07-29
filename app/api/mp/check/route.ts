import { NextRequest, NextResponse } from 'next/server';
import { hasPremiumAccess } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { profileHash } = await req.json();

    if (!profileHash) {
      return NextResponse.json(
        { error: 'profileHash is required' },
        { status: 400 }
      );
    }

    const premium = await hasPremiumAccess(profileHash);

    return NextResponse.json({ premium });
  } catch (error) {
    console.error('[MP Check] Error:', error);
    return NextResponse.json(
      { error: 'Check failed', premium: false },
      { status: 500 }
    );
  }
}
