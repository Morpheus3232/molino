import { describe, it, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";
import { BRAND_LOGO_DOMAINS } from "../brand-logo-domains";

/**
 * Todas las marcas del atlas deben tener un imageUrl (Clearbit Logo API)
 * al enriquecerse. Este test es el candado: si se agrega una marca sin
 * entrada en BRAND_LOGO_DOMAINS, el test falla y avisa.
 */
describe("cobertura de logos para marcas del atlas", () => {
  const brands = SYMBOLIC_ENTITIES.filter((e) => e.type === "brand");

  it("hay marcas en el atlas para testear", () => {
    expect(brands.length).toBeGreaterThan(50);
  });

  const brandsSinLogo = brands.filter((b) => !b.imageUrl);

  it("todas las marcas del atlas tienen imageUrl (Clearbit)", () => {
    if (brandsSinLogo.length > 0) {
      const nombres = brandsSinLogo.map((b) => b.name).join(", ");
      throw new Error(
        `${brandsSinLogo.length} marcas sin logo en BRAND_LOGO_DOMAINS: ${nombres}`
      );
    }
    expect(brandsSinLogo).toEqual([]);
  });

  it("todas las URLs son de Clearbit y apuntan a un dominio válido", () => {
    const invalidas = brands
      .filter((b) => b.imageUrl && !b.imageUrl.startsWith("https://logo.clearbit.com/"))
      .map((b) => `${b.name}: ${b.imageUrl}`);
    expect(invalidas).toEqual([]);
  });

  it("todas las marcas del mapa tienen dominio que empieza con un TLD válido", () => {
    const dominiosInvalidos = Object.entries(BRAND_LOGO_DOMAINS)
      .filter(([, domain]) => !domain.includes("."))
      .map(([name, domain]) => `${name}: ${domain}`);
    expect(dominiosInvalidos).toEqual([]);
  });
});
