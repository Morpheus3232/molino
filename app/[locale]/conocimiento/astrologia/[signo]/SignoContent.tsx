"use client";
import { useL } from "@/lib/i18n/useL";

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
  const L = useL();
  if (!sign) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
          <h1 className="page-title text-foreground">{L("Signo no encontrado", "Sign not found")}</h1>
          <p className="text-muted mt-4">{L("El signo no existe en la base de astrología de Molino.", "That sign doesn't exist in Molino's astrology database.")}</p>
          <Link href="/conocimiento/astrologia" className="mt-6 inline-block text-sm text-accent hover:text-accent/80">{L(<>&larr; Volver a Astrología</>, <>&larr; Back to Astrology</>)}</Link>
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
            { href: "/", label: L("Inicio", "Home") },
            { href: "/conocimiento/astrologia", label: "Astrología" },
            { label: sign.name },
          ]}
          eyebrow={L(`Astrología · signo ${currentIndex + 1} de 12`, `Astrology · sign ${currentIndex + 1} of 12`)}
          title={L.t(sign.name)}
          lead={sign.meaning}
          meta={
            <dl className="grid grid-cols-2 gap-px bg-ink/15 border border-ink/15 max-w-xl">
              {[
                [L("Fechas", "Dates"), sign.dates],
                [L("Elemento", "Element"), sign.element],
                [L("Modalidad", "Modality"), sign.modality],
                [L("Regente", "Ruler"), sign.rulingPlanet],
              ].map(([k, v]) => (
                <div key={k} className="bg-background p-3">
                  <dt className="text-sm text-muted label-caps">{L.t(k)}</dt>
                  <dd className="mt-1 text-base text-foreground leading-snug">{L.t(v)}</dd>
                </div>
              ))}
            </dl>
          }
          legend={[
            { mark: MARKS.ink, text: <>{L(<>En la rueda del zodíaco, en negro: <span className="text-foreground">{L.t(sign.name)}</span>.</>, <>On the zodiac wheel, in black: <span className="text-foreground">{L.t(sign.name)}</span>.</>)}</> },
            { mark: MARKS.trine, text: <>{L(<>El triángulo rojo une los tres signos de {L.t(sign.element)}: <span className="text-foreground">{L.t(trine.map(L.t).join(", ").replace(/, ([^,]*)$/, " y $1"))}</span>. Comparten temperamento.</>, <>The red triangle links the three {L.t(sign.element)} signs: <span className="text-foreground">{L.t(trine.map(L.t).join(", ").replace(/, ([^,]*)$/, " and $1"))}</span>. They share a temperament.</>)}</> },
            { mark: MARKS.dashed, text: <>{L(<>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{L.t(opposite)}</span>. Lo que al otro le sobra, a este le falta.</>, <>The dotted line crosses to its opposite: <span className="text-foreground">{L.t(opposite)}</span>. What one has in excess, the other lacks.</>)}</> },
          ]}
          aside={
            <RelationWheel
              items={ZODIAC_SIGNS.map((s) => ({ key: s.name, label: s.name, icon: <AstrologySignIcon sign={s.name} size={40} /> }))}
              active={currentIndex}
              center={<AstrologySignIcon sign={sign.name} size={64} />}
              ariaLabel={L(`Rueda del zodíaco: ${sign.name}, con ${trine.map(L.t).join(", ")} en el mismo elemento y ${opposite} como opuesto.`, `Zodiac wheel: ${L.t(sign.name)}, with ${trine.map(L.t).join(", ")} in the same element and ${L.t(opposite)} as its opposite.`)}
              className="mx-auto max-w-[34rem]"
            />
          }
        />

        <KnowledgeSection label={L("Historia", "History")} title={<>{L(<>{L.t(sign.name)} en el cielo y en la tradición</>, <>{L.t(sign.name)} in the sky and in tradition</>)}</>}>
          <TextWithFigure figure={<SectionCover imageKey={signImageKey(sign.name)} priority />}>
            <p>{L.t(sign.history)}</p>
          </TextWithFigure>
        </KnowledgeSection>

        <KnowledgeSection label={L("Rasgos", "Traits")} title={L("Cómo se manifiesta", "How it shows up")} tone="alt">
          <Columns
            cols={[
              { title: L("Fortalezas", "Strengths"), items: sign.strengths },
              { title: L("Desafíos", "Challenges"), items: sign.challenges },
            ]}
          />
        </KnowledgeSection>

        <KnowledgeSection
          label={L("Compatibilidades", "Compatibilities")}
          title={<>{L(<>{L.t(sign.name)} con los demás signos</>, <>{L.t(sign.name)} with the other signs</>)}</>}
          intro={L("La astrología clásica mira el elemento, la modalidad y la distancia en la rueda. Tocá un par para leerlo completo.", "Classical astrology looks at the element, the modality and the distance on the wheel. Tap a pair to read it in full.")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15 mb-10">
            {[
              { title: L("Se entienden", "They understand each other"), list: sign.compatibility.friendly },
              { title: L("Les cuesta más", "It's harder for them"), list: sign.compatibility.challenging },
            ].map((col) => (
              <div key={col.title} className="bg-background p-6 sm:p-8">
                <h3 className="font-display font-normal text-2xl text-foreground">{L.t(col.title)}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {col.list.map((o) => (
                    <li key={o}>{L(<>
                      <Link href={pairHref(sign.name, o)} className="text-lg underline underline-offset-4 hover:no-underline">
                        {L.t(sign.name)} y {L.t(o)}
                      </Link>
                    </>, <><Link href={pairHref(sign.name, o)} className="text-lg underline underline-offset-4 hover:no-underline">{L.t(sign.name)} and {L.t(o)}</Link></>)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted label-caps mb-3">{L(<>{L.t(sign.name)} con cada signo</>, <>{L.t(sign.name)} with each sign</>)}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-ink/15">
            {ZODIAC_SIGNS.map((other) => (
              <li key={other.name} className="border-r border-b border-ink/15">
                <Link href={pairHref(sign.name, other.name)} className="group flex items-center gap-3 p-4 hover:bg-ink/[0.03]">
                  <AstrologySignIcon sign={other.name} size={22} className="text-muted group-hover:text-foreground shrink-0" />
                  <span className="text-base group-hover:underline underline-offset-4">{L.t(other.name)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </KnowledgeSection>

        <section className="bg-background">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <Closing
              title={L("¿Cuál es tu signo?", "What's your sign?")}
              text={L("Calculalo con tu fecha de nacimiento y mirá cómo se cruza con tu número y tu animal del zodíaco chino.", "Calculate it from your date of birth and see how it crosses with your number and your Chinese zodiac animal.")}
              href="/herramientas/signo-solar"
              cta={L("Calcular mi signo", "Calculate my sign")}
            />
            <Note>
              <p>{L.t(sign.scientificNote)}</p>
              <p>{L.t(ASTROLOGY_DISCLAIMER)}</p>
            </Note>
            <PrevNext
              label={L("Navegación entre signos", "Navigation between signs")}
              prev={prev ? { href: `/conocimiento/astrologia/${normalize(prev.name)}`, name: prev.name } : null}
              next={next ? { href: `/conocimiento/astrologia/${normalize(next.name)}`, name: next.name } : null}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
