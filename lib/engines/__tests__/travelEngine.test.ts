import { describe, it, expect } from "vitest";
import {
  classifyMonth,
  bestMonths,
  planTrip,
  upcomingMonths,
  destinationWindows,
  chineseYearOf,
  sameSignDestinations,
  haversineKm,
  daysBetween,
  addDays,
  type TravelDestination,
  type ClimateNormals,
} from "../travelEngine";
import { getTravelDestinations } from "@/lib/data/travel/destinations";
import { CAPITALS } from "@/lib/data/travel/capitals";
import { CLIMATE } from "@/lib/data/travel/climate";
import { ANIMALS } from "@/lib/data/animalRelations";

const flat = (t: number, p: number): ClimateNormals => ({ t: Array(12).fill(t), p: Array(12).fill(p) });

function dest(iso: string, animal: string, lat: number, lon: number, climate: ClimateNormals): TravelDestination {
  return {
    iso, name: iso, entityId: iso.toLowerCase(), animal, originDate: "1900-06-01",
    capital: { es: iso, en: iso, lat, lon }, climate,
  };
}

describe("classifyMonth", () => {
  it("usa umbrales fijos y dice por qué", () => {
    expect(classifyMonth(flat(22, 50), 0)).toMatchObject({ cls: "ideal", reason: null });
    expect(classifyMonth(flat(22, 140), 0)).toMatchObject({ cls: "bueno", reason: "lluvia" });
    expect(classifyMonth(flat(12, 40), 0)).toMatchObject({ cls: "bueno", reason: "frio" });
    expect(classifyMonth(flat(28, 40), 0)).toMatchObject({ cls: "bueno", reason: "calor" });
    expect(classifyMonth(flat(5, 40), 0)).toMatchObject({ cls: "evitar", reason: "frio" });
    expect(classifyMonth(flat(31, 40), 0)).toMatchObject({ cls: "evitar", reason: "calor" });
    expect(classifyMonth(flat(22, 250), 0)).toMatchObject({ cls: "evitar", reason: "lluvia" });
  });
  it("Buenos Aires: verano ideal no; otoño y primavera sí", () => {
    const ar = CLIMATE.AR;
    const { ideal } = bestMonths(ar);
    // marzo–abril y octubre–noviembre rondan los 17–22 °C con lluvia moderada
    expect(ideal).toEqual(expect.arrayContaining([3, 10]));
    expect(ideal).not.toContain(6); // julio: 11 °C
  });
});

describe("datos", () => {
  it("capitales de altura cerca de sus normales oficiales (±2,5 °C)", () => {
    // [enero, julio] medias oficiales aproximadas
    const real: Record<string, [number, number]> = {
      CO: [13.9, 13.8], MX: [14.4, 16.2], AR: [24.7, 11.0], ES: [6.3, 25.6], JO: [8.5, 25.5], LI: [0.4, 19.0], EC: [14.0, 14.2],
    };
    for (const [iso, [jan, jul]] of Object.entries(real)) {
      expect(Math.abs(CLIMATE[iso].t[0] - jan), `${iso} enero`).toBeLessThanOrEqual(2.5);
      expect(Math.abs(CLIMATE[iso].t[6] - jul), `${iso} julio`).toBeLessThanOrEqual(2.5);
    }
  });
  it("todo país con fecha exacta del Atlas tiene capital y clima", () => {
    const all = getTravelDestinations();
    expect(all.length).toBeGreaterThan(170);
    for (const d of all) {
      expect(CAPITALS[d.iso], d.iso).toBeDefined();
      expect(d.climate.t).toHaveLength(12);
      expect(d.climate.p).toHaveLength(12);
      expect(Math.abs(d.capital.lat)).toBeLessThanOrEqual(90);
    }
  });
  it("cada signo tiene al menos un destino", () => {
    const all = getTravelDestinations();
    for (const a of ANIMALS) expect(sameSignDestinations(a, all).length, a).toBeGreaterThan(0);
  });
  it("solo devuelve países del mismo signo", () => {
    const all = getTravelDestinations();
    for (const d of sameSignDestinations("Caballo", all)) expect(d.animal).toBe("Caballo");
  });
});

