"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import { useDictionary } from "@/lib/i18n/useDictionary";
import { PageHero, KnowledgeSection, Columns, TextWithFigure } from "@/components/knowledge/Kit";

const principles = (L: Pick2) => ([
  {
    id: "conocimiento-libre",
    title: L("Conocimiento libre", "Free knowledge"),
    description: L("La información sobre uno mismo no debería tener dueño. Tu mapa, tus patrones y las tradiciones simbólicas están abiertos para explorarlos libremente, sin registro ni barreras académicas. Lo que descubras sobre ti es tuyo, punto. Para quien quiere ir más profundo, existe una capa opcional de síntesis integral.", "Knowledge about yourself shouldn't have an owner. Your map, your patterns and the symbolic traditions are open for you to explore freely, with no sign-up and no academic gatekeeping. What you discover about yourself is yours, period. For those who want to go deeper, there's an optional layer of integral synthesis."),
  },
  {
    id: "privacidad-radical",
    title: L("Privacidad radical", "Radical privacy"),
    description: L("Tu fecha de nacimiento es el único dato que usamos para calcular tu mapa. Se guarda localmente en tu dispositivo (para que tu mapa siga ahí la próxima vez que entrás) y no se almacena en ningún servidor de Molino en forma directa: solo un identificador anónimo derivado de ella se usa para verificar el acceso a la capa Premium. No hay base de datos con tu perfil, no hay cookies de tracking.", "Your date of birth is the only piece of data we use to calculate your map. It's stored locally on your device (so your map is still there next time you visit) and it isn't stored directly on any Molino server: only an anonymous identifier derived from it is used to verify access to the Premium layer. There's no database with your profile and no tracking cookies."),
  },
  {
    id: "transparencia-total",
    title: L("Transparencia total", "Total transparency"),
    description: L("Cada cálculo es auditable. Las fórmulas de numerología, las posiciones astronómicas, los ciclos del zodíaco chino: todo el código está abierto. Si querés entender cómo llegamos a un resultado, podés leer el motor que lo generó.", "Every calculation can be audited. The numerology formulas, the astronomical positions, the Chinese zodiac cycles: all the code is open. If you want to understand how we got to a result, you can read the engine that produced it."),
  },
  {
    id: "codigo-abierto",
    title: L("Código abierto", "Open source"),
    description: L("Molino es software libre (MIT). Cualquiera puede inspeccionar, copiar, modificar y distribuir el código. No hay vendor lock-in ni APIs de pago ocultas; el producto se sostiene con una capa Premium opcional, transparente. El proyecto vive en GitHub y acepta contribuciones.", "Molino is free software (MIT). Anyone can inspect, copy, modify and distribute the code. There's no vendor lock-in and no hidden paid APIs; the product is funded by an optional, transparent Premium layer. The project lives on GitHub and welcomes contributions."),
  },
  {
    id: "sin-tracking",
    title: L("Sin tracking invasivo", "No invasive tracking"),
    description: L("No hay píxeles de Facebook, no hay fingerprinting ni cookies de rastreo. Un registro de uso detallado (qué páginas visitás) vive exclusivamente en tu dispositivo —vos podés verlo y borrarlo en /analytics— y nunca sale de tu navegador. Además usamos Vercel Web Analytics para contar visitas de forma agregada y anónima (sin cookies, sin fingerprinting, sin perfil por persona) — solo para saber qué páginas se usan más, nunca para identificarte. Tu mapa gratuito se calcula 100% local: no llega a ningún servidor de Molino ni de terceros. Si activás Premium o IA, sí se envía un hash HMAC-SHA256 de tu perfil —nunca tu fecha de nacimiento en claro ni tu nombre— para validar el pago y habilitar el acceso.", "No Facebook pixels, no fingerprinting, no tracking cookies. A detailed usage log (which pages you visit) lives only on your device — you can see it and delete it at /analytics — and it never leaves your browser. We also use Vercel Web Analytics to count visits in an aggregated, anonymous way (no cookies, no fingerprinting, no per-person profile) — only to know which pages are used most, never to identify you. Your free map is calculated 100% locally: it never reaches any Molino or third-party server. If you activate Premium or AI, an HMAC-SHA256 hash of your profile is sent — never your date of birth in plain text or your name — to validate the payment and enable access."),
  },
]);

