# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público general hispanohablante (foco LatAm) curioso por el autoconocimiento simbólico — numerología pitagórica, astrología y zodíaco chino/ciclo sexagenario. No se asume conocimiento técnico previo de estos sistemas: el onboarding pide solo fecha de nacimiento y, opcionalmente, nombre. Confirmado con el usuario (no practicantes avanzados/nicho esotérico).

## Product Purpose

Molino generates a personal "symbol map" — numerological path, astrological chart, Chinese zodiac cycle — from birth date alone (name optional). All calculations run 100% in-browser; no backend persistence, no registration. Success = the user understands their own symbolic pattern, can explore related affinities (brands, cities, teams, artists, films, countries), and sees every formula and source. Every claim is traceable.

## Positioning

**Radical transparency + privacy by design.** Every calculation shows its formula and source, step by step. The symbol map lives **only in browser localStorage** — no registration, no cookies, no fingerprinting, no backend persistence. This differentiates Molino from commercial astrology/numerology apps that retain data, monetize via opaque subscriptions, or present claims without traceability. Open source (MIT) and independently verifiable.

## Operating Context

- Onboarding de 3-4 pasos (fecha → preview del animal/LifePath → nombre opcional → perfil).
- `/profile`: hub central con 20+ secciones (identidad, convergencia, timing, recomendaciones, afinidades, mapa del mundo, compartir).
- `/affinity/*`: exploración de afinidad simbólica por categoría (marcas, ciudades, países, universidades, equipos, películas, artistas), con boost de resultados según el país de origen del usuario.
- `/explore`, `/biblioteca`, `/filosofia`, `/conocimiento`, `/hoy`, `/timing`, `/compatibilidad`, `/evolution`, `/decisions`, `/synthesis`: contenido educativo y herramientas derivadas del perfil.
- 18 engines de cálculo en `lib/engines/` (zodiaco chino con fechas CNY reales, numerología, astrología, compatibilidad, recomendación, timing, decisiones, síntesis, etc.).
- Export de perfil como imagen (html-to-image) para compartir.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, TypeScript, Tailwind, Framer Motion ya instalados; `ogl` (WebGL) también está como dependencia pero su uso actual es limitado — disponible para efectos generativos.
- Sin backend de persistencia: todo el estado de usuario vive en localStorage/sesión efímera. Cualquier elemento "vivo" del rediseño (motion generativo, fondos reactivos) debe ser client-side y no requerir servidor de estado.
- Datos 100% reales y verificables (fechas, fuentes) — el rediseño no debe introducir contenido inventado.
- Mantener toda la funcionalidad y estructura de información actual: el pedido explícito del usuario es cambio visual/motion, no de producto ni de arquitectura de información.
- Testing: Vitest (789 tests unitarios) + Playwright E2E — deben seguir pasando tras el rediseño.
- Performance: sitio debe seguir siendo liviano pese a agregar motion/efectos generativos (evitar WebGL pesado en mobile de gama baja).

## Brand Commitments

- Nombre "Molino" se mantiene.
- Filosofía de privacidad radical, transparencia (fórmulas/fuentes visibles) y "sin tracking invasivo" son compromisos de producto, no solo de marca — deben seguir comunicándose en la UI (ej. badges/sección de filosofía), aunque el tono de voz y la piel visual tienen margen para evolucionar hacia algo más futurista (confirmado con el usuario: hay margen para ajustar tono, no solo visual).

## Evidence on Hand

- README.md, MOLINO_CONTEXT.md, DESIGN_SYSTEM.md, MOTION.md, ARCHITECTURE.md, LAYOUT_SYSTEM.md documentan el sistema actual (algunos con fecha 30/jul, pueden estar desactualizados respecto al código — tratar el código como fuente de verdad primaria).
- Docs de auditoría/estrategia previas viven ahora en `docs/archive/` (evidencia histórica, no autoridad vigente).
- 18 engines de cálculo reales con fuentes documentadas (ver `lib/engines/`, `lib/data/sources.ts`).

## Product Principles

1. Transparencia sobre ilusión: cada dato mostrado tiene que poder rastrearse a una fórmula o fuente real, incluso si la piel visual se vuelve más "viva"/generativa.
2. Privacidad por diseño no es negociable: ningún efecto visual o de motion puede requerir tracking, fingerprinting o backend nuevo.
3. Accesible para el curioso, no solo para el iniciado: la sofisticación visual no debe agregar fricción cognitiva a un onboarding pensado para gente sin conocimiento previo del tema.
4. La función manda: el rediseño no cambia información, rutas ni engines — solo cómo se ven y se sienten.
