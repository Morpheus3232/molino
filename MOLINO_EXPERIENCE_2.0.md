# MOLINO EXPERIENCE 2.0
## Rediseño Estratégico de Experiencia Premium

---

## 1. NUEVA VISIÓN DEL PRODUCTO

### De "Generador de Información" a "Compañero de Autodescubrimiento"

**Molino 1.0:** Calcula 18 motores, muestra 25 secciones, entrega datos.
**Molino 2.0:** Guía a una persona a entenderse mejor, decide con claridad, vuelve cada día.

---

### Promesa de Valor (One-Liner)

> **"Molino es tu brújula personal. Combina sabiduría ancestral + inteligencia artificial para que entiendas quién eres, cómo funcionas y hacia dónde ir — sin dogmas, sin predicciones, solo claridad."**

---

### Pilares de la Experiencia Premium

| Pilar | 1.0 (Actual) | 2.0 (Objetivo) |
|-------|--------------|----------------|
| **Identidad** | "Aquí están tus números" | "Esto explica por qué eres así" |
| **Utilidad** | Consulta pasiva | Decisiones activas |
| **Ritmo** | Una vez (curiosidad) | Diario (hábito) + Profundo (ciclos) |
| **Relación** | Usuario ↔ Dato | Persona ↔ Compañero |
| **Premium** | No existe | Desbloquea profundidad + agencia |

---

### Diferenciadores Defendibles

1. **Rigor técnico real** — 18 engines, CNY verificado, 31 entidades históricas auditadas
2. **Síntesis cross-system** — Numerología + Zodíaco Chino + Wu Xing + Ciclos en un solo mapa
3. **IA interpretativa, no predictiva** — "Este es tu momento" vs "Te pasará esto"
4. **Privacidad por arquitectura** — localStorage only, cero backend, cero tracking
5. **Diseño editorial premium** — No esotérico, no gamificado, respetuoso de la inteligencia del usuario

---

## 2. USER JOURNEY COMPLETO

### Mapa de Experiencia End-to-End

```
┌─────────────┐    ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐    ┌──────────────┐
│  DESCUBRIR  │───▶│  ONBOARDING │───▶│  REVEAL MAPA     │───▶│  PROFILE 2.0│───▶│  HÁBITO DIARIO│
│   (Home)    │    │  (3 pasos)  │    │  (Momento WOW)   │    │  (Navegable)│    │  (Retención) │
└─────────────┘    └─────────────┘    └──────────────────┘    └─────────────┘    └──────────────┘
      │                │                    │                   │                 │
      ▼                ▼                    ▼                   ▼                 ▼
  "¿Qué es?"      "Solo mi fecha"      "Esto soy yo"      "Exploro a mi    "Vuelvo por mi
  "Para mí?"      "Sin fricción"       "No lo sabía"       ritmo"            energía/decisiones"
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │  PREMIUM UPGRADE│
                                            │  (Momento valor)│
                                            └───────────────┘
```

### Estados Emocionales por Fase

| Fase | Emoción Objetivo | Métrica de Éxito |
|------|------------------|------------------|
| Home | Curiosidad + Confianza | CTR → Onboarding > 15% |
| Onboarding | Ligereza + Anticipación | Completion rate > 85% |
| Reveal | Asombro + Validación | "Wow moment" share rate > 20% |
| Profile | Claridad + Agencia | Tiempo > 3min, 3+ capítulos visitados |
| Daily | Calibración + Confianza | Retention D1 > 40%, D7 > 20% |
| Premium | Deseo + Justicia | Conversión trial → paid > 8% |

---

## 3. ARQUITECTURA HOME 2.0

### Principio: "Valor en 3 segundos, CTA en 5"

---

### Estructura Nueva (Mobile-First)

```
┌─────────────────────────────────────┐
│  HERO (100vh max, NO min-h-screen)  │
│  ┌───────────────────────────────┐  │
│  │  Eyebrow: "Tu brújula personal"│  │
│  │  H1: "Entendé quién sos.      │  │
│  │       Decidí con claridad."    │  │
│  │  Sub: "Numerología + Zodíaco   │  │
│  │       Chino + IA. Solo tu      │  │
│  │       fecha de nacimiento.     │  │
│  │       0 datos guardados."       │  │
│  │                                │  │
│  │  [CTA Principal] DESCUBRIR MI  │  │
│  │       MAPA  ← btn-accent, lg   │  │
│  │  [CTA Secundario] Ver cómo     │  │
│  │       funciona  ← btn-ghost    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
│  SCROLL HINT sutil (flecha animada) │
├─────────────────────────────────────┤
│  PROOF BAR (sticky en scroll)       │
│  ┌─────────┬─────────┬─────────┐     │
│  │ 3       │ 18      │ 0       │     │
│  │ Sistemas│ Engines │ Datos   │     │
│  │ unificados│       │ tuyos   │     │
│  └─────────┴─────────┴─────────┘     │
├─────────────────────────────────────┤
│  DEMO INTERACTIVA (inline)          │
│  "Probá con una fecha"              │
│  [DateInput mini] → Mini-reveal     │
│  (Animal + LifePath + 1 insight)    │
├─────────────────────────────────────┤
│  CAPABILITIES (3 cards, NO grid)    │
│  ┌─────────────────────────────┐    │
│  │ 🎯 IDENTIDAD                │    │
│  │ Tu código natal: LifePath,  │    │
│  │ Expresión, Alma, Animal,    │    │
│  │ Elemento, Ciclo actual      │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ⚡ ENERGÍA DIARIA           │    │
│  │ Tu score del día, tema,     │    │
│  │ fortalezas, precauciones,   │    │
│  │ mejores horas para decidir  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🧭 DECISIONES               │    │
│  │ Timing, convergencias,      │    │
│  │ mapa de decisiones,         │    │
│  │ chat con tu Molino          │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  TRUST: "Usado por X personas.     │
│  Sin registro. Sin emails.          │
│  Tu fecha nunca sale del navegador."│
├─────────────────────────────────────┤
│  FOOTER minimal                     │
└─────────────────────────────────────┘
```

