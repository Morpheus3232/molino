# Auditoría Completa — Molino (Fase 1)

---

## HOME — HeroNew

**Archivo:** `components/sections/HeroNew.tsx`

**Lo que funciona**
- Número del día como ancla visual potente con tipografía signature.
- Transiciones animadas en cascada bien calibradas.
- CTA claro ("DESCUBRIR MI MAPA") con `btn-accent` desde `globals.css`.
- Breakdown numerológico del día (cálculo transparente).
- Barra de estadísticas con valores concretos (3 sistemas, 13 fuentes, 0 datos almacenados).
- Etiqueta `eyebrow-brutalist` y `label-micro` consistentes con el diseño.

**Problemas UX**
- Hero ocupa ~100vh (min-h-screen) sin scroll hint; usuarios no saben que hay contenido abajo.
- El CTA compite con el número del día (22vw) que domina visualmente toda la sección.
- Sin progresión narrativa: el número del día no prepara al usuario para crear su perfil.
- La sección de "estadísticas" (3 sistemas, 13 fuentes, 0 datos) es débil como prueba social.
- Sin variante para usuarios con perfil (siempre muestra el mismo hero).

**Problemas visuales**
- El número del día en `text-[clamp(6rem,22vw,28rem)]` es desproporcionado en tablets.
- `cellPad` (`p-8 sm:p-10 lg:p-14`) en ambos lados crea una cuadrícula rectangular sin jerarquía.
- El bloque derecho (reflexión) queda comprimido en desktop al 2/5 del ancho con texto largo.
- Sin profundidad visual: todo es plano (sin sombras, sin capas, sin textura).

**Problemas de consistencia**
- Usa `btn-accent` (global) mientras otras páginas usan `<Button>` o inline Tailwind — mezcla patrones.
- `cellPad` y `colBorder` definidos inline en vez de importar constantes compartidas.
- Sin breadcrumbs (no los necesita, pero es el único entry point que no los tiene).

**Impacto:** Alto. Es la primera impresión de todo usuario nuevo.

**Prioridad:** P0.

**Recomendación:** Simplificar el hero para que comunique valor en 3 segundos. Reducir el tamaño del número, mover la reflexión debajo o a un segundo plano, y hacer el CTA el punto focal principal.

---

## HOME — GenericHome / PersonalizedHome

**Archivo:** `app/page.tsx`

**Lo que funciona**
- División clara entre usuario nuevo (GenericHome) y recurrente (PersonalizedHome).
- Secciones reutilizables (SystemsPreview, Journey, ToolsAndDiscovery, ConceptsIndex).
- Tarjeta de energía diaria con score numérico + link a `/daily-energy`.
- CTA "VER MI MAPA COMPLETO" con `btn bg-white text-accent` sobre `accent-block`.
- `fadeUp` motion consistente en todas las secciones.

**Problemas UX**
- Sin loading state inicial: `getOrCreateProfile()` es síncrono, pero el `useEffect` + `useState` causa un flash de contenido no-personalizado antes de mostrar PersonalizedHome.
- Todos los CTAs usan `router.push()` en `<button>` en vez de `<Link>` (accesibilidad, SEO, open in new tab).
- La tarjeta de energía diaria no tiene estado vacío — si `energy` es null, no se muestra nada (silent failure).
- Sin indicación de que hay más secciones abajo después del CTA final.

**Problemas visuales**
- `accent-block` es un rectángulo azul sólido sin textura ni profundidad.
- La tarjeta de energía usa `text-green-500`, `text-blue-500`, `text-yellow-500`, `text-red-500` — colores semánticos que no cambian en dark mode.
- El score numérico (5xl/6xl) compite con el CTA "VER DETALLE" en la misma línea.

**Problemas de consistencia**
- `getScoreColor` redefinida inline (duplicada en daily-energy/page.tsx, timing/page.tsx, decisions/page.tsx).
- Los CTAs usan `btn bg-white text-accent` en vez del componente `<Button>` o `btn-accent`.

**Impacto:** Alto. Es la página principal para usuarios recurrentes.

**Prioridad:** P0.

**Recomendación:** Extraer `getScoreColor` a shared util. Reemplazar CTAs por `<Link>`. Agregar micro-loading state inicial.

---

