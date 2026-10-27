import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { ZODIAC_SIGNS, ASTROLOGY_DISCLAIMER } from "@/lib/data/astrologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import Reveal from "@/components/ui/Reveal";
import { SunSignInstrument } from "@/components/knowledge/Instruments";
import { CONTAINER } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";

const ELEMENTS = (L: Pick2) => ([
  { name: "Fuego", signs: L("Aries, Leo, Sagitario", "Aries, Leo, Sagittarius"), traits: [L("Energía", "Energy"), L("Pasión", "Passion"), L("Iniciativa", "Initiative")], color: "var(--element-fire)" },
  { name: "Tierra", signs: L("Tauro, Virgo, Capricornio", "Taurus, Virgo, Capricorn"), traits: [L("Practicidad", "Practicality"), L("Estabilidad", "Stability"), L("Sentido común", "Common sense")], color: "var(--element-earth)" },
  { name: "Aire", signs: L("Géminis, Libra, Acuario", "Gemini, Libra, Aquarius"), traits: [L("Intelecto", "Intellect"), L("Comunicación", "Communication"), L("Sociabilidad", "Sociability")], color: "var(--element-air)" },
  { name: "Agua", signs: L("Cáncer, Escorpio, Piscis", "Cancer, Scorpio, Pisces"), traits: [L("Intuición", "Intuition"), L("Emoción", "Emotion"), L("Profundidad", "Depth")], color: "var(--element-water)" },
]);

const MODALITIES = (L: Pick2) => ([
  { name: "Cardinal", signs: L("Aries, Cáncer, Libra, Capricornio", "Aries, Cancer, Libra, Capricorn"), traits: [L("Inicio", "Home"), L("Iniciativa", "Initiative"), L("Acción", "Action")] },
  { name: "Fijo", signs: L("Tauro, Leo, Escorpio, Acuario", "Taurus, Leo, Scorpio, Aquarius"), traits: [L("Estabilidad", "Stability"), L("Determinación", "Determination"), L("Persistencia", "Persistence")] },
  { name: "Mutable", signs: L("Géminis, Virgo, Sagitario, Piscis", "Gemini, Virgo, Sagittarius, Pisces"), traits: [L("Adaptabilidad", "Adaptability"), L("Versatilidad", "Versatility"), L("Cambio", "Change")] },
]);

