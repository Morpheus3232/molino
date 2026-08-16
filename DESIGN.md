---
name: Molino — Almanaque Cálido
description: El molino de viento de la marca, ya existente, como protagonista funcional sobre una identidad cálida y editorial — fondo papel, tinta oscura, acento terracota, tipografía serif itálica para títulos. Gira cuando el sitio carga o navega, se queda quieto cuando está listo.
colors:
  paper: "#F5F0E4"
  paper-alt: "#EDE5D2"
  ink: "#241F17"
  muted: "#6B6252"
  border: "#E0D6C0"
  accent: "#9A4A18"
  accent-hover: "#7E3B12"
  accent-light: "#D98F52"
  sistema-numerologia: "#6B4C7A"
  sistema-astrologia: "#2E5C8A"
  sistema-zodiaco: "#85681D"
  biblioteca-libro: "#7B5E1C"
  biblioteca-articulo: "#5F6773"
  biblioteca-video: "#7C6487"
  biblioteca-sitio: "#5A7262"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontStyle: italic
    fontSize: "clamp(5rem, 14vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Space Grotesk, sans-serif"
  body:
    fontFamily: "Inter, sans-serif"
  data:
    fontFamily: "JetBrains Mono, monospace"
---

## Overview

Molino computa (no ilustra) sistemas simbólicos — numerología, astrología, zodíaco chino — a partir de la fecha de nacimiento, 100% client-side, sin backend que persista perfiles. La dirección visual usa el molino de viento **ya existente en la marca** (`components/ui/Logo.tsx`, molinete americano clásico) como elemento vivo y funcional, no decorativo: sus aspas giran cuando el sitio está cargando o navegando, y se quedan quietas cuando terminó — el movimiento comunica estado real, nunca es ambiental.

**Primer intento descartado:** una versión inicial reemplazó el molino por una "turbina" abstracta de 3 aspas de colores (una por sistema de cálculo). El usuario lo rechazó explícitamente: el logo tiene que ser un molino de viento, no un ícono inventado. Esa pieza (`TurbineCore.tsx`) fue eliminada del repo — no reintroducirla.

**Glow up "Almanaque Cálido":** el sitio pasó de "panel de instrumento oscuro con acento indigo" a **almanaque cálido** — fondo tipo papel, tinta oscura, acento terracota, tipografía serif itálica para títulos. El molino se mantiene con el mismo comportamiento de giro ligado a carga real (sin cambios de lógica), pero cambia de paleta. **No hay dark mode** en esta iteración — quedó retirado, no archivado como alternativa. El re-skin cubre todo el sitio: home, onboarding, `/profile` y sus secciones, `/affinity`, `/biblioteca`, `/academy`, herramientas, etc. La estructura de cada página (layout, grids, jerarquía de contenido) no cambió — fue una pasada de tokens de color/tipografía/componentes, no una reestructuración.

## Colors

Estrategia: **restringida** (neutros + un acento), no una paleta de colores por sistema. El acento tiene más presencia que el indigo anterior: no solo CTAs, también headers de sección, números clave, bordes destacados.

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F5F0E4` | Fondo principal |
| `paper-alt` | `#EDE5D2` | Tarjetas, superficies elevadas |
| `ink` | `#241F17` | Texto principal, molino, iconografía |
| `muted` | `#6B6252` | Texto secundario — verificado 5.28:1 sobre `paper` (WCAG AA ≥4.5:1) |
| `border` | `#E0D6C0` | Reglas, separadores, bordes de card |
| `accent` | `#9A4A18` | CTAs, links, headers de sección, números clave, bordes destacados — verificado 5.2:1 sobre `paper` |
| `accent-hover` | `#7E3B12` | Estado hover/active de elementos en `accent` |
| `accent-light` | `#D98F52` | Hover states sobre fondo oscuro, fondos de pill, `eyebrow` sobre bloques full-bleed |

Contraste base verificado (fórmula WCAG, relative luminance): `ink`/`paper` = 14.4:1, `muted`/`paper` = 5.3:1, `accent`/`paper` = 5.2:1. Ver `app/globals.css` (comentario al inicio de `:root`) y `scripts/check-contrast.mjs`.

