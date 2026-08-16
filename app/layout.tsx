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
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";
import PWAProvider from "@/components/PWAProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_IMAGE, siteUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["italic"], display: "swap", variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-heading" });

// REVIEW: title.template above stops applying past a certain route-segment
// depth (reproduced on Next 16.3/Turbopack via curl against rendered
// <title>): every static child under compatibility/*, herramientas/*,
// affinity/recommendations/*, and profile/insights lost the "| Molino"
// suffix entirely rather than merging it, while shallower routes (e.g.
// /affinity, /herramientas, /guia) were unaffected. Worked around by
// hardcoding the full title string on each affected route instead of
// relying on the template — root-causing the actual Next.js metadata
// resolution behavior needs more time than this pass budgeted.
export const metadata: Metadata = {
  title: {
    default: "Molino — Mapa Personal de Autoconocimiento",
    template: "%s | Molino",
  },
  description: SITE_DESCRIPTION,
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
    title: "Molino — Mapa Personal de Autoconocimiento",
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Mapa Personal de Autoconocimiento",
    description: SITE_DESCRIPTION,
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
      description: "Mapa Personal de Autoconocimiento: numerología, astrología, zodiaco chino y análisis de patrones.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Molino",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description: "Aplicación web de autoconocimiento que genera un mapa personal combinando numerología pitagórica, astrología occidental y zodíaco chino.",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Molino",
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: "Aplicación web de autoconocimiento que genera un mapa personal combinando numerología pitagórica, astrología occidental y zodíaco chino.",
      offers: {
        "@type": "Offer",
        price: "8",
        priceCurrency: "USD",
        description: "Premium — síntesis completa. Pago único, acceso permanente.",
      },
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
        <PWAProvider>
          <MotionProvider>
            <ScrollProgress />
            <UniversityHeader />
            <AppErrorBoundary>
              <AnimatedLayout>{children}</AnimatedLayout>
              <UniversityFooter />
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
      </body>
    </html>
  );
}
