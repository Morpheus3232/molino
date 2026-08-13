# Molino Design System 2.0

**Versión:** 2.0  
**Última actualización:** Agosto 2025  
**Concepto:** Misticismo cuantificado — identidad visual premium, editorial, coherente

---

## Visión

Molino es una plataforma de autoconocimiento que **computa** sistemas simbólicos (numerología, astrología, zodíaco chino) con rigor. La identidad visual comunica:

- **Precisión**: datos cuantificados, números prominentes, jerarquía clara
- **Misticismo**: constelaciones, símbolos, profundidad, tradición  
- **Sofisticación**: editorial, premium, no genérico SaaS
- **Accesibilidad**: WCAG 2.1 AA como estándar, readable en todos los tamaños

---

## Sistema de Colores

### Base (Paleta Primaria)

```css
--color-ink: #F3F1EA;           /* texto claro, elemento principal */
--color-paper: #0A0A0C;         /* fondo oscuro, "lienzo" */
--color-paper-alt: #16161A;     /* fondo elevado, cards */
--color-border: #2A2A2E;        /* bordes, separadores sutiles */
--color-muted: #B0B0A6;         /* texto secundario (verificado ≥4.5:1) */
```

### Acentos

```css
--color-accent: #7C8CFF;        /* azul, CTAs, interactive */
--color-accent-hover: #94A0FF;  /* más claro en hover */
--color-accent-light: #AEB8FF;  /* derivado para backgrounds */
--color-gold: #F5B022;          /* dorado, CTAs premium */
--color-gold-hover: #FCC044;    /* dorado más claro */
```

### Sistémicos (Uso Restringido)

```css
--mystical-numerology: #6B4C7A;  /* 8px dot junto a nombre, nunca full-bleed */
--mystical-astrology: #2E5C8A;   /* sistemas astrológicos */
--mystical-zodiac: #C49A2A;      /* zodíaco chino */
```

### Información

```css
--color-success: #10B981;
--color-warning: #7C8CFF;
--color-error: #EF4444;
```

### Regla de Uso

**Colores sistémicos:** Solo como puntos decorativos (8px), badges con border, o text en backgrounds tenues. Nunca como fondo de sección completa ni como acento general. Documentar antes de agregar nuevos.

---

## Tipografía

### Jerarquía (Más → Menos importante)

| Nivel       | Font              | Size      | Weight | Line Height | Uso                    |
| ----------- | ----------------- | --------- | ------ | ----------- | ---------------------- |
| Display     | Archivo Black     | 96px      | 400    | 0.85        | Números grandes, hero  |
| H1          | Archivo Black     | 48px      | 400    | 1.0         | Títulos principales    |
| H2          | Archivo Black     | 36px      | 400    | 1.1         | Subtítulos            |
| H3          | Space Grotesk     | 28px      | 500    | 1.2         | Subheadings           |
| H4          | Space Grotesk     | 22px      | 500    | 1.3         | Secciones             |
| Body Large  | Inter             | 18px      | 400    | 1.6         | Párrafos destacados   |
| Body        | Inter             | 16px      | 400    | 1.6         | Párrafos normales     |
| Caption     | Inter             | 14px      | 400    | 1.5         | Metadata, subtext     |
| Label       | Space Grotesk     | 11px      | 600    | 1.0         | Badges, tags          |
| Data        | JetBrains Mono    | 14px      | 400    | 1.4         | Números, fórmulas     |

### Escala de Tamaño (CSS Variables)

```css
--step-1-text: 1rem;       /* 16px body */
--step-2-text: 1.125rem;   /* 18px body-large */
--step-3-text: 1.375rem;   /* 22px h4 */
--step-4-text: 1.75rem;    /* 28px h3 */
--step-5-text: 2.25rem;    /* 36px h2 */
--step-6-text: 3rem;       /* 48px h1 */
--step-8-text: 4.5rem;     /* 72px display */
```

### Utility Classes

```html
<h1 class="type-h1">Título principal</h1>
<h2 class="type-h2">Subtítulo</h2>
<p class="type-body-lg">Párrafo destacado</p>
<p class="type-body">Párrafo normal</p>
<span class="type-label">BADGE</span>
<code class="type-data">123</code>
```

