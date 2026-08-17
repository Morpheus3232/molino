'use client';

import { useState, useCallback } from 'react';
import { getOrCreateProfileSalt } from '@/lib/premium';

interface UsePremiumRecoveryParams {
  name?: string;
  birthDate: string;
  /** Called with the response's premiumToken when the payment is verified. */
  commitUnlock: (premiumToken: string | undefined) => void;
}

export function usePremiumRecovery({ name, birthDate, commitUnlock }: UsePremiumRecoveryParams) {
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPaymentId, setRecoverPaymentId] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleRecover = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverPaymentId.trim()) return;

    setIsRecovering(true);
    setRecoverError(null);

    try {
      const res = await fetch('/api/mp/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: recoverPaymentId.trim(), name, birthDate, salt: getOrCreateProfileSalt() }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        commitUnlock(data.premiumToken);
      } else {
        setRecoverError(data.error || data.reason || 'No se encontró una compra válida para este ID');
      }
    } catch {
      setRecoverError('Error al intentar recuperar la compra');
    } finally {
      setIsRecovering(false);
    }
  }, [recoverPaymentId, name, birthDate, commitUnlock]);

  const cancel = useCallback(() => {
    setShowRecover(false);
    setRecoverError(null);
    setRecoverPaymentId('');
  }, []);

  return {
    showRecover,
    setShowRecover,
    recoverPaymentId,
    setRecoverPaymentId,
    recoverError,
    isRecovering,
    handleRecover,
    cancel,
  };
}