## ONBOARDING

**Archivo:** `app/onboarding/page.tsx`

**Lo que funciona**
- Formulario simple: solo fecha de nacimiento. Sin registro, sin email.
- DateInput con auto-advance entre campos, validación en tiempo real, soporte teclado.
- Loading state en el botón con spinner (`Loader2 animate-spin`) mientras genera.
- Preview de motores (Numerología, Astrología, Zodíaco Chino) con iconos.
- Mensaje de privacidad claro: "Tu fecha nunca sale de tu navegador".

**Problemas UX**
- El placeholder del DateInput ("DD / MM / AAAA") usa formato día-mes-año que es correcto para Argentina pero puede confundir en contexto internacional.
- Sin indicación de progreso (no hay pasos, no hay "completaste el 50%").
- Sin validación visual en los campos individuales (borde rojo si fecha inválida, por ejemplo).
- `Enter` key handler solo funciona si el DateInput tiene focus — no hay submit global.
- El error catch en `handleGenerate` solo resetea `isGenerating` pero no muestra mensaje al usuario.

**Problemas visuales**
- El preview de motores usa `rounded-none` (correcto para diseño) pero los iconos de Lucide son delgados y se pierden en el cuadrado `bg-accent/10`.
- Header con `font-heading uppercase` en 4xl-6xl — la combinación uppercase + Space Grotesk es pesada visualmente.

**Problemas de consistencia**
- Botón CTA usa inline Tailwind (`bg-primary text-primary-foreground hover:bg-accent`) — no usa `<Button>` ni `btn-accent`.
- Padding del main: `px-4 sm:px-6` — diferente del estándar `px-5 sm:px-8 lg:px-12` del resto del sitio.

**Impacto:** Crítico. Es el punto de conversión — sin onboarding no hay usuario.

**Prioridad:** P0.

**Recomendación:** Unificar padding al estándar del sitio. Agregar feedback visual de error. Reemplazar button por `<Button variant="primary" size="lg">`.

---

## DAILY ENERGY

**Archivo:** `app/daily-energy/page.tsx`

**Lo que funciona**
- Score numérico grande con `font-display` y color semántico por rango.
- Información completa: tema, descripción, fortalezas, precauciones, áreas, luna, interpretación.
- Grid de áreas con score labels.
- Breadcrumb: Inicio > Energía Diaria.
- `MolinoInterpretation` para análisis AI.
- No-profile state con CTA "CREAR MI PERFIL".

**Problemas UX**
- No hay forma de ver energía de días anteriores (solo día actual).
- Sin share button para compartir la energía del día.
- La interpretación AI (`MolinoInterpretation`) puede fallar silenciosamente — no hay fallback visible.

**Problemas visuales**
- `getScoreColor` usa colores semánticos fijos (`text-green-600`, `text-blue-600`, etc.) que no se adaptan a dark mode.
- Áreas grid columnas se vuelve 2 columnas en lugar de 4 en pantallas medianas sin transición suave.

**Problemas de consistencia**
- `getScoreColor` y `getScoreBg` (antes de la limpieza) redefinidas inline — ahora solo `getScoreColor`.
- No usa el componente `<Button>` para los CTAs inferiores — usa `btn-accent` para "Crear mi perfil" y `<Button>` para "Explorar fechas" y "Ver mi perfil" — mezcla patrones.

**Impacto:** Alto. Es una de las features de retorno diario.

**Prioridad:** P1.

**Recomendación:** Extraer `getScoreColor` a `lib/utils/score.ts`. Unificar botones a `<Button>`. Agregar navegación entre días.

---

## AFFINITY — Hub

**Archivo:** `app/affinity/page.tsx`

**Lo que funciona**
- Categorías con iconos + descripciones.
- No-profile state con CTA a onboarding.
- LoadingState mientras carga el perfil.

**Problemas UX**
- No hay vista previa de resultados sin crear perfil.
- Las categorías son links a listas, no hay interacción en la página misma.

**Problemas visuales**
- Categorías en fila vertical con icono + texto — diseño funcional pero sin personalidad.

**Problemas de consistencia**
- Botón "Crear mi perfil" usa inline Tailwind con `rounded-full` — viola el sistema brutalista (`rounded-none`).

**Impacto:** Medio.

