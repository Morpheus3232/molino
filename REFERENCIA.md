# Molino — Referencia de Equipo

Documento único que combina la auditoría completa de la aplicación y el Design System v1. Base para todas las fases futuras (Header, Home, páginas internas, refinamiento visual).

---

## Parte 1: Auditoría

### Resumen ejecutivo

**Fecha:** Julio 2026
**Estado:** Fase 1 (auditoría + design system) y Fase 3 (implementación) completadas.
**Issues totales auditados:** ~50
**Corregidos:** ~35 | **Pendientes:** ~15 (priorizados)

---

### Clasificación de problemas por prioridad

#### P0 — Crítico (bloquea flujo principal)

| # | Issue | Archivo | Estado |
|---|-------|---------|--------|
| 1 | Home Hero ocupa ~100vh sin scroll hint | `HeroNew.tsx` | Pendiente |
| 2 | Home Page: `getScoreColor` redefinida inline 3 veces | `app/page.tsx` (y daily-energy, timing, decisions) | ✅ Corregido |
| 3 | Onboarding: botón CTA con inline Tailwind en vez de `<Button>` | `app/onboarding/page.tsx` | Pendiente |
| 4 | Botones: 20+ inline replicando estilos, sin `loading` prop | `Button.tsx` + páginas | ✅ Corregido |

#### P1 — Alto (afecta UX diario)

| # | Issue | Archivo | Estado |
|---|-------|---------|--------|
| 5 | Header: active state no cubre sub-rutas (`pathname.startsWith`) | `UniversityHeader.tsx` | ✅ Corregido |
| 6 | Daily Energy: `getScoreColor` inline, `font-serif` usado | `app/daily-energy/page.tsx` | ✅ Corregido |
| 7 | Dark mode: footer `bg-ink` → blanco en dark, `bg-black/[0.02]` invisible | Múltiples archivos | ✅ Corregido |
| 8 | Hero: CTA compite con número del día (22vw) | `HeroNew.tsx` | Pendiente |
| 9 | Confirm dialog buttons: inline Tailwind, no usa `<Button>` | `UniversityHeader.tsx` | ✅ Corregido |
| 10 | CTA mobile/desktop desunificado en header | `UniversityHeader.tsx` | ✅ Corregido |

#### P2 — Medio (calidad percibida)

| # | Issue | Archivo | Estado |
|---|-------|---------|--------|
| 11 | Explore: empty state inline en vez de `<EmptyState>` | `app/explore/page.tsx` | ✅ Corregido |
| 12 | Cards: 100+ `border border-border bg-card` inline → `<Card>` | Múltiples archivos | Pendiente |
| 13 | Skeleton loading: no se usa en profile ni daily-energy | `LoadingState.tsx` | Pendiente |
| 14 | LoadingStates: solo spinner, sin skeleton para contenido conocido | `LoadingState.tsx` | Pendiente |
| 15 | Spinner usa `rounded-full` — único elemento con radio, aceptable | — | ✅ Documentado (excepción) |

#### P3 — Bajo (mejoras cosméticas/estructurales)

| # | Issue | Archivo | Estado |
|---|-------|---------|--------|
| 16 | `<Breadcrumbs>` no existe como componente | — | ✅ Creado |
| 17 | `<EmptyState>` exists but has 0 imports | `components/ui/EmptyState.tsx` | ✅ Integrado en 6 páginas |
| 18 | Not-found page: sin footer ni link a explore | `app/not-found.tsx` | Pendiente |
| 19 | `DatePicker` + `ScrollDatePicker` duplican `DateInput` | `ui/DatePicker.tsx`, `ui/ScrollDatePicker.tsx` | Pendiente |
| 20 | `Badge` component no existe (solo clase `.badge` en CSS) | `globals.css` | Pendiente |
| 21 | Footer fijo `bg-[#0F0F10]` pero sin links a redes sociales | `UniversityFooter.tsx` | Pendiente |

---

## Parte 2: Design System V1

### 2.1 Principios de diseño

