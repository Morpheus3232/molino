import type { Metadata, Viewport } from "next";
import { EB_Garamond, Noto_Emoji } from "next/font/google";
import "../globals.css";
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
import ChunkRecovery from "@/components/ChunkRecovery";
import MotionFailsafe from "@/components/ui/MotionFailsafe";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing, isSiteLocale, type SiteLocale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { LocaleContentDict } from "@/lib/i18n/LocaleContentDict";
import { languageAlternates, localeUrl, OG_LOCALE } from "@/lib/seo";

// Editorial de libro (Penguin): una sola familia, Garamond, para todo. La
// jerarquía sale del tamaño, la itálica, las versalitas y el centrado — no
// de cambiar de tipografía. Las cuatro variables apuntan a la misma fuente
// para no tocar los ~2000 usos de font-display/heading/sans/mono.
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-garamond" });
// Emoji monocromo: va en cada pila tipográfica antes que el emoji a color del
// sistema, así los íconos del Atlas (⚽ 🎓 🚗…) quedan en blanco y negro sin
// tocar los datos. Sin preload: solo se baja en páginas que muestran emoji.
const notoEmoji = Noto_Emoji({ subsets: ["emoji"], display: "swap", preload: false, variable: "--font-emoji" });

// Root-caused 2026-08-17: title.template above stopped applying past
// certain route segments because 4 intermediate layouts (herramientas,
// compatibility, affinity, profile) declared `title` as a plain string
// instead of `{ default, template }` — a plain string title on an
// intermediate layout breaks template inheritance for everything below
// it, no matter the depth. Fixed at each of those 4 layouts instead of
// hardcoding the full title on every leaf route.
const ROOT_COPY: Record<SiteLocale, { title: string; description: string; keywords: string[] }> = {
  es: {
    title: "Numerología, Astrología y Zodiaco Gratis",
    description:
      "Descubrí tu mapa personal cruzando numerología, astrología y zodiaco chino en segundos. 100% privado, cálculo local, sin registro. Empezá gratis ahora.",
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
  },
  en: {
    title: "Free Numerology, Astrology & Chinese Zodiac",
    description:
      "Discover your personal map by combining numerology, astrology and the Chinese zodiac in seconds. 100% private, calculated on your device, no sign-up. Start free now.",
    keywords: [
      "self-knowledge",
      "numerology",
      "astrology",
      "personal map",
      "Chinese zodiac",
      "personal cycles",
      "Life Path number",
      "no sign-up",
      "open source",
      "no cookies",
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: SiteLocale = raw === "en" ? "en" : "es";
  const copy = ROOT_COPY[locale];
  return {
    title: {
      default: copy.title,
      template: "%s",
    },
    description: copy.description,
    applicationName: "Molino",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Molino",
    },
    formatDetection: {
      telephone: false,
    },
    keywords: copy.keywords,
    authors: [{ name: "Molino" }],
    creator: "Molino",
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl("", locale),
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: localeUrl("", locale),
      languages: languageAlternates(""),
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
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  if (!isSiteLocale(requested)) notFound();
  const locale = await initLocale(params);
  const en = locale === "en";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Molino",
      url: localeUrl("", locale),
      inLanguage: en ? "en" : "es",
      description: ROOT_COPY[locale].description,
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
      description: en
        ? "Molino: a structured self-knowledge platform that brings together numerology, astrology and the Chinese zodiac. Radical privacy, open source, no backend."
        : "Molino: plataforma de autoconocimiento estructurado que integra numerología, astrología y zodiaco chino. Privacidad radical, código abierto, sin backend.",
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
      description: en
        ? "A symbolic map calculator that combines numerology, Western astrology and the Chinese zodiac. Calculated 100% locally in your browser, no sign-up."
        : "Calculadora de mapas simbólicos que cruza numerología, astrología occidental y zodiaco chino. Cálculo 100% local en el navegador, sin registro.",
      offers: [
        {
          // Plan gratuito: mapa esencial sin costo.
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: en
            ? "Free essential map: numerology, astrology and the Chinese zodiac, no sign-up."
            : "Mapa esencial gratuito: numerología, astrología y zodiaco chino sin registro.",
          availability: "https://schema.org/InStock",
        },
        {
          // Plan premium: se preserva textualmente "$8 USD" y "pago único"
          // por pedido explícito — no reemplazar por copy genérico.
          "@type": "Offer",
          price: "8",
          priceCurrency: "USD",
          description: en
            ? "Premium access: a one-time payment of $8 USD, no subscription, lifetime access to the full personalized synthesis."
            : "Acceso Premium: pago único de $8 USD, sin suscripción, acceso vitalicio a la síntesis completa y personalizada.",
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
      lang={en ? "en" : "es-AR"}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${garamond.variable} ${notoEmoji.variable}`}
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
        <NextIntlClientProvider locale={locale} messages={{}}>
        <LocaleContentDict en={en}>
        <SkipLink />
        <SiteIntro />
        <AnalyticsProvider />
        <ChunkRecovery />
        <MotionFailsafe />
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
        <Analytics />
        </LocaleContentDict>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
