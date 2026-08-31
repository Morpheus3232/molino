'use client';

import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, ArrowRight, X } from 'lucide-react';
import { usePremiumActivation } from './PremiumActivationContext';
import { useSafeReducedMotion } from '@/lib/hooks/useSafeReducedMotion';
import Button from '@/components/ui/Button';

const ACTIVATION_STORAGE_KEY = 'molino.activation-step.v1';

function readStoredStep(): string | null {
  try {
    const raw = window.localStorage.getItem(ACTIVATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.step === 'string') return parsed.step;
    return null;
  } catch {
    return null;
  }
}

function storeStep(step: string) {
  try {
    window.localStorage.setItem(ACTIVATION_STORAGE_KEY, JSON.stringify({ step, timestamp: Date.now() }));
  } catch {
    // localStorage unavailable
  }
}

function clearStoredStep() {
  try {
    window.localStorage.removeItem(ACTIVATION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function PremiumActivationFeedback() {
  const { step, setStep } = usePremiumActivation();
  const reduceMotion = useSafeReducedMotion();

  const stored = readStoredStep();

  // Derive effective step: live context takes priority, fallback to stored value
  const effectiveStep = step !== 'idle' ? step : (stored ?? 'idle');

  // Persist step changes to localStorage so the feedback survives rerenders
  useEffect(() => {
    if (step !== 'idle') {
      storeStep(step);
    } else {
      clearStoredStep();
    }
  }, [step]);

  const handleViewReading = useCallback(() => {
    const el = document.getElementById('lectura-premium-reveal');
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      el.focus({ preventScroll: true });
    }
  }, [reduceMotion]);

  const handleDismiss = useCallback(() => {
    setStep('idle');
  }, [setStep]);

  const isVisible = effectiveStep !== 'idle';

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[100] border-b border-ink/10 bg-background/95 backdrop-blur-sm shadow-lg"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-3 sm:py-4">
            {/* SUBMITTING */}
            {effectiveStep === 'submitting' && (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent shrink-0 animate-spin" aria-hidden="true" />
                <p className="text-sm text-foreground font-heading">Activando acceso…</p>
              </div>
            )}

            {/* SUCCESS */}
            {effectiveStep === 'success' && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-heading">Código aceptado</p>
                  <p className="text-xs text-muted mt-0.5">Tu acceso Pro está activo.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="shrink-0 p-1 rounded-md hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            )}

            {/* PREPARING */}
            {effectiveStep === 'preparing' && (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent shrink-0 animate-spin" aria-hidden="true" />
                <p className="text-sm text-foreground font-heading">
                  Tu acceso Pro está activo. Estamos preparando tu lectura…
                </p>
              </div>
            )}

            {/* READY */}
            {effectiveStep === 'ready' && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-heading">Tu Lectura Pro está lista.</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleViewReading}
                  className="shrink-0 text-xs"
                >
                  Ver mi lectura <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
                </Button>
              </div>
            )}

            {/* ERROR */}
            {effectiveStep === 'error' && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-error font-heading">No se pudo activar el acceso</p>
                  <p className="text-xs text-muted mt-0.5">Algo salió mal al intentar el código.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="shrink-0 p-1 rounded-md hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}