# SPRINT_0_PREMIUM_AUDIT.md
**Molino — Auditoría Premium (Estado actual, Gaps UX/Producto, Riesgos de conversión, Prioridades)**
*Generado: 2026-08-04 | Sin modificar código*

---

## 1. ARQUITECTURA GENERAL DEL FLUJO PREMIUM

### 1.1 Flujo completo (User Journey)
```
Onboarding (date-only) 
  → Preview dimensiones (calculado client-side)
  → LocationStep (opcional)
  → Profile Hub (gate de entrada a 4 tabs)
    → Identity (gratis)
    → World / Circle (gratis)
    → Intelligence (gratis parcialmente)
      → Chapter 01-06: Patrones, tensiones, reglas, momento, decision map (gratis)
      → Chapter 07: PremiumGate (paywall) → MolinoInterpretation (síntesis IA)
      → Chapter 08: ChatWithMolino (gate vía usePremiumAccess)
```

### 1.2 Puntos de decisión de pago
| Punto | Componente | Qué protege | Precio | Métodos |
|-------|------------|-------------|--------|---------|
| **P1** | `PremiumGate` (IntelligenceScreen §07) | `MolinoInterpretation` type=`personal_profile` | $8 USD | Mercado Pago (ARS/USD) + PayPal (USD) |
| **P2** | `usePremiumAccess` hook (IntelligenceScreen §08) | `ChatWithMolino` | Mismo acceso | Comparte estado KV |

**Nota:** No hay paywall en Identity, World, Circle, ni en capítulos 01-06 de Intelligence.

---

## 2. ESTADO ACTUAL POR COMPONENTE

### 2.1 PremiumGate (`components/profile/PremiumGate.tsx`)
**Fortalezas:**
- Estados bien definidos: `locked` | `paying` | `verifying` | `unlocked` | `pay_error` | `verifying_redirect`
- Polling server-side tras redirect (24 intentos × 5s = 2 min max)
- Recuperación de compra por ID (MP + PayPal)
- Soporte cupones
- Revelación progresiva (`justUnlocked` flag) → evita doble loading
- Feature flag `NEXT_PUBLIC_PREMIUM_ENABLED` y `NEXT_PUBLIC_PAYPAL_ENABLED`
- Limpieza de URL params post-pago
- Analytics: `trackPaywallViewed`, `trackCheckoutStarted`, `trackPaymentApproved`, `trackPremiumUnlocked`

**Debilidades / Riesgos:**
- **Price hardcoded** (`PRICE_USD = 8`) — no viene de config/env
- **Polling agresivo** (5s) sin backoff exponencial → carga en KV/API
- **No hay idempotency key** en creación de preferencia MP (duplicados si user click 2x)
- **Coupling fuerte**: `PremiumGate` conoce `name`, `birthDate`, `preview` (lifePath, chineseZodiac, pattern) — acopla paywall a datos de perfil
- **Preview pattern hardcoded**: busca `"Tu motor"` en `patterns.find(p => p.label === "Tu motor")` — frágil si cambia label
- **UX recovery**: formulario de recovery muestra "Mercado Pago ID" y "PayPal Order ID" — usuario no sabe dónde encontrarlos
- **No hay trial / freemium preview real** del contenido premium (solo promesa textual)

### 2.2 MolinoInterpretation (`components/ui/MolinoInterpretation.tsx`)
**Fortalezas:**
- Fallback local inmediato → nunca pantalla vacía
- AI opcional (regenerable) + badge transparencia "Local" vs "IA"
- Reveal progresivo con stagger (respeta `prefers-reduced-motion`)
- `justUnlocked` flag coordina con `BuildingMolino` + `MolinoReveal`
- Loading skeleton editorial (no spinner genérico)

**Debilidades:**
- **403 = premiumRequired** pero UI solo muestra "Esta lectura forma parte de la síntesis paga" — sin CTA a paywall (el gate ya pasó)
- **Error handling**: si AI falla pero hay fallback, muestra "Interpretación local · AI no disponible" en footer — poco visible
- **Regenerate button** solo aparece tras `hasAttemptedAI` — confuso si falló de entrada

### 2.3 IntelligenceScreen (`components/profile/screens/IntelligenceScreen.tsx`)
**Fortalezas:**
- 8 capítulos bien ordenados (01-06 gratis, 07 paywall, 08 chat gated)
- Fallbacks locales para patterns/tensions/rules/momentState → resiliente
- `useCachedFetch` + `SYNTHESIS_CACHE` evita refetch
- `timing` intention persistida en localStorage (session/timingIntention)
- Chapter reveal con `smoothReveal` + `prefersReducedMotion`

