'use client';

import { useState, useCallback } from 'react';
import { getOrCreateProfileSalt } from '@/lib/premium';

interface UsePremiumCouponParams {
  name?: string;
  birthDate: string;
  /** Called with the response's premiumToken when the coupon is valid. */
  commitUnlock: (premiumToken: string | undefined) => void;
}

export function usePremiumCoupon({ name, birthDate, commitUnlock }: UsePremiumCouponParams) {
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/mp/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: couponCode.trim(), name, birthDate, salt: getOrCreateProfileSalt() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        commitUnlock(data.premiumToken);
      } else {
        setCouponError(data.reason || 'Código inválido');
      }
    } catch {
      setCouponError('Error al aplicar el cupón');
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode, name, birthDate, commitUnlock]);

  return {
    showCoupon,
    setShowCoupon,
    couponCode,
    setCouponCode,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
  };
}
