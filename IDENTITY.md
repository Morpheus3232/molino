# FASE 5.5 — Identidad de Producto

Dado el tipo de producto que estás construyendo, dedicar una fase exclusiva a definir una identidad visual propia para que no dependa de Hegia.

---

## Objetivo

Establecer elementos distintivos que hagan reconocible a Molino incluso sin el logo. La meta: alguien vea una captura de pantalla y piense "esto es Molino", no "esto se parece a Hegia".

---

## Lenguaje gráfico

### Inspiración: Mapas, constelaciones y conexiones

**Principios:**
- Todo elemento visual debe evocar el concepto de "conexión" y "descubrimiento personal".
- Se evita iconografía genérica (flechas, círculos vacíos, símbolos abstractos sin significado).
- Cada gráfico, patrón o ilustración debe contar una historia de relación entre elementos.

**Elementos distintivos:**
1. **Líneas de conexión**: trazos finos que unen puntos, representando relaciones entre conceptos.
2. **Puntos cardinales**: pequeños círculos que marcan posiciones en un "mapa interior".
3. **Constelaciones**: grupos de puntos conectados que forman patrones significativos.
4. **Regiones**: áreas sombreadas que delimitan "territorios" de significado.

**Implementación:**
```tsx
// components/ui/ConstellationMap.tsx
const ConstellationMap = ({ points, connections }) => {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      {/* Líneas de conexión */}
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      ))}
      {/* Puntos */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={point.active ? "6" : "3"}
          fill="currentColor"
          opacity={point.active ? "1" : "0.6"}
        />
      ))}
    </svg>
  );
};
```

### Sistema de ilustraciones

**Estilo:**
- Líneas finas (1-2px).
- Paleta limitada (máximo 3 colores por ilustración).
- Formas geométricas simples.
- Espacio negativo generoso.

**Temas:**
1. **Descubrimiento**: figuras que emergen de la oscuridad o del caos.
2. **Conexión**: elementos que se unen o se atraen.
3. **Transformación**: figuras que evolucionan o cambian de estado.
4. **Inteligencia**: patrones que emergen de la complejidad.

**Implementación:**
```tsx
// components/ui/Illustration.tsx
const Illustration = ({ type, size = "md" }) => {
  const illustrations = {
    discovery: "/illustrations/discovery.svg",
    connection: "/illustrations/connection.svg",
    transformation: "/illustrations/transformation.svg",
    intelligence: "/illustrations/intelligence.svg",
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  return (
    <img
      src={illustrations[type]}
      alt=""
      aria-hidden="true"
      className={cn("object-contain", sizes[size])}
    />
  );
};
```

### Dirección fotográfica

**Si se usa fotografía:**
- Imágenes abstractas, no retratos.
- Enfoque en texturas naturales (madera, piedra, cielo).
- Paleta de colores neutra con acentos cálidos.
- Profundidad de campo reducida para enfoque en detalles.

**Alternativa sin fotografía:**
- Patrones generados algorítmicamente.
- Visualizaciones de datos abstractas.
- Gradientes sutiles como fondos.

---

## Elementos visuales

### Gradientes

**Reglas:**
- Máximo 2 colores por gradiente.
- Dirección siempre diagonal (45° o 135°).
- Opacidad máxima del 80% sobre fondos claros.
- Nunca sobre texto.

**Paleta de gradientes:**
```css
/* globals.css */
:root {
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  --gradient-subtle: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
}
```

**Uso:**
- Hero sections
- Cards destacadas
- Fondos de modales
- Separadores decorativos

### Texturas

**Reglas:**
- Texturas sutiles (opacidad < 5%).
- Solo en fondos de secciones.
- Nunca sobre contenido legible.
- Texturas SVG para consistencia.

**Tipos:**
1. **Papel reciclado**: textura sutil para fondos de contenido.
2. **Constelación**: puntos dispersos para fondos de hero.
3. **Líneas**: trazos finos para separadores.

### Líneas y puntos

