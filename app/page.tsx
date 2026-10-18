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
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Por qué el mapa esencial es 100% gratuito y sin registro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Porque el autoconocimiento de base debe ser libre y accesible. Generás tu lectura completa de numerología, astrología y zodíaco chino al instante sin crear cuentas, sin dejar tu email y sin publicidad intrusiva.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué incluye el acceso Premium de $8 USD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El acceso Premium (pago único de por vida) incluye la síntesis profunda con narrativa personalizada y chat interactivo con tu mapa, ciclos personales 2026–2030 y desglose de tensiones arquetípicas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo garantizan que mi fecha y datos no se guardan en servidores?",
        acceptedAnswer: {
          "@type": "Answer",
          // Este texto lo amplifica Google como rich result, así que no puede
          // llevar un absoluto que el código no cumple. Decía "nunca se
          // transmite en texto plano": falso — /api/intelligence/interpret
          // recibe `dob` en el body para poder armar el prompt. Lo que no se
          // guarda es la fecha; lo que viaja, viaja.
          text: "Depende de qué uses. Los motores de cálculo corren enteros en tu navegador: si te quedás con el mapa y la lectura gratuitos, tu fecha no sale de tu dispositivo. La Lectura Pro y las preguntas a la IA sí la envían a nuestro servidor (por HTTPS) para poder redactarse, y de ahí al proveedor del modelo. Lo que nunca guardamos es tu fecha: en la base solo queda un hash HMAC-SHA256 irreversible de tu perfil, que sirve para validar tu acceso. Detalle completo en /privacidad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo comparar mi mapa con mi pareja o guardar varios perfiles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El Modo Pareja (/pareja) te permite cruzar dos fechas para analizar sinergias y desafíos. Además, la Bóveda Local te permite guardar y alternar hasta 30 mapas en tu navegador sin crear cuentas.",
        },
      },
    ],
  },
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
      <main className="relative z-10 min-h-screen bg-paper overflow-hidden">
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