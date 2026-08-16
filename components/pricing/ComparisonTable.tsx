"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import { saveSelectedPlan } from "@/lib/session/selectedPlan";
import { COMPARISON_ROWS, PLANS } from "./pricing-data";

type Cell = "yes" | "no" | "partial";

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes") {
    return <Check className="h-5 w-5 text-accent" strokeWidth={2.5} aria-hidden="true" />;
  }
  if (value === "no") {
    return <X className="h-5 w-5 text-muted/50" strokeWidth={2.5} aria-hidden="true" />;
  }
  return <Minus className="h-5 w-5 text-muted/50" strokeWidth={2.5} aria-hidden="true" />;
}

function screenReaderText(value: Cell): string {
  if (value === "yes") return "Incluido";
  if (value === "no") return "No incluido";
  return "Parcial";
}

export default function ComparisonTable() {
  const gratis = PLANS.find((p) => p.id === "gratis");
  const pro = PLANS.find((p) => p.id === "pro");

  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-24" aria-label="Comparativa de planes">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        <motion.h2 {...fadeUp} className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-tight text-foreground text-center mb-3 leading-[1.05]">
          Gratis vs Pro
        </motion.h2>
        <motion.p {...fadeUp} className="text-center text-muted text-sm sm:text-base mb-12 max-w-xl mx-auto">
          Todo lo esencial es gratis. La claridad profunda, para quienes quieren ir más allá.
        </motion.p>

        <motion.div {...fadeUp} className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Comparativa de funcionalidades entre los planes Gratis y Pro de Molino.
            </caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="py-4 pr-4 w-1/2" />
                <th scope="col" className="py-4 px-4 text-center font-heading text-sm uppercase tracking-[0.1em] text-muted">
                  {gratis?.name ?? "Gratis"}
                </th>
                <th scope="col" className="py-4 px-4 text-center rounded-t-md bg-accent/[0.06] border border-accent/30 font-heading text-sm uppercase tracking-[0.1em] text-foreground">
                  <span className="inline-flex items-center gap-2">
                    {pro?.name ?? "Pro"}
                    {pro?.badge && (
                      <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[10px] font-bold text-gold-foreground">
                        {pro.badge}
                      </span>
                    )}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-ink/[0.06]">
                  <th scope="row" className="py-4 pr-4 text-sm text-foreground/90 font-normal leading-snug">
                    {row.label}
                  </th>
                  <td className="py-4 px-4 text-center">
                    <span className="sr-only">{screenReaderText(row.gratis)}</span>
                    <CellIcon value={row.gratis} />
                  </td>
                  <td className="py-4 px-4 text-center bg-accent/[0.04] border-x border-accent/15">
                    <span className="sr-only">{screenReaderText(row.pro)}</span>
                    <CellIcon value={row.pro} />
                  </td>
                </tr>
              ))}
              {/* Price row — highlighted */}
              <tr className="border-t-2 border-ink/15">
                <th scope="row" className="py-5 pr-4 font-heading text-sm uppercase tracking-[0.1em] text-foreground">
                  Precio
                </th>
                <td className="py-5 px-4 text-center font-heading text-lg text-foreground">
                  {gratis ? formatPrice(gratis.price.monthly, gratis.currency) : "$0"}
                </td>
                <td className="py-5 px-4 text-center bg-accent/[0.06] border-x border-accent/30">
                  <span className="font-display text-2xl text-accent">{pro ? formatPrice(pro.price.monthly, pro.currency) : ""}</span>
                  <span className="block text-xs text-muted mt-1">/mes · anual desde {pro ? formatPrice(pro.price.yearly, pro.currency) : ""}/año</span>
                </td>
              </tr>
              {/* CTA row */}
              <tr>
                <th scope="row" className="py-5 pr-4" />
                <td className="py-5 px-4 text-center">
                  {gratis && (
                    <Link
                      href={gratis.cta.href}
                      className="inline-flex items-center justify-center rounded-md border border-ink/20 px-5 py-2.5 text-xs font-heading font-semibold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {gratis.cta.label}
                    </Link>
                  )}
                </td>
                <td className="py-5 px-4 text-center bg-accent/[0.06] border-x border-accent/30">
                  {pro && (
                    <Link
                      href={pro.cta.href}
                      onClick={() => saveSelectedPlan({ id: "pro", cycle: "monthly" })}
                      className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-2.5 text-xs font-heading font-semibold uppercase tracking-[0.1em] text-gold-foreground transition-colors hover:bg-gold-hover"
                    >
                      {pro.cta.label}
                    </Link>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Value Anchor Box */}
        <motion.div {...fadeUp} className="mt-12 rounded-3xl border border-accent/20 bg-card/60 p-6 sm:p-8">
          <div className="text-center sm:text-left mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-1">
              Ancla de Valor & Transparencia
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              ¿Cómo se compara con otras opciones?
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Diseñamos Molino para que el autoconocimiento estructurado no dependa de suscripciones mensuales recurrentes:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Consulta Personal Tradicional</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$50 – $120 USD</span>
              <p className="text-xs text-muted leading-relaxed">Sesión de 1 hora, sin reporte interactivo ni actualizaciones permanentes.</p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Apps con Suscripción Mensual</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$10 – $15 / mes</span>
              <p className="text-xs text-muted leading-relaxed">Pagos recurrentes que suman $120 al año y recopilan datos para publicidad.</p>
            </div>

            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-1">
              <span className="text-[11px] font-mono text-accent font-bold block">Molino Premium</span>
              <span className="text-lg font-bold text-accent">$8 USD · Pago Único</span>
              <p className="text-xs text-foreground/90 leading-relaxed">$8 USD. Acceso vitalicio permanente, informe con narrativa de IA y 0 tracking.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function formatPrice(value: number, currency = "USD"): string {
  if (value === 0) return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
