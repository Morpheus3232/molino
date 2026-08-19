# MOLINO — Diagnóstico Estratégico y Diseño de Evolución

> Fecha: 2026-07-25
> Objetivo: Evolucionar Molino de "biblioteca de datos" a "experiencia de descubrimiento personal"

---

## 1. DIAGNÓSTICO UX DEL MOLINO ACTUAL

### Lo que funciona bien

| Aspecto | Estado |
|---------|--------|
| Onboarding ultra-simple (solo fecha) | ✅ Excelente |
| Reveal animado post-fecha | ✅ Momento WOW |
| 18 engines de cálculo | ✅ Motor robusto |
| Academy con knowledge tree | ✅ Contenido educativo de calidad |
| Branding "Inteligencia Personal" | ✅ Consistente |
| Animaciones premium | ✅ Apple Health + Spotify Wrapped style |
| Mobile-first | ✅ Responsive |
| Dark mode | ✅ Funcional |
| Build limpio | ✅ 153 rutas, 0 errores |

### Problemas críticos de UX

#### A. El perfil es una enciclopedia, no una experiencia

El `/profile` tiene **22 secciones** en una página infinita. El usuario debe hacer scroll interminable para encontrar algo. No hay:
- Navegación sticky
- Table of contents
- Tabs o secciones colapsables
- Indicador de progreso

**Impacto:** El usuario se siente abrumado y no completa la exploración.

#### B. Duplicación masiva de CTAs

"Marcas alineadas", "Destinos compatibles" y "Todas las entidades" aparecen en:
- PersonalRecommendationsSection
- SymbolicMapSection
- Mi Mapa del Mundo
- Explora tus Afinidades

**Impacto:** Confusión sobre qué hacer después.

#### C. Jerarquía visual confusa

Secciones superpuestas sin distinción clara:
- 3 secciones de "identidad" (Hero, Tu Identidad, Mi Identidad)
- 3 secciones de "patrones" (Síntesis, Patrones, Dimensiones)
- 4 secciones de "recomendaciones" (Afinidad, SymbolicMap, PersonalRec, Mapa del Mundo)

**Impacto:** El usuario no sabe qué es diferente entre secciones.

#### D. Onboarding revela demasiado sin contexto

El reveal muestra: Life Path, Birthday Number, Elemento, Año Personal — todos términos que un usuario nuevo no entiende.

**Impacto:** Momento WOW se diluye con jerga técnica.

#### E. Datos estáticos, no personalizados

Las "traits" de cada animal (ej: "movimiento, independencia y exploración") son strings hardcodeados. Todo usuario Caballo ve exactamente lo mismo.

**Impacto:** Se siente como un horóscopo genérico, no como inteligencia personal.

---

## 2. QUÉ CONSERVAR (NO TOCAR)

| Componente/Feature | Razón |
|-------------------|-------|
| 18 engines de cálculo | Motor robusto y funcional |
| `calculateAnimalFromDate()` | Cálculo CNY correcto |
| `animalRelations.ts` | Relaciones zodiacales verificadas |
| `symbolic-entities.ts` | 31 entidades con eventos históricos |
| `chineseNewYearDates.ts` | Tabla CNY 1886-2040 |
| Academy (`/academy`) | Contenido educativo de calidad |
| Herramientas (`/herramientas`) | Calculadoras anónimas funcionales |
| ShareableCards | Componentes listos |
| OG images dinámicos | Funcionales |
- Comparación lado a lado | Funcional
- `premiumMotion.ts` | Animaciones listas
- `zodiacDisplay.ts` | Display con Vietnamita
- `affinity/recommendations/*` | Páginas funcionales
- `decisionsEngine`, `timingEngine`, `dailyEnergyEngine` | Engines funcionales
- `convergentEngine`, `personalTimelineEngine` | Engines funcionales

---

## 3. QUÉ REORGANIZAR

### 3.1 Nueva jerarquía de experiencia

```
USUARIO NUEVO:
  /onboarding → Fecha → Reveal → Tu Identidad (simple)
  → /welcome (nueva) → Tu Mundo (10 países + 10 marcas)
  → /profile (acceso gradual)

USUARIO EXISTENTE:
  / → Tu Mundo (recomendaciones destacadas)
  → /profile (completo)
  → /academy (profundidad)
```

### 3.2 Reorganización del perfil

**ANTES (22 secciones apiladas):**
```
Hero → Daily Feed → Mi Identidad → Tu Identidad → Tu Código →
La Síntesis → Tus Patrones → Tu Momento → Tus Dimensiones →
Tus Sistemas → Tu Afinidad → Mi Mapa → Recomendaciones →
Mi Ecosistema → Lo que observar → Mi Círculo → Mi Contraste →
Explora → Contrastes → Mi Mapa Mundo → Tu Próximo → Compartir
```

