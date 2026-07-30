# Fase 6 — Sistema de Componentes

No diseñar pantallas. Diseñar componentes. Cada componente tiene variantes, estados y comportamiento definidos. No crear variantes ad hoc.

---

## 6.1 Botones

Sistema dual: `<Button>` (React component) para CTAs en cards, forms, modals. `btn-*` (CSS clases) para CTAs editoriales en secciones de texto. No mezclar en una misma página. Elegir uno.

### 6.1.1 `<Button>` — Componente React

Ubicación: `components/ui/Button.tsx`

#### Variantes disponibles

| Variante | Variante actual del componente | Normal | Hover | Disabled |
|----------|-------------------------------|--------|-------|----------|
| `primary` | `primary` | `bg-ink text-paper` | `bg-accent text-accent-foreground` | `opacity-50 cursor-not-allowed` |
| `secondary` | `secondary` | `bg-transparent text-muted border border-border` | `border-accent text-accent` | `opacity-50 cursor-not-allowed` |
| `ghost` | `ghost` | `bg-transparent text-muted` | `text-foreground bg-ink/[0.03]` | `opacity-50 cursor-not-allowed` |

#### Estados (componente `<Button>`)

| Estado | Implementación | Comportamiento |
|--------|---------------|----------------|
| **Hover** | `hover:` en variantes | Cambia fondo/texto según variante |
| **Focus** | `focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2` | Anillo de acento con offset |
| **Loading** | `loading` prop → `<Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />` + disabled automático | Spinner + texto deshabilitado |
| **Disabled** | `disabled` prop → `opacity-50 cursor-not-allowed` | Sin hover, sin click |
| **Active** | `whileTap={{ scale: 0.95 }}` (framer-motion) | Escala de pulso táctil |

#### Estados que FALTAN implementar en `<Button>` (PENDIENTE)

| Estado | Pendiente | Nota |
|--------|-----------|------|
| **Danger** | ❌ No existe variante | Necesita: `bg-error text-error-foreground hover:bg-error/90` |
| **Link** | ❌ No existe variante | Necesita: `bg-transparent text-accent underline hover:text-accent/80` |
| **Icon** | ❌ No existe variante | Necesita: cuadrado compacto `w-10 h-10` sin padding, solo icono |
| **FAB** | ❌ No existe variante | Necesita: círculo `w-14 h-14 rounded-full` con shadow elevado |

---

### 6.1.2 `btn-*` — Clases Editoriales (CSS)

Ubicación: `app/globals.css`

#### Variantes existentes

| Clase | Normal | Hover | Disabled |
|-------|--------|-------|----------|
| `.btn` (base) | `display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; line-height: 1; letter-spacing: 0.05em; text-transform: uppercase; transition: all 200ms ease; cursor: pointer; border: none; text-decoration: none; min-height: 44px;` | `opacity: 0.9` | `opacity: 0.6 cursor-not-allowed` |
| `.btn-primary` | `background: var(--color-ink); color: var(--color-paper);` | `background: var(--color-accent); color: var(--color-accent-foreground);` | `opacity: 0.5 cursor-not-allowed` |
| `.btn-accent` | `background: var(--color-accent); color: var(--color-accent-foreground);` | `opacity: 0.9` | `opacity: 0.5 cursor-not-allowed` |
| `.btn-ghost` | `background: transparent; color: var(--color-muted); padding: 0.5rem 0.75rem;` | `color: var(--color-foreground); background: var(--color-ink-alpha-03);` | `opacity: 0.5 cursor-not-allowed` |

#### Estados que FALTAN en `btn-*` (PENDIENTE)

| Clase | Estado | PENDIENTE |
|-------|--------|-----------|
| `.btn-danger` | Normal / Hover / Disabled / Focus | ❌ No existe. Necesita: `bg-[var(--color-error)] text-[var(--color-error-foreground)]` hover → `bg-[var(--color-error)]/90` |
| `.btn-link` | Normal / Hover / Disabled / Focus | ❌ No existe. Necesita: `bg-transparent text-[var(--color-accent)] underline hover:text-[var(--color-accent)]/80` |
| `.btn-icon` | Normal / Hover / Disabled / Focus | ❌ No existe. Necesita: cuadrado `w-10 h-10 rounded-full` sin padding, solo icono |
| `.btn-fab` | Normal / Hover / Disabled / Focus / Active | ❌ No existe. Necesita: círculo `w-14 h-14 rounded-full` con shadow elevado |

#### Estados CSS que FALTAN en `.btn-*`

| Estado | Existe en `.btn` | EXISTE en `.btn-primary` | EXISTE en `.btn-accent` | EXISTE en `.btn-ghost` | FALTAN TODOS (danger/link/icon/fab) |
|--------|---------|-------------|-------------|------------|------|
| **Hover** | ✅ `opacity: 0.9` | ✅ | ✅ `opacity: 0.9` | ✅ | ❌ |
| **Focus** | ✅ | ✅ `outline: 2px solid var(--color-accent); outline-offset: 2px;` | ✅ | ✅ | ❌ |
| **Loading** | ❌ | ❌ | ❌ | ❌ | ❌ Necesita spinner + texto opaco |
| **Disabled** | ✅ `opacity: 0.6` | ✅ `opacity: 0.5; cursor: not-allowed;` | ✅ `opacity: 0.5; cursor: not-allowed;` | ✅ `opacity: 0.5; cursor: not-allowed;` | ❌ |
| **Active** | ❌ | ❌ | ❌ | ❌ | ❌ Necesita `scale-95` o `brightness-90` |

---

### 6.1.3 Nuevas variantes de botón (FASE 6 — DEFINIR)

#### 6.1.3.1 Danger (`btn-danger` / `<Button variant="danger">`)

**Propósito:** Acciones destructivas (eliminar, borrar, desvincular).

| Propiedad | `<Button variant="danger">` | `btn-danger` |
|-----------|------------------------------|---------------|
| Background | `bg-[var(--color-error)]` | `background: var(--color-error)` |
| Color | `text-[var(--color-error-foreground)]` | `color: var(--color-error-foreground)` |
| Hover | `bg-[var(--color-error)]/90` | `background: var(--color-error)/90; color: var(--color-error-foreground);` |
| Focus | `focus:ring-[var(--color-error)]/40` | `outline: 2px solid var(--color-error); outline-offset: 2px;` |
| Disabled | `opacity-50 cursor-not-allowed` | `opacity: 0.5; cursor: not-allowed;` |
| Active | `scale-95` | `transform: scale(0.95);` |
| Loading | Spinner en `var(--color-error-foreground)` | Spinner en `var(--color-error-foreground)` |

#### 6.1.3.2 Link (`btn-link` / `<Button variant="link">`)

**Propósito:** Acciones secundarias que se leen como texto (cancelar, ver detalles, olvidar contraseña).

| Propiedad | `<Button variant="link">` | `btn-link` |
|-----------|---------------------------|-------------|
| Background | `transparent` | `background: transparent;` |
| Color | `text-accent` | `color: var(--color-accent);` |
| Border | `none` | `border: none;` |
| Hover | `text-accent/80` | `color: var(--color-accent)/80; text-decoration: underline;` |
| Focus | `focus:ring-accent/40 focus:ring-offset-0` | `outline: 2px solid var(--color-accent); outline-offset: 2px;` |
| Disabled | `opacity-50 cursor-not-allowed no-underline` | `opacity: 0.5; cursor: not-allowed; text-decoration: none;` |
| Active | `scale-95` | `transform: scale(0.95);` |
| Loading | Spinner inline con texto | Spinner inline con texto |

#### 6.1.3.3 Icon (`btn-icon` / `<Button variant="icon">`)

**Propósito:** Botones de acción compactos con solo un icono (editar, eliminar, compartir, copiar).

| Propiedad | `<Button variant="icon">` | `btn-icon` |
|-----------|--------------------------|-------------|
| Tamaño | `w-10 h-10` (md), `w-8 h-8` (sm), `w-12 h-12` (lg) | `width: 2.5rem; height: 2.5rem;` (md) |
| Radio | `rounded-full` | `border-radius: 9999px;` |
| Padding | `p-0` (solo el icono ocupa todo el espacio) | `padding: 0;` |
| Background | `bg-transparent` | `background: transparent;` |
| Color | `text-muted` | `color: var(--color-muted);` |
| Hover | `bg-ink/[0.03] text-foreground` | `background: var(--color-ink-alpha-03); color: var(--color-foreground);` |
| Focus | `focus:ring-accent/40` | `outline: 2px solid var(--color-accent); outline-offset: 2px;` |
| Disabled | `opacity-50 cursor-not-allowed` | `opacity: 0.5; cursor: not-allowed;` |
| Active | `scale-90` | `transform: scale(0.9);` |

#### 6.1.3.4 FAB (`btn-fab` / `<Button variant="fab">`)

**Propósito:** Acción principal flotante. Elevado, visible, siempre accesible. Único botón tipo "añadir" o "crear nuevo" en la página.

