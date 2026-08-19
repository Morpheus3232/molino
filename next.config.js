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
`connect-src 'self' https://api.mercadopago.com https://*.mercadopago.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://api.openai.com https://api.anthropic.com${__impeccableLiveDev}`,
          "frame-src https://www.mercadopago.com.ar https://www.mercadopago.com https://checkout.mercadopago.com https://www.paypal.com https://*.paypal.com",
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

module.exports = nextConfig;