**DESPUÉS (experiencia guiada):**
```
PANTALLA 1: Tu Identidad
  → Hero con identidad visual
  → Indicadores simbólicos (barras)
  → Tu momento actual

PANTALLA 2: Tu Mundo
  → Top 3 países recomendados
  → Top 3 marcas recomendadas
  → "Ver más" → /affinity/recommendations/*

PANTALLA 3: Tu Círculo
  → Personas con tu mismo animal (nuevo)
  → Personas con tu mismo signo occidental (nuevo)
  → Aliados zodiacales

PANTALLA 4: Profundidad (accesible desde nav)
  → Timing Engine
  → Decisions Engine
  → Academy
  → Comparación
```

---

## 4. QUÉ OCULTAR INICIALMENTE

| Sección | Dónde va |
|---------|----------|
| ConvergentSection | Sección de "Tu Identidad" (colapsable) |
| KnowledgeConnections | Sección de "Tu Identidad" (colapsable) |
| LifePathExplorer / ZodiacExplorer | Sección de "Tu Identidad" (inline) |
| PersonalScoreCard | Sección de "Tu Identidad" |
| ContrastLearnSection | Sección de "Tu Círculo" |
| ChallengingSection | Sección de "Tu Círculo" |
| DecisionMapSection | Accesible desde nav o "Tu Próximo Movimiento" |
| SymbolicMapShareableCard | Botón de compartir (no sección completa) |

---

## 5. NUEVO USER JOURNEY

### Usuario nuevo: "Wow, Molino me mostró cosas sobre mí"

```
1. /onboarding
   "Descubrí tu Inteligencia Personal"
   → Solo fecha de nacimiento

2. Reveal (paso 2 del onboarding)
   🐎 Caballo
   "Tu energía combina movimiento, independencia y exploración"
   → CTA: "Entrar a mi mapa"

3. /profile (PANTALLA 1: Tu Identidad)
   Hero: 🐎 Caballo · Fuego · Life Path 5
   Indicadores: Movimiento 82%, Creatividad 70%, Estabilidad 50%, Exploración 90%
   Tu momento: 2026 Año Caballo — Alta resonancia
   → CTA: "Explorar mi mundo"

4. /profile (PANTALLA 2: Tu Mundo) — NUEVA
   "Basado en tu signo 🐎 Caballo:"
   
   TOP 3 PAÍSES
   🇧🇷 Brasil (Caballo) — 85/100
   🇦🇺 Australia (Rata) — 82/100
   🇪🇸 España (Tigre) — 78/100
   
   TOP 3 MARCAS
   🍎 Apple (Dragón) — 75/100
   ✓ Nike (Conejo) — 72/100
   ☕ Coca-Cola (Perro) — 70/100
   
   → CTA: "Ver todos los países" → /affinity/recommendations/countries
   → CTA: "Ver todas las marcas" → /affinity/recommendations/brands

5. /profile (PANTALLA 3: Tu Círculo) — NUEVA
   "Personas que comparten tu animal 🐎 Caballo"
   → Lista de personas famosas nacidas en años de Caballo
   
   "Personas que comparten tu signo ♐ Acuario"
   → Lista de personas famosas nacidas bajo Acuario

6. /profile (PANTALLA 4: Profundidad)
   → Links a Academy, Timing, Decisiones, Comparación
   → "¿Querés entender más?"
```

### Usuario existente: "Quiero explorar más"

```
/ → Recomendaciones destacadas (Top 3 por categoría)
/profile → 4 pantallas con navegación
/affinity → Hub de entidades
/affinity/recommendations/* → Listas completas
/academy → Knowledge tree
```

---

## 6. NUEVA ARQUITECTURA DE NAVEGACIÓN

### Header actual vs propuesto

**ACTUAL:**
```
Descubrir ▾ | Relacionarte ▾ | Orientarte ▾ | Herramientas | Mi mapa
```

**PROPUESTO:**
```
Inicio | Mi Mundo | Mi Identidad | Explorar | Academy
```

**Justificación:**
- "Mi Mundo" es la pantalla central (recomendaciones)
- "Mi Identidad" es el perfil completo
- "Explorar" reemplaza los dropdowns confusos
- "Academy" accede directamente al contenido educativo

### Estructura de rutas

