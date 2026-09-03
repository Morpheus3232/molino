## Identidad del proyecto

**molino.app**: app simbólica de autoconocimiento (numerología, astrología,
zodíaco chino, afinidad) en español rioplatense (`lang="es-AR"`, vos). Sin
backend propio ni base de datos: los motores de cálculo son funciones puras
y la persistencia del perfil vive en localStorage / URL (share por hash) /
memoria efímera. Monetiza con MercadoPago (`lib/mercadopago.ts`,
`lib/premium.ts`) y, desde 2026-08-29, con Bitcoin (`lib/bitcoin.ts`,
`app/api/btc/`) — Stripe y PayPal se eliminaron por completo (2026-08-17):
ninguno de los dos tenía credenciales configuradas en producción ni UI que
los ofreciera como opción de pago.

## Filosofía del sitio (decisión del dueño del producto, 2026-08-25)

Esto gobierna qué se construye y cómo. No es una nota histórica: si una
funcionalidad nueva la contradice, la funcionalidad está mal.

> La idea es buscar comparativas **solamente en años del zodíaco chino** entre
> la entidad y el posible usuario. Alguien que nació en un año Caballo resuena
> mejor con las marcas, países, etc. Caballo. Es lo que comprobé en la vida y
> quiero usar este sitio con ese propósito. Primero como **mapa personal**,
> después con la funcionalidad de **servir al prójimo** — en este caso, público
> hispanohablante de entre 18 y 99 años.

Consecuencias operativas:

- **El país del usuario ordena, nunca puntúa.** Dentro de cada casilla van
  primero hasta **3** entidades del país declarado en el onboarding y después
  el mundo — nunca todas las locales, que taparían el mapa (mismo criterio,
  con 2, que `curateCategory` en `lib/affinity-light.ts`). El país no mueve una
  entidad de casilla: dos personas del mismo signo ven las mismas entidades en
  los mismos grupos, en distinto orden. La priorización se resuelve por ISO, y
  `lib/data/__tests__/country-iso-coverage.test.ts` garantiza que los 197
  países que ofrece el onboarding resuelvan a uno.
- **En castellano se dice "signo", no "animal"** ("tu propio signo" suena mejor
  que "tu propio animal"). El orden de recomendación es siempre: tu propio
  signo → tus dos amigos → la energía opuesta, esta última presentada como qué
  conviene evitar.
- **Una sola regla de afinidad: signo contra signo.** El año de origen de la
  entidad da su animal; la fecha de nacimiento da el del usuario. No mezclar
  numerología, Wu Xing, signo solar ni ninguna otra capa dentro del puntaje de
  afinidad. Esas capas viven en sus propias secciones (`/lectura`, `/hoy`,
  cuadro de nacimiento, convergencia) y no se cruzan con el Atlas.
- **De las relaciones del ciclo se usan tres casillas: tu propio signo, tus
  DOS AMIGOS (三合 San He) y tu ENEMIGO (六冲 Liu Chong).** Los pares Liu He y
  Liu Hai existen en la tradición pero quedan fuera del modelo: caen en "el
  resto del ciclo". Menos categorías, más señal.
- **En castellano se dice "amigos" y "enemigo"**, no "tríada" ni "choque". El
  nombre chino se muestra al lado como referencia, no como la etiqueta
  principal.
- **La relación es categórica, no continua.** Agrupar por casilla, nunca
  rankear con un puntaje de dos dígitos que sugiera una precisión que el
  sistema no tiene.
- **Fecha exacta o no se muestra.** El Año Nuevo chino cae entre el 21 de enero
  y el 21 de febrero: un origen fechado solo por año podría pertenecer al signo
  anterior. `toLightweightEntity` solo emite `originDate`/`originLabel`/
  `originNote` cuando el evento primario trae `date`, y el Mapa Personal
  descarta toda entidad sin fecha exacta (`isApproximate`). Preferimos una
  lista más corta que una recomendación construida sobre una duda.
- **Cada entrada muestra la frase de origen del registro + la fecha exacta**,
  como hacía el Atlas. La prosa es la que ya está en el dataset, no se inventa.
- **El año de origen de cada entidad es dato crítico**, no decorativo: es lo
  único que produce su signo. Un año mal cargado corrompe toda la afinidad de
  esa entidad en el sitio entero. Ver
  `lib/data/__tests__/entity-year-consistency.test.ts`, que existe porque
  `brands-60.ts` llegó a tener 41 años inventados con el año correcto escrito
  al lado en su propio `sourceNote`.
