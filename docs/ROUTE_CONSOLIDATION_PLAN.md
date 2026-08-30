# Plan de consolidación de rutas — Fase 3

Fecha: 2026-08-30.
Auditoría de las ~90 rutas de `app/`. Objetivo: **la IA pública más clara y
fuerte para Molino**, no menos URLs. Se preserva SEO valioso, contenido
educativo, páginas de entidad útiles, el producto y el ethos open-source.

---

## 1. Arquitectura objetivo

Cuatro áreas. Los **tres sistemas** (numerología, astrología, zodíaco chino)
son la arquitectura intelectual dominante.

### A. CONOCIMIENTO PÚBLICO — autoridad: `/conocimiento`
| Ruta | Rol |
|---|---|
| `/conocimiento` | Hub: los 3 sistemas + conceptos + puente a metodología |
| `/conocimiento/numerologia` `/[numero]` | Referencia sistemática (9 + maestros) |
| `/conocimiento/astrologia` `/[signo]` | Referencia sistemática (12) |
| `/conocimiento/zodiaco-chino` `/[animal]` | Referencia sistemática (12) |
| `/blog` `/[slug]` | Editorial: temas, actualidad, ángulos |
| `/biblioteca` `/[slug]` | Bibliografía: de dónde sale cada cosa |
| `/academy` `/[slug]` | Historia de las tradiciones (long-form) |
| `/guia/*` | Landings SEO long-form por query específica |

### B. EXPLORACIÓN — Atlas + Afinidad, un solo modelo
| Ruta | Rol |
|---|---|
| `/affinity` `/[type]` `/[type]/[slug]` | **El sistema de afinidad.** Entidad = cómo tu signo resuena con países/marcas/etc. |
| `/affinity/compare/*` `/affinity/recommendations/*` | Comparar y priorizar |
| `/atlas` `/atlas/[iso]/*` `/atlas/explorar/[animal]/*` | Vista geográfica de la misma data |
| `/compatibilidad/[pair]` | 144 pares signo×signo — activo SEO astro-compat |
| `/herramientas/*` | Calculadoras libres (intent "calcular X") |

### C. MI MOLINO — producto personal
| Ruta | Rol | Index |
|---|---|---|
| `/onboarding` | Entrada | noindex |
| `/profile` | **MAPA** — explorá tu estructura | noindex |
| `/lectura` | **LECTURA** — entendé la síntesis | noindex |
| `/ai` | **IA** — explorá preguntas a través de la síntesis | noindex |
| `/hoy` `/semana` `/calendario` `/evolution` | Tiempo: día / semana / mes / año | hoy+calendario index; resto noindex |
| `/pareja` | Modo Pareja (relacional privado) | index (landing) |
| `/socios` | Modo Socios (afinidad para equipos) | index (landing) |
| `/circulo` `/mundo` `/perfil/[hash]` | Vistas públicas para compartir un perfil | noindex |
| `/journal` | Registro personal | index (landing) |
| `/ejemplo` | Demo del mapa sin crear uno | index |
| `/regalar` `/[codigo]` `/comprado` · `/canjear` | Regalo (ver §14) | landing index; resto noindex |
| `/premium` `/premium/claim` | Pago | premium index; claim noindex |

### D. PROYECTO / TRANSPARENCIA — la identidad open-source
| Ruta | Rol |
|---|---|
| `/transparencia` | **Hub**: metodología + fuentes + límites + resumen de filosofía + código |
| `/transparencia/motores` (ex `/docs/motores`) | Fórmulas y motores deterministas |
| `/filosofia` | Filosofía en profundidad |
| `/nosotros` | Quiénes somos |
| `/changelog` | Novedades |
| `/docs` | Docs de la API pública (dev) |
| `/widget` · `/embed` | Landing del widget · iframe embebible |
| `/profesionales` | B2B coaches |
| `/shortcuts` | Atajos de Apple/Siri |
| `/analytics` `/analytics/affinity` | Dashboards internos (noindex, nofollow) |

---

## 2. Tabla de acciones por ruta

Leyenda acción: **KEEP** / **MERGE** (portar contenido y 301) / **301** /
**NOINDEX** / **DELETE** (dir borrado, con 301 previo).