---

### Copy Sugerido por Sección

| Sección | Copy Actual | Copy 2.0 |
|---------|-------------|----------|
| **Eyebrow** | "INTELIGENCIA PERSONAL" | "Tu brújula personal" |
| **H1** | (Número del día gigante) | "Entendé quién sos. Decidí con claridad." |
| **Sub** | Reflexión día + breakdown | "Numerología + Zodíaco Chino + IA. Solo tu fecha. 0 datos guardados." |
| **CTA Principal** | "DESCUBRIR MI MAPA" | "DESCUBRIR MI MAPA" (igual, pero con peso visual real) |
| **CTA Secundario** | — | "Ver cómo funciona" → /guia |
| **Proof Bar** | "3 sistemas, 13 fuentes, 0 datos" | "3 sistemas unificados · 18 engines · 0 datos tuyos" |
| **Demo** | — | "Probá ahora · Ingresá una fecha · Ver tu animal + LifePath al instante" |
| **Capabilities** | SystemsPreview genérico | 3 beneficios concretos con outcome |

---

### Qué Eliminar del Hero Actual

1. ❌ Número del día 22vw (domina, no vende)
2. ❌ Reflexión del día comprimida a la derecha
3. ❌ Breakdown numerológico del día (demasiado técnico para arriba)
4. ❌ `min-h-screen` sin scroll hint
5. ❌ Stats bar como única prueba social

---

### Qué Agregar

1. ✅ Value prop claro en H1 + Sub
2. ✅ CTA secundario "Ver cómo funciona"
3. ✅ Demo interactiva inline (micro-onboarding)
4. ✅ 3 capabilities orientadas a outcome
5. ✅ Trust signals explícitos
6. ✅ Scroll hint visual

---

## 4. ARQUITECTURA ONBOARDING 2.0

### Principio: "No es formulario. Es ritual de entrada."

---

### Flujo de 3 Pasos + Reveal

```
PASO 1: ENTRADA          PASO 2: ANIMACIÓN       PASO 3: NOMBRE (OPC)     REVEAL
┌──────────────┐         ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ "Querés      │  ──▶    │ Generando    │  ──▶   │ "¿Cómo te    │  ──▶   │ "Acá está    │
│  descubrir   │         │ tu mapa...   │        │  gustaría    │        │  tu mapa"    │
│  tu mapa?"   │         │ (progreso    │        │  que te      │        │  (Momentum   │
│              │         │  real, no    │        │  llamemos?)  │        │   WOW)       │
│ [DateInput   │         │  spinner)    │        │              │        │              │
│  grande,     │         │              │        │ [Input       │        │  Animal      │
│  centro,     │         │  Micro-copy: │        │  nombre]     │        │  LifePath    │
│  foco]       │         │  "Cruzando   │        │              │        │  Birthday    │
│              │         │   sistemas   │        │ [Saltar]     │        │  Elemento    │
│ [DESCUBRIR]  │         │   ancestrales│        │              │        │  Ciclo actual│
│              │         │   + IA"      │        │ [CONTINUAR]  │        │              │
└──────────────┘         └──────────────┘        └──────────────┘        └──────────────┘
```

---

### Detalle por Paso

#### Paso 1: Entrada — "Solo tu fecha"

- **Pantalla centrada**, máximo 480px ancho
- **DateInput heroico**: `text-4xl sm:text-5xl`, `font-heading`, `tabular-nums`
- **Micro-copy debajo**: "Tu fecha nunca sale de tu navegador. Sin registro. Sin email."
- **CTA único**: `<Button size="lg" variant="primary">DESCUBRIR MI MAPA</Button>`
- **Enter key** = submit global (no solo focus en DateInput)
- **Validación visual**: borde accent en focus, rojo en error con mensaje inline

#### Paso 2: Anticipación — "Cruzando sistemas..."

- **LoadingState full-screen** con mensaje rotativo cada 2s:
  1. "Calculando tu Life Path..."
  2. "Consultando el zodiaco chino real (CNY verificado)..."
  3. "Sintetizando numerología + Wu Xing + ciclos..."
  4. "Generando tu interpretación personal..."
- **Progress bar** sutil (0→100% en ~3s real)
- **NO spinner genérico** — mensajes que educan sobre el rigor

#### Paso 3: Nombre (Opcional) — "¿Cómo te gustaría que te llamemos?"

- **Explicación clara**: "Tu nombre desbloquea: Expresión, Alma, Personalidad (numerología completa). Es opcional."
- **Input simple**, `font-sans text-lg`, placeholder "Tu nombre"
- **Dos botones**: `[SALTAR]` (ghost) · `[CONTINUAR]` (primary)
- **Skip sin culpa** — el mapa base ya está listo

#### Reveal: Momento WOW — "Acá está tu mapa"

