"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed, staggerItem } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { useDictionary } from "@/lib/i18n/useDictionary";

const PRINCIPLE_ICONS: Record<string, string> = {
  "conocimiento-libre": "01",
  "privacidad-radical": "02",
  "transparencia-total": "03",
  "codigo-abierto": "04",
  "sin-tracking": "05",
};

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
    description: "No hay píxeles de Facebook, no hay Google Analytics, no hay fingerprinting ni cookies de rastreo. Medimos lo mínimo para saber si Molino te sirve —qué páginas se visitan, sin nombre ni fecha de nacimiento asociada— y nunca lo vendemos ni lo compartimos con terceros con fines publicitarios.",
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
  "Astrología tropical helenística y moderna",
  "Zodíaco chino (ciclo sexagenario, 12 animales, 5 elementos)",
  "I Ching y los 64 hexagramas",
  "Kabbalah y Árbol de la Vida",
  "Tarot de Marsella y Rider-Waite",
  "Psicología arquetípica (Jung, Hillman)",
  "Eneagrama de la personalidad",
];

const contemporarySystems = [
  { name: "Human Design", author: "Ra Uru Hu", year: "1987" },
  { name: "Gene Keys", author: "Richard Rudd", year: "2009" },
];

export default function FilosofiaContent() {
  const t = useDictionary();
  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-muted font-medium mb-4">Filosofía</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            Principios y fundamentos
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-2xl leading-relaxed">
            Molino no es una app más de horóscopos. Es una herramienta de autoconocimiento construida
            sobre principios claros: libertad, privacidad, transparencia y honestidad intelectual.
          </p>
        </motion.section>

        {/* Principles */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
              Cinco principios innegociables
            </h2>
            <p className="text-muted max-w-xl">
              Cada decisión de producto pasa por estos filtros. Si no cumple, no entra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4" role="list" aria-label="Principios de Molino">
            {principles.map((principle, i) => (
              <motion.article
                key={principle.id}
                role="listitem"
                id={principle.id}
                {...staggerItem}
                className="group p-6 border border-ink/10 bg-background hover:bg-ink/[0.02] hover:border-ink/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold tracking-wider text-accent shrink-0 mt-0.5">
                    {PRINCIPLE_ICONS[principle.id]}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
              Pilares metodológicos
            </h2>
            <p className="text-muted max-w-xl">
              Cómo abordamos los sistemas simbólicos sin caer en dogmatismo ni banalidad.
            </p>
          </div>

          <div className="space-y-px bg-ink/10" role="list" aria-label="Pilares metodológicos">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                role="listitem"
                {...staggerItem}
                className="p-6 sm:p-8 bg-background"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold tracking-wider text-muted shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Traditions */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
              Tradiciones que nos nutren
            </h2>
            <p className="text-muted max-w-xl">
              Molino sintetiza múltiples corrientes. No inventamos: curamos, integramos y ponemos a dialogar.
            </p>
          </div>

          {/* Ancient traditions */}
          <div className="mb-10">
            <span className="inline-block font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 px-3 py-1 border border-accent/20">
              Tradición ancestral
            </span>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Tradiciones ancestrales">
              {ancientTraditions.map((influence, i) => (
                <motion.span
                  key={influence}
                  role="listitem"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="px-4 py-2 border border-ink/10 bg-background text-sm text-muted hover:border-ink/20 hover:text-foreground transition-colors"
                >
                  {influence}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Contemporary systems */}
          <div>
            <span className="inline-block font-mono text-xs font-semibold tracking-[0.2em] uppercase text-ink/50 mb-4 px-3 py-1 border border-ink/10">
              Sistema contemporáneo
            </span>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Sistemas contemporáneos">
              {contemporarySystems.map((sys, i) => (
                <motion.span
                  key={sys.name}
                  role="listitem"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 + 0.24, duration: 0.3 }}
                  className="px-4 py-2 border border-ink/10 bg-background text-sm text-muted hover:border-ink/20 hover:text-foreground transition-colors"
                >
                  {sys.name} <span className="text-muted">({sys.author}, {sys.year})</span>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ / Qué NO es Molino */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
              Qué NO es Molino
            </h2>
            <p className="text-muted max-w-xl">
              Para usar esta herramienta con claridad, es importante entender sus límites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-ink/10">
            {[
              {
                q: "No es una predicción",
                a: "Molino no predice el futuro. Los sistemas simbólicos ofrecen patrones para la reflexión, no destinos escritos. Tu agencia y tus decisiones son siempre tuyas.",
              },
              {
                q: "No es ciencia",
                a: "La astrología, la numerología y el zodíaco chino son sistemas simbólicos con coherencia interna, no disciplinas científicas. No reemplazan el consejo médico, psicológico ni legal.",
              },
              {
                q: "No es terapia",
                a: "Molino es una herramienta de autoconocimiento, no un sustituto de la terapia profesional. Si estás pasando por un momento difícil, buscá apoyo profesional calificado.",
              },
              {
                q: "No es un producto gratuito en su totalidad",
                a: `Tu mapa, tus patrones y las tradiciones se exploran libremente, sin registro. Solo la síntesis integral —la lectura que conecta todos tus sistemas— es una capa Premium opcional de ${t.premium.priceLabel}, pago único y acceso permanente. No hay suscripciones ni versiones por mes.`,
              },
            ].map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="p-6 sm:p-8 bg-background"
              >
                <h3 className="font-heading text-base text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>

      <UniversityFooter />
    </div>
  );
}
