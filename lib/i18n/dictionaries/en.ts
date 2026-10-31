import type { Dictionary } from "./es";

/**
 * Inglés del diccionario de interfaz (mismas claves que es.ts). Lo sirve
 * `useDictionary()` en las páginas /en; lib/i18n/__tests__/legacy-dictionary.test.ts
 * verifica que tenga las mismas claves y marcadores que el español.
 */
export const en: Dictionary = {
  nav: {
    inicio: "Home",
    miMapa: "My Map",
    explorar: "Explore",
    filosofia: "Philosophy",
    hoy: "Today",
    afinidad: "Affinity",
    timing: "Timing",
    decisiones: "Decisions",
    evolucion: "Evolution",
    biblioteca: "Library",
    guia: "Guide",
    conocimientoLibre: "Open knowledge",
    privacidadRadical: "Radical privacy",
    transparenciaTotal: "Full transparency",
    codigoAbierto: "Open source",
    sinTracking: "No tracking",
  },

  concepts: {
    miMapa: "My Map",
    identidad: "Identity",
    mundo: "World",
    circulo: "Circle",
    inteligencia: "Intelligence",
    sabiduria: "Wisdom",
    sintesisIntegral: "Full Synthesis",
    queTeTraeHoy: "What brings you here today?",
    decidir: "Decide",
    premium: "Premium",
    privacidadRadical: "Radical privacy",
  },

  affinityTiers: {
    mismo: { label: "Your own sign", description: "Its year of origin is the same sign as yours." },
    amigo: { label: "Friend sign", description: "It's one of your two friend signs (三合 San He)." },
    enemigo: { label: "Enemy sign", description: "It's your direct opposite in the cycle (六冲 Liu Chong): what's best to avoid." },
    otro: { label: "Rest of the cycle", description: "Not your sign, not your two friends, not your enemy: the cycle says nothing special." },
  },

  scoreLabels: {
    excellent: "High",
    good: "Notable",
    neutral: "Moderate",
    poor: "Subtle",
  },

  premium: {
    priceLabel: "$8 USD",
    eyebrow: "Full reading",
    headline: "You know your pieces.",
    headlineLine2: "Now see how they connect.",
    conversationHeading: "The conversation",
    conversationHeadingLine2: "between your systems.",
    conversationBody: "Everything above is yours, free. What follows is the part that crosses the three systems in a single reading written for your map, plus open questions about your decisions. A one-time payment of 8 dollars, lifetime access — no subscription.",
    body: "Your full synthesis brings numerology, astrology and the Chinese zodiac together in one reading: which patterns line up, which tensions show up and what matters in your current moment.",
    whatYouGetLabel: "What's included",
    benefitsCount: "5 benefits",
    priceSuffix: "USD",
    priceNote: "One-time payment · lifetime",
    priceArs: "(~11,880 ARS)",
    priceBadge: "One-time payment",
    payWithMercadoPago: "Pay with Mercado Pago",
    payWithBitcoin: "Pay with Bitcoin",
    payDescription: "You pay once with Mercado Pago and unlock your full Pro Reading. No subscriptions, no extra charges.",
    paymentUnavailable: "Payment isn't available right now. Please try again later.",
    hookTitle: "Archetypes and the Chinese Zodiac agree on {keyword}.",
    hookDescription: "Your archetype ({keyword}) and your {zodiac} sign ({element}) are calculated along separate paths and land on the same thing. It's the trait that's hardest to switch off when you'd rather go unnoticed.",
    featureBadges: {
      noSurprises: "No surprise charges",
      multiDevice: "Recoverable on any device",
      instantDelivery: "Instant delivery",
    },
    giftQuestion: "Want to give it to someone?",
    faqLink: "See what Premium includes & FAQ →",
    comparisonTitle: "Detailed comparison: Free vs Pro Reading",
    recoverAccess: "Recover access",
    haveCoupon: "I have a coupon",
    couponPlaceholder: "Enter your code",
  },
} as unknown as Dictionary;
