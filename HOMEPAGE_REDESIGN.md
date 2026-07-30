# Molino — Fase 5: Rediseño de la Home

## Objetivo

Que un usuario pueda responder en menos de 5 segundos:

1. **¿Qué es Molino?**
2. **¿Qué obtengo?**
3. **¿Por qué debería confiar?**
4. **¿Qué hago ahora?**

La Home debe funcionar como una historia, no como una suma de secciones.

---

## Diagnóstico del estado actual

### Lo que falla como historia

**Secciones actuales (9 total):**

1. Hero — número del día + reflexión + CTA
2. SystemsPreview — 3 columnas de sistemas simbólicos
3. Journey — 5 pasos numerados
4. ToolsAndDiscovery — herramientas por categoría
5. ConceptsIndex — 9 cards de conceptos
6. DailyEnergy (condicional) — score del día
7. CompleteMapCTA — CTA para completar mapa
8. FinalCTA — CTA final de conversión
9. Footer

**Problemas narrativos:**

1. **El número del día compite con el CTA principal.** El usuario pasa 3 segundos mirando un número enorme antes de entender qué hacer.
2. **4 secciones educativas antes del CTA principal.** Sistemas, Viaje, Herramientas, Biblioteca — ninguna es el CTA principal.
3. **El CTA es idéntico arriba (hero) y abajo (final CTA).** El usuario ve "DESCUBRIR MI MAPA" dos veces. La segunda no tiene valor nuevo.
4. **No hay progresión emocional.** Todas las secciones tienen el mismo peso visual. No hay un arco.
5. **La utilidad no se muestra.** El usuario no sabe qué obtiene hasta que scrollea 3 secciones.
6. **"0 DATOS ALMACENADOS"** mina la confianza. Es una estadística que suena negativa.

---

## La historia propuesta

### Estructura narrativa

```
Capítulo 1: Descubrí quién sos
Capítulo 2: ¿Cómo funciona?
Capítulo 3: Qué vas a descubrir
Capítulo 4: Qué hace diferente a Molino
Capítulo 5: Así es tu mapa
Capítulo 6: Explorar
Capítulo 7: Tu mapa te espera ✓
```

### Lo que cambia

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Secciones | 9 | 4 |
| CTAs principales | 3 (hero + tools CTA + final CTA) | 1 |
| Scroll necesario para entender | ~30 segundos | ~5 segundos |
| Número del día | Dominante (22vw) | Contextual (acompaña, no domina) |
| Stats bar | Sí (3 / 13 / 0) | No (la confianza se demuestra en otro lugar) |
| Sistemas / Viaje / Herramientas | Secciones separadas | Integrados en capítulos 2 y 3 |
| "0 datos almacenados" | Visible | Eliminado (privacidad reenmarcada como pilar) |

---

## La nueva Home — 4 Capítulos

### CAPÍTULO 1 — "Descubrí quién sos"

**Sección: NumeroDia**

Propósito: crear conexión instantánea. El usuario ve su número del día y entiende que esto es personal.

```
┌─────────────────────────────────────────────┐
│  NÚMERO DEL DÍA                            │
│  Un número · Un mapa · Conocerte           │
│                                             │
│        7                                    │
│                                             │
│  Tu número de hoy te invita a...           │
│                                             │
│  [EMPEZÁ →]                                │
└─────────────────────────────────────────────┘
```

**Especificaciones:**

| Elemento | Valor |
|----------|-------|
| Layout | Centrado, single column |
| Número | `font-display` `text-6xl sm:text-7xl lg:text-8xl` — grande pero no dominante (máx 15vw) |
| Subtitle | `text-sm sm:text-base text-muted` |
| CTA | `btn-accent` centrado, "EMPEZÁ →" |
| Altura | `min-h-[70vh]` flex items-center |
| Separador | `border-t border-ink/10` arriba |

**Cambios clave vs. HeroNew actual:**
- El número ya **no ocupa 22vw** del ancho — es un elemento de apoyo, no el protagonista
- La reflexión del día se simplifica a **una frase** ("Tu número de hoy te invita a...") — no el texto completo de la reflexión numerológica
- **Un solo CTA**: "EMPEZÁ →" que lleva a `/onboarding`
- **Se elimina el stats bar** — no pertenece al Capítulo 1
- **Se elimina la columna derecha** con la reflexión larga — eso va al Capítulo 3

