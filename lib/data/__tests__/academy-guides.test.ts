import { describe, test, expect } from "vitest";
import { ACADEMY_GUIDES, getAcademyGuideBySlug } from "@/lib/data/academy-guides";
import { ACADEMY_PIECES, getAcademyPieceBySlug } from "@/lib/data/academy-content";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent } from "@/lib/data/entity-events";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

const EXPECTED_SLUGS = [
  "como-funciona-tu-mapa",
  "como-funciona-el-zodiaco-chino",
  "como-leer-una-afinidad",
  "como-funciona-hoy",
];

describe("ACADEMY_GUIDES — Fase 1 (4 guías)", () => {
  test("existen exactamente las 4 guías esperadas, en orden pedagógico", () => {
    expect(ACADEMY_GUIDES.map((g) => g.slug)).toEqual(EXPECTED_SLUGS);
  });

  test.each(ACADEMY_GUIDES.map((g) => g.slug))(
    "%s: tiene todos los campos obligatorios completos",
    (slug) => {
      const guide = getAcademyGuideBySlug(slug)!;
      expect(guide).toBeTruthy();
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.subtitle.length).toBeGreaterThan(0);
      expect(guide.metaDescription.length).toBeGreaterThan(0);
      expect(guide.whatYouLearn.length).toBeGreaterThan(0);
      expect(guide.whatIs.length).toBeGreaterThan(0);
      expect(guide.howItWorks.length).toBeGreaterThan(0);
      expect(guide.howMolinoUsesIt.length).toBeGreaterThan(0);
      expect(guide.dato.length).toBeGreaterThan(0);
      expect(guide.tradicion.length).toBeGreaterThan(0);
      expect(guide.molino.length).toBeGreaterThan(0);
      expect(guide.whatItDoesNotMean.length).toBeGreaterThan(0);
      expect(guide.exploreLinks.length).toBeGreaterThan(0);
    }
  );

  test("cada exploreLink apunta a una ruta interna real (empieza con /)", () => {
    for (const guide of ACADEMY_GUIDES) {
      for (const link of guide.exploreLinks) {
        expect(link.href.startsWith("/")).toBe(true);
        expect(link.label.length).toBeGreaterThan(0);
      }
    }
  });

  test("no hay slugs duplicados entre piezas históricas y guías", () => {
    const pieceSlugs = new Set(ACADEMY_PIECES.map((p) => p.slug));
    for (const guide of ACADEMY_GUIDES) {
      expect(pieceSlugs.has(guide.slug)).toBe(false);
    }
  });

  test("getAcademyGuideBySlug resuelve un slug de guía y no un slug de pieza histórica", () => {
    expect(getAcademyGuideBySlug("como-funciona-el-zodiaco-chino")?.slug).toBe("como-funciona-el-zodiaco-chino");
    expect(getAcademyGuideBySlug("zodiaco-chino")).toBeUndefined(); // slug de la pieza histórica, no de la guía
    expect(getAcademyGuideBySlug("pitagoras")).toBeUndefined();
  });

  test("el lookup combinado [slug] resuelve piezas y guías sin pisarse", () => {
    // Mismo patrón de resolución que usa app/academy/[slug]/page.tsx.
    const resolve = (slug: string) => {
      const piece = getAcademyPieceBySlug(slug);
      const guide = piece ? undefined : getAcademyGuideBySlug(slug);
      return { piece, guide };
    };

    const historical = resolve("babilonia");
    expect(historical.piece?.slug).toBe("babilonia");
    expect(historical.guide).toBeUndefined();

    // "zodiaco-chino" es un slug histórico (pieza) — la guía equivalente
    // vive en "como-funciona-el-zodiaco-chino" precisamente para no chocar.
    const historicalZodiac = resolve("zodiaco-chino");
    expect(historicalZodiac.piece?.slug).toBe("zodiaco-chino");
    expect(historicalZodiac.guide).toBeUndefined();

    const guide = resolve("como-funciona-hoy");
    expect(guide.piece).toBeUndefined();
    expect(guide.guide?.slug).toBe("como-funciona-hoy");

    const missing = resolve("no-existe");
    expect(missing.piece).toBeUndefined();
    expect(missing.guide).toBeUndefined();
  });
});

