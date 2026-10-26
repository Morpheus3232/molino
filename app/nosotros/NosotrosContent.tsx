"use client";

import { PageHero, KnowledgeSection, Columns, Closing } from "@/components/knowledge/Kit";

const origin = [
  "Molino nació de una frustración simple: pagar una suscripción mensual para leer un cálculo de numerología que se hace con una suma. La numerología pitagórica, la posición de un signo solar, el ciclo del zodíaco chino — nada de eso es un secreto propietario. Es conocimiento documentado hace siglos, y sin embargo casi toda la industria lo empaqueta detrás de un paywall recurrente.",
  "Así que se construyó una herramienta que hace ese cálculo gratis, sin registro, y sin guardar nada en un servidor — porque tu fecha de nacimiento no necesita pasar por la nube para que alguien te diga tu Camino de Vida. Lo que sí se cobra, una sola vez, es la síntesis que conecta todo eso con narrativa e inteligencia artificial — eso sí tiene un costo real de generar, y se dice así de directo.",
  "No hay un equipo de marketing detrás de esto, ni una ronda de inversión, ni una oficina. Es un proyecto que se sostiene con esa lógica: lo que es de todos, gratis; lo que cuesta hacer, se cobra lo justo y se dice por qué.",
];

const beliefs = [
  {
    title: "Conocimiento libre",
    description: "Los sistemas simbólicos no son propiedad de nadie. El cálculo base siempre va a ser gratuito, sin excepción.",
  },
  {
    title: "Privacidad radical",
    description: "Tu fecha de nacimiento se procesa en tu navegador. No hay base de datos de usuarios ni motivo para tenerla.",
  },
  {
    title: "Accesibilidad",
    description: "Sin registro, sin barreras, sin letra chica. Si algo tiene costo, se explica por qué — no se esconde.",
  },
];

const howWeBuiltIt = [
  {
    title: "Código abierto",
    description: "El motor de cálculo está publicado. Cualquiera puede leerlo, auditarlo o encontrar un error y avisar.",
  },
  {
    title: "Cálculo local",
    description: "Numerología, astrología y zodíaco chino se calculan enteramente en tu dispositivo. Nada viaja a un servidor para el mapa gratuito.",
  },
  {
    title: "Transparencia sobre atajos",
    description: "Cuando algo es una aproximación (por ejemplo, un año histórico sin fecha exacta), la interfaz lo dice — no se disfraza de precisión que no existe.",
  },
];

export default function NosotrosContent() {
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Quiénes somos" }]}
        eyebrow="Quiénes somos"
        title="Molino nació de una frustración"
        lead="Pagar todos los meses por un cálculo que se hace con una suma."
        imageKey="paginas/nosotros"
      />

      <KnowledgeSection label="El origen">
        <div className="max-w-3xl space-y-6 text-xl sm:text-2xl text-foreground/85 leading-relaxed">
          {origin.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </KnowledgeSection>

      <KnowledgeSection label="Lo que creemos" title="Tres convicciones" tone="alt">
        <Columns cols={beliefs.map((b) => ({ title: b.title, body: b.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label="Cómo lo hacemos" title="Cómo lo construimos">
        <Columns cols={howWeBuiltIt.map((b) => ({ title: b.title, body: b.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label="El precio" title="Por qué $8 para Premium" tone="alt">
        <div className="max-w-3xl space-y-5 text-lg sm:text-xl text-foreground/85 leading-relaxed">
          <p>
            El mapa gratuito no tiene techo: numerología, astrología, zodíaco chino y ciclos personales se calculan en tu
            navegador y no cuesta nada mantenerlos, así que no se cobran.
          </p>
          <p>
            Lo que sí tiene un costo es la síntesis con inteligencia artificial: cada perfil es una llamada a un proveedor
            de IA. $8 USD, pago único y para siempre, cubre ese costo sin convertir el proyecto en una suscripción mensual
            sobre algo que, en su base, debería ser libre.
          </p>
          <p>No es un precio pensado para vender más. Es lo que sale sostener la parte que no corre gratis en un navegador.</p>
        </div>
      </KnowledgeSection>

      <KnowledgeSection label="Contacto" title="Escribinos directo">
        <p className="max-w-2xl text-lg text-foreground/85 leading-relaxed">
          No hay equipo de soporte ni ticketera. Si encontrás un error, tenés una idea o querés escribir, llega directo:
        </p>
        <a href="mailto:versionlimitada@proton.me" className="mt-6 inline-block font-display text-3xl sm:text-4xl text-foreground underline underline-offset-[6px] decoration-2 hover:no-underline break-all">
          versionlimitada@proton.me
        </a>
        <div className="mt-16">
          <Closing title="Conocé tu mapa" text="Gratis, sin registro y sin guardar tus datos: se calcula en tu navegador." href="/profile" cta="Crear mi mapa" />
        </div>
      </KnowledgeSection>
    </main>
  );
}
