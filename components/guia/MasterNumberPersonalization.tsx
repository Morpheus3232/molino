"use client";

import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  getMasterNumbers,
  getMasterPositionMeaning,
  MASTER_POSITION_LABELS_ES,
} from "@/lib/engines/numerologyEngine";

/**
 * Sección personalizada al tope de /guia/numeros-maestros — solo se
 * renderiza si el visitante ya tiene un perfil calculado con al menos un
 * número maestro. Client Component chico e independiente para no forzar el
 * resto de la página (contenido educativo, ya indexado) a renderizarse en
 * cliente.
 */
export default function MasterNumberPersonalization() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  if (!mounted || loading || !profile) return null;

  const hits = getMasterNumbers(profile);
  if (hits.length === 0) return null;

  return (
    <div className="mb-14 p-6 sm:p-8 border border-ink/10 bg-card">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
        Tu mapa
      </p>
      <div className="space-y-5">
        {hits.map((hit) => (
          <div key={hit.position}>
            <p className="font-heading text-xl sm:text-2xl text-foreground mb-1">
              Tu número maestro: {hit.number} en {MASTER_POSITION_LABELS_ES[hit.position]}
            </p>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {getMasterPositionMeaning(hit.number, hit.position)}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/profile"
        className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors"
      >
        Ver mi interpretación completa →
      </Link>
    </div>
  );
}
