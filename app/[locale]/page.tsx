import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import HeroInstrument from "@/components/sections/HeroInstrument";
import HomeOpening from "@/components/sections/HomeOpening";
import { Fleuron } from "@/components/sections/HomeOrnaments";
import HomeBook from "@/components/sections/HomeBook";
import HomeAlmanac from "@/components/sections/HomeAlmanac";
import HomeGallery from "@/components/sections/HomeGallery";
import { SITE_URL, metadataFor } from "@/lib/seo";

const homeSchemas = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: L("Cómo calcular tu Mapa Personal de Autoconocimiento en Molino", "How to calculate your Personal Self-Knowledge Map on Molino"),
    description: L("Tres pasos sencillos para obtener tu mapa simbólico integrando numerología, astrología y zodíaco chino sin registrarte.", "Three simple steps to get your symbolic map combining numerology, astrology and the Chinese zodiac without signing up."),
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: L("Ingresá tu fecha de nacimiento", "Enter your date of birth"),
        text: L("Ingresá el día, mes y año de tu nacimiento en el instrumento interactivo de la portada.", "Enter the day, month and year you were born in the interactive instrument on the home page."),
        url: `${SITE_URL}#mapa-form`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: L("Procesamiento local y cruce de patrones", "Local processing and pattern crossing"),
        text: L("El motor de Molino cruza en tu propio navegador el Camino de Vida numerológico, el signo solar astrológico y el animal del zodíaco chino.", "Molino's engine crosses, right in your own browser, your numerological Life Path, your astrological sun sign and your Chinese zodiac animal."),
        url: `${SITE_URL}/onboarding`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: L("Explorá tu mapa y ganá perspectiva", "Explore your map and gain perspective"),
        text: L("Accedé a tu mapa interactivo con arquetipos, ciclos personales y sugerencias prácticas para la toma de decisiones.", "Open your interactive map with archetypes, personal cycles and practical suggestions for making decisions."),
        url: `${SITE_URL}/profile`,
      },
    ],
  },
  // Sin FAQPage: la portada ya no muestra preguntas frecuentes, y Google pide
  // que el marcado coincida con lo que se ve en la página.
]);

export const generateMetadata = metadataFor({
  title: ["Tu Mapa Personal de Autoconocimiento", "Your Personal Self-Knowledge Map"],
  description:
    ["Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.", "Discover your personal pattern: numerology, astrology, Chinese zodiac. Basic map 100% local, no sign-up. Radical transparency."],
  path: "",
  ogTitle: ["Tu Mapa Personal de Autoconocimiento", "Your Personal Self-Knowledge Map"],
  ogDescription:
    ["Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.", "Discover your personal pattern: numerology, astrology, Chinese zodiac. Basic map 100% local, no sign-up. Radical transparency."],
});

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <main id="main-content" className="relative z-10 min-h-screen bg-paper overflow-hidden pt-16">
        {/* Apertura: Quijote y Sancho galopando entre molinos. Se lleva la
            ilustración que antes iba chica al lado de la fecha. */}
        <HomeOpening />

        {/* Hoy — los datos de /hoy contados como un capítulo de libro (la vista
            de detalle sigue en /hoy). Sin mapa es la energía universal del
            día; con mapa suma Año/Mes/Día Personal. */}
        <section aria-labelledby="hoy-home" className="mx-auto max-w-5xl px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 scroll-mt-16">
          <HomeAlmanac />
          {/* Reserva la altura del capítulo mientras carga (se dibuja en el
              cliente: depende de la fecha local). Sin esto el formulario de
              abajo salta al hidratar y un click a "Ver tu mapa" cae en otro
              botón. Valores = el día más corto de los 9 números posibles,
              medido por ancho, en rem para que escale con la letra del
              navegador: nunca deja hueco, y el día largo apenas empuja.
              Incluye las dos láminas (número y Luna) de los capítulos I y II. */}
          <div className="min-h-[129rem] sm:min-h-[141rem] md:min-h-[137rem]">
            <HomeBook />
          </div>
        </section>

        {/* Las tres partes (el día, tu mapa, el índice) van en la misma hoja
            blanca, separadas por el molino de la ilustración. */}
        <Fleuron />

        {/* Hero — Date Input: el día es de todos, el mapa es tuyo. */}
        <HeroInstrument />

        <Fleuron className="mt-12 sm:mt-16" />

        <HomeGallery />
      </main>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{L.t(JSON.stringify(homeSchemas(L)))}</script>
    </>
  );
}