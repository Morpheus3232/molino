import { describe, test, expect } from "vitest";
import {
  CALENDARIO_NUMBERS,
  MASTER_DAYS,
  reduceDayNumber,
  reductionSteps,
} from "@/lib/data/calendario-numerologico";

describe("reduceDayNumber — reducción numérica de días", () => {
  test("días 1-9 no se reducen", () => {
    for (let day = 1; day <= 9; day++) {
      expect(reduceDayNumber(day)).toBe(day);
    }
  });

  test("días 10-31 se reducen a 1-9", () => {
    expect(reduceDayNumber(10)).toBe(1);
    expect(reduceDayNumber(12)).toBe(3);
    expect(reduceDayNumber(13)).toBe(4);
    expect(reduceDayNumber(14)).toBe(5);
    expect(reduceDayNumber(15)).toBe(6);
    expect(reduceDayNumber(16)).toBe(7);
    expect(reduceDayNumber(17)).toBe(8);
    expect(reduceDayNumber(18)).toBe(9);
    expect(reduceDayNumber(19)).toBe(1);
    expect(reduceDayNumber(20)).toBe(2);
    expect(reduceDayNumber(21)).toBe(3);
    expect(reduceDayNumber(23)).toBe(5);
    expect(reduceDayNumber(24)).toBe(6);
    expect(reduceDayNumber(25)).toBe(7);
    expect(reduceDayNumber(26)).toBe(8);
    expect(reduceDayNumber(27)).toBe(9);
    expect(reduceDayNumber(30)).toBe(3);
    expect(reduceDayNumber(31)).toBe(4);
  });

  test("números maestros 11, 22, 28, 33 no se reducen", () => {
    for (const day of MASTER_DAYS) {
      expect(reduceDayNumber(day)).toBe(day);
    }
  });

  test("si la suma da un número maestro, queda como maestro", () => {
    expect(reduceDayNumber(29)).toBe(11);
  });

  test("el resultado de cualquier día 1-31 tiene contenido definido", () => {
    for (let day = 1; day <= 31; day++) {
      const reduced = reduceDayNumber(day);
      expect(CALENDARIO_NUMBERS[reduced], `día ${day} → ${reduced}`).toBeDefined();
    }
  });
});

describe("reductionSteps — cadena de reducción", () => {
  test("pasos intermedios", () => {
    expect(reductionSteps(9)).toEqual([9]);
    expect(reductionSteps(11)).toEqual([11]);
    expect(reductionSteps(10)).toEqual([10, 1]);
    expect(reductionSteps(19)).toEqual([19, 10, 1]);
    expect(reductionSteps(29)).toEqual([29, 11]);
  });
});

describe("CALENDARIO_NUMBERS — contenido exacto del calendario", () => {
  test("títulos exactos por número", () => {
    expect(CALENDARIO_NUMBERS[1].title).toBe("El Líder");
    expect(CALENDARIO_NUMBERS[2].title).toBe("El Diplomático");
    expect(CALENDARIO_NUMBERS[3].title).toBe("El Creativo");
    expect(CALENDARIO_NUMBERS[4].title).toBe("El Constructor");
    expect(CALENDARIO_NUMBERS[5].title).toBe("El Explorador");
    expect(CALENDARIO_NUMBERS[6].title).toBe("El Cuidador");
    expect(CALENDARIO_NUMBERS[7].title).toBe("El Buscador");
    expect(CALENDARIO_NUMBERS[8].title).toBe("El Poder");
    expect(CALENDARIO_NUMBERS[9].title).toBe("El Adaptable");
    expect(CALENDARIO_NUMBERS[11].title).toBe("El Iluminado");
    expect(CALENDARIO_NUMBERS[22].title).toBe("El Maestro Constructor");
    expect(CALENDARIO_NUMBERS[28].title).toBe("Número Kármico");
    expect(CALENDARIO_NUMBERS[33].title).toBe("El Maestro Maestro");
  });

  test("todos los números tienen essence, description y tags", () => {
    for (const [key, info] of Object.entries(CALENDARIO_NUMBERS)) {
      expect(info.essence.length, `número ${key}`).toBeGreaterThan(0);
      expect(info.description.length, `número ${key}`).toBeGreaterThan(0);
      expect(info.tags.length, `número ${key}`).toBeGreaterThan(0);
    }
  });

  test("solo los maestros están marcados como master", () => {
    for (const [key, info] of Object.entries(CALENDARIO_NUMBERS)) {
      const n = Number(key);
      expect(info.master === true).toBe(MASTER_DAYS.includes(n));
    }
  });
});
