/**
 * Programmatic SEO route catalog.
 *
 * Single source of truth for the static route matrices (signo x casa,
 * compatibilidad signo-signo, animal x animal). Facts come from
 * lib/data/facts (objective, tabular) and lib/data/interpretations
 * (interpretive logic). No client bundle — this module is imported only by
 * the generator script, sitemap, and Server Components.
 */

import { SIGN_FACTS, type WesternSign } from "@/lib/data/facts/astrology-facts";
import { HOUSES } from "@/lib/data/knowledge";

/** Sign slugs in canonical order (lowercase, no accents). */
export const SIGN_SLUGS = [
  "aries", "tauro", "geminis", "cancer", "leo", "virgo",
  "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis",
] as const;

export const SIGN_NAMES: Record<string, WesternSign> = {
  aries: "Aries", tauro: "Tauro", geminis: "Géminis", cancer: "Cáncer",
  leo: "Leo", virgo: "Virgo", libra: "Libra", escorpio: "Escorpio",
  sagitario: "Sagitario", capricornio: "Capricornio", acuario: "Acuario", piscis: "Piscis",
};

export const HOUSE_NUMBERS = HOUSES.map((h) => h.number);

export const HOUSE_BY_NUMBER: Record<number, (typeof HOUSES)[number]> = Object.fromEntries(
  HOUSES.map((h) => [h.number, h])
);

export interface ProgrammaticRoute {
  /** URL path WITHOUT leading slash, e.g. "signo/3/casa/7" */
  path: string;
  title: string;
  description: string;
  /** priority for sitemap */
  priority: number;
}

/**
 * /signo/[n]/casa/[c] — a number's energy expressed through an astrological house.
 * 9 numbers (1-9) x 12 houses = 108 routes.
 */
export function signoXCasaRoutes(): ProgrammaticRoute[] {
  const routes: ProgrammaticRoute[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const house of HOUSES) {
      const path = `signo/${n}/casa/${house.number}`;
      routes.push({
        path,
        title: `Número ${n} en la Casa ${house.number} (${house.name}) — Numerología y Astrología`,
        description: `Qué significa tu número ${n} manifestado en la casa ${house.number} (${house.name}, ${house.area}). Síntesis de numerología y astrología para ${house.name.toLowerCase()}.`,
        priority: 0.6,
      });
    }
  }
  return routes;
}

/**
 * Un par de signos tiene UNA url canónica: `aries-virgo` y `virgo-aries` son
 * la misma lectura, así que la canónica va en orden zodiacal (el de
 * SIGN_SLUGS). Sin esto Google veía 144 páginas, 66 de ellas duplicadas.
 */
export function canonicalPairSlug(a: string, b: string): string {
  const ia = SIGN_SLUGS.indexOf(a as (typeof SIGN_SLUGS)[number]);
  const ib = SIGN_SLUGS.indexOf(b as (typeof SIGN_SLUGS)[number]);
  return ia <= ib ? `${a}-${b}` : `${b}-${a}`;
}

/** Regente, fechas y energía de cada signo (antes vivía solo en /sinastria). */
export const SIGN_PROFILES: Record<(typeof SIGN_SLUGS)[number], { ruler: string; dates: string; energy: string }> = {
  aries: { ruler: "Marte", dates: "21 Mar – 19 Abr", energy: "Impulso, valentía y liderazgo pionero" },
  tauro: { ruler: "Venus", dates: "20 Abr – 20 May", energy: "Estabilidad, sensualidad y construcción paciente" },
  geminis: { ruler: "Mercurio", dates: "21 May – 20 Jun", energy: "Curiosidad, agilidad mental y comunicación" },
  cancer: { ruler: "Luna", dates: "21 Jun – 22 Jul", energy: "Nutrición, intuición profunda y resguardo emocional" },
  leo: { ruler: "Sol", dates: "23 Jul – 22 Ago", energy: "Brillo, generosidad, nobleza y autoexpresión" },
  virgo: { ruler: "Mercurio", dates: "23 Ago – 22 Sep", energy: "Discernimiento, orden práctico y servicio" },
  libra: { ruler: "Venus", dates: "23 Sep – 22 Oct", energy: "Armonía, diplomacia y búsqueda de equilibrio" },
  escorpio: { ruler: "Plutón / Marte", dates: "23 Oct – 21 Nov", energy: "Transformación, profundidad e intensidad magnética" },
  sagitario: { ruler: "Júpiter", dates: "22 Nov – 21 Dic", energy: "Expansión, verdad, aventura y filosofía" },
  capricornio: { ruler: "Saturno", dates: "22 Dic – 19 Ene", energy: "Estructura, maestría, perseverancia y propósito" },
  acuario: { ruler: "Urano / Saturno", dates: "20 Ene – 18 Feb", energy: "Innovación, visión colectiva y libertad de pensamiento" },
  piscis: { ruler: "Neptuno / Júpiter", dates: "19 Feb – 20 Mar", energy: "Empatía mística, imaginación y sensibilidad universal" },
};

/**
 * /compatibilidad/[s1]-[s2] — matriz de compatibilidad entre signos.
 * Devuelve solo las 78 canónicas (orden zodiacal, incluye signo consigo
 * mismo): las 66 inversas existen pero apuntan con canonical a estas.
 */
export function compatibilidadSignosRoutes(): ProgrammaticRoute[] {
  const routes: ProgrammaticRoute[] = [];
  for (const a of SIGN_SLUGS) {
    for (const b of SIGN_SLUGS) {
      if (canonicalPairSlug(a, b) !== `${a}-${b}`) continue;
      const nameA = SIGN_NAMES[a];
      const nameB = SIGN_NAMES[b];
      const factA = SIGN_FACTS[nameA];
      const factB = SIGN_FACTS[nameB];
      const path = `compatibilidad/${a}-${b}`;
      routes.push({
        path,
        title: `Compatibilidad ${nameA} y ${nameB}: ${factA.element} + ${factB.element}`,
        description: `Descubrí la compatibilidad astrológica entre ${nameA} (${factA.element}, ${factA.modality}) y ${nameB} (${factB.element}, ${factB.modality}). Amor, comunicación y sinergia elemental.`,
        priority: 0.7,
      });
    }
  }
  return routes;
}

/** All programmatic routes for sitemap + metadata generation. */
export function allProgrammaticRoutes(): ProgrammaticRoute[] {
  return [
    ...signoXCasaRoutes(),
    ...compatibilidadSignosRoutes(),
  ];
}