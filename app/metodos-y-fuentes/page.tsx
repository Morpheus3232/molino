import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { BookMarked, Compass, Github, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Métodos y Fuentes — Molino",
  description:
    "Qué son la numerología, la astrología y el zodíaco chino, cómo Molino los calcula y por qué los tratamos como herramienta de reflexión y no como ciencia ni predicción.",
  alternates: {
    canonical: siteUrl("/metodos-y-fuentes"),
  },
  openGraph: {
    title: "Métodos y Fuentes — Molino",
    description:
      "Sistemas simbólicos, cálculo determinista y código abierto: la metodología completa detrás de Molino.",
    type: "article",
    url: siteUrl("/metodos-y-fuentes"),
    images: [siteUrl("/opengraph-image")],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Métodos y Fuentes — Molino",
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
            className="text-accent underline hover:text-accent-light"
          >
            nuestro repositorio en GitHub
          </Link>
          , o el detalle técnico de cada motor en{" "}
          <Link href="/docs/motores" className="text-accent underline hover:text-accent-light">
            Motores de Cálculo
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    icon: Sparkles,
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
      <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <header className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
              Metodología
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Métodos y Fuentes
            </h1>
            <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
              Numerología, astrología y zodíaco chino son sistemas simbólicos
              tradicionales, no ciencia. Acá explicamos qué son, cómo los calculamos
              y qué podés esperar de los resultados.
            </p>
          </header>

          <div className="space-y-6">
            {SECTIONS.map(({ icon: Icon, title, body }) => (
              <Card key={title} padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent border border-accent/20">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
                </div>
                <div className="text-sm sm:text-base text-muted leading-relaxed space-y-3">
                  {body}
                </div>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted mt-10 text-center">
            Para lecturas y referencias externas, ver{" "}
            <Link href="/biblioteca" className="text-accent underline hover:text-accent-light">
              Biblioteca
            </Link>
            .{" "}
            <BookMarked className="inline w-3.5 h-3.5 -mt-0.5" aria-hidden="true" />
          </p>
        </div>
      </main>
    </>
  );
}
