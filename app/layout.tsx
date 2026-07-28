import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";
import Prism from "@/components/effects/Prism";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "Molino — Inteligencia Personal",
    template: "%s | Molino",
  },
  description:
    "Entendé quién sos. Reconocé tus patrones. Tomá mejores decisiones. Molino combina numerología, astrología, zodiaco chino y análisis de patrones para construir tu mapa personal de autoconocimiento.",
  keywords: [
    "personal intelligence",
    "autoconocimiento",
    "numerología",
    "astrología",
    "mapa personal",
    "arquetipos",
    "zodiaco chino",
    "ciclos personales",
    "Camino de Vida",
    "gratuito",
    "sin registro",
    "código abierto",
  ],
  authors: [{ name: "Molino" }],
  creator: "Molino",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://molino-alpha.vercel.app",
    siteName: "Molino",
    title: "Molino — Inteligencia Personal",
    description:
      "Entendé quién sos. Reconocé tus patrones. Tomá mejores decisiones. Numerología, astrología, zodiaco chino y análisis de patrones conectados.",
    images: [
      {
        url: "https://molino-alpha.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Molino — Inteligencia Personal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Inteligencia Personal",
    description:
      "Entendé quién sos. Reconocé tus patrones. Tomá mejores decisiones. Numerología, astrología y análisis de patrones.",
    images: ["https://molino-alpha.vercel.app/og-image.svg"],
  },
  metadataBase: new URL("https://molino-alpha.vercel.app"),
  alternates: {
    canonical: "https://molino-alpha.vercel.app",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1219" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Molino",
    url: "https://molino-alpha.vercel.app",
    description: "Inteligencia Personal: numerología, astrología, zodiaco chino y análisis de patrones.",
  };

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
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
          <AppErrorBoundary>
            <AnimatedLayout>{children}</AnimatedLayout>
          </AppErrorBoundary>
        </MotionProvider>
        <Toaster position="bottom-right" richColors />
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <>
            <Script
              src="https://eu.i.posthog.com/static/array.js"
              strategy="afterInteractive"
            />
            <Script id="posthog-init" strategy="afterInteractive">
              {`window.posthog && window.posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                api_host: 'https://eu.i.posthog.com',
                cookieless_mode: 'always',
                capture_pageview: false,
                capture_pageleave: false,
                autocapture: false
              });`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
