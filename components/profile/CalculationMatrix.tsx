"use client";

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

const SUN_SIGN_RANGES: Record<string, [string, string]> = {
  Aries: ["21 mar", "19 abr"],
  Tauro: ["20 abr", "20 may"],
  Géminis: ["21 may", "20 jun"],
  Cáncer: ["21 jun", "22 jul"],
  Leo: ["23 jul", "22 ago"],
  Virgo: ["23 ago", "22 sep"],
  Libra: ["23 sep", "22 oct"],
  Escorpio: ["23 oct", "21 nov"],
  Sagitario: ["22 nov", "21 dic"],
  Capricornio: ["22 dic", "19 ene"],
  Acuario: ["20 ene", "18 feb"],
  Piscis: ["19 feb", "20 mar"],
};

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
  const reduceMotion = useSafeReducedMotion();

  const birthDate = profile?.birthDate || "1990-04-18";
  const lifePath = (profile?.lifePath as number) || 5;
  const sunSign = profile?.sunSign || "Aries";
  const animal = profile?.chineseZodiac || "Caballo";
  const element =
    profile?.chineseZodiacInfo?.element || profile?.element || "Metal";
  const birthYear = birthDate.slice(0, 4);

  const steps = useMemo(() => buildLifePathSteps(birthDate), [birthDate]);
  const sunRange = SUN_SIGN_RANGES[sunSign];

  const rows = useMemo<CalcRow[]>(() => {
    const r: CalcRow[] = [];
    steps.forEach((s) => {
      r.push({ label: s.label, value: String(s.result) });
    });
    r.push({
      label: "Camino de Vida",
      value: steps[steps.length - 1].master ? `${lifePath} · maestro` : String(lifePath),
      result: true,
      system: "Numerología",
    });
    r.push({
      label: sunRange ? `${sunRange[0]} → ${sunRange[1]}` : "Rango solar",
      value: sunSign,
      result: true,
      system: "Astrología",
    });
    r.push({
      label: `Año ${birthYear}`,
      value: `${animal} · ${element}`,
      result: true,
      system: "Zodíaco chino",
    });
    return r;
  }, [steps, lifePath, sunRange, sunSign, animal, element, birthYear]);

  // Con motion reducido se muestra la cuenta completa de una: la animación es
  // legibilidad, nunca información — nadie se pierde nada al saltearla.
  const [count, setCount] = useState(() => (reduceMotion ? rows.length : 0));

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
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          La cuenta
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[0.95] tracking-tight text-foreground uppercase">
          Antes de interpretar
          <br />
          nada, la aritmética.
        </h1>
        <p className="mt-5 text-sm text-muted leading-relaxed max-w-md">
          Tres sistemas, una sola fecha. Cada número de tu mapa sale de esta cuenta
          — se puede rehacer a mano.
        </p>

        <div
          className="mt-10 border-t border-ink/10"
          role="status"
          aria-live="polite"
          aria-label={done ? "Cálculo completo" : "Calculando tu mapa"}
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30 hidden sm:inline">
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

        <div className="mt-6 flex items-center justify-between gap-4">
          <a
            href={FORMULA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wide text-accent hover:underline underline-offset-4"
          >
            Ver la fórmula en GitHub →
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {done ? "Abriendo tu mapa" : "Calculando"}
          </span>
        </div>
      </div>
    </div>
  );
}
