"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { Eyebrow } from "@/components/sections/HomeOrnaments";

/**
 * Cabecera del día en la portada: la fecha de hoy como título de una hoja
 * de almanaque. La ilustración del Quijote y Sancho entre molinos ya no va
 * acá: es la apertura animada de arriba (HomeOpening). La fecha se
 * calcula en el cliente porque "hoy" depende de la zona horaria de quien
 * mira; el servidor no la conoce.
 */
export default function HomeAlmanac() {
  const L = useL();
  const [today, setToday] = useState<Date | null>(null);
  const [hasMap, setHasMap] = useState(false);
  useEffect(() => {
    setToday(new Date());
    setHasMap(Boolean(getOrCreateProfile()?.birthDate));
  }, []);

  const weekday = today?.toLocaleDateString("es-AR", { weekday: "long" });
  const month = today?.toLocaleDateString("es-AR", { month: "long" });

  return (
    <header className="mb-8 sm:mb-10 text-center">
      <Eyebrow>
        {L("Almanaque de Molino", "Molino's Almanac")}{today && <> · {today.getFullYear()}</>}
      </Eyebrow>

      <div className="mt-5">
        <div className="flex-1 min-w-0">
          <h2
            id="hoy-home"
            className="scroll-mt-28 font-display font-normal normal-case tracking-tight text-ink leading-[0.95] text-[clamp(2.75rem,6vw,4.5rem)] min-h-[1.9em] md:min-h-[1em] text-balance"
          >
            {today ? (
              <>{L(<>
                <span className="first-letter:uppercase inline-block">
                  {weekday}
                </span>{" "}
                <em className="text-gradient-warm">{today.getDate()}</em>
                <span className="text-muted/70"> de {month}.</span>
              </>, <><span className="first-letter:uppercase inline-block">{weekday}</span>{" "}<span className="text-muted/70">{month}</span>{" "}<em className="text-gradient-warm">{today.getDate()}</em><span className="text-muted/70">.</span></>)}</>
            ) : (
              <span className="sr-only">{L("Hoy", "Today")}</span>
            )}
          </h2>

          <p className="mt-5 mx-auto max-w-xl text-base sm:text-lg text-muted leading-relaxed">
            {hasMap
              ? L("Lo que trae el día según los números y la luna, cruzado con tu mapa.", "What the day brings according to the numbers and the moon, crossed with your map.")
              : L("Lo que trae el día según los números y la luna. Es el mismo para todos hasta que sumás tu fecha de nacimiento.", "What the day brings according to the numbers and the moon. It's the same for everyone until you add your date of birth.")}
          </p>
        </div>

      </div>
    </header>
  );
}
