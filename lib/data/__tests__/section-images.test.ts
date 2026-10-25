import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SECTION_IMAGES, signImageKey, animalImageKey, moonImageKey } from "../section-images";
import { CHINESE_ANIMALS } from "../zodiaco-chino-content";
import { NUMBERS } from "../numerologia-content";
import { ZODIAC_SIGNS } from "../astrologia-content";
import { SOURCES } from "../biblioteca-content";
import { ACADEMY_PIECES } from "../academy-content";
import { ACADEMY_GUIDES } from "../academy-guides";

/**
 * Cada página de Numerología, Astrología, Biblioteca y Academia tiene portada:
 * si se suma un número, un signo, una categoría o una pieza nueva sin foto,
 * este test lo marca en vez de que la página salga sin imagen.
 */
describe("portadas de secciones", () => {
  const required = [
    "numerologia/hub",
    "astrologia/hub",
    "biblioteca/hub",
    "academia/hub",
    ...NUMBERS.map((n) => `numerologia/${n.number}`),
    ...ZODIAC_SIGNS.map((s) => signImageKey(s.name)),
    ...[...new Set(SOURCES.map((s) => s.category))].map((c) => `biblioteca/${c}`),
    ...ACADEMY_PIECES.map((p) => `academia/${p.slug}`),
    ...ACADEMY_GUIDES.map((g) => `academia/${g.slug}`),
    "zodiaco-chino/hub",
    ...CHINESE_ANIMALS.map((a) => animalImageKey(a.name)),
  ];

  it("toda página tiene su imagen registrada", () => {
    expect(required.filter((k) => !SECTION_IMAGES[k])).toEqual([]);
  });

  it("cada imagen registrada existe en public/", () => {
    const missing = Object.values(SECTION_IMAGES)
      .map((i) => i.src)
      .filter((src) => !existsSync(join(process.cwd(), "public", src)));
    expect(missing).toEqual([]);
  });

  it("cada imagen tiene texto alternativo y crédito con enlace a la obra", () => {
    for (const [key, img] of Object.entries(SECTION_IMAGES)) {
      expect(img.alt.length, key).toBeGreaterThan(10);
      if (img.source) {
        expect(img.credit.url, key).toMatch(/^https:\/\/(www\.metmuseum\.org|clevelandart\.org|images\.nasa\.gov)\//);
      } else {
        expect(img.credit.url, key).toMatch(/^https:\/\/unsplash\.com\/photos\/[\w-]+$/);
      }
    }
  });

  it("las ocho fases de la Luna tienen imagen", () => {
    const phases = ["Nueva", "Creciente", "Cuarto Creciente", "Gibosa Creciente", "Llena", "Gibosa Menguante", "Cuarto Menguante", "Menguante"];
    for (const p of phases) {
      const key = moonImageKey(p);
      expect(key && SECTION_IMAGES[key], p).toBeTruthy();
    }
  });
});