### Redirecciones ya existentes (código base — se respetan)
`/principios→/filosofia`, `/patterns→/profile`, `/synthesis→/profile`
(next.config) · `/astrologia→/conocimiento/astrologia`,
`/numerologia→/conocimiento/numerologia`,
`/zodiaco-chino→/conocimiento/zodiaco-chino` (permanentRedirect) ·
`/conocimiento→/explore`, `/decisions→/profile`, `/precios→/premium`
(redirect) · `/entities/[id]→/affinity/[type]/[id]` (permanentRedirect).

### Cambios de esta fase

| Ruta actual | Propósito real | Tipo | Público/Producto | Index rec. | Valor SEO | Riesgo dup. | Sección destino | Acción | Destino | Racional |
|---|---|---|---|---|---|---|---|---|---|---|
| `/portal` | stub JS `router.replace('/explore')` | redirect | — | — | nulo | — | — | **301 + DELETE dir** | `/conocimiento` | Redirect client-side es malo para SEO y lento; y `/explore` a su vez es hub redundante. |
| `/for-you` | stub JS `→ /profile` | redirect | producto | — | nulo | — | Mi Molino | **301 + DELETE dir** | `/profile` | idem |
| `/alignment` | stub JS `→ /profile` | redirect | producto | noindex | nulo | — | Mi Molino | **301 + DELETE dir** | `/profile` | idem |
| `/conocimiento` (page) | redirect JS `→ /explore` | redirect | público | — | medio (nombre) | alto | Conocimiento | **301 (config)** | `/explore` (interino) | Ver nota IA: a mediano plazo `/explore`→`/conocimiento` y este pasa a ser hub real. Por ahora se mantiene el destino existente pero como 301 duro. |
| `/explore` | índice de conocimiento (sistemas/conceptos/fuentes) | público hub | público | index | medio | alto con `/conocimiento` | Conocimiento | **KEEP** (interino) | — | Es el hub efectivo hoy y el destino de varios redirects. Renombrado conceptual a "Conocimiento" en nav; consolidación de slug es un follow-up con datos de rank. |
| `/method` | "Method — Cómo funciona" (wrapper 14 líneas, nombre en inglés) | público | público | index→301 | bajo | alto con `/metodos-y-fuentes` | Proyecto | **301 + DELETE dir** | `/metodos-y-fuentes` | Nombre en inglés en sitio es-AR, 0 links internos, contenido equivalente al de métodos-y-fuentes. |
| `/metodos-y-fuentes` | "Métodos y Fuentes" (158 líneas, footer) | público | público | index | medio | medio con `/transparencia` | Proyecto | **KEEP** (interino) → MERGE futuro | `/transparencia` | Linkeado en footer y con contenido real. Merge de su cuerpo dentro de `/transparencia` es tarea de contenido; se difiere. |
| `/conocimiento/fuentes` | "Fuentes y metodología" (41 líneas) | público | público | index→301 | bajo | alto con `/biblioteca` | Conocimiento | **301 + DELETE dir** | `/biblioteca` | `/biblioteca` ES el catálogo de fuentes; esta página es delgada y compite. Se saca de `conocimientoPages` del sitemap. |
| `/docs/motores` | "Motores y fórmulas" (transparencia de cálculo) | público | público | index | medio (ethos OSS) | bajo | Proyecto | **KEEP** | — | Reposicionar bajo Proyecto en nav. Rename de slug (`/transparencia/motores`) diferido para no romper links. |
| `/docs` | Docs de API pública (dev) | público | público | index | medio | bajo | Proyecto | **KEEP** | — | Genuino, distinto de metodología. |
| `/filosofia` | Filosofía de Molino | público | público | index | medio | bajo | Proyecto | **KEEP** + agregar a nav | — | 0 links internos = hueco de nav, no de contenido. Es destino del redirect `/principios`. |
| `/transparencia` | "Transparencia" | público | público | index | medio | medio | Proyecto | **KEEP** → hub | — | Se convierte en el hub del área Proyecto. |
| `/sinastria/[signoA]/[signoB]` | 144 pares signo×signo (sinastría) | público | público | index→canonical | **alto pero duplicado** | **muy alto** con `/compatibilidad/[pair]` | Exploración | **canonical → `/compatibilidad/[a]-[b]` + sacar de sitemap** (301 en follow-up) | `/compatibilidad/[a]-[b]` | 288 páginas para 144 pares, mismo intent ("compatibilidad astrológica X y Y"). "compatibilidad" tiene mucho más volumen que "sinastria". `/compatibilidad/[pair]` está integrada a `lib/seo/programmatic.ts` (fuente única). Canonical primero (no destructivo), 301 cuando esté confirmado. |
| `/compatibility/[entity]` | Compat con una entidad (marca/país/…) | público | público | index→301 | medio | **alto** con `/affinity/[type]/[slug]` | Exploración | **301 (server) + DELETE dir** | `/affinity/[type]/[slug]` | `/entities/[id]` ya estableció este mismo 301. Familia legacy. Redirect necesita lookup entidad→tipo (server component, como `/entities/[id]`). Se saca `compatibilityPages` del sitemap. |
| `/compatibility/brands` | Listado compat marcas | público | público | index→301 | bajo | alto con `/affinity/brand` | Exploración | **301 (config) + DELETE dir** | `/affinity/brand` | Duplica el listado de `/affinity/[type]`. |
| `/compatibility/countries` | Listado compat países | público | público | index→301 | bajo | alto con `/affinity/country` | Exploración | **301 (config) + DELETE dir** | `/affinity/country` | idem |
| `/compatibilidad/[pair]` | 144 pares signo×signo (SEO programático) | público | público | index | **alto** | — (queda canónica) | Exploración | **KEEP** | — | Activo SEO real, integrado al catálogo programático. |
| `/nudo` | "Detectar un Nudo" — herramienta de tensión | producto | producto | noindex→301 | nulo | **alto** con `/lectura` | Mi Molino | **301 + DELETE dir** | `/lectura` | La detección de tensiones ahora vive en `buildSynthesis`/`buildTensions` y se muestra en `/lectura` y `/profile`. Superficie standalone redundante, 0 nav, 0 links. |
| `/linea` | "Tu línea de energía" — historial diario | producto | producto | noindex→301 | nulo | alto con `/evolution` + `/journal` | Mi Molino | **301 + DELETE dir** | `/evolution` | Sub-vista de `/evolution` (breadcrumb "Evolución › Tu línea"), 0 nav, 0 links. Su función la cubren `/evolution` y `/journal`. |
| `/profile/insights` | "Mis patrones" — sub-vista | producto | producto | noindex→301 | nulo | alto con `/profile` | Mi Molino | **301 + DELETE dir** | `/profile` | 0 links; `/patterns` ya redirige a `/profile`. Los patrones viven en `/profile` y `/lectura`. |
| `/decisions` | (ya redirige a `/profile`) — layout stale | producto | producto | noindex | nulo | — | Mi Molino | **301 (config) + DELETE dir** | `/ai` | "¿Debería hacer X?" es ahora una consulta de IA. Repunta al mejor destino y limpia el `layout.tsx` huérfano. |
| `/circulo` | Vista pública para compartir "mi círculo" | producto | producto (share) | noindex | nulo | bajo | Mi Molino | **KEEP** | — | Artefacto de compartir real (`SharePublicButton`). |
| `/mundo` | Vista pública para compartir "mi mundo" | producto | producto (share) | noindex | nulo | bajo | Mi Molino | **KEEP** | — | idem. **Bug**: el footer lo etiqueta "Afinidades" y lo usa como si fuera `/affinity` — se corrige (footer → `/affinity`). |
| `/embed` | iframe embebible del widget | público (artefacto) | público | noindex | nulo | — | Proyecto | **KEEP** | — | Es el `src` del iframe, no una página de destino. **Bug**: footer lo linkea como "Widget"; debería linkear `/widget`. |
| `/widget` | Landing marketing del widget (coaches) | público | público | index | medio | bajo | Proyecto | **KEEP** + footer link | — | Página de marketing real; hoy sin link de nav (el footer apunta a `/embed`). |
| `/guia/camino-de-vida-7` | Landing SEO long-form LP7 | público | público | index | medio-alto | **alto** con `/conocimiento/numerologia/7` | Conocimiento | **KEEP** (revisar contenido) | — | Si `/conocimiento/numerologia/7` es delgada: portar el long-form ahí y 301 la guía. Requiere revisión de contenido y datos de rank → se difiere, con cross-linking reforzado ahora. |
| `/guia/numeros-maestros` | Landing SEO maestros | público | público | index | medio-alto | medio con `/conocimiento/numerologia` | Conocimiento | **KEEP** | — | Query específica de buen volumen; `/conocimiento` no tiene página dedicada a maestros. |
| `/guia/compatibilidad-astrologica` | Landing SEO compat astro | público | público | index | medio | medio con `/compatibilidad` | Conocimiento | **KEEP** | — | Página pilar que enlaza a la matriz `/compatibilidad/[pair]`. Reforzar cross-link. |
| `/herramientas/*` | Calculadoras libres | público | público | index | medio | medio con `/conocimiento` y `/compatibilidad` | Exploración | **KEEP** (revisar) | — | Sirven intent "calcular"; distinto de "aprender" y de "mi mapa completo". Reforzar links a `/conocimiento/*` y `/onboarding`. Merge futuro como widgets dentro de `/conocimiento` a evaluar. |
| `/academy` `/academy/[slug]` | Historia de las tradiciones | público | público | index | medio | bajo | Conocimiento | **KEEP** | — | Tipo de contenido distinto (histórico narrativo). Sub-marca de Conocimiento en nav. |
| `/analytics` `/analytics/affinity` | Dashboards internos | interno | interno | noindex+nofollow | nulo | — | Proyecto | **KEEP** (interno) | — | Herramientas internas; ya noindex+nofollow. |
| `/ai` | **IA** — chat anclado (Fase 2) | producto | producto | noindex | nulo | — | Mi Molino | **KEEP** + **agregar a nav** | — | Nuevo hogar del tercer nivel; hoy sin ninguna entrada de nav. |
| Resto (`/profile`, `/lectura`, `/hoy`, `/calendario`, `/semana`, `/evolution`, `/pareja`, `/socios`, `/journal`, `/ejemplo`, `/premium`, `/regalar*`, `/canjear`, `/onboarding`, `/perfil/[hash]`, `/atlas*`, `/affinity*`, `/conocimiento/*`, `/blog*`, `/biblioteca*`, `/nosotros`, `/changelog`, `/privacidad`, `/terminos`, `/profesionales`, `/shortcuts`) | como en §1 | — | — | como §1 | — | — | según §1 | **KEEP** | — | Coherentes con la arquitectura objetivo. |