1. **Claridad antes que decoración** — Un foco principal por pantalla
2. **Mucho espacio negativo** — El aire comunica calidad
3. **Ritmo editorial** — Alternar bloques grandes/chicos, evitar "lista de tarjetas"
4. **Profundidad sutil** — Bordes + fondos alternativos + translateY. Sin sombras.
5. **Movimiento con propósito** — Animaciones que refuerzan navegación y foco
6. **Consistencia absoluta** — Un componente se ve y comporta igual en toda la app

### 2.2 Paleta de colores — 12 roles semánticos

| Rol | Light | Dark | Token Tailwind |
|-----|-------|------|----------------|
| Background | `#FFFFFF` | `#0a0a0f` | `bg-background` |
| Surface | `#F5F5F0` | `#121214` | `bg-card`, `bg-paper-alt` |
| Surface Elevated | `#FFFFFF` | `#1a1a1e` | *(nuevo, sin token CSS)* |
| Border | `#D4D4D4` | `#2A2A2E` | `border-border` |
| Border Strong | `#0F0F10` | `#FFFFFF` | `border-ink/25` |
| Text Primary | `#0F0F10` | `#FFFFFF` | `text-foreground` |
| Text Secondary | `#6B6B6B` | `#8A8A8A` | `text-muted` |
| Text Muted | `#6B6B6B` | `#8A8A8A` | `text-muted` (opacity) |
| Accent | `#1E3AFF` | `#1E3AFF` | `text-accent`, `bg-accent` |
| Success | `#059669` | `#34d399` | `text-success`, `bg-success` |
| Warning | `#1E3AFF` | `#1E3AFF` | Usa accent (no hay warning dedicado) |
| Error | `#DC2626` | `#f87171` | `text-error`, `bg-error` |

**Regla:** Siempre `bg-background` / `text-foreground` / `border-border`. Nunca `bg-white` / `text-black` / `border-gray-*`.

**Excepción:** Footer usa `bg-[#0F0F10]` fijo (no se adapta a theme).

**Score colors:** Colores fijos semánticos (no se adaptan a theme). Verde siempre verde.

### 2.3 Tipografía — Escala cerrada de 9 niveles

**Font stack:**
```
--font-display: 'Archivo Black', sans-serif   → Hero, números signature
--font-sans:    'Inter', sans-serif              → Cuerpo, UI
--font-heading: 'Space Grotesk', sans-serif      → Subtítulos, scores, badges
--font-mono:    'JetBrains Mono', monospace      → Labels, datos técnicos, breadcrumbs
```

**Escala:**

| Nivel | Tamaño | Peso | LH | Font | Tracking | Uso |
|-------|--------|------|----|-------|----------|-----|
| Display | `--step-8` (4.5rem / 72px) | 400 | 0.85 | display | -0.02em | Hero, número del día |
| H1 | `--step-6` (3rem / 48px) | 400 | 0.9 | display | -0.02em | Título de página |
| H2 | `--step-5` (2.25rem / 36px) | 400 | 1.0 | display | -0.02em | Título de sección |
| H3 | `--step-4` (1.75rem / 28px) | 600 | 1.1 | heading | normal | Subtítulo de bloque |
| H4 | `--step-3` (1.375rem / 22px) | 600 | 1.2 | heading | normal | Card title, score |
| Body Large | `--step-2` (1.125rem / 18px) | 400 | 1.6 | sans | normal | Lead, descripción hero |
| Body | `--step-1` (1rem / 16px) | 400 | 1.6 | sans | normal | Párrafos, UI |
| Caption | 0.875rem (14px) | 400 | 1.5 | sans | normal | Metadata, secundario |
| Overline | 0.7rem (11px) | 600 | 1.0 | mono | 0.3em | Eyebrow, label-micro |

**Reglas:**
- `font-display` → Solo Display, H1, H2. NUNCA en párrafos o labels. Siempre uppercase.
- `font-heading` → H3, H4, scores, badges.
- `font-sans` → Body Large, Body, Caption. Default del body.
- `font-mono` → Overline exclusivamente.
- No usar `font-serif` (eliminado — no había fuente cargada).
- No usar `text-[*]` inline para tipografía.

