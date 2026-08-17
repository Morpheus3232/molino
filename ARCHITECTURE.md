# Arquitectura de Molino

_Regenerado automáticamente el 2026-08-17 a partir de graphify + escaneo de `app/`. 86 rutas, ~600 archivos._

## Stack

| Capa       | Tecnología                                  |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 16 (custom — ver nota de agente en `node_modules/next/dist/docs/`) |
| Lenguaje   | TypeScript 5                                 |
| UI         | React 19                                     |
| Estilos    | Tailwind CSS + CSS Variables                 |
| Animación  | Framer Motion                                |
| Tema       | next-themes (class-based, `.dark`)           |
| Dataviz    | recharts                                     |
| Pagos      | MercadoPago (único proveedor — Stripe y PayPal eliminados 2026-08-17) |
| Email      | Resend                                       |
| Storage    | Vercel KV                                    |
| Testing    | Vitest (unit) + Playwright (e2e)             |
| CI         | GitHub Actions                               |

## Estructura de carpetas

```
app/                    # Next.js App Router — 86 rutas
  page.tsx              # Landing
  onboarding/            # Wizard (fecha → preview → generar)
  profile/, profile/insights/
  perfil/[hash]/         # Perfil compartido, codificado en URL
  compatibilidad/[pair]/ # Compatibilidad (ES) — ver nota de duplicación abajo
  compatibility/[entity]/, compatibility/brands/, compatibility/countries/  # Compatibilidad (EN)
  affinity/              # Afinidad simbólica: [type]/[slug], compare/, recommendations/
  atlas/                 # Explorador geográfico/cultural: [countryISO], explorar/[animal]
  conocimiento/          # Contenido educativo: astrologia/, numerologia/, zodiaco-chino/
  academy/[slug]/, biblioteca/[slug]/, blog/[slug]/, guia/, docs/motores/, metodos-y-fuentes/
  herramientas/          # Calculadoras standalone (camino-de-vida, signo-solar, etc.)
  premium/, premium/claim/, precios/, portal/, profesionales/   # Monetización
  hoy/, semana/, calendario/, timing/, evolution/, journal/, decisions/, nudo/
  analytics/, analytics/affinity/    # Analytics interno
  api/                    # Route handlers
  filosofia/, method/, nosotros/, transparencia/, privacidad/, terminos/
  sitemap.ts, robots.ts, opengraph-image.tsx
  globals.css            # Variables CSS + diseño system

components/
  layout/                # UniversityHeader, UniversityFooter
  profile/                # ProfileHub, EphemeralWarning, DownloadProfileButton, screens/
  affinity/, atlas/, compatibility/, couple/, academy/, daily/, journal/, timing/, social/
  premium/, pricing/      # Checkout, gates
  sections/                # Hero, Journey, SystemsPreview, HowItWorks
  charts/                  # recharts wrappers
  ui/                      # Componentes base (Grid, GridSystem, Button, LoadingState, etc.)
  analytics/                # AnalyticsProvider
  lab/, shared/

lib/
  engines/                # 27 motores de cálculo (ver abajo)
    intelligence/          # Prompt builder V2 del motor de IA (ver sección propia)
    __tests__/            # Tests unitarios
  ai/                      # Interpretación asistida por LLM
  cache/                   # interpretationCache.ts — cache de interpretaciones (Vercel KV)
  session/                 # Persistencia: ephemeral.ts, localStorage.ts, multiProfiles.ts, dailyHistory.ts
  data/                    # Datos públicos estáticos (countries-atlas.ts, brands-60.ts, famousPeopleToEntities.ts)
  interpreter/, numerology/, calculations/, context/, i18n/, viral/, workers/
  mercadopago.ts, premium.ts   # Monetización (MercadoPago únicamente)
  email.ts                # Resend
  kv.ts                    # Vercel KV
  seo.ts, seo-jsonld.ts, seo/
  analytics/                # Sistema de analytics interno (sin terceros)
  hooks/, utils/, validation/

types/                  # Tipos TypeScript (user.d.ts, atlas.ts, etc.)
e2e/                    # Tests end-to-end (Playwright)
public/                 # Assets estáticos
graphify-out/           # Grafo de conocimiento del codebase (ver CLAUDE.md)
```

## Motores de cálculo (`lib/engines/`, 27 archivos)

