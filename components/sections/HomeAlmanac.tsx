"use client";

import { useEffect, useState } from "react";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";

/**
 * Cabecera de la portada: la fecha de hoy como título de una hoja de
 * almanaque. Se calcula en el cliente porque "hoy" depende de la zona
 * horaria de quien mira; el servidor no la conoce.
 */
export default function HomeAlmanac() {
  const [today, setToday] = useState<Date | null>(null);
  const [hasMap, setHasMap] = useState(false);
  useEffect(() => {
    setToday(new Date());
    setHasMap(Boolean(getOrCreateProfile()?.birthDate));
  }, []);

  const weekday = today?.toLocaleDateString("es-AR", { weekday: "long" });
  const month = today?.toLocaleDateString("es-AR", { month: "long" });

  return (
    <header className="mb-8 sm:mb-10">
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
        Almanaque de Molino
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        {today && <span>{today.getFullYear()}</span>}
      </p>

      <h2
        id="hoy-home"
        className="mt-5 font-display font-normal normal-case tracking-tight text-ink leading-[0.95] text-[clamp(2.75rem,7vw,5rem)] min-h-[1.9em] md:min-h-[1em]"
      >
        {today ? (
          <>
            <span className="first-letter:uppercase inline-block">{weekday}</span>{" "}
            <em className="text-gradient-warm">{today.getDate()}</em>
            <span className="block md:inline text-muted/70"> de {month}.</span>
          </>
        ) : (
          <span className="sr-only">Hoy</span>
        )}
      </h2>

      <p className="mt-5 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
        {hasMap
          ? "Lo que trae el día según los números y la luna, cruzado con tu mapa."
          : "Lo que trae el día según los números y la luna. Es el mismo para todos hasta que sumás tu fecha de nacimiento."}
      </p>
    </header>
  );
}
