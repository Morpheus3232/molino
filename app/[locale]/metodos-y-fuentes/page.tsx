import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import { Compass, Github, Asterisk } from "lucide-react";
import { PageHero, CONTAINER } from "@/components/knowledge/Kit";

export const generateMetadata = metadataFor({
  title: ["Métodos y Fuentes", "Methods and Sources"],
  description:
    ["Qué son la numerología, la astrología y el zodíaco chino, cómo Molino los calcula y por qué los tratamos como herramienta de reflexión y no como ciencia ni predicción.", "What numerology, astrology and the Chinese zodiac are, how Molino calculates them, and why we treat them as a tool for reflection rather than science or prediction."],
  path: "/metodos-y-fuentes",
  ogDescription: ["Sistemas simbólicos, cálculo determinista y código abierto: la metodología completa detrás de Molino.", "Symbolic systems, deterministic calculation and open source: the full methodology behind Molino."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Métodos y Fuentes", "Methods and Sources"),
    description:
      L("Qué son la numerología, la astrología y el zodíaco chino, cómo Molino los calcula y por qué los tratamos como herramienta de reflexión y no como ciencia ni predicción.", "What numerology, astrology and the Chinese zodiac are, how Molino calculates them, and why we treat them as a tool for reflection rather than science or prediction."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/metodos-y-fuentes"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/metodos-y-fuentes") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Métodos y Fuentes", "Methods and Sources") },
    ],
  },
]);

const SECTIONS = (L: Pick2) => ([
  {
    icon: Compass,
    title: L("Qué son estos sistemas", "What these systems are"),
    body: (
      <>
        <p>{L("La numerología, la astrología y el zodíaco chino son sistemas simbólicos tradicionales. La numerología reduce fechas y nombres a valores numéricos siguiendo una tradición que se remonta a Pitágoras. La astrología interpreta la posición del sol, la luna y los planetas al nacer, según una práctica con más de 4000 años de historia. El zodíaco chino asigna un animal y un elemento a cada año a partir de un ciclo sexagenario documentado en la cultura china.", "Numerology, astrology and the Chinese zodiac are traditional symbolic systems. Numerology reduces dates and names to numerical values following a tradition that goes back to Pythagoras. Astrology interprets the position of the Sun, the Moon and the planets at birth, a practice with more than 4,000 years of history. The Chinese zodiac assigns an animal and an element to each year based on a sexagenary cycle documented in Chinese culture.")}</p>
        <p>{L("Ninguno de los tres es una disciplina científica. No predicen el futuro ni miden rasgos de personalidad de forma verificable: son marcos culturales que personas de distintas tradiciones usan desde hace siglos para pensar sobre sí mismas.", "None of the three is a scientific discipline. They don't predict the future or measure personality traits in a verifiable way: they're cultural frameworks that people from different traditions have used for centuries to think about themselves.")}</p>
      </>
    ),
  },
  {
    icon: Github,
    title: L("Cómo los calculamos", "How we calculate them"),
    body: (
      <>
        <p>{L("Los cálculos de Molino son deterministas: la misma fecha de nacimiento produce siempre el mismo resultado. Usamos las fórmulas clásicas de reducción numerológica, efemérides astronómicas reales (Swiss Ephemeris) para las posiciones planetarias, y el ciclo sexagenario tradicional para el zodíaco chino.", "Molino's calculations are deterministic: the same date of birth always produces the same result. We use the classical formulas of numerological reduction, real astronomical ephemerides (Swiss Ephemeris) for planetary positions, and the traditional sexagenary cycle for the Chinese zodiac.")}</p>
        <p>{L(<>
          Todo el motor de cálculo es de código abierto. Podés leer las fórmulas
          exactas en{" "}
          <Link
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-accent-hover"
          >
            nuestro repositorio en GitHub
          </Link>
          , o el detalle técnico de cada motor en{" "}
          <Link href="/docs/motores" className="text-accent underline hover:text-accent-hover">
            Motores de Cálculo
          </Link>
          .
        </>, <>The whole calculation engine is open source. You can read the exact formulas in{" "}<Link href="https://github.com/Morpheus3232/molino" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-hover">our GitHub repository</Link>, or the technical detail of each engine in{" "}<Link href="/docs/motores" className="text-accent underline hover:text-accent-hover">Calculation Engines</Link>.</>)}</p>
      </>
    ),
  },
  {
    icon: Asterisk,
    title: L("Reflexión, no predicción", "Reflection, not prediction"),
    body: (
      <>
        <p>{L("Molino interpreta estos sistemas como un espejo, no como un mapa del futuro. Los resultados describen patrones y arquetipos para que los leas e interpretes vos: no determinan tus decisiones, no garantizan resultados y no reemplazan criterio médico, psicológico, legal ni financiero.", "Molino reads these systems as a mirror, not a map of the future. The results describe patterns and archetypes for you to read and interpret: they don't determine your decisions, don't guarantee outcomes and don't replace medical, psychological, legal or financial judgment.")}</p>
        <p>{L("La agencia sobre lo que hacés con esa información es siempre tuya.", "What you do with that information is always up to you.")}</p>
      </>
    ),
  },
]);

export default async function MetodosYFuentesPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <main id="main-content" className="bg-background text-foreground">
        <PageHero
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Métodos y fuentes", "Methods and sources") }]}
          eyebrow={L("Metodología", "Methodology")}
          title={L("Métodos y fuentes", "Methods and sources")}
          lead={L("Numerología, astrología y zodíaco chino son sistemas simbólicos tradicionales, no ciencia. Acá contamos qué son, cómo los calculamos y qué esperar de los resultados.", "Numerology, astrology and the Chinese zodiac are traditional symbolic systems, not science. Here we explain what they are, how we calculate them and what to expect from the results.")}
          imageKey="paginas/metodos-y-fuentes"
        />
        {SECTIONS(L).map(({ title, body }, i) => (
          <section key={title} className={`${i % 2 ? "bg-paper-alt/70" : "bg-background"} border-b border-ink/10`}>
            <div className={`${CONTAINER} py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6`}>
              <div className="lg:col-span-4">
                <p className="text-sm text-muted mb-3 label-caps">{[L("Los sistemas", "The systems"), L("El cálculo", "The calculation"), L("El uso", "The use")][i] ?? L("Método", "Method")}</p>
                <h2 className="section-title text-foreground">{L.t(title)}</h2>
              </div>
              <div className="lg:col-span-8 max-w-3xl text-lg sm:text-xl text-foreground/85 leading-relaxed space-y-5 [&_a]:underline [&_a]:underline-offset-4">
                {L.t(body)}
              </div>
            </div>
          </section>
        ))}
        <div className={`${CONTAINER} py-12 text-base text-muted space-y-2`}>
          <p>{L(<>
            Para lecturas y referencias externas, mirá la{" "}
            <Link href="/biblioteca" className="underline underline-offset-4 hover:text-foreground">
              biblioteca
            </Link>
            .
          </>, <>For reading and external references, see the{" "}<Link href="/biblioteca" className="underline underline-offset-4 hover:text-foreground">library</Link>.</>)}</p>
          <p>{L(<>
            Banderas de{" "}
            <Link href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              Twemoji
            </Link>{" "}
            (CC BY 4.0) en los dispositivos que no traen las suyas.
          </>, <>Flags from{" "}<Link href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Twemoji</Link>{" "}(CC BY 4.0) on devices that don't ship their own.</>)}</p>
        </div>
      </main>
    </>
  );
}
