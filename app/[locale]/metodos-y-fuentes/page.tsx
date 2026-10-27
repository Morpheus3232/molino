import { Link } from "@/lib/i18n/navigation";
import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import { Compass, Github, Asterisk } from "lucide-react";
import { PageHero, CONTAINER } from "@/components/knowledge/Kit";

export const metadata = createRouteMetadata({
  title: "Métodos y Fuentes",
  description:
    "Qué son la numerología, la astrología y el zodíaco chino, cómo Molino los calcula y por qué los tratamos como herramienta de reflexión y no como ciencia ni predicción.",
  path: "/metodos-y-fuentes",
  ogDescription: "Sistemas simbólicos, cálculo determinista y código abierto: la metodología completa detrás de Molino.",
  image: "/opengraph-image",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Métodos y Fuentes",
    description:
      "Qué son la numerología, la astrología y el zodíaco chino, cómo Molino los calcula y por qué los tratamos como herramienta de reflexión y no como ciencia ni predicción.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/metodos-y-fuentes"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/metodos-y-fuentes") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Métodos y Fuentes" },
    ],
  },
];

const SECTIONS = [
  {
    icon: Compass,
    title: "Qué son estos sistemas",
    body: (
      <>
        <p>
          La numerología, la astrología y el zodíaco chino son sistemas simbólicos
          tradicionales. La numerología reduce fechas y nombres a valores numéricos
          siguiendo una tradición que se remonta a Pitágoras. La astrología interpreta
          la posición del sol, la luna y los planetas al nacer, según una práctica con
          más de 4000 años de historia. El zodíaco chino asigna un animal y un
          elemento a cada año a partir de un ciclo sexagenario documentado en la
          cultura china.
        </p>
        <p>
          Ninguno de los tres es una disciplina científica. No predicen el futuro ni
          miden rasgos de personalidad de forma verificable: son marcos culturales que
          personas de distintas tradiciones usan desde hace siglos para pensar sobre
          sí mismas.
        </p>
      </>
    ),
  },
  {
    icon: Github,
    title: "Cómo los calculamos",
    body: (
      <>
        <p>
          Los cálculos de Molino son deterministas: la misma fecha de nacimiento
          produce siempre el mismo resultado. Usamos las fórmulas clásicas de
          reducción numerológica, efemérides astronómicas reales (Swiss Ephemeris)
          para las posiciones planetarias, y el ciclo sexagenario tradicional para el
          zodíaco chino.
        </p>
        <p>
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
        </p>
      </>
    ),
  },
  {
    icon: Asterisk,
    title: "Reflexión, no predicción",
    body: (
      <>
        <p>
          Molino interpreta estos sistemas como un espejo, no como un mapa del
          futuro. Los resultados describen patrones y arquetipos para que los leas e
          interpretes vos: no determinan tus decisiones, no garantizan resultados y no
          reemplazan criterio médico, psicológico, legal ni financiero.
        </p>
        <p>La agencia sobre lo que hacés con esa información es siempre tuya.</p>
      </>
    ),
  },
];

export default function MetodosYFuentesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content" className="bg-background text-foreground">
        <PageHero
          crumbs={[{ href: "/", label: "Inicio" }, { label: "Métodos y fuentes" }]}
          eyebrow="Metodología"
          title="Métodos y fuentes"
          lead="Numerología, astrología y zodíaco chino son sistemas simbólicos tradicionales, no ciencia. Acá contamos qué son, cómo los calculamos y qué esperar de los resultados."
          imageKey="paginas/metodos-y-fuentes"
        />
        {SECTIONS.map(({ title, body }, i) => (
          <section key={title} className={`${i % 2 ? "bg-paper-alt/70" : "bg-background"} border-b border-ink/10`}>
            <div className={`${CONTAINER} py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6`}>
              <div className="lg:col-span-4">
                <p className="text-sm text-muted mb-3 label-caps">{["Los sistemas", "El cálculo", "El uso"][i] ?? "Método"}</p>
                <h2 className="section-title text-foreground">{title}</h2>
              </div>
              <div className="lg:col-span-8 max-w-3xl text-lg sm:text-xl text-foreground/85 leading-relaxed space-y-5 [&_a]:underline [&_a]:underline-offset-4">
                {body}
              </div>
            </div>
          </section>
        ))}
        <div className={`${CONTAINER} py-12 text-base text-muted space-y-2`}>
          <p>
            Para lecturas y referencias externas, mirá la{" "}
            <Link href="/biblioteca" className="underline underline-offset-4 hover:text-foreground">
              biblioteca
            </Link>
            .
          </p>
          <p>
            Banderas de{" "}
            <Link href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              Twemoji
            </Link>{" "}
            (CC BY 4.0) en los dispositivos que no traen las suyas.
          </p>
        </div>
      </main>
    </>
  );
}
