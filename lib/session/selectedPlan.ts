"use client";

import type { BillingCycle, PlanId } from "@/components/pricing/pricing-data";

export interface SelectedPlan {
  id: PlanId;
  cycle: BillingCycle;
}

const KEY = "molino-selected-plan";

/** Guarda el plan que el usuario eligió en /precios antes de ir a pagar. */
export function saveSelectedPlan(plan: SelectedPlan): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    /* almacenamiento no disponible — el plan se pierde, el checkout cae al default */
  }
}

/** Lee el plan guardado, si existe. */
export function loadSelectedPlan(): SelectedPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedPlan>;
    if (parsed && parsed.id && (parsed.cycle === "monthly" || parsed.cycle === "yearly")) {
      return { id: parsed.id, cycle: parsed.cycle };
    }
    return null;
  } catch {
    return null;
  }
}

/** Limpia el plan tras un pago exitoso o una cancelación. */
export function clearSelectedPlan(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
