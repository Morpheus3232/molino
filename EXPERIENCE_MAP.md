# Molino — Mapa de Experiencia (Fase 3)

Entregable de la Fase 3: mapa completo de la experiencia del usuario. Base para las fases de refinamiento visual de Header, Home, páginas internas y refinamiento general.

---

## 1. Recorridos Principales

### Recorrido A: Usuario nuevo (sin perfil)

```
Landing (Home) → Hero con número del día → CTA "DESCUBRIR MI MAPA" → Onboarding (fecha de nacimiento) → Perfil generado → Mi Mapa (redirect)
```

**Puntos de decisión:**
- ¿Crear perfil? → CTA en Home y Hero
- ¿Volver al día? → Energía diaria disponible desde header

**Fricciones identificadas:**
1. Hero ocupa ~100vh sin scroll hint — usuario no sabe que hay más contenido
2. CTA compite visualmente con el número del día (22vw)
3. Sin indicación de progreso en onboarding
4. Onboarding: `px-4 sm:px-6` ≠ estándar del sitio (`px-4 sm:px-8 lg:px-12`)

### Recorrido B: Usuario recurrente (con perfil)

```
Landing (Home) → PersonalizedHome con energía del día → Navegación a: Mi Mapa | Energía diaria | Afinidad | Compatibilidad | Conocimiento
```

**Puntos de decisión:**
- ¿Consultar energía diaria? → HOY en header
- ¿Explorar afinidad? → Cards de sistemas en Home o navegación
- ¿Revolución personal? → Mi Mapa (perfil completo)

**Fricciones identificadas:**
1. Home no diferencia entre usuario nuevo y recurrente de forma clara en el hero
2. Sin "última visita" o contextualización
3. Demasiadas opciones en Home para un usuario recurrente (4 secciones + CTA)

### Recorrido C: Retorno diario

```
Abrir app → Header muestra HOY activo → Daily Energy con score del día → Explorar afinidad o volver a Mi Mapa
```

**Fricciones identificadas:**
1. Sin forma de ver energía de días anteriores
2. Sin navegación entre días
3. La energía se calcula en tiempo real pero no hay cache ni indicador de "última actualización"

### Recorrido D: Exploración profunda (Conocimiento)

```
Home → Conocimiento → Artículo/Entidad específica → (navegación por breadcrumbs)
```

**Fricciones identificadas:**
1. La mayoría de páginas no tienen breadcrumbs
2. Sin "artículos relacionados" al final de cada contenido
3. Sin indicación de progreso de lectura

---

## 2. Prioridad de páginas

### Nivel 1 — Identidad del producto (máxima inversión)

| Página | Pregunta que responde | Inversión de diseño |
|--------|-----------------------|---------------------|
| **Home** | "¿Qué es Molino y por qué debería probarlo?" | 🔴 Alta |
| **Onboarding** | "Creamos tu mapa en 30 segundos" | 🔴 Alta |
| **Mi Mapa** | "¿Quién soy según mi perfil simbólico?" | 🔴 Alta |

**Reglas de inversión:**
- Cada píxel importa. Hero, CTAs y microcopy deben ser impecables.
- Velocidad de carga prioritaria (lazy loading de secciones secundarias).
- Micro-interactions en CTAs y feedback inmediato.

### Nivel 2 — Utilidad frecuente (alta inversión)

| Página | Pregunta que responde | Inversión de diseño |
|--------|-----------------------|---------------------|
| **Energía diaria** | "¿Qué energía rige hoy?" | 🟡 Alta |
| **Afinidad** | "¿Con qué conecto mejor?" | 🟡 Alta |
| **Compatibilidad** | "¿Cómo me llevo con otros?" | 🟡 Alta |

**Reglas de inversión:**
- La experiencia diaria debe ser satisfactoria y rápida.
- Navegación entre días (Energía) y filtros de búsqueda (Afinidad/Afinidad).
- Resultados deben sentirse personalizados y significativos.

### Nivel 3 — Contenido de apoyo (inversión estándar)

| Página | Pregunta que responde | Inversión de diseño |
|--------|-----------------------|---------------------|
| **Conocimiento** | "¿Cómo funciona este sistema?" | 🟢 Estándar |
| **Artículos** | Información detallada | 🟢 Estándar |
| **Entidades** | Datos de símbolos individuales | 🟢 Estándar |

