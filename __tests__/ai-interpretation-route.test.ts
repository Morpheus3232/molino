import { vi, describe, test, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// The legacy route blocks premium types before any AI call — the AI provider
// must never be reached. The route does not touch kv/premium state, so no
// entitlement mocking is needed here: the block is type-based.
const mockGenerateWithRouting = vi.fn();
vi.mock('@/lib/engines/providerRouter', () => ({
  generateWithRouting: (...args: unknown[]) => mockGenerateWithRouting(...args),
  getProviderStatus: vi.fn(),
}));

import { POST } from '@/app/api/ai/interpretation/route';

let ipCounter = 0;

function req(body: Record<string, unknown>) {
  ipCounter += 1;
  return new NextRequest('http://localhost/api/ai/interpretation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/ai/interpretation — legacy premium block contract', () => {
  beforeEach(() => {
    mockGenerateWithRouting.mockReset();
  });

  const CONTEXT = { userProfile: { name: 'Test', birthDate: '1990-04-15' } };

  test('personal_profile is rejected with the same structured premium contract', async () => {
    const res = await POST(req({ type: 'personal_profile', context: CONTEXT }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBeTruthy();
    expect(data.error.code).toBe('premium_required');
    expect(data.error.message).toBe('Premium content is not served by this endpoint');
    expect(mockGenerateWithRouting).not.toHaveBeenCalled();
  });

  test('question is rejected with the same structured premium contract', async () => {
    const res = await POST(req({ type: 'question', context: CONTEXT, question: 'hola' }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error.code).toBe('premium_required');
    expect(mockGenerateWithRouting).not.toHaveBeenCalled();
  });
});
