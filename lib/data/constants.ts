// Shared constants for Molino
// Single source of truth for zodiac symbols, element colors, and archetype descriptions

export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: "♈",
  Tauro: "♉",
  Géminis: "♊",
  Cáncer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Escorpio: "♏",
  Sagitario: "♐",
  Capricornio: "♑",
  Acuario: "♒",
  Piscis: "♓",
};

export const ELEMENT_COLORS: Record<string, string> = {
  Fuego: "#85691D",
  Tierra: "#2D5A3D",
  Aire: "#6B4C7A",
  Agua: "#2E5C8A",
  Metal: "#566470",
  Madera: "#436F43",
};

export const ARCHETYPE_DESCRIPTIONS: Record<number, string> = {
  1: "Naciste para liderar con independencia y claridad. Tu camino se construye con iniciativa, originalidad y coraje.",
  2: "Tu energía es la del puente. Desarrollás la sensibilidad, la diplomacia y la capacidad de unir mundos diferentes.",
  3: "Tu energía es la expresión creativa. Desarrollás la comunicación, la alegría y la capacidad de inspirar a otros.",
  4: "Tu energía es la de los cimientos. Desarrollás la confiabilidad, la organización y la capacidad de construir cosas duraderas.",
  5: "Tu energía es del cambio. Desarrollás la curiosidad, la adaptabilidad y la capacidad de expandir horizontes.",
  6: "Tu energía es la del hogar y la responsabilidad. Desarrollás la protección, la armonía y el amor práctico.",
  7: "Tu energía es la verdad interna. Desarrollás la sabiduría, la observación y la capacidad de ir más allá de lo superficial.",
  8: "Tu energía es la del imperio. Desarrollás la estrategia, la visión y la capacidad de materializar proyectos grandes.",
  9: "Tu energía es la del todo. Desarrollás la adaptación, la compasión y la capacidad de cerrar ciclos con sabiduría.",
  11: "Tu energía es la del puente entre mundos. Desarrollás la intuición, la inspiración y la capacidad de transmitir ideas nuevas.",
  22: "Tu energía es la del arquitecto divino. Desarrollás la manifestación, la organización y la capacidad de construir a gran escala.",
  33: "Tu energía es la del amor universal en acción. Desarrollás la sanación, la compasión y la capacidad de transformar desde el corazón.",
};

export const MAP_LAYERS = [
  { id: "identity", title: "Identidad", subtitle: "Quién sos", color: "var(--layer-identity)" },
  { id: "patterns", title: "Patrones", subtitle: "Qué se repite", color: "var(--layer-patterns)" },
  { id: "numerology", title: "Numerología", subtitle: "Qué dicen los números", color: "var(--layer-numerology)" },
  { id: "astrology", title: "Astrología", subtitle: "Qué dicen los astros", color: "var(--layer-astrology)" },
  { id: "cycles", title: "Ciclos", subtitle: "Cómo cambia", color: "var(--layer-cycles)" },
  { id: "moment", title: "Momento", subtitle: "Dónde estás", color: "var(--layer-moment)" },
];

export const EXPLORE_LAYERS = [
  { title: "Lugares", subtitle: "Dónde resonás", available: false },
  { title: "Marcas", subtitle: "Qué te representa", available: false },
  { title: "Relaciones", subtitle: "Cómo conectás", available: false },
];
