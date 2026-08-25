import { describe, it, expect } from "vitest";
import { buildBirthGrid, LO_SHU_LAYOUT } from "@/lib/engines/birthGridEngine";

describe("birthGridEngine", () => {
  it("cuenta los dígitos de la fecha e ignora los ceros", () => {
    // 1990-05-14 -> dígitos contables: 1,9,9,5,1,4 (los ceros no van a la grilla)
    const g = buildBirthGrid("1990-05-14");
    expect(g.digits).toEqual([1, 9, 9, 5, 1, 4]);
    expect(g.counts[1]).toBe(2);
    expect(g.counts[9]).toBe(2);
    expect(g.counts[5]).toBe(1);
    expect(g.counts[4]).toBe(1);
    expect(g.counts[2]).toBe(0);
  });

  it("el conteo total coincide con la cantidad de dígitos — es verificable a mano", () => {
    for (const fecha of ["1990-05-14", "2000-01-01", "1972-12-31", "1985-11-02"]) {
      const g = buildBirthGrid(fecha);
      const suma = Object.values(g.counts).reduce((a, b) => a + b, 0);
      expect(suma).toBe(g.digits.length);
    }
  });

  it("la grilla usa la disposición Lo Shu", () => {
    const g = buildBirthGrid("1990-05-14");
    expect(g.grid.map((r) => r.map((c) => c.digit))).toEqual(
      LO_SHU_LAYOUT.map((r) => [...r])
    );
  });

  it("missing y repeated son coherentes con counts", () => {
    for (const fecha of ["1990-05-14", "2000-01-01", "1972-12-31"]) {
      const g = buildBirthGrid(fecha);
      for (const d of g.missing) expect(g.counts[d]).toBe(0);
      for (const r of g.repeated) expect(g.counts[r.digit]).toBe(r.count);
      expect(g.repeated.every((r) => r.count >= 2)).toBe(true);
      // Los nueve dígitos están cubiertos: o aparecen, o están en missing.
      const aparecen = Object.entries(g.counts).filter(([, c]) => c > 0).length;
      expect(aparecen + g.missing.length).toBe(9);
    }
  });

  it("una línea 'full' tiene sus tres dígitos presentes y una 'empty' ninguno", () => {
    for (const fecha of ["1990-05-14", "2000-01-01", "1972-12-31", "1985-11-02"]) {
      const g = buildBirthGrid(fecha);
      for (const l of g.lines) {
        const presentes = l.digits.filter((d) => g.counts[d] > 0).length;
        if (l.state === "full") expect(presentes).toBe(3);
        else expect(presentes).toBe(0);
      }
    }
  });

  it("no reporta líneas parciales — solo completas o vacías", () => {
    const g = buildBirthGrid("1990-05-14");
    for (const l of g.lines) expect(["full", "empty"]).toContain(l.state);
  });

  it("toda línea trae su lectura y su nombre", () => {
    const g = buildBirthGrid("1972-12-31");
    for (const l of g.lines) {
      expect(l.name.trim().length).toBeGreaterThan(0);
      expect(l.reading.trim().length).toBeGreaterThan(0);
      expect(l.digits).toHaveLength(3);
    }
  });

  it("es determinista", () => {
    expect(buildBirthGrid("1990-05-14")).toEqual(buildBirthGrid("1990-05-14"));
  });

  it("fechas distintas producen cuadros distintos", () => {
    const a = buildBirthGrid("1990-05-14");
    const b = buildBirthGrid("1972-12-31");
    expect(a.counts).not.toEqual(b.counts);
  });

  it("no explota con entrada vacía o basura", () => {
    for (const malo of ["", "no-es-fecha", "0000-00-00"]) {
      const g = buildBirthGrid(malo);
      expect(g.digits).toEqual([]);
      expect(g.missing).toHaveLength(9);
      expect(g.repeated).toEqual([]);
      // Sin dígitos, ninguna línea puede estar completa: todas vacías.
      expect(g.lines.every((l) => l.state === "empty")).toBe(true);
    }
  });
});