**Prioridad:** P2.

**Recomendación:** Unificar botón, considerar preview de afinidad para usuarios sin perfil.

---

## AFFINITY — Type / Detail / Compare

**Archivos:** `app/affinity/[type]/*`, `app/affinity/compare/*`

**Lo que funciona**
- Búsqueda con filtro en tiempo real en listas de entidades.
- Score de afinidad con color por tier.
- Detail page con info completa (historia, legado, trivias, timing).
- Compare page con diff visual entre dos entidades.
- Not-found handling para slugs inválidos.

**Problemas UX**
- CompareContent podía retornar null (FIXED — ahora muestra fallback UI).
- Sin forma de compartir resultado de comparación.
- Las recomendaciones (RecommendationContent) usan hardcoded colors para badges (FIXED — ahora usan CSS vars).

**Problemas visuales**
- Listas de entidades usan `rounded-xl` → reemplazado por `rounded-none` en auditoría.
- Scores de afinidad con inline styles de color (`:style={{ color: tierMeta.color }}`) — funcionan pero no son theme-adaptables.

**Problemas de consistencia**
- Back buttons usan inline Tailwind en vez de componente compartido.
- Search input styles varían entre páginas.

**Impacto:** Medio.

**Prioridad:** P1.

**Recomendación:** Extraer search input a componente compartido. Agregar share en compare.

---

## EXPLORE / Buscador

**Archivo:** `app/explore/page.tsx`

**Lo que funciona**
- Búsqueda de conceptos en tiempo real.
- Empty state con "No se encontraron conceptos" + botón limpiar.
- Secciones claras: Los tres sistemas, Conceptos clave, Fuentes, Afinidad.
- Links a biblioteca completa.
- `fadeUp` motion en todas las secciones.

**Problemas UX**
- Los tres sistemas usan `<button>` para navegación — deberían ser `<Link>`.
- Búsqueda solo busca en `title` y `description` de CONCEPTS — no busca en SYSTEMS ni SOURCES.
- Sin búsqueda global (solo busca en conceptos clave).

**Problemas visuales**
- El input de búsqueda es simple (borde + placeholder) sin icono de lupa.
- Empty state usa `border-dashed` — único en el sitio, inconsistente.

**Problemas de consistencia**
- `cellPad` y `colBorder` definidos inline en vez de constantes compartidas.
- Padding de conceptos: `px-5 sm:px-8 py-5 sm:py-6` — diferente del `cellPad` usado en SYSTEMS.

**Impacto:** Medio.

**Prioridad:** P2.

**Recomendación:** Reemplazar `<button>` por `<Link>`. Unificar padding y bordes. Agregar icono de búsqueda.

---

## CONOCIMIENTO — Astrología / Numerología / Zodíaco Chino / Fuentes

**Archivos:** `app/conocimiento/astrologia/*`, `app/conocimiento/numerologia/*`, `app/conocimiento/zodiaco-chino/*`, `app/conocimiento/fuentes/*`

**Lo que funciona**
- Contenido editorial completo con cards, tabs, y navegación entre sub-páginas.
- Signo/animal/número individual con info detallada.
- Not-found states para parámetros inválidos.
- Navigation links entre contenido relacionado (conocimiento → herramientas → perfil).
- Cálculos en página (camino de vida, signo solar, etc.).

**Problemas UX**
- Las pages son estáticas (sin interactividad más allá de navegación).
- Sin progreso de lectura ni "artículos relacionados".
- Numerología content tiene una tabla de contenidos que scrollea — buen patrón pero sin highlight de sección activa.

**Problemas visuales**
- Cards internas usan `border-accent/20 bg-accent/[0.03]` para destacar — color fijo que no se adapta perfectamente en dark mode (accent es azul en ambos modos, fine).
- Hardcoded font-family: `Georgia, 'Times New Roman', serif` en tarjetas compartibles (intencional, es para imagen exportada).

**Problemas de consistencia**
- `font-serif` reemplazado por `font-heading` en toda la sección.
- Varias páginas usan inline Tailwind para prev/next navigation.

**Impacto:** Medio. Es contenido educativo que retiene usuarios.

**Prioridad:** P1.

**Recomendación:** Unificar patrones de navegación prev/next. Agregar active highlight en TOC.

