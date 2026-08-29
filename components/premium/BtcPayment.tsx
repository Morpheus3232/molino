"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { savePremiumTokenClient } from "@/lib/premium";
import { invalidatePremiumAccessCache } from "@/lib/hooks/usePremiumAccess";
import { analytics } from "@/lib/analytics/analytics";

interface Quote {
  address: string;
  sats: number;
  btc: string;
  usd: number;
  rate: number;
  uri: string;
}

interface BtcPaymentProps {
  name?: string;
  birthDate?: string;
  salt: string;
  onUnlocked?: () => void;
  onClose: () => void;
}

/**
 * Pago en BTC.
 *
 * A diferencia de MercadoPago, una wallet no custodial no le avisa al sitio
 * cuando llega la plata, y como todos pagan a la MISMA dirección tampoco se
 * sabría de quién es. Por eso el comprobante lo aporta la persona: pega el ID
 * de la transacción y el server lo verifica contra la blockchain
 * (ver app/api/btc/claim). No se le cree nada: se chequea que esa transacción
 * pague a nuestra dirección, por el monto correcto, y que no se haya usado.
 *
 * ponytail: sin QR — un encoder QR son ~250 líneas de Reed-Solomon y no hay
 * dependencia instalada que lo haga. El link `bitcoin:` abre la wallet en
 * móvil y en desktop se copia la dirección. Si hace falta el QR para el flujo
 * desktop→teléfono, es agregar `qrcode` y pintar quote.uri.
 */
export default function BtcPayment({
  name = "",
  birthDate = "",
  salt,
  onUnlocked,
  onClose,
}: BtcPaymentProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [txid, setTxid] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuote = useCallback(async () => {
    setQuoteError(null);
    try {
      const res = await fetch("/api/btc/quote");
      const data = await res.json();
      if (!res.ok || !data.address) {
        setQuoteError(data.error ?? "El pago en BTC no está disponible ahora.");
        return;
      }
      setQuote(data);
    } catch {
      setQuoteError("No pudimos cotizar BTC. Probá de nuevo en un minuto.");
    }
  }, []);

  useEffect(() => {
    loadQuote();
    analytics.trackCheckoutStarted("BTC", "bitcoin");
  }, [loadQuote]);

  const copyAddress = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(quote.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: la dirección está a la vista igual.
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifying) return;
    setVerifying(true);
    setError(null);

    try {
      const res = await fetch("/api/btc/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txid: txid.trim(), name, birthDate, salt }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setError(data.reason ?? "No pudimos verificar el pago.");
        return;
      }

      savePremiumTokenClient(data.premiumToken);
      invalidatePremiumAccessCache(name, birthDate);
      onUnlocked?.();
    } catch {
      setError("No pudimos verificar el pago. Probá de nuevo en un minuto.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 rounded-lg bg-background border border-ink/10 space-y-4 text-left overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
          <Bitcoin className="w-3.5 h-3.5 text-accent" />
          Pagar con Bitcoin
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted hover:text-foreground"
        >
          Cancelar
        </button>
      </div>

      {quoteError && (
        <div className="space-y-2">
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-md">
            {quoteError}
          </p>
          <button
            type="button"
            onClick={loadQuote}
            className="font-mono text-xs text-accent underline hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      )}

      {!quote && !quoteError && (
        <p className="inline-flex items-center gap-2 font-mono text-xs text-muted">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Cotizando…
        </p>
      )}

      {quote && (
        <>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              Monto a enviar
            </p>
            <p className="font-heading text-2xl font-bold text-foreground tabular-nums">
              {quote.btc} BTC
            </p>
            <p className="font-mono text-xs text-muted">
              ≈ USD {quote.usd} · 1 BTC = USD {Math.round(quote.rate).toLocaleString("es-AR")}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              Dirección
            </p>
            <div className="flex items-stretch gap-2">
              <code className="flex-1 min-w-0 break-all font-mono text-xs bg-ink/[0.04] border border-ink/10 rounded-md p-2.5 text-foreground">
                {quote.address}
              </code>
              <button
                type="button"
                onClick={copyAddress}
                aria-label="Copiar dirección"
                className="shrink-0 px-3 rounded-md border border-ink/10 hover:border-accent/40 hover:text-accent transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <a
              href={quote.uri}
              className="inline-block font-mono text-xs text-accent underline hover:opacity-80"
            >
              Abrir en mi billetera
            </a>
          </div>

          {/* Esto es plata y no tiene vuelta atrás: se dice antes, no después. */}
          <p className="flex items-start gap-2 text-xs text-muted leading-relaxed bg-ink/[0.03] border border-ink/10 rounded-md p-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <span>
              Un pago en Bitcoin es irreversible: no hay contracargo ni
              reembolso. Enviá el monto exacto y verificá la dirección antes de
              confirmar en tu billetera.
            </span>
          </p>

          <form onSubmit={handleVerify} className="space-y-2">
            <label
              htmlFor="btc-txid"
              className="block font-mono text-xs uppercase tracking-wider text-muted"
            >
              Ya pagué — ID de transacción
            </label>
            <input
              id="btc-txid"
              type="text"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder="64 caracteres, lo da tu billetera"
              spellCheck={false}
              autoComplete="off"
              className="w-full font-mono text-xs bg-background border border-ink/15 rounded-md p-2.5 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
            />
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-md">
                {error}
              </p>
            )}
            <Button type="submit" disabled={verifying || txid.trim().length < 64} className="w-full">
              {verifying ? "Verificando en la red…" : "Verificar y activar"}
            </Button>
            <p className="font-mono text-xs text-muted leading-relaxed">
              Verificamos la transacción en la blockchain. No hace falta
              esperar confirmaciones: apenas aparece en la red, se activa.
            </p>
          </form>
        </>
      )}
    </motion.div>
  );
}
