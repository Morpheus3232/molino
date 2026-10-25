import Image from "next/image";
import Link from "next/link";
import { getSectionImage } from "@/lib/data/section-images";

/**
 * Índice ilustrado al pie de la portada: cada sección del sitio con su lámina,
 * como las entradas de un almanaque. Las imágenes y créditos completos están
 * en cada página; acá van chicas y sin pie.
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

export default function HomeGallery() {
  return (
    <section aria-labelledby="indice-home" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24">
        <p className="mb-3 text-center label-caps text-sm text-muted">Índice</p>
        <h2 id="indice-home" className="section-title text-center text-foreground">
          Para seguir leyendo
        </h2>
        <ul className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
          {ENTRIES.map((e) => {
            const img = getSectionImage(e.image);
            return (
              <li key={e.href}>
                <Link href={e.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden border border-border bg-paper-alt">
                    {img && (
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 270px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl sm:text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">
                    {e.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{e.note}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
