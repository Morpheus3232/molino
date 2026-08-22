import dynamic from "next/dynamic";
import HeroInstrument from "@/components/sections/HeroInstrument";
import ProofSection from "@/components/sections/ProofSection";
import ClaritySection from "@/components/sections/ClaritySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PremiumTeaser from "@/components/sections/PremiumTeaser";
import TrustLayer from "@/components/sections/TrustLayer";
import CTASection from "@/components/sections/CTASection";
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
          text: "Todos los motores matemáticos se ejecutan 100% en tu propio navegador usando Web Workers: tu fecha de nacimiento se procesa en tu CPU local y nunca se transmite en texto plano. Si activás Premium o una interpretación con IA, se guarda un hash HMAC-SHA256 irreversible de tu perfil — nunca tu fecha de nacimiento en claro. Detalle completo en /privacidad.",
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
          text: "Usamos numerología pitagórica (suma de dígitos hasta un dígito o maestro), astrología tropical (zodíaco occidental + casas), y zodíaco chino sexagenario. Todas las fórmulas están documentadas y auditables en /metodos-y-fuentes.",
        },
      },
    ],
  },
];

export const metadata = {
  title: "Tu Mapa Personal de Autoconocimiento",
  description: "Descubre tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro. Transparencia radical.",
  openGraph: {
    title: "Tu Mapa Personal de Autoconocimiento",
    description: "Descubre tu patrón personal: numerología, astrología, zodíaco chino. Mapa básico 100% local, sin registro.",
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

        {/* Proof — Interactive Map Demo */}
        <ProofSection />

        {/* Clarity — Molino vs Traditional */}
        <ClaritySection />

        {/* Features — Core del mapa (ciclos, afinidades) + link a ecosistema */}
        <FeaturesSection />

        {/* Premium — transformación: veo mi mapa vs. entiendo cómo se conecta */}
        <PremiumTeaser />

        {/* Trust Layer — Privacy & Architecture */}
        <TrustLayer />

        {/* Final CTA */}
        <CTASection />

        {/* FAQ */}
        <FAQ />
      </main>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(homeSchemas)}</script>
    </>
  );
}
