import { describe, it, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";

/**
 * Las imágenes de entidad salen de Wikipedia vía scripts/fetch-wiki-images.mjs
 * (mapa ENTITY_IMAGE_URLS). La cobertura es parcial por diseño: lo que
 * Wikipedia no tiene queda con el ícono genérico. Este candado solo verifica
 * que TODA imageUrl resuelta apunte a upload.wikimedia.org — nunca a Clearbit
 * (API muerta) ni a un host arbitrario colado a mano.
 */
describe("imágenes de entidad", () => {
  const withImage = SYMBOLIC_ENTITIES.filter((e) => e.imageUrl);

  it("hay entidades con imagen para testear", () => {
    expect(withImage.length).toBeGreaterThan(100);
  });

  it("toda imageUrl es de upload.wikimedia.org", () => {
    const ajenas = withImage
      .filter((e) => !e.imageUrl!.startsWith("https://upload.wikimedia.org/"))
      .map((e) => `${e.name}: ${e.imageUrl}`);
    expect(ajenas).toEqual([]);
  });

  it("ninguna imageUrl apunta a Clearbit (API muerta)", () => {
    const clearbit = withImage.filter((e) => e.imageUrl!.includes("logo.clearbit.com"));
    expect(clearbit).toEqual([]);
  });
});
