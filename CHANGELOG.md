# Registro de Cambios (Changelog) — Molino.app

Todos los cambios notables en la arquitectura, diseño y motores de Molino se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.1.0] - 2026-08-14

### Agregado
- **Bóveda de Mapas Locales Multi-Perfil:** Almacenamiento local de perfiles (propio, pareja, familia, socios) sin registrar cuentas ni enviar datos a servidores.
- **Web Worker Engine (`lib/workers/`):** Cálculo asíncrono en segundo plano para evitar bloqueos del Main Thread en dispositivos móviles.
- **Widget Embebible (`/embed`):** Widget interactivo compacto para insertar en blogs de desarrollo personal y páginas de terapeutas.
- **API Pública v1 (`/api/v1/map`):** Endpoint con soporte CORS para consultar mapas simbólicos en formato JSON estructurado.
- **Portal de Profesionales (`/profesionales`):** Guía de aplicación clínica y metodológica para psicólogos, terapeutas y coaches.
- **Schemas JSON-LD Avanzados:** Integración de `HowTo`, `FAQPage` y `BreadcrumbList` para Rich Snippets en buscadores.
- **Accesibilidad en Gráficos (a11y):** Tablas semánticas `sr-only` para lectores de pantalla en gráficos Recharts.

### Mejorado
- **Resiliencia & Error Boundaries:** Fallbacks y skeletons dedicados en `/profile`, `/hoy`, `/pareja`, `/journal`, `/precios` y `/premium`.
- **Journal 2.0:** Confirmación visual de persistencia (Toast animado), exportación/importación JSON de backup e indicador de KB usados.
- **Modo Pareja:** Botón de prueba en 1 solo clic con datos de ejemplo (Ana & Lucas).
- **Página 404:** Rediseño cósmico y filosófico con accesos directos inteligentes.

---

## [2.0.0] - 2026-08-10

### Agregado
- **Dashboard Diario `/hoy`:** Foco de acción diario, fase lunar, pronóstico de 3 días y racha de consciencia (streak).
- **Modo Pareja `/pareja`:** Sinergia multi-sistema (Camino de Vida, signos solares, química elemental y zodíaco chino).
- **Journal de Autoconocimiento `/journal`:** Registro de estado de ánimo cruzado con el Año y Día Personal.
- **Molino Premium `/premium`:** Informe PDF de 25 páginas descargable y ciclos anuales 2026–2030.

---

## [1.0.0] - 2026-07-01

### Lanzamiento Inicial
- Motor de cálculo de numerología pitagórica (Camino de Vida, Números Maestros).
- Integración de astrología occidental solar y elementos.
- Zodíaco chino y compatibilidades tradicionales.
- Filosofía de cálculo 100% en el navegador del usuario sin registro obligatorio.
