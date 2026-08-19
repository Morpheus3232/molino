"use client";

import { useUserContext } from "@/lib/context/useUserContext";
import { getDictionary } from "./index";
import type { Dictionary } from "./dictionaries/es";

/**
 * El hook prometido en index.ts: cuando un componente necesita copy
 * traducible, usa esto en vez de importar `t` directo. Hoy en/pt-BR son
 * idénticos a es (ver locales.ts), así que el resultado no cambia todavía —
 * pero el seam ya está armado: el día que haya dictionaries reales, esto
 * empieza a devolver el idioma correcto sin tocar los call sites.
 */
export function useDictionary(): Dictionary {
  const { context } = useUserContext();
  return getDictionary(context.language);
}
