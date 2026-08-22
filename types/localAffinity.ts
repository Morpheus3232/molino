/**
 * Modelos de datos preparados en Fase 6A (2026-08-22) para dominios de
 * afinidad que la auditoría confirmó que NO existen todavía en el repo:
 * música (banda/disco → animal chino) y criptomonedas.
 *
 * Ninguno de los dos tiene dataset poblado en esta fase — son solo los
 * tipos, para que la expansión futura (Fase 6B+) tenga un contrato claro
 * en vez de decidir la forma de los datos ad-hoc por archivo.
 *
 * País → Ciudad → Barrio → Lugar/local (barrios de CABA, restaurantes) NO
 * necesita un tipo nuevo: ya es representable con AtlasEntityInput
 * (types/atlas.ts) usando `neighborhood` + `type: "venue"` — ver el
 * comentario en ese archivo.
 *
 * Marcas por categoría tampoco necesita un tipo nuevo: BrandData
 * (lib/data/brands.ts) ya tiene `category` como string libre y
 * `getBrandCategories()` ya deriva la lista dinámicamente.
 */

import type { Animal } from "@/lib/data/animalRelations";

// ─── Música: banda + disco + afinidad por zodíaco chino ───

export interface BandProfile {
  id: string;
  name: string;
  /** Año de formación real y verificable — el animal se deriva de acá con getChineseAnimal(), nunca se hardcodea. */
  formationYear: number;
  country: string;
  /** Texto libre ("Rock", "Pop", "Cumbia") — mismo patrón que BrandData.category, no un enum cerrado. */
  genre: string;
  sourceNote: string;
}

export interface AlbumProfile {
  id: string;
  bandId: string;
  name: string;
  /** Año de lanzamiento real — también se deriva el animal desde acá, no desde formationYear de la banda. */
  releaseYear: number;
  sourceNote: string;
}

export interface MusicAffinityResult {
  band: BandProfile;
  /** Animal chino de la banda, derivado de formationYear vía chineseZodiacEngine.getChineseAnimal() — nunca hardcodeado. */
  bandAnimal: Animal;
  album?: AlbumProfile;
  albumAnimal?: Animal;
  /** true cuando bandAnimal === el animal del perfil del usuario (o del disco) — la señal de afinidad real, no una relación inventada. */
  resonates: boolean;
  explanation: string;
}

// ─── Criptomonedas: afinidad simbólica, nunca asesoramiento financiero ───

/**
 * El campo `disclaimer` es obligatorio a propósito (no opcional): el tipo
 * mismo obliga a que cualquier entrada de cripto declare que es contenido
 * de entretenimiento/afinidad simbólica, no una recomendación financiera.
 * No hay ningún precedente de este texto en el repo — hay que redactarlo
 * antes de cargar la primera entrada real.
 */
export interface CryptoAffinityEntry {
  symbol: string;
  name: string;
  /** Por qué resuena simbólicamente con el signo/animal — nunca una razón de mercado ("va a subir", "buen momento para comprar"). */
  symbolicReason: string;
  disclaimer: string;
}

export interface CryptoAffinityBySign {
  /** Eje de agrupación: se recomienda animal chino por consistencia con el resto del sitio (ver auditoría Fase 5), no signo occidental. */
  animal: Animal;
  recommend: CryptoAffinityEntry[];
  avoid: CryptoAffinityEntry[];
}
