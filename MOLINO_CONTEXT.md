# MOLINO — Context Document

> Checkpoint: 2026-07-24
> Sesión: Inteligencia Personal — 3 engines + Academy + Onboarding + Branding + Auditoría

---

## 1. ESTADO ACTUAL DE PRODUCCIÓN

| Item | Valor |
|------|-------|
| **URL producción** | https://molino-alpha.vercel.app |
| **Último deploy** | ● Ready (producción, ~1m build time) |
| **Build** | 153 rutas, Compiled successfully |
| **TypeScript** | 0 errores |
| **ESLint** | 0 warnings, 0 errors |
| **Branch** | chore/upgrade-next |
| **Último commit** | `6a0925d` feat: Molino Inteligencia Personal |
| **Working tree** | Limpio (0 archivos sin commitear) |
| **Commit summary** | 51 files, +7844 insertions, -151 deletions |

---

## 2. ARQUITECTURA ACTUAL

### Tech Stack
- **Framework:** Next.js 15.5.21 (App Router)
- **UI:** React 18.3.0, Tailwind 3.4.0
- **Animaciones:** Framer Motion 11.18.2
- **Charts:** Recharts 3.10.0
- **Icons:** Lucide React 0.400.0
- **Toasts:** Sonner 2.0.7
- **Drawer:** Vaul 1.1.2
- **Deploy:** Vercel
- **Storage:** localStorage (sin backend)

### 18 Engines de cálculo

| Engine | Archivo | Función |
|--------|---------|---------|
| chineseZodiacEngine | `lib/engines/chineseZodiacEngine.ts` | Animal zodiacal con CNY real |
| numerologyEngine | `lib/engines/numerologyEngine.ts` | Life Path, Expression, Personality |
| astrologyEngine | `lib/engines/astrologyEngine.ts` | Sun sign, element, modality |
| compatibilityEngine | `lib/engines/compatibilityEngine.ts` | Perfil de usuario completo |
| personalRecommendationEngine | `lib/engines/personalRecommendationEngine.ts` | Recomendaciones 40/30/20/10 |
| recommendationEngine | `lib/engines/recommendationEngine.ts` | Recomendaciones base 50/30/20 |
| yearCycleEngine | `lib/engines/yearCycleEngine.ts` | Ciclos anuales + resonancia |
| personalTimelineEngine | `lib/engines/personalTimelineEngine.ts` | Timeline personal ±5 años |
| convergentEngine | `lib/engines/convergentEngine.ts` | Detección de convergencia |
| timingEngine | `lib/engines/timingEngine.ts` | Timing para decisiones |
| decisionsEngine | `lib/engines/decisionsEngine.ts` | Análisis de decisiones |
| dailyEnergyEngine | `lib/engines/dailyEnergyEngine.ts` | Energía diaria |
| affinityEngine | `lib/engines/affinityEngine.ts` | Afinidad legacy (backward compat) |
| compatibilityScoreEngine | `lib/engines/compatibilityScoreEngine.ts` | 70% zodiac + 30% numerología (legacy) |
| storyEngine | `lib/engines/storyEngine.ts` | Narrativas de match |
| synthesisEngine | `lib/engines/synthesisEngine.ts` | Síntesis cross-system |
| perspectivesEngine | `lib/engines/perspectivesEngine.ts` | Comparación de perspectivas |
| intelligenceEngine | `lib/engines/intelligenceEngine.ts` | AI interpretation |

### Mi Inteligencia Personal (Profile)

25+ secciones en `/profile`:

1. Hero — Tu Identidad
2. Daily Insight Feed (dailyEnergyEngine)
3. Mi Identidad (IdentityCard + LifePathExplorer + ZodiacExplorer)
4. Indicadores Simbólicos (PersonalScoreCard — barras animadas)
5. Convergencia de Patrones (convergentEngine)
6. Tu Momento Actual (timingEngine + dailyEnergy + 6 intentions + best dates)
7-12. Identidad (código, síntesis, patrones, dimensiones, sistemas)
13. Tu Afinidad Personal
14. Mi Mapa Personal (ciclo, energías, timeline)
15. Recomendaciones para mí (personalRecommendationEngine — Top 3 + scoring expandible)
16. Mi Ecosistema (ranking de entidades)
17. Lo que conviene observar (contrastes)
18. Mi Círculo (aliados)
19. Mi Contraste (aprendizaje)
20. Explora tus Afinidades (decisionsEngine scores)
21. Mi Mapa del Mundo
22. Tu Próximo Movimiento
23. Compartir (ShareableCard)
24. Tu Interpretación (AI)