**Debilidades:**
- **Preview para PremiumGate** acoplado a label `"Tu motor"` (línea 374)
- **ChatWithMolino** gateado por `usePremiumAccess` (hook separado) — dos fuentes de verdad para "¿es premium?"
- **No hay indicador visual** en hub/tab bar de qué requiere premium (Intelligence muestra "Premium" en copy pero no badge)

### 2.4 ProfileHub (`components/profile/ProfileHub.tsx`)
**Fortalezas:**
- Hero con ZodiacMark + elemento + gradiente
- 4 secciones = 4 tabs (orden coherente con ProfileClient GUIDED_CTA)
- "Próximo descubrimiento" solo tras onboarding completado
- Métricas consistentes con WorldScreen (`score >= 60`)

**Debilidades:**
- **Intelligence card** dice "Tu síntesis completa: qué significa todo esto cuando se conecta. Premium." — pero no hay **badge visual** ni estado disabled en tab bar
- Usuario puede clickear tab "Inteligencia" → ve capítulos 01-06 gratis → choca con paywall en 07 sin aviso previo

### 2.5 Onboarding (`app/onboarding/page.tsx` + `LocationStep` + `DimensionsPreview`)
**Fortalezas:**
- Date-first, sin registro, sin cookies
- Preview inmediato (`DimensionsPreview`) con radar + dimensiones expandibles
- LocationStep opcional con quick-picks + search (no IP detection)
- `markOnboardingCompleted` → activa guided CTA en hub

**Debilidades:**
- **No captura nombre** → profile sin nombre → `dimensions` colapsa (dateDimensions fallback)
- **No hay upsell premium** en onboarding (oportunidad perdida: mostrar "esto es gratis, lo premium es X")

### 2.6 Pagos: Mercado Pago (`lib/mercadopago.ts` + `app/api/mp/*`)
**Fortalezas:**
- `isTestCredentials()` resuelve sandbox vs prod por prefix token (no por campo response)
- `hashProfile` HMAC-SHA256 con webhook secret → profileHash determinista
- Validación estricta: status, amount, currency, product_id, metadata
- Webhook signature verification (timingSafeEqual)
- Idempotencia en capture: `markPaymentProcessed` (nx + 24h TTL)

**Debilidades:**
- **Preference creation no idempotente** (no `external_reference` único por sesión)
- **ARS hardcoded** a 11880 (≈ $8 USD a 1485 ARS/USD) — sin FX dinámico
- **Webhook** no visto en auditoría (archivo existe pero no leído) — verificar idempotencia real
- **No hay reembolsos / disputas** handling

### 2.7 Pagos: PayPal (`lib/paypal.ts` + `app/api/paypal/*`)
**Fortalezas:**
- Access token cache con TTL
- `validateOrder` estricto (status, reference_id, custom_id=profileHash, amount)
- Capture idempotente (maneja `ORDER_ALREADY_CAPTURED`)
- `custom_id` = profileHash → vincula order a perfil

**Debilidades:**
- **Environment flag** `PAYPAL_ENVIRONMENT` (sandbox/live) — fácil misconfig
- **Brand name** hardcoded fallback
- **No webhook** (usa redirect return_url + client-side capture) — vulnerable a user cerrando pestaña
- **Feature flag** `NEXT_PUBLIC_PAYPAL_ENABLED` gatea botón pero no API routes

### 2.8 KV / Premium Access (`lib/kv.ts`)
**Fortalezas:**
- Dev fallback a `.molino-dev-kv.json` (gitignored) — mismo codepath prod/dev
- `grantPremiumAccess` escribe dual: `premium:{hash}` + `payment_access:{paymentId}`
- `markPaymentProcessed` nx + 24h TTL previene double-grant
- `incrementDailyCost` para tracking AI spend (best-effort)

**Debilidades:**
- **No TTL en `premium:{hash}`** → acceso "permanente" pero sin expiración real (OK por diseño)
- **Race condition** en `incrementDailyCost` (read-modify-write sin atomic incr)
- **Dev KV** usa file lock serializado — no escala pero OK para dev

---

## 3. GAPS UX / PRODUCTO CRÍTICOS

### 3.1 Discovery → Paywall Clarity (ALTO)
| Gap | Impacto | Evidencia |
|-----|---------|-----------|
| **Tab "Inteligencia" no indica premium** | Usuario entra gratis, lee 6 capítulos, choca en 07 sin warning | `ProfileHub` línea 186-190: solo copy "Premium." — sin badge, sin disabled state |
| **Guided CTA** no menciona paywall | `GUIDED_CTA.intelligence` = "Ya conocés tu mapa. Volvé cuando quieras →" — zero mention de pago | `ProfileClient.tsx` línea 62 |
| **Preview en PremiumGate** solo muestra promesa textual | "Cómo convergen tus sistemas / Qué tensiones aparecen / Qué significa tu momento actual / Una recomendación personalizada" — sin sample real | `PremiumGate.tsx` líneas 410-416 |

