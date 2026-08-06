import { NextResponse } from 'next/server';
import { getProviderStatus } from '@/lib/engines/providerRouter';

export async function GET() {
  const status = getProviderStatus();
  return NextResponse.json(status);
}