### Academy (`/academy`)

- Knowledge Tree interactivo (10 nodos expandibles)
- "Cómo funciona Molino" (4 pasos)
- Cursos de aprendizaje (4 rutas)
- Disclaimer premium

### Onboarding (`/onboarding`)

- **Paso 1:** Solo fecha de nacimiento (ultra simple)
- **Paso 2:** Reveal — "Tu mapa inicial" (animal, LifePath, Birthday, Elemento)
- **Paso 3:** Nombre opcional (desbloquea Expression)
- **Paso 4:** Complete → redirección a /profile

### Affinity (`/affinity/*`)

- Hub con 7 categorías
- Ranking por tipo (brand, country, city, etc.)
- Detalle de entidad con evento histórico
- Comparación lado a lado (`/affinity/compare`)
- OG image dinámico

### Recommendations

- `/affinity/recommendations/brands`
- `/affinity/recommendations/countries`
- Scoring multidimensional por categoría

### Historical Events

- Schema `HistoricalEvent` con date/year/confidence/source
- 31 entidades con eventos verificados
- CNY real para cálculo de animal (1886-2040)
- Equivalencias culturales (Conejo = Gato vietnamita)

### Sharing

- AffinityShareableCard (afinidad)
- SymbolicMapShareableCard (mapa personal)
- OG images dinámicos (`opengraph-image.tsx`)
- navigator.share() + clipboard fallback

---

## 3. METODOLOGÍA DE FECHAS ZODIACALES

### Regla fundamental

**Nunca asumir el animal por el año gregoriano.**

Calcular el animal según:
1. Fecha exacta → usar `calculateAnimalFromDate(dateStr)` que respeta CNY real
2. Solo año → usar `calculateAnimalFromDate(undefined, year)` con fallback YYYY-06-01

### Funciones

```typescript
// CORRECTO para nuevos sistemas:
calculateAnimalFromDate("1964-01-25")  // → Conejo (pre-CNY → ajusta a 1963)
calculateAnimalFromDate(undefined, 1964) // → Conejo (Jun 1 post-CNY)

// LEGACY — no usar en nuevos sistemas:
getChineseAnimal(1964)  // → Serpiente (sin CNY, INCORRECTO)
```

### Tabla CNY extendida

- Rango: 1886-2040
- Archivo: `lib/data/chineseNewYearDates.ts`
- Para fechas pre-1886: fallback a Gregorian (marcado como aproximado)

### Fechas canónicas de entidades (verificadas)

| Entidad | Fecha | Animal | CNY | Verificado |
|---------|-------|--------|-----|------------|
| Apple | 1976-04-01 | Dragón | 1976-01-31 | ✅ Post-CNY |
| Nike | 1964-01-25 | Conejo | 1964-02-13 | ✅ Pre-CNY → 1963 |
| Coca-Cola | 1886-05-08 | Perro | 1886-02-03 | ✅ Post-CNY |
| Argentina | 1816-07-09 | Rata | Fuera de tabla | ✅ Mes 7, seguro |
| Australia | 1901-01-01 | Rata | 1901-02-19 | ✅ Pre-CNY → 1900 |
| David Bowie | 1947-01-08 | Perro | 1947-01-22 | ✅ Pre-CNY → 1946 |
| Adidas | 1949-08-18 | Buey | 1949-01-29 | ✅ Post-CNY |
| Mercedes-Benz | 1926-06-28 | Tigre | 1926-02-13 | ✅ Post-CNY |

---

## 4. DISTINCIÓN FUNDAMENTAL: SCORING

### Mi Inteligencia Personal (actual)

**Puede** utilizar múltiples dimensiones:
- Natal (usuario vs entidad)
- Temporal (año actual vs entidad)
- Elemento (mismo elemento = bonus)
- Numerología (life path resuena con tipo de entidad)

Scoring: `natal(40%) + temporal(30%) + element(20%) + numerology(10%)`

