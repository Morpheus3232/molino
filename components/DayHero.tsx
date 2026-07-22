"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getZodiacSign, getMoonPhase, getPlanetaryPositions } from "@/lib/engines/astrologyEngine";

interface DayHeroProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

export default function DayHero({ birthDay, birthMonth, birthYear }: DayHeroProps) {
  const today = useMemo(() => new Date(), []);
  const zodiacSign = useMemo(() => getZodiacSign(birthDay, birthMonth), [birthDay, birthMonth]);
  const moon = useMemo(() => getMoonPhase(today), [today]);
  const planets = useMemo(() => getPlanetaryPositions(today), [today]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
    >
      <div className="bg-gradient-to-br from-foreground to-card px-5 py-5 text-background">
        <p className="text-xs font-medium uppercase tracking-widest opacity-70">Energía del cosmos</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {planets.map((planet) => (
            <div key={planet.name} className="rounded-xl bg-white/10 p-2.5 text-center backdrop-blur-sm">
              <p className="text-xl">{planet.emoji}</p>
              <p className="text-[11px] font-medium text-white/90">{planet.name}</p>
              <p className="text-[10px] text-white/70">{planet.sign}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">♋</span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted">Signo</p>
              <p className="text-sm font-semibold text-foreground">{zodiacSign}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">{moon.emoji}</span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted">Luna</p>
              <p className="text-sm font-semibold text-foreground">{moon.phase}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted mt-3 leading-relaxed">{moon.description}</p>
      </div>
    </motion.div>
  );
}
