# Auditoría UX/SEO — Molino

## 1. SEO Técnico

| Issue | Fix | Impact |
|-------|-----|--------|
| `<link rel="canonical">` apuntaba a `molino-alpha.vercel.app` | Creado `lib/seo.ts` con `SITE_URL = "https://www.molino.app"`. Root layout, robots, sitemap, y todos los JSON-LD ahora usan la constante. | Los motores de búsqueda ahora canonicalizan a producción, no a staging. |
| OG image en SVG (no renderiza en varias plataformas sociales) | Reemplazado por `app/opengraph-image.tsx` que genera PNG dinámico 1200×630 vía `next/og`. | Preview social funcional en todas las plataformas. |
| 46 URLs hardcodeadas con `molino-alpha.vercel.app` en JSON-LD | Reemplazadas con `SITE_URL` + `siteUrl()` en 13 archivos. | Datos estructurados correctos en producción. |
| `/method` sin metadata (página "use client" sin export `metadata`) | Separado en `page.tsx` (servidor con metadata) + `MethodContent.tsx` (cliente). | Título y OG tags correctos en /method. |
| `/guia` sin OG/Twitter cards | Agregados `openGraph` y `twitter` al metadata. | Preview social funcional en /guia. |
| JSON-LD solo tenía `WebSite` | Agregado `SoftwareApplication` con precio gratuito y categoría educativa. | Mayor riqueza en resultados de búsqueda. |
| `metadataBase` incorrecto | Actualizado a `https://www.molino.app`. | URLs relativas resueltas contra dominio correcto. |

## 2. Navegación

| Issue | Fix | Impact |
|-------|-----|--------|
| Link "GITHUB" apuntaba a `https://github.com` genérico | Corregido a `https://github.com/Morpheus3232/molino` en `lib/data/navigation.ts`. | Usuarios llegan al repo real. |
| Header y footer con listas de navegación duplicadas e inconsistentes | Creado `lib/data/navigation.ts` como única fuente de verdad. Header consume `headerNavLinks`, footer consume `footerColumns`. | Consistencia navegacional; cambiar un link en un solo archivo. |

## 3. Performance

| Issue | Fix | Impact |
|-------|-----|--------|
| Framer Motion cargado completo en todas las rutas | Agregado `LazyMotion` con `domAnimation` en `MotionProvider.tsx`. | Las features de animación se cargan bajo demanda; reducción de bundle JS compartido. |
| Bundle size por ruta saludable | Shared First Load JS: 102 kB. Ruta más pesada: /profile (248 kB). | Sin regresiones; dentro de parámetros aceptables. |
| ScrollDatePicker con ~86 opciones de año | No requiere cambio — usa scroll nativo con CSS snap, sin virtual DOM ni handlers costosos. | Ya es performante. |
| Imágenes sin `next/image` | No hay imágenes rasterizadas en `public/` (solo SVG para iconos y OG). | No aplica. |
| Journey con DOM triplicado | Consolidado a single responsive grid en sesión anterior. | 1 set de elementos en el DOM en vez de 3. |

## 4. Accesibilidad (WCAG 2.1 AA)

| Issue | Criterio | Fix |
|-------|----------|-----|
| "VER MÁS" repetido 4 veces para destinos distintos (Journey) | 2.4.4 Link Purpose in Context | Agregado `aria-label` descriptivo por paso (`"Ver más sobre numerología"`, etc.). |
| "LEER MÁS" repetido para sistemas distintos (SystemsPreview) | 2.4.4 Link Purpose in Context | Agregado `aria-label` con nombre del sistema (`"Leer más sobre Astrología"`). |
| "DESCUBRIR MI MAPA" repetido en HeroNew y FinalCTA | 2.4.4 Link Purpose in Context | Agregado `aria-label` específico en ambos botones. |
| ScrollDatePicker sin navegación por teclado | 2.1.1 Keyboard | Agregados handlers ArrowUp/ArrowDown/Home/End + `aria-label` por columna (día/mes/año). |
| Color mutado `#8A8A8A` en fondo blanco: ratio 3.42:1 | 1.4.3 Contrast (Minimum) | Oscurecido a `#6B6B6B` (ratio 5.7:1), ahora cumple AA. |
| Skip-link ya presente en layout raíz | 2.4.1 Bypass Blocks | Verificado: existe en `app/layout.tsx` con clase `.skip-link` y estilo `:focus`. |

## 5. Privacidad

| Servicio | Tipo | Estado |
|----------|------|--------|
| Google Fonts | Tipografía | Self-hosted vía `next/font/google` — sin requests externos en runtime. |
| PostHog | Analytics | Condicional (solo con env var), `cookieless_mode: always`, sin autocapture, sin pageview automático. |
| OpenAI / Anthropic | AI | Server-side only — datos de fecha de nacimiento nunca expuestos al cliente. |
| Facebook, Google Analytics, Hotjar, etc. | Tracking | Ausentes en todo el código. |

**Veredicto:** El claim de privacidad ("cero registro, cero cookies, cero almacenamiento de datos personales") se sostiene. Los únicos datos almacenados son en localStorage para la sesión efímera del perfil y analytics locales (visibles solo para el usuario, no enviados a terceros sin configuración explícita).