---

## Espaciado (Spacing Scale)

```css
--space-xs: 0.5rem;     /* 8px */
--space-sm: 0.75rem;    /* 12px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
--space-4xl: 6rem;      /* 96px */
```

---

## Bordes y Radio (Brutalist + Amable)

```css
--radius-sm: 0.375rem;  /* 6px — chips, badges */
--radius-md: 0.625rem;  /* 10px — botones, inputs, cards */
--radius-lg: 0.875rem;  /* 14px — modales grandes */
--radius-xl: 1.25rem;   /* 20px — contenedores destacados */
```

**Regla editorial:** Estructura (secciones full-bleed, grillas, barras) → `rounded-none`. Detalle (botones, cards, inputs) → radius suave.

---

## Componentes Core

### Button

**Variantes:**

```tsx
<Button>Primary</Button>                    // ink bg, dark text
<Button variant="accent">Accent</Button>    // blue, interactive
<Button variant="secondary">Secondary</Button> // border, white text
<Button variant="ghost">Ghost</Button>      // transparent, muted text
<Button variant="inverse">Inverse</Button>  // paper bg, accent text
<Button variant="gold">Premium</Button>     // gold bg, dark text
```

**Tamaños:**
- `sm`: 44px min-height, small text
- `md`: 44px min-height, regular text (default)
- `lg`: 52px min-height, larger text

**Estados:** hover (opacity, bg change), active (scale 95%), disabled (opacity 50%), focus (ring accent color)

### Card

**Variantes:**

```tsx
<Card>Default card</Card>                   // border, no hover fill
<Card variant="mystical">Elevated</Card>    // raised bg, subtle accent gradient
<Card variant="accent">Interactive</Card>   // top accent line on hover
```

**Padding:** none, sm (16px), md (24px), lg (32px)

### Badge

**Variantes:**

```tsx
<Badge>Accent</Badge>                       // blue bg
<Badge variant="outline">Outline</Badge>    // border only
<Badge variant="numerology">Num</Badge>     // purple system color
<Badge variant="astrology">Ast</Badge>      // blue system color
<Badge variant="zodiac">Zod</Badge>         // gold system color
<Badge variant="gold">Premium</Badge>       // gold bg/border
```

### Dividers

```tsx
<Divider />                    // thin rule
<Divider variant="accent" />   // colored gradient rule
<Divider variant="star" />     // dot constellation separator
<Divider variant="ornament" /> // ✦ ornament separator
```

---

## Elementos Místicos

### MysticalNumber

Números grandes con carácter editorial.

```tsx
<MysticalNumber value="7" label="Camino de Vida" />
<MysticalNumber value="42" size="hero" variant="accent" />
<MysticalNumber value="88" ghost />  // muy tenue (numeral de fondo)
```

### ConstellationPattern

Patrón SVG decorativo — muy sutil, nunca compite con contenido.

```tsx
<ConstellationPattern pointCount={5} connected />
<ConstellationPattern size="lg" />
```

---

## Animaciones

### Transitions

```css
--transition-fast: 150ms ease;   // micro-interactions
--transition-base: 200ms ease;   // standard
--transition-slow: 300ms ease;   // large elements
```

### Keyframes

```css
fadeIn              /* Simple fade */
fadeInUp            /* Fade + slide up — entrada de contenido */
fadeInDown          /* Fade + slide down */
fadeInScale         /* Fade + scale — entrada elegante */
slideInLeft/Right   /* Slide lateral */
constellationReveal /* Línea dibujándose — efecto especial */
accentGlowPulse     /* Pulso sutil — hover states */
```

### Utility Classes

```html
<div class="animate-fade-in-up stagger-1">Primer elemento</div>
<div class="animate-fade-in-up stagger-2">Segundo elemento</div>

<div class="transition-smooth hover:border-accent">
  Transición suave en hover
</div>
```

---

## Dark Mode (Futuro)

Sistema actualmente en dark mode permanent. Si se agrega light mode:

```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --color-ink: #1a1a2e;          /* inverso */
    --color-paper: #f5f5f0;        /* inverso */
    /* resto de tokens invertidos */
  }
}

@media (max-width: 640px) {
  body { font-size: 0.95rem; }
}
```

