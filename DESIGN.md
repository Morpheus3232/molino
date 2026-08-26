# DESIGN.md — Sistema de Diseño y Contrato Visual de Molino.app

**Versión:** 2.0 (Almanaque Cálido & Geometría Determinística)  
**Idioma:** Español rioplatense (`lang="es-AR"`, vos)  
**Última actualización:** 2026-08-26  

---

## 1. Filosofía de Diseño & Principios Guía

Molino es una aplicación simbólica de autoconocimiento estructurado (numerología, astrología y zodíaco chino) construida bajo el principio de **honestidad radical**.

### Principios Fundamentales
1. **Método Visible (Sin Cajas Negras):** Cada número, arquetipo y clasificación muestra su fórmula o regla de cálculo comprobable. El usuario ve la aritmética; el sistema no actúa como oráculo misterioso.
2. **Determinismo Absoluto:** Misma fecha de nacimiento = exactamente los mismos resultados y el mismo entramado geométrico (`PersonalSigil`, `PersonalSynergySigil`). Todo el cálculo ocurre en la CPU local del navegador del usuario sin backend ni base de datos.
3. **Estructura Filosa, Detalle Suave:** Las divisiones macro del layout, secciones full-bleed y grillas son filosas (`rounded-none`). Los elementos táctiles (botones, tarjetas, inputs, badges) son suaves y amables (`--radius-sm/md/lg/xl`).
4. **El País Ordena, Nunca Puntúa:** En afinidades, el país del usuario prioriza qué ve primero (hasta 3 entidades locales), pero no modifica la casilla ni el puntaje intrínseco.
5. **Silencio ante la Duda:** Si una entidad histórica o de marca no tiene fecha exacta documentada con día y mes (crítico para el corte del Año Nuevo Chino entre el 21 de enero y 21 de febrero), no se inventa: se excluye o se lista transparentemente en *"Todavía sin fecha exacta"*.
6. **Dos Páginas, Dos Preguntas:**
   - `/profile` ("Mi Mapa") responde: *¿Dónde toca el mundo mi signo?*
   - `/lectura` responde: *¿Qué significa mi configuración arquetípica?*

---

## 2. Design Tokens Unificados

### 2.1 Paleta de Colores Semánticos

El sistema se basa en la estética editorial de **Almanaque Cálido** con contrastes auditados bajo fórmula WCAG (AA/AAA).

| Token | CSS Variable | HEX | Formato RGB Tailwind | Contraste / Uso |
|---|---|---|---|---|
| **Ink** | `--color-ink` | `#1D1B17` | `29 27 23` | Texto principal, marca, fondo full-bleed de Mapa Aplicado (15.7:1 sobre Paper). |
| **Paper** | `--color-paper` | `#F7F4EE` | `247 244 238` | Superficie clara principal (background). |
| **Paper Alt / Card** | `--color-paper-alt` | `#EFEAE0` | `239 234 224` | Tarjetas, contenedores interiores, bloques de fórmula. |
| **Border** | `--color-border` | `#DEDACE` | `222 218 206` | Líneas divisorias de 1px en superficies claras. |
| **Muted** | `--color-muted` | `#6A6459` | `106 100 89` | Texto secundario, overlines, metadata técnica (5.3:1 sobre Paper). |
| **Accent Primary** | `--color-accent` | `#A83A23` | `168 58 35` | Terracota editorial: Camino de Vida, CTAs principales, alertas de tensión (5.8:1 sobre Paper). |
| **Accent Light** | `--color-accent-light` | `#D9805F` | `217 128 95` | Acento luminoso para lectura sobre fondos oscuros (`bg-ink`). |
| **Gold** | `--color-gold` | `#F5B022` | `245 176 34` | Acento dorado para CTAs de alta urgencia, Zodíaco Chino y nodos de resonancia. |
| **Success** | `--color-success` | `#1F7A4D` | `31 122 77` | Sinergias armónicas, afinidades naturales y confirmaciones. |
| **Warning** | `--color-warning` | `#8A5B00` | `138 91 0` | Desafíos de ritmo, puntos de atención consciente (4.6:1 sobre Paper). |
| **Error** | `--color-error` | `#B3261E` | `179 38 30` | Validaciones de formulario y errores de rango. |

---

### 2.2 Escala Tipográfica Cerrada

No se utilizan tamaños arbitrarios fuera de la escala.

