import type { Config } from "tailwindcss";
import twColors from "tailwindcss/colors";

// El sitio es blanco y negro. Las paletas con tono de Tailwind (emerald-600,
// red-500, amber-100…) que quedan sueltas en componentes se reemplazan acá
// por el gris de la MISMA luminancia relativa: el contraste WCAG depende solo
// de la luminancia, así que ningún texto queda menos legible que antes.
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (y: number) => (y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055);
function toGray(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const v = Math.round(fromLinear(0.2126 * r + 0.7152 * g + 0.0722 * b) * 255);
  const h = v.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}
const HUES = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "stone"] as const;
const grayHues = Object.fromEntries(
  HUES.map((name) => [
    name,
    Object.fromEntries(Object.entries(twColors[name] as Record<string, string>).map(([shade, hex]) => [shade, toGray(hex)])),
  ]),
);

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "var(--font-emoji)", "Georgia", "serif"],
        heading: ["var(--font-heading)", "var(--font-emoji)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-emoji)", "Georgia", "serif"],
        // `font-serif` también es Garamond: sin esto caía en la serif del
        // sistema (Georgia / Noto Serif) y Mi Mapa mezclaba dos letras.
        serif: ["var(--font-sans)", "var(--font-emoji)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "var(--font-emoji)", "Georgia", "serif"],
      },
      fontSize: {
        // Escala tipográfica — alineada con DESIGN.md.
        // Monotónica y coherente: cada nivel crece sobre el anterior.
        // Garamond tiene el ojo medio chico: los tamaños de texto suben medio
        // escalón para leerse como Source Serif/Inter se leían antes.
        xs: "0.8125rem",    // 13px — labels pequeños
        sm: "0.9375rem",    // 15px — Caption
        base: "1.0625rem",  // 17px — Body
        lg: "1.1875rem",    // 19px — Body Large
        xl: "1.25rem",      // 20px
        "2xl": "1.5rem",    // 24px
        "3xl": "1.75rem",   // 28px — H3
        "4xl": "2.25rem",   // 36px — H2
        "5xl": "3rem",      // 48px — H1
        "6xl": "3.75rem",   // 60px
        "7xl": "4.5rem",    // 72px — Display
        "8xl": "6rem",      // 96px
      },
      letterSpacing: {
        tight: "var(--tracking-tight)",
        label: ".2em",
      },
      spacing: {
        section: "var(--section-padding)",
        card: "var(--card-padding)",
        "grid-gap": "var(--grid-gap)",
        "space-xs": "var(--space-xs)",
        "space-sm": "var(--space-sm)",
        "space-md": "var(--space-md)",
        "space-lg": "var(--space-lg)",
        "space-xl": "var(--space-xl)",
        "space-2xl": "var(--space-2xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      colors: {
        ...grayHues,
        // background/foreground/muted/ink/paper/accent(+light) usan el patrón
        // rgb(var(--x-rgb) / <alpha-value>) para que las utilidades con
        // modificador de opacidad (ej. text-paper/70, bg-ink/10) generen CSS
        // válido — con var(--x) en hex plano, Tailwind no puede aplicar la
        // opacidad y la clase queda sin efecto (ver globals.css).
        background: "rgb(var(--color-paper-rgb) / <alpha-value>)",
        foreground: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        "muted-foreground": "rgb(var(--color-muted-rgb) / <alpha-value>)",
        card: "var(--color-card)",
        "card-border": "var(--color-card-border)",
        border: "var(--color-border)",
        primary: {
          DEFAULT: "rgb(var(--color-ink-rgb) / <alpha-value>)",
          foreground: "rgb(var(--color-paper-rgb) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-muted-rgb) / <alpha-value>)",
          foreground: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent-rgb) / <alpha-value>)",
          foreground: "var(--color-accent-foreground)",
          hover: "var(--color-accent-hover)",
          light: "rgb(var(--color-accent-light-rgb) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold-rgb) / <alpha-value>)",
          foreground: "var(--color-gold-foreground)",
          hover: "var(--color-gold-hover)",
        },
        accentHover: "var(--color-accent-hover)",
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-foreground)",
        },
        vermilion: {
          DEFAULT: "rgb(var(--color-vermilion-rgb) / <alpha-value>)",
          hover: "var(--color-vermilion-hover)",
        },
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        paper: "rgb(var(--color-paper-rgb) / <alpha-value>)",
        "paper-alt": "var(--color-paper-alt)",
        // Element colors
        "element-fire": "var(--element-fire)",
        "element-earth": "var(--element-earth)",
        "element-air": "var(--element-air)",
        "element-water": "var(--element-water)",
        "element-metal": "var(--element-metal)",
        "element-wood": "var(--element-wood)",
        // Layer colors
        "layer-identity": "var(--layer-identity)",
        "layer-patterns": "var(--layer-patterns)",
        "layer-numerology": "var(--layer-numerology)",
        "layer-astrology": "var(--layer-astrology)",
        "layer-cycles": "var(--layer-cycles)",
        "layer-moment": "var(--layer-moment)",
        // Score colors
        "score-excellent": "var(--score-excellent)",
        "score-good": "var(--score-good)",
        "score-neutral": "var(--score-neutral)",
        "score-poor": "var(--score-poor)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inner: "var(--shadow-inner)",
      },
      maxWidth: {
        content: "var(--max-width-content)",
        wide: "var(--max-width-wide)",
        layout: "var(--max-width-layout)",
        article: "var(--max-width-article)",
        // `8xl` solo existía bajo fontSize, no acá: las ~69 utilidades
        // `max-w-8xl` repartidas por el sitio (todo /profile, EditorialSection,
        // header y footer) no generaban NINGUNA regla CSS, así que esos
        // contenedores corrían a ancho completo del viewport. 90rem continúa
        // la progresión de Tailwind sobre 7xl (80rem) y es el valor que la
        // clase daba a entender: por debajo de 1440px no cambia nada, y arriba
        // deja de haber líneas de 200+ caracteres.
        "8xl": "90rem",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};

export default config;
