"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import RelationWheel from "@/components/knowledge/RelationWheel";
import LoShuFigure from "@/components/knowledge/LoShuFigure";
import { KnowledgeHero, MARKS } from "@/components/knowledge/Kit";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import { ANIMALS } from "@/lib/data/animalRelations";
import { CHINESE_NEW_YEAR_DATES, getLunarYear } from "@/lib/data/chinese-new-year";
import { getChineseAnimal, getChineseElement } from "@/lib/engines/chineseZodiacEngine";
import { getSunSign } from "@/lib/engines/astrologyEngine";
import { lifePathSteps } from "@/lib/numerology/explain";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { animalsByKind } from "@/lib/engines/personalMapEngine";

/**
 * El instrumento de cada portada de Conocimiento: escribís una fecha y la
 * figura del sistema se acomoda (la rueda china, la rueda del zodíaco, el
 * cuadrado Lo Shu). Sin fecha muestra el día de hoy. Todo se calcula en el
 * navegador con los mismos motores que Mi Mapa.
 */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaLarga = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
};
const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number(s.slice(0, 4)) >= 1886 && Number(s.slice(0, 4)) <= 2099;

/** La fecha de hoy recién en el cliente: evita que el HTML estático quede con el día del build. */
function useToday() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);
  return today;
}

