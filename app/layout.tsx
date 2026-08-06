import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import UniversityHeader from "@/components/layout/UniversityHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "sonner";
import MotionProvider from "@/components/ui/MotionProvider";
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
    "Descubrí tu mapa personal de autoconocimiento con numerología, astrología y zodíaco chino. Sin registro, sin cookies, sin servidor guardando tu perfil. Código abierto, con una capa Premium opcional.",
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
    // es_419: español latinoamericano neutro (no atado a un país). Cuando
    // existan en/pt-BR reales, esto se vuelve dinámico por locale de ruta.
    locale: "es_419",
    alternateLocale: ["en_US", "pt_BR"],
    url: SITE_URL,
    siteName: "Molino",
    title: "Molino — Mapa Personal de Autoconocimiento",
    description:
      "Descubrí tu mapa personal de autoconocimiento con numerología, astrología y zodíaco chino. Sin registro, sin cookies, sin guardar datos. Código abierto, con una capa Premium opcional.",
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
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${archivoBlack.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
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