| Propiedad | `<Button variant="fab">` | `btn-fab` |
|-----------|--------------------------|------------|
| Tamaño | `w-14 h-14` (md), `w-12 h-12` (sm), `w-16 h-16` (lg) | `width: 3.5rem; height: 3.5rem;` (md) |
| Radio | `rounded-full` | `border-radius: 9999px;` |
| Padding | `p-0` | `padding: 0;` |
| Background | `bg-accent` | `background: var(--color-accent);` |
| Color | `text-accent-foreground` | `color: var(--color-accent-foreground);` |
| Shadow | `shadow-lg` | `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);` |
| Hover | `bg-accent/90 scale-105 shadow-xl` | `background: var(--color-accent)/90; transform: scale(1.05); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);` |
| Focus | `focus:ring-accent/40 focus:ring-offset-2` | `outline: 2px solid var(--color-accent); outline-offset: 2px;` |
| Disabled | `opacity-50 cursor-not-allowed shadow-md` | `opacity: 0.5; cursor: not-allowed; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);` |
| Active | `scale-90` | `transform: scale(0.9);` |

---

### 6.1.4 Matriz completa de variantes × estados

Para `<Button>`:

| Variante | Hover | Focus | Loading | Disabled | Active |
|----------|-------|-------|---------|----------|--------|
| `primary` | `bg-accent text-accent-foreground` | `ring-accent/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed` | `scale-95` |
| `secondary` | `border-accent text-accent` | `ring-accent/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed` | `scale-95` |
| `ghost` | `text-foreground bg-ink/[0.03]` | `ring-accent/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed` | `scale-95` |
| `danger` | `bg-error/90 text-error-foreground` | `ring-error/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed` | `scale-95` |
| `link` | `text-accent/80 underline` | `ring-accent/40 ring-offset-0` | Spinner + disabled | `opacity-50 cursor-not-allowed no-underline` | `scale-95` |
| `icon` | `bg-ink/[0.03] text-foreground` | `ring-accent/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed` | `scale-90` |
| `fab` | `bg-accent/90 text-accent-foreground shadow-xl scale-105` | `ring-accent/40 ring-offset-2` | Spinner + disabled | `opacity-50 cursor-not-allowed shadow-md` | `scale-90` |

Para `btn-*`:

| Clase | Hover | Focus | Loading | Disabled | Active |
|-------|-------|-------|---------|----------|--------|
| `.btn-primary` | `bg-accent text-accent-foreground` | `outline: 2px solid var(--color-accent); outline-offset: 2px;` | ❌ PENDIENTE | `opacity: 0.5; cursor: not-allowed;` | ❌ PENDIENTE |
| `.btn-accent` | `opacity: 0.9` | ✅ | ❌ PENDIENTE | `opacity: 0.5; cursor: not-allowed;` | ❌ PENDIENTE |
| `.btn-ghost` | `color: var(--color-foreground); background: var(--color-ink-alpha-03);` | ✅ | ❌ PENDIENTE | `opacity: 0.5; cursor: not-allowed;` | ❌ PENDIENTE |
| `.btn-danger` | ❌ POR DEFINIR | ❌ POR DEFINIR | ❌ PENDIENTE | ❌ POR DEFINIR | ❌ PENDIENTE |
| `.btn-link` | ❌ POR DEFINIR | ❌ POR DEFINIR | ❌ PENDIENTE | ❌ POR DEFINIR | ❌ PENDIENTE |
| `.btn-icon` | ❌ POR DEFINIR | ❌ POR DEFINIR | ❌ PENDIENTE | ❌ POR DEFINIR | ❌ PENDIENTE |
| `.btn-fab` | ❌ POR DEFINIR | ❌ POR DEFINIR | ❌ PENDIENTE | ❌ POR DEFINIR | ❌ PENDIENTE |

---

### 6.1.5 Reglas de uso de botones

1. **Una página, un sistema.** Usar `<Button>` O `btn-*`, no ambos en la misma página.
2. `<Button>` para CTAs en cards, forms, modals, navegación interna.
3. `btn-*` para CTAs editoriales en secciones de texto largo (hero, banners, CTA final seccional).
4. **Danger solo para destrucción.** Eliminar, borrar, desvincular. Nunca para acciones constructivas.
5. **Link no es un enlace.** Es un botón que se ve como texto. Usar `<Button variant="link">`, no `<a>`.
6. **Icon solo con tooltip.** Todo botón icon debe tener `title` o `aria-label` para accesibilidad.
7. **FAB es único por página.** Máximo un FAB visible a la vez. No agrupar FABs.
8. **Loading automático.** Cuando `loading={true}`, el botón se deshabilita automáticamente, muestra spinner, y `aria-busy="true"`.
9. **Active/tap.** Todo botón tiene `whileTap={{ scale }}` con variante según tipo (primary/secondary/ghost: 0.95, icon/fab: 0.9).

---

## 6.2 Cards

Probablemente Molino tenga más de diez tipos de card. Reducirlas a una familia con estructura base y variantes derivadas.

### 6.2.1 Card Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `var(--color-card)` |
| Border | `1px solid var(--color-border)` |
| Padding | `p-6` (md), `p-4` (sm), `p-8` (lg) |
| Shadow | Ninguno |

### 6.2.2 Card Highlight

Derivada de Card Base. Para contenido destacado.

| Propiedad | Valor |
|-----------|-------|
| Todas las de Card Base | — |
| Background | `var(--color-card)` con `border-accent/20` |
| Border left | `4px solid var(--color-accent)` |
| Uso | Featured sections, valores principales |

### 6.2.3 Card Interactive

Derivada de Card Base. Para contenido clickeable con hover.

| Propiedad | Valor |
|-----------|-------|
| Todas las de Card Base | — |
| Cursor | `cursor-pointer` |
| Hover | `border-accent bg-ink/[0.02] transition-colors duration-200` |
| Active | `scale-[0.98] transition-transform duration-100` |
| Focus | `focus:ring-2 focus:ring-accent/40 focus:ring-offset-2` |
| Uso | Lista de decisiones, items de catálogo, navigación |

### 6.2.4 Card Metric

Derivada de Card Base. Para datos numéricos y métricas.

| Propiedad | Valor |
|-----------|-------|
| Todas las de Card Base | — |
| Layout | Flex column, items-start, gap-2 |
| Label | `font-mono text-xs uppercase text-muted tracking-wider` |
| Value | `font-mono text-3xl font-bold text-ink` |
| Change | `font-mono text-sm` — positivo `text-accent`, negativo `text-error` |
| Uso | Stats, métricas KPIs, counters |

### 6.2.5 Card Preview

Derivada de Card Base. Para vista previa visual del mapa o contenido rico.

| Propiedad | Valor |
|-----------|-------|
| Todas las de Card Base | — |
| Overflow | `overflow-hidden` |
| Image area | `aspect-video w-full object-cover` |
| Content area | `p-4` |
| Hover | `scale-[1.02] shadow-lg transition-all duration-300` |
| Uso | Mockup del mapa, preview de lectura, gallery |

### 6.2.6 Familia de Cards — Resumen

| Variante | Extiende | Diferenciador | Uso |
|----------|----------|---------------|-----|
| `base` | — | Estructura neutral | Contenedor genérico |
| `highlight` | `base` | Border left accent, featured bg | Valores principales, featured |
| `interactive` | `base` | Hover/active/focus states | Listas, items clickeables |
| `metric` | `base` | Value/label/change layout | KPIs, stats, counters |
| `preview` | `base` | Aspect ratio image, overflow-hidden | Previews visuales, maps |

**Todas derivan de la misma estructura.** Comparten padding, border, y radio base. Las variantes solo añaden una capa de estilo sobre la base.

---

## 6.3 Inputs

Unificar todos los campos de entrada en una familia consistente.

### 6.3.1 Input — Familia unificada

| Tipo | Uso | Clase base |
|------|-----|------------|
| **Text** | Nombre, email, texto libre | `.input` |
| **Date** | Fecha de nacimiento, fecha de evento | `.input` + `type="date"` |
| **Select** | Opción única, lista desplegable | `.input` + `appearance-none` |
| **Autocomplete** | Sugiere mientras escribe | `.input` + JS handler |
| **Search** | Búsqueda con icono | `.input` + icono |
| **Textarea** | Texto largo, comentarios | `.input` + `rows={4}` |

### 6.3.2 Propiedades comunes a todos los input types

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Border | `1px solid var(--color-border)` |
| Background | `var(--color-background)` |
| Font | `font-mono`, 0.875rem (14px) |
| Color | `text-ink` |
| Padding | `px-4 py-3` |
| Min-height | `min-h-[44px]` |
| Width | `w-full` |
| Transition | `transition-colors duration-200` |

### 6.3.3 Estados compartidos

| Estado | Clase | Comportamiento |
|--------|-------|----------------|
| **Focus** | `focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20` | Borde acento, anillo sutil |
| **Error** | `border-error` | Borde rojo para validación |
| **Error focus** | `focus:border-error focus:ring-error/20` | Anillo rojo en error |
| **Disabled** | `opacity-50 cursor-not-allowed bg-ink/[0.02]` | Deshabilitado visual |
| **Placeholder** | `text-muted` | Color gris para placeholder text |

### 6.3.4 Variantes por tipo

