# Design System — Molino

Basado en la auditoría (Fase 1). Define el lenguaje visual antes de modificar pantallas.

---

## 1. Principios de diseño

```
1. Claridad antes que decoración
   Cada pantalla responde una sola pregunta. Un foco principal, sin competencia visual.

2. Mucho espacio negativo
   El aire entre elementos comunica calidad. Ritmo lento, composición despejada.

3. Ritmo editorial
   Alternar bloques grandes/chicos, variar la composición. Evitar "lista de tarjetas".

4. Profundidad sutil
   Capas, bordes, variaciones de superficie. Sin sombras (brutalist).

5. Movimiento con propósito
   Animaciones que refuerzan navegación y foco. Nada decorativo.

6. Consistencia absoluta
   Un componente se ve y comporta igual en toda la app.
```

---

## 2. Paleta por roles

Los tokens actuales (`--color-ink`, `--color-paper`) se mantienen como base. Se agregan **alias semánticos** para roles de uso.

### Mapa de roles → tokens actuales

| Rol | Light | Dark | Token actual |
|-----|-------|------|--------------|
| **Background** | `#FFFFFF` | `#0a0a0f` | `--color-paper` |
| **Surface** | `#F5F5F0` | `#121214` | `--color-paper-alt` / `--color-card` |
| **Surface Elevated** | `#FFFFFF` | `#1a1a1e` | *(nuevo)* |
| **Border** | `#D4D4D4` | `#2A2A2E` | `--color-border` |
| **Border Strong** | `#0F0F10` | `#FFFFFF` | `--color-ink` at 25% alpha |
| **Text Primary** | `#0F0F10` | `#FFFFFF` | `--color-ink` |
| **Text Secondary** | `#6B6B6B` | `#8A8A8A` | `--color-muted` |
| **Text Muted** | `#6B6B6B` | `#8A8A8A` | `--color-muted` (opacity variants) |
| **Accent** | `#1E3AFF` | `#1E3AFF` | `--color-accent` |
| **Success** | `#059669` | `#34d399` | `--color-success` |
| **Warning** | `#1E3AFF` | `#1E3AFF` | *(usa accent — no hay warning real)* |
| **Error** | `#DC2626` | `#f87171` | `--color-error` |

### Cómo usar los roles en código

No se agregan nuevas CSS variables por ahora. Se usa el mapeo directo:

```
bg-background       → bg-paper (ya existe)
bg-surface          → bg-card (ya existe) o bg-paper-alt
border-border       → ya existe
border-border-strong → border-ink/25 (ya existe)
text-primary        → text-foreground (ya existe)
text-secondary      → text-muted (ya existe)
text-muted          → text-muted con opacity (ya existe)
```

### Por qué no crear nuevas variables

Las clases semánticas de Tailwind (`bg-background`, `text-foreground`, `border-border`) ya cumplen este rol. El problema actual no es la falta de variables, sino el **uso de clases fijas** (`bg-white`, `text-gray-700`, `border-gray-200`) en vez de las variables. La regla es:

> **Usar siempre `bg-background` / `text-foreground` / `border-border`. Nunca `bg-white` / `text-black` / `border-gray-*`.**

### Excepción: Footer
El footer usa `bg-[#0F0F10]` fijo. Es un contenedor de marca que no debe adaptarse al theme. Se mantiene.

### Decisión: Score colors
**Problema:** `getScoreColor()` retorna `text-green-500`, etc. — colores fijos que no se adaptan a dark mode.

**Solución:** Agregar CSS variables para scores y referenciarlas desde el utility.
```css
--score-excellent: #22C55E;    /* light */
--score-good:      #3B82F6;
--score-neutral:   #EAB308;
--score-poor:      #EF4444;
```
Ya existen en `:root`. El utility `getScoreColor()` debería retornar `text-score-excellent` (o crear clases utilitarias `text-score-excellent`). Alternativa: mantener colores fijos (son semánticos, no de interfaz — verde siempre es verde).

**Decisión:** Mantener colores fijos para scores. Los scores son datos semánticos, no decoración de interfaz. El verde debe ser verde siempre, igual que una gráfica de stock.

