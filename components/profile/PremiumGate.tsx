'use client';

import { useEffect, useState, useCallback, useRef, isValidElement, cloneElement, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics/analytics';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { startLoading, stopLoading } from '@/lib/utils/loadingSignal';
import { useDictionary } from '@/lib/i18n/useDictionary';

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
}

interface PremiumGateProps {
  name?: string;
  birthDate: string;
  preview?: PremiumGatePreview;
  children: React.ReactNode;
}

type GateState = 'locked' | 'paying' | 'verifying' | 'unlocked' | 'pay_error' | 'verifying_redirect';

const POLL_INTERVAL = 5000;
const POLL_MAX_ATTEMPTS = 24;
const PRICE_USD = 8;

const PREMIUM_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true';
// PayPal requiere PAYPAL_CLIENT_ID/SECRET server-side; en entornos donde no
// están configurados, /api/paypal/create-order falla con 500. Este flag deja
// mostrar Mercado Pago sin ofrecer un botón de pago roto.
const PAYPAL_ENABLED = process.env.NEXT_PUBLIC_PAYPAL_ENABLED === 'true';

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
  url.searchParams.delete('payment_method');
  url.searchParams.delete('token');
  url.searchParams.delete('PayerID');
  window.history.replaceState({}, '', url.pathname + url.search);
}

