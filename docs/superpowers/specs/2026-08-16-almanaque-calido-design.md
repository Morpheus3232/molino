# Almanaque Cálido — Glow Up de dirección visual

> Spec de diseño. Reemplaza la identidad "panel de instrumento oscuro" (documentada en `DESIGN.md`) por una identidad cálida y editorial, aplicada a todo el sitio.

## Overview

Molino pasa de "panel de instrumento oscuro con acento indigo" a **almanaque cálido**: fondo tipo papel, tinta oscura, acento terracota, tipografía serif editorial para títulos. El molino (`components/ui/Logo.tsx`) se mantiene como elemento vivo y funcional — mismo comportamiento de giro ligado a carga real, sin cambios de lógica — pero cambia de paleta.

**No hay dark mode en esta iteración.** El sitio pasa a tener un único modo (cálido/claro). El dark mode actual queda retirado, no archivado como alternativa — si se quiere reintroducir dark mode más adelante, es un proyecto aparte con su propia paleta derivada de estos mismos tokens de tinta/acento.

**Alcance:** todo el sitio (home, onboarding, `/profile` y sus 25+ secciones, `/affinity`, `/biblioteca`, `/academy`, herramientas, etc.). La *estructura* de cada página (layout, grids, jerarquía de contenido) no cambia — se re-skinea con los nuevos tokens de color/tipografía/componentes, siguiendo el mismo criterio con que se extendió la dirección anterior (ver "Site-wide cleanup" en `DESIGN.md`): pasada por sistema de tokens primero, después página por página, sin rewrites de layout.

## Colors

Estrategia: igual que antes, restringida (neutros + un acento) — pero el acento pasa a tener **más presencia** que el indigo anterior (no solo CTAs; también headers de sección, números clave, bordes destacados).

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F5F0E4` | Fondo principal |
| `paper-alt` | `#EDE5D2` | Tarjetas, superficies elevadas |
| `ink` | `#241F17` | Texto principal, molino, iconografía |
| `muted` | `#6B6252` | Texto secundario (verificar ≥4.5:1 sobre `paper`) |
| `border` | `#E0D6C0` | Reglas, separadores, bordes de card |
| `accent` | `#B5591F` | CTAs, links, headers de sección, números clave, bordes destacados |
| `accent-light` | derivar de `accent` aclarado ~15% | hover states, fondos de pill al 15% opacidad |

- Los colores por sistema (`sistema-numerologia` `#6B4C7A`, `sistema-astrologia` `#2E5C8A`, `sistema-zodiaco` `#C49A2A`) y los de tipo de fuente en `/biblioteca` se **mantienen** (mismo hue, mismo uso acotado: punto de 8px / pill de tipo) pero se re-verifican contraste AA contra `paper` en vez de contra el fondo oscuro anterior — varios probablemente necesitan oscurecerse ligeramente para seguir pasando 4.5:1 sobre un fondo claro. Esto se resuelve en implementación, no se fijan valores nuevos acá.
- `Grainient` (textura WebGL) se retunea a un grano sutil color `ink` a baja opacidad sobre `paper` — encaja mejor con la metáfora "papel/almanaque" de lo que encajaba con el panel oscuro. Si el retune no se ve bien en la práctica, se puede retirar del hero sin que la dirección se caiga (no es un elemento crítico de esta identidad, a diferencia del molino).

## Typography

- **Display** (títulos de hero, cifras destacadas): **Newsreader**, itálica, peso 500. Reemplaza Archivo Black. Óptica literaria/almanaque, no geométrica/gauge.
- **Heading**: se mantiene **Space Grotesk** (ya en el repo) para subtítulos, labels de sección y CTAs — contraste serif/sans clásico, evita agregar una tercera familia.
- **Body**: se mantiene **Inter**.
- **Data** (fechas, breakdowns, fórmulas): se mantiene **JetBrains Mono** — el molino sigue siendo un instrumento de cálculo por dentro, aunque la piel sea cálida.

## Layout

Sin cambios estructurales. El hero de home conserva el grid de 2 columnas (texto + molino); el resto de páginas conserva su composición actual. Esta iteración es un re-skin de color/tipo/componentes, no una reestructuración de IA o de jerarquía de contenido.

## Elevation & Depth

Se retira el halo `blur-3xl` (pensado para destacar sobre fondo casi negro). En su lugar: sombra de "papel levantado" — `box-shadow` sutil y cálido (tinte marrón, no gris neutro), muy baja opacidad, sin blur agresivo. Sin neobrutalism, sin glass/blur (eso queda descartado junto con la dirección "Cinético" explorada y no elegida).

## Components

- **`Logo` (molino)**: un solo trazo color `ink` (`#241F17`), sin halo ni recoloreo de acento. Mismo comportamiento de giro (`loadingSignal.ts`) — no se toca la lógica, solo el color heredado vía `currentColor`.
- **Botones/CTA**: fill `accent` sólido con texto `paper`, o outline `accent` sobre fondo `paper` para variantes secundarias.
- **Cards**: `paper-alt` sobre `paper`, borde `border` de 1px, sombra de papel levantado (ver arriba).
- **Headers de sección**: heading real (`h2`/`h3`, Space Grotesk) — se mantiene la regla existente de no usar `eyebrow-brutalist` como heading; el eyebrow mono ahora puede llevar color `accent` para reforzar la mayor presencia del acento.

## Motion

Sin cambios: el molino sigue girando solo cuando hay carga/navegación real en curso (`lib/utils/loadingSignal.ts`), nunca de forma ambiental. `SiteIntro` mantiene su timing actual. Esta spec no toca `MOTION.md`.

## Out of scope

- Dark mode (queda retirado, no re-diseñado en paralelo).
- Lógica de los 18 engines de cálculo — cero cambios.
- Copy / contenido — cero cambios salvo que un texto dependa literalmente del tema oscuro (ninguno identificado).
- Reestructuración de layout o IA de páginas.

## Do's and Don'ts

- **Hacé** re-skinear con los tokens de esta tabla en vez de introducir colores nuevos ad-hoc — si hace falta un tono que no está acá, se agrega a esta spec primero (mismo criterio que ya regía en `DESIGN.md`).
- **Hacé** verificar contraste AA de cada color heredado (sistema, biblioteca) contra el nuevo fondo claro antes de darlo por bueno — no asumir que un hue que pasaba sobre `#0A0A0C` sigue pasando sobre `#F5F0E4`.
- **No** reintroduzcas el halo/blur del acento indigo — quedó con la dirección anterior.
- **No** construyas un dark mode paralelo en esta iteración — es explícitamente un proyecto aparte.
- **No** cambies la lógica de giro del molino ni los engines de cálculo — esto es exclusivamente visual.
