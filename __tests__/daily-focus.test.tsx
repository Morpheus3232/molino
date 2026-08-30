import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DailyFocus, { MomentAdvice } from "@/components/daily/DailyFocus";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";

const mockDaily: EnrichedDailyEnergy = {
  date: "2026-08-24",
  overallScore: 78,
  theme: "Expresión",
  description: "Día de gran dinamismo expresivo.",
  strengths: ["Creatividad", "Comunicación"],
  cautions: ["Dispersión"],
  areas: {
    work: { score: 75, label: "Favorable" },
    relationships: { score: 80, label: "Muy favorable" },
    creativity: { score: 85, label: "Muy favorable" },
    decisions: { score: 70, label: "Favorable" },
  },
  moonPhase: { phase: "Luna creciente", emoji: "🌒", description: "Crecimiento" },
  personalDay: 3,
  personalYear: 4,
  personalMonth: 8,
  focusAction: "Expresar tus ideas sin filtro de autocrítica y comunicar proyectos creativos.",
  avoidAction: "Dispersar tu energía en demasiadas tareas abiertas.",
  dailyAdvice: "Escribí durante cinco minutos aquello que venís postergando.",
  orientationEvidence: [
    { label: "Luna", value: "Luna creciente" },
    { label: "Año personal", value: "4" },
  ],
  dailyConnection: {
    id: "buenos-aires",
    name: "Buenos Aires",
    type: "city",
    relation: "triad",
    relationLabel: "Buena compatibilidad",
    explanation: "Pertenece a uno de tus dos animales aliados en el ciclo.",
    href: "/affinity/city/buenos-aires",
  },
  nextDaysForecast: [],
  elementInfluence: "Fuego",
  explanation: "Día de gran dinamismo.",
  isPersonalized: true,
};

describe("DailyFocus Component (Fase 2)", () => {
  it("renderiza Favorable hoy, Observar hoy y Áreas del día", () => {
    render(<DailyFocus daily={mockDaily} />);

    expect(screen.getByText("Favorable hoy")).toBeInTheDocument();
    expect(screen.getByText(/Expresar tus ideas sin filtro/i)).toBeInTheDocument();

    expect(screen.getByText("Observar hoy")).toBeInTheDocument();
    expect(screen.getByText(/Dispersar tu energía/i)).toBeInTheDocument();

    expect(screen.getByText("Áreas del día")).toBeInTheDocument();
    expect(screen.getByText("Trabajo")).toBeInTheDocument();
    expect(screen.getByText("Relaciones")).toBeInTheDocument();
  });

  it("no renderiza el bloque 'Conexión del día' (retirado de DailyFocus en Fase 4)", () => {
    // La entidad de afinidad del día ya no vive dentro de DailyFocus: el
    // componente se enfocó en Favorable/Observar/Áreas. El mock conserva
    // dailyConnection, pero el componente no debe pintarlo acá.
    render(<DailyFocus daily={mockDaily} />);

    expect(screen.queryByText("Conexión del día")).not.toBeInTheDocument();
    expect(screen.queryByText("Buena compatibilidad")).not.toBeInTheDocument();
    expect(screen.queryByText("Buenos Aires")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Explorar ficha/i })).not.toBeInTheDocument();
  });

  it("MomentAdvice renderiza el consejo y la evidencia sin textos ambiguos", () => {
    render(<MomentAdvice daily={mockDaily} />);

    expect(screen.getByText(/Escribí durante cinco minutos/i)).toBeInTheDocument();
    expect(screen.getByText(/Año personal:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hoy resuena:/i)).not.toBeInTheDocument();
  });
});