```
/                          → Landing
/onboarding                → Fecha → Reveal → (opcional: nombre)
/profile                   → Mi Identidad (pantalla 1)
/profile/world             → Tu Mundo: recomendaciones (pantalla 2) [NUEVA]
/profile/circle            → Tu Círculo: personas similares (pantalla 3) [NUEVA]
/profile/depth             → Profundidad: timing, decisiones, etc. (pantalla 4)
/profile/insights          → Feed diario (existente)
/affinity                  → Hub de entidades (existente)
/affinity/recommendations/* → Listas completas (existente)
/affinity/compare          → Comparación (existente)
/academy                   → Knowledge tree (existente)
/herramientas              → Calculadoras (existente)
```

---

## 7. WIREFRAME CONCEPTUAL

### PANTALLA 1: Mi Identidad

```
┌────────────────────────────────────────┐
│ MI IDENTIDAD                           │
│                                        │
│      🐎                                │
│    CABALLO                             │
│  Fuego · Life Path 5                   │
│                                        │
│  "Tu energía combina movimiento,       │
│   independencia y exploración."        │
│                                        │
│  ── INDICADORES ────────────────────── │
│  Movimiento     ████████░░ 82%         │
│  Creatividad    ███████░░░ 70%         │
│  Estabilidad    █████░░░░░ 50%         │
│  Exploración    █████████░ 90%         │
│                                        │
│  ── TU MOMENTO ─────────────────────── │
│  2026 · Año Caballo                    │
│  ★★★★★ Alta resonancia anual          │
│                                        │
│  [Explorar mi mundo →]                  │
└────────────────────────────────────────┘
```

### PANTALLA 2: Tu Mundo

```
┌────────────────────────────────────────┐
│ TU MUNDO                               │
│ "Basado en tu signo 🐎 Caballo"        │
│                                        │
│ ── PAÍSES RECOMENDADOS ─────────────── │
│                                        │
│  🇧🇷 Brasil         🐎 Caballo  85/100  │
│  "Fundada el 7 de septiembre de 1822.  │
│   Su animal es Caballo, mismo que vos."│
│                                        │
│  🇦🇺 Australia      🐀 Rata     82/100  │
│  "Federación el 1 de enero de 1901.    │
│   Relación de armonía con tu perfil."  │
│                                        │
│  🇪🇸 España         🐯 Tigre    78/100  │
│  "Tratado de Verdún, 843.              │
│   Tríada compatible con tu signo."     │
│                                        │
│  [Ver todos los países →]              │
│                                        │
│ ── MARCAS RECOMENDADAS ─────────────── │
│                                        │
│  🍎 Apple          🐉 Dragón   75/100  │
│  "Fundada el 1 de abril de 1976.       │
│   Energía independiente."              │
│                                        │
│  ✓ Nike            🐇 Conejo   72/100  │
│  "Fundada el 25 de enero de 1964.      │
│   Armonía natural con tu perfil."      │
│                                        │
│  [Ver todas las marcas →]              │
│                                        │
└────────────────────────────────────────┘
```

### PANTALLA 3: Tu Círculo

```
┌────────────────────────────────────────┐
│ TU CÍRCULO                             │
│                                        │
│ ── PERSONAS CON TU ANIMAL 🐎 ──────── │
│                                        │
│  🐎 Nelson Mandela (1918)              │
│     Líder y activista sudafricano      │
│                                        │
│  🐎 Rembrandt (1606)                   │
│     Maestro del arte barroco           │
│                                        │
│  🐎 Chopin (1810)                      │
│     Compositor y pianista polaco       │
│                                        │
│ ── PERSONAS CON TU SIGNO ♐ ────────── │
│                                        │
│  ♐ Shakira (1977)                      │
│     Artista y filántropa colombiana    │
│                                        │
│  ♐ Einstein (1879)                     │
│     Físico teórico, Nobel de Física    │
│                                        │
└────────────────────────────────────────┘
```

---

## 8. REUTILIZACIÓN DE COMPONENTES ACTUALES

| Componente actual | Nueva ubicación |
|------------------|-----------------|
| `IdentityCard.tsx` | Pantalla 1 (hero + indicators) |
| `PersonalScoreCard.tsx` | Pantalla 1 (barras animadas) |
| `EnhancedMomentSection.tsx` | Pantalla 1 (momento actual) |
| `PersonalRecommendationsSection.tsx` | Pantalla 2 (Top 3 + "ver más") |
| `CircleSection.tsx` | Pantalla 3 (aliados — adaptar con personas) |
| `ContrastLearnSection.tsx` | Pantalla 3 (contrastes) |
| `SymbolicMapShareableCard.tsx` | Botón de compartir en cualquier pantalla |
| `KnowledgeConnections.tsx` | Sección colapsable en Pantalla 1 |
| `ConvergentSection.tsx` | Sección colapsable en Pantalla 1 |
| `CountUp.tsx` | Animaciones de números |
| `RecommendationCard.tsx` | Cards de recomendación en Pantalla 2 |
| `PriorityBadge.tsx` | Badges de prioridad |

