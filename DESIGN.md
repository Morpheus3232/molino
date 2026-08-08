---
name: Molino — El Molino Vivo
description: El molino de viento de la marca, ya existente, como protagonista funcional — gira cuando el sitio carga o navega, se queda quieto cuando está listo.
colors:
  ground: "#0A0A0C"
  ground-alt: "#16161A"
  ink: "#F3F1EA"
  muted: "#A6A69C"
  border: "#2A2A2E"
  accent: "#7C8CFF"
  grano-oro: "#F5C77E"
  grano-marron: "#8C7355"
  sistema-numerologia: "#6B4C7A"
  sistema-astrologia: "#2E5C8A"
  sistema-zodiaco: "#C49A2A"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
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

**Alcance de este documento:** cubre el hero de home (`components/sections/NumeroDia.tsx`) y el sistema de giro conectado a la carga real (`components/ui/Logo.tsx`, `lib/utils/loadingSignal.ts`, `components/ui/AnimatedLayout.tsx`, `components/ui/SiteIntro.tsx`) como primera superficie bajo esta dirección. El resto del sitio (perfil, afinidad, exploración) todavía corre sobre el sistema oscuro anterior y queda pendiente de extender.

## Colors

Estrategia: **restringida** (neutros + un acento), no una paleta de colores por sistema — esa idea murió junto con la turbina. Fondo casi negro con textura de grano animada (WebGL, componente `Grainient`, antes sin usar en el repo) detrás del molino, que se renderiza en un solo color (`currentColor`, hereda `text-ink`) como el resto de la marca.

- **Fondo** `#0A0A0C` (ground) / `#16161A` (ground-alt, tarjetas) — panel de instrumento, no "cosmic".
- **Grano** `#F5C77E` → `#8C7355` — textura Grainient, literal "molienda", solo visible en el hero.
- **Molino** `#F3F1EA` (ink) — un solo trazo, como en el header. No se recolorea por sección.
- **Acento** `#7C8CFF` — halo suave detrás del molino en el hero, botones, links.
- **Texto** `#F3F1EA` sobre fondo oscuro (contraste >12:1); `#A6A69C` para texto secundario.
- **Colores por sistema** (preexistentes en el código, documentados acá para que no lean como deriva): numerología `#6B4C7A`, astrología `#2E5C8A`, zodíaco chino `#C49A2A`. Uso restringido: un punto de 8px junto al nombre del sistema (`TresSistemas.tsx`) — nunca como fondo de sección ni como acento general. No introducir colores nuevos por sistema sin agregarlos acá primero.

## Typography

- **Display** (cifras grandes, título del hero): Archivo Black — geométrica, pesada, funciona como numeral de instrumento/gauge. `clamp(5rem, 14vw, 8.5rem)`, tracking ajustado, nunca más ancho que el contenedor de texto.
- **Heading**: Space Grotesk, uppercase, tracking-tight — subtítulos y CTAs.
- **Body**: Inter — párrafos descriptivos, measure ~65-75ch.
- **Data/lecturas**: JetBrains Mono — fórmulas de cálculo, fechas, breakdowns. Uso funcional (alineación tabular de números reales), no cosmético.

## Layout

Hero home: grid de 2 columnas en desktop (`1.1fr / 0.9fr`), texto a la izquierda, molino a la derecha; en mobile el molino sube arriba del texto, centrado. `min-h-[85vh]`, full-bleed, sin cards anidadas ni grid de íconos.

## Elevation & Depth

Halo detrás del molino: `radial-gradient` + `blur-3xl` a opacidad baja (20%), nunca un borde duro. Sin sombras neobrutalist.

## Components

### `Logo` (`components/ui/Logo.tsx`) — el molino
Molinete americano clásico (torre fija, rotor con 10 aspas). Un solo componente reusado en tres tamaños/contextos:
- **Header** (`w-6 h-6`): gira solo mientras `molino-loading` está activo (ver abajo).
- **Hero de home** (`w-56` a `w-80`, responsive): mismo componente, mismo comportamiento — quieto por defecto, gira si hay carga real en curso.
- **SiteIntro** (`w-32` a `w-40`, prop `wind`): pantalla de arranque del sitio — el molino recibe una ráfaga de viento (aceleración `easeInOut` en loop) mientras el documento termina de cargar (`window.load` + mínimo 2.2s para que se aprecie), y se desvanece una vez. Ya existía, no se tocó.

El rotor gira con una animación **CSS pura** (`@keyframes molino-rotor-spin` en `globals.css`), no con `framer-motion`. Se probó `motion.g` con `animate={{rotate:360}}` primero y, verificado con 400 muestras por frame, nunca aplicaba ninguna transformación al DOM en este setup (React 19 + Next 16) — bug real, no de percepción. La animación CSS sí se confirmó rotando (54 valores de matriz distintos capturados en una ventana de giro).

