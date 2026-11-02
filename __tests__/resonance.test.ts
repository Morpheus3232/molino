/**
 * Resonancia del Atlas: tres casillas (propio, amigos, enemigo) + el resto,
 * que no se muestra. Liu He y Liu Hai quedan en el resto.
 */
import { describe, test, expect } from "vitest";
import { classifyResonance, bucketEntitiesByResonance, resonanceReasoning, ATLAS_BUCKETS } from "@/lib/resonance";

describe("classifyResonance", () => {
  test("mismo signo", () => expect(classifyResonance("Rata", "Rata").bucket).toBe("mismo"));
  test("los dos amigos San He", () => {
    expect(classifyResonance("Rata", "Dragón").bucket).toBe("amigo");
    expect(classifyResonance("Rata", "Mono").bucket).toBe("amigo");
  });
  test("el enemigo Liu Chong", () => expect(classifyResonance("Rata", "Caballo").bucket).toBe("enemigo"));
  test("Liu He y Liu Hai quedan fuera del modelo", () => {
    expect(classifyResonance("Rata", "Buey").bucket).toBe("otro");
    expect(classifyResonance("Rata", "Cabra").bucket).toBe("otro");
  });
  test("sin animal: resto del ciclo", () => expect(classifyResonance("", "Rata").bucket).toBe("otro"));
});

describe("bucketEntitiesByResonance", () => {
  const entities = [
    { id: "a", animal: "Rata" },
    { id: "b", animal: "Dragón" },
    { id: "c", animal: "Caballo" },
    { id: "d", animal: "Tigre" },
    { id: "e", animal: "Buey" },
  ];
  test("reparte en las cuatro casillas", () => {
    const b = bucketEntitiesByResonance("Rata", entities);
    expect(b.mismo.map((e) => e.id)).toEqual(["a"]);
    expect(b.amigo.map((e) => e.id)).toEqual(["b"]);
    expect(b.enemigo.map((e) => e.id)).toEqual(["c"]);
    expect(b.otro.map((e) => e.id)).toEqual(["d", "e"]);
  });
  test("el Atlas solo muestra propio, amigos y enemigo", () => {
    expect([...ATLAS_BUCKETS]).toEqual(["mismo", "amigo", "enemigo"]);
  });
});

describe("resonanceReasoning", () => {
  test("nombra el cruce concreto", () => {
    expect(resonanceReasoning("Rata", "Caballo", "Bogotá")).toContain("enemigo");
    expect(resonanceReasoning("Rata", "Mono", "X")).toContain("amigos");
  });
});
