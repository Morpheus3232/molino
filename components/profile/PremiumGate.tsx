'use client';

import { useEffect, useState, useCallback, useRef, isValidElement, cloneElement, type ReactElement } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics/analytics';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { startLoading, stopLoading } from '@/lib/utils/loadingSignal';
import { useDictionary } from '@/lib/i18n/useDictionary';
import { savePremiumTokenClient, getOrCreateProfileSalt } from '@/lib/premium';
import { invalidatePremiumAccessCache } from '@/lib/hooks/usePremiumAccess';
import { useCommitPremiumUnlock, type GateState } from '@/lib/hooks/useCommitPremiumUnlock';
import { usePremiumCoupon } from '@/lib/hooks/usePremiumCoupon';
import { usePremiumRecovery } from '@/lib/hooks/usePremiumRecovery';
import { usePremiumCheckout } from '@/lib/hooks/usePremiumCheckout';
import PremiumPaywallContent from '@/components/premium/PremiumPaywallContent';

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

const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeOut" as const } },
};

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

    checkServer().then(premium => {
      if (premium) {
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      } else {
        analytics.trackPaywallViewed();
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center gap-3 mb-8 pb-6 border-b border-accent/20"
        >
          <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {preview?.tension
                ? <>Desbloqueaste tu tensión: {preview.tension.title.toLowerCase()}</>
                : "Desbloqueaste tu síntesis completa"}
            </p>
            <p className="text-xs text-muted">Acceso permanente — la vas a encontrar acá cada vez que vuelvas.</p>
          </div>
        </motion.div>
        {/* justUnlocked pasa a MolinoInterpretation para que, mientras carga,
            muestre un estado de espera propio de la revelación en vez del
            skeleton genérico — sin esto, el usuario ve "desbloqueaste tu
            síntesis" y un instante después una SEGUNDA pantalla de carga
            desconectada, como si el desbloqueo hubiera fallado a medias. */}
        {isValidElement(children) ? cloneElement(children as ReactElement<{ justUnlocked?: boolean }>, { justUnlocked: true }) : children}
      </motion.div>
    );
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
        <motion.div
          key="payment-flow"
          variants={blockVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-md"
        >
          <AnimatePresence mode="wait">
            {state === 'paying' && (
              <motion.div key="paying" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
                <p className="label-micro mb-3">Pago seguro · Mercado Pago</p>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">Tu síntesis completa</h3>
                <p className="text-sm text-muted mb-6">Pago único · Acceso permanente</p>

                {checkoutLoading ? (
                  <div className="flex flex-col items-center py-12 gap-3">
                    <Logo className="w-8 h-8 text-accent" spinning />
                    <p className="text-sm text-muted">
                      Redirigiendo a Mercado Pago...
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      Vas a ser redirigido para completar el pago de forma segura.
                      Cuando termines, volvés automáticamente para ver tu síntesis.
                    </p>
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={() => startCheckout()}
                    >
                      Ir a pagar ${chargePriceUsd} USD
                    </Button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setState('locked')}
                  className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
                >
                  ← Volver
                </button>
              </motion.div>
            )}

            {state === 'pay_error' && (
              <motion.div key="pay_error" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
                <p className="label-micro mb-3 text-red-600">
                  {verificationError ? 'No se pudo verificar tu pago' : 'No se pudo iniciar el pago'}
                </p>
                <p className="text-sm text-muted mb-1">{payError ?? verificationError}</p>
                <p className="text-xs text-muted mb-6">
                  {verificationError
                    ? 'Si ya te cobraron, usá "Recuperar acceso" con el ID de tu pago.'
                    : 'Puede ser un problema temporal. Intentá de nuevo.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="accent"
                    onClick={() => {
                      if (verificationError) {
                        setVerificationError(null);
                        setState('locked');
                        setShowRecover(true);
                        return;
                      }
                      setPayError(null);
                      setCheckoutLoading(false);
                      setState('paying');
                    }}
                  >
                    {verificationError ? 'Recuperar acceso' : 'Reintentar'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setPayError(null); setVerificationError(null); setState('locked'); }}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </motion.div>
            )}

            {state === 'verifying' && (
              <motion.div key="verifying" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
                {!pollTimedOut ? (
                  <>
                    <Logo className="w-8 h-8 text-accent mb-6" spinning />
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-1">Verificando tu pago…</h3>
                    <p className="text-sm text-muted">Puede tardar hasta 60 segundos.</p>
                  </>
                ) : (
                  <>
                    <p className="label-micro mb-3">Todavía no vemos el pago</p>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      Si ya completaste el pago, ingresá el ID en &ldquo;Recuperar acceso&rdquo; desde tu mapa.
                    </p>
                    <Button variant="accent" onClick={() => setState('locked')}>
                      Recuperar acceso
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {state === 'verifying_redirect' && (
              <motion.div key="verifying_redirect" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
                <Logo className="w-8 h-8 text-accent mb-6" spinning />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">Verificando tu pago…</h3>
                <p className="text-sm text-muted">Volviste de Mercado Pago. Confirmando tu compra.</p>
                {verificationError && (
                  <p className="mt-4 text-sm text-red-600">{verificationError}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}