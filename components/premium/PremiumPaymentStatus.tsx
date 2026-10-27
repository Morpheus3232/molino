'use client';
import { useL } from "@/lib/i18n/useL";

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
  state: Extract<GateState, 'paying' | 'pay_error' | 'verifying' | 'verifying_redirect' | 'pending'>;
  checkoutLoading: boolean;
  chargePriceUsd: number;
  payError: string | null;
  verificationError: string | null;
  pollTimedOut: boolean;
  startCheckout: () => void;
  onCheckAgain: () => void;
  pendingChecking: boolean;
  pendingNotYet: boolean;
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
  onCheckAgain,
  pendingChecking,
  pendingNotYet,
  setState,
  setVerificationError,
  setShowRecover,
  setPayError,
  setCheckoutLoading,
}: PremiumPaymentStatusProps) {
  const L = useL();
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
            <p className="label-micro mb-3">{L("Pago seguro · Mercado Pago", "Secure payment · Mercado Pago")}</p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{L("Tu síntesis completa", "Your complete synthesis")}</h3>
            <p className="text-sm text-muted mb-6">{L("Pago único · Acceso permanente", "One-time payment · Permanent access")}</p>

            {checkoutLoading ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <Logo className="w-8 h-8 text-accent" spinning />
                <p className="text-sm text-muted">{L("Redirigiendo a Mercado Pago...", "Redirecting to Mercado Pago...")}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted leading-relaxed mb-6">{L("Vas a ser redirigido para completar el pago de forma segura. Cuando termines, volvés automáticamente para ver tu síntesis.", "You'll be redirected to complete the payment securely. When you're done, you'll come back automatically to see your synthesis.")}</p>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => startCheckout()}
                >{L(<>
                  Ir a pagar ${L.t(chargePriceUsd)} USD
                </>, <>Go to pay ${L.t(chargePriceUsd)} USD</>)}</Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setState('locked')}
              className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
            >{L("← Volver", "← Back")}</button>
          </motion.div>
        )}

        {state === 'pay_error' && (
          <motion.div key="pay_error" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
            <p className="label-micro mb-3 text-red-600">
              {L.t(verificationError ? L('No se pudo verificar tu pago', "Your payment couldn't be verified") : L('No se pudo iniciar el pago', "The payment couldn't be started"))}
            </p>
            <p className="text-sm text-muted mb-1">{L.t(payError ?? verificationError)}</p>
            <p className="text-xs text-muted mb-6">
              {L.t(verificationError
                ? L('Si ya te cobraron, usá "Recuperar acceso" con el ID de tu pago.', "If you've already been charged, use \"Recover access\" with your payment ID.")
                : L('Puede ser un problema temporal. Intentá de nuevo.', "It may be a temporary problem. Try again."))}
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
                {L.t(verificationError ? L('Recuperar acceso', "Recover access") : L('Reintentar', "Try again"))}
              </Button>
              <button
                type="button"
                onClick={() => { setPayError(null); setVerificationError(null); setState('locked'); }}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >{L("Volver", "Back")}</button>
            </div>
          </motion.div>
        )}

        {state === 'verifying' && (
          <motion.div key="verifying" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
            {!pollTimedOut ? (
              <>
                <Logo className="w-8 h-8 text-accent mb-6" spinning />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{L("Verificando tu pago…", "Verifying your payment…")}</h3>
                <p className="text-sm text-muted">{L("Puede tardar hasta 60 segundos.", "It can take up to 60 seconds.")}</p>
              </>
            ) : (
              <>
                <p className="label-micro mb-3">{L("Todavía no vemos el pago", "We don't see the payment yet")}</p>
                <p className="text-sm text-muted leading-relaxed mb-6">{L(<>
                  Si ya completaste el pago, ingresá el ID en &ldquo;Recuperar acceso&rdquo; desde tu mapa.
                </>, <>If you've already completed the payment, enter the ID in &ldquo;Recover access&rdquo; from your map.</>)}</p>
                <Button variant="accent" onClick={() => setState('locked')}>{L("Recuperar acceso", "Recover access")}</Button>
              </>
            )}
          </motion.div>
        )}

        {state === 'pending' && (
          <motion.div key="pending" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
            <p className="label-micro mb-3">{L("Pago pendiente · Mercado Pago", "Payment pending · Mercado Pago")}</p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{L("Tu pago está registrado. Falta que se acredite.", "Your payment is registered. It still needs to be credited.")}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{L("Si pagaste en efectivo o por transferencia, Mercado Pago lo acredita cuando lo recibe; según el medio puede tardar desde minutos hasta un par de días. No hace falta pagar de nuevo.", "If you paid in cash or by transfer, Mercado Pago credits it when it receives it; depending on the method it can take anywhere from minutes to a couple of days. You don't need to pay again.")}</p>
            <p className="text-sm text-muted leading-relaxed mb-6">{L("Cuando se acredite te llega un email con el enlace a tu lectura, y si volvés a esta página desde este dispositivo la vas a encontrar abierta.", "Once it's credited you'll get an email with the link to your reading, and if you come back to this page from this device you'll find it open.")}</p>
            <Button variant="accent" onClick={onCheckAgain} disabled={pendingChecking}>
              {L.t(pendingChecking ? L('Revisando…', "Checking…") : L('Revisar si ya se acreditó', "Check whether it's been credited"))}
            </Button>
            {pendingNotYet && !pendingChecking && (
              <p role="status" className="mt-3 text-xs text-muted">{L("Todavía no figura acreditado.", "It doesn't show as credited yet.")}</p>
            )}
          </motion.div>
        )}

        {state === 'verifying_redirect' && (
          <motion.div key="verifying_redirect" variants={blockVariants} initial="hidden" animate="visible" exit="exit">
            <Logo className="w-8 h-8 text-accent mb-6" spinning />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{L("Verificando tu pago…", "Verifying your payment…")}</h3>
            <p className="text-sm text-muted">{L("Volviste de Mercado Pago. Confirmando tu compra.", "You're back from Mercado Pago. Confirming your purchase.")}</p>
            {verificationError && (
              <p className="mt-4 text-sm text-red-600">{L.t(verificationError)}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
