"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import { saveSession } from "@/lib/session/ephemeral";
import Button from "@/components/ui/Button";

/**
 * Pregunta de entrada detrás de DECISION_FIRST_HOME_ENABLED (ver app/page.tsx).
 * Paso 1 de la sección 19 de PRODUCT-BREAKTHROUGH.md: solo captura la intención
 * del usuario nuevo en sesión efímera y lo manda al onboarding actual, sin
 * tocar el onboarding ni conectar todavía con decisionsEngine.
 */

const CHIPS = [
  { id: "decision", label: "Tengo una decisión" },
  { id: "map", label: "Quiero conocer mi mapa" },
  { id: "curiosity", label: "Solo tengo curiosidad" },
] as const;

type ChipId = (typeof CHIPS)[number]["id"];

export default function DecisionEntryPrompt() {
  const router = useRouter();
  const [freeText, setFreeText] = useState("");
  const [selected, setSelected] = useState<ChipId | null>(null);

  const goToOnboarding = () => router.push("/onboarding");

  const handleChipClick = (chip: (typeof CHIPS)[number]) => {
    setSelected(chip.id);

    if (chip.id === "decision") {
      saveSession({ name: "", birthDate: "", birthPlace: "", goal: chip.label });
    }

    // "map" y "curiosity" siguen el flujo exacto de hoy: directo al onboarding,
    // sin guardar nada en la sesión efímera.
    goToOnboarding();
  };

  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = freeText.trim();
    if (!trimmed) return;

    saveSession({ name: "", birthDate: "", birthPlace: "", goal: trimmed });
    goToOnboarding();
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="border-t border-b border-ink/10 py-12 sm:py-16">
          <p className="label-micro mb-4">ANTES DE EMPEZAR</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight max-w-2xl mb-8">
            ¿Qué te trae por acá hoy?
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            {CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                aria-pressed={selected === chip.id}
                className={`px-5 py-3 rounded-md text-sm font-medium border transition-colors min-h-[44px] ${
                  selected === chip.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleFreeTextSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <label htmlFor="decision-entry-freetext" className="sr-only">
              Contanos qué estás pensando (opcional)
            </label>
            <input
              id="decision-entry-freetext"
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="O contanos con tus palabras (opcional)"
              className="flex-1 px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors min-h-[44px]"
            />
            <Button type="submit" variant="secondary" disabled={!freeText.trim()}>
              Continuar
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
