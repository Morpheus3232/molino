# FASE 4 — Molino Experience Pass

Fecha: 2026-08-30. Evaluación del recorrido completo como UN producto:
HOME → CONOCIMIENTO → MAPA → LECTURA → TENSIONES/REGLAS → IA.

Método: recorrido real en navegador (Playwright, desktop 1440×900 y mobile
390×844), lectura del DOM renderizado, medición de tiempos, y auditoría de
copy contra la filosofía del proyecto.

---

## 1. Cambios de mayor impacto

### 1.1 La primera pantalla del producto estaba rota (P1 visual + P2 perf)
`components/profile/CalculationMatrix.tsx` — lo primero que ve alguien al
crear su mapa.

**Defecto encontrado:** la tarjeta usaba `border-radius: 42% 58% 55% 45% /
56% 44% 56% 44%` (forma "blob") con `overflow-hidden`, y **recortaba el
texto**: el encabezado se leía `"ENTRAS SE ARMA TU MAPA"` (faltaba "MI") y el
enlace de la fórmula quedaba cortado. Encima: canvas de lluvia de código
estilo Matrix, glow radial con `blur-3xl`, fondo `ink` a pantalla completa.
Contradecía de frente el estándar del sistema (nítido, editorial, silencioso,
sin partículas decorativas, sin blur, sin gradientes).

**Corregido:** papel, hairlines, mono. La cuenta se lee como un comprobante,
etiqueta a la izquierda y valor a la derecha, con el sistema del que sale cada
resultado atribuido (Numerología / Astrología / Zodíaco chino). Sin canvas,
sin glow, sin blob, nada recortado. Respeta `prefers-reduced-motion`
(muestra todo de una).

**Perf:** la computación es síncrona e instantánea, así que la espera era
100% animación inventada. `260ms→110ms` por fila y `700ms→320ms` de cola:
**2636 ms → 1601 ms (−39%)** hasta el mapa real, medido.
*(Corrección al informe de Fase 2, que estimó "~8–10 s": el número real era
2,6 s. La estimación anterior era errónea.)*

### 1.2 MAPA → LECTURA: no había umbral (P0)
La Lectura —el centro intelectual del producto— era **la primera fila de un
índice plano de cuatro links**, al mismo nivel que "Círculo". El mapa
terminaba y seguían más tarjetas. Exactamente el "more cards below" que la
fase pedía eliminar.

**Nuevo `components/profile/ReadingThreshold.tsx`:** único bloque invertido de
`/profile` (mismo idioma visual que "el punto ciego" en `/lectura`: superficie
invertida = acá pasa algo). No promete profundidad en abstracto — muestra lo
que `buildSynthesis` **ya encontró en ese mapa concreto**: N cruces entre
sistemas, N tensiones estructurales, N patrones, y qué sistemas se cruzan. El
titular cambia según el resultado real (hay cruces / hay solo tensión / no hay
ninguna de las dos) y, si no hay nada, **lo dice** en vez de fabricar un
gancho.

`SpaceIndex` quedó como lo que realmente es: el índice de herramientas
laterales (Hoy / Pareja / Círculo), sin la Lectura compitiendo dentro.

### 1.3 LECTURA → IA: la IA era invisible para quien no pagaba (P0)
`PremiumChatSection` se montaba **dentro de la rama de `interpretation`**. Un
lector sin acceso terminaba la Lectura en el catálogo de afinidades y un CTA
de regalo, **sin enterarse nunca de que Molino tiene una capa de diálogo**. La
secuencia del producto se cortaba justo antes del tercer paso.

**Nuevo `components/lectura/ReadingToAI.tsx`**, visible para todos, con el
estado dicho de frente (con acceso: puntero a `/ai`; sin acceso: qué es, qué
lo diferencia de un chatbot, y tres ejemplos reales — sin urgencia fabricada).

**Además se reordenó el cierre de la Lectura.** Antes terminaba en una caja de
acento con precio ("Regalá una lectura · $8 USD") — la lectura cerraba en un
upsell. Ahora: Lectura → **puente a la IA** → afinidades (material de
referencia) → una línea al pie con "volver a tu mapa" y el regalo como texto
secundario.

