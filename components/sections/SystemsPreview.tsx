import Link from "next/link";
import Halftone from "@/components/ui/Halftone";

const systems = [
  {
    index: "01",
    micro: "LOS NÚMEROS",
    title: "NUMEROLOGÍA",
    description: "Tu estructura interior, leída a través de los números de tu fecha de nacimiento.",
    href: "/conocimiento/numerologia",
    texture: "grid" as const,
  },
  {
    index: "02",
    micro: "EL CIELO",
    title: "ASTROLOGÍA",
    description: "Tu momento de nacimiento en el mapa celeste y la posición de los astros.",
    href: "/conocimiento/astrologia",
    texture: "circle" as const,
  },
  {
    index: "03",
    micro: "LOS CICLOS",
    title: "ZODÍACO CHINO",
    description: "Tu energía en el tiempo, según la sabiduría ancestral de los ciclos animales.",
    href: "/conocimiento/zodiaco-chino",
    texture: "spiral" as const,
  },
];

const cellPad = "p-8 lg:p-12";

export default function SystemsPreview() {
  return (
    <section className="section-full-bleed bg-ink text-paper relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-40 -top-40 w-[34rem] h-[34rem] text-paper"
        style={{ opacity: 0.045 }}
      >
        <Halftone variant="spiral" resolution={30} className="w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-ink/20 border border-ink/20">
          {systems.map((system) => (
            <Link
              key={system.index}
              href={system.href}
              className="group relative p-8 lg:p-12 bg-ink border-b border-ink/20 last:border-b-0 transition-colors hover:bg-ink/10"
            >
              <div className="absolute inset-0 pointer-events-none">
                <Halftone variant={system.texture} resolution={20} className="w-full h-full text-paper opacity-[0.03]" />
              </div>
              <div className="relative z-10">
                <p className="label-micro mb-2">{system.micro}</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase">{system.title}</h2>
                <p className="mt-4 text-sm sm:text-base text-paper/70 leading-relaxed max-w-xs">{system.description}</p>
                <div className="mt-8 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-paper/60 group-hover:text-paper transition-colors">
                  <span>Explorar</span>
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}