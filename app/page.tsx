import dynamic from "next/dynamic";
import HeroInstrument from "@/components/sections/HeroInstrument";
import { SITE_URL } from "@/lib/seo";

const TresPasos = dynamic(() => import("@/components/sections/TresPasos"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const QueDescubris = dynamic(() => import("@/components/sections/QueDescubris"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const TresSistemas = dynamic(() => import("@/components/sections/TresSistemas"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const ParejaTeaser = dynamic(() => import("@/components/sections/ParejaTeaser"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const PremiumTeaser = dynamic(() => import("@/components/sections/PremiumTeaser"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const CTAFinal = dynamic(() => import("@/components/sections/CTAFinal"), { ssr: true, loading: () => <div className="h-48 animate-pulse bg-ink/5" /> });
const TrustSignals = dynamic(() => import("@/components/social/TrustSignals"), { ssr: true });
const PersonalizedHomeClient = dynamic(() => import("@/components/sections/PersonalizedHomeClient"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const MapPreviewDemo = dynamic(() => import("@/components/sections/MapPreviewDemo"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const QuienHaceEsto = dynamic(() => import("@/components/sections/QuienHaceEsto"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });

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
        name: "¿Es científico lo que hace Molino?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Molino cruza tres sistemas simbólicos —numerología pitagórica, astrología solar y zodíaco chino— que han sido usados durante siglos para reflexionar sobre la personalidad y los ciclos. No es ciencia en el sentido experimental, sino una herramienta honesta y estructurada de autoconocimiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué cruzan tres sistemas diferentes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada sistema mira tu identidad desde un ángulo distinto. Juntos, ofrecen una perspectiva más completa y tridimensional que cualquiera por separado.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué pasa con mis datos personales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tu mapa se calcula enteramente en tu navegador: la fecha de nacimiento nunca sale de tu dispositivo ni se guarda en ninguna base de datos ni servidores.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito registrarme o crear una cuenta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Podés generar tu mapa sin crear cuenta, sin dejar tu email y sin contraseña. La privacidad es total por diseño.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo compartir o descargar mi mapa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Una vez generado, podés descargarlo como imagen de alta resolución o compartir el enlace directo con quien vos elijas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Tiene algún costo generar mi mapa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El mapa esencial es 100% gratuito y sin publicidad. Existe un acceso Premium opcional de pago único para quienes deseen descargar el informe completo en PDF.",
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
          <MapPreviewDemo />
          <QueDescubris />
          <ParejaTeaser />
          <TresPasos />
          <TresSistemas />
          <PremiumTeaser />
          <TrustSignals />
          <CTAFinal />
          <PersonalizedHomeClient />
          <QuienHaceEsto />
          <FAQ />
        </main>
      </div>
    </div>
  );
}
