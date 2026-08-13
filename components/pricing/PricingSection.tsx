"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import { saveSelectedPlan } from "@/lib/session/selectedPlan";
import type { BillingCycle, Plan, PlanId } from "./pricing-data";

interface PricingSectionProps {
  /** Plans to display. Defaults come from `PLANS` in pricing-data.ts. */
  plans?: Plan[];
  /** Human label for the yearly billing cycle badge (e.g. "-20%"). */
  yearlyDiscountLabel?: string;
}

function formatPrice(value: number, currency: string): string {
  if (value === 0) return "0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export default function PricingSection({
  plans,
  yearlyDiscountLabel = "-20%",
}: PricingSectionProps) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const resolved = plans ?? [];

  const onMonthly = useCallback(() => setCycle("monthly"), []);
  const onYearly = useCallback(() => setCycle("yearly"), []);

  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24" aria-label="Planes y precios">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        {/* Billing toggle */}
        <motion.div {...fadeUp} className="flex justify-center mb-12">
          <div
            role="group"
            aria-label="Frecuencia de facturación"
            className="relative inline-flex items-center rounded-md border border-ink/10 bg-ink/[0.03] p-1"
          >
            <motion.span
              layoutId="billing-pill"
              className="absolute inset-y-1 rounded-sm bg-ink"
              initial={false}
              animate={{ left: cycle === "monthly" ? "0.25rem" : "50%", width: cycle === "monthly" ? "calc(50% - 0.25rem)" : "calc(50% - 0.25rem)" }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={onMonthly}
              aria-pressed={cycle === "monthly"}
              className={`relative z-10 px-5 py-2 text-xs font-heading font-semibold uppercase tracking-[0.15em] transition-colors rounded-sm ${
                cycle === "monthly" ? "text-paper" : "text-muted hover:text-foreground"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={onYearly}
              aria-pressed={cycle === "yearly"}
              className={`relative z-10 px-5 py-2 text-xs font-heading font-semibold uppercase tracking-[0.15em] transition-colors rounded-sm ${
                cycle === "yearly" ? "text-paper" : "text-muted hover:text-foreground"
              }`}
            >
              Anual
              <span className="ml-2 inline-block rounded-sm bg-gold px-1.5 py-0.5 text-[10px] text-gold-foreground font-bold">
                {yearlyDiscountLabel}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolved.map((plan, i) => {
            const price = cycle === "monthly" ? plan.price.monthly : plan.price.yearly;
            const currency = plan.currency ?? "USD";
            const isYearly = cycle === "yearly";

            return (
              <motion.article
                key={plan.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className={`relative flex flex-col rounded-md border p-6 sm:p-8 ${
                  plan.highlighted
                    ? "border-accent/50 bg-accent/[0.04] shadow-[0_0_40px_rgba(124,140,255,0.08)]"
                    : "border-ink/10 bg-ink/[0.02]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 rounded-sm bg-gold px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-gold-foreground">
                    {plan.badge}
                  </span>
                )}

                <h3 className="font-heading text-lg font-semibold text-foreground uppercase tracking-[0.08em]">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{plan.tagline}</p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${plan.id}-${cycle}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="font-display text-4xl sm:text-5xl tracking-tight text-foreground"
                    >
                      {formatPrice(price, currency)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm text-muted">
                    {isYearly ? "/año" : price === 0 ? "" : "/mes"}
                  </span>
                </div>

                {isYearly && price !== 0 && (
                  <p className="mt-1 text-xs text-muted/70">
                    Facturado anualmente · equivalente a {formatPrice(plan.price.monthly * 12 * 0.2, currency)} de descuento
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={plan.cta.href}
                  onClick={() => {
                    if (plan.price.monthly > 0) saveSelectedPlan({ id: plan.id as PlanId, cycle });
                  }}
                  className={`mt-6 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-heading font-semibold uppercase tracking-[0.1em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    plan.highlighted
                      ? "bg-gold text-gold-foreground hover:bg-gold-hover focus-visible:ring-gold"
                      : "bg-ink text-paper hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent"
                  }`}
                >
                  {plan.cta.label}
                </Link>

                {/* Features */}
                <ul className="mt-8 space-y-3 border-t border-ink/10 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-accent/15" aria-hidden="true">
                        <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
