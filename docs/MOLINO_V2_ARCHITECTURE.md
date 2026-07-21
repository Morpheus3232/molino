# Molino V2 — Personal Intelligence Product

## 1. Cambio de posicionamiento
- Antes: Universidad Pública de Libre Acceso
- Ahora: Personal Intelligence Platform
- Propuesta: "Entendé tus patrones para tomar mejores decisiones"

## 2. Mapa de rutas

### Módulo 1 — Landing (`/`)
- Hero de propuesta de valor
- Demo interactiva: ingresar nombre + fecha y ver preview instantáneo del perfil
- Beneficios clave
- CTA a onboarding

### Módulo 2 — Onboarding (`/onboarding`)
- Formulario completo:
  - Nombre
  - Fecha de nacimiento
  - Género (opcional)
  - Objetivo principal: decisiones de vida, amor, carrera, negocios, crecimiento personal
- Cálculo del perfil base
- Redirección a `/profile`

### Módulo 3 — Personal Intelligence Profile (`/profile`)
Core Identity:
- Life Path, Expression, Soul, Personality
- Arquetipo principal
- Signo solar, zodiaco chino, elemento, modalidad
- Keywords, fortalezas, desafíos
- Quote del arquetipo
- CTA a `/patterns`

### Módulo 4 — Your Patterns (`/patterns`)
- Integración de sistemas simbólicos:
  - Numerología completa
  - Astrología (signos, planetas, casas, aspectos)
  - Zodiaco chino
  - Tarot
  - Human Design
  - Eneagrama
- Cada sistema mostrado como card con insights accionables

### Módulo 5 — Your Timing (`/timing`)
- Calendario personal:
  - Número del día
  - Año personal
  - Ciclos mensuales
  - Recomendaciones de timing para decisiones

### Módulo 6 — Your Alignment (`/alignment`)
- Recomendaciones personalizadas:
  - Carrera/profesión alineada
  - Estilos de comunicación
  - Entornos favorables
  - Colores, números, símbolos personales

### Módulo 7 — Molino AI (`/ai`)
- Asistente contextual básico:
  - Chat interface
  - Interpretación del perfil
  - Recomendaciones basadas en el conocimiento

### Módulo 8 — For You (`/for-you`)
- Feed dinámico básico:
  - Insights diarios
  - Contenido curado por perfil
  - Recordatorios personalizados

### Módulo 9 — Decision Engine (`/decisions`)
- Análisis de decisiones:
  - Input: decisión a tomar
  - Análisis de alineación con perfil
  - Score y recomendación

### Módulo 10 — Evolution (`/evolution`)
- Historial y evolución:
  - Registro de sesiones
  - Evolución de patrones
  - Logros y milestones

## 3. Arquitectura de datos

### UserProfile (extendido)
```typescript
interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  lifePath: number;
  sunSign: string;
  sunSignInfo: { sign: string; element: string; modality: string; symbol: string };
  chineseZodiac: string;
  chineseZodiacInfo: { animal: string; element: string; emoji: string };
  element: string;
  modality: string;
  archetype: string;
  archetypeInfo: {
    name: string;
    color: string;
    description: string;
    quote: string;
    keywords: string[];
    strengths: string[];
    challenges: string[];
  };
  expressionNumber?: number;
  soulNumber?: number;
  personalityNumber?: number;
  objectives?: string[];
}
```

## 4. Design System
- Tokens unificados en CSS variables
- Componentes base: Button, Input, Card, Section, Badge
- Navegación responsive con menú móvil
- Accesibilidad: skip links, aria labels, focus states, touch targets 44px+

## 5. Flujo de usuario
1. Landing → demo interactiva
2. Onboarding → perfil completo
3. Profile → visualización de identidad
4. Patterns → profundización en sistemas
5. Timing → calendario personal
6. Alignment → recomendaciones
7. AI → asistente contextual
8. For You → contenido personalizado
9. Decisions → motor de decisiones
10. Evolution → historial