function DateField({ value, onChange, id, resetLabel = "Volver a hoy" }: { value: string; onChange: (v: string) => void; id: string; resetLabel?: string }) {
  return (
    <div className="max-w-xl">
      <label htmlFor={id} className="block text-sm text-muted label-caps mb-2">
        Probá con tu fecha de nacimiento
      </label>
      <div className="flex items-stretch border-2 border-ink">
        <input
          id={id}
          type="date"
          min="1900-01-01"
          max="2099-12-31"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-background px-4 py-3 font-display text-xl text-foreground focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-4 text-sm text-muted hover:text-foreground border-l border-ink/20"
          >
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function Result({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 text-lg sm:text-xl text-foreground leading-snug max-w-xl" aria-live="polite">
      {children}
    </p>
  );
}

/* ─────────────────────────── Zodíaco chino ─────────────────────────── */

export function ChineseYearInstrument({ crumbs, title, lead }: { crumbs: { href?: string; label: string }[]; title: string; lead: string }) {
  const today = useToday();
  const [date, setDate] = useState("");
  const ref = isValidDate(date) ? date : today ?? "2026-10-25";
  const lunar = getLunarYear(ref);
  const animal = getChineseAnimal(lunar);
  const element = getChineseElement(lunar);
  const index = ANIMALS.indexOf(animal);
  const kinds = animalsByKind(animal);
  const start = CHINESE_NEW_YEAR_DATES[lunar];
  const usingDate = isValidDate(date);

  return (
    <KnowledgeHero
      crumbs={crumbs}
      eyebrow="Zodíaco chino · el calendario de doce animales"
      title={title}
      lead={lead}
      meta={
        <>
          <DateField id="zc-fecha" value={date} onChange={setDate} />
          <Result>
            {usingDate ? (
              <>
                El {fechaLarga(date)} corría el año lunar {lunar}:{" "}
                <Link href={`/conocimiento/zodiaco-chino/${slug(animal)}`} className="underline underline-offset-4 hover:no-underline">
                  {animal} de {element}
                </Link>
                .{lunar !== Number(date.slice(0, 4)) && " Ojo: es anterior al Año Nuevo chino, así que cuenta el año anterior."}
              </>
            ) : (
              <>
                Hoy corre el año del{" "}
                <Link href={`/conocimiento/zodiaco-chino/${slug(animal)}`} className="underline underline-offset-4 hover:no-underline">
                  {animal} de {element}
                </Link>
                {start && <>, que empezó el {fechaLarga(start)}</>}.
              </>
            )}
          </Result>
        </>
      }
      legend={[
        { mark: MARKS.ink, text: <>En negro, el animal de esa fecha: <span className="text-foreground">{animal}</span>.</> },
        { mark: MARKS.trine, text: <>El triángulo rojo lo une con sus dos amigos: <span className="text-foreground">{kinds.amigo.join(" y ")}</span>.</> },
        { mark: MARKS.dashed, text: <>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{kinds.enemigo[0]}</span>.</> },
      ]}
      aside={
        <RelationWheel
          key={animal}
          items={CHINESE_ANIMALS.map((a) => ({ key: a.name, label: a.name, icon: <ZodiacAnimalIcon animal={a.name} size={40} /> }))}
          active={index}
          center={<ZodiacAnimalIcon animal={animal} size={64} />}
          ariaLabel={`Rueda del zodíaco chino con ${animal} marcado.`}
          className="mx-auto max-w-[34rem]"
        />
      }
    />
  );
}

/* ─────────────────────────── Astrología ─────────────────────────── */

export function SunSignInstrument({ crumbs, title, lead }: { crumbs: { href?: string; label: string }[]; title: string; lead: string }) {
  const today = useToday();
  const [date, setDate] = useState("");
  const ref = isValidDate(date) ? date : today ?? "2026-10-25";
  const sign = getSunSign(ref);
  const index = Math.max(0, ZODIAC_SIGNS.findIndex((s) => s.name === sign));
  const info = ZODIAC_SIGNS[index];
  const trine = [index, (index + 4) % 12, (index + 8) % 12].sort((a, b) => a - b).map((i) => ZODIAC_SIGNS[i].name);
  const opposite = ZODIAC_SIGNS[(index + 6) % 12].name;
  const usingDate = isValidDate(date);
  const link = (
    <Link href={`/conocimiento/astrologia/${slug(info.name)}`} className="underline underline-offset-4 hover:no-underline">
      {info.name}
    </Link>
  );

  return (
    <KnowledgeHero
      crumbs={crumbs}
      eyebrow="Astrología · el recorrido del Sol en doce tramos"
      title={title}
      lead={lead}
      meta={
        <>
          <DateField id="as-fecha" value={date} onChange={setDate} />
          <Result>
            {usingDate ? <>El {fechaLarga(date)} el Sol estaba en {link} ({info.dates}).</> : <>Hoy el Sol está en {link}: {info.dates}.</>}
          </Result>
        </>
      }
      legend={[
        { mark: MARKS.ink, text: <>En negro, el signo de esa fecha: <span className="text-foreground">{info.name}</span>.</> },
        { mark: MARKS.trine, text: <>El triángulo rojo une los tres signos de {info.element}: <span className="text-foreground">{trine.join(", ").replace(/, ([^,]*)$/, " y $1")}</span>.</> },
        { mark: MARKS.dashed, text: <>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{opposite}</span>.</> },
      ]}
      aside={
        <RelationWheel
          key={info.name}
          items={ZODIAC_SIGNS.map((s) => ({ key: s.name, label: s.name, icon: <AstrologySignIcon sign={s.name} size={40} /> }))}
          active={index}
          center={<AstrologySignIcon sign={info.name} size={64} />}
          ariaLabel={`Rueda del zodíaco con ${info.name} marcado.`}
          className="mx-auto max-w-[34rem]"
        />
      }
    />
  );
}

/* ─────────────────────────── Numerología ─────────────────────────── */

export function LifePathInstrument({ crumbs, title, lead }: { crumbs: { href?: string; label: string }[]; title: string; lead: string }) {
  const [date, setDate] = useState("");
  const example = "1990-03-15";
  const ref = isValidDate(date) ? date : example;
  const steps = useMemo(() => lifePathSteps(ref), [ref]);
  const num = NUMBERS.find((n) => n.number === steps.result);
  const usingDate = isValidDate(date);

  return (
    <KnowledgeHero
      crumbs={crumbs}
      eyebrow="Numerología · la cuenta con tu fecha"
      title={title}
      lead={lead}
      meta={
        <>
          <DateField id="nu-fecha" value={date} onChange={setDate} resetLabel="Ver el ejemplo" />
          <div className="mt-6 max-w-xl border-l-2 border-ink pl-5" aria-live="polite">
            <p className="text-sm text-muted">
              {usingDate ? `Los dígitos de ${fechaLarga(date)}` : `Un ejemplo: los dígitos de ${fechaLarga(example)}`}
            </p>
            <p className="mt-1 font-mono tabular-nums text-lg sm:text-xl text-foreground break-words">{steps.text}</p>
            <p className="mt-2 text-lg text-foreground">
              Camino de Vida{" "}
              <Link href={`/conocimiento/numerologia/${steps.result}`} className="underline underline-offset-4 hover:no-underline">
                {steps.result}{num ? ` · ${num.title}` : ""}
              </Link>
              {steps.master && <span className="text-muted">: número maestro, no se reduce.</span>}
            </p>
          </div>
        </>
      }
      aside={<LoShuFigure key={steps.result} number={steps.result} />}
    />
  );
}