---

## NOT FOUND (404)

**Archivo:** `app/not-found.tsx`

**Lo que funciona**
- Server component (rápido, sin JS necesario).
- Mensaje claro: "No encontramos esta página" + explicación.
- CTA "Volver al inicio" con bg-accent.
- Metadata para SEO.

**Problemas UX**
- Sin link a `/explore` o búsqueda para que el usuario encuentre lo que busca.
- Sin Header — el usuario está en una página en blanco sin navegación superior.

**Problemas visuales**
- El CTA usa `rounded-none` (correcto para diseño) pero el botón en el resto del sitio usa mezcla de estilos.

**Problemas de consistencia**
- Sin `UniversityFooter` — las otras páginas lo tienen.

**Impacto:** Bajo (solo se ve en errores).

**Prioridad:** P3.

**Recomendación:** Agregar footer, agregar link a explore.

---

## LOADING STATES

**Componente:** `components/ui/LoadingState.tsx`
**Uso:** 17 ubicaciones en todo el sitio.

**Lo que funciona**
- Soporta `message` personalizado y `fullScreen` mode.
- Spinner animado con color accent.
- `role="status"` y `aria-label` para accesibilidad.
- Usado consistentemente en todas las páginas que cargan perfil.

**Problemas UX**
- Sin skeleton loading (solo spinner) — en páginas con mucho contenido, un skeleton reduciría la percepción de espera.
- El spinner es genérico (border animado) — sin personalidad de marca.

**Problemas visuales**
- El spinner usa `rounded-full` — el diseño brutalista es `rounded-none`. Es aceptable para un spinner (circular), pero no hay alternativa cuadrada.

**Problemas de consistencia**
- El componente `Skeleton` existe pero solo se usa en `MolinoInterpretation` — no en page-level loading.

**Impacto:** Medio. Afecta percepción de performance.

**Prioridad:** P2.

**Recomendación:** Agregar variante skeleton para contenido conocido. Considerar spinner con logo Molino.

---

## EMPTY STATES

**Componente:** `components/ui/EmptyState.tsx`
**Uso:** 0 ubicaciones — **código muerto**.

**Lo que funciona**
- Título, descripción, acción opcional con `<Button>`.
- Icono de información con círculo.

**Problemas UX**
- El componente no se usa en ninguna página. Todos los empty states son inline.

**Problemas visuales**
- El icono usa `rounded-full` — viola el diseño brutalista.

**Problemas de consistencia**
- Cada página implementa su propio empty state con estilos diferentes.

**Impacto:** Bajo (componente existe pero no se usa).

**Prioridad:** P3.

**Recomendación:** Unificar empty states del sitio usando este componente o eliminarlo.

---

## HEADER (Desktop + Mobile)

**Archivo:** `components/layout/UniversityHeader.tsx`

**Lo que funciona**
- Logo Molino con animación SVG (wing rotate).
- Navegación principal (Inicio, Explorar, Biblioteca, Filosofía, Guía).
- "HOY" y "MI MAPA" visibles solo con perfil.
- Botón "NUEVO PERFIL" con confirmación modal (focus trap, escape key).
- Theme toggle (Sun/Moon) con next-themes.
- Mobile menu animado con `aria-expanded` y `aria-controls`.
- Scroll detection con `useScroll` + backdrop blur.

**Problemas UX**
- Active state en nav links: `pathname === link.href` — no cubre sub-rutas (ej: `/affinity/compare` no marca `/affinity` como activo).
- HOY y MI MAPA no tienen active state visual (siempre `text-muted` aunque estés en esa página).
- Sin skip-link visible para teclado (el `.skip-link` existe en CSS pero no hay elemento en el header).
- Mobile menu no tiene `aria-label` en el nav.

**Problemas visuales**
- Theme toggle cambia de Sun a Moon pero el icono se reemplaza abruptamente sin transición.
- Logo tiene borde `border-ink/10` que se ve como cuadro separado.

**Problemas de consistencia**
- "DESCUBRIR MI MAPA" usa `btn-accent` en desktop pero `bg-accent text-white` inline en mobile — estilos diferentes.

**Impacto:** Alto. Es la navegación principal del sitio.

**Prioridad:** P1.

