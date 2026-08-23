import { describe, test, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";

// Regresión: el catálogo se arma concatenando muchos archivos (catálogos
// base + expansiones regionales — México/Colombia/España, autos, ropa,
// ciudades completas de Argentina) que en el pasado agregaron la misma
// entidad real dos veces bajo ids distintos (ej. "Toyota" en brands-60.ts Y
// en brands-autos-60.ts), o reutilizaron el mismo id para entidades
// distintas (ej. "quilmes" como ciudad y como marca de cerveza). Lo primero
// hacía que la misma entidad apareciera dos veces en cada listado de
// Afinidades; lo segundo rompía getEntityById() — la página de detalle de
// una de las dos entidades mostraba siempre los datos de la otra.

describe("SYMBOLIC_ENTITIES — sin duplicados ni colisiones de id", () => {
  test("cada id es único en todo el catálogo (getEntityById nunca es ambiguo)", () => {
    const idCounts: Record<string, string[]> = {};
    for (const e of SYMBOLIC_ENTITIES) {
      idCounts[e.id] = idCounts[e.id] || [];
      idCounts[e.id].push(`${e.type}:${e.name}`);
    }
    const collisions = Object.entries(idCounts).filter(([, refs]) => refs.length > 1);
    expect(collisions, `ids duplicados: ${JSON.stringify(collisions)}`).toEqual([]);
  });

  test("ninguna entidad real (mismo tipo + nombre + país) aparece dos veces", () => {
    const counts: Record<string, string[]> = {};
    for (const e of SYMBOLIC_ENTITIES) {
      const key = `${e.type}::${e.name}::${e.country ?? ""}`;
      counts[key] = counts[key] || [];
      counts[key].push(e.id);
    }
    const duplicates = Object.entries(counts).filter(([, ids]) => ids.length > 1);
    expect(duplicates, `entidades duplicadas: ${JSON.stringify(duplicates)}`).toEqual([]);
  });

  test("homónimos reales entre países se conservan (no son duplicados)", () => {
    // "Universidad de los Andes" existe en Chile y en Colombia — son dos
    // universidades distintas que comparten nombre; el dedup no debe
    // fusionarlas porque su country difiere.
    const andes = SYMBOLIC_ENTITIES.filter((e) => e.name === "Universidad de los Andes");
    expect(andes.length).toBe(2);
    expect(new Set(andes.map((e) => e.country)).size).toBe(2);
  });
});
