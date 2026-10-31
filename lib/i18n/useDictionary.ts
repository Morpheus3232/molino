"use client";

import { useLocale } from "next-intl";
import { getDictionary } from "./index";
import type { Dictionary } from "./dictionaries/es";

/**
 * Copy de interfaz del diccionario (`t.seccion.clave`) en el idioma de la URL:
 * /en/... → inglés, el resto → español.
 */
export function useDictionary(): Dictionary {
  return getDictionary(useLocale() === "en" ? "en" : "es");
}