---

## 9. REUTILIZACIÓN DE ENGINES

| Engine | Uso actual | Uso nuevo |
|--------|-----------|-----------|
| `personalRecommendationEngine` | Ranking de entidades | **Score de afinidad para Tu Mundo** (mantener 40/30/20/10) |
| `yearCycleEngine` | Ciclo anual | **Tu Momento en Pantalla 1** |
| `timingEngine` | Timing para decisiones | **Pantalla 4 (profundidad)** |
| `decisionsEngine` | Análisis de decisiones | **Pantalla 4 (profundidad)** |
| `dailyEnergyEngine` | Energía diaria | **Pantalla 1 (feed)** |
| `convergentEngine` | Convergencia de patrones | **Pantalla 1 (colapsable)** |
| `personalTimelineEngine` | Timeline personal | **Pantalla 1 (momento)** |
| `chineseZodiacEngine` | Animal zodiacal | **Cálculo base** (sin cambios) |
| `numerologyEngine` | Números | **Pantalla 1 (identidad)** |
| `astrologyEngine` | Signo occidental | **Pantalla 1 (identidad)** |

---

## 10. ENGINES QUE FALTAN

### Necesarios para la visión

| Engine | Función | Prioridad |
|--------|---------|-----------|
| `zodiacCircleEngine.ts` | Personas famosas por animal chino | Alta |
| `westernCircleEngine.ts` | Personas famosas por signo occidental | Alta |
| `personalEnergyCompass.ts` | Score animal↔animal (sin elemento/numerología) | Alta |
| `entityHistoryEngine.ts` | Historia factual breve de entidades | Media |

### No necesarios aún

| Engine | Función | Razón |
|--------|---------|-------|
| Hotel/producto engine | Recomendaciones de hoteles/productos | Fase futura |
| Travel engine | Recomendaciones de viajes/emigración | Fase futura |

---

## 11. DATOS QUE FALTAN

### Para 10 países de calidad

**Necesitamos:** 10 países con:
- Fecha de independencia/fundación verificada
- Animal zodiacal calculado
- Breve historia factual
- Fuente

**Países candidatos (ya existen en `symbolic-entities.ts`):**
- Argentina (1816) ✓
- Brasil (1822) ✓
- Australia (1901) ✓
- Japón (660 a.C. — tradición) ✓
- Francia (843) ✓

**Países nuevos necesarios (~5 más):**
- España, Italia, México, Alemania, Reino Unido, India, China, etc.

### Para 10 marcas de calidad

**Ya existen en `symbolic-entities.ts`:**
- Apple (1976) ✓
- Nike (1964) ✓
- Coca-Cola (1886) ✓
- Tesla (2003) ✓
- Adidas (1949) ✓
- Mercedes-Benz (1926) ✓
- Patagonia (1973) ✓
- Spotify (2006) ✓

**Faltan ~2 más para completar 10.**

### Para personas famosas (nuevo)

**Necesitamos:** Base de datos de ~50-100 personas famosas con:
- Nombre
- Fecha de nacimiento exacta (para calcular animal chino con CNY)
- Signo occidental
- Profesión
- Breve dato interesante
- Fuente

**Categorías:** Líderes, artistas, científicos, deportistas, empresarios, etc.

---

## 12. GARANTIZAR FECHAS HISTÓRICAS EXACTAS

### Metodología

1. **Fecha de fundación:** Usar la fecha de incorporación legal o evento fundacional canónico
2. **Verificación CNY:** Siempre usar `calculateAnimalFromDate()` — nunca `getChineseAnimal()`
3. **Fuentes:** Britannica, Wikipedia (con verificación), archivos oficiales de la empresa/país
4. **Distinción:** Separar dato factual de interpretación simbólica

### Ejemplo de presentación

```
NIKE
Fundada: 25 de enero de 1964
Fuente: Nike corporate history

Animal: Conejo (calculado con Año Nuevo Chino real:
  CNY 1964 = 13 febrero → 25 enero es PRE-CNY → ajusta a 1963)

Afinidad con vos: 72/100
"Armonía natural según la tradición del zodíaco chino."
```

---

## 13. SISTEMA DE RECOMENDACIONES

### Modelo actual vs propuesto

**ACTUAL:**
```
Score = natal(40%) + temporal(30%) + element(20%) + numerology(10%)
→ Muestra: ranking + score + explicación
```

