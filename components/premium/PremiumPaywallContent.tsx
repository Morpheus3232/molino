'use client';
import { useL } from "@/lib/i18n/useL";

import { useState } from 'react';
import { Link } from "@/lib/i18n/navigation";
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ShieldCheck,
  Zap,
  KeyRound,
  Ticket,
  Gift,
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
  const L = useL();
  const [showComparison, setShowComparison] = useState(false);

  // Lo que abre la lectura completa, en el orden en que se lee. Es una
  // secuencia real (la lectura está escrita así), por eso va numerada.
  const chapters = [
    { n: "I", title: L("La frase que te resume", "The sentence that sums you up"), desc: L("Tu patrón central en una oración, y por qué importa.", "Your central pattern in one sentence, and why it matters.") },
    { n: "II", title: L("Lo que te sostiene y lo que pide atención", "What holds you up and what needs attention"), desc: L("Tus fortalezas y tus tensiones, lado a lado.", "Your strengths and your tensions, side by side.") },
    { n: "III", title: L("Tu punto ciego", "Your blind spot"), desc: L("Lo que tu patrón produce en automático sin que te des cuenta.", "What your pattern produces on autopilot without you noticing.") },
    { n: "IV", title: L("Dónde se nota", "Where it shows"), desc: L("El mismo patrón en el trabajo, en los vínculos y en las decisiones.", "The same pattern at work, in relationships and in decisions.") },
    { n: "V", title: L("Preguntale a Molino", "Ask Molino"), desc: L("50 preguntas con la IA que ya conoce tu mapa.", "50 questions with the AI that already knows your map.") },
  ];

  const keyword = preview?.pattern?.keyword ?? "";
  const sources = preview?.pattern?.sources ?? [];

  return (
    <motion.div
      key="locked"
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl"
    >
      {/* ── Encabezado ── */}
      <div className="mb-10">
        <p className="text-sm text-muted label-caps mb-4">{t.premium.eyebrow}</p>
        <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.02] tracking-tight text-foreground">
          {t.premium.conversationHeading}{" "}
          <span className="block">{t.premium.conversationHeadingLine2}</span>
        </h2>
        <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">
          {t.premium.conversationBody}
        </p>
      </div>

      {/* ── Lo que ya se ve: la coincidencia, en grande ── */}
      {preview?.pattern && keyword && (
        <section aria-label={L("Lo que ya se ve en tu mapa", "What can already be seen in your map")} className="mb-12 border-y-2 border-ink py-8 sm:py-10">
          <p className="text-base text-muted">{t.premium.hookTitle.replace(" {keyword}.", ":")}</p>
          <p className="mt-2 font-display text-[clamp(2.75rem,8vw,4.75rem)] leading-none tracking-tight text-foreground">
            {keyword}
          </p>
          <p className="mt-5 text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl">
            {sources.length > 1
              ? L(`Tu ${sources.join(" y tu ").toLowerCase()} se calculan por caminos separados y aterrizan en la misma palabra. Es el rasgo que más cuesta apagar cuando querés pasar desapercibido.`, `Your ${sources.join(" and your ").toLowerCase()} are calculated along separate paths and land on the same word. It's the trait that's hardest to switch off when you want to go unnoticed.`)
              : t.premium.hookDescription.replace("{keyword}", keyword).replace("{zodiac}", preview.chineseZodiac).replace(" ({element})", "")}
          </p>
          {preview.tension && (
            <p className="mt-4 text-base text-muted leading-relaxed max-w-xl">{L(<>
              Y una tensión que la lectura desarma: <span className="text-foreground">{preview.tension.title}</span>.
            </>, <>And a tension that the reading takes apart: <span className="text-foreground">{preview.tension.title}</span>.</>)}</p>
          )}
        </section>
      )}

      {/* ── Qué abre la lectura completa: su índice ── */}
      <section aria-labelledby="lectura-indice" className="mb-12">
        <h3 id="lectura-indice" className="font-display font-normal text-2xl sm:text-3xl text-foreground mb-2">
          {t.premium.headline} {t.premium.headlineLine2}
        </h3>
        <p className="text-base text-muted leading-relaxed mb-6 max-w-xl">{t.premium.body}</p>
        <ol className="border-t border-ink/15">
          {chapters.map((c) => (
            <li key={c.n} className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-4 border-b border-ink/15">
              <span className="font-display text-2xl leading-none text-muted" aria-hidden="true">{c.n}</span>
              <span>
                <span className="block font-display text-xl leading-tight text-foreground">{c.title}</span>
                <span className="mt-1 block text-base text-muted leading-snug">{c.desc}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-base text-muted leading-relaxed">{L("Además, tu mapa de ciclos 2026–2030 y tu número de la suerte, con la cuenta a la vista.", "Plus your 2026–2030 cycle map and your lucky number, with the math in plain sight.")}</p>
      </section>

      {/* ── Checkout ── */}
      <section aria-label={L("Pago", "Payment")} className="border-2 border-ink p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-5xl sm:text-6xl leading-none tracking-tight text-foreground">${chargePriceUsd}</span>
            <span className="text-lg text-muted">{t.premium.priceSuffix}</span>
            <span className="text-sm text-muted">{t.premium.priceArs}</span>
          </p>
          <p className="text-base text-foreground">{t.premium.priceNote}</p>
        </div>

        <p className="mt-4 text-base text-muted leading-relaxed">{t.premium.payDescription}</p>

        <div className="mt-6">
          {mercadoPagoEnabled ? (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={onCheckout}
              className="flex items-center justify-center gap-2 py-4 text-base font-bold active:scale-[0.99]"
            >
              {t.premium.payWithMercadoPago} · ${chargePriceUsd} {t.premium.priceSuffix}
            </Button>
          ) : (
            <p className="text-base text-muted border border-ink/15 px-4 py-3 text-center">
              {t.premium.paymentUnavailable}
            </p>
          )}

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
        </div>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted">
          <li className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            {t.premium.featureBadges.noSurprises}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            {t.premium.featureBadges.multiDevice}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            {t.premium.featureBadges.instantDelivery}
          </li>
        </ul>

        <div className="mt-6 pt-4 border-t border-ink/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <Link href="/regalar" className="inline-flex items-center gap-1.5 text-foreground underline underline-offset-4 hover:no-underline">
            <Gift className="w-3.5 h-3.5" aria-hidden="true" />
            {t.premium.giftQuestion}
          </Link>
          <Link href="/premium" className="text-muted hover:text-foreground underline underline-offset-4">
            {t.premium.faqLink}
          </Link>
        </div>
      </section>

      {/* ── Comparativa ── */}
      <div className="border-y border-ink/15 py-4 mb-6">
        <button
          type="button"
          onClick={() => setShowComparison((v) => !v)}
          aria-expanded={showComparison}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <span className="font-display text-lg text-foreground group-hover:underline underline-offset-4 flex items-center gap-2">
            {t.premium.comparisonTitle}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${showComparison ? 'rotate-180 text-accent' : ''}`}
            aria-hidden="true"
          />
        </button>
        {showComparison && (
          <div className="mt-4 pt-4 border-t border-ink/10">
            <FeatureComparison />
          </div>
        )}
      </div>

      {/* ── Acciones secundarias ── */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-sm">
        {!showRecover ? (
          <button
            type="button"
            onClick={() => setShowRecover(true)}
            className="text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {t.premium.recoverAccess}
          </button>
        ) : (
          <div className="space-y-3 w-full p-4 border border-ink/15">
            <p className="text-xs text-muted/80 leading-relaxed">{L("Ingresá el ID de Mercado Pago que te llegó al email para restaurar tu acceso:", "Enter the Mercado Pago ID you received by email to restore your access:")}</p>
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
                  placeholder={L("Ej: 123456789", "E.g. 123456789")}
                  className="flex-1 px-3 py-2 text-sm border border-ink/20 bg-background text-foreground focus:outline-none focus:border-accent transition-colors font-mono"
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
            >{L("Cancelar", "Cancel")}</button>
          </div>
        )}

        {!showCoupon ? (
          <button
            type="button"
            onClick={() => setShowCoupon(true)}
            className="text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5" />
            {t.premium.haveCoupon}
          </button>
        ) : (
          <div className="space-y-3 w-full p-4 border border-ink/15">
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label htmlFor="coupon-code" className="text-xs font-mono text-muted block">{L("Código de cupón:", "Coupon code:")}</label>
              <div className="flex gap-2">
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder={t.premium.couponPlaceholder}
                  className="flex-1 px-3 py-2 text-sm border border-ink/20 bg-background text-foreground focus:outline-none focus:border-accent transition-colors label-caps"
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
            >{L("Cerrar", "Close")}</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}