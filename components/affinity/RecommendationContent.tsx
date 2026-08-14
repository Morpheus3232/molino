"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import Button from "@/components/ui/Button";
import { formatAnimalSimple, formatAnimalEmoji } from "@/lib/utils/zodiacDisplay";
import { resolveUserContext } from "@/lib/context/userContext";
import EntityVisual from "@/components/ui/EntityVisual";

interface RecommendationContentProps {
  entityType: string;
  catalog: LightweightEntity[];
  title: string;
  subtitle: string;
}

const TIER_COLOR: Record<string, string> = {
  "resonancia-alta": "#2D5A3A",
  "afinidad-media": "#4A6FA5",
  complementarios: "#D4A843",
  desafiante: "#B45309",
  distante: "#838C95",
};

const TIER_LABEL: Record<string, string> = {
  "resonancia-alta": "Resonancia alta",
  "afinidad-media": "Afinidad media",
  complementarios: "Complementarios",
  desafiante: "Desafiante",
  distante: "Distante",
};

const TYPE_LABEL: Record<string, string> = {
  brand: "Marca",
  city: "Ciudad",
  country: "País",
  university: "Universidad",
  team: "Equipo",
  movie: "Película",
  artist: "Artista",
};

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function RecommendationContent({ entityType, catalog, title, subtitle }: RecommendationContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const recommendations = useMemo(() => {
    if (!profile) return [];
    const userAnimal = profile.chineseZodiac ?? "";
    const recs = sortLightEntities(userAnimal, catalog);
    // El score no cambia (afinidad zodiacal pura). El país del usuario solo
    // adelanta entidades de su país como tiebreaker de presentación.
    const country = resolveUserContext().country;
    if (!country) return recs;
    return [...recs].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aMatch = a.country === country ? 1 : 0;
      const bMatch = b.country === country ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [profile, catalog]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
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
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
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
      </div>
    );
  }

  const userAnimal = profile.chineseZodiac ?? "";

  const tripleResonance = recommendations.filter(r => r.tier === "resonancia-alta");
  const aligned = recommendations.filter(r => r.tier === "afinidad-media");
  const compatible = recommendations.filter(r => r.tier === "complementarios");
  const strategic = recommendations.filter(r => r.tier === "desafiante" || r.tier === "distante");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

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
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
            Recomendaciones Simbólicas · {TYPE_LABEL[entityType] ?? entityType}
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
        </motion.section>

        {/* Recommendation groups with AnimatePresence on search/filter change */}
        <AnimatePresence mode="wait">
          {tripleResonance.length > 0 && (
            <RecommendationGroup
              key="triple"
              title="Alineación triple"
              subtitle="Tu signo, la entidad y el ciclo actual comparten la misma energía"
              recommendations={tripleResonance}
              accentColor="var(--color-accent)"
              router={router}
              transitionDelay={0}
            />
          )}
          {aligned.length > 0 && (
            <RecommendationGroup
              key="aligned"
              title="Patrón complementario"
              subtitle="Símbolos tradicionalmente asociados con armonía"
              recommendations={aligned}
              accentColor="var(--color-accent)"
              router={router}
              transitionDelay={0.1}
            />
          )}
          {compatible.length > 0 && (
            <RecommendationGroup
              key="compatible"
              title="Diferente"
              subtitle="Energías complementarias dentro del ciclo chino"
              recommendations={compatible}
              accentColor="var(--color-muted)"
              router={router}
              transitionDelay={0.15}
            />
          )}
          {strategic.length > 0 && (
            <RecommendationGroup
              key="strategic"
              title="Contraste"
              subtitle="Relaciones que requieren más atención simbólica"
              recommendations={strategic}
              accentColor="var(--color-muted)"
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
              <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] tracking-tight text-foreground mb-4">Sin recomendaciones</h2>
              <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                No encontramos recomendaciones para esta entidad con tu perfil actual.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mt-12 border-t border-ink/10 pt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-xs text-muted leading-relaxed">
              Las recomendaciones son una lectura simbólica basada en tradiciones del zodíaco chino.
              No constituyen predicción científica ni determinan resultados reales.
              Cada persona puede interpretar estos sistemas de forma diferente.
            </p>
        </motion.section>
      </main>
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
  recommendations: LightAffinityResult[];
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
        <h2 className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: accentColor }}>{title}</h2>
      </div>
      <p className="text-xs text-muted mb-4 ml-11">{subtitle}</p>
      <motion.div {...staggerContainer} className="space-y-3">
        {recommendations.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} router={router} index={i} />
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
  rec: LightAffinityResult;
  router: ReturnType<typeof useRouter>;
  index: number;
}) {
  return (
    <motion.button
      {...staggerItem}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => router.push(`/affinity/${rec.type}/${rec.id}`)}
      className="w-full text-left py-5 border-b border-ink/10 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        {/* Emoji + animal */}
        <div className="text-center shrink-0">
          <EntityVisual visualType={rec.visualType as VisualType} emoji={rec.emoji} name={rec.name} countryISO={rec.countryISO} size={40} />
          <span className="text-xs text-muted">{formatAnimalEmoji(rec.animal)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {rec.name}
            </h3>
            {rec.tier === "resonancia-alta" && (
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                triple alineación
              </span>
            )}
          </div>
          <p className="text-xs text-muted mb-1">{rec.relationship}</p>
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{TIER_LABEL[rec.tier]}</p>
        </div>
      </div>
    </motion.button>
  );
}