---

## 3. Tipografía — Escala cerrada

### Font stack
```
--font-display: 'Archivo Black', sans-serif   → Títulos hero, números signature
--font-sans:    'Inter', sans-serif            → Cuerpo de texto, UI
--font-heading: 'Space Grotesk', sans-serif    → Subtítulos, scores, badges
--font-mono:    'JetBrains Mono', monospace    → Labels, datos técnicos, números
```

### Escala tipográfica

Cada nivel tiene tamaño, peso, altura de línea y tracking fijos. No crear variantes ad hoc.

| Nivel | Tamaño | Peso | Line-Height | Font | Tracking | Uso |
|-------|--------|------|-------------|------|----------|-----|
| **Display** | `--step-8` (4.5rem / 72px) | 400 | 0.85 | `font-display` | `--tracking-tight` (-0.02em) | Hero, número del día, página de error |
| **H1** | `--step-6` (3rem / 48px) | 400 | 0.9 | `font-display` | `--tracking-tight` | Título principal de página |
| **H2** | `--step-5` (2.25rem / 36px) | 400 | 1.0 | `font-display` | `--tracking-tight` | Título de sección |
| **H3** | `--step-4` (1.75rem / 28px) | 600 | 1.1 | `font-heading` | normal | Subtítulo de bloque |
| **H4** | `--step-3` (1.375rem / 22px) | 600 | 1.2 | `font-heading` | normal | Card title, score number |
| **Body Large** | `--step-2` (1.125rem / 18px) | 400 | 1.6 | `font-sans` | normal | Lead, descripción hero |
| **Body** | `--step-1` (1rem / 16px) | 400 | 1.6 | `font-sans` | normal | Párrafos, UI general |
| **Caption** | 0.875rem (14px) | 400 | 1.5 | `font-sans` | normal | Texto secundario, metadata |
| **Overline** | 0.7rem (11px) | 600 | 1.0 | `font-mono` | 0.3em | Eyebrow, label-micro, breadcrumbs |

### Reglas de uso por font

```
font-display → Niveles Display, H1, H2 solamente. NUNCA en párrafos o labels.
               Siempre uppercase. Solo Archivo Black.

font-heading → Niveles H3, H4, scores, badges. Uppercase o sentence según contexto.
               Space Grotesk semibold.

font-sans    → Body Large, Body, Caption. Default del body. Inter regular.

font-mono    → Overline exclusivamente. JetBrains Mono semibold.
               Texto pequeño (0.625rem - 0.75rem) con tracking ancho.
```

### Mapa de los niveles actuales a la nueva escala

| Uso actual | Clase Tailwind actual | Nivel nuevo | Clase nueva |
|-----------|----------------------|-------------|-------------|
| Hero title | `font-display text-5xl sm:text-6xl lg:text-7xl` | Display | `font-display text-[length:var(--step-8)]` |
| Page title | `font-display text-4xl sm:text-5xl lg:text-6xl` | H1 | `font-display text-[length:var(--step-6)]` |
| Section title | `font-display text-3xl sm:text-4xl` | H2 | `font-display text-[length:var(--step-5)]` |
| Card title | `font-heading text-2xl` | H3 | `font-heading text-[length:var(--step-4)]` |
| Score number | `font-heading text-2xl font-bold` | H4 | `font-heading text-[length:var(--step-3)] font-bold` |
| Body text | `text-base text-muted` | Body | `text-[length:var(--step-1)]` |
| Small text | `text-xs text-muted` | Caption | `text-sm` |
| Eyebrow | `eyebrow-brutalist` | Overline | Clase ya existe |

### Lo que NO se hace
- No usar `font-serif` (eliminado en auditoría — no hay font cargada).
- No usar `text-[*]` inline con valores arbitrarios para tipografía.
- No cambiar weight/line-height/tracking por componente — usar los niveles definidos.
- No agregar niveles intermedios entre Display y 5xl (no existen).

---

## 4. Espaciado — Escala fija