- **Público objetivo: 7 países.** Argentina, México, España, Chile, Colombia,
  Uruguay y Perú (los mismos que `SUGGESTED_COUNTRIES` en
  `components/onboarding/LocationStep.tsx`). El resto del mundo sigue
  disponible y priorizable, pero la cobertura de datos se mide y se completa
  para estos siete.
- **La edad no se le pide a nadie**: sale de `birthDate`. Se usa únicamente en
  el dominio de personas, para acercar primero a las nacidas dentro de una
  vuelta del ciclo (±12 años) — dato real, porque el año de nacimiento está
  cargado. NO existe en el atlas un dato de "para qué edad es" una marca o un
  auto, así que no se simula uno: inventarlo sería el mismo error que los años
  inventados.
- **Gama media primero, y sin bucket genérico de "marcas".** Vestimenta y autos
  son dominios propios; no existe un dominio que junte tecnología, bancos y
  gaseosas, porque no responde ninguna pregunta. Dentro de cada grupo, las de
  gama alta van al final: el público es mayoritariamente de clase media.
  `toLightweightEntity` marca `premium: true` según lo que el propio registro
  declara (`category: "Lujo"` o un `keyThemes` con Lujo/Exclusivo/Premium/Alta
  gama) — nunca inferido. Relega, no descarta.
- **Deuda de datos conocida (2026-08-25)**: el cuello de botella es la fecha
  exacta de fundación de las marcas. Se cargaron 21 desde Wikidata (19 autos,
  2 de ropa) aceptando solo precisión de día **y** coincidencia con el año ya
  documentado en nuestro registro — dos fuentes de acuerdo o se descarta; el
  `source` del evento guarda el Q-id. De 163 marcas consultadas solo salieron
  esas 21: la mayoría tiene precisión de año también en Wikidata, y el
  matching por nombre da falsos positivos peligrosos (MG matcheaba con MGM),
  así que el filtro exige además que la descripción de la entidad sea del
  rubro.

  Estado: **autos ya funciona** (19 entradas, 4-6 opciones afines para cada
  uno de los 12 signos, parejo). **Vestimenta sigue casi vacía** (2 entradas:
  H&M y Vans) — necesita ~87 fechas más, y la vía realista es carga curada
  desde la fuente oficial de cada marca, no Wikidata.

  Método a mano: un evento fechado en **marzo o después** queda determinado
  aunque no se sepa el día, porque el Año Nuevo chino nunca cae después del 21
  de febrero. Hoy no se explota (`date` exige día completo y poner `-01`
  inventaría uno); si vale la pena, es un campo `month` en el evento, jamás un
  día falso.

  Cobertura global con fecha exacta: territorio 108/311, cancha 70/91,
  aula 48/93, gente 221/234, pantalla 16/16, autos 19/74, vestimenta 2/89.

  Cobertura local con fecha exacta, por país del público objetivo (entidades
  del propio país que el mapa puede mostrar):

  | País | Total | ciudades | marcas | equipos | univ. | personas |
  |---|---|---|---|---|---|---|
  | Argentina | 108 | 28 | 3 | 19 | 18 | 38 |
  | Uruguay | 57 | 8 | 0 | 13 | 1 | 34 |
  | Chile | 46 | 1 | 0 | 10 | 9 | 26 |
  | Perú | 45 | 1 | 0 | 10 | 9 | 25 |
  | México | 40 | 3 | 4 | 5 | 5 | 23 |
  | España | 35 | 2 | 3 | 7 | 2 | 20 |
  | Colombia | 33 | 4 | 1 | 5 | 3 | 20 |

  (La columna "marcas" de esa tabla ya no tiene dominio propio: solo cuenta
  para vestimenta y autos.) El hueco local más grande son las **ciudades fuera
  de Argentina**, y ahí el problema NO son las fechas —solo 5 ciudades de esos
  países carecen de fecha exacta— sino que el atlas tiene muy pocas ciudades
  cargadas fuera de Argentina. Completarlo es cargar entidades con su fecha y
  su `source`, nunca estimarla.
