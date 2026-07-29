import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import UniversityHeader from "@/components/layout/UniversityHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";
import Prism from "@/components/effects/Prism";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE_URL } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: {
    default: "Molino — Mapa Personal de Autoconocimiento",
    template: "%s | Molino",
  },
  description:
    "Descubrí tu mapa personal de autoconocimiento con numerología, astrología y zodíaco chino. Sin registro, sin cookies, sin guardar datos. Código abierto y gratuito.",
  keywords: [
    "autoconocimiento",
    "numerología",
    "astrología",
    "mapa personal",
    "zodiaco chino",
    "ciclos personales",
    "Camino de Vida",
    "gratuito",
    "sin registro",
    "código abierto",
    "sin cookies",
    "sin tracking",
  ],
  authors: [{ name: "Molino" }],
  creator: "Molino",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Molino",
    title: "Molino — Mapa Personal de Autoconocimiento",
    description:
      "Descubrí tu mapa personal de autoconocimiento con numerología, astrología y zodíaco chino. Sin registro, sin cookies, sin guardar datos. Código abierto y gratuito.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Mapa Personal de Autoconocimiento",
    description:
      "Descubrí tu mapa personal de autoconocimiento. Numerología, astrología y zodíaco chino sin registro ni cookies.",
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
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
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
      "@type": "SoftwareApplication",
      name: "Molino",
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: "Aplicación web de autoconocimiento que genera un mapa personal combinando numerología pitagórica, astrología occidental y zodíaco chino.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: "Molino",
      },
    },
  ];

  return (
    <html lang="es-AR" suppressHydrationWarning className={`${inter.variable} ${archivoBlack.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <head>
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="fixed inset-0 -z-10 opacity-[0.08] pointer-events-none" aria-hidden="true">
            <Prism
              animationType="rotate"
              timeScale={0.15}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={0.5}
              noise={0.15}
              glow={0.3}
              bloom={0.3}
              transparent={true}
              suspendWhenOffscreen={false}
            />
          </div>
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <AnalyticsProvider />
          <MotionProvider>
            <ScrollProgress />
            <UniversityHeader />
            <AppErrorBoundary>
              <AnimatedLayout>{children}</AnimatedLayout>
            </AppErrorBoundary>
          </MotionProvider>
          <Toaster position="bottom-right" richColors />
          {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
            <>
              <Script
                src={`${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"}/static/array.js`}
                strategy="afterInteractive"
              />
              <Script id="posthog-init" strategy="afterInteractive">
                {`window.posthog && window.posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                  api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"}',
                  cookieless_mode: 'always',
                  capture_pageview: false,
                  capture_pageleave: false,
                  autocapture: false
                });`}
              </Script>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
