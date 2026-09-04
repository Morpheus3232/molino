"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type {
  MolinoInterpretation,
  ConversationTurn,
  ReadingContext,
} from "@/lib/engines/intelligence/types";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import { useChatCredits } from "@/lib/hooks/useChatCredits";
import { getProfileSalt } from "@/lib/profile-salt";
import { getPremiumTokenClient } from "@/lib/premium";
import ChatHero from "./ChatHero";
import ChatCreditsBadge from "./ChatCreditsBadge";
import ChatReloadModal from "./ChatReloadModal";
import ChatTurnItem, { type ChatTurnData } from "./ChatTurnItem";
import ChatInputBox from "./ChatInputBox";
import { Sparkles, CheckCircle2 } from "lucide-react";

export interface PremiumChatSectionProps {
  profile: UserProfile;
  readingContext?: ReadingContext;
  className?: string;
  initialQuestion?: string;
}

// Compact highlights for conversation context — solo resúmenes que
// permitan al modelo entender qué ya se respondió, SIN reinyectar
// closingSynthesis o suggestedNextStep (que el modelo regurgita si los ve).
function compactHighlights(a: MolinoInterpretation): string {
  const parts: string[] = [];
  if (a.corePattern?.what) parts.push(`patrón: ${a.corePattern.what}`);
  if (a.howYouOperate) parts.push(`cómo opera: ${a.howYouOperate}`);
  return parts.join(" | ").slice(0, 500);
}

