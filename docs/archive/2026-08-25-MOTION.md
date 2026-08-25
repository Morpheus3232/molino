# FASE 8 — Motion & Polish

Esta es la diferencia entre un sitio "bonito" y uno que se siente premium.
No se trata de agregar más animaciones, sino de que todas compartan un mismo lenguaje.

---

## Principios

### 1. Las animaciones deben explicar, no decorar

Toda animación existe para comunicar algo al usuario. No se añade movimiento por estética.

**Aplicaciones:**
- Un card que se eleva al hacer hover confirma que es interactivo.
- Un formulario que valida en tiempo real muestra el estado del input.
- Un modal que aparece desde el centro comunica que es una capa nueva.

**Evitar:**
- Animaciones de entrada que no aportan contexto.
- Transiciones entre estados que no refuerzan la jerarquía.
- Movimientos decorativos que distraen del flujo principal.

### 2. Cada transición debe reforzar la jerarquía

El movimiento guía la mirada del usuario a través de la información.

**Reglas:**
- Elementos primarios aparecen primero (0 ms de delay).
- Elementos secundarios aparecen después (50-100 ms de delay).
- Elementos de apoyo aparecen al final (100-150 ms de delay).

**Ejemplo de aparición escalonada:**
```
Título principal → 0 ms
Subtítulo → 50 ms
Botón CTA → 100 ms
Elemento decorativo → 150 ms
```

### 3. Ninguna animación debe retrasar la interacción

El movimiento es instantáneo o no existe. El usuario nunca espera a que termine una animación para interactuar.

**Reglas:**
- Duraciones máximas estrictas (ver tabla de duraciones).
- Transiciones que bloquean interacciones se eliminan o se acortan.
- `prefers-reduced-motion` desactiva todas las animaciones no esenciales.

---

## Reglas

### Curva de aceleración

Una única curva para toda la aplicación.

```css
/* globals.css */
:root {
  --ease-emphasize: cubic-bezier(0.2, 0, 0, 1);
}
```

Esta curva (ease-out fuerte) es:
- Rápida al inicio (feedback inmediato).
- Lenta al final (sensación de precisión).
- Consistente en todos los componentes.

### Duraciones consistentes

| Tipo de interacción | Duración | Uso |
|---|---|---|
| Hover | 150 ms | Cards, botones, elementos interactivos |
| Entrada | 250 ms | Aparición de elementos, carga de contenido |
| Cambio de página | 350 ms | Navegación entre rutas |
| Modal | 200 ms | Apertura y cierre de modales |
| Validación | 200 ms | Feedback de formularios |

### Apariciones escalonadas

Solo cuando aportan contexto. No en cada renderizado.

**Patrón:**
```
Elemento 1: delay 0 ms
Elemento 2: delay 50 ms
Elemento 3: delay 100 ms
Elemento 4: delay 150 ms
```

**Aplicaciones:**
- Listas de resultados.
- Secciones de una página al hacer scroll.
- Cards en un grid.

### Respecto a prefers-reduced-motion

Todas las animaciones deben respetar la preferencia del usuario.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Aplicaciones

### 1. Header al hacer scroll

**Comportamiento:**
- Al hacer scroll hacia abajo: header se contrae y reduce su padding.
- Al hacer scroll hacia arriba: header vuelve a su tamaño original.
- Transición: 250 ms con `--ease-emphasize`.

**Implementación:**
```tsx
// components/layout/UniversityHeader.tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Clase condicional
className={cn(
  "transition-all duration-250",
  scrolled ? "py-2 shadow-md" : "py-4"
)}
```

### 2. Cards al pasar el cursor

**Comportamiento:**
- Al hacer hover: card se eleva 4px, sombra aumenta.
- Transición: 150 ms con `--ease-emphasize`.

**Implementación:**
```tsx
// components/ui/Card.tsx
className={cn(
  "transition-all duration-150",
  "hover:translate-y-[-4px] hover:shadow-lg"
)}
```

### 3. Formularios al validarse

**Comportamiento:**
- Al enfocar: borde se ilumina con color primario.
- Al validar: si es válido, borde verde; si error, borde rojo.
- Transición: 200 ms con `--ease-emphasize`.

**Implementación:**
```tsx
// components/ui/Input.tsx
className={cn(
  "transition-all duration-200",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  error ? "border-red-500" : "border-border"
)}
```

### 4. Cambio entre pestañas

**Comportamiento:**
- Al cambiar de pestaña: contenido anterior desaparece (fade out), nuevo aparece (fade in).
- Transición: 250 ms con `--ease-emphasize`.

**Implementación:**
```tsx
// components/ui/Tabs.tsx
const [previousTab, setPreviousTab] = useState(activeTab);

useEffect(() => {
  if (activeTab !== previousTab) {
    setPreviousTab(activeTab);
  }
}, [activeTab]);

// Animación de contenido
className={cn(
  "transition-opacity duration-250",
  tab === activeTab ? "opacity-100" : "opacity-0"
)}
```

### 5. Navegación entre páginas

**Comportamiento:**
- Al navegar: contenido anterior se desvanece, nuevo se desvanece.
- Transición: 350 ms con `--ease-emphasize`.

**Implementación (Next.js):**
```tsx
// app/layout.tsx
import { AnimatePresence } from 'framer-motion';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}
```

### 6. Apertura y cierre de modales

**Comportamiento:**
- Al abrir: modal aparece desde el centro con scale 0 → 1.
- Al cerrar: modal desaparece con scale 1 → 0.
- Fondo: fade in/out.
- Transición: 200 ms con `--ease-emphasize`.

**Implementación:**
```tsx
// components/ui/Modal.tsx
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

<motion.div
  variants={overlayVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={{ duration: 0.2, ease: "var(--ease-emphasize)" }}
>
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.2, ease: "var(--ease-emphasize)" }}
  >
    {/* Contenido del modal */}
  </motion.div>
</motion.div>
```

---

## Resumen de implementación

| Componente | Archivo | Estado |
|---|---|---|
| Curva de aceleración | `app/globals.css` | Por implementar |
| Header scroll | `components/layout/UniversityHeader.tsx` | Por implementar |
| Cards hover | `components/ui/Card.tsx` | Por implementar |
| Formulario validación | `components/ui/Input.tsx` | Por implementar |
| Tabs | `components/ui/Tabs.tsx` | Por implementar |
| Navegación página | `app/layout.tsx` | Por implementar |
| Modales | `components/ui/Modal.tsx` | Por implementar |
| prefers-reduced-motion | `app/globals.css` | Por implementar |

## Próximos pasos

1. Agregar variables CSS de motion a `globals.css`.
2. Implementar `framer-motion` como dependencia.
3. Aplicar transiciones a componentes existentes.
4. Testear con `prefers-reduced-motion` activado.
5. Documentar casos edge en componentes individuales.