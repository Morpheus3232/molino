# Molino — Mapa Personal de Autoconocimiento

> El conocimiento simbólico es patrimonio de la humanidad.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Morpheus3232/molino/actions/workflows/ci.yml/badge.svg)](https://github.com/Morpheus3232/molino/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![No Tracking](https://img.shields.io/badge/Sin%20Tracking%20Invasivo-✓-brightgreen.svg)](https://github.com/Morpheus3232/molino)

## Filosofía

Molino es una plataforma educativa de código abierto que explora sistemas simbólicos (numerología pitagórica, astrología tropical, zodíaco chino/ciclo sexagenario) con total transparencia y privacidad. Sin registro, sin cookies, sin tracking invasivo.

### Principios

- 📚 **Conocimiento libre**: Todo el contenido se basa en fuentes públicas.
- 🔒 **Privacidad radical**: No persistimos datos en servidores. Tu perfil se procesa localmente y vive en tu navegador (localStorage).
- 🔍 **Transparencia total**: Cada cálculo está explicado con sus fórmulas y fuentes.
- 💻 **Código abierto**: Todo el código está disponible en GitHub (licencia MIT).
- 🚫 **Sin tracking invasivo**: Sin píxeles, sin fingerprinting, sin cookies de rastreo. Solo métricas de uso agregadas y anónimas.

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
│   ├── page.tsx              # Landing
│   ├── onboarding/           # Wizard 3 pasos (fecha → preview → generar)
│   ├── profile/              # Mapa personal (hub + 4 pantallas)
│   ├── explore/              # Explorador de entidades
│   ├── affinity/             # Afinidad simbólica
│   ├── compatibilidad/       # Compatibilidad entre perfiles
│   ├── biblioteca/           # Glosario + fuentes con búsqueda
│   ├── filosofia/            # Principios y fundamentos (con anclas directas)
│   ├── conocimiento/         # Contenido educativo
│   └── api/                  # API routes
├── components/
│   ├── layout/               # Header (nav + hamburger + theme), Footer
│   ├── profile/              # Hub, screens, EphemeralWarning, DownloadButton
│   ├── sections/             # Hero, Journey, SystemsPreview, HowItWorks
│   ├── ui/                   # Componentes base
│   ├── effects/              # Efectos visuales (Prism, Grainient)
│   ├── providers/            # ThemeProvider
│   └── analytics/            # AnalyticsProvider
├── lib/
│   ├── engines/              # Motores de cálculo (numerología, astrología, zodiaco chino, afinidad)
│   ├── session/              # Memoria efímera de sesión
│   ├── data/                 # Datos públicos estáticos
│   ├── hooks/                # React hooks
│   ├── utils/                # Utilidades
│   ├── analytics/            # Analytics interno
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

## Créditos

- Sistema GG33 — Gary Grinberg (como referencia)
- Numerología Pitagórica — Fuente histórica
- Astrología Occidental — Zodíaco Tropical
- Zodíaco Chino — Ciclo Sexagenario