**Sistema de líneas:**
- Grosor: 1px (sutil), 2px (destacado), 4px (enfásis).
- Opacidad: 10%, 30%, 60%, 100%.
- Color: siempre `var(--color-border)` o `var(--color-muted)`.

**Sistema de puntos:**
- Tamaño: 2px, 4px, 6px, 8px.
- Opacidad: 20%, 40%, 60%, 100%.
- Color: siempre `var(--color-muted)` o `var(--color-primary)`.

**Implementación:**
```tsx
// components/ui/Divider.tsx
const Divider = ({ variant = "line", opacity = 0.3 }) => {
  const baseClasses = "w-full";
  const variants = {
    line: "h-px bg-border",
    dots: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
  };

  return (
    <div className={cn(baseClasses, variants[variant])} style={{ opacity }} />
  );
};

// components/ui/ConstellationDots.tsx
const ConstellationDots = ({ count = 20, density = "medium" }) => {
  const densities = {
    sparse: "gap-8",
    medium: "gap-6",
    dense: "gap-4",
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none opacity-10", densities[density])}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-1 h-1 bg-muted rounded-full" />
      ))}
    </div>
  );
};
```

---

## Voz visual

### Características distintivas

**Tipografía:**
- Fuente principal: **Inter** (limpia, moderna, legible).
- Fuente secundaria: **Space Grotesk** (para títulos, con carácter distintivo).
- Nunca usar más de 2 familias tipográficas.

**Tratamiento de texto:**
- Títulos: mayúsculas para H1, minúsculas para H2-H3.
- Body: siempre minúsculas, con acentos visuales.
- CTA: siempre en mayúsculas, tracking ampliado.

**Ejemplo:**
```tsx
// components/ui/Heading.tsx
const Heading = ({ children, level = 1, variant = "default" }) => {
  const baseClasses = "font-space-grotesk font-bold";
  const levelClasses = {
    1: "text-4xl uppercase tracking-tight",
    2: "text-2xl lowercase tracking-wide",
    3: "text-xl lowercase tracking-normal",
  };

  return (
    <h1 className={cn(baseClasses, levelClasses[level])}>
      {children}
    </h1>
  );
};
```

### Patrones de comunicación

**Lenguaje:**
- Directo, sin rodeos.
- Metáforas de viaje y descubrimiento.
- Lenguaje inclusivo y accesible.
- Tono curioso, no autoritario.

**Ejemplos:**
- ❌ "Su compatibilidad es del 75%"
- ✅ "Descubriste una conexión del 75%"

- ❌ "Completa tu perfil"
- ✅ "Contanos un poco más de vos"

- ❌ "Error en el formulario"
- ✅ "Revisá estos datos y volvé a intentar"

---

## Aplicación

### Homepage
- Hero con constelación animada de fondo.
- Secciones con líneas divisorias de puntos.
- Cards con gradientes sutiles.
- Ilustraciones temáticas por sección.

### Resultados
- Visualización de conexiones entre conceptos.
- Puntos que se iluminan al pasar el cursor.
- Gradientes en elementos destacados.
- Ilustraciones que explican cada resultado.

### Navegación
- Líneas de conexión en breadcrumbs.
- Puntos que marcan el progreso.
- Gradientes en elementos activos.
- Iconografía basada en constelaciones.

---

## Verificación de identidad

### Test de reconocimiento

| Elemento | ¿Es reconocible como Molino? | Notas |
|---|---|---|
| Captura de homepage | | |
| Captura de resultados | | |
| Captura de formulario | | |
| Captura de mobile | | |
| Captura de modal | | |

### Test de eliminación de logo

| Pantalla | ¿Se reconoce sin logo? | Notas |
|---|---|---|
| Homepage | | |
| Resultados | | |
| Explorar | | |

---

## Próximos pasos

1. Crear biblioteca de ilustraciones temáticas.
2. Implementar sistema de constelaciones en componentes.
3. Definir gradientes y texturas en `globals.css`.
4. Aplicar voz visual a todo el copy.
5. Realizar test de reconocimiento con usuarios.
6. Documentar en `DESIGN_SYSTEM.md` como sección 13.