const pillars = (L: Pick2) => ([
  {
    title: L("Autoconocimiento, no predicción", "Self-knowledge, not prediction"),
    description: L("Los sistemas simbólicos no predicen el futuro. Son espejos. Molino te devuelve una imagen estructurada de tu momento de nacimiento para que vos la interpretes. La agencia siempre es tuya.", "Symbolic systems don't predict the future. They're mirrors. Molino gives you back a structured image of the moment you were born so that you can interpret it. The agency is always yours."),
  },
  {
    title: L("Rigor simbólico, honestidad intelectual", "Symbolic rigor, intellectual honesty"),
    description: L("No presentamos la astrología o la numerología como ciencia. Son sistemas simbólicos con historia, coherencia interna y utilidad práctica para la reflexión. Los tratamos con el respeto que merecen, sin venderlos como verdad absoluta.", "We don't present astrology or numerology as science. They're symbolic systems with history, internal coherence and practical value for reflection. We treat them with the respect they deserve, without selling them as absolute truth."),
  },
  {
    title: L("Interdisciplinariedad real", "Real interdisciplinarity"),
    description: L("Números, cielo y ciclos no son compartimentos estancos. Molino los integra: tu Camino de Vida dialoga con tu signo solar y tu animal chino. Las afinidades surgen del cruce, no de la suma.", "Numbers, sky and cycles aren't sealed compartments. Molino brings them together: your Life Path talks to your sun sign and your Chinese animal. Affinities come from the crossing, not from adding things up."),
  },
  {
    title: L("Accesibilidad sin simplificación", "Accessible without oversimplifying"),
    description: L("Simplificar no es empobrecer. Molino traduce conceptos complejos a lenguaje claro sin perder la profundidad. Cada lectura tiene capas: una vista rápida y el detalle técnico para quien quiera ir al fondo.", "Simplifying isn't dumbing down. Molino translates complex concepts into plain language without losing depth. Every reading has layers: a quick view, and the technical detail for anyone who wants to dig to the bottom."),
  },
]);

const ancientTraditions = (L: Pick2) => ([
  L("Numerología pitagórica y caldea", "Pythagorean and Chaldean numerology"),
  L("Astrología helenística y moderna", "Hellenistic and modern astrology"),
  L("Zodíaco chino (ciclo sexagenario, 12 animales, 5 elementos)", "Chinese zodiac (sexagenary cycle, 12 animals, 5 elements)"),
  L("I Ching y los 64 hexagramas", "I Ching and the 64 hexagrams"),
  L("Kabbalah y Árbol de la Vida", "Kabbalah and the Tree of Life"),
  L("Psicología arquetípica (Jung, Hillman)", "Archetypal psychology (Jung, Hillman)"),
  L("Eneagrama de la personalidad", "The Enneagram of personality"),
]);

const contemporarySystems = [
  { name: "Human Design", author: "Ra Uru Hu", year: "1987" },
  { name: "Gene Keys", author: "Richard Rudd", year: "2009" },
];