---

## Accesibilidad (WCAG 2.1 AA)

### Estándar de Contraste

- **Texto normal vs fondo:** ≥4.5:1
- **Texto grande (≥18px):** ≥3:1
- **Elementos gráficos / bordes:** ≥3:1

Verificar todos los tokens de color antes de usarlos como texto.

### Focus States

```css
--focus-ring-color: var(--color-accent);  /* azul */
--focus-ring-width: 2px;
--focus-ring-offset: 2px;
```

Todos los elementos interactivos (botón, link, input) deben tener `:focus-visible` ring claramente visible.

### Navegación por Teclado

- Tab order lógico (izq→der, arriba→abajo)
- Skip link a `#main-content` funcional
- Todos los popups tienen cierre con Escape
- Buttons vs links semánticamente correctos

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
  html { scroll-behavior: auto; }
}
```

---

## Responsive Breakpoints

```css
xs: 475px   /* large phones */
sm: 640px   /* tablets */
md: 768px   /* small laptop */
lg: 1024px  /* desktop */
xl: 1280px  /* wide desktop */
```

**Regla:** Mobile-first. Definir mobile, luego agregar media queries para screens más grandes.

---

## Do's and Don'ts

### ✅ Do

- Usar CSS variables para TODOS los valores (colores, spacing, radius, shadows)
- Crear componentes reutilizables antes de repetir lógica
- Documentar nuevos tokens en este archivo
- Verificar contraste antes de usar colores como texto
- Respetar `prefers-reduced-motion`
- Mantener borders sharp, no sombras decorativas
- El molino siempre es `Logo.tsx` — nunca crear un ícono nuevo para "verse más pro"
- El giro del molino comunica estado real (carga, navegación) — nunca decorativo

### ❌ Don't

- Usar `!important` — Refactor en su lugar
- Hardcodear colores directamente en JSX (ej. `style={{ color: '#7C8CFF' }}`)
- Agregar nuevos colores sistémicos sin documentarlos primero
- Usar sombras decorativas — editorial = borders, no drop shadows
- Crear componentes de botón nuevos — extender `Button.tsx`
- Usar emoji como íconos de UI — lucide-react ya está instalado
- Sacrificar accesibilidad por estética

---

## Ejemplos de Uso

### Página con Dividers y Mystical Elements

```tsx
import { Divider } from '@/components/ui/Divider';
import { MysticalNumber } from '@/components/ui/MysticalNumber';

export default function Page() {
  return (
    <div className="container py-section">
      <h1 className="type-h1 text-center mb-space-2xl">
        Tu Número Personal
      </h1>

      <Divider variant="star" className="mb-space-3xl" />

      <div className="text-center">
        <MysticalNumber value="7" size="hero" label="Camino de Vida" />
      </div>

      <Divider variant="accent" className="my-space-3xl" />

      <p className="type-body-lg text-center max-w-content mx-auto">
        Interpretación del número siete...
      </p>
    </div>
  );
}
```

### Card con Badge y Hover States

```tsx
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ResultCard() {
  return (
    <Card variant="mystical" padding="lg">
      <div className="flex items-start justify-between mb-space-md">
        <h3 className="type-h3">Compatibilidad Astrológica</h3>
        <Badge variant="astrology">ASTROLOGÍA</Badge>
      </div>

      <Divider variant="rule" className="my-space-md" />

      <p className="type-body text-muted">
        Tu signo solar Géminis es compatible con...
      </p>
    </Card>
  );
}
```

---

## Migration Checklist (Para Actualizaciones Futuras)

- [ ] Reemplazar hardcoded colors con variables
- [ ] Convertir componentes a variantes (no crear nuevos)
- [ ] Agregar focus states a elementos interactivos
- [ ] Verificar contraste con WebAIM o Polypane
- [ ] Revisar respons iveness en 390px y 1440px
- [ ] Correr `npm run lint` y `npm run typecheck`
- [ ] Probar con `prefers-reduced-motion: reduce`
- [ ] Documentar nuevos tokens en este archivo

---

**Último revisor:** AI Assistant  
**Próxima revisión:** Cuando se agreguen nuevos componentes o cambios sistémicos
