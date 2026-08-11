import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
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
import { SITE_URL } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-display" });
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
  description:
    "Entendé tus patrones y decidí con más claridad. Un mapa personal con base en numerología, astrología y zodíaco chino. Gratis, sin registro, sin guardar datos.",
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
      "Entendé tus patrones y decidí con más claridad. Un mapa personal con base en numerología, astrología y zodíaco chino. Gratis, sin registro, sin guardar datos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Mapa Personal de Autoconocimiento",
    description:
      "Entendé tus patrones y decidí con más claridad. Un mapa personal con base en numerología, astrología y zodíaco chino. Gratis, sin registro, sin guardar datos.",
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
    <html
      lang="es"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${archivoBlack.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
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
          <div
            aria-hidden="true"
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{
              __html: `<!--
THESIS: Molino no ilustra lo mistico, lo calcula en vivo -- el sitio se muestra
como el instrumento que muele tres sistemas (numerologia, astrologia, zodiaco
chino) en un mapa, y refusa el hero-metric estatico y el "neon sobre negro" generico.
OWN-WORLD: fondo casi negro (#0A0A0C) + textura de grano (Grainient dorado/marron,
ya en el repo) + un nucleo de turbina de 3 aspas, cada una con el color de un
sistema (oro numerologia, indigo astrologia, jade zodiaco); Archivo Black para
cifras/titulos, JetBrains Mono para lecturas/datos.
STORY: el visitante ve su fecha entrar como grano y salir como numero del dia;
entiende que cada cifra es trazable, no decorativa, y arranca el onboarding.
FIRST VIEWPORT: hero full-bleed, turbina girando a la derecha/detras, numero del
dia "molido" a la izquierda con su calculo visible, CTA "Crear mi mapa" debajo.
FORM: Molino / Turbina Viva -- direccion asignada por concept-seed (candidato 5/7,
seed 3b23cd2e), literalizando el molino del nombre como nucleo generativo.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, and DESIGN.md.
-->`,
            }}
          />
          <SkipLink />
          <SiteIntro />
          <AnalyticsProvider />
          <MotionProvider>
            <ScrollProgress />
            <UniversityHeader />
            <AppErrorBoundary>
              <AnimatedLayout>{children}</AnimatedLayout>
              <UniversityFooter />
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