| Token | Px | Rem | Tailwind |
|-------|----|-----|----------|
| `--space-xs`  | 8px  | 0.5rem  | `p-2` |
| `--space-sm`  | 12px | 0.75rem | `p-3` |
| `--space-md`  | 16px | 1rem    | `p-4` |
| `--space-lg`  | 24px | 1.5rem  | `p-6` |
| `--space-xl`  | 32px | 2rem    | `p-8` |
| `--space-2xl` | 48px | 3rem    | `p-12` |
| `--space-3xl` | 64px | 4rem    | `p-16` |
| `--space-4xl` | 96px | 6rem    | `p-24` |
| `--space-5xl` | 128px| 8rem    | `p-32` |

No introducir valores intermedios salvo necesidad justificada.

### Container único (usa la escala)
```
Current:  px-5 sm:px-8 lg:px-12   → 20px / 32px / 48px  (px-5 = 20px NO está en escala)
Proposed: px-4 sm:px-8 lg:px-12   → 16px / 32px / 48px  (todos en escala ✓)
```

### cellPad (usa la escala)
```
Current:  p-8 sm:p-10 lg:p-14     → 32px / 40px / 56px  (p-10, p-14 NO están en escala)
Proposed: p-8 lg:p-12             → 32px / 48px         (todos en escala ✓)
```

### Section spacing (usa la escala)
```
Current:  pt-16 sm:pt-20 pb-28     → 64px / 80px / 112px  (pt-20, pb-28 NO están en escala)
Proposed: pt-16 lg:pt-24 pb-24     → 64px / 96px / 96px   (todos en escala ✓)
```

### Card padding
```
Current:  p-5  → 20px  (NO en escala)
Proposed: p-6  → 24px  (scale: lg)
```

### Valores actuales que violan la escala
| Valor | Uso actual | Reemplazo propuesto |
|-------|-----------|---------------------|
| `px-5` (20px) | Container mobile (77x) | `px-4` (16px = md) |
| `p-5` (20px) | Card padding (72x) | `p-6` (24px = lg) |
| `p-10` (40px) | cellPad sm (29x) | `p-8` (32px = xl) o `p-12` (48px = 2xl) |
| `p-14` (56px) | cellPad lg (23x) | `p-12` (48px = 2xl) |
| `sm:p-10` (40px) | cellPad tablet (29x) | Eliminar, unificar con `p-8` |
| `lg:p-14` (56px) | cellPad desktop (23x) | `lg:p-12` (48px = 2xl) |
| `py-20` (80px) | Section spacing (8x) | `py-24` (96px = 4xl) o `py-16` (64px = 3xl) |
| `pt-20` (80px) | Section top (8x) | `pt-24` (96px = 4xl) |
| `pb-28` (112px) | Main bottom (10x) | `pb-24` (96px = 4xl) |
| `py-10` (40px) | Internal spacing (8x) | `py-8` (32px = xl) o `py-12` (48px = 2xl) |
| `sm:py-20` (80px) | Section tablet | `sm:py-24` (96px = 4xl) |

### Excepciones justificadas
- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px) — gaps de grid/flex. Los gaps son orientación, no espaciado de contenido. Se mantienen.
- `p-2` (8px), `py-1` (4px), `px-2` (8px), `px-3` (12px) — padding interno de badges, tags, labels. Micro-espaciado justificado por densidad de UI.
- `px-0` — reset.
- `p-0` — reset.

## 4a. Contenedores — Sistema único

Cada página usa UNO de estos contenedores. No mezclar.

### Contenedor principal (default)
```
max-w-8xl px-4 sm:px-8 lg:px-12
```
Aplica a: todas las páginas. `px-4` en mobile (16px = scale: md).

**Excepciones justificadas:**
- Onboarding: `max-w-xl` (480-560px — formulario angosto).
- Perfil público `/perfil/[hash]`: contenido angosto.
- Artículos / texto largo: `max-w-2xl` (680-760px — lectura cómoda).

### Cards informativas
Ancho: 320-420px. Se logra con `max-w-sm` (384px) en el card individual, no en el contenedor de página.

