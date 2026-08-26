"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getChatCredits,
  spendChatCredit,
  addChatCredits,
  resetChatCredits,
  type ChatCreditsStatus,
  INITIAL_PREMIUM_QUESTIONS,
  RELOAD_PACK_QUESTIONS,
  RELOAD_PACK_PRICE_USD,
} from "@/lib/session/chatCredits";

export function useChatCredits(birthDate: string, name: string = "") {
  const [status, setStatus] = useState<ChatCreditsStatus>(() =>
    getChatCredits(birthDate, name)
  );
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [justReloaded, setJustReloaded] = useState(false);

  useEffect(() => {
    setStatus(getChatCredits(birthDate, name));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ birthDate?: string; name?: string; reloaded?: boolean }>;
      if (
        !customEvent.detail ||
        (customEvent.detail.birthDate === birthDate &&
          (customEvent.detail.name || "").trim().toLowerCase() === (name || "").trim().toLowerCase())
      ) {
        setStatus(getChatCredits(birthDate, name));
        if (customEvent.detail?.reloaded) {
          setJustReloaded(true);
        }
      }
    };

    window.addEventListener("molino-chat-credits-updated", handleUpdate);
    return () => {
      window.removeEventListener("molino-chat-credits-updated", handleUpdate);
    };
  }, [birthDate, name]);

  const spendCredit = useCallback((): boolean => {
    const res = spendChatCredit(birthDate, name);
    setStatus(res.status);
    if (!res.success) {
      setShowReloadModal(true);
      return false;
    }
    return true;
  }, [birthDate, name]);

  const reloadCredits = useCallback((count: number = RELOAD_PACK_QUESTIONS) => {
    const updated = addChatCredits(birthDate, name, count);
    setStatus(updated);
    setJustReloaded(true);
    setShowReloadModal(false);
  }, [birthDate, name]);

  const resetCredits = useCallback(() => {
    resetChatCredits(birthDate, name);
    setStatus(getChatCredits(birthDate, name));
    setJustReloaded(false);
  }, [birthDate, name]);

  return {
    ...status,
    showReloadModal,
    setShowReloadModal,
    justReloaded,
    setJustReloaded,
    spendCredit,
    reloadCredits,
    resetCredits,
    initialQuestions: INITIAL_PREMIUM_QUESTIONS,
    reloadPackQuestions: RELOAD_PACK_QUESTIONS,
    reloadPackPriceUsd: RELOAD_PACK_PRICE_USD,
  };
}
