"use client";

import { useEffect, useState } from "react";
import { resolveUserContext, type UserContext } from "./userContext";

const SERVER_SAFE_DEFAULT: UserContext = {
  language: "es",
  currency: "USD",
  timezone: "UTC",
  locationSource: "default",
};

/**
 * Resuelve UserContext client-side (localStorage/navigator no existen en
 * SSR). Devuelve el fallback neutro hasta montar, después el real —
 * siguiendo el mismo patrón que useProfile (mounted flag para evitar
 * mismatch de hidratación).
 */
export function useUserContext(): { context: UserContext; mounted: boolean } {
  const [context, setContext] = useState<UserContext>(SERVER_SAFE_DEFAULT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setContext(resolveUserContext());
    setMounted(true);
  }, []);

  return { context, mounted };
}
