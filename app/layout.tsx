import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import SiteIntro from "@/components/ui/SiteIntro";
import SkipLink from "@/components/ui/SkipLink";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import RouteVisibilityGate from "@/components/layout/RouteVisibilityGate";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";
import PWAProvider from "@/components/PWAProvider";
import ChunkRecovery from "@/components/ChunkRecovery";
import { SITE_URL, SITE_NAME, OG_IMAGE, siteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-heading" });

// Root-caused 2026-08-17: title.template above stopped applying past
// certain route segments because 4 intermediate layouts (herramientas,
// compatibility, affinity, profile) declared `title` as a plain string
// instead of `{ default, template }` — a plain string title on an
// intermediate layout breaks template inheritance for everything below
// it, no matter the depth. Fixed at each of those 4 layouts instead of
// hardcoding the full title on every leaf route.
export const metadata: Metadata = {
  title: {
    default: "Numerología, Astrología y Zodiaco Gratis | Molino",
    template: "%s | Molino",
  },
  description:
    "Descubrí tu mapa personal cruzando numerología, astrología y zodiaco chino en segundos. 100% privado, cálculo local, sin registro. Empezá gratis ahora.",
  applicationName: "Molino",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Molino",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "autoconocimiento",
    "numerología",
    "astrología",
    "mapa personal",
    "zodiaco chino",
    "ciclos personales",
    "Camino de Vida",
    "sin registro",
    "código abierto",
    "sin cookies",
  ],
  authors: [{ name: "Molino" }],
  creator: "Molino",
  openGraph: {
    type: "website",
    locale: "es_419",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Numerología, Astrología y Zodiaco Gratis | Molino",
    description:
      "Descubrí tu mapa personal cruzando numerología, astrología y zodiaco chino en segundos. 100% privado, cálculo local, sin registro. Empezá gratis ahora.",
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numerología, Astrología y Zodiaco Gratis | Molino",
    description:
      "Descubrí tu mapa personal cruzando numerología, astrología y zodiaco chino en segundos. 100% privado, cálculo local, sin registro. Empezá gratis ahora.",
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Molino",
      url: SITE_URL,
      description:
        "Descubrí tu mapa personal cruzando numerología, astrología y zodiaco chino en segundos. 100% privado, cálculo local, sin registro. Empezá gratis ahora.",
    },
    {
      // Entidad "empresa/proyecto": describe la misión, no el producto.
      // No se agrega foundingDate — no hay una fecha de fundación real
      // documentada en el repo y schema.org exige que sea un dato genuino.
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Molino",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description:
        "Molino: plataforma de autoconocimiento estructurado que integra numerología, astrología y zodiaco chino. Privacidad radical, código abierto, sin backend.",
      // Único perfil externo real encontrado en el sitio (footer). No se
      // inventan redes sociales que no existen.
      sameAs: ["https://github.com/Morpheus3232/molino"],
    },
    {
      // Entidad "producto": describe la funcionalidad, no la misión.
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Molino",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web Browser",
      description:
        "Calculadora de mapas simbólicos que cruza numerología, astrología occidental y zodiaco chino. Cálculo 100% local en el navegador, sin registro.",
      offers: [
        {
          // Plan gratuito: mapa esencial sin costo.
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Mapa esencial gratuito: numerología, astrología y zodiaco chino sin registro.",
          availability: "https://schema.org/InStock",
        },
        {
          // Plan premium: se preserva textualmente "$8 USD" y "pago único"
          // por pedido explícito — no reemplazar por copy genérico.
          "@type": "Offer",
          price: "8",
          priceCurrency: "USD",
          description: "Acceso Premium: pago único de $8 USD, sin suscripción, acceso vitalicio a la síntesis completa y personalizada.",
          availability: "https://schema.org/InStock",
        },
      ],
      author: {
        "@type": "Organization",
        name: "Molino",
      },
    },
  ];

  return (
    <html
      lang="es"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Molino" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <SkipLink />
        <SiteIntro />
        <AnalyticsProvider />
        <ChunkRecovery />
        <PWAProvider>
          <MotionProvider>
            <ScrollProgress />
            <UniversityHeader />
            <AppErrorBoundary>
              <AnimatedLayout>{children}</AnimatedLayout>
              <RouteVisibilityGate hideOnPrefix="/lectura">
                <UniversityFooter />
              </RouteVisibilityGate>
            </AppErrorBoundary>
          </MotionProvider>
        </PWAProvider>
        {/* Sin theme="dark" caía al fondo blanco por defecto de sonner —
            un toast de librería sin skin, roto contra el resto de la UI
            (siempre oscura, sin theme toggle implementado). */}
        <Toaster
          position="bottom-right"
          richColors
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "!bg-background !text-foreground !border !border-ink/10 !font-sans",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
