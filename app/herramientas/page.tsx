"use client";

import { Hash, Sun, Moon, HeartHandshake, type LucideIcon } from "lucide-react";
import { PageHero, IndexGrid, Closing, CONTAINER } from "@/components/knowledge/Kit";

const TOOLS: { title: string; subtitle: string; description: string; href: string; icon: LucideIcon; color: string; labelColor: string }[] = [
  {
    title: "Camino de Vida",
    subtitle: "Numerolog\u00eda",
    description: "Calcul\u00e1 tu n\u00famero de Camino de Vida a partir de tu fecha de nacimiento. Descubr\u00ed qu\u00e9 energ\u00eda central ten\u00e9s seg\u00fan la tradici\u00f3n numerol\u00f3gica.",
    href: "/herramientas/camino-de-vida",
    icon: Hash,
    color: "var(--element-fire)",
    // --element-fire (#5B5B5B) da 2.74:1 sobre fondo oscuro como color de
    // texto \u2014 falla WCAG AA. Mismo tono, aclarado solo para este uso; el
    // \u00edcono sigue usando el token compartido tal cual.
    labelColor: "#838383",
  },
  {
    title: "Signo Solar",
    subtitle: "Astrolog\u00eda",
    description: "Descubr\u00ed tu signo zodiacal solar, su elemento y modalidad a partir de tu fecha de nacimiento.",
    href: "/herramientas/signo-solar",
    icon: Sun,
    color: "var(--layer-astrology)",
    labelColor: "#7F7F7F",
  },
  {
    title: "Zodiaco Chino",
    subtitle: "Calendario chino",
    description: "Tu animal, elemento y posici\u00f3n en el ciclo sexagenario. Un sistema de m\u00e1s de 2000 a\u00f1os.",
    href: "/herramientas/zodiaco-chino",
    icon: Moon,
    color: "var(--layer-moment)",
    labelColor: "#7E7E7E",
  },
  {
    title: "Compatibilidad",
    subtitle: "Simbolog\u00eda cruzada",
    description: "Calcul\u00e1 la compatibilidad simb\u00f3lica entre dos perfiles usando el zodiaco chino y la numerolog\u00eda.",
    href: "/herramientas/compatibilidad",
    icon: HeartHandshake,
    color: "var(--score-good)",
    labelColor: "var(--score-good)",
  },
];

export default function HerramientasPage() {
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Herramientas" }]}
        eyebrow="Herramientas · cuatro calculadoras"
        title="Calculá tu identidad"
        lead="Escribís una fecha y tenés el resultado al instante, con la cuenta a la vista. Sin cuenta y sin servidor: se calcula en tu navegador."
        imageKey="herramientas/hub"
      />
      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24`}>
          <IndexGrid
            cols={2}
            items={TOOLS.map((tool) => ({
              href: tool.href,
              kicker: tool.subtitle,
              title: tool.title,
              text: tool.description,
              cta: "Calcular",
            }))}
          />
          <div className="mt-16">
            <Closing
              title="Las cuatro, en un solo mapa"
              text="Las herramientas no guardan nada. Tu mapa junta los tres sistemas sobre tu fecha y los cruza; la síntesis integral es una capa Premium opcional."
              href="/onboarding"
              cta="Crear mi mapa"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
