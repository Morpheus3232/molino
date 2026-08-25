# Molino — Fase 4: Layout Global y Sistema de Composición

Con la arquitectura validada, esta fase define el lenguaje visual consistente para toda la aplicación. No modifica contenido; define cómo se organiza en pantalla.

---

## 4.1 Grid principal

### Sistema elegido

Un grid de **12 columnas** con gutter de **1px** (separador visible) para grids editoriales, y **gap estándar** para layouts internos.

### Definición oficial

| Propiedad | Valor |
|-----------|-------|
| Columnas | 12 |
| Gutter editorial | `gap-px` con `bg-ink/10` como separador visual |
| Gutter interno | `gap-4` (16px) para flex layouts |
| Ancho máximo | `max-w-8xl` (1280px) |
| Padding lateral mobile | `px-4` (16px) |
| Padding lateral sm | `px-8` (32px) |
| Padding lateral lg | `px-12` (48px) |
| Breakpoint sm | 640px |
| Breakpoint lg | 1024px |
| Breakpoint xl | 1280px |

### Grid editorial (12 cols)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
  <div className="bg-background">...</div>
  <div className="bg-background">...</div>
  <div className="bg-background">...</div>
</div>
```

### Columnas responsive

| Breakpoint | Columnas | Uso |
|------------|----------|-----|
| Mobile | 1 col | Todo apilado |
| sm (640px) | 2 cols | Cards, estadísticas |
| lg (1024px) | 3 cols | Grid editorial estándar |
| xl (1280px) | 4 cols | Scores, stats, grids densos |

### Columnas asimétricas

Para hero y secciones principales con énfasis visual desigual:

```tsx
<div className="flex flex-wrap">
  <div className="w-full lg:w-3/5">...</div>
  <div className="w-full lg:w-2/5">...</div>