| Nivel | Token / Utility | Tamaño | Line-Height | Familia | Uso |
|---|---|---|---|---|---|
| **Display** | `--step-8` / `text-7xl` | 4.5rem (72px) | 0.85 | `--font-display` (Newsreader / Archivo) | Grandes números y títulos hero de perfil. |
| **H1** | `--step-6` / `text-5xl` | 3.0rem (48px) | 0.90 | `--font-display` | Títulos principales de página y onboarding. |
| **H2** | `--step-5` / `text-4xl` | 2.25rem (36px) | 1.00 | `--font-display` | Encabezados de secciones principales. |
| **H3** | `--step-4` / `text-3xl` | 1.75rem (28px) | 1.10 | `--font-heading` (Space Grotesk) | Títulos de dominios y bloques de afinidad. |
| **H4** | `--step-3` / `text-xl` | 1.25rem (20px) | 1.20 | `--font-heading` (Space Grotesk) | Títulos de tarjetas y nombres de entidades. |
| **Body Large** | `--step-2` / `text-lg` | 1.125rem (18px) | 1.60 | `--font-sans` (Inter) | Párrafos introductorios destacados. |
| **Body** | `--step-1` / `text-base` | 1.0rem (16px) | 1.60 | `--font-sans` (Inter) | Cuerpo de lectura y descripciones. |
| **Caption** | `text-sm` | 0.875rem (14px) | 1.50 | `--font-sans` (Inter) | Notas de pie, explicaciones secundarias. |
| **Overline / Label** | `text-xs` | 0.75rem (12px) | 1.00 | `--font-mono` (JetBrains Mono) | Badges técnicos, pasos de cálculo (`tracking-[0.2em]`). |

---

### 2.3 Escala Modular de Espaciado (Múltiplos de 8px)

```css
--space-xs:  0.5rem;   /* 8px  → p-2, gap-2 */
--space-sm:  0.75rem;  /* 12px → p-3, gap-3 */
--space-md:  1.0rem;   /* 16px → p-4, gap-4 */
--space-lg:  1.5rem;   /* 24px → p-6, gap-6 */
--space-xl:  2.0rem;   /* 32px → p-8, gap-8 */
--space-2xl: 3.0rem;   /* 48px → p-12, gap-12 */
--space-3xl: 4.0rem;   /* 64px → p-16, gap-16 */
--space-4xl: 6.0rem;   /* 96px → p-24 */
```

---

### 2.4 Sistema de Radios (Estricto: 4 Tokens)

**PROHIBIDO:** Usar `rounded-2xl` o `rounded-3xl` (defaults de Tailwind que caen fuera de la proporción).

```css
--radius-sm: 0.375rem; /* 6px  → chips, badges, tags, píldoras técnicas */
--radius-md: 0.625rem; /* 10px → botones, inputs, tarjetas chicas */
--radius-lg: 0.875rem; /* 14px → modales, tarjetas medianas, bloques de pilares */
--radius-xl: 1.25rem;  /* 20px → contenedores destacados, tarjetas SVG, hero cards */
```

---

### 2.5 Sombras ("Papel Levantado")

Sombra sutil con tinte cálido marrón (`rgba(29, 27, 23, ...)`), sin halos fríos ni blur artificial excesivo:
- `--shadow-sm`: `0 1px 2px rgba(29, 27, 23, 0.06)`
- `--shadow-md`: `0 2px 6px rgba(29, 27, 23, 0.08)`
- `--shadow-lg`: `0 4px 12px rgba(29, 27, 23, 0.10)`
- `--shadow-xl`: `0 8px 24px rgba(29, 27, 23, 0.12)`

---

### 2.6 Sistema de Movimiento & Curvas de Animación

| Interacción | Duración | Easing | Propósito |
|---|---|---|---|
| **Micro-interacciones** (hover, tap) | `150ms` | `easeOut` | Feedback táctil inmediato. |
| **Despliegues** (acordeones, tabs) | `250ms` | `easeOut` | Fluidez sin lentitud de espera. |
| **Entradas de panel / modales** | `350ms` | `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-editorial`) | Entrada amortiguada editorial. |
| **Flip numérico en Loader** | `380ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Rotación física de dígitos de cálculo. |
| **Reducción Teosófica completa** | `3.4s` | Sincronizado | 3 etapas (1.2s, 2.2s, 3.4s). |
| **Marquee Ambiental** | `45s` | `linear infinite` | Fondo continuo sin distraer la lectura. |

**Regla de Accesibilidad:** Si `prefers-reduced-motion: reduce` está activo, todas las animaciones se detienen o concluyen en `< 500ms` sin saltos perceptibles.

---

## 3. Catálogo de Componentes Clave

### 3.1 `PersonalSigil` (`components/ui/PersonalSigil.tsx`)
- **Descripción:** Generador determinístico de onda armónica en SVG puro (<2KB).
- **Entrada:** `(lifePath, birthDay, birthMonth)`.
- **Renderizado:** Usa `stroke="currentColor"` y `fill="currentColor"`. Hereda color del contexto (opacidad `0.08` en fondo claro, `0.3` en modo sinergia).

### 3.2 `PersonalSynergySigil` (`components/ui/PersonalSynergySigil.tsx`)
- **Descripción:** Patrón de interferencia armónica de pareja (<4KB).
- **Capas:**
  1. *Sello A y Sello B:* Polos desfasados en opacidad 0.32.
  2. *Zonas de Tensión:* Arcos transversales terracota (`#A83A23`, stroke 2.2px).
  3. *Zonas de Resonancia:* Nodos dorados concéntricos (`#F5B022`).
  4. *Envoltura de Afinidad:* Óvalo Cassini punteado (`strokeOpacity="0.22"`).
  5. *Leyenda mínima:* `"Afinidad · Tensión · Resonancia"`.

