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
 * /compatibilidad/[s1]-[s2] — astrological sign compatibility matrix.
 * 12 x 12 = 144 routes.
 */
export function compatibilidadSignosRoutes(): ProgrammaticRoute[] {
  const routes: ProgrammaticRoute[] = [];
  for (const a of SIGN_SLUGS) {
    for (const b of SIGN_SLUGS) {
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