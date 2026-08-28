"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UserProfile } from "@/types/user";

/**
 * MATRIX DE CÁLCULO — la cuenta real que genera el mapa, animada.
 *
 * Mientras el mapa se carga mostramos, en vivo y en el orden en que el motor
 * la hace, la suma genuina que produce cada número del retrato.
 *
 * Diseño:
 *  - Fondo ink oscuro con lluvia de código suave en gold (paleta Molino).
 *  - Nube flotante centrada con el cálculo real, línea por línea.
 *  - Cuando la cuenta termina, `onComplete` deja pasar a Mi Mapa.
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
      speed: 0.3 + Math.random() * 0.8,
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
      ctx.fillStyle = "rgba(29, 27, 23, 0.14)";
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
            ? "rgba(245, 176, 34, 0.75)"
            : "rgba(245, 176, 34, 0.20)";
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
        dimmed ? "opacity-30" : "opacity-100"
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
    <div className="relative min-h-screen overflow-hidden bg-ink flex items-center justify-center">
      {/* Lluvia de código */}
      <MatrixRain dimmed={done} />

      {/* Glow difuso detrás de la nube */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-40 blur-3xl pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,176,34,0.18) 0%, rgba(168,58,35,0.08) 45%, transparent 70%)",
        }}
      />

      {/* ── Nube centrada ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-lg mx-4 sm:mx-auto">
        {/* Forma de nube: border-radius orgánico, sin clipPath */}
        <div
          className="relative overflow-hidden border border-ink/10"
          style={{
            borderRadius: "42% 58% 55% 45% / 56% 44% 56% 44%",
            background:
              "linear-gradient(145deg, rgba(247,244,238,0.96) 0%, rgba(239,234,224,0.93) 45%, rgba(241,236,225,0.91) 100%)",
          }}
        >
          {/* Contenido */}
          <div className="p-8 sm:p-10 min-h-[360px]">
            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-2 w-2 rounded-full bg-gold animate-pulse"
                aria-hidden="true"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                Mientras se arma tu mapa…
              </p>
            </div>

            {/* Líneas del cálculo */}
            <div className="space-y-3 font-mono text-sm leading-relaxed">
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
                    className={`transition-all duration-300 ${
                      isHeading
                        ? "text-ink font-bold tracking-[0.2em] text-xs uppercase"
                        : isResult
                          ? "text-accent font-semibold"
                          : "text-muted"
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
              {!done && (
                <span className="inline-block h-4 w-2 bg-gold animate-pulse align-middle" />
              )}
            </div>

            {/* Fórmula */}
            <div className="mt-6 pt-4 border-t border-ink/10">
              <a
                href={FORMULA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
              >
                Ver fórmula en GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="mt-6 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-paper/50">
            {done ? "abriendo tu mapa" : "calculando…"}
          </span>
        </div>
      </div>
    </div>
  );
}
