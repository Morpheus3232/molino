import { Link } from "@/lib/i18n/navigation";
import { ZODIAC_SIGNS, ASTROLOGY_DISCLAIMER } from "@/lib/data/astrologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";
import { SunSignInstrument } from "@/components/knowledge/Instruments";
import { CONTAINER } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";

const ELEMENTS = [
  { name: "Fuego", signs: "Aries, Leo, Sagitario", traits: ["Energía", "Pasión", "Iniciativa"], color: "var(--element-fire)" },
  { name: "Tierra", signs: "Tauro, Virgo, Capricornio", traits: ["Practicidad", "Estabilidad", "Sentido común"], color: "var(--element-earth)" },
  { name: "Aire", signs: "Géminis, Libra, Acuario", traits: ["Intelecto", "Comunicación", "Sociabilidad"], color: "var(--element-air)" },
  { name: "Agua", signs: "Cáncer, Escorpio, Piscis", traits: ["Intuición", "Emoción", "Profundidad"], color: "var(--element-water)" },
];

const MODALITIES = [
  { name: "Cardinal", signs: "Aries, Cáncer, Libra, Capricornio", traits: ["Inicio", "Iniciativa", "Acción"] },
  { name: "Fijo", signs: "Tauro, Leo, Escorpio, Acuario", traits: ["Estabilidad", "Determinación", "Persistencia"] },
  { name: "Mutable", signs: "Géminis, Virgo, Sagitario, Piscis", traits: ["Adaptabilidad", "Versatilidad", "Cambio"] },
];

export default function AstrologiaContent() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <SunSignInstrument crumbs={[{ href: "/", label: "Inicio" }, { href: "/explore", label: "Conocimiento" }, { label: "Astrología" }]} title="Astrología" lead="El Sol recorre doce signos en un año. El tuyo es el tramo que atravesaba el día que naciste." />
        <div className={`${CONTAINER} py-16 sm:py-24`}>

        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <p className="text-sm text-muted leading-relaxed">{ASTROLOGY_DISCLAIMER}</p>
          </div>
        </Reveal>

        {/* Qué es */}
        <Reveal tag="section" delay={0.1} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Qué es la astrología</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">
              La astrología es un sistema de creencias que interpreta la posición de los astros en el momento del nacimiento como un reflejo simbólico de la personalidad y las tendencias de vida. Tiene más de 4000 años de historia.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>No es astronomía.</strong> La astronomía es la ciencia que estudia los cuerpos celestes. La astrología es un sistema interpretativo que utiliza los mismos cuerpos celestes como símbolos, no como causas.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Molino utiliza la astrología occidental como uno de los sistemas que componen tu mapa personal.
            </p>
          </div>
        </Reveal>

        {/* Historia */}
        <Reveal tag="section" delay={0.12} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Historia</h2>
          <SectionCover imageKey="astrologia/hub" className="mb-10 max-w-3xl" />
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Astrología mesopotámica (c. 2000 a.C.):</strong> Los babilonios registraban posiciones de planetas en tablillas de arcilla. Originalmente era una práctica religiosa vinculada a los dioses.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Astrología helenística (c. 300 a.C.):</strong> Tras la conquista de Alejandro Magno, la astrología babilónica se fusionó con la filosofía griega. Se codificaron los 12 signos zodiacales, las casas y los aspectos.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Astrología romana y medieval:</strong> La astrología fue practicada en Roma, y resurgió en Europa durante el Renacimiento. Fue enseñada en universidades hasta el siglo XVII.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Astrología moderna (siglo XX-XXI):</strong> Se popularizó en la cultura popular. El horóscopo solar (sun sign) se convirtió en la forma más conocida, aunque la tradición completa es mucho más compleja.
            </p>
          </div>
        </Reveal>

        {/* Elementos y Modalidades */}
        <Reveal tag="section" delay={0.14} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Elementos y modalidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">Elementos</h3>
              {ELEMENTS.map((el) => (
                <div key={el.name} className="p-4 border border-ink/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: el.color }} />
                    <p className="text-sm font-medium text-foreground">{el.name}</p>
                  </div>
                  <p className="text-sm text-muted">{el.signs}</p>
                  <p className="text-sm text-muted mt-1">{el.traits.join(" · ")}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">Modalidades</h3>
              {MODALITIES.map((mod) => (
                <div key={mod.name} className="p-4 border border-ink/10">
                  <p className="text-sm font-medium text-foreground mb-1">{mod.name}</p>
                  <p className="text-sm text-muted">{mod.signs}</p>
                  <p className="text-sm text-muted mt-1">{mod.traits.join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Los 12 Signos */}
        <Reveal tag="section" delay={0.18} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Los 12 signos zodiacales</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Cada signo tiene un significado tradicional en la astrología. Estas interpretaciones pertenecen a la tradición y no representan evidencia científica.
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-ink/15">
            {ZODIAC_SIGNS.map((sign, i) => (
              <li key={sign.name} className="border-r border-b border-ink/15">
                <Link href={`/conocimiento/astrologia/${sign.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="group relative flex h-full flex-col gap-3 p-5 sm:p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="absolute top-3 right-4 text-sm text-muted/60 tabular-nums" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <AstrologySignIcon sign={sign.name} size={40} className="text-foreground" />
                  <span className="font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{sign.name}</span>
                  <span className="text-sm text-muted leading-snug">{sign.dates}<br />{sign.element} · {sign.modality}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Limitaciones */}
        <Reveal tag="section" delay={0.2} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Diferencia entre astrología y astronomía</h2>
          <div className="max-w-3xl p-6 border border-ink/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Astronomía</p>
                <p className="text-sm text-muted leading-relaxed">Ciencia que estudia los cuerpos celestes. Utiliza el método científico, observación empírica y formulación de hipótesis verificables.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Astrología</p>
                <p className="text-sm text-muted leading-relaxed">Sistema de creencias que interpreta posiciones astrales como símbolos. No utiliza el método científico. Sus interpretaciones son culturales y simbólicas.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Fuentes */}
        <Reveal tag="section" delay={0.22} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">Fuentes y referencias</h2>
          <div className="space-y-3 max-w-3xl">
            {[
              { title: "Astrology", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/science/astrology" },
              { title: "Hellenistic Astrology: A History", author: "Chris Brennan (2017)" },
              { title: "Ancient Astrology Collection", author: "University of Pennsylvania Museum" },
              { title: "Babylonian Astronomy and Astrology", author: "The British Museum" },
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
        <Reveal tag="section" delay={0.22} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Calculá tu Signo Solar</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Ingresá tu fecha de nacimiento y calculá tu signo zodiacal occidental.
            </p>
            <Link href="/herramientas/signo-solar" className="text-sm font-medium text-accent hover:underline">
              Ir a la calculadora →
            </Link>
          </div>
        </Reveal>

        <Reveal tag="section" delay={0.24}>
          <div className="p-6 border border-ink/10">
            <p className="text-sm text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </Reveal>
        </div>
      </main>
    </div>
  );
}
