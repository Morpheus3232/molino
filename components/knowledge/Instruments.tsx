"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
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
  const L = useL();
  return (
    <div className="max-w-xl">
      <label htmlFor={id} className="block text-sm text-muted label-caps mb-2">{L("Probá con tu fecha de nacimiento", "Try it with your date of birth")}</label>
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
            {L.t(resetLabel)}
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
  const L = useL();
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
      eyebrow={L("Zodíaco chino · el calendario de doce animales", "Chinese zodiac · the calendar of twelve animals")}
      title={L.t(title)}
      lead={lead}
      meta={
        <>
          <DateField id="zc-fecha" value={date} onChange={setDate} />
          <Result>
            {usingDate ? (
              <>{L(<>
                El {L.t(fechaLarga(date))} corría el año lunar {L.t(lunar)}:{" "}
                <Link href={`/conocimiento/zodiaco-chino/${slug(animal)}`} className="underline underline-offset-4 hover:no-underline">
                  {L.t(animal)} de {L.t(element)}
                </Link>
                .{lunar !== Number(date.slice(0, 4)) && " Ojo: es anterior al Año Nuevo chino, así que cuenta el año anterior."}
              </>, <>On {L.t(fechaLarga(date))} it was lunar year {L.t(lunar)}:{" "}<Link href={`/conocimiento/zodiaco-chino/${slug(animal)}`} className="underline underline-offset-4 hover:no-underline">{L.t(element)} {L.t(animal)}</Link>.{lunar !== Number(date.slice(0, 4)) && " Note: it's before Chinese New Year, so the previous year counts."}</>)}</>
            ) : (
              <>
                {L("Hoy corre el año del", "This is the year of the")}{" "}
                <Link href={`/conocimiento/zodiaco-chino/${slug(animal)}`} className="underline underline-offset-4 hover:no-underline">{L(<>
                  {L.t(animal)} de {L.t(element)}
                </>, <>{L.t(element)} {L.t(animal)}</>)}</Link>
                {start && <>{L(<>, que empezó el {L.t(fechaLarga(start))}</>, <>, which began on {L.t(fechaLarga(start))}</>)}</>}.
              </>
            )}
          </Result>
        </>
      }
      legend={[
        { mark: MARKS.ink, text: <>{L(<>En negro, el animal de esa fecha: <span className="text-foreground">{L.t(animal)}</span>.</>, <>In black, the animal of that date: <span className="text-foreground">{L.t(animal)}</span>.</>)}</> },
        { mark: MARKS.trine, text: <>{L(<>El triángulo rojo lo une con sus dos amigos: <span className="text-foreground">{L.t(kinds.amigo.map(L.t).join(" y "))}</span>.</>, <>The red triangle links it with its two friends: <span className="text-foreground">{L.t(kinds.amigo.map(L.t).join(" and "))}</span>.</>)}</> },
        { mark: MARKS.dashed, text: <>{L(<>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{L.t(kinds.enemigo[0])}</span>.</>, <>The dotted line crosses to its opposite: <span className="text-foreground">{L.t(kinds.enemigo[0])}</span>.</>)}</> },
      ]}
      aside={
        <RelationWheel
          key={animal}
          items={CHINESE_ANIMALS.map((a) => ({ key: a.name, label: a.name, icon: <ZodiacAnimalIcon animal={a.name} size={40} /> }))}
          active={index}
          center={<ZodiacAnimalIcon animal={animal} size={64} />}
          ariaLabel={L(`Rueda del zodíaco chino con ${animal} marcado.`, `Chinese zodiac wheel with ${L.t(animal)} marked.`)}
          className="mx-auto max-w-[34rem]"
        />
      }
    />
  );
}

/* ─────────────────────────── Astrología ─────────────────────────── */

