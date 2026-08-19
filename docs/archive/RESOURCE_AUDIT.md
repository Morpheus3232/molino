# RESOURCE AUDIT — Molino

Fecha: 2026-07-24
Ruta: /Users/francoviegaslloverasgmail.com/Projects/molino
Branch: chore/upgrade-next
Build: 153 rutas, 0 errores

---

## 1. DEPENDENCIES

| Paquete | Versión | Estado | Uso en Molino |
|---------|---------|--------|---------------|
| framer-motion | ^11.18.2 | ✅ Usado | Animaciones premium, page transitions |
| lucide-react | ^0.400.0 | ✅ Usado | Iconos en UI |
| next | ^15.5.21 | ✅ Usado | Framework core |
| react | ^18.3.0 | ✅ Usado | UI library |
| react-dom | ^18.3.0 | ✅ Usado | Renderer |
| recharts | ^3.10.0 | ⚠️ Parcial | Solo 1 componente (ProfileRadar) |
| sonner | ^2.0.7 | ✅ Usado | Toast notifications |
| vaul | ^1.1.2 | ⚠️ Parcial | Drawer disponible, poco usado |
| daisyui | ^5.7.0 | ❌ Sin usar | Instalado pero NO registrado en tailwind.config |

---

## 2. COMPONENTES (57 archivos)

### UI (8)
| Archivo | Estado | Potencial |
|---------|--------|-----------|
| AnimatedLayout.tsx | ✅ Usado | Layout premium |
| Button.tsx | ✅ Usado | — |
| Card.tsx | ✅ Usado | — |
| CountUp.tsx | ✅ Usado | 🟢 Alto — animación viral |
| EmptyState.tsx | ❌ Huérfano | 🟡 Integrar o eliminar |
| Input.tsx | ✅ Usado | — |
| LoadingState.tsx | ✅ Usado | 🟢 Genérico, reutilizable |
| MolinoInterpretation.tsx | ✅ Usado | — |
| Section.tsx | ✅ Usado | — |

### Layout (2)
| Archivo | Estado | Potencial |
|---------|--------|-----------|
| UniversityHeader.tsx | ✅ Usado | — |
| UniversityFooter.tsx | ✅ Usado | — |

### Profile (18) — TODOS USADOS
IdentityCard, DailyInsightFeed, ContrastLearnSection, CircleSection, PersonalScoreCard, DecisionMapSection, EnhancedMomentSection, ConvergentSection, ChallengingSection, EcosystemSection, ContrastSection, PersonalRecommendationsSection, SymbolicMapSection, RecommendationCard, PriorityBadge, SymbolicMapShareableCard, AffinityShareableCard, ShareableCard

### Academy (4) — TODOS USADOS
KnowledgeConnections, ZodiacExplorer, LifePathExplorer, KnowledgeLinkCard

### Charts (1)
| Archivo | Estado | Potencial |
|---------|--------|-----------|
| ProfileRadar.tsx | ✅ Usado | 🟢 Recharts subutilizado — agregar más charts |

### Standalone (5)
| Archivo | Estado | Potencial |
|---------|--------|-----------|
| EntitySearch.tsx | ✅ Usado | — |
| ThemeToggle.tsx | ✅ Usado | — |
| TrustFooter.tsx | ✅ Usado | — |
| AppErrorBoundary.tsx | ✅ Usado | — |
| CycleTimeline.tsx | ❌ Huérfano | 🟡 Integrar en perfil o eliminar |

---

## 3. ENGINES (18 archivos)

| Archivo | Estado | Potencial |
|---------|--------|-----------|
| numerologyEngine.ts | ✅ Usado | — |
| astrologyEngine.ts | ✅ Usado | — |
| chineseZodiacEngine.ts | ✅ Usado | — |
| compatibilityEngine.ts | ✅ Usado | — |
| dateEngine.ts | ✅ Usado | — |
| aiEngine.ts | ✅ Usado | — |
| dailyEnergyEngine.ts | ✅ Usado | 🟢 Usar en DailyInsightFeed |
| timingEngine.ts | ✅ Usado | 🟢 Integrar en "Tu momento" |
| decisionsEngine.ts | ✅ Usado | 🟢 Integrar en DecisionMap |
| intelligenceEngine.ts | ✅ Usado | — |
| synthesisEngine.ts | ✅ Usado | — |
| perspectivesEngine.ts | ✅ Usado | — |
| convergentEngine.ts | ✅ Usado | — |
| personalTimelineEngine.ts | ✅ Usado | — |
| yearCycleEngine.ts | ✅ Usado | — |
| recommendationEngine.ts | ✅ Usado | — |
| personalRecommendationEngine.ts | ✅ Usado | — |
| affinityEngine.ts | ✅ Usado | — |
| compatibilityScoreEngine.ts | ✅ Usado | — |
| storyEngine.ts | ✅ Usado | — |
| identityEngine.ts | ❌ Huérfano | 🟡 Integrar o eliminar |

---

## 4. DATA (14 archivos)

| Archivo | Estado | Potencial |
|---------|--------|-----------|
| data.ts (legacy) | ⚠️ Duplicado | 🟡 Depreciar gradualmente |
| entities.ts | ✅ Usado | — |
| symbolic-entities.ts | ✅ Usado | — |
| animalRelations.ts | ✅ Usado | — |
| chineseNewYearDates.ts | ✅ Usado | — |
| sexagenary-cycle.ts | ✅ Usado | — |
| knowledge.ts | ✅ Usado | — |
| constants.ts | ✅ Usado | — |
| sources.ts | ✅ Usado | 🟢 Alto — reutilizable |
| brands.ts | ✅ Usado | — |
| countries.ts | ✅ Usado | — |
| astrologia-content.ts | ✅ Usado | — |
| numerologia-content.ts | ✅ Usado | — |
| zodiaco-chino-content.ts | ✅ Usado | — |

