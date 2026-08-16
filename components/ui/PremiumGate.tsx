"use client";

/**
 * PremiumGate — transparent, non-aggressive upgrade wall.
 *
 * Follows DESIGN_SYSTEM_2025.md tokens (accent/gold, editorial type). It never
 * invents urgency ("last chance", countdowns) and never hides the price. It
 * states plainly what premium includes, what it costs, and that there's a
 * 7-day money-back guarantee — then lets the user decide. Zero client-side
 * tracking: this component only renders UI; entitlement is checked server-side
 * via lib/premium.ts (isPremium) or the existing /api/mp/check flow.
 */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface PremiumGateUIProps {
  priceUsd?: number;
  onActivate?: () => void;
  checkoutUrl?: string;
  title?: string;
  description?: string;
}

const DEFAULT_FEATURES = [
  "Síntesis completa de tus 3 sistemas (numerología, astrología, zodíaco chino)",
  "Tensiones y patrones ocultos que no aparecen gratis",
  "Proyecciones y timing para tu momento actual",
  "Preguntale a Molino sobre tu mapa",
  "Acceso permanente, pago único",
];

export default function PremiumGateUI({
  priceUsd = 8,
  onActivate,
  checkoutUrl,
  title = "Tu síntesis completa",
  description = "Un pago único de por vida. Sin suscripciones, sin letra chica.",
}: PremiumGateUIProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-gold/30 bg-paper-alt p-6 sm:p-8"
      aria-label="Acceso premium"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-px bg-gold" aria-hidden="true" />
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Molino Premium
        </p>
      </div>

      <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">
        {title}
      </h2>

      <p className="text-sm text-muted leading-relaxed mb-6">{description}</p>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="font-heading text-4xl font-semibold tracking-tight text-ink">
          ${priceUsd}
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-muted">
          USD · pago único · de por vida
        </span>
      </div>

      <div className="border-t border-border pt-5 mb-6">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-xs font-mono uppercase tracking-wider text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {expanded ? "Ocultar qué incluye" : "Ver qué incluye"}
        </button>

        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden mt-4 space-y-2.5"
          >
            {DEFAULT_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-ink/90">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="gold" size="lg" fullWidth onClick={onActivate} disabled={!onActivate && !checkoutUrl}>
          {checkoutUrl ? (
            <a href={checkoutUrl} className="block w-full text-center">
              Desbloquear por ${priceUsd} USD
            </a>
          ) : (
            "Desbloquear mi síntesis"
          )}
        </Button>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Pago único, sin suscripción
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Sin registro · sin cookies
        </span>
      </div>

      <div className="mt-4">
        <Link
          href="/premium"
          className="text-xs font-mono text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Ver pricing transparente y comparativa →
        </Link>
      </div>
    </motion.section>
  );
}