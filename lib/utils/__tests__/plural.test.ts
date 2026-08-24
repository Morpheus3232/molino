import { describe, it, expect } from "vitest";
import { formatViewAll, formatAllEntities, formatOtherEntities } from "../plural";

describe("Plural and gender agreement utils", () => {
  it("pluraliza correctamente con 'Ver todos los / todas las'", () => {
    expect(formatViewAll("country", "Países")).toBe("Ver todos los países");
    expect(formatViewAll("city", "Ciudades")).toBe("Ver todas las ciudades");
    expect(formatViewAll("brand", "Marcas")).toBe("Ver todas las marcas");
    expect(formatViewAll("team", "Equipos")).toBe("Ver todos los equipos");
    expect(formatViewAll("university", "Universidades")).toBe("Ver todas las universidades");
    expect(formatViewAll("artist", "Famosos")).toBe("Ver todos los famosos");
    expect(formatViewAll("artist", "Artistas")).toBe("Ver todos los artistas");
    expect(formatViewAll("movie", "Películas")).toBe("Ver todas las películas");
    expect(formatViewAll("football_player", "Jugadores")).toBe("Ver todos los jugadores");
  });

  it("resuelve género a partir del label si el type no coincide", () => {
    expect(formatViewAll("", "Países")).toBe("Ver todos los países");
    expect(formatViewAll("", "Ciudades")).toBe("Ver todas las ciudades");
    expect(formatViewAll("", "Equipos")).toBe("Ver todos los equipos");
  });

  it("genera 'Otros / Otras' correctamente", () => {
    expect(formatOtherEntities("country", "Países")).toBe("Otros países");
    expect(formatOtherEntities("city", "Ciudades")).toBe("Otras ciudades");
    expect(formatOtherEntities("team", "Equipos")).toBe("Otros equipos");
    expect(formatOtherEntities("university", "Universidades")).toBe("Otras universidades");
    expect(formatOtherEntities("artist", "Famosos")).toBe("Otros famosos");
    expect(formatOtherEntities("artist", "Artistas")).toBe("Otros artistas");
  });
});