- **Animación de entrada**: `numberReveal` para LifePath, `scaleUp` para Animal, `fadeUp` staggered para cada card
- **4 Cards heroicas** (no grid denso):
  1. **Animal Chino** — ilustración editorial, nombre grande, elemento, "Año del [Animal]"
  2. **Life Path** — número heroico, título "Tu camino", 1 frase esencial
  3. **Birthday Number** — número, "Tu don natural", 1 frase
  4. **Ciclo Actual** — "Año Personal X / Mes Y / Día Z", "Tu tema ahora: [tema]"
- **CTA de transición**: `<Button size="lg" asChild><Link href="/profile">EXPLORAR MI MAPA COMPLETO</Link></Button>`
- **Share sutil**: "Compartir mi mapa" (abre ShareableCard)

---

### Información: Qué Mostrar vs Qué Reservar

| Mostrar en Reveal (Gratis, Inmediato) | Reservar para Profile (Profundidad) |
|----------------------------------------|--------------------------------------|
| Animal + Elemento + Año | Expresión, Alma, Personalidad (requiere nombre) |
| Life Path + 1 frase esencial | Síntesis cross-system, patrones convergentes |
| Birthday Number + don | Affinidades, Ecosistema, Contraste, Círculo |
| Ciclo Actual (Año/Mes/Día) + tema | Timeline ±5 años, Próximo movimiento |
| **Score de energía del día** | Interpretación IA, Chat, DecisionMap (Premium) |

---

## 5. PROFILE 2.0 — ARQUITECTURA POR CAPÍTULOS

### Principio: "Progressive disclosure. Un capítulo a la vez. Navegación clara."

---

### Nueva Estructura: 4 Capítulos + Hub

