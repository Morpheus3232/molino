## Identidad del proyecto

**molino.app**: app simbólica de autoconocimiento (numerología, astrología,
zodíaco chino, afinidad) en español rioplatense (`lang="es-AR"`, vos). Sin
backend propio ni base de datos: los motores de cálculo son funciones puras
y la persistencia del perfil vive en localStorage / URL (share por hash) /
memoria efímera. Monetiza exclusivamente con MercadoPago (`lib/mercadopago.ts`,
`lib/premium.ts`) — Stripe y PayPal se eliminaron por completo (2026-08-17):
ninguno de los dos tenía credenciales configuradas en producción ni UI que
los ofreciera como opción de pago.

## Estado tras la sesión de 2026-08-17 (refactors + cache + latencia)

Sesión larga de hardening: 27 commits, ver detalle completo en
`.claude/execution-logs/session-closure-report.md`. Resumen para orientarse
rápido:

- **Refactors god-component → módulos** (mismo comportamiento, validado con
  la suite completa en cada paso): `intelligenceEngine.ts` (1123 → 489
  líneas + 6 módulos en `lib/engines/intelligence/`),
  `AffinityDetailContent.tsx` (1024 → 140 líneas), `PremiumGate.tsx`
  (748 → 287 líneas + hooks en `lib/hooks/` + componentes en
  `components/premium/`).
- **Motor de IA con feature flag**: `buildIntelligencePrompt()` en
  `intelligenceEngine.ts` lee `INTELLIGENCE_ENGINE_V2_ENABLED` y delega a
  `buildIntelligencePromptV2` (`lib/engines/intelligence/promptBuilder.ts`)
  o a la legacy verbatim — **activo en Production** desde esta sesión.
  Rollback: ver `.claude/execution-logs/v2-rollback-procedure.md`.
- **Cache de interpretaciones** (`lib/cache/interpretationCache.ts`, Vercel
  KV): antes, cada visita al mapa/perfil disparaba una llamada real a IA,
  incluso repetida. Ahora se cachea por
  `profileHash + type + hash(prompt)`, con expiración por tipo
  (`daily_energy` a medianoche UTC, `timing` 24h, el resto sin TTL — solo
  invalida si cambia el prompt o el usuario pide "Regenerar"). Diseño
  completo en `.claude/execution-logs/interpretation-cache-design.md`.
- **Fixes de latencia en `lib/engines/aiEngine.ts` / `providerRouter.ts`**:
  coordinación de reintentos (antes se multiplicaban 2×2 entre capas),
  timeout diferenciado por tipo (20s liviano / 55s para
  `personal_profile`/`question`), timeout global con fallback local
  garantizado (65s/35s). **Hallazgo pendiente de aplicar**: el
  `AbortController` actual solo cubre `fetch()` hasta que llegan los
  headers, no la lectura del body (`response.json()`) — con tráfico real
  se midió ~61s de esa fase sola, sin protección de timeout. Ver
  "Fix adicional propuesto" en
  `.claude/execution-logs/latency-final-validation.md` antes de dar este
  tema por cerrado.

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