### 3.2 Value Communication (ALTO)
- **No hay "try before you buy" real**: usuario no ve *nada* de la síntesis IA antes de pagar
- **Price anchoring débil**: $8 USD aparece solo en paywall, sin contexto de valor (vs consulta, vs suscripción, vs libro)
- **No social proof** en paywall (testimonios, "X personas desbloquearon esta semana")

### 3.3 Payment UX (MEDIO)
- **Recovery UX rota**: usuario no sabe qué es "Mercado Pago ID" ni "PayPal Order ID" — debería pedir email/fecha o mostrar "buscar en tu email de confirmación"
- **Polling 5s fijo** → ansiedad si pago demora (MP a veces 30-60s) — sin feedback de "aún procesando, normal que tarde"
- **No hay Apple Pay / Google Pay** (MP Bricks sí soporta, no integrado)
- **PayPal redirect** pierde contexto si user cierra pestaña — sin webhook fallback

### 3.4 Post-Purchase (MEDIO)
- **No email de confirmación** con link directo a síntesis
- **No "welcome" onboarding** post-unlock (primer uso de chat, cómo leer síntesis)
- **ChatWithMolino** gateado pero sin onboarding — user paga, desbloquea, ve chat vacío sin guía

### 3.5 Trust & Transparency (MEDIO)
- **AI vs Local badge** solo en header de MolinoInterpretation — fácil de perder
- **No hay "qué pasa si no me gusta"** (política de reembolso no visible)
- **Privacy**: "fecha no se asocia a analytics" en onboarding pero `hashProfile` usa nombre + fecha — consistencia ok pero no comunicado en paywall

---

## 4. RIESGOS DE CONVERSIÓN (Priorizados)

| # | Riesgo | Severidad | Probabilidad | Mitigación sugerida |
|---|--------|-----------|--------------|---------------------|
| **R1** | Usuario llega a Intelligence §07 sin esperar paywall → bounce | 🔴 Crítico | Alta | Badge en tab/hub + preview real (primer párrafo IA) + CTA guiado honesto |
| **R2** | Paywall promise ≠ delivery (user siente "pagué por lo que ya vi gratis") | 🔴 Crítico | Media | Diferenciar claramente: gratis = patrones/tensiones/reglas; pago = síntesis narrativa IA + chat contextual |
| **R3** | Payment failure → no recovery path claro → churn | 🟠 Alto | Media | Recovery por email/fecha, no payment ID; webhook MP + PayPal para auto-recover |
| **R4** | Polling timeout (2 min) → user cree que falló → reintenta → double charge risk | 🟠 Alto | Baja | Backoff exponencial + "es normal que tarde hasta 60s" + idempotency keys |
| **R5** | No trial/freemium → high friction para first-time buyers | 🟡 Medio | Alta | Free "first insight" (opening paragraph) o 1 free chat question |
| **R6** | Price $8 USD fijo ARS 11880 → friction LatAm (inflación, tarjetas) | 🟡 Medio | Media | FX dinámico o pricing local; MP ofrece cuotas — no comunicado |
| **R7** | ChatWithMolino vacío post-pago → "¿y ahora qué?" | 🟡 Medio | Alta | Onboarding post-unlock: 1 pregunta sugerida + guía rápida |
| **R8** | KV dev fallback ≠ prod behavior (file lock vs atomic) → bugs solo en prod | 🟡 Medio | Baja | Tests de integración contra Upstash mock |

---

## 5. PRIORIDADES DE SPRINT (Propuesta)

### Sprint 0 — Foundation & Clarity (1-2 semanas)
| Task | Owner | Effort | Dependencias |
|------|-------|--------|--------------|
| **P0.1** Badge visual "Premium" en tab Intelligence + ProfileHub card | Frontend | S | — |
| **P0.2** Guided CTA honesto: "Tu síntesis completa (Premium) →" | Frontend | XS | — |
| **P0.3** Preview real en PremiumGate: render primer párrafo `opening` de fallback local | Frontend | S | MolinoInterpretation fallback |
| **P0.4** Recovery UX: buscar por email + fecha (no payment ID) | Frontend + API | M | KV query by email/date |
| **P0.5** Price config en env (no hardcoded) + FX ARS dinámico (o pricing tiers) | Backend | S | MP preference creation |

