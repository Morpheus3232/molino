'use client';

import { isValidElement, cloneElement, type ReactElement } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

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
 */
export default function PremiumUnlockReveal({ preview, children }: PremiumUnlockRevealProps) {
  return (
    <motion.div
      id="lectura-premium-reveal"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/[0.04] p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 text-accent">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-mono font-bold tracking-wider uppercase mb-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Acceso Pro Activado
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                {preview?.tension
                  ? <>Desbloqueaste tu tensión: {preview.tension.title.toLowerCase()}</>
                  : "¡Tu Lectura Pro está desbloqueada y lista!"}
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl leading-relaxed">
                Acceso permanente de por vida. Tus tres sistemas (numerología, astrología y zodíaco chino) ya están conectados en tu síntesis profunda.
              </p>
            </div>
          </div>

          <Link
            href="/lectura"
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-accent text-background rounded-xl font-heading text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.98] shrink-0 w-full sm:w-auto"
          >
            Abrir mi Lectura Pro
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 pt-4 border-t border-ink/10 flex items-center gap-2 text-[11px] font-mono text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>Te enviamos un email de respaldo con tu enlace mágico y tu ID de pago para que nunca pierdas el acceso.</span>
        </div>
      </div>

      {isValidElement(children) ? cloneElement(children as ReactElement<{ justUnlocked?: boolean }>, { justUnlocked: true }) : children}
    </motion.div>
  );
}
