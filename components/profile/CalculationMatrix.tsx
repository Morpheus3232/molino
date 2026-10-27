"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

/**
 * LA CUENTA — la aritmética real que produce el mapa, revelada línea por línea.
 *
 * Es el primer momento del producto: antes de mostrar una sola interpretación,
 * Molino muestra la cuenta. Eso es la promesa de transparencia hecha gesto, no
 * copy.
 *
 * Rediseño (Fase 4). La versión anterior era el elemento más fuera de norma de
 * todo el producto: canvas de "lluvia de código" estilo Matrix, glow radial con
 * blur-3xl, fondo ink a pantalla completa y una tarjeta con `border-radius`
 * orgánico ("blob") + `overflow-hidden` que RECORTABA el texto — el encabezado
 * se leía "ENTRAS SE ARMA TU MAPA" y el enlace de la fórmula quedaba cortado.
 * Todo eso contradecía el estándar del sistema (nítido, editorial, silencioso)
 * y la regla explícita de no usar partículas decorativas, blur ni gradientes.
 *
 * Ahora: papel, hairlines, mono. La cuenta se lee como un comprobante. Sin
 * canvas, sin glow, sin blob. Y dura la mitad: la computación es síncrona e
 * instantánea, así que cada ms de más era espera inventada.
 */

interface LifePathStep {
  label: string;
  result: number;
  master?: boolean;
}

function buildLifePathSteps(birthDate: string): LifePathStep[] {
  const digits = birthDate.replace(/-/g, "");
  const steps: LifePathStep[] = [];
  let sum = digits.split("").reduce((acc, c) => acc + Number(c), 0);
  steps.push({ label: digits.split("").join("+"), result: sum });

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const s = String(sum);
    const next = s.split("").reduce((acc, c) => acc + Number(c), 0);
    steps.push({ label: s.split("").join("+"), result: next });
    sum = next;
  }

  if (sum === 11 || sum === 22 || sum === 33) {
    steps[steps.length - 1].master = true;
  }

  return steps;
}

const SUN_SIGN_RANGES = (L: Pick2): Record<string, [string, string]> => ({
  Aries: [L("21 mar", "Mar 21"), L("19 abr", "Apr 19")],
  Tauro: [L("20 abr", "Apr 20"), L("20 may", "May 20")],
  Géminis: [L("21 may", "May 21"), L("20 jun", "Jun 20")],
  Cáncer: [L("21 jun", "Jun 21"), L("22 jul", "Jul 22")],
  Leo: [L("23 jul", "Jul 23"), L("22 ago", "Aug 22")],
  Virgo: [L("23 ago", "Aug 23"), L("22 sep", "Sep 22")],
  Libra: [L("23 sep", "Sep 23"), L("22 oct", "Oct 22")],
  Escorpio: [L("23 oct", "Oct 23"), L("21 nov", "Nov 21")],
  Sagitario: [L("22 nov", "Nov 22"), L("21 dic", "Dec 21")],
  Capricornio: [L("22 dic", "Dec 22"), L("19 ene", "Jan 19")],
  Acuario: [L("20 ene", "Jan 20"), L("18 feb", "Feb 18")],
  Piscis: [L("19 feb", "Feb 19"), L("20 mar", "Mar 20")],
});

const FORMULA_URL =
  "https://github.com/search?q=path%3Alib%2Fengines%2FnumerologyEngine.ts&type=code";

/** Una fila de la cuenta: etiqueta a la izquierda, valor a la derecha. */
interface CalcRow {
  label: string;
  value: string;
  /** Resultado de un sistema (se resalta), vs. paso intermedio. */
  result?: boolean;
  system?: string;
}

// La computación real es síncrona: estos tiempos son solo legibilidad, no
// espera. 110ms alcanza para leer una fila corta sin que se sienta lento.
const ROW_MS = 110;
const TAIL_MS = 320;

