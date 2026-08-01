"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { analyzeDecision } from "@/lib/engines/decisionsEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import type { MolinoInterpretation } from "@/lib/engines/intelligenceEngine";
import Button from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/utils/motion";

interface DecisionChatProps {
  profile: UserProfile;
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLocalFallback?: boolean;
};

const EXAMPLE_QUESTIONS = [
  "¿Me conviene aceptar este trabajo?",
  "¿Es buen momento para mudarme?",
  "¿Debería empezar este proyecto?",
];

interface InterpretResponse {
  fallback: MolinoInterpretation | null;
  ai: MolinoInterpretation | null;
  error?: string;
}

function toMessageContent(interpretation: MolinoInterpretation): string {
  return [interpretation.summary, interpretation.suggestedNextStep]
    .filter(Boolean)
    .join("\n\n");
}

const MAX_HISTORY_TURNS = 6;

/**
 * Pairs up completed user/assistant turns from the in-memory message list —
 * this is the only place conversation "memory" lives. Nothing is stored
 * outside this component: a refresh or navigation away loses it entirely.
 * A trailing unanswered user message (mid-flight or failed) is naturally
 * excluded since it never finds a following assistant message to pair with.
 */
function buildConversationHistory(messages: Message[]): { question: string; answer: string }[] {
  const turns: { question: string; answer: string }[] = [];
  let pendingQuestion: string | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pendingQuestion = message.content;
    } else if (message.role === "assistant" && pendingQuestion) {
      turns.push({ question: pendingQuestion, answer: message.content });
      pendingQuestion = null;
    }
  }

  return turns.slice(-MAX_HISTORY_TURNS);
}

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}-${Date.now()}`;
}

export default function DecisionChat({ profile }: DecisionChatProps) {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const askMolino = useCallback(async (questionText: string, history: { question: string; answer: string }[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      const decision = analyzeDecision(profile, questionText, "other");
      const dailyEnergy = calculateDailyEnergy(profile, now);
      const timing = analyzeTiming(profile, now, "make_decision");

      const response = await fetch("/api/intelligence/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "decision",
          dob: profile.birthDate,
          name: profile.name,
          dailyEnergy,
          timing,
          decision,
          question: questionText,
          conversationHistory: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: InterpretResponse = await response.json();
      const interpretation = data.ai ?? data.fallback;

      if (!interpretation) {
        throw new Error("No interpretation returned");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: toMessageContent(interpretation),
          isLocalFallback: !data.ai,
        },
      ]);
      setPendingQuestion(null);
    } catch (err) {
      console.error("Error asking Molino:", err);
      setError("Molino no pudo interpretar esto ahora. Probá nuevamente.");
      setPendingQuestion(questionText);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const history = buildConversationHistory(messages);
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: trimmed }]);
    setInput("");
    textareaRef.current?.focus();
    void askMolino(trimmed, history);
  }, [input, isLoading, messages, askMolino]);

  const handleRetry = useCallback(() => {
    if (!pendingQuestion) return;
    void askMolino(pendingQuestion, buildConversationHistory(messages));
  }, [pendingQuestion, messages, askMolino]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="max-w-2xl">
      {isEmpty && !isLoading && (
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed max-w-lg">
            Contame qué estás pensando.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-xs text-muted border border-ink/10 rounded-full px-3 py-1.5 hover:text-accent hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {!isEmpty && (
        <div className="space-y-8 mb-10" aria-live="polite">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {message.role === "user" ? (
                <div>
                  <p className="label-micro mb-2">Vos preguntaste</p>
                  <p className="font-heading text-lg sm:text-xl text-foreground leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="border-t border-ink/10 pt-6">
                  <p className="label-micro mb-2 text-accent">Molino</p>
                  {message.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-editorial text-foreground mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                  {message.isLocalFallback && (
                    <p className="text-xs text-muted mt-4">Interpretación local · IA no disponible</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-label="Molino está interpretando"
            className="mb-10 border-t border-ink/10 pt-6"
          >
            <p className="label-micro mb-3 text-accent">Molino</p>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-[var(--skeleton)] rounded w-5/6" />
              <div className="h-4 bg-[var(--skeleton)] rounded w-2/3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="mb-10 border-t border-ink/10 pt-6"
          >
            <p className="text-sm text-foreground mb-3">{error}</p>
            <Button type="button" variant="secondary" size="sm" onClick={handleRetry}>
              Reintentar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-ink/10 pt-6">
        <label htmlFor="decision-question" className="sr-only">
          ¿Qué querés decidir?
        </label>
        <textarea
          ref={textareaRef}
          id="decision-question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué querés decidir?"
          rows={2}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-base placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted">Enter para enviar · Shift+Enter para salto de línea</p>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!input.trim()}
            loading={isLoading}
          >
            Preguntar
          </Button>
        </div>
      </div>
    </div>
  );
}
