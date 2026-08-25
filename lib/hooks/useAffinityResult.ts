"use client";

import { useMemo } from "react";
import { calculateAffinity, type AffinityResult } from "@/lib/engines/affinityEngine";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { UserProfile } from "@/types/user";

/**
 * Afinidad entre un perfil y una entidad. Compartido por el flujo con perfil
 * (AffinityDetailContent) y el de entrada rápida (AffinityQuickEntryForm).
 *
 * Antes también devolvía una lista de "entidades relacionadas": las primeras
 * 6 del catálogo ordenadas por afinidad, sin ningún criterio que las ligara a
 * la entidad que el lector estaba mirando. Alimentaba tres secciones distintas
 * ("Otras entidades del mismo tipo", "Otros países", "Explorá más") que
 * mostraban doce filas con el mismo 95 y ninguna razón para estar ahí. Se
 * eliminaron: una lista sin criterio no informa, solo empuja a seguir
 * clickeando.
 */
export function useAffinityResult(
  profile: UserProfile | null,
  entity: SymbolicEntity,
): { result: AffinityResult | null } {
  const result = useMemo(() => {
    if (!profile) return null;
    return calculateAffinity(profile, entity);
  }, [profile, entity]);

  return { result };
}