### Reglas
- Toda página envuelve su contenido en `<main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">`.
- El padding del main es siempre `pt-16 lg:pt-24 pb-24`.
- No usar `max-w-7xl`, `max-w-5xl`, `max-w-4xl`, `max-w-3xl` para contenido principal.
- No usar `px-5`, `px-6`, `px-10` (violan la escala de espaciado).

### Padding de celdas
```
cellPad: p-8 sm:p-10 lg:p-14
```
Aplica a: celdas de grid editorial, bloques de contenido en hero, sections.

### Padding de cards
```
card-sm: p-5
card-md: p-6    → valor por defecto
card-lg: p-8
```

### Section spacing
```
section: py-16 sm:py-20
section-lg: py-20 sm:py-24
```
`--section-padding: 10rem` es demasiado grande (160px). Usar valores Tailwind.

---

## 5. Bordes y radios — Reducir variedad

Cada tipo de componente tiene **un solo radio**. No hay variantes por contexto.

| Componente | Radio | Clase | Excepción |
|-----------|-------|-------|-----------|
| Botones (CTA) | Completo | `rounded-full` | Solo `<Button>`. No aplica a `btn-*`. |
| Inputs | Cero | `rounded-none` | Sin excepción. |
| Cards | Cero | `rounded-none` | Sin excepción. |
| Modales | Cero | `rounded-none` | Sin excepción. |
| Badges | Cero | `rounded-none` | Sin excepción. |
| Tooltips | Cero | `rounded-none` | Sin excepción. |
| Dropdowns | Cero | `rounded-none` | Sin excepción. |
| Spinners | Completo | `rounded-full` | Elemento decorativo circular. |

### Reglas de border-width
```
Tipo              | Width | Color
------------------|-------|----------------------
Default           | 1px   | var(--color-border)
Layout grid       | 1px   | var(--color-ink/10)
Hover card        | 1px   | var(--color-accent)
Focus input       | 2px   | var(--color-accent)
Focus-visible     | 2px   | var(--color-accent) + offset 2px
Disabled          | 1px   | var(--color-border) (sin cambio)
Error             | 1px   | var(--color-error)
```

### Reglas de border-style
- `solid` siempre. Nunca dashed, dotted, double.
- Excepción: empty state puede usar `border-dashed` para distinguir visualmente (único caso).

---

## 6. Sombras y elevación — Tres niveles

No hay sombras CSS (`--shadow-*: none`). La elevación se construye con bordes + fondo + translateY.

| Nivel | Técnica | Uso |
|-------|---------|-----|
| **Base** | `border border-border bg-background` | Superficies planas, formularios, inputs |
| **Elevada** | `border border-border bg-card hover:border-accent hover:-translate-y-[2px]` | Cards, resultados, items clickables |
| **Modal** | `border border-ink/10 bg-background` + overlay `bg-ink/50` | Diálogos, confirmaciones, modales |

### Equivalente visual

| Nivel | Se parece a | Pero se hace con |
|-------|------------|-----------------|
| Base | Sin sombra | Borde + bg plano |
| Elevada | Sombrá suave (box-shadow sm) | Borde + bg alternativo + translate |
| Modal | Sombrá grande (box-shadow lg) | Overlay semitransparente + tarjeta |

### Qué NO se usa
- `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` — no existen en el sistema.
- `drop-shadow` — no usar.
- `backdrop-blur` — solo en header (scroll) y premium gate (overlay fijo).

---

## 7. Componentes base — Especificaciones

Cada componente tiene tamaño, espaciado, estados y comportamiento definidos. No crear variantes ad hoc.

---

