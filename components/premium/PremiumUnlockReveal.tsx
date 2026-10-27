'use client';
import { useL } from "@/lib/i18n/useL";

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface PremiumUnlockRevealProps {
  children: React.ReactNode;
}

/** The reveal shown once, right after a real unlock (payment/recover/coupon/
 * claim) in the current session — see justUnlocked in PremiumGate.tsx. Lives
 * only in /lectura: the reading is built right below it (children), so there
 * is no "open your reading" button to press.
 */
export default function PremiumUnlockReveal({ children }: PremiumUnlockRevealProps) {
  const L = useL();
  return (
    <motion.div
      id="lectura-premium-reveal"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div role="status" className="rounded-[--radius-lg] border border-accent/30 bg-accent/[0.04] p-6 sm:p-8">
        <p className="inline-flex items-center gap-1.5 text-sm text-accent mb-2 label-caps">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          {L("Pago confirmado", "Payment confirmed")}
        </p>
        <h3 className="font-heading text-lg sm:text-xl text-foreground">{L("Tu Lectura Pro está activa.", "Your Pro Reading is active.")}</h3>
        <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">{L("Pago único, sin vencimiento. Abajo se está escribiendo tu lectura y después se abre la conversación con tu mapa.", "One-time payment, no expiration. Below, your reading is being written, and then the conversation with your map opens.")}</p>
        <p className="text-xs text-muted mt-4 pt-4 border-t border-ink/10 leading-relaxed">{L("Si pagaste con Mercado Pago, te llega un email con el comprobante y un enlace para abrir tu lectura desde otro dispositivo.", "If you paid with Mercado Pago, you'll get an email with the receipt and a link to open your reading from another device.")}</p>
      </div>

      {children}
    </motion.div>
  );
}