#### Text Input

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` |
| Tipo HTML | `type="text"` |
| Border radius | `rounded-none` |
| Placeholder | `text-muted` |

#### Date Input

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` |
| Tipo HTML | `type="date"` |
| Icon | Calendar icon `right-3` absolute |
| Nota | Nativo date picker del navegador |

#### Select Input

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` + `appearance-none` |
| Background | `bg-[var(--color-background)]` |
| Arrow | Custom chevron icon `right-3` |
| Opciones | `rounded-none` en dropdown |

#### Autocomplete Input

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` |
| Suggestions | Dropdown debajo, `border border-border bg-[var(--color-background)]` |
| Highlight | `bg-accent/10 text-accent` en matched text |
| Max height | `max-h-48 overflow-y-auto` |

#### Search Input

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` + `pl-10` (espacio para icono) |
| Icon | Search icon `left-3 absolute` |
| Clear | X icon `right-3 absolute` visible cuando hay texto |
| Border radius | `rounded-full` (distintivo del search pattern) |

#### Textarea

| Propiedad | Valor |
|-----------|-------|
| Base | `.input` + `resize-none` |
| Rows | 4 por defecto |
| Min-height | `min-h-[100px]` |
| Border radius | `rounded-none` |

### 6.3.5 Ejemplo de implementación del input unificado

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-xs uppercase tracking-wider text-muted">
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-[44px] px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-none font-mono text-sm text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink/[0.02] ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className}`}
        {...props}
      />
      {helperText && !error && (
        <span className="font-mono text-xs text-muted">{helperText}</span>
      )}
      {error && (
        <span className="font-mono text-xs text-error">{error}</span>
      )}
    </div>
  )
}
```

### 6.3.6 Reglas de uso de inputs

1. **Una familia, todas las variantes.** No crear componentes separados para cada tipo (`<TextInput>`, `<DateInput>`, etc.). Usar `<Input>` con `type` prop.
2. **Label arriba.** Label como `<label>` encima del input, no como placeholder.
3. **Error debajo.** Mensaje de error debajo del input, en rojo `text-error`.
4. **Helper text.** Texto de ayuda debajo del input, en `text-muted`, solo si no hay error.
5. **Min-height 44px.** Consistente con tap target mínimo accesible.
6. **Font mono.** Todos los inputs usan `font-mono` — alineación al brutalismo del sistema.
7. **No estilos inline.** Todas las variantes definidas en la clase base `.input` o como props del componente `<Input>`.

---

## 6.4 Dropdowns

Revisión detallada de cada aspecto visual y de interacción del dropdown.

### 6.4.1 Padding

| Elemento | Valor |
|----------|-------|
| Trigger padding | `px-4 py-3` (equal to input) |
| Menu padding | `py-2` (vertical rhythm) |
| Item padding | `px-4 py-3` (consistent tap target) |
| Item gap | `gap-3` (icon + text alignment) |
| Separator padding | `px-4` (match item padding) |

**Regla:** Todos los elementos del dropdown mantienen padding consistente con la input family. El trigger comparte el mismo `min-h-[44px]` que todos los inputs.

### 6.4.2 Hover

| Elemento | Estado hover |
|----------|-------------|
| Trigger | Sin cambio visual al hover (se mantiene neutral) |
| Trigger focus | `border-accent ring-accent/20` |
| Trigger active | `bg-ink/[0.03]` |
| Menu item | `bg-ink/[0.03]` |
| Menu item active | `bg-accent/10 text-accent` |
| Menu item selected | `bg-accent/15 text-accent font-medium` |
| Group label | `text-muted` (no hover, no interactive) |
| Separator | Sin cambio |

**Regla:** Hover en items del dropdown es sutil — `bg-ink/[0.03]`. Nunca cambiar el color completo del texto en hover. Mantener la consistencia brutalista.

### 6.4.3 Altura

| Elemento | Valor |
|----------|-------|
| Trigger height | `min-h-[44px]` (consistente con input family) |
| Menu altura mínima | Basada en contenido (no fija) |
| Item altura | `min-h-[44px]` (consistente con tap target) |
| Menu altura máxima | `max-h-48` (8 items visibles con scroll) |

**Regla:** La altura del trigger es siempre la misma que el input (`min-h-[44px]`). El menu no tiene altura fija — crece con el contenido hasta el máximo, donde se activa scroll.

### 6.4.4 Scroll

| Propiedad | Valor |
|-----------|-------|
| Scroll container | `overflow-y-auto` |
| Max height | `max-h-48` |
| Scrollbar | `scrollbar-thin` (custom) |
| Scrollbar track | `bg-transparent` |
| Scrollbar thumb | `bg-border rounded-full` |
| Scrollbar thumb hover | `bg-muted` |

**Regla:** El scroll solo se activa en el menu de opciones, nunca en el trigger ni en el page wrapper. El scroll es sutil — scrollbar thin con track transparente.

### 6.4.5 Radio

| Elemento | Valor |
|----------|-------|
| Trigger | `rounded-none` (brutalista) |
| Menu | `rounded-none` |
| Item | `rounded-none` |
| First item (rounded top) | `rounded-none` (NO redondear — mantener brutalista) |
| Last item (rounded bottom) | `rounded-none` |

**Regla:** El dropdown mantiene `rounded-none` en todos los elementos — alineado al brutalismo completo del sistema. Ningún elemento dentro del dropdown tiene radio.

### 6.4.6 Sombras

| Elemento | Shadow |
|----------|--------|
| Trigger | Ninguna |
| Menu | `shadow-lg` (elevación sutil sobre el contenido) |
| Item | Ninguna |
| Item hover | Ninguna (bg de hover reemplaza shadow) |
| Item active | Ninguna |

**Regla:** Solo el menu dropdown tiene sombra (`shadow-lg`). Los items individuales nunca tienen sombra — el shadow del menu contenedor es suficiente para la elevación visual.

### 6.4.7 Dropdown completo — especificaciones unificadas

| Propiedad | Valor |
|-----------|-------|
| Trigger min-height | `min-h-[44px]` |
| Trigger border | `1px solid var(--color-border)` |
| Trigger background | `var(--color-background)` |
| Trigger hover | Sin cambio visual |
| Trigger focus | `border-accent ring-2 ring-accent/20` |
| Trigger error | `border-error` |
| Trigger disabled | `opacity-50 cursor-not-allowed` |
| Menu position | `absolute top-full left-0 right-0 z-50` |
| Menu background | `var(--color-background)` |
| Menu border | `1px solid var(--color-border)` |
| Menu shadow | `shadow-lg` |
| Menu max-height | `max-h-48 overflow-y-auto` |
| Item height | `min-h-[44px]` |
| Item hover | `bg-ink/[0.03]` |
| Item selected | `bg-accent/15 text-accent font-medium` |
| Item active | `bg-accent/20` |
| Item radius | `rounded-none` |
| Item padding | `px-4 py-3` |
| Separator | `1px solid var(--color-border) mx-4` |
| Group label | `px-4 py-2 font-mono text-xs uppercase text-muted tracking-wider` |
| No results | `px-4 py-6 text-center text-muted font-mono text-sm` |
| Scrollbar | `scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border rounded-full` |

---

## 6.5 Chips

Las afinidades seguramente usan muchos chips. Definir la familia completa.

### 6.5.1 Chip Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-full` |
| Font | `font-mono`, 0.625rem (10px), 600 weight, 0.1em tracking, uppercase |
| Padding | `px-3 py-1.5` |
| Border | `1px solid transparent` |
| Min-height | `min-h-[28px]` |
| Transition | `transition-colors duration-200` |
| Cursor | `cursor-default` (no clickable por defecto, clickable cuando filtra) |

### 6.5.2 Neutral

Para etiquetas informativas sin estado particular. El más común en la interfaz.

| Estado | Clase |
|--------|-------|
| Normal | `bg-ink/[0.06] text-ink border-ink/[0.06]` |
| Hover | `bg-ink/[0.08]` |
| Focus | `border-accent ring-2 ring-accent/20` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.5.3 Activo

Para la afinidad seleccionada en el momento. Indica que esta afinidad es la actual.

| Estado | Clase |
|--------|-------|
| Normal | `bg-accent text-accent-foreground` |
| Hover | `bg-accent/90` |
| Active | `bg-accent/80 scale-95` |
| Focus | `ring-2 ring-accent/40 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.5.4 Positivo

Para afinidades favoritas o confirmadas. Refuerza la selección positiva.

| Estado | Clase |
|--------|-------|
| Normal | `bg-success/10 text-success border-success/20` |
| Hover | `bg-success/15 border-success/30` |
| Active | `bg-success/20 scale-95` |
| Focus | `ring-2 ring-success/30 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.5.5 Negativo

Para rechazo o exclusión de una afinidad. Menos común pero necesario para flujos de filtrado.