### 7.1 Botón (`<Button>`)

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-full` (único elemento con radio en el sistema) |
| Font | `font-mono`, 0.75rem (12px), 600 weight, 0.15em tracking, uppercase |
| Min-height | sm: 40px / md: 44px / lg: 52px |
| Padding horizontal | sm: `px-4` / md: `px-6` / lg: `px-8` |

**Variantes:**

| Variante | Normal | Hover | Disabled |
|----------|--------|-------|----------|
| `primary` | `bg-ink text-paper` | `bg-accent text-accent-foreground` | `opacity-50 cursor-not-allowed` |
| `secondary` | `bg-transparent text-muted border border-border` | `border-accent text-accent` | `opacity-50 cursor-not-allowed` |
| `ghost` | `bg-transparent text-muted` | `text-foreground bg-ink/[0.03]` | `opacity-50 cursor-not-allowed` |

**Estados:**
- **Focus-visible:** `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`
- **Active/Tap:** `scale-95` (framer-motion whileTap)
- **Loading:** Spinner + texto "Cargando..." + disabled automático (PENDIENTE de implementar)
- **Disabled:** `opacity-50`, `cursor-not-allowed`, sin hover

**Uso:** CTAs en cards, forms, modals, navegación primaria.
**NO usar inline:** Todo botón usa `<Button>` o clase `btn-*`.

---

### 7.2 Botón editorial (`btn-*`)

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Font | `font-mono`, 0.875rem (14px), 600 weight, 0.05em tracking, uppercase |
| Min-height | 44px |
| Padding | `px-6 py-3` |

| Clase | Normal | Hover | Disabled |
|-------|--------|-------|----------|
| `.btn` (base) | — | `opacity-90` | `opacity-60 cursor-not-allowed` |
| `.btn-accent` | `bg-accent text-accent-foreground` | `opacity-90` | `opacity-50 cursor-not-allowed` |
| `.btn-primary` | `bg-ink text-paper` | `bg-accent text-accent-foreground` | `opacity-50 cursor-not-allowed` |
| `.btn-ghost` | `bg-transparent text-muted px-3 py-2` | `text-foreground bg-ink/[0.03]` | `opacity-50 cursor-not-allowed` |

**Uso:** CTAs en secciones editoriales (hero, banners, CTA final, stats).
**No mezclar:** Una página no mezcla `<Button>` con `btn-*` en el mismo contexto. Elegir uno.

---

### 7.3 Card

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-card)` |
| Border | `1px solid var(--color-border)` |
| Padding | `sm: p-6` / `md: p-6` (default, alias) / `lg: p-8` |
| Elevación | Base (si hover=false) o Elevada (si hover=true) |

**Estados:**
- **Hover (si hover=true):** `border-color: var(--color-accent)`, `translateY(-2px)`
- **Focus-visible:** `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`

**Uso:** Resultados, items de lista, contenido agrupado.
**NO usar inline:** `border border-border bg-card` se reemplaza por `<Card>`.

---

### 7.4 Input de formulario

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-card)` o `var(--color-background)` |
| Border | `1px solid var(--color-border)` |
| Font | `font-sans`, 0.95rem |
| Padding | `px-4 py-3` |
| Min-height | 44px |
| Placeholder | `var(--color-muted)` |

**Estados:**
- **Hover:** `border-color: var(--color-ink-alpha-25)`
- **Focus:** `border-color: var(--color-accent)`, `box-shadow: 0 0 0 3px rgba(30, 58, 255, 0.18)`, `background: var(--color-card)`
- **Disabled:** `opacity-50`, `cursor-not-allowed`
- **Error:** `border-color: var(--color-error)`, `box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15)`
- **Success:** `border-color: var(--color-success)`, `box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15)`

**Uso:** Formularios, búsqueda, date input.
**DateInput específico:** Los campos DD/MM/AAAA usan `font-heading text-3xl sm:text-4xl` con separadores `/` en `text-muted-foreground/40`.

---

### 7.5 Etiqueta / Label

| Propiedad | Valor |
|-----------|-------|
| Font | `var(--font-mono)` |
| Size | 0.625rem (10px) |
| Weight | 500 |
| Letter-spacing | 0.25em |
| Transform | uppercase |
| Color | `var(--color-muted)` |

**Clase existente:** `.label-micro`
**Uso:** Sobre títulos, metadata, timestamps, breadcrumbs.

---

### 7.6 Eyebrow / Overline

| Propiedad | Valor |
|-----------|-------|
| Font | `var(--font-mono)` |
| Size | 0.7rem (11px) |
| Weight | 600 |
| Letter-spacing | 0.3em |
| Transform | uppercase |
| Color | `var(--color-accent)` |

**Clase existente:** `.eyebrow-brutalist`
**Uso:** Encabezado de sección, indicador de sistema (ej: "ENERGÍA DIARIA", "AFINIDAD PERSONAL").

---

### 7.7 Badge

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Font | `font-heading`, 0.7rem (11px), 600 weight, 0.15em tracking, uppercase |
| Padding | `px-4 py-1.5` |
| Color default | `bg-accent text-accent-foreground` |
| Color success | `bg-success text-success-foreground` |

**Uso:** Tags de categoría, scores, indicadores de estado.
**No implementado como componente:** Usar clases directamente hasta que se cree `<Badge>`.

---

### 7.8 Chips / Filter tag

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Font | `font-mono`, 0.625rem (10px), 500 weight, 0.15em tracking, uppercase |
| Padding | `px-3 py-1.5` |
| Background | `bg-background` o `bg-accent/10` si activo |
| Border | `1px solid var(--color-border)` |

**Estados:**
- **Default:** `text-muted`, `border-border`
- **Active:** `text-accent`, `border-accent`, `bg-accent/10`
- **Hover:** `border-accent/50`

**Uso:** Filtros de búsqueda, categorías seleccionables.

---

### 7.9 Modal / Dialog

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-background)` |
| Border | `1px solid var(--color-ink/10)` |
| Padding | `p-8 sm:p-10` |
| Max-width | `max-w-sm` (384px) |
| Overlay | `bg-ink/50` (semipartalla) |
| Elevación | Modal (overlay + tarjeta) |

