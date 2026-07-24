# MOLINO — Context Document

> Checkpoint: 2026-07-24
> Última sesión: Inteligencia Personal — 3 engines integrados + Onboarding rediseñado

---

## 1. ESTADO ACTUAL DE PRODUCCIÓN

| Item | Valor |
|------|-------|
| **URL producción** | https://molino-alpha.vercel.app |
| **Último deploy** | ● Ready (producción, ~2m build time) |
| **Build** | 153 rutas, Compiled successfully |
| **TypeScript** | 0 errores |
| **ESLint** | 0 warnings, 0 errors |
| **Branch** | chore/upgrade-next |
| **Último commit** | a4d48bf feat: Afinidad Simbólica |
| **Archivos sin commitear** | 44 (nuevos + modificados) |

---

## 2. ARQUITECTURA ACTUAL

### Tech Stack
- **Framework:** Next.js 15.5.21 (App Router)
- **UI:** React 18.3.0, Tailwind 3.4.0
- **Animaciones:** Framer Motion 11.18.2
- **Charts:** Recharts 3.10.0 (underutilizado)
- **Icons:** Lucide React 0.400.0
- **Toasts:** Sonner 2.0.7
- **Drawer:** Vaul 1.1.2
- **Deploy:** Vercel
- **Storage:** localStorage (sin backend)

### Estructura de directorios

```
app/
├── page.tsx                    # Landing (institutional)
├── onboarding/page.tsx         # Onboarding (fecha → reveal → nombre)
├── profile/page.tsx            # Mi Inteligencia Personal (25+ secciones)
├── profile/insights/page.tsx   # Feed diario
├── academy/page.tsx            # La Academia (knowledge tree)
├── affinity/                   # Sistema de afinidad
│   ├── page.tsx                # Hub
│   ├── [type]/page.tsx         # Ranking por tipo
│   ├── [type]/[slug]/page.tsx  # Detalle de entidad
│   ├── compare/                # Comparación lado a lado
│   └── recommendations/        # Recomendaciones por categoría
├── compatibility/              # Sistema legacy (países/marcas)
├── herramientas/               # Calculadoras anónimas
├── conocimiento/               # Knowledge library
├── zodiaco-chino/              # Explorer interactivo
└── api/ai/                     # AI interpretation endpoint

lib/
├── engines/                    # 18 motores de cálculo
│   ├── affinityEngine.ts       # Afinidad por entidad
│   ├── personalRecommendationEngine.ts  # Recomendaciones 40/30/20/10
│   ├── recommendationEngine.ts # Recomendaciones base
│   ├── yearCycleEngine.ts      # Ciclos anuales
│   ├── personalTimelineEngine.ts # Timeline personal
│   ├── convergentEngine.ts     # Detección de convergencia
│   ├── timingEngine.ts         # Timing para decisiones
│   ├── decisionsEngine.ts      # Análisis de decisiones
│   ├── dailyEnergyEngine.ts    # Energía diaria
│   ├── chineseZodiacEngine.ts  # Zodíaco chino con CNY real
│   ├── numerologyEngine.ts     # Numerología pitagórica
│   ├── astrologyEngine.ts      # Astrología occidental
│   ├── compatibilityEngine.ts  # Perfil de usuario
│   ├── synthesisEngine.ts      # Síntesis cross-system
│   ├── perspectivesEngine.ts   # Comparación de perspectivas
│   ├── intelligenceEngine.ts   # AI interpretation
│   └── storyEngine.ts          # Narrativas de match
├── data/                       # 14 archivos de datos
│   ├── animalRelations.ts      # Relaciones zodiacales correctas
│   ├── symbolic-entities.ts    # 31 entidades con eventos históricos
│   ├── chineseNewYearDates.ts  # Tabla CNY 1886-2040
│   └── ...
├── utils/
│   ├── motion.ts               # Animaciones base
│   ├── premiumMotion.ts        # Animaciones premium (Apple/Spotify)
│   ├── zodiacDisplay.ts        # Display de animales + Vietnamita
│   └── score.ts                # Utilidades de score
└── hooks/
    └── useProfile.ts           # Hook de perfil

components/
├── profile/                    # 18 componentes de perfil
├── academy/                    # 4 componentes educativos
├── charts/                     # 3 componentes de gráficos
├── ui/                         # 10 componentes UI genéricos
└── affinity/                   # 1 componente de recomendación
```

