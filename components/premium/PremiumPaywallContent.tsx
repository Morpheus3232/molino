'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import FeatureComparison from '@/components/premium/FeatureComparison';
import type { Dictionary } from '@/lib/i18n/dictionaries/es';

const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeOut" as const } },
};

interface PremiumGatePreview {
  lifePath: number;
  chineseZodiac: string;
  pattern: { keyword: string; sources: string[] } | null;
  tension: { title: string; evidence: string } | null;
  hook: { question: string; context: string };
}

interface PremiumPaywallContentProps {
  t: Dictionary;
  preview?: PremiumGatePreview;
  chargePriceUsd: number;
  mercadoPagoEnabled: boolean;
  onCheckout: () => void;

  showRecover: boolean;
  setShowRecover: (show: boolean) => void;
  recoverPaymentId: string;
  setRecoverPaymentId: (value: string) => void;
  recoverError: string | null;
  isRecovering: boolean;
  handleRecover: (e: React.FormEvent) => void;
  cancelRecover: () => void;

  showCoupon: boolean;
  setShowCoupon: (show: boolean) => void;
  couponCode: string;
  setCouponCode: (value: string) => void;
  couponError: string | null;
  isApplyingCoupon: boolean;
  handleApplyCoupon: (e: React.FormEvent) => void;
}

/** The `state === 'locked'` screen: preview, pricing, checkout CTA, and the
 * recover/coupon forms. Moved verbatim from PremiumGate.tsx. */
