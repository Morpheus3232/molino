"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  calculatePartnershipCompatibility,
  type PartnershipCompatibilityResult,
} from "@/lib/engines/partnershipEngine";
import { PersonCard } from "@/components/couple/CoupleComparison";
import { Handshake, AlertTriangle, Compass } from "lucide-react";

interface PartnershipComparisonProps {
  profileA: UserProfile;
  profileB: UserProfile;
  onReset?: () => void;
  className?: string;
  /** Etiquetas de cada persona (en un equipo, el par puede ser C y E). */
  labelA?: string;
  labelB?: string;
}

export default function PartnershipComparison({
  profileA,
  profileB,
  className = "",
  labelA = "Socio A",
  labelB = "Socio B",
}: PartnershipComparisonProps) {
  const L = useL();
  const result = useMemo<PartnershipCompatibilityResult>(
    () => calculatePartnershipCompatibility(profileA, profileB),
    [profileA, profileB]
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Synergy Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-xl text-center relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Handshake className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-bold label-caps">{L("Afinidad de Sociedad", "Partnership Affinity")}</span>
        </div>

        <div className="my-4 flex flex-col items-center justify-center">
          <div className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground max-w-lg leading-tight">
            {result.level}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed mt-2">
          {result.summary}
        </p>
      </motion.div>

      {/* Side-by-side Maps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <PersonCard profile={profileA} badgeLabel={labelA} colorScheme="gold" />
        <PersonCard profile={profileB} badgeLabel={labelB} colorScheme="blue" />
      </div>

      {/* Connection Points */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L(<>
              Puntos de Conexión & Sinergia
            </>, <>Points of Connection & Synergy</>)}</h3>
            <p className="text-xs text-muted">{L("Donde las energías de ambos fluyen de forma natural y se complementan trabajando juntos.", "Where both people's energies flow naturally and complement each other when working together.")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.connections.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 rounded-lg bg-background border border-ink/5 hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm text-accent font-semibold label-caps">
                    {c.system}
                  </span>
                  {c.score && (
                    <span className="font-mono text-xs font-bold text-foreground bg-ink/5 px-2 py-0.5 rounded">
                      {c.score} pts
                    </span>
                  )}
                </div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">{c.title}</h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Challenges & Friction Points */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
          <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L(<>
              Puntos de Atención & Desafíos
            </>, <>Points of Attention & Challenges</>)}</h3>
            <p className="text-xs text-muted">{L("Diferencias de ritmo o criterio que conviene resolver con acuerdos claros, no por sentado.", "Differences in rhythm or judgment best resolved with clear agreements, not taken for granted.")}</p>
          </div>
        </div>

        <div className="space-y-4">
          {result.challenges.map((ch) => (
            <div key={ch.id} className="p-4 sm:p-5 rounded-lg bg-background border border-ink/5 space-y-2">
              <div className="flex items-center justify-between gap-2">{L(<>
                <span className="text-sm text-warning font-semibold label-caps">
                  Área: {ch.area}
                </span>
              </>, <><span className="text-sm text-warning font-semibold label-caps">Area: {ch.area}</span></>)}</div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">{ch.description}</p>
              <div className="mt-3 pt-2 border-t border-ink/5 text-xs text-muted flex items-start gap-2">{L(<>
                <span className="text-accent font-bold">💡 Consejo:</span>
                <span>{ch.recommendation}</span>
              </>, <><span className="text-accent font-bold">💡 Tip:</span><span>{ch.recommendation}</span></>)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Working Advice */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-ink/10 bg-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Compass className="w-5 h-5 text-accent" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">{L("Síntesis para Trabajar Juntos", "Synthesis for Working Together")}</h3>
        </div>
        <blockquote className="text-sm sm:text-base text-foreground/90 italic leading-relaxed border-l-2 border-accent pl-4 py-1">
          &ldquo;{result.workingAdvice}&rdquo;
        </blockquote>
      </motion.section>
    </div>
  );
}