| Estado | Clase |
|--------|-------|
| Normal | `bg-error/10 text-error border-error/20` |
| Hover | `bg-error/15 border-error/30` |
| Active | `bg-error/20 scale-95` |
| Focus | `ring-2 ring-error/30 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.5.6 Filtrado

Para chips que indican un filtro activo aplicado. Más prominente que Neutral, menos que Activo.

| Estado | Clase |
|--------|-------|
| Normal | `bg-ink/[0.04] text-ink border-ink/[0.15]` |
| Hover | `bg-ink/[0.08] border-ink/[0.25]` |
| Active | `bg-ink/[0.10] scale-95` |
| Focus | `ring-2 ring-ink/20 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.5.7 Chip interactivo (para filtros)

Cuando el chip es clickeable (filtro aplicable), cambia de neutral a interactivo:

| Propiedad | No clickeable | Clickeable (filtro) |
|-----------|---------------|---------------------|
| Cursor | `cursor-default` | `cursor-pointer` |
| Hover | `bg-ink/[0.08]` | `bg-ink/[0.08] border-accent` |
| Active | `scale-95` | `scale-90` |
| Focus | Sin anillo | `ring-2 ring-accent/20 ring-offset-1` |

### 6.5.8 Chips en múltiple selección

Para afinidades donde se pueden seleccionar varias simultáneamente:

| Propiedad | Valor |
|-----------|-------|
| Layout | Flex wrap, `gap-2` |
| Margin | Ninguno (gap controla espaciado) |
| Max visible | Sin límite — scroll horizontal dentro del contenedor |
| Container | `overflow-x-auto scrollbar-thin` |

### 6.5.9 Chips con ícono de borrar

Cada chip de filtro activo puede tener un icono de cerrar para remover:

| Propiedad | Valor |
|-----------|-------|
| Icon size | `w-3 h-3` |
| Icon margin | `ml-1` |
| Icon color | `text-muted` (Neutral), `text-accent-foreground` (Activo), `text-success` (Positivo) |
| Icon hover | `text-foreground` |
| Click target | `min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center` |

### 6.5.10 Chips — Resumen de variantes

| Variante | Color bg | Color text | Color border | Uso |
|----------|----------|------------|--------------|-----|
| Neutral | `ink/[0.06]` | `ink` | `ink/[0.06]` | Etiquetas informativas |
| Activo | `accent` | `accent-foreground` | transparent | Selección actual |
| Positivo | `success/10` | `success` | `success/20` | Favoritas, confirmadas |
| Negativo | `error/10` | `error` | `error/20` | Rechazo, exclusión |
| Filtrado | `ink/[0.04]` | `ink` | `ink/[0.15]` | Filtro activo aplicado |

**Regla de uso:** Solo una variante por chip en un momento dado. No mezclar variantes en un grupo de chips relacionado (ej: no mezclar Positivo y Negativo en la misma fila de afinidades sin contexto de acción).

---

### 6.3.6 Reglas de uso de inputs

1. **Una familia, todas las variantes.** No crear componentes separados para cada tipo (`<TextInput>`, `<DateInput>`, etc.). Usar `<Input>` con `type` prop.
2. **Label arriba.** Label como `<label>` encima del input, no como placeholder.
3. **Error debajo.** Mensaje de error debajo del input, en rojo `text-error`.
4. **Helper text.** Texto de ayuda debajo del input, en `text-muted`, solo si no hay error.
5. **Min-height 44px.** Consistente con tap target mínimo accesible.
6. **Font mono.** Todos los inputs usan `font-mono` — alineación al brutalismo del sistema.
7. **No estilos inline.** Todas las variantes definidas en la clase base `.input` o como props del componente `<Input>`.

---

## 6.6 Badges

No improvisar. Crear variantes con estados definidos.

### 6.6.1 Badge — Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Font | `font-mono`, 0.625rem (10px), 600 weight, 0.1em tracking, uppercase |
| Padding | `px-3 py-1.5` |
| Min-height | `min-h-[24px]` |
| Display | `inline-flex`, `items-center`, `gap-1` |
| Transition | `transition-colors duration-200` |
| Border | `1px solid transparent` |

### 6.6.2 Neutral

Para etiquetas informativas sin estado particular. El más común en la interfaz.

| Estado | Clase |
|--------|-------|
| Normal | `bg-ink/[0.06] text-ink border border-ink/[0.06]` |
| Hover | `bg-ink/[0.08]` |
| Active | `bg-ink/[0.10] scale-95` |
| Focus | `border-accent ring-2 ring-accent/20` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.3 Accent

Para la afinidad seleccionada o el valor principal en un grupo de badges.

| Estado | Clase |
|--------|-------|
| Normal | `bg-accent text-accent-foreground` |
| Hover | `bg-accent/90` |
| Active | `bg-accent/80 scale-95` |
| Focus | `ring-2 ring-accent/40 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.4 Success

Para afinidades confirmadas o validadas. Estado positivo.

| Estado | Clase |
|--------|-------|
| Normal | `bg-success/10 text-success border border-success/20` |
| Hover | `bg-success/15 border-success/30` |
| Active | `bg-success/20 scale-95` |
| Focus | `ring-2 ring-success/30 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.5 Error

Para rechazo o exclusión de una afinidad. Estado negativo.

| Estado | Clase |
|--------|-------|
| Normal | `bg-error/10 text-error border border-error/20` |
| Hover | `bg-error/15 border-error/30` |
| Active | `bg-error/20 scale-95` |
| Focus | `ring-2 ring-error/30 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.6 Warning

Para afinidades que requieren atención o están expirando.

| Estado | Clase |
|--------|-------|
| Normal | `bg-warning/10 text-warning border border-warning/20` |
| Hover | `bg-warning/15 border-warning/30` |
| Active | `bg-warning/20 scale-95` |
| Focus | `ring-2 ring-warning/30 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.7 Muted

Para afinidades inactivas o secundarias. El badge menos prominente.

| Estado | Clase |
|--------|-------|
| Normal | `bg-ink/[0.03] text-muted border border-ink/[0.06]` |
| Hover | `bg-ink/[0.06]` |
| Active | `bg-ink/[0.08] scale-95` |
| Focus | `ring-2 ring-accent/20 ring-offset-1` |
| Disabled | `opacity-50 cursor-not-allowed` |

### 6.6.8 Badge interactivo (filtro aplicable)

Cuando el badge es clickeable (filtro aplicable), cambia de display a cursor-pointer y agrega estados de focus/active:

| Propiedad | No clickeable | Clickeable (filtro) |
|-----------|---------------|---------------------|
| Cursor | `cursor-default` | `cursor-pointer` |
| Hover | `bg-ink/[0.08]` | `bg-ink/[0.08] border-accent` |
| Active | `scale-95` | `scale-90` |
| Focus | Sin anillo | `ring-2 ring-accent/20 ring-offset-1` |

### 6.6.9 Resumen de variantes

| Variante | Color bg | Color text | Color border | Uso |
|----------|----------|------------|--------------|-----|
| Neutral | `ink/[0.06]` | `ink` | `ink/[0.06]` | Etiquetas informativas |
| Accent | `accent` | `accent-foreground` | transparent | Selección actual, valor principal |
| Success | `success/10` | `success` | `success/20` | Confirmadas, validadas |
| Error | `error/10` | `error` | `error/20` | Rechazo, exclusión |
| Warning | `warning/10` | `warning` | `warning/20` | Atención, expirando |
| Muted | `ink/[0.03]` | `muted` | `ink/[0.06]` | Inactivas, secundarias |

**Regla de uso:** Solo una variante por badge en un momento dado. No mezclar variantes en un grupo relacionado sin contexto de acción.

### 6.6.10 Reglas de uso de badges

1. **Una variante por badge.** Nunca mezclar variantes en contexto — un badge es Neutral, Accent, Success, Error, Warning o Muto.
2. **Neutral solo para categorías.** Nunca usar Neutral para estados — categorías van en Neutral, estados van en Accent/Success/Error/Warning.
3. **Accent es el por defecto.** Cuando no hay contexto claro usar Accent.
4. **Success y Error son pares.** Siempre mostrar ambos cuando hay estados positivos y negativos en el mismo grupo.
5. **Warning es temporal.** Usar solo para atención urgente — nunca para estados permanentes.
6. **Muted es secundario.** Solo cuando el badge debe ser visible pero no atraer atención.
7. **Sin hover en badges de estado.** Badges de estado (Success/Error/Warning) no cambian en hover — representan estado fijo.
8. **Min-height 24px.** Consistente con la micro-typografía del sistema (10px font).
9. **Siempre uppercase.** Todo badge usa uppercase — parte de la identidad brutalista.
10. **Sin íconos dentro del badge.** Los íconos van fuera del badge o el badge usa solo texto — nunca ícono + texto combinado.

---

## 6.7 Calendario

Uno de los componentes estrella de Molino. Merece diseño propio. No parecer un calendario HTML.

### 6.7.1 Principios de diseño

| Principio | Valor |
|-----------|-------|
| Radio | `rounded-none` en todo — sin redondeos, puro brutalismo |
| Grid | CSS Grid, 7 columnas (días de la semana), sin gap predefinido — gap controlado por padding |
| Navegación | Mes anterior/siguiente con botones `btn-ghost` — nunca `<select>` ni `<option>` |
| Selección | Click en celda → estado activo visual. No usar radio/checkbox nativos |
| Hover | Subtle `bg-ink/[0.03]` — nunca color completo |
| Celda hoy | Borde acento izquierdo `border-l-2 border-accent` — nunca background completo |
| Celda seleccionada | `bg-accent text-accent-foreground` |
| Celda fuera de mes | `text-muted opacity-40` — desvanecida pero presente |
| Sin íconos decorativos | Solo flechas de navegación (chevrons) — nada más |

