"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { UserProfile } from "@/types/user";
import type { MolinoInterpretation, ConversationTurn } from "@/lib/engines/intelligenceEngine";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import { ELEMENT_COLORS } from "@/lib/data/constants";

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

// Puertas de entrada a la inteligencia personal: cada prompt conserva su
// texto exacto (lo que recibe el engine), y agrega la categoría editorial
// que lo presenta como una puerta (momentos, tensiones, sistemas) en vez de
// una pregunta suelta.
const SUGGESTED_QUESTIONS = [
  { category: "Tus tensiones", prompt: "¿Qué significa mi tensión principal en el día a día?" },
  { category: "Tu momento", prompt: "¿Este es un buen momento para tomar una decisión importante?" },
  { category: "Tus sistemas", prompt: "¿Cómo se relaciona mi elemento con mi Life Path?" },
];

export default function ChatWithMolino({ profile }: ChatWithMolinoProps) {
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);
  const prefersReducedMotion = useSafeReducedMotion();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const name = typeof profile.name === "string" ? profile.name : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

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
            premiumToken: (await import('@/lib/premium')).getPremiumTokenClient(),
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
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-accent/60" aria-hidden="true" />
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted">Tu mapa</p>
        </div>
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          Preguntale a tu mapa forma parte de tu síntesis completa — desbloqueala arriba para acceder.
        </p>
      </div>
    );
  }

  if (isPremium === null) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      {/* Entrada — la primera vez, una invitación privada + puertas */}
      {turns.length === 0 && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px" style={{ backgroundColor: elementColor }} aria-hidden="true" />
<p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted">Tu mapa</p>
          </div>
          <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-xl">
            {name ? `Tu mapa ya está leído, ${name}.` : "Tu mapa ya está leído."} Elegí una puerta para empezar o escribí tu propia pregunta.
          </p>

          <div role="group" aria-label="Preguntas sugeridas" className="mt-6">
            {SUGGESTED_QUESTIONS.map((s, i) => (
              <motion.button
                key={s.prompt}
                type="button"
                onClick={() => askQuestion(s.prompt)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.1 + i * 0.07, duration: 0.35, ease: "easeOut" }}
                className="group w-full text-left py-4 sm:py-5 border-b border-ink/10"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-accent">{s.category}</span>
                  <span className="w-4 h-px bg-accent/40 group-hover:bg-accent transition-colors" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base text-foreground group-hover:text-accent transition-colors leading-relaxed">
                  {s.prompt}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conversación */}
      <div ref={scrollRef} className="mb-6 sm:mb-8">
        <AnimatePresence initial={false}>
          {turns.map((turn, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-6 sm:py-7 border-b border-ink/10 last:border-b-0"
            >
              {/* Tu pregunta */}
              <div className="flex items-start gap-3">
                <span className="w-4 h-px bg-ink/20 mt-[0.7em] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted mb-1">Tu pregunta</p>
                  <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">{turn.question}</p>
                </div>
              </div>

              {/* Loading — la lectura en curso */}
              {turn.loading && (
                <div className="flex items-center gap-3 mt-3 pl-4 sm:pl-5" role="status" aria-live="polite">
                  <span className="relative flex h-px w-10 overflow-hidden bg-ink/15" aria-hidden="true">
                    {prefersReducedMotion ? (
                      <span className="absolute inset-y-0 left-0 w-1/2 bg-accent/60" />
                    ) : (
                      <motion.span
                        className="absolute inset-y-0 w-1/2 bg-accent"
                        initial={{ x: "-120%" }}
                        animate={{ x: ["-120%", "220%"] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </span>
                  <span className="text-xs text-muted">Leyendo tu mapa…</span>
                </div>
              )}

              {/* Error */}
              {turn.error && (
                <p role="alert" className="mt-3 pl-4 sm:pl-5 text-xs text-muted leading-relaxed flex items-start gap-2">
                  <span className="mt-[0.45em] w-1 h-1 shrink-0 bg-ink/30" aria-hidden="true" />
                  {turn.error}
                </p>
              )}

              {/* Respuesta — la voz de Molino */}
              {turn.answer && (
                <div className="mt-3 pl-4 sm:pl-5 border-l border-ink/15">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: elementColor }} aria-hidden="true" />
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">Molino</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">{turn.answer.summary}</p>
                    {turn.answer.alignment && (
                      <p className="text-sm sm:text-base text-muted leading-relaxed italic">{turn.answer.alignment}</p>
                    )}
                    {turn.answer.suggestedNextStep && (
                      <p className="text-sm text-accent leading-relaxed flex items-start gap-2">
                        <span aria-hidden="true">→</span>
                        <span>{turn.answer.suggestedNextStep}</span>
                      </p>
                    )}
                    {(turn.answer.whatToConsider.length > 0 || turn.answer.limitations.length > 0) && (
                      <p className="text-xs text-muted/80 leading-relaxed">
                        {[...turn.answer.whatToConsider, ...turn.answer.limitations].join(" ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {turns.length >= MAX_QUESTIONS_PER_SESSION ? (
        <div className="border-t border-ink/10 pt-5">
          <p className="text-xs text-muted leading-relaxed">
            Llegaste al límite de preguntas para esta visita. Volvé a entrar más tarde para seguir consultando tu mapa.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preguntale algo a tu mapa…"
            className="w-full min-h-[44px] flex-1 px-4 text-sm sm:text-base border border-ink/10 bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(124,140,255,0.15)] transition-colors"
            aria-label="Tu pregunta para tu mapa"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="min-h-[44px] shrink-0 px-5 sm:px-7 text-[0.6875rem] font-medium uppercase tracking-[0.2em] border border-ink/10 text-foreground hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Preguntar
          </button>
        </form>
      )}

      <p className="text-xs text-muted/70 mt-4 sm:mt-5 leading-relaxed">
        Molino es una herramienta de reflexión simbólica, no reemplaza asesoramiento médico, financiero, legal o psicológico. Tus preguntas no se guardan más allá de esta visita.
      </p>
    </div>
  );
}
