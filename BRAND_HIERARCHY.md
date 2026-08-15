# Molino — Jerarquía de Marca (2026-08-15)

## Concepto Umbrella
**Mapa** es el concepto central que unifica toda la experiencia de Molino.

Cada usuario crea **su Mapa** — una representación personal que cruza tres lenguajes ancestrales (numerología, astrología, zodíaco chino) en una sola herramienta clara y honesta.

---

## Estructura Jerárquica

### Nivel 1: Mapa (Umbrella)
El concepto central y promesa de valor. Todas las sub-experiencias sirven al Mapa.

**CTA global**: "Crear mi mapa"
- Consistente, claro, enfocado en la acción principal
- Punto de entrada a todo el sistema

---

### Nivel 2: Productos/Contextos bajo Mapa

#### 2.1 Pareja
**Contexto**: Mapa de dos personas. Cómo se relacionan, qué enseñanzas trae la relación.
- URL: `/pareja`
- Enfoque: Compatibilidad, sinastria, dinámicas relacionales

#### 2.2 Premium
**Contexto**: Acceso ampliado a análisis, historiales, comparaciones, funciones avanzadas.
- URL: `/premium`
- Enfoque: Profundidad, continuidad, herramientas profesionales
- Público: Usuarios que buscan análisis más riguroso

#### 2.3 Profesionales
**Contexto**: Herramientas de análisis para coaches, terapeutas, consultores.
- URL: `/profesionales`
- Enfoque: Instrumentos de trabajo, credibilidad, documentación
- Público: Profesionales del autoconocimiento y la salud

---

### Nivel 3: Funciones Estructurales

Estas no son productos, sino **funciones dentro del Mapa** que todos los usuarios encuentran.

#### 3.1 Patrones
**¿Qué es?** El análisis estructurado del Mapa — los arquetipos, dinámicas y ciclos que aparecen en tu fecha de nacimiento.
- URL: `/conocimiento/zodiaco-chino`, `/herramientas/signo-solar`, `/herramientas/camino-de-vida`
- Acceso: Gratuito para todos
- Propósito: Entender las fuerzas operando en tu vida

#### 3.2 Journal (Diario)
**¿Qué es?** Tu registro personal de insights, decisiones y evolución en el tiempo.
- URL: `/journal`
- Acceso: Gratuito para usuarios con Mapa
- Propósito: Documentar cómo el Mapa te acompaña en tu vida real
- Datos: 100% locales, nunca guardados en servidor

#### 3.3 Decisiones
**¿Qué es?** Análisis de preguntas específicas usando patrones del Mapa.
- URL: `/profile/insights` (dentro de tu Mapa)
- Acceso: Gratuito dentro del Mapa
- Propósito: Aplicar los patrones a decisiones reales

---

### Nivel 4: Contenido & Educación

#### 4.1 Biblioteca
**¿Qué es?** Curación de fuentes sobre numerología, astrología y zodíaco chino.
- URL: `/biblioteca`
- Estructura: Categorías de fuentes, cada una con metadatos único (Article JSON-LD)
- Propósito: Credibilidad y contexto para los patrones del Mapa
- Acceso: Gratuito, indexable por buscadores

#### 4.2 Academia
**¿Qué es?** Lecciones estructuradas sobre cómo usar los tres sistemas.
- URL: `/academy`
- Estructura: Cursos / módulos de aprendizaje
- Propósito: Educación profunda, no solo la herramienta
- Acceso: Gratuito o con acceso Premium según contenido

#### 4.3 Blog
**¿Qué es?** Artículos de opinión, aplicaciones prácticas, historias.
- URL: `/blog`
- Propósito: Conexión emocional, SEO, comunidad
- Acceso: Gratuito

---

## Orden de Prioridad en Navegación

### Header (Cuando exista)
```
Molino (Logo) | Crear mi mapa | [Menú]
```

### Footer (Estructura Actual)
```
EXPLORAR
  - Inicio
  - Ejemplo
  - FAQ
  - Mi Mapa (si autenticado)
  - Círculo
  - Mundo
  - Calendario
  - Evolución
  - Afinidad
  - Explorar
  - Biblioteca
  - Academia ← NUEVO (Task 1 completada)

PRINCIPIOS
  - Quiénes somos
  - Conocimiento libre
  - Privacidad radical
  - Transparencia total
  - Código abierto
  - Sin tracking

LEGAL
  - Privacidad
  - Términos
```

---

## Cómo Aplicar Esta Jerarquía

### Páginas de Producto
- Encabezado: Identificar si es Pareja / Premium / Profesionales
- Body: Mostrar cómo sirve al Mapa central
- CTA: Siempre "Crear mi mapa" (excepto pricing)

### Páginas Funcionales (Patrones, Journal, Decisiones)
- Mensaje: "Esto está dentro de tu Mapa"
- Contexto: Explicar cómo complementa el análisis central
- CTA: "Ver mi Mapa" o "Crear mi mapa"

### Contenido (Biblioteca, Academia, Blog)
- Propósito: Educación y credibilidad
- Conexión: Enlazar a las herramientas cuando sea relevante
- Tono: Honesto, sin sensacionalismo
- Acceso: Gratuito (la educación es parte de la filosofía)

### CTAs Especiales por Contexto
```
Inicio / Onboarding        → "Crear mi mapa"
Premium page               → "Acceder a Premium"
Pricing page               → "Empezar gratis" / "Actualizar a Premium"
Blog / Biblioteca / Academy → "Crear mi mapa" o "Ver ejemplo"
Pareja / Profesionales     → "Crear mi mapa" (o "Agregar parejas")
```

---

## Tagline por Contexto

**Mapa** (central): "Autoconocimiento sin ruido"
**Pareja**: "Entendé tu relación"
**Premium**: "Profundidad y continuidad"
**Profesionales**: "Herramientas que funcionan"
**Biblioteca**: "Fuentes confiables"
**Academia**: "Aprende los tres sistemas"

---

## Próximos Pasos

1. ✓ Definir jerarquía (este documento)
2. → Aplicar a páginas principales (Mapa, Premium, Profesionales)
3. → Asegurar consistencia en breadcrumbs y navegación
4. → Revisar y limpiar categorías duplicadas
5. → Medir engagement por contexto

**Última actualización**: 2026-08-15
**Estado**: ACTIVE — Usar como fuente de verdad para todas las decisiones de navegación y messaging
