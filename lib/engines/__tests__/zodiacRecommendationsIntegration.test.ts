import { describe, it, expect } from "vitest";
import { getChineseZodiacRecommendations, getChineseAnimal } from "../chineseZodiacEngine";

describe("Zodiac Recommendations Integration", () => {
  it("1989 (Serpiente) → food.nivel ALTO", () => {
    const result = getChineseZodiacRecommendations(1989);
    expect(result.sign).toBe("Serpiente");
    expect(result.food.nivel).toBe("ALTO");
    expect(result.food.alimento).toBe("Cerdo");
  });

  it("1988 (Dragón) → pet.petToAvoid Perro", () => {
    const result = getChineseZodiacRecommendations(1988);
    expect(result.sign).toBe("Dragón");
    expect(result.pet.petToAvoid).toBe("Perro");
  });

  it("1990 (Caballo) → timing.favorability MUY_FAVORABLE en 2026", () => {
    const result = getChineseZodiacRecommendations(1990);
    expect(result.timing.favorability).toBe("MUY_FAVORABLE");
  });

  it("no rompe el cálculo existente del signo/animal", () => {
    expect(getChineseAnimal(1989)).toBe("Serpiente");
    expect(getChineseAnimal(1988)).toBe("Dragón");
    expect(getChineseAnimal(1990)).toBe("Caballo");
    expect(getChineseAnimal(1984)).toBe("Rata");
  });
});
