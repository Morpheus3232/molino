import Link from "next/link";

const systems = [
  {
    index: "01",
    title: "NUMEROLOGÍA",
    description: "Tu estructura interior, leída a través de los números de tu fecha de nacimiento.",
    href: "/conocimiento/numerologia",
  },
  {
    index: "02",
    title: "ASTROLOGÍA",
    description: "Tu momento de nacimiento en el mapa celeste y la posición de los astros.",
    href: "/conocimiento/astrologia",
  },
  {
    index: "03",
    title: "ZODÍACO CHINO",
    description: "Tu energía en el tiempo, según la sabiduría ancestral de los ciclos animales.",
    href: "/conocimiento/zodiaco-chino",
  },
];

export default function SystemsPreview() {
  return (
    <section className="bg-background border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        <p className="eyebrow-brutalist mb-10">Tres sistemas, un mapa</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {systems.map((system) => (
            <Link
              key={system.index}
              href={system.href}
              className="group block"
            >
              <p className="font-mono text-[0.6rem] tracking-[0.2em] text-muted/50 uppercase mb-2">{system.index}</p>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight uppercase group-hover:text-accent transition-colors">{system.title}</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">{system.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent group-hover:text-accent/80 transition-colors">
                Explorar
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
