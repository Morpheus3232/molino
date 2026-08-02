"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { getRecommendationsByType, type Recommendation } from "@/lib/engines/recommendationEngine";
import type { EntityType } from "@/lib/data/symbolic-entities";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import { formatAnimalSimple, formatAnimalEmoji } from "@/lib/utils/zodiacDisplay";

interface RecommendationContentProps {
  entityType: EntityType;
  title: string;
  subtitle: string;
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function RecommendationContent({ entityType, title, subtitle }: RecommendationContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const recommendations = useMemo(() => {
    if (!profile) return [];
    return getRecommendationsByType(profile, entityType, 10);
  }, [profile, entityType]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando recomendaciones...">
            Cargando recomendaciones...
          </p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
            <div className="h-9 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-8" />
            <div className="h-12 bg-[var(--skeleton)] rounded-md mb-8" />
            {Array.from({ length: 3 }).map((_, groupIdx) => (
              <div key={groupIdx} className="space-y-3 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                ))}
              </div>
            ))}
          </div>
          <UniversityFooter />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Recomendaciones Simbólicas
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Creá tu perfil para descubrir recomendaciones personalizadas.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>Crear mi perfil</Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const userAnimal = profile.chineseZodiac ?? "";
  const meta = ENTITY_TYPES[entityType];

  const tripleResonance = recommendations.filter(r => r.category === "triple-resonance");
  const aligned = recommendations.filter(r => r.category === "recommended");
  const compatible = recommendations.filter(r => r.category === "compatible");
  const strategic = recommendations.filter(r => r.category === "strategic");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push("/affinity")}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
          >
            &larr; Afinidad simbólica
          </button>
        </motion.div>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Recomendaciones Simbólicas · {meta?.plural ?? entityType}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3">
            {title}
          </h1>
          <p className="text-sm text-muted">
            {subtitle}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span>Tu animal:</span>
            <span className="font-medium text-foreground">{formatAnimalSimple(userAnimal)}</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Estos números indican prioridad para el ciclo actual — no son tu score de afinidad.
          </p>
        </motion.section>

        {/* Recommendation groups with AnimatePresence on search/filter change */}
        <AnimatePresence mode="wait">
          {tripleResonance.length > 0 && (
            <RecommendationGroup
              key="triple"
              title="Resonancia triple"
              subtitle="Tu signo, la entidad y el ciclo actual comparten la misma energía"
              recommendations={tripleResonance}
              accentColor="#2D5A3D"
              router={router}
              transitionDelay={0}
            />
          )}
          {aligned.length > 0 && (
            <RecommendationGroup
              key="aligned"
              title="Alineadas contigo"
              subtitle="Símbolos tradicionalmente asociados con armonía"
              recommendations={aligned}
              accentColor="#4A6FA5"
              router={router}
              transitionDelay={0.1}
            />
          )}
          {compatible.length > 0 && (
            <RecommendationGroup
              key="compatible"
              title="Explorar"
              subtitle="Energías complementarias dentro del ciclo chino"
              recommendations={compatible}
              accentColor="#D4A843"
              router={router}
              transitionDelay={0.15}
            />
          )}
          {strategic.length > 0 && (
            <RecommendationGroup
              key="strategic"
              title="Combinaciones para observar"
              subtitle="Relaciones que requieren más atención simbólica"
              recommendations={strategic}
              accentColor="#B45309"
              router={router}
              transitionDelay={0.2}
            />
          )}
          {tripleResonance.length === 0 && aligned.length === 0 && compatible.length === 0 && strategic.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <p className="eyebrow-brutalist mb-4">Sin recomendaciones</p>
              <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                No encontramos recomendaciones para esta entidad con tu perfil actual.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mt-12">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-xs text-muted leading-relaxed">
              Las recomendaciones son una lectura simbólica basada en tradiciones del zodíaco chino.
              No constituyen predicción científica ni determinan resultados reales.
              Cada persona puede interpretar estos sistemas de forma diferente.
            </p>
          </div>
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}

function RecommendationGroup({
  title,
  subtitle,
  recommendations,
  accentColor,
  router,
  transitionDelay,
}: {
  title: string;
  subtitle: string;
  recommendations: Recommendation[];
  accentColor: string;
  router: ReturnType<typeof useRouter>;
  transitionDelay?: number;
}) {
  return (
    <motion.section
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: transitionDelay }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-px" style={{ backgroundColor: accentColor }} aria-hidden="true" />
        <h2 className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: accentColor }}>{title}</h2>
      </div>
      <p className="text-xs text-muted mb-4 ml-11">{subtitle}</p>
      <motion.div {...staggerContainer} className="space-y-3">
        {recommendations.map((rec, i) => (
          <RecommendationCard key={rec.entity.id} rec={rec} router={router} index={i} />
        ))}
      </motion.div>
    </motion.section>
  );
}

function RecommendationCard({
  rec,
  router,
  index,
}: {
  rec: Recommendation;
  router: ReturnType<typeof useRouter>;
  index: number;
}) {
  const stars = "★".repeat(rec.priority) + "☆".repeat(5 - rec.priority);

  return (
    <motion.button
      {...staggerItem}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
      className="w-full text-left p-6 rounded-md border border-border bg-card shadow-sm hover:border-accent/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Emoji + animal */}
        <div className="text-center shrink-0">
          <span className="text-2xl block">{rec.entity.emoji}</span>
          <span className="text-xs text-muted">{formatAnimalEmoji(rec.entityAnimal)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {rec.entity.name}
            </h3>
            {rec.isTripleResonance && (
              <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-success/10 text-success">
                Triple
              </span>
            )}
          </div>
          <p className="text-xs text-muted mb-1">{rec.title}</p>
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{rec.explanation}</p>
        </div>

        {/* Score + stars */}
        <div className="text-right shrink-0">
          <p className="text-[9px] uppercase tracking-wider text-muted">Prioridad del ciclo</p>
          <p className="font-heading text-xl font-bold text-foreground">{rec.totalScore}</p>
          <p className="text-xs mt-0.5" style={{ color: getScoreHexColor(rec.totalScore) }}>{stars}</p>
        </div>
      </div>
    </motion.button>
  );
}

function getScoreHexColor(score: number): string {
  if (score >= 85) return "#2D5A3D";
  if (score >= 70) return "#4A6FA5";
  if (score >= 50) return "#D4A843";
  return "#B45309";
}
