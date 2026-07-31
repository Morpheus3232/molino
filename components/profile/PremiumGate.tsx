'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics/analytics';
import Button from '@/components/ui/Button';

interface PremiumGateProps {
  name: string;
  birthDate: string;
  children: React.ReactNode;
}

type GateState = 'locked' | 'paying' | 'verifying' | 'unlocked' | 'pay_error';

const POLL_INTERVAL = 5000;
const POLL_MAX_ATTEMPTS = 24;
const PRICE_USD = 8;

const PREMIUM_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true';

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

function cleanUrlParams() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('payment_status');
  url.searchParams.delete('payment_id');
  url.searchParams.delete('collection_id');
  url.searchParams.delete('collection_status');
  url.searchParams.delete('external_reference');
  url.searchParams.delete('preference_id');
  window.history.replaceState({}, '', url.pathname + url.search);
}

export default function PremiumGate({ name, birthDate, children }: PremiumGateProps) {
  const [state, setState] = useState<GateState>('locked');
  const [payError, setPayError] = useState<string | null>(null);
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPaymentId, setRecoverPaymentId] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);

  const checkServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/mp/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate }),
      });
      const data = await res.json();
      return data.premium === true;
    } catch {
      return false;
    }
  }, [name, birthDate]);

  useEffect(() => {
    const paymentStatus = getSearchParam('payment_status');
    const paymentId = getSearchParam('payment_id') || getSearchParam('collection_id');

    if (paymentStatus === 'approved' && paymentId) {
      setState('verifying');

      fetch('/api/mp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, name, birthDate }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.verified) {
            setState('unlocked');
            analytics.trackPremiumUnlocked();
            cleanUrlParams();
          } else {
            setPayError(data.reason || 'No se pudo verificar el pago');
            setState('pay_error');
          }
        })
        .catch(() => {
          setPayError('Error al verificar el pago');
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

  useEffect(() => {
    if (state !== 'verifying') return;

    pollAttemptsRef.current = 0;
    setPollTimedOut(false);

    pollRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current >= POLL_MAX_ATTEMPTS) {
        if (pollRef.current) clearInterval(pollRef.current);
        setPollTimedOut(true);
        return;
      }

      const premium = await checkServer();
      if (premium) {
        if (pollRef.current) clearInterval(pollRef.current);
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state, checkServer]);

  const handleCheckout = async () => {
    analytics.trackCheckoutStarted('USD');
    setCheckoutLoading(true);
    setPayError(null);

    try {
      const res = await fetch('/api/mp/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, currencyId: 'USD' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al crear el pago');
      }

      const data = await res.json();
      window.location.href = data.initPoint;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al iniciar el pago';
      setPayError(msg);
      setCheckoutLoading(false);
      setState('pay_error');
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverPaymentId.trim()) return;

    setIsRecovering(true);
    setRecoverError(null);

    try {
      const res = await fetch('/api/mp/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: recoverPaymentId.trim(), name, birthDate }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      } else {
        setRecoverError(data.error || data.reason || 'No se encontró una compra válida para este ID');
      }
    } catch {
      setRecoverError('Error al intentar recuperar la compra');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/mp/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: couponCode.trim(), name, birthDate }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      } else {
        setCouponError(data.reason || 'Código inválido');
      }
    } catch {
      setCouponError('Error al aplicar el cupón');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (!PREMIUM_ENABLED || state === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'locked' && (
        <motion.div
          key="locked"
          variants={blockVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-accent" aria-hidden="true" />
              <p className="label-micro text-accent font-semibold">Premium · Pago único</p>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-snug mb-4">
              Ya conocés tus piezas.
              <br className="hidden sm:block" />
              Ahora entendé cómo se conectan.
            </h3>

            <p className="text-base text-muted leading-relaxed mb-10 max-w-xl">
              Tu síntesis completa reúne tus sistemas en una sola lectura: qué patrones se alinean, qué tensiones aparecen y qué importa en tu momento actual.
            </p>

            <div className="border-t border-ink/10 pt-8 mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-5">QUÉ VAS A LEER</p>
              <ul className="space-y-3 text-sm text-foreground/90 leading-relaxed">
                <li className="flex items-baseline gap-3"><span className="w-4 h-px bg-accent shrink-0 translate-y-[-4px]" aria-hidden="true" />Cómo convergen tus sistemas.</li>
                <li className="flex items-baseline gap-3"><span className="w-4 h-px bg-accent shrink-0 translate-y-[-4px]" aria-hidden="true" />Qué tensiones aparecen entre ellos.</li>
                <li className="flex items-baseline gap-3"><span className="w-4 h-px bg-accent shrink-0 translate-y-[-4px]" aria-hidden="true" />Qué significa tu momento actual.</li>
                <li className="flex items-baseline gap-3"><span className="w-4 h-px bg-accent shrink-0 translate-y-[-4px]" aria-hidden="true" />Una recomendación personalizada.</li>
              </ul>
            </div>

            <div className="border-t border-ink/10 pt-10">
              <p className="label-micro mb-4 text-muted">Tu síntesis completa</p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-6xl sm:text-7xl leading-none tracking-tight text-foreground">${PRICE_USD}</span>
                <span className="font-heading text-xl font-semibold text-foreground uppercase tracking-wider">USD</span>
              </div>

              <p className="text-sm text-muted mb-8">Pago único · acceso permanente</p>

              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  analytics.trackCheckoutStarted('USD');
                  setState('paying');
                }}
              >
                Ver mi síntesis completa
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col sm:flex-row gap-x-8 gap-y-3">
              {!showRecover ? (
                <button
                  type="button"
                  onClick={() => setShowRecover(true)}
                  className="text-left text-xs text-muted hover:text-accent transition-colors"
                >
                  Recuperar acceso
                </button>
              ) : (
                <form onSubmit={handleRecover} className="space-y-2 max-w-xs">
                  <label className="text-xs text-muted block">ID de pago de Mercado Pago:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recoverPaymentId}
                      onChange={e => setRecoverPaymentId(e.target.value)}
                      placeholder="Ej: 123456789"
                      className="flex-1 px-3 py-2 text-sm border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isRecovering}
                      className="px-3 py-2 text-xs font-medium border border-ink/10 text-foreground hover:border-accent disabled:opacity-50 transition-colors"
                    >
                      {isRecovering ? '…' : 'OK'}
                    </button>
                  </div>
                  {recoverError && (
                    <p className="text-xs text-red-600">{recoverError}</p>
                  )}
                </form>
              )}

              {!showCoupon ? (
                <button
                  type="button"
                  onClick={() => setShowCoupon(true)}
                  className="text-left text-xs text-muted hover:text-accent transition-colors"
                >
                  Tengo un cupón
                </button>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2 max-w-xs">
                  <label className="text-xs text-muted block">Código de cupón:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Ingresá tu código"
                      className="flex-1 px-3 py-2 text-sm border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-3 py-2 text-xs font-medium border border-ink/10 text-foreground hover:border-accent disabled:opacity-50 transition-colors"
                    >
                      {isApplyingCoupon ? '…' : 'OK'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600">{couponError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {(state === 'paying' || state === 'pay_error' || state === 'verifying') && (
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
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted">Redirigiendo a Mercado Pago...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      Vas a ser redirigido a Mercado Pago para completar el pago de forma segura.
                      Cuando termines, volvés automáticamente para ver tu síntesis.
                    </p>
                    <Button variant="accent" size="lg" onClick={handleCheckout}>
                      Ir a pagar ${PRICE_USD} USD
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
                <p className="label-micro mb-3 text-red-600">No se pudo iniciar el pago</p>
                <p className="text-sm text-muted mb-1">{payError}</p>
                <p className="text-xs text-muted mb-6">Puede ser un problema temporal. Intentá de nuevo.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="accent"
                    onClick={() => {
                      setPayError(null);
                      setCheckoutLoading(false);
                      setState('paying');
                    }}
                  >
                    Reintentar
                  </Button>
                  <button
                    type="button"
                    onClick={() => setState('locked')}
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
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-6" />
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-1">Verificando tu pago…</h3>
                    <p className="text-sm text-muted">Esto solo toma unos segundos.</p>
                  </>
                ) : (
                  <>
                    <p className="label-micro mb-3">Todavía no vemos el pago</p>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      Si ya completaste el pago, ingresá el ID en "Recuperar acceso" desde tu mapa.
                    </p>
                    <Button variant="accent" onClick={() => setState('locked')}>
                      Recuperar acceso
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}