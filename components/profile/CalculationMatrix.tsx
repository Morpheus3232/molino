"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UserProfile } from "@/types/user";

/**
 * MATRIX DE CÁLCULO — la cuenta real que genera el mapa, animada.
 *
 * Mientras el mapa se carga mostramos, en vivo y en el orden en que el motor
 * la hace, la suma genuina que produce cada número del retrato. No es una
 * reproducción decorativa: son los mismos pasos que corren
 * profileBuilder → numerologyEngine / astrologyEngine / chineseZodiacEngine.
 *
 * Diseño:
 *  - Fondo: lluvia de código (canvas), sutil, como un terminal de Matrix.
 *  - Contenido fijo por encima, arriba a la derecha: el cálculo real,
 *    bien explicado, línea por línea.
 *  - Cuando la cuenta termina, `onComplete` deja pasar a Mi Mapa.
 */

// ──────────────────────────────────────────────────────────────────────────
// Cálculo genuino (mismo algoritmo que calculateLifePath)
// ──────────────────────────────────────────────────────────────────────────
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

/** Caracteres de la lluvia: katakana + dígitos para el efecto Matrix. */
const RAIN_CHARS =
  "アィウエオカキクケコサシスセソタチツテトナニヌネノ0123456789$#&*+";

interface Column {
  y: number;
  speed: number;
  chars: string[];
}

function makeColumns(width: number): Column[] {
  const fontSize = 16;
  const count = Math.ceil(width / fontSize);
  return Array.from({ length: count }, () => {
    const len = 8 + Math.floor(Math.random() * 14);
    return {
      y: Math.random() * -120,
      speed: 0.4 + Math.random() * 1.1,
      chars: Array.from({ length: len }, () =>
        RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]
      ),
    };
  });
}

function MatrixRain({ dimmed }: { dimmed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fontSize = 16;

    let raf = 0;
    let columns: Column[] = [];

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = makeColumns(clientWidth);
    };
    resize();

    const draw = () => {
      ctx.fillStyle = "rgba(7, 12, 14, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      for (let ci = 0; ci < columns.length; ci++) {
        const col = columns[ci];
        const x = ci * fontSize;
        col.y += col.speed;
        for (let i = 0; i < col.chars.length; i++) {
          const y = (col.y - i * fontSize) % (canvas.height / dpr || 1);
          if (y < 0) continue;
          const isHead = i === 0;
          ctx.fillStyle = isHead
            ? "rgba(180, 255, 220, 0.85)"
            : "rgba(46, 200, 120, 0.32)";
          ctx.fillText(col.chars[i], x, y);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
        dimmed ? "opacity-40" : "opacity-100"
      }`}
      aria-hidden="true"
    />
  );
}

export default function CalculationMatrix({
  profile,
  onComplete,
}: {
  profile: UserProfile | null;
  onComplete?: () => void;
}) {
  const birthDate = profile?.birthDate || "1990-04-18";
  const lifePath = (profile?.lifePath as number) || 5;
  const sunSign = profile?.sunSign || "Aries";
  const animal = profile?.chineseZodiac || "Caballo";
  const element =
    profile?.chineseZodiacInfo?.element || profile?.element || "Metal";
  const birthYear = birthDate.slice(0, 4);

  const steps = useMemo(() => buildLifePathSteps(birthDate), [birthDate]);
  const sunRange = SUN_SIGN_RANGES[sunSign];

  // Líneas de la cuenta en orden, para revelarlas una a una.
  const lines = useMemo(() => {
    const l: string[] = [];
    l.push("CALCULANDO TU MAPA…");
    l.push(`Fecha: ${birthDate}`);
    steps.forEach((s, i) => {
      l.push(`${i + 1}. ${s.label} = ${s.result}`);
    });
    l.push(`Camino de Vida: ${lifePath}`);
    l.push(`Sol: ${sunRange ? sunRange.join(" → ") : sunSign}`);
    l.push(`→ ${sunSign}`);
    l.push(`${birthYear} → ${animal}`);
    l.push(`Elemento: ${element}`);
    return l;
  }, [birthDate, steps, lifePath, sunRange, sunSign, animal, element, birthYear]);

  // Revelado secuencial de líneas, como si el terminal las fuera escribiendo.
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= lines.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 260);
    return () => clearTimeout(t);
  }, [count, lines.length]);

  const done = count >= lines.length;

  useEffect(() => {
    if (!done || !onComplete) return;
    const t = setTimeout(onComplete, 700);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070c0e] text-[#cde8d9]">
      <MatrixRain dimmed={done} />

      {/* Contenido fijo por encima, arriba a la derecha */}
      <div className="relative z-10 mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-24">
        <div className="flex justify-end">
          <div className="w-full max-w-sm sm:max-w-md rounded-[--radius-lg] border border-emerald-400/20 bg-[#07110c]/70 backdrop-blur-sm p-6 shadow-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/70 mb-5">
              Mientras se arma tu mapa…
            </p>

            <div className="space-y-3 font-mono text-[13px] leading-relaxed">
              {lines.slice(0, count).map((line, i) => {
                const isHeading = i === 0;
                const isResult =
                  line.startsWith("Camino") ||
                  line.startsWith("→") ||
                  line.endsWith("→") ||
                  line.includes("Elemento");
                return (
                  <p
                    key={i}
                    className={`${
                      isHeading
                        ? "text-emerald-200 font-bold tracking-[0.2em] text-xs uppercase"
                        : isResult
                          ? "text-emerald-300"
                          : "text-[#cdffDD]/80"
                    }`}
                    style={{ textShadow: "0 0 8px rgba(80,255,160,0.25)" }}
                  >
                    {line}
                  </p>
                );
              })}
              {!done && (
                <span className="inline-block h-4 w-2 bg-emerald-300/80 animate-pulse align-middle" />
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-400/15">
              <a
                href={FORMULA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-emerald-300/70 hover:text-emerald-200 transition-colors"
              >
                Ver fórmula en GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Estado mientras termina */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-300/50">
            {done ? "abriendo tu mapa" : "calculando…"}
          </span>
        </div>
      </div>
    </div>
  );
}
