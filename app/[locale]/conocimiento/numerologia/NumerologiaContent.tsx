import { Link } from "@/lib/i18n/navigation";
import { NUMBERS, CALCULATIONS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";
import { LifePathInstrument } from "@/components/knowledge/Instruments";
import { CONTAINER } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";

export default function NumerologiaContent() {
  return (
    <div className="min-h-screen bg-background">

      <main id="main-content">
        <LifePathInstrument crumbs={[{ href: "/", label: "Inicio" }, { href: "/explore", label: "Conocimiento" }, { label: "Numerología" }]} title="Numerología" lead="Tu fecha de nacimiento, sumada dígito por dígito, da un número del 1 al 9, o un maestro. La cuenta queda a la vista." />
        <div className={`${CONTAINER} py-16 sm:py-24`}>

        {/* Disclaimer */}
        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <p className="text-sm text-muted leading-relaxed">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </Reveal>

        {/* Índice */}
        <Reveal tag="section" delay={0.08} className="mb-12 sm:mb-16">
          <h2 className="section-title text-foreground mb-6 pt-10 border-t-2 border-ink">Índice de contenidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/15">
            {[
              { label: "Qué es la numerología", id: "que-es" },
              { label: "Historia y evolución", id: "historia" },
              { label: "Numerología pitagórica", id: "pitagorica" },
              { label: "Sistema de cálculo", id: "calculos" },
              { label: "Los números del 1 al 9", id: "numeros" },
              { label: "Números maestros", id: "maestros" },
              { label: "Limitaciones", id: "limitaciones" },
              { label: "Fuentes y referencias", id: "fuentes" },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="border-r border-b border-ink/15 px-5 py-4 font-display text-xl text-foreground hover:bg-ink/[0.03] hover:underline underline-offset-4">
                {item.label}
              </a>
            ))}
          </div>
        </Reveal>

        {/* QUÉ ES LA NUMEROLYGÍA */}
        <Reveal tag="section" delay={0.1} id="que-es" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Qué es la numerología</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">
              La numerología es un sistema de creencias que asigna significados simbólicos a los números. Según esta tradición, los números poseen cualidades e influencias que pueden ofrecer perspectivas sobre la personalidad, los ciclos de vida y las tendencias personales.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Es importante aclarar:</strong> la numerología no es una ciencia. No existe evidencia empírica que respalde la idea de que los números determinen rasgos de personalidad o destinos. Lo que sí existe es una tradición cultural de más de 2500 años que Molino utiliza como herramienta de reflexión.
            </p>
            <div className="p-6 border border-ink/10 mt-6">
              <p className="text-sm text-muted mb-2 label-caps">En resumen</p>
              <p className="text-sm text-muted leading-relaxed">
                La numerología es un lenguaje simbólico. Molino la usa como una lente de autoconocimiento, no como una métrica objetiva.
              </p>
            </div>
          </div>
        </Reveal>

        {/* HISTORIA */}
        <Reveal tag="section" delay={0.12} id="historia" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Historia y evolución</h2>
          <SectionCover imageKey="numerologia/hub" className="mb-10 max-w-3xl" />
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">
              Las raíces de la numerología se remontan a <strong>Babilonia</strong> (actual Irak), donde los astrólogos babilónicos ya asociaban números con significados cosmológicos hace más de 3000 años.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              La figura más asociada con la numerología occidental es <strong>Pitágoras</strong> (c. 570–495 a.C.), matemático y filósofo griego. Según la tradición, Pitágoras enseñaba que los números eran la esencia de toda la realidad. Sin embargo, los historiadores modernos distinguen entre el pitagorismo histórico (una escuela filosófica-matemática) y la numerología esotérica moderna, que se desarrolló siglos después.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              La numerología <strong>moderna</strong> se consolidó en el siglo XX con autores como L. Dow Balliett y Florence Campbell. El sistema de correspondencia de letras y números que usamos hoy fue codificado en el siglo XIX.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-6 border border-ink/10">
                <p className="text-sm text-muted mb-2 label-caps">Diferencia clave</p>
                <p className="text-sm text-muted leading-relaxed">
                  <strong>Pitagorismo histórico:</strong> Escuela filosófica que veía los números como principios matemáticos del universo.
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  <strong>Numerología esotérica:</strong> Sistema moderno que asigna significados personales y predictivos a los números basándose en fechas y nombres.
                </p>
              </div>
              <div className="p-6 border border-ink/10">
                <p className="text-sm text-muted mb-2 label-caps">Lo que dice la evidencia</p>
                <p className="text-sm text-muted leading-relaxed">
                  No existe evidencia científica que respalde que los números determinen rasgos de personalidad. La investigación en psicología no ha encontrado correlaciones válidas entre fechas de nacimiento y características psicológicas.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* PITAGÓRICA */}
        <Reveal tag="section" delay={0.14} id="pitagorica" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Numerología pitagórica</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">
              La numerología pitagórica es el sistema más utilizado en occidente. Asigna valores numéricos del 1 al 9 a cada letra del alfabeto, y luego reduce cualquier suma a un solo dígito.
            </p>
            <div className="p-6 border border-ink/10">
              <p className="text-sm text-accent font-medium mb-3 label-caps">Tabla de correspondencia</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-foreground">
                {["A=1", "B=2", "C=3", "D=4", "E=5", "F=6", "G=7", "H=8", "I=9", "J=1", "K=2", "L=3", "M=4", "N=5", "O=6", "P=7", "Q=8", "R=9", "S=1", "T=2", "U=3", "V=4", "W=5", "X=6", "Y=7", "Z=8"].map((v) => (
                  <span key={v} className="text-center py-1 px-2 rounded bg-background text-sm">{v}</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted mt-4">
              Nota: Este sistema fue codificado en el siglo XIX. La versión que usa Molino sigue esta convención. Otros sistemas numerológicos usan tablas diferentes.
            </p>
          </div>
        </Reveal>

        {/* CÁLCULOS */}
        <Reveal tag="section" delay={0.16} id="calculos" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Cómo calcula Molino</h2>
          <div className="space-y-6">
            {Object.values(CALCULATIONS).map((calc) => (
              <div key={calc.title} className="p-6 border border-ink/10">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{calc.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{calc.description}</p>
                <div className="p-3 rounded-md bg-background text-sm text-foreground font-mono mb-3">{calc.formula}</div>
                <p className="text-sm text-muted italic">{calc.caveat}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* NÚMEROS 1-9 */}
        <Reveal tag="section" delay={0.18} id="numeros" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Los números del 1 al 9</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Cada número tiene un significado tradicional en la numerología. Estas interpretaciones pertenecen a la tradición y no representan evidencia científica.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/15">
            {NUMBERS.filter(n => n.number <= 9).map((num) => (
              <li key={num.number} className="border-r border-b border-ink/15">
                <Link href={`/conocimiento/numerologia/${num.number}`} className="group flex h-full gap-5 p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="font-display text-6xl leading-none text-foreground w-10 shrink-0">{num.number}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{num.title}</span>
                    <span className="mt-2 block text-base text-muted leading-snug line-clamp-3">{num.meaning}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* NÚMEROS MAESTROS */}
        <Reveal tag="section" delay={0.2} id="maestros" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Números maestros: 11, 22 y 33</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Los números maestros fueron incorporados a la numerología moderna. No forman parte del sistema pitagórico original.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-ink">
            {NUMBERS.filter(n => n.number > 9).map((num) => (
              <li key={num.number} className="border-b border-ink/15 sm:border-b-0 sm:border-r last:border-r-0">
                <Link href={`/conocimiento/numerologia/${num.number}`} className="group block h-full p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="block font-display text-6xl leading-none text-foreground">{num.number}</span>
                  <span className="mt-3 block font-display text-2xl text-foreground group-hover:underline underline-offset-4">{num.title}</span>
                  <span className="mt-2 block text-base text-muted leading-relaxed">{num.meaning}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* LIMITACIONES */}
        <Reveal tag="section" delay={0.22} id="limitaciones" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Limitaciones y carácter no científico</h2>
          <div className="max-w-3xl space-y-4">
            <div className="p-6 border border-ink/10">
              <p className="text-sm text-foreground leading-relaxed">
                <strong>La numerología no es una ciencia.</strong> No existe evidencia empírica que respalde que las fechas de nacimiento o los nombres determinen rasgos de personalidad, destinos o ciclos de vida. La investigación en psicología y ciencias cognitivas no ha encontrado correlaciones válidas.
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Molino utiliza la numerología como <strong>herramienta de reflexión</strong>. Los significados que presentamos pertenecen a tradiciones culturales y simbólicas. Los cálculos son deterministas y reproducibles, pero su interpretación es simbólica.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Si buscas información sobre salud, relaciones o decisiones importantes, consulta a un profesional calificado. La numerología no reemplaza el consejo médico, psicológico o legal.
            </p>
          </div>
        </Reveal>

        {/* FUENTES */}
        <Reveal tag="section" delay={0.24} id="fuentes" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Fuentes y referencias</h2>
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
                  <p className="text-sm text-muted">{src.author}{src.url ? ` · ${src.url}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Herramientas relacionadas */}
        <Reveal tag="section" delay={0.24} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Calculá tu Camino de Vida</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Ingresá tu fecha de nacimiento y calculá tu número de Camino de Vida, Expresión y más.
            </p>
            <Link href="/herramientas/camino-de-vida" className="text-sm font-medium text-accent hover:underline">
              Ir a la calculadora →
            </Link>
          </div>
        </Reveal>

        {/* Profundizá — interlinking hacia el contenido que ya tiene tracción
            real en Search Console (Fase 6A), ausente hasta ahora desde el hub. */}
        <Reveal tag="section" delay={0.25} className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/blog/numerologia-ano-personal" className="block p-6 border border-ink/10 hover:bg-ink/[0.03] transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">Cómo calcular tu Año Personal</h3>
              <p className="text-sm text-muted leading-relaxed">Guía paso a paso para calcular y usar el Año Personal en tu planificación.</p>
            </Link>
            <Link href="/guia/numeros-maestros" className="block p-6 border border-ink/10 hover:bg-ink/[0.03] transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">Números Maestros (11, 22, 33)</h3>
              <p className="text-sm text-muted leading-relaxed">Qué son, cómo se detectan en tu mapa y qué significa cada uno.</p>
            </Link>
          </div>
        </Reveal>

        {/* Disclaimer final */}
        <Reveal tag="section" delay={0.26}>
          <div className="p-6 border border-ink/10">
            <p className="text-sm text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </Reveal>

        </div>
      </main>

    </div>
  );
}