### 2.4 Espaciado — Escala fija de 9 tokens

| Token | Px | Rem | Tailwind |
|-------|----|-----|----------|
| xs | 8px | 0.5rem | `p-2` |
| sm | 12px | 0.75rem | `p-3` |
| md | 16px | 1rem | `p-4` |
| lg | 24px | 1.5rem | `p-6` |
| xl | 32px | 2rem | `p-8` |
| 2xl | 48px | 3rem | `p-12` |
| 3xl | 64px | 4rem | `p-16` |
| 4xl | 96px | 6rem | `p-24` |
| 5xl | 128px | 8rem | `p-32` |

**Container:** `max-w-8xl px-4 sm:px-8 lg:px-12` (16px / 32px / 48px — todos en escala)
**cellPad:** `p-8 lg:p-12` (32px / 48px — todos en escala)
**Section spacing:** `py-16` para secciones, `pb-24` para bottom de `<main>`
**Card padding:** `p-6` (sm/md), `p-8` (lg)

**No crear valores intermedios** salvo justificación explícita.

### 2.5 Contenedores — Sistema único

| Tipo | Clase | Uso |
|------|-------|-----|
| Principal | `max-w-8xl px-4 sm:px-8 lg:px-12` | Todas las páginas |
| Formulario | `max-w-xl px-4 sm:px-8 lg:px-12` | Onboarding |
| Texto largo | `max-w-2xl px-4 sm:px-8 lg:px-12` | Artículos, guías |
| Compacto | `max-w-sm` | Cards individuales, modales |

**Reglas:**
- Toda página envuelve en `<main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">`
- No usar `max-w-7xl`, `max-w-5xl`, etc. para contenido principal
- No usar `px-5`, `px-6`, `px-10` (violan la escala)

### 2.6 Bordes y radios

Cada tipo de componente tiene **un solo radio**:

| Componente | Radio | Clase |
|-----------|-------|-------|
| `<Button>` | Completo | `rounded-full` |
| Inputs | Cero | `rounded-none` |
| Cards | Cero | `rounded-none` |
| Modales | Cero | `rounded-none` |
| Badges / Tags | Cero | `rounded-none` |
| Tooltips | Cero | `rounded-none` |
| Dropdowns | Cero | `rounded-none` |
| Spinners | Completo | `rounded-full` |

**Borde:** Siempre `solid`, 1px. Excepción: empty state puede usar `border-dashed`.

**Bordes de color:**
- Default: `border border-border`
- Layout grid: `border border-ink/10`
- Hover card: `border border-accent`
- Focus input: `border-accent` + `ring-2 ring-accent/40 ring-offset-2`
- Error: `border-error` + `ring-2 ring-error/15`

### 2.7 Sombras y elevación — 3 niveles (sin sombras CSS)

| Nivel | Técnica | Uso |
|-------|---------|-----|
| Base | `border border-border bg-background` | Superficies planas |
| Elevada | `border border-border bg-card hover:border-accent hover:-translate-y-[2px]` | Cards clickables |
| Modal | `border border-ink/10 bg-background` + overlay `bg-ink/50` | Diálogos |

**Qué NO se usa:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `drop-shadow`, `backdrop-blur` (excepto header scroll y premium gate).

### 2.8 Componentes base — Especificaciones

#### Botón (`<Button>`)
- Radio: `rounded-full`
- Font: `font-mono text-xs uppercase tracking-wider font-semibold`
- Tamaños: sm (40px), md (44px), lg (52px)
- Variantes: `primary`, `secondary`, `ghost`
- Estados: hover ✓, focus-visible ✓, disabled ✓, loading ✓ (PENDIENTE de diseño final)
- **NO usar inline Tailwind para botones.** Todo botón usa `<Button>` o clase `btn-*`.

#### Botón editorial (`btn-*`)
- Radio: `rounded-none`
- Font: `font-mono text-xs uppercase tracking-wider font-semibold`
- Clases: `.btn`, `.btn-accent`, `.btn-primary`, `.btn-ghost`
- Uso: CTAs en secciones editoriales (hero, banners, CTA final)
- **No mezclar** `<Button>` con `btn-*` en misma página. Elegir uno.

