import { NextRequest, NextResponse } from 'next/server';
import { createShareToken, generateTokenId, verifyShareToken } from '@/lib/share';
import { storeShareProfile, resolveShareProfile } from '@/lib/kv';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import { hashProfile } from '@/lib/mercadopago';
import type { UserProfile } from '@/types/user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create (POST) / Resolve (GET) a PII-free ephemeral profile share.
 *
 * POST body: { name?, birthDate, salt? }
 *   → stores the minimal profile in KV (24h TTL) and returns
 *     { token, url } where url = `${origin}/profile?share=<token>`.
 *
 * GET ?token=<jwt>
 *   → verifies the token, resolves the profile from KV, and returns the
 *     full recomputed UserProfile (same shape ProfilePage produces), or
 *     404/410 if invalid/expired.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const birthDate = typeof body?.birthDate === 'string' ? body.birthDate : '';
    const name = typeof body?.name === 'string' ? body.name : '';
    const salt = typeof body?.salt === 'string' ? body.salt : undefined;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return NextResponse.json({ error: 'Invalid birthDate' }, { status: 400 });
    }

    const hash = hashProfile(name || '', birthDate, salt);
    const tid = generateTokenId();

    const stored = await storeShareProfile(tid, { n: name || undefined, b: birthDate, h: hash });
    if (!stored) {
      return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 });
    }

    const token = createShareToken(tid);
    const origin = new URL(req.url).origin;
    return NextResponse.json({ token, url: `${origin}/profile?share=${token}` });
  } catch (error) {
    console.error('[Share] Error creating share:', error);
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const payload = verifyShareToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const profile = await resolveShareProfile(payload.tid);
    if (!profile) {
      // Token is valid but the KV entry expired/evicted.
      return NextResponse.json({ error: 'Share expired' }, { status: 410 });
    }

    const calculated = calculateUserProfile(profile.n || '', profile.b);
    const full: UserProfile = {
      ...calculated,
      name: profile.n || '',
      birthDate: profile.b,
      birthPlace: '',
      goal: 'life' as const,
      interests: [],
      onboardingStep: 4,
      completedSections: ['identity'],
      theme: 'light' as const,
      language: 'es' as const,
      notifications: true,
      cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
      recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
    };

    return NextResponse.json({ profile: full });
  } catch (error) {
    console.error('[Share] Error resolving share:', error);
    return NextResponse.json({ error: 'Failed to resolve share' }, { status: 500 });
  }
}
