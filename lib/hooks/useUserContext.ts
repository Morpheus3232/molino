"use client";

import { useEffect, useState } from "react";
import { resolveUserContext, type UserContext } from "@/lib/context/userContext";

const SERVER_SAFE_DEFAULT: UserContext = {
  language: "es",
  currency: "USD",
  timezone: "UTC",
  locationSource: "default",
};

/**
 * Lectura del contexto geográfico/lingüístico del usuario (país elegido en
 * onboarding o settings). Se resuelve una vez al montar — el país solo
 * cambia si el usuario lo edita explícitamente. Nunca participa del scoring
 * de afinidad (100% zodíaco chino); solo ordena presentación.
 *
 * resolveUserContext() lee localStorage, que no existe en SSR. Antes este
 * hook lo llamaba directo en el inicializador de useState — el primer
 * render del cliente (el que React compara contra el HTML del servidor
 * durante la hidratación) ya veía el país guardado, mientras el servidor
 * nunca pudo verlo: mismatch de hidratación real para cualquier visitante
 * con país guardado (afectaba a FamousMatch, que arma un resultado
 * distinto con/sin país — ver famousPeopleToEntities.findFamousMatches).
 * Ahora el primer render (servidor Y cliente) siempre parte del mismo
 * default neutro; recién en el efecto post-mount se resuelve el valor
 * real, que dispara un re-render normal (no de hidratación).
 */
export function useUserContext(): UserContext {
  const [context, setContext] = useState<UserContext>(SERVER_SAFE_DEFAULT);

  useEffect(() => {
    setContext(resolveUserContext());
  }, []);

  return context;
}
