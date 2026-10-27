import { getL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { SIGN_SLUGS, SIGN_NAMES, SIGN_PROFILES, canonicalPairSlug, pairMeta } from "@/lib/seo/programmatic";
import { SIGN_FACTS } from "@/lib/data/facts/astrology-facts";
import { pairReading, harmoniousSigns } from "@/lib/seo/compat-matrix";
import { siteUrl, SITE_URL } from "@/lib/seo";
import { SectionDiptych } from "@/components/ui/SectionCover";
import { signImageKey } from "@/lib/data/section-images";

/**
 * /compatibilidad/[s1]-[s2] — 78 pares canónicos (orden zodiacal). El par
 * invertido (`piscis-geminis`) y /sinastria/a/b redirigen con 308 acá
 * (next.config.js). La lectura sale de lib/seo/compat-matrix.
 */

interface Props {
  params: Promise<{ pair: string }>;
}

function parsePair(param: string): { a: string; b: string } | null {
  const [a, b] = param.split("-");
  if (!a || !b || !SIGN_SLUGS.includes(a as never) || !SIGN_SLUGS.includes(b as never)) return null;
  if (canonicalPairSlug(a, b) !== param) return null;
  return { a, b };
}

// Cualquier par fuera de los 78 resuelve a 404 real en el router.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { pair: string }[] = [];
  for (const a of SIGN_SLUGS) {
    for (const b of SIGN_SLUGS) {
      if (canonicalPairSlug(a, b) === `${a}-${b}`) params.push({ pair: `${a}-${b}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Compatibilidad no encontrada" };
  const { title, description } = pairMeta(parsed.a, parsed.b);
  const url = siteUrl(`/compatibilidad/${pair}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const list = (items: string[]) => items.join(", ").replace(/, ([^,]*)$/, " y $1");

export default async function CompatibilidadPage({ params }: Props) {
  const L = await getL();
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const { a, b } = parsed;
  const nameA = SIGN_NAMES[a];
  const nameB = SIGN_NAMES[b];
  const factA = SIGN_FACTS[nameA];
  const factB = SIGN_FACTS[nameB];
  const r = pairReading(nameA, nameB);
  const same = a === b;
  const url = `${SITE_URL}/compatibilidad/${pair}`;

  const faq = [
    { q: L(`¿${nameA} y ${nameB} son compatibles?`, `Are ${nameA} and ${nameB} compatible?`), a: `${r.aspect.verdict}. ${r.answer}` },
    ...[nameA, ...(same ? [] : [nameB])].map((n) => ({
      q: L(`¿Con qué signos es más compatible ${n}?`, `Which signs is ${n} most compatible with?`),
      a: L(`Por tradición, con los de su mismo elemento (trígono) y los de elemento complementario (sextil): ${list(harmoniousSigns(n))}.`, `By tradition, with those of its own element (trine) and those of the complementary element (sextile): ${list(harmoniousSigns(n))}.`),
    })),
    {
      q: same ? L(`¿Qué elemento es ${nameA}?`, `What element is ${nameA}?`) : L(`¿Qué elemento son ${nameA} y ${nameB}?`, `What elements are ${nameA} and ${nameB}?`),
      a: same
        ? L(`${nameA} es un signo de ${factA.element}, de modalidad ${factA.modality.toLowerCase()}.`, `${nameA} is a ${factA.element} sign, of ${factA.modality.toLowerCase()} modality.`)
        : L(`${nameA} es de ${factA.element} (${factA.modality.toLowerCase()}) y ${nameB} es de ${factB.element} (${factB.modality.toLowerCase()}).`, `${nameA} is ${factA.element} (${factA.modality.toLowerCase()}) and ${nameB} is ${factB.element} (${factB.modality.toLowerCase()}).`),
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: L(`Compatibilidad ${nameA} y ${nameB}`, `${nameA} and ${nameB} compatibility`),
      description: pairMeta(a, b).description,
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino", url: SITE_URL },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("Compatibilidad", "Compatibility"), item: `${SITE_URL}/herramientas/compatibilidad` },
        { "@type": "ListItem", position: 3, name: `${nameA} y ${nameB}` },
      ],
    },
  ];

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-3xl px-4 sm:px-8">
        <header className="text-center mb-10">
          <p className="text-sm text-accent font-bold mb-3 label-caps">{L("Compatibilidad astrológica", "Astrological compatibility")}</p>
          <h1 className="page-title text-foreground">{L(<>
            {nameA} y {nameB}
          </>, <>{nameA} and {nameB}</>)}</h1>
          <p className="text-sm text-muted mt-3">
            {factA.symbol} {nameA} ({factA.element}, {factA.modality}) · {factB.symbol} {nameB} ({factB.element}, {factB.modality})
          </p>
        </header>

        <SectionDiptych imageKeys={[signImageKey(nameA), signImageKey(nameB)]} className="mb-10" />

        <div className="p-6 border border-ink/15 bg-card text-center mb-10">
          <span className="text-sm text-muted block mb-2 label-caps">{L(<>
            Compatibilidad · {r.aspect.name} ({r.aspect.angle}°)
          </>, <>Compatibility · {r.aspect.name} ({r.aspect.angle}°)</>)}</span>
          <div className="font-display text-4xl font-bold my-2 leading-tight">{r.aspect.verdict}</div>
          <p className="text-base max-w-xl mx-auto leading-relaxed">{r.answer}</p>
        </div>

        <div className={`grid gap-4 text-center ${same ? "grid-cols-1" : "grid-cols-2"}`}>
          {[...new Set([a, b])].map((slug) => {
            const name = SIGN_NAMES[slug];
            const fact = SIGN_FACTS[name];
            const profile = SIGN_PROFILES[slug as keyof typeof SIGN_PROFILES];
            return (
              <Link key={slug} href={`/conocimiento/astrologia/${slug}`} className="p-4 bg-card border border-ink/10 hover:border-ink/40 transition-colors">
                <div className="text-2xl">{fact.symbol}</div>
                <h2 className="font-display text-lg font-bold mt-1">{name}</h2>
                <p className="text-sm text-muted mt-1">{fact.element} · {fact.modality}</p>
                <p className="text-sm text-muted mt-1">{L(<>{profile.dates} · regente {profile.ruler}</>, <>{profile.dates} · ruled by {profile.ruler}</>)}</p>
                <p className="text-sm text-foreground mt-2 leading-relaxed">{profile.energy}.</p>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 space-y-3 text-base leading-relaxed">
          <h2 className="font-display text-2xl">{L(<>{nameA} y {nameB} en el amor</>, <>{nameA} and {nameB} in love</>)}</h2>
          <p>{r.love}</p>
        </section>

        <section className="mt-10 space-y-3 text-base leading-relaxed">
          <h2 className="font-display text-2xl">{L("En la amistad y el trabajo", "In friendship and work")}</h2>
          <p>{r.work}</p>
        </section>

        <section className="mt-10 space-y-3 text-base leading-relaxed">
          <h2 className="font-display text-2xl">{L("Por qué se llevan así", "Why they get along this way")}</h2>
          <p>{L(<><strong>Elemento — {r.element.level}.</strong> {r.element.desc}</>, <><strong>Element — {r.element.level}.</strong> {r.element.desc}</>)}</p>
          <p>{L(<><strong>Ritmo.</strong> {r.rhythm}</>, <><strong>Rhythm.</strong> {r.rhythm}</>)}</p>
          <p>{L(<><strong>Polaridad.</strong> {r.polarity}</>, <><strong>Polarity.</strong> {r.polarity}</>)}</p>
          <p>{L(<><strong>Regentes.</strong> {r.rulers}</>, <><strong>Rulers.</strong> {r.rulers}</>)}</p>
        </section>

        <section className="mt-10 grid sm:grid-cols-2 gap-8 text-base leading-relaxed">
          <div>
            <h2 className="font-display text-2xl mb-3">{same ? L("Lo que aportan", "What they bring") : L("Lo que aporta cada uno", "What each one brings")}</h2>
            {r.bring.map(({ sign, items }) => (
              <p key={sign} className="mb-2"><strong>{same ? L("Los dos", "Both") : sign}:</strong> {list(items).toLowerCase()}.</p>
            ))}
          </div>
          <div>
            <h2 className="font-display text-2xl mb-3">{L("Dónde pueden chocar", "Where they can clash")}</h2>
            {r.clash.map(({ sign, items }) => (
              <p key={sign} className="mb-2"><strong>{same ? L("Los dos", "Both") : sign}:</strong> {list(items).toLowerCase()}.</p>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-3 text-base leading-relaxed">
          <h2 className="font-display text-2xl">{L("Cómo cuidar el vínculo", "How to look after the bond")}</h2>
          <p>{r.aspect.advice}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl mb-4">{L("Preguntas frecuentes", "Frequently asked questions")}</h2>
          <dl className="space-y-5 text-base leading-relaxed">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-sm text-muted mt-10">{L(<>
          Esto compara solo los signos solares. Con las dos fechas completas, el{" "}
          <Link href="/pareja" className="underline underline-offset-4">Modo Pareja</Link> cruza también
          numerología y zodíaco chino.
        </>, <>This compares sun signs only. With both full dates, <Link href="/pareja" className="underline underline-offset-4">Couple Mode</Link> also crosses numerology and the Chinese zodiac.</>)}</p>

        {[a, ...(same ? [] : [b])].map((slug) => (
          <nav key={slug} className="mt-10 border-t border-ink/10 pt-6" aria-label={L(`Compatibilidad de ${SIGN_NAMES[slug]}`, `${SIGN_NAMES[slug]} compatibility`)}>
            <h2 className="font-heading text-sm font-bold mb-3">{L(<>{SIGN_NAMES[slug]} con cada signo</>, <>{SIGN_NAMES[slug]} with each sign</>)}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {SIGN_SLUGS.map((other) => {
                const target = canonicalPairSlug(slug, other);
                if (target === pair) return null;
                return (
                  <Link key={other} href={`/compatibilidad/${target}`} className="p-2 bg-card border border-ink/5 hover:border-ink/40 text-muted hover:text-foreground text-center">{L(<>
                    {SIGN_NAMES[slug]} y {SIGN_NAMES[other]}
                  </>, <>{SIGN_NAMES[slug]} and {SIGN_NAMES[other]}</>)}</Link>
                );
              })}
            </div>
          </nav>
        ))}
      </article>
    </main>
  );
}