---

## 3. FLUJO DE USUARIO COMPLETO

```
/ (Landing)
│
├→ /onboarding
│   PASO 1: Solo fecha de nacimiento
│   PASO 2: Reveal — "Tu mapa inicial" (Life Path, Animal, Elemento)
│   PASO 3: Nombre opcional (desbloquea Expression/Soul/Personality)
│   PASO 4: Redirección a /profile
│
├→ /profile (Mi Inteligencia Personal)
│   1. Hero — Tu Identidad
│   2. Daily Insight Feed (con dailyEnergy)
│   3. Mi Identidad (LifePath/Zodiac explorers)
│   4. Indicadores Simbólicos (barras animadas)
│   5. Convergencia de Patrones (capas convergentes)
│   6. Tu Momento Actual (timingEngine + dailyEnergy + intentions)
│   7-12. Secciones de identidad (código, síntesis, patrones, etc.)
│   13. Tu Afinidad Personal
│   14. Mi Mapa Personal (ciclo, energías, timeline)
│   15. Recomendaciones (Top 3 + scoring 40/30/20/10)
│   16. Mi Ecosistema (ranking de entidades)
│   17. Lo que conviene observar (contrastes)
│   18. Mi Círculo (aliados)
│   19. Mi Contraste (aprendizaje)
│   20. Explora tus Afinidades (decisionsEngine scores)
│   21. Mi Mapa del Mundo
│   22. Tu Próximo Movimiento
│   23. Compartir
│   24. Tu Interpretación (AI)
│
├→ /profile/insights (Feed diario)
├→ /academy (La Academia — knowledge tree interactivo)
├→ /affinity/* (Sistema de afinidad completo)
└→ /herramientas/* (Calculadoras anónimas)
```

---

## 4. MI INTELIGENCIA PERSONAL — 3 ENGINES

### 4.1 Timing Engine

**Ubicación:** `lib/engines/timingEngine.ts`
**Integrado en:** `EnhancedMomentSection.tsx`

**Scoring:**
```
timingScore = base(50)
  + personalDay alignment (±20)
  + moonPhase (±10)
  + element bonus (±10)
  + year energy (±5)
```

**Funciones:**
- `analyzeTiming(profile, date, intention)` → TimingResult
- `findBestDates(profile, start, end, intention)` → Top 5 fechas

**Intenciones soportadas:** start_project, change_job, launch_something, sign_agreement, make_decision, start_relationship, publish_something

**Datos que usa:**
- personalDay, personalYear (numerología)
- moonPhase (astronomía)
- element (astrología)
- intention (categoría)

### 4.2 Decisions Engine

**Ubicación:** `lib/engines/decisionsEngine.ts`
**Integrado en:** `DecisionMapSection.tsx`

**Scoring:**
```
overallScore = alignment(40%) + timing(30%) + energy(30%)
```

**Funciones:**
- `analyzeDecision(profile, question, category)` → DecisionResult

**Categorías:** career, relationships, creativity, finances, health, education, travel, personal

**Datos que produce:**
- overallScore, alignmentScore, timingScore, energyScore
- recommendation, reasoning
- considerations[], nextSteps[]
- elementInfluence

### 4.3 Recommendation Engine (Personal)

**Ubicación:** `lib/engines/personalRecommendationEngine.ts`
**Integrado en:** `PersonalRecommendationsSection.tsx`

**Scoring:**
```
totalScore = natal(40%) + temporal(30%) + element(20%) + numerology(10%)
```

**Funciones:**
- `buildPersonalRecommendations(profile)` → SymbolicMap
- `getRecommendationsByCategory(profile, type)` → Recommendation[]

**Prioridades:** 5 (máxima) → 1 (desafiante)