**¿Qué responde?**
- ¿Qué es Molino? → "Tu número de hoy / Un mapa / Conocerte"
- ¿Qué hago ahora? → "EMPEZÁ →"

---

### CAPÍTULO 2 — "¿Cómo funciona?"

**Sección: TresPasos**

Propósito: explicar el proceso en tres pasos simples. Sin párrafos largos.

```
¿CÓMO FUNCIONA?

1  Ingresá tu fecha
    Tu fecha de nacimiento. Nada más.

2  Generamos tu mapa
    Tres sistemas convergen en una lectura.

3  Descubrí tu identidad
    Número, mundo, círculo. Todo en un lugar.

(CTA viene en el Capítulo 4)
```

**Especificaciones:**

| Elemento | Valor |
|----------|-------|
| Layout | Tres columnas en desktop, stack en mobile |
| Título | `font-heading text-2xl sm:text-3xl font-semibold text-foreground` |
| Cada paso | Número grande + título + 1 línea de descripción |
| Altura | Media (`py-16 sm:py-20`) |
| Fondo | `bg-card` |

**Qué cambia vs. Capítulo 2 anterior:**
- Se elimina la sección "SISTEMAS SIMBÓLICOS" y las 3 columnas de sistemas.
- Se reemplaza por 3 pasos simples del proceso (ingresar → generar → descubrir).
- Se elimina el CTA "VER MI MAPA →" de este capítulo. El CTA principal es exclusivo del Capítulo 4.

---

### Capítulo 3 — "Qué vas a descubrir"

**Sección: QueDescubrís**

Propósito: mostrar el valor concreto de Molino. No las funcionalidades, los resultados.

```
QUÉ VAS A DESCUBRIR

[Icon] Comprendé cómo tomás decisiones
     Tu número y cómo se traduce en elecciones reales

[Icon] Conectá con tu entorno
     Lo que tu energía dice sobre tus vínculos

[Icon] Orientate con claridad
     Un mapa para moverte, no para quedarte mirando
```

**Especificaciones:**

| Elemento | Valor |
|----------|-------|
| Layout | 3 columnas en desktop, stack en mobile |
| Título | `font-heading text-2xl sm:text-3xl font-semibold text-foreground` |
| Cada beneficio | Ícono + título (verbo) + 1 línea de descripción |
| Altura | Media (`py-16 sm:py-20`) |
| Fondo | `bg-card` |

**Qué cambia vs. el Capítulo 3 anterior:**
- Se eliminan "3 sistemas, 13 fuentes, 0 servidores" — son métricas técnicas, no valor.
- Se reemplaza por 3 promesas de resultado: Comprendé, Conectá, Orientate.
- El lenguaje pasa de descriptivo (qué es Molino) a experiencial (qué vas a vivir).
- Cada punto empieza con un verbo de acción: son promesas de resultado, no descripciones de sistema.

**¿Qué responde?**
- ¿Qué voy a descubrir? → Comprender tus decisiones, conectar con tu entorno, orientarte con claridad.

---

### Capítulo 4 — "Qué hace diferente a Molino"

**Sección: TresSistemas**

Propósito: explicar los tres sistemas con voz editorial propia. No tres cajas iguales.

```
¿POR QUÉ MOLINO?

Numerología     Astrología      Zodiaco Chino
Tu fecha         Tu lugar         Tu año de nacimiento
tu hora          de nacimiento    

Tres lenguajes,
una misma persona.

[VER MI MAPA →]
```

**Especificaciones:**

| Elemento | Valor |
|----------|-------|
| Layout | Tres columnas asimétricas en desktop, stack en mobile |
| Título | `font-heading text-2xl sm:text-3xl font-semibold text-foreground` |
| Cada sistema | Título del sistema + una línea de qué revela + conexión con los otros dos |
| Cierre | "Tres lenguajes, una misma persona." |
| CTA | Centrado: "VER MI MAPA →" → `/profile` o `/onboarding` |
| Altura | Media-alta (`py-16 sm:py-20`) |
| Fondo | `bg-card` |

**Por qué tres cajas diferentes, no iguales:**

Cada sistema tiene una voz editorial que se apoya en los otros dos:
- **Numerología:** Tu fecha → números → patrones. Directo, cuantificable.
- **Astrología:** Tu lugar y hora → mapa astral. Geográfico, visual.
- **Zodiaco Chino:** Tu año → animal → ciclo. Tradicional, simbólico.

