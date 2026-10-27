"use client";

import { Link } from "@/lib/i18n/navigation";
import { useDictionary } from "@/lib/i18n/useDictionary";
import { PageHero, KnowledgeSection, Columns, TextWithFigure } from "@/components/knowledge/Kit";

const principles = [
  {
    id: "conocimiento-libre",
    title: "Conocimiento libre",
    description: "La información sobre uno mismo no debería tener dueño. Tu mapa, tus patrones y las tradiciones simbólicas están abiertos para explorarlos libremente, sin registro ni barreras académicas. Lo que descubras sobre ti es tuyo, punto. Para quien quiere ir más profundo, existe una capa opcional de síntesis integral.",
  },
  {
    id: "privacidad-radical",
    title: "Privacidad radical",
    description: "Tu fecha de nacimiento es el único dato que usamos para calcular tu mapa. Se guarda localmente en tu dispositivo (para que tu mapa siga ahí la próxima vez que entrás) y no se almacena en ningún servidor de Molino en forma directa: solo un identificador anónimo derivado de ella se usa para verificar el acceso a la capa Premium. No hay base de datos con tu perfil, no hay cookies de tracking.",
  },
  {
    id: "transparencia-total",
    title: "Transparencia total",
    description: "Cada cálculo es auditable. Las fórmulas de numerología, las posiciones astronómicas, los ciclos del zodíaco chino: todo el código está abierto. Si querés entender cómo llegamos a un resultado, podés leer el motor que lo generó.",
  },
  {
    id: "codigo-abierto",
    title: "Código abierto",
    description: "Molino es software libre (MIT). Cualquiera puede inspeccionar, copiar, modificar y distribuir el código. No hay vendor lock-in ni APIs de pago ocultas; el producto se sostiene con una capa Premium opcional, transparente. El proyecto vive en GitHub y acepta contribuciones.",
  },
  {
    id: "sin-tracking",
    title: "Sin tracking invasivo",
    description: "No hay píxeles de Facebook, no hay fingerprinting ni cookies de rastreo. Un registro de uso detallado (qué páginas visitás) vive exclusivamente en tu dispositivo —vos podés verlo y borrarlo en /analytics— y nunca sale de tu navegador. Además usamos Vercel Web Analytics para contar visitas de forma agregada y anónima (sin cookies, sin fingerprinting, sin perfil por persona) — solo para saber qué páginas se usan más, nunca para identificarte. Tu mapa gratuito se calcula 100% local: no llega a ningún servidor de Molino ni de terceros. Si activás Premium o IA, sí se envía un hash HMAC-SHA256 de tu perfil —nunca tu fecha de nacimiento en claro ni tu nombre— para validar el pago y habilitar el acceso.",
  },
];

const pillars = [
  {
    title: "Autoconocimiento, no predicción",
    description: "Los sistemas simbólicos no predicen el futuro. Son espejos. Molino te devuelve una imagen estructurada de tu momento de nacimiento para que vos la interpretes. La agencia siempre es tuya.",
  },
  {
    title: "Rigor simbólico, honestidad intelectual",
    description: "No presentamos la astrología o la numerología como ciencia. Son sistemas simbólicos con historia, coherencia interna y utilidad práctica para la reflexión. Los tratamos con el respeto que merecen, sin venderlos como verdad absoluta.",
  },
  {
    title: "Interdisciplinariedad real",
    description: "Números, cielo y ciclos no son compartimentos estancos. Molino los integra: tu Camino de Vida dialoga con tu signo solar y tu animal chino. Las afinidades surgen del cruce, no de la suma.",
  },
  {
    title: "Accesibilidad sin simplificación",
    description: "Simplificar no es empobrecer. Molino traduce conceptos complejos a lenguaje claro sin perder la profundidad. Cada lectura tiene capas: una vista rápida y el detalle técnico para quien quiera ir al fondo.",
  },
];

const ancientTraditions = [
  "Numerología pitagórica y caldea",
  "Astrología helenística y moderna",
  "Zodíaco chino (ciclo sexagenario, 12 animales, 5 elementos)",
  "I Ching y los 64 hexagramas",
  "Kabbalah y Árbol de la Vida",
  "Psicología arquetípica (Jung, Hillman)",
  "Eneagrama de la personalidad",
];