- **Colores por sistema** (preexistentes, documentados acá para que no lean como deriva): numerología `#6B4C7A`, astrología `#2E5C8A`, zodíaco chino `#85681D` — este último se oscureció desde `#C49A2A` (el tono original de la base oscura) para seguir pasando AA sobre el fondo claro `paper`. Uso restringido: un punto de 8px junto al nombre del sistema (`TresSistemas.tsx`) — nunca como fondo de sección ni como acento general.
- **Colores de tipo de fuente en `/biblioteca`** (`TYPE_META` en `BibliotecaContent.tsx`): libro `#7B5E1C`, artículo `#5F6773`, video `#7C6487`, sitio web `#5A7262` — todos oscurecidos respecto de sus valores originales sobre fondo oscuro (`#D4A843`, `#77808E`, `#897095`, `#708F7B`) para volver a pasar 4.5:1 sobre `paper`. Uso restringido: texto + fondo al 15% de opacidad en el pill de tipo de fuente. Mismo patrón que los colores por sistema: no agregar un color nuevo por tipo sin sumarlo acá primero.
- No hay `Grainient` (textura WebGL) en el hero actual — se evaluó retunear el grano a un tono `ink` sutil sobre `paper`, pero el hero implementado (`components/sections/HeroInstrument.tsx`) no lleva textura de fondo. `Grainient.jsx` ya no existe en el repo.

## Typography

- **Display** (títulos de hero, cifras destacadas): **Newsreader**, itálica, peso 400 (peso variable por defecto de la fuente vía `next/font/google`, sin cargar un weight explícito — ver `app/layout.tsx`). Reemplaza Archivo Black. Óptica literaria/almanaque, no geométrica/gauge.
- **Heading**: se mantiene **Space Grotesk** para subtítulos, labels de sección y CTAs — contraste serif/sans clásico, evita agregar una tercera familia.
- **Body**: se mantiene **Inter**.
- **Data** (fechas, breakdowns, fórmulas): se mantiene **JetBrains Mono** — el molino sigue siendo un instrumento de cálculo por dentro, aunque la piel sea cálida.

## Layout

Sin cambios estructurales respecto de la base anterior. El hero de home conserva el grid de 2 columnas (texto + molino, `components/sections/HeroInstrument.tsx`); el resto de páginas conserva su composición. Esta iteración fue un re-skin de color/tipo/componentes, no una reestructuración de IA o de jerarquía de contenido.

## Elevation & Depth

Se retiró el halo `blur-3xl` (pensado para destacar sobre fondo casi negro). En su lugar: sombra de "papel levantado" — tinte marrón cálido (no gris neutro), muy baja opacidad, sin blur agresivo:

```
--shadow-sm: 0 1px 2px rgba(36, 31, 23, 0.06);
--shadow-md: 0 2px 6px rgba(36, 31, 23, 0.08);
--shadow-lg: 0 4px 12px rgba(36, 31, 23, 0.10);
--shadow-xl: 0 8px 24px rgba(36, 31, 23, 0.12);
```

Sin neobrutalism, sin glass/blur.

## Components

### `Logo` (`components/ui/Logo.tsx`) — el molino
Molinete americano clásico (torre fija, rotor con 10 aspas). Un solo trazo heredado vía `currentColor` (color `ink`), sin halo ni recoloreo de acento — mismo componente reusado en Header, Hero de home y `SiteIntro`. Mismo comportamiento de giro (`lib/utils/loadingSignal.ts`) — no se tocó la lógica, solo el color heredado.

### Señal de carga (`lib/utils/loadingSignal.ts`)
Sin cambios respecto de la base anterior: evento global refcounted (`startLoading`/`stopLoading`/`subscribeLoading`), disparado por `AnimatedLayout` en cada cambio de ruta y por `PremiumGate`. No gira en el montaje inicial, esa carga la cubre `SiteIntro`.