### 1.4 Copy que contradecía la filosofía del proyecto (P1)

| Dónde | Antes | Problema | Ahora |
|---|---|---|---|
| `FeaturesSection` (home) | "Ver tu mapa es gratis. **Entenderlo es Premium**." | **Falso** desde Fase 2 (la Lectura gratuita ya trae cruces, tensiones, patrones e incertidumbre) y viola de frente "el conocimiento no se paga". | "Tu mapa y tu lectura son gratis. La conversación es Pro." |
| `FeatureComparison` | Bloque "Ancla de Valor" con precios ajenos tachados ($50–$120, $10–$15/mes). | Anclaje de precio — táctica de venta explícitamente rechazada. Pedía valorar Molino por lo que no es. | "Qué paga ese pago único": el costo real por uso del modelo y el sostenimiento de la parte gratuita. Sin comparaciones. |
| `FeatureComparison` (filas) | "Síntesis cruzada" y "Detección de tensiones" marcadas **✗ gratis**. | Literalmente falso tras Fase 2: las calcula `buildSynthesis` sin IA y se muestran gratis. Vendía como cerrado algo que el producto ya regala. | Ambas pasan a ✓ gratis; se agrega la fila honesta de lo que sí es Pro: "La Lectura escrita — interpretación narrativa". |
| `components/pricing/ComparisonTable.tsx` | Copia muerta del mismo bloque de anclaje. | 0 importadores. | **Borrado.** |

### 1.5 La home no explicaba el producto (P0 claridad 3/4/5/8)
Explicaba los tres **sistemas** y saltaba a "qué hacés con eso", sin nombrar
nunca qué es el Mapa, qué es la Lectura, ni que existe una IA.