### 6.7.2 Estructura del componente

El calendario se compone de:

| Elemento | Descripción |
|----------|-------------|
| Header | Mes + año, navegación prev/next |
| Grid de días | 7 columnas, header con D/Nombre del día |
| Celdas | Una celda por día, clickeable |
| Celda vacía | Sin contenido para días fuera del mes |

### 6.7.3 Header

| Elemento | Valor |
|----------|-------|
| Layout | Flex, `justify-between`, `items-center` |
| Mes+Año | `font-heading`, `text-lg`, `text-ink` |
| Botón prev | `btn-ghost`, icono chevron-left, `w-10 h-10` |
| Botón next | `btn-ghost`, icono chevron-right, `w-10 h-10` |
| Radio | `rounded-none` en todo el header |

### 6.7.4 Grid de días

| Elemento | Valor |
|----------|-------|
| Display | `grid`, 7 columns |
| Gap | `gap-0` — celdas sin espacio entre sí, separadas por borde del contenedor |
| Header días | `font-mono`, `text-xs`, `uppercase`, `text-muted`, `py-2 text-center` |
| Celdas | `aspect-square`, `flex`, `items-center`, `justify-center`, `min-h-[44px]` |
| Radio celdas | `rounded-none` |

### 6.7.5 Estados de celda

| Estado | Clase | Descripción |
|--------|-------|-------------|
| **Normal** | `text-ink` | Día regular del mes actual |
| **Hover** | `bg-ink/[0.03]` | Sutil — nunca cambio completo |
| **Active (click)** | `bg-accent text-accent-foreground` | Seleccionado |
| **Focus** | `border-accent ring-2 ring-accent/20` | Anillo de foco accesible |
| **Hoy** | `border-l-2 border-accent` | Borde izquierdo acento — nunca fondo completo |
| **Fuera de mes** | `text-muted opacity-40` | Desvanecido pero visible |
| **Disabled** | `text-muted opacity-30 cursor-not-allowed` | Sin hover, sin click |
| **Range start** | `bg-accent/20 text-accent rounded-l-full` | Inicio de rango seleccionado |
| **Range end** | `bg-accent/20 text-accent rounded-r-full` | Fin de rango seleccionado |
| **Range middle** | `bg-accent/[0.06]` | Medio del rango — sin radio |

### 6.7.6 No parecer un calendario HTML

| Regla | Detalle |
|-------|---------|
| No `<table>` | Usar CSS Grid, nunca `<table>` — tablas HTML son el enemigo |
| No bordes de celda | Sin `border` en celdas — el espacio entre celdas se crea con gap transparente |
| No header de tabla | El header de días (L M X J V S D) no es `<th>` — es un div con estilo |
| Sin zebra striping | Nunca alternar colores de filas |
| Sin scroll interno | El calendario nunca se scroll dentro — si hay muchos meses, paginar |
| Sin "today" badge estilo HTML | El indicador de hoy es borde izquierdo acento, nunca un badge circular |
| Sin números grandes en header | El header muestra solo "Enero 2026" — nunca un dropdown de año |
| Transiciones | `transition: background-color 150ms ease` en celdas — nunca `all` |

### 6.7.7 Calendario inline (input de fecha)

Cuando el calendario se usa como input de fecha (reemplazando el `<input type="date">` nativo):

| Propiedad | Valor |
|-----------|-------|
| Trigger | `.input` estilo — `min-h-[44px]`, `rounded-none`, `border border-ink` |
| Trigger icon | Calendar icon `w-4 h-4` a la derecha, `text-muted` |
| Popover position | `absolute top-full left-0` — debajo del input |
| Popover z-index | `z-50` — por encima de todo |
| Popover shadow | Ninguna — brutalista sin sombras |
| Popover border | `1px solid var(--color-border)` |
| Popover bg | `var(--color-background)` |

### 6.7.8 Calendario modal (selección completa)

Para selección de rango de fechas o selección de fecha en un modal:

| Propiedad | Valor |
|-----------|-------|
| Ancho | `w-full` en mobile, `max-w-md` en desktop |
| Header | Mes+Año con navegación prev/next |
| View toggle | Mes/Vista de mes con botones tipo tab |
| Sin fecha seleccionada | Mostrar mes actual al abrir |
| Confirmar botón | En el footer del calendario modal — `btn-primary` |
| Cancelar botón | En el footer del calendario modal — `btn-ghost` |

### 6.7.9 Calendario en timeline (afinidades)

Para visualizar afinidades en un eje temporal:

| Propiedad | Valor |
|-----------|-------|
| Layout | Horizontal scroll, `overflow-x-auto`, `scrollbar-thin` |
| Eje | Línea vertical negra `w-0.5 bg-ink` |
| Dots | Círculos `w-2 h-2 rounded-none` (brutalista — no redondeado) en cada afinidad |
| Active dot | `bg-accent` |
| Inactive dot | `bg-muted opacity-40` |
| Hover dot | `bg-ink scale-125` |
| Label | `font-mono text-xs text-muted` al lado del dot |
| Height | `h-[200px]` fijo para el timeline visual |

### 6.7.10 Reglas de uso del calendario

1. **Un calendario por contexto.** No mostrar dos calendarios en la misma pantalla sin razón.
2. **CSS Grid, nunca `<table>`.** La estructura del calendario es un grid, nunca una tabla HTML.
3. **Sin scroll interno.** El calendario ocupa su espacio completo. Si el contenido desborda, el contenedor scroll, no el calendario.
4. **Transiciones sutiles.** Solo `background-color` y `opacity` con `transition`. Nunca `transform` en celdas (excepto hover con scale sutil).
5. **Borde acento para hoy.** El indicador de "hoy" siempre es borde izquierdo acento, nunca fondo coloreado.
6. **Celda seleccionada con fondo acento.** Una vez seleccionada, la celda usa `bg-accent text-accent-foreground` — es el estado más prominente.
7. **Fuera de mes = opaco.** Días de otros meses son `opacity-40` — presentes pero subordinados.
8. **Navegación con btn-ghost.** Los botones de mes anterior/siguiente usan el estilo ghost, nunca los botones primarios o accent.
9. **Sin íconos decorativos en celdas.** Solo números de día en cada celda — nunca iconos, badges, o indicadores adicionales dentro de una celda estándar.
10. **Min-height 44px en celdas.** Accesibilidad — todas las celdas son targets táctiles de 44px mínimo.
11. **Desktop: 7 columnas siempre.** Nunca cambiar el número de columnas. El calendario siempre muestra 7 días.
12. **Mobile: misma estructura.** El mismo grid de 7 columnas en mobile — sin scroll horizontal del grid, el contenedor controla el desbordamiento.

---

## 6.8 Tabs

Revisar: indicador, hover, spacing, tipografía.

### 6.8.1 Tab Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Font | `font-mono`, 0.75rem (12px), 600 weight, 0.05em tracking, uppercase |
| Padding | `px-4 py-3` |
| Min-height | `min-h-[44px]` |
| Display | `inline-flex`, `items-center`, `gap-2` |
| Transition | `transition-colors duration-200` |

### 6.8.2 Indicador (Active Tab)

| Elemento | Valor |
|----------|-------|
| Background | `bg-ink/[0.06]` |
| Border bottom | `2px solid var(--color-accent)` |
| Color | `text-ink` |
| Hover | `bg-ink/[0.03]` — el indicador no cambia |
| Active | `border-accent` + `text-ink` |
| Focus | `ring-2 ring-accent/20` |

**Regla:** El indicador activo es un border-bottom de acento, nunca un fondo completo. El color del texto cambia solo en la pestaña activa.

### 6.8.3 Hover

| Elemento | Clase |
|----------|-------|
| Tab inactivo hover | `bg-ink/[0.03]` — nunca cambio de color completo |
| Tab inactivo active | `bg-ink/[0.06] scale-95` |
| Tab inactivo focus | `ring-2 ring-accent/20 ring-offset-1` |

### 6.8.4 Spacing

| Propiedad | Valor |
|-----------|-------|
| Gap entre tabs | `gap-1` — espacio mínimo entre tabs |
| Padding horizontal | `px-4` — consistente con input family |
| Padding vertical | `py-3` — consistente |
| Margin top del indicador | Ninguno — el indicador es `border-bottom` del tab |

**Regla:** Los tabs deben sentirse compactos y alineados. El gap mínimo entre tabs es 1 (4px). Nunca usar gap grande que separe visualmente las pestañas.

### 6.8.5 Tipografía

| Elemento | Valor |
|----------|-------|
| Font | `font-mono` — consistente con el sistema brutalista |
| Tamaño | `0.75rem` (12px) — pequeña, funcional |
| Peso | `600` — semibold para la pestaña activa, `500` para inactiva |
| Tracking | `0.05em` — uppercase tracking consistente |
| Transform | `uppercase` — todas las etiquetas de tab |
| Color inactivo | `text-muted` |
| Color activo | `text-ink` |