### `EditorialSection` (`components/ui/EditorialSection.tsx`)
Sección editorial reutilizable con 4 tonos: `paper`, `paperAlt`, `ink`, `accent`. **Corrección encontrada en implementación:** el tono `ink` está pensado para un bloque full-bleed *oscuro* (ej. "SIGNIFICADO" en `AnimalContent.tsx`). Bajo la paleta anterior, `--color-ink` era el tono CLARO de texto y `--color-paper` el fondo OSCURO — nombres invertidos respecto de su significado literal — y el tono `ink` compensaba eso con un workaround: `bg-paper text-ink`. Con Almanaque Cálido, `--color-ink` pasó a ser el tono OSCURO real y `--color-paper` el fondo CLARO real, así que la Task 8 del plan **invirtió el class mapping de la tabla `TONES`** (commit `c5b602f`): de `bg-paper text-ink` / `title: text-ink` / `intro: text-ink/70` / `rule: border-ink/15` al mapeo directo `bg-ink text-paper` / `text-paper` / `text-paper/70` / `border-paper/15`. Sin ese cambio el bloque "oscuro" habría quedado claro con texto claro. Ojo: los hijos de cada `EditorialSection tone="ink"` también tienen que usar clases `paper` sobre fondo oscuro (ver `AnimalContent.tsx`).

### Botones/CTA
Fill `accent` sólido con texto `paper`, o outline `accent` sobre fondo `paper` para variantes secundarias.

### Cards
`paper-alt` sobre `paper`, borde `border` de 1px, sombra de "papel levantado" (ver Elevation & Depth).

### Headers de sección
Heading real (`h2`/`h3`, Space Grotesk) — se mantiene la regla de no usar `eyebrow-brutalist` como heading; el eyebrow mono ahora puede llevar color `accent` (o `accent-light` sobre bloques full-bleed) para reforzar la mayor presencia del acento.

## Motion

Sin cambios: el molino sigue girando solo cuando hay carga/navegación real en curso (`lib/utils/loadingSignal.ts`), nunca de forma ambiental. `SiteIntro` mantiene su timing actual. Este glow up no tocó `MOTION.md`.

## Site-wide cleanup (segunda pasada, base oscura anterior)

Después del hero, se extendió la dirección (entonces oscura) a todo el sitio:

- **`eyebrow-brutalist` eliminado en los 28 usos que quedaban** (home + `affinity`, `biblioteca`, `compatibility`, `evolution`, `explore`, `guia`, `nudo`, `onboarding`, `semana`, `timing`, `hoy`). Cada caso se resolvió con criterio: si ya había un heading real debajo, se borró el eyebrow; si el eyebrow era el único heading de la sección, se promovió a `h2`/`h3` real; si llevaba información propia (fecha, "paso N de 3") se mantuvo como texto de apoyo normal, no como heading.
- **23 páginas que tiraban 500** (`/conocimiento/astrologia/[signo]`, `/conocimiento/zodiaco-chino/[animal]`, y preventivamente `/conocimiento/numerologia/[numero]`) por falta de `"use client"` en componentes que usan `framer-motion` dentro de un Server Component — arreglado. Verificado con un crawler propio: 55 páginas públicas, 0 rotas, 0 links vacíos.
- **Emoji-como-ícono-de-UI reemplazado por lucide-react** en `/affinity` (hub de categorías) y `/herramientas` (numerología/astrología/zodíaco/compatibilidad) — el emoji sigue siendo válido como dato de contenido (`entity.emoji`), pero no como ícono de navegación.
- **Bug de encoding real**: `/herramientas` tenía el h1 literalmente roto (`Calculá tu identidad` en vez de "Calculá tu identidad") — un escape Unicode sin interpretar dentro de texto JSX (no de un string). Corregido. Se verificó que no era sistémico: el resto de ocurrencias de `\u00XX` en el repo están dentro de literales de string válidos (`lib/data/*.ts`), que sí se decodifican bien en runtime.
- **Colores por sistema documentados** (no inventados): ya existían en `TresSistemas.tsx`, con uso acotado (punto de 8px junto al nombre, nunca fondo de sección) desde entonces.

> Las auditorías de accesibilidad/performance de esta sección se hicieron contra
> la base oscura anterior. La re-verificación de contraste para la paleta clara
> actual está documentada en las secciones de color de arriba y en
> `scripts/check-contrast.mjs`.