export default function PremiumChatSection({
  profile,
  readingContext,
  className = "",
  initialQuestion,
}: PremiumChatSectionProps) {
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);
  const credits = useChatCredits(profile.birthDate, profile.name || "");

  const [turns, setTurns] = useState<ChatTurnData[]>([]);
  const [input, setInput] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const [reloadNotice, setReloadNotice] = useState<string | null>(null);

  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      // `scrollIntoView` no existe en jsdom ni en algunos entornos SSR/preview;
      // el timeout puede además dispararse tras desmontar. Guardar evita un
      // unhandled rejection sin cambiar el comportamiento en el navegador.
      const el = scrollAnchorRef.current;
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSendQuestion = useCallback(
    async (questionText: string) => {
      const q = questionText.trim();
      if (!q || isLoading) return;

      // Validate and spend credit
      if (credits.remaining <= 0) {
        credits.setShowReloadModal(true);
        return;
      }

      const canSpend = credits.spendCredit();
      if (!canSpend) return;

      const newIndex = turns.length;
      setTurns((prev) => [
        ...prev,
        { question: q, answer: null, loading: true, error: null },
      ]);
      setInput("");
      setIsLoading(true);
      setReloadNotice(null);
      scrollToBottom();

      const conversationHistory: ConversationTurn[] = turns
        .filter((t) => t.answer)
        .map((t) => ({
          question: t.question,
          answer: t.answer!.summary,
          answerHighlights: compactHighlights(t.answer!),
        }));

      try {
        const token = getPremiumTokenClient();
        const res = await fetch("/api/intelligence/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "question",
            dob: profile.birthDate,
            name: profile.name,
            salt: getProfileSalt(),
            question: q,
            conversationHistory,
            readingContext,
            premiumToken: token,
          }),
        });

        if (res.status === 403) {
          setTurns((prev) =>
            prev.map((t, i) =>
              i === newIndex
                ? {
                    ...t,
                    loading: false,
                    error: "Esta pregunta forma parte de la lectura Premium. Tu acceso no pudo validarse.",
                  }
                : t
            )
          );
          setIsLoading(false);
          return;
        }

        // El cupo real lo lleva el servidor (chat_count en KV): el contador
        // local es solo la UI, así que puede quedar por debajo del real.
        if (res.status === 429) {
          const body = await res.json().catch(() => null);
          setTurns((prev) =>
            prev.map((t, i) =>
              i === newIndex
                ? {
                    ...t,
                    loading: false,
                    error: body?.error?.message || "Alcanzaste el límite de preguntas por ahora.",
                  }
                : t
            )
          );
          credits.setShowReloadModal(true);
          setIsLoading(false);
          return;
        }

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const answer: MolinoInterpretation | null = data.ai || data.fallback || null;

        setTurns((prev) =>
          prev.map((t, i) =>
            i === newIndex ? { ...t, answer, loading: false } : t
          )
        );
      } catch (err) {
        console.error("[PremiumChatSection] Error:", err);
        setTurns((prev) =>
          prev.map((t, i) =>
            i === newIndex
              ? {
                  ...t,
                  loading: false,
                  error: "No pudimos generar una respuesta en este momento. Intentá de nuevo.",
                }
              : t
          )
        );
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    },
    [credits, turns, isLoading, profile.birthDate, profile.name, readingContext]
  );

  if (isPremium === false) {
    return (
      <div className="rounded-[--radius-xl] bg-ink text-paper p-8 border border-paper/10 text-center">
        <Sparkles className="w-8 h-8 text-accent-light mx-auto mb-3" />
        <h3 className="font-display text-2xl uppercase tracking-tight text-paper mb-2">
          Preguntale a tu mapa
        </h3>
        <p className="text-sm text-paper/70 max-w-md mx-auto leading-relaxed">
          Esta conversación contextual con tu mapa forma parte de tu lectura Premium. Desbloqueala arriba para acceder.
        </p>
      </div>
    );
  }

  if (isPremium === null) {
    return null;
  }

  return (
    <section
      className={`rounded-[--radius-xl] bg-ink text-paper p-6 sm:p-8 lg:p-10 border border-paper/15 shadow-2xl relative overflow-hidden ${className}`}
      aria-label="Preguntale a tu mapa"
    >
      {/* Barra superior de créditos y estado */}
      <div className="mb-6 pb-4 border-b border-paper/10">
        <ChatCreditsBadge
          remaining={credits.remaining}
          total={credits.total}
          isLow={credits.isLow}
          isExhausted={credits.isExhausted}
          onOpenReloadModal={() => credits.setShowReloadModal(true)}
        />
      </div>

      {/* Banner de confirmación post-recarga */}
      <AnimatePresence>
        {reloadNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-[--radius-md] bg-success/15 border border-success/30 text-paper text-xs sm:text-sm flex items-center justify-between gap-3 font-sans"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>{reloadNotice}</span>
            </div>
            <span className="text-accent-light font-mono text-xs font-semibold">
              Listo para seguir
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero inicial (cuando no hay preguntas aún) */}
      {turns.length === 0 ? (
        <div className="mb-8">
          <ChatHero
            profile={profile}
            onSelectStarter={(q) => {
              setInput(q);
              handleSendQuestion(q);
            }}
          />
        </div>
      ) : (
        /* Historial de conversación */
        <div className="mb-8 space-y-2">
          {turns.map((turn, i) => (
            <ChatTurnItem
              key={i}
              turn={turn}
              index={i}
              onSelectSuggestion={(sug) => {
                setInput(sug);
                handleSendQuestion(sug);
              }}
            />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
      )}

      {/* Input de chat grande, minimalista */}
      <div className="sticky bottom-0 pt-4 bg-ink/95 backdrop-blur-md">
        <ChatInputBox
          input={input}
          onChange={setInput}
          onSubmit={handleSendQuestion}
          isLoading={isLoading}
          isExhausted={credits.isExhausted}
          onOpenReloadModal={() => credits.setShowReloadModal(true)}
        />
      </div>

      {/* Modal de recarga de saldo elegante */}
      <ChatReloadModal
        isOpen={credits.showReloadModal}
        onClose={() => credits.setShowReloadModal(false)}
        profileName={profile.name}
        birthDate={profile.birthDate}
      />
    </section>
  );
}