**Qué responde?**
- ¿Por qué Molino? → Tres lenguajes, una misma persona.

---

## Estructura completa propuesta

```
1. Capítulo 1: NumeroDia          → conexión, personal
2. Capítulo 2: TresPasos        → beneficio concreto
3. Capítulo 3: QueDescubrís      → valor, exploración
4. Capítulo 4: TresSistemas      → diferenciación
5. Capítulo 5: QueMapa           → evidencia, preview
6. FOOTER
```

**7 capítulos narrativos. 1 CTA principal. Una historia.**

---

## ¿Qué se elimina?

| # | Sección actual | Qué pasa |
|---|----------------|----------|
| 1 | HeroNew | Se transforma en **Capítulo 1** — simplificado, centrado, número reducido |
| 2 | SystemsPreview | Se elimina del Home. Los sistemas se narran editorialmente en Capítulo 4 |
| 3 | Journey | Se elimina. El "viaje" ahora está implícito en los 3 pasos del Capítulo 2 |
| 4 | ToolsAndDiscovery | Se elimina del Home. Las herramientas se descubren en la biblioteca |
| 5 | ConceptsIndex | Se elimina del Home. Se accede desde el Capítulo 3 ("EXPLORAR LA BIBLIOTECA →") |
| 6 | DailyEnergy (condicional) | Se elimina del Home. El usuario entra a `/daily-energy` desde el header (HOY) |
| 7 | CompleteMapCTA (condicional) | Se elimina. El perfil tiene su propia navegación |
| 8 | FinalCTA | Se transforma en **Capítulo 7** — CTA de cierre, no repite el Hero |

---

## Qué se conserva

| Elemento actual | Razón de conservación |
|----------------|------------------------|
| El número del día | Es el elemento más personal y evocador del producto |
| La frase del número | Se simplifica a "Tu número de hoy te invita a..." |
| `badge-brutalist` + `label-micro` | Coherentes con el design system |
| `fadeUp` motion | Los 7 capítulos entran con animación secuencial |
| Los 3 sistemas | Se narran editorialmente en Capítulo 4 |
| El formato de fecha | Aparece como detalle en Capítulo 1 |

---

## Micro-copy actualizado

### Capítulo 1 — "Descubrí quién sos"

**Mensaje:** Molino te revela quién sos basándote en tu fecha y hora de nacimiento, a través de tres sistemas convergientes. Para quien busca autoconocimiento sin abstracción técnica. Obtenés insights personales, Tangible y visual, en segundos.

**Acción dominante única:** EMPEZÁ →

**Inspiración Hegia:** No todo centrado. Más editorial. Más aire. Más profundidad. La tipografía fluye horizontalmente en contenedores ultra-anchos (`max-w-5xl`, `max-w-6xl`). El H1 debe tener 2-3 líneas máximo — nunca 4-6.

**Visual:** Pocos elementos, muy bien ejecutados. Sin ilustraciones. Un número grande, una frase breve, un CTA. Form integrado — el formulario no es una caja pegada debajo sino parte natural del flujo.

**Tipografía:** Una sola idea principal por capítulo. No dos H1. No subtítulos enormes que compitan con el mensaje.

| Elemento | Texto |
|----------|-------|
| Eyebrow | NÚMERO DEL DÍA |
| Subtitle | Un número · Un mapa · Conocerte |
| Frase del número | Tu número de hoy te invita a... |
| CTA | EMPEZÁ → |

### Capítulo 2

| Elemento | Texto |
|----------|-------|
| Eyebrow | ¿CÓMO FUNCIONA? |
| Paso 1 | 1 Ingresá tu fecha · Tu fecha de nacimiento. Nada más. |
| Paso 2 | 2 Generamos tu mapa · Tres sistemas convergen en una lectura. |
| Paso 3 | 3 Descubrí tu identidad · Número, mundo, círculo. Todo en un lugar. |

### Capítulo 3

| Elemento | Texto |
|----------|-------|
| Eyebrow | QUÉ VAS A DESCUBRIR |
| Título | Entendé cómo decidís. Descubrí tus afinidades. Elegí mejores momentos. |
| Resultado | Tu número de vida revela patrones de decisión que ya están operando en tu día a día. |
| Resultado | Tus conexiones más fuertes tienen un impacto real en tu energía y tus elecciones. |
| Resultado | Elegí los momentos justos para avanzar, descansar y conectar. |
| CTA | EXPLORAR LA BIBLIOTECA → |