```
┌────────────────────────────────────────────────────────────┐
│  PROFILE HUB (Pantalla inicial)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  HERO IDENTITY                                       │  │
│  │  [Avatar/Inicial]  Nombre / "Visitante"              │  │
│  │  Animal · LifePath · Elemento · Ciclo Actual         │  │
│  │  [Score Energía Hoy] → link a /daily-energy          │  │
│  │  [CTA Premium] "Desbloquear profundidad" (si free)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  NAVEGACIÓN POR CAPÍTULOS (Tabs horizontales, sticky)     │
│  ┌──────────┬────────────┬──────────────┬─────────────┐   │
│  │ QUIÉN SOY│ CÓMO FUNCIONO│ CÓMO ME RELACIONO│ HACIA DÓNDE VOY│  │
│  └──────────┴────────────┴──────────────┴─────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

### Capítulo 1: QUIÉN SOY — Identidad Esencial

**Pregunta que responde:** "¿Qué me define en mi núcleo?"

| Sección | Contenido | Estado | Prioridad |
|---------|-----------|--------|-----------|
| **Código Natal** | LifePath, Expression, Soul, Personality, Birthday | Expandible | Siempre visible |
| **Zodíaco Chino** | Animal, Elemento, Yin/Yang, Animal interno (mes), Secreto (hora) | Expandible | Siempre visible |
| **Síntesis Cross-System** | Cómo dialogan numerología + zodiaco + Wu Xing | Collapsed | Click para ver |
| **Patrones Personales** | Convergencias detectadas (convergentEngine) | Collapsed | Click para ver |
| **Dimensiones** | 5 dimensiones (mental, emocional, físico, social, espiritual) | Collapsed | Click para ver |

**UI:** Accordion sections. Una abierta a la vez. `Card` component. Hover = border-accent.

---

### Capítulo 2: CÓMO FUNCIONO — Motor Interno

**Pregunta que responde:** "¿Cómo proceso el mundo? ¿Cuándo estoy en flow?"

| Sección | Contenido | Estado |
|---------|-----------|--------|
| **Indicadores Simbólicos** | PersonalScoreCard (barras animadas: propósito, relación, creatividad, estructura, intuición) | Visible |
| **Tu Momento Actual** | TimingEngine: 6 intenciones + mejores fechas + energía día | Visible |
| **Ciclos de Vida** | YearCycleEngine: Año Personal, Mes, Día, resonancia | Expandible |
| **Timeline Personal** | ±5 años con hitos de convergencia | Expandible |

---

### Capítulo 3: CÓMO ME RELACIONO — Ecosistema

**Pregunta que responde:** "¿Con quién/qué resueno? ¿Dónde están mis tensiones?"

| Sección | Contenido | Estado |
|---------|-----------|--------|
| **Mi Afinidad Personal** | Tu tipo de entidad resonante (marca, país, ciudad, persona) | Visible |
| **Mi Ecosistema** | Ranking entidades por categoría (top 5 cada una) | Expandible |
| **Mi Círculo** | Aliados (entidades/arquetipos que potencian) | Collapsed |
| **Mi Contraste** | Qué/quién te desafía a crecer | Collapsed |
| **Explora Afinidades** | Link a /affinity hub completo | CTA card |

---

### Capítulo 4: HACIA DÓNDE VOY — Agencia

**Pregunta que responde:** "¿Qué decido ahora? ¿Qué viene?"

| Sección | Contenido | Estado | Acceso |
|---------|-----------|--------|--------|
| **Tu Próximo Movimiento** | DecisionsEngine: 3 decisiones activas + timing | Visible | Free |
| **Interpretación IA** | MolinoInterpretation: síntesis narrativa del momento | Visible | Free (1/semana) |
| **ChatWithMolino** | Conversación contextual con tu mapa | Locked | **Premium** |
| **DecisionMap** | Mapa visual de opciones + convergencias + timing | Locked | **Premium** |
| **Historial & Reportes** | Energía 30 días, ciclos anuales, export PDF | Locked | **Premium** |

---

### Navegación Interna

- **Tabs sticky** en scroll (capítulos)
- **Breadcrumbs**: Inicio > Mi Mapa > [Capítulo] > [Sección]
- **Quick jump**: Floating button móvil "Capítulos" → sheet con 4 opciones
- **Progress indicator**: Línea sutil bajo tabs mostrando % explorado por capítulo

---

### Qué Esconder (Progressive Disclosure)

| Actualmente Visible (25 secciones) | En 2.0 |
|------------------------------------|--------|
| Todo a la vez, scroll infinito | Solo Hub + 1 capítulo activo |
| IdentityCard + LifePathExplorer + ZodiacExplorer (3 componentes) | Unificados en "Código Natal" + "Zodíaco Chino" |
| PersonalScoreCard (barras) | En "Indicadores Simbólicos" (Cap 2) |
| Convergencia, Patrones, Dimensiones, Sistemas (4 secciones) | Colapsadas en "Síntesis" + "Patrones" (Cap 1) |
| Afinidad Personal, Ecosistema, Círculo, Contraste (4) | Unificadas en Cap 3 |
| Recomendaciones, Mapa Mundo, Próximo Movimiento (3) | Distribuidas en Cap 2, 3, 4 |
| Compartir, Interpretación (2) | Interpretación en Cap 4, Compartir en Hub header |

---

## 6. PREMIUM STRATEGY — MOLINO PREMIUM

### Principio: "Free te da identidad. Premium te da agencia."

---

### Modelo FREE vs PREMIUM

| Capacidad | FREE | PREMIUM |
|-----------|------|---------|
| **Onboarding + Reveal** | ✅ Completo | ✅ Completo |
| **Profile Hub + 4 Capítulos** | ✅ Navegable | ✅ Navegable |
| **Identidad (Cap 1)** | ✅ Completo | ✅ Completo |
| **Motor Interno (Cap 2)** | ✅ Completo | ✅ Completo |
| **Ecosistema (Cap 3)** | ✅ Top 5/categoría | ✅ Completo + comparar + historial |
| **Agencia (Cap 4)** | ✅ Próximo Movimiento | ✅ Completo |
| **Interpretación IA** | 1/semana | Ilimitada + contextual |
| **ChatWithMolino** | ❌ | ✅ Conversaciones ilimitadas |
| **DecisionMap** | ❌ | ✅ Mapa visual interactivo |
| **Energía Diaria** | ✅ Hoy only | ✅ Historial 365 días + navegación |
| **Reportes & Export** | ❌ | ✅ PDF mensual, anual, decisiones |
| **Notificaciones** | ❌ | ✅ Push/email: energía alta, convergencias, mejores fechas |
| **API Personal** | ❌ | ✅ Webhook / JSON para integraciones |

---

### MVP Premium: Qué Incluir en V1

**Core Premium Bundle (3 features que justifican pago):**

1. **ChatWithMolino** — "Tu Molino te conoce. Preguntale cualquier cosa."
   - Contexto: todo tu perfil + energía del día + ciclos
   - Casos: "¿Cuándo renegociar mi contrato?", "¿Cómo hablar con mi socio?", "¿Es buen momento para mudarme?"

2. **DecisionMap** — "Ve tus opciones. Entendé el timing. Decidí."
   - Visual: mapa de decisiones activas + convergencias + mejores fechas
   - Input: usuario define decisión → Molino mapea factores + timing + recomendación

3. **Historial Energía + Reportes** — "Tu ritmo, documentado."
   - 365 días de energía + interpretación
   - Reporte mensual automático: "Tu mes en 3 insights"
   - Export PDF para journaling / terapia / coaching

**Por QUÉ estas 3:**
- Chat = engagement diario + valor percibido alto ("IA que me conoce")
- DecisionMap = diferenciador único (nadie tiene timing + convergencia + visual)
- Historial = hábito + retention + "no quiero perder mis datos"

---

### Momento de Upgrade (Paywall Contextual)

**NO paywall duro. Paywall de "querer más".**

| Trigger | Contexto | Copy | CTA |
|---------|----------|------|-----|
| Click en ChatWithMolino (locked) | Cap 4, decisión activa | "Tu Molino puede ayudarte a pensar esto. Desbloqueá conversación ilimitada." | "Probar Chat" → Trial 7 días |
| Click en DecisionMap (locked) | Cap 4, múltiples opciones | "Mapeá esta decisión con timing real. Ve convergencias y mejores fechas." | "Ver mi DecisionMap" → Trial 7 días |
| Scroll energía diaria (historial) | /daily-energy, querer ayer | "Tu ritmo de 30 días. Patrones que no ves en un día." | "Ver historial" → Trial 7 días |
| Interpretación IA (límite semanal) | Cap 4, 2da vez en semana | "Necesitás más claridad esta semana. Interpretaciones ilimitadas en Premium." | "Desbloquear IA" → Trial 7 días |
| ShareableCard (export premium) | Profile Hub, querer PDF bonito | "Llevate tu mapa en diseño editorial. Reportes mensuales automáticos." | "Obtener reporte" → Trial 7 días |

---

### Trial Strategy

- **7 días gratis** — sin tarjeta (localStorage timestamp)
- **Onboarding trial**: "Activá 7 días Premium. Sin tarjeta. Cancela cuando quieras."
- **Durante trial**: Badge "PREMIUM · 7 días restantes" en header
- **Conversión**: Día 5 → email/push "Quedan 2 días. Tu DecisionMap te espera."
- **Post-trial**: Features se lockean graciosamente. Datos conservados. Reactivación one-click.

---

### Pricing (Sugerido ARS/USD)

| Plan | Mensual | Anual (2 meses gratis) |
|------|---------|------------------------|
| **Premium** | $4.99 USD / $4.900 ARS | $49.99 USD / $49.000 ARS |
| **Lifetime** | — | $199 USD / $180.000 ARS (early adopters) |

**Justificación:** Precio de "café por mes" para herramienta de decisiones de vida. Anual = compromiso. Lifetime = early believers.

---

## 7. RETENTION STRATEGY — POR QUÉ VOLVER MAÑANA

### Principio: "Daily Energy = café matutino. Profile = terapia trimestral. Chat/DecisionMap = cuando decidís."

---

### Hábitos por Frecuencia

| Frecuencia | Feature | Hook | Reward |
|------------|---------|------|--------|
| **Diario** | Energía Diaria | Notificación 7am: "Tu energía hoy: 78/100. Tema: Claridad." | Score + 1 acción concreta + mejor hora para decidir |
| **Semanal** | Interpretación IA | Domingo noche: "Tu semana: convergencia en jueves. Preguntale a tu Molino." | Narrativa sintética + 3 decisiones recomendadas |
| **Mensual** | Reporte Automático | 1ro de mes: "Tu reporte de abril está listo. 3 insights + 2 decisiones." | PDF bonito + progreso vs mes anterior |
| **Cíclico** | Timing/Convergencias | "Se acerca tu convergencia de mayo. 3 fechas clave." | Preparación + DecisionMap listo |
| **Event-driven** | ChatWithMolino | Usuario tiene decisión → "Querés pensarlo con tu Molino?" | Conversación contextual + acción concreta |

---

### Daily Energy 2.0 — Rediseño

**Actual:** Score + descripción + áreas + interpretación (solo hoy)
**2.0:**

```
┌─────────────────────────────────────┐
│  HEADER: Fecha · Score grande       │
│  [← Ayer]  23 AGO 2025  [Mañana →]  │
├─────────────────────────────────────┤
│  TEMA DEL DÍA (1 frase poderosa)    │
│  "Claridad para cortar ruido"       │
├─────────────────────────────────────┤
│  ACCIÓN RECOMENDADA (1 sola)        │
│  🎯 "Hoy: Decidí lo que pospusiste. │
│      Mejor ventana: 10-12hs."       │
├─────────────────────────────────────┤
│  FORTALEZAS (2)  |  PRECAUCIONES (2)│
│  ✓ Pensamiento claro  ✗ Impulsividad│
│  ✓ Comunicación       ✗ Rigidez     │
├─────────────────────────────────────┤
│  ÁREAS (4 scores mini)              │
│  Mental 82  Emocional 65  Físico 71 │
│  Social 58  Creativo 79             │
├─────────────────────────────────────┤
│  [Interpretación IA]  [Chat]  [Share]│
└─────────────────────────────────────┘
```

**Navegación temporal:** Swipe ←/→ o botones prev/next. Historial completo en Premium.

---

### Sistema de Notificaciones (Opt-in, Respetuoso)

| Canal | Frecuencia | Trigger | Copy Example |
|-------|------------|---------|--------------|
| **Push (app)** | Diario 7am | Energy score > 75 | "Energía 82 hoy. Día para decisiones importantes. Mejor hora: 10hs." |
| **Push** | Semanal | Convergencia próxima | "Tu convergencia de mayo empieza en 3 días. ¿Querés prepararla?" |
| **Email** | Mensual | Reporte listo | "Tu mes: 3 insights, 2 decisiones, 1 patrón nuevo." |
| **In-app** | Contextual | En Profile/DecisionMap | "Tu Molino detectó timing óptimo para [decisión]. Abrir DecisionMap." |

**Reglas:** Máx 1 push/día. Usuario configura horario. Unsubscribe one-tap. Sin spam.

---

## 8. DESIGN DIRECTION — MOLINO 2.0 VISUAL

### Principios Inmutables (Heredados + Refinados)

```
1. EDITORIAL FIRST       → Tipografía que lidera, no UI que decora
2. ESPACIO NEGATIVO      → Aire = premium. Densidad = gratuito
3. JERARQUÍA ABSOLUTA    → Un foco por pantalla. Cero competencia visual
4. MOVIMIENTO CON PROPÓSITO → Animaciones que explican, no decoran
5. SIN ESOTERISMO VISUAL → Nada de: cristales, chakras, mandalas, púrpuras místicos
6. RESPETO INTELECTUAL   → Usuario inteligente. Copy adulto. Sin gamificación barata
7. CONSISTENCIA SISTÉMICA → Design System = ley. No excepciones sin razón
```

---

### Paleta Refinada (Basada en Design System actual)

| Rol | Light | Dark | Uso |
|-----|-------|------|-----|
| **Background** | `#FAFAF8` | `#0A0A0F` | Base |
| **Surface** | `#F5F5F0` | `#121214` | Cards, inputs |
| **Surface Elevated** | `#FFFFFF` | `#1A1A1E` | Modales, dropdowns |
| **Border** | `#D4D4D4` | `#2A2A2E` | Divisores, cards |
| **Border Strong** | `#0F0F10` | `#FFFFFF` | Focus, active states |
| **Text Primary** | `#0F0F10` | `#FFFFFF` | Títulos, cuerpo |
| **Text Secondary** | `#6B6B6B` | `#8A8A8A` | Metadata, descripciones |
| **Text Muted** | `#6B6B6B` / 40% | `#8A8A8A` / 40% | Placeholders, labels |
| **Accent** | `#1E3AFF` | `#1E3AFF` | CTA primary, links, active |
| **Accent Soft** | `#1E3AFF` / 10% | `#1E3AFF` / 15% | Hover, backgrounds sutiles |
| **Success** | `#059669` | `#34D399` | Scores altos, confirmaciones |
| **Warning** | `#D97706` | `#FBBF24` | Scores medios, atención |
| **Error** | `#DC2626` | `#F87171` | Errors, scores bajos |

