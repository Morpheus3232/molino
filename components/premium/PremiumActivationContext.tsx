'use client';

import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';

export type ActivationStep = 'idle' | 'submitting' | 'success' | 'preparing' | 'ready' | 'error';

interface PremiumActivationContextValue {
  step: ActivationStep;
  setStep: (step: ActivationStep) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

const PremiumActivationContext = createContext<PremiumActivationContextValue | null>(null);

export function PremiumActivationProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<ActivationStep>('idle');
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
  }, []);

  const handleSetStep = useCallback((s: ActivationStep) => {
    setStep(s);
    if (s !== 'error') setError(null);
  }, []);

  return (
    <PremiumActivationContext.Provider value={{ step, setStep: handleSetStep, error, setError, reset }}>
      {children}
    </PremiumActivationContext.Provider>
  );
}

export function usePremiumActivation(): PremiumActivationContextValue {
  const ctx = useContext(PremiumActivationContext);
  if (!ctx) {
    throw new Error('usePremiumActivation must be used within PremiumActivationProvider');
  }
  return ctx;
}

export function usePremiumActivationSafe(): PremiumActivationContextValue | null {
  return useContext(PremiumActivationContext);
}