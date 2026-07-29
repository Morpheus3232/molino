'use client';

import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

if (typeof window !== 'undefined') {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);
}

interface PaymentBrickProps {
  name: string;
  birthDate: string;
  currencyId?: string;
  onPaymentApproved: (paymentId: string) => void;
  onPaymentPending: (paymentId: string) => void;
  onPaymentRejected: (error?: any) => void;
  onError: (error: unknown) => void;
}

export default function PaymentBrick({
  name,
  birthDate,
  currencyId = 'USD',
  onPaymentApproved,
  onPaymentPending,
  onPaymentRejected,
  onError,
}: PaymentBrickProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [brickError, setBrickError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setBrickError(null);
    setPreferenceId(null);

    async function fetchPreference() {
      try {
        const res = await fetch('/api/mp/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, birthDate, currencyId }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error);
        }

        const data = await res.json();
        if (!cancelled) {
          setPreferenceId(data.preferenceId);
          setLoading(false);
        }
      } catch (error) {
        console.error('[PaymentBrick] Preference error:', error);
        if (!cancelled) {
          setBrickError(error instanceof Error ? error.message : 'Error cargando');
          onError(error);
          setLoading(false);
        }
      }
    }

    fetchPreference();
    return () => { cancelled = true; };
  }, [name, birthDate, currencyId, onError, retryCount]);

  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/mp/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate,
          paymentData: formData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || result.error);
      }

      if (result.status === 'approved' || result.status === 'captured') {
        onPaymentApproved(result.id);
      } else if (result.status === 'pending' || result.status === 'in_process') {
        onPaymentPending(result.id);
      } else {
        onPaymentRejected(result);
      }

      return result;
    } catch (error) {
      console.error('[PaymentBrick] Submit error:', error);
      onError(error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent"></div>
        <p className="text-sm text-gray-400">Cargando métodos de pago...</p>
      </div>
    );
  }

  if (brickError || !preferenceId) {
    return (
      <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400 mb-4">No se pudieron cargar los métodos de pago.</p>
        <p className="text-xs text-gray-400 mb-4">{brickError}</p>
        <button
          onClick={() => setRetryCount(c => c + 1)}
          className="text-purple-400 underline text-sm hover:text-purple-300"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="payment-brick-container">
      <Payment
        initialization={{
          amount: currencyId === 'USD' ? 8 : 8100,
          preferenceId,
        }}
        onSubmit={handleSubmit}
        onReady={() => {}}
        onError={onError}
        customization={{
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                formBackgroundColor: '#1a1a2e',
                baseColor: '#6d4aff',
                buttonTextColor: '#ffffff',
                textPrimaryColor: '#ffffff',
                textSecondaryColor: '#a0a0a0',
                inputBackgroundColor: '#262640',
              },
            },
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            mercadoPago: 'all',
          },
        }}
      />
    </div>
  );
}
