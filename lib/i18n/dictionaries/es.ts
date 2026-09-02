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
    "resonancia-alta": { label: "Alta", description: "Patrones simbólicos fuertemente alineados" },
    "afinidad-media": { label: "Afinidad media", description: "Conexión moderada con puntos de interés compartidos" },
    "complementarios": { label: "Complementarios", description: "Diferentes pero que se enriquecen mutuamente" },
    "desafiante": { label: "Desafiante", description: "Tensión creativa que puede generar crecimiento" },
    "distante": { label: "Baja", description: "Baja resonancia simbólica, pero no excluyente" },
  },

  // Lectura cualitativa de un score 0-100 (energía, timing, alineación,
  // indicadores de identidad). Intensidad, no calificación: Molino no te
  // pone nota. "Excelente/Buena/Baja" leían como una evaluación de la
  // persona; esta escala describe cuánto se expresa un patrón, sin
  // connotación de bueno/malo. Único lugar para esta escala en todo el sitio.
  scoreLabels: {
    excellent: "Alta",
    good: "Notable",
    neutral: "Moderada",
    poor: "Sutil",
  },

  premium: {
    priceLabel: "$8 USD",
    eyebrow: "Lectura completa",
    headline: "Ya conocés tus piezas.",
    headlineLine2: "Ahora entendé cómo se conectan.",
    conversationHeading: "LA CONVERSACIÓN",
    conversationHeadingLine2: "ENTRE TUS SISTEMAS.",
    conversationBody: "Todo lo de arriba es tuyo y no se paga. Lo que sigue es la parte que cruza los tres sistemas en una sola lectura escrita para tu mapa, más las preguntas abiertas sobre tus decisiones. Pago único de 8 dólares, acceso permanente — sin suscripción.",
    body: "Tu síntesis completa reúne numerología, astrología y zodíaco chino en una sola lectura: qué patrones se alinean, qué tensiones aparecen y qué importa en tu momento actual.",
    whatYouGetLabel: "QUÉ INCLUYE",
    benefitsCount: "5 beneficios",
    priceSuffix: "USD",
    priceNote: "Pago único · de por vida",
    priceArs: "(~11.880 ARS)",
    priceBadge: "⚡ Pago único",
    payWithMercadoPago: "Pagar con Mercado Pago",
    payWithBitcoin: "Pagar con Bitcoin",
    payDescription: "Pagás una sola vez con Mercado Pago y desbloqueás tu Lectura Pro completa. Sin suscripciones, sin cobros extra.",
    paymentUnavailable: "El pago no está disponible en este momento. Volvé a intentarlo más tarde.",
    hookTitle: "Arquetipos y Zodiaco Chino coinciden en {keyword}.",
    hookDescription: "Tu arquetipo ({keyword}) y tu animal {zodiac} ({element}) se calculan por caminos separados y aterrizan en lo mismo. Es el rasgo que más cuesta apagar cuando querés pasar desapercibido.",
    featureBadges: {
      noSurprises: "Sin cobros sorpresa",
      multiDevice: "Recuperable multidispositivo",
      instantDelivery: "Entrega instantánea",
    },
    giftQuestion: "¿Querés regalárselo a alguien?",
    faqLink: "Ver qué incluye Premium & FAQ →",
    comparisonTitle: "Comparativa detallada: Gratis vs Lectura Pro",
    recoverAccess: "Recuperar acceso",
    haveCoupon: "Tengo un cupón",
    couponPlaceholder: "Ingresá tu código",
  },
} as const;

export type Dictionary = typeof es;