### Señal de carga (`lib/utils/loadingSignal.ts`)
Evento global refcounted (`startLoading`/`stopLoading`/`subscribeLoading`). Cualquier `Logo` sin `spinning`/`wind` explícito se suscribe solo y gira automáticamente mientras el contador sea > 0. Antes solo lo disparaba `PremiumGate` (verificación de pago); ahora `AnimatedLayout` también lo dispara en cada cambio de ruta (`pathname`), así el molino del header gira en cada navegación. Dura 1100ms (una vuelta completa del rotor a 1.1s/vuelta) — un valor más corto es imperceptible, se corta a mitad de camino. No gira en el montaje inicial, porque esa carga ya la cubre `SiteIntro`.

### `Grainient` (`components/Grainient.jsx`)
Shader WebGL (ogl) ya existente en el repo, sin usar hasta este trabajo. Textura de grano animada, con pausa automática fuera de viewport / pestaña oculta. Se usa como fondo atmosférico del hero, opacidad 40% + degradé para no comprometer contraste del texto.

## Site-wide cleanup (segunda pasada)

Después del hero, se extendió la dirección a todo el sitio:

- **`eyebrow-brutalist` eliminado en los 28 usos que quedaban** (home + `affinity`, `biblioteca`, `compatibility`, `evolution`, `explore`, `guia`, `nudo`, `onboarding`, `semana`, `timing`, `hoy`). Cada caso se resolvió con criterio: si ya había un heading real debajo, se borró el eyebrow; si el eyebrow era el único heading de la sección, se promovió a `h2`/`h3` real; si llevaba información propia (fecha, "paso N de 3") se mantuvo como texto de apoyo normal, no como heading.
- **23 páginas que tiraban 500** (`/conocimiento/astrologia/[signo]`, `/conocimiento/zodiaco-chino/[animal]`, y preventivamente `/conocimiento/numerologia/[numero]`) por falta de `"use client"` en componentes que usan `framer-motion` dentro de un Server Component — arreglado. Verificado con un crawler propio: 55 páginas públicas, 0 rotas, 0 links vacíos.
- **Emoji-como-ícono-de-UI reemplazado por lucide-react** en `/affinity` (hub de categorías) y `/herramientas` (numerología/astrología/zodíaco/compatibilidad) — el emoji sigue siendo válido como dato de contenido (`entity.emoji`), pero no como ícono de navegación.
- **Bug de encoding real**: `/herramientas` tenía el h1 literalmente roto (`Calculá tu identidad` en vez de "Calculá tu identidad") — un escape Unicode sin interpretar dentro de texto JSX (no de un string). Corregido. Se verificó que no era sistémico: el resto de ocurrencias de `\u00XX` en el repo están dentro de literales de string válidos (`lib/data/*.ts`), que sí se decodifican bien en runtime.
- **Colores por sistema documentados** (no inventados): `sistema-numerologia` `#6B4C7A`, `sistema-astrologia` `#2E5C8A`, `sistema-zodiaco` `#C49A2A` — ya existían en `TresSistemas.tsx`, ahora tienen un uso acotado (punto de 8px junto al nombre, nunca fondo de sección) y quedan en el token list para no leer como deriva.

## Auditoría técnica (accesibilidad + performance, medida con Lighthouse real contra build de producción)

- **`--color-muted` corregido de `#A6A69C` a `#B0B0A6`**: el valor anterior hacía que `text-muted/70` (el uso más común de texto secundario en todo el sitio) cayera a ~4.3:1 sobre los fondos oscuros, por debajo del mínimo WCAG AA de 4.5:1. Bump mínimo, casi imperceptible, que deja `/70` en ~4.7:1+. Todo uso de `text-muted` por debajo de `/70` (en `/50`, `/60`, `/40`, `/30`) fue auditado caso por caso y subido a `/70` cuando era texto legible real; se dejaron sin tocar solo los casos genuinamente decorativos (un separador "·", un placeholder de input).
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

