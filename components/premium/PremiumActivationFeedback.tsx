'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react';
import { usePremiumActivation } from './PremiumActivationContext';
import { useSafeReducedMotion } from '@/lib/hooks/useSafeReducedMotion';

export default function PremiumActivationFeedback() {
  const { step, setStep } = usePremiumActivation();
  const reduceMotion = useSafeReducedMotion();

  const handleDismiss = useCallback(() => {
    setStep('idle');
  }, [setStep]);

  // Solo el paso de esta sesión: guardarlo en localStorage (para sobrevivir
  // a una recarga) dejaba el banner pegado — se leía en el render y el
  // borrado del efecto nunca volvía a renderizar.
  const isVisible = step !== 'idle';

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
            {step === 'submitting' && (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent shrink-0 animate-spin" aria-hidden="true" />
                <p className="text-sm text-foreground font-heading">Activando acceso…</p>
              </div>
            )}

            {/* SUCCESS */}
            {step === 'success' && (
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
            {step === 'preparing' && (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent shrink-0 animate-spin" aria-hidden="true" />
                <p className="text-sm text-foreground font-heading">
                  Tu acceso Pro está activo. Estamos preparando tu lectura…
                </p>
              </div>
            )}

            {/* ERROR */}
            {step === 'error' && (
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