### Capítulo 4

| Elemento | Texto |
|----------|-------|
| Título | Qué hace diferente a Molino |
| Principal | Numerología — tu fecha y hora revelan patrones que ya estás viviendo. |
| Secundario 1 | Astrología — tu lugar en el cosmos te da un mapa energético único. |
| Secundario 2 | Zodiaco Chino — tu año defines un ciclo que guía tus decisiones. |
| Cierre | Tres lenguajes, una sola persona. |
| CTA (sin perfil) | EMPEZÁ → |
| CTA (con perfil) | VER MI MAPA → |

---

## Capítulo 5 — "Así es tu mapa"

### Storytelling

**Pregunta que responde:** ¿Cómo se ve?

**Emoción que genera:** Convicción, deseo de verlo propio.

**Tono:** Visual, concreto.

### Lo que se ve

```
MIRA TU MAPA

[Mockup del mapa completo - vista desktop]

  Identidad
  Número de vida: 7
  Esencia: introspección y análisis

  Mundo
  Elemento dominante: Tierra
  Tu lugar en el entorno: estable, raíces profundas

  Círculo
  Conexiones clave con: [3 entidades]
  Resonancia más fuerte con: [1 entidad]

[Mockup del mapa completo - vista mobile]

[Screen de la página de energía diaria]
[Screen de la página de afinidad]

[CTA: CREAR MI MAPA →]
```

### Especificaciones del mockup section

| Elemento | Valor |
|----------|-------|
| Layout | Mockup con bordes de dispositivo (desktop → mobile → daily-energy) |
| Mockup desktop | `max-w-lg mx-auto` con sombra/efecto frame |
| Mockup mobile | `max-w-xs mx-auto` con frame de iPhone/Android |
| Datos | Representativos — no placeholders vacíos |
| Colores | Corresponden al design system real |

### Los 3 mockups

1. **Desktop map preview** — muestra el mapa completo con todas las secciones (identidad, mundo, círculo). Demuestra profundidad y riqueza de información.

2. **Mobile map preview** — muestra la misma información adaptada a mobile. Demuestra que la experiencia es consistente en todos los dispositivos.

3. **Daily energy screen** — muestra el score del día con tema y descripción. Demuestra la utilidad diaria del producto.

### Por qué

Después de cuatro capítulos de narrativa, el usuario necesita ver la evidencia tangible. Las palabras ya convencieron. Ahora hay que mostrar. Un mockup del mapa completo responde la pregunta que el usuario ya se está haciendo: "¿Y qué más me da?" Un preview del mapa muestra concreto qué recibe — no una promesa, sino algo visible.

### Decisiones narrativas

| Decisión | Opción elegida | Opción descartada |
|----------|----------------|-------------------|
| ¿Mockups o capturas reales? | Mockups con datos representativos | Screenshots reales (falta de control visual) |
| ¿Cuántos mockups? | 3: desktop, mobile, daily-energy | 1 solo, o 6+ |
| ¿Lenguaje en mockups? | Español real, datos reales | Placeholders vacíos |
| ¿CTA en este capítulo? | No — el CTA es del Capítulo 1 (EMPEZÁ →) | Repetir CTA |
| ¿Vista previa interactiva? | No — estática | Mockup interactivo con hover |
| ¿Orden de mockups? | Desktop → Mobile → Daily Energy | Aleatorio |

---

## Capítulo 6 — "Explorar"

### Storytelling

**Pregunta que responde:** ¿Qué más puedo descubrir?

**Emoción que genera:** Deseo de explorar, curiosidad sostenida.

**Tono:** Invitación, apertura, sin presión.

### Lo que se ve

```
EXPLORÁ TU CONOCIMIENTO

[Panel con tres bloques de navegación como tarjetas:]

  Numerología
  "Tu número de vida y qué revela de vos"

  Astrología
  "Tu posición en el cosmos"

  Zodiaco Chino
  "Tu animal, tu ciclo, tu año"

[Vista del catálogo de herramientas al final:]
  - Lectura del mapa
  - Energía diaria
  - Afinidad
  - Timing
```

### Lo que se dice

- Los tres lenguajes de Molino están disponibles.
- Cada uno es una puerta de entrada diferente a tu identidad.
- No hay un orden obligatorio — el usuario elige su camino.

### Por qué

