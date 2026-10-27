"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import Button from "@/components/ui/Button";
import RelationWheel from "@/components/knowledge/RelationWheel";
import { KnowledgeHero, KnowledgeSection, Columns, TextWithFigure, Closing, Note, PrevNext, MARKS, CONTAINER } from "@/components/knowledge/Kit";
import { CHINESE_ANIMALS, type ChineseAnimal, CHINESE_ZODIAC_DISCLAIMER, delAnimal } from "@/lib/data/zodiaco-chino-content";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import SectionCover from "@/components/ui/SectionCover";
import { animalImageKey } from "@/lib/data/section-images";

export interface LunarYearRow {
  year: number;
  start: string;
  end: string;
  element: string;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** "5 feb 1924": la versión corta, para que la tabla entre en el celular. */
const fechaCorta = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1].slice(0, 3)} ${y}`;
};

export default function AnimalContent({ animal, years }: { animal: ChineseAnimal | null | undefined; years: LunarYearRow[] }) {
  const L = useL();
  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-24 pb-24" id="main-content">
          <h1 className="page-title text-foreground">{L("Animal no encontrado", "Animal not found")}</h1>
          <p className="text-muted mt-4">{L("El animal no existe en la base del zodiaco chino de Molino.", "That animal doesn't exist in Molino's Chinese zodiac database.")}</p>
          <div className="mt-8">
            <Button asChild variant="primary">{L(<>
              <Link href="/conocimiento/zodiaco-chino">Volver al Zodiaco Chino</Link>
            </>, <><Link href="/conocimiento/zodiaco-chino">Back to the Chinese Zodiac</Link></>)}</Button>
          </div>
        </main>
      </div>
    );
  }

  const currentIndex = CHINESE_ANIMALS.findIndex((a) => a.name === animal.name);
  const prev = currentIndex > 0 ? CHINESE_ANIMALS[currentIndex - 1] : null;
  const next = currentIndex < CHINESE_ANIMALS.length - 1 ? CHINESE_ANIMALS[currentIndex + 1] : null;
  const slug = (name: string) => name.toLowerCase();
  const friends = animal.compatibility.friendly;
  const enemy = animal.compatibility.challenging[0];
  // El año lunar en curso (si es de este animal) o el próximo que le toca.
  const today = new Date().toISOString().slice(0, 10);
  const current = years.find((y) => y.start <= today && today <= y.end);
  const upcoming = years.find((y) => y.start > today);
  const nextYear = current ?? upcoming;

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <KnowledgeHero
          crumbs={[
            { href: "/", label: L("Inicio", "Home") },
            { href: "/conocimiento/zodiaco-chino", label: L("Zodíaco chino", "Chinese zodiac") },
            { label: animal.name },
          ]}
          eyebrow={L(`Zodíaco chino · signo ${currentIndex + 1} de 12`, `Chinese zodiac · sign ${currentIndex + 1} of 12`)}
          title={L.t(animal.name)}
          lead={animal.meaning}
          meta={
            <>
              {L("Años: ", "Years: ")} {years.map((y) => y.year).map(L.t).join(", ")}
              {current ? (
                <span className="block mt-1 text-foreground">{L(<>
                  Ahora mismo es año {L.t(delAnimal(animal.name))} de {L.t(current.element)}, hasta el {L.t(fechaCorta(current.end))}.
                </>, <>Right now it's a {L.t(current.element)} {L.t(animal.name)} year, until {L.t(fechaCorta(current.end))}.</>)}</span>
              ) : upcoming ? (
                <span className="block mt-1 text-foreground">{L(<>
                  El próximo año {L.t(delAnimal(animal.name))} empieza el {L.t(fechaCorta(upcoming.start))} ({L.t(upcoming.element)}).
                </>, <>The next {L.t(animal.name)} year starts on {L.t(fechaCorta(upcoming.start))} ({L.t(upcoming.element)}).</>)}</span>
              ) : null}
            </>
          }
          legend={[
            { mark: MARKS.ink, text: <>{L(<>En la rueda de los doce animales, en negro: <span className="text-foreground">{L.t(animal.name)}</span>.</>, <>On the wheel of the twelve animals, in black: <span className="text-foreground">{L.t(animal.name)}</span>.</>)}</> },
            { mark: MARKS.trine, text: <>{L(<>El triángulo rojo lo une con sus dos amigos <span className="whitespace-nowrap">(三合)</span>: <span className="text-foreground">{L.t(friends.map(L.t).join(" y "))}</span>.</>, <>The red triangle links it with its two friends <span className="whitespace-nowrap">(三合)</span>: <span className="text-foreground">{L.t(friends.map(L.t).join(" and "))}</span>.</>)}</> },
            ...(enemy ? [{ mark: MARKS.dashed, text: <>{L(<>La línea punteada cruza hasta su opuesto <span className="whitespace-nowrap">(六冲)</span>: <span className="text-foreground">{L.t(enemy)}</span>.</>, <>The dotted line crosses to its opposite <span className="whitespace-nowrap">(六冲)</span>: <span className="text-foreground">{L.t(enemy)}</span>.</>)}</> }] : []),
          ]}
          aside={
            <RelationWheel
              items={CHINESE_ANIMALS.map((a) => ({ key: a.name, label: a.name, icon: <ZodiacAnimalIcon animal={a.name} size={40} /> }))}
              active={currentIndex}
              center={<ZodiacAnimalIcon animal={animal.name} size={64} />}
              ariaLabel={L(`Rueda del zodíaco chino: ${animal.name}, con ${friends.map(L.t).join(" y ")} como amigos y ${enemy} como opuesto.`, `Chinese zodiac wheel: ${L.t(animal.name)}, with ${friends.map(L.t).join(" and ")} as friends and ${L.t(enemy)} as its opposite.`)}
              className="mx-auto max-w-[34rem]"
            />
          }
        />

        <KnowledgeSection label={L("Historia y simbolismo", "History and symbolism")} title={<>{L(<>El {L.t(animal.name)} en la tradición china</>, <>The {L.t(animal.name)} in the Chinese tradition</>)}</>}>
          <TextWithFigure figure={<SectionCover imageKey={animalImageKey(animal.name)} priority />}>
            <p>{L.t(animal.history)}</p>
          </TextWithFigure>
        </KnowledgeSection>

        <KnowledgeSection label={L("Rasgos", "Traits")} title={L("Cómo se manifiesta", "How it shows up")} tone="alt">
          <Columns
            cols={[
              { title: L("Características", "Characteristics"), items: animal.traits },
              { title: L("Fortalezas", "Strengths"), items: animal.strengths },
              { title: L("Desafíos", "Challenges"), items: animal.challenges },
            ]}
          />
        </KnowledgeSection>

        <KnowledgeSection
          label={L(`Años ${delAnimal(animal.name)}`, `${L.t(animal.name)} years`)}
          title={<>{L(<>¿Naciste en un año {L.t(animal.name)}?</>, <>Were you born in a {L.t(animal.name)} year?</>)}</>}
          intro={L("El año chino empieza con el Año Nuevo lunar, entre el 21 de enero y el 21 de febrero. Si naciste en esas semanas, fijate el día exacto: quizás tu signo es el anterior.", "The Chinese year starts with the Lunar New Year, between January 21 and February 21. If you were born in those weeks, check the exact day: your sign may be the previous one.")}
        >
          <div className="max-w-3xl overflow-x-auto">
            <table className="w-full text-left text-base sm:text-lg tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink text-sm text-muted">
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">{L("Año", "Year")}</th>
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">{L("Desde", "From")}</th>
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">{L("Hasta", "To")}</th>
                  <th scope="col" className="py-3 font-normal label-caps">{L("Elemento", "Element")}</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y.year} className={`border-b border-ink/15 ${y.year === nextYear?.year ? "bg-ink/[0.04]" : ""}`}>
                    <th scope="row" className="py-3 pr-4 font-display font-normal text-xl">{y.year}</th>
                    <td className="py-3 pr-4 whitespace-nowrap">{L.t(fechaCorta(y.start))}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{L.t(fechaCorta(y.end))}</td>
                    <td className="py-3">{L.t(y.element)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KnowledgeSection>

        <KnowledgeSection
          label={L("Los cinco elementos", "The five elements")}
          title={L("Cinco versiones del mismo signo", "Five versions of the same sign")}
          intro={L(`Cada ${animal.name} nace además con uno de cinco elementos, que cambia cada dos años. La tabla de arriba dice cuál le toca a cada año.`, `Every ${L.t(animal.name)} is also born with one of five elements, which changes every two years. The table above shows which one belongs to each year.`)}
          tone="alt"
        >
          <Columns cols={animal.elements.map((el) => ({ title: el.element, body: el.modifier }))} />
        </KnowledgeSection>

        <section className="bg-background">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <Closing
              title={L("¿Cuál es tu animal?", "What's your animal?")}
              text={L("Calculalo con tu fecha de nacimiento, con el corte exacto del Año Nuevo chino, y mirá con qué países, marcas y personas comparte signo.", "Calculate it from your date of birth, with the exact Chinese New Year cutoff, and see which countries, brands and people share your sign.")}
              href="/herramientas/zodiaco-chino"
              cta={L("Calcular mi animal", "Calculate my animal")}
            />
            <Note>
              <p>{L.t(animal.scientificNote)}</p>
              <p>{L.t(CHINESE_ZODIAC_DISCLAIMER)}</p>
            </Note>
            <PrevNext
              label={L("Navegación entre signos", "Navigation between signs")}
              prev={prev ? { href: `/conocimiento/zodiaco-chino/${slug(prev.name)}`, name: prev.name } : null}
              next={next ? { href: `/conocimiento/zodiaco-chino/${slug(next.name)}`, name: next.name } : null}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
