# FASE 9 — Mobile First Refinement

No es "hacer responsive", sino rediseñar la experiencia para pantallas pequeñas.
Revisar:
- Navegación con el pulgar.
- Espaciados verticales.
- Longitud de títulos.
- Formularios.
- Tarjetas apiladas.
- CTA siempre accesibles.

---

## Principios

### 1. Navegación con el pulgar

Todo elemento interactivo debe estar alcanzable con el pulgar sin mover la mano del reposo.

**Zona segura:**
- Área inferior de la pantalla (últimos 160px).
- Elementos primarios (CTA, navegación) en esta zona.
- Elementos secundarios (menú, configuración) en la parte superior.

**Implementación:**
```tsx
// components/layout/MobileBottomNav.tsx
const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        <NavItem icon="home" label="Inicio" href="/" />
        <NavItem icon="map" label="Mi Mapa" href="/map" />
        <NavItem icon="search" label="Explorar" href="/explore" />
      </div>
    </nav>
  );
};
```

### 2. Espaciados verticales

En mobile, el espaciado vertical debe ser generoso para evitar toque accidental y facilitar el scroll.

**Reglas:**
- Padding vertical mínimo: 24px entre secciones.
- Padding vertical de botones: 48px de altura mínima (touch target).
- Margin entre elementos: 16px como base.

**Implementación:**
```tsx
// Tailwind config
module.exports = {
  theme: {
    extend: {
      spacing: {
        'touch-min': '48px',
        'section-mobile': '24px',
      }
    }
  }
}

// Uso
<section className="py-section-mobile">
  <button className="h-touch-min w-full">
    Acción
  </button>
</section>
```

### 3. Longitud de títulos

En mobile, los títulos deben ser cortos y directos. Máximo 2 líneas.

**Reglas:**
- Título principal: máximo 30 caracteres.
- Subtítulo: máximo 60 caracteres.
- Body text: 16px mínimo para legibilidad.

**Implementación:**
```tsx
// components/ui/Heading.tsx
const Heading = ({ children, level = 1 }) => {
  const baseClasses = "leading-tight";
  const responsiveClasses = {
    1: "text-2xl md:text-4xl",
    2: "text-xl md:text-3xl",
    3: "text-lg md:text-2xl",
  };

  return (
    <h1 className={cn(baseClasses, responsiveClasses[level])}>
      {children}
    </h1>
  );
};
```

### 4. Formularios

Los formularios en mobile deben minimizar la interacción y maximizar la eficiencia.

**Reglas:**
- Un campo por pantalla en formularios largos.
- Labels siempre visibles (no placeholders).
- Botones de acción sticky en bottom.
- Input type apropiado (tel, email, number).

**Implementación:**
```tsx
// components/ui/Input.tsx
const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full h-12 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
    </div>
  );
};

// Formulario con botón sticky
const FormLayout = ({ children, onSubmit }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-24">
        {children}
      </div>
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <button
          type="submit"
          className="w-full h-12 bg-primary text-white rounded-lg font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
```

### 5. Tarjetas apiladas

En mobile, las tarjetas se apilan verticalmente con espaciado generoso.

**Reglas:**
- Una tarjeta por fila.
- Margin vertical: 16px.
- Padding: 20px.
- Touch target: 48px mínimo en elementos interactivos.

**Implementación:**
```tsx
// components/ui/Card.tsx
const Card = ({ children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 mb-4",
        "shadow-sm hover:shadow-md transition-shadow duration-150"
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid responsivo
const CardGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};
```

### 6. CTA siempre accesibles

Los botones de acción principal deben estar visibles y accesibles en todo momento.

**Reglas:**
- CTA principal sticky en bottom.
- Solo un CTA principal por pantalla.
- Botón secundario como texto (no botón completo).
- Clear space: 16px alrededor del CTA.

**Implementación:**
```tsx
// components/ui/StickyCTA.tsx
const StickyCTA = ({ primaryAction, secondaryAction }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 pb-safe">
      <div className="max-w-container mx-auto">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="w-full text-center py-3 text-primary font-medium mb-2"
          >
            {secondaryAction.label}
          </button>
        )}
        <button
          onClick={primaryAction.onClick}
          className="w-full h-12 bg-primary text-white rounded-lg font-medium"
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  );
};
```

---

## Checklist de revisión mobile

### Navegación
- [ ] Todos los elementos interactivos están en zona de pulgar
- [ ] Menú hamburguesa funciona con un toque
- [ ] No hay elementos que requieran dos manos

### Espaciados
- [ ] Padding vertical mínimo 24px entre secciones
- [ ] Touch targets de 48px mínimo
- [ ] Margin de 16px entre elementos

### Tipografía
- [ ] Título principal: máximo 30 caracteres
- [ ] Subtítulo: máximo 60 caracteres
- [ ] Body text: 16px mínimo

### Formularios
- [ ] Labels visibles (no placeholders)
- [ ] Input type apropiado
- [ ] Botón de submit sticky en bottom
- [ ] Error messages visibles inmediatamente

### Tarjetas
- [ ] Una por fila en mobile
- [ ] Margin vertical 16px
- [ ] Padding 20px
- [ ] Touch targets 48px mínimo

### CTA
- [ ] CTA principal sticky en bottom
- [ ] Solo un CTA principal por pantalla
- [ ] Clear space 16px alrededor
- [ ] Secundario como texto, no botón

---

## Componentes a revisar

| Componente | Archivo | Estado |
|---|---|---|
| Header mobile | `components/layout/UniversityHeader.tsx` | Por revisar |
| Bottom nav | `components/layout/MobileBottomNav.tsx` | Nuevo |
| Cards | `components/ui/Card.tsx` | Por revisar |
| Inputs | `components/ui/Input.tsx` | Por revisar |
| Sticky CTA | `components/ui/StickyCTA.tsx` | Nuevo |
| Headings | `components/ui/Heading.tsx` | Nuevo |

## Próximos pasos

1. Implementar `MobileBottomNav` para navegación principal.
2. Revisar todos los formularios con patrón sticky CTA.
3. Ajustar espaciados en todos los componentes.
4. Verificar touch targets en toda la aplicación.
5. Testear en dispositivos reales (iPhone SE, Pixel 4a).