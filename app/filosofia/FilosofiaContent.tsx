"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed, staggerContainer, staggerItem } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const principles = [
  {
    id: "conocimiento-libre",
    title: "Conocimiento libre",
    description: "La información sobre uno mismo no debería tener dueño. Molino pone a tu disposición sistemas simbólicos milenarios sin barreras de pago, suscripciones ni muros académicos. Lo que descubras sobre ti es tuyo, punto.",
  },
  {
    id: "privacidad-radical",
    title: "Privacidad radical",
    description: "Tu fecha de nacimiento es el único dato que usamos, y nunca sale de tu navegador. No hay base de datos, no hay servidor guardando tu perfil, no hay cookies de tracking. Tu mapa de autoconocimiento existe solo mientras la pestaña está abierta.",
  },
  {
    id: "transparencia-total",
    title: "Transparencia total",
    description: "Cada cálculo es auditable. Las fórmulas de numerología, las posiciones astronómicas, los ciclos del zodíaco chino: todo el código está abierto. Si querés entender cómo llegamos a un resultado, podés leer el motor que lo generó.",
  },
  {
    id: "codigo-abierto",
    title: "Código abierto",
    description: "Molino es software libre (MIT). Cualquiera puede inspeccionar, copiar, modificar y distribuir el código. No hay vendor lock-in, no hay API de pago, no hay funciones premium ocultas. El proyecto vive en GitHub y acepta contribuciones.",
  },
  {
    id: "sin-tracking",
    title: "Sin tracking",
    description: "Ni analytics, ni píxeles de Facebook, ni Google Analytics, ni fingerprinting. Tu visita no genera datos para terceros. El único \"tracking\" es el que vos decidís hacer sobre tu propia vida.",
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

const influences = [
  "Numerología pitagórica y caldea",
  "Astrología tropical helenística y moderna",
  "Zodíaco chino (ciclo sexagenario, 12 animales, 5 elementos)",
  "I Ching y los 64 hexagramas",
  "Eneagrama de la personalidad",
  "Human Design (Ra Uru Hu / Jovian Archive)",
  "Gene Keys (Richard Rudd)",
  "Kabbalah y Árbol de la Vida",
  "Tarot de Marsella y Rider-Waite",
  "Psicología arquetípica (Jung, Hillman)",
];

export default function FilosofiaContent() {
  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-24">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Filosofía</p>
          <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
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
            <h2 className="font-heading uppercase text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
              Cinco principios innegociables
            </h2>
            <p className="text-muted max-w-xl">
              Cada decisión de producto pasa por estos filtros. Si no cumple, no entra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Principios de Molino">
            {principles.map((principle, i) => (
              <motion.article
                key={principle.id}
                role="listitem"
                id={principle.id}
                {...staggerItem}
                className="group p-6 rounded-xl border border-border bg-card/50 hover:border-accent/50 hover:bg-card transition-all duration-300"
              >
                <h3 className="font-heading uppercase text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {principle.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading uppercase text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
              Pilares metodológicos
            </h2>
            <p className="text-muted max-w-xl">
              Cómo abordamos los sistemas simbólicos sin caer en dogmatismo ni banalidad.
            </p>
          </div>

          <div className="space-y-6" role="list" aria-label="Pilares metodológicos">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                role="listitem"
                {...staggerItem}
                className="p-6 rounded-xl border border-border bg-card/30"
              >
                <h3 className="font-heading uppercase text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Influences */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-20">
          <div className="mb-10">
            <h2 className="font-heading uppercase text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
              Tradiciones que nos nutren
            </h2>
            <p className="text-muted max-w-xl">
              Molino sintetiza múltiples corrientes. No inventamos: curamos, integramos y ponemos a dialogar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3" role="list" aria-label="Tradiciones e influencias">
            {influences.map((influence, i) => (
              <motion.span
                key={influence}
                role="listitem"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="px-4 py-2 rounded-full border border-border bg-background text-sm text-muted hover:border-accent/50 hover:text-foreground transition-colors"
              >
                {influence}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </main>

      <UniversityFooter />
    </div>
  );
}