**Datos que usa:**
- Natal: usuario vs entidad (animalRelations)
- Temporal: año actual vs entidad
- Element: mismo elemento = +10 bonus
- Numerology: life path resonates con entity type = +5

### 4.4 Cómo se relacionan

```
UserProfile
  │
  ├→ timingEngine: personalDay, personalYear, moonPhase, element
  │   → EnhancedMomentSection: "Tu momento actual"
  │
  ├→ decisionsEngine: personalDay, personalYear, element, dailyEnergy
  │   → DecisionMapSection: "Explora tus afinidades"
  │
  ├→ personalRecommendationEngine: animal, element, yearAnimal, lifePath
  │   → PersonalRecommendationsSection: "Recomendaciones para mí"
  │
  └→ convergentEngine: lifePath, personalYear, animal, yearAnimal
      → ConvergentSection: "Cuando todos tus patrones se encuentran"
```

---

## 5. SISTEMAS ACTUALMENTE DISPONIBLES

### Numerología
- Life Path (Camino de Vida)
- Birthday Number
- Expression Number (requiere nombre)
- Soul Number (requiere nombre)
- Personality Number (requiere nombre)
- Personal Year/Day/Month
- Cálculo en `numerologyEngine.ts`

### Zodíaco Chino
- 12 animales con cálculo CNY real (1886-2040)
- Equivalente vietnamita (Conejo = Gato)
- Relaciones: San He (tríadas), Liu He (armonía), Liu Chong (clash), Liu Hai (harm)
- 5 elementos: Madera, Fuego, Tierra, Metal, Agua
- Cálculo en `chineseZodiacEngine.ts` + `animalRelations.ts`

### Wu Xing
- **ELIMINADO** del motor de afinidad (por decisión del usuario)
- Elementos disponibles para display, no para cálculo de compatibilidad

### Ciclos
- Año personal, mes personal, día personal
- Año universal
- Ciclo zodiacal (12 años)
- Timeline personal (pasado/futuro)
- Resonancia anual (alignment/harmony/neutral/adaptation)

### Compatibilidad
- Sistema legacy: 70% zodíaco + 30% numerología (países/marcas)
- Sistema nuevo: Afinidad Personal (zodíaco solamente)
- Scoring: 40% natal + 30% temporal + 20% elemento + 10% numerología

### Conocimiento
- `/conocimiento/*` — Knowledge library
- `/academy` — Knowledge tree interactivo
- `/biblioteca` — Fuentes bibliográficas
- `/zodiaco-chino` — Explorer interactivo

### Eventos Históricos
- Schema `HistoricalEvent` con date/year/confidence/source
- 31 entidades con eventos verificados
- CNY real para cálculo de animal (1886-2040)
- Equivalencias culturales (Conejo = Gato vietnamita)

### Otros sistemas
- Astrología occidental (sun sign, element, modality)
- Arquetipos (basados en Life Path)
- Energía diaria (dailyEnergyEngine)
- Timing (timingEngine)
- Decisiones (decisionsEngine)
- AI interpretation (intelligenceEngine)

---

## 6. COMPONENTES UX REUTILIZABLES

| Componente | Uso | Estado |
|-----------|-----|--------|
| `premiumMotion.ts` | 20+ presets de animación | ✅ Activo |
| `CountUp.tsx` | Contador animado | ✅ Activo |
| `PriorityBadge.tsx` | Badge de prioridad | ✅ Activo |
| `RecommendationCard.tsx` | Card de recomendación expandible | ✅ Activo |
| `KnowledgeLinkCard.tsx` | Card de origen de conocimiento | ✅ Activo |
| `LifePathExplorer.tsx` | Explorer del Life Path | ✅ Activo |
| `ZodiacExplorer.tsx` | Explorer del animal zodiacal | ✅ Activo |
| `LoadingState.tsx` | Skeleton/spinner | ✅ Activo |
| `ProfileRadar.tsx` | Radar chart (Recharts) | ✅ Activo |
| `PriorityBarChart.tsx` | BarChart horizontal | ✅ Activo |
| `ElementPieChart.tsx` | PieChart de elementos | ✅ Activo |
| `AnimatedLayout.tsx` | Page transitions | ✅ Activo |
| `EmptyState.tsx` | Estado vacío | ❌ Huérfano |
| `CycleTimeline.tsx` | Timeline de ciclos | ❌ Huérfano |