**Reglas de inversión:**
- Contenido claro y bien estructurado.
- SEO-friendly pero sin excesos decorativos.
- Navegación consistente con el resto del sitio.

---

## 3. Arquitectura de navegación

### Header (actual)

**Estructura:**
```
[Logo] [INICIO] [BIBLIOTECA] [FILOSOFÍA] [GITHUB] [HOY] [MI MAPA] [NUEVO PERFIL / DESCUBRIR MI MAPA] [Theme toggle] [☰ mobile]
```

**Análisis contra preguntas clave:**

| Pregunta | Respuesta | Nota |
|----------|-----------|------|
| ¿El usuario siempre sabe dónde está? | Parcialmente | Active state funciona para rutas exactas, NO para sub-rutas (corregido en Fase 3). HOY y MI MAPA no tenían active state (corregido). |
| ¿Siempre sabe cuál es el siguiente paso? | No | Sin progresión visual clara. El CTA "DESCUBRIR MI MAPA" es el único señal de próximo paso. |
| ¿Hay demasiadas opciones visibles? | Sí | 4 nav links + 2 contextuales + CTA + theme toggle = demasiados para mobile |
| ¿La navegación favorece el objetivo principal? | Parcialmente | "DESCUBRIR MI MAPA" es prominente, pero HOY y MI MAPA compiten visualmente |

**Recomendaciones de navegación:**
1. **Simplificar el header**: Reducir nav links visibles en desktop a 3 como máximo (INICIO, CONOCIMIENTO, + CTA). Mover BIBLIOTECA, FILOSOFÍA, GUÍA a un menú "MÁS" o al footer.
2. **Mover GITHUB al footer**: No es navegación principal, es enlace externo.
3. **HOY y MI MAPA**: Solo mostrar para usuarios con perfil. Ya se hace correctamente.
4. **Mobile menu**: El menú hamburguesa debe ser el patrón principal en mobile, no un complemento.

### Footer (actual)

**Estructura:**
```
Column 1 (5 cols): Logo + MOLINO tagline
Column 2 (3 cols): EXPLORAR — 8 links
Column 3 (2 cols): PRINCIPIOS — 5 links
```

**Análisis:**
- Footer fijo `bg-[#0F0F10]` — correcto, no cambia con theme.
- Sin links a redes sociales — aceptable para el tono del producto.
- Sin información legal/contacto — aceptable en fase actual.

**Recomendaciones:**
1. Agregar "MÁS" dropdown en desktop para los enlaces de navegación principales (ya están en header, redundante en footer).
2. El footer es correcto como está — simple, limpio, funcional.

### Estructura de navegación global propuesta

```
Header:
  [Logo] [INICIO] [CONOCIMIENTO] [+MÁS ▾]  [HOY] [MI MAPA]  [DESCUBRIR MI MAPA]  [Theme] [☰]

Footer:
  [Logo/Brand] [EXPLORAR: 4 links] [PRINCIPIOS: 5 links] [GITHUB]
```

**"MÁS" dropdown** contiene: BIBLIOTECA, FILOSOFÍA, GUÍA, HERAMIENTAS.
Esto reduce el header de 7+ items a 3 + contextuales + CTA.

---

## 4. Arquitectura de contenido

### Cada página → una sola pregunta

| Página | Pregunta actual | ¿Responde una sola pregunta? | Recomendación |
|--------|----------------|------------------------------|---------------|
| **Home** | "¿Qué es Molino y por qué probarlo?" | ❌ Tres preguntas: hero + 4 secciones + CTA final | Simplificar: hero con valor + 1 CTA. Mover secciones secundarias a scroll progresivo con carga lazy |
| **Onboarding** | "Crear tu mapa en 30 segundos" | ✅ Una pregunta clara | Reducir padding al estándar |
| **Mi Mapa** | "¿Quién soy según mi perfil?" | ⚠️ Múltiples tabs (Identidad, Mundo, Círculo, Inteligencia) | Mantener tabs pero priorizar Identidad como default |
| **Energía diaria** | "¿Qué energía rige hoy?" | ✅ Una pregunta clara | Agregar navegación entre días |
| **Afinidad** | "¿Con qué conecto mejor?" | ⚠️ Dos preguntas: lista + detalle | Separar en /affinity (lista) y /affinity/[type]/[slug] (detalle) — ya se hace |
| **Compatibilidad** | "¿Cómo me llevo con otros?" | ✅ Una pregunta clara | — |
| **Conocimiento** | "¿Cómo funciona este sistema?" | ⚠️ Múltiples sub-páginas | Mantener pero agregar breadcrumbs |
| **Guía** | "¿Cómo usar Molino?" | ✅ Una pregunta clara | Completar artículos faltantes |
| **Not-found** | "Esta página no existe" | ✅ Una pregunta clara | Agregar link a explore |

