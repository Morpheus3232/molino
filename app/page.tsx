import dynamic from "next/dynamic";
import HeroInstrument from "@/components/sections/HeroInstrument";
import { SITE_URL } from "@/lib/seo";

const AtlasTeaser = dynamic(() => import("@/components/sections/AtlasTeaser"), { ssr: true });
const ParejaTeaser = dynamic(() => import("@/components/sections/ParejaTeaser"), { ssr: true });
const PremiumTeaser = dynamic(() => import("@/components/sections/PremiumTeaser"), { ssr: true });
const CTAFinal = dynamic(() => import("@/components/sections/CTAFinal"), { ssr: true });
const TrustSignals = dynamic(() => import("@/components/social/TrustSignals"), { ssr: true });
const PersonalizedHomeClient = dynamic(() => import("@/components/sections/PersonalizedHomeClient"), { ssr: true });
const MapPreviewDemo = dynamic(() => import("@/components/sections/MapPreviewDemo"), { ssr: true });
const QuienHaceEsto = dynamic(() => import("@/components/sections/QuienHaceEsto"), { ssr: true });
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true });

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
        name: "¿Qué incluye el acceso Premium de $8 USD y cómo funciona la garantía?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El acceso Premium (pago único de por vida) incluye la síntesis profunda con narrativa de IA y chat interactivo con tu mapa, ciclos personales 2026–2030, desglose de tensiones arquetípicas y garantía de devolución total de 7 días sin preguntas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo garantizan que mi fecha y datos no se guardan en servidores?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Todos los motores matemáticos se ejecutan 100% en tu propio navegador usando Web Workers. Tu fecha de nacimiento se procesa en tu CPU local y no se transmite ni se almacena en ninguna base de datos externa.",
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
      {
        "@type": "Question",
        name: "¿Qué pasa si cambio de dispositivo o borro los datos de mi navegador?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al ser almacenamiento 100% privado en tu cliente, los datos residen en tu navegador. Si adquiriste el acceso Premium, podés restaurarlo en cualquier nuevo dispositivo con un solo clic usando tu ID de pago.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo se calculan el Camino de Vida y los sistemas simbólicos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aplicamos el método pitagórico clásico reduciendo día, mes y año (respetando los Números Maestros 11, 22 y 33), cálculo solar astronómico para la astrología y el ciclo sexagenario lunar para el animal y elemento del zodíaco chino.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mapa Personal",
        item: `${SITE_URL}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Modo Pareja",
        item: `${SITE_URL}/pareja`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Dashboard Hoy",
        item: `${SITE_URL}/hoy`,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {homeSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="relative z-10">
        <main id="main-content" className="pt-16">
          <HeroInstrument />
          <PersonalizedHomeClient />
          <MapPreviewDemo />
          <ParejaTeaser />
          <PremiumTeaser />
          <TrustSignals />
          <CTAFinal />
          <AtlasTeaser />
          <QuienHaceEsto />
          <FAQ />
        </main>
      </div>
    </div>
  );
}
