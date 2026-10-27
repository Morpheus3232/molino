import { describe, it, expect } from "vitest";
import { makeTranslator } from "../translate";

describe("makeTranslator", () => {
  const t = makeTranslator({
    Caballo: "Horse",
    cooperación: "cooperation",
    enero: "January",
    Dragón: "Dragon",
    Tierra: "Earth",
    "{#} de {} de {#}": "{2} {1}, {3}",
    "{#}: {#} de {} — {} de {}.": "{1}: {3} {2} — {5} {4}.",
    "Año {}": "Year {}",
  });

  it("traduce por frase exacta y deja igual lo que no conoce", () => {
    expect(t.t("Caballo")).toBe("Horse");
    expect(t.t("Gato")).toBe("Gato");
    expect(t.t(7)).toBe(7);
  });

  it("respeta la caja de la clave en coincidencia exacta y la del texto si no", () => {
    expect(t.t("enero")).toBe("January");
    expect(t.t("Cooperación")).toBe("Cooperation");
    expect(t.t("CABALLO")).toBe("HORSE");
  });

  it("los comodines traducen cada parte y {N} reordena", () => {
    expect(t.t("Año Caballo")).toBe("Year Horse");
    expect(t.t("23 de enero de 2024")).toBe("January 23, 2024");
    expect(t.t("1928: 23 de enero — Dragón de Tierra.")).toBe("1928: January 23 — Earth Dragon.");
  });

  it("{#} solo acepta dígitos", () => {
    expect(t.t("Fundación de la Puebla de los Ángeles")).toBe("Fundación de la Puebla de los Ángeles");
  });

  it("tx recorre objetos y arrays", () => {
    expect(t.tx({ a: ["Caballo", { b: "Tierra" }], n: 3 })).toEqual({ a: ["Horse", { b: "Earth" }], n: 3 });
  });

  it("sin diccionario es la identidad", () => {
    expect(makeTranslator(null).t("Caballo")).toBe("Caballo");
  });
});

describe("enumeraciones", () => {
  const L = makeTranslator({ liderazgo: "leadership", coraje: "courage", independencia: "independence" });
  it("traduce la lista solo si todas las partes se conocen", () => {
    expect(L.t("liderazgo, independencia y coraje")).toBe("leadership, independence and courage");
    expect(L.t("liderazgo y algo desconocido")).toBe("liderazgo y algo desconocido");
  });
});
