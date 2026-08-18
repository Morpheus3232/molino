'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics/analytics';
import { startLoading, stopLoading } from '@/lib/utils/loadingSignal';
import { useDictionary } from '@/lib/i18n/useDictionary';
import { savePremiumTokenClient, getOrCreateProfileSalt } from '@/lib/premium';
import { invalidatePremiumAccessCache } from '@/lib/hooks/usePremiumAccess';
import { useCommitPremiumUnlock, type GateState } from '@/lib/hooks/useCommitPremiumUnlock';
import { usePremiumCoupon } from '@/lib/hooks/usePremiumCoupon';
import { usePremiumRecovery } from '@/lib/hooks/usePremiumRecovery';
import { usePremiumCheckout } from '@/lib/hooks/usePremiumCheckout';
import PremiumPaywallContent from '@/components/premium/PremiumPaywallContent';
import PremiumPaymentStatus from '@/components/premium/PremiumPaymentStatus';
import PremiumUnlockReveal from '@/components/premium/PremiumUnlockReveal';

interface PremiumGatePreview {
  lifePath: number;
  chineseZodiac: string;
  /**
   * Un pattern ya calculado gratis (buildPatterns → "Tu motor"), no un dato
   * nuevo inventado para el paywall. `sources.length > 1` solo si el engine
   * verificó una convergencia real entre dos sistemas independientes (ver
   * findSharedTheme en synthesisEngine.ts) — por eso el copy de abajo tiene
   * dos ramas honestas en vez de asumir siempre que "hay una conexión".
   */
  pattern: { keyword: string; sources: string[] } | null;
  /**
   * buildTensions(profile)[0] ya calculado gratis en LecturaProfunda (hoy
   * solo se muestra post-pago en "Ver conexiones") — es la señal más
   * específica que existe, así que gana prioridad sobre `pattern` cuando
   * está presente. null para la mayoría de los perfiles: el desfasaje
   * ritmo-elemento no es universal, y no se inventa uno cuando no lo hay.
   */
  tension: { title: string; evidence: string } | null;
  /**
   * generatePaywallHook(profile) (synthesisEngine.ts) — reformula el mismo
   * pattern/tension de arriba como pregunta abierta en vez de resumen.
   * Reemplaza el preview de PremiumPaywallContent; pattern/tension se
   * conservan porque PremiumUnlockReveal los usa por separado post-pago.
   */
  hook: { question: string; context: string };
}

interface PremiumGateProps {
  name?: string;
  birthDate: string;
  preview?: PremiumGatePreview;
  children: React.ReactNode;
  /** Moneda para el checkout (ARS | USD). Default: ARS */
  currencyId?: 'ARS' | 'USD';
}

const POLL_SCHEDULE_MS = [5000, 10000, 20000, 30000]; // Exponential backoff: 5→10→20→30s
const POLL_MAX_ATTEMPTS = 10;

interface FeatureFlags {
  premiumEnabled: boolean;
  mercadoPagoEnabled: boolean;
  premiumPriceUsd: number;
}

function getDefaultFlags(): FeatureFlags {
  return {
    premiumEnabled: true,
    mercadoPagoEnabled: true,
    premiumPriceUsd: 8,
  };
}

function getSearchParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export default function PremiumGate({ name, birthDate, preview, children, currencyId = 'ARS' }: PremiumGateProps) {
  const t = useDictionary();
  const [state, setState] = useState<GateState>('locked');
  // Distingue "acabo de pagar/recuperar en esta sesión" de "ya era premium al
  // entrar" (checkServer() en el mount inicial) — solo el primer caso merece
  // el momento de revelación; un usuario que vuelve no necesita la fanfarria.
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [flags, setFlags] = useState<FeatureFlags>(getDefaultFlags());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);

  const commitUnlock = useCommitPremiumUnlock({ setState, setJustUnlocked, name, birthDate });
  const {
    showCoupon,
    setShowCoupon,
    couponCode,
    setCouponCode,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
  } = usePremiumCoupon({ name, birthDate, commitUnlock });
  const {
    showRecover,
    setShowRecover,
    recoverPaymentId,
    setRecoverPaymentId,
    recoverError,
    isRecovering,
    handleRecover,
    cancel: cancelRecover,
  } = usePremiumRecovery({ name, birthDate, commitUnlock });
  const {
    checkoutLoading,
    setCheckoutLoading,
    payError,
    setPayError,
    startCheckout,
  } = usePremiumCheckout({ name, birthDate, currencyId, mercadoPagoEnabled: flags.mercadoPagoEnabled, setState });

  // Único producto activo: pago único de $8 USD (Opción A — Pro/Familiar
  // desactivados, ver components/pricing/pricing-data.ts).
  const chargePriceUsd = flags.premiumPriceUsd;

  // Fetch feature flags from API (runtime-configurable, no rebuild needed)
  useEffect(() => {
    fetch('/api/features/flags')
      .then(res => res.json())
      .then(data => setFlags(data))
      .catch(() => {}); // fallback to defaults
  }, []);

  const checkServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/mp/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, salt: getOrCreateProfileSalt() }),
      });
      const data = await res.json();
      // Re-sync the device-bound token whenever the server confirms premium:
      // a returning visit can be premium (hasPremiumAccess) yet have no valid
      // localStorage token (cleared storage, new browser/device), which would
      // otherwise 403 every AI call downstream while this gate shows "unlocked".
      if (data.premium === true && data.premiumToken) {
        savePremiumTokenClient(data.premiumToken);
        invalidatePremiumAccessCache(name, birthDate);
      }
      return data.premium === true;
    } catch {
      return false;
    }
  }, [name, birthDate]);

  useEffect(() => {
    const paymentStatus = getSearchParam('payment_status');
    const paymentId = getSearchParam('payment_id') || getSearchParam('collection_id');

    if (paymentStatus === 'approved' && paymentId) {
      setState('verifying_redirect');

      fetch('/api/mp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, name, birthDate, salt: getOrCreateProfileSalt() }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.verified) {
            commitUnlock(data.premiumToken, { cleanUrl: true });
          } else {
            setVerificationError(data.reason || 'No se pudo verificar el pago');
            setState('pay_error');
          }
        })
        .catch(() => {
          setVerificationError('Error al verificar el pago');
          setState('pay_error');
        });
      return;
    }

    // Vuelta de /premium/claim (recuperación por link, otro dispositivo): el
    // token ya se guardó ahí — solo falta reflejar el desbloqueo acá, mismo
    // tratamiento que un pago o una recuperación por cupón.
    if (getSearchParam('claimed') === '1') {
      commitUnlock(undefined, { cleanUrl: true });
      return;
    }

    checkServer().then(premium => {
      if (premium) {
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      } else {
        analytics.trackPaywallViewed();
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Un desbloqueo real (pago, recover, cupón, claim) vuelve como carga de
  // página nueva cuando viene de un redirect externo (Mercado Pago) — el
  // navegador no preserva el scroll, así que el usuario aparece arriba de
  // /profile con 4-6 pantallas de contenido ya visto antes de llegar a lo
  // que acaba de desbloquear. El delay deja terminar el mount de
  // PremiumUnlockReveal (fade + slide, ~0.55s) antes de scrollear.
  useEffect(() => {
    if (state !== 'unlocked' || !justUnlocked) return;
    const id = setTimeout(() => {
      document.getElementById('lectura-premium-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
    return () => clearTimeout(id);
  }, [state, justUnlocked]);

  // El molino del header gira mientras se confirma un pago real — refuerza
  // la metáfora de "procesando" justo en el momento de mayor ansiedad del
  // flujo (después de volver de Mercado Pago).
  useEffect(() => {
    if (state !== 'verifying' && state !== 'verifying_redirect') return;
    startLoading();
    return () => stopLoading();
  }, [state]);

  useEffect(() => {
    // Only poll when we're explicitly verifying (not on redirect verification)
    if (state !== 'verifying') return;

    pollAttemptsRef.current = 0;
    setPollTimedOut(false);

    let currentTimeout: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current > POLL_SCHEDULE_MS.length) {
        setPollTimedOut(true);
        return;
      }

      const premium = await checkServer();
      if (premium) {
        setState('unlocked');
        setJustUnlocked(true);
        analytics.trackPremiumUnlocked();
        return;
      }

      const delay = POLL_SCHEDULE_MS[Math.min(pollAttemptsRef.current, POLL_SCHEDULE_MS.length - 1)];
      currentTimeout = setTimeout(poll, delay);
    };

    // Start with first delay
    currentTimeout = setTimeout(poll, POLL_SCHEDULE_MS[0]);

    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [state, checkServer]);

  if (!flags.premiumEnabled) {
    return <>{children}</>;
  }

  if (state === 'unlocked') {
    // El pago no termina en "gracias, listo" silencioso: la primera vez que
    // se desbloquea en esta sesión, el contenido entra con una revelación
    // propia en vez de aparecer sin más. Un usuario que vuelve otro día
    // (justUnlocked queda false, nunca se seteó) ve el contenido directo.
    if (!justUnlocked) return <>{children}</>;
    return <PremiumUnlockReveal preview={preview}>{children}</PremiumUnlockReveal>;
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'locked' && (
        <PremiumPaywallContent
          t={t}
          preview={preview}
          chargePriceUsd={chargePriceUsd}
          mercadoPagoEnabled={flags.mercadoPagoEnabled}
          onCheckout={() => startCheckout()}
          showRecover={showRecover}
          setShowRecover={setShowRecover}
          recoverPaymentId={recoverPaymentId}
          setRecoverPaymentId={setRecoverPaymentId}
          recoverError={recoverError}
          isRecovering={isRecovering}
          handleRecover={handleRecover}
          cancelRecover={cancelRecover}
          showCoupon={showCoupon}
          setShowCoupon={setShowCoupon}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponError={couponError}
          isApplyingCoupon={isApplyingCoupon}
          handleApplyCoupon={handleApplyCoupon}
        />
      )}

      {(state === 'paying' || state === 'pay_error' || state === 'verifying' || state === 'verifying_redirect') && (
        <PremiumPaymentStatus
          state={state}
          checkoutLoading={checkoutLoading}
          chargePriceUsd={chargePriceUsd}
          payError={payError}
          verificationError={verificationError}
          pollTimedOut={pollTimedOut}
          startCheckout={() => startCheckout()}
          setState={setState}
          setVerificationError={setVerificationError}
          setShowRecover={setShowRecover}
          setPayError={setPayError}
          setCheckoutLoading={setCheckoutLoading}
        />
      )}
    </AnimatePresence>
  );
}