---

## 5. UTILS (5 archivos)

| Archivo | Estado | Potencial |
|---------|--------|-----------|
| utils.ts (root) | ⚠️ Solapamiento | 🟡 Consolidar con score.ts y localStorage.ts |
| motion.ts | ✅ Usado | 🟢 Premium animations |
| premiumMotion.ts | ✅ Usado | 🟢 Apple Health + Spotify style |
| score.ts | ✅ Usado | 🟢 Score visualization |
| zodiacDisplay.ts | ✅ Usado | 🟢 Presentation layer |

---

## 6. HOOKS (2 archivos)

| Archivo | Estado | Potencial |
|---------|--------|-----------|
| useProfile.ts | ✅ Usado | — |
| useAuthSession.ts | ✅ Usado | — |

---

## 7. CSS DESIGN TOKENS (globals.css — 637 líneas)

Sistema de diseño COMPLETO:
- ✅ 637 líneas de CSS custom properties
- ✅ Light/dark mode completo
- ✅ Element colors (fire, earth, air, water, metal, wood)
- ✅ Layer colors (identity, patterns, numerology, astrology, cycles, moment)
- ✅ Category colors (12 categorías)
- ✅ Score colors (excellent, good, neutral, poor)
- ✅ Typography scale (8 steps)
- ✅ Spacing system
- ✅ Border radius system
- ✅ Shadow system
- ✅ Component classes (.card, .btn, .badge, .input, .map-node)
- ✅ Editorial system (.section-editorial, .section-dark, .section-ink)
- ✅ Animations (fadeIn, fadeInUp, stagger-1 to stagger-6)
- ✅ Accessibility (prefers-reduced-motion, skip-link, focus-visible)

**ESTADO: SISTEMA COMPLETO — no necesita nuevos tokens.**

---

## 8. RECURSOS HUÉRFANOS (para integrar o eliminar)

| Recurso | Acción recomendada |
|---------|-------------------|
| EmptyState.tsx | Integrar en perfil cuando no hay profile |
| CycleTimeline.tsx | Integrar en EnhancedMomentSection |
| identityEngine.ts | Integrar en IdentityCard o eliminar |
| daisyui | Eliminar de package.json |
| lib/data.ts (legacy) | Depreciar gradualmente |
| lib/calculations.ts | Consolidar con dateEngine.ts |
| lib/utils.ts (root) | Consolidar con score.ts |

---

## 9. RECURSOS DE ALTO POTENCIAL NO APROVECHADOS

| Recurso | Potencial | Feature sugerida |
|---------|-----------|-----------------|
| recharts (solo 1 chart) | 🟢 Muy alto | Agregar: Bar chart de prioridades, Pie chart de elementos, Line chart de ciclos |
| vaul (drawer) | 🟢 Alto | Modales premium tipo Apple Health para detalle de entidades |
| sonner (toasts) | 🟢 Alto | Notificaciones: "Nuevo insight disponible", "Tu ciclo cambió" |
| dailyEnergyEngine | 🟢 Alto | Integrar energía diaria en DailyInsightFeed |
| timingEngine | 🟢 Alto | Integrar timing en "Tu momento actual" |
| decisionsEngine | 🟢 Alto | Integrar en DecisionMapSection |
| storyEngine | 🟡 Medio | Generar narrativas personalizadas para shareables |
| lucide-react | 🟡 Medio | Reemplazar emojis por iconos consistentes |

---

## 10. TOP 20 MEJORAS (ordenadas por impacto)

| # | Mejora | Recurso | Impacto | Dificultad |
|---|--------|---------|---------|------------|
| 1 | Integrar recharts en perfil (Bar + Pie charts) | recharts | Muy alto | Media |
| 2 | Agregar vaul para modales de detalle de entidad | vaul | Alto | Baja |
| 3 | Integrar dailyEnergyEngine en DailyInsightFeed | dailyEnergyEngine | Alto | Baja |
| 4 | Integrar timingEngine en EnhancedMomentSection | timingEngine | Alto | Baja |
| 5 | Integrar decisionsEngine en DecisionMapSection | decisionsEngine | Alto | Baja |
| 6 | Usar sonner para notificaciones de insights | sonner | Alto | Baja |
| 7 | Integrar CycleTimeline.tsx (huérfano) | CycleTimeline | Medio | Baja |
| 8 | Integrar EmptyState.tsx para usuarios sin profile | EmptyState | Medio | Baja |
| 9 | Integrar identityEngine.ts en IdentityCard | identityEngine | Medio | Baja |
| 10 | Agregar lucide-react icons a cards de recomendación | lucide-react | Medio | Baja |
| 11 | Crear BarChart de prioridades de recomendaciones | recharts | Medio | Media |
| 12 | Crear PieChart de distribución de elementos | recharts | Medio | Media |
| 13 | Crear LineChart de evolución de ciclos | recharts | Medio | Media |
| 14 | Eliminar daisyui (huérfano) | daisyui | Bajo | Baja |
| 15 | Consolidar lib/data.ts con engines | lib/data.ts | Bajo | Alta |
| 16 | Consolidar lib/utils.ts con score.ts | lib/utils.ts | Bajo | Media |
| 17 | Eliminar identityEngine.ts si no se integra | identityEngine | Bajo | Baja |
| 18 | Agregar microinteracciones con lucide-react | lucide-react | Bajo | Baja |
| 19 | Crear componente de shareable con vaul | vaul | Bajo | Media |
| 20 | Agregar tooltips con sonner para insights | sonner | Bajo | Baja |
