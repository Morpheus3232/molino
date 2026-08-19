import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { usePremiumAccess, invalidatePremiumAccessCache } from '@/lib/hooks/usePremiumAccess';
import { getPremiumTokenClient, clearPremiumTokenClient } from '@/lib/premium';

const originalFetch = global.fetch;

describe('usePremiumAccess', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    clearPremiumTokenClient();
  });

  test('persiste el premiumToken devuelto por /api/mp/check (no lo descarta)', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ premium: true, premiumToken: 'token-abc-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const { result } = renderHook(() => usePremiumAccess('Test', '1990-01-01'));

    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(getPremiumTokenClient()).toBe('token-abc-123');
  });

  test('un estado false obtenido antes del unlock no queda congelado: invalidatePremiumAccessCache fuerza un re-check', async () => {
    const birthDate = '1985-05-05';
    let call = 0;
    global.fetch = vi.fn(async () => {
      call += 1;
      // Primer chequeo (antes del unlock): todavía no es premium.
      // Segundo chequeo (después de invalidar, simulando un unlock real en
      // otro componente como PremiumGate): ya es premium, con token.
      const body = call === 1
        ? { premium: false }
        : { premium: true, premiumToken: 'token-post-unlock' };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const { result } = renderHook(() => usePremiumAccess('Otra', birthDate));

    await waitFor(() => expect(result.current.isPremium).toBe(false));

    // Simula PremiumGate confirmando un unlock real en otro componente de la
    // misma página — sin esto, isPremium se quedaría en `false` para siempre
    // en esta instancia ya montada (el bug reportado).
    invalidatePremiumAccessCache('Otra', birthDate);

    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(call).toBe(2);
  });
});