Cada motor es una función pura (determinista): misma fecha de entrada → mismo
resultado, sin I/O. Incluyen numerología, astrología, zodíaco chino,
compatibilidad (`compatibilityEngine.ts`, `compatibilityScoreEngine.ts`,
`coupleEngine.ts`), afinidad (`affinityEngine.ts`), timing/energía diaria
(`timingEngine.ts`, `dailyEnergyEngine.ts`, `yearCycleEngine.ts`), decisiones
(`decisionsEngine.ts`, `decisionIntent.ts`), narrativa (`storyEngine.ts`,
`entityStoryEngine.ts`, `synthesisEngine.ts`, `perspectivesEngine.ts`), IA
(`aiEngine.ts`, `aiResponseParser.ts`, `omnirouteRouter.ts`,
`providerRouter.ts`), y orquestación de perfil (`profileBuilder.ts`,
`registry.ts`, `recommendationEngine.ts`, `intelligenceEngine.ts`,
`convergentEngine.ts`, `nudoEngine.ts`).

## Componentes de Afinidad (`app/affinity/[type]/[slug]/` + `components/affinity/`)

Refactorizado 2026-08-17 (`AffinityDetailContent.tsx` pasó de 1024 a 140
líneas). El orquestador delega en un hook compartido y 5 componentes:

```
AffinityDetailContent.tsx          orquestador (140 líneas)
  ├─ useAffinityResult()           lib/hooks/useAffinityResult.ts
  │    entrada: profile | null, entity, catalog
  │    salida: { result: AffinityResult | null, relatedEntities: LightAffinityResult[] }
  │    usado por AffinityDetailContent Y AffinityQuickEntryForm — antes duplicado
  │
  ├─ (sin profile) → AffinityQuickEntryForm.tsx
  │    Flujo P0 autocontenido: formulario de fecha (día/mes/año, sessionStorage),
  │    guardado a localStorage, tracking de analytics propio
  │    compone → AffinityHero + AffinityDiscoveryList
  │
  └─ (con profile) →
       ├─ AffinityHero.tsx           score, animales enfrentados, CTA explorar
       ├─ AffinityDeepDive.tsx       6 secciones: base del cálculo, relación,
       │                             por qué, otros eventos, datos documentados,
       │                             disclaimer, "Tu conexión" (historia)
       └─ AffinityDiscoveryList.tsx  entidades relacionadas (top 3) — antes
                                     duplicado entre ambos flujos

AffinitySectionPrimitives.tsx      SectionHeader, CollapsibleSection, DataRow,
                                    OtherEventCard, formatDisplayDate —
                                    compartidas por AffinityDetailContent,
                                    AffinityDeepDive y AffinityDiscoveryList
```

Detalle del análisis de responsabilidades y decisiones de extracción en
`.claude/execution-logs/affinity-responsibilities.md` y
`.claude/execution-logs/affinity-refactor.diff`.

## Motor de IA — `intelligenceEngine.ts` + feature flag V2 (`lib/engines/intelligence/`)

Refactorizado 2026-08-17 (`intelligenceEngine.ts` pasó de 1123 a 489
líneas). `buildIntelligencePrompt()` es un wrapper delgado que lee
`process.env.INTELLIGENCE_ENGINE_V2_ENABLED === 'true'` y delega:

```
buildIntelligencePrompt(request)
  ├─ V2 (flag=true)  → lib/engines/intelligence/promptBuilder.ts (buildIntelligencePromptV2)
  └─ legacy (default) → buildIntelligencePromptLegacy() (queda completo dentro de intelligenceEngine.ts)
```

Módulos extraídos junto al prompt builder (todos en
`lib/engines/intelligence/`): `types.ts` (tipos compartidos, incl.
`InterpretationType`), `contextBuilder.ts`, `fallbackThemes.ts`,
`fallbackNarrative.ts`, `fallbackInterpretation.ts`. El contenido del
prompt es **byte-idéntico** entre V2 y legacy (verificado con tests de
contenido generados programáticamente,
`prompt-builder-content.test.ts`) — el flag es puramente estructural, no
cambia el output. Activo en Production desde esta sesión; procedimiento de
rollback (solo env var, sin revertir código) en
`.claude/execution-logs/v2-rollback-procedure.md`.

## Cache de interpretaciones (`lib/cache/interpretationCache.ts`)

Antes de esta sesión, cada visita a una página que renderiza
`components/ui/MolinoInterpretation.tsx` disparaba una llamada real (y
paga) al proveedor de IA, sin importar si ya se había generado la misma
interpretación antes. `app/api/intelligence/interpret/route.ts` ahora
cachea en Vercel KV antes de llamar al proveedor:

```
key:   interp:${profileHash}:${type}:${version}:${hash(prompt)}
TTL:   daily_energy → hasta medianoche UTC
       timing       → 24h fijas
       resto        → sin TTL (invalida solo si cambia el prompt o la versión)
```

