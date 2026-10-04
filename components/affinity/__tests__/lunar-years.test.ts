import { test, expect } from "vitest";
import { lunarYearsOf } from "../EntitySignSection";

test("rangos exactos de cada año lunar, de Año Nuevo a la víspera del siguiente", () => {
  const mono = lunarYearsOf("Mono");
  expect(mono.find((r) => r.year === 1944)).toEqual({ year: 1944, start: "1944-01-25", end: "1945-02-12" });
  expect(lunarYearsOf("Dragón").find((r) => r.year === 2000)).toEqual({ year: 2000, start: "2000-02-05", end: "2001-01-23" });
  expect(mono.map((r) => r.year)).toEqual([1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016]);
});