export default function PremiumGate({ name, birthDate, preview, children }: PremiumGateProps) {
  const t = useDictionary();
  const [state, setState] = useState<GateState>('locked');
  // Distingue "acabo de pagar/recuperar en esta sesión" de "ya era premium al
  // entrar" (checkServer() en el mount inicial) — solo el primer caso merece
  // el momento de revelación; un usuario que vuelve no necesita la fanfarria.
  const [justUnlocked, setJustUnlocked] = useState(false);
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
  const [checkoutMethod, setCheckoutMethod] = useState<'mercadopago' | 'paypal' | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
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
    const paymentMethod = getSearchParam('payment_method');
    const paypalOrderId = getSearchParam('token');
    const paymentId = getSearchParam('payment_id') || getSearchParam('collection_id');

    if (paymentStatus === 'approved' && paymentMethod === 'paypal' && paypalOrderId) {
      setState('verifying_redirect');

      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: paypalOrderId, name, birthDate }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.verified) {
            setState('unlocked');
            setJustUnlocked(true);
            analytics.trackPaymentApproved(paypalOrderId, 'paypal');
            analytics.trackPremiumUnlocked();
            cleanUrlParams();
          } else {
            setVerificationError(data.reason || 'No se pudo confirmar el pago de PayPal');
            setState('pay_error');
          }
        })
        .catch(() => {
          setVerificationError('Error al confirmar el pago de PayPal');
          setState('pay_error');
        });
      return;
    }

    if (paymentStatus === 'approved' && paymentId) {
      setState('verifying_redirect');

      fetch('/api/mp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, name, birthDate }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.verified) {
            setState('unlocked');
            setJustUnlocked(true);
            analytics.trackPremiumUnlocked();
            cleanUrlParams();
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
  // flujo (después de volver de Mercado Pago/PayPal).
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
        setJustUnlocked(true);
        analytics.trackPremiumUnlocked();
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state, checkServer]);

  const handleCheckout = async (method: 'mercadopago' | 'paypal') => {
    analytics.trackCheckoutStarted('USD', method);
    setCheckoutMethod(method);
    setCheckoutLoading(true);
    setPayError(null);
    setState('paying');

    try {
      if (method === 'paypal') {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, birthDate }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear el pago');
        }

        const data = await res.json();
        window.location.href = data.approveUrl;
        return;
      }

      const res = await fetch('/api/mp/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, currencyId: 'ARS' }),
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
  };

  const handleRecover = async (e: React.FormEvent, method: 'mercadopago' | 'paypal') => {
    e.preventDefault();
    if (!recoverPaymentId.trim()) return;

    setIsRecovering(true);
    setRecoverError(null);

    try {
      const endpoint = method === 'mercadopago' ? '/api/mp/recover' : '/api/paypal/recover';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: recoverPaymentId.trim(), name, birthDate }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setState('unlocked');
        setJustUnlocked(true);
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
        setJustUnlocked(true);
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

  if (!PREMIUM_ENABLED) {
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
            <p className="text-sm font-semibold text-foreground">Desbloqueaste tu síntesis completa</p>
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
              <p className="label-micro text-accent font-semibold">{t.premium.eyebrow}</p>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-snug mb-4">
              {t.premium.headline}
              <br className="hidden sm:block" />
              {t.premium.headlineLine2}
            </h3>

            <p className="text-base text-muted leading-relaxed mb-10 max-w-xl">
              {t.premium.body}
            </p>

            {preview && (
              <div className="border border-ink/10 bg-ink/[0.02] px-6 py-5 mb-10 max-w-xl">
                <p className="text-sm text-foreground leading-relaxed">
                  Tu Camino de Vida es <span className="font-semibold">{preview.lifePath}</span>. Tu animal chino es{" "}
                  <span className="font-semibold">{preview.chineseZodiac}</span>.
                  {preview.pattern && preview.pattern.sources.length > 1 ? (
                    <>
                      {" "}
                      <span className="font-semibold">{preview.pattern.sources.join(" y ")}</span> coinciden en{" "}
                      <span className="font-semibold">{preview.pattern.keyword}</span>.
                    </>
                  ) : (
                    " Dos sistemas distintos, calculados por separado."
                  )}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  La síntesis completa explica qué significa esa combinación en tu caso — no qué son por separado.
                </p>
              </div>
            )}

            <div className="border-t border-ink/10 pt-8 mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-5">{t.premium.whatYouGetLabel}</p>
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
                <span className="font-heading text-xl font-semibold text-foreground uppercase tracking-wider">{t.premium.priceSuffix}</span>
              </div>

              <p className="text-sm text-muted mb-8">{t.premium.priceNote}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={() => handleCheckout('mercadopago')}
                >
                  {t.premium.payWithMercadoPago}
                </Button>
              </div>

              {PAYPAL_ENABLED && (
                <>
                  <div className="flex items-center gap-4 my-6" aria-hidden="true">
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="text-xs uppercase tracking-[0.2em] text-muted">o</span>
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={() => handleCheckout('paypal')}
                    >
                      {t.premium.payWithPaypal}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col sm:flex-row gap-x-8 gap-y-3">
              {!showRecover ? (
                <button
                  type="button"
                  onClick={() => setShowRecover(true)}
                  className="text-left text-xs text-muted hover:text-accent transition-colors"
                >
                  {t.premium.recoverAccess}
                </button>
              ) : (
                <div className="space-y-3 w-full sm:w-auto">
                  <p className="text-xs text-muted">Recuperar por:</p>
                  <div className="flex flex-wrap gap-4">
                    <form onSubmit={e => handleRecover(e, 'mercadopago')} className="space-y-2 w-full sm:w-[220px]">
                      <label className="text-xs text-muted block">Mercado Pago ID:</label>
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
                    </form>
                    {PAYPAL_ENABLED && (
                      <form onSubmit={e => handleRecover(e, 'paypal')} className="space-y-2 w-full sm:w-[220px]">
                        <label className="text-xs text-muted block">PayPal Order ID:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={recoverPaymentId}
                            onChange={e => setRecoverPaymentId(e.target.value)}
                            placeholder="Ej: 5O123456AB789"
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
                      </form>
                    )}
                  </div>
                  {recoverError && (
                    <p className="text-xs text-red-600">{recoverError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => { setShowRecover(false); setRecoverError(null); setRecoverPaymentId(''); }}
                    className="text-xs text-muted hover:text-accent transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {!showCoupon ? (
                <button
                  type="button"
                  onClick={() => setShowCoupon(true)}
                  className="text-left text-xs text-muted hover:text-accent transition-colors"
                >
                  {t.premium.haveCoupon}
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
        </motion.div>
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
                <p className="label-micro mb-3">Pago seguro · {checkoutMethod === 'paypal' ? 'PayPal' : 'Mercado Pago'}</p>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">Tu síntesis completa</h3>
                <p className="text-sm text-muted mb-6">Pago único · Acceso permanente</p>

                {checkoutLoading ? (
                  <div className="flex flex-col items-center py-12 gap-3">
                    <Logo className="w-8 h-8 text-accent" spinning />
                    <p className="text-sm text-muted">
                      Redirigiendo a {checkoutMethod === 'paypal' ? 'PayPal' : 'Mercado Pago'}...
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
                      onClick={() => handleCheckout(checkoutMethod ?? 'mercadopago')}
                    >
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
                    <p className="text-sm text-muted">Esto solo toma unos segundos.</p>
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