`profileHash` reusa el mismo identificador pseudónimo que ya usa
`lib/kv.ts` para premium/tokens — no es un `userId` nuevo. `version` es un
contador por `profileHash+type` que "Regenerar" (`isRegenerate: true` en
el body) incrementa para invalidar el cache vigente sin necesitar conocer
el `promptHash` exacto a borrar. Diseño completo en
`.claude/execution-logs/interpretation-cache-design.md`.

## Cadena de proveedores de IA (`lib/engines/aiEngine.ts` + `providerRouter.ts`)

`generateWithRouting()` (`providerRouter.ts`) intenta un proveedor
primario y, si falla, uno de fallback (`openai`/`claude`/`openrouter`;
`omniroute` solo es alcanzable en dev local vía proxy — en producción cae
automáticamente al proveedor real, con logging correcto desde esta
sesión). Cada intento pasa por `fetchWithTimeout` (`aiEngine.ts`), con un
único nivel de reintento coordinado en el router (no dos capas
multiplicándose) y un timeout por intento diferenciado: 20s para tipos
livianos, 55s para `personal_profile`/`question` (prompt ~4x más largo,
exige razonamiento multi-sistema). `app/api/intelligence/interpret/route.ts`
además corre la llamada completa contra un timeout global (65s/35s según
el tipo) que garantiza servir el fallback local determinista si se agota.

**Limitación conocida, no resuelta todavía**: el timeout por intento solo
protege hasta que llegan los headers de la respuesta HTTP
(`fetch()` resuelve) — la lectura del body (`response.json()`) corre sin
esa protección. Con tráfico real se midió esa fase sola tardando ~61s
(ver `.claude/execution-logs/latency-final-validation.md`). El timeout
global de la request sigue siendo la única red de seguridad real para
este caso hasta que se aplique el fix propuesto (extender el
`AbortSignal` para cubrir también la lectura del body).

## Flujo de datos

1. **Onboarding**: usuario ingresa fecha → se guarda en localStorage → redirect a `/profile?dob=YYYY-MM-DD`
2. **Profile**: lee `?dob=` o `?data=` (shared) o localStorage o sesión efímera → calcula perfil con `calculateUserProfile()` (`lib/engines/profileBuilder.ts`) → muestra hub + screens
3. **Persistencia**: localStorage para el perfil activo (`lib/session/localStorage.ts`, `multiProfiles.ts`). Sesión efímera (memoria) para datos temporales. Sin servidor de estado, sin base de datos propia — Vercel KV se usa para casos puntuales (rate limiting, cache), no como store del perfil.
4. **Compartir**: `/perfil/[hash]` codifica datos en la URL (base64 comprimido, `lib/utils/profileShare.ts`). Sin servidor.
5. **Monetización**: `precios/` → checkout vía MercadoPago (`lib/mercadopago.ts`) → gate de features en `components/profile/PremiumGate.tsx`.

## Nota: compatibilidad vs. compatibility (NO son duplicados)

`app/compatibilidad/[pair]/` y `app/compatibility/**` suenan a la misma
feature en dos idiomas, pero son productos distintos — confirmado por
lectura de código, ver `.claude/execution-logs/step4-route-duplication.md`:

- `compatibilidad/[pair]` — 144 páginas SEO programáticas de compatibilidad
  entre signos zodiacales (`aries-tauro`, etc.), contenido estático, sin
  personalización.
- `compatibility/[entity]`, `compatibility/brands`, `compatibility/countries`
  — compatibilidad multi-factor (numerología + astrología + zodíaco chino)
  del perfil del usuario contra marcas/países/personas (`lib/data/entities.ts`),
  interactivo, requiere `useProfile()`.

No hay lógica de negocio compartida ni superposición de contenido. No
requiere consolidación.

## Convenciones

- `lang="es-AR"` (vos) en todo el sitio
- `font-heading` (Space Grotesk) para títulos; `font-sans` (Inter) para cuerpo
- Dark mode vía clase `.dark` en `<html>` (next-themes)
- Sin `border-radius` (todas las esquinas rectas, salvo casos puntuales)
- Sin sombras (salvo en dark mode)
- Componentes "use client" solo cuando necesitan interactividad

## Testing

```bash
npm run test        # Tests unitarios (Vitest)
npm run test:e2e    # Tests E2E (Playwright)
npm run lint        # ESLint
npm run typecheck   # TypeScript checks
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):
- lint + typecheck → test → build (en paralelo parcial)
- Se ejecuta en cada push/PR a main
