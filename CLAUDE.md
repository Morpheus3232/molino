## Identidad del proyecto

**molino.app**: app simbólica de autoconocimiento (numerología, astrología,
zodíaco chino, afinidad) en español rioplatense (`lang="es-AR"`, vos). Sin
backend propio ni base de datos: los motores de cálculo son funciones puras
y la persistencia del perfil vive en localStorage / URL (share por hash) /
memoria efímera. Monetiza exclusivamente con MercadoPago (`lib/mercadopago.ts`,
`lib/premium.ts`) — Stripe y PayPal se eliminaron por completo (2026-08-17):
ninguno de los dos tenía credenciales configuradas en producción ni UI que
los ofreciera como opción de pago.

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
  detecta maestros en Life Path/Expresión/Alma/Personalidad (no solo Life
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
- Analytics interno propio (`lib/analytics/`), sin terceros

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
- Sin `border-radius` salvo casos puntuales; sin sombras salvo dark mode
- `"use client"` solo en componentes que realmente necesitan interactividad
- Motores de cálculo (`lib/engines/`) son funciones puras: misma fecha de entrada → mismo resultado, sin I/O
- Sin servidor de estado para el perfil del usuario: todo vive en localStorage, URL, o sesión efímera — no agregar una base de datos para esto sin justificarlo explícitamente

## Reglas de arquitectura

- No introducir un backend/DB para el perfil de usuario: es una decisión de producto (privacidad, sin fricción), no una limitación técnica a "arreglar"
- Nuevo motor de cálculo → función pura en `lib/engines/`, con tests en `__tests__` junto al motor, siguiendo el patrón de `numerologyEngine.ts`
- Único proveedor de pago: MercadoPago. No reintroducir Stripe/PayPal sin una decisión de producto explícita — se eliminaron a propósito, no por descuido
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
