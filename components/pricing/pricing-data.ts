/**
 * Pricing configuration — single source of truth for the pricing page and
 * the comparison table. Every value here is a prop-driven default so it can
 * be overridden at the call site, and so prices can be edited without
 * touching the component markup.
 */

export type BillingCycle = "monthly" | "yearly";

export type PlanId = "gratis" | "pro" | "familiar";

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/**
 * Precio USD único a cobrar por un plan+cycle (pago único del precio del
 * plan elegido — ver FAQ "se cobra una sola vez al año"). Devuelve 0 para el
 * plan Gratis. Fuente de verdad compartida entre la página /precios y la
 * validación server-side (lib/mercadopago.ts / lib/paypal.ts), así el precio
 * que ve el usuario y el que valida el webhook nunca divergen.
 */
export function resolvePlanUsdPrice(planId: string, cycle: BillingCycle): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  return plan.price[cycle];
}

export interface PlanPrice {
  /** Monthly price in USD (used when cycle === "monthly"). */
  monthly: number;
  /** Yearly price in USD per month (billed annually, shown with -20%). */
  yearly: number;
}

export interface PlanFeature {
  label: string;
  /** "yes" | "no" | "partial" controls the checkmark/X in the table. */
  included: "yes" | "no" | "partial";
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: PlanPrice;
  cta: { label: string; href: string };
  features: string[];
  highlighted?: boolean;
  badge?: string;
  currency?: string;
}

export const DEFAULT_CURRENCY = "USD";

export const PLANS: Plan[] = [
  {
    id: "gratis",
    name: "Gratis",
    tagline: "Tu mapa básico, siempre disponible.",
    price: { monthly: 0, yearly: 0 },
    cta: { label: "Empezar gratis", href: "/onboarding" },
    features: [
      "Mapa básico: numerología, astrología y zodíaco chino",
      "Cálculo 100% local, sin registro",
      "Acceso permanente a tu mapa",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "La claridad profunda, sin límites.",
    price: { monthly: 4.99, yearly: 39.99 },
    cta: { label: "Ir a Pro", href: "/onboarding" },
    features: [
      "Todo lo del plan Gratis",
      "Análisis de compatibilidad completo",
      "Ciclos anuales personales",
      "Informe PDF descargable",
      "Sin anuncios",
    ],
    highlighted: true,
    badge: "Más popular",
  },
  {
    id: "familiar",
    name: "Familiar",
    tagline: "Autoconocimiento para toda la casa.",
    price: { monthly: 9.99, yearly: 79.99 },
    cta: { label: "Elegir Familiar", href: "/onboarding" },
    features: [
      "Todo lo del plan Pro",
      "Hasta 5 mapas",
      "Comparativa de compatibilidad entre miembros",
      "Informes grupales",
    ],
  },
];

/** Feature rows used by the Gratis vs Pro comparison table. */
export const COMPARISON_ROWS: Array<{
  label: string;
  gratis: PlanFeature["included"];
  pro: PlanFeature["included"];
}> = [
  { label: "Mapa básico (numerología + astrología + zodíaco chino)", gratis: "yes", pro: "yes" },
  { label: "Cálculo local, sin registro", gratis: "yes", pro: "yes" },
  { label: "Análisis de compatibilidad", gratis: "no", pro: "yes" },
  { label: "Ciclos anuales personales", gratis: "no", pro: "yes" },
  { label: "Informe PDF descargable", gratis: "no", pro: "yes" },
  { label: "Sin anuncios", gratis: "partial", pro: "yes" },
];

export interface PricingFAQItem {
  question: string;
  answer: string;
}

export const PRICING_FAQS: PricingFAQItem[] = [
  {
    question: "¿El plan Gratis es gratis para siempre?",
    answer:
      "Sí. Generar tu mapa básico es y será gratuito, sin tarjeta y sin registro. El plan Pro solo suma profundidad: análisis de compatibilidad, ciclos y el informe PDF.",
  },
  {
    question: "¿Puedo cancelar el plan Pro en cualquier momento?",
    answer:
      "Sí. Podés cancelar cuando quieras desde tu cuenta y seguís teniendo acceso hasta el final del período ya pagado. Sin permanencia.",
  },
  {
    question: "¿Qué diferencia hay entre Pro y Familiar?",
    answer:
      "Pro es para una sola persona. Familiar incluye hasta 5 mapas, la comparativa de compatibilidad entre miembros y los informes grupales: ideal para parejas y familias.",
  },
  {
    question: "¿Se guardan mis datos si pago?",
    answer:
      "Tu mapa se calcula en tu navegador. Los datos de tu pago los procesan Mercado Pago o PayPal de forma segura; nosotros no guardamos tu fecha de nacimiento en servidores.",
  },
  {
    question: "¿El descuento anual es automático?",
    answer:
      "Sí. Al elegir el plan anual obtenés el equivalente a 2 meses gratis: el precio mensual cae un 20% y se cobra una sola vez al año.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos Mercado Pago y PayPal. Ambos permiten pagar de forma segura y recuperar tu acceso con el ID de la compra.",
  },
];
