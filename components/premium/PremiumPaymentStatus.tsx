'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import type { GateState } from '@/lib/hooks/useCommitPremiumUnlock';

const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeOut" as const } },
};

interface PremiumPaymentStatusProps {
  state: Extract<GateState, 'paying' | 'pay_error' | 'verifying' | 'verifying_redirect'>;
  checkoutLoading: boolean;
  chargePriceUsd: number;
  payError: string | null;
  verificationError: string | null;
  pollTimedOut: boolean;
  startCheckout: () => void;
  setState: (state: GateState) => void;
  setVerificationError: (error: string | null) => void;
  setShowRecover: (show: boolean) => void;
  setPayError: (error: string | null) => void;
  setCheckoutLoading: (loading: boolean) => void;
}

/** The paying/pay_error/verifying/verifying_redirect sub-states — what the
 * user sees while a real MercadoPago payment is in flight or being
 * confirmed. Moved verbatim from PremiumGate.tsx. */
export default function PremiumPaymentStatus({
  state,
  checkoutLoading,
  chargePriceUsd,
  payError,
  verificationError,
  pollTimedOut,
  startCheckout,
  setState,
  setVerificationError,
  setShowRecover,
  setPayError,
  setCheckoutLoading,
}: PremiumPaymentStatusProps) {
  return (
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
  );
}
