'use client';

import { useEffect, useState } from 'react';
import PaymentBrick from '@/components/payment/PaymentBrick';

interface PremiumGateProps {
  profileHash: string;
  children: React.ReactNode;
}

type GateState = 'locked' | 'paying' | 'verifying' | 'unlocked';

export default function PremiumGate({ profileHash, children }: PremiumGateProps) {
  const [state, setState] = useState<GateState>('locked');
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    const isPremium = localStorage.getItem(`molino_premium_${profileHash}`);
    if (isPremium === 'true') {
      setState('unlocked');
    }
  }, [profileHash]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pStatus = params.get('payment_status');
    const pid = params.get('payment_id');
    const hash = params.get('profile_hash');

    if (pStatus === 'approved' && pid && (hash === profileHash || !hash)) {
      localStorage.setItem(`molino_premium_${profileHash}`, 'true');
      setState('unlocked');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [profileHash]);

  const handlePaymentApproved = (pid: string) => {
    setPaymentId(pid);
    setState('verifying');
    setTimeout(async () => {
      const res = await fetch('/api/mp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: pid }),
      });
      const data = await res.json();
      if (data.verified) {
        localStorage.setItem(`molino_premium_${profileHash}`, 'true');
        setState('unlocked');
      }
    }, 2000);
  };

  const handlePaymentPending = (pid: string) => {
    setPaymentId(pid);
    setState('verifying');
  };

  const handlePaymentRejected = () => {
    setState('locked');
  };

  if (state === 'unlocked') {
    return <>{children}</>;
  }

  if (state === 'paying') {
    return (
      <div className="max-w-xl mx-auto my-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Desbloqueá tu Mapa Completo
          </h2>
          <p className="text-gray-400 mb-4">
            Acceso permanente de por vida • Sin suscripciones • Cancelá cuando quieras
          </p>
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-600/40 rounded-lg px-6 py-3">
            <span className="text-4xl font-bold text-purple-400">$9</span>
            <span className="text-gray-500">USD</span>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-400">Pago único</span>
          </div>
        </div>

        <PaymentBrick
          profileHash={profileHash}
          currencyId="USD"
          onPaymentApproved={handlePaymentApproved}
          onPaymentPending={handlePaymentPending}
          onPaymentRejected={handlePaymentRejected}
          onError={() => setState('locked')}
        />

        <button
          onClick={() => setState('locked')}
          className="mt-6 mx-auto block text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          ← Volver al mapa gratuito
        </button>
      </div>
    );
  }

  if (state === 'verifying') {
    return (
      <div className="max-w-xl mx-auto my-8 text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-white mb-2">Verificando tu pago...</h3>
        <p className="text-gray-400">Esto solo toma unos segundos</p>
      </div>
    );
  }

  // ✅ FIX: min-h movido al PADRE, z-index agregado al OVERLAY
  return (
    <div className="relative min-h-[600px]">
      {/* Contenido difuminado */}
      <div className="blur-[3px] select-none pointer-events-none opacity-50">
        {children}
      </div>

      {/* ✅ FIX: Agregado z-10 para stacking context correcto */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-8 max-w-lg bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-2xl">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-600/20 text-purple-400 text-sm font-semibold rounded-full border border-purple-600/40">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              PREMIUM
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
            Desbloqueá tu Mapa Completo
          </h3>

          <p className="text-gray-400 mb-6 text-base leading-relaxed">
            Accedé a toda la profundidad de tu perfil: numerología completa,
            afinidad con países y marcas, compatibilidad personal, ciclos de energía
            y recomendaciones personalizadas.
          </p>

          <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-5 mb-6">
            <div className="flex items-end justify-center gap-1">
              <span className="text-5xl font-bold text-purple-400">$9</span>
              <span className="text-xl text-gray-500 mb-1">USD</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Pago único • Acceso permanente • Sin suscripción
            </p>
          </div>

          <ul className="text-left text-sm text-gray-400 mb-6 space-y-2 max-w-sm mx-auto">
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Numerología profunda completa</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Afinidad con países y ciudades</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Compatibilidad personal ilimitada</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Timing y energía diaria</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Recomendaciones personalizadas</li>
          </ul>

          <button
            onClick={() => setState('paying')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/20"
          >
            Desbloquear Mapa Completo
          </button>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pago seguro
            </span>
            <span>•</span>
            <span>Mercado Pago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
