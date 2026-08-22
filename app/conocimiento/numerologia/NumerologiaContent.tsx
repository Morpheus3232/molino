import Link from "next/link";
import { NUMBERS, CALCULATIONS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";

export default function NumerologiaContent() {
  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/explore" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Conocimiento</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Numerología</span>
        </nav>

        {/* Hero */}
        <Reveal tag="section" className="mb-16 sm:mb-20">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]">
            Numerología
          </h1>
          <h2 className="font-heading text-xl sm:text-2xl text-muted mt-4 leading-relaxed max-w-2xl">
            El lenguaje simbólico de los números y su relación con la personalidad y los ciclos.
          </h2>
        </Reveal>

        {/* Disclaimer */}
        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="p-6 border border-accent/20">
            <p className="text-sm text-muted leading-relaxed">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </Reveal>

        {/* Índice */}
        <Reveal tag="section" delay={0.08} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl tracking-tight text-foreground">Índice de contenidos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <a key={item.id} href={`#${item.id}`} className="text-left text-sm text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-accent/5 inline-flex items-center gap-1">
                {item.label}
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* QUÉ ES LA NUMEROLYGÍA */}
        <Reveal tag="section" delay={0.1} id="que-es" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Qué es la numerología</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              La numerología es un sistema de creencias que asigna significados simbólicos a los números. Según esta tradición, los números poseen cualidades e influencias que pueden ofrecer perspectivas sobre la personalidad, los ciclos de vida y las tendencias personales.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              <strong>Es importante aclarar:</strong> la numerología no es una ciencia. No existe evidencia empírica que respalde la idea de que los números determinen rasgos de personalidad o destinos. Lo que sí existe es una tradición cultural de más de 2500 años que Molino utiliza como herramienta de reflexión.
            </p>
            <div className="p-6 border border-ink/10 mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">En resumen</p>
              <p className="text-sm text-muted leading-relaxed">
                La numerología es un lenguaje simbólico. Molino la usa como una lente de autoconocimiento, no como una métrica objetiva.
              </p>
            </div>
          </div>
        </Reveal>

        {/* HISTORIA */}
        <Reveal tag="section" delay={0.12} id="historia" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Historia y evolución</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              Las raíces de la numerología se remontan a <strong>Babilonia</strong> (actual Irak), donde los astrólogos babilónicos ya asociaban números con significados cosmológicos hace más de 3000 años.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La figura más asociada con la numerología occidental es <strong>Pitágoras</strong> (c. 570–495 a.C.), matemático y filósofo griego. Según la tradición, Pitágoras enseñaba que los números eran la esencia de toda la realidad. Sin embargo, los historiadores modernos distinguen entre el pitagorismo histórico (una escuela filosófica-matemática) y la numerología esotérica moderna, que se desarrolló siglos después.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La numerología <strong>moderna</strong> se consolidó en el siglo XX con autores como L. Dow Balliett y Florence Campbell. El sistema de correspondencia de letras y números que usamos hoy fue codificado en el siglo XIX.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-6 border border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Diferencia clave</p>
                <p className="text-sm text-muted leading-relaxed">
                  <strong>Pitagorismo histórico:</strong> Escuela filosófica que veía los números como principios matemáticos del universo.
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  <strong>Numerología esotérica:</strong> Sistema moderno que asigna significados personales y predictivos a los números basándose en fechas y nombres.
                </p>
              </div>
              <div className="p-6 border border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Lo que dice la evidencia</p>
                <p className="text-sm text-muted leading-relaxed">
                  No existe evidencia científica que respalde que los números determinen rasgos de personalidad. La investigación en psicología no ha encontrado correlaciones válidas entre fechas de nacimiento y características psicológicas.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* PITAGÓRICA */}
        <Reveal tag="section" delay={0.14} id="pitagorica" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Numerología pitagórica</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              La numerología pitagórica es el sistema más utilizado en occidente. Asigna valores numéricos del 1 al 9 a cada letra del alfabeto, y luego reduce cualquier suma a un solo dígito.
            </p>
            <div className="p-6 border border-ink/10">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">Tabla de correspondencia</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-foreground">
                {["A=1", "B=2", "C=3", "D=4", "E=5", "F=6", "G=7", "H=8", "I=9", "J=1", "K=2", "L=3", "M=4", "N=5", "O=6", "P=7", "Q=8", "R=9", "S=1", "T=2", "U=3", "V=4", "W=5", "X=6", "Y=7", "Z=8"].map((v) => (
                  <span key={v} className="text-center py-1 px-2 rounded bg-background text-xs">{v}</span>
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Cómo calcula Molino</h2>
          </div>
          <div className="space-y-6">
            {Object.values(CALCULATIONS).map((calc) => (
              <div key={calc.title} className="p-6 border border-ink/10">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{calc.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{calc.description}</p>
                <div className="p-3 rounded-md bg-background text-sm text-foreground font-mono mb-3">{calc.formula}</div>
                <p className="text-xs text-muted italic">{calc.caveat}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* NÚMEROS 1-9 */}
        <Reveal tag="section" delay={0.18} id="numeros" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Los números del 1 al 9</h2>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Cada número tiene un significado tradicional en la numerología. Estas interpretaciones pertenecen a la tradición y no representan evidencia científica.
          </p>
          <div className="space-y-6">
            {NUMBERS.filter(n => n.number <= 9).map((num, i) => (
              <Link key={num.number} href={`/conocimiento/numerologia/${num.number}`} className="block w-full text-left p-6 border border-ink/10 hover:border-accent transition-colors group">
                <div className="flex items-start gap-6">
                  <p className="number-display text-4xl sm:text-5xl number-display-accent shrink-0">{num.number}</p>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{num.title}</h3>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{num.meaning}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {num.keywords.map((kw) => (
                        <span key={kw} className="text-xs uppercase tracking-[0.2em] text-muted font-medium px-2 py-0.5 rounded-md border border-border">{kw}</span>
                      ))}
                    </div>
                  </div>
                   <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0 hidden sm:inline-flex items-center gap-1">
                     Ver
                     <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                   </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* NÚMEROS MAESTROS */}
        <Reveal tag="section" delay={0.2} id="maestros" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Números maestros: 11, 22 y 33</h2>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Los números maestros fueron incorporados a la numerología moderna. No forman parte del sistema pitagórico original.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NUMBERS.filter(n => n.number > 9).map((num) => (
              <Link key={num.number} href={`/conocimiento/numerologia/${num.number}`} className="block text-left p-6 border border-accent/20 hover:border-accent/50 transition-colors group">
                <p className="text-3xl font-heading font-bold text-accent mb-2">{num.number}</p>
                <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{num.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{num.meaning}</p>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* LIMITACIONES */}
        <Reveal tag="section" delay={0.22} id="limitaciones" className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Limitaciones y carácter no científico</h2>
          </div>
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">Fuentes y referencias</h2>
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
        </Reveal>

        {/* Herramientas relacionadas */}
        <Reveal tag="section" delay={0.24} className="mb-12">
          <div className="p-6 border border-accent/20">
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
            <Link href="/blog/numerologia-ano-personal" className="block p-6 border border-ink/10 hover:border-accent transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">Cómo calcular tu Año Personal</h3>
              <p className="text-sm text-muted leading-relaxed">Guía paso a paso para calcular y usar el Año Personal en tu planificación.</p>
            </Link>
            <Link href="/guia/numeros-maestros" className="block p-6 border border-ink/10 hover:border-accent transition-colors">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">Números Maestros (11, 22, 33)</h3>
              <p className="text-sm text-muted leading-relaxed">Qué son, cómo se detectan en tu mapa y qué significa cada uno.</p>
            </Link>
          </div>
        </Reveal>

        {/* Disclaimer final */}
        <Reveal tag="section" delay={0.26}>
          <div className="p-6 border border-ink/10">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </Reveal>

      </main>

    </div>
  );
}