---

## 3. Navegación

**Header (desktop) — 4 puertas + acciones de usuario:**
- **Conocimiento** ▾ — Numerología · Astrología · Zodíaco chino · Blog · Biblioteca · Academia
- **Explorar** ▾ — Atlas · Afinidades · Compatibilidad
- **Mi Molino** ▾ — Mi Mapa · Mi Lectura · Preguntá (IA) · | Hoy · Semana · Mes · Año · | Pareja
- **Proyecto** ▾ — Filosofía · Transparencia · Métodos y fuentes · Changelog · Código (GitHub)

Acciones (derecha): Mi Mapa · Mi Lectura · Preguntá · Crear nuevo mapa · Guardar.

**Fuera del header** (footer): Socios, Regalar, Profesionales, Widget, Docs API,
Nosotros, Privacidad, Términos.

**Footer** — mismas 4 columnas, alineadas a las 4 puertas (hoy son "Tu mapa /
Explorar / Molino / Transparencia" con ítems cruzados). Correcciones inmediatas:
`/mundo`→`/affinity` (label "Afinidades"), `/embed`→`/widget` (label "Widget").

---

## 4. Impacto en sitemap

- Sacar el bloque `sinastriaPages` (144 URLs) — canonical a `/compatibilidad`.
- Sacar `compatibilityPages` (`ENTITIES.map → /compatibility/[id]`) — 301 a `/affinity`.
- Sacar `/conocimiento/fuentes` de `conocimientoPages`.
- Sacar de `staticPages` cualquier ruta que pase a 301/DELETE: (no hay
  ninguna de las afectadas listada en `staticPages` hoy — verificado).
- `/method` no está en el sitemap (no listado) — solo hace falta el 301.
- Neto: sitemap pierde ~145 URLs duplicadas, gana 0 — todas las que salen
  son duplicados o thin.

## 5. Impacto en enlaces internos

- Footer: 2 correcciones (arriba).
- `components/profile/SpaceIndex.tsx` linkea `/circulo` — OK, se mantiene.
- Header: reestructuración a 4 puertas (cambio de `UniversityHeader.tsx`).
- `/linea` breadcrumb enlaza `/evolution` — al borrar `/linea` no queda link roto entrante.
- Ningún componente linkea `/nudo`, `/method`, `/portal`, `/for-you`,
  `/alignment`, `/profile/insights`, `/conocimiento/fuentes`,
  `/compatibility/*`, `/sinastria/*` (verificado con grep). Riesgo de link
  interno roto: **nulo** para los DELETE.

## 6. SEO — verificación antes de aplicar

- Sin cadenas de redirect: los nuevos 301 apuntan a destinos finales
  (`/profile`, `/lectura`, `/affinity/*`, `/compatibilidad/*`,
  `/metodos-y-fuentes`, `/biblioteca`), ninguno de los cuales redirige a su vez.
- `/sinastria/*`: canonical (no 301) en esta fase = no se pierde nada si hay
  backlinks; el 301 duro queda para cuando se confirme paridad de contenido.
- `/compatibilidad/[pair]` y `/affinity/[type]/[slug]` ya existen y rankean —
  son destinos sólidos, no páginas nuevas.
- Deindexado accidental: los DELETE son todos noindex ya (`/nudo`, `/linea`,
  `/profile/insights`, `/portal`, `/for-you`, `/alignment`, `/decisions`) o
  thin sin tráfico esperable (`/method`, `/conocimiento/fuentes`,
  `/compatibility/*`). Ninguno es un activo orgánico.

---

## 7. Qué NO se toca (y por qué)

- **`/compatibilidad/[pair]` (144)** — activo SEO real, canónico.
- **`/conocimiento/*` completo** — la autoridad educativa (priority 0.8).
- **`/blog`, `/biblioteca`, `/academy`, `/guia/*`** — tipos de contenido
  distintos, todos con valor propio. El único merge candidato
  (`guia/camino-de-vida-7` ↔ `conocimiento/numerologia/7`) se difiere por
  requerir revisión de contenido y rank.
- **`/atlas/*`, `/affinity/*`** — sistema de exploración canónico.
- **`/circulo`, `/mundo`, `/perfil/[hash]`** — artefactos de compartir reales.
- **`/regalar`** (ver §14 abajo).

## 8. Regalar (`/regalar`) — decisión

**KEEP, de-enfatizado arquitectónicamente.** Aporta valor genuino (regalar
una lectura sin pedir la fecha del otro), es coherente con el producto y no
mete ruido comercial si no se lo pone en el hero. Cambios: sale de "Modos"
del header (Regalar no es un "modo" — Modos queda solo Pareja/Socios, y
Pareja sube a "Mi Molino"). Queda en el footer y en el CTA contextual de
`/lectura` (ya existe) y `/premium`. Ruta y flujo intactos.

## 9. Número de Expresión — estado (§12)

Ya resuelto en Fase 2 (`PHASE2_SYNTHESIS_REFACTOR.md` §7): decisión A. No se
expone en UX activa, `buildUncertainties` lo declara explícitamente, el
cálculo se conserva para flujos que sí pasan nombre. Sin promesas de
funcionalidad no disponible en la documentación. **Nada que hacer en Fase 3.**

## 10. Área open-source / Proyecto (§13)

`/transparencia` pasa a ser el hub que expone: metodología, fuentes,
límites, resumen de filosofía y enlaces a código (GitHub) y changelog.
`/filosofia`, `/nosotros`, `/changelog`, `/docs`, `/docs/motores` son sus
satélites. Entra a la nav como puerta "Proyecto" — deja de ser un pie de
página legal.

---

## 11. ESTADO DE IMPLEMENTACIÓN (Fase 3, 2026-08-30)

### Aplicado

**301 (next.config.js `redirects()`), + dir borrado:**
`/portal→/explore` · `/for-you→/profile` · `/alignment→/profile` ·
`/decisions→/ai` · `/method→/metodos-y-fuentes` ·
`/conocimiento/fuentes→/biblioteca` · `/nudo→/lectura` · `/linea→/evolution` ·
`/profile/insights→/profile` · `/compatibility/brands→/affinity/brand` ·
`/compatibility/countries→/affinity/country`.
Verificado con `curl`: 308 a destino final, sin cadenas.

**`/compatibility/[entity]`** → server component con `permanentRedirect` a
`/affinity/[type]/[slug]` (fallback `/affinity` si el id no resuelve). Mismo
patrón que `/entities/[id]` (308 en prod; el dev server lo renderiza como
soft-redirect — comportamiento conocido de Next, no un bug).

**`/sinastria/[a]/[b]`** → `robots: { index: false, follow: true }` +
`canonical` a `/compatibilidad/[a]-[b]` + OG url canónica. Fuera del sitemap.
Links internos entre páginas sinastria repuntados a `/compatibilidad`.
(El 301 duro queda para follow-up con datos de rank.)

**Sitemap** (`app/sitemap.ts`): eliminados `sinastriaPages` (144),
`compatibilityPages` (`ENTITIES.map`), la entrada `/conocimiento/fuentes` y
`/method`; agregados `/metodos-y-fuentes` y `/transparencia`. Neto ≈ −145
URLs, todas duplicadas o thin. Sitemap final: ~1228 `<loc>`.

**Navegación** (`UniversityHeader.tsx` + `UniversityFooter.tsx`):
- Header: constantes `LEARN_*`/`EXPLORE_GROUPS_WITH_PROFILE` →
  `KNOWLEDGE_*` (encabezan los 3 sistemas `/conocimiento/*`) + `PROJECT_*`.
  Puerta "Conocimiento" ahora también con perfil (antes el usuario con mapa
  perdía todo acceso a `/conocimiento` desde el header). Puerta "Proyecto"
  (Filosofía/Transparencia/Métodos/Changelog) — la identidad OSS deja el
  footer-only. Acción "Preguntá" (`/ai`) sumada a la zona derecha (desktop) y
  al menú móvil — antes `/ai` no tenía ninguna entrada de nav.
- Footer: 4 columnas alineadas a las 4 puertas: **Mi Molino** (Mapa/Lectura/
  IA/Pareja/Premium/Crear) · **Conocer y explorar** (3 sistemas + Blog/
  Biblioteca/Academia/Afinidades/Atlas/Calendario/Journal) · **Proyecto** ·
  **Más** (Regalar/Socios/Profesionales/Widget/Privacidad/Términos).
  Corregidos: `/mundo` "Afinidades" → `/affinity`; `/embed` "Widget" →
  `/widget`.

**Links internos rotos arreglados:** `app/explore/page.tsx`
(`/compatibility/*` → `/affinity/country`), `AffinityDeepDive.tsx` (CTA
`/compatibility/[id]` → CTA a `/lectura`, ya que el análisis multi-factor por
entidad se consolidó). **Borrado código muerto:**
`components/compatibility/CompatibilityContent.tsx` (0 importadores tras el
redirect de `/compatibility/[entity]`).

**Tests actualizados a la nueva IA:** `navigation-hierarchy.test.ts`
(4 puertas + footer 4 columnas + acciones IA), `seo-canonical.test.ts`
(sinastria fuera del sitemap / 144 compatibilidad canónicas / compatibility
fuera), `sitemap-noindex-consistency.test.ts` (rutas borradas fuera de la
lista), `entity-visual-imageurl.test.ts` (excepción muerta removida),
`__snapshots__/prompt-builder.snapshots.ts` (regenerado — cambios de copy de
Fase 2 en `buildRules`).

### Diferido (con racional, no olvidado)
- `/explore` ↔ `/conocimiento` (slug del hub) — necesita datos de rank.
- `guia/camino-de-vida-7` ↔ `conocimiento/numerologia/7` — revisión de
  contenido antes de 301.
- `/metodos-y-fuentes` merge dentro de `/transparencia` — tarea de contenido.
- `/docs/motores` → `/transparencia/motores` (rename de slug) — evitar romper
  enlaces.
- `/herramientas/*` como widgets dentro de `/conocimiento/*` — evaluar.
- `/sinastria/*` 301 duro (hoy: canonical + noindex).
- Puerta "Proyecto" en el header **con perfil** (hoy solo sin perfil +
  footer + móvil): el header con perfil ya está denso (5 grupos + 5
  acciones). Follow-up de diseño con QA visual.

### Validación
`tsc` limpio · `vitest run` 1689 pass / 7 fail (los mismos 4 archivos
pre-existentes de siempre; 0 regresiones nuevas) · `next build` OK, 1649
páginas · redirects verificados por `curl` (308, sin cadenas) · sitemap sin
sinastria/compatibility/method/conocimiento-fuentes · `/sinastria` sirve
`noindex,follow` + canonical a `/compatibilidad` · QA visual desktop+mobile
de home / transparencia / conocimiento / affinity / ai — sin roturas de
layout; footer nuevo mapea a las 4 áreas.
