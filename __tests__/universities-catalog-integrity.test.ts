/**
 * Universidades — integridad del catálogo tras la limpieza de duplicados
 * (UBA, UNLP, UCEMA/UCES/CLAEH, Di Tella) y la ampliación de cobertura
 * (CABA + resto de Argentina).
 *
 * Reutiliza exclusivamente la arquitectura existente: getEntitiesByType(),
 * getEntityById(), toLightweightEntity() — no hay un catálogo paralelo.
 */
import { describe, it, expect } from "vitest";
import { getEntitiesByType, getEntityById, toLightweightEntity } from "@/lib/data/symbolic-entities";
import { groupByRelation } from "@/app/affinity/[type]/AffinityTypeContent";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";

const universities = getEntitiesByType("university");

describe("Universidades — unicidad de IDs", () => {
  it("no hay IDs duplicados en todo el catálogo de universidades", () => {
    const ids = universities.map(u => u.id);
    const seen = new Map<string, number>();
    for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
    const duplicated = [...seen.entries()].filter(([, count]) => count > 1);
    expect(duplicated).toEqual([]);
  });

  it("UBA existe exactamente una vez", () => {
    const matches = universities.filter(u => u.name.toLowerCase().includes("buenos aires") && u.name.toLowerCase().includes("universidad de buenos aires"));
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe("uba");
  });

  it("UNLP existe exactamente una vez, con la fecha oficial verificada (1905-08-12)", () => {
    const matches = universities.filter(u => u.name.includes("La Plata"));
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe("unlp");
    const event = matches[0].events.find(e => e.primaryForAffinity);
    expect(event?.date).toBe("1905-08-12");
  });

  it("Universidad Torcuato Di Tella existe exactamente una vez", () => {
    const matches = universities.filter(u => u.name.includes("Di Tella"));
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe("di-tella");
  });

  it("UCEMA y Universidad CLAEH tienen IDs propios y correctos (ninguna usa 'uces')", () => {
    const ucema = getEntityById("ucema");
    const claeh = getEntityById("claeh");
    expect(ucema?.name).toContain("CEMA");
    expect(claeh?.name).toContain("CLAEH");
    expect(getEntityById("uces")?.name).not.toContain("CEMA");
    expect(getEntityById("uces")?.name).not.toContain("CLAEH");
  });

  it("'uces' resuelve a la universidad argentina real (Ciencias Empresariales y Sociales)", () => {
    const uces = getEntityById("uces");
    expect(uces?.name).toContain("Ciencias Empresariales y Sociales");
    expect(uces?.country).toBe("Argentina");
  });
});

describe("Universidades — cobertura prioritaria", () => {
  const CABA_PRIORITY: Record<string, string> = {
    uba: "UBA",
    itba: "ITBA",
    usal: "Universidad del Salvador",
    uces: "UCES",
    uade: "UADE",
    uca: "UCA",
    "universidad-palermo": "Universidad de Palermo",
    "universidad-belgrano": "Universidad de Belgrano",
    austral: "Universidad Austral",
    "di-tella": "Universidad Torcuato Di Tella",
    "san-andres": "Universidad de San Andrés",
    "una-artes": "Universidad Nacional de las Artes",
    ucine: "Universidad del Cine",
    utn: "UTN",
  };

  const RESTO_ARGENTINA_PRIORITY: Record<string, string> = {
    unc: "UNC",
    unlp: "UNLP",
    unr: "UNR",
    unl: "UNL",
    uncuyo: "UNCUYO",
    unmdp: "UNMDP",
    uns: "UNS",
    unicen: "UNICEN",
    uncoma: "UNCOMA",
    ucc: "UCC",
    unsam: "UNSAM",
    unq: "UNQ",
    unt: "UNT",
    "universidad-siglo-21": "Universidad Siglo 21",
  };

  it.each(Object.entries({ ...CABA_PRIORITY, ...RESTO_ARGENTINA_PRIORITY }))(
    "%s (%s) está presente en el catálogo",
    (id) => {
      expect(getEntityById(id), `falta la entidad con id "${id}"`).toBeDefined();
    }
  );

  it("cada universidad prioritaria tiene un evento primario con animal derivado del año (no asignado a mano)", () => {
    for (const id of Object.keys({ ...CABA_PRIORITY, ...RESTO_ARGENTINA_PRIORITY })) {
      const entity = getEntityById(id)!;
      const primary = entity.events.find(e => e.primaryForAffinity);
      expect(primary, `${id} no tiene evento primaryForAffinity`).toBeDefined();
      expect(typeof primary!.year).toBe("number");
      // El animal se deriva del año/fecha vía toLightweightEntity() → resolveEntityAnimalData(),
      // nunca se asigna a mano en el dato crudo.
      expect(toLightweightEntity(entity).animal).toBeTruthy();
    }
  });
});

describe("Universidades — ninguna desaparece de /affinity/university por su relación zodiacal", () => {
  const lightweight = universities.map(toLightweightEntity);

  it.each(ANIMALS)("con animal activo %s, todas las universidades caen en algún grupo renderizable", (animal) => {
    const groups = groupByRelation(animal as Animal, lightweight.map(e => ({
      id: e.id, name: e.name, animal: e.animal, emoji: e.emoji, visualType: e.visualType,
      country: e.country, countryISO: e.countryISO, city: e.city, type: e.type,
      score: 0, tier: "afinidad-media" as const, relationship: "", isApproximate: e.isApproximate,
    })));
    const rendered = groups.same.length + groups.triad.length + groups.opposite.length + groups.other.length;
    expect(rendered).toBe(lightweight.length);
  });
});
