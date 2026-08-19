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
      {
        source: '/principios',
        destination: '/filosofia',
        permanent: true,
      },
      {
        source: '/patterns',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/synthesis',
        destination: '/profile',
        permanent: true,
      },
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
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.mercadopago.com" "https://www.paypal.com")',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
`script-src 'self' 'unsafe-inline' https://js.mercadopago.com https://www.paypal.com https://*.paypal.com${__impeccableLiveDev}${__devEval}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://*.vercel.app https://molino.app https://*.mercadopago.com https://*.paypalobjects.com",
          "font-src 'self'",
          "connect-src 'self' https://api.mercadopago.com https://*.mercadopago.com https://api-m.paypal.com https://api-m.sandbox.paypal.com${__impeccableLiveDev}",
          "frame-src 'self' https://www.mercadopago.com.ar https://www.mercadopago.com https://checkout.mercadopago.com https://www.paypal.com https://*.paypal.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
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