describe("años chinos", () => {
  it("2026 es Caballo hasta el 5 de febrero de 2027; desde el 6, Cabra", () => {
    expect(chineseYearOf("2027-02-05", "Caballo")).toMatchObject({ lunarYear: 2026, animal: "Caballo", relation: "mismo" });
    expect(chineseYearOf("2027-02-06", "Caballo")).toMatchObject({ lunarYear: 2027, animal: "Cabra", relation: "otro" });
    expect(chineseYearOf("2026-08-01", "Rata").relation).toBe("enemigo");
    expect(chineseYearOf("2026-08-01", "Tigre").relation).toBe("amigo");
  });
  it("upcomingMonths reparte por el año chino del día 15", () => {
    const u = upcomingMonths("2026-11-02");
    expect(u.current).toBe(2026);
    expect(u.next).toBe(2027);
    const jan = u.months.find((m) => m.ym === "2027-01");
    const feb = u.months.find((m) => m.ym === "2027-02");
    expect(jan?.lunarYear).toBe(2026);
    expect(feb?.lunarYear).toBe(2027);
    expect(u.months[0].ym).toBe("2026-11");
    expect(u.months.at(-1)?.ym).toBe("2028-01");
  });
  it("destinationWindows agrupa los meses buenos por año chino", () => {
    const d = dest("XX", "Caballo", 0, 0, flat(22, 50));
    const w = destinationWindows(d, upcomingMonths("2026-11-02").months);
    expect(w.byYear[2026].ideal).toEqual(["2026-11", "2026-12", "2027-01"]);
    expect(w.byYear[2027].ideal).toHaveLength(12);
  });
});

describe("planTrip", () => {
  const origin = { iso: "AR", name: "Argentina", city: "Buenos Aires", lat: -34.6, lon: -58.4 };
  const warmSouth: ClimateNormals = { t: [24, 24, 22, 19, 15, 12, 11, 12, 15, 18, 21, 23], p: Array(12).fill(60) };
  const north: ClimateNormals = { t: [3, 4, 8, 13, 18, 22, 25, 25, 20, 14, 8, 4], p: Array(12).fill(60) };

  it("elige destinos con buen clima en las fechas y vuelve a casa", () => {
    const ds = [
      dest("S1", "Caballo", -33, -70, warmSouth),
      dest("S2", "Caballo", -12, -77, warmSouth),
      dest("N1", "Caballo", 52, 13, north),
      dest("OT", "Rata", -30, -60, warmSouth),
    ];
    const plan = planTrip({ userAnimal: "Caballo", destinations: ds, origin, start: "2027-01-05", end: "2027-01-15" });
    expect(plan.nights).toBe(10);
    expect(plan.stops.map((s) => s.dest.iso).sort()).toEqual(["S1", "S2"]);
    expect(plan.stops.every((s) => s.dest.animal === "Caballo")).toBe(true);
    expect(plan.skipped.map((s) => s.dest.iso)).toEqual(["N1"]);
    expect(plan.legs).toHaveLength(3);
    expect(plan.legs.at(-1)?.to.name).toBe("Buenos Aires");
    expect(plan.stops.reduce((s, x) => s + x.nights, 0)).toBe(10);
    expect(plan.stops[0].arrive).toBe("2027-01-05");
    expect(plan.stops.at(-1)?.depart).toBe("2027-01-15");
  });

  it("no cuenta el país de origen como destino", () => {
    const ds = [dest("AR", "Caballo", -34.6, -58.4, warmSouth), dest("S1", "Caballo", -33, -70, warmSouth)];
    const plan = planTrip({ userAnimal: "Caballo", destinations: ds, origin, start: "2027-01-05", end: "2027-01-12" });
    expect(plan.originIsSameSign).toBe(true);
    expect(plan.stops.map((s) => s.dest.iso)).toEqual(["S1"]);
  });

  it("marca el cruce del Año Nuevo chino", () => {
    const ds = [dest("S1", "Caballo", -33, -70, warmSouth)];
    const plan = planTrip({ userAnimal: "Caballo", destinations: ds, origin, start: "2027-02-01", end: "2027-02-10" });
    expect(plan.stops[0].chineseYear.animal).toBe("Caballo");
    expect(plan.stops[0].chineseYearOnDepart?.animal).toBe("Cabra");
  });

  it("avisa cuando ningún destino tiene buen clima", () => {
    const ds = [dest("N1", "Caballo", 52, 13, north)];
    const plan = planTrip({ userAnimal: "Caballo", destinations: ds, origin, start: "2027-01-05", end: "2027-01-12" });
    expect(plan.noGoodClimate).toBe(true);
    expect(plan.stops).toHaveLength(1);
  });

  it("con datos reales arma un viaje para cada signo", () => {
    const all = getTravelDestinations();
    for (const a of ANIMALS) {
      const plan = planTrip({ userAnimal: a, destinations: all, origin, start: "2027-03-01", end: "2027-03-21" });
      expect(plan.stops.length, a).toBeGreaterThan(0);
      for (const s of plan.stops) expect(s.dest.animal).toBe(a);
    }
  });
});

