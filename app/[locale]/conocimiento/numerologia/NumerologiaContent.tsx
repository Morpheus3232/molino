import { useL } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { NUMBERS, CALCULATIONS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";
import { LifePathInstrument } from "@/components/knowledge/Instruments";
import { CONTAINER } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";

export default function NumerologiaContent() {
  const L = useL();
  return (
    <div className="min-h-screen bg-background">

      <main id="main-content">
        <LifePathInstrument crumbs={[{ href: "/", label: L("Inicio", "Home") }, { href: "/explore", label: L("Conocimiento", "Knowledge") }, { label: L("Numerología", "Numerology") }]} title={L("Numerología", "Numerology")} lead={L("Tu fecha de nacimiento, sumada dígito por dígito, da un número del 1 al 9, o un maestro. La cuenta queda a la vista.", "Your date of birth, added digit by digit, gives a number from 1 to 9, or a master number. The math stays in plain sight.")} />
        <div className={`${CONTAINER} py-16 sm:py-24`}>

        {/* Disclaimer */}
        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <p className="text-sm text-muted leading-relaxed">{L.t(NUMEROLOGY_DISCLAIMER)}</p>
          </div>
        </Reveal>

        {/* Índice */}
        <Reveal tag="section" delay={0.08} className="mb-12 sm:mb-16">
          <h2 className="section-title text-foreground mb-6 pt-10 border-t-2 border-ink">{L("Índice de contenidos", "Table of contents")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/15">
            {[
              { label: L("Qué es la numerología", "What numerology is"), id: "que-es" },
              { label: L("Historia y evolución", "History and evolution"), id: "historia" },
              { label: L("Numerología pitagórica", "Pythagorean numerology"), id: "pitagorica" },
              { label: L("Sistema de cálculo", "Calculation system"), id: "calculos" },
              { label: L("Los números del 1 al 9", "The numbers from 1 to 9"), id: "numeros" },
              { label: L("Números maestros", "Master numbers"), id: "maestros" },
              { label: L("Limitaciones", "Limitations"), id: "limitaciones" },
              { label: L("Fuentes y referencias", "Sources and references"), id: "fuentes" },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="border-r border-b border-ink/15 px-5 py-4 font-display text-xl text-foreground hover:bg-ink/[0.03] hover:underline underline-offset-4">
                {L.t(item.label)}
              </a>
            ))}
          </div>
        </Reveal>

        {/* QUÉ ES LA NUMEROLYGÍA */}
        <Reveal tag="section" delay={0.1} id="que-es" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Qué es la numerología", "What numerology is")}</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">{L("La numerología es un sistema de creencias que asigna significados simbólicos a los números. Según esta tradición, los números poseen cualidades e influencias que pueden ofrecer perspectivas sobre la personalidad, los ciclos de vida y las tendencias personales.", "Numerology is a belief system that assigns symbolic meanings to numbers. According to this tradition, numbers have qualities and influences that can offer perspectives on personality, life cycles and personal tendencies.")}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>Es importante aclarar:</strong> la numerología no es una ciencia. No existe evidencia empírica que respalde la idea de que los números determinen rasgos de personalidad o destinos. Lo que sí existe es una tradición cultural de más de 2500 años que Molino utiliza como herramienta de reflexión.
            </>, <><strong>It's important to be clear:</strong> numerology isn't a science. There's no empirical evidence to support the idea that numbers determine personality traits or destinies. What does exist is a cultural tradition more than 2,500 years old that Molino uses as a tool for reflection.</>)}</p>
            <div className="p-6 border border-ink/10 mt-6">
              <p className="text-sm text-muted mb-2 label-caps">{L("En resumen", "In short")}</p>
              <p className="text-sm text-muted leading-relaxed">{L("La numerología es un lenguaje simbólico. Molino la usa como una lente de autoconocimiento, no como una métrica objetiva.", "Numerology is a symbolic language. Molino uses it as a lens for self-knowledge, not as an objective metric.")}</p>
            </div>
          </div>
        </Reveal>

        {/* HISTORIA */}
        <Reveal tag="section" delay={0.12} id="historia" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Historia y evolución", "History and evolution")}</h2>
          <SectionCover imageKey="numerologia/hub" className="mb-10 max-w-3xl" />
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              Las raíces de la numerología se remontan a <strong>Babilonia</strong> (actual Irak), donde los astrólogos babilónicos ya asociaban números con significados cosmológicos hace más de 3000 años.
            </>, <>The roots of numerology go back to <strong>Babylon</strong> (present-day Iraq), where Babylonian astrologers were already associating numbers with cosmological meanings more than 3,000 years ago.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              La figura más asociada con la numerología occidental es <strong>Pitágoras</strong> (c. 570–495 a.C.), matemático y filósofo griego. Según la tradición, Pitágoras enseñaba que los números eran la esencia de toda la realidad. Sin embargo, los historiadores modernos distinguen entre el pitagorismo histórico (una escuela filosófica-matemática) y la numerología esotérica moderna, que se desarrolló siglos después.
            </>, <>The figure most associated with Western numerology is <strong>Pythagoras</strong> (c. 570–495 BC), a Greek mathematician and philosopher. According to tradition, Pythagoras taught that numbers were the essence of all reality. However, modern historians distinguish between historical Pythagoreanism (a philosophical-mathematical school) and modern esoteric numerology, which developed centuries later.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              La numerología <strong>moderna</strong> se consolidó en el siglo XX con autores como L. Dow Balliett y Florence Campbell. El sistema de correspondencia de letras y números que usamos hoy fue codificado en el siglo XIX.
            </>, <><strong>Modern</strong> numerology took shape in the 20th century with authors such as L. Dow Balliett and Florence Campbell. The system of letter–number correspondences we use today was codified in the 19th century.</>)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-6 border border-ink/10">
                <p className="text-sm text-muted mb-2 label-caps">{L("Diferencia clave", "Key difference")}</p>
                <p className="text-sm text-muted leading-relaxed">{L(<>
                  <strong>Pitagorismo histórico:</strong> Escuela filosófica que veía los números como principios matemáticos del universo.
                </>, <><strong>Historical Pythagoreanism:</strong> A philosophical school that saw numbers as the mathematical principles of the universe.</>)}</p>
                <p className="text-sm text-muted leading-relaxed mt-2">{L(<>
                  <strong>Numerología esotérica:</strong> Sistema moderno que asigna significados personales y predictivos a los números basándose en fechas y nombres.
                </>, <><strong>Esoteric numerology:</strong> A modern system that assigns personal and predictive meanings to numbers based on dates and names.</>)}</p>
              </div>
              <div className="p-6 border border-ink/10">
                <p className="text-sm text-muted mb-2 label-caps">{L("Lo que dice la evidencia", "What the evidence says")}</p>
                <p className="text-sm text-muted leading-relaxed">{L("No existe evidencia científica que respalde que los números determinen rasgos de personalidad. La investigación en psicología no ha encontrado correlaciones válidas entre fechas de nacimiento y características psicológicas.", "There's no scientific evidence that numbers determine personality traits. Research in psychology hasn't found valid correlations between dates of birth and psychological characteristics.")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* PITAGÓRICA */}
        <Reveal tag="section" delay={0.14} id="pitagorica" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Numerología pitagórica", "Pythagorean numerology")}</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">{L("La numerología pitagórica es el sistema más utilizado en occidente. Asigna valores numéricos del 1 al 9 a cada letra del alfabeto, y luego reduce cualquier suma a un solo dígito.", "Pythagorean numerology is the most widely used system in the West. It assigns numerical values from 1 to 9 to each letter of the alphabet, and then reduces any sum to a single digit.")}</p>
            <div className="p-6 border border-ink/10">
              <p className="text-sm text-accent font-medium mb-3 label-caps">{L("Tabla de correspondencia", "Correspondence table")}</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-foreground">
                {["A=1", "B=2", "C=3", "D=4", "E=5", "F=6", "G=7", "H=8", "I=9", "J=1", "K=2", "L=3", "M=4", "N=5", "O=6", "P=7", "Q=8", "R=9", "S=1", "T=2", "U=3", "V=4", "W=5", "X=6", "Y=7", "Z=8"].map((v) => (
                  <span key={v} className="text-center py-1 px-2 rounded bg-background text-sm">{L.t(v)}</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted mt-4">{L("Nota: Este sistema fue codificado en el siglo XIX. La versión que usa Molino sigue esta convención. Otros sistemas numerológicos usan tablas diferentes.", "Note: This system was codified in the 19th century. The version Molino uses follows this convention. Other numerological systems use different tables.")}</p>
          </div>
        </Reveal>

        {/* CÁLCULOS */}
        <Reveal tag="section" delay={0.16} id="calculos" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Cómo calcula Molino", "How Molino calculates")}</h2>
          <div className="space-y-6">
            {Object.values(CALCULATIONS).map((calc) => (
              <div key={calc.title} className="p-6 border border-ink/10">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{L.t(calc.title)}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{L.t(calc.description)}</p>
                <div className="p-3 rounded-md bg-background text-sm text-foreground font-mono mb-3">{L.t(calc.formula)}</div>
                <p className="text-sm text-muted italic">{L.t(calc.caveat)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* NÚMEROS 1-9 */}
        <Reveal tag="section" delay={0.18} id="numeros" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Los números del 1 al 9", "The numbers from 1 to 9")}</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">{L("Cada número tiene un significado tradicional en la numerología. Estas interpretaciones pertenecen a la tradición y no representan evidencia científica.", "Each number has a traditional meaning in numerology. These interpretations belong to the tradition and don't represent scientific evidence.")}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/15">
            {NUMBERS.filter(n => n.number <= 9).map((num) => (
              <li key={num.number} className="border-r border-b border-ink/15">
                <Link href={`/conocimiento/numerologia/${num.number}`} className="group flex h-full gap-5 p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="font-display text-6xl leading-none text-foreground w-10 shrink-0">{num.number}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{L.t(num.title)}</span>
                    <span className="mt-2 block text-base text-muted leading-snug line-clamp-3">{L.t(num.meaning)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* NÚMEROS MAESTROS */}
        <Reveal tag="section" delay={0.2} id="maestros" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Números maestros: 11, 22 y 33", "Master numbers: 11, 22 and 33")}</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">{L("Los números maestros fueron incorporados a la numerología moderna. No forman parte del sistema pitagórico original.", "Master numbers were added to modern numerology. They aren't part of the original Pythagorean system.")}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-ink">
            {NUMBERS.filter(n => n.number > 9).map((num) => (
              <li key={num.number} className="border-b border-ink/15 sm:border-b-0 sm:border-r last:border-r-0">
                <Link href={`/conocimiento/numerologia/${num.number}`} className="group block h-full p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="block font-display text-6xl leading-none text-foreground">{num.number}</span>
                  <span className="mt-3 block font-display text-2xl text-foreground group-hover:underline underline-offset-4">{L.t(num.title)}</span>
                  <span className="mt-2 block text-base text-muted leading-relaxed">{L.t(num.meaning)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* LIMITACIONES */}
        <Reveal tag="section" delay={0.22} id="limitaciones" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Limitaciones y carácter no científico", "Limitations and non-scientific nature")}</h2>
          <div className="max-w-3xl space-y-4">
            <div className="p-6 border border-ink/10">
              <p className="text-sm text-foreground leading-relaxed">{L(<>
                <strong>La numerología no es una ciencia.</strong> No existe evidencia empírica que respalde que las fechas de nacimiento o los nombres determinen rasgos de personalidad, destinos o ciclos de vida. La investigación en psicología y ciencias cognitivas no ha encontrado correlaciones válidas.
              </>, <><strong>Numerology isn't a science.</strong> There's no empirical evidence that dates of birth or names determine personality traits, destinies or life cycles. Research in psychology and the cognitive sciences hasn't found valid correlations.</>)}</p>
            </div>
            <p className="text-sm text-muted leading-relaxed">{L(<>
              Molino utiliza la numerología como <strong>herramienta de reflexión</strong>. Los significados que presentamos pertenecen a tradiciones culturales y simbólicas. Los cálculos son deterministas y reproducibles, pero su interpretación es simbólica.
            </>, <>Molino uses numerology as a <strong>tool for reflection</strong>. The meanings we present belong to cultural and symbolic traditions. The calculations are deterministic and reproducible, but their interpretation is symbolic.</>)}</p>
            <p className="text-sm text-muted leading-relaxed">{L("Si buscas información sobre salud, relaciones o decisiones importantes, consulta a un profesional calificado. La numerología no reemplaza el consejo médico, psicológico o legal.", "If you're looking for information about health, relationships or important decisions, consult a qualified professional. Numerology doesn't replace medical, psychological or legal advice.")}</p>
          </div>
        </Reveal>

        {/* FUENTES */}
        <Reveal tag="section" delay={0.24} id="fuentes" className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Fuentes y referencias", "Sources and references")}</h2>
          <div className="space-y-3 max-w-3xl">
            {[
              { title: "Numerology", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/science/numerology" },
              { title: "Pythagoras", author: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/pythagoras/" },
              { title: "Pythagoreanism", author: "Internet Encyclopedia of Philosophy", url: "https://iep.utm.edu/pythagoreanism/" },
              { title: "Numerology and the Divine Triangle", author: L("Faith Javane y Dusty Bunker (1979)", "Faith Javane and Dusty Bunker (1979)") },
              { title: "Numerology: Key to Your Inner Self", author: "Hans Decoz (1994)" },
            ].map((src) => (
              <div key={src.title} className="flex items-start gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{L.t(src.title)}</p>
                  <p className="text-sm text-muted">{L.t(src.author)}{L.t(src.url ? ` · ${src.url}` : "")}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Herramientas relacionadas */}
        <Reveal tag="section" delay={0.24} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{L("Calculá tu Camino de Vida", "Calculate your Life Path")}</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">{L("Ingresá tu fecha de nacimiento y calculá tu número de Camino de Vida, Expresión y más.", "Enter your date of birth and calculate your Life Path number, Expression and more.")}</p>
            <Link href="/herramientas/camino-de-vida" className="text-sm font-medium text-accent hover:underline">{L("Ir a la calculadora →", "Go to the calculator →")}</Link>
          </div>
        </Reveal>

        {/* Profundizá — interlinking hacia el contenido que ya tiene tracción
            real en Search Console (Fase 6A), ausente hasta ahora desde el hub. */}
        <Reveal tag="section" delay={0.25} className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/blog/numerologia-ano-personal" className="block p-6 border border-ink/10 hover:bg-ink/[0.03] transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">{L("Cómo calcular tu Año Personal", "How to calculate your Personal Year")}</h3>
              <p className="text-sm text-muted leading-relaxed">{L("Guía paso a paso para calcular y usar el Año Personal en tu planificación.", "A step-by-step guide to calculating your Personal Year and using it in your planning.")}</p>
            </Link>
            <Link href="/guia/numeros-maestros" className="block p-6 border border-ink/10 hover:bg-ink/[0.03] transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">{L("Números Maestros (11, 22, 33)", "Master Numbers (11, 22, 33)")}</h3>
              <p className="text-sm text-muted leading-relaxed">{L("Qué son, cómo se detectan en tu mapa y qué significa cada uno.", "What they are, how they're detected in your map and what each one means.")}</p>
            </Link>
          </div>
        </Reveal>

        {/* Disclaimer final */}
        <Reveal tag="section" delay={0.26}>
          <div className="p-6 border border-ink/10">
            <p className="text-sm text-muted leading-relaxed">{L.t(MOLINO_DISCLAIMER)}</p>
          </div>
        </Reveal>

        </div>
      </main>

    </div>
  );
}
