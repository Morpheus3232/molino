import { describe, it, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";
import { getPrimaryEvent } from "../entity-events";

/**
 * Invariante de datos: el año del evento primario es lo ÚNICO que determina el
 * animal de una entidad, y por lo tanto toda su afinidad en el sitio. Cuando
 * ese año contradice al `sourceNote` del propio registro, la entidad queda
 * fechada mal y arrastra el error a cada listado.
 *
 * Pasó de verdad: 39 marcas de `brands-60.ts` traían un `year` inventado con
 * un `sourceNote` correcto al lado (Levi's fechada en 1996 diciendo "Fundada
 * en 1853", Prada en 1963 diciendo 1913). Este test es el candado para que no
 * vuelva a entrar.
 *
 * Solo se valida contra `sourceNote`s que declaran un año de forma explícita
 * ("Fundada en 1853…"). Las notas vagas ("Presente desde los años 2000") no
 * afirman una fecha y quedan fuera.
 */
const EXPLICIT_YEAR = /^(?:Fundada|Fundado|Lanzada|Creada)\s+(?:el\s+\d{1,2}\s+de\s+\p{L}+\s+de\s+|en\s+)(\d{4})/u;

describe("consistencia de fechas del Atlas", () => {
  it("el año del evento primario coincide con el que declara su sourceNote", () => {
    const conflictos: string[] = [];

    for (const entity of SYMBOLIC_ENTITIES) {
      const declarado = entity.sourceNote?.match(EXPLICIT_YEAR)?.[1];
      if (!declarado) continue;
      const primary = getPrimaryEvent(entity);
      if (!primary) continue;
      if (primary.year !== Number(declarado)) {
        conflictos.push(`${entity.name}: evento ${primary.year} vs sourceNote ${declarado}`);
      }
    }

    expect(conflictos).toEqual([]);
  });

  it("toda entidad tiene un evento primario con año usable", () => {
    // Sin piso de año: San Marino (301), Kioto (794), Dublín (988) y El Cairo
    // (969) son fundaciones reales anteriores al año 1000.
    const rotas = SYMBOLIC_ENTITIES.filter((e) => {
      const primary = getPrimaryEvent(e);
      return !primary || !primary.year || primary.year < 1;
    }).map((e) => e.name);

    expect(rotas).toEqual([]);
  });
});
