import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import EntityVisual from "../EntityVisual";
import { resolveEntityIconKind } from "../EntityIcon";

describe("EntityIcon resolution", () => {
  it("resolves football for teams, players, and soccer themes", () => {
    expect(resolveEntityIconKind({ name: "Boca Juniors", type: "team" })).toBe("football");
    expect(resolveEntityIconKind({ name: "River Plate", type: "team" })).toBe("football");
    expect(resolveEntityIconKind({ name: "Lionel Messi", type: "football_player" })).toBe("football");
    expect(resolveEntityIconKind({ name: "Dibu Martínez", emoji: "⚽" })).toBe("football");
  });

  it("resolves sneaker for footwear brands and zapatillas", () => {
    expect(resolveEntityIconKind({ name: "Vans", category: "ropa", emoji: "👟" })).toBe("sneaker");
    expect(resolveEntityIconKind({ name: "Nike", emoji: "👟" })).toBe("sneaker");
    expect(resolveEntityIconKind({ name: "Converse" })).toBe("sneaker");
    expect(resolveEntityIconKind({ name: "Adidas", category: "zapatillas" })).toBe("sneaker");
  });

  it("resolves apparel for clothing and fashion", () => {
    expect(resolveEntityIconKind({ name: "Uniqlo", category: "ropa" })).toBe("apparel");
    expect(resolveEntityIconKind({ name: "Levi's", emoji: "👖" })).toBe("apparel");
    expect(resolveEntityIconKind({ name: "Tommy Hilfiger", category: "ropa" })).toBe("apparel");
  });

  it("resolves car for automotive brands and autos", () => {
    expect(resolveEntityIconKind({ name: "Renault", category: "autos" })).toBe("car");
    expect(resolveEntityIconKind({ name: "Ferrari", emoji: "🏎️" })).toBe("car");
    expect(resolveEntityIconKind({ name: "Toyota", emoji: "🚗" })).toBe("car");
    expect(resolveEntityIconKind({ name: "Fiat" })).toBe("car");
  });

  it("resolves university for academic institutions", () => {
    expect(resolveEntityIconKind({ name: "Universidad de Buenos Aires", type: "university" })).toBe("university");
    expect(resolveEntityIconKind({ name: "Harvard", emoji: "🎓" })).toBe("university");
  });

  it("resolves city for cities and urban landmarks", () => {
    expect(resolveEntityIconKind({ name: "Buenos Aires", type: "city" })).toBe("city");
    expect(resolveEntityIconKind({ name: "París", emoji: "🏛️", type: "city" })).toBe("city");
  });

  it("resolves movie for cinema and films", () => {
    expect(resolveEntityIconKind({ name: "Nueve Reinas", type: "movie" })).toBe("movie");
    expect(resolveEntityIconKind({ name: "El Secreto de sus Ojos", emoji: "🎬" })).toBe("movie");
  });

  it("resolves person/music for artists and famous people", () => {
    expect(resolveEntityIconKind({ name: "Charly García", type: "artist", keyThemes: ["Música", "Rock"] })).toBe("music");
    expect(resolveEntityIconKind({ name: "Jorge Luis Borges", type: "artist", keyThemes: ["Literatura"] })).toBe("person");
  });
});

describe("EntityVisual Component", () => {
  it("renders genuine vector icon for a soccer team", () => {
    const { container } = render(
      <EntityVisual name="Boca Juniors" type="team" size={36} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders genuine vector icon for a sneaker brand", () => {
    const { container } = render(
      <EntityVisual name="Vans" emoji="👟" category="ropa" size={36} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders genuine vector icon for an automotive brand", () => {
    const { container } = render(
      <EntityVisual name="Ferrari" category="autos" size={36} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders flag emoji when visualType is flag", () => {
    const { container } = render(
      <EntityVisual visualType="flag" countryISO="AR" name="Argentina" size={36} />
    );
    expect(container.textContent).toContain("🇦🇷");
  });

  it("renders genuine ZodiacAnimalIcon when given a zodiac animal", () => {
    const { container } = render(
      <EntityVisual name="Caballo" animal="Caballo" size={36} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-label", "Caballo");
  });
});