#### Card
- Radio: `rounded-none`
- Bg: `bg-card`, Borde: `border border-border`
- Padding: `sm: p-6` / `md: p-6` / `lg: p-8`
- Hover: `hover:border-accent hover:-translate-y-[2px]`

#### Input
- Radio: `rounded-none`
- Borde: `border border-border`
- Focus: `focus:border-accent focus:ring-2 focus:ring-accent/40 focus:ring-offset-2`
- Min-height: 44px
- Font: `font-sans text-sm`

#### DateInput
- DD / MM / AAAA (3 inputs con auto-advance)
- Font campos: `font-heading text-3xl sm:text-4xl semibold`
- Separadores `/` en `text-muted-foreground/40`

#### Badge / Tag
- Radio: `rounded-none`
- Font: `font-mono text-xs uppercase tracking-[0.2em] font-semibold`
- Default: `bg-accent text-accent-foreground`

#### Chip (interactivo)
- Radio: `rounded-none`
- Default: `bg-background border border-border text-foreground`
- Active: `bg-accent/10 border-accent text-accent`

#### Modal / Dialog
- Radio: `rounded-none`
- Padding: `p-8`
- Overlay: `bg-ink/50`
- Max-width: `max-w-sm` (384px)
- Focus trap + Escape + click-outside to close

#### Empty State
```tsx
<EmptyState
  title="Título"
  description="Descripción opcional."
  actionLabel="Limpiar"     // optional
  onAction={() => setSearch("")}  // optional
/>
```

#### Skeleton / Loading
- Spinner: `border-2 border-border border-t-accent rounded-full animate-spin`
- Skeleton card: `bg-muted/20 animate-pulse rounded-none`
- `LoadingState` para carga genérica. `Skeleton` para contenido con estructura conocida.

#### Breadcrumbs
```tsx
<Breadcrumbs
  items={[
    { label: "Inicio", href: "/" },
    { label: "Conocimiento", href: "/conocimiento" },
    { label: "Numerología", href: "/conocimiento/numerologia" },
    { label: "Número 7" },
  ]}
/>
```
Font: `.label-micro`. Separador: `›` (text-muted). Último item: text-foreground, sin link. Padding: `mb-6`.

#### CTA / Banner promocional
- Background: `bg-accent` → `.accent-block`
- Título: `font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9]`
- Botón CTA: `.btn bg-white text-accent hover:bg-white/90`

#### Tooltip
- Background: `bg-ink` (fijo, no se adapta a theme)
- Color texto: `text-paper`
- Radio: `rounded-none`

### 2.9 Layout grid

**Grid editorial (separadores de 1px):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
  {items.map(item => (
    <div key={item.id} className="bg-background p-8 lg:p-12">...</div>
  ))}
</div>
```

**Grillas responsive:**
- 1 col → mobile default
- 2 cols → `sm:grid-cols-2` (640px)
- 3 cols → `lg:grid-cols-3` (1024px)
- 4 cols → `lg:grid-cols-4` (scores, stats)

**Columnas asimétricas (hero):**
```tsx
<div className="flex flex-wrap">
  <div className="w-full lg:w-3/5 p-8 lg:p-12 lg:border-r border-ink/10">...</div>
  <div className="w-full lg:w-2/5 p-8 lg:p-12">...</div>
