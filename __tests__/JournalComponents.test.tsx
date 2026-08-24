import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalTimeline from "@/components/journal/JournalTimeline";
import type { JournalEntry } from "@/types/journal";
import type { UserProfile } from "@/types/user";

// Mock recharts to avoid jsdom sizing issues
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

// JournalTimeline uses framer-motion whileInView which requires
// IntersectionObserver — jsdom doesn't provide it.
if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

describe("JournalEditor Component", () => {
  const mockProfile: Partial<UserProfile> = {
    name: "Franco",
    birthDate: "1990-04-18",
    chineseZodiac: "Caballo",
    element: "Fuego",
  };

  it("renders editor fields", () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalEditor
        profile={mockProfile as UserProfile}
        onSaveEntry={handleSave}
      />
    );

    expect(screen.getByText(/Nuevo Registro/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Escribí tus pensamientos/i)).toBeDefined();
  });

  it("submits content and mood when save is clicked", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalEditor
        profile={mockProfile as UserProfile}
        onSaveEntry={handleSave}
      />
    );

    const textarea = screen.getByPlaceholderText(/Escribí tus pensamientos/i);
    fireEvent.change(textarea, { target: { value: "Hoy me sentí muy inspirado con el proyecto." } });

    const saveButton = screen.getByRole("button", { name: /Guardar registro/i });
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    const savedData = handleSave.mock.calls[0][0];
    expect(savedData.content).toBe("Hoy me sentí muy inspirado con el proyecto.");
    expect(savedData.mood).toBe(3); // default
  });
});

describe("JournalTimeline Component", () => {
  const mockEntries: JournalEntry[] = [
    {
      id: "j-1",
      date: "2026-08-14",
      content: "Un día excelente de avance y claridad.",
      mood: 5,
      tags: ["Trabajo", "Creatividad"],
      cycleContext: {
        dayEnergy: { personalDay: 1, theme: "Iniciación", moonPhase: "Nueva" },
        yearCycle: { personalYear: 7 },
      },
      createdAt: "2026-08-14T10:00:00Z",
    },
  ];

  it("renders timeline entries with mood and cycle context", () => {
    render(<JournalTimeline entries={mockEntries} />);

    expect(screen.getByText(/Un día excelente de avance y claridad/i)).toBeDefined();
    expect(screen.getByText(/En sintonía/i)).toBeDefined();
    expect(screen.getByText(/Iniciación/i)).toBeDefined();
    expect(screen.getAllByText("#Trabajo").length).toBeGreaterThanOrEqual(1);
  });

  it("renders nothing when there are no entries", () => {
    const { container } = render(<JournalTimeline entries={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
