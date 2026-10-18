import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, ArrowRight, ShieldCheck, Flame, Droplets, Wind, Mountain, Compass } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { siteUrl, SITE_URL } from "@/lib/seo";
import { SIGN_PROFILES, canonicalPairSlug } from "@/lib/seo/programmatic";

export const dynamic = "force-static";

// Los 144 pares de signos se pre-generan; cualquier otro par resuelve a 404
// real en el router.
export const dynamicParams = false;

interface SignInfo {
  slug: string;
  name: string;
  element: "Fuego" | "Tierra" | "Aire" | "Agua";
  modality: "Cardinal" | "Fijo" | "Mutable";
  ruler: string;
  symbol: string;
  dates: string;
  energy: string;
}

const SIGNS_DATA: Record<string, SignInfo> = {
  aries: { slug: "aries", name: "Aries", element: "Fuego", modality: "Cardinal", symbol: "♈", ...SIGN_PROFILES.aries },
  tauro: { slug: "tauro", name: "Tauro", element: "Tierra", modality: "Fijo", symbol: "♉", ...SIGN_PROFILES.tauro },
  geminis: { slug: "geminis", name: "Géminis", element: "Aire", modality: "Mutable", symbol: "♊", ...SIGN_PROFILES.geminis },
  cancer: { slug: "cancer", name: "Cáncer", element: "Agua", modality: "Cardinal", symbol: "♋", ...SIGN_PROFILES.cancer },
  leo: { slug: "leo", name: "Leo", element: "Fuego", modality: "Fijo", symbol: "♌", ...SIGN_PROFILES.leo },
  virgo: { slug: "virgo", name: "Virgo", element: "Tierra", modality: "Mutable", symbol: "♍", ...SIGN_PROFILES.virgo },
  libra: { slug: "libra", name: "Libra", element: "Aire", modality: "Cardinal", symbol: "♎", ...SIGN_PROFILES.libra },
  escorpio: { slug: "escorpio", name: "Escorpio", element: "Agua", modality: "Fijo", symbol: "♏", ...SIGN_PROFILES.escorpio },
  sagitario: { slug: "sagitario", name: "Sagitario", element: "Fuego", modality: "Mutable", symbol: "♐", ...SIGN_PROFILES.sagitario },
  capricornio: { slug: "capricornio", name: "Capricornio", element: "Tierra", modality: "Cardinal", symbol: "♑", ...SIGN_PROFILES.capricornio },
  acuario: { slug: "acuario", name: "Acuario", element: "Aire", modality: "Fijo", symbol: "♒", ...SIGN_PROFILES.acuario },
  piscis: { slug: "piscis", name: "Piscis", element: "Agua", modality: "Mutable", symbol: "♓", ...SIGN_PROFILES.piscis },
};

const ALL_SIGN_SLUGS = Object.keys(SIGNS_DATA);

