import { describe, expect, test } from "vitest";
import { getAtlasNeighbors, lunarYearOfDate } from "@/lib/data/atlas-queries";

describe("lunarYearOfDate", () => {
  test("dentro de la tabla usa el Año Nuevo real", () => {
    expect(lunarYearOfDate("1901-02-15")).toBe(1900); // Año Nuevo 1901: 19 de febrero
    expect(lunarYearOfDate("1901-02-19")).toBe(1901);
  });

  test("fuera de la tabla solo afirma lo que no cae en la ventana de Año Nuevo", () => {
    expect(lunarYearOfDate("1540-08-15")).toBe(1540);
    expect(lunarYearOfDate("1540-01-10")).toBe(1539);
    expect(lunarYearOfDate("1540-02-01")).toBeNull();
  });
});

describe("getAtlasNeighbors", () => {
  test("Arequipa: mismo país y signo, y mismo año chino, sin incluirse a sí misma", () => {
    const n = getAtlasNeighbors("arequipa");
    expect(n.lunarYear).toBe(1540);
    expect(n.sameCountrySign.length).toBeGreaterThan(0);
    expect(n.sameCountrySign.every((e) => e.countryISO === "PE" && e.animal === "Rata")).toBe(true);
    expect([...n.sameCountrySign, ...n.sameLunarYear].some((e) => e.id === "arequipa")).toBe(false);
  });

  test("sin fecha exacta no hay vecinos", () => {
    const n = getAtlasNeighbors("person-william-shakespeare");
    expect(n.sameCountrySign).toEqual([]);
    expect(n.sameLunarYear).toEqual([]);
  });
});
