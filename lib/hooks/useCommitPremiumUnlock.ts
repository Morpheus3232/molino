'use client';

import { useCallback } from 'react';
import { analytics } from '@/lib/analytics/analytics';
import { savePremiumTokenClient } from '@/lib/premium';
import { invalidatePremiumAccessCache } from '@/lib/hooks/usePremiumAccess';
import { clearSelectedPlan } from '@/lib/session/selectedPlan';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import { encodeProfileData } from '@/lib/utils/profileShare';

export type GateState = 'locked' | 'paying' | 'verifying' | 'unlocked' | 'pay_error' | 'verifying_redirect';

function cleanUrlParams() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('payment_status');
  url.searchParams.delete('payment_id');
  url.searchParams.delete('collection_id');
  url.searchParams.delete('collection_status');
  url.searchParams.delete('external_reference');
  url.searchParams.delete('preference_id');
  url.searchParams.delete('payment_method');
  url.searchParams.delete('token');
  url.searchParams.delete('PayerID');
  url.searchParams.delete('claimed');
  window.history.replaceState({}, '', url.pathname + url.search);
}

interface UseCommitPremiumUnlockParams {
  setState: (state: GateState) => void;
  setJustUnlocked: (value: boolean) => void;
  name?: string;
  birthDate: string;
}

/**
 * Single source of truth for "effectivize the unlock" — the 6-line sequence
 * that used to be duplicated 3 times (redirect verification, recover,
 * coupon): flip state to 'unlocked', mark justUnlocked for the reveal
 * animation, clear any selected plan, persist the device-bound premium
 * token if one came back, invalidate the cached access check, and track
 * the analytics event. `cleanUrl: true` additionally strips MP's payment
 * query params from the URL (only the redirect-verification call site needs
 * this — recover/coupon never had those params to begin with).
 */
export function useCommitPremiumUnlock({ setState, setJustUnlocked, name, birthDate }: UseCommitPremiumUnlockParams) {
  return useCallback(
    (premiumToken: string | undefined, opts?: { cleanUrl?: boolean }) => {
      setState('unlocked');
      setJustUnlocked(true);
      clearSelectedPlan();
      if (premiumToken) savePremiumTokenClient(premiumToken);
      invalidatePremiumAccessCache(name, birthDate);
      analytics.trackPremiumUnlocked();
      if (opts?.cleanUrl) cleanUrlParams();
      // "La Lectura" se abre en su propia pestaña — misma origin, así que
      // lee el premiumToken recién guardado arriba desde localStorage sin
      // necesidad de pasarlo por la URL. Si el navegador bloquea el popup
      // (frecuente cuando este código corre fuera de un click directo, ej.
      // el redirect de vuelta de Mercado Pago), PremiumUnlockReveal muestra
      // un botón "Abrir mi lectura" como respaldo — no falla en silencio.
      // El perfil viaja en el fragmento (#), nunca en la query string: un
      // fragmento no sale del navegador (no llega al servidor ni a logs),
      // mismo esquema que /profile#<hash>.
      if (typeof window !== 'undefined' && birthDate) {
        const encoded = encodeProfileData(calculateUserProfile(name || '', birthDate));
        window.open(`/lectura#${encoded}`, '_blank');
      }
    },
    [setState, setJustUnlocked, name, birthDate],
  );
}