**PROPUESTO (para "Tu Mundo"):**
```
Score = natal(60%) + temporal(25%) + element(15%)
→ Muestra:Top 3 por categoría + historia factual + relación simbólica
```

### Card de recomendación propuesta

```
┌──────────────────────────────────────────┐
│ 🇧🇷 Brasil                    85/100     │
│                                          │
│ Fundada el 7 de septiembre de 1822.      │
│ Pedro I declaró la independencia en el   │
│ río Ipiranga, São Paulo.                 │
│                                          │
│ 🐎 Caballo — Mismo animal que vos       │
│                                          │
│ "Según la tradición, compartir el       │
│ mismo animal indica una energía similar  │
│ y sintonía natural."                     │
│                                          │
│ [Ver más →]                              │
└──────────────────────────────────────────┘
```

---

## 14. SEPARACIÓN: DATOS FACTUALES vs INTERPRETACIÓN

### En cada recomendación:

```
DATO FACTUAL (verificable):
  "Fundada el 25 de enero de 1964"
  "Su animal es Conejo (CNY 1964 = 13 febrero)"

INTERPRETACIÓN SIMBÓLICA:
  "Armonía natural según la tradición del zodíaco chino"

RECOMENDACIÓN:
  "Nike puede ser una marca que resuena con tu perfil"
```

### En la UI:

- **Dato factual:** Texto normal, sin styling especial
- **Interpretación:** Texto en cursiva o con prefijo "Según la tradición..."
- **Recomendación:** Badge o label con color

---

## 15. PLAN DE IMPLEMENTACIÓN

### FASE 1: Reorganización del perfil (sin nuevos datos)

**Objetivo:** Transformar /profile de 22 secciones a 4 pantallas con navegación.

- [ ] Crear navegación por pantallas (tabs o scrollspy)
- [ ] Mover secciones a 4 grupos: Identidad, Mundo, Círculo, Profundidad
- [ ] Colapsar KnowledgeConnections y ConvergentSection
- [ ] Eliminar duplicación de CTAs
- [ ] Unificar disclaimers
- [ ] Agregar "Tu Mundo" como pantalla central
- **Estimación:** 3-4 días

### FASE 2: Tu Mundo — Recomendaciones prácticas

**Objetivo:** Mostrar 10 países y 10 marcas con historial factual.

- [ ] Expandir `symbolic-entities.ts` a ~15 países y ~12 marcas
- [ ] Agregar historia factual breve a cada entidad
- [ ] Crear componente `WorldRecommendationCard`
- [ ] Integrar en `/profile/world`
- [ ] Conectar con `/affinity/recommendations/*`
- **Estimación:** 3-4 días

### FASE 3: Tu Círculo — Personas similares

**Objetivo:** Mostrar personas famosas por animal chino y signo occidental.

- [ ] Crear base de datos de personas (~50-100)
- [ ] Crear `zodiacCircleEngine.ts`
- [ ] Crear `westernCircleEngine.ts`
- [ ] Crear componente `CircleOfFamous`
- [ ] Integrar en `/profile/circle`
- **Estimación:** 4-5 días

### FASE 4: Nueva navegación

**Objetivo:** Header simplificado y navegación por pantallas.

- [ ] Rediseñar header: Inicio | Mi Mundo | Mi Identidad | Explorar | Academy
- [ ] Crear componente `ScreenNav` para /profile
- [ ] Integrar con existente sin romper rutas
- **Estimación:** 2-3 días

### FASE 5: Personal Energy Compass

**Objetivo:** Motor de scoring animal↔animal puro.

- [ ] Crear `personalEnergyCompass.ts`
- [ ] Score: solo natal (100%)
- [ ] Sin elemento, sin numerología, sin temporal
- [ ] Integrar en "Tu Mundo"
- **Estimación:** 2-3 días

### FASE 6: Refinamiento y polish

**Objetivo:** Pulir la experiencia completa.

- [ ] Animaciones de revelación progresiva
- [ ] ShareableCard del mapa personal mejorado
- [ ] OG images actualizados
- [ ] Testing mobile completo
- **Estimación:** 2-3 días

**Estimación total: 16-22 días**

---

## 16. RIESGOS

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Romper rutas existentes | Media | No eliminar rutas, solo reorganizar contenido |
| Confundir usuarios existentes | Media | Mantener CTAs existentes como fallback |
| Datos de personas famosas incorrectos | Baja | Verificar cada fecha con fuente |
| Performance con más datos | Baja | Lazy loading, virtualización si es necesario |
| SEO afectado por reorganización | Media | Mantener metadata, usar redirects si es necesario |