const contemporarySystems = [
  { name: "Human Design", author: "Ra Uru Hu", year: "1987" },
  { name: "Gene Keys", author: "Richard Rudd", year: "2009" },
];

export default function FilosofiaContent() {
  const t = useDictionary();
  const noes = [
    {
      q: "No es una predicción",
      a: "Molino no predice el futuro. Los sistemas simbólicos ofrecen patrones para la reflexión, no destinos escritos. Tus decisiones son siempre tuyas.",
    },
    {
      q: "No es ciencia",
      a: "La astrología, la numerología y el zodíaco chino son sistemas simbólicos con coherencia interna, no disciplinas científicas. No reemplazan el consejo médico, psicológico ni legal.",
    },
    {
      q: "No es terapia",
      a: "Es una herramienta de autoconocimiento, no un sustituto de la terapia. Si estás pasando por un momento difícil, buscá apoyo profesional.",
    },
    {
      q: "No es todo gratis",
      a: `Tu mapa, tus patrones y las tradiciones se exploran libremente, sin registro. Solo la síntesis integral es una capa Premium opcional de ${t.premium.priceLabel}, pago único y para siempre. Sin suscripciones.`,
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
      >
        <Link href="/nosotros" className="text-lg underline underline-offset-4 hover:no-underline">
          Quiénes hacemos Molino
        </Link>
      </PageHero>

      <KnowledgeSection label="Los principios" title="Cinco reglas que no se negocian" intro="Cada decisión de producto pasa por estos filtros. Si no cumple, no entra.">
        <ol className="border-t-2 border-ink" aria-label="Principios de Molino">
          {principles.map((principle, i) => (
            <li key={principle.id} id={principle.id} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_minmax(0,4fr)_minmax(0,7fr)] gap-x-8 gap-y-2 py-8 border-b border-ink/15 items-baseline">
              <span className="font-display text-4xl sm:text-5xl leading-none text-foreground tabular-nums">{i + 1}</span>
              <h3 className="font-display text-2xl sm:text-3xl leading-tight text-foreground">{principle.title}</h3>
              <p className="col-start-2 sm:col-start-auto text-lg text-foreground/80 leading-relaxed">{principle.description}</p>
            </li>
          ))}
        </ol>
      </KnowledgeSection>

      <KnowledgeSection label="El método" title="Pilares metodológicos" intro="Cómo leemos los sistemas simbólicos sin caer en dogma ni en banalidad." tone="alt">
        <Columns cols={pillars.map((p) => ({ title: p.title, body: p.description }))} />
      </KnowledgeSection>

      <KnowledgeSection label="Las fuentes" title="De dónde viene">
        <TextWithFigure
          figure={
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-2xl text-foreground border-b-2 border-ink pb-2">Tradición antigua</h3>
                <ul className="mt-3 divide-y divide-ink/10 text-lg">
                  {ancientTraditions.map((name) => (
                    <li key={name} className="py-2 text-foreground/85">{name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground border-b-2 border-ink pb-2">Sistemas contemporáneos</h3>
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
          <p>
            Molino se basa en la numerología pitagórica, un sistema simbólico con más de 2.500 años de historia y de
            dominio público, y la combina con la astrología solar y el zodíaco chino.
          </p>
          <p>
            Tu mapa se calcula solo con esos tres sistemas. Las demás corrientes son contexto que enriquece la
            lectura, pero no entran en la cuenta.
          </p>
          <p>
            Para estudiarlas en serio, la <Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">biblioteca</Link> reúne
            las obras de referencia.
          </p>
        </TextWithFigure>
      </KnowledgeSection>

      <KnowledgeSection label="Los límites" title="Qué no es Molino" intro="Para usar la herramienta con claridad, conviene saber hasta dónde llega." tone="alt">
        <Columns cols={noes.map((n) => ({ title: n.q, body: n.a }))} />
      </KnowledgeSection>
    </main>
  );
}
