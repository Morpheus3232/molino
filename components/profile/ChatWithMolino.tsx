"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { MolinoInterpretation, ConversationTurn } from "@/lib/engines/intelligenceEngine";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";

interface ChatWithMolinoProps {
  profile: UserProfile;
}

interface ChatTurn {
  question: string;
  answer: MolinoInterpretation | null;
  loading: boolean;
  error: string | null;
}

// Each turn is a real AI call with no dedicated cost-tracking layer yet (see
// docs/premium/COSTS.md once it exists) — a hard per-session cap keeps a
// single visit bounded instead of open-ended, without needing that
// infrastructure first. Purely client-side/session-scoped: not a security
// boundary (the endpoint is still server-gated by premium status), just a
// UX-level cost guardrail.
const MAX_QUESTIONS_PER_SESSION = 8;

const SUGGESTED_QUESTIONS = [
  "¿Qué significa mi tensión principal en el día a día?",
  "¿Este es un buen momento para tomar una decisión importante?",
  "¿Cómo se relaciona mi elemento con mi Life Path?",
];

export default function ChatWithMolino({ profile }: ChatWithMolinoProps) {
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!question.trim() || turns.length >= MAX_QUESTIONS_PER_SESSION) return;

      const index = turns.length;
      setTurns((prev) => [...prev, { question, answer: null, loading: true, error: null }]);
      setInput("");

      const conversationHistory: ConversationTurn[] = turns
        .filter((t) => t.answer)
        .map((t) => ({ question: t.question, answer: t.answer!.summary }));

      try {
        const res = await fetch("/api/intelligence/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "question",
            dob: profile.birthDate,
            name: profile.name,
            question,
            conversationHistory,
          }),
        });

        if (res.status === 403) {
          setTurns((prev) =>
            prev.map((t, i) => (i === index ? { ...t, loading: false, error: "Esta pregunta forma parte de la síntesis paga." } : t))
          );
          return;
        }
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const answer: MolinoInterpretation | null = data.ai || data.fallback || null;

        setTurns((prev) => prev.map((t, i) => (i === index ? { ...t, answer, loading: false } : t)));
      } catch (err) {
        console.error("ChatWithMolino:", err);
        setTurns((prev) =>
          prev.map((t, i) => (i === index ? { ...t, loading: false, error: "No pudimos generar una respuesta. Intentá de nuevo." } : t))
        );
      }
    },
    [turns, profile.birthDate, profile.name]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(input);
  };

  // Server-side gating is the real boundary (route.ts checks hasPremiumAccess
  // for type "question"); this is only about not showing an interactive chat
  // input to someone who'd immediately hit a 403 on their first message. No
  // second sales pitch here — PremiumGate above already made that case.
  if (isPremium === false) {
    return (
      <div className="border border-ink/10 bg-ink/[0.02] px-6 py-8 text-center max-w-2xl">
        <p className="text-sm text-muted">
          Preguntale a tu Molino forma parte de tu síntesis completa — desbloqueala arriba para acceder.
        </p>
      </div>
    );
  }

  if (isPremium === null) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <div ref={scrollRef} className="space-y-6 mb-6">
        {turns.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => askQuestion(q)}
                className="text-xs text-left px-3 py-2 border border-ink/10 text-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {turns.map((turn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-foreground border-l-2 border-ink/15 pl-4">{turn.question}</p>

              {turn.loading && (
                <div className="flex items-center gap-2 pl-4" role="status" aria-live="polite">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-xs text-muted">Molino está leyendo tu mapa…</span>
                </div>
              )}

              {turn.error && (
                <p className="text-xs text-muted pl-4">{turn.error}</p>
              )}

              {turn.answer && (
                <div className="pl-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">{turn.answer.summary}</p>
                  {turn.answer.alignment && (
                    <p className="text-sm text-muted leading-relaxed italic">{turn.answer.alignment}</p>
                  )}
                  {turn.answer.suggestedNextStep && (
                    <p className="text-sm text-accent leading-relaxed">→ {turn.answer.suggestedNextStep}</p>
                  )}
                  {(turn.answer.whatToConsider.length > 0 || turn.answer.limitations.length > 0) && (
                    <p className="text-xs text-muted/80 leading-relaxed">
                      {[...turn.answer.whatToConsider, ...turn.answer.limitations].join(" ")}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {turns.length >= MAX_QUESTIONS_PER_SESSION ? (
        <p className="text-xs text-muted">
          Llegaste al límite de preguntas para esta visita. Volvé a entrar más tarde para seguir consultando tu Molino.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preguntale algo a tu Molino…"
            className="flex-1 px-4 py-3 text-sm border border-ink/10 bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
            aria-label="Tu pregunta para Molino"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] border border-ink/10 text-foreground hover:border-accent disabled:opacity-40 transition-colors shrink-0"
          >
            Preguntar
          </button>
        </form>
      )}

      <p className="text-xs text-muted/70 mt-3">
        Molino es una herramienta de reflexión simbólica, no reemplaza asesoramiento médico, financiero, legal o psicológico. Tus preguntas no se guardan más allá de esta visita.
      </p>
    </div>
  );
}
