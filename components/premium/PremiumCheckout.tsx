"use client";
import { useL } from "@/lib/i18n/useL";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import {
  Check,
  CreditCard,
  KeyRound,
  Ticket,
  HelpCircle,
  RefreshCw,
  Lock,
  Bitcoin,
} from "lucide-react";
import { savePremiumTokenClient } from "@/lib/premium";
import { invalidatePremiumAccessCache } from "@/lib/hooks/usePremiumAccess";
import { analytics } from "@/lib/analytics/analytics";
import { BtcPayOption } from "./BtcPayment";

const PROFILE_SALT_KEY = "molino-profile-salt";

function getOrCreateProfileSalt(): string {
  if (typeof window === "undefined") return "";
  let salt = localStorage.getItem(PROFILE_SALT_KEY);
  if (!salt) {
    salt = crypto.randomUUID();
    localStorage.setItem(PROFILE_SALT_KEY, salt);
  }
  return salt;
}

interface PremiumCheckoutProps {
  name?: string;
  birthDate?: string;
  onUnlocked?: () => void;
  className?: string;
}

export default function PremiumCheckout({
  name = "",
  birthDate = "",
  onUnlocked,
  className = "",
}: PremiumCheckoutProps) {
  const L = useL();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recovery & coupon states
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPaymentId, setRecoverPaymentId] = useState("");
  const [recoverBirthDate, setRecoverBirthDate] = useState(birthDate);
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleCheckout = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    setErrorMsg(null);

    const salt = getOrCreateProfileSalt();
    analytics.trackCheckoutStarted("USD", "mercadopago");

    try {
      const res = await fetch("/api/mp/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthDate: birthDate || new Date().toISOString().split("T")[0],
          currencyId: "USD",
          salt,
          returnPath: "/lectura",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || L("Error al conectar con Mercado Pago", "Error connecting to Mercado Pago"));
      }

      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : L("Error al iniciar el pago", "Error starting the payment");
      setErrorMsg(msg);
      setCheckoutLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverPaymentId.trim()) return;

    setIsRecovering(true);
    setRecoverError(null);

    try {
      const res = await fetch("/api/mp/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: recoverPaymentId.trim(),
          birthDate: recoverBirthDate || "",
          salt: getOrCreateProfileSalt(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        if (data.premiumToken) savePremiumTokenClient(data.premiumToken);
        invalidatePremiumAccessCache(name, recoverBirthDate);
        if (onUnlocked) onUnlocked();
        analytics.trackPremiumUnlocked();
      } else {
        setRecoverError(data.error || data.reason || L("No se encontró una compra válida para este ID", "No valid purchase was found for this ID"));
      }
    } catch {
      setRecoverError(L("Error al intentar recuperar la compra", "Error trying to recover the purchase"));
    } finally {
      setIsRecovering(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/mp/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon: couponCode.trim(),
          name,
          birthDate: birthDate || "",
          salt: getOrCreateProfileSalt(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        if (data.premiumToken) savePremiumTokenClient(data.premiumToken);
        invalidatePremiumAccessCache(name, birthDate);
        if (onUnlocked) onUnlocked();
        analytics.trackPremiumUnlocked();
      } else {
        setCouponError(data.reason || L("Código de cupón inválido o expirado", "Invalid or expired coupon code"));
      }
    } catch {
      setCouponError(L("Error al aplicar el cupón", "Error applying the coupon"));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div
      id="checkout-box"
      className={`rounded-xl border border-accent/30 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="max-w-xl mx-auto text-center space-y-6">
        {/* Top Badge */}
        <div className="page-eyebrow">{L(<>
          <span className="text-sm text-accent font-bold label-caps">
            Acceso Permanente de por Vida
          </span>
        </>, <><span className="text-sm text-accent font-bold label-caps">Permanent Lifetime Access</span></>)}</div>

        {/* Price Tag */}
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{L("Desbloqueá tu Síntesis Completa", "Unlock your Complete Synthesis")}</h3>
          <div className="mt-3 flex items-baseline justify-center gap-2">{L(<>
            <span className="font-display text-5xl sm:text-6xl text-foreground font-bold tracking-tight">
              $8
            </span>
            <span className="font-mono text-sm text-muted">USD · Pago Único</span>
          </>, <><span className="font-display text-5xl sm:text-6xl text-foreground font-bold tracking-tight">$8</span><span className="font-mono text-sm text-muted">USD · One-Time Payment</span></>)}</div>
          <p className="text-xs text-muted mt-2">{L("Sin suscripciones mensuales ni débitos automáticos. Pagás una vez y queda habilitado para siempre.", "No monthly subscriptions or automatic debits. You pay once and it stays unlocked forever.")}</p>
        </div>

        {/* Checkout Buttons */}
        <div className="space-y-3 pt-2">
          {checkoutLoading ? (
            <div className="p-6 rounded-lg bg-ink/5 border border-ink/10 flex flex-col items-center justify-center gap-3">
              <Logo className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs font-mono text-muted">{L("Conectando con Mercado Pago de forma segura...", "Connecting securely to Mercado Pago...")}</p>
            </div>
          ) : (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              className="py-4 text-base font-bold shadow-lg"
            >{L("Pagar con Mercado Pago / Tarjeta ($8 USD)", "Pay with Mercado Pago / Card ($8 USD)")}</Button>
          )}

          {/* La opción de BTC entera en un componente: se autoconsulta si
              está habilitada y se dibuja sola. Ver BtcPayOption. */}
          {!checkoutLoading && (
            <BtcPayOption
              name={name}
              birthDate={birthDate}
              onUnlocked={onUnlocked}
              onOpen={() => {
                setShowRecover(false);
                setShowCoupon(false);
              }}
            />
          )}

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
              {L.t(errorMsg)}
            </p>
          )}
        </div>

        {/* Footer Links (Recover / Coupon) */}
        <div className="pt-4 border-t border-ink/10 flex items-center justify-center gap-6 text-xs font-mono text-muted">
          {!showRecover && (
            <button
              type="button"
              onClick={() => {
                setShowRecover(true);
                setShowCoupon(false);
              }}
              className="hover:text-accent transition-colors underline py-2"
            >{L("¿Ya compraste? Recuperar acceso", "Already bought? Recover access")}</button>
          )}

          {!showCoupon && (
            <button
              type="button"
              onClick={() => {
                setShowCoupon(true);
                setShowRecover(false);
              }}
              className="hover:text-accent transition-colors underline py-2"
            >{L("¿Tenés un cupón?", "Have a coupon?")}</button>
          )}

        </div>

        {/* Recover Form Modal / Inline */}
        <AnimatePresence>
          {showRecover && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleRecover}
              className="p-4 rounded-lg bg-background border border-ink/10 space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">{L("Recuperar compra previa", "Recover a previous purchase")}</span>
                <button
                  type="button"
                  onClick={() => setShowRecover(false)}
                  className="text-xs text-muted hover:text-foreground"
                >{L("Cerrar", "Close")}</button>
              </div>
              <p className="text-[11px] text-muted">{L("Ingresá el ID de pago de Mercado Pago (figura en el email de tu recibo) y tu fecha de nacimiento:", "Enter the Mercado Pago payment ID (it's in your receipt email) and your date of birth:")}</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={L("ID de pago, ej: 123456789", "Payment ID, e.g. 123456789")}
                  value={recoverPaymentId}
                  onChange={(e) => setRecoverPaymentId(e.target.value)}
                  className="w-full rounded-xl bg-card border border-ink/10 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={recoverBirthDate}
                    onChange={(e) => setRecoverBirthDate(e.target.value)}
                    className="flex-1 rounded-xl bg-card border border-ink/10 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
                  />
                  <Button type="submit" variant="primary" size="sm" disabled={isRecovering}>
                    {L.t(isRecovering ? "..." : L("Verificar", "Verify"))}
                  </Button>
                </div>
              </div>
              {recoverError && <p className="text-xs text-red-400">{L.t(recoverError)}</p>}
            </motion.form>
          )}

          {/* Coupon Form */}
          {showCoupon && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleApplyCoupon}
              className="p-4 rounded-lg bg-background border border-ink/10 space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">{L("Canjear cupón", "Redeem coupon")}</span>
                <button
                  type="button"
                  onClick={() => setShowCoupon(false)}
                  className="text-xs text-muted hover:text-foreground"
                >{L("Cerrar", "Close")}</button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={L("Ingresá tu código", "Enter your code")}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-xl bg-card border border-ink/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent label-caps"
                />
                <Button type="submit" variant="primary" size="sm" disabled={isApplyingCoupon}>
                  {L.t(isApplyingCoupon ? "..." : L("Aplicar", "Apply"))}
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-400">{L.t(couponError)}</p>}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