### Estructura por nivel

**Home** (Nivel 1):
```
1. H1: Número del día (hero)
2. P: Reflexión del día
3. CTA: "DESCUBRIR MI MAPA"
4. Stats: 3 sistemas, 13 fuentes, 0 datos
5. (Personalizado) Tarjeta de energía + CTA "VER DETALLE"
6. (Personalizado) CTA "VER MI MAPA COMPLETO"
7. Secciones: Sistemas, Viaje, Herramientas, Conceptos
8. CTA final: "¿LISTO PARA DESCUBRIR TU MAPA?"
```

**Problema:** El Home intenta responder ~5 preguntas distintas (¿qué es?, ¿cuál es mi energía?, ¿cómo funciona?, ¿explorar herramientas?, ¿crear perfil?). Necesita reestructuración para priorizar el CTA principal.

**Mi Mapa** (Nivel 1):
```
1. H1: Conocimiento · [nombre]
2. Tabs: Identidad | Mundo | Círculo | Inteligencia
3. Contenido del tab activo
```

**Problema:** El nombre del usuario en el H1 se corta en `IdentityScreen.tsx` (line 109: `<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">{name.split(" ")[0]}'s Conocimiento</h1>`). Esto está bien pero puede cortar nombres largos.

---

## 5. Jerarquía dentro de cada pantalla

### Orden de lectura estándar (aplicar a todas las páginas)

1. **Título** — `font-display` o `font-heading`, tamaño máximo
2. **Explicación breve** — `text-sm text-muted`, max-w-md
3. **Acción principal** — `<Button>` o `btn-accent`, máximo 1 por pantalla
4. **Contenido principal** — la información central
5. **Contenido secundario** — detalles, metadata, contexto
6. **CTA de continuación** — link o botón secundario

### Análisis de cumplimiento por pantalla

| Página | ¿Sigue el orden? | Desviaciones |
|--------|------------------|--------------|
| Home | ⚠️ Parcial | Hero tiene CTA ANTES del contenido secundario (stats vienen después del CTA) |
| Onboarding | ✅ Sí | Título → explicación → input → CTA |
| Daily Energy | ✅ Sí | Título → score → detalle → CTA |
| Mi Mapa | ⚠️ Parcial | Tabs compiten con el título; no hay acción principal clara |
| Explore | ✅ Sí | Search → results → empty state |
| Not-found | ✅ Sí | Mensaje → CTA |

### Reglas de jerarquía

- **Un solo CTA principal** por pantalla. Si hay más de uno, el secundario debe ser visualmente más débil (opacidad, tamaño menor).
- **Nada compite con el CTA principal.** El CTA debe ser el elemento más "pesado" visualmente después del título.
- **El número del día en Hero NO compite con el CTA.** Reducir el tamaño del número o moverlo a una posición secundaria (scroll down).

---

## 6. Reducción de carga cognitiva

### Problemas identificados

| Problema | Ubicación | Solución |
|----------|-----------|----------|
| Bloques de texto largos | `HeroNew.tsx` right column (reflection text) | Reducir a máximo 2 líneas |
| Demasiadas tarjetas juntas | Home: 4 secciones `SystemsPreview`, `Journey`, `ToolsAndDiscovery`, `ConceptsIndex` | Reducir a 2 secciones visibles inicialmente, resto en scroll |
| Múltiples CTAs simultáneos | Home: "VER MI MAPA COMPLETO" + "VER DETALLE" + CTA final | Unificar en un solo CTA por sección |
| Información repetida | Stats bar: "3 sistemas, 13 fuentes, 0 datos almacenados" | 0 datos almacenados es redundante con el tono de privacidad — quitar o reformular |
| Tabs sin jerarquía clara | Mi Mapa: 4 tabs al mismo nivel | Priorizar primer tab como default con indicador visual |

### Reglas de reducción de carga cognitiva

