import HeroInstrument from "@/components/sections/HeroInstrument";
import HomeBook from "@/components/sections/HomeBook";
import HomeAlmanac from "@/components/sections/HomeAlmanac";
import { SITE_URL, createRouteMetadata } from "@/lib/seo";

const homeSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo calcular tu Mapa Personal de Autoconocimiento en Molino",
    description: "Tres pasos sencillos para obtener tu mapa simbólico integrando numerología, astrología y zodíaco chino sin registrarte.",
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Ingresá tu fecha de nacimiento",
        text: "Ingresá el día, mes y año de tu nacimiento en el instrumento interactivo de la portada.",
        url: `${SITE_URL}#mapa-form`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Procesamiento local y cruce de patrones",
        text: "El motor de Molino cruza en tu propio navegador el Camino de Vida numerológico, el signo solar astrológico y el animal del zodíaco chino.",
        url: `${SITE_URL}/onboarding`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Explorá tu mapa y ganá perspectiva",
        text: "Accedé a tu mapa interactivo con arquetipos, ciclos personales y sugerencias prácticas para la toma de decisiones.",
        url: `${SITE_URL}/profile`,
      },
    ],
  },
  // Sin FAQPage: la portada ya no muestra preguntas frecuentes, y Google pide
  // que el marcado coincida con lo que se ve en la página.
];

export const metadata = createRouteMetadata({
  title: "Tu Mapa Personal de Autoconocimiento",
  description:
    "Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.",
  path: "",
  ogTitle: "Tu Mapa Personal de Autoconocimiento",
  ogDescription:
    "Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.",
});

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="relative z-10 min-h-screen bg-paper overflow-hidden">
        {/* Hoy — los datos de /hoy contados como un capítulo de libro (la vista
            de detalle sigue en /hoy). Sin mapa es la energía universal del
            día; con mapa suma Año/Mes/Día Personal. */}
        <section aria-labelledby="hoy-home" className="mx-auto max-w-5xl px-4 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-24">
          <HomeAlmanac />
          {/* Reserva la altura del capítulo mientras carga (se dibuja en el
              cliente: depende de la fecha local). Sin esto el formulario de
              abajo salta al hidratar y un click a "Ver tu mapa" cae en otro
              botón. Valores = el día más corto de los 9 números posibles,
              medido por ancho, en rem para que escale con la letra del
              navegador: nunca deja hueco, y el día largo apenas empuja. */}
          <div className="min-h-[97rem] sm:min-h-[92rem] md:min-h-[88rem]">
            <HomeBook />
          </div>
        </section>

        {/* Hero — Date Input. Hoja aparte: el día es de todos, el mapa es tuyo. */}
        <div className="border-t border-border bg-paper-alt/60">
          <HeroInstrument />
        </div>
      </main>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(homeSchemas)}</script>
    </>
  );
}