### 3.3 `MethodReductionLoader` (`components/ui/MethodReductionLoader.tsx`)
- **Descripción:** Loader interactivo que muestra el cálculo teosófico aritmético paso a paso en lugar de un spinner genérico.
- **Tokens:** `bg-paper`, `border-border`, `text-ink`, `text-accent`, `bg-paper-alt`, `rounded-xl`.
- **Accesibilidad:** Anuncio vía `aria-live="polite"` y descripción completa en `sr-only`.

### 3.4 `AtlasShareCardSVG` (`components/atlas/AtlasShareCardSVG.tsx`)
- **Descripción:** Tarjeta vectorial exportable de 1080×1900px optimizada para Web Share y PNG de alta definición.
- **Pilares:**
  - *Pilar I (Numerología):* Título `text-ink`, número en `text-accent` (`#A83A23`).
  - *Pilar II (Zodíaco Chino):* Título `text-ink`, rama terrestre en `text-gold` (`#F5B022`).
  - *Pilar III (Astrología):* Título `text-muted`, glifo solar en `text-accent`.

### 3.5 `Button` (`components/ui/Button.tsx`)
- **Variantes:** `primary` (bg-ink text-paper), `accent` (bg-accent text-paper), `secondary` (border-border hover:border-accent), `gold` (bg-gold text-gold-foreground), `ghost` (transparente text-muted).
- **Estados:** `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`, `active:scale-95`, `disabled:opacity-50`. Altura táctil mínima de `44px`.

### 3.6 `DateInput` (`components/ui/DateInput.tsx`)
- **Formato:** DD / MM / YYYY con auto-avance, auto-corrección de días según mes/año y reporte de campo incompleto sin bloquear el teclado nativo.
- **Accesibilidad:** Labels semánticos asociados con `htmlFor`, `inputMode="numeric"`, `pattern="\d*"`.

---

## 4. Patrones de Composición & Jerarquía Visual

### Orden Visual del Ojo en Pantalla
1. **Punto Focal Primario:** Número clave / Arquetipo en Display serif/heading + CTA principal.
2. **Contexto Secundario:** Lectura breve de orientación e implicancia cotidiana.
3. **Comprobación Terciaria:** Fórmula explícita, fecha exacta de origen o regla del ciclo (tres casillas).
4. **Capa Ambiental:** Sello personal en filigrana (`opacity: 0.08`), líneas de constelación sutiles.

### Manejo de Estados
- **Carga:** Skeleton determinístico (`bg-ink/5` o `bg-paper-alt border border-border/40`) con la misma forma geométrica que el componente final.
- **Vacío:** Mensaje sobrio que explica por qué no hay datos (ej. cobertura pendiente) sin reproche al usuario.
- **Error:** Explicación clara en lenguaje directo y acción de reintento inmediata.

---

## 5. Checklist Pre-Deploy (Reglas de Oro)

Antes de cualquier despliegue a producción, validar:

- [ ] **Sin `rounded-2xl` ni `rounded-3xl`:** Todo radio pertenece a `rounded-none`, `sm`, `md`, `lg` o `xl`.
- [ ] **Sin HEX arbitrario en JSX:** Todos los colores provienen de las variables de Tailwind (`bg-paper`, `text-ink`, `border-border`, etc.).
- [ ] **Sin Base de Datos de Perfil:** Todo cálculo se ejecuta en el cliente; persistencia en localStorage/URL hash.
- [ ] **Accesibilidad de Teclado:** Todo link/botón responde a Tab y muestra focus ring visible.
- [ ] **Tests & Build:** `npm run typecheck`, `npm test -- --run` y `npm run build` pasan con 0 errores y 0 warnings.
