"use client";

import Image from "next/image";
import Link from "next/link";
import { getSectionImage } from "@/lib/data/section-images";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Índice ilustrado al pie de la portada: cada sección del sitio con su lámina,
 * como las láminas numeradas de un libro. Mosaico en vez de grilla pareja: la
 * primera lámina va grande y la última apaisada. Al pasar el mouse la lámina
 * se tiñe del rojo de la ilustración de la portada (multiplicar: lo blanco se
 * vuelve rojo, lo negro queda negro). Los créditos completos están en cada
 * página; acá van sin pie.
 */
const ENTRIES = [
  { href: "/conocimiento/numerologia", title: "Numerología", note: "Los números del 1 al 33", image: "numerologia/hub" },
  { href: "/conocimiento/astrologia", title: "Astrología", note: "Los doce signos", image: "astrologia/hub" },
  { href: "/conocimiento/zodiaco-chino", title: "Zodíaco chino", note: "Los doce animales", image: "zodiaco-chino/hub" },
  { href: "/calendario", title: "Calendario", note: "El número de cada día", image: "paginas/calendario" },
  { href: "/atlas", title: "Atlas", note: "Países, ciudades y marcas", image: "paginas/atlas" },
  { href: "/herramientas", title: "Herramientas", note: "Calculadoras rápidas", image: "herramientas/hub" },
  { href: "/academy", title: "Academia", note: "De dónde viene cada sistema", image: "academia/hub" },
  { href: "/biblioteca", title: "Biblioteca", note: "Las fuentes, una por una", image: "biblioteca/hub" },
] as const;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** Lugar de cada lámina en el mosaico de escritorio (4 columnas × 3 filas). */
const SPAN = [
  "col-span-2 row-span-2", // la primera, grande
  "", "", "", "", "", "",
  "col-span-2", // la última, apaisada
];

export default function HomeGallery() {
  const { ref, hidden } = useReveal<HTMLUListElement>();

  return (
    <section aria-labelledby="indice-home" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24">
        <p className="mb-3 text-center label-caps text-sm text-muted">Índice de láminas</p>
        <h2 id="indice-home" className="section-title text-center text-foreground">
          Para seguir leyendo
        </h2>
        <ul
          ref={ref}
          className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 auto-rows-[12rem] sm:auto-rows-[15rem] lg:auto-rows-[14.5rem] gap-3 sm:gap-4"
        >
          {ENTRIES.map((e, i) => {
            const img = getSectionImage(e.image);
            const lead = i === 0;
            return (
              <li
                key={e.href}
                className={`${SPAN[i]} transition-[clip-path,opacity] duration-[1100ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] motion-reduce:transition-none`}
                style={{
                  clipPath: hidden ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
                  opacity: hidden ? 0 : 1,
                  transitionDelay: hidden ? "0ms" : `${i * 90}ms`,
                }}
              >
                <Link
                  href={e.href}
                  className="group relative block h-full overflow-hidden border border-ink bg-paper-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
                >
                  {img && (
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes={lead ? "(max-width: 1024px) 100vw, 560px" : "(max-width: 1024px) 50vw, 280px"}
                      className="object-cover grayscale contrast-[1.08] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
                      style={{ transform: hidden ? "scale(1.18)" : undefined }}
                    />
                  )}
                  {/* El rojo de la ilustración, multiplicado sobre la lámina. */}
                  <span
                    className="absolute inset-0 bg-vermilion mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute left-0 top-0 bg-ink px-2.5 py-1 text-xs text-paper label-caps"
                    aria-hidden="true"
                  >
                    Lám. {ROMAN[i]}
                  </span>
                  <span className="absolute bottom-0 left-0 max-w-[88%] bg-paper px-3 pt-2 pb-2.5 sm:px-4 sm:pt-2.5 sm:pb-3">
                    <span
                      className={`block font-display leading-tight text-foreground group-hover:underline underline-offset-4 ${
                        lead ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"
                      }`}
                    >
                      {e.title}
                    </span>
                    <span className={`block text-muted ${lead ? "mt-1 text-sm sm:text-base" : "mt-0.5 text-xs sm:text-sm"}`}>
                      {e.note}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
