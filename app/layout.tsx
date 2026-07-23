import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Toaster } from "sonner";

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
    "Life Path",
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
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
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
        <AppErrorBoundary>
          <AnimatedLayout>{children}</AnimatedLayout>
        </AppErrorBoundary>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
