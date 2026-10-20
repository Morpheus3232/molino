// Dev-only allowance so impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

// Dev-only: React's dev-mode tooling (owner stacks / warning stack traces)
// calls eval() internally. Without this the CSP silently blocks it and
// hydration can hang with zero visible error — "React will never use
// eval() in production mode", so this never reaches prod builds.
const __devEval =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

/** @type {import('next').NextConfig} */
// Orden zodiacal: el mismo de SIGN_SLUGS en lib/seo/programmatic.ts.
const SIGNOS = ['aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'];

// /compatibility/<id viejo> → /affinity/<tipo>/<id del Atlas>, emparejados por
// nombre con lib/data/entities.ts (2026-10-19). Los que no existen en el Atlas
// (sushi, the-office, fire…) siguen cayendo en /affinity.
const LEGACY_COMPATIBILITY = { 'argentina': 'country/argentina', 'brasil': 'country/brasil', 'chile': 'country/chile', 'colombia': 'country/colombia', 'mexico': 'country/mexico', 'peru': 'country/peru', 'uruguay': 'country/uruguay', 'espana': 'country/espana', 'francia': 'country/francia', 'alemania': 'country/alemania', 'italia': 'country/italia', 'reino-unido': 'country/reino-unido', 'estados-unidos': 'country/usa', 'canada': 'country/canada', 'australia': 'country/australia', 'china': 'country/china', 'japan': 'country/japon', 'india': 'country/india', 'egipto': 'country/egipto', 'portugal': 'country/portugal', 'grecia': 'country/grecia', 'south-africa': 'country/sudafrica', 'south-korea': 'country/corea-sur', 'netherlands': 'country/paises-bajos', 'buenos-aires': 'city/buenos-aires', 'madrid': 'city/madrid', 'ciudad-de-mexico': 'city/cdmx', 'paris': 'city/paris-city', 'london': 'city/londres', 'barcelona': 'city/barcelona', 'berlin': 'city/berlin', 'apple': 'brand/apple-tech', 'google': 'brand/google', 'microsoft': 'brand/microsoft', 'amazon': 'brand/amazon', 'tesla': 'brand/tesla-autos', 'netflix': 'brand/netflix', 'nike': 'brand/nike-brand', 'adidas': 'brand/adidas', 'coca-cola': 'brand/coca-cola-beverage', 'soda-stereo': 'artist/soda-stereo', 'titanic': 'movie/titanic', 'matrix': 'movie/matrix', 'sydney': 'city/sydney' };

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'molino.app',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    // Las portadas del blog (public/blog/*.svg) son SVGs propios, servidos
    // desde el mismo dominio. `dangerouslyAllowSVG` habilita que next/image
    // las optimice/sirva; la CSP `sandbox` impide que un SVG malicioso ejecute
    // scripts dentro de la imagen. Solo se aplica a nuestros assets estáticos.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    // `removeConsole: true` se comía console.error también, dejando errores
    // de runtime (ej. webhooks de Mercado Pago) sin ningún rastro en los
    // logs de producción. Con `exclude: ['error']` los console.log/warn de
    // debug siguen fuera del bundle, pero console.error sí llega a Vercel.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      // Un par de signos = una URL (/compatibilidad, orden zodiacal). El par
      // invertido y la vieja /sinastria/a/b (duplicado, eliminado 2026-10-19)
      // redirigen ahí; la sinastría invertida llega en dos saltos.
      { source: '/sinastria/:a/:b', destination: '/compatibilidad/:a-:b', permanent: true },
      ...SIGNOS.flatMap((a, i) => SIGNOS.slice(0, i).map((b) => ({
        source: `/compatibilidad/${a}-${b}`, destination: `/compatibilidad/${b}-${a}`, permanent: true,
      }))),
      { source: '/principios', destination: '/filosofia', permanent: true },
      // /transparencia se eliminó (2026-10-17); lo que importa de ella vive en /filosofia.
      { source: '/transparencia', destination: '/filosofia', permanent: true },
      // Los equipos de fútbol salieron del sitio (2026-10-20): sus 91 fichas,
      // la categoría y las listas del Atlas van a la página padre.
      { source: '/affinity/team', destination: '/affinity', permanent: true },
      { source: '/affinity/team/:path*', destination: '/affinity', permanent: true },
      { source: '/atlas/:iso/team', destination: '/atlas/:iso', permanent: true },
      { source: '/atlas/explorar/:animal/team', destination: '/atlas/explorar/:animal', permanent: true },
      { source: '/patterns', destination: '/profile', permanent: true },
      { source: '/synthesis', destination: '/profile', permanent: true },
      // Ids que descarta el dedup del atlas → la ficha que sobrevivió (generado,
      // ver lib/data/__tests__/entity-redirects.test.ts).
      ...require('./lib/data/entity-redirects.json').map((r) => ({ ...r, permanent: true })),
      // Variantes que la gente tipea del signo: sin tilde, y "conejo" (el sitio usa Gato).
      { source: '/conocimiento/zodiaco-chino/dragon', destination: '/conocimiento/zodiaco-chino/drag%C3%B3n', permanent: true },
      { source: '/conocimiento/zodiaco-chino/conejo', destination: '/conocimiento/zodiaco-chino/gato', permanent: true },

      // ── Fase 3 — consolidación de IA (ver docs/ROUTE_CONSOLIDATION_PLAN.md) ──
      // Stubs de redirect client-side (malos para SEO) → 301 server-side.
      { source: '/portal', destination: '/explore', permanent: true },
      { source: '/for-you', destination: '/profile', permanent: true },
      { source: '/alignment', destination: '/profile', permanent: true },
      // "¿Debería hacer X?" pasó a ser una consulta de IA.
      { source: '/decisions', destination: '/ai', permanent: true },
      // Metodología: `/method` (nombre en inglés, wrapper delgado) y
      // `/conocimiento/fuentes` (thin) → sus equivalentes canónicos.
      { source: '/method', destination: '/metodos-y-fuentes', permanent: true },
      { source: '/conocimiento/fuentes', destination: '/biblioteca', permanent: true },
      // Superficies integradas a la síntesis / al mapa.
      { source: '/nudo', destination: '/lectura', permanent: true },
      { source: '/linea', destination: '/evolution', permanent: true },
      { source: '/profile/insights', destination: '/profile', permanent: true },
      // Familia `/compatibility/*` → `/affinity/*` (misma dirección que `/entities/[id]`).
      { source: '/compatibility/brands', destination: '/affinity/brand', permanent: true },
      { source: '/compatibility/countries', destination: '/affinity/country', permanent: true },
      // Wildcard para el resto de URLs legacy (142+ combinaciones y
      // entidades que ya no existen) — evita 404s; el usuario llega
      // al hub en vez de a una página de error.
      // Cada entidad vieja que existe en el Atlas va a su propia ficha, no al
      // hub: un redirect masivo a una página genérica Google lo trata como soft 404.
      ...Object.entries(LEGACY_COMPATIBILITY).map(([slug, target]) => ({
        source: `/compatibility/${slug}`, destination: `/affinity/${target}`, permanent: true,
      })),
      { source: '/compatibility/:path*', destination: '/affinity', permanent: true },
      // /precios redirige permanente a /premium: el pricing ladder de 3
      // planes se pausó; un solo pago de $8 desbloquea todo.
      { source: '/precios', destination: '/premium', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.mercadopago.com")',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
`script-src 'self' 'unsafe-inline' https://js.mercadopago.com${__impeccableLiveDev}${__devEval}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://*.vercel.app https://molino.app https://*.mercadopago.com https://logo.clearbit.com https://upload.wikimedia.org",
          "font-src 'self'",
`connect-src 'self' https://api.mercadopago.com https://*.mercadopago.com${__impeccableLiveDev}`,
          "frame-src 'self' https://www.mercadopago.com.ar https://www.mercadopago.com https://checkout.mercadopago.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Las imágenes de OG son archivos, no páginas: Search Console las listaba
      // como "rastreada, sin indexar" (~115 de 128). Las redes las siguen leyendo.
      ...['/opengraph-image', '/:path*/opengraph-image'].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      })),
      {
        source: '/(fonts|manifest|favicon|apple-touch-icon)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

// Bundle analysis (opt-in): ANALYZE=true npm run analyze.
const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

module.exports = withBundleAnalyzer(nextConfig);
