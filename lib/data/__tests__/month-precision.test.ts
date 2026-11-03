import { describe, it, expect } from "vitest";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { affirmableDate, fechaDeOrigen } from "../entity-events";
import { getEntityById, toLightweightEntity } from "../symbolic-entities";

describe("fecha con solo mes (2026-11-03)", () => {
  it("desde marzo el signo es el del año calendario y no es aproximado", () => {
    expect(calculateAnimalFromDate("1949-03", 1949)).toEqual({ animal: "Buey", isApproximate: false });
    expect(calculateAnimalFromDate("2008-10", 2008)).toEqual({ animal: "Rata", isApproximate: false });
  });
  it("enero y febrero siguen siendo aproximados", () => {
    expect(calculateAnimalFromDate("2003-01", 2003).isApproximate).toBe(true);
    expect(calculateAnimalFromDate("1894-02", 1894).isApproximate).toBe(true);
  });
  it("affirmableDate: día exacto, o mes desde marzo; nunca inventa un día", () => {
    expect(affirmableDate({ date: "1975-05-09" })).toBe("1975-05-09");
    expect(affirmableDate({ month: "1949-03" })).toBe("1949-03");
    expect(affirmableDate({ month: "2003-01" })).toBeUndefined();
    expect(affirmableDate({})).toBeUndefined();
  });
  it("se muestra el mes sin día", () => {
    expect(fechaDeOrigen("1949-03")).toBe("marzo de 1949");
    expect(fechaDeOrigen("1975-05-09")).toBe("9 de mayo de 1975");
  });
  it("Uniqlo entra al mapa con su mes y Zara con su día", () => {
    const u = toLightweightEntity(getEntityById("uniqlo")!);
    expect(u).toMatchObject({ originDate: "1949-03", animal: "Buey", isApproximate: false });
    const z = toLightweightEntity(getEntityById("zara")!);
    expect(z).toMatchObject({ originDate: "1975-05-09", animal: "Gato", isApproximate: false });
  });
});