## Auditoría técnica (accesibilidad + performance, medida con Lighthouse real contra build de producción)

- **`--color-muted` corregido de `#A6A69C` a `#B0B0A6`** (valores de la base oscura anterior — hoy `--color-muted` es `#6B6252`, ver tabla de Colors arriba): el valor previo hacía que `text-muted/70` (el uso más común de texto secundario en todo el sitio) cayera a ~4.3:1 sobre los fondos oscuros de entonces, por debajo del mínimo WCAG AA de 4.5:1. Todo uso de `text-muted` por debajo de `/70` (en `/50`, `/60`, `/40`, `/30`) fue auditado caso por caso y subido a `/70` cuando era texto legible real; se dejaron sin tocar solo los casos genuinamente decorativos (un separador "·", un placeholder de input).
- **`--element-metal` corregido de `#6B7280` a `#838C95`**: el valor anterior daba 4.09:1 sobre fondo oscuro (falla AA) cuando se usaba como color de texto en `WorldConnections.tsx`/`IdentityCard.tsx`. Mismo tono gris-azulado, ahora en 5.79:1.
- **Bug sistémico de accesibilidad, no cosmético**: ~12 páginas (`/timing`, `/evolution`, `/nudo`, `/affinity`, `/affinity/compare/[a]/[b]`, `/compatibility/brands`, `/compatibility/countries`, `/analytics/affinity`, y las fichas "no encontrado" de astrología/zodíaco/numerología) renderizan 2-4 estados (loading / sin perfil / contenido) como ramas condicionales, pero solo la rama de contenido real tenía `<main id="main-content">` — las ramas de loading/vacío usaban un `<div>` plano. Esto rompía el skip-link del sitio (apunta a `#main-content`) y dejaba la página sin landmark `<main>` para lectores de pantalla en cualquier estado que no fuera "ya tengo tu perfil cargado". Arreglado en las ~35 ramas afectadas. Verificado con Lighthouse: accesibilidad 100/100 en home, `/profile`, `/timing`, `/evolution` (antes: 92-95).
- **Botones con `aria-label` que no contenía el texto visible** (`ActionButtons.tsx`: "Descargar mapa" visible vs. `aria-label="Descargar mi mapa"`) — falla WCAG 2.5.3 (Label in Name), rompe el control por voz. Se sacó el `aria-label` redundante donde el texto visible ya alcanza.
- **Footer usaba `<h4>`** (`UniversityFooter.tsx`) sin que existiera ningún `h1`-`h3` antes en varias páginas — rompía el orden secuencial de headings. Cambiado a `<p>`: los labels de columna del footer no son parte del outline semántico de la página.
- **Dots del carrusel de testimonios** (`Testimonial.tsx`) con área de click de 6×6px, por debajo del mínimo táctil de 24×24px. El punto visual se mantuvo en 6px pero ahora vive dentro de un botón de 24×24px.
- **`favicon.ico` con 404 real** en cada carga del sitio (solo existía `favicon.svg`). Generado un `.ico` real (16/32/48px) desde el SVG con `sharp`. De paso, `favicon.svg` y `apple-touch-icon.svg` todavía tenían el molino wireframe viejo (10 aspas) descartado — actualizados al diseño actual de `Logo.tsx`.
- **Resultado medido** (Lighthouse contra `next build && next start`, no contra dev server): home 89 performance / 100 accesibilidad / 100 best-practices / 100 SEO. `/profile` y `/timing`: 100 accesibilidad, 100 best-practices. Performance ronda 80-89 en todas las páginas medidas.
- **`/profile`, `/timing`, `/evolution` dan SEO 66/100 — es intencional, no un bug**: son páginas con datos personales del usuario en la URL (`?dob=...`) y llevan `robots: { index: false }` a propósito (ver `app/profile/page.tsx`). No indexar una URL con la fecha de nacimiento de una persona es lo correcto.

## Segunda pasada: performance, mobile, teclado