</div>
```

### Reglas

- Usar `gap-px` + `bg-ink/10` para grids editoriales (1px separator)
- Usar `gap-4` para flex layouts internos (botones, badges, iconos + texto)
- Nunca usar `gap-2`, `gap-6` o valores arbitrarios en grids
- Todas las páginas usan el mismo grid — no inventar variantes

---

## 4.2 Ritmo vertical

### Principio

No todas las secciones deben ocupar el mismo espacio. Alternar ritmos genera tensión visual y mantiene el interés durante el scroll.

### Patrones de ritmo

| Tipo de sección | Altura | Espaciado interno | Cuándo usar |
|-----------------|--------|-------------------|-------------|
| **Hero** | Grande (~80vh min) | `py-16 sm:py-24` | Primera sección, CTAs principales |
| **Informativa** | Media | `py-12 sm:py-16` | Contenido de apoyo, feature descriptions |
| **Compacta** | Pequeña | `py-8 sm:py-10` | Separadores, transiciones entre bloques |
| **CTA block** | Media-alta | `py-16 sm:py-20` | Bloques de conversión con fondo de color |
| **Footer** | Media | `py-16 sm:py-24` | Cierre de página |

### Reglas de ritmo

1. **Alternar alturas** — nunca dos secciones consecutivas de la misma altura
2. **Hero grande → sección compacta → CTA media → sección informativa**
3. **Separadores** — usar `border-t border-ink/10` entre secciones para crear aire visual sin espaciado extra
4. **CTAs como puntos de ruptura** — un CTA block rompe el ritmo y da energía al scroll
5. **Evitar bloques idénticos** — si dos secciones tienen la misma estructura visual, reestructurar una

### Secuencia recomendada (Home)

```
[Hero - grande]
[Separador border]
[Sección informativa - media]
[Separador border]
[CTA block - media-alta]
[Sección compacta - pequeña]
[Grid editorial - media]
[Separador border]
[CTA final - media-alta]
```

### Qué evitar

- Tres secciones consecutivas de la misma altura
- Patrón "card, card, card, card" sin variación
- Secciones que ocupan más de 60vh sin contenido suficiente
- `py-20` arbitrario — usar la escala de tokens

---

## 4.3 Composición editorial

### Principio

Evitar apilar tarjetas una debajo de otra. Alternar composiciones genera ritmo visual.

### Patrones de composición

#### Patrón A: Texto + imagen

```
[  Texto  ] [  Imagen/Visual  ]
```
Izquierda: contenido textual (hasta 50% ancho). Derecha: elemento visual (gráfico, numero, icono).

#### Patrón B: Dos columnas asimétricas

```
[  Contenido principal  ] [  Sidebar/Complemento  ]
```
60/40 o 70/30. La columna principal tiene más peso visual.

#### Patrón C: Tarjeta destacada + secundarias

```
[  Featured Card (w-full)  ]
[  Card  ] [  Card  ] [  Card  ]
```
Una tarjeta grande arriba, 3 o más tarjetas pequeñas abajo.

#### Patrón D: Bloque con peso visual fuerte

```
[  Fondo de color / accent block  ]
[  Título grande + CTA  ]
```
Un bloque con `bg-accent` o `bg-ink` que rompe el flujo blanco.

#### Patrón E: Lista alternada

```
[  Texto  ] [  Visual  ]
[  Visual  ] [  Texto  ]
```
Alterna posición de texto e imagen para crear dinamismo.

### Reglas

1. **Nunca más de 3 tarjetas consecutivas** en el mismo layout sin variación
2. **Alternar A/B** — si una sección usa Patrón A, la siguiente usa Patrón B o D
3. **Un CTA principal por bloque** — no competir por atención
4. **El elemento visual más grande** debe estar a la izquierda en desktop (F-shaped reading)
5. **Usar `gap-px` con `bg-ink/10`** para separar bloques en grids editoriales

### Aplicación al Home actual

**Actual (4 secciones iguales):**
```
[SystemsPreview]
[Journey]
[ToolsAndDiscovery]
[ConceptsIndex]
```

**Propuesto (ritmo alternado):**
```
[SystemsPreview — Patrón D accent block]
[HeroNew-style — Patrón A text+visual]
[Journey — Patrón C featured + cards]
[ConceptsIndex — Patrón B asimétrico]
[FinalCTA — Patrón D accent block]
```

---

## 4.4 Sistema de contenedores

### Contenedores reutilizables

| Nombre | Clase | Ancho | Uso |
|--------|-------|-------|-----|
| **Standard** | `mx-auto max-w-8xl px-4 sm:px-8 lg:px-12` | 1280px | Páginas principales, secciones de contenido |
| **Narrow (lectura)** | `mx-auto max-w-2xl px-4 sm:px-8 lg:px-12` | 736px | Artículos, guías, texto largo |
| **Wide (hero)** | `mx-auto max-w-8xl px-4 sm:px-8 lg:px-12` | 1280px | Héroes, banners editoriales, secciones destacadas |
| **Form** | `mx-auto max-w-xl px-4 sm:px-8 lg:px-12` | 544px | Onboarding, formularios, inputs |
| **Card** | `mx-auto max-w-sm px-4` | 384px | Cards individuales, modales |
| **Full** | `w-full` sin max-width | Fluid | Héroes de pantalla completa, banners |

### Cómo elegir

```
¿Es una página completa? → Standard (max-w-8xl)
¿Es texto largo/Artículo? → Narrow (max-w-2xl)
¿Es un hero/banner? → Wide (max-w-8xl con padding diferente)
¿Es un formulario? → Form (max-w-xl)
¿Es una card individual? → Card (max-w-sm)
¿Es pantalla completa? → Full (w-full)
```

### Reglas

- Cada sección elige UN contenedor de la lista
- No crear anchos propios (`max-w-[500px]`, etc.)
- Si el contenido no cabe en Ninguno, usar Standard como default
- Todos los contenedores usan `mx-auto` para centrar

### Padding de contenedores

```
Standard:  px-4 sm:px-8 lg:px-12
Form:     px-4 sm:px-6
Narrow:   px-4 sm:px-8
Wide:     px-4 sm:px-8 lg:px-12 (igual que Standard)
```

El padding `lg:px-12` se usa en pantallas de escritorio para dar más aire al contenido. No se usa en mobile ni tablet.

---

## 4.5 Header

### Especificaciones

| Propiedad | Valor |
|-----------|-------|
| Altura | `h-16` (64px) |
| Posición | `fixed top-0 left-0 right-0` |
| Z-index | `z-50` |
| Scroll behavior | Al hacer scroll > 50px: `bg-background/90 backdrop-blur-sm border-b border-ink/10`. Sin scroll: `bg-transparent` |
| Padding lateral | `px-4 sm:px-8 lg:px-12` (match del contenedor) |
| Logo | 32x32 (`w-8 h-8`), SVG Molino, borde `border-ink/10` |
| Nav links | 3-4 máximo (INICIO, CONOCIMIENTO, + contextuales) |
| CTA | "DESCUBRIR MI MAPA" (sin profile) o "NUEVO PERFIL" (con profile) |

### Desktop (lg+)

```
[Logo] [INICIO] [CONOCIMIENTO] (+ dropdown "MÁS") [HOY] [MI MAPA] [CTA] [Theme] [☰ menu]
```

- Nav links: `text-xs font-mono font-semibold tracking-[0.15em] uppercase`
- Active state: `text-accent` (actual: `text-foreground` → debería ser `text-accent`)
- Gap entre links: `gap-8`

### Mobile (< lg)

```
[Logo] [Theme] [☰]
```

- Menú hamburguesa despliega navegación completa
- CTA siempre visible como botón fijo en el menú móvil
- `aria-expanded` y `aria-controls` en el toggle

### Estados del header

| Estado | Background | Backdrop | Border |
|--------|------------|----------|--------|
| Scroll = 0 | `bg-transparent` | Ninguno | Ninguno |
| Scroll > 50px | `bg-background/90` | `backdrop-blur-sm` | `border-b border-ink/10` |

### Comportamiento en móvil

- Menú se despliega con `animate={{ opacity: 1, height: "auto" }}`
- Cierra al navegar o al presionar Escape
- Overlay `bg-ink/50` al abrir (opcional)
- CTA "DESCUBRIR MI MAPA" visible siempre en el menú

### Mejoras pendientes

1. Agregar `pathname.startsWith()` para sub-rutas activas
2. Agregar `aria-current` a HOY, MI MAPA, INICIO
3. Unificar estilo CTA header (ya hecho en Fase 3)
4. Dropdown "MÁS" con enlaces secundarios (BIBLIOTECA, FILOSOFÍA, GUÍA, HERAMIENTAS)

---

## 4.6 Footer

### Especificaciones

| Propiedad | Valor |
|-----------|-------|
| Fondo | `bg-[#0F0F10]` (fijo, no cambia con theme) |
| Color texto | `text-white` / `text-white/60` / `text-white/40` |
| Padding | `py-16 sm:py-24 px-4 sm:px-8 lg:px-12` |
| Max-width | `max-w-8xl mx-auto` |
| Grid | `grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-0` |

### Estructura

```
Columna 1 (md:col-span-5): Logo + nombre + tagline
Columna 2 (md:col-span-3): EXPLORAR — 4-5 links
Columna 3 (md:col-span-2): PRINCIPIOS — 4-5 links
Columna 4 (md:col-span-2): EXTRA (redes, legal, GitHub)
```

### Reglas

- El footer NO se adapta al theme — siempre oscuro
- Links en footer: `text-sm text-white/80 hover:text-white`
- Títulos de columna: `font-mono text-xs font-semibold tracking-[0.2em] text-white/50 uppercase`
- Tagline: máximo 2 líneas, `text-sm text-white/60`
- El footer debe sentirse como el cierre natural de la página, no como un bloque aislado
- Agregar una línea divisoria `border-t border-white/10` entre main y footer

### Mejoras pendientes

1. Agregar línea divisoria visual entre main y footer
2. Agregar enlace a GitHub solo si aplica como "Código abierto"
3. Posicionar el CTA "Crear mi perfil" en la columna EXPLORAR para usuarios sin perfil
4. Agregar "VOLVER ARRIBA" como link al inicio del hero

---

## 4.7 Fondos y capas

### Sistema de capas

| Capa | Token/Clase | Uso |
|------|-------------|-----|
| **Base** | `bg-background` (blanco claro) | Fondo global de todo el sitio |
| **Surface** | `bg-card` | Tarjetas, inputs, paneles |
| **Surface elevated** | `bg-card` + border | Cards hover, elementos interactivos |
| **Accent block** | `bg-accent text-white` | CTAs finales, banners de conversión |
| **Ink block** | `bg-ink text-white` | Contraste alto, secciones destacadas |
| **Overlay** | `bg-ink/50` | Modales, menus overlay |
| **Divider** | `border-t border-ink/10` | Separador entre secciones |

### Reglas de fondo

1. **El fondo base siempre es `bg-background`** — blanco claro en light, negro profundo en dark
2. **No cambiar el fondo arbitrariamente** — cada fondo debe tener una razón semántica (surface = tarjeta, accent = CTA, ink = contraste)
3. **Las secciones alternan entre `bg-background` y `bg-card`** para crear ritmo sin cambiar el fondo global
4. **El footer siempre es `bg-[#0F0F10]`** — fijo, tema-independiente
5. **Los overlays siempre son `bg-ink/50`** — fijo, no se adapta a theme
6. **`bg-ink/[0.02]`** para hover sutil en elementos interactivos

### Secuencia de fondos recomendada (Home)

```
[bg-background]  Hero
[bg-background]  Sección informativa con border-t separador
[bg-card]        Características en grid
[bg-background]  CTA block con bg-accent
[bg-background]  Sección compacta
[bg-card]        Grid de contenido
[bg-background]  CTA final con bg-accent
[bg-[#0F0F10]]  Footer
```

### Divisores

| Tipo | Uso | Clase |
|------|-----|-------|
| Separador sección | Entre bloques de contenido | `border-t border-ink/10` |
| Separador grid | Entre celdas de grid editorial | `gap-px` con `bg-ink/10` |
| Separador footer | Entre main y footer | `border-t border-white/10` |
| Separador mobile | Entro elementos en nav | `hr className="border-ink/10"` |

---

## 4.8 Sistema de tarjetas

### Especificaciones base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `bg-card` |
| Border | `1px solid var(--color-border)` |
| Padding | `sm: p-6` / `md: p-6` (default) / `lg: p-8` |
| Gap entre cards | `gap-4` o `gap-px` (grid editorial) |

### Estados

| Estado | Cómo |
|--------|------|
| Default | `bg-card border-border` |
| Hover | `hover:border-accent hover:-translate-y-[2px]` |
| Active/Tap | Escala `scale-[0.98]` |
| Focus-visible | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` |
| Disabled | `opacity-50 pointer-events-none` |

### Variante: Featured card

Para la tarjeta destacada en un grupo:

```tsx
<div className="bg-card border border-border p-8 lg:p-10 hover:border-accent hover:-translate-y-[2px] transition-all">
  {/* Contenido destacado */}
</div>
```

### Variante: Card con icono

```tsx
<div className="bg-card border border-border p-8 lg:p-10">
  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-6">
    <Icon className="w-6 h-6 text-accent" />
  </div>
  <h3 className="font-heading text-xl font-semibold mb-3">...</h3>
  <p className="text-sm text-muted leading-relaxed">...</p>
</div>
```

### Jerarquía interna de la tarjeta

```
[Icon/Visual opcional]  (espaciado: mb-6)
Título                  (font-heading, text-xl, semibold, mb-3)
Descripción             (text-sm text-muted, leading-relaxed)
CTA opcional            (text-xs, mt-6)
```

### Reglas de tarjeta

1. **Una tarjeta = un foco principal.** El título es el foco, la descripción es complemento.
2. **No poner un CTA secundario en cada tarjeta** — máximo uno por tarjeta.
3. **Iconos solo si aportan significado** — no decorativos.
4. **Todas las tarjetas en un grupo deben tener el mismo padding** (no mezclar p-6 y p-8).
5. **Grid editorial** usa `gap-px` con separador — no `gap-4`.
6. **Grid interno** (botones, badges) usa `gap-4`.

---

## 4.9 Hero Framework

### Plantilla común

```
┌─────────────────────────────────────────────┐
│  [Eyebrow: label micro, uppercase]          │
│                                             │
│  Título (font-display, 4xl-6xl)             │
│                                             │
│  Subtítulo (text-sm, text-muted, max-w-md) │
│                                             │
│  [CTA PRIMARY]  [CTA secundario opcional]   │
│                                             │
│  [Elemento visual: número, ilustración]     │
└─────────────────────────────────────────────┘
```

### Propiedades del hero

| Elemento | Especificación |
|----------|----------------|
| Wrapper | `min-h-screen flex items-center` |
| Container | `max-w-8xl px-4 sm:px-8 lg:px-12` |
| Layout | Flex con columnas asimétricas `lg:w-3/5` + `lg:w-2/5` |
| Eyebrow | `eyebrow-brutalist mb-4` |
| Título | `font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.9] tracking-tight` |
| Subtítulo | `text-sm sm:text-base text-muted max-w-md leading-relaxed` |
| CTA primario | `btn-accent` o `<Button variant="primary" size="lg">` |
| CTA secundario | `<Button variant="secondary" size="md">` (opcional) |
| Elemento visual | A la derecha o abajo, según composición |
| Padding vertical | `py-16 sm:py-24` |
| Separador | `border-t border-ink/10` al inicio |

### Variante: Hero compacto (para secciones internas)

```
┌─────────────────────────────────────────────┐
│  [Eyebrow]                                  │
│  Título (font-display text-3xl-4xl)         │
│  Subtítulo (text-sm text-muted)            │
└─────────────────────────────────────────────┘
```

Usar para: sub-páginas de conocimiento, detalle de entidad, perfil.

| Elemento | Especificación |
|----------|----------------|
| Padding vertical | `py-8 sm:py-12` |
| Título | `font-display text-3xl sm:text-4xl` |
| Layout | No columnas — apilado centrado |

### Reglas del hero

1. **Cada hero tiene exactamente un CTA principal** — máximo
2. **El CTA principal es el último elemento visual** (después del título y subtítulo)
3. **El elemento visual no compite con el texto** — si es grande, va a la derecha separado
4. **El hero ocupa toda la altura de viewport** — para páginas de Nivel 1 (Home, Onboarding, Mi Mapa)
5. **Héroes internos son compactos** — para páginas de Nivel 2 y 3
6. **No repetir la misma estructura de hero** en más de una página

### Aplicación a las páginas actuales

| Página | Variante Hero | Nota |
|--------|---------------|------|
| Home | Hero completo (Nivel 1) | Número del día como elemento visual |
| Onboarding | Hero compacto (Nivel 1) | Formulario como CTA |
| Mi Mapa | Hero compacto (Nivel 1) | Perfil como contenido |
| Daily Energy | Hero compacto (Nivel 2) | Score como elemento visual |
| Afinidad | Hero completo (Nivel 2) | Tipo de afinidad como contexto |
| Compatibilidad | Hero compacto (Nivel 2) | |
| Conocimiento | Hero compacto (Nivel 3) | |
| Artículos | Hero compacto (Nivel 3) | |
| Not-found | Hero compacto (Nivel 3) | |

---

## 4.10 Responsive layout

### Filosofía

Diseñar mobile-first: definir mobile primero, luego mejorar para tablet y desktop.

### Breakpoints

| Nombre | Width | Uso |
|--------|-------|-----|
| Base | < 640px | Mobile |
| sm | ≥ 640px | Tablet vertical |
| lg | ≥ 1024px | Desktop |
| xl | ≥ 1280px | Desktop wide |

### Cómo cambian las propiedades

#### Columnas

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Grid editorial | 1 col | 2 cols | 3-4 cols |
| Hero columnas | Apilado | Apilado | 3/5 + 2/5 |
| Footer columns | 1 col | 2 cols | 4 cols |
| Cards grid | 1 col | 2 cols | 3 cols |

#### Espaciados

| Token | Mobile | Desktop |
|-------|--------|---------|
| Padding lateral | `px-4` | `px-8 lg:px-12` |
| Card padding | `p-6` | `p-8 lg:p-10` |
| Hero padding Y | `py-16` | `py-24` |
| Gap entre cards | `gap-4` | `gap-px` (grid editorial) |

#### Tipografía

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Display title | `text-4xl sm:text-5xl` | `text-5xl sm:text-6xl lg:text-7xl` |
| H1 | `text-3xl` | `text-4xl sm:text-5xl` |
| H2 | `text-2xl` | `text-3xl sm:text-4xl` |
| Body | `text-sm` | `text-base` |
| Overline | `text-[10px]` | `text-xs` |

#### Navegación

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Nav links | Ocultos (menú ☰) | Visibles inline |
| CTA header | En menú desplegable | Visible inline |
| HOY / MI MAPA | En menú desplegable | Visible inline |
| Theme toggle | Visible | Visible |

#### CTAs

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Tamaño | `px-8 py-3 text-sm` | `px-10 py-4 text-base` |
| Ancho | `w-full` | `w-auto` |

### Regras responsive

1. **Nunca esconder contenido importante en mobile** — si no cabe, reestructurar
2. **Mobile-first en CSS** — usar `sm:` como override, no `lg:` como default
3. **El CTA siempre debe ser accesible** — mínimo 44px de altura en touch
4. **Texto legible en mobile** — mínimo 16px (`text-sm`)
5. **Touch targets** — mínimo 44x44px para cualquier elemento interactivo

### Ejemplo de implementación responsive

```tsx
{/* Hero */}
<section className="min-h-screen flex items-center bg-background pt-16">
  <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
    <div className="flex flex-wrap">
      {/* Texto */}
      <div className="w-full lg:w-3/5 p-8 lg:p-12">
        <p className="eyebrow-brutalist mb-4">NÚMERO DEL DÍA</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.9]">{number}</h1>
        <p className="text-sm sm:text-base text-muted mt-6">{subtitle}</p>
        <Button variant="primary" size="lg" className="mt-10">
          DESCUBRIR MI MAPA
        </Button>
      </div>
      {/* Visual */}
      <div className="w-full lg:w-2/5 p-8 lg:p-12">
        {/* Elemento visual */}
      </div>
    </div>
  </div>
