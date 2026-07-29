# Arquitectura de Molino

## Stack

| Capa       | Tecnología                      |
| ---------- | ------------------------------- |
| Framework  | Next.js 15 (App Router)         |
| Lenguaje   | TypeScript 5                    |
| Estilos    | Tailwind CSS + CSS Variables    |
| Animación  | Framer Motion                   |
| Tema       | next-themes (class-based)       |
| Testing    | Vitest (unit) + Playwright (e2e)|
| CI         | GitHub Actions                  |

## Estructura de carpetas

```
app/                    # Next.js App Router (rutas + layouts)
  page.tsx              # Landing
  onboarding/           # Wizard 3 pasos (fecha → preview → generar)
  profile/              # Mapa personal (hub + 4 pantallas)
  filosofia/            # Principios y fundamentos
  docs/motores/         # Documentación técnica de fórmulas
  biblioteca/           # Glosario + fuentes con búsqueda
  conocimiento/         # Contenido educativo por motor
  affinity/             # Afinidad simbólica entre entidades
  explore/              # Explorador de entidades
  sitemap.ts            # Sitemap dinámico
  robots.ts             # Robots.txt dinámico
  globals.css           # Variables CSS + diseño system

components/
  layout/               # UniversityHeader, UniversityFooter
  profile/              # ProfileHub, EphemeralWarning, DownloadProfileButton, screens/
  sections/             # Hero, Journey, SystemsPreview, HowItWorks
  ui/                   # Componentes base (Grid, GridSystem, LoadingState, etc.)
  providers/            # ThemeProvider (wrapper de next-themes)
  effects/              # Efectos visuales (Prism, Grainient)
  analytics/            # AnalyticsProvider

lib/
  engines/              # Motores de cálculo
    numerologyEngine.ts
    astrologyEngine.ts
    chineseZodiacEngine.ts
    compatibilityEngine.ts
    __tests__/          # Tests unitarios (55+ tests)
  session/              # Memoria efímera (ephemeral.ts, localStorage.ts, discovery.ts)
  data/                 # Datos públicos estáticos
  hooks/                # React hooks (useProfile, etc.)
  utils/                # Utilidades (motion, profileShare, etc.)
  analytics/            # Sistema de analytics interno (sin terceros)

types/                  # Tipos TypeScript (user.d.ts, etc.)
e2e/                    # Tests end-to-end (Playwright)
public/                 # Assets estáticos
```

## Flujo de datos

1. **Onboarding**: usuario ingresa fecha → se guarda en localStorage → redirect a `/profile?dob=YYYY-MM-DD`
2. **Profile**: lee `?dob=` o `?data=` (shared) o localStorage o sesión efímera → calcula perfil con `calculateUserProfile()` → muestra hub + screens
3. **Persistencia**: localStorage para el perfil activo. Sesión efímera (memoria) para datos temporales. Sin servidor, sin base de datos.
4. **Compartir**: `/perfil/[hash]` codifica datos en la URL (base64 comprimido). Sin servidor.

## Convenciones

- `lang="es-AR"` (vos) en todo el sitio
- `font-heading` (Space Grotesk) para títulos; `font-sans` (Inter) para cuerpo
- Dark mode vía clase `.dark` en `<html>` (next-themes)
- Sin `border-radius` (todas las esquinas rectas, salvo casos puntuales)
- Sin sombras (salvo en dark mode)
- Componentes "use client" solo cuando necesitan interactividad

## Motores de cálculo

Cada motor es una función pura (determinista) que recibe una fecha y devuelve datos estructurados:

- **Numerología**: Camino de Vida, Expresión, Alma, Personalidad, Día de Nacimiento
- **Astrología**: Signo Solar, Elemento, Modalidad, Casa
- **Zodíaco Chino**: Animal, Elemento, Ciclo Sexagenario, Pilares

## Testing

```bash
npm run test        # Tests unitarios (Vitest)
npm run test:e2e    # Tests E2E (Playwright)
npm run lint        # ESLint
npm run typecheck   # TypeScript checks
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):
- lint + typecheck → test → build (en paralelo parcial)
- Se ejecuta en cada push/PR a main
