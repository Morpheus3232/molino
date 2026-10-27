"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { PageHero, KnowledgeSection, Columns, Closing } from "@/components/knowledge/Kit";

const origin = (L: Pick2) => ([
  L("Molino nació de una frustración simple: pagar una suscripción mensual para leer un cálculo de numerología que se hace con una suma. La numerología pitagórica, la posición de un signo solar, el ciclo del zodíaco chino — nada de eso es un secreto propietario. Es conocimiento documentado hace siglos, y sin embargo casi toda la industria lo empaqueta detrás de un paywall recurrente.", "Molino was born out of a simple frustration: paying a monthly subscription to read a numerology calculation that takes one addition. Pythagorean numerology, the position of a sun sign, the Chinese zodiac cycle — none of that is a proprietary secret. It's knowledge documented centuries ago, and yet almost the whole industry packages it behind a recurring paywall."),
  L("Así que se construyó una herramienta que hace ese cálculo gratis, sin registro, y sin guardar nada en un servidor — porque tu fecha de nacimiento no necesita pasar por la nube para que alguien te diga tu Camino de Vida. Lo que sí se cobra, una sola vez, es la síntesis que conecta todo eso con narrativa e inteligencia artificial — eso sí tiene un costo real de generar, y se dice así de directo.", "So a tool was built that does that calculation for free, with no sign-up and without storing anything on a server — because your date of birth doesn't need to go through the cloud for someone to tell you your Life Path. What is charged, once, is the synthesis that ties all of that together with narrative and artificial intelligence — that does have a real cost to generate, and we say so plainly."),
  L("No hay un equipo de marketing detrás de esto, ni una ronda de inversión, ni una oficina. Es un proyecto que se sostiene con esa lógica: lo que es de todos, gratis; lo que cuesta hacer, se cobra lo justo y se dice por qué.", "There's no marketing team behind this, no funding round, no office. It's a project that runs on that logic: what belongs to everyone is free; what costs money to make is charged at a fair price, and we say why."),
]);

const beliefs = (L: Pick2) => ([
  {
    title: L("Conocimiento libre", "Free knowledge"),
    description: L("Los sistemas simbólicos no son propiedad de nadie. El cálculo base siempre va a ser gratuito, sin excepción.", "Symbolic systems don't belong to anyone. The base calculation will always be free, no exceptions."),
  },
  {
    title: L("Privacidad radical", "Radical privacy"),
    description: L("Tu fecha de nacimiento se procesa en tu navegador. No hay base de datos de usuarios ni motivo para tenerla.", "Your date of birth is processed in your browser. There's no user database and no reason to have one."),
  },
  {
    title: L("Accesibilidad", "Accessibility"),
    description: L("Sin registro, sin barreras, sin letra chica. Si algo tiene costo, se explica por qué — no se esconde.", "No sign-up, no barriers, no fine print. If something has a cost, we explain why — we don't hide it."),
  },
]);

const howWeBuiltIt = (L: Pick2) => ([
  {
    title: L("Código abierto", "Open source"),
    description: L("El motor de cálculo está publicado. Cualquiera puede leerlo, auditarlo o encontrar un error y avisar.", "The calculation engine is published. Anyone can read it, audit it, or find a bug and let us know."),
  },
  {
    title: L("Cálculo local", "Local calculation"),
    description: L("Numerología, astrología y zodíaco chino se calculan enteramente en tu dispositivo. Nada viaja a un servidor para el mapa gratuito.", "Numerology, astrology and the Chinese zodiac are calculated entirely on your device. Nothing travels to a server for the free map."),
  },
  {
    title: L("Transparencia sobre atajos", "Transparency about shortcuts"),
    description: L("Cuando algo es una aproximación (por ejemplo, un año histórico sin fecha exacta), la interfaz lo dice — no se disfraza de precisión que no existe.", "When something is an approximation (for example, a historical year with no exact date), the interface says so — it isn't dressed up as precision that doesn't exist."),
  },
]);

export default function NosotrosContent() {
  const L = useL();
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Quiénes somos", "About us") }]}
        eyebrow={L("Quiénes somos", "About us")}
        title={L("Molino nació de una frustración", "Molino was born out of frustration")}
        lead={L("Pagar todos los meses por un cálculo que se hace con una suma.", "Paying every month for a calculation that takes one addition.")}
        imageKey="paginas/nosotros"
      />

      <KnowledgeSection label={L("El origen", "The origin")}>
        <div className="max-w-3xl space-y-6 text-xl sm:text-2xl text-foreground/85 leading-relaxed">
          {origin(L).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </KnowledgeSection>

      <KnowledgeSection label={L("Lo que creemos", "What we believe")} title={L("Tres convicciones", "Three convictions")} tone="alt">
        <Columns cols={beliefs(L).map((b) => ({ title: b.title, body: b.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label={L("Cómo lo hacemos", "How we do it")} title={L("Cómo lo construimos", "How we build it")}>
        <Columns cols={howWeBuiltIt(L).map((b) => ({ title: b.title, body: b.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label={L("El precio", "The price")} title={L("Por qué $8 para Premium", "Why $8 for Premium")} tone="alt">
        <div className="max-w-3xl space-y-5 text-lg sm:text-xl text-foreground/85 leading-relaxed">
          <p>{L("El mapa gratuito no tiene techo: numerología, astrología, zodíaco chino y ciclos personales se calculan en tu navegador y no cuesta nada mantenerlos, así que no se cobran.", "The free map has no ceiling: numerology, astrology, the Chinese zodiac and personal cycles are calculated in your browser and cost nothing to maintain, so they're not charged for.")}</p>
          <p>{L("Lo que sí tiene un costo es la síntesis con inteligencia artificial: cada perfil es una llamada a un proveedor de IA. $8 USD, pago único y para siempre, cubre ese costo sin convertir el proyecto en una suscripción mensual sobre algo que, en su base, debería ser libre.", "What does have a cost is the AI synthesis: each profile is a call to an AI provider. $8 USD, a one-time payment, yours forever, covers that cost without turning the project into a monthly subscription for something that, at its core, should be free.")}</p>
          <p>{L("No es un precio pensado para vender más. Es lo que sale sostener la parte que no corre gratis en un navegador.", "It isn't a price designed to sell more. It's what it takes to sustain the part that doesn't run for free in a browser.")}</p>
        </div>
      </KnowledgeSection>

      <KnowledgeSection label={L("Contacto", "Contact")} title={L("Escribinos directo", "Write to us directly")}>
        <p className="max-w-2xl text-lg text-foreground/85 leading-relaxed">{L("No hay equipo de soporte ni ticketera. Si encontrás un error, tenés una idea o querés escribir, llega directo:", "There's no support team or ticketing system. If you find a bug, have an idea or just want to write, it goes straight to us:")}</p>
        <a href="mailto:versionlimitada@proton.me" className="mt-6 inline-block font-display text-3xl sm:text-4xl text-foreground underline underline-offset-[6px] decoration-2 hover:no-underline break-all">
          versionlimitada@proton.me
        </a>
        <div className="mt-16">
          <Closing title={L("Conocé tu mapa", "Discover your map")} text={L("Gratis, sin registro y sin guardar tus datos: se calcula en tu navegador.", "Free, no sign-up and without storing your data: it's calculated in your browser.")} href="/profile" cta={L("Crear mi mapa", "Create my map")} />
        </div>
      </KnowledgeSection>
    </main>
  );
}