export function SunSignInstrument({ crumbs, title, lead }: { crumbs: { href?: string; label: string }[]; title: string; lead: string }) {
  const L = useL();
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
      {L.t(info.name)}
    </Link>
  );

  return (
    <KnowledgeHero
      crumbs={crumbs}
      eyebrow={L("Astrología · el recorrido del Sol en doce tramos", "Astrology · the path of the Sun in twelve stretches")}
      title={L.t(title)}
      lead={lead}
      meta={
        <>
          <DateField id="as-fecha" value={date} onChange={setDate} />
          <Result>
            {usingDate ? <>{L(<>El {L.t(fechaLarga(date))} el Sol estaba en {L.t(link)} ({L.t(info.dates)}).</>, <>On {L.t(fechaLarga(date))} the Sun was in {L.t(link)} ({L.t(info.dates)}).</>)}</> : <>{L(<>Hoy el Sol está en {L.t(link)}: {L.t(info.dates)}.</>, <>Today the Sun is in {L.t(link)}: {L.t(info.dates)}.</>)}</>}
          </Result>
        </>
      }
      legend={[
        { mark: MARKS.ink, text: <>{L(<>En negro, el signo de esa fecha: <span className="text-foreground">{L.t(info.name)}</span>.</>, <>In black, the sign of that date: <span className="text-foreground">{L.t(info.name)}</span>.</>)}</> },
        { mark: MARKS.trine, text: <>{L(<>El triángulo rojo une los tres signos de {L.t(info.element)}: <span className="text-foreground">{L.t(trine.map(L.t).join(", ").replace(/, ([^,]*)$/, " y $1"))}</span>.</>, <>The red triangle links the three {L.t(info.element)} signs: <span className="text-foreground">{L.t(trine.map(L.t).join(", ").replace(/, ([^,]*)$/, " and $1"))}</span>.</>)}</> },
        { mark: MARKS.dashed, text: <>{L(<>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{L.t(opposite)}</span>.</>, <>The dotted line crosses to its opposite: <span className="text-foreground">{L.t(opposite)}</span>.</>)}</> },
      ]}
      aside={
        <RelationWheel
          key={info.name}
          items={ZODIAC_SIGNS.map((s) => ({ key: s.name, label: s.name, icon: <AstrologySignIcon sign={s.name} size={40} /> }))}
          active={index}
          center={<AstrologySignIcon sign={info.name} size={64} />}
          ariaLabel={L(`Rueda del zodíaco con ${info.name} marcado.`, `Zodiac wheel with ${L.t(info.name)} marked.`)}
          className="mx-auto max-w-[34rem]"
        />
      }
    />
  );
}

/* ─────────────────────────── Numerología ─────────────────────────── */

export function LifePathInstrument({ crumbs, title, lead }: { crumbs: { href?: string; label: string }[]; title: string; lead: string }) {
  const L = useL();
  const [date, setDate] = useState("");
  const example = "1990-03-15";
  const ref = isValidDate(date) ? date : example;
  const steps = useMemo(() => lifePathSteps(ref), [ref]);
  const num = NUMBERS.find((n) => n.number === steps.result);
  const usingDate = isValidDate(date);

  return (
    <KnowledgeHero
      crumbs={crumbs}
      eyebrow={L("Numerología · la cuenta con tu fecha", "Numerology · the math with your date")}
      title={L.t(title)}
      lead={lead}
      meta={
        <>
          <DateField id="nu-fecha" value={date} onChange={setDate} resetLabel={L("Ver el ejemplo", "See the example")} />
          <div className="mt-6 max-w-xl border-l-2 border-ink pl-5" aria-live="polite">
            <p className="text-sm text-muted">
              {L.t(usingDate ? L(`Los dígitos de ${fechaLarga(date)}`, `The digits of ${L.t(fechaLarga(date))}`) : L(`Un ejemplo: los dígitos de ${fechaLarga(example)}`, `An example: the digits of ${L.t(fechaLarga(example))}`))}
            </p>
            <p className="mt-1 font-mono tabular-nums text-lg sm:text-xl text-foreground break-words">{L.t(steps.text)}</p>
            <p className="mt-2 text-lg text-foreground">
              {L("Camino de Vida", "Life Path")}{" "}
              <Link href={`/conocimiento/numerologia/${steps.result}`} className="underline underline-offset-4 hover:no-underline">
                {L.t(steps.result)}{L.t(num ? ` · ${num.title}` : "")}
              </Link>
              {steps.master && <span className="text-muted">{L(": número maestro, no se reduce.", ": master number, not reduced.")}</span>}
            </p>
          </div>
        </>
      }
      aside={<LoShuFigure key={steps.result} number={steps.result} />}
    />
  );
}