- **Nada de listas sin criterio.** Se eliminaron (2026-08-25) tres secciones
  que mostraban "entidades relacionadas" que no tenían ninguna relación con lo
  que el lector estaba mirando —eran las primeras N del catálogo ordenadas por
  afinidad, doce filas con el mismo 95 y ninguna razón para estar ahí—:
  `AnimalQuickSelector` ("Otras entidades del mismo tipo"), el bloque
  `relatedEntities` de `AffinityEditorialContent` ("Otros países") y
  `AffinityDiscoveryList` ("Explorá más" / "Seguí descubriendo"). Los tres
  componentes y la lista que los alimentaba (`useAffinityResult`) ya no
  existen. Antes de agregar cualquier lista nueva: si no se puede escribir en
  una línea POR QUÉ cada fila está ahí, no va.
- **Sin intención de venta ni autoelogio en el producto.** La sección no habla
  de la marca ni se recomienda a sí misma; muestra el cálculo y la regla, y
  deja la decisión en el usuario.
- **Dos páginas, dos preguntas (2026-08-25, validado 2026-08-30).** `/profile`
  ("Mi Mapa") responde **dónde tu signo toca el mundo** y no contiene nada
  más: hero de identidad + `PersonalMapSection` (domain groups +
  `CycleTable`) + acciones + índice. **`LecturaAfinidadesFull` (el
  catálogo interactivo completo con 3 pestañas de relación + 8 filtros de
  categoría) vive SOLO en `/lectura`**, no en `/profile`. Mostrar el
  catálogo en el Mapa duplicaba contenido: el usuario lo veía en las
  casillas resumidas Y en el browser completo, y volvía a verlo en
  `/lectura`. La separación es: Mapa = estructura (dónde toca), Lectura =
  exploración interactiva (qué significa, cómo conecta). El Mapa muestra
  hasta 3 entidades por país en las casillas; la lista completa con filtros
  es el capítulo "05 · Tu relación con el mundo" de la Lectura.

  **Actualización 2026-09-02**: el bloque interpretativo determinista
  (cuadro de nacimiento, convergencia y los dos movimientos) **volvió a
  `/profile`** ("Mi Mapa"), compuesto en `ProfileHub` después de
  `PersonalMapSection` y ANTES de las acciones:
  `BirthGridSection` → `ConvergenceSection` → `LecturaLibre`.
  La separación casa actual: **Mapa = lectura gratuita completa de tu mapa**;
  **Lectura = contenido pago (Pro)**.

  **Actualización 2026-09-03**: en `/lectura` el que **no pagó ve el paywall**
  (todos los beneficios de la lectura + botón de comprar), sin animación —
  ya no se le muestra el contenido gratis (`LecturaGratis`) acá; ese
  contenido vive en `/profile`. El que **pagó** ve la animación
  (`BuildingMolino`) solo la primera vez y después su **lectura Pro
  completa + chat con la IA** directo (el caché de `/lectura` reabre con
  `revealed=true`). El detalle de beneficios lo arma `PremiumGate` →
  `PremiumPaywallContent` → `FeatureComparison`: esa es la fuente única del
  precio (USD 8, pago único) y de la tabla gratis/Pro, no duplicar el
  listado en otro lado.
- **Motor**: `lib/engines/personalMapEngine.ts` (puro, client-safe) es la
  implementación de todo lo anterior. UI: `components/profile/PersonalMapSection.tsx`
  dentro de `/profile` ("Mi Mapa"). Cubre los ocho dominios del Atlas
  (territorio, vestimenta, autos, cancha, aula, gente, pantalla).

## Sesión del 2026-08-17

Sesión larga en dos tramos: hardening técnico (mañana) + funcionalidades
diferenciadoras y fixes críticos (tarde). ~40 commits totales. Detalle
completo por tema en `.claude/execution-logs/` (ver nombres de archivo
citados abajo); resumen ejecutivo del tramo de la tarde en
`.claude/execution-logs/session-summary-2026-08-17.md`.

### Tramo 1 — Refactors, cache, latencia

- **Refactors god-component → módulos** (mismo comportamiento, validado con
  la suite completa en cada paso): `intelligenceEngine.ts` (1123 → 489
  líneas + 6 módulos en `lib/engines/intelligence/`),
  `AffinityDetailContent.tsx` (1024 → 140 líneas), `PremiumGate.tsx`
  (748 → 287 líneas + hooks en `lib/hooks/` + componentes en
  `components/premium/`).
- **Motor de IA con feature flag**: `buildIntelligencePrompt()` en
  `intelligenceEngine.ts` lee `INTELLIGENCE_ENGINE_V2_ENABLED` y delega a
  `buildIntelligencePromptV2` (`lib/engines/intelligence/promptBuilder.ts`)
  o a la legacy verbatim — **activo en Production**. Rollback: ver
  `.claude/execution-logs/v2-rollback-procedure.md`.