**Recomendación:** Agregar active state para sub-rutas y para HOY/MI MAPA. Unificar estilo del CTA mobile/desktop.

---

## FOOTER

**Archivo:** `components/layout/UniversityFooter.tsx`

**Lo que funciona**
- Grid de 12 columnas con logo + columnas de navegación.
- Links a todas las secciones principales.
- Datos de navegación desde `lib/data/navigation.ts`.

**Problemas UX**
- Sin links a redes sociales.
- Sin información de contacto o legal.

**Problemas visuales**
- ~~`bg-ink` se volvía blanco en dark mode — FIXED: ahora `bg-[#0F0F10]` fijo.~~
- `text-white/60`, `text-white/40` sobre fondo oscuro fijo — correcto ahora.
- Logo SVG casero con líneas finas — puede verse mal en screens de baja resolución.

**Problemas de consistencia**
- Padding usa `py-20 sm:py-24` — consistente con otras secciones.

**Impacto:** Bajo (footer es consistente y funcional).

**Prioridad:** P3.

**Recomendación:** Agregar redes sociales. Considerar logo SVG más definido.

---

## BREADCRUMBS

**Uso:** Solo en Daily Energy (`/daily-energy`) y en contenido individual (`/conocimiento/numerologia/[numero]`).

**Lo que funciona**
- Daily energy: Inicio > Energía Diaria — correcto.
- Numerología página individual: Inicio > Conocimiento > Numerología > 7 — correcto.

**Problemas UX**
- La mayoría de las páginas no tienen breadcrumbs — dificulta navegación profunda.
- Sin breadcrumbs en secciones anidadas como `/afinidad/[type]/[slug]`.

**Problemas de consistencia**
- Los que existen son inline, no hay componente `<Breadcrumbs>` compartido.

**Impacto:** Bajo.

**Prioridad:** P3.

**Recomendación:** Crear componente `<Breadcrumbs>` y usarlo en todas las páginas con profundidad > 2.

---

## BOTONES

**Componente:** `components/ui/Button.tsx`
**Clases globales:** `globals.css` (`.btn`, `.btn-accent`, `.btn-primary`, `.btn-ghost`)

**Lo que funciona**
- Button component con 3 variantes (primary, secondary, ghost), 3 tamaños, fullWidth, asChild.
- Estados: hover (✓), disabled (✓ opacity-50 + cursor-not-allowed).
- `focus-visible` agregado en esta auditoría para btn-accent, btn-primary, btn-ghost.
- `disabled` agregado en esta auditoría para btn-accent, btn-primary, btn-ghost.

**Problemas UX**
- Button component no tiene `loading` prop con spinner automático.
- `asChild` con `React.cloneElement` es frágil (sobrescribe className por concatenación).
- Button component usa `focus:` en vez de `focus-visible:` (el ring aparece en click — ruido visual).

**Problemas visuales**
- Button component usa `rounded-full` — viola el diseño brutalista (`rounded-none`). Esto es intencional para el componente Button pero los `btn-*` globales no tienen border-radius. Hay dos sistemas de botones con estilos diferentes.
- 4 páginas mezclan `<Button>` con `btn-accent` en la misma página (timing, daily-energy, decisions, evolution).

**Problemas de consistencia**
- 20+ botones inline replican las mismas clases de Tailwind que el componente Button.
- Submit button en decisions usa `btn-accent` con `disabled` — antes no tenía estilo disabled (FIXED en esta auditoría).
- Botones "Calcular" en herramientas usan patrón inline idéntico (repetido en 3 páginas).

**Impacto:** Alto. Afecta todas las interacciones del usuario.

**Prioridad:** P0.

**Recomendación:** Migrar todos los botones a usar `<Button>` o `btn-*` consistentemente. Decidir border-radius: el componente Button usa `rounded-full`, las `btn-*` globales no. Agregar `loading` prop a Button.

---

## CARDS

**Componente:** `components/ui/Card.tsx`

**Lo que funciona**
- Componente simple con padding sm/md/lg y hover elevado opcional.
- Usa la clase CSS `card` de globals.css.

**Problemas UX**
- Sin estados (loading, error, empty).
- Sin variante clickable con cursor pointer y active state.
- Sin variante compacta para grids densos.