- **`SiteIntro` (splash de arranque) reducido de 2.2s a 1.1s mínimo de display** (fade de 700ms a 500ms): verificado con capturas reales (no solo Lighthouse) que el intro tapaba el contenido real del sitio ~2.9s antes del cambio — la causa dominante del LCP alto en la home para el primer visitante de la sesión. Ahora son ~1.6s. Se mantiene el mismo carácter de la animación (la ráfaga de viento sigue siendo visible), solo se acortó la espera forzada. No se tocó el resto del mecanismo (sessionStorage, fade, reduced-motion).
- **`experimental.optimizeCss` evaluado y descartado**: Lighthouse marca ~16KB de CSS como "render-blocking" bajo su throttling simulado, pero arreglarlo requiere instalar una dependencia nueva (`beasties`) para un ahorro marginal con riesgo real de romper estilos en producción. No vale la trade.
- **Bug de layout real en `MapVisualization.tsx`** (el radar chart del hero de `/profile`): la etiqueta de eje "NUMEROLOGÍA" (texto completo) se superponía visualmente con el nombre del arquetipo en el centro del gráfico, tanto en mobile como en desktop en perfiles con valores bajos en algún eje. El componente ya tenía un `shortLabel` ("Num"/"Ast"/"Zod") definido en `SYSTEMS` pero nunca conectado al render — se usa ahora. Verificado con capturas en 390px y 1440px.
- **Skip-link no movía el foco de teclado**: `<a href="#main-content">` navegaba el hash (scrolleaba) pero el `<main id="main-content">` no tenía `tabindex`, así que el foco real quedaba en `<body>` — un usuario de teclado que activa "Saltar al contenido principal" no llegaba a ningún lado utilizable. Extraído a `components/ui/SkipLink.tsx` (client component): al activarse, setea `tabindex="-1"` en el target, lo enfoca, y lo saca al perder el foco. Funciona en cualquier página sin tocar los ~40 archivos que usan `id="main-content"`. Verificado con Playwright: `document.activeElement` ahora es el `<main>` real tras Tab+Enter.
- **Mobile revisado con capturas reales** en home, onboarding, herramientas y `/profile` completo (390px) — sin overflow ni truncamiento nuevo encontrado más allá del bug del radar chart ya descripto arriba.

## Tercera pasada: axe-core (auditoría real de accesibilidad, no solo Lighthouse)

Lighthouse solo audita una página a la vez y con una muestra parcial de reglas. Se corrió `axe-core` (el motor que usa Lighthouse por debajo, pero con la cobertura completa WCAG 2.0/2.1 A/AA) contra 34 rutas del sitio con Playwright. Resultado final: **0 violaciones en 33 de 34 páginas**, 1 excepción documentada abajo.

