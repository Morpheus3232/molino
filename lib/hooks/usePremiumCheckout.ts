'use client';

import { useState, useCallback } from 'react';
import { analytics } from '@/lib/analytics/analytics';
import { getOrCreateProfileSalt } from '@/lib/premium';
import type { GateState } from '@/lib/hooks/useCommitPremiumUnlock';

interface UsePremiumCheckoutParams {
  name?: string;
  birthDate: string;
  currencyId: 'ARS' | 'USD';
  mercadoPagoEnabled: boolean;
  setState: (state: GateState) => void;
}

/**
 * Checkout doesn't unlock anything by itself (that happens later, via
 * redirect verification or polling — see useCommitPremiumUnlock) — it only
 * creates the MP preference and navigates away. checkoutLoading/payError
 * are also read/written directly by the payment-flow UI (the 'pay_error'
 * retry button resets them before re-attempting), so both setters are
 * exposed, not just the start action.
 */
export function usePremiumCheckout({ name, birthDate, currencyId, mercadoPagoEnabled, setState }: UsePremiumCheckoutParams) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    if (checkoutLoading) return; // Prevent double-click
    // Defensa contra CTAs que quedaron habilitados por un estado stale de
    // `flags` (fetch todavía en vuelo): el flag es la fuente de verdad, no
    // la presencia del botón.
    if (!mercadoPagoEnabled) return;

    analytics.trackCheckoutStarted('USD', 'mercadopago');
    setCheckoutLoading(true);
    setPayError(null);
    setState('paying');

    const profileSalt = getOrCreateProfileSalt();

    try {
      const res = await fetch('/api/mp/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate,
          currencyId,
          salt: profileSalt,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al crear el pago');
      }

      const data = await res.json();
      // El server ya resolvió cuál URL corresponde (ver isTestCredentials en
      // lib/mercadopago.ts) — MP devuelve sandbox_init_point poblado siempre,
      // sin importar el modo del token, así que decidir acá con "¿vino el
      // campo?" mandaba usuarios reales a sandbox.
      window.location.href = data.checkoutUrl;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al iniciar el pago';
      setPayError(msg);
      setCheckoutLoading(false);
      setState('pay_error');
    }
  }, [checkoutLoading, mercadoPagoEnabled, name, birthDate, currencyId, setState]);

  return {
    checkoutLoading,
    setCheckoutLoading,
    payError,
    setPayError,
    startCheckout,
  };
}
