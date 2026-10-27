"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
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
  const L = useL();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  if (!mounted || loading || !profile) return null;

  const hits = getMasterNumbers(profile);
  if (hits.length === 0) return null;

  return (
    <div className="mb-14 p-6 sm:p-8 border border-ink/10 bg-card">
      <p className="text-sm text-accent font-medium mb-4 label-caps">{L("Tu mapa", "Your map")}</p>
      <div className="space-y-5">
        {hits.map((hit) => (
          <div key={hit.position}>
            <p className="font-heading text-xl sm:text-2xl text-foreground mb-1">
              Tu número maestro: {hit.number} en {L.t(MASTER_POSITION_LABELS_ES[hit.position])}
            </p>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {L.t(getMasterPositionMeaning(hit.number, hit.position))}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/profile"
        className="mt-6 inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps"
      >{L("Ver mi interpretación completa →", "See my full interpretation →")}</Link>
    </div>
  );
}