export default function PremiumPaywallContent({
  t,
  preview,
  chargePriceUsd,
  mercadoPagoEnabled,
  onCheckout,
  showRecover,
  setShowRecover,
  recoverPaymentId,
  setRecoverPaymentId,
  recoverError,
  isRecovering,
  handleRecover,
  cancelRecover,
  showCoupon,
  setShowCoupon,
  couponCode,
  setCouponCode,
  couponError,
  isApplyingCoupon,
  handleApplyCoupon,
}: PremiumPaywallContentProps) {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <motion.div
      key="locked"
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-accent" aria-hidden="true" />
          <p className="label-micro text-accent font-semibold">{t.premium.eyebrow}</p>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-snug mb-4">
          {t.premium.headline}{" "}
          {/* El <br> se oculta abajo de sm, así que sin este espacio las dos
              frases quedan pegadas en mobile ("piezas.Ahora"). En desktop el
              espacio colapsa contra el salto de línea y no se nota. */}
          <br className="hidden sm:block" />
          {t.premium.headlineLine2}
        </h3>

        <p className="text-base text-muted leading-relaxed mb-10 max-w-xl">
          {t.premium.body}
        </p>

        {preview && (
          <div className="border border-ink/10 bg-ink/[0.02] px-6 py-5 mb-10 max-w-xl">
            <p className="text-sm text-foreground leading-relaxed font-semibold">
              {preview.hook.question}
            </p>
            <p className="text-sm text-muted leading-relaxed mt-2">
              {preview.hook.context}
            </p>
          </div>
        )}

        <div className="border-t border-ink/10 pt-8 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-5">{t.premium.whatYouGetLabel}</p>
          <div className="flex items-center gap-2 mb-4" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <blockquote className="text-sm text-foreground/80 leading-relaxed italic">
            {preview?.tension ? (
              <>
                Tu tensión —<span className="font-semibold not-italic">{preview.tension.title.toLowerCase()}</span>—
                no se queda ahí: la lectura completa explica de dónde viene y qué hacer con eso,
                conecta tu patrón dominante con tu timing de hoy, y te deja preguntarle a Molino
                lo que quieras sobre tu momento.
              </>
            ) : preview?.pattern && preview.pattern.sources.length > 1 ? (
              <>
                Tu {preview.pattern.sources.join(" y ")} comparten un tema:{" "}
                <span className="font-semibold not-italic">{preview.pattern.keyword}</span>.
                La síntesis completa explica cómo este tema se manifiesta en tu identidad,
                qué tensiones genera, qué hacer con eso en tu momento actual, y te deja
                preguntarle a Molino lo que quieras sobre tu momento.
              </>
            ) : (
              <>
                Tu numerología, astrología y zodíaco chino cuentan tres historias distintas.
                La síntesis completa las conecta en una sola lectura — qué significa todo esto
                en tu caso, no qué son por separado, y te deja preguntarle a Molino lo que quieras
                sobre tu momento.
              </>
            )}
          </blockquote>
        </div>

        <div className="border-t border-ink/10 pt-5 pb-4 sticky bottom-0 z-30 bg-background/95 backdrop-blur-sm sm:static sm:pt-10 sm:pb-0 sm:bg-transparent sm:backdrop-blur-none">
          <p className="label-micro mb-4 text-muted">Tu síntesis completa</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              ${chargePriceUsd} <span className="text-lg font-medium tracking-wider">{t.premium.priceSuffix}</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Pago Único · De por vida
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/20 mb-6 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-accent">
              <span>$8 USD, pago único</span>
            </div>
            <p className="text-muted leading-relaxed">
              Acceso permanente a tu síntesis completa, informe con narrativa personalizada y proyecciones 2026–2030 sin suscripciones mensuales.
            </p>
          </div>

          {mercadoPagoEnabled ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="accent"
                size="lg"
                fullWidth
                onClick={onCheckout}
              >
                {t.premium.payWithMercadoPago}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted border border-ink/10 bg-ink/[0.02] px-4 py-3">
              {t.premium.paymentUnavailable}
            </p>
          )}

          <p className="mt-3 text-xs text-muted/80 text-center sm:text-left">
            Tus datos son tuyos: exportá tu perfil cuando quieras, sin suscripciones ocultas.
          </p>

          <div className="mt-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2">
            <Link
              href="/premium"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline justify-center sm:justify-start"
            >
              Ver qué incluye el acceso Premium →
            </Link>
            <Link
              href="/transparencia"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors justify-center sm:justify-start"
            >
              Ver nuestras métricas reales →
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink/10">
          <button
            type="button"
            onClick={() => setShowComparison((v) => !v)}
            aria-expanded={showComparison}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="label-micro text-muted group-hover:text-accent transition-colors">
              ¿Qué incluye Premium, comparado con lo gratis?
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${showComparison ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {showComparison && (
            <div className="-mx-4 sm:-mx-8">
              <FeatureComparison />
            </div>
          )}
        </div>

        <div className="mt-4 pt-6 border-t border-ink/10 flex flex-col sm:flex-row gap-x-8 gap-y-3">
          {!showRecover ? (
            <button
              type="button"
              onClick={() => setShowRecover(true)}
              className="text-left text-xs text-muted hover:text-accent transition-colors"
            >
              {t.premium.recoverAccess}
            </button>
          ) : (
            <div className="space-y-3 w-full sm:w-auto">
              <p className="text-xs text-muted/70 leading-relaxed">Lo encontrás en el email de confirmación de tu pago.</p>
              <form onSubmit={handleRecover} className="space-y-2 w-full sm:w-[220px]">
                <label htmlFor="recover-mp-id" className="text-xs text-muted block">Mercado Pago ID:</label>
                <div className="flex gap-2">
                  <input
                    id="recover-mp-id"
                    type="text"
                    value={recoverPaymentId}
                    onChange={e => setRecoverPaymentId(e.target.value)}
                    placeholder="Ej: 123456789"
                    className="flex-1 px-3 py-2 text-base border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isRecovering}
                    className="px-3 py-2 text-xs font-medium border border-ink/10 text-foreground hover:border-accent disabled:opacity-50 transition-colors"
                  >
                    {isRecovering ? '…' : 'OK'}
                  </button>
                </div>
              </form>
              {recoverError && (
                <p className="text-xs text-red-600">{recoverError}</p>
              )}
              <button
                type="button"
                onClick={cancelRecover}
                className="text-xs text-muted hover:text-accent transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {!showCoupon ? (
            <button
              type="button"
              onClick={() => setShowCoupon(true)}
              className="text-left text-xs text-muted hover:text-accent transition-colors"
            >
              {t.premium.haveCoupon}
            </button>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-2 max-w-xs">
              <label htmlFor="coupon-code" className="text-xs text-muted block">Código de cupón:</label>
              <div className="flex gap-2">
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Ingresá tu código"
                  className="flex-1 px-3 py-2 text-base border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon}
                  className="px-3 py-2 text-xs font-medium border border-ink/10 text-foreground hover:border-accent disabled:opacity-50 transition-colors"
                >
                  {isApplyingCoupon ? '…' : 'OK'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-600">{couponError}</p>
              )}
            </form>
          )}
      </div>
    </motion.div>
  );
}