**Regla:** La tipografía de tabs es monospace, uppercase, pequeña. Las inactivas son muted, la activa es ink. La diferencia es solo peso (500 vs 600) y color (muted vs ink).

### 6.8.6 Variantes de Tabs

| Variante | Uso | Indicador |
|----------|-----|-----------|
| `default` | Navegación principal de secciones | `border-bottom: 2px solid var(--color-accent)` |
| `subtle` | Sub-navegación dentro de una sección | `border-bottom: 1px solid var(--color-border)` |
| `pills` | Filtros, selección de tipo | `bg-accent text-accent-foreground rounded-none` (solo fondo, sin border-bottom) |

### 6.8.7 Reglas de uso de tabs

1. **Una línea de tabs por página.** No dos líneas de tabs en la misma pantalla.
2. **No más de 5 tabs.** Si hay más de 5 opciones, usar dropdown o scroll horizontal.
3. **Siempre hay una tab activa.** Nunca mostrar todas las tabs como inactivas.
4. **Indicador bottom-only.** El indicador activo es `border-bottom`, nunca `background` completo.
5. **Tabs no son botones.** No usar `<Button>` para tabs — usar `<button>` directo con clases de tab.
6. **Mobile: scroll horizontal.** En mobile, las tabs se desplazan horizontalmente si no caben.
7. **No íconos en tabs.** Solo texto — nunca combinar ícono + texto en una tab.
8. **Accesibilidad.** La tab activa tiene `aria-selected="true"`, las inactivas `aria-selected="false"`.

---

## 6.9 Tooltips

Todos iguales.

### 6.9.1 Tooltip Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` |
| Background | `bg-ink` |
| Color | `text-paper` |
| Font | `font-mono`, 0.625rem (10px), 500 weight |
| Padding | `px-2 py-1` |
| Position | `absolute`, `z-50` |
| Shadow | Ninguno — brutalista sin sombras |
| Arrow | Ninguno — brutalista sin adornos |
| Transition | `opacity 150ms ease, transform 150ms ease` |
| Default opacity | `0` — invisible hasta hover/focus |
| Active opacity | `1` — visible |

### 6.9.2 Posiciones

| Posición | Clase |
|----------|-------|
| Top | `bottom-full left-1/2 -translate-x-1/2 mb-2` |
| Bottom | `top-full left-1/2 -translate-x-1/2 mt-2` |
| Left | `right-full top-1/2 -translate-y-1/2 mr-2` |
| Right | `left-full top-1/2 -translate-y-1/2 ml-2` |

### 6.9.3 Trigger

| Trigger | Uso |
|---------|-----|
| Hover | `group-hover:opacity-100` en tooltip, `group` en trigger |
| Focus | `focus:opacity-100` en tooltip, `focus` en trigger |
| Click | `onClick` toggle — para tooltips en mobile |

### 6.9.4 Reglas de uso de tooltips

1. **Un tooltip a la vez.** Nunca mostrar múltiples tooltips simultáneamente.
2. **Solo texto.** Tooltips contienen texto plano — nunca HTML, íconos, o contenido rico.
3. **Max 20 caracteres.** Un tooltip debe ser una sola frase corta.
4. **No en móvil.** En touch devices, los tooltips se activan por click, no por hover.
5. **Accesibilidad.** El trigger tiene `aria-label` que coincida con el contenido del tooltip.
6. **No bloquea interacción.** El tooltip no recibe click — solo el trigger es interactivo.
7. **Consistente.** Todos los tooltips en la app tienen el mismo diseño — misma fuente, mismo padding, mismo color.

---

## 6.10 Modales

Mismo ancho. Misma sombra. Misma animación.

### 6.10.1 Modal Base

| Propiedad | Valor |
|-----------|-------|
| Overlay | `fixed inset-0 bg-ink/50 z-50` |
| Container | `fixed inset-0 z-50 flex items-center justify-center p-4` |
| Dialog | `bg-[var(--color-background)] w-full max-w-lg` |
| Radio | `rounded-none` en todo |
| Shadow | Ninguno — brutalista, sin elevación |
| Border | `1px solid var(--color-border)` |
| Padding | `p-6` |
| Max-height | `max-h-[90vh]` |
| Overflow | `overflow-y-auto` si el contenido es largo |

### 6.10.2 Misma sombra

**Regla:** Los modales en Molino NO tienen sombra — `shadow-none`. La elevación se comunica con el overlay (`bg-ink/50`), no con `box-shadow`. Esto es consistente con el brutalismo del sistema donde la sombra no se usa para indicar profundidad.

### 6.10.3 Misma animación

| Evento | Animación |
|--------|-----------|
| Apertura | `opacity: 0 → 1` + `scale: 0.98 → 1` en `200ms ease` |
| Cierre | `opacity: 1 → 0` + `scale: 1 → 0.98` en `150ms ease` |
| Overlay | `opacity: 0 → 1` en `200ms ease` |
| Enter (mobile) | Slide up desde `translate-y-full → translate-y-0` en `300ms ease` |
| Exit (mobile) | Slide down `translate-y-0 → translate-y-full` en `200ms ease` |

**No usar** animaciones de bounce,弹性, o spring — solo opacity y scale lineal. El movimiento es sutil y rápido.

### 6.10.4 Mismo ancho

| Contexto | Ancho |
|----------|-------|
| Desktop | `max-w-lg` (32rem / 512px) |
| Mobile | `w-full` (100vw con padding) |
| Formulario | `max-w-lg` |
| Detalle | `max-w-xl` (36rem / 576px) |
| Confirmación | `max-w-sm` (24rem / 384px) |

**Regla:** Todos los modales usan `max-w` fijo — no responsive width que cambia el diseño del contenido. En mobile, el modal ocupa el 100% del viewport con padding.

### 6.10.5 Estructura del modal

| Elemento | Posición | Descripción |
|----------|----------|-------------|
| Overlay | Fondo del viewport | `bg-ink/50`, click para cerrar |
| Dialog | Centro del viewport | Contenedor principal |
| Header | Parte superior | Título del modal (`font-heading text-lg text-ink`) |
| Body | Medio | Contenido scrollable (`overflow-y-auto`) |
| Footer | Parte inferior | Botones de acción (`flex gap-3 justify-end`) |
| Botón cerrar | Top-right | Icono `X` con `btn-ghost size="sm"` |

### 6.10.6 Reglas de uso de modales

1. **Un modal a la vez.** No apilar modales.
2. **Overlay es clickeable.** Click en el overlay cierra el modal — es expectativa del usuario.
3. **Escape cierra.** La tecla `Escape` cierra el modal — accesibilidad.
4. **Body no scroll si cabe.** Si todo el contenido cabe en pantalla, no hacer scroll interno.
5. **Footer siempre al final.** Los botones de acción van en el footer del modal, nunca flotantes.
6. **CTA primario a la derecha.** El botón principal de acción va a la derecha del footer, secundario a la izquierda.
7. **No usar modales para navegación.** Un modal no cambia la ruta — es para ver/completar una tarea puntual.
8. **Mismo ancho y sombra.** Todos los modales siguen las mismas reglas de ancho y sombra — consistencia brutalista.
9. **Misma animación.** Todos los modales usan las mismas animaciones de apertura/cierre — consistencia visual.

---

## 6.11 Skeletons

Todos consistentes. No distintos en cada página.

### 6.11.1 Skeleton Base

| Propiedad | Valor |
|-----------|-------|
| Radio | `rounded-none` — brutalista |
| Background | `bg-ink/[0.04]` — gris muy claro |
| Animation | `animate-pulse` — pulso suave |
| Duration | `duration-700ms` — lento, no agresivo |
| Iteration | `infinite` — pulso continuo mientras carga |

### 6.11.2 Variantes de Skeleton

| Variante | Altura | Uso |
|----------|--------|-----|
| `text` | `h-4` (1rem) | Línea de textoPlaceholder |
| `title` | `h-6` (1.5rem) | Título placeholder |
| `heading` | `h-8` (2rem) | Encabezado placeholder |
| `button` | `h-10` (2.5rem) | Botón placeholder |
| `card` | `h-32` (8rem) | Card placeholder |
| `avatar` | `w-10 h-10 rounded-full` | Avatar placeholder |
| `circle` | `w-12 h-12 rounded-full` | Icono placeholder circular |
| `image` | `aspect-video` | Imagen placeholder |

### 6.11.3 Reglas de consistencia

1. **Todos los skeletons usan la misma animación** (`animate-pulse`, `duration-700ms`).
2. **Todos usan el mismo background** (`bg-ink/[0.04]`).
3. **No personalizar skeletons por página.** Si una página necesita un skeleton diferente, usar las variantes base con diferentes alturas — no crear estilos de skeleton nuevos.
4. **Radio consistente.** Todas las skeleton shapes usan `rounded-none` — nunca `rounded-full` para no-circle variants.
5. **No usar gradiente.** Nunca agregar `bg-gradient-to-r` sobre el skeleton — es un error común que rompe la consistencia brutalista.
6. **Altura predecible.** Cada variante tiene una altura fija que no cambia — la página tiene el mismo layout mientras carga que cuando carga.
7. **No skeleton de íconos.** Si un ícono está cargando, usar `bg-ink/[0.04]` en un círculo — no un skeleton de icon shape específico.

