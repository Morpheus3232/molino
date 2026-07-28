"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getDailyNumber, getDailyReflection } from "@/lib/numerology/daily";

const ESTADISTICAS = [
  { valor: "3", label: "Sistemas simbólicos" },
  { valor: "13", label: "Fuentes bibliográficas" },
  { valor: "0", label: "Registros necesarios" },
];

const CONSTELLATION = [
  { type: "line", x1: 12, y1: 28, x2: 25, y2: 15 },
  { type: "line", x1: 25, y1: 15, x2: 40, y2: 20 },
  { type: "line", x1: 40, y1: 20, x2: 52, y2: 12 },
  { type: "line", x1: 12, y1: 28, x2: 22, y2: 42 },
  { type: "line", x1: 22, y1: 42, x2: 38, y2: 48 },
  { type: "line", x1: 38, y1: 48, x2: 50, y2: 40 },
  { type: "line", x1: 50, y1: 40, x2: 48, y2: 28 },
  { type: "line", x1: 40, y1: 20, x2: 48, y2: 28 },
  { type: "line", x1: 25, y1: 15, x2: 22, y2: 42 },
  { type: "line", x1: 52, y1: 12, x2: 62, y2: 22 },
  { type: "line", x1: 62, y1: 22, x2: 58, y2: 35 },
  { type: "line", x1: 58, y1: 35, x2: 50, y2: 40 },
  { type: "line", x1: 62, y1: 22, x2: 75, y2: 16 },
  { type: "line", x1: 38, y1: 48, x2: 46, y2: 58 },
  { type: "line", x1: 46, y1: 58, x2: 30, y2: 65 },
  { type: "line", x1: 22, y1: 42, x2: 18, y2: 55 },
  { type: "circle", cx: 12, cy: 28, r: 0.35 },
  { type: "circle", cx: 25, cy: 15, r: 0.4 },
  { type: "circle", cx: 40, cy: 20, r: 0.3 },
  { type: "circle", cx: 52, cy: 12, r: 0.45 },
  { type: "circle", cx: 22, cy: 42, r: 0.35 },
  { type: "circle", cx: 38, cy: 48, r: 0.4 },
  { type: "circle", cx: 50, cy: 40, r: 0.3 },
  { type: "circle", cx: 48, cy: 28, r: 0.5 },
  { type: "circle", cx: 62, cy: 22, r: 0.35 },
  { type: "circle", cx: 58, cy: 35, r: 0.3 },
  { type: "circle", cx: 75, cy: 16, r: 0.4 },
  { type: "circle", cx: 46, cy: 58, r: 0.35 },
  { type: "circle", cx: 30, cy: 65, r: 0.3 },
  { type: "circle", cx: 18, cy: 55, r: 0.35 },
];

export default function HeroNew() {
  const router = useRouter();
  const today = new Date();
  const number = getDailyNumber(today);
  const reflection = getDailyReflection(number, today);

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = String(today.getFullYear());
  const allDigits = (dd + mm + yyyy).split("").map(Number);
  const rawSum = allDigits.reduce((a, b) => a + b, 0);
  const breakdownStr = allDigits.join(" + ") + " = " + rawSum + (rawSum !== number ? " → " + number : "");

  const dateStr = today
    .toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, ".");

  const colBorder = "border-accent/10";
  const cellPad = "p-8 sm:p-10 lg:p-12";

  return (
    <section className="relative min-h-screen flex items-center bg-white pt-20 overflow-hidden">
      <div className="relative mx-auto max-w-8xl w-full px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap border-t border-accent/10">
          <div className={`w-full lg:w-2/5 ${cellPad} flex flex-col justify-between lg:border-r ${colBorder} border-b ${colBorder} relative`}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                <g stroke="currentColor" strokeWidth="0.06" fill="none" className="text-accent">
                  {CONSTELLATION.filter(e => e.type === "line").map((e, i) => (
                    <line key={`l${i}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                  ))}
                </g>
                <g fill="currentColor" className="text-accent">
                  {CONSTELLATION.filter(e => e.type === "circle").map((e, i) => (
                    <circle key={`c${i}`} cx={e.cx} cy={e.cy} r={e.r} />
                  ))}
                </g>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent" aria-hidden="true">
                  <path d="M12 2v20" />
                  <path d="M12 6c-4 0-6 2-6 6 4 0 6-2 6-6z" />
                  <path d="M12 6c4 0 6 2 6 6-4 0-6-2-6-6z" />
                  <path d="M12 18c-4 0-6-2-6-6 4 0 6 2 6 6z" />
                  <path d="M12 18c4 0 6-2 6-6-4 0-6 2-6 6z" />
                </svg>
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-mono text-sm text-accent tracking-widest"
                >
                  NÚMERO DEL DÍA
                </motion.span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-bold text-[clamp(7rem,28vw,30rem)] leading-[0.7] tracking-tight text-foreground"
              >
                {number}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="font-mono text-sm text-muted/70 mt-4 tracking-tight"
              >
                {breakdownStr}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-lg md:text-xl text-muted mt-3 max-w-sm"
              >
                {reflection.title}
              </motion.p>
            </div>
          </div>

          <div className={`w-full lg:w-2/5 ${cellPad} flex flex-col justify-between lg:border-r ${colBorder} border-b ${colBorder}`}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-base md:text-lg text-foreground/80 leading-relaxed"
              >
                {reflection.text}
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="w-12 h-0.5 bg-accent mt-6 origin-left"
              />
            </div>
            <div className="mt-8">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                type="button"
                onClick={() => router.push("/onboarding")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-none hover:bg-accent/90 transition-colors"
              >
                Descubrir mi mapa →
              </motion.button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-xs text-muted mt-4 font-mono tracking-wider"
              >
                {dateStr} · Numerología
              </motion.p>
            </div>
          </div>

          <div className={`w-full lg:w-1/5 ${cellPad} flex flex-col justify-center gap-8 border-b ${colBorder}`}>
            {ESTADISTICAS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-accent leading-none mb-1">{stat.valor}</p>
                <p className="text-xs text-muted font-mono tracking-wide leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
