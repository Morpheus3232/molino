import { describe, it, expect } from "vitest";
import { getElementColor } from "../zodiacElementColorEngine";
import { getElementColorByYear, getChineseElement } from "../chineseZodiacEngine";

describe("Zodiac Element Color Engine", () => {
  describe("getElementColor", () => {
    it("Madera → Verde", () => {
      expect(getElementColor("Madera").color).toBe("Verde");
    });

    it("Fuego → Rojo", () => {
      expect(getElementColor("Fuego").color).toBe("Rojo");
    });

    it("Tierra → Amarillo/Dorado", () => {
      expect(getElementColor("Tierra").color).toBe("Amarillo/Dorado");
    });

    it("Metal → Blanco/Plateado", () => {
      expect(getElementColor("Metal").color).toBe("Blanco/Plateado");
    });

    it("Agua → Negro/Azul oscuro", () => {
      expect(getElementColor("Agua").color).toBe("Negro/Azul oscuro");
    });
  });

  describe("getElementColorByYear (integración con chineseZodiacEngine)", () => {
    it("es consistente con getChineseElement para el mismo año", () => {
      const element = getChineseElement(1988);
      expect(getElementColorByYear(1988).element).toBe(element);
    });
  });
});