---

## 6.12 Empty States

Muy importantes. No poner "No hay datos." Explicar. Guiar. Dar siguiente paso.

### 6.12.1 Empty State Base

| Propiedad | Valor |
|-----------|-------|
| Layout | Flex column, `items-center`, `justify-center`, `text-center` |
| Spacing | `gap-4` entre elementos |
| Padding | `py-12 px-6` — mucho espacio vertical, respira |
| Max-width | `max-w-sm` — limitar el ancho para legibilidad |
| Margin | `mx-auto` — centrar horizontalmente |

### 6.12.2 Estructura del Empty State

| Elemento | Descripción |
|----------|-------------|
| Icono | Un ícono grande (`w-16 h-16`) en `text-muted` — nunca color fuerte |
| Título | `font-heading text-lg text-ink` — el título es la frase principal |
| Descripción | `font-mono text-sm text-muted` — explica por qué está vacío |
| Acción | Un botón o enlace — el "siguiente paso" |

### 6.12.3 No poner "No hay datos."

La frase "No hay datos" nunca aparece en un Empty State de Molino. Las alternativas son frases que:
- **Explican** por qué está vacío (contexto)
- **Guiar** al usuario qué hacer a continuación (acción)
- **Dan el siguiente paso** (CTA claro)

| En lugar de | Reemplazar con |
|-------------|----------------|
| "No hay datos" | "Todavía no has explorado tus afinidades." |
| "No hay datos" | "Comenzá creando tu primer mapa." |
| "Sin resultados" | "No encontramos coincidencias con esos filtros." |
| "Lista vacía" | "Agregá tu primera afinidad para verla aquí." |
| "No hay elementos" | "Cargá tu primera lectura para continuar." |

### 6.12.4 CTA obligatorio

Cada Empty State debe tener exactamente un CTA que sea el siguiente paso lógico. El CTA nunca es "Volver" o "Cerrar" — siempre es "Empezar", "Crear", "Explorar", o similar.

| Contexto | CTA recomendado |
|----------|-----------------|
| Sin afinidades | "Agregar afinidad →" |
| Sin mapas | "Crear mi mapa →" |
| Sin lecturas | "Explorar la biblioteca →" |
| Sin energía diaria | "Ver energía de hoy →" |
| Sin resultados de búsqueda | "Limpiar filtros" |

### 6.12.5 Reglas de uso de Empty States

1. **Explicar, no solo informar.** La descripción debe dar contexto de por qué está vacío — no solo decir que está vacío.
2. **Guiar con el CTA.** El CTA es el "siguiente paso" — el usuario llega al empty state y sabe qué hacer después.
3. **Nunca "No hay datos".** Es la peor frase possible en un empty state — reemplazar siempre con una frase útil.
4. **Icono como soporte visual.** El ícono es decorativo — ayuda a dar contexto visual sin competir con el texto.
5. **Max una columna.** El empty state es una columna centrada — no grid, no sidebar.
6. **Mucho espacio.** El padding vertical (`py-12`) es el doble del padding normal — el espacio comunica "aquí va a haber algo".
7. **Consistente en toda la app.** Todos los empty states siguen la misma estructura (icono → título → descripción → CTA).
8. **No usar illustration.** No ilustraciones, imágenes o Lottie — solo icono + texto + CTA. El brutalismo no admite decoración ilustrativa.

---

## 6.13 Error States

También diseñados. No solo texto rojo.

### 6.13.1 Error State Base

| Propiedad | Valor |
|-----------|-------|
| Layout | Flex column, `items-center`, `text-center` |
| Spacing | `gap-4` |
| Padding | `py-8 px-6` |
| Max-width | `max-w-sm` |
| Margin | `mx-auto` |

### 6.13.2 No solo texto rojo

Un Error State no es solo "texto rojo + mensaje de error". Tiene estructura y acciones:

| Elemento | Descripción |
|----------|-------------|
| Icono | `w-12 h-12` en `text-error` — ícono de error (alert triangle o similar) |
| Título | `font-heading text-base text-ink` — "Algo salió mal" o similar |
| Descripción | `font-mono text-sm text-muted` — explica qué pasó |
| Acción principal | Botón para reintentar o volver — `btn-primary` |
| Acción secundaria | Link para ignorar o cancelar — `btn-ghost` o `btn-link` |

### 6.13.3 Tipos de Error State

| Tipo | Uso | Acción |
|------|-----|--------|
| **Network error** | Sin conexión, timeout | "Reintentar" + "Verificar conexión" |
| **Validation error** | Formulario con campos inválidos | "Corregir errores" + scroll al primer error |
| **Permission error** | Usuario sin acceso | "Solicitar acceso" + contacto de soporte |
| **Unexpected error** | Error genérico del servidor | "Reintentar" + "Contactar soporte" |
| **Empty result** | Búsqueda sin resultados | "Limpiar filtros" + "Explorar todo" |

### 6.13.4 Reglas de uso de Error States

1. **No solo rojo.** El error state tiene estructura completa — ícono, título, descripción, acciones. Nunca solo texto rojo.
2. **Acción principal siempre.** Nunca un error state sin CTA — el usuario necesita saber qué hacer después de un error.
3. **Acción secundaria opcional.** Un link de soporte o cancelar es opcional pero recomendado.
4. **No culpar al usuario.** El mensaje debe ser neutral — "Algo salió mal" no "Tú hiciste algo mal".
5. **Retry es siempre la acción principal.** El primer CTA es siempre reintentar la acción fallida.
6. **Consistente en toda la app.** Todos los error states siguen la misma estructura visual.
7. **No crash.** Un error state es la recuperación visual de un error — nunca dejar que el error se manifieste como crash de la UI.
8. **Accesible.** El error state tiene `role="alert"` y el título tiene `aria-live="assertive"` para lectores de pantalla.

---

## 6.14 Motion

Cada componente necesita reglas. Hover · Press · Focus · Reveal · Loading · Exit.

### 6.14.1 Hover

| Componente | Clase | Timing |
|------------|-------|--------|
| Button (primary) | `hover:bg-accent` | `duration-200 ease` |
| Button (secondary) | `hover:border-accent hover:text-accent` | `duration-200 ease` |
| Button (ghost) | `hover:text-foreground hover:bg-ink/[0.03]` | `duration-200 ease` |
| Button (danger) | `hover:bg-error/90` | `duration-200 ease` |
| Button (link) | `hover:text-accent/80 hover:underline` | `duration-200 ease` |
| Button (icon) | `hover:bg-ink/[0.03] hover:text-foreground` | `duration-200 ease` |
| Button (fab) | `hover:bg-accent/90 hover:scale-105 hover:shadow-xl` | `duration-300 ease` |
| Card (interactive) | `hover:border-accent hover:bg-ink/[0.02]` | `duration-200 ease` |
| Chip (interactive) | `hover:border-accent` | `duration-200 ease` |
| Tab | `hover:bg-ink/[0.03]` | `duration-200 ease` |
| Badge (no status) | `hover:bg-ink/[0.08]` | `duration-200 ease` |

**Regla.** Hover es `background-color` o `opacity` change — nunca `transform` en hover (excepto FAB que escala). Transiciones siempre `200ms ease`.

### 6.14.2 Press

| Componente | Clase | Timing |
|------------|-------|--------|
| Button | `whileTap={{ scale: 0.95 }}` (framer-motion) | `duration-100` |
| Button (icon/fab) | `whileTap={{ scale: 0.90 }}` | `duration-100` |
| Chip (interactive) | `whileTap={{ scale: 0.95 }}` | `duration-100` |
| Card (interactive) | `whileTap={{ scale: 0.98 }}` | `duration-100` |

**Regla.** Press es `scale` — nunca `opacity` o `background-color`. El mientras se mantiene presionado da feedback táctil. Todos duran 100ms.

### 6.14.3 Focus

| Componente | Clase |
|------------|-------|
| Button | `focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2` |
| Button (fab) | `focus:ring-accent/40 focus:ring-offset-2` |
| Button (link) | `focus:ring-accent/40 focus:ring-offset-0` |
| Input | `focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20` |
| Tab | `focus:ring-2 focus:ring-accent/20 focus:ring-offset-1` |
| Chip (interactive) | `focus:ring-2 focus:ring-accent/20 focus:ring-offset-1` |
| Modal | `focus:outline-none` (focus dentro del modal no sale) |

**Regla.** Focus siempre usa `ring-accent` — el color de acento es el color de foco universal del sistema. Nunca usar `outline` directamente, siempre usar `focus:ring`.

### 6.14.4 Reveal

Animación de entrada para componentes que aparecen en el viewport.