**Comportamiento:**
- Focus trap dentro del modal (ya implementado en header confirm dialog).
- Escape cierra el modal.
- Click fuera del modal lo cierra.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` requeridos.

**Uso:** Confirmaciones, alertas, formularios cortos.

---

### 7.10 Tooltip

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-ink)` |
| Color texto | `var(--color-paper)` |
| Font | `font-sans`, 0.75rem (12px) |
| Padding | `px-3 py-1.5` |
| Trigger | Hover o focus |

**Nota:** No hay implementación actual de tooltips en el código. Implementar con CSS nativo o librería liviana.

---

### 7.11 Dropdown / Select

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-card)` |
| Border | `1px solid var(--color-border)` |
| Font | `font-sans`, 0.95rem |
| Padding | `px-4 py-3` |
| Min-height | 44px |
| Icon | Chevron down (CSS o SVG) |

**Estados:** Mismos que input.
**Nota:** Usar `<select>` nativo con estilo consistente o implementar custom dropdown.

---

### 7.12 Date Input

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-card)` |
| Border | `1px solid var(--color-border)` |
| Font campos | `font-heading`, `text-3xl sm:text-4xl`, semibold |
| Separadores | `/` en `text-muted-foreground/40` |
| Labels | `.label-micro` centrados debajo |
| Focus | `focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10` |

**Comportamiento:**
- Auto-advance al completar DD → MM → AAAA.
- Backspace retrocede entre campos.
- Validación de rango en tiempo real (días por mes, año ≥ 1900, fecha < hoy).
- `inputMode="numeric"`, `pattern="\d*"`.

**Uso exclusivo:** Onboarding.

---

### 7.13 Empty State

| Propiedad | Valor |
|-----------|-------|
| Alineación | Centrado |
| Padding | `py-12 px-4` |
| Icono | SVG info circle, 24x24, `text-muted`, dentro de círculo `bg-background border border-border` |
| Título | `font-heading text-lg font-semibold text-foreground` |
| Descripción | `text-sm text-muted`, max-w-sm |
| CTA | `<Button variant="secondary">` (opcional) |

**Uso:** Reemplazar todos los empty states inline (explore, affinity, etc.).
**Estado actual:** Componente existe pero no se usa. Integrar en Fase 3.

---

### 7.14 Skeleton / Loading

| Propiedad | Valor |
|-----------|-------|
| Background | `var(--skeleton)` |
| Animación | Pulse (opacity 1 → 0.5 → 1) |
| Radio | `rounded-none` |

**Variantes existentes:**
- `SkeletonCard`: Card placeholder con 3 líneas.
- `SkeletonSection`: Sección completa placeholder.
- `SkeletonCardGrid`: Grid de cards placeholder.