- **Bug de producto real, no solo de contraste**: `EditorialSection`'s tone `"ink"` (pensado para un bloque negro full-bleed — así lo dice el comentario en `AnimalContent.tsx`: `{/* SIGNIFICADO — negro full-bleed */}`) usaba `bg-ink text-paper`. En este sitio `--color-ink` es el tono CLARO de texto (#F3F1EA) y `--color-paper` es el fondo OSCURO (#0A0A0C) — nombres heredados de un rebuild que invirtió la paleta sin renombrar las variables (ver el comentario grande al inicio de `globals.css`). El resultado: la sección "negra" renderizaba con **fondo claro**, lo opuesto de la intención — visible en captura, no solo en el linter de contraste. Corregido en el único lugar (`EditorialSection.tsx`), que arregla los 3 usos existentes (`AnimalContent.tsx`, `CircleScreen.tsx`, `IdentityScreen.tsx`) de una vez. El contenido hijo de esos 3 bloques (que usaba `text-paper/NN`, `border-paper/NN`, `var(--color-paper)` asumiendo el fondo — incorrecto — claro) también se corrigió a `text-ink/NN` / `var(--color-ink)`.
- **Botón sin nombre accesible en `/academy`** (crítico): el árbol de conocimiento tenía un botón-ícono decorativo duplicando la acción del botón de texto adyacente (mismo `onClick`), sin `aria-label`. Convertido a `<div aria-hidden="true">` no interactivo — la acción real vive en el único botón con texto, que ahora también lleva `aria-expanded`.
- **Colores de categoría sin contraste en `/biblioteca`** (`TYPE_META`: articulo/video/sitio) y **colores de sistema usados como texto en `/herramientas`** (`--element-fire`, `--layer-astrology`, `--layer-moment`) — mismo patrón que los tokens `--color-muted`/`--element-metal` de la segunda pasada: colores pensados para otro uso (fondos, íconos, dots) reutilizados como color de texto sin verificar contraste. Corregidos con el mismo método (mismo tono, aclarado hasta pasar 4.5:1), documentados inline en el código donde se aplicó.
- **Breadcrumbs del sitio entero distinguibles solo por color**: el link "Inicio" en el patrón `<nav aria-label="Breadcrumb">` (30 instancias en 17 archivos, 2 variantes de className idénticas) no tenía subrayado — en estado normal, el color de link vs. texto circundante no alcanza el 3:1 mínimo de WCAG 1.4.1. Agregado `underline decoration-ink/25 underline-offset-2` a las dos variantes vía reemplazo global (los className eran textualmente idénticos y exclusivos de este patrón, verificado antes del reemplazo).
- **Tabla de fórmulas en `/docs/motores`**: encabezados usaban el mismo token (`text-muted` sobre `bg-muted/50`) para texto Y fondo — contraste casi nulo por diseño accidental, no por decisión. Encabezados pasados a `text-foreground`; celda de ejemplo (`text-accent/80`) subida a `text-accent-light`.
- **Excepción documentada, no resuelta**: los numerales de fondo decorativos ("01", "02"...) en `text-ink/15` (60-96px, usados en `AnimalContent.tsx` y en el prop `numeral` de `EditorialSection`, sin usar actualmente) siguen marcados por axe pese a llevar `aria-hidden="true"` — axe no exime la regla `color-contrast` para elementos ocultos del árbol de accesibilidad, porque el contraste bajo también es un problema para usuarios de baja visión que sí los ven. Es un patrón editorial deliberado (numeral fantasma muy tenue, siempre con un label real y bien contrastado inmediatamente al lado — ej. "CARACTERÍSTICAS") repetido en todo el sitio; subir su opacidad para pasar el linter cambiaría un efecto visual intencional por una ganancia de accesibilidad marginal (la información ya está disponible en el label adyacente). Se dejó como está — es la única violación axe-core restante en todo el sitio (8 nodos, 1 sola página).

## Do's and Don'ts

- **Hacé** que el molino sea siempre el mismo componente (`Logo`) en cualquier tamaño — no crear un ícono nuevo para "verse más pro"; el nivel profesional viene del detalle y el estado, no de reemplazar la marca.
- **Hacé** que el giro comunique un estado real (carga, navegación, pago procesando) — nunca decorativo/ambiental. Si el sitio está listo, el molino está quieto.
- **Hacé** un heading real por sección — nunca un `eyebrow-brutalist` (label mono uppercase chiquito) haciendo de heading. La clase sigue en `globals.css` por si algún caso legítimo la necesita, pero no debería quedar ningún uso activo; si aparece uno nuevo, es deuda, no un patrón a copiar.
- **No** reintroduzcas una turbina/ícono abstracto en vez del molino — ya se probó y el usuario lo descartó explícitamente.
- **No** uses emoji Unicode como sistema de íconos de UI/navegación — lucide-react ya está instalado. El emoji como dato de contenido (`entity.emoji`, banderas, el emoji de un animal del zodíaco) sigue siendo válido.
- **No** escribas caracteres acentuados como escape `\u00XX` directamente en texto JSX (fuera de comillas) — no se interpreta y se renderiza literal. Dentro de un string literal (`"Camino de Vida"` con `á` adentro) es válido y decodifica bien.
