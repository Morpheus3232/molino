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
 * validación server-side (lib/mercadopago.ts), así el precio
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
    tagline: "Síntesis estructurada de tus arquetipos.",
    price: { monthly: 4.99, yearly: 39.99 },
    cta: { label: "Ir a Pro", href: "/onboarding" },
    features: [
      "Todo lo del plan Gratis",
      "Síntesis cruzada: numerología + astrología + zodíaco chino",
      "Análisis de compatibilidad estructurado",
      "Ciclos anuales y dinámicas personales",
      "Informe con síntesis narrativa",
      "Sin anuncios",
    ],
    highlighted: true,
    badge: "Más popular",
  },
  {
    id: "familiar",
    name: "Familiar",
    tagline: "Exploración colectiva sin sesgos.",
    price: { monthly: 9.99, yearly: 79.99 },
    cta: { label: "Elegir Familiar", href: "/onboarding" },
    features: [
      "Todo lo del plan Pro",
      "Hasta 5 mapas simultáneos",
      "Comparativa de dinámicas entre miembros",
      "Síntesis grupal de arquetipos",
      "Análisis de ciclos compartidos",
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
  { label: "Cálculo local en tu navegador, sin servidor", gratis: "yes", pro: "yes" },
  { label: "Síntesis cruzada de los 3 sistemas", gratis: "no", pro: "yes" },
  { label: "Análisis de dinámicas y compatibilidad", gratis: "no", pro: "yes" },
  { label: "Ciclos anuales y energías personales", gratis: "no", pro: "yes" },
  { label: "Informe con síntesis narrativa", gratis: "no", pro: "yes" },
  { label: "Sin anuncios", gratis: "partial", pro: "yes" },
];

export interface PricingFAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ real de /premium — el único producto pago que hoy existe de verdad
 * (pago único, sin tiers). PRICING_FAQS de abajo describe el pricing ladder
 * de /precios (suscripción mensual/anual, cancelación), que está pausado
 * porque el backend no lo implementa: ver .claude/execution-logs/
 * pricing-ladder-audit.md. No reusar PRICING_FAQS en /premium mientras
 * /precios siga desconectado — describe términos de facturación que no
 * existen (contradice "pago único, sin suscripciones").
 */
export const PREMIUM_FAQS: PricingFAQItem[] = [
  {
    question: "¿Premium es una suscripción?",
    answer:
      "No. Es un pago único de $8 USD con acceso permanente de por vida. Sin renovaciones, sin cargos recurrentes — no hay nada que cancelar.",
  },
  {
    question: "¿Qué pasa con mis datos de nacimiento?",
    answer:
      "Tu mapa se calcula 100% en tu navegador. Tu fecha de nacimiento nunca se envía a nuestros servidores. Los datos de pago los procesa Mercado Pago de forma segura; nosotros nunca guardamos información personal.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Mercado Pago. Procesa pagos de forma segura y te permite recuperar acceso usando el ID de tu compra.",
  },
  {
    question: "¿Es una herramienta determinista o un oráculo?",
    answer:
      "Ni una ni otro. Molino es estructurada pero no determinista: te muestra arquetipos, ciclos y dinámicas como marco de reflexión. Los arquetipos describen, no predicen. Las decisiones son tuyas.",
  },
];

/**
 * FAQ del pricing ladder de 3 planes en /precios — describe suscripción
 * mensual/anual con cancelación. /precios está pausado (redirige a
 * /premium) hasta que el backend soporte tiers reales; no usar este array
 * en ninguna página que sí procesa pagos hoy.
 */
export const PRICING_FAQS: PricingFAQItem[] = [
  {
    question: "¿El plan Gratis es gratis para siempre?",
    answer:
      "Sí. Tu mapa básico es y será gratuito, sin tarjeta y sin registro. Pro suma síntesis estructurada: conecta los 3 sistemas, análisis de dinámicas, ciclos personales e informe con síntesis narrativa.",
  },
  {
    question: "¿Puedo cancelar el plan Pro o Familiar en cualquier momento?",
    answer:
      "Sí. Podés cancelar cuando quieras desde tu cuenta. Seguís teniendo acceso hasta el final del período pagado. Sin permanencia, sin sorpresas.",
  },
  {
    question: "¿Qué diferencia hay entre Pro y Familiar?",
    answer:
      "Pro es la síntesis completa para una persona. Familiar agrega hasta 5 mapas simultáneos, comparativa de dinámicas entre miembros y análisis de ciclos compartidos: para parejas, familias y equipos.",
  },
  {
    question: "¿Qué pasa con mis datos de nacimiento?",
    answer:
      "Tu mapa se calcula 100% en tu navegador. Tu fecha de nacimiento nunca se envía a nuestros servidores. Los datos de pago los procesa Mercado Pago de forma segura; nosotros nunca guardamos información personal.",
  },
  {
    question: "¿El descuento anual es automático?",
    answer:
      "Sí. Al elegir el plan anual obtenés 2 meses de descuento: el precio mensual cae un 20% y se cobra una sola vez al año.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Mercado Pago. Procesa pagos de forma segura y te permite acceder a tu síntesis usando el ID de compra.",
  },
  {
    question: "¿Es una herramienta determinista o un oráculo?",
    answer:
      "Ni una ni otro. Molino es estructurada pero no determinista: te muestra arquetipos, ciclos y dinámicas como marco de reflexión. Los arquetipos describen, no predicen. Las decisiones son tuyas.",
  },
];