- **Bug de producto real, no solo de contraste, sobre la base oscura anterior**: `EditorialSection`'s tone `"ink"` (pensado para un bloque negro full-bleed) usaba `bg-ink text-paper`. En esa base, `--color-ink` era el tono CLARO de texto (`#F3F1EA`) y `--color-paper` el fondo OSCURO (`#0A0A0C`) — nombres heredados de un rebuild que invirtió la paleta sin renombrar las variables. El resultado: la sección "negra" renderizaba con **fondo claro**, lo opuesto de la intención. Corregido en el único lugar (`EditorialSection.tsx`, commit `c5b602f` — Task 8 del plan), invirtiendo el mapeo de `bg-paper text-ink` a `bg-ink text-paper`, lo que arregla los 3 usos existentes (`AnimalContent.tsx`, `CircleScreen.tsx`, `IdentityScreen.tsx`) de una vez. Con Almanaque Cálido, `--color-ink`/`--color-paper` volvieron a nombrar lo que literalmente son (ver "Components" arriba), así que el mapeo directo es el correcto.
- **Botón sin nombre accesible en `/academy`** (crítico): el árbol de conocimiento tenía un botón-ícono decorativo duplicando la acción del botón de texto adyacente (mismo `onClick`), sin `aria-label`. Convertido a `<div aria-hidden="true">` no interactivo — la acción real vive en el único botón con texto, que ahora también lleva `aria-expanded`.
- **Colores de categoría sin contraste en `/biblioteca`** (`TYPE_META`: articulo/video/sitio) y **colores de sistema usados como texto en `/herramientas`** (`--element-fire`, `--layer-astrology`, `--layer-moment`) — mismo patrón que los tokens `--color-muted`/`--element-metal` de la segunda pasada: colores pensados para otro uso (fondos, íconos, dots) reutilizados como color de texto sin verificar contraste. Corregidos con el mismo método (mismo tono, aclarado hasta pasar 4.5:1), documentados inline en el código donde se aplicó.
- **Breadcrumbs del sitio entero distinguibles solo por color**: el link "Inicio" en el patrón `<nav aria-label="Breadcrumb">` (30 instancias en 17 archivos, 2 variantes de className idénticas) no tenía subrayado — en estado normal, el color de link vs. texto circundante no alcanza el 3:1 mínimo de WCAG 1.4.1. Agregado `underline decoration-ink/25 underline-offset-2` a las dos variantes vía reemplazo global (los className eran textualmente idénticos y exclusivos de este patrón, verificado antes del reemplazo).
- **Tabla de fórmulas en `/docs/motores`**: encabezados usaban el mismo token (`text-muted` sobre `bg-muted/50`) para texto Y fondo — contraste casi nulo por diseño accidental, no por decisión. Encabezados pasados a `text-foreground`; celda de ejemplo (`text-accent/80`) subida a `text-accent-light`.
- **Excepción documentada, no resuelta**: los numerales de fondo decorativos ("01", "02"...) en `text-ink/15` (60-96px, usados en `AnimalContent.tsx` y en el prop `numeral` de `EditorialSection`) siguen marcados por axe pese a llevar `aria-hidden="true"` — axe no exime la regla `color-contrast` para elementos ocultos del árbol de accesibilidad, porque el contraste bajo también es un problema para usuarios de baja visión que sí los ven. Es un patrón editorial deliberado (numeral fantasma muy tenue, siempre con un label real y bien contrastado inmediatamente al lado — ej. "CARACTERÍSTICAS") repetido en todo el sitio; subir su opacidad para pasar el linter cambiaría un efecto visual intencional por una ganancia de accesibilidad marginal (la información ya está disponible en el label adyacente). Se dejó como está — es la única violación axe-core restante en todo el sitio (8 nodos, 1 sola página).

## Do's and Don'ts

- **Hacé** que el molino sea siempre el mismo componente (`Logo`) en cualquier tamaño — no crear un ícono nuevo para "verse más pro"; el nivel profesional viene del detalle y el estado, no de reemplazar la marca.
- **Hacé** que el giro comunique un estado real (carga, navegación, pago procesando) — nunca decorativo/ambiental. Si el sitio está listo, el molino está quieto.
- **Hacé** un heading real por sección — nunca un `eyebrow-brutalist` (label mono uppercase chiquito) haciendo de heading.
- **Hacé** re-skinear con los tokens de la tabla de Colors en vez de introducir colores nuevos ad-hoc — si hace falta un tono que no está ahí, se agrega acá primero.
- **Hacé** verificar contraste AA de cualquier color heredado (sistema, biblioteca) contra `paper` antes de darlo por bueno — no asumas que un hue que pasaba sobre el fondo oscuro anterior sigue pasando sobre `#F5F0E4`.
- **No** reintroduzcas una turbina/ícono abstracto en vez del molino — ya se probó y el usuario lo descartó explícitamente.
- **No** reintroduzcas el halo/blur del acento indigo ni el `blur-3xl` — quedaron con la dirección anterior.
- **No** construyas un dark mode paralelo — quedó retirado en esta iteración; reintroducirlo es un proyecto aparte con su propia paleta derivada de estos mismos tokens de tinta/acento.
- **No** uses emoji Unicode como sistema de íconos de UI/navegación — lucide-react ya está instalado. El emoji como dato de contenido (`entity.emoji`, banderas, el emoji de un animal del zodíaco) sigue siendo válido.
- **No** escribas caracteres acentuados como escape `\u00XX` directamente en texto JSX (fuera de comillas) — no se interpreta y se renderiza literal. Dentro de un string literal (`"Camino de Vida"` con `á` adentro) es válido y decodifica bien.
- **No** cambies la lógica de giro del molino ni los engines de cálculo — esto es exclusivamente visual.
