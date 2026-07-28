import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        serif: ["var(--font-serif-accent)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: "var(--step-1-text)",
        sm: "var(--step-2-text)",
        base: "var(--step-3-text)",
        lg: "var(--step-4-text)",
        xl: "var(--step-5-text)",
        "2xl": "2rem",
        "3xl": "3rem",
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
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        card: "var(--color-card)",
        "card-border": "var(--color-card-border)",
        border: "var(--color-border)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
          hover: "var(--color-accent-hover)",
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
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        cream: "var(--color-cream)",
        warm: "var(--color-warm)",
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
        "glow": "var(--shadow-glow)",
        "glow-accent": "var(--shadow-glow-accent)",
        inner: "var(--shadow-inner)",
      },
      maxWidth: {
        content: "var(--max-width-content)",
        wide: "var(--max-width-wide)",
        layout: "var(--max-width-layout)",
        article: "var(--max-width-article)",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};

export default config;
