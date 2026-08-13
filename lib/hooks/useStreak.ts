"use client";

import { useState, useEffect, useCallback } from "react";

const STREAK_KEY = "molino.visit-streak.v1";

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastVisitDate: string; // YYYY-MM-DD
  totalDaysVisited: number;
}

export interface StreakBadge {
  level: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export const STREAK_BADGES: StreakBadge[] = [
  {
    level: 1,
    title: "Primer Paso",
    description: "Comenzaste a observar tus patrones.",
    emoji: "🌱",
    color: "#34D399",
  },
  {
    level: 3,
    title: "Ritmo Constante",
    description: "3 días consecutivos sintonizando con tu mapa.",
    emoji: "⚡",
    color: "#60A5FA",
  },
  {
    level: 7,
    title: "Consciencia Semanal",
    description: "Una semana completa de observación y claridad.",
    emoji: "🌟",
    color: "#D4A843",
  },
  {
    level: 14,
    title: "Maestro de Sí Mismo",
    description: "14 días integrando tus ciclos y decisiones.",
    emoji: "👑",
    color: "#A78BFA",
  },
  {
    level: 30,
    title: "Transformación Lunar",
    description: "Un mes completo alineado con tus ritmos naturales.",
    emoji: "🔮",
    color: "#F43F5E",
  },
];

export function getBadgeForStreak(streak: number): StreakBadge {
  for (let i = STREAK_BADGES.length - 1; i >= 0; i--) {
    if (streak >= STREAK_BADGES[i].level) {
      return STREAK_BADGES[i];
    }
  }
  return STREAK_BADGES[0];
}

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 1,
    maxStreak: 1,
    lastVisitDate: "",
    totalDaysVisited: 1,
  });

  const recordVisit = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const today = getTodayString();
      const yesterday = getYesterdayString();
      const raw = localStorage.getItem(STREAK_KEY);

      let data: StreakData = {
        currentStreak: 1,
        maxStreak: 1,
        lastVisitDate: today,
        totalDaysVisited: 1,
      };

      if (raw) {
        const parsed = JSON.parse(raw) as StreakData;
        if (parsed.lastVisitDate === today) {
          // Already visited today
          setStreakData(parsed);
          return;
        } else if (parsed.lastVisitDate === yesterday) {
          // Consecutive visit
          const nextStreak = parsed.currentStreak + 1;
          data = {
            currentStreak: nextStreak,
            maxStreak: Math.max(parsed.maxStreak, nextStreak),
            lastVisitDate: today,
            totalDaysVisited: (parsed.totalDaysVisited || 1) + 1,
          };
        } else {
          // Streak broken
          data = {
            currentStreak: 1,
            maxStreak: parsed.maxStreak || 1,
            lastVisitDate: today,
            totalDaysVisited: (parsed.totalDaysVisited || 1) + 1,
          };
        }
      }

      localStorage.setItem(STREAK_KEY, JSON.stringify(data));
      setStreakData(data);
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  const badge = getBadgeForStreak(streakData.currentStreak);

  return {
    streakDays: streakData.currentStreak,
    maxStreak: streakData.maxStreak,
    totalDays: streakData.totalDaysVisited,
    badge,
    recordVisit,
  };
}
