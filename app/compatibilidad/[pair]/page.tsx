import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SIGN_SLUGS, SIGN_NAMES } from "@/lib/seo/programmatic";
import { SIGN_FACTS } from "@/lib/data/facts/astrology-facts";
import { calculateElementSynergy } from "@/lib/seo/compat-matrix";
import { siteUrl, SITE_URL } from "@/lib/seo";

/**
 * /compatibilidad/[s1]-[s2] — programmatic SEO: 144 sign-compatibility routes.
 * Facts from lib/data/facts, synergy logic from lib/seo/compat-matrix.
 */

interface Props {
  params: Promise<{ pair: string }>;
}

function parsePair(param: string): { a: string; b: string } | null {
  const [a, b] = param.split("-");
  if (!a || !b || !SIGN_SLUGS.includes(a as never) || !SIGN_SLUGS.includes(b as never)) return null;
  return { a, b };
}

export async function generateStaticParams() {
  const params: { pair: string }[] = [];
  for (const a of SIGN_SLUGS) {
    for (const b of SIGN_SLUGS) {
      params.push({ pair: `${a}-${b}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Compatibilidad no encontrada" };
  const { a, b } = parsed;
  const nameA = SIGN_NAMES[a];
  const nameB = SIGN_NAMES[b];
  const factA = SIGN_FACTS[nameA];
  const factB = SIGN_FACTS[nameB];

  const title = `Compatibilidad ${nameA} y ${nameB}: ${factA.element} + ${factB.element}`;
  const description = `Descubrí la compatibilidad astrológica entre ${nameA} (${factA.element}, ${factA.modality}) y ${nameB} (${factB.element}, ${factB.modality}). Amor, comunicación y sinergia elemental.`;
  const url = siteUrl(`/compatibilidad/${a}-${b}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CompatibilidadPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const { a, b } = parsed;
  const nameA = SIGN_NAMES[a];
  const nameB = SIGN_NAMES[b];
  const factA = SIGN_FACTS[nameA];
  const factB = SIGN_FACTS[nameB];
  const synergy = calculateElementSynergy(factA.element, factB.element);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Compatibilidad entre ${nameA} y ${nameB}`,
    description: `Análisis de compatibilidad astrológica entre los signos ${nameA} (${factA.element}) y ${nameB} (${factB.element}).`,
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/compatibilidad/${a}-${b}`,
  };

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <header className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            Compatibilidad Astrológica
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase">
            {nameA} & {nameB}
          </h1>
          <p className="text-sm text-muted mt-3">
            {nameA} ({factA.element}, {factA.modality}) · {nameB} ({factB.element}, {factB.modality})
          </p>
        </header>

        <div className="p-6 rounded-3xl bg-gradient-to-b from-card to-background border border-accent/25 text-center mb-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent font-bold block mb-2">
            Índice de Afinidad Elemental
          </span>
          <div className="font-display text-4xl font-bold my-2 leading-tight">{synergy.level}</div>
          <p className="text-xs text-muted max-w-xl mx-auto leading-relaxed">{synergy.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          {[{ sign: nameA, fact: factA }, { sign: nameB, fact: factB }].map(({ sign, fact }) => (
            <div key={sign} className="p-4 rounded-2xl bg-card border border-ink/10">
              <div className="text-2xl">{fact.symbol}</div>
              <h2 className="font-display text-lg font-bold mt-1">{sign}</h2>
              <p className="text-xs text-muted font-mono mt-1">{fact.element} · {fact.modality}</p>
            </div>
          ))}
        </div>

        <nav className="mt-10 border-t border-ink/10 pt-6">
          <h3 className="font-heading text-sm font-bold mb-3">Otras combinaciones</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {SIGN_SLUGS.filter((s) => s !== b).map((slug) => (
              <Link key={slug} href={`/compatibilidad/${a}-${slug}`} className="p-2 rounded-xl bg-card border border-ink/5 hover:border-accent/40 text-muted hover:text-foreground text-center">
                {nameA} + {SIGN_NAMES[slug]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}