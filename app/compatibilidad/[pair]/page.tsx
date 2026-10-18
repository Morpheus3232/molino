import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SIGN_SLUGS, SIGN_NAMES, SIGN_PROFILES, canonicalPairSlug } from "@/lib/seo/programmatic";
import { SIGN_FACTS } from "@/lib/data/facts/astrology-facts";
import { calculateElementSynergy } from "@/lib/seo/compat-matrix";
import { siteUrl, SITE_URL } from "@/lib/seo";

/**
 * /compatibilidad/[s1]-[s2] — programmatic SEO: 144 sign-compatibility routes.
 * Facts from lib/data/facts, synergy logic from lib/seo/compat-matrix.
 */

// Qué hace cada modalidad — definición clásica, la misma que usa /conocimiento.
const MODALITY_ROLE: Record<string, string> = {
  Cardinal: "inicia",
  Fijo: "sostiene",
  Mutable: "adapta",
};

interface Props {
  params: Promise<{ pair: string }>;
}

function parsePair(param: string): { a: string; b: string } | null {
  const [a, b] = param.split("-");
  if (!a || !b || !SIGN_SLUGS.includes(a as never) || !SIGN_SLUGS.includes(b as never)) return null;
  return { a, b };
}

// Los 144 pares signo×signo se pre-generan; cualquier otro par resuelve a 404
// real en el router (evita el soft-404 con status 200).
export const dynamicParams = false;

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
  // Un par = una URL: `virgo-aries` declara canónica a `aries-virgo`.
  // Indexable desde 2026-10-17 (antes noindex por contenido corto).
  const url = siteUrl(`/compatibilidad/${canonicalPairSlug(a, b)}`);

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
    mainEntityOfPage: `${SITE_URL}/compatibilidad/${canonicalPairSlug(a, b)}`,
  };

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <header className="text-center mb-10">
          <p className="text-sm text-accent font-bold mb-3 label-caps">
            Compatibilidad Astrológica
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground label-caps">
            {nameA} & {nameB}
          </h1>
          <p className="text-sm text-muted mt-3">
            {nameA} ({factA.element}, {factA.modality}) · {nameB} ({factB.element}, {factB.modality})
          </p>
        </header>

        <div className="p-6 rounded-xl bg-gradient-to-b from-card to-background border border-accent/25 text-center mb-10">
          <span className="text-sm text-accent font-bold block mb-2 label-caps">
            Índice de Afinidad Elemental
          </span>
          <div className="font-display text-4xl font-bold my-2 leading-tight">{synergy.level}</div>
          <p className="text-xs text-muted max-w-xl mx-auto leading-relaxed">{synergy.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          {[
            { sign: nameA, fact: factA, profile: SIGN_PROFILES[a as keyof typeof SIGN_PROFILES] },
            { sign: nameB, fact: factB, profile: SIGN_PROFILES[b as keyof typeof SIGN_PROFILES] },
          ].map(({ sign, fact, profile }) => (
            <div key={sign} className="p-4 rounded-lg bg-card border border-ink/10">
              <div className="text-2xl">{fact.symbol}</div>
              <h2 className="font-display text-lg font-bold mt-1">{sign}</h2>
              <p className="text-xs text-muted font-mono mt-1">{fact.element} · {fact.modality}</p>
              <p className="text-sm text-muted mt-2">{profile.dates} · regente {profile.ruler}</p>
              <p className="text-sm text-foreground mt-2 leading-relaxed">{profile.energy}.</p>
            </div>
          ))}
        </div>

        <section className="mt-10 space-y-3 text-base leading-relaxed">
          <h2 className="font-display text-2xl">Cómo se combinan</h2>
          <p>
            <strong>Elementos.</strong> {nameA} es de {factA.element} y {nameB} de {factB.element}. {synergy.desc}
          </p>
          <p>
            <strong>Ritmo.</strong> {nameA} es un signo {factA.modality.toLowerCase()} —{" "}
            {MODALITY_ROLE[factA.modality]}— y {nameB}, {factB.modality.toLowerCase()} —{" "}
            {MODALITY_ROLE[factB.modality]}—.{" "}
            {factA.modality === factB.modality
              ? "Comparten el mismo ritmo: se entienden rápido, pero ninguno compensa lo que al otro le falta."
              : "Tienen ritmos distintos: lo que uno no hace, lo puede hacer el otro, si se ponen de acuerdo en quién hace qué."}
          </p>
          <p className="text-sm text-muted">
            Esto compara solo los signos solares. Con las dos fechas completas, el{" "}
            <Link href="/pareja" className="underline underline-offset-4">Modo Pareja</Link> cruza también
            numerología y zodíaco chino.
          </p>
        </section>

        <nav className="mt-10 border-t border-ink/10 pt-6">
          <h3 className="font-heading text-sm font-bold mb-3">Otras combinaciones</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {SIGN_SLUGS.filter((s) => s !== b).map((slug) => (
              <Link key={slug} href={`/compatibilidad/${canonicalPairSlug(a, slug)}`} className="p-2 rounded-xl bg-card border border-ink/5 hover:border-accent/40 text-muted hover:text-foreground text-center">
                {nameA} + {SIGN_NAMES[slug]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}