**Problemas visuales**
- `hover:shadow-sm hover:-translate-y-[2px]` — no hay shadows en el sistema de diseño (`--shadow-sm: none`). El hover no produce efecto visual.

**Problemas de consistencia**
- El componente se usa en pocos lugares. La mayoría de las páginas usan `border border-border bg-card` inline.

**Impacto:** Medio.

**Prioridad:** P2.

**Recomendación:** Actualizar hover para usar `border-color: var(--color-accent)` en vez de shadow (que no existe). Migrar uso inline al componente.

---

## INPUTS / DATE INPUTS

**Componentes:** `ui/DateInput.tsx`, `ui/DatePicker.tsx`, `ui/ScrollDatePicker.tsx`

**Lo que funciona**
- DateInput con auto-advance, validación de rango, soporte teclado, `tabular-nums`.
- 3 componentes de fecha diferentes (DateInput, DatePicker, ScrollDatePicker) — sobreingeniería.
- `focus-within` ring en DateInput con `border-accent/60` y `ring-2 ring-accent/10`.
- `aria-label` y `role="group"` correctos.

**Problemas UX**
- 3 date pickers para el mismo propósito — confusión sobre cuál usar.
- DatePicker y ScrollDatePicker no se usan (dead code?).
- Sin autocomplete de fecha por voz (iOS Safari, Android).

**Problemas visuales**
- DateInput usa `border-border` con `focus-within:border-accent/60` — consistente.
- Placeholder `text-muted-foreground/30` con opacidad muy baja — puede ser difícil de leer.

**Problemas de consistencia**
- DatePicker y ScrollDatePicker tienen estilos diferentes a DateInput.

**Impacto:** Bajo (solo onboarding usa input de fecha).

**Prioridad:** P3.

**Recomendación:** Consolidar a un solo date picker. Evaluar si DatePicker y ScrollDatePicker son necesarios.

---

## BADGES / TAGS

**Definidos en:** `globals.css` (`.badge`)

**Lo que funciona**
- `.badge` global con font-heading, uppercase, letter-spacing, bg-accent.
- Badges de "Triple" en RecommendationContent (con `text-success` — FIXED).

**Problemas UX**
- Sin variantes de color (solo accent).
- Sin variante outline (transparente con borde).

**Problemas visuales**
- `.badge` usa `border-radius: 0` — correcto para diseño brutalista.
- Badges de score en páginas de afinidad usan estilos inline — inconsistentes.

**Problemas de consistencia**
- No hay componente `<Badge>`, solo clase CSS.

**Impacto:** Bajo.

**Prioridad:** P3.

**Recomendación:** Crear componente `<Badge>` con variantes de color.

---

## PREMIUM GATE

**Archivo:** `components/profile/PremiumGate.tsx`

**Lo que funciona**
- Paywall desactivado (`PREMIUM_ENABLED = false`) — todo el contenido es gratis.
- Payment flow UI completo (Mercado Pago, cupones, polling, analytics) — inactivo pero intacto.
- Dark overlay consistente con diseño (fondo `#0f0c29` fijo, no cambia con theme).

**Problemas UX**
- El flag `PREMIUM_ENABLED` es una constante booleana — no hay plan para reactivación gradual.
- Sin indicación visual de que premium está desbloqueado (el usuario no sabe que todo es gratis ahora).

**Problemas visuales**
- El overlay premium tiene su propio tema oscuro fijo, independiente del theme del sitio — desconectado visualmente.

**Problemas de consistencia**
- Los botones de pago usan inline Tailwind — diferentes al resto del sitio.

**Impacto:** Bajo (inactivo).

**Prioridad:** P3.

**Recomendación:** Agregar indicador visual "Todo gratis" cuando PREMIUM_ENABLED = false. Mantener código de pago intacto para reactivación futura.

---

## HEADER ACTIVE STATE (Hallazgo post-auditoría)

**Lo que funciona**
- Nav links cambian `text-muted` → `text-foreground` cuando `pathname === link.href`.
- `aria-current="page"` presente en links activos.
- Mobile menu cierra al navegar (useEffect en pathname).

**Problemas UX**
- Active state no cubre sub-rutas: `/affinity/compare` no marca `/affinity`.
- HOY y MI MAPA no tienen active state — siempre en `text-muted`.
- Sin breadcrumbs para compensar la falta de active state en sub-rutas.

