# FASE 11 — Plan de implementación

Transformar los documentos de diseño en tareas concretas para ejecución.

---

## Sprint 1 — Foundation (P0)

**Objetivo:** Establecer la base visual y técnica del sistema de diseño.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Crear Design Tokens | `tailwind.config.ts`, `app/globals.css` | P0 |
| 2 | Unificar tipografía | `tailwind.config.ts`, `app/globals.css` | P0 |
| 3 | Unificar espaciados | `tailwind.config.ts`, `app/globals.css` | P0 |
| 4 | Unificar radios de borde | `tailwind.config.ts`, `app/globals.css` | P0 |
| 5 | Unificar sombras | `tailwind.config.ts`, `app/globals.css` | P0 |
| 6 | Unificar colores | `tailwind.config.ts`, `app/globals.css` | P0 |
| 7 | Unificar containers | `tailwind.config.ts`, `app/globals.css` | P0 |

### Detalle de tareas

#### 1. Crear Design Tokens
```ts
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
        accent: '#f97316',
        background: '#ffffff',
        card: '#ffffff',
        border: '#e2e8f0',
        muted: '#94a3b8',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem',
      },
    },
  },
}
```

#### 2. Unificar tipografía
```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  --font-sans: 'Inter', sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
}
```

#### 3. Unificar espaciados
```ts
// tailwind.config.ts
spacing: {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
}
```

#### 4. Unificar radios de borde
```ts
// tailwind.config.ts
borderRadius: {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
}
```

#### 5. Unificar sombras
```ts
// tailwind.config.ts
boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
}
```