Capítulo 5 muestra qué recibe el usuario. Capítulo 6 le muestra qué más puede explorar. Es la transición natural de "ver tu mapa" a "profundizar en lo que te interesa". Los tres bloques son la misma información (los 3 sistemas) pero presentada como puertas de entrada independientes a la biblioteca.

### Decisiones narrativas

| Decisión | Opción elegida | Opción descartada |
|----------|----------------|-------------------|
| ¿Formato de presentación? | Tres tarjetas/bloques horizontales | Lista vertical, o grid de 2×2 |
| ¿Orden de los bloques? | Numerología → Astrología → Zodiaco Chino | Aleatorio, o por complejidad |
| ¿Subtítulo por bloque? | Una línea descriptiva corta | Sin subtítulo, o descripción larga |
| ¿CTA por bloque? | No — navegación a `/biblioteca` | CTA individual por sistema |
| ¿Incluir todas las herramientas? | No — solo los 3 sistemas como puerta de entrada | Listar todas las herramientas disponibles |
| ¿Vista previa del catálogo? | Sí, lista de 4 herramientas al final | Sin vista previa del catálogo |

---

## Capítulo 7 — "Tu mapa te espera"

### Storytelling

**Pregunta que responde:** ¿Empezamos?

**Emoción que genera:** Cierre, compromiso, anticipación positiva.

**Tono:** Cálido, directo, sin urgencia artificial.

### Lo que se dice

```
TU MAPA TE ESPERA.

Ya conocés los tres lenguajes de Molino.
Numerología, astrología y zodíaco chino convergen
en un solo lugar: tu identidad.

No hay prisa. No hay presión.
Solo una invitación a conocerte.

[CREAR MI MAPA →]
```

### Lo que NO hace

- **No repite el Hero.** No vuelve a mostrar el número ni la frase del día. El usuario ya vio eso en Capítulo 1.
- **No re-explica los sistemas.** Ya se presentaron en Capítulo 4.
- **No repite los beneficios.** Ya se cubrieron en Capítulos 2, 3 y 5.
- **No muestra un mockup más del mapa.** Capítulo 5 ya cumplió ese rol.

### Por qué

Capítulo 7 cierra la historia. Después de siete capítulos de narrativa — curiosidad, proceso, valor, diferenciación, evidencia, exploración — el usuario llega a la última pregunta: "¿Empezamos?"

La frase "Tu mapa te espera" refuerza que Molino guarda algo personal para el usuario sin presionar. Y el CTA "CREAR MI MAPA →" es la primera y única CTA de conversión directa de toda la página.

El contenido de Capítulo 7 se construye con datos de Capítulos 1-6: los tres lenguajes (Cap 4), la promesa concreta (Cap 2-3), la evidencia visual (Cap 5), la invitación a explorar (Cap 6). Nada es nuevo. Todo es cierre.

### Decisiones narrativas

| Decisión | Opción elegida | Opción descartada |
|----------|----------------|-------------------|
| ¿Mostrar el número del día? | No — ya se vio en Capítulo 1 | Repetirlo como refuerzo |
| ¿CTA repetido? | No — única CTA de conversión | CTA duplicado |
| ¿Largo del texto? | 3-4 líneas máximo | Párrafo largo |
| ¿Mencionar los 3 sistemas? | Sí, una línea de cierre ("tres lenguajes convergen") | No mencionarlos |
| ¿Urgencia o escasez? | No — invitación, no urgencia | "¡Última oportunidad!" |
| ¿Qué pasa tras el clic? | Onboarding / Profile | Landing genérica |
| ¿El usuario puede ignorarlo? | No — solo se puede avanzar scroll o hacer clic | Se esconde |

---

## Puntos de fricción resueltos

| Fricción actual | Solución en el nuevo diseño |
|-----------------|------------------------------|
| Número dominante compete con CTA | Número reducido a 15vw, contextual como apoyo visual |
| CTA duplicado arriba y abajo | Un único CTA en Capítulo 4 |
| 4 secciones educativas antes del CTA | 3 capítulos de valor (Cap 2, 3, 5) + 1 capítulo de diferenciación (Cap 4) con CTA |
| "0 datos almacenados" mina confianza | Se elimina del stats bar, se transforma en valor en Capítulo 3 |
| Sin progresión emocional | 7 capítulos: conexión → proceso → valor → diferenciación → evidencia → exploración → cierre |
| Herramientas y biblioteca compiten con el CTA | Se mueven a Capítulo 3 como "explorar" secundario |
| Demasiadas opciones en el fold | El fold ahora muestra solo: número + frase + CTA |