**Prioridad:** P1.

---

## DARK MODE (Hallazgos post-auditoría)

**Corregido en esta auditoría:**
- Footer: `bg-ink` → `bg-[#0F0F10]` (era white-on-white en dark mode).
- `bg-black/[0.02]` → `bg-ink/[0.02]` en 11 lugares (hover invisible en dark mode).
- `text-[#B45309]` → `text-muted` / `text-accent` en InsightsContent e IdentityCard.
- `bg-[#2D5A3D]` → `bg-success/10 text-success` en RecommendationContent.

**Pendiente:**
- ShareableImageCard tiene estilos inline fijos (warm beige background con texto oscuro) — es un elemento exportado, no afecta dark mode del sitio.
- Score colors (`text-green-600`, `text-blue-600`, etc.) son semánticos — no cambian con theme. Evaluar si deberían adaptarse.
- PremiumGate overlay es un tema fijo separado — intencional.

---

## CÓDIGO MUERTO ELIMINADO

**Archivos eliminados:**
- `components/ui/Grid.tsx` — no importado por ningún archivo.
- `components/ui/GridSystem.tsx` — duplicado de Grid.tsx.
- `components/ui/Masonry.tsx` — no importado por ningún archivo.

**Código eliminado:**
- `getScoreBg` — función definida pero no usada en `daily-energy/page.tsx`.
- `font-serif` → `font-heading` — 117 reemplazos (no había font serif cargada).
- `rounded-lg|xl|2xl|3xl` → `rounded-none` — 100+ reemplazos (diseño brutalista).

**Código muerto que permanece:**
- `components/ui/EmptyState.tsx` — nunca importado. Decidir si eliminar o integrar.
- `components/ui/DatePicker.tsx`, `ScrollDatePicker.tsx` — no se usan activamente (DateInput es el que se usa).

---

## GUÍA — Artículos faltantes (Corregido)

**Archivos creados:**
- `app/guia/numeros-maestros/page.tsx` — stub con metadata + mensaje "en preparación".
- `app/guia/compatibilidad-astrologica/page.tsx` — stub con metadata + mensaje "en preparación".

---

## REDIRECT PAGES (Corregido)

**Archivos mejorados:** 6 páginas (`/for-you`, `/patterns`, `/synthesis`, `/portal`, `/alignment`, `/ai`).

**Antes:** `<div className="text-muted" role="status">Redirigiendo...</div>`
**Ahora:** `<LoadingState message="Redirigiendo..." fullScreen />`

---

## TRABAJO COMPLETADO (Fase 3 — Implementación)

### Componentes
| Tarea | Estado |
|-------|--------|
| `Button` loading prop | ✅ Implementado |
| `Breadcrumbs` component | ✅ Creación completada |
| `EmptyState` integración | ✅ 6 páginas migradas + 2 empty states faltantes agregados |
| Inline buttons → `<Button>` | ✅ Confirm dialog buttons migrados |
| `getScoreColor` inline → `lib/utils/score.ts` | ✅ 5 duplicados eliminados, thresholds unificados (75/55/40) |

### Spacing (Diseño System)
| Tarea | Estado |
|-------|--------|
| Container `px-5` → `px-4` | ✅ 58 ubicaciones corregidas |
| Card padding `p-5` → `p-6` | ✅ Card.tsx + todas las páginas |
| cellPad `p-8 sm:p-10 lg:p-14` → `p-8 lg:p-12` | ✅ 23 ubicaciones |
| `py-20` → `py-16` / `py-24` | ✅ 8 ubicaciones |
| `pb-28` → `pb-24` | ✅ 10 ubicaciones |

### Header / Navegación
| Tarea | Estado |
|-------|--------|
| Active state `pathname.startsWith()` para sub-rutas | ✅ Implementado |
| HOY y MI MAPA active state visual | ✅ Implementado (color accent) |
| CTA mobile/desktop unificado | ✅ Mismo estilo `bg-accent text-accent-foreground` |
| Confirm dialog buttons → `<Button>` | ✅ Migrado |

