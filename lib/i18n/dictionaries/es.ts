/**
 * Diccionario maestro (es-AR/es-LatAm, el tono actual de Molino). Fuente de
 * verdad para copy de interfaz: navegación, estados, premium y las
 * traducciones de los tiers/scores que calculan los engines (los engines
 * exponen SOLO ids — "resonancia-alta", "excelente" — nunca el texto).
 *
 * Al agregar en.ts / pt-BR.ts: mismas claves, transcreación por concepto,
 * no traducción palabra por palabra. Ver lib/i18n/locales.ts.
 */
export const es = {
  nav: {
    inicio: "Inicio",
    miMapa: "Mi Mapa",
    explorar: "Explorar",
    filosofia: "Filosofía",
    hoy: "Hoy",
    afinidad: "Afinidad",
    timing: "Timing",
    decisiones: "Decisiones",
    evolucion: "Evolución",
    biblioteca: "Biblioteca",
    guia: "Guía",
    conocimientoLibre: "Conocimiento libre",
    privacidadRadical: "Privacidad radical",
    transparenciaTotal: "Transparencia total",
    codigoAbierto: "Código abierto",
    sinTracking: "Sin tracking",
  },

  // Conceptos centrales del producto — cuando se traduzca, cada uno necesita
  // una decisión deliberada, no un diccionario palabra por palabra.
  concepts: {
    miMapa: "Mi Mapa",
    identidad: "Identidad",
    mundo: "Mundo",
    circulo: "Círculo",
    inteligencia: "Inteligencia",
    sabiduria: "Sabiduría",
    sintesisIntegral: "Síntesis Integral",
    queTeTraeHoy: "¿Qué te trae hoy?",
    decidir: "Decidir",
    premium: "Premium",
    privacidadRadical: "Privacidad radical",
  },

  // Textos de los tiers de afinidad/compatibilidad simbólica. Los engines
  // (affinityEngine.ts) solo devuelven el id del tier; este objeto le pone
  // el idioma. Los colores de cada tier son tokens de diseño (no dependen
  // del locale) y viven en AFFINITY_TIER_COLORS, en affinityEngine.ts.
  affinityTiers: {
    "resonancia-alta": { label: "Presencia marcada", description: "Patrones simbólicos fuertemente alineados" },
    "afinidad-media": { label: "Afinidad media", description: "Conexión moderada con puntos de interés compartidos" },
    "complementarios": { label: "Complementarios", description: "Diferentes pero que se enriquecen mutuamente" },
    "desafiante": { label: "Desafiante", description: "Tensión creativa que puede generar crecimiento" },
    "distante": { label: "Frecuencias lejanas", description: "Baja resonancia simbólica, pero no excluyente" },
  },

  // Lectura cualitativa de un score 0-100 (energía, timing, alineación,
  // indicadores de identidad). Intensidad, no calificación: Molino no te
  // pone nota. "Excelente/Buena/Baja" leían como una evaluación de la
  // persona; esta escala describe cuánto se expresa un patrón, sin
  // connotación de bueno/malo. Único lugar para esta escala en todo el sitio.
  scoreLabels: {
    excellent: "Alta",
    good: "Marcada",
    neutral: "Moderada",
    poor: "Sutil",
  },

  premium: {
    priceLabel: "$8 USD",
    eyebrow: "Lectura completa",
    headline: "Ya conocés tus piezas.",
    headlineLine2: "Ahora entendé cómo se conectan.",
    body: "Tu síntesis completa reúne tus sistemas en una sola lectura: qué patrones se alinean, qué tensiones aparecen y qué importa en tu momento actual.",
    whatYouGetLabel: "QUÉ VAS A LEER",
    priceSuffix: "USD",
    priceNote: "Pago único · acceso permanente",
    payWithMercadoPago: "Pagar con Mercado Pago",
    payWithPaypal: "Pagar con PayPal",
    paymentUnavailable: "El pago no está disponible en este momento. Volvé a intentarlo más tarde.",
    recoverAccess: "Recuperar acceso",
    haveCoupon: "Tengo un cupón",
  },
} as const;

export type Dictionary = typeof es;
