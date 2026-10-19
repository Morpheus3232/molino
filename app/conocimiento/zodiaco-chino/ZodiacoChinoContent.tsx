import Link from "next/link";
import { CHINESE_ANIMALS, CHINESE_ELEMENTS, CHINESE_ZODIAC_DISCLAIMER } from "@/lib/data/zodiaco-chino-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import { CHINESE_NEW_YEAR_DATES } from "@/lib/data/chinese-new-year";
import { getChineseAnimal, getChineseElement } from "@/lib/engines/chineseZodiacEngine";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Año por año, de 1924 a 2031: animal, elemento y el día en que empieza. */
const YEAR_TABLE = Array.from({ length: 2031 - 1924 + 1 }, (_, i) => 1924 + i).map((year) => {
  const [, m, d] = CHINESE_NEW_YEAR_DATES[year].split("-").map(Number);
  return { year, animal: getChineseAnimal(year), element: getChineseElement(year), start: `${d} ${MESES[m - 1]}` };
});

export default function ZodiacoChinoContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/explore" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Conocimiento</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Zod&#237;aco Chino</span>
        </nav>

        <Reveal tag="section" className="mb-16 sm:mb-20">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]">Zod&#237;aco Chino</h1>
          <h2 className="font-heading text-xl sm:text-2xl text-muted mt-4 leading-relaxed max-w-2xl">
            Los 12 animales, los 5 elementos y el ciclo de 60 a&#241;os.
          </h2>
        </Reveal>

        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="p-6 border border-accent/20">
            <p className="text-sm text-muted leading-relaxed">{CHINESE_ZODIAC_DISCLAIMER}</p>
          </div>
        </Reveal>

        {/* Historia */}
        <Reveal tag="section" delay={0.1} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Historia y origen</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              El zod&#237;aco chino tiene una antig&#252;edad de al menos 2000 a&#241;os, con ra&#237;ces en la dinast&#237;a Han. A diferencia de la astrolog&#237;a occidental, que se basa en la posici&#243;n de las estrellas, el zod&#237;aco chino se basa en un <strong>calendario</strong>: el calendario sexagenario.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              Este sistema combina <strong>12 animales</strong> (ra&#237;ces terrestres) con <strong>10 troncos celestes</strong> (asociados a los 5 elementos en polaridad Yin/Yang), creando un ciclo de <strong>60 combinaciones &#250;nicas</strong>.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La data m&#225;s antigua que se conoce proviene de tablillas de hueso oraculares de la dinast&#237;a Shang (c. 1250 a.C.), donde ya aparecen los 12 animales asociados a meses.
            </p>
            <div className="p-6 border border-ink/10 mt-6">
              <p className="text-sm text-accent font-medium mb-2 label-caps">En resumen</p>
              <p className="text-sm text-muted leading-relaxed">
                El zod&#237;aco chino es un sistema de data cultural estructurada. No es un sistema de predicciones, sino un modelo c&#237;clico que estructura el tiempo de una cultura.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Los 12 animales */}
        <Reveal tag="section" delay={0.15} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Los 12 animales</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CHINESE_ANIMALS.map((animal) => (
              <Link key={animal.name} href={`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`} className="text-left p-4 border border-ink/10 hover:border-accent transition-colors group">
                <div className="mb-2 text-accent group-hover:scale-105 transition-transform origin-left">
                  <ZodiacAnimalIcon animal={animal.name} size={32} />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-accent transition-colors">{animal.name}</h3>
                 <p className="text-xs text-muted mt-1 group-hover:text-accent transition-colors inline-flex items-center gap-1">
                   {animal.traits.slice(0, 3).join(", ")}
                   <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                 </p>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Tabla por año */}
        <Reveal tag="section" delay={0.15} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">¿Qué animal sos? Tabla por año, de 1924 a 2031</h2>
          </div>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mb-6">
            El año chino no empieza el 1 de enero sino con el Año Nuevo lunar, entre el 21 de enero y el 21 de febrero. Si naciste antes de la fecha de tu año, tu animal es el del año anterior.
          </p>
          <div className="sm:columns-2 lg:columns-3 gap-8 text-sm">
            {YEAR_TABLE.map((y) => (
              <p key={y.year} className="flex justify-between gap-3 py-1 border-b border-ink/10 break-inside-avoid">
                <span className="font-semibold tabular-nums">{y.year}</span>
                <Link href={`/conocimiento/zodiaco-chino/${y.animal.toLowerCase()}`} className="flex-1 underline decoration-ink/25 underline-offset-2 hover:decoration-ink">
                  {y.animal} de {y.element}
                </Link>
                <span className="text-muted tabular-nums">desde el {y.start}</span>
              </p>
            ))}
          </div>
        </Reveal>

        {/* Los 5 elementos */}
        <Reveal tag="section" delay={0.2} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Los 5 elementos</h2>
          </div>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mb-6">
            Cada elemento rige dos años seguidos —uno Yang (los terminados en número par) y otro Yin (impar)— y el ciclo completo de 12 animales por 5 elementos se repite cada 60 años. Los años terminados en 0 y 1 son de Metal; en 2 y 3, de Agua; en 4 y 5, de Madera; en 6 y 7, de Fuego; en 8 y 9, de Tierra.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHINESE_ELEMENTS.map((el) => (
              <div key={el.name} className="p-6 border border-ink/10">
                <p className="font-heading text-xl font-semibold text-foreground mb-2">{el.name}</p>
                <p className="text-xs text-muted">{el.qualities.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Fuentes */}
        <Reveal tag="section" delay={0.25} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Fuentes</h2>
          </div>
          <div className="space-y-3 max-w-3xl">
            {[
              { title: "Chinese Zodiac", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Chinese-zodiac" },
              { title: "The Handbook of Chinese Horoscopes", author: "Theodora Lau (1979), Tuttle Publishing" },
              { title: "Chinese Astrology: A Primer", author: "Stephen Skinner (2000)" },
            ].map((src) => (
              <div key={src.title} className="flex items-start gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{src.title}</p>
                  <p className="text-xs text-muted">{src.author}{src.url ? ` · ${src.url}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Herramientas relacionadas */}
        <Reveal tag="section" delay={0.28} className="mb-12">
          <div className="p-6 border border-accent/20">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Conocé tu animal y compatibilidades</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Calculá tu animal del zodiaco chino o compará la compatibilidad entre dos personas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/herramientas/zodiaco-chino" className="text-sm font-medium text-accent hover:underline">
                Calculá tu animal →
              </Link>
              <Link href="/herramientas/compatibilidad" className="text-sm font-medium text-accent hover:underline">
                Compatibilidad persona↔persona →
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal tag="section" delay={0.3}>
          <div className="p-6 border border-ink/10">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
