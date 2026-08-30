'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle,
  KeyRound,
  Ticket,
  ArrowRight,
  Lock,
  Check,
  Gift,
  Eye,
  MessageSquare,
  Calendar,
  Dices,
  Clock,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { BtcPayOption } from '@/components/premium/BtcPayment';
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
  /** Para el pago en BTC, que arma el hash de perfil igual que el resto. */
  name?: string;
  birthDate?: string;
  onUnlocked?: (premiumToken: string) => void;

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

/**
 * Paywall de la Lectura Pro: muestra la síntesis cruzada, beneficios
 * concretos, precio y checkout. Diseñado para máxima conversión con
 * claridad absoluta sobre qué incluye y qué no.
 */
export default function PremiumPaywallContent({
  t,
  preview,
  chargePriceUsd,
  mercadoPagoEnabled,
  onCheckout,
  name,
  birthDate,
  onUnlocked,
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

  const benefits = [
    {
      icon: Eye,
      title: "Tu Punto Ciego",
      desc: "Lo que tu patrón produce en automático sin que te des cuenta.",
    },
    {
      icon: MessageSquare,
      title: "Preguntale a Molino",
      desc: "Consultas abiertas ilimitadas con la IA que ya conoce tu mapa.",
    },
    {
      icon: Calendar,
      title: "Mapa de Ciclos",
      desc: "Tu evolución 2026–2030: Año Personal y timing para decisiones.",
    },
    {
      icon: Dices,
      title: "Tu Número de la Suerte",
      desc: "Cálculo transparente con fórmula visible y desglose paso a paso.",
    },
    {
      icon: Clock,
      title: "Acceso de Por Vida",
      desc: "Un solo pago. Sin suscripciones. Lo tenés siempre.",
    },
  ];

  return (
    <motion.div
      key="locked"
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl"
    >
      {/* ── Sección 1: Encabezado y contexto ──────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[--radius-sm] bg-accent/15 border border-accent/30 text-accent font-mono text-[11px] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Lectura Pro
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[--radius-sm] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono text-[11px] font-bold">
            Pago único · de por vida
          </span>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-[1.08] tracking-tight mb-4">
          {t.premium.headline}{" "}
          <span className="text-gradient-warm">{t.premium.headlineLine2}</span>
        </h3>

        <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.premium.body}
        </p>
      </div>

      {/* ── Sección 2: Gancho personalizado ──────────────────────── */}
      {preview && (
        <div className="relative rounded-[--radius-lg] border border-accent/25 bg-accent/[0.03] p-5 sm:p-6 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" aria-hidden="true" />
          <p className="font-heading text-base sm:text-lg font-bold text-foreground leading-snug">
            {preview.hook.question}
          </p>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            {preview.hook.context}
          </p>
        </div>
      )}

      {/* ── Sección 3: Beneficios concretos ──────────────────────── */}
      <div className="rounded-[--radius-lg] border border-ink/10 bg-card p-5 sm:p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-ink/10">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">
            {t.premium.whatYouGetLabel}
          </span>
          <span className="text-xs font-mono text-muted">{benefits.length} beneficios</span>
        </div>

        <div className="space-y-3">
          {/* Preview context: either tension or pattern */}
          <blockquote className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic border-l-2 border-accent/40 pl-3.5 py-1 mb-2">
            {preview?.tension ? (
              <>
                Tu tensión principal —<span className="font-semibold not-italic text-foreground">{preview.tension.title.toLowerCase()}</span>— no se queda en una frase: la síntesis Pro explica exactamente de dónde surge y cómo desbloquearlo.
              </>
            ) : preview?.pattern && preview.pattern.sources.length > 1 ? (
              <>
                Tus coordenadas de {preview.pattern.sources.join(" y ")} convergen en:{" "}
                <span className="font-semibold not-italic text-foreground">{preview.pattern.keyword}</span>.
                La lectura completa profundiza en cómo se manifiesta en tus decisiones y qué hacer hoy.
              </>
            ) : (
              <>
                Tu numerología, astrología y zodíaco chino cuentan tres historias distintas.
                La síntesis Pro las une en una sola lectura personalizada — sin horóscopos repetitivos ni predicciones vagas.
              </>
            )}
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-[--radius-md] bg-background/50 border border-ink/5 hover:border-accent/20 transition-colors"
                >
                  <span className="w-7 h-7 rounded-[--radius-sm] bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <div>
                    <span className="font-heading text-sm font-bold text-foreground block">
                      {item.title}
                    </span>
                    <span className="text-xs text-muted leading-tight block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sección 4: Checkout ──────────────────────────────────── */}
      <div className="rounded-[--radius-lg] border border-accent/30 bg-card p-5 sm:p-6 mb-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-1">
              Acceso inmediato
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                ${chargePriceUsd} <span className="text-lg font-medium text-muted tracking-normal">{t.premium.priceSuffix}</span>
              </span>
              <span className="text-xs font-mono text-muted">
                (~11.880 ARS)
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[--radius-sm] bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold">
            ⚡ Pago único
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-5">
          Pagás una sola vez con Mercado Pago y desbloqueás tu Lectura Pro completa. Sin suscripciones, sin cobros extra.
        </p>

        {mercadoPagoEnabled ? (
          <Button
            variant="accent"
            size="lg"
            fullWidth
            onClick={onCheckout}
            className="flex items-center justify-center gap-2 py-4 text-base font-bold shadow-lg hover:shadow-accent/20 active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            {t.premium.payWithMercadoPago} · ${chargePriceUsd} USD
          </Button>
        ) : (
          <p className="text-sm text-muted border border-ink/10 bg-ink/[0.02] px-4 py-3 rounded-[--radius-md] text-center">
            {t.premium.paymentUnavailable}
          </p>
        )}

        {/* Bitcoin como segundo método, debajo de MercadoPago. Se dibuja solo
            si el server tiene BTC_ADDRESS válida; si no, no ocupa lugar. */}
        <BtcPayOption
          name={name}
          birthDate={birthDate}
          onUnlocked={onUnlocked}
          onOpen={() => {
            setShowRecover(false);
            setShowCoupon(false);
          }}
          className="mt-3"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted/90 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            Sin cobros sorpresa
          </span>
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-accent" />
            Recuperable multidispositivo
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent" />
            Entrega instantánea
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/regalar"
            className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1.5 font-bold"
          >
            <Gift className="w-3.5 h-3.5" />
            ¿Querés regalárselo a alguien?
          </Link>
          <Link
            href="/premium"
            className="text-xs font-mono text-muted hover:text-foreground transition-colors"
          >
            Ver qué incluye Premium & FAQ →
          </Link>
        </div>
      </div>

      {/* ── Sección 5: Comparativa ───────────────────────────────── */}
      <div className="rounded-[--radius-lg] border border-ink/10 bg-card/40 p-4 sm:p-5 mb-6">
        <button
          type="button"
          onClick={() => setShowComparison((v) => !v)}
          aria-expanded={showComparison}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <span className="font-heading text-sm font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Comparativa detallada: Gratis vs Lectura Pro
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${showComparison ? 'rotate-180 text-accent' : ''}`}
            aria-hidden="true"
          />
        </button>
        {showComparison && (
          <div className="mt-4 pt-4 border-t border-ink/10 -mx-4 sm:-mx-5">
            <FeatureComparison />
          </div>
        )}
      </div>

      {/* ── Sección 6: Acciones secundarias ──────────────────────── */}
      <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        {!showRecover ? (
          <button
            type="button"
            onClick={() => setShowRecover(true)}
            className="text-muted hover:text-accent font-mono transition-colors inline-flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {t.premium.recoverAccess}
          </button>
        ) : (
          <div className="space-y-3 w-full p-4 rounded-[--radius-md] bg-card border border-ink/10">
            <p className="text-xs text-muted/80 leading-relaxed">
              Ingresá el ID de Mercado Pago que te llegó al email para restaurar tu acceso:
            </p>
            <form onSubmit={handleRecover} className="space-y-2">
              <label htmlFor="recover-mp-id" className="text-xs font-mono text-muted block">
                Mercado Pago ID:
              </label>
              <div className="flex gap-2">
                <input
                  id="recover-mp-id"
                  type="text"
                  value={recoverPaymentId}
                  onChange={e => setRecoverPaymentId(e.target.value)}
                  placeholder="Ej: 123456789"
                  className="flex-1 px-3 py-2 text-sm rounded-[--radius-md] border border-ink/15 bg-background text-foreground focus:outline-none focus:border-accent transition-colors font-mono"
                />
                <Button
                  type="submit"
                  disabled={isRecovering}
                  size="sm"
                  variant="accent"
                >
                  {isRecovering ? '…' : 'OK'}
                </Button>
              </div>
            </form>
            {recoverError && (
              <p className="text-xs text-red-500">{recoverError}</p>
            )}
            <button
              type="button"
              onClick={cancelRecover}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {!showCoupon ? (
          <button
            type="button"
            onClick={() => setShowCoupon(true)}
            className="text-muted hover:text-accent font-mono transition-colors inline-flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5" />
            {t.premium.haveCoupon}
          </button>
        ) : (
          <div className="space-y-3 w-full p-4 rounded-[--radius-md] bg-card border border-ink/10">
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label htmlFor="coupon-code" className="text-xs font-mono text-muted block">
                Código de cupón:
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Ingresá tu código"
                  className="flex-1 px-3 py-2 text-sm rounded-[--radius-md] border border-ink/15 bg-background text-foreground focus:outline-none focus:border-accent transition-colors font-mono uppercase"
                />
                <Button
                  type="submit"
                  disabled={isApplyingCoupon}
                  size="sm"
                  variant="accent"
                >
                  {isApplyingCoupon ? '…' : 'OK'}
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500">{couponError}</p>
              )}
            </form>
            <button
              type="button"
              onClick={() => setShowCoupon(false)}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}