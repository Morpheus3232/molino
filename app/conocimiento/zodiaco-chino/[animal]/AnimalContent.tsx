"use client";

import Link from "next/link";
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
  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-24 pb-24" id="main-content">
          <h1 className="page-title text-foreground">Animal no encontrado</h1>
          <p className="text-muted mt-4">
            El animal no existe en la base del zodiaco chino de Molino.
          </p>
          <div className="mt-8">
            <Button asChild variant="primary">
              <Link href="/conocimiento/zodiaco-chino">Volver al Zodiaco Chino</Link>
            </Button>
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
            { href: "/", label: "Inicio" },
            { href: "/conocimiento/zodiaco-chino", label: "Zodíaco chino" },
            { label: animal.name },
          ]}
          eyebrow={`Zodíaco chino · signo ${currentIndex + 1} de 12`}
          title={animal.name}
          lead={animal.meaning}
          meta={
            <>
              Años: {years.map((y) => y.year).join(", ")}
              {current ? (
                <span className="block mt-1 text-foreground">
                  Ahora mismo es año {delAnimal(animal.name)} de {current.element}, hasta el {fechaCorta(current.end)}.
                </span>
              ) : upcoming ? (
                <span className="block mt-1 text-foreground">
                  El próximo año {delAnimal(animal.name)} empieza el {fechaCorta(upcoming.start)} ({upcoming.element}).
                </span>
              ) : null}
            </>
          }
          legend={[
            { mark: MARKS.ink, text: <>En la rueda de los doce animales, en negro: <span className="text-foreground">{animal.name}</span>.</> },
            { mark: MARKS.trine, text: <>El triángulo rojo lo une con sus dos amigos <span className="whitespace-nowrap">(三合)</span>: <span className="text-foreground">{friends.join(" y ")}</span>.</> },
            ...(enemy ? [{ mark: MARKS.dashed, text: <>La línea punteada cruza hasta su opuesto <span className="whitespace-nowrap">(六冲)</span>: <span className="text-foreground">{enemy}</span>.</> }] : []),
          ]}
          aside={
            <RelationWheel
              items={CHINESE_ANIMALS.map((a) => ({ key: a.name, label: a.name, icon: <ZodiacAnimalIcon animal={a.name} size={40} /> }))}
              active={currentIndex}
              center={<ZodiacAnimalIcon animal={animal.name} size={64} />}
              ariaLabel={`Rueda del zodíaco chino: ${animal.name}, con ${friends.join(" y ")} como amigos y ${enemy} como opuesto.`}
              className="mx-auto max-w-[34rem]"
            />
          }
        />

        <KnowledgeSection label="Historia y simbolismo" title={<>El {animal.name} en la tradición china</>}>
          <TextWithFigure figure={<SectionCover imageKey={animalImageKey(animal.name)} priority />}>
            <p>{animal.history}</p>
            <p className="text-lg text-muted">
              La figura de la lámina es parte de un juego funerario de los doce animales del zodíaco, de cerámica, del
              siglo VI: el mismo calendario que se usa hoy, enterrado hace casi mil quinientos años.
            </p>
          </TextWithFigure>
        </KnowledgeSection>

        <KnowledgeSection label="Rasgos" title="Cómo se manifiesta" tone="alt">
          <Columns
            cols={[
              { title: "Características", items: animal.traits },
              { title: "Fortalezas", items: animal.strengths },
              { title: "Desafíos", items: animal.challenges },
            ]}
          />
        </KnowledgeSection>

        <KnowledgeSection
          label={`Años ${delAnimal(animal.name)}`}
          title={<>¿Naciste en un año {animal.name}?</>}
          intro="El año chino empieza con el Año Nuevo lunar, entre el 21 de enero y el 21 de febrero. Si naciste en esas semanas, fijate el día exacto: quizás tu signo es el anterior."
        >
          <div className="max-w-3xl overflow-x-auto">
            <table className="w-full text-left text-base sm:text-lg tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink text-sm text-muted">
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">Año</th>
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">Desde</th>
                  <th scope="col" className="py-3 pr-4 font-normal label-caps">Hasta</th>
                  <th scope="col" className="py-3 font-normal label-caps">Elemento</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y.year} className={`border-b border-ink/15 ${y.year === nextYear?.year ? "bg-ink/[0.04]" : ""}`}>
                    <th scope="row" className="py-3 pr-4 font-display font-normal text-xl">{y.year}</th>
                    <td className="py-3 pr-4 whitespace-nowrap">{fechaCorta(y.start)}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{fechaCorta(y.end)}</td>
                    <td className="py-3">{y.element}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KnowledgeSection>

        <KnowledgeSection
          label="Los cinco elementos"
          title="Cinco versiones del mismo signo"
          intro={`Cada ${animal.name} nace además con uno de cinco elementos, que cambia cada dos años. La tabla de arriba dice cuál le toca a cada año.`}
          tone="alt"
        >
          <Columns cols={animal.elements.map((el) => ({ title: el.element, body: el.modifier }))} />
        </KnowledgeSection>

        <section className="bg-background">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <Closing
              title="¿Cuál es tu animal?"
              text="Calculalo con tu fecha de nacimiento, con el corte exacto del Año Nuevo chino, y mirá con qué países, marcas y personas comparte signo."
              href="/herramientas/zodiaco-chino"
              cta="Calcular mi animal"
            />
            <Note>
              <p>{animal.scientificNote}</p>
              <p>{CHINESE_ZODIAC_DISCLAIMER}</p>
            </Note>
            <PrevNext
              label="Navegación entre signos"
              prev={prev ? { href: `/conocimiento/zodiaco-chino/${slug(prev.name)}`, name: prev.name } : null}
              next={next ? { href: `/conocimiento/zodiaco-chino/${slug(next.name)}`, name: next.name } : null}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