**Score Colors (semánticos, fijos cross-theme):**
- Excellent (75+): `#22C55E` (green)
- Good (55-74): `#3B82F6` (blue)
- Neutral (40-54): `#EAB308` (amber)
- Poor (<40): `#EF4444` (red)

---

### Tipografía — Escala Cerrada (Refinada)

| Nivel | Size/Line/Weight | Font | Tracking | Uso |
|-------|------------------|------|----------|-----|
| **Display** | 72px / 0.85 / 400 | Archivo Black | -0.02em | Hero H1, números heroicos |
| **H1** | 48px / 0.9 / 400 | Archivo Black | -0.02em | Page titles |
| **H2** | 36px / 1.0 / 400 | Archivo Black | -0.02em | Section titles |
| **H3** | 28px / 1.1 / 600 | Space Grotesk | 0 | Chapter titles, card headers |
| **H4** | 22px / 1.2 / 600 | Space Grotesk | 0 | Sub-sections, score numbers |
| **Body Large** | 18px / 1.6 / 400 | Inter | 0 | Lead paragraphs, insights |
| **Body** | 16px / 1.6 / 400 | Inter | 0 | Default copy |
| **Caption** | 14px / 1.5 / 400 | Inter | 0 | Metadata, timestamps |
| **Overline** | 11px / 1.0 / 600 | JetBrains Mono | 0.3em | Eyebrows, breadcrumbs, labels |

