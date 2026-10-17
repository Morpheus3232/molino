export type JournalMood = 1 | 2 | 3 | 4 | 5;

export interface JournalCycleContext {
  yearCycle?: {
    year?: number;
    animal?: string;
    personalYear?: number;
    label?: string;
    yearTheme?: string;
  };
  monthCycle?: {
    personalMonth?: number;
    monthName?: string;
  };
  dayEnergy?: {
    personalDay?: number;
    theme?: string;
    moonPhase?: string;
    overallScore?: number;
  };
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: JournalMood;
  tags: string[];
  cycleContext: JournalCycleContext;
  createdAt: string; // ISO timestamp
  updatedAt?: string;
}

export interface JournalFilter {
  tag?: string | null;
  mood?: JournalMood | null;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export const MOOD_CONFIG: Record<
  JournalMood,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  1: {
    label: "Desafiante",
    emoji: "🌧",
    color: "#9B9B9B",
    bg: "rgba(132,132,132, 0.12)",
    border: "rgba(132,132,132, 0.25)",
  },
  2: {
    label: "Incierto",
    emoji: "⛅",
    color: "#ACACAC",
    bg: "rgba(172,172,172, 0.12)",
    border: "rgba(172,172,172, 0.25)",
  },
  3: {
    label: "En calma",
    emoji: "🌿",
    color: "#BBBBBB",
    bg: "rgba(187,187,187, 0.12)",
    border: "rgba(187,187,187, 0.25)",
  },
  4: {
    label: "Favorable",
    emoji: "☀",
    color: "#C8C8C8",
    bg: "rgba(200,200,200, 0.12)",
    border: "rgba(200,200,200, 0.25)",
  },
  5: {
    label: "En sintonía",
    emoji: "✨",
    color: "#9D9D9D",
    bg: "rgba(157,157,157, 0.12)",
    border: "rgba(157,157,157, 0.25)",
  },
};

export const QUICK_TAGS = [
  "Trabajo",
  "Relaciones",
  "Salud",
  "Decisiones",
  "Creatividad",
  "Introspección",
  "Finanzas",
  "Descanso",
] as const;
