import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import JournalEditor from "@/components/journal/JournalEditor";

describe("JournalEditor component (Fase 2)", () => {
  it("renderiza la página del diario: fecha, ánimo, hoja y botón Guardar", () => {
    render(<JournalEditor profile={null} onSaveEntry={vi.fn()} />);

    expect(screen.getByText("Página de hoy")).toBeInTheDocument();
    expect(screen.getByText("Hoy me siento…")).toBeInTheDocument();
    expect(screen.getByLabelText("Lo que querés escribir hoy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar en el diario/i })).toBeInTheDocument();
  });

  it("oculta los tags por defecto y los despliega al hacer clic en 'Agregar tema'", async () => {
    const user = userEvent.setup();
    render(<JournalEditor profile={null} onSaveEntry={vi.fn()} />);

    // Por defecto, no se muestran los botones de tags
    expect(screen.queryByText("#Trabajo")).not.toBeInTheDocument();

    // Botón de toggle visible
    const addThemeBtn = screen.getByRole("button", { name: /Agregar tema/i });
    expect(addThemeBtn).toBeInTheDocument();

    // Clic para desplegar
    await user.click(addThemeBtn);

    // Ahora los tags son visibles
    expect(screen.getByText("#Trabajo")).toBeInTheDocument();
    expect(screen.getByText("#Relaciones")).toBeInTheDocument();
  });

  it("muestra los tags automáticamente si la entrada en edición ya contenía tags", () => {
    const editingEntry = {
      id: "entry-1",
      date: "2026-08-24",
      content: "Entrada existente",
      mood: 4 as const,
      tags: ["Trabajo"],
      cycleContext: {},
      createdAt: "2026-08-24T10:00:00Z",
    };

    render(<JournalEditor profile={null} onSaveEntry={vi.fn()} editingEntry={editingEntry} />);

    expect(screen.getByText("Corrigiendo una página")).toBeInTheDocument();
    expect(screen.getByText("#Trabajo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar la corrección/i })).toBeInTheDocument();
  });

  it("permite escribir en el textarea y enviar el formulario", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<JournalEditor profile={null} onSaveEntry={onSave} />);

    const textarea = screen.getByPlaceholderText(/Querido diario/i);
    fireEvent.change(textarea, { target: { value: "Hoy fue un día de claridad y avances." } });

    const submitBtn = screen.getByRole("button", { name: /Guardar en el diario/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Hoy fue un día de claridad y avances.",
        mood: 3,
      })
    );
  });
});
