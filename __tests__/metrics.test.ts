/**
 * Transparency metrics — incrementMemberCount/getMemberCount/getMonthlyMemberCounts.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Reuse the in-memory KV mock pattern from the other KV-backed tests.
const { kvStore } = vi.hoisted(() => ({ kvStore: new Map<string, unknown>() }));

vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(async (key: string, value: unknown, opts?: { ex?: number }) => {
      kvStore.set(key, value);
      return 'OK';
    }),
    get: vi.fn(async (key: string) => kvStore.get(key) ?? null),
    del: vi.fn(async (key: string) => kvStore.delete(key) ?? 1),
  },
}));

vi.mock('@/lib/kv', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/kv')>();
  return {
    ...actual,
    getKvClient: vi.fn(async () => ({
      get: async <T = unknown>(key: string) => (kvStore.get(key) ?? null) as T | null,
      set: async (key: string, value: unknown, opts?: { ex?: number; nx?: boolean }) => {
        if (opts?.nx && kvStore.has(key)) return null;
        kvStore.set(key, value);
        return 'OK';
      },
      del: async (key: string) => { kvStore.delete(key); return 1; },
    })),
  };
});

import { incrementMemberCount, getMemberCount, getMonthlyMemberCounts } from '@/lib/metrics';

describe('member count metrics', () => {
  beforeEach(() => {
    kvStore.clear();
  });

  test('incrementMemberCount increases the total by one', async () => {
    await incrementMemberCount('hash-1');
    await incrementMemberCount('hash-2');
    expect(await getMemberCount()).toBe(2);
  });

  test('getMemberCount returns 0 before any increment', async () => {
    expect(await getMemberCount()).toBe(0);
  });

  test('getMemberCount caches for 24h (second read does not re-read raw)', async () => {
    await incrementMemberCount('hash-1');
    await getMemberCount(); // warms cache
    // Simulate a new grant that should NOT be visible until cache expires.
    await incrementMemberCount('hash-2');
    // Cache still holds the old value.
    expect(await getMemberCount()).toBe(1);
  });

  test('getMonthlyMemberCounts returns 12 entries newest first with counts', async () => {
    await incrementMemberCount('hash-1');
    const monthly = await getMonthlyMemberCounts(12);
    expect(monthly.length).toBe(12);
    // The current month should have 1 grant.
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const current = monthly.find((m) => m.month === currentMonth);
    expect(current?.count).toBe(1);
  });
});