</div>
```

### 2.10 Animaciones — Motion tokens

Definidos en `lib/utils/motion.ts`. Usar estos, no crear variants inline.

| Token | Uso |
|-------|-----|
| `fadeUp` | Secciones al hacer scroll (viewport once) |
| `fadeUpDelayed(delay)` | Stagger entre secciones |
| `staggerContainer` + `staggerItem` | Listas y grids (stagger 0.08s) |
| `pageEnter` | Transición de ruta |
| `scaleUp` | Números, badges |
| `numberReveal` | Números grandes (spring) |
| `hoverLift` | Cards (`y: -4`) |
| `hoverScale` | Botones |

**Reglas:**
- `viewport: { once: true }` siempre
- Duración: 0.3s - 0.5s. Nada más lento
- Respetar `prefers-reduced-motion: reduce`

### 2.11 Navegación

**Header:**
- Active state: `pathname.startsWith(link.href)` (excepto `/` que es exacto)
- HOY y MI MAPA: active con `text-accent`
- CTA mobile/desktop: mismo estilo (`bg-accent text-accent-foreground`)

**Footer:** Fondo fijo `bg-[#0F0F10]`, no se adapta a theme.

### 2.12 Decisiones sistémicas

| Decisión | Efecto |
|----------|--------|
| `rounded-none` para todo excepto `<Button>` | Consistencia brutalista |
| Botón dual: `<Button>` (CTA) + `btn-*` (editorial) | Dos sistemas, no mezclar |
| Footer fijo oscuro | `bg-[#0F0F10]` siempre |
| Score colors fijos | Semánticos, no cambian con theme |
| Sin sombras CSS | Profundidad con bordes + translateY |
| `font-heading` reemplaza `font-serif` | Una sola font para títulos |
| Escala de espaciado cerrada | 9 tokens, sin valores intermedios |
| Escala tipográfica cerrada | 9 niveles, sin variantes ad hoc |

---

## Parte 3: Estado actual del proyecto

### Fases completadas

| Fase | Contenido | Estado |
|------|-----------|--------|
| 1 | Auditoría completa + Design System inicial | ✅ Completado |
| 2 | Design System v1 (documentación final) | ✅ Completado |
| 3 | Implementación: spacing, componentes, header, limpieza | ✅ Completado |

### Jerarquía de páginas

No todas las páginas tienen el mismo peso. La inversión de diseño debe reflejar esta prioridad.

| Nivel | Nombre | Páginas | Prioridad de diseño |
|-------|--------|---------|---------------------|
| **1** | Identidad del producto | Home, Onboarding, Mi Mapa | 🔴 Máxima inversión. Es la primera impresión y el punto de conversión. |
| **2** | Utilidad frecuente | Energía diaria, Afinidad, Compatibilidad | 🟡 Alta inversión. Son las páginas que los usuarios visitan recurrentemente. |
| **3** | Contenido de apoyo | Conocimiento, Artículos, Entidades | 🟢 Inversión estándar. Retención y SEO, pero no son el núcleo del producto. |

### Implicaciones de la jerarquía

- **Nivel 1:** Hero, CTAs, microcopy y velocidad de carga deben ser impecables. El onboarding es el funnel de conversión — cada segundo cuenta.
- **Nivel 2:** La experiencia diaria (Energía) y la exploración (Afinidad, Compatibilidad) deben ser satisfactorias y rápidas. Son lo que trae usuarios de vuelta.
- **Nivel 3:** El contenido editorial debe ser claro y bien estructurado, pero no requiere la misma atención visual que las páginas de Nivel 1.

---

### Fases pendientes

| Fase | Contenido | Prioridad |
|------|-----------|-----------|
| 4 | Migración de cards inline → `<Card>` component | Media |
| 5 | Skeleton loading para profile y daily-energy | Media |
| 6 | Crear `<Badge>`, `<ErrorMessage>`, `<Chip>`, `<SearchInput>` | Baja |
| 7 | Consolidar DatePicker + ScrollDatePicker | Baja |
| 8 | Refinamiento visual de hero y CTAs | Media |
| 9 | Reactivación Premium (cuando haya valor sostenible) | Baja |

### Métricas actuales

- **52** page.tsx, **14** layout.tsx, **0** loading.tsx, **0** error.tsx (excepto root)
- **42** componentes UI
- **PREMIUM_ENABLED** = `false` (paywall desactivado, código de pago intacto)
- **Sin cuentas / sin servidor guardando datos** (privacidad radical)
- **Código abierto**

---

*Referencia de equipo — Molino. Basada en auditoría Fase 1 + Design System v1 + implementación Fase 3. Última actualización: Julio 2026.*