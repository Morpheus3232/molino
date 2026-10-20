import { expect, test } from "vitest";
import { brandListingOf, affinityListingOf } from "@/lib/data/brand-kinds";
import { getEntitiesByType } from "@/lib/data/symbolic-entities";

test("los dos rótulos de cada familia caen en su listado; el resto, en otras marcas", () => {
  expect(brandListingOf("autos")).toBe("autos");
  expect(brandListingOf("Autos y Movilidad")).toBe("autos");
  expect(brandListingOf("ropa")).toBe("ropa");
  expect(brandListingOf("Ropa y Moda")).toBe("ropa");
  expect(brandListingOf("otro")).toBe("brand");
  expect(brandListingOf(undefined)).toBe("brand");
  expect(affinityListingOf({ type: "city" })).toBe("city");
});

test("autos, ropa y otras marcas reparten todas las marcas, sin vacíos", () => {
  const brands = getEntitiesByType("brand");
  const count = (l: string) => brands.filter((e) => brandListingOf(e.category) === l).length;
  expect(count("autos")).toBeGreaterThan(0);
  expect(count("ropa")).toBeGreaterThan(0);
  expect(count("brand")).toBeGreaterThan(0);
  expect(count("autos") + count("ropa") + count("brand")).toBe(brands.length);
});