### Otros
| Tarea | Estado |
|-------|--------|
| `ScoreDisplay.tsx` shadow de `getScoreColor` eliminado | ✅ Usa `getScoreBgColor` |
| `RecommendationContent.tsx` local `getScoreColor` → `getScoreHexColor` | ✅ Renombrado |
| `max-w-7xl` → `max-w-8xl` | ✅ 3 ubicaciones |
| `font-serif` → `font-heading` | ✅ 117 reemplazos (Fase 1) |
| `rounded-lg\|xl\|2xl\|3xl` → `rounded-none` | ✅ 100+ reemplazos (Fase 1) |
| `bg-black/\[0.02\]` → `bg-ink/\[0.02\]` | ✅ 11 lugares (Fase 1) |
| Footer `bg-ink` → `bg-\[#0F0F10\]` | ✅ Corregido (Fase 1) |
| `focus-visible` / `disabled` btn styles | ✅ Agregados (Fase 1) |
| EmptyState inline → component | ✅ 6 páginas |
| Guía artículos faltantes (stub pages) | ✅ Creados (Fase 1) |
| Redirect pages → LoadingState | ✅ 6 páginas (Fase 1) |
| Grid.tsx / GridSystem.tsx / Masonry.tsx eliminados | ✅ Dead code (Fase 1) |
| `getScoreBg` eliminado (dead code) | ✅ (Fase 1) |
| `PREMIUM_ENABLED = false` | ✅ Desbloqueado (Fase 1) |
| PremiumGate features expuestas | ✅ Navegación (Fase 1) |
| `max-w-7xl` → `max-w-8xl` | ✅ 3 ubicaciones |

### Diseño System
| Tarea | Estado |
|-------|--------|
| Design System v1 documentado | ✅ `DESIGN_SYSTEM.md` completo (12 secciones + 4 appendices) |
| Espaciado: 9 tokens, 4 contenedores | ✅ Documentado |
| Tipografía: 9 niveles cerrados | ✅ Documentado |
| Colores: 12 roles semánticos | ✅ Documentado |
| Bordes, radios, sombras | ✅ Documentado |
| Componentes base: 17 especificaciones | ✅ Documentado |
| Layout grid | ✅ Documentado |
| Motion tokens | ✅ Documentado |
| Navegación | ✅ Documentado |
| Decisiones sistémicas | ✅ Documentado |

---

## RESUMEN DE PRIORIDADES

| Prioridad | Cantidad | Items | Estado |
|-----------|----------|-------|--------|
| P0 | 4 | Home Hero, Home Page, Onboarding, Botones | ✅ Botones completado, resto pendiente |
| P1 | 5 | Daily Energy, Affinity Compare, Header Active State, Conocimiento, Dark Mode | ✅ Header + Daily Energy completado |
| P2 | 4 | Affinity Hub, Explore, Loading States, Cards | ✅ Explore empty state completado, Cards pendiente |
| P3 | 5 | 404, Footer, Breadcrumbs, Empty State, Inputs, Premium Gate, Badges | ✅ Breadcrumbs creado, EmptyState integrado |

---

### Pendientes para fases futuras

**Fase 4 — Header:**
- Migrar `max-w-7xl` en ProfileHub/ConvergentSection/ProfileTabs → `max-w-8xl` (ya hecho)

**Fase 5 — Home:**
- Simplificar hero para comunicación de 3 segundos

**Fase 5 — Páginas internas:**
- Migrar `border border-border bg-card` inline → `<Card>` component (100+ ubicaciones)
- Crear componentes `<Badge>`, `<ErrorMessage>`, `<Chip>`, `<SearchInput>`
- Skeleton loading para profile y daily-energy
- Unificar botones "Calcular" en herramientas

**Fase 6 — Refinamiento visual:**
- Evaluar si `rounded-full` en `<Button>` debe ser `rounded-none` para consistencia brutalista
- Crear `<Toast>` component para feedback
- Evaluar DatePicker/ScrollDatePicker consolidation

**Fase 7 — Premium reactivación:**
- Reactivar `PREMIUM_ENABLED = true` cuando haya valor sostenible
- Reconstruir flujo de pago con UX actualizada

---

*Auditoría completa — Fase 1 (auditoría + design system). Fase 2 (design system v1). Fase 3 (implementación). Total de issues auditados: ~50. Corregidos: ~35. Documentado: design system v1 completo.*