#### 6. Unificar colores
```css
/* app/globals.css */
:root {
  --color-primary: #0ea5e9;
  --color-primary-hover: #0284c7;
  --color-primary-active: #0369a1;
  --color-secondary: #64748b;
  --color-accent: #f97316;
  --color-background: #ffffff;
  --color-card: #ffffff;
  --color-border: #e2e8f0;
  --color-muted: #94a3b8;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

#### 7. Unificar containers
```ts
// tailwind.config.ts
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',
    sm: '2rem',
    lg: '4rem',
    xl: '5rem',
    '2xl': '6rem',
  },
}
```

### Archivos afectados
- `tailwind.config.ts`
- `app/globals.css`
- `components/ui/*` (componentes existentes que usan estilos antiguos)

---

## Sprint 2 — Core Components (P0)

**Objetivo:** Unificar y estandarizar los componentes base esenciales.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Unificar Button | `components/ui/Button.tsx` | P0 |
| 2 | Unificar Input | `components/ui/Input.tsx` | P0 |
| 3 | Unificar Card | `components/ui/Card.tsx` | P0 |
| 4 | Crear Modal | `components/ui/Modal.tsx` | P0 |
| 5 | Crear Dropdown | `components/ui/Dropdown.tsx` | P0 |
| 6 | Crear Tabs | `components/ui/Tabs.tsx` | P0 |
| 7 | Unificar Badge | `components/ui/Badge.tsx` | P0 |

### Detalle de tareas

#### 1. Unificar Button
```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary",
    ghost: "bg-transparent text-muted hover:bg-accent/10 focus:ring-accent",
    accent: "bg-accent text-white hover:bg-accent-hover focus:ring-accent",
  };
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], loading && "opacity-50 cursor-not-allowed")}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

#### 2. Unificar Input
```tsx
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({ label, error, helperText, leftIcon, rightIcon, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</div>}
        <input
          className={cn(
            "w-full h-10 px-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error ? "border-error focus:border-error" : "border-border"
          )}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-muted">{helperText}</p>}
    </div>
  );
};
```

#### 3. Unificar Card
```tsx
// components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'outlined' | 'interactive';
  padding?: 'sm' | 'md' | 'lg';
}

const Card = ({ variant = 'default', padding = 'md', children, ...props }) => {
  const baseClasses = "bg-card rounded-xl transition-all duration-150";
  const variantClasses = {
    default: "border border-border shadow-sm",
    outlined: "border border-border",
    interactive: "border border-border shadow-sm hover:shadow-md hover:translate-y-[-2px]",
  };
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], paddingClasses[padding])} {...props}>
      {children}
    </div>
  );
};
```

#### 4. Crear Modal
```tsx
// components/ui/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "var(--ease-emphasize)" }}
            className={cn("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-xl z-50", sizeClasses[size])}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

#### 5. Crear Dropdown
```tsx
// components/ui/Dropdown.tsx
interface DropdownProps {
  trigger: React.ReactNode;
  align?: 'left' | 'right';
}

const Dropdown = ({ trigger, align = 'right', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const alignClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "var(--ease-emphasize)" }}
            className={cn("absolute z-50 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg", alignClasses)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

#### 6. Crear Tabs
```tsx
// components/ui/Tabs.tsx
interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-border">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground hover:border-border"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
```

#### 7. Unificar Badge
```tsx
// components/ui/Badge.tsx
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Badge = ({ variant = 'default', size = 'md', children }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const variantClasses = {
    default: "bg-muted text-white",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
  };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size])}>
      {children}
    </span>
  );
};
```

### Archivos afectados
- `components/ui/*`
- `app/globals.css` (clases de componentes)
- `package.json` (framer-motion dependency)

---

## Sprint 3 — Layout (P0)

**Objetivo:** Estandarizar layout, header, footer y navegación.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Unificar Header | `components/layout/UniversityHeader.tsx` | P0 |
| 2 | Unificar Footer | `components/layout/Footer.tsx` | P0 |
| 3 | Crear Layout principal | `app/layout.tsx` | P0 |
| 4 | Unificar navegación | `lib/data/navigation.ts` | P0 |
| 5 | Crear Mobile menu | `components/layout/MobileMenu.tsx` | P0 |

### Detalle de tareas

#### 1. Unificar Header
```tsx
// components/layout/UniversityHeader.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from '@/components/layout/MobileMenu';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Mi Mapa', href: '/map' },
  { name: 'Explorar', href: '/explore' },
  { name: 'Conocimiento', href: '/knowledge' },
];

export const UniversityHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-250 bg-background/80 backdrop-blur-sm",
        scrolled ? "py-2 shadow-md" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-primary">
          Molino
        </Link>
        <nav className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Ingresar
          </Button>
          <Button variant="primary" size="sm">
            Empezar
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
```

#### 2. Unificar Footer
```tsx
// components/layout/Footer.tsx
import Link from 'next/link';

const footerLinks = {
  Product: [
    { name: 'Características', href: '/features' },
    { name: 'Precios', href: '/pricing' },
    { name: 'Documentación', href: '/docs' },
  ],
  Company: [
    { name: 'Acerca de', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreras', href: '/careers' },
  ],
  Legal: [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Molino
            </Link>
            <p className="mt-4 text-sm text-muted">
              Descubrí quién sos a través de la numerología personalizada.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Molino. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
```

#### 3. Crear Layout principal
```tsx
// app/layout.tsx
import { Inter, Space_Grotesk } from 'next/font/google';
import { UniversityHeader } from '@/components/layout/UniversityHeader';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata = {
  title: 'Molino — Descubrí quién sos',
  description: 'Plataforma de numerología personalizada para descubrir tu esencia y conectar con tu propósito.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(inter.variable, spaceGrotesk.variable)}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <UniversityHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

#### 4. Unificar navegación
```ts
// lib/data/navigation.ts
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

export const mainNavigation: NavItem[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Mi Mapa', href: '/map' },
  { name: 'Explorar', href: '/explore' },
  { name: 'Conocimiento', href: '/knowledge' },
  { name: 'Energía diaria', href: '/daily-energy' },
];

export const footerNavigation = {
  Product: [
    { name: 'Características', href: '/features' },
    { name: 'Precios', href: '/pricing' },
    { name: 'Documentación', href: '/docs' },
  ],
  Company: [
    { name: 'Acerca de', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreras', href: '/careers' },
  ],
  Legal: [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
};
```

#### 5. Crear Mobile menu
```tsx
// components/layout/MobileMenu.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { mainNavigation } from '@/lib/data/navigation';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          <nav className="flex flex-col p-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Ingresar
              </Button>
              <Button variant="primary" size="sm" className="w-full mt-2">
                Empezar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
```

### Archivos afectados
- `components/layout/*`
- `app/layout.tsx`
- `lib/data/navigation.ts`
- `app/globals.css`

---

## Sprint 4 — Home (P0)

**Objetivo:** Implementar el rediseño de Home siguiendo el documento de la Fase 5.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Crear NumeroDia.tsx (Cap 1) | `components/sections/NumeroDia.tsx` | P0 |
| 2 | Crear TresPasos.tsx (Cap 2) | `components/sections/TresPasos.tsx` | P0 |
| 3 | Crear QueDescubrís.tsx (Cap 3) | `components/sections/QueDescubrís.tsx` | P0 |
| 4 | Crear SystemsPreview.tsx (Cap 4) | `components/sections/SystemsPreview.tsx` | P0 |
| 5 | Crear MapPreview.tsx (Cap 5) | `components/sections/MapPreview.tsx` | P0 |
| 6 | Crear Explore.tsx (Cap 6) | `components/sections/Explore.tsx` | P0 |
| 7 | Crear CTAFinal.tsx (Cap 7) | `components/sections/CTAFinal.tsx` | P0 |
| 8 | Actualizar page.tsx | `app/page.tsx` | P0 |
| 9 | Remover componentes obsoletos | `components/sections/*` | P0 |

### Detalle de tareas

#### 1. NumeroDia.tsx (Capítulo 1 — "Descubrí quién sos")
```tsx
// components/sections/NumeroDia.tsx
import { Button } from '@/components/ui/Button';

export const NumeroDia = () => {
  const numeroDelDia = 7; // Calcular dinámicamente
  const invitacion = "tu número de hoy te invita a la introspección";

  return (
    <section className="py-16 md:py-24 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
          NÚMERO DEL DÍA
        </p>
        <div className="text-6xl md:text-8xl font-bold text-primary mb-6">
          {numeroDelDia}
        </div>
        <p className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto mb-8">
          {invitacion}
        </p>
        <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
          Empezá
        </Button>
      </div>
    </section>
  );
};
```

#### 2. TresPasos.tsx (Capítulo 2 — "¿Cómo funciona?")
```tsx
// components/sections/TresPasos.tsx
import { motion } from 'framer-motion';

const steps = [
  { number: 1, title: "Ingresá tu fecha", desc: "Tu fecha de nacimiento. Nada más." },
  { number: 2, title: "Generamos tu mapa", desc: "Tres sistemas convergen en una lectura." },
  { number: 3, title: "Descubrí tu identidad", desc: "Número, mundo, círculo. Todo en un lugar." },
];

export const TresPasos = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### 3. QueDescubrís.tsx (Capítulo 3 — "Qué vas a descubrir")
```tsx
// components/sections/QueDescubrís.tsx
const benefits = [
  {
    icon: "🎯",
    title: "Comprendé cómo tomás decisiones",
    desc: "Tu número y cómo se traduce en elecciones reales",
  },
  {
    icon: "🤝",
    title: "Conectá con tu entorno",
    desc: "Lo que tu energía dice sobre tus vínculos",
  },
  {
    icon: "🧭",
    title: "Orientate con claridad",
    desc: "Un mapa para moverte, no para quedarte mirando",
  },
];

export const QueDescubrís = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Qué vas a descubrir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### 4. SystemsPreview.tsx (Capítulo 4 — "¿Por qué Molino?")
```tsx
// components/sections/SystemsPreview.tsx
import { Button } from '@/components/ui/Button';

const systems = [
  {
    name: "Numerología",
    input: "Tu fecha",
    output: "números → patrones",
    desc: "Directo, cuantificable.",
  },
  {
    name: "Astrología",
    input: "Tu lugar y hora de nacimiento",
    output: "mapa astral",
    desc: "Geográfico, visual.",
  },
  {
    name: "Zodiaco Chino",
    input: "Tu año de nacimiento",
    output: "animal → ciclo",
    desc: "Tradicional, simbólico.",
  },
];

export const SystemsPreview = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ¿Por qué Molino?
        </h2>
        <div className="space-y-12 max-w-3xl mx-auto">
          {systems.map((system, index) => (
            <div key={system.name} className="border-l-2 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-1">{system.name}</h3>
              <p className="text-sm text-muted mb-2">
                {system.input} → {system.output}
              </p>
              <p className="text-sm text-muted">{system.desc}</p>
            </div>
          ))}
          <div className="text-center pt-8">
            <p className="text-lg text-foreground mb-6">
              Tres lenguajes, una misma persona.
            </p>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Ver mi mapa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### 5. MapPreview.tsx (Capítulo 5 — "Así es tu mapa")
```tsx
// components/sections/MapPreview.tsx
export const MapPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Así es tu mapa
        </h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Desktop mockup */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4">Identidad</h3>
            <p className="text-sm text-muted mb-6">
              Número de vida: <strong>7</strong><br />
              Esencia: introspección y análisis
            </p>
            <h3 className="text-xl font-semibold mb-4">Mundo</h3>
            <p className="text-sm text-muted mb-6">
              Elemento dominante: <strong>Tierra</strong><br />
              Tu lugar en el entorno: estable, raíces profundas
            </p>
            <h3 className="text-xl font-semibold mb-4">Círculo</h3>
            <p className="text-sm text-muted">
              Conexiones clave con: [3 entidades]<br />
              Resonancia más fuerte con: [1 entidad]
            </p>
          </div>
          {/* Screens preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-sm text-muted">Energía diaria</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-sm text-muted">Afinidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### 6. Explore.tsx (Capítulo 6 — "Explorar")
```tsx
// components/sections/Explore.tsx
const exploreBlocks = [
  { icon: "🔢", title: "Numerología", desc: "Tu número de vida y qué revela de vos" },
  { icon: "🌍", title: "Astrología", desc: "Tu posición en el cosmos" },
  { icon: "🐉", title: "Zodiaco Chino", desc: "Tu animal, tu ciclo, tu año" },
];

const catalogTools = [
  "Lectura del mapa",
  "Energía diaria",
  "Afinidad",
  "Timing",
];

export const Explore = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explorá tu conocimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {exploreBlocks.map((block, index) => (
            <div key={index} className="border border-border rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{block.icon}</div>
              <h3 className="font-semibold mb-2">{block.title}</h3>
              <p className="text-sm text-muted">{block.desc}</p>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-center mb-4">Herramientas disponibles</h3>
          <ul className="grid grid-cols-2 gap-3 text-center">
            {catalogTools.map((tool) => (
              <li key={tool} className="text-sm text-muted">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
```

#### 7. CTAFinal.tsx (Capítulo 7 — "Tu mapa te espera")
```tsx
// components/sections/CTAFinal.tsx
import { Button } from '@/components/ui/Button';

export const CTAFinal = () => {
  return (
    <section className="py-16 md:py-24 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Tu mapa te espera.
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          Ya conocés los tres lenguajes de Molino. Numerología, astrología y zodíaco chino convergen en un solo lugar: tu identidad.
        </p>
        <p className="text-sm text-muted mb-8">
          No hay prisa. No hay presión. Solo una invitación a conocerte.
        </p>
        <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
          Crear mi mapa
        </Button>
      </div>
    </section>
  );
};
```

#### 8. Actualizar page.tsx
```tsx
// app/page.tsx
import { NumeroDia } from '@/components/sections/NumeroDia';
import { TresPasos } from '@/components/sections/TresPasos';
import { QueDescubrís } from '@/components/sections/QueDescubrís';
import { SystemsPreview } from '@/components/sections/SystemsPreview';
import { MapPreview } from '@/components/sections/MapPreview';
import { Explore } from '@/components/sections/Explore';
import { CTAFinal } from '@/components/sections/CTAFinal';

export default function HomePage() {
  return (
    <>
      <NumeroDia />
      <TresPasos />
      <QueDescubrís />
      <SystemsPreview />
      <MapPreview />
      <Explore />
      <CTAFinal />
    </>
  );
}
```

### Archivos afectados
- `components/sections/*` (7 nuevos componentes)
- `app/page.tsx`
- `components/ui/*` (referencias actualizadas)
- `components/sections/HeroNew.tsx` (remover)
- `components/sections/Journey.tsx` (remover)
- `components/sections/ToolsAndDiscovery.tsx` (remover)
- `components/sections/ConceptsIndex.tsx` (remover)

---

## Sprint 5 — Mi Mapa (P1)

**Objetivo:** Implementar la página de perfil/timeline según PAGES_REDESIGN.md.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Crear Calendar.tsx (Timeline) | `components/ui/Calendar.tsx` | P1 |
| 2 | Crear ProfileTimeline.tsx | `app/profile/[hash]/components/ProfileTimeline.tsx` | P1 |
| 3 | Crear DetailPanel.tsx | `app/profile/[hash]/components/DetailPanel.tsx` | P1 |
| 4 | Actualizar page.tsx | `app/profile/[hash]/page.tsx` | P1 |
| 5 | Crear IdentitySection.tsx | `app/profile/[hash]/components/IdentitySection.tsx` | P1 |
| 6 | Crear WorldSection.tsx | `app/profile/[hash]/components/WorldSection.tsx` | P1 |
| 7 | Crear CircleSection.tsx | `app/profile/[hash]/components/CircleSection.tsx` | P1 |

### Detalle de tareas

#### 1. Calendar.tsx (Timeline Component)
```tsx
// components/ui/Calendar.tsx
import { motion } from 'framer-motion';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  identity: { essence: string; number: number };
  world: { element: string; description: string };
  circle: { connections: string[]; resonance: string };
}

interface CalendarProps {
  events: TimelineEvent[];
  selectedEvent?: TimelineEvent;
  onSelect: (event: TimelineEvent) => void;
}

export const Calendar = ({ events, selectedEvent, onSelect }: CalendarProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.1 }}
          className={cn(
            "flex-shrink-0 w-32 cursor-pointer border border-border rounded-lg p-4 text-center transition-all",
            selectedEvent?.id === event.id
              ? "border-primary bg-primary/5 shadow-md"
              : "hover:border-accent hover:bg-accent/5"
          )}
          onClick={() => onSelect(event)}
        >
          <div className="text-xs text-muted mb-2">{event.date}</div>
          <div className="w-16 h-16 bg-muted/20 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg">📅</span>
          </div>
          <div className="text-xs font-medium">{event.title}</div>
        </motion.div>
      ))}
    </div>
  );
};
```

#### 2. ProfileTimeline.tsx
```tsx
// app/profile/[hash]/components/ProfileTimeline.tsx
import { Calendar } from '@/components/ui/Calendar';
import { DetailPanel } from './DetailPanel';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  identity: { essence: string; number: number };
  world: { element: string; description: string };
  circle: { connections: string[]; resonance: string };
}

export const ProfileTimeline = ({ events }: { events: TimelineEvent[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(events[0]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/5">
        <Calendar
          events={events}
          selectedEvent={selectedEvent || undefined}
          onSelect={setSelectedEvent}
        />
      </div>
      <div className="md:w-3/5">
        <DetailPanel event={selectedEvent} />
      </div>
    </div>
  );
};
```

#### 3. DetailPanel.tsx
```tsx
// app/profile/[hash]/components/DetailPanel.tsx
import { IdentitySection } from './IdentitySection';
import { WorldSection } from './WorldSection';
import { CircleSection } from './CircleSection';
import { Button } from '@/components/ui/Button';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  identity: { essence: string; number: number };
  world: { element: string; description: string };
  circle: { connections: string[]; resonance: string };
}

export const DetailPanel = ({ event }: { event: TimelineEvent | null }) => {
  if (!event) {
    return (
      <div className="bg-card border border-border rounded-xl p-8">
        <p className="text-muted">Seleccioná un evento para ver los detalles.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
        <p className="text-sm text-muted">{event.date}</p>
      </div>
      <div className="space-y-6">
        <IdentitySection identity={event.identity} />
        <WorldSection world={event.world} />
        <CircleSection circle={event.circle} />
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Ver mi mapa completo
        </Button>
      </div>
    </div>
  );
};
```

#### 4. IdentitySection.tsx
```tsx
// app/profile/[hash]/components/IdentitySection.tsx
export const IdentitySection = ({ identity }: { identity: { essence: string; number: number } }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
        Identidad
      </h4>
      <p className="text-lg font-medium mb-1">
        Número de vida: <strong>{identity.number}</strong>
      </p>
      <p className="text-sm text-muted">
        Esencia: {identity.essence}
      </p>
    </div>
  );
};
```

#### 5. WorldSection.tsx
```tsx
// app/profile/[hash]/components/WorldSection.tsx
export const WorldSection = ({ world }: { world: { element: string; description: string } }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
        Mundo
      </h4>
      <p className="text-lg font-medium mb-1">
        Elemento dominante: <strong>{world.element}</strong>
      </p>
      <p className="text-sm text-muted">
        {world.description}
      </p>
    </div>
  );
};
```

#### 6. CircleSection.tsx
```tsx
// app/profile/[hash]/components/CircleSection.tsx
export const CircleSection = ({ circle }: { circle: { connections: string[]; resonance: string } }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
        Círculo
      </h4>
      <p className="text-sm text-muted mb-2">
        Conexiones clave con: {circle.connections.join(', ')}
      </p>
      <p className="text-sm text-muted">
        Resonancia más fuerte con: <strong>{circle.resonance}</strong>
      </p>
    </div>
  );
};
```

#### 7. Actualizar page.tsx
```tsx
// app/profile/[hash]/page.tsx
import { ProfileTimeline } from './components/ProfileTimeline';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const mockEvents = [
  {
    id: '1',
    date: '15 de marzo, 1990',
    title: 'Nacimiento',
    description: 'Tu primer día en este mundo.',
    identity: { essence: 'introspección y análisis', number: 7 },
    world: { element: 'Tierra', description: 'estable, raíces profundas' },
    circle: { connections: ['Luna', 'Mercurio', 'Venus'], resonance: 'Luna' },
  },
  // ... más eventos
];

export default function ProfilePage({ params }: { params: { hash: string } }) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[
          { name: 'Perfil', href: '/profile' },
          { name: 'Timeline', href: `/profile/${params.hash}` },
        ]} />
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-2">Mi Mapa</h1>
          <p className="text-muted mb-8">
            Su mapa de vida, a su tiempo y lugar.
          </p>
          <ProfileTimeline events={mockEvents} />
        </div>
      </div>
    </div>
  );
}
```

### Archivos afectados
- `components/ui/Calendar.tsx` (nuevo)
- `app/profile/[hash]/components/*` (4 nuevos componentes)
- `app/profile/[hash]/page.tsx`
- `components/ui/Breadcrumbs.tsx` (reutilizado)

---

## Sprint 6 — Afinidad (P1)

**Objetivo:** Implementar la página de afinidad según PAGES_REDESIGN.md.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Crear AffinityFilters.tsx | `app/affinity/components/AffinityFilters.tsx` | P1 |
| 2 | Crear AffinityGrid.tsx | `app/affinity/components/AffinityGrid.tsx` | P1 |
| 3 | Crear AffinityCard.tsx | `app/affinity/components/AffinityCard.tsx` | P1 |
| 4 | Crear ComparisonView.tsx | `app/affinity/components/ComparisonView.tsx` | P1 |
| 5 | Actualizar page.tsx | `app/affinity/page.tsx` | P1 |

### Detalle de tareas

#### 1. AffinityFilters.tsx
```tsx
// app/affinity/components/AffinityFilters.tsx
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';

const affinityTypes = [
  { id: 'romantic', label: 'Romántica' },
  { id: 'friendship', label: 'Amistad' },
  { id: 'professional', label: 'Profesional' },
  { id: 'creative', label: 'Creativa' },
];

export const AffinityFilters = ({ 
  selectedTypes, 
  onTypeToggle,
  onClearAll 
}: {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClearAll: () => void;
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {affinityTypes.map((type) => (
          <Chip
            key={type.id}
            selected={selectedTypes.includes(type.id)}
            onClick={() => onTypeToggle(type.id)}
          >
            {type.label}
          </Chip>
        ))}
      </div>
      {selectedTypes.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};
```

#### 2. AffinityGrid.tsx
```tsx
// app/affinity/components/AffinityGrid.tsx
import { motion } from 'framer-motion';
import { AffinityCard } from './AffinityCard';

interface Affinity {
  id: string;
  name: string;
  avatar: string;
  score: number;
  badges: string[];
  location: string;
}

export const AffinityGrid = ({ 
  affinities,
  selectedAffinities,
  onSelect 
}: {
  affinities: Affinity[];
  selectedAffinities: string[];
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {affinities.map((affinity, index) => (
        <motion.div
          key={affinity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.1 }}
        >
          <AffinityCard
            affinity={affinity}
            selected={selectedAffinities.includes(affinity.id)}
            onSelect={() => onSelect(affinity.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};
```

#### 3. AffinityCard.tsx
```tsx
// app/affinity/components/AffinityCard.tsx
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Affinity {
  id: string;
  name: string;
  avatar: string;
  score: number;
  badges: string[];
  location: string;
}

export const AffinityCard = ({ 
  affinity, 
  selected, 
  onSelect 
}: {
  affinity: Affinity;
  selected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      className={cn(
        "border rounded-xl p-6 cursor-pointer transition-all duration-150",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-accent hover:bg-accent/5"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-muted/20 rounded-full flex-shrink-0" />
        <div>
          <h3 className="font-semibold">{affinity.name}</h3>
          <p className="text-sm text-muted">{affinity.location}</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Afinidad</span>
          <span className="font-bold text-primary">{affinity.score}%</span>
        </div>
        <div className="w-full bg-muted/20 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${affinity.score}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {affinity.badges.map((badge) => (
          <Badge key={badge} variant="secondary" size="sm">
            {badge}
          </Badge>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="w-full">
        Ver detalles →
      </Button>
    </div>
  );
};
```

#### 4. ComparisonView.tsx
```tsx
// app/affinity/components/ComparisonView.tsx
import { Button } from '@/components/ui/Button';

interface Affinity {
  id: string;
  name: string;
  score: number;
  traits: string[];
}

export const ComparisonView = ({ 
  affinityA, 
  affinityB 
}: {
  affinityA: Affinity | null;
  affinityB: Affinity | null;
}) => {
  if (!affinityA || !affinityB) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted">Seleccioná dos afinidades para comparar.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h3 className="text-xl font-semibold mb-6">Comparación</h3>
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h4 className="font-medium mb-4">{affinityA.name}</h4>
          <ul className="space-y-2 text-sm">
            {affinityA.traits.map((trait) => (
              <li key={trait} className="text-muted">{trait}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.abs(affinityA.score - affinityB.score)}%
            </div>
            <p className="text-sm text-muted">Diferencia</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-4">{affinityB.name}</h4>
          <ul className="space-y-2 text-sm">
            {affinityB.traits.map((trait) => (
              <li key={trait} className="text-muted">{trait}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <Button variant="primary" className="w-full">
          Comparar seleccionadas →
        </Button>
      </div>
    </div>
  );
};
```

#### 5. Actualizar page.tsx
```tsx
// app/affinity/page.tsx
import { useState } from 'react';
import { AffinityFilters } from './components/AffinityFilters';
import { AffinityGrid } from './components/AffinityGrid';
import { ComparisonView } from './components/ComparisonView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const mockAffinities = [
  {
    id: '1',
    name: 'María Gómez',
    avatar: '',
    score: 87,
    badges: ['Introvertida', 'Creativa', 'Analítica'],
    location: 'Buenos Aires, Argentina',
    traits: ['Introspección', 'Creatividad', 'Análisis'],
  },
  {
    id: '2',
    name: 'Juan Pérez',
    avatar: '',
    score: 76,
    badges: ['Extrovertida', 'Espontánea', 'Líder'],
    location: 'Córdoba, Argentina',
    traits: ['Expresión', 'Acción', 'Comunicación'],
  },
  // ... más afinidades
];

export default function AffinityPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAffinities, setSelectedAffinities] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleSelect = (id: string) => {
    setSelectedAffinities(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id) 
        : [...prev, id]
    );
  };

  const affinityA = selectedAffinities[0] 
    ? mockAffinities.find(a => a.id === selectedAffinities[0]) 
    : null;
  const affinityB = selectedAffinities[1] 
    ? mockAffinities.find(a => a.id === selectedAffinities[1]) 
    : null;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[
          { name: 'Inicio', href: '/' },
          { name: 'Afinidad', href: '/affinity' },
        ]} />
        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold mb-2">Afinidad</h1>
          <p className="text-muted">
            Encontrá a alguien como vos, pero con una historia ligeramente diferente.
          </p>
        </div>
        <div className="mb-8">
          <AffinityFilters
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
            onClearAll={() => setSelectedTypes([])}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AffinityGrid
              affinities={mockAffinities}
              selectedAffinities={selectedAffinities}
              onSelect={handleSelect}
            />
          </div>
          <div>
            <ComparisonView 
              affinityA={affinityA || null} 
              affinityB={affinityB || null} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Archivos afectados
- `app/affinity/components/*` (4 nuevos componentes)
- `app/affinity/page.tsx`
- `components/ui/Chip.tsx` (nuevo)
- `components/ui/Badge.tsx` (reutilizado)
- `components/ui/Breadcrumbs.tsx` (reutilizado)
- `components/layout/*`
- `components/ui/*`
- `tailwind.config.ts`

---

## Sprint 7 — QA y Consistencia (P0)

**Objetivo:** Realizar auditoría final y corregir inconsistencias.

### Tareas

| # | Tarea | Archivos afectados | Prioridad |
|---|---|---|---|
| 1 | Auditoría de espaciados | `src/` | P0 |
| 2 | Auditoría de radios | `src/` | P0 |
| 3 | Auditoría de tipografía | `src/` | P0 |
| 4 | Auditoría de colores | `src/` | P0 |
| 5 | Auditoría de componentes | `src/` | P0 |
| 6 | Test de accesibilidad | `src/` | P0 |
| 7 | Test de rendimiento | `src/` | P0 |
| 8 | Test cross-browser | `src/` | P0 |

### Archivos afectados
- Todos los archivos en `src/`

---

## Prioridades

| Prioridad | Descripción |
|---|---|
| P0 | Crítico para lanzamiento |
| P1 | Importante para experiencia |
| P2 | Mejora continua |
| P3 | Nice to have |

## Timeline estimado

| Sprint | Duración | Fechas |
|---|---|---|
| Sprint 1 — Foundation | 3 días | |
| Sprint 2 — Componentes Base | 4 días | |
| Sprint 3 — Layout y Navegación | 3 días | |
| Sprint 4 — Homepage Redesign | 5 días | |
| Sprint 5 — Motion & Polish | 3 días | |
| Sprint 6 — Mobile First | 3 días | |
| Sprint 7 — QA y Consistencia | 4 días | |
| **Total** | **25 días** | |

## Comandos de verificación

```bash
# Build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Test
npm run test

# Lighthouse
npm run lighthouse
```