describe("los más visitados primero", () => {
  const origin = { iso: "AR", name: "Argentina", city: "Buenos Aires", lat: -34.6, lon: -58.4 };
  const cold: ClimateNormals = { t: [3, 4, 8, 13, 18, 22, 25, 25, 20, 14, 8, 4], p: Array(12).fill(60) };
  it("sameSignDestinations ordena por llegadas; sin dato, al final", () => {
    const ds = [
      { ...dest("AA", "Caballo", 0, 0, flat(22, 50)), arrivals: 2e6 },
      { ...dest("BB", "Caballo", 0, 0, flat(22, 50)) },
      { ...dest("CC", "Caballo", 0, 0, flat(22, 50)), arrivals: 80e6 },
    ];
    expect(sameSignDestinations("Caballo", ds).map((d) => d.iso)).toEqual(["CC", "AA", "BB"]);
  });
  it("prefiere el destino muy visitado aunque el clima sea peor", () => {
    const ds = [
      { ...dest("POP", "Caballo", 40.4, -3.7, cold), arrivals: 80e6 },
      { ...dest("RAR", "Caballo", -22.6, 17.1, flat(22, 50)), arrivals: 2e5 },
    ];
    const plan = planTrip({ userAnimal: "Caballo", destinations: ds, origin, start: "2027-01-05", end: "2027-01-10" });
    expect(plan.stops.map((s) => s.dest.iso)).toEqual(["POP"]);
    expect(plan.noGoodClimate).toBe(true);
    expect(plan.skipped[0]).toMatchObject({ reason: "noches" });
  });
  it("con datos reales, un Caballo que sale en enero va a México y Europa, no a Namibia", () => {
    const plan = planTrip({ userAnimal: "Caballo", destinations: getTravelDestinations(), origin, start: "2027-01-05", end: "2027-01-26" });
    const isos = plan.stops.map((s) => s.dest.iso);
    expect(isos).toContain("MX");
    expect(isos).toContain("ES");
    expect(isos).not.toContain("NA");
    expect(isos).not.toContain("BW");
  });
});

describe("utilidades", () => {
  it("haversine Buenos Aires–Madrid ≈ 10.000 km", () => {
    const km = haversineKm({ lat: -34.6, lon: -58.4 }, { lat: 40.4, lon: -3.7 });
    expect(km).toBeGreaterThan(9900);
    expect(km).toBeLessThan(10200);
  });
  it("fechas", () => {
    expect(daysBetween("2026-12-28", "2027-01-04")).toBe(7);
    expect(addDays("2027-02-27", 2)).toBe("2027-03-01");
  });
});