export default function AstrologiaContent() {
  const L = useL();
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <SunSignInstrument crumbs={[{ href: "/", label: L("Inicio", "Home") }, { href: "/explore", label: L("Conocimiento", "Knowledge") }, { label: "Astrología" }]} title="Astrología" lead={L("El Sol recorre doce signos en un año. El tuyo es el tramo que atravesaba el día que naciste.", "The Sun travels through twelve signs in a year. Yours is the stretch it was crossing on the day you were born.")} />
        <div className={`${CONTAINER} py-16 sm:py-24`}>

        <Reveal tag="section" delay={0.05} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <p className="text-sm text-muted leading-relaxed">{L.t(ASTROLOGY_DISCLAIMER)}</p>
          </div>
        </Reveal>

        {/* Qué es */}
        <Reveal tag="section" delay={0.1} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Qué es la astrología", "What astrology is")}</h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">{L("La astrología es un sistema de creencias que interpreta la posición de los astros en el momento del nacimiento como un reflejo simbólico de la personalidad y las tendencias de vida. Tiene más de 4000 años de historia.", "Astrology is a belief system that interprets the position of the stars at the moment of birth as a symbolic reflection of personality and life tendencies. It has more than 4,000 years of history.")}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>No es astronomía.</strong> La astronomía es la ciencia que estudia los cuerpos celestes. La astrología es un sistema interpretativo que utiliza los mismos cuerpos celestes como símbolos, no como causas.
            </>, <><strong>It isn't astronomy.</strong> Astronomy is the science that studies celestial bodies. Astrology is an interpretive system that uses the same celestial bodies as symbols, not as causes.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L("Molino utiliza la astrología occidental como uno de los sistemas que componen tu mapa personal.", "Molino uses Western astrology as one of the systems that make up your personal map.")}</p>
          </div>
        </Reveal>

        {/* Historia */}
        <Reveal tag="section" delay={0.12} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Historia", "History")}</h2>
          <SectionCover imageKey="astrologia/hub" className="mb-10 max-w-3xl" />
          <div className="max-w-3xl space-y-4">
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>Astrología mesopotámica (c. 2000 a.C.):</strong> Los babilonios registraban posiciones de planetas en tablillas de arcilla. Originalmente era una práctica religiosa vinculada a los dioses.
            </>, <><strong>Mesopotamian astrology (c. 2000 BC):</strong> The Babylonians recorded planetary positions on clay tablets. Originally it was a religious practice tied to the gods.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>Astrología helenística (c. 300 a.C.):</strong> Tras la conquista de Alejandro Magno, la astrología babilónica se fusionó con la filosofía griega. Se codificaron los 12 signos zodiacales, las casas y los aspectos.
            </>, <><strong>Hellenistic astrology (c. 300 BC):</strong> After Alexander the Great's conquests, Babylonian astrology merged with Greek philosophy. The 12 zodiac signs, the houses and the aspects were codified.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>Astrología romana y medieval:</strong> La astrología fue practicada en Roma, y resurgió en Europa durante el Renacimiento. Fue enseñada en universidades hasta el siglo XVII.
            </>, <><strong>Roman and medieval astrology:</strong> Astrology was practiced in Rome and re-emerged in Europe during the Renaissance. It was taught at universities until the 17th century.</>)}</p>
            <p className="text-lg text-foreground/90 leading-relaxed">{L(<>
              <strong>Astrología moderna (siglo XX-XXI):</strong> Se popularizó en la cultura popular. El horóscopo solar (sun sign) se convirtió en la forma más conocida, aunque la tradición completa es mucho más compleja.
            </>, <><strong>Modern astrology (20th-21st centuries):</strong> It became part of popular culture. The sun-sign horoscope became its best-known form, although the full tradition is much more complex.</>)}</p>
          </div>
        </Reveal>

        {/* Elementos y Modalidades */}
        <Reveal tag="section" delay={0.14} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Elementos y modalidades", "Elements and modalities")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{L("Elementos", "Elements")}</h3>
              {ELEMENTS(L).map((el) => (
                <div key={el.name} className="p-4 border border-ink/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: el.color }} />
                    <p className="text-sm font-medium text-foreground">{L.t(el.name)}</p>
                  </div>
                  <p className="text-sm text-muted">{L.t(el.signs)}</p>
                  <p className="text-sm text-muted mt-1">{L.t(el.traits.map(L.t).join(" · "))}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{L("Modalidades", "Modalities")}</h3>
              {MODALITIES(L).map((mod) => (
                <div key={mod.name} className="p-4 border border-ink/10">
                  <p className="text-sm font-medium text-foreground mb-1">{L.t(mod.name)}</p>
                  <p className="text-sm text-muted">{L.t(mod.signs)}</p>
                  <p className="text-sm text-muted mt-1">{L.t(mod.traits.map(L.t).join(" · "))}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Los 12 Signos */}
        <Reveal tag="section" delay={0.18} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Los 12 signos zodiacales", "The 12 zodiac signs")}</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">{L("Cada signo tiene un significado tradicional en la astrología. Estas interpretaciones pertenecen a la tradición y no representan evidencia científica.", "Each sign has a traditional meaning in astrology. These interpretations belong to the tradition and don't represent scientific evidence.")}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-ink/15">
            {ZODIAC_SIGNS.map((sign, i) => (
              <li key={sign.name} className="border-r border-b border-ink/15">
                <Link href={`/conocimiento/astrologia/${sign.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="group relative flex h-full flex-col gap-3 p-5 sm:p-6 hover:bg-ink/[0.03] transition-colors">
                  <span className="absolute top-3 right-4 text-sm text-muted/60 tabular-nums" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <AstrologySignIcon sign={sign.name} size={40} className="text-foreground" />
                  <span className="font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{L.t(sign.name)}</span>
                  <span className="text-sm text-muted leading-snug">{L.t(sign.dates)}<br />{L.t(sign.element)} · {L.t(sign.modality)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Limitaciones */}
        <Reveal tag="section" delay={0.2} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Diferencia entre astrología y astronomía", "The difference between astrology and astronomy")}</h2>
          <div className="max-w-3xl p-6 border border-ink/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">{L("Astronomía", "Astronomy")}</p>
                <p className="text-sm text-muted leading-relaxed">{L("Ciencia que estudia los cuerpos celestes. Utiliza el método científico, observación empírica y formulación de hipótesis verificables.", "A science that studies celestial bodies. It uses the scientific method, empirical observation and the formulation of testable hypotheses.")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">{L("Astrología", "Astrology")}</p>
                <p className="text-sm text-muted leading-relaxed">{L("Sistema de creencias que interpreta posiciones astrales como símbolos. No utiliza el método científico. Sus interpretaciones son culturales y simbólicas.", "A belief system that interprets astral positions as symbols. It doesn't use the scientific method. Its interpretations are cultural and symbolic.")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Fuentes */}
        <Reveal tag="section" delay={0.22} className="mb-16 sm:mb-20">
          <h2 className="section-title text-foreground mb-8 pt-10 border-t-2 border-ink">{L("Fuentes y referencias", "Sources and references")}</h2>
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
                  <p className="text-sm text-foreground">{L.t(src.title)}</p>
                  <p className="text-sm text-muted">{L.t(src.author)}{L.t(src.url ? ` · ${src.url}` : "")}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Herramientas relacionadas */}
        <Reveal tag="section" delay={0.22} className="mb-12">
          <div className="py-2 pl-5 border-l-2 border-ink">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{L("Calculá tu Signo Solar", "Calculate your Sun Sign")}</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">{L("Ingresá tu fecha de nacimiento y calculá tu signo zodiacal occidental.", "Enter your date of birth and calculate your Western zodiac sign.")}</p>
            <Link href="/herramientas/signo-solar" className="text-sm font-medium text-accent hover:underline">{L("Ir a la calculadora →", "Go to the calculator →")}</Link>
          </div>
        </Reveal>

        <Reveal tag="section" delay={0.24}>
          <div className="p-6 border border-ink/10">
            <p className="text-sm text-muted leading-relaxed">{L.t(MOLINO_DISCLAIMER)}</p>
          </div>
        </Reveal>
        </div>
      </main>
    </div>
  );
}
