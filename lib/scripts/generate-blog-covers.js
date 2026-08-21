// Generador de SVG para portadas de blog consistentes con marca Molino
// Uso: node lib/scripts/generate-blog-covers.js

const fs = require("fs");
const path = require("path");

// Paleta de marca Molino
const BRAND = {
  paper: "#F5F0E4",
  ink: "#241F17",
  accent: "#9A4A18", // Terracota
  gold: "#F5B022",
  muted: "#6B6252",
};

// Temas por categoría
const CATEGORY_THEMES = {
  Numerología: {
    accentColor: "#9A4A18",
    glowColor: "rgba(154, 74, 24, 0.15)",
    emoji: "🔢",
  },
  Astrología: {
    accentColor: "#F5B022",
    glowColor: "rgba(245, 176, 34, 0.15)",
    emoji: "⭐",
  },
  "Zodiaco Chino": {
    accentColor: "#7C3AED",
    glowColor: "rgba(124, 58, 237, 0.15)",
    emoji: "🐲",
  },
  Autoconocimiento: {
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.15)",
    emoji: "🪞",
  },
};

// Posts con data
const BLOG_POSTS = [
  {
    slug: "numero-de-vida-1",
    title: "Número de Vida",
    subtitle: "La cifra central de tu fecha",
    category: "Numerología",
  },
  {
    slug: "numero-de-vida-2",
    title: "Números de Poder",
    subtitle: "El 28 y 8 en tu mapa",
    category: "Numerología",
  },
  {
    slug: "numero-de-vida-3",
    title: "Número del Día",
    subtitle: "Tu energía hoy",
    category: "Numerología",
  },
  {
    slug: "signo-solar",
    title: "Signo Solar",
    subtitle: "Tu signo astrológico",
    category: "Astrología",
  },
  {
    slug: "zodiaco-chino-intro",
    title: "Zodiaco Chino",
    subtitle: "12 animales, 12 energías",
    category: "Zodiaco Chino",
  },
  {
    slug: "compatibilidad",
    title: "Compatibilidad",
    subtitle: "Cómo vibran dos mapas",
    category: "Autoconocimiento",
  },
];

function generateSVG(post) {
  const theme = CATEGORY_THEMES[post.category];
  if (!theme) {
    console.warn(`Unknown category: ${post.category}`);
    return null;
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${BRAND.paper}"/>
  
  <!-- Decorative glow circles (top-right & bottom-left) -->
  <circle cx="1000" cy="80" r="280" fill="${theme.glowColor}"/>
  <circle cx="150" cy="520" r="220" fill="${theme.glowColor}"/>
  
  <!-- Category label -->
  <text 
    x="80" 
    y="110" 
    font-family="'SF Pro Display', -apple-system, sans-serif" 
    font-size="24" 
    letter-spacing="3" 
    fill="${theme.accentColor}" 
    font-weight="700"
    text-transform="uppercase"
  >${post.category}</text>
  
  <!-- Category emoji -->
  <text 
    x="1080" 
    y="130" 
    font-family="'Apple Color Emoji', Arial, sans-serif"
    font-size="72"
  >${theme.emoji}</text>
  
  <!-- Main title -->
  <text 
    x="80" 
    y="340" 
    font-family="'Merriweather', serif" 
    font-size="96" 
    fill="${BRAND.ink}" 
    font-weight="800"
    letter-spacing="-2"
  >${post.title}</text>
  
  <!-- Subtitle -->
  <text 
    x="80" 
    y="410" 
    font-family="'SF Pro Display', -apple-system, sans-serif" 
    font-size="44" 
    fill="${BRAND.muted}"
    font-weight="400"
  >${post.subtitle}</text>
  
  <!-- Molino logo/mark (minimalist line) -->
  <line x1="80" y1="520" x2="200" y2="520" stroke="${theme.accentColor}" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Footer text -->
  <text 
    x="80" 
    y="580" 
    font-family="'SF Pro Display', -apple-system, sans-serif" 
    font-size="16" 
    letter-spacing="1" 
    fill="${BRAND.muted}" 
    font-weight="500"
    text-transform="uppercase"
  >molino.app</text>
</svg>`;

  return svg;
}

// Generate all covers
BLOG_POSTS.forEach((post) => {
  const svg = generateSVG(post);
  if (svg) {
    const filePath = path.join(__dirname, `../../public/blog/${post.slug}.svg`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, svg);
    console.log(`✓ Generated ${post.slug}.svg`);
  }
});

console.log(`✓ All ${BLOG_POSTS.length} blog covers generated with consistent Molino branding`);
