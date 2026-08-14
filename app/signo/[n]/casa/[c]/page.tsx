import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HOUSE_BY_NUMBER, HOUSE_NUMBERS } from "@/lib/seo/programmatic";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { siteUrl, SITE_URL } from "@/lib/seo";

/**
 * /signo/[n]/casa/[c] — programmatic SEO: 108 routes (9 numbers x 12 houses).
 * Number facts from lib/data/facts + numerologia-content; house facts from
 * lib/data/knowledge (HOUSES).
 */

interface Props {
  params: Promise<{ n: string; c: string }>;
}

export async function generateStaticParams() {
  const params: { n: string; c: string }[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const house of HOUSE_NUMBERS) {
      params.push({ n: String(n), c: String(house) });
    }
  }
  return params;
}

function numberFact(n: number) {
  return NUMBERS.find((num) => num.number === n) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n, c } = await params;
  const num = Number(n);
  const house = HOUSE_BY_NUMBER[Number(c)];
  const fact = numberFact(num);
  if (!house || !fact) return { title: "No encontrado | Molino" };

  const title = `Número ${num} (${fact.title}) en la Casa ${house.number} (${house.name}) — Molino`;
  const description = `Qué significa tu número ${num} (${fact.title}: ${fact.keywords.join(", ")}) manifestado en la casa astrológica ${house.number} (${house.name}, ${house.area}). Síntesis de numerología y astrología.`;
  const url = siteUrl(`/signo/${num}/casa/${house.number}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SignoCasaPage({ params }: Props) {
  const { n, c } = await params;
  const num = Number(n);
  const house = HOUSE_BY_NUMBER[Number(c)];
  const fact = numberFact(num);
  if (!house || !fact) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Número ${num} en la Casa ${house.number}`,
    description: `Interpretación del número ${num} (${fact.title}) expresado en la casa astrológica ${house.number} (${house.name}).`,
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/signo/${num}/casa/${house.number}`,
  };

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <header className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            Numerología × Astrología
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase">
            Número {num} en la Casa {house.number}
          </h1>
          <p className="text-sm text-muted mt-3">
            {fact.title} · {house.name} — {house.area}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8 text-center">
          <div className="p-5 rounded-2xl bg-card border border-ink/10">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold mb-2">Número</h2>
            <div className="font-display text-5xl font-bold">{num}</div>
            <p className="text-xs text-muted font-mono mt-2">{fact.keywords.join(" · ")}</p>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-ink/10">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold mb-2">Casa</h2>
            <div className="font-display text-5xl font-bold">{house.number}</div>
            <p className="text-xs text-muted font-mono mt-2">{house.name}</p>
          </div>
        </div>

        <section className="rounded-2xl bg-card border border-ink/10 p-6 mb-8">
          <h2 className="font-heading text-base font-bold mb-2">{fact.title} en {house.name}</h2>
          <p className="text-sm text-muted leading-relaxed">{fact.interpretation}</p>
        </section>

        <nav className="border-t border-ink/10 pt-6">
          <h3 className="font-heading text-sm font-bold mb-3">Otras casas para el número {num}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
            {HOUSE_NUMBERS.filter((h) => h !== house.number).map((h) => (
              <Link key={h} href={`/signo/${num}/casa/${h}`} className="p-2 rounded-xl bg-card border border-ink/5 hover:border-accent/40 text-muted hover:text-foreground text-center">
                Casa {h}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}