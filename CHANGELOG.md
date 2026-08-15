# Registro de Cambios (Changelog) — Molino.app

Todos los cambios notables en la arquitectura, diseño y motores de Molino se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.1.1] - 2026-08-15

### Seguridad
- **Pepper dedicado para `hashProfile()` (`PROFILE_HASH_SECRET`):** hasta esta versión, `MP_WEBHOOK_SECRET` cumplía doble función — validar la firma de los webhooks de Mercado Pago y servir de pepper HMAC del hash de perfil (`lib/mercadopago.ts`). Rotar ese secreto en el dashboard de Mercado Pago invalidaba silenciosamente todos los hashes de perfil ya emitidos, rompiendo la recuperación de compras de usuarios ya pagos. Ahora `getProfileHashSecret()` usa `PROFILE_HASH_SECRET` como secreto independiente (con fallback automático a `MP_WEBHOOK_SECRET` si no está seteada, sin migración necesaria ni ruptura de compatibilidad).

### Quitado
- **Carga condicional de Plausible/Umami (`AnalyticsProvider`):** el componente tenía un bloque que podía inyectar el script de Plausible o Umami si se seteaban `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Nunca estuvo activo en producción, pero contradecía la promesa de "sin tracking de terceros" (`/filosofia`) si alguien seteaba esas variables sin también actualizar la Content-Security-Policy. Se eliminó el bloque entero; el componente conserva su función real (trackear pageviews locales en `localStorage`, nunca enviados a un servidor).

### Corregido
- **Copy de privacidad más preciso:** `/filosofia` ahora distingue explícitamente el mapa gratuito (100% local) del flujo Premium/IA (que sí envía un hash HMAC-SHA256 del perfil — nunca la fecha de nacimiento en claro ni el nombre — para validar el pago). El badge "Sin cookies de rastreo" en la home acota su claim a navegación/marketing, consistente con esa misma distinción.

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
