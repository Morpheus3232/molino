'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import PaymentBrick from '@/components/payment/PaymentBrick';
import { analytics } from '@/lib/analytics/analytics';

interface PremiumGateProps {
  name: string;
  birthDate: string;
  children: React.ReactNode;
}

type GateState = 'locked' | 'paying' | 'verifying' | 'unlocked' | 'pay_error';

const POLL_INTERVAL = 5000;
const POLL_MAX_ATTEMPTS = 24; // 2 minutos máximo
const PRICE_USD = 8;

export default function PremiumGate({ name, birthDate, children }: PremiumGateProps) {
  const [state, setState] = useState<GateState>('locked');
  const [payError, setPayError] = useState<string | null>(null);
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPaymentId, setRecoverPaymentId] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
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
    checkServer().then(premium => {
      if (premium) {
        setState('unlocked');
        analytics.trackPremiumUnlocked();
      } else {
        analytics.trackPaywallViewed();
      }
    });
  }, [checkServer]);

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

  const handlePaymentApproved = useCallback((paymentId: string) => {
    analytics.trackPaymentApproved(paymentId);
    setState('verifying');
  }, []);

  const handlePaymentPending = useCallback((_paymentId?: string) => {
    setState('verifying');
  }, []);

  const handlePaymentRejected = useCallback(() => {
    setState('locked');
  }, []);

  const handlePayError = useCallback((error: unknown) => {
    const msg = error instanceof Error ? error.message : 'No se pudo cargar el checkout.';
    setPayError(msg);
    setState('pay_error');
  }, []);

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

  // ─── UNLOCKED ────────────────────────────────────────────────────────────────
  if (state === 'unlocked') {
    return <>{children}</>;
  }

  // ─── PAYING ──────────────────────────────────────────────────────────────────
  if (state === 'paying') {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-semibold rounded-full border border-violet-500/30 mb-4">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            PAGO SEGURO · MERCADO PAGO
          </span>
          <h2 className="text-2xl font-bold text-white mb-1">Molino Premium</h2>
          <p className="text-gray-400 text-sm">Pago único · Acceso permanente</p>
        </div>

        <PaymentBrick
          name={name}
          birthDate={birthDate}
          currencyId="USD"
          onPaymentApproved={handlePaymentApproved}
          onPaymentPending={handlePaymentPending}
          onPaymentRejected={handlePaymentRejected}
          onError={handlePayError}
        />

        <button
          onClick={() => setState('locked')}
          className="mt-6 mx-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </div>
    );
  }

  // ─── PAY ERROR ───────────────────────────────────────────────────────────────
  if (state === 'pay_error') {
    return (
      <div className="max-w-md mx-auto my-8 text-center py-12 px-6">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No se pudo cargar el checkout</h3>
        <p className="text-sm text-gray-400 mb-1">{payError}</p>
        <p className="text-xs text-gray-500 mb-6">Puede ser un problema temporal con Mercado Pago.</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => { setPayError(null); setState('paying'); }}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => setState('locked')}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ─── VERIFYING ───────────────────────────────────────────────────────────────
  if (state === 'verifying') {
    return (
      <div className="max-w-md mx-auto my-8 text-center py-16 px-6">
        {!pollTimedOut ? (
          <>
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-violet-600/20" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verificando tu pago…</h3>
            <p className="text-gray-400 text-sm">Esto solo toma unos segundos</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-5">⏱</div>
            <h3 className="text-lg font-semibold text-white mb-2">El pago está siendo procesado</h3>
            <p className="text-gray-400 text-sm mb-6">
              Mercado Pago confirmará en breve. Si ya ves el cargo,
              ingresá tu ID de pago para recuperar el acceso ahora.
            </p>
            <button
              onClick={() => { setShowRecover(true); setState('locked'); }}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Recuperar acceso con mi ID de pago
            </button>
          </>
        )}
      </div>
    );
  }

  // ─── LOCKED (paywall) ────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-[480px] max-h-[80vh] overflow-hidden rounded-xl">
      {/* Blurred preview */}
      <div className="blur-[4px] select-none pointer-events-none opacity-40 saturate-50">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: 'linear-gradient(145deg, #0f0c29 0%, #1a1040 50%, #0d0d1a 100%)' }}
          >
            {/* Glow accent */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }}
            />

            <div className="relative p-7">
              {/* Badge */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-violet-600/25 text-violet-300 border border-violet-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Premium
                </span>
              </div>

              {/* Title */}
              <h3 className="text-center text-[22px] font-bold text-white leading-tight mb-2">
                Desbloqueá tu<br />Mapa Completo
              </h3>

              {/* Price */}
              <div className="flex items-baseline justify-center gap-1 mt-4 mb-5">
                <span className="text-4xl font-black text-violet-300">${PRICE_USD}</span>
                <span className="text-base font-semibold text-gray-400">USD</span>
                <span className="ml-2 text-xs text-gray-500 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">pago único</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
                {[
                  'Numerología completa y profunda',
                  'Afinidad con países y ciudades',
                  'Compatibilidad personal ilimitada',
                  'Timing y energía diaria',
                  'Recomendaciones personalizadas',
                ].map(feat => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => {
                  analytics.trackCheckoutStarted('USD');
                  setState('paying');
                }}
                className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}
              >
                Desbloquear por ${PRICE_USD} USD
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-3 mt-3.5 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pago seguro
                </span>
                <span className="text-gray-700">·</span>
                <span>Mercado Pago</span>
                <span className="text-gray-700">·</span>
                <span>Sin suscripción</span>
              </div>

              {/* Recover */}
              <div className="mt-5 pt-4 border-t border-white/8">
                {!showRecover ? (
                  <button
                    onClick={() => setShowRecover(true)}
                    className="w-full text-center text-xs text-gray-500 hover:text-violet-400 transition-colors"
                  >
                    ¿Ya compraste? Recuperar acceso →
                  </button>
                ) : (
                  <form onSubmit={handleRecover} className="space-y-2">
                    <label className="block text-xs text-gray-400">ID de pago de Mercado Pago:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recoverPaymentId}
                        onChange={e => setRecoverPaymentId(e.target.value)}
                        placeholder="Ej: 123456789"
                        className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={isRecovering}
                        className="px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {isRecovering ? '…' : 'OK'}
                      </button>
                    </div>
                    {recoverError && (
                      <p className="text-[11px] text-red-400">{recoverError}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