1. **Máximo 1 CTA principal** por pantalla.
2. **Máximo 3 elementos visuales** en el fold principal (above-the-fold).
3. **No más de 2 decisiones** por pantalla sin guía.
4. **Textos largos** → dividir en bullets o cards.
5. **Tarjetas en grid** → máximo 3 columns en desktop, 2 en tablet, 1 en mobile.
6. **Tabs** → máximo 4, con el primero como default.
7. **No repetir información** que ya está en el header/footer/navigation.

### Aplicación al Home

**Current fold (above-the-fold):**
```
[Hero: número del día (22vw)] [Reflexión + CTA]
[Stats: 3 items]
[PersonalizedHome: energía + CTA + "VER MAPA"]
[GenericHome: 4 secciones]
```

**Propuesto fold:**
```
[Hero: número del día más pequeño] [Reflexión breve + CTA principal]
[CTA final: "DESCUBRIR MI MAPA"]
```

**Mover abajo (scroll):**
```
[Para usuarios con perfil: energía del día + ver detalle]
[Para todos: secciones de valor - Sistemas, Viaje]
[Para usuarios con perfil: herramientas + CTA de mapa completo]
```

---

## 7. Estados de la aplicación

### 7.1 No hay datos

| Pantalla | Estado actual | UX |
|----------|---------------|-----|
| Home (sin perfil) | `GenericHome` con 4 secciones | ✅ Funcional, pero no invitaba a crear perfil |
| Daily Energy (sin perfil) | "No tienes perfil." + CTA "CREAR MI PERFIL" | ✅ Buen empty state |
| Explore (sin búsqueda) | Empty state con "Limpiar búsqueda" | ✅ Migrado a `<EmptyState>` |
| Afinidad (sin perfil) | "Crear mi perfil" button inline | ⚠️ Inline, no usa `<EmptyState>` ni `<Button>` |
| Mi Mapa (sin perfil) | Redirect a onboarding | ✅ Correcto |
| Affinity (sin resultados) | Vacío (no hay mensaje) | ❌ Sin empty state — **faltante** |

**Estándar de empty state:**
```tsx
<EmptyState
  title="Título descriptivo"
  description="Explicación breve de qué hacer."
  actionLabel="Acción principal"  // optional
  onAction={() => ...}            // optional
/>
```

### 7.2 Está cargando

| Pantalla | Estado actual | UX |
|----------|---------------|-----|
| Todas (perfil cargando) | `<LoadingState message="Cargando..." />` | ✅ Consistente |
| Daily Energy | `<LoadingState message="Calculando tu energía diaria..." />` | ✅ contextual |
| Onboarding | Spinner en botón | ✅ Feedback inmediato |
| Affinity (perfil cargando) | `<LoadingState />` | ✅ Correcto |

**Mejora pendiente:** Skeleton loading para páginas con estructura conocida (profile, daily-energy). Actualmente solo spinner genérico.

### 7.3 Hay un error

| Tipo | Manejo actual | UX |
|------|---------------|-----|
| Error de cálculo | Fallback UI con CTA "Intentar de nuevo" | ✅ Buen patrón |
| Error de red | AppErrorBoundary global | ✅ Captura errores |
| Slug inválido (404) | Next.js not-found | ✅ Correcto |
| Profile not found | Redirect a onboarding | ✅ Correcto |

**Mejora pendiente:** Agregar `error.tsx` en rutas específicas para mensajes de error más contextuales (no solo el boundary global).

### 7.4 El usuario aún no creó su mapa

**Comportamiento por pantalla:**

| Pantalla | Comportamiento |
|----------|----------------|
| Home | Muestra `GenericHome` con secciones + CTA "DESCUBRIR MI MAPA" |
| Daily Energy | Muestra "No tienes perfil" + CTA "CREAR MI PERFIL" |
| Mi Mapa | Redirect a `/onboarding` |
| Afinidad | Muestra CTA "Crear mi perfil" en zona hero |
| Onboarding | Muestra formulario de fecha de nacimiento |

**Consistencia:** El CTA para crear perfil debería usar el mismo estilo en todas las páginas. Actualmente varía entre `btn-accent` y `<Button variant="primary">`.

### 7.5 El usuario ya tiene un perfil

**Comportamiento por pantalla:**