- **Cache de interpretaciones** (`lib/cache/interpretationCache.ts`, Vercel
  KV): se cachea por `profileHash + type + hash(prompt)`, con expiración
  por tipo (`daily_energy` a medianoche UTC, `timing` 24h, el resto sin
  TTL — solo invalida si cambia el prompt o el usuario pide "Regenerar").
  Diseño completo en `.claude/execution-logs/interpretation-cache-design.md`.
- **Fixes de latencia en `providerRouter.ts`**: coordinación de reintentos
  (antes se multiplicaban 2×2 entre capas), timeout diferenciado por tipo
  (20s liviano / 55s para `personal_profile`/`question`), timeout global
  con fallback local garantizado (65s/35s).
- **Body-read sin timeout en `aiEngine.ts` — resuelto** (quedaba pendiente
  al cierre del tramo 1, arreglado en el tramo 2): `fetchWithTimeout`
  limpiaba el `AbortController` apenas llegaban los headers, dejando
  `response.json()`/`.text()` sin protección (~61s de espera sin abortar
  en producción). Ahora acepta un callback `read` que corre dentro de la
  ventana del abort — ver commit `b257538`.

### Tramo 2 — SEO, funcionalidades diferenciadoras, bugs críticos

- **SEO**: 62 rutas migradas a `createRouteMetadata()` (vs 8 antes), 31
  con JSON-LD (vs 24), bug de `title.template` duplicado en 4 layouts
  intermedios eliminado.
- **Números Maestros (11/22/33)**: `getMasterNumbers()`/
  `MASTER_POSITION_MEANINGS` en `lib/engines/numerologyEngine.ts` —
  detecta maestros en Life Path/Expresión/Personalidad (no solo Life
  Path como antes) y da significado específico por posición. Badge en
  `ProfileSummaryTable.tsx`, sección gratis en `LecturaProfunda.tsx`
  (capítulo 01, no premium — el contenido es determinista), instrucción
  condicional en el prompt de IA, guía pública conectada al perfil.
- **Personal Year/Month/Day**: el cálculo ya existía (`lib/calculations.ts`)
  pero `personalMonth` tenía un bug real — `profileBuilder.ts`/
  `dailyEnergyEngine.ts` pasaban el mes en el slot `currentYear` de
  `getPersonalYear()`, descartando el año real. Corregido con
  `reduceToSingleDigit(personalYear + mes)`. `PERSONAL_YEAR_MEANINGS`/
  `PERSONAL_MONTH_MEANINGS` (24 descripciones reales) +
  `PersonalCyclesSection.tsx` nuevo en `/hoy` (3 cards colapsables).
- **Service worker interceptando navegación RSC**: `public/sw.js` cacheaba
  con stale-while-revalidate las peticiones de navegación client-side de
  Next.js (headers `RSC`/`Next-Router-*`), sirviendo payloads viejos hasta
  que el usuario hacía F5. `isNextRouterRequest()` las excluye del cache
  (`molino-cache-v4`).
- **Blog cargando en blanco**: `BlogContent.tsx`/`BlogArticleContent.tsx`
  animaban prácticamente todo el contenido above-the-fold con
  `whileInView` (depende de `IntersectionObserver` disparando en el
  instante exacto del mount — un hiccup lo deja en `opacity:0`
  permanente). `fadeUpMount` (nuevo en `lib/utils/motion.ts`) usa
  `animate` en vez de `whileInView` para lo que ya es visible al cargar.
- **Persistencia de perfil en "HOY"**: `HoyClient.tsx` duplicaba la carga
  de perfil y nunca persistía el que se creaba desde su propio form —
  unificado con `useProfile()` + `saveProfileToStorage()`.
- **Loading progresivo en `MolinoInterpretation.tsx`**: mensajes
  escalonados (2s/5s/10s) bajo el skeleton mientras la IA responde.

### Estado de verificación

El tramo 2 se validó por tests/build/deploy y por grep de los bundles JS
reales servidos en producción (confirma que el código correcto llegó a
producción) — **no hubo verificación visual interactiva** en ninguno de
sus cambios (sin extensión de Chrome conectada durante toda la sesión).
Antes de construir funcionalidades nuevas sobre Números Maestros/Personal
Cycles, confirmar visualmente que se ven y funcionan como se espera. Ver
`.claude/execution-logs/session-verification.md` para el detalle exacto
de qué se pudo y no se pudo confirmar.

