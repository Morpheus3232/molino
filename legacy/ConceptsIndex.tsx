import Link from "next/link";
import Halftone from "@/components/ui/Halftone";

export default function ConceptsIndex() {
  const entries = [
    { title: "ARQUETIPOS", desc: "Los patrones universales que moldean tu personalidad", href: "/conocimiento/numerologia", tier: "FUNDAMENTAL" },
    { title: "ELEMENTOS", desc: "Las energías primarias que componen tu naturaleza", href: "/conocimiento/astrologia", tier: "FUNDAMENTAL" },
    { title: "CICLOS", desc: "Los ritmos temporales que guían tu año personal", href: "/profile", tier: "TEMPORAL" },
    { title: "NÚMEROS MAESTROS", desc: "Las frecuencias elevadas de tu mapa numérico", href: "/conocimiento/numerologia", tier: "AVANZADO" },
    { title: "COMPATIBILIDAD", desc: "Cómo interactúan tus patrones con otros", href: "/compatibility/countries", tier: "RELACIONAL" },
    { title: "MOMENTUM", desc: "La energía disponible en tu ciclo actual", href: "/timing", tier: "DINÁMICO" },
  ];

  const cellPad = "p-8 lg:p-12";

  return (
    <section className="section-full-bleed bg-accent text-paper relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-40 bottom-0 w-[32rem] h-[32rem] text-paper"
        style={{ opacity: 0.07 }}
      >
        <Halftone variant="wave" resolution={28} className="w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-accent/20 border border-accent/20">
          {entries.map((entry, i) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group relative p-8 lg:p-12 bg-accent border-b border-accent/20 last:border-b-0 transition-colors hover:bg-accent/10"
            >
              <div className="absolute inset-0 pointer-events-none">
                <Halftone variant="wave" resolution={15} className="w-full h-full text-paper opacity-[0.02]" />
              </div>
              <div className="relative z-10">
                <p className="label-micro mb-2">{entry.tier}</p>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight uppercase">{entry.title}</h3>
                <p className="mt-3 text-sm text-paper/70 leading-relaxed max-w-xs">{entry.desc}</p>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-paper/60 group-hover:text-paper transition-colors">
                  <span>Leer más</span>
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