---

## 7. ONBOARDING ACTUAL

```
PASO 1: Solo fecha (Día/Mes/Año)
  → Ultra simple, sin fricción

PASO 2: Reveal — "Tu mapa inicial"
  → Animal emoji grande
  → Life Path + Birthday + Elemento + Año Personal
  → Resumen narrativo
  → CTA: "Profundizar mi mapa" o "Entrar sin nombre"

PASO 3: Nombre (opcional)
  → Desbloquea Expression/Soul/Personality numbers
  → CTA: "Desbloquear capas" o "Saltar"

PASO 4: Complete
  → "Tu mapa está listo" → /profile
```

**Datos mínimos:** Solo fecha de nacimiento
**Datos opcionales:** Nombre → desbloquea numerología del nombre

---

## 8. FUNCIONALIDADES COMPLETADAS

| Feature | Estado | Rutas |
|---------|--------|-------|
| Landing page | ✅ | `/` |
| Onboarding (fecha → reveal → nombre) | ✅ | `/onboarding` |
| Mi Inteligencia Personal (25+ secciones) | ✅ | `/profile` |
| Daily Insight Feed | ✅ | `/profile/insights` |
| Timing Engine integrado | ✅ | `/profile` |
| Decisions Engine integrado | ✅ | `/profile` |
| Recommendation Engine (40/30/20/10) | ✅ | `/profile` |
| Convergent Layers | ✅ | `/profile` |
| Personal Timeline | ✅ | `/profile` |
| Academy (knowledge tree) | ✅ | `/academy` |
| Afinidad Personal (31 entidades) | ✅ | `/affinity/*` |
| Comparación lado a lado | ✅ | `/affinity/compare` |
| Recomendaciones (marcas/países) | ✅ | `/affinity/recommendations/*` |
| ShareableCard (affinity + mapa) | ✅ | Componentes |
| OG image dinámico | ✅ | `/affinity/[type]/[slug]/opengraph-image` |
| Zodiac display (Chinese + Vietnamese) | ✅ | `zodiacDisplay.ts` |
| Indicadores simbólicos (barras animadas) | ✅ | `/profile` |
| Mi Círculo (aliados) | ✅ | `/profile` |
| Mi Contraste (aprendizaje) | ✅ | `/profile` |
| Decision Map | ✅ | `/profile` |
| Animaciones premium (Apple/Spotify) | ✅ | `premiumMotion.ts` |
| Knowledge explorers (inline) | ✅ | `/profile` |
| Knowledge Connections | ✅ | `/profile` |
| Branding actualizado | ✅ | Global |

---

## 9. FUNCIONALIDADES PENDIENTES

### Corto plazo (próxima sesión)
- [ ] Integrar EmptyState.tsx para usuarios sin profile
- [ ] Integrar CycleTimeline.tsx en EnhancedMomentSection
- [ ] Agregar más gráficos Recharts (BarChart de prioridades, PieChart de elementos)
- [ ] vaul: bottom sheets para detalle de entidades
- [ ] sonner: notificaciones de insights diarios
- [ ] Completar course routes en Academy
- [ ] ShareableCard del mapa personal (mejorar el existente)
- [ ] Commit de los 44 archivos sin commitear

### Mediano plazo
- [ ] Expandir base de datos de entidades (31 → 50+)
- [ ] Integrar more recharts visualizations
- [ ] A/B testing de onboarding
- [ ] Analytics de engagement
- [ ] PWA / offline support

### Largo plazo
- [ ] Premium Personal Intelligence Report (USD 8)
- [ ] Compatibilidad pareja (分享 con pareja)
- [ ] Timeline de ciclos pasados/futuros visual
- [ ] Export a PDF
- [ ] Integración con calendario (Google/Apple)
- [ ] Notificaciones push para insights diarios

---

## 10. VISIÓN ESTRATÉGICA FUTURA

### Roadmap de features