**Reglas duras:**
- `font-display` SOLO Display/H1/H2. Siempre UPPERCASE.
- `font-heading` SOLO H3/H4/scores/badges. Uppercase o sentence case.
- `font-sans` SOLO Body Large/Body/Caption. Sentence case.
- `font-mono` SOLO Overline. UPPERCASE. Tracking ancho.
- NUNCA mezclar fonts en mismo nivel jerárquico.

---

### Espaciado — Sistema Unificado

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-xs` | 8px | Gap interno badges, chips |
| `--space-sm` | 12px | Gap botones, icon+text |
| `--space-md` | 16px | Container mobile, card padding sm |
| `--space-lg` | 24px | Container tablet, card padding md, section gap |
| `--space-xl` | 32px | Container desktop, card padding lg, cellPad |
| `--space-2xl` | 48px | Section spacing, hero padding |
| `--space-3xl` | 64px | Major section separation |
| `--space-4xl` | 96px | Page-level hero, major breaks |

**Contenedor único:** `max-w-8xl px-4 sm:px-8 lg:px-12` (16/32/48px)
**Excepciones:** Onboarding `max-w-xl`, Artículos `max-w-2xl`, Profile Hub `max-w-6xl`

---

### Componentes Clave — Comportamiento 2.0

#### Button (Unificado)
- **Una sola implementación**: `<Button>` component
- **Variantes**: `primary` | `secondary` | `ghost` | `danger`
- **Tamaños**: `sm` (40px) | `md` (44px) | `lg` (52px)
- **Estados**: default | hover | active (scale-95) | focus-visible | disabled | loading
- **Radio**: `rounded-full` (único elemento redondo del sistema)
- **Font**: `font-mono 12px/14px/16px uppercase tracking-wide`

#### Card
- **Radio**: `rounded-none`
- **Border**: `1px solid var(--color-border)`
- **Hover**: `border-accent translate-y-[-2px]` (NO shadow)
- **Padding**: `p-6` (md) default, `p-8` (lg) para hero cards
- **Background**: `var(--color-card)` / `var(--color-surface)`

#### Input
- **Radio**: `rounded-none`
- **Focus**: `border-accent` + `ring-2 ring-accent/20`
- **Error**: `border-error` + `ring-2 ring-error/20`
- **Font**: `font-sans 16px` (body), `font-heading 28px` (DateInput hero)

#### EmptyState / Loading / Error
- **Componentes únicos** (`<EmptyState>`, `<LoadingState>`, `<ErrorMessage>`)
- **Consistentes** en todo el sitio
- **Skeleton** para contenido con estructura conocida (Profile, Daily Energy)

---

### Motion Tokens (Refinados)

| Token | Duración | Easing | Uso |
|-------|----------|--------|-----|
| `fadeUp` | 0.4s | ease-out | Secciones on scroll (once) |
| `staggerItem` | 0.08s delay | ease-out | Lists, grids, accordion items |
| `numberReveal` | 0.6s | spring(0.8, 0.1) | Números heroicos (LifePath, scores) |
| `scaleUp` | 0.3s | ease-out | Badges, cards on enter |
| `hoverLift` | 0.2s | ease-out | Cards clickables (y: -4px) |
| `pageEnter` | 0.3s | ease-out | Route transitions |
| `slideUp` | 0.4s | ease-out | Modals, sheets, drawers |

**Reglas:** `viewport: { once: true }` siempre. `prefers-reduced-motion` respetado. Nada > 0.6s.

---

## 9. PRIORIDAD P0 / P1 / P2

### P0 — Bloqueadores de Valor (Hacer FIRST, en orden)

| # | Iniciativa | Por Qué | Esfuerzo | Dependencias |
|---|------------|---------|----------|--------------|
| **1** | **Home 2.0 Hero + Value Prop** | Primera impresión define todo. Actual no vende. | M | Design System listo |
| **2** | **Onboarding 2.0 (3 pasos + Reveal)** | Conversión onboarding = usuarios. Actual tiene errores UX. | M | DateInput existe, engines listos |
| **3** | **Profile Hub + 4 Capítulos (IA)** | 25 secciones → inusable. Arquitectura nueva = usabilidad. | L | Engines listos, componentes base |
| **4** | **Premium MVP: Chat + DecisionMap + Historial** | Sin premium = sin negocio. 3 features justifican pago. | XL | ChatWithMolino, DecisionMap existen? |
| **5** | **Daily Energy 2.0 (Historial + Navegación + Acción única)** | Retención diaria. Hook principal de vuelta. | M | dailyEnergyEngine listo |

---

### P1 — Diferenciadores de Calidad (Hacer SECOND)

| # | Iniciativa | Por Qué | Esfuerzo |
|---|------------|---------|----------|
| **6** | **Interpretación IA hardening + límite free/premium** | Feature flagship. Actual falla silenciosamente. | M |
| **7** | **Sistema notificaciones (Push/Email opt-in)** | Retención D7/D30. Automatiza engagement. | M |
| **8** | **ShareableCards 2.0 (Diseño editorial, OG dinámico)** | Viralidad orgánica. "Mira mi mapa". | S |
| **9** | **Affinity Hub 2.0 (Preview sin perfil + comparar)** | Top of funnel. Demuestra valor antes de onboarding. | M |
| **10** | **SearchInput unificado + Explore 2.0** | Descubrimiento. Actual usa `<button>` para nav. | S |

---

### P2 — Pulido Premium (Hacer THIRD)

| # | Iniciativa | Por Qué | Esfuerzo |
|---|------------|---------|----------|
| **11** | **Animaciones de entrada Reveal (numberReveal, stagger)** | Momento WOW. Diferencia "premium" vs "funcional". | S |
| **12** | **Progress indicators Profile (capítulos % explorado)** | Gamificación sutil. Completion drive. | S |
| **13** | **Reportes PDF mensuales (Premium)** | Valor tangible. "Me llevo algo". | M |
| **14** | **Keyboard shortcuts (Power users)** | Accesibilidad + eficiencia. | S |
| **15** | **i18n ready (Estructura para EN/PT)** | Expansión futura. | S |

---

## 10. QUÉ CAMBIAR PRIMERO (Secuencia de Ejecución)

### Sprint 1-2: Foundation (Semanas 1-4)
```
□ 1.1 Home 2.0 Hero + Value Prop + Demo inline
□ 1.2 Onboarding 2.0 Paso 1-2 (Entrada + Anticipación)
□ 1.3 Design System: Unificar Button (loading prop), Card (hover), Input
□ 1.4 Eliminar btn-* globals, migrar todo a <Button>
□ 1.5 Skeleton loading para Profile + Daily Energy
```

### Sprint 3-4: Core Experience (Semanas 5-8)
```
□ 2.1 Onboarding 2.0 Paso 3 + Reveal (Momento WOW)
□ 2.2 Profile Hub + 4 Capítulos (Arquitectura + Navegación)
□ 2.3 Daily Energy 2.0 (Historial + Navegación + Acción única)
□ 2.4 Interpretación IA hardening (Error boundary, loading, empty)
```

### Sprint 5-6: Premium MVP (Semanas 9-12)
```
□ 3.1 ChatWithMolino: Verificar existencia → Completar → Integrar en Cap 4
□ 3.2 DecisionMap: Verificar existencia → Completar → Integrar en Cap 4
□ 3.3 Premium Gate: Trial 7 días (localStorage) + Paywall contextual
□ 3.4 Historial Energía 365 días + Reporte mensual (Premium)
□ 3.5 Notificaciones: Push diario 7am + Email mensual (opt-in)
```

### Sprint 7-8: Growth & Polish (Semanas 13-16)
```
□ 4.1 Affinity Hub 2.0 (Preview + Compare)
□ 4.2 ShareableCards 2.0 + OG images
□ 4.3 Explore 2.0 + SearchInput unificado
□ 4.4 Animaciones Reveal + Progress Profile
□ 4.5 QA completo: Devices, A11y, Performance, Dark mode
```

---

## 11. QUÉ NO TOCAR TODAVÍA (Backlog Consciente)

| Área | Qué | Por Qué Esperar |
|------|-----|-----------------|
| **Personal Energy Compass** | Motor nuevo animal↔animal para entidades | Requiere diseño arquitectura separado (ver CONTEXT §5). No es core MVP. |
| **Academy 2.0** | Cursos, learning paths, certificaciones | Educación = retention long-term. Post-PMF. |
| **Social/Community** | Perfiles públicos, seguir, comentarios | Riesgo privacidad. Molino = personal, no social. Evaluar después. |
| **API Pública** | Webhooks, JSON export, integraciones | Premium feature avanzada. V2. |
| **Mobile App (React Native)** | Wrapper nativo + push nativo | PWA funciona. App nativa = costo alto. Validar demanda primero. |
| **Multi-idioma** | EN / PT / ES completos | Estructura i18n en P2. Contenido = esfuerzo enorme. |
| **Team/Enterprise** | Workspaces, admin, SSO | B2B = otro producto. Focus B2C premium primero. |
| **Advanced Engines** | Tránsitos planetarios, progresiones, sinastría completa | Actual 18 engines cubren 90% valor. Diminishing returns. |
| **Gamificación** | Streaks, badges, logros | Violenta principio "respeto intelectual". No encaja premium. |
| **AI Generative Content** | Horóscopos diarios auto-generados, contenido blog | Calidad editorial > cantidad. Molino = síntesis, no contenido. |

---

## 12. MÉTRICAS DE ÉXITO (North Stars)

### Métricas Primarias (Business)

| Métrica | Target 6 meses | Target 12 meses |
|---------|----------------|-----------------|
| **Onboarding Completion** | > 85% | > 90% |
| **D1 Retention** | > 40% | > 50% |
| **D7 Retention** | > 20% | > 30% |
| **D30 Retention** | > 12% | > 18% |
| **Trial Activation** | > 15% de perfiles | > 25% |
| **Trial → Paid Conversion** | > 8% | > 12% |
| **MRR** | $5K | $25K |

### Métricas Secundarias (Product)

| Métrica | Target |
|---------|--------|
| **Profile: 3+ capítulos visitados** | > 60% |
| **Daily Energy: acción única completada** | > 40% |
| **ChatWithMolino: mensajes/usuario/semana (Premium)** | > 10 |
| **DecisionMap: decisiones mapeadas/usuario/mes** | > 3 |
| **ShareableCard: shares/usuario** | > 0.5 |
| **NPS (Premium users)** | > 50 |

### Métricas de Salud (Technical)

| Métrica | Target |
|---------|--------|
| **Lighthouse Performance** | > 90 |
| **Lighthouse Accessibility** | > 95 |
| **Build Time** | < 2 min |
| **TypeScript Errors** | 0 |
| **Bundle Size (Home)** | < 150KB gzipped |

---

## 13. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **ChatWithMolino / DecisionMap no existen o están rotos** | Alta | Crítico | Sprint 0: Auditoría técnica real de ambos. Si no existen → scope down Premium MVP a Historial + IA ilimitada + Reportes. |
| **Premium conversion < 5%** | Media | Alto | Trial sin fricción (sin tarjeta). Paywalls contextuales, no duros. Value demo en onboarding. |
| **Daily Energy se siente repetitivo** | Media | Medio | Rotar copy templates. Acción única concreta. Interpretación IA semanal gratuita. |
| **Profile 4 capítulos sigue siendo denso** | Baja | Medio | User testing con 5 usuarios reales tras Sprint 2. Iterar IA. |
| **Performance degrada con 526 páginas** | Baja | Medio | Code splitting por ruta. Lazy load engines. ISR para páginas estáticas. |
| **Apple/Google rechazan PWA por "esotérico"** | Baja | Medio | Copy: "Autoconocimiento", "Toma de decisiones", "Psicología". Nada de "predicción", "destino", "magia". |

---

## 14. PRINCIPIOS DE DECISIÓN (Para el Equipo)

> **Cuando dudes, usa estos filtros:**

1. **¿Respeta la inteligencia del usuario?** → Si no, cortar.
2. **¿Genera claridad o ruido?** → Ruido = fuera.
3. **¿Es gratis o premium?** → Si premium, ¿justifica el pago HOY?
4. **¿Se siente editorial o como SaaS genérico?** → Editorial siempre.
5. **¿Puede explicarse en 1 frase a un amigo?** → Si no, simplificar.
6. **¿Funciona sin JS?** → Core content sí. Interacción no.
7. **¿Privacidad por defecto?** → Sí. Cualquier tracking = opt-in explícito.
8. **¿Consistencia con Design System?** → Si excepción, documentar por qué.

---

## 15. PRÓXIMO PASO INMEDIATO

**No codear. Alinear.**

1. **Validar existencia real** de `ChatWithMolino` y `DecisionMap` (codebase audit)
2. **Definir scope Premium MVP** basado en hallazgo real (¿3 features? ¿2? ¿1+historial?)
3. **Prototipar Home 2.0 + Onboarding 2.0 en Figma** (no código) → Test con 5 usuarios
4. **Confirmar secuencia Sprint 1-2** con equipo
5. **Establecer rituals**: Weekly design review, Bi-weekly user testing, Monthly metrics review

---

> **Molino 2.0 no es un redesign. Es un repositioning.**
> 
> De "te doy datos" → "te ayudo a decidir".
> 
> De "visita única" → "compañero diario".
> 
> De "gratis para siempre" → "valor que vale la pena pagar".

---

*Documento vivo. Actualizar tras cada sprint con learnings reales.*
*Versión 1.0 — Agosto 2026*