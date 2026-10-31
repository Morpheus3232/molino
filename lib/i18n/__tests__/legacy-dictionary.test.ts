import { describe, it, expect } from "vitest";
import { es } from "../dictionaries/es";
import { en } from "../dictionaries/en";

function shape(o: unknown, prefix = ""): string[] {
  if (o && typeof o === "object") return Object.entries(o).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}

describe("diccionario de interfaz en inglés", () => {
  it("tiene exactamente las mismas claves que el español", () => {
    expect(shape(en).sort()).toEqual(shape(es).sort());
  });
  it("conserva los marcadores {…} de cada plantilla", () => {
    const flat = (o: unknown, p = ""): [string, string][] =>
      o && typeof o === "object" ? Object.entries(o).flatMap(([k, v]) => flat(v, p ? `${p}.${k}` : k)) : [[p, String(o)]];
    const enMap = new Map(flat(en));
    for (const [k, v] of flat(es)) {
      const marks = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(marks(enMap.get(k) ?? ""), k).toEqual(marks(v));
    }
  });
});