describe("Guía 'Cómo leer una afinidad' — ejemplos verificados contra los engines reales", () => {
  const guide = getAcademyGuideBySlug("como-leer-una-afinidad")!;

  function findEntity(name: string) {
    const entity = SYMBOLIC_ENTITIES.find((e) => e.name === name);
    expect(entity, `entidad "${name}" debe existir en SYMBOLIC_ENTITIES`).toBeTruthy();
    return entity!;
  }

  test("tiene exactamente 3 ejemplos: mismo animal, tríada y opuesto", () => {
    expect(guide.examples?.length).toBe(3);
  });

  test("Spider-Man (2002) es 'mismo animal' que el Caballo, según el engine real", () => {
    const entity = findEntity("Spider-Man");
    const primary = getPrimaryEvent(entity)!;
    const { animal } = calculateAnimalFromDate(primary.date, primary.year);
    const relation = getRelation("Caballo" as Animal, animal as Animal);
    expect(relation.type).toBe("same");
  });

  test("YPF (1922) forma 'tríada' con el Caballo, según el engine real", () => {
    const entity = findEntity("YPF");
    const primary = getPrimaryEvent(entity)!;
    const { animal } = calculateAnimalFromDate(primary.date, primary.year);
    const relation = getRelation("Caballo" as Animal, animal as Animal);
    expect(relation.type).toBe("triad");
  });

  test("Corrientes (1588) es el animal 'opuesto' (clash) al Caballo, según el engine real", () => {
    const entity = findEntity("Corrientes");
    const primary = getPrimaryEvent(entity)!;
    const { animal } = calculateAnimalFromDate(primary.date, primary.year);
    const relation = getRelation("Caballo" as Animal, animal as Animal);
    expect(relation.type).toBe("clash");
  });
});

describe("Relación editorial recíproca entre la pieza histórica y su guía práctica", () => {
  test("solo la pieza 'zodiaco-chino' declara relatedGuideSlug — las otras 9 no", () => {
    const withGuide = ACADEMY_PIECES.filter((p) => p.relatedGuideSlug);
    expect(withGuide.map((p) => p.slug)).toEqual(["zodiaco-chino"]);
  });

  test("relatedGuideSlug de la pieza histórica resuelve a una guía real y existente", () => {
    const piece = getAcademyPieceBySlug("zodiaco-chino")!;
    expect(piece.relatedGuideSlug).toBe("como-funciona-el-zodiaco-chino");
    const guide = getAcademyGuideBySlug(piece.relatedGuideSlug!);
    expect(guide).toBeTruthy();
  });

  test("la guía práctica enlaza de vuelta a la pieza histórica (relación recíproca)", () => {
    const guide = getAcademyGuideBySlug("como-funciona-el-zodiaco-chino")!;
    const backLink = guide.exploreLinks.find((l) => l.href === "/academy/zodiaco-chino");
    expect(backLink).toBeTruthy();
  });

  test("ninguna otra guía enlaza de vuelta a una pieza histórica (el patrón es exclusivo de zodíaco chino)", () => {
    const otherGuides = ACADEMY_GUIDES.filter((g) => g.slug !== "como-funciona-el-zodiaco-chino");
    for (const guide of otherGuides) {
      const linksToPiece = guide.exploreLinks.some((l) =>
        ACADEMY_PIECES.some((p) => l.href === `/academy/${p.slug}`)
      );
      expect(linksToPiece).toBe(false);
    }
  });
});

describe("Guía 'Zodíaco chino' — tríadas citadas coinciden con animalRelations.ts", () => {
  const guide = getAcademyGuideBySlug("como-funciona-el-zodiaco-chino")!;

  test("el ejemplo de tríada nombra Rata-Dragón-Mono y Buey-Serpiente-Gallo, tal como en SAN_HE_TRIADS", () => {
    const triadExample = guide.examples?.find((e) => e.title.includes("Tríada"));
    expect(triadExample).toBeTruthy();
    expect(triadExample!.body).toContain("Rata-Dragón-Mono");
    expect(triadExample!.body).toContain("Buey-Serpiente-Gallo");
  });

  test("el ejemplo de opuesto nombra Rata-Caballo, tal como en LIU_CHONG_CLASHES", () => {
    const clashExample = guide.examples?.find((e) => e.title.includes("Opuesto"));
    expect(clashExample).toBeTruthy();
    expect(clashExample!.body).toContain("Rata-Caballo");
  });
});