| Componente | Clase | Timing |
|------------|-------|--------|
| Sección | `fadeUp` con `whileInView={{ opacity: 1, y: 0 }}` | `duration-500 ease` |
| Card | `fadeUp` con delay individual | `duration-400 ease` |
| Badge | `fadeUp` con stagger de `0.05s` between items | `duration-300 ease` |
| Chip | `fadeUp` con stagger de `0.03s` | `duration-300 ease` |

**Regla de stagger.** Los items dentro de una lista se animan con 30-50ms de delay entre cada uno — crea una cascada visual sutil que guíe la atención.

### 6.14.5 Loading

| Componente | Comportamiento |
|------------|----------------|
| Button | `loading={true}` → spinner + disabled automático + `aria-busy="true"` |
| Skeleton | `animate-pulse` + `bg-ink/[0.04]` mientras carga |
| Card | `Skeleton` placeholder con misma altura que el card cuando carga |
| Modal | Spinner en el centro del modal mientras carga contenido |
| Tabs | Skeleton en el panel de contenido si la tab aún no ha cargado |
| Dropdown | Skeleton en el menu while opções load |

**Regla.** Loading states son skeleton y spinner — nunca `opacity: 0.5` crudo en un componente que debería ser skeleton. El skeleton comunica "hay contenido que viene" mejor que un elemento semi-transparente.

### 6.14.6 Exit

| Componente | Comportamiento |
|------------|----------------|
| Modal | `opacity: 0` + `scale: 0.98` en `150ms ease` al cerrar |
| Toast/Notification | `opacity: 0` + `translate-x-full` en `200ms ease` al dismiss |
| Dropdown | `opacity: 0` en `100ms ease` al cerrar |
| Tooltip | `opacity: 0` en `150ms ease` al quitar hover/focus |
| Skeleton | Fade out a contenido real en `300ms ease` tras load |

**Regla.** Exit animations son `opacity` + opcional `scale/translate`. Nunca `height`, `width`, o `margin` en exit — solo opacidad y posición.

### 6.14.7 Motion del sistema

| Motion | Componentes | Timing |
|--------|-------------|--------|
| `fadeUp` | Secciones, cards, badges, chips | `opacity 0→1, y 20→0` |
| `scalePress` | Buttons, chips, interactive cards | `scale 1→0.95` |
| `scaleHover` | FAB | `scale 1→1.05` |
| `fadeIn` | Modals, dropdowns, tooltips | `opacity 0→1` |
| `slideUp` | Modals mobile | `translateY full→0` |
| `pulse` | Skeletons | `opacity 0.4→1` |
| `spin` | Loading spinner | `rotate 0→360` |
| `stagger` | List items | `delay 30-50ms per item` |

---

## 8. Inventario de componentes existentes

### 8.1 Componentes UI existentes (Fase 3 implementados)

| Componente | Archivo | Estado |
|------------|---------|--------|
| `<Button>` | `components/ui/Button.tsx` | ✅ Con `primary`, `secondary`, `ghost`, `loading`, `disabled` |
| `<Breadcrumbs>` | `components/ui/Breadcrumbs.tsx` | ✅ Nuevo, creado en Fase 3 |
| `<EmptyState>` | `components/ui/EmptyState.tsx` | ✅ Existente, integrado en 6 páginas en Fase 3 |
| `<Card>` | `components/ui/Card.tsx` | ✅ Con `sm` padding `p-6` |
| `<Skeleton>` | `components/ui/Skeleton.tsx` | ✅ Existente |
| `<LoadingState>` | `components/ui/LoadingState.tsx` | ✅ Existente |
| `<Section>` | `components/ui/Section.tsx` | ✅ Existente |
| `<MotionProvider>` | `components/ui/MotionProvider.tsx` | ✅ Existente |
| `<ScrollProgress>` | `components/ui/ScrollProgress.tsx` | ✅ Existente |
| `<ScrollDatePicker>` | `components/ui/ScrollDatePicker.tsx` | ✅ Existente |
| `<DateInput>` | `components/ui/DateInput.tsx` | ✅ Existente |
| `<DatePicker>` | `components/ui/DatePicker.tsx` | ✅ Existente |
| `<CountUp>` | `components/ui/CountUp.tsx` | ✅ Existente |
| `<AffinityScoreGauge>` | `components/ui/AffinityScoreGauge.tsx` | ✅ Existente |
| `<MolinoInterpretation>` | `components/ui/MolinoInterpretation.tsx` | ✅ Existente |
| `<Icons>` | `components/ui/Icons.tsx` | ✅ Existente |
| `<AnimatedLayout>` | `components/ui/AnimatedLayout.tsx` | ✅ Existente |

### 8.2 Por implementar (Fase 6 — variantes y familias)

#### Botones — por agregar

| Variante | Componente `<Button>` | Clase CSS `btn-*` |
|----------|------------------------|---------------------|
| `danger` | ❌ Por agregar | ❌ Por definir |
| `link` | ❌ Por agregar | ❌ Por definir |
| `icon` | ❌ Por agregar | ❌ Por definir |
| `fab` | ❌ Por agregar | ❌ Por definir |

#### Estados CSS PENDIENTES para `btn-*`

| Estado | `.btn-primary` | `.btn-accent` | `.btn-ghost` | `.btn-danger` | `.btn-link` | `.btn-icon` | `.btn-fab` |
|--------|----------------|---------------|--------------|---------------|-------------|-------------|------------|
| **Hover** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Loading** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Active** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### Cards — familia por definir

| Variante | Estado |
|----------|--------|
| `base` | ⬜ Por definir en diseño |
| `highlight` | ⬜ Por definir en diseño |
| `interactive` | ⬜ Por definir en diseño |
| `metric` | ⬜ Por definir en diseño |
| `preview` | ⬜ Por definir en diseño |

#### Inputs — familia unificada por definir

| Tipo | Estado |
|------|--------|
| Input unificado (Text/Date/Select/Autocomplete/Search/Textarea) | ⬜ Por definir y crear componente `<Input>` |

### 8.3 Orden de implementación recomendado

1. `danger` variant en `<Button>` (impacto alto en formularios con destrucción)
2. `link` variant en `<Button>` (necesario para acciones secundarias en forms)
3. `icon` variant en `<Button>` (necesario para filas de tabla y acciones compactas)
4. `fab` variant en `<Button>` (necesario para el CTA principal de nueva creación)
5. `.btn-danger` CSS class en `globals.css` (paralelo al componente React)
6. `.btn-link` CSS class en `globals.css`
7. `.btn-icon` CSS class en `globals.css`
8. `.btn-fab` CSS class en `globals.css`
9. Loading + Active states para `btn-*` CSS classes
10. `<Input>` component unificado (bloque base de todos los formularios)
11. Card familia: `base`, `highlight`, `interactive`, `metric`, `preview` (definir estilos)
12. Migración de botones inline al sistema `<Button>` o `btn-*`

---

## 9. Notas de integración

### 9.1 Dual system (React + CSS)

El sistema tiene dos formas de definir botones:

1. **`<Button>` component** (`components/ui/Button.tsx`) — para CTAs en cards, forms, modals, navegación interna. Usa Tailwind classes inline.
2. **`btn-*` CSS classes** (`app/globals.css`) — para CTAs editoriales en secciones de texto largo (hero, banners, CTA final seccional). Usa CSS variables custom properties.

**Regla:** Una página no mezcla `<Button>` con `btn-*` en el mismo contexto. Elegir uno.

### 9.2 Migración planificada

| Actual | Futuro | Nota |
|--------|--------|------|
| `<Button variant="primary">` solo | `<Button variant="primary">` + variantes `danger`, `link`, `icon`, `fab` | Expandir variantes |
| `btn-*` CSS sin `danger`/`link`/`icon`/`fab` | Agregar `.btn-danger`, `.btn-link`, `.btn-icon`, `.btn-fab` | Expandir clases CSS |
| Botones inline sin componente | Convertir a `<Button>` o `btn-*` | Eliminar botones `<button>` ad-hoc |
| `loading` solo en `<Button>` | Agregar loading + active states a `btn-*` CSS | Paralelo CSS |
| No active/tap states en CSS | Agregar `:active` states a `btn-*` | Paralelo CSS |

### 9.3 Design tokens de color para botones

| Token | Valor CSS variable | Uso en botones |
|-------|-------------------|----------------|
| `--color-ink` | Negro | `primary` bg, `btn-primary` bg |
| `--color-paper` | Off-white | `primary` fg, `btn-primary` fg |
| `--color-accent` | Naranja | Hover bg, focus ring, accent buttons |
| `--color-accent-foreground` | Off-white | Hover fg, accent foreground |
| `--color-muted` | Gray | Ghost fg, muted text |
| `--color-foreground` | Negro | Ghost hover fg |
| `--color-border` | Light gray | Secondary border, input border |
| `--color-error` | Red | Danger bg |
| `--color-error-foreground` | Off-white | Danger fg |
| `--color-background` | Off-white | Input bg, card bg |
| `--color-ink-alpha-03` | rgba(26,26,26,0.03) | Ghost hover bg |

---

*Sistema de Componentes — Fase 6. Define variantes, estados y familias para cada componente. No crear componentes ad hoc — usar los definidos aquí. Ampliar secciones según sea necesario para cada nuevo componente.*
