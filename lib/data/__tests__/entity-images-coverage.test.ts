import { describe, it, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";

const IMAGE_TYPES = new Set(["team", "university", "artist", "football_player"]);

/**
 * Las imágenes de entidades (equipos, universidades, artistas, jugadores)
 * vienen de Wikipedia y se resuelven por id en enrichEntity. Este test
 * reporta cobertura y garantiza invariantes del mapeo.
 */
describe("cobertura de imágenes para entidades del atlas", () => {
  const withImages = SYMBOLIC_ENTITIES.filter((e) => e.imageUrl);
  const entityWithImages = SYMBOLIC_ENTITIES.filter(
    (e) => IMAGE_TYPES.has(e.type) && e.imageUrl
  );

  it("cubre la mayoría de equipos, universidades, artistas y jugadores", () => {
    const total = SYMBOLIC_ENTITIES.filter((e) => IMAGE_TYPES.has(e.type)).length;
    expect(entityWithImages.length).toBeGreaterThanOrEqual(Math.floor(total * 0.75));
  });

  it("las URLs de imagen vienen de fuentes confiables (Wikimedia o Clearbit)", () => {
    const invalidas = withImages.filter((e) => {
      const u = e.imageUrl!;
      const esWiki = u.startsWith("https://upload.wikimedia.org/");
      const esClearbit = u.startsWith("https://logo.clearbit.com/");
      return !esWiki && !esClearbit;
    });
    expect(invalidas).toEqual([]);
  });

  it("los jugadores de fútbol usan visualType portrait para mostrar su foto", () => {
    const jugadores = SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player" && e.imageUrl);
    expect(jugadores.length).toBeGreaterThan(50);
    for (const j of jugadores) {
      expect(j.visualType).toBe("portrait");
    }
  });

  it("los equipos y universidades usan visualType logo para mostrar su escudo", () => {
    const conImagen = SYMBOLIC_ENTITIES.filter(
      (e) => (e.type === "team" || e.type === "university") && e.imageUrl
    );
    expect(conImagen.length).toBeGreaterThan(80);
    for (const e of conImagen) {
      expect(e.visualType).toBe("logo");
    }
  });
});