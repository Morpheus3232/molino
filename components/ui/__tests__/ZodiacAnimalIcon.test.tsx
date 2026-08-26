import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ZodiacAnimalIcon, { normalizeZodiacAnimal } from "../ZodiacAnimalIcon";

describe("ZodiacAnimalIcon", () => {
  it("normalizes animal names, emojis and aliases correctly", () => {
    expect(normalizeZodiacAnimal("Rata")).toBe("Rata");
    expect(normalizeZodiacAnimal("🐀")).toBe("Rata");
    expect(normalizeZodiacAnimal("buey")).toBe("Buey");
    expect(normalizeZodiacAnimal("Búfalo")).toBe("Buey");
    expect(normalizeZodiacAnimal("tigre")).toBe("Tigre");
    expect(normalizeZodiacAnimal("Gato")).toBe("Gato");
    expect(normalizeZodiacAnimal("Conejo")).toBe("Gato");
    expect(normalizeZodiacAnimal("Dragón")).toBe("Dragón");
    expect(normalizeZodiacAnimal("dragon")).toBe("Dragón");
    expect(normalizeZodiacAnimal("serpiente")).toBe("Serpiente");
    expect(normalizeZodiacAnimal("Caballo")).toBe("Caballo");
    expect(normalizeZodiacAnimal("cabra")).toBe("Cabra");
    expect(normalizeZodiacAnimal("mono")).toBe("Mono");
    expect(normalizeZodiacAnimal("gallo")).toBe("Gallo");
    expect(normalizeZodiacAnimal("perro")).toBe("Perro");
    expect(normalizeZodiacAnimal("cerdo")).toBe("Cerdo");
    expect(normalizeZodiacAnimal("chancho")).toBe("Cerdo");
  });

  const ALL_12_ANIMALS = [
    "Rata",
    "Buey",
    "Tigre",
    "Gato",
    "Dragón",
    "Serpiente",
    "Caballo",
    "Cabra",
    "Mono",
    "Gallo",
    "Perro",
    "Cerdo",
  ];

  ALL_12_ANIMALS.forEach((animal) => {
    it(`renders SVG icon for ${animal}`, () => {
      const { container } = render(<ZodiacAnimalIcon animal={animal} size={32} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label", animal);
      expect(svg).toHaveAttribute("width", "32");
      expect(svg).toHaveAttribute("height", "32");
    });
  });
});
