"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { Hash, Sun, Moon, HeartHandshake, type LucideIcon } from "lucide-react";
import { PageHero, IndexGrid, Closing, CONTAINER } from "@/components/knowledge/Kit";

const TOOLS = (L: Pick2): { title: string; subtitle: string; description: string; href: string; icon: LucideIcon; color: string; labelColor: string }[] => ([
  {
    title: L("Camino de Vida", "Life Path"),
    subtitle: "Numerolog\u00eda",
    description: L("Calcul\u00e1 tu n\u00famero de Camino de Vida a partir de tu fecha de nacimiento. Descubr\u00ed qu\u00e9 energ\u00eda central ten\u00e9s seg\u00fan la tradici\u00f3n numerol\u00f3gica.", "Calculate your Life Path number from your date of birth. Discover your core energy according to the numerological tradition."),
    href: "/herramientas/camino-de-vida",
    icon: Hash,
    color: "var(--element-fire)",
    // --element-fire (#5B5B5B) da 2.74:1 sobre fondo oscuro como color de
    // texto \u2014 falla WCAG AA. Mismo tono, aclarado solo para este uso; el
    // \u00edcono sigue usando el token compartido tal cual.
    labelColor: "#838383",
  },
  {
    title: L("Signo Solar", "Sun Sign"),
    subtitle: "Astrolog\u00eda",
    description: L("Descubr\u00ed tu signo zodiacal solar, su elemento y modalidad a partir de tu fecha de nacimiento.", "Discover your sun sign, its element and modality from your date of birth."),
    href: "/herramientas/signo-solar",
    icon: Sun,
    color: "var(--layer-astrology)",
    labelColor: "#7F7F7F",
  },
  {
    title: "Zodiaco Chino",
    subtitle: L("Calendario chino", "Chinese calendar"),
    description: L("Tu animal, elemento y posici\u00f3n en el ciclo sexagenario. Un sistema de m\u00e1s de 2000 a\u00f1os.", "Your animal, element and position in the sexagenary cycle. A system more than 2,000 years old."),
    href: "/herramientas/zodiaco-chino",
    icon: Moon,
    color: "var(--layer-moment)",
    labelColor: "#7E7E7E",
  },
  {
    title: L("Compatibilidad", "Compatibility"),
    subtitle: L("Simbolog\u00eda cruzada", "Crossed symbolism"),
    description: L("Calcul\u00e1 la compatibilidad simb\u00f3lica entre dos perfiles usando el zodiaco chino y la numerolog\u00eda.", "Calculate the symbolic compatibility between two profiles using the Chinese zodiac and numerology."),
    href: "/herramientas/compatibilidad",
    icon: HeartHandshake,
    color: "var(--score-good)",
    labelColor: "var(--score-good)",
  },
]);

export default function HerramientasPage() {
  const L = useL();
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Herramientas", "Tools") }]}
        eyebrow={L("Herramientas · cuatro calculadoras", "Tools · four calculators")}
        title={L("Calculá tu identidad", "Calculate your identity")}
        lead={L("Escribís una fecha y tenés el resultado al instante, con la cuenta a la vista. Sin cuenta y sin servidor: se calcula en tu navegador.", "Type a date and get the result instantly, with the math in plain sight. No account and no server: it's calculated in your browser.")}
        imageKey="herramientas/hub"
      />
      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24`}>
          <IndexGrid
            cols={2}
            items={TOOLS(L).map((tool) => ({
              href: tool.href,
              kicker: tool.subtitle,
              title: tool.title,
              text: tool.description,
              cta: L("Calcular", "Calculate"),
            }))}
          />
          <div className="mt-16">
            <Closing
              title={L("Las cuatro, en un solo mapa", "All four, in a single map")}
              text={L("Las herramientas no guardan nada. Tu mapa junta los tres sistemas sobre tu fecha y los cruza; la síntesis integral es una capa Premium opcional.", "The tools don't save anything. Your map brings the three systems together on your date and crosses them; the integral synthesis is an optional Premium layer.")}
              href="/onboarding"
              cta={L("Crear mi mapa", "Create my map")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
