import { describe, it, expect } from "vitest";
import { calculateAnimalFromDate } from "../chineseZodiacEngine";

/**
 * El signo del zodíaco chino cambia en el Año Nuevo chino, que cae entre el 21
 * de enero y el 21 de febrero. La tabla real de cortes cubre 1886-2040; fuera
 * de ahí el motor aproxima con un 4 de febrero fijo, y esa aproximación puede
 * correr el signo un lugar. Una fecha exacta que produce un signo dudoso es
 * peor que ninguna: se presenta como verificada.
 */
describe("certeza del corte de Año Nuevo chino", () => {
  it("una fecha fuera de la ventana es certera aunque el año no esté en la tabla", () => {
    // 16 de abril de 1582: pase donde pase el corte, cae en su año calendario.
    expect(calculateAnimalFromDate("1582-04-16").isApproximate).toBe(false);
    expect(calculateAnimalFromDate("1788-12-25").isApproximate).toBe(false);
  });

  it("marca aproximada una fecha dentro de la ventana sin corte documentado", () => {
    // Casos reales del atlas: el corte de esos años no está documentado y la
    // fecha cae donde el Año Nuevo puede haber pasado o no.
    expect(calculateAnimalFromDate("1580-02-03").isApproximate).toBe(true); // Buenos Aires
    expect(calculateAnimalFromDate("1541-02-12").isApproximate).toBe(true); // Santiago
    expect(calculateAnimalFromDate("1542-02-14").isApproximate).toBe(true); // Guadalajara
    expect(calculateAnimalFromDate("1680-01-21").isApproximate).toBe(true); // Colonia
  });

  it("dentro de la tabla real la ventana no es un problema", () => {
    // 1990 sí tiene corte documentado (27 de enero), así que una fecha de esa
    // ventana se resuelve con certeza.
    expect(calculateAnimalFromDate("1990-02-10").isApproximate).toBe(false);
  });

  it("sin fecha sigue siendo aproximada", () => {
    expect(calculateAnimalFromDate(undefined, 1937).isApproximate).toBe(true);
  });
});
