"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { UserProfile } from "@/types/user";
import type { MolinoInterpretation, ConversationTurn, ReadingContext } from "@/lib/engines/intelligenceEngine";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import { ELEMENT_COLORS } from "@/lib/data/constants";

interface ChatWithMolinoProps {
  profile: UserProfile;
  /** Compact structural context of the premium reading the user just read —
   * grounds chat answers in the same interpretation without resending the
   * full object. Optional: the chat still works from the deterministic
   * context alone when no reading is available. */
  readingContext?: ReadingContext;
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

/** Compacta los campos estructurales de una respuesta para el historial del
 *  chat — conserva el grounding (patrón, cómo opera, cierre) sin reenviar el
 *  objeto completo. Pensado para tokens: un fragmento corto por turno. */
function compactHighlights(a: MolinoInterpretation): string {
  const parts: string[] = [];
  if (a.corePattern?.what) parts.push(`patrón: ${a.corePattern.what}`);
  if (a.howYouOperate) parts.push(`cómo opera: ${a.howYouOperate}`);
  if (a.closingSynthesis) parts.push(`síntesis: ${a.closingSynthesis}`);
  return parts.join(" | ").slice(0, 500);
}

const SUGGESTED_QUESTIONS = [
  "¿Cuál es mi contradicción más importante?",
  "¿Qué patrón estoy repitiendo?",
  "¿Qué necesito entender de este momento?",
  "¿Qué relación hay entre mis reglas y mis tensiones?",
];

export default function ChatWithMolino({ profile, readingContext }: ChatWithMolinoProps) {
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);
  const prefersReducedMotion = useSafeReducedMotion();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  // Las preguntas sugeridas no disparan la consulta: completan el campo para
  // que haya un único punto de acción (el formulario). Evita gastar un turno
  // de IA por accidente y deja claro qué está pasando antes de preguntar.
  const pickSuggestion = useCallback((question: string) => {
    setInput(question);
    inputRef.current?.focus();
  }, []);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!question.trim() || turns.length >= MAX_QUESTIONS_PER_SESSION) return;

      const index = turns.length;
      setTurns((prev) => [...prev, { question, answer: null, loading: true, error: null }]);
      setInput("");

      const conversationHistory: ConversationTurn[] = turns
        .filter((t) => t.answer)
        .map((t) => ({
          question: t.question,
          answer: t.answer!.summary,
          answerHighlights: compactHighlights(t.answer!),
        }));

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
            readingContext,
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
    [turns, profile.birthDate, profile.name, readingContext]
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
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          Preguntale a tu mapa forma parte de tu síntesis completa — desbloqueala arriba para acceder.
        </p>
      </div>
    );
  }

  if (isPremium === null) {
    return null;
  }

  const remaining = MAX_QUESTIONS_PER_SESSION - turns.length;

  return (
    <div className="max-w-2xl">
      {/* Entrada — invitación clara, un solo camino hacia la pregunta */}
      {turns.length === 0 && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 sm:mb-10"
        >
          <h3 className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed max-w-xl">
            Ya conocés tu mapa. Ahora podés preguntarle qué significa.
          </h3>

          <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl">
            Elegí una de estas preguntas o escribí la tuya.
          </p>

          <div role="group" aria-label="Preguntas sugeridas" className="mt-6">
            <p className="label-micro mb-3">Preguntas sugeridas</p>
            <ul className="flex flex-wrap gap-2.5">
              {SUGGESTED_QUESTIONS.map((prompt, i) => (
                <motion.li
                  key={prompt}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.1 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                >
                  <button
                    type="button"
                    onClick={() => pickSuggestion(prompt)}
                    className="text-left px-4 py-2.5 text-sm text-foreground border border-ink/15 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                  >
                    {prompt}
                  </button>
                </motion.li>
              ))}
            </ul>
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
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-1">Tu pregunta</p>
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

              {/* Respuesta — la voz de Molino, espacio editorial amplio, nunca una burbuja */}
              {turn.answer && (
                <div className="mt-4 pl-4 sm:pl-6 border-l border-ink/15 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: elementColor }} aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Molino</span>
                  </div>
                  <div className="space-y-4">
                    <p className="font-heading text-base sm:text-lg text-foreground leading-[1.6]">{turn.answer.summary}</p>
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
        <div className="border border-ink/10 p-4 sm:p-5">
          <p className="text-sm text-foreground mb-1">Llegaste al límite de esta visita.</p>
          <p className="text-xs text-muted leading-relaxed">
            Podés volver a entrar más tarde para seguir consultando tu mapa.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border border-ink/10 p-4 sm:p-5">
          <label htmlFor="molino-question" className="label-micro block mb-3">
            Hacé tu pregunta
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              id="molino-question"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué querés entender de vos?"
              className="w-full min-h-[44px] flex-1 px-4 text-sm sm:text-base border border-ink/10 bg-background text-foreground placeholder:text-muted/70 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(124,140,255,0.15)] transition-colors"
              aria-label="Tu pregunta para tu mapa"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="min-h-[44px] shrink-0 px-5 sm:px-7 text-xs font-medium uppercase tracking-[0.2em] border border-ink/10 text-foreground hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Preguntar
            </button>
          </div>
        </form>
      )}

      {/* Límite transparente — el tope de 8 aparece antes de chocar con él */}
      {turns.length < MAX_QUESTIONS_PER_SESSION && (
        <p className="mt-3 font-mono text-xs text-muted/70">
          Quedan {remaining} {remaining === 1 ? "pregunta" : "preguntas"} en esta visita.
        </p>
      )}

      {/* Nota de uso — separada del área interactiva, en dos líneas cortas */}
      <div className="mt-6 pt-5 border-t border-ink/10 space-y-1.5">
        <p className="text-xs text-muted/70 leading-relaxed flex items-start gap-2">
          <span className="mt-[0.5em] w-1 h-1 shrink-0 bg-ink/30" aria-hidden="true" />
          Molino es una herramienta de reflexión simbólica. No reemplaza asesoramiento médico, financiero, legal o psicológico.
        </p>
        <p className="text-xs text-muted/70 leading-relaxed flex items-start gap-2">
          <span className="mt-[0.5em] w-1 h-1 shrink-0 bg-ink/30" aria-hidden="true" />
          Tus preguntas no se guardan más allá de esta visita.
        </p>
      </div>
    </div>
  );
}
