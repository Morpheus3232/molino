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
                {preview.tension ? (
                  <>
                    <p className="text-sm text-foreground leading-relaxed">
                      Detectamos una tensión real en tu perfil:{" "}
                      <span className="font-semibold">{preview.tension.title.toLowerCase()}</span>. {preview.tension.evidence}
                    </p>
                    <p className="text-sm text-muted leading-relaxed mt-2">
                      La lectura completa explica qué hacer con ese desfasaje en tu momento actual.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}

            <div className="border-t border-ink/10 pt-8 mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-5">{t.premium.whatYouGetLabel}</p>
              <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <blockquote className="text-sm text-foreground/80 leading-relaxed italic">
                {preview?.tension ? (
                  <>
                    Tu tensión —<span className="font-semibold not-italic">{preview.tension.title.toLowerCase()}</span>—
                    no se queda ahí: la lectura completa explica de dónde viene y qué hacer con eso,
                    conecta tu patrón dominante con tu timing de hoy, y te deja preguntarle a Molino
                    lo que quieras sobre tu momento.
                  </>
                ) : preview?.pattern && preview.pattern.sources.length > 1 ? (
                  <>
                    Tu {preview.pattern.sources.join(" y ")} comparten un tema:{" "}
                    <span className="font-semibold not-italic">{preview.pattern.keyword}</span>.
                    La síntesis completa explica cómo este tema se manifiesta en tu identidad,
                    qué tensiones genera, qué hacer con eso en tu momento actual, y te deja
                    preguntarle a Molino lo que quieras sobre tu momento.
                  </>
                ) : (
                  <>
                    Tu numerología, astrología y zodíaco chino cuentan tres historias distintas.
                    La síntesis completa las conecta en una sola lectura — qué significa todo esto
                    en tu caso, no qué son por separado, y te deja preguntarle a Molino lo que quieras
                    sobre tu momento.
                  </>
                )}
              </blockquote>
            </div>

            <div className="border-t border-ink/10 pt-5 pb-4 sticky bottom-0 z-30 bg-background/95 backdrop-blur-sm sm:static sm:pt-10 sm:pb-0 sm:bg-transparent sm:backdrop-blur-none">
              <p className="label-micro mb-4 text-muted">Tu síntesis completa</p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  ${chargePriceUsd} <span className="text-lg font-medium tracking-wider">{t.premium.priceSuffix}</span>
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Pago Único · De por vida
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/20 mb-6 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-accent">
                  <span>$8 USD, pago único</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Acceso permanente a tu síntesis completa, informe con narrativa de IA y proyecciones 2026–2030 sin suscripciones mensuales.
                </p>
              </div>

              {flags.mercadoPagoEnabled ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="accent"
                    size="lg"
                    fullWidth
                    onClick={() => startCheckout()}
                  >
                    {t.premium.payWithMercadoPago}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted border border-ink/10 bg-ink/[0.02] px-4 py-3">
                  {t.premium.paymentUnavailable}
                </p>
              )}

              <div className="mt-4 text-center">
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                >
                  Ver qué incluye el acceso Premium →
                </Link>
              </div>
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
                  <p className="text-xs text-muted/70 leading-relaxed">Lo encontrás en el email de confirmación de tu pago.</p>
                  <form onSubmit={handleRecover} className="space-y-2 w-full sm:w-[220px]">
                    <label htmlFor="recover-mp-id" className="text-xs text-muted block">Mercado Pago ID:</label>
                    <div className="flex gap-2">
                      <input
                        id="recover-mp-id"
                        type="text"
                        value={recoverPaymentId}
                        onChange={e => setRecoverPaymentId(e.target.value)}
                        placeholder="Ej: 123456789"
                        className="flex-1 px-3 py-2 text-base border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
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
                  {recoverError && (
                    <p className="text-xs text-red-600">{recoverError}</p>
                  )}
                  <button
                    type="button"
                    onClick={cancelRecover}
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
                  <label htmlFor="coupon-code" className="text-xs text-muted block">Código de cupón:</label>
                  <div className="flex gap-2">
                    <input
                      id="coupon-code"
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Ingresá tu código"
                      className="flex-1 px-3 py-2 text-base border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
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