export async function generateStaticParams() {
  const params: { signoA: string; signoB: string }[] = [];
  for (const a of ALL_SIGN_SLUGS) {
    for (const b of ALL_SIGN_SLUGS) {
      params.push({ signoA: a, signoB: b });
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ signoA: string; signoB: string }>;
}

function calculateElementSynergy(elA: string, elB: string): { score: number; level: string; desc: string } {
  if (elA === elB) {
    return { score: 85, level: "Resonancia Natural", desc: `Ambos comparten el elemento ${elA}, lo que genera un entendimiento instintivo de sus ritmos y motivaciones básicas.` };
  }
  if ((elA === "Fuego" && elB === "Aire") || (elA === "Aire" && elB === "Fuego")) {
    return { score: 92, level: "Alta Dinámica & Expansión", desc: "El Aire oxigena y estimula al Fuego, mientras que el Fuego aporta calidez y pasión a las ideas del Aire." };
  }
  if ((elA === "Tierra" && elB === "Agua") || (elA === "Agua" && elB === "Tierra")) {
    return { score: 90, level: "Fertilidad & Contención", desc: "La Tierra da estructura y cauce a la sensibilidad del Agua, mientras que el Agua nutre y ablanda la firmeza de la Tierra." };
  }
  if ((elA === "Fuego" && elB === "Tierra") || (elA === "Tierra" && elB === "Fuego")) {
    return { score: 72, level: "Pragmatismo vs. Impulso", desc: "El Fuego inspira a la Tierra a tomar riesgos calculados, y la Tierra ayuda al Fuego a materializar sus visiones en la realidad." };
  }
  if ((elA === "Aire" && elB === "Agua") || (elA === "Agua" && elB === "Aire")) {
    return { score: 68, level: "Mente vs. Emoción", desc: "El Aire busca comprender racionalmente lo que el Agua siente de forma intuitiva. Requiere escucha y empatía mutua." };
  }
  // Fuego + Agua
  return { score: 65, level: "Vapor & Transformación", desc: "Una combinación de enorme magnetismo e intensidad emocional donde el desafío es regular la temperatura para no apagarse ni abrumarse." };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { signoA, signoB } = await params;
  const signA = SIGNS_DATA[signoA.toLowerCase()];
  const signB = SIGNS_DATA[signoB.toLowerCase()];

  if (!signA || !signB) {
    return { title: "Sinastría no encontrada" };
  }

  const title = `Compatibilidad ${signA.name} y ${signB.name}: Amor, Sinergia y Elementos`;
  const description = `Descubrí la química astrológica entre ${signA.name} (${signA.element}) y ${signB.name} (${signB.element}). Puntos de conexión, desafíos y sinastría completa.`;
  // Fase 3 — `/sinastria/a/b` y `/compatibilidad/a-b` cubren el mismo intent
  // (144 pares signo×signo cada una). `/compatibilidad/[pair]` queda canónica
  // (integrada al catálogo programático). Esta familia: canonical + noindex
  // (follow, para no perder link equity) y fuera del sitemap. El 301 duro
  // queda para cuando se confirme paridad de contenido y rank.
  const canonicalCompat = siteUrl(`/compatibilidad/${canonicalPairSlug(signA.slug, signB.slug)}`);

  return {
    title,
    description,
    // Sin noindex desde que /compatibilidad es indexable (2026-10-17): con
    // la canónica apuntando a una página indexable, Google consolida las
    // señales ahí; noindex + canonical a otra URL son señales contradictorias.
    alternates: {
      canonical: canonicalCompat,
    },
    openGraph: {
      title,
      description,
      url: canonicalCompat,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SinastriaPage({ params }: PageProps) {
  const { signoA, signoB } = await params;
  const signA = SIGNS_DATA[signoA.toLowerCase()];
  const signB = SIGNS_DATA[signoB.toLowerCase()];

  if (!signA || !signB) {
    notFound();
  }

  const synergy = calculateElementSynergy(signA.element, signB.element);

  const getElementIcon = (el: string) => {
    switch (el) {
      case "Fuego": return <Flame className="w-4 h-4 text-amber-500" />;
      case "Agua": return <Droplets className="w-4 h-4 text-blue-400" />;
      case "Aire": return <Wind className="w-4 h-4 text-cyan-400" />;
      case "Tierra": return <Mountain className="w-4 h-4 text-emerald-400" />;
      default: return null;
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Compatibilidad entre ${signA.name} y ${signB.name}`,
    description: `Análisis de sinastría y compatibilidad entre los signos zodiacales ${signA.name} y ${signB.name}.`,
    author: {
      "@type": "Organization",
      name: "Molino",
    },
    publisher: {
      "@type": "Organization",
      name: "Molino",
      url: SITE_URL,
    },
    mainEntityOfPage: siteUrl(`/compatibilidad/${signA.slug}-${signB.slug}`),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Modo Pareja", item: `${SITE_URL}/pareja` },
      { "@type": "ListItem", position: 3, name: `${signA.name} y ${signB.name}`, item: siteUrl(`/compatibilidad/${canonicalPairSlug(signA.slug, signB.slug)}`) },
    ],
  };

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        {/* Header Badge */}
        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Heart className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-sm font-bold label-caps">
              Sinastría Solar & Elementos
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground label-caps">
            {signA.name} <span className="text-accent">&</span> {signB.name}
          </h1>

          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            Explorá cómo interactúan la energía de {signA.name} ({signA.element}) y {signB.name} ({signB.element}) en el amor, la comunicación y el crecimiento conjunto.
          </p>
        </header>

        {/* Synergy Score Hero Card */}
        <div className="p-6 sm:p-10 rounded-xl bg-gradient-to-b from-card via-card to-background border border-accent/25 shadow-xl text-center mb-10 relative overflow-hidden">
          <span className="text-sm text-accent font-bold block mb-2 label-caps">
            Índice de Afinidad Elemental
          </span>
          <div className="font-display text-4xl sm:text-5xl font-bold text-foreground my-2 leading-tight">
            {synergy.level}
          </div>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            {synergy.desc}
          </p>

          <div className="mt-6 pt-6 border-t border-ink/10 flex flex-wrap justify-center gap-3">
            <Link
              href="/pareja"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gold-foreground font-heading text-sm font-bold rounded-xl hover:bg-gold-hover transition-colors shadow-md label-caps"
            >
              <span>Calcular con fechas exactas en Modo Pareja</span>
            </Link>
          </div>
        </div>

        {/* Side-by-side Signs Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Card A */}
          <Card padding="lg" className="border-amber-500/30 bg-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{signA.symbol}</span>
              <span className="text-sm bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full font-bold label-caps">
                {signA.dates}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {signA.name}
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-muted">
                {getElementIcon(signA.element)}
                <span>Elemento: <strong className="text-foreground">{signA.element}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Modalidad: <strong className="text-foreground">{signA.modality}</strong></span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed pt-2 border-t border-ink/5">
              {signA.energy}
            </p>
          </Card>

          {/* Card B */}
          <Card padding="lg" className="border-blue-500/30 bg-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{signB.symbol}</span>
              <span className="text-sm bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-bold label-caps">
                {signB.dates}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {signB.name}
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-muted">
                {getElementIcon(signB.element)}
                <span>Elemento: <strong className="text-foreground">{signB.element}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Modalidad: <strong className="text-foreground">{signB.modality}</strong></span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed pt-2 border-t border-ink/5">
              {signB.energy}
            </p>
          </Card>
        </div>

        {/* Social Share Bar */}
        <div className="p-6 rounded-lg bg-card border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
          <div className="text-center sm:text-left">
            <span className="font-heading text-sm font-bold text-foreground block">
              Compartir este análisis de compatibilidad
            </span>
            <span className="text-xs text-muted">
              Compartí la sinastría de {signA.name} y {signB.name} con un clic.
            </span>
          </div>
        </div>

        {/* Related Synastry Cross-links (SEO Internal linking) */}
        <div className="border-t border-ink/10 pt-12">
          <h3 className="font-heading text-base font-bold text-foreground mb-4">
            Otras combinaciones con {signA.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
            {ALL_SIGN_SLUGS.filter((s) => s !== signoB.toLowerCase()).map((slug) => {
              const other = SIGNS_DATA[slug];
              return (
                <Link
                  key={slug}
                  href={`/compatibilidad/${signA.slug}-${other.slug}`}
                  className="p-2 rounded-xl bg-card border border-ink/5 hover:border-accent/40 text-muted hover:text-foreground transition-all text-center"
                >
                  {signA.name} + {other.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
