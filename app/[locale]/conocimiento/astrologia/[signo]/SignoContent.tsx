"use client";

import { Link } from "@/lib/i18n/navigation";
import { ZODIAC_SIGNS, ASTROLOGY_DISCLAIMER } from "@/lib/data/astrologia-content";
import SectionCover from "@/components/ui/SectionCover";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";
import RelationWheel from "@/components/knowledge/RelationWheel";
import { KnowledgeHero, KnowledgeSection, Columns, TextWithFigure, Closing, Note, PrevNext, MARKS, CONTAINER } from "@/components/knowledge/Kit";
import { signImageKey } from "@/lib/data/section-images";

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** /compatibilidad/a-b en orden zodiacal: el mismo de ZODIAC_SIGNS (canonicalPairSlug). */
function pairHref(a: string, b: string) {
  const ia = ZODIAC_SIGNS.findIndex((s) => s.name === a);
  const ib = ZODIAC_SIGNS.findIndex((s) => s.name === b);
  const [x, y] = ia <= ib ? [a, b] : [b, a];
  return `/compatibilidad/${normalize(x)}-${normalize(y)}`;
}


export default function SignoContent({ sign }: { sign: (typeof ZODIAC_SIGNS)[number] | null | undefined }) {
  if (!sign) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
          <h1 className="page-title text-foreground">Signo no encontrado</h1>
          <p className="text-muted mt-4">El signo no existe en la base de astrología de Molino.</p>
          <Link href="/conocimiento/astrologia" className="mt-6 inline-block text-sm text-accent hover:text-accent/80">&larr; Volver a Astrología</Link>
        </main>
      </div>
    );
  }

  const currentIndex = ZODIAC_SIGNS.findIndex(s => s.name === sign.name);
  const prev = currentIndex > 0 ? ZODIAC_SIGNS[currentIndex - 1] : null;
  const next = currentIndex < ZODIAC_SIGNS.length - 1 ? ZODIAC_SIGNS[currentIndex + 1] : null;
  const trine = [currentIndex, (currentIndex + 4) % 12, (currentIndex + 8) % 12].sort((a, b) => a - b).map((i) => ZODIAC_SIGNS[i].name);
  const opposite = ZODIAC_SIGNS[(currentIndex + 6) % 12].name;

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <KnowledgeHero
          crumbs={[
            { href: "/", label: "Inicio" },
            { href: "/conocimiento/astrologia", label: "Astrología" },
            { label: sign.name },
          ]}
          eyebrow={`Astrología · signo ${currentIndex + 1} de 12`}
          title={sign.name}
          lead={sign.meaning}
          meta={
            <dl className="grid grid-cols-2 gap-px bg-ink/15 border border-ink/15 max-w-xl">
              {[
                ["Fechas", sign.dates],
                ["Elemento", sign.element],
                ["Modalidad", sign.modality],
                ["Regente", sign.rulingPlanet],
              ].map(([k, v]) => (
                <div key={k} className="bg-background p-3">
                  <dt className="text-sm text-muted label-caps">{k}</dt>
                  <dd className="mt-1 text-base text-foreground leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          }
          legend={[
            { mark: MARKS.ink, text: <>En la rueda del zodíaco, en negro: <span className="text-foreground">{sign.name}</span>.</> },
            { mark: MARKS.trine, text: <>El triángulo rojo une los tres signos de {sign.element}: <span className="text-foreground">{trine.join(", ").replace(/, ([^,]*)$/, " y $1")}</span>. Comparten temperamento.</> },
            { mark: MARKS.dashed, text: <>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{opposite}</span>. Lo que al otro le sobra, a este le falta.</> },
          ]}
          aside={
            <RelationWheel
              items={ZODIAC_SIGNS.map((s) => ({ key: s.name, label: s.name, icon: <AstrologySignIcon sign={s.name} size={40} /> }))}
              active={currentIndex}
              center={<AstrologySignIcon sign={sign.name} size={64} />}
              ariaLabel={`Rueda del zodíaco: ${sign.name}, con ${trine.join(", ")} en el mismo elemento y ${opposite} como opuesto.`}
              className="mx-auto max-w-[34rem]"
            />
          }
        />

        <KnowledgeSection label="Historia" title={<>{sign.name} en el cielo y en la tradición</>}>
          <TextWithFigure figure={<SectionCover imageKey={signImageKey(sign.name)} priority />}>
            <p>{sign.history}</p>
          </TextWithFigure>
        </KnowledgeSection>

        <KnowledgeSection label="Rasgos" title="Cómo se manifiesta" tone="alt">
          <Columns
            cols={[
              { title: "Fortalezas", items: sign.strengths },
              { title: "Desafíos", items: sign.challenges },
            ]}
          />
        </KnowledgeSection>

        <KnowledgeSection
          label="Compatibilidades"
          title={<>{sign.name} con los demás signos</>}
          intro="La astrología clásica mira el elemento, la modalidad y la distancia en la rueda. Tocá un par para leerlo completo."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15 mb-10">
            {[
              { title: "Se entienden", list: sign.compatibility.friendly },
              { title: "Les cuesta más", list: sign.compatibility.challenging },
            ].map((col) => (
              <div key={col.title} className="bg-background p-6 sm:p-8">
                <h3 className="font-display font-normal text-2xl text-foreground">{col.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {col.list.map((o) => (
                    <li key={o}>
                      <Link href={pairHref(sign.name, o)} className="text-lg underline underline-offset-4 hover:no-underline">
                        {sign.name} y {o}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted label-caps mb-3">{sign.name} con cada signo</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-ink/15">
            {ZODIAC_SIGNS.map((other) => (
              <li key={other.name} className="border-r border-b border-ink/15">
                <Link href={pairHref(sign.name, other.name)} className="group flex items-center gap-3 p-4 hover:bg-ink/[0.03]">
                  <AstrologySignIcon sign={other.name} size={22} className="text-muted group-hover:text-foreground shrink-0" />
                  <span className="text-base group-hover:underline underline-offset-4">{other.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </KnowledgeSection>

        <section className="bg-background">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <Closing
              title="¿Cuál es tu signo?"
              text="Calculalo con tu fecha de nacimiento y mirá cómo se cruza con tu número y tu animal del zodíaco chino."
              href="/herramientas/signo-solar"
              cta="Calcular mi signo"
            />
            <Note>
              <p>{sign.scientificNote}</p>
              <p>{ASTROLOGY_DISCLAIMER}</p>
            </Note>
            <PrevNext
              label="Navegación entre signos"
              prev={prev ? { href: `/conocimiento/astrologia/${normalize(prev.name)}`, name: prev.name } : null}
              next={next ? { href: `/conocimiento/astrologia/${normalize(next.name)}`, name: next.name } : null}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
