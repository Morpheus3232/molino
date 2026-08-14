import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Marcas argentinas — fechas de fundación verificadas.
 * Lote representativo inicial: brand category ya tiene 189 entidades
 * (brands-60 + brands-autos-60) pero ninguna argentina. Este archivo
 * cubre las marcas argentinas más reconocibles con fecha documentada;
 * queda como base para ampliar en una siguiente pasada.
 */
export const BRANDS_ARGENTINA: AtlasEntityInput[] = [
  {
    id: "mercado-libre", name: "Mercado Libre", type: "brand", country: "Argentina",
    emoji: "🛒",
    description: "Mercado Libre es la plataforma de comercio electrónico más grande de América Latina, nacida en Argentina.",
    keyThemes: ["Comercio", "Escalabilidad", "Innovación", "Región"],
    category: "otro",
    sourceNote: "Fundada el 2 de agosto de 1999 por Marcos Galperin en Buenos Aires.",
    events: [
      {
        id: "mercado-libre-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1999-08-02",
        year: 1999,
        description: "Marcos Galperin funda Mercado Libre en Buenos Aires.",
        source: "Mercado Libre — Historia institucional / Wikipedia",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ypf", name: "YPF", type: "brand", country: "Argentina",
    emoji: "⛽",
    description: "YPF es la principal empresa de energía de Argentina, pionera estatal del petróleo en América Latina.",
    keyThemes: ["Energía", "Estado", "Industria", "Soberanía"],
    category: "otro",
    sourceNote: "Fundada el 3 de junio de 1922 por el gobierno argentino bajo la presidencia de Hipólito Yrigoyen.",
    events: [
      {
        id: "ypf-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1922-06-03",
        year: 1922,
        description: "El gobierno argentino crea Yacimientos Petrolíferos Fiscales.",
        source: "YPF — Historia institucional / Wikipedia",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "arcor", name: "Arcor", type: "brand", country: "Argentina",
    emoji: "🍬",
    description: "Arcor es el mayor productor de golosinas y alimentos de Argentina, con alcance global.",
    keyThemes: ["Industria", "Dulzura", "Familia", "Expansión"],
    category: "otro",
    sourceNote: "Fundada en 1951 en Arroyito, Córdoba. Fecha exacta de fundación no documentada públicamente; se usa el año.",
    events: [
      {
        id: "arcor-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1951,
        description: "Se funda Arcor en Arroyito, Córdoba.",
        source: "Arcor — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "quilmes", name: "Quilmes", type: "brand", country: "Argentina",
    emoji: "🍺",
    description: "Quilmes es la cerveza más consumida de Argentina, símbolo de encuentros y celebraciones populares.",
    keyThemes: ["Encuentro", "Tradición", "Celebración", "Identidad"],
    category: "otro",
    sourceNote: "Fundada en 1890 por Otto Bemberg; primer despacho de cerveza el 31 de octubre de 1890.",
    events: [
      {
        id: "quilmes-fundacion",
        type: "fundacion",
        label: "Primer despacho de cerveza",
        date: "1890-10-31",
        year: 1890,
        description: "Otto Bemberg funda la Cervecería Argentina Quilmes y se sirve el primer despacho de cerveza.",
        source: "Quilmes — Historia institucional",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
];