**LoadingState:**
- Spinner: `border-2 border-border border-t-accent`, `rounded-full`, `animate-spin`
- Mensaje: `text-sm text-muted` con `role="status"`
- `fullScreen`: `min-h-screen flex` centrado

**Uso:** `LoadingState` para estados de carga genéricos. `Skeleton` para contenido con estructura predecible (profile, daily-energy).

---

### 7.15 Mensaje de error

| Propiedad | Valor |
|-----------|-------|
| Background | `transparent` o `var(--color-error)` si es banner |
| Color texto | `var(--color-error)` |
| Font | `font-sans`, 0.875rem (14px) |
| Icono | Opcional, SVG alert circle |

**Contextos:**
- **Inline error:** Texto rojo debajo del input, `text-sm text-error`
- **Banner error:** Barra completa con `bg-error text-error-foreground px-4 py-3`
- **Full-screen error:** `AppErrorBoundary` con mensaje + "Volver al inicio"
- **Error de cálculo:** Fallback UI con CTA "Intentar de nuevo"

**Regla:** Nunca mostrar errores técnicos (stack traces, error codes) al usuario. Usar mensajes en español claros.

---

### 7.16 Breadcrumbs (nuevo)

| Propiedad | Valor |
|-----------|-------|
| Font | `.label-micro` (font-mono, 0.625rem, uppercase, tracking) |
| Separador | `›` en `text-muted` |
| Color link | `text-muted hover:text-foreground` |
| Color actual | `text-foreground font-medium` (sin link) |
| Padding | `mb-6` |

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

**Uso:** Todas las rutas con profundidad > 2. No usar en homepage.

---

### 7.17 CTA / Banner promocional

| Propiedad | Valor |
|-----------|-------|
| Background | `var(--color-accent)` (`.accent-block`) |
| Padding | `py-16 sm:py-20 px-8 sm:px-12 lg:px-16` |
| Título | `font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9]` |
| Subtítulo | `text-sm sm:text-base text-white/70` |
| Botón | `.btn bg-white text-accent hover:bg-white/90` |

**Uso:** CTA final en home, secciones de conversión. Un solo banner por página.

---

## 8. Layout grid

### Grid editorial (separadores de 1px)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
  {items.map(item => (
    <div key={item.id} className="bg-background p-8 lg:p-12">
      ...
    </div>
  ))}
</div>
```

### Grillas responsive estándar
```
1 col:  mobile default
2 cols: sm:grid-cols-2  (640px)
3 cols: lg:grid-cols-3  (1024px)
4 cols: lg:grid-cols-4  (scores, stats, áreas)
```

### Columnas asimétricas (hero)
```tsx
<div className="flex flex-wrap">
  <div className="w-full lg:w-3/5 p-8 lg:p-12 lg:border-r border-ink/10">...</div>
  <div className="w-full lg:w-2/5 p-8 lg:p-12">...</div>
