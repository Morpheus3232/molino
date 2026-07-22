import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "Molino — Tu mapa personal de autoconocimiento",
    template: "%s | Molino",
  },
  description:
    "Descubrí el mapa que te hace único. Molino construye tu mapa personal a partir de tu nombre y fecha de nacimiento. Numerología, astrología, ciclos y arquetipos en una sola experiencia.",
  keywords: [
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
  ],
  authors: [{ name: "Molino" }],
  creator: "Molino",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://molino-alpha.vercel.app",
    siteName: "Molino",
    title: "Molino — Tu mapa personal de autoconocimiento",
    description:
      "Descubrí el mapa que te hace único. Numerología, astrología, ciclos y arquetipos conectados en una sola experiencia.",
    images: [
      {
        url: "https://molino-alpha.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Molino — Tu mapa personal de autoconocimiento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Tu mapa personal de autoconocimiento",
    description:
      "Descubrí el mapa que te hace único. Numerología, astrología, ciclos y arquetipos conectados.",
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
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
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
      </body>
    </html>
  );
}
