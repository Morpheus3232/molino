import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak, getBadgeForStreak } from "@/lib/hooks/useStreak";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import DailyFocus, { MomentAdvice } from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

describe("Daily Energy & Retention System", () => {
  const profile = calculateUserProfile("Franco", "1990-04-18");

  it("calculates streak badge levels correctly", () => {
    expect(getBadgeForStreak(1).title).toBe("Primer Paso");
    expect(getBadgeForStreak(3).title).toBe("Ritmo Constante");
    expect(getBadgeForStreak(7).title).toBe("Consciencia Semanal");
    expect(getBadgeForStreak(14).title).toBe("Maestro de Sí Mismo");
    expect(getBadgeForStreak(30).title).toBe("Transformación Lunar");
  });

  it("renders DailyEnergyCard with score, theme, and streak", () => {
    // Generate daily object
    const mockDaily = {
      date: "2026-08-14",
      overallScore: 84,
      theme: "Iniciación",
      description: "Un día para comenzar algo nuevo.",
      strengths: ["Iniciativa", "Claridad"],
      cautions: ["Impaciencia"],
      areas: {
        work: { score: 85, label: "Muy favorable" },
        relationships: { score: 70, label: "Favorable" },
        creativity: { score: 80, label: "Muy favorable" },
        decisions: { score: 75, label: "Favorable" },
      },
      moonPhase: { phase: "Creciente", emoji: "🌓", description: "Expansión" },
      personalDay: 1,
      personalYear: 7,
      personalMonth: 3,
      elementInfluence: "Fuego en sintonía",
      explanation: "Día de inicio y claridad.",
      isPersonalized: true,
      focusAction: "Tomar la iniciativa en proyectos postergados.",
      avoidAction: "La impaciencia con el ritmo de los demás.",
      dailyAdvice: "Aprovechá la claridad de hoy.",
      orientationEvidence: [],
      nextDaysForecast: [
        {
          date: "2026-08-15",
          dayName: "Sábado",
          dayNumber: 15,
          personalDay: 2,
          theme: "Cooperación",
          score: 75,
          moonEmoji: "🌔",
        },
      ],
    };

    render(
      <DailyEnergyCard
        profile={profile}
        daily={mockDaily}
        streakDays={5}
        streakBadge={getBadgeForStreak(5)}
      />
    );

    // Desde 2822171 la card ya no muestra el bloque de score/nivel ("Alta");
    // el streak se presenta como "Día N conociéndote".
    expect(screen.getByText(/Energía de Iniciación/i)).toBeDefined();
    expect(screen.getByText(/Día 5 conociéndote/i)).toBeDefined();
  });

  it("renders DailyFocus with focus, avoid, and Journal CTA", () => {
    const mockDaily = {
      date: "2026-08-14",
      overallScore: 84,
      theme: "Iniciación",
      description: "Un día para comenzar algo nuevo.",
      strengths: [],
      cautions: [],
      areas: {
        work: { score: 80, label: "Favorable" },
        relationships: { score: 80, label: "Favorable" },
        creativity: { score: 80, label: "Favorable" },
        decisions: { score: 80, label: "Favorable" },
      },
      moonPhase: { phase: "Creciente", emoji: "🌓", description: "Expansión" },
      personalDay: 1,
      personalYear: 7,
      personalMonth: 3,
      elementInfluence: "Fuego",
      explanation: "Día de inicio.",
      isPersonalized: true,
      focusAction: "Tomar la iniciativa en proyectos postergados.",
      avoidAction: "La impaciencia con el ritmo de los demás.",
      dailyAdvice: "Aprovechá la claridad de hoy.",
      orientationEvidence: [],
      nextDaysForecast: [],
    };

    render(<DailyFocus daily={mockDaily} />);

    expect(screen.getByText(/Favorable hoy/i)).toBeDefined();
    expect(screen.getByText(/Tomar la iniciativa en proyectos postergados/i)).toBeDefined();
    expect(screen.getByText(/Observar hoy/i)).toBeDefined();
    expect(screen.getByText(/La impaciencia con el ritmo de los demás/i)).toBeDefined();
  });

  it("renders MomentAdvice (extraído de DailyFocus en Fase 6A) with Consejo del Momento and Journal CTA", () => {
    const mockDaily = {
      date: "2026-08-14",
      overallScore: 84,
      theme: "Iniciación",
      description: "Un día para comenzar algo nuevo.",
      strengths: [],
      cautions: [],
      areas: {
        work: { score: 80, label: "Favorable" },
        relationships: { score: 80, label: "Favorable" },
        creativity: { score: 80, label: "Favorable" },
        decisions: { score: 80, label: "Favorable" },
      },
      moonPhase: { phase: "Creciente", emoji: "🌓", description: "Expansión" },
      personalDay: 1,
      personalYear: 7,
      personalMonth: 3,
      elementInfluence: "Fuego",
      explanation: "Día de inicio.",
      isPersonalized: true,
      focusAction: "Tomar la iniciativa en proyectos postergados.",
      avoidAction: "La impaciencia con el ritmo de los demás.",
      dailyAdvice: "Aprovechá la claridad de hoy.",
      orientationEvidence: [{ label: "Luna", value: "Creciente" }],
      nextDaysForecast: [],
    };

    render(<MomentAdvice daily={mockDaily} />);

    expect(screen.getByText(/Consejo del Momento/i)).toBeDefined();
    expect(screen.getByText(/Aprovechá la claridad de hoy/i)).toBeDefined();
    expect(screen.getByText(/Anotar en mi Journal/i)).toBeDefined();
  });

  it("renders WeekPreview with forecast cards", () => {
    const forecast = [
      {
        date: "2026-08-15",
        dayName: "Sábado",
        dayNumber: 15,
        personalDay: 2,
        theme: "Cooperación",
        score: 75,
        moonEmoji: "🌔",
      },
      {
        date: "2026-08-16",
        dayName: "Domingo",
        dayNumber: 16,
        personalDay: 3,
        theme: "Expresión",
        score: 82,
        moonEmoji: "🌕",
      },
    ];

    render(<WeekPreview forecast={forecast} />);

    expect(screen.getByText(/Vista de los Próximos 3 Días/i)).toBeDefined();
    expect(screen.getByText("Mañana")).toBeDefined();
    expect(screen.getByText("Domingo")).toBeDefined();
    expect(screen.getByText("Cooperación")).toBeDefined();
    expect(screen.getByText("Expresión")).toBeDefined();
  });
});
