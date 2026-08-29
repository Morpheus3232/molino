"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import {
  Sparkles,
  Check,
  CreditCard,
  KeyRound,
  Ticket,
  HelpCircle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { savePremiumTokenClient } from "@/lib/premium";
import { invalidatePremiumAccessCache } from "@/lib/hooks/usePremiumAccess";
import { analytics } from "@/lib/analytics/analytics";
import BtcPayment from "./BtcPayment";

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recovery & coupon states
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPaymentId, setRecoverPaymentId] = useState("");
  const [recoverBirthDate, setRecoverBirthDate] = useState(birthDate);
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // El pago en BTC se ofrece solo si el server tiene BTC_ADDRESS configurada;
  // si no, el enlace ni aparece.
  const [showBtc, setShowBtc] = useState(false);
  const [btcEnabled, setBtcEnabled] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch("/api/btc/quote")
      .then((r) => r.json())
      .then((d) => { if (vivo && d?.address) setBtcEnabled(true); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

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
        throw new Error(err.error || "Error al conectar con Mercado Pago");
      }

      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar el pago";
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
        setRecoverError(data.error || data.reason || "No se encontró una compra válida para este ID");
      }
    } catch {
      setRecoverError("Error al intentar recuperar la compra");
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
        setCouponError(data.reason || "Código de cupón inválido o expirado");
      }
    } catch {
      setCouponError("Error al aplicar el cupón");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div
      id="checkout-box"
      className={`rounded-3xl border border-accent/30 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="max-w-xl mx-auto text-center space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
            Acceso Permanente de por Vida
          </span>
        </div>

        {/* Price Tag */}
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Desbloqueá tu Síntesis Completa
          </h3>
          <div className="mt-3 flex items-baseline justify-center gap-2">
            <span className="font-display text-5xl sm:text-6xl text-foreground font-bold tracking-tight">
              $8
            </span>
            <span className="font-mono text-sm text-muted">USD · Pago Único</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Sin suscripciones mensuales ni débitos automáticos. Pagás una vez y queda habilitado para siempre.
          </p>
        </div>

        {/* Checkout Buttons */}
        <div className="space-y-3 pt-2">
          {checkoutLoading ? (
            <div className="p-6 rounded-2xl bg-ink/5 border border-ink/10 flex flex-col items-center justify-center gap-3">
              <Logo className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs font-mono text-muted">
                Conectando con Mercado Pago de forma segura...
              </p>
            </div>
          ) : (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              className="py-4 text-base font-bold shadow-lg"
            >
              Pagar con Mercado Pago / Tarjeta ($8 USD)
            </Button>
          )}

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
              {errorMsg}
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
                setShowBtc(false);
              }}
              className="hover:text-accent transition-colors underline"
            >
              ¿Ya compraste? Recuperar acceso
            </button>
          )}

          {!showCoupon && (
            <button
              type="button"
              onClick={() => {
                setShowCoupon(true);
                setShowRecover(false);
                setShowBtc(false);
              }}
              className="hover:text-accent transition-colors underline"
            >
              ¿Tenés un cupón?
            </button>
          )}

          {btcEnabled && !showBtc && (
            <button
              type="button"
              onClick={() => {
                setShowBtc(true);
                setShowRecover(false);
                setShowCoupon(false);
              }}
              className="hover:text-accent transition-colors underline"
            >
              Pagar con Bitcoin
            </button>
          )}
        </div>

        <AnimatePresence>
          {showBtc && (
            <BtcPayment
              name={name}
              birthDate={birthDate}
              salt={getOrCreateProfileSalt()}
              onUnlocked={onUnlocked}
              onClose={() => setShowBtc(false)}
            />
          )}
        </AnimatePresence>

        {/* Recover Form Modal / Inline */}
        <AnimatePresence>
          {showRecover && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleRecover}
              className="p-4 rounded-2xl bg-background border border-ink/10 space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  Recuperar compra previa
                </span>
                <button
                  type="button"
                  onClick={() => setShowRecover(false)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Cerrar
                </button>
              </div>
              <p className="text-[11px] text-muted">
                Ingresá el ID de pago de Mercado Pago (figura en el email de tu recibo) y tu fecha de nacimiento:
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="ID de pago, ej: 123456789"
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
                    {isRecovering ? "..." : "Verificar"}
                  </Button>
                </div>
              </div>
              {recoverError && <p className="text-xs text-red-400">{recoverError}</p>}
            </motion.form>
          )}

          {/* Coupon Form */}
          {showCoupon && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleApplyCoupon}
              className="p-4 rounded-2xl bg-background border border-ink/10 space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">Canjear cupón</span>
                <button
                  type="button"
                  onClick={() => setShowCoupon(false)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Cerrar
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresá tu código"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-xl bg-card border border-ink/10 px-3 py-2 text-xs text-foreground uppercase font-mono focus:outline-none focus:border-accent"
                />
                <Button type="submit" variant="primary" size="sm" disabled={isApplyingCoupon}>
                  {isApplyingCoupon ? "..." : "Aplicar"}
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-400">{couponError}</p>}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