</div>
```

### Reglas
- Gap siempre `gap-px` con `bg-ink/10` como separador visible.
- No usar `gap-2`, `gap-4`, `gap-6` en grids editoriales (usan el separador de 1px).
- Usar `gap-*` solo en flex layouts (botones, badges, iconos + texto).

---

## 9. Animaciones — Motion tokens

Definidos en `lib/utils/motion.ts`. Usar estos, no crear variants inline.

| Token | Uso |
|-------|-----|
| `fadeUp` | Secciones al hacer scroll. Default. |
| `fadeUpDelayed(delay)` | Stagger manual entre secciones. |
| `staggerContainer` + `staggerItem` | Listas y grids. Stagger 0.08s. |
| `pageEnter` | Transición de ruta (opacity + y). |
| `scaleUp` | Números, badges (scale 0.95 → 1). |
| `numberReveal` | Números grandes (scale 0.8 → 1, spring). |
| `hoverLift` | Cards (`y: -4` en hover). |
| `hoverScale` | Botones (`scale: 1.02` en hover, 0.98 en tap). |

### Reglas
- `viewport: { once: true }` siempre — no repetir animaciones.
- Duración: 0.3s - 0.5s. Nada más lento.
- Sin animaciones decorativas (solo las que refuerzan contenido o navegación).
- Respetar `prefers-reduced-motion: reduce` (ya implementado).
- **No** usar `initial={{...}} animate={{...}}` inline — usar los tokens.

---

## 10. Navegación

### Header
- **Active state:** `pathname.startsWith(link.href)` para cubrir sub-rutas.
  - Excepción: `/` solo match exacto para no marcar todo como activo.
- **HOY y MI MAPA:** Mismo active state que nav links (actualmente siempre `text-muted`).
- **CTA mobile:** Unificar con desktop (ambos usan `btn-accent` o `bg-accent text-white`).
- **Skip link:** Agregar elemento visible con `.skip-link` (CSS existe, HTML no).

### Footer
- Fondo fijo `bg-[#0F0F10]` (no se adapta a theme).
- Texto siempre claro sobre fondo oscuro.
- Sin cambios con theme.

---

## 11. Decisiones que afectan a todo el sistema

| Decisión | Efecto |
|----------|--------|
| Border-radius: 0 (excepto Button) | Cards, inputs, modals, badges → `rounded-none`. Solo `<Button>` mantiene `rounded-full`. |
| Button system dual | `<Button>` para CTAs en cards/forms/modals. `btn-*` para CTAs editoriales. NO mezclar en misma página. |
| Footer fijo oscuro | `bg-[#0F0F10]` siempre. No se adapta a dark mode. |
| Score colors fijos | `text-green-500` etc. no cambian con theme (datos semánticos). |
| Sin sombras CSS | Elevación con bordes + bg alternativo + translateY. `shadow-*` no existen. |
| Container único | `max-w-8xl px-4 sm:px-8 lg:px-12`. Excepciones: onboarding (max-w-xl), artículos (max-w-2xl). |
| `font-heading` reemplaza `font-serif` | Todas las instancias migradas. No hay font serif cargada. |
| Escala de espaciado fija | 9 tokens (xs→5xl). No usar valores intermedios sin justificación. |
| Escala tipográfica cerrada | 9 niveles con tamaño, peso, lh, font, tracking fijos. No crear variantes ad hoc. |
| Paleta por roles | Usar siempre `bg-background`/`text-foreground`/`border-border`. Nunca `bg-white`/`text-black`/`border-gray-*`. |
| Elevación 3 niveles | Base / Elevada / Modal. Cada uno con técnica específica. |

---

## 12. Pendientes para implementación (Fase 3)

### Spacing — Corregir valores fuera de escala
1. Container: `px-5` → `px-4` en todas las páginas (77 ocurrencias).
2. Card padding: `p-5` → `p-6` (72 ocurrencias).
3. cellPad: `p-8 sm:p-10 lg:p-14` → `p-8 lg:p-12` (29/23 ocurrencias).
4. Section spacing: `py-20` → `py-24` o `py-16`, `pb-28` → `pb-24`.
5. Onboarding: `px-4 sm:px-6` → `px-4 sm:px-8 lg:px-12` (estandarizar con el resto).

### Componentes
6. Agregar `loading` prop a `<Button>` con spinner + disabled automático.
7. Migrar 20+ botones inline al componente `<Button>` o a `btn-*`.
8. Migrar uso inline de cards (`border border-border bg-card`) al componente `<Card>`.
9. Crear componente `<Breadcrumbs>` e integrar en rutas con profundidad > 2.
10. Integrar `<EmptyState>` en páginas que lo necesitan (explore, affinity, etc.).
11. Agregar skeleton loading para profile y daily-energy.

### Header y navegación
12. Agregar `pathname.startsWith()` para active state en sub-rutas.
13. Agregar active state visual para HOY y MI MAPA.
14. Agregar skip link al header (CSS existe, HTML no).
15. Unificar estilo CTA mobile/desktop.

### Limpieza
16. Decidir si mantener `DatePicker` + `ScrollDatePicker` o eliminarlos.
17. Migrar `getScoreColor` inline en pages a `lib/utils/score.ts`.
18. Eliminar `EmptyState.tsx` si no se integra (decisión: integrarlo).
