import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";

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
          <Script id="posthog-init" strategy="afterInteractive">
            {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=)}(document,window.posthog||[]);posthog.init("${process.env.NEXT_PUBLIC_POSTHOG_KEY}",{api_host:"https://eu.i.posthog.com",cookieless_mode:"always",defaults:"2025-01-01",capture_pageview:false,capture_pageleave:false, autocapture:false})`}
          </Script>
        )}
      </body>
    </html>
  );
}
