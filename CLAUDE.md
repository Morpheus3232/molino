## Identidad del proyecto

**molino.app**: app simbólica de autoconocimiento (numerología, astrología,
zodíaco chino, afinidad) en español rioplatense (`lang="es-AR"`, vos). Sin
backend propio ni base de datos: los motores de cálculo son funciones puras
y la persistencia del perfil vive en localStorage / URL (share por hash) /
memoria efímera. Monetiza exclusivamente con MercadoPago (`lib/mercadopago.ts`,
`lib/premium.ts`) — Stripe y PayPal se eliminaron por completo (2026-08-17):
ninguno de los dos tenía credenciales configuradas en producción ni UI que
los ofreciera como opción de pago.

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
