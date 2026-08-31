import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MapHighlightText from "@/components/chat/MapHighlightText";
import ChatHero from "@/components/chat/ChatHero";
import ChatCreditsBadge from "@/components/chat/ChatCreditsBadge";
import ChatTurnItem from "@/components/chat/ChatTurnItem";
import ChatReloadModal from "@/components/chat/ChatReloadModal";
import PremiumChatSection from "@/components/chat/PremiumChatSection";
import type { UserProfile } from "@/types/user";

// Mock hooks
vi.mock("@/lib/hooks/usePremiumAccess", () => ({
  usePremiumAccess: () => ({ isPremium: true, loading: false }),
}));

vi.mock("@/lib/profile-salt", () => ({
  getProfileSalt: () => "mock-salt",
}));

vi.mock("@/lib/premium", () => ({
  getPremiumTokenClient: () => "mock-token",
}));

const mockProfile: UserProfile = {
  birthDate: "1990-08-10",
  birthPlace: "Buenos Aires",
  goal: "growth",
  interests: [],
  onboardingStep: 3,
  completedSections: [],
  theme: "light",
  language: "es",
  notifications: true,
  lifePath: 4,
  sunSign: "Leo",
  sunSignInfo: { sign: "Leo", element: "Fuego", modality: "Fijo" },
  chineseZodiac: "Caballo",
  chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
  element: "Fuego",
  modality: "Fijo",
  luckyNumber: 8,
  archetype: "El Constructor",
  archetypeInfo: { keywords: ["estructura", "método", "fuerza"] },
  cycles: {
    personalYear: 4,
    personalMonth: 8,
    personalDay: 1,
  },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

describe("Chat Redesign UI Components", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("MapHighlightText", () => {
    it("renders regular text and highlights bold segments with styled elements", () => {
      const text = "Dado tu **Camino de Vida 4** y tu **Sol en Leo**, este es un momento clave.";
      const { container } = render(<MapHighlightText text={text} />);

      const strongs = container.querySelectorAll("strong");
      expect(strongs.length).toBe(2);
      expect(strongs[0].textContent).toBe("Camino de Vida 4");
      expect(strongs[1].textContent).toBe("Sol en Leo");
      expect(container.textContent).toBe("Dado tu Camino de Vida 4 y tu Sol en Leo, este es un momento clave.");
    });
  });

  describe("ChatHero", () => {
    it("renders hero title, PersonalSigil, and dynamic contextual line based on profile", () => {
      render(<ChatHero profile={mockProfile} />);

       expect(screen.getByText(/Tu mapa ya está/i)).toBeDefined();
       expect(screen.getByText(/sobre la mesa/i)).toBeDefined();
      expect(screen.getAllByText(/Año Personal 4/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Camino de Vida 4/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Sol en Leo/i).length).toBeGreaterThanOrEqual(1);
    });

    it("triggers starter question callback when clicked", () => {
      const onSelectStarter = vi.fn();
      render(<ChatHero profile={mockProfile} onSelectStarter={onSelectStarter} />);

      const starterButtons = screen.getAllByRole("button");
      expect(starterButtons.length).toBeGreaterThan(0);

      fireEvent.click(starterButtons[0]);
      expect(onSelectStarter).toHaveBeenCalledWith(expect.stringContaining("Año Personal 4"));
    });
  });

  describe("ChatCreditsBadge", () => {
    it("renders remaining credits counter and handles low credits badge", () => {
      const onOpenReload = vi.fn();
      const { rerender } = render(
        <ChatCreditsBadge
          remaining={45}
          total={50}
          isLow={false}
          isExhausted={false}
          onOpenReloadModal={onOpenReload}
        />
      );

      expect(screen.getByText(/Preguntas restantes:/i)).toBeDefined();
      expect(screen.getByText("45")).toBeDefined();

      // Rerender as low credits (<5)
      rerender(
        <ChatCreditsBadge
          remaining={3}
          total={50}
          isLow={true}
          isExhausted={false}
          onOpenReloadModal={onOpenReload}
        />
      );
      expect(screen.getByText(/Te quedan 3 preguntas/i)).toBeDefined();

      // Click reload
      fireEvent.click(screen.getByText(/Recargar saldo/i));
      expect(onOpenReload).toHaveBeenCalled();
    });
  });

  describe("ChatTurnItem", () => {
    it("renders user question and AI answer with map highlights and follow-up suggestions", () => {
      const onSelectSuggestion = vi.fn();
      const mockTurn = {
        question: "¿Cómo impacta mi año personal?",
        answer: {
          summary: "Dado tu **Camino de Vida 4** y tu **Año Personal 4**, este es un momento de consolidación.",
          alignment: "Tu **Sol en Leo** aporta visibilidad.",
          timing: "Año de estructura",
          strengths: ["Persistencia"],
          tensions: ["Rigidez"],
          whatToConsider: [],
          suggestedNextStep: "Planificá metas trimestrales",
          suggestedQuestions: [
            "¿Cómo aprovechar este ciclo en mi trabajo?",
            "¿Cómo afecta mi Luna en mis decisiones?",
          ],
          confidence: "Alta",
          limitations: [],
          rawContext: {} as any,
        },
        loading: false,
        error: null,
      };

      render(
        <ChatTurnItem
          turn={mockTurn}
          index={0}
          onSelectSuggestion={onSelectSuggestion}
        />
      );

      expect(screen.getByText("¿Cómo impacta mi año personal?")).toBeDefined();
      expect(screen.getByText(/Camino de Vida 4/)).toBeDefined();
      expect(screen.getByText("¿Cómo aprovechar este ciclo en mi trabajo?")).toBeDefined();
      expect(screen.getByText("¿Cómo afecta mi Luna en mis decisiones?")).toBeDefined();

      fireEvent.click(screen.getByText("¿Cómo aprovechar este ciclo en mi trabajo?"));
      expect(onSelectSuggestion).toHaveBeenCalledWith("¿Cómo aprovechar este ciclo en mi trabajo?");
    });
  });

  describe("ChatReloadModal", () => {
    it("shows the pack as not yet purchasable and never grants credits client-side", () => {
      const onClose = vi.fn();

      render(
        <ChatReloadModal
          isOpen={true}
          onClose={onClose}
          profileName="Sofia"
          birthDate="1990-08-10"
        />
      );

      expect(screen.getByText("Te quedaste sin saldo Molino")).toBeDefined();
      expect(screen.getByText(/28 preguntas adicionales/i)).toBeDefined();
      expect(screen.getByText(/Todavía no se puede comprar/i)).toBeDefined();
      // El botón que simulaba el cobro de USD 1.70 y regalaba 28 créditos ya no existe.
      expect(screen.queryByRole("button", { name: /Recargar saldo/i })).toBeNull();
    });
  });

  describe("PremiumChatSection full flow", () => {
    it("renders hero initially and allows asking a question with real credit decrement", async () => {
      // Mock global fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          ai: {
            summary: "En tu **Año Personal 4**, tu **Camino de Vida 4** florece a través del orden.",
            alignment: "Estructura sólida.",
            timing: "Favorable",
            strengths: ["Constancia"],
            tensions: [],
            whatToConsider: [],
            suggestedNextStep: "Definí una rutina de enfoque diario.",
            suggestedQuestions: ["¿Querés ver cómo afecta tus finanzas?"],
            confidence: "Alta",
            limitations: [],
          },
        }),
      } as any);

      render(<PremiumChatSection profile={mockProfile} />);

       expect(screen.getByText(/Tu mapa ya está/i)).toBeDefined();
       expect(screen.getByText("50")).toBeDefined(); // Remaining credits

      const input = screen.getByPlaceholderText("Escribí tu pregunta…");
      fireEvent.change(input, { target: { value: "¿Cuál es mi mayor fortaleza?" } });

      const submitBtn = screen.getByLabelText("Enviar pregunta");
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/En tu/i)).toBeDefined();
        expect(screen.getByText("49")).toBeDefined(); // Decremented to 49
      });
    });
  });
});
