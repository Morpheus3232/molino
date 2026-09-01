import dynamic from "next/dynamic";
import HeroInstrument from "@/components/sections/HeroInstrument";
import MapPreview from "@/components/sections/MapPreview";
import ThreeSystemsSection from "@/components/sections/ThreeSystemsSection";
import SynthesisSection from "@/components/sections/SynthesisSection";
import MapToReadingSection from "@/components/sections/MapToReadingSection";
import AIExplorationSection from "@/components/sections/AIExplorationSection";
import OpenKnowledgeSection from "@/components/sections/OpenKnowledgeSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FinalCTA from "@/components/sections/FinalCTA";
import { SITE_URL } from "@/lib/seo";

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

export const metadata = {
  title: "Tu Mapa Personal de Autoconocimiento",
  description: "Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.",
  openGraph: {
    title: "Tu Mapa Personal de Autoconocimiento",
    description: "Descubrí tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro.",
    type: "website",
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <main className="relative z-10 min-h-screen bg-paper overflow-hidden">
        {/* Hero — Date Input */}
        <HeroInstrument />

        {/* MapPreview — show the object early */}
        <MapPreview />

        {/* Tres sistemas, una lectura */}
        <ThreeSystemsSection />

        {/* Data vs Synthesis */}
        <SynthesisSection />

        {/* Mapa → Lectura → IA (evolved ThreeLevelsSection) */}
        <MapToReadingSection />

        {/* Reading → IA */}
        <AIExplorationSection />

        {/* Aprendé cómo funciona */}
        <OpenKnowledgeSection />

        {/* Posición epistémica */}
        <PhilosophySection />

        {/* Final CTA */}
        <FinalCTA />

        {/* FAQ */}
        <FAQ />
      </main>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(homeSchemas)}</script>
    </>
  );
}