**Nuevo `components/sections/ThreeLevelsSection.tsx`** entre ambas. Tratamiento
deliberadamente distinto del de los tres sistemas: aquellos son **paralelos**
(tres columnas iguales), estos son **secuenciales** (filas numeradas
encadenadas). Cada nivel con su pregunta ("¿Qué hay?" / "¿Qué significa
junto?" / "¿Y en mi caso?"), su etiqueta honesta (Gratis / Gratis / Pro) y su
puerta. Cierra con el ethos abierto, que antes solo vivía en el pie.

### 1.6 Sobrepromesa de privacidad (P1 — honestidad epistémica)
Verificado en el código: `app/api/intelligence/interpret/route.ts` **recibe
`dob`** y lo usa para `calculateUserProfile` server-side. O sea: la fecha SÍ
viaja al servidor en la Lectura Pro y en las preguntas a la IA.

Un "100% local" sin matiz es una sobrepromesa. `ClaritySection` ahora califica:
los tres cálculos corren enteros en el navegador; las dos funciones con IA
envían la fecha a un proveedor de modelo; el acceso pago se valida con un hash,
nunca con la fecha en claro. La línea nueva de `ThreeLevelsSection` se redactó
con el mismo cuidado ("los dos primeros niveles… el tercero necesita…").

### 1.7 Bug de robustez en `useSafeReducedMotion`
Llamaba `window.matchMedia(...)` sin guardas dentro de un `useEffect`. En
cualquier entorno sin `matchMedia` (jsdom sin mock, webviews viejos, algunos
runtimes de preview) eso tiraba un TypeError **dentro de un efecto** — rompía
el árbol de React entero, no solo la animación. Ahora degrada a "sin motion
reducido" y soporta también la API vieja de Safari (`addListener`).

---

## 2. Observaciones visuales

Recorrido desktop + mobile de home, `/conocimiento/numerologia`, `/profile`,
`/lectura`, `/ai`, `/premium`, `/transparencia`, `/affinity/brand`.

- **Sin overflow horizontal en ninguna ruta, en ninguno de los dos anchos**
  (verificado por `scrollWidth > innerWidth`).
- El sistema visual se sostiene: papel hueso, display serif a gran escala,
  eyebrows mono con tracking, hairlines, un solo rojo de acento usado con
  moderación. El umbral invertido y "el punto ciego" son los dos únicos
  bloques invertidos, uno por página — leen como el mismo idioma.
- Mobile: los tres niveles apilan bien; en la cuenta, la atribución de sistema
  se oculta (`hidden sm:inline`) para no amontonar.
- **Falso positivo del informe anterior:** los "huecos vacíos" que reporté en
  `/profile` en la QA de Fase 2 eran un artefacto de captura full-page (las
  animaciones `whileInView` no habían disparado al momento del screenshot). Se
  verificó por DOM: **0 elementos con opacidad ~0**. No era un bug.

---

## 3. Tests

`tsc --noEmit` limpio · `next build` OK (1649 páginas) ·
**`vitest run`: 1693 pass / 4 fail.**

La línea base al empezar esta fase era 6 fallas. **Bajó a 4**: se arreglaron
dos que resultaron ser problemas reales de producto, no ruido —
`privacy-claims-consistency` (la sobrepromesa del §1.6) y `home-universal`
(referenciaba `ProofSection`, una sección que ya no existe).

Tests actualizados por rediseño (misma intención, nuevos strings):
`profile-matrix-loading` (la garantía que protege sigue siendo "muestra la
aritmética REAL de ESTE perfil, nunca un dato de ejemplo"; se le sumó un caso
para la atribución por sistema y otro para el enlace a la fórmula) y
`premium-page` (nombres de fila nuevos).

### Las 4 fallas que quedan (preexistentes, no causadas por esta fase)
- `daily-focus.test.tsx` (1) — espera `"Conexión del día"` en
  `components/daily/DailyFocus.tsx`. Esa función **ya no existe** en el
  componente; el test quedó de un refactor anterior.
- `lectura-afinidades-full.test.tsx` (3) — esperan entidades concretas
  (`Buenos Aires`, `Monterrey`, `París`) que ya no salen con ese fixture.

Ninguna corresponde a un defecto visible: las afinidades renderizan bien en
`/profile`, `/lectura` y `/affinity/*` (verificado en navegador). Son tests que
describen UI retirada o datos que derivaron. **No los toqué a propósito:**
hacerlos pasar sin entender qué se retiró en su momento sería tapar una
posible regresión vieja en vez de arreglarla.

---

## 4. ¿El recorrido se siente coherente?

**Sí, con una reserva.**

La cadena ahora existe y está nombrada en los dos lugares que importan (la
portada la anuncia; el producto la ejecuta):

```
HOME  "Primero la estructura. Después el sentido."  →  01 Mapa · 02 Lectura · 03 Preguntale
MAPA      coordenadas + la cuenta a la vista + dónde tocan el mundo
   ↓      EL UMBRAL — con los números reales de ESE mapa
LECTURA   cruces, tensiones, patrones, incertidumbre (gratis)  +  interpretación escrita (Pro)
   ↓      "Ya sabés qué dice tu mapa. Ahora preguntale."
IA        conversación anclada en la misma buildSynthesis
```

Las tres superficies leen distinto: el Mapa es tabular y verificable, la
Lectura es editorial y argumental, la IA es conversacional. Y ninguna
re-deriva la síntesis — todas leen el mismo modelo canónico.

**La reserva:** la calidad de la Lectura **paga** sigue sin verificarse con
salidas reales. Toda la cadena determinista está medida y es sólida, pero el
texto que escribe el modelo no se pudo evaluar (sin claves de API en local, y
gastar contra las de producción no es una decisión que me corresponda tomar
solo). Con `AI_HEAVY_MODEL` sin setear, ese texto lo genera hoy un modelo de
gama flash — el mismo que sirve la energía diaria gratuita. Ver
`MODEL_QUALITY_BENCHMARK.md`.

## 5. Debilidades que quedan

1. **Calidad del texto Pro sin medir** (arriba). Es el hueco más grande.
   Requiere claves y una decisión de gasto.
2. **4 tests preexistentes en rojo** (§3), sobre UI retirada.
3. **`/explore` vs `/conocimiento`** — el hub sigue con dos nombres. Diferido
   de Fase 3 a la espera de datos de rank.
4. El email de contacto del pie (`versionlimitada@proton.me`) sigue pareciendo
   un placeholder.
5. La home ya no contradice la filosofía, pero **`/hoy`, `/semana`,
   `/evolution` y `/journal` no se auditaron** en esta pasada: el foco fue la
   columna vertebral Mapa→Lectura→IA.