---

## Flujo del usuario propuesto

```
Usuario llega a Home
  ↓
Capítulo 1 (3 segundos): "Ah, mi número de hoy. Esto es personal."
  ↓
Capítulo 2 (3 segundos): "Ingreso mi fecha → genero mi mapa → descubro mi identidad."
  ↓
Capítulo 3 (3 segundos): "Tiene fundamento serio. Privacidad radical."
  ↓
Capítulo 4 (2 segundos): "Tres lenguajes, una misma persona." → CTA
  ↓
Capítulo 5 (2 segundos): "Así es tu mapa." → evidencia visual
  ↓
Footer → Clic en CTA → Onboarding / Profile
```

**Total: ~11 segundos para llegar al CTA. Menos de 5 segundos para entender qué es Molino.**

---

## Implementación técnica

### Componentes nuevos necesarios

| Componente | Archivo | Description |
|------------|---------|-------------|
| `NumeroDia` | `components/sections/NumeroDia.tsx` | Capítulo 1 — el número del día simplificado |
| `TresPasos` | `components/sections/TresPasos.tsx` | Capítulo 2 — ¿Cómo funciona? en 3 pasos |
| `QueDescubrís` | `components/sections/QueDescubrís.tsx` | Capítulo 3 — valor y beneficios |
| `TresSistemas` | `components/sections/TresSistemas.tsx` | Capítulo 4 — los tres sistemas, editorialmente |
| `QueMapa` | `components/sections/QueMapa.tsx` | Capítulo 5 — mockups de preview del mapa |
| `CTAFinal` | `components/sections/CTAFinal.tsx` | Capítulo 7 — CTA de cierre sin repetir el Hero |

### Componentes eliminados

| Componente | Reemplaza |
|------------|-----------|
| `HeroNew.tsx` | Reemplazado por `NumeroDia.tsx` |
| `SystemsPreview.tsx` | Eliminado del Home (los sistemas se narran en Capítulo 4) |
| `Journey.tsx` | Eliminado (funcionalidad absorbida en `TresPasos.tsx`) |
| `ToolsAndDiscovery.tsx` | Eliminado del Home |
| `ConceptsIndex.tsx` | Eliminado del Home (se accede desde Capítulo 3) |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/page.tsx` | Reemplazar 9 secciones por 7 capítulos; simplificar `GenericHome` y `PersonalizedHome` |
| `lib/data/navigation.ts` | Sin cambios |

### Archivos creados

| Archivo | Description |
|---------|-------------|
| `components/sections/NumeroDia.tsx` | Capítulo 1 |
| `components/sections/TresPasos.tsx` | Capítulo 2 |
| `components/sections/QueDescubrís.tsx` | Capítulo 3 |
| `components/sections/TresSistemas.tsx` | Capítulo 4 |
| `components/sections/QueMapa.tsx` | Capítulo 5 |
| `components/sections/CTAFinal.tsx` | Capítulo 7 |

### Archivos a eliminar

| Archivo | Razón |
|---------|-------|
| `components/sections/HeroNew.tsx` | Reemplazado |
| `components/sections/SystemsPreview.tsx` | Integrado |
| `components/sections/Journey.tsx` | Eliminado |
| `components/sections/ToolsAndDiscovery.tsx` | Eliminado del Home |
| `components/sections/ConceptsIndex.tsx` | Eliminado del Home |

### Orden de implementación recomendado

1. `NumeroDia.tsx` — el Capítulo 1 (mayor impacto, cambio más visible)
2. `TresPasos.tsx` — el Capítulo 2 (el "qué obtengo")
3. `QueDescubrís.tsx` — el Capítulo 3 (valor)
4. `TresSistemas.tsx` — el Capítulo 4 (diferenciación)
5. `QueMapa.tsx` — el Capítulo 5 (evidencia visual)
6. Actualizar `app/page.tsx` — reemplazar el render actual con los 7 capítulos
7. `CTAFinal.tsx` — el Capítulo 7 (CTA final de cierre)
8. Eliminar componentes reemplazados
9. Verificar responsive en cada capítulo
10. Verificar motion con `fadeUp` secuencial

---

*Rediseño de Home — Fase 5. Pendiente de implementación. La propuesta reemplaza 9 secciones con 7 capítulos narrativos, reduce el CTA a uno solo, y reorganiza toda la información para que el usuario entienda Molino en menos de 5 segundos.*