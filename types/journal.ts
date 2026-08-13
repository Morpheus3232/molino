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
    emoji: "🌧️",
    color: "#F87171",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.25)",
  },
  2: {
    label: "Incierto",
    emoji: "⛅",
    color: "#FB923C",
    bg: "rgba(251, 146, 60, 0.12)",
    border: "rgba(251, 146, 60, 0.25)",
  },
  3: {
    label: "En calma",
    emoji: "🌿",
    color: "#34D399",
    bg: "rgba(52, 211, 153, 0.12)",
    border: "rgba(52, 211, 153, 0.25)",
  },
  4: {
    label: "Favorable",
    emoji: "☀️",
    color: "#FBBF24",
    bg: "rgba(251, 191, 36, 0.12)",
    border: "rgba(251, 191, 36, 0.25)",
  },
  5: {
    label: "En sintonía",
    emoji: "✨",
    color: "#A78BFA",
    bg: "rgba(167, 139, 250, 0.12)",
    border: "rgba(167, 139, 250, 0.25)",
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
