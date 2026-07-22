"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ENERGY_TYPES } from "@/lib/data";
import { getPersonalDay } from "@/lib/engines/dateEngine";
import { getZodiacSign, getMoonPhase, getPlanetaryPositions } from "@/lib/engines/astrologyEngine";

interface DailyCardProps {
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  energyNumber?: number;
}

export default function DailyCard({ birthDay, birthMonth, birthYear, energyNumber }: DailyCardProps) {
  const personalDay = energyNumber ?? getPersonalDay(birthDay!, birthMonth!, birthYear!);
  const energy = ENERGY_TYPES[personalDay] || ENERGY_TYPES[7];
  const insights = energy.insights || [];
  const insight = insights[Math.floor(Math.random() * insights.length)];

  const today = useMemo(() => new Date(), []);
  const userZodiac = birthDay && birthMonth ? useMemo(() => getZodiacSign(birthDay, birthMonth), [birthDay, birthMonth]) : null;
  const moon = useMemo(() => getMoonPhase(today), [today]);
  const planets = useMemo(() => getPlanetaryPositions(today), [today]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: energy.color }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: `${energy.color}25` }}
          >
            {energy.icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Energía de hoy
          </p>
          <h2 className="font-serif text-xl font-semibold text-foreground">{energy.name}</h2>
          <p className="mt-1 text-sm text-muted leading-relaxed">{insight}</p>

          {userZodiac && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-xl bg-background p-2 text-center">
                <p className="text-[10px] text-muted mb-0.5">Signo</p>
                <p className="text-xs font-semibold text-foreground">♋ {userZodiac}</p>
              </div>
              <div className="rounded-xl bg-background p-2 text-center">
                <p className="text-[10px] text-muted mb-0.5">Luna</p>
                <p className="text-xs font-semibold text-foreground">
                  {moon.emoji} {moon.phase}
                </p>
              </div>
              <div className="rounded-xl bg-background p-2 text-center">
                <p className="text-[10px] text-muted mb-0.5">Planeta</p>
                <p className="text-xs font-semibold text-foreground">
                  {planets[0]?.emoji} {planets[0]?.sign.split(" ")[0]}
                </p>
              </div>
            </div>
          )}

          <p className="text-[11px] text-muted mt-2">{moon.description}</p>
        </div>
      </div>
    </div>
  );
}
