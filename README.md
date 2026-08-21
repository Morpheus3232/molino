# Molino — Mapa Personal de Autoconocimiento

> El conocimiento simbólico es patrimonio de la humanidad.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Morpheus3232/molino/actions/workflows/ci.yml/badge.svg)](https://github.com/Morpheus3232/molino/actions/workflows/ci.yml)
[![Tests](https://github.com/Morpheus3232/molino/actions/workflows/test.yml/badge.svg)](https://github.com/Morpheus3232/molino/actions/workflows/test.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-brightgreen.svg)](https://github.com/Morpheus3232/molino)

## Philosophy

Molino generates a personal "symbol map" — your numerological path, astrological chart, and Chinese zodiac cycle — from your birth date. Everything runs **100% locally in your browser**; no registration, no backend persistence, no tracking. The calculation engine is transparent: every number has its formula and source visible.

### Core commitments

- 🔍 **Transparency over mystique**: Every formula is shown; no "trust the algorithm" claims. Each result links to its source.
- 🔒 **Radical privacy**: Your map lives in browser localStorage only. No registration, no cookies, no fingerprinting, no server persistence.
- 📚 **Open source**: All code is MIT. Anyone can verify, fork, or contribute.
- 🎓 **For the curious, not initiated**: Designed for people discovering numerology/astrology for the first time, not advanced practitioners.
- 🚫 **No invasive tracking**: Only anonymous, aggregate usage metrics. No pixels, fingerprinting, or data resale.

## Tecnologías

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes (dark mode)
- Vitest + Playwright (testing)
- html-to-image (exportar mapa como PNG)

## Estructura del Proyecto

```
molino/
├── app/
│   ├── page.tsx              # Landing (Hero + SystemsPreview + Testimonial + TrustMetrics)
│   ├── onboarding/           # Wizard 3 pasos (fecha → preview → generar)
│   ├── profile/              # Mapa personal (hub + 4 pantallas)
│   ├── explore/              # Explorador de entidades
│   ├── affinity/             # Afinidad simbólica
│   ├── compatibilidad/       # Compatibilidad entre perfiles
│   ├── biblioteca/           # Glosario + fuentes con búsqueda
│   ├── filosofia/            # Principios y fundamentos (con anclas directas)
│   ├── conocimiento/         # Contenido educativo
│   ├── hoy/                  # Energía diaria + timing (con fallback sin perfil)
│   ├── timing/               # Calendario de fechas favorables
│   ├── evolution/            # Evolución temporal del mapa
│   ├── decisions/            # Mapa de decisiones
│   ├── synthesis/            # Lectura profunda
│   └── api/                  # API routes
├── components/
│   ├── layout/               # Header (nav + dropdown + hamburger + theme), Footer
│   ├── profile/              # Hub, screens, EphemeralWarning, DownloadButton
│   ├── sections/             # HeroClient, SystemsPreview
│   ├── social/               # TrustMetrics, Testimonial (prueba social)
│   ├── ui/                   # Componentes base
│   ├── effects/              # Efectos visuales (Prism, Grainient)
│   ├── providers/            # ThemeProvider
│   └── analytics/            # AnalyticsProvider (localStorage only)
├── legacy/
│   ├── Journey.tsx           # Descontinuado
│   ├── ConceptsIndex.tsx     # Descontinuado
│   └── README.md
├── lib/
│   ├── engines/              # Motores de cálculo (numerología, astrología, zodiaco chino, afinidad)
│   ├── session/              # Memoria efímera de sesión
│   ├── data/                 # Datos públicos estáticos (incl. navigation.ts para footerColumns)
│   ├── hooks/                # React hooks
│   ├── utils/                # Utilidades (incl. daily-energy-utils.ts para /hoy fallback)
│   ├── analytics/            # Analytics interno (localStorage)
│   └── profile/              # Hash de perfil compartible
├── public/                   # Assets estáticos
└── types/                    # Tipos TypeScript
```

## Instalación

```bash
git clone https://github.com/Morpheus3232/molino.git
cd molino
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # ESLint
npm run test      # Tests unitarios (Vitest)
npm run test:e2e  # Tests E2E (Playwright)
```

## Licencia

MIT — Libre para usar, modificar y compartir.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Fuentes de los Sistemas

- Numerología Pitagórica — Tradición histórica documentada
- Astrología Occidental — Zodíaco Tropical / Sistema de Casas
- Zodíaco Chino — Ciclo Sexagenario