"use client";

import { useState } from "react";
import { resolveUserContext, type UserContext } from "@/lib/context/userContext";

/**
 * Lectura del contexto geográfico/lingüístico del usuario (país elegido en
 * onboarding o settings). Se resuelve una vez al montar — el país solo
 * cambia si el usuario lo edita explícitamente. Nunca participa del scoring
 * de afinidad (100% zodíaco chino); solo ordena presentación.
 */
export function useUserContext(): UserContext {
  const [context] = useState<UserContext>(() => resolveUserContext());
  return context;
}
