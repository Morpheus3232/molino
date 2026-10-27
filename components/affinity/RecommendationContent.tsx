"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import Button from "@/components/ui/Button";
import { formatAnimalSimple, formatAnimalEmoji } from "@/lib/utils/zodiacDisplay";
import { resolveUserContext } from "@/lib/context/userContext";
import EntityVisual from "@/components/ui/EntityVisual";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface RecommendationContentProps {
  entityType: string;
  catalog: LightweightEntity[];
  title: string;
  subtitle: string;
}

const TYPE_LABEL = (L: Pick2): Record<string, string> => ({
  brand: L("Marca", "Brand"),
  city: "Ciudad",
  country: "País",
  university: L("Universidad", "University"),
  team: L("Equipo", "Team"),
  movie: L("Película", "Movie"),
  artist: L("Famoso", "Famous person"),
});

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function RecommendationContent({ entityType, catalog, title, subtitle }: RecommendationContentProps) {
  const L = useL();
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
      <main id="main-content" className="min-h-screen bg-background">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando recomendaciones...">{L("Cargando recomendaciones...", "Loading recommendations...")}</p>
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
      </main>
    );
  }

  if (!profile) {
    return (
      <main id="main-content" className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-sm text-accent font-medium mb-4 label-caps">{L("Recomendaciones Simbólicas", "Symbolic Recommendations")}</p>
          <h1 className="page-title text-foreground mb-4">
            {L.t(title)}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">{L("Creá tu perfil para descubrir recomendaciones personalizadas.", "Create your profile to discover personalized recommendations.")}</p>
          <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>{L("Crear mi perfil", "Create my profile")}</Button>
        </div>
      </main>
    );
  }

  const userAnimal = profile.chineseZodiac ?? "";

  // Orden de CLAUDE.md: tu propio signo → tus dos amigos → tu enemigo (lo que
  // conviene evitar). El resto del ciclo no dice nada: se cuenta, no se lista.
  const same = recommendations.filter(r => r.tier === "mismo");
  const friends = recommendations.filter(r => r.tier === "amigo");
  const enemy = recommendations.filter(r => r.tier === "enemigo");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push("/affinity")}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
          >{L(<>
            &larr; Afinidad simbólica
          </>, <>&larr; Symbolic affinity</>)}</button>
        </motion.div>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12">
          <p className="text-sm text-accent font-medium mb-4 label-caps">
            Recomendaciones Simbólicas · {L.t(TYPE_LABEL(L)[entityType] ?? entityType)}
          </p>
          <h1 className="page-title text-foreground mb-3">
            {L.t(title)}
          </h1>
          <p className="text-sm text-muted">
            {L.t(subtitle)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">{L(<>
            <span>Tu signo:</span>
            <span className="font-medium text-foreground">{L.t(formatAnimalSimple(userAnimal))}</span>
          </>, <><span>Your sign:</span><span className="font-medium text-foreground">{L.t(formatAnimalSimple(userAnimal))}</span></>)}</div>
        </motion.section>

        {/* Recommendation groups with AnimatePresence on search/filter change */}
        <AnimatePresence mode="wait">
          {same.length > 0 && (
            <RecommendationGroup
              key="mismo"
              title={L("Tu propio signo · 本命", "Your own sign · 本命")}
              subtitle={L(`Su fecha de origen cae en un año ${userAnimal}, como la tuya.`, `Its date of origin falls in a ${L.t(userAnimal)} year, like yours.`)}
              recommendations={same}
              accentColor="var(--color-accent)"
              router={router}
              transitionDelay={0}
            />
          )}
          {friends.length > 0 && (
            <RecommendationGroup
              key="amigo"
              title={L("Tus dos amigos · 三合 San He", "Your two friends · 三合 San He")}
              subtitle={L("Del signo de uno de tus dos amigos: los separados por cuatro posiciones del ciclo.", "From the sign of one of your two friends: those four positions apart in the cycle.")}
              recommendations={friends}
              accentColor="var(--color-accent)"
              router={router}
              transitionDelay={0.1}
            />
          )}
          {enemy.length > 0 && (
            <RecommendationGroup
              key="enemigo"
              title={L("Tu enemigo · 六冲 Liu Chong", "Your enemy · 六冲 Liu Chong")}
              subtitle={L("Del signo opuesto al tuyo en el ciclo: lo que conviene evitar.", "From the sign opposite yours in the cycle: what's best avoided.")}
              recommendations={enemy}
              accentColor="var(--color-muted)"
              router={router}
              transitionDelay={0.15}
            />
          )}
          {same.length === 0 && friends.length === 0 && enemy.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] tracking-tight text-foreground mb-4">{L("Sin recomendaciones", "No recommendations")}</h2>
              <p className="text-sm text-muted mb-6 max-w-md mx-auto">{L("No encontramos recomendaciones para esta entidad con tu perfil actual.", "We couldn't find recommendations for this entity with your current profile.")}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mt-12 border-t border-ink/10 pt-8">
            <p className="text-sm text-muted font-medium mb-2 label-caps">{L("Aviso importante", "Important notice")}</p>
            <p className="text-xs text-muted leading-relaxed">{L("Las recomendaciones son una lectura simbólica basada en tradiciones del zodíaco chino. No constituyen predicción científica ni determinan resultados reales. Cada persona puede interpretar estos sistemas de forma diferente.", "The recommendations are a symbolic reading based on Chinese zodiac traditions. They aren't a scientific prediction and don't determine real outcomes. Each person may interpret these systems differently.")}</p>
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
  const L = useL();
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
        <h2 className="text-sm font-medium label-caps" style={{ color: accentColor }}>{L.t(title)}</h2>
      </div>
      <p className="text-xs text-muted mb-4 ml-11">{L.t(subtitle)}</p>
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
  const L = useL();
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
        {/* Visual + animal */}
        <div className="text-center shrink-0 flex flex-col items-center gap-1">
          <EntityVisual
            visualType={rec.visualType as VisualType}
            emoji={rec.emoji}
            imageUrl={rec.imageUrl}
            name={rec.name}
            type={rec.type}
            category={rec.category}
            countryISO={rec.countryISO}
            size={40}
          />
          <ZodiacAnimalIcon animal={rec.animal} size={14} className="text-muted" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {L.t(rec.name)}
            </h3>
          </div>
          <p className="text-xs text-muted mb-1">{L.t(formatAnimalSimple(rec.animal))}{L.t(rec.origin ? ` · ${rec.origin}` : "")}</p>
        </div>
      </div>
    </motion.button>
  );
}