#### FASE 1: Core Experience (COMPLETADA)
- Perfil personal
- Zodíaco chino con CNY real
- Life Path + Birthday Number
- Ciclos anuales
- Recomendaciones simbólicas

#### FASE 2: Intelligence Engine (COMPLETADA)
- Timing Engine
- Decisions Engine
- Recommendation Engine (40/30/20/10)
- Convergent Layers
- Personal Timeline
- Daily Energy

#### FASE 3: Discovery Experience (COMPLETADA)
- Mi Mapa Personal
- Mi Ecosistema
- Mi Círculo
- Mi Contraste
- Decision Map
- Shareable Cards

#### FASE 4: Knowledge Experience (COMPLETADA)
- Academy (knowledge tree interactivo)
- LifePath Explorer
- Zodiac Explorer
- Knowledge Connections
- Cómo funciona Molino

#### FASE 5: Retención (COMPLETADA)
- Daily Insight Feed
- Feed dinámico (hoy/semana/mes)
- Notificaciones de ciclo

#### FASE 6: Viral (COMPLETADA)
- ShareableCard de afinidad
- ShareableCard del mapa
- OG images dinámicos
- Branding consistente

#### FASE 7: Premium (FUTURA — NO implementar aún)
- **Premium Personal Intelligence Report** (USD 8)
  - PDF descargable con mapa completo
  - Análisis detallado por sección
  - Timeline visual de ciclos
  - Recomendaciones personalizadas
  - Shareables premium
- **Publicidad contextual**
  - Banner nativo en secciones de exploración
  - Recomendaciones patrocinadas (marcas/países)
  - Sin interrumpir la experiencia
- **Afiliados y partnerships**
  - Links de afiliado a marcas recomendadas
  - Partnerships con hoteles/destinos
  - Revenue share con plataformas de viajes
- **Funcionalidades premium**
  - Compatibilidad pareja (compartir con pareja)
  - Timeline de ciclos pasados/futuros visual
  - Export a PDF del mapa personal
  - Integración con calendario (Google/Apple)
  - Notificaciones push para insights diarios

### Filosofía de monetización

**Gratis siempre:**
- Perfil completo
- Todas las recomendaciones
- Academy
- Shareables básicos
- Timing y decisiones

**Premium (USD 8):**
- Report PDF descargable
- Análisis extendido
- Shareables premium
- Sin ads

**Publicidad (futuro):**
- No interrumpir la experiencia
- Recomendaciones patrocinadas claramente marcadas
- Solo en secciones de exploración

---

## REGLAS DEL PROYECTO

1. No superficial redesigns — cambios deben ser substantivos
2. No agregar dependencias innecesarias
3. No romper funcionalidad existente
4. No cambiar cálculos, fórmulas o lógica de negocio
5. No eliminar features existentes
6. No hacer rewrites completos — evolución incremental
7. No glassmorphism excesivo, gradients genéricos, neon
8. Mantener todas las rutas existentes
9. Visual: moderno, minimalista, editorial, premium, no esotérico
10. Soporte light/dark mode
11. WCAG AA contrast
12. Homepage DEMO data claramente marcada
13. No datos falsos en perfil real
14. No features cosméticas
15. No copies CUE
16. No chatbot genérico
17. No autenticación obligatoria
18. No nuevas dependencias salvo estrictamente necesarias
19. After each change: npm run build until clean
20. Todo UI text en español — "Inteligencia Personal"
21. Usar "vos" forms (Explorá, Descubrí, Conocé)
22. Disclaimers: "Lectura simbólica basada en tradiciones culturales"
23. No predicciones — "momento", "contexto", "exploración"
24. Fuente hierarchy: Britannica > Stanford > Oxford > academic
25. NO avanzar con nuevas funcionalidades hasta que home/profile UX flow esté perfecto

---

## CHECKPOINT ANTERIOR

- **Último checkpoint significativo:** 2026-07-24
- **Sesión:** Inteligencia Personal — 3 engines + Onboarding + Academy + Branding
- **Commits pendientes:** 44 archivos sin commitear
- **Deploy:** ● Ready (producción)
