"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { Link } from "@/lib/i18n/navigation";
import HomePlate from "@/components/sections/HomePlate";
import { moonImageKey } from "@/lib/data/section-images";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";

/**
 * El día de la portada contado como un capítulo de libro, no como un
 * tablero: epígrafe, capítulos con número romano, capitular, índices con
 * puntos guía y asterismo entre partes. Mismos datos que /hoy (que conserva
 * su vista de detalle); acá no hay cajas, íconos ni pastillas.
 */

const AREAS = (L: Pick2): { key: "work" | "relationships" | "creativity" | "decisions"; name: string }[] => ([
  { key: "work", name: L("Trabajo", "Work") },
  { key: "relationships", name: L("Vínculos", "Relationships") },
  { key: "creativity", name: L("Creatividad", "Creativity") },
  { key: "decisions", name: L("Decisiones", "Decisions") },
]);

function Chapter({ numeral, title, id }: { numeral: string; title: string; id: string }) {
  return (
    <header className="text-center mb-6">
      <p className="text-sm text-muted label-caps" aria-hidden="true">
        {numeral}
      </p>
      <h3 id={id} className="mt-1 font-display italic font-normal text-2xl sm:text-3xl text-foreground">
        {title}
      </h3>
    </header>
  );
}

/** Renglón de índice: "Trabajo ········ neutral", como la tabla de contenidos de un libro. */
function Leader({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2">
      <span className="shrink-0">{left}</span>
      <span className="flex-1 min-w-4 border-b border-dotted border-ink/40 translate-y-[-0.3em]" aria-hidden="true" />
      <span className="shrink-0 italic text-right">{right}</span>
    </li>
  );
}

function Asterism() {
  return (
    <p className="my-12 text-center text-xl text-muted select-none" aria-hidden="true">
      ⁂
    </p>
  );
}

export default function HomeBook() {
  const L = useL();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  // Sin perfil devuelve la energía universal del día (igual para todos).
  const daily = useDailyEnergy(profile);

  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const dayContent = useMemo(() => getCalendarDayContent(todayKey), [todayKey]);
  const breakdown = useMemo(() => formatDateNumberBreakdown(getDateNumberBreakdown(todayKey)), [todayKey]);

  if (!mounted || loading || !daily) {
    return (
      <p className="sr-only" role="status" aria-live="polite">{L("Cargando el día…", "Loading the day…")}</p>
    );
  }

  const moonKey = moonImageKey(daily.moonPhase.phase);

  return (
    <article className="mx-auto max-w-[38rem] text-lg leading-[1.75] text-foreground">
      {/* Epígrafe: el consejo del momento, como abren los capítulos. */}
      <blockquote className="mx-auto max-w-[28rem] text-center italic text-muted">
        <p>&laquo;{daily.dailyAdvice}&raquo;</p>
        <footer className="mt-2 text-sm not-italic label-caps">{L(<>— consejo del día · luna {daily.moonPhase.phase.toLowerCase()}</>, <>— advice of the day · {daily.moonPhase.phase.toLowerCase()} moon</>)}</footer>
      </blockquote>

      <Asterism />

      <section aria-labelledby="cap-numero">
        <Chapter numeral="I" title={L("El número del día", "The number of the day")} id="cap-numero" />
        <HomePlate imageKey={`numerologia/${dayContent.number}`} className="mb-8" />
        <p className="sm:text-justify hyphens-auto first-letter:float-left first-letter:font-display first-letter:text-[3.6em] first-letter:leading-[0.78] first-letter:mr-2 first-letter:mt-1">
          {L("Hoy es día ", "Today is day")} {dayContent.number}{L(", el de ", ", the day of")} <em>{dayContent.title.toLowerCase().replace(/^\w|^./, (c) => c.toUpperCase())}</em>.{" "}
          {dayContent.description}
        </p>
        <p className="mt-4 text-sm text-muted">{L(<>
          <span className="italic">La cuenta:</span> <span className="font-mono">{breakdown}</span>.{" "}
          <Link href="/calendario" className="underline underline-offset-4 hover:no-underline">
            Ver el calendario del mes
          </Link>
        </>, <><span className="italic">The math:</span> <span className="font-mono">{breakdown}</span>.{" "}<Link href="/calendario" className="underline underline-offset-4 hover:no-underline">See the month's calendar</Link></>)}</p>
      </section>

      <Asterism />

      <section aria-labelledby="cap-trae">
        <Chapter numeral="II" title={L("Lo que trae", "What it brings")} id="cap-trae" />
        {moonKey && <HomePlate imageKey={moonKey} className="mb-8" />}
        <p className="sm:text-justify hyphens-auto">
          <em>{daily.theme}.</em> {daily.description}
        </p>
        <p className="mt-4 sm:text-justify hyphens-auto">{L(<>
          <em>Conviene</em> {daily.focusAction.charAt(0).toLowerCase() + daily.focusAction.slice(1)}{" "}
          <em>Mejor evitar</em> {daily.avoidAction.charAt(0).toLowerCase() + daily.avoidAction.slice(1)}
        </>, <><em>Good for</em> {daily.focusAction.charAt(0).toLowerCase() + daily.focusAction.slice(1)}{" "}<em>Best avoided</em> {daily.avoidAction.charAt(0).toLowerCase() + daily.avoidAction.slice(1)}</>)}</p>
        {daily.isPersonalized && (
          <p className="mt-4 text-base italic text-muted">{L(<>
            En tu mapa: año personal {daily.personalYear}, mes {daily.personalMonth}, día {daily.personalDay}.
          </>, <>In your map: personal year {daily.personalYear}, month {daily.personalMonth}, day {daily.personalDay}.</>)}</p>
        )}
        <ul className="mt-6 space-y-1 text-base" aria-label={L("Cómo viene cada área", "How each area looks")}>
          {AREAS(L).map(({ key, name }) => (
            <Leader key={key} left={name} right={daily.areas[key].label.toLowerCase()} />
          ))}
        </ul>
      </section>

      {daily.nextDaysForecast?.length > 0 && (
        <>
          <Asterism />
          <section aria-labelledby="cap-dias">
            <Chapter numeral="III" title={L("Los próximos días", "The next few days")} id="cap-dias" />
            <ul className="space-y-1 text-base">
              {daily.nextDaysForecast.map((d) => (
                <Leader
                  key={d.date}
                  left={
                    <>
                      {d.dayName} {d.dayNumber}
                    </>
                  }
                  right={L(`día ${d.personalDay}, ${d.theme.toLowerCase()}`, `day ${d.personalDay}, ${d.theme.toLowerCase()}`)}
                />
              ))}
            </ul>
          </section>
        </>
      )}

      <Asterism />

      <p className="text-center italic">
        {L("¿Qué te deja el día?", "What does the day leave you with?")}{" "}
        <Link href={`/journal?prompt=${encodeURIComponent(daily.dailyAdvice)}`} className="not-italic underline underline-offset-4 hover:no-underline">{L("Escribilo en tu diario", "Write it in your journal")}</Link>
        {!profile && (
          <>{L(<>
            {" "}o{" "}
            <Link href="/onboarding" className="not-italic underline underline-offset-4 hover:no-underline">
              creá tu mapa
            </Link>{" "}
            para sumar tu año personal
          </>, <>{" "}or{" "}<Link href="/onboarding" className="not-italic underline underline-offset-4 hover:no-underline">create your map</Link>{" "}to add your personal year</>)}</>
        )}
        .
      </p>
    </article>
  );
}
