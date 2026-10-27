"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import { NUMBERS, NUMEROLOGY_DISCLAIMER, MASTER_NUMBERS_NOTE, MASTER_NUMBERS } from "@/lib/data/numerologia-content";
import SectionCover from "@/components/ui/SectionCover";
import LoShuFigure, { loShuPlace } from "@/components/knowledge/LoShuFigure";
import { KnowledgeHero, KnowledgeSection, Columns, TextWithFigure, Closing, Note, PrevNext, MARKS, CONTAINER } from "@/components/knowledge/Kit";

export default function NumeroContent({ num }: { num: (typeof NUMBERS)[number] | null | undefined }) {
  const L = useL();
  if (!num) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
          <h1 className="page-title text-foreground">{L("Número no encontrado", "Number not found")}</h1>
          <p className="text-muted mt-4">{L("El número no existe en la base de numerología de Molino.", "That number doesn't exist in Molino's numerology database.")}</p>
          <Link href="/conocimiento/numerologia" className="mt-6 inline-block text-sm text-accent hover:text-accent/80">{L(<>&larr; Volver a Numerología</>, <>&larr; Back to Numerology</>)}</Link>
        </main>
      </div>
    );
  }

  const allNumbers = NUMBERS;
  const currentIndex = allNumbers.findIndex(n => n.number === num.number);
  const prev = currentIndex > 0 ? allNumbers[currentIndex - 1] : null;
  const next = currentIndex < allNumbers.length - 1 ? allNumbers[currentIndex + 1] : null;
  const isMaster = MASTER_NUMBERS.includes(num.number);
  const digit = num.number > 9 ? Number(String(num.number)[0]) : num.number;
  const place = loShuPlace(digit);

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <KnowledgeHero
          crumbs={[
            { href: "/", label: L("Inicio", "Home") },
            { href: "/conocimiento/numerologia", label: "Numerología" },
            { label: L(`Número ${num.number}`, `Number ${num.number}`) },
          ]}
          eyebrow={isMaster ? L(`Numerología · número maestro`, "Numerology · master number") : L(`Numerología · número ${num.number} de 9`, `Numerology · number ${num.number} of 9`)}
          title={
            <>
              <span className="block">{num.number}</span>
              <span className="block text-[0.42em] leading-tight mt-3">{num.title}</span>
            </>
          }
          lead={num.coreDrive}
          meta={<>{L(<>Palabras clave: {num.keywords.join(", ").toLowerCase()}.</>, <>Keywords: {num.keywords.join(", ").toLowerCase()}.</>)}</>}
          legend={
            place
              ? [
                  {
                    mark: MARKS.cell,
                    text: isMaster ? (
                      <>{L(<>El {num.number} repite el <span className="text-foreground">{digit}</span>: en el cuadrado Lo Shu ocupa su lugar, {place.where}, dos veces.</>, <>{num.number} repeats the <span className="text-foreground">{digit}</span>: in the Lo Shu square it occupies its place, {place.where}, twice.</>)}</>
                    ) : (
                      <>{L(<>En el cuadrado Lo Shu, el <span className="text-foreground">{num.number}</span> está {place.where}.</>, <>In the Lo Shu square, <span className="text-foreground">{num.number}</span> sits {place.where}.</>)}</>
                    ),
                  },
                  {
                    mark: MARKS.row,
                    text: <>{L(<>Su fila suma quince, como todas: <span className="text-foreground">{place.row.join(" + ")} = 15</span>.</>, <>Its row adds up to fifteen, like all of them: <span className="text-foreground">{place.row.join(" + ")} = 15</span>.</>)}</>,
                  },
                ]
              : undefined
          }
          aside={<LoShuFigure number={num.number} />}
        />

        {isMaster && (
          <section className="bg-background border-b border-ink/10">
            <div className={`${CONTAINER} py-10`}>
              <p className="max-w-3xl text-lg text-foreground/85 leading-relaxed border-l-2 border-vermilion pl-5">{L(<>
                <span className="text-sm text-muted label-caps mr-2">Número maestro</span>
                {MASTER_NUMBERS_NOTE}{" "}
                <Link href="/guia/numeros-maestros" className="underline underline-offset-4 hover:no-underline">Leer la guía</Link>.
              </>, <><span className="text-sm text-muted label-caps mr-2">Master number</span>{MASTER_NUMBERS_NOTE}{" "}<Link href="/guia/numeros-maestros" className="underline underline-offset-4 hover:no-underline">Read the guide</Link>.</>)}</p>
            </div>
          </section>
        )}

        <KnowledgeSection label={L("Significado", "Meaning")} title={<>{L(<>Qué dice el {num.number}</>, <>What {num.number} says</>)}</>}>
          <TextWithFigure figure={<SectionCover imageKey={`numerologia/${num.number}`} priority />}>
            <p>{num.meaning}</p>
            <div className="border-t border-ink/15 pt-6 space-y-4">
              <p className="text-sm text-muted label-caps">{L("Historia y simbolismo", "History and symbolism")}</p>
              <p className="text-lg text-foreground/85">{num.history}</p>
              <p className="text-lg text-muted">{num.symbolism}</p>
            </div>
          </TextWithFigure>
        </KnowledgeSection>

        <KnowledgeSection label={L("Estructura", "Structure")} title={L("Cómo funciona por dentro", "How it works inside")} tone="alt">
          <dl className="border-t-2 border-ink max-w-4xl">
            {[
              [L("Impulso central", "Core drive"), <p key="a">{num.coreDrive}</p>],
              [L("Cómo suele expresarse", "How it tends to express itself"), <p key="b">{num.behaviorPattern}</p>],
              [
                L("Potencial", "Potential"),
                <ul key="c" className="space-y-1.5">
                  {num.potential.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="w-3 h-px bg-ink/50 mt-[0.8em] shrink-0" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>,
              ],
              [L("Sombra", "Shadow"), <p key="d" className="text-muted">{num.shadow}</p>],
              [L("Qué necesita desarrollar", "What it needs to develop"), <p key="e">{num.growthEdge}</p>],
            ].map(([k, v]) => (
              <div key={k as string} className="grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-x-8 gap-y-1 py-5 border-b border-ink/15">
                <dt className="font-display text-xl text-foreground">{k}</dt>
                <dd className="text-lg leading-relaxed text-foreground/85">{v}</dd>
              </div>
            ))}
          </dl>
        </KnowledgeSection>

        <KnowledgeSection label={L("Rasgos", "Traits")} title={L("Lo que da y lo que cuesta", "What it gives and what it costs")}>
          <Columns
            cols={[
              { title: L("Fortalezas", "Strengths"), items: num.strengths },
              { title: L("Desafíos", "Challenges"), items: num.challenges },
            ]}
          />
        </KnowledgeSection>

        <KnowledgeSection label={L("En la práctica", "In practice")} title={L("Dónde se nota", "Where it shows")} tone="alt">
          <Columns
            cols={[
              { title: L("Decisiones", "Decisions"), body: num.manifestation.decisions },
              { title: L("Relaciones", "Relationships"), body: num.manifestation.relationships },
              { title: L("Trabajo", "Work"), body: num.manifestation.work },
            ]}
          />
        </KnowledgeSection>

        <section className="bg-background border-b border-ink/10">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <p className="text-sm text-muted label-caps text-center mb-6">{L(<>Una pregunta para el {num.number}</>, <>A question for {num.number}</>)}</p>
            <blockquote className="mx-auto max-w-3xl text-center font-display italic text-3xl sm:text-4xl leading-snug text-foreground">
              &laquo;{num.reflectionQuestion}&raquo;
            </blockquote>
          </div>
        </section>

        <KnowledgeSection label={L("Interpretación de Molino", "Molino's interpretation")} title={<>{L(<>Cómo leemos el {num.number}</>, <>How we read {num.number}</>)}</>}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 space-y-6 text-lg sm:text-xl leading-relaxed text-foreground/90">
              <p>{num.interpretation}</p>
              <p className="text-lg text-muted">{num.relationshipWithOther}</p>
            </div>
            <div className="lg:col-span-5 border-l-2 border-ink pl-6">
              <p className="text-sm text-muted label-caps mb-2">{L("Ejemplo", "Example")}</p>
              <p className="text-lg leading-relaxed text-foreground/85">{num.example}</p>
            </div>
          </div>
        </KnowledgeSection>

        <section className="bg-background">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <Closing
              title={L("¿Cuál es tu número?", "What's your number?")}
              text={L("Calculá tu Camino de Vida con tu fecha de nacimiento: la cuenta queda a la vista, paso a paso.", "Calculate your Life Path from your date of birth: the math stays in plain sight, step by step.")}
              href="/herramientas/camino-de-vida"
              cta={L("Calcular mi número", "Calculate my number")}
            />
            <Note>
              <p>{num.scientificNote}</p>
              <p>{NUMEROLOGY_DISCLAIMER}</p>
            </Note>
            <PrevNext
              label={L("Navegación entre números", "Navigation between numbers")}
              prev={prev ? { href: `/conocimiento/numerologia/${prev.number}`, name: <>{prev.number} · {prev.title}</> } : null}
              next={next ? { href: `/conocimiento/numerologia/${next.number}`, name: <>{next.number} · {next.title}</> } : null}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