export default function CalculationMatrix({
  profile,
  onComplete,
}: {
  profile: UserProfile | null;
  onComplete?: () => void;
}) {
  const L = useL();
  const reduceMotion = useSafeReducedMotion();

  const birthDate = profile?.birthDate || "1990-04-18";
  const lifePath = (profile?.lifePath as number) || 5;
  const sunSign = profile?.sunSign || "Aries";
  const animal = profile?.chineseZodiac || "Caballo";
  const element =
    profile?.chineseZodiacInfo?.element || profile?.element || "Metal";
  const birthYear = birthDate.slice(0, 4);

  const steps = useMemo(() => buildLifePathSteps(birthDate), [birthDate]);
  const sunRange = SUN_SIGN_RANGES(L)[sunSign];

  const rows = useMemo<CalcRow[]>(() => {
    const r: CalcRow[] = [];
    steps.forEach((s) => {
      r.push({ label: s.label, value: String(s.result) });
    });
    r.push({
      label: L("Camino de Vida", "Life Path"),
      value: steps[steps.length - 1].master ? `${lifePath} · maestro` : String(lifePath),
      result: true,
      system: "Numerología",
    });
    r.push({
      label: sunRange ? `${sunRange[0]} → ${sunRange[1]}` : L("Rango solar", "Solar range"),
      value: sunSign,
      result: true,
      system: "Astrología",
    });
    r.push({
      label: L(`Año ${birthYear}`, `Year ${birthYear}`),
      value: `${animal} · ${element}`,
      result: true,
      system: L("Zodíaco chino", "Chinese zodiac"),
    });
    return r;
  }, [steps, lifePath, sunRange, sunSign, animal, element, birthYear]);

  // Con motion reducido se muestra la cuenta completa de una: la animación es
  // legibilidad, nunca información — nadie se pierde nada al saltearla.
  const [count, setCount] = useState(() => (reduceMotion ? rows.length : 0));

  // Si reduceMotion cambia a true después del primer render, avanzar
  // inmediatamente al final para que onComplete se dispare y no quede
  // colgado en "Calculando".
  useEffect(() => {
    if (reduceMotion) {
      setCount(rows.length);
    }
  }, [reduceMotion, rows.length]);

  useEffect(() => {
    if (reduceMotion || count >= rows.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), ROW_MS);
    return () => clearTimeout(t);
  }, [count, rows.length, reduceMotion]);

  const done = count >= rows.length;

  useEffect(() => {
    if (!done || !onComplete) return;
    const t = setTimeout(onComplete, reduceMotion ? 0 : TAIL_MS);
    return () => clearTimeout(t);
  }, [done, onComplete, reduceMotion]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-xl">
        <p className="text-sm text-accent label-caps">{L("La cuenta", "The math")}</p>
        <h1 className="page-title mt-3 text-foreground">{L(<>
          Antes de interpretar
          <br />
          nada, la aritmética.
        </>, <>Before interpreting<br />anything, the arithmetic.</>)}</h1>
        <p className="mt-5 text-sm text-muted leading-relaxed max-w-md">{L("Tres sistemas, una sola fecha. Cada número de tu mapa sale de esta cuenta — se puede rehacer a mano.", "Three systems, a single date. Every number in your map comes from this math — you can redo it by hand.")}</p>

        <div
          className="mt-10 border-t border-ink/10"
          role="status"
          aria-live="polite"
          aria-label={done ? L("Cálculo completo", "Full calculation") : L("Calculando tu mapa", "Calculating your map")}
        >
          {rows.slice(0, count).map((row, i) => (
            <div
              key={`${row.label}-${i}`}
              className="flex items-baseline justify-between gap-4 py-3 border-b border-ink/10"
            >
              <span className="font-mono text-xs sm:text-sm text-muted tabular-nums truncate">
                {row.label}
              </span>
              <span className="flex items-baseline gap-3 shrink-0">
                {row.system && (
                  <span className="text-sm text-ink/30 hidden sm:inline label-caps">
                    {row.system}
                  </span>
                )}
                <span
                  className={
                    row.result
                      ? "font-heading text-base sm:text-lg font-bold text-accent"
                      : "font-mono text-xs sm:text-sm text-foreground tabular-nums"
                  }
                >
                  {row.value}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">{L(<>
          <a
            href={FORMULA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline underline-offset-4 label-caps"
          >
            Ver la fórmula en GitHub →
          </a>
          <span className="text-sm text-muted label-caps">
            {done ? "Abriendo tu mapa" : "Calculando"}
          </span>
        </>, <><a href={FORMULA_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline underline-offset-4 label-caps">See the formula on GitHub →</a><span className="text-sm text-muted label-caps">{done ? "Opening your map" : "Calculating"}</span></>)}</div>
      </div>
    </div>
  );
}
