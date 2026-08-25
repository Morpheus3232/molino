import { describe, it, expect } from "vitest";
import { COUNTRIES } from "../countries";
import { COUNTRY_ISO, getCountryISO } from "../country-iso";

/**
 * Un emoji de bandera ES el código ISO alpha-2 escrito en indicadores
 * regionales: 🇦🇷 son los codepoints de A y R. Decodificarlo no es una
 * inferencia, es leer el dato que ya está en el registro.
 */
function flagToISO(flag: string): string | null {
  const cps = [...flag].map((c) => c.codePointAt(0) ?? 0);
  if (cps.length !== 2) return null;
  const iso = cps.map((c) => String.fromCharCode(c - 0x1f1e6 + 65)).join("");
  return /^[A-Z]{2}$/.test(iso) ? iso : null;
}

describe("cobertura ISO de los países del onboarding", () => {
  /**
   * El Mapa Personal prioriza las entidades del país del usuario. Esa
   * prioridad se resuelve por ISO, así que un país que el onboarding ofrece
   * pero que no está en COUNTRY_ISO no rompe nada visible: simplemente deja
   * al usuario sin priorización y nadie se entera. Este test es el candado.
   */
  it("todo país que el onboarding ofrece resuelve a un ISO", () => {
    const sinISO = COUNTRIES.filter((c) => !getCountryISO(c.name)).map((c) => c.name);
    expect(sinISO).toEqual([]);
  });

  it("el ISO cargado coincide con la bandera del propio registro", () => {
    const conflictos = COUNTRIES.filter((c) => {
      const derivado = flagToISO(c.flag);
      const cargado = COUNTRY_ISO[c.name];
      return derivado && cargado && derivado !== cargado;
    }).map((c) => `${c.name}: tabla=${COUNTRY_ISO[c.name]} bandera=${flagToISO(c.flag)}`);

    expect(conflictos).toEqual([]);
  });
});
