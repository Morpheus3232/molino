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
  output: 'standalone',
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
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            // Solo immutable en producción: los chunks de build ahí sí están
            // hasheados por contenido. En `next dev` (Turbopack) los nombres
            // de chunk son estables entre rebuilds, así que este mismo header
            // le decía al browser que cacheara CSS/JS de dev "para siempre"
            // — Next.js ya lo advierte en el log de `next dev` como causa de
            // comportamiento roto en desarrollo.
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=31536000, immutable'
              : 'no-store',
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