| Pantalla | Comportamiento |
|----------|----------------|
| Home | Muestra `PersonalizedHome` con energía + secciones personalizadas |
| Daily Energy | Muestra el score del día + detalle |
| Mi Mapa | Muestra el perfil completo con tabs |
| Afinidad | Muestra recomendaciones basadas en el perfil |
| Onboarding | Ya no debería mostrarse (redirect si profile exists) |

**Mejora pendiente:** Agregar "Última visita" o fecha del último cálculo de energía en Daily Energy para dar contexto temporal.

---

## 8. Puntos de fricción

| # | Fricción | Severidad | Página | Solución |
|---|----------|-----------|--------|----------|
| 1 | Hero sin scroll hint — usuario no sabe que hay más abajo | 🔴 Alta | Home | Agregar indicator visual (arrow, text) al final del hero |
| 2 | CTA compite con número del día en el hero | 🔴 Alta | Home | Reducir número a `clamp(4rem, 18vw, 20rem)` o posicionarlo después del CTA |
| 3 | 4 secciones en Home sin jerarquía clara | 🔴 Alta | Home | Reducir a 2 secciones principales + CTA final |
| 4 | Múltiples CTAs compitiendo | 🟡 Media | Home, Daily Energy | Unificar en un CTA principal por sección |
| 5 | Onboarding: padding inconsistente con el resto del sitio | 🟡 Media | Onboarding | `px-4 sm:px-6` → `px-4 sm:px-8 lg:px-12` |
| 6 | Sin scroll indicator en Home hero | 🟡 Media | Home | Agregar `.scroll-hint` con animación |
| 7 | Afinidad sin empty state para búsquedas sin resultado | 🟡 Media | Affinity | Integrar `<EmptyState>` |
| 8 | Sin breadcrumbs en rutas profundas | 🟢 Baja | Múltiples | Crear `<Breadcrumbs>` e integrar |
| 9 | Tabs en Mi Mapa sin priorización | 🟢 Baja | Mi Mapa | Default al primer tab con indicador |
| 10 | Theme toggle sin transición | 🟢 Baja | Header | Transición fade entre Sun/Moon |

---

## 9. Recomendaciones priorizadas

### 🔴 Alta prioridad (Fase 4)

1. **Rediseñar Hero** — Simplificar para comunicación de 3 segundos: número más pequeño, reflexión breve, CTA como punto focal principal. Mover stats o reflejo debajo del fold.
2. **Reestructurar Home** — 1 CTA principal claro. Reducir secciones visibles en el fold. Mover contenido secundario a scroll con lazy loading.
3. **Unificar CTAs de creación de perfil** — Un solo patrón visual (`<Button>` o `btn-accent`) en todo el sitio para "Crear mi perfil".
4. **Agregar scroll hint en Home hero** — Indicador visual de que hay más contenido abajo.

### 🟡 Media prioridad (Fase 5)

5. **Simplificar header** — Reducir nav links visibles a 3 + contextuales + CTA. Mover GITHUB y enlaces secundarios al footer.
6. **Skeleton loading** — Agregar skeleton para profile y daily-energy pages.
7. **Navegación entre días** — Agregar selector de fecha o navegación prev/next en Daily Energy.
8. **Completar Guía** — Los stub pages actuales necesitan contenido real o eliminación.

### 🟢 Baja prioridad (Fase 6)

9. **Breadcrumbs** — Crear componente e integrar en rutas profunda (conocimiento, afinidad).
10. **tabs priorizados** — Default al primer tab en Mi Mapa.
11. **Theme toggle** — Suavizar transición entre iconos.
12. **Footer** — Agregar links a redes sociales si aplica.

---

## 10. Recorrido principal priorizado (voz del usuario)

```
1. Llega a Home → Ve el número del día y un CTA claro
2. Clic en "DESCUBRIR MI MAPA" → Onboarding simple (30 segundos)
3. Ve Mi Mapa primero → Identidad principal, mundo, círculo, inteligencia
4. Vuelve al Home → Ve su energía del día personalizada
5. Regresa al día siguiente → HOY en header lo guía directo a Energía
6. Explora Afinidad → Descubre conexiones
7. Navega a Conocimiento → Entiende el sistema
8. Crea un nuevo perfil → "NUEVO PERFIL" en header
```

Cada paso tiene un siguiente paso claro. Nada compite con la acción principal. La navegación favorece el objetivo principal (descubrir el mapa).

---

*Mapa de experiencia completo — Fase 3. Base para refinamiento visual en las fases 4-6.*