export default function FilosofiaContent() {
  const L = useL();
  const t = useDictionary();
  const noes = [
    {
      q: L("No es una predicción", "It isn't prediction"),
      a: L("Molino no predice el futuro. Los sistemas simbólicos ofrecen patrones para la reflexión, no destinos escritos. Tus decisiones son siempre tuyas.", "Molino doesn't predict the future. Symbolic systems offer patterns for reflection, not written destinies. Your decisions are always yours."),
    },
    {
      q: L("No es ciencia", "It isn't science"),
      a: L("La astrología, la numerología y el zodíaco chino son sistemas simbólicos con coherencia interna, no disciplinas científicas. No reemplazan el consejo médico, psicológico ni legal.", "Astrology, numerology and the Chinese zodiac are symbolic systems with internal coherence, not scientific disciplines. They don't replace medical, psychological or legal advice."),
    },
    {
      q: L("No es terapia", "It isn't therapy"),
      a: L("Es una herramienta de autoconocimiento, no un sustituto de la terapia. Si estás pasando por un momento difícil, buscá apoyo profesional.", "It's a self-knowledge tool, not a substitute for therapy. If you're going through a hard time, reach out for professional support."),
    },
    {
      q: L("No es todo gratis", "Not everything is free"),
      a: L(`Tu mapa, tus patrones y las tradiciones se exploran libremente, sin registro. Solo la síntesis integral es una capa Premium opcional de ${t.premium.priceLabel}, pago único y para siempre. Sin suscripciones.`, `Your map, your patterns and the traditions are free to explore, with no sign-up. Only the integral synthesis is an optional Premium layer for ${t.premium.priceLabel}, a one-time payment, yours forever. No subscriptions.`),
    },
  ];
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Filosofía" }]}
        eyebrow="Filosofía · cómo se hace Molino"
        title="Principios y fundamentos"
        lead="Molino no es otra app de predicciones. Es una herramienta de autoconocimiento con reglas claras: libertad, privacidad, transparencia y honestidad intelectual."
        imageKey="paginas/filosofia"
      >{L(<>
        <Link href="/nosotros" className="text-lg underline underline-offset-4 hover:no-underline">
          Quiénes hacemos Molino
        </Link>
      </>, <><Link href="/nosotros" className="text-lg underline underline-offset-4 hover:no-underline">Who makes Molino</Link></>)}</PageHero>

      <KnowledgeSection label={L("Los principios", "The principles")} title={L("Cinco reglas que no se negocian", "Five non-negotiable rules")} intro={L("Cada decisión de producto pasa por estos filtros. Si no cumple, no entra.", "Every product decision goes through these filters. If it doesn't pass, it doesn't ship.")}>
        <ol className="border-t-2 border-ink" aria-label={L("Principios de Molino", "Molino's principles")}>
          {principles(L).map((principle, i) => (
            <li key={principle.id} id={principle.id} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_minmax(0,4fr)_minmax(0,7fr)] gap-x-8 gap-y-2 py-8 border-b border-ink/15 items-baseline">
              <span className="font-display text-4xl sm:text-5xl leading-none text-foreground tabular-nums">{i + 1}</span>
              <h3 className="font-display text-2xl sm:text-3xl leading-tight text-foreground">{principle.title}</h3>
              <p className="col-start-2 sm:col-start-auto text-lg text-foreground/80 leading-relaxed">{principle.description}</p>
            </li>
          ))}
        </ol>
      </KnowledgeSection>

      <KnowledgeSection label={L("El método", "The method")} title={L("Pilares metodológicos", "Methodological pillars")} intro={L("Cómo leemos los sistemas simbólicos sin caer en dogma ni en banalidad.", "How we read symbolic systems without falling into dogma or triviality.")} tone="alt">
        <Columns cols={pillars(L).map((p) => ({ title: p.title, body: p.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label={L("Las fuentes", "The sources")} title={L("De dónde viene", "Where it comes from")}>
        <TextWithFigure
          figure={
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-2xl text-foreground border-b-2 border-ink pb-2">{L("Tradición antigua", "Ancient tradition")}</h3>
                <ul className="mt-3 divide-y divide-ink/10 text-lg">
                  {ancientTraditions(L).map((name) => (
                    <li key={name} className="py-2 text-foreground/85">{name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground border-b-2 border-ink pb-2">{L("Sistemas contemporáneos", "Contemporary systems")}</h3>
                <ul className="mt-3 divide-y divide-ink/10 text-lg">
                  {contemporarySystems.map((sys) => (
                    <li key={sys.name} className="py-2 text-foreground/85">
                      {sys.name} <span className="text-muted">({sys.author}, {sys.year})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          }
        >
          <p>{L("Molino se basa en la numerología pitagórica, un sistema simbólico con más de 2.500 años de historia y de dominio público, y la combina con la astrología solar y el zodíaco chino.", "Molino is based on Pythagorean numerology, a symbolic system with more than 2,500 years of history and in the public domain, and combines it with sun-sign astrology and the Chinese zodiac.")}</p>
          <p>{L("Tu mapa se calcula solo con esos tres sistemas. Las demás corrientes son contexto que enriquece la lectura, pero no entran en la cuenta.", "Your map is calculated with those three systems only. The other traditions are context that enriches the reading, but they don't enter the calculation.")}</p>
          <p>{L(<>
            Para estudiarlas en serio, la <Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">biblioteca</Link> reúne
            las obras de referencia.
          </>, <>To study them seriously, the <Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">library</Link> gathers the reference works.</>)}</p>
        </TextWithFigure>
      </KnowledgeSection>

      <KnowledgeSection label={L("Los límites", "The limits")} title={L("Qué no es Molino", "What Molino is not")} intro={L("Para usar la herramienta con claridad, conviene saber hasta dónde llega.", "To use the tool clearly, it helps to know how far it goes.")} tone="alt">
        <Columns cols={noes.map((n) => ({ title: n.q, body: n.a }))} />
      </KnowledgeSection>
    </main>
  );
}
