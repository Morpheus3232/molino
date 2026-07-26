"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { NUMBERS, CALCULATIONS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";

export default function NumerologiaContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/explore" className="hover:text-accent transition-colors">Conocimiento</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Numerolog&iacute;a</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Conocimiento</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Numerolog&iacute;a
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl text-muted mt-4 leading-relaxed max-w-2xl">
            El lenguaje simb&oacute;lico de los n&uacute;meros y su relaci&oacute;n con la personalidad y los ciclos.
          </h2>
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-12">
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
            <p className="text-sm text-muted leading-relaxed">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* &Iacute;ndice */}
        <motion.section {...fadeUpDelayed(0.08)} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">&Iacute;ndice de contenidos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Qu&eacute; es la numerolog&iacute;a", id: "que-es" },
              { label: "Historia y evoluci&oacute;n", id: "historia" },
              { label: "Numerolog&iacute;a pitag&oacute;rica", id: "pitagorica" },
              { label: "Sistema de c&aacute;lculo", id: "calculos" },
              { label: "Los n&uacute;meros del 1 al 9", id: "numeros" },
              { label: "N&uacute;meros maestros", id: "maestros" },
              { label: "Limitaciones", id: "limitaciones" },
              { label: "Fuentes y referencias", id: "fuentes" },
            ].map((item) => (
              <button key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })} className="text-left text-sm text-foreground hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-foreground/5">
                {item.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* QU&Eacute; ES LA NUMEROLYG&Iacute;A */}
        <motion.section {...fadeUpDelayed(0.1)} id="que-es" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Qu&eacute; es la numerolog&iacute;a</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              La numerolog&iacute;a es un sistema de creencias que asigna significados simb&oacute;licos a los n&uacute;meros. Seg&uacute;n esta tradici&oacute;n, los n&uacute;meros poseen cualidades e influencias que pueden ofrecer perspectivas sobre la personalidad, los ciclos de vida y las tendencias personales.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              <strong>Es importante aclarar:</strong> la numerolog&iacute;a no es una ciencia. No existe evidencia emp&iacute;rica que respalde la idea de que los n&uacute;meros determinen rasgos de personalidad o destinos. Lo que s&iacute; existe es una tradici&oacute;n cultural de m&aacute;s de 2500 a&ntilde;os que Molino utiliza como herramienta de reflexi&oacute;n.
            </p>
            <div className="p-5 rounded-xl border border-border bg-card mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">En resumen</p>
              <p className="text-sm text-muted leading-relaxed">
                La numerolog&iacute;a es un lenguaje simb&oacute;lico. Molino la usa como una lente de autoconocimiento, no como una m&eacute;trica objetiva.
              </p>
            </div>
          </div>
        </motion.section>

        {/* HISTORIA */}
        <motion.section {...fadeUpDelayed(0.12)} id="historia" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y evoluci&oacute;n</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              Las ra&iacute;ces de la numerolog&iacute;a se remontan a <strong>Babilonia</strong> (actual Irak), donde los astr&oacute;logos babil&oacute;nicos ya asociaban n&uacute;meros con significados cosmol&oacute;gicos hace m&aacute;s de 3000 a&ntilde;os.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La figura m&aacute;s asociada con la numerolog&iacute;a occidental es <strong>Pit&aacute;goras</strong> (c. 570&ndash;495 a.C.), matem&aacute;tico y fil&oacute;sofo griego. Seg&uacute;n la tradici&oacute;n, Pit&aacute;goras ense&ntilde;aba que los n&uacute;meros eran la esencia de toda la realidad. Sin embargo, los historiadores modernos distinguen entre el pitagorismo hist&oacute;rico (una escuela filos&oacute;fica-matem&aacute;tica) y la numerolog&iacute;a esot&eacute;rica moderna, que se desarroll&oacute; siglos despu&eacute;s.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La numerolog&iacute;a <strong>moderna</strong> se consolid&oacute; en el siglo XX con autores como L. Dow Balliett y Florence Campbell. El sistema de correspondencia de letras y n&uacute;meros que usamos hoy fue codificado en el siglo XIX.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-xl border border-border bg-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Diferencia clave</p>
                <p className="text-sm text-muted leading-relaxed">
                  <strong>Pitagorismo hist&oacute;rico:</strong> Escuela filos&oacute;fica que ve&iacute;a los n&uacute;meros como principios matem&aacute;ticos del universo.
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  <strong>Numerolog&iacute;a esot&eacute;rica:</strong> Sistema moderno que asigna significados personales y predictivos a los n&uacute;meros bas&aacute;ndose en fechas y nombres.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Lo que dice la evidencia</p>
                <p className="text-sm text-muted leading-relaxed">
                  No existe evidencia cient&iacute;fica que respalde que los n&uacute;meros determinen rasgos de personalidad. La investigaci&oacute;n en psicolog&iacute;a no ha encontrado correlaciones v&aacute;lidas entre fechas de nacimiento y caracter&iacute;sticas psicol&oacute;gicas.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PITAG&Oacute;RICA */}
        <motion.section {...fadeUpDelayed(0.14)} id="pitagorica" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Numerolog&iacute;a pitag&oacute;rica</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              La numerolog&iacute;a pitag&oacute;rica es el sistema m&aacute;s utilizado en occidente. Asigna valores num&eacute;ricos del 1 al 9 a cada letra del alfabeto, y luego reduce cualquier suma a un solo d&iacute;gito.
            </p>
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Tabla de correspondencia</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-foreground">
                {["A=1", "B=2", "C=3", "D=4", "E=5", "F=6", "G=7", "H=8", "I=9", "J=1", "K=2", "L=3", "M=4", "N=5", "O=6", "P=7", "Q=8", "R=9", "S=1", "T=2", "U=3", "V=4", "W=5", "X=6", "Y=7", "Z=8"].map((v) => (
                  <span key={v} className="text-center py-1 px-2 rounded bg-background text-xs">{v}</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted mt-4">
              Nota: Este sistema fue codificado en el siglo XIX. La versi&oacute;n que usa Molino sigue esta convenci&oacute;n. Otros sistemas numerol&oacute;gicos usan tablas diferentes.
            </p>
          </div>
        </motion.section>

        {/* C&Aacute;LCULOS */}
        <motion.section {...fadeUpDelayed(0.16)} id="calculos" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">C&oacute;mo calcula Molino</h2>
          </div>
          <div className="space-y-6">
            {Object.values(CALCULATIONS).map((calc) => (
              <div key={calc.title} className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{calc.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{calc.description}</p>
                <div className="p-3 rounded-lg bg-background text-sm text-foreground font-mono mb-3">{calc.formula}</div>
                <p className="text-xs text-muted italic">{calc.caveat}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* N&Uacute;MEROS 1-9 */}
        <motion.section {...fadeUpDelayed(0.18)} id="numeros" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los n&uacute;meros del 1 al 9</h2>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Cada n&uacute;mero tiene un significado tradicional en la numerolog&iacute;a. Estas interpretaciones pertenecen a la tradici&oacute;n y no representan evidencia cient&iacute;fica.
          </p>
          <div className="space-y-6">
            {NUMBERS.filter(n => n.number <= 9).map((num, i) => (
              <motion.div key={num.number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.04, duration: 0.4 }}>
                <button onClick={() => router.push(`/conocimiento/numerologia/numero-${num.number}`)} className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-accent transition-all group">
                  <div className="flex items-start gap-5">
                    <p className="number-display text-4xl sm:text-5xl number-display-accent shrink-0">{num.number}</p>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{num.title}</h3>
                      <p className="text-sm text-muted mt-1 line-clamp-2">{num.meaning}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {num.keywords.map((kw) => (
                          <span key={kw} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-full border border-border">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0 hidden sm:block">Ver &rarr;</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* N&Uacute;MEROS MAESTROS */}
        <motion.section {...fadeUpDelayed(0.2)} id="maestros" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">N&uacute;meros maestros: 11, 22 y 33</h2>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Los n&uacute;meros maestros fueron incorporados a la numerolog&iacute;a moderna. No forman parte del sistema pitag&oacute;rico original.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NUMBERS.filter(n => n.number > 9).map((num) => (
              <motion.button key={num.number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} onClick={() => router.push(`/conocimiento/numerologia/numero-${num.number}`)} className="text-left p-5 rounded-xl border border-accent/20 bg-accent/[0.03] hover:border-accent/50 transition-all group">
                <p className="text-3xl font-serif font-bold text-accent mb-2">{num.number}</p>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{num.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{num.meaning}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* LIMITACIONES */}
        <motion.section {...fadeUpDelayed(0.22)} id="limitaciones" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Limitaciones y car&aacute;cter no cient&iacute;fico</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-sm text-foreground leading-relaxed">
                <strong>La numerolog&iacute;a no es una ciencia.</strong> No existe evidencia emp&iacute;rica que respalde que las fechas de nacimiento o los nombres determinen rasgos de personalidad, destinos o ciclos de vida. La investigaci&oacute;n en psicolog&iacute;a y ciencias cognitivas no ha encontrado correlaciones v&aacute;lidas.
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Molino utiliza la numerolog&iacute;a como <strong>herramienta de reflexi&oacute;n</strong>. Los significados que presentamos pertenecen a tradiciones culturales y simb&oacute;licas. Los c&aacute;lculos son deterministas y reproducibles, pero su interpretaci&oacute;n es simb&oacute;lica.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Si buscas informaci&oacute;n sobre salud, relaciones o decisiones importantes, consulta a un profesional calificado. La numerolog&iacute;a no reemplaza el consejo m&eacute;dico, psicol&oacute;gico o legal.
            </p>
          </div>
        </motion.section>

        {/* FUENTES */}
        <motion.section {...fadeUpDelayed(0.24)} id="fuentes" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes y referencias</h2>
          </div>
          <div className="space-y-3 max-w-3xl">
            {[
              { title: "Numerology", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/science/numerology" },
              { title: "Pythagoras", author: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/pythagoras/" },
              { title: "Pythagoreanism", author: "Internet Encyclopedia of Philosophy", url: "https://iep.utm.edu/pythagoreanism/" },
              { title: "Numerology and the Divine Triangle", author: "Faith Javane y Dusty Bunker (1979)" },
              { title: "Numerology: Key to Your Inner Self", author: "Hans Decoz (1994)" },
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
        </motion.section>

        {/* Herramientas relacionadas */}
        <motion.section {...fadeUpDelayed(0.24)} className="mb-12">
          <div className="p-6 rounded-2xl border border-accent/20 bg-accent/[0.03]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Herramienta relacionada</p>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Calculá tu Camino de Vida</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Ingresá tu fecha de nacimiento y descubrí tu número de Camino de Vida, Expression y más.
            </p>
            <Link href="/herramientas/camino-de-vida" className="text-sm font-medium text-accent hover:underline">
              Ir a la calculadora →
            </Link>
          </div>
        </motion.section>

        {/* Disclaimer final */}
        <motion.section {...fadeUpDelayed(0.26)}>
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </motion.section>

      </main>

      <UniversityFooter />
    </div>
  );
}