</section>

{/* Grid editorial */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
  {items.map(item => (
    <div key={item.id} className="bg-background p-6 lg:p-8">
      {/* Card content */}
    </div>
  ))}
</div>
```

---

## Entregable de Fase 4

### Checklist

| Sección | Documentado | Implementado |
|---------|-------------|--------------|
| Grid principal | ✅ | ✅ (existente, estandarizado) |
| Ritmo vertical | ✅ | Pendiente: aplicar a Home |
| Composición editorial | ✅ | Pendiente: aplicar a Home |
| Sistema de contenedores | ✅ | Pendiente: estandarizar uso |
| Header especificaciones | ✅ | Parcialmente implementado |
| Footer especificaciones | ✅ | Parcialmente implementado |
| Fondos y capas | ✅ | Parcialmente implementado |
| Sistema de tarjetas | ✅ | Pendiente: migrar inline → `<Card>` |
| Hero framework | ✅ | Pendiente: aplicar a Home hero |
| Responsive layout | ✅ | Parcialmente implementado |

### Próximos pasos

1. Aplicar el sistema de composición editorial al Home (reestructurar 4 secciones → ritmo alternado)
2. Estandarizar el sistema de tarjetas: migrar todos los `border border-border bg-card` inline al componente `<Card>`
3. Aplicar el Hero Framework al Home hero (reducir número, unificar CTA)
4. Implementar dropdown "MÁS" en el header para enlaces secundarios
5. Aplicar el sistema de contenedores a las 4 secciones del Home
6. Verificar responsive layout en todas las breakpoint
7. Crear un `LayoutGuide` visual (Figma/storybook reference) para el equipo

---

*Layout System v1 — Fase 4. Define el lenguaje visual consistente para toda la aplicación. Basado en el Design System v1 y la arquitectura de experiencia validada.*