## Stack

- Next.js 16 (custom — ver warning más abajo, App Router) + React 19 + TypeScript 5
- Tailwind CSS + CSS Variables, Framer Motion, next-themes (dark vía `.dark`)
- Vitest (unit, `lib/**/__tests__`) + Playwright (`e2e/`, `playwright.config.ts`)
- Resend (email transaccional), Vercel KV, recharts (dataviz)
- Analytics interno propio (`lib/analytics/`, 100% local/localStorage, sin
  servidor) + Vercel Web Analytics (agregado, cookieless, sin fingerprinting,
  sin perfil por persona — activado 2026-08-18) para conteos de visitas por
  página. Ningún otro proveedor de analytics/tracking de terceros.

## Estructura (86 rutas en `app/`, ~600 archivos — ver `graphify-out/GRAPH_REPORT.md` para el mapa completo)

```
app/            rutas App Router (page.tsx, layout.tsx, error.tsx por segmento)
components/     por dominio: profile/, affinity/, compatibility/, atlas/, ui/, sections/
lib/engines/    motores de cálculo puros y deterministas (numerología, astrología, zodíaco, compatibilidad)
lib/session/    persistencia (ephemeral.ts, localStorage.ts, multiProfiles.ts)
lib/data/       datos públicos estáticos
types/          tipos TypeScript compartidos
```

`ARCHITECTURE.md` documenta el flujo de datos y la estructura completa —
confiar en el código y en graphify antes que en ese doc para detalles finos.

## Convenciones

- Español rioplatense (vos), `lang="es-AR"` en todo el sitio
- `font-heading` (Space Grotesk) para títulos, `font-sans` (Inter) para cuerpo
- Radio: estructura filosa (0), detalle suave. 4 tokens en `app/globals.css`
  (`--radius-sm` 6px chips/badges, `md` 10px botones/inputs/cards, `lg` 14px
  modales/cards grandes, `xl` 20px contenedores destacados) — no usar
  `rounded-2xl`/`rounded-3xl` (defaults de Tailwind fuera del sistema, hoy con
  usos heredados que hay que migrar a estos 4 tokens, no sumar un quinto).
  Sombra "papel levantado" (`--shadow-sm/md/lg/xl`, tinte cálido, ver
  `DESIGN.md`) — no es solo para dark mode.
- `"use client"` solo en componentes que realmente necesitan interactividad
- Motores de cálculo (`lib/engines/`) son funciones puras: misma fecha de entrada → mismo resultado, sin I/O
- Sin servidor de estado para el perfil del usuario: todo vive en localStorage, URL, o sesión efímera — no agregar una base de datos para esto sin justificarlo explícitamente

## Reglas de arquitectura

- No introducir un backend/DB para el perfil de usuario: es una decisión de producto (privacidad, sin fricción), no una limitación técnica a "arreglar"
- Nuevo motor de cálculo → función pura en `lib/engines/`, con tests en `__tests__` junto al motor, siguiendo el patrón de `numerologyEngine.ts`
- Dos métodos de pago: **MercadoPago** (principal) y **Bitcoin**. No
  reintroducir Stripe/PayPal sin una decisión de producto explícita — se
  eliminaron a propósito, no por descuido.
- **BTC no usa procesador ni webhook.** Una wallet no custodial no avisa
  cuando llega la plata, y como todos pagan a la misma dirección tampoco se
  sabría de quién es. El comprobante lo aporta la persona: pega el txid y
  `app/api/btc/claim` lo verifica contra la blockchain (mempool.space, sin
  API key) — que pague a nuestra dirección, que el monto alcance, y que ese
  txid no se haya usado. No se le cree nada al cliente.
- La dirección va en la env var `BTC_ADDRESS`, nunca en el repo. Sin esa
  variable el método queda deshabilitado y la UI no lo ofrece: no hay
  dirección por defecto.
- Para la idempotencia de BTC se usa `claimBtcTxid` (lib/kv.ts), **no**
  `markPaymentProcessed`: ese candado expira a las 24h (alcanza para los
  reintentos del webhook de MP, pero un txid lo tipea la persona y al día
  siguiente el mismo comprobante activaría otro mapa) y no distingue "KV
  caído" de "ya lo usó otro", que acá significaría acusar a alguien que pagó.
- Después de cambios estructurales, correr `graphify update .`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
