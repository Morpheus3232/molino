"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getDailyNumber, getDailyReflection } from "@/lib/numerology/daily";

const ESTADISTICAS = [
  { valor: "3", label: "SISTEMAS SIMBÓLICOS" },
  { valor: "13", label: "FUENTES BIBLIOGRÁFICAS" },
  { valor: "0", label: "DATOS ALMACENADOS" },
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

  const colBorder = "border-ink/10";
  const cellPad = "p-8 sm:p-10 lg:p-14";

  return (
    <section className="relative min-h-screen flex items-center bg-background pt-16 overflow-hidden">
      <div className="relative mx-auto max-w-8xl w-full px-5 sm:px-8 lg:px-12">
        {/* Header eyebrow — full width */}
        <div className="border-t border-ink/10">
          <div className={`${cellPad} border-b border-ink/10`}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="eyebrow-brutalist"
            >
              NÚMERO DEL DÍA
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="label-micro mt-2"
            >
              UN NÚMERO POR DÍA · UN MAPA PARA CONOCERTE
            </motion.p>
          </div>

          {/* Main content: 2-column grid */}
          <div className="flex flex-wrap">
            {/* Left: Number (signature) — 3/5 */}
            <div className={`w-full lg:w-3/5 ${cellPad} flex flex-col justify-center lg:border-r border-ink/10 border-b lg:border-b-0 border-ink/10`}>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-display text-[clamp(6rem,22vw,28rem)] leading-[0.8] tracking-tight text-foreground"
              >
                {number}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="font-mono text-sm text-muted mt-6 tracking-tight"
              >
                {breakdownStr}
              </motion.p>
            </div>

            {/* Right: Reflection + CTA — 2/5 */}
            <div className={`w-full lg:w-2/5 ${cellPad} flex flex-col justify-between`}>
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-lg md:text-xl text-foreground font-semibold leading-tight mb-4"
                >
                  {reflection.title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  className="text-sm md:text-base text-muted leading-relaxed"
                >
                  {reflection.text}
                </motion.p>
                {reflection.recommendation && (
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="text-sm md:text-base text-muted/80 leading-relaxed mt-5 italic"
                  >
                    {reflection.recommendation}
                  </motion.p>
                )}
              </div>

              <div className="mt-10">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="w-12 h-0.5 bg-accent origin-left mb-5"
                />
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.37 }}
                  className="text-sm text-muted leading-relaxed mb-6 max-w-sm"
                >
                  Cada día tiene un número. Tu fecha de nacimiento revela el tuyo.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="btn-accent inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-bold tracking-wider uppercase"
                >
                  DESCUBRIR MI MAPA →
                </motion.button>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="label-micro mt-4"
                >
                  {dateStr} · NUMEROLOGÍA
                </motion.p>
              </div>
            </div>
          </div>

          {/* Stats bar — full width with border-t */}
          <div className="flex flex-wrap border-t border-ink/10">
            {ESTADISTICAS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className={`flex-1 ${cellPad} ${i < ESTADISTICAS.length - 1 ? "border-r border-ink/10" : ""} border-b sm:border-b-0 border-ink/10`}
              >
                <p className="font-display text-4xl md:text-5xl text-accent leading-none mb-1">{stat.valor}</p>
                <p className="label-micro">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}