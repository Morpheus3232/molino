# Logos e imágenes reales para cada entidad de afinidad

Fecha: 2026-08-29

## Problema

Cada entidad que aparece en una recomendación de afinidad (Mapa Personal,
secciones `/affinity/...`) debería mostrar su miniatura real: logo original de
la marca, foto real de la persona, póster de la película, escudo del equipo o
la universidad. Hoy:

- **Equipos, universidades, artistas, jugadores**: resueltos vía
  `scripts/wiki-image-runner.ts` → 346/418 con imagen de Wikipedia
  (`upload.wikimedia.org`). Funciona.
- **Marcas (~282)**: `enrichEntity` genera `https://logo.clearbit.com/{dominio}`
  desde `BRAND_LOGO_DOMAINS`. La Clearbit Logo API **cerró en diciembre de
  2024**: todas las marcas caen al ícono genérico y, peor, `next/image`
  intenta cargar una URL muerta.
- **Películas (26)**: `visualType: "album"`, sin ninguna fuente de imagen.
  No están en `TARGET_TYPES` del runner.
- **Ciudades / países**: usan emoji de bandera. Es decisión de diseño
  (`EntityVisual` rama 1), se deja como está.

La capa de render ya está completa: `components/ui/EntityVisual.tsx` dibuja la
imagen real con `next/image` para `visualType` `logo` / `portrait` / `album`
cuando hay `imageUrl`, y `next.config` ya confía en `upload.wikimedia.org`.
El hueco es de **datos**, no de UI.

## Decisión de fuente

Solo Wikipedia / Wikimedia Commons, la misma fuente ya usada para los otros
cuatro tipos. Sin proveedor de logos de terceros (fuga de IP del usuario +
token público, choca con la política de privacidad del proyecto) y sin
self-hosting (responsabilidad de marca registrada por empaquetar ~282 logos).
Consistente con la filosofía del proyecto: dato verificable con fuente
citable, nunca inventado. Cobertura esperada de marcas ~70-85%; lo que no
resuelva queda con el ícono genérico actual — es lo que ya muestra hoy, así
que es estrictamente una mejora.

## Cambios

### 1. `scripts/wiki-image-runner.ts` — ampliar alcance

- `TARGET_TYPES` pasa a incluir `"brand"` y `"movie"`.
- Términos de búsqueda tipados (bloque `terms` dentro de `resolveImage`):
  - `brand` → `["{name} empresa", "{name} marca", "{name}"]`
  - `movie` → `["{name} película {year}", "{name} (película)", "{name}"]`,
    donde `{year}` sale del evento primario (`getPrimaryEvent`) — si no hay
    año, se omite ese término.
- `BAD_TITLE`: añadir `anexo:` (listas de Wikipedia). El resto de patrones
  (desambiguación, etc.) ya sirve.
- El resto del flujo queda intacto: REST summary con redirects,
  `isReasonableMatch`, ritmo serial de 600ms, backoff ante 429,
  `User-Agent` descriptivo.

Nota de calidad conocida: para algunas marcas la lead-image de Wikipedia es
un edificio o un producto en vez del logo. NO se construye un clasificador de
imágenes. Esas entradas se corrigen a mano en el paso 6 o quedan con el
ícono. `ponytail:` heurística de lead-image; override manual si molesta.

### 2. `scripts/fetch-wiki-images.mjs` — que emita el `.ts`

Hoy solo escribe `.artifacts/wiki-images.json`. El archivo
`lib/data/entity-images.ts` tiene la cabecera "Generado automáticamente" pero
en realidad se copió a mano. Agregar al `.mjs` la escritura directa de
`lib/data/entity-images.ts` a partir de `output.images` (que ya tiene la
forma exacta `Record<string, string>` que exporta el `.ts`), preservando la
cabecera de comentario y el `Last updated`.

### 3. Correr el script

`node scripts/fetch-wiki-images.mjs` → regenera `entity-images.ts` fusionando
lo existente + marcas + películas. Revisar el resumen de `missing` que
imprime.

### 4. `lib/data/symbolic-entities.ts` — sacar Clearbit muerto

- En `enrichEntity`, eliminar la rama `type === "brand"` que arma la URL de
  `logo.clearbit.com`. Queda:
  `const imageUrl = input.imageUrl ?? ENTITY_IMAGE_URLS[input.id];`
- Borrar `lib/data/brand-logo-domains.ts` y su `import { BRAND_LOGO_DOMAINS }`.
- Quitar el bloque `hostname: 'logo.clearbit.com'` de `next.config` →
  `images.remotePatterns`.

### 5. `components/ui/EntityVisual.tsx` — fallback anti-imagen-rota

La rama 2 (image-backed) renderiza `<Image>` sin manejar el error. Si una URL
devuelve 404 queda un tile vacío. Agregar estado local `errored` y
`onError={() => setErrored(true)}`; si `errored`, caer a la rama de ícono
genérico (rama 4) en vez de mostrar la imagen. El componente ya es
`"use client"`.

### 6. Cola manual

Las marcas/películas en la lista `missing` (o con imagen de tipo equivocado)
se cargan a mano en `entity-images.ts` con su URL de `upload.wikimedia.org`
verificable, o se dejan con el ícono. No bloquea el merge.

## No-objetivos

- Clasificador de imágenes logo-vs-edificio.
- Self-hosting de logos o API de logos de terceros.
- Tipos de entidad nuevos; ciudades/países siguen con bandera.
- Rescatar los 72 equipos/universidades ya faltantes (salvo que resuelvan
  solos al re-correr).

## Verificación

- `npm test` — las suites de consistencia de año e ISO no se tocan; no se
  agregan tests nuevos (el cambio es de datos + un `onError`).
- `npm run build`.
- Chequeo visual con el navegador:
  - `/profile` (Mapa Personal): filas de marca muestran logo, filas de
    película muestran póster, las no resueltas muestran el ícono geométrico
    (no un hueco ni un ícono de imagen rota).
  - una página `/affinity/[type]/[slug]` con recomendaciones de marca.
- `grep` del bundle servido: `logo.clearbit.com` no aparece más.