**Propósito:** Experiencia dinámica y contextual que se siente como "inteligencia personal".

### Personal Energy Compass (FUTURO — NO implementar aún)

**Motor independiente** con scoring diferente:

```
Score = EXCLUSIVAMENTE animal usuario ↔ animal entidad
```

**NO incluir en el score:**
- Elemento/Wu Xing
- Numerología
- Life Path
- Personal Year
- Personal Day
- Moon Phase
- Temporalidad
- Otros factores del perfil personal

**El elemento puede existir como dato complementario, pero NO modifica el score.**

**NO reutilizar automáticamente:**
- `personalRecommendationEngine` (tiene elemento + numerología en el score)
- `calculateChineseCompatibility()` (es legacy con scores diferentes)

**Crear motor nuevo:** `personalEnergyCompass.ts`

---

## 5. FUTURO: PERSONAL ENERGY CONCEPT

### Concepto

"Descubrí la afinidad entre vos y el mundo que te rodea."

### Entidades potenciales

- Marcas (Apple, Nike, Coca-Cola, etc.)
- Países (Argentina, Brasil, Japón, etc.)
- Ciudades (Buenos Aires, Tokio, Nueva York, etc.)
- Destinos de viaje
- Hoteles
- Productos
- Personas históricas
- Cualquier entidad con fecha histórica verificable

### Requisitos por entidad

- Fecha exacta de fundación/evento canónico
- Evento histórico documentado
- Historia factual breve
- Animal zodiacal calculado con `calculateAnimalFromDate()`
- Metodología explícita
- Fuente verificable

### Arquitectura del motor

```typescript
// personalEnergyCompass.ts (NUEVO — no reutilizar engines existentes)

interface EnergyCompassResult {
  entity: Entity;
  userAnimal: Animal;      // del perfil del usuario
  entityAnimal: Animal;    // de la fecha de la entidad
  score: number;           // EXCLUSIVAMENTE animal ↔ animal
  relation: RelationType;  // same/triad/harmonious/neutral/clash/harm
  explanation: string;
  complementaryData: {
    element: string;       // informativo, NO modifica score
    numerology: number;    // informativo, NO modifica score
    yearResonance: string; // informativo, NO modifica score
  };
}
```

---

## 6. CHECKLIST DE CADA ENTIDAD FUTURA

Para cada entidad que se agregue al sistema:

- [ ] Fecha exacta de fundación/evento canónico
- [ ] Evento histórico documentado
- [ ] Historia factual breve (1-2 oraciones)
- [ ] Animal zodiacal calculado con `calculateAnimalFromDate()`
- [ ] Verificación de CNY para fechas enero/febrero
- [ ] Metodología explícita del cálculo
- [ ] Fuente verificable
- [ ] Afinidad calculada (solo animal ↔ animal para Compass)
- [ ] Explicación transparente (sin predicciones)

---

## 7. PRIORIDAD PRÓXIMA FASE

### Diseñar Personal Energy Compass

**NO implementar todavía.** Primero diseñar la arquitectura.

Preguntas a responder:
1. ¿Cómo se presentan las entidades al usuario?
2. ¿Se muestran todas o se filtran por relevancia?
3. ¿Cómo se integra con el perfil existente?
4. ¿Cuándo se muestra: después del perfil, como sección separada, o como nuevo producto?

### Pasos recomendados

1. Diseñar schema de `personalEnergyCompass.ts`
2. Definir qué entidades se incluyen inicialmente
3. Crear componente de UI para el compass
4. Integrar con el perfil sin romper la experiencia existente
5. Probar con 5-10 entidades antes de expandir

---

## 8. REGLAS DEL PROYECTO

1. No superficial redesigns
2. No agregar dependencias innecesarias
3. No romper funcionalidad existente
4. No cambiar cálculos existentes sin justificación
5. No eliminar features existentes
6. No hacer rewrites completos
7. Mantener todas las rutas existentes
8. Visual: moderno, minimalista, premium, no esotérico
9. Light/dark mode
10. WCAG AA contrast
11. Todo UI text en español con "vos"
12. Disclaimers siempre visibles
13. No predicciones — "momento", "contexto", "exploración"
14. After each change: npm run build until clean
15. Fechas zodiacales: siempre usar `calculateAnimalFromDate()`