### Sprint 1 — Payment Reliability (1-2 semanas)
| Task | Owner | Effort | Dependencias |
|------|-------|--------|--------------|
| **P1.1** Idempotency key en MP preference (session_id + profileHash) | Backend | S | — |
| **P1.2** PayPal webhook (complementar redirect) + auto-recover | Backend | M | PayPal developer console |
| **P1.3** Polling backoff exponencial (5s → 10s → 20s → 30s, max 2 min) | Frontend | XS | — |
| **P1.4** Loading state "Procesando pago... puede tardar hasta 60s" | Frontend | XS | — |

### Sprint 2 — Post-Purchase & Retention (2 semanas)
| Task | Owner | Effort | Dependencias |
|------|-------|--------|--------------|
| **P2.1** Email confirmación + deep link a síntesis | Backend | M | SendGrid/Resend setup |
| **P2.2** Welcome modal post-unlock: "Tu primera pregunta al Molino" | Frontend | S | ChatWithMolino |
| **P2.3** 1 free chat question para premium users (onboarding) | Backend + Frontend | S | intelligenceEngine |
| **P2.4** Refund policy visible en paywall + FAQ link | Frontend | XS | Legal/Content |

### Sprint 3 — Growth & Optimization (ongoing)
| Task | Owner | Effort | Dependencias |
|------|-------|--------|--------------|
| **P3.1** A/B test: price anchoring ($8 vs "menos que un café/semana") | Growth | M | Analytics |
| **P3.2** Trial: free opening paragraph de síntesis IA | Frontend + Backend | S | MolinoInterpretation |
| **P3.3** Referral: "Regalá una síntesis" (coupon generation) | Backend | M | KV coupons |
| **P3.4** Lifetime value tracking (cohort analysis) | Data | L | PostHog/Amplitude |

---

## 6. MÉTRICAS CLAVE A TRACKEAR (PostHog Events)

| Evento | Props clave | Objetivo |
|--------|-------------|----------|
| `paywall_viewed` | `tab`, `chapter`, `has_preview` | Baseline exposure |
| `checkout_started` | `method`, `currency`, `price_usd` | Funnel start |
| `payment_approved` | `method`, `order_id`, `profile_hash` | Conversión |
| `premium_unlocked` | `method`, `is_first_unlock`, `time_to_unlock_ms` | Activación |
| `paywall_recovery_attempted` | `method`, `success` | Recovery rate |
| `chat_first_question` | `was_free_trial` | Engagement post-pago |
| `interpretation_regenerated` | `was_ai`, `count` | AI value perception |

---

## 7. DECISIONES PENDIENTES (Requiere input Producto)

1. **¿Freemium trial?** (1 párrafo gratis vs 1 pregunta chat gratis vs nada)
2. **¿Pricing local ARS?** (FX dinámico vs tiers fijos vs mantener USD only)
3. **¿Refund policy?** (7 días? 14 días? No reembolsos digitales?)
4. **¿Cuotas MP?** (Comunicar "3 cuotas sin interés" en paywall?)
5. **¿Email capture pre-pago?** (Lead magnet vs friction)
6. **¿Lifetime access real o suscripción futura?** (Arquitectura KV soporta ambos)

---

## 8. ARCHIVOS CLAVE AUDITADOS (Referencia rápida)

| Archivo | Rol | Líneas clave |
|---------|-----|--------------|
| `components/profile/PremiumGate.tsx` | Paywall principal | 70-690 |
| `components/ui/MolinoInterpretation.tsx` | Render síntesis (gratis + premium) | 81-511 |
| `components/profile/screens/IntelligenceScreen.tsx` | Pantalla Intelligence (capítulos 01-08) | 66-513 |
| `components/profile/ProfileHub.tsx` | Hub entrada 4 tabs | 30-212 |
| `components/profile/ProfileClient.tsx` | Orquestador tabs + guided CTA | 89-299 |
| `app/onboarding/page.tsx` | Onboarding date-first | 16-173 |
| `lib/mercadopago.ts` | MP SDK + validation | 18-225 |
| `lib/paypal.ts` | PayPal SDK + validation | 1-227 |
| `lib/kv.ts` | Premium access storage | 123-256 |
| `app/api/mp/check/route.ts` | Premium status check | 5-27 |
| `components/profile/ChatWithMolino.tsx` | Chat contextual gated by premium | 41-119 (gate), 128-165 (suggested questions) |
| `lib/engines/intelligenceEngine.ts` | Fallback interpretation + prompt building | (referenciado por API route) |

---

**Fin del documento** — Próximo paso: priorizar Sprint 0 con Producto y arrancar implementación.