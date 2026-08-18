'use client';

import { isValidElement, cloneElement, type ReactElement } from 'react';
import { motion } from 'framer-motion';

interface PremiumGatePreview {
  lifePath: number;
  chineseZodiac: string;
  pattern: { keyword: string; sources: string[] } | null;
  tension: { title: string; evidence: string } | null;
}

interface PremiumUnlockRevealProps {
  preview?: PremiumGatePreview;
  children: React.ReactNode;
}

/** The reveal animation shown once, right after a real unlock (payment/
 * recover/coupon) in the current session — see justUnlocked in PremiumGate.tsx.
 * Moved verbatim. */
export default function PremiumUnlockReveal({ preview, children }: PremiumUnlockRevealProps) {
  return (
    <motion.div id="lectura-premium-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex items-center gap-3 mb-8 pb-6 border-b border-accent/20"
      >
        <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {preview?.tension
              ? <>Desbloqueaste tu tensión: {preview.tension.title.toLowerCase()}</>
              : "Desbloqueaste tu síntesis completa"}
          </p>
          <p className="text-xs text-muted">Acceso permanente — la vas a encontrar acá cada vez que vuelvas.</p>
        </div>
      </motion.div>
      {/* justUnlocked pasa a MolinoInterpretation para que, mientras carga,
          muestre un estado de espera propio de la revelación en vez del
          skeleton genérico — sin esto, el usuario ve "desbloqueaste tu
          síntesis" y un instante después una SEGUNDA pantalla de carga
          desconectada, como si el desbloqueo hubiera fallado a medias. */}
      {isValidElement(children) ? cloneElement(children as ReactElement<{ justUnlocked?: boolean }>, { justUnlocked: true }) : children}
    </motion.div>
  );
}
