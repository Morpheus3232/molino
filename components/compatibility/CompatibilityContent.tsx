"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAffinity } from "@/lib/engines/affinityEngine";
import { getRelation, type Animal } from "@/lib/data/animalRelations";
import { calculateElementCompatibility, getElement } from "@/lib/engines/astrologyEngine";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { SectionHeader, CollapsibleSection, DataRow } from "@/components/affinity/AffinitySectionPrimitives";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ENTITIES, type EntityProfile } from "@/lib/data/entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import EntityVisual from "@/components/ui/EntityVisual";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

const CATEGORY_LABELS: Record<string, string> = {
  country: "País", city: "Ciudad", brand: "Marca", band: "Banda", movie: "Película",
  person: "Persona", nature: "Naturaleza", art: "Arte", philosophy: "Filosofía",
  sport: "Deporte", food: "Comida", tvshow: "Serie", videoGame: "Videojuego",
  anime: "Anime", comic: "Cómic", drink: "Bebida", dessert: "Postre",
};

/** Traducción del elemento occidental a una lectura factual, sin score visible. */
function describeElementPair(userElement: string, entityElement: string): string | null {
  const score = calculateElementCompatibility(userElement, entityElement);
  if (userElement === entityElement) return `mismo elemento (${userElement})`;
  if (score === 90) return `elementos afines (${userElement}–${entityElement})`;
  if (score === 40) return `elementos opuestos (${userElement}–${entityElement})`;
  return null;
}

interface CompatibilityContentProps {
  entity: EntityProfile;
  atlasEntity: SymbolicEntity | null;
}

export default function CompatibilityContent({ entity, atlasEntity }: CompatibilityContentProps) {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  // Zodiaco chino — mismo motor real que /affinity. Con match en el atlas,
  // reusa el evento histórico real como evidencia; sin match, usa
  // getRelation() directo (misma fuente de verdad, sin evento asociado).
  const chinese = useMemo(() => {
    if (!profile) return null;
    if (atlasEntity) {
      const result = calculateAffinity(profile, atlasEntity);
      return {
        userAnimal: result.userAnimal,
        entityAnimal: result.entityAnimal,
        label: result.relationship,
        description: result.explanation,
        evidence: result.primaryEvent.description,
        eventLabel: result.primaryEvent.label,
        eventYear: result.entityYear,
        eventSource: result.primaryEvent.source,
      };
    }
    const userAnimal = profile.chineseZodiac;
    const entityAnimal = entity.symbolism.chineseZodiac;
    if (!userAnimal || !entityAnimal) return null;
    const relation = getRelation(userAnimal as Animal, entityAnimal as Animal);
    return {
      userAnimal,
      entityAnimal,
      label: relation.label,
      description: relation.description,
      evidence: null,
      eventLabel: null,
      eventYear: null,
      eventSource: null,
    };
  }, [profile, entity, atlasEntity]);

  const numerology = useMemo(() => {
    if (!profile || entity.symbolism.lifePath == null) return null;
    return {
      userLifePath: profile.lifePath,
      entityLifePath: entity.symbolism.lifePath,
      sameNumber: profile.lifePath === entity.symbolism.lifePath,
    };
  }, [profile, entity]);

  const astrology = useMemo(() => {
    if (!profile || !entity.symbolism.sunSign) return null;
    const entityElement = getElement(entity.symbolism.sunSign);
    return {
      userSign: profile.sunSign,
      userElement: profile.sunSignInfo.element,
      entitySign: entity.symbolism.sunSign,
      entityElement,
      reading: describeElementPair(profile.sunSignInfo.element, entityElement),
    };
  }, [profile, entity]);

  // Exploración — otras entidades reales con relación real (mismo animal /
  // triada / opuesto exclusivamente, misma fuente que /affinity).
  const otherEntities = useMemo(() => {
    if (!profile) return [];
    const userAnimal = profile.chineseZodiac as Animal;
    return ENTITIES
      .filter(e => e.id !== entity.id && e.symbolism.chineseZodiac)
      .map(e => ({ entity: e, relation: getRelation(userAnimal, e.symbolism.chineseZodiac as Animal) }))
      .filter(({ relation }) => relation.type === "same" || relation.type === "triad" || relation.type === "clash")
      .sort((a, b) => (a.entity.category === entity.category ? -1 : 0) - (b.entity.category === entity.category ? -1 : 0))
      .slice(0, 6);
  }, [profile, entity]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/compatibility/${entity.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Tu conexión con ${entity.name}`,
        text: `Descubrí tu conexión con ${entity.name} en Molino`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copiado al portapapeles");
      }).catch(() => {});
    }
  }, [entity]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
              <p className="sr-only" role="status" aria-label="Cargando conexión...">
                Cargando conexión...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
                <div className="h-8 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-48 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--skeleton)] border-t border-ink/10" />
                ))}
              </div>
            </div>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="empty"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-content px-4 sm:px-6 py-12 text-center">
              <div className="mb-6 flex justify-center">
                <EntityVisual
                  name={entity.name}
                  emoji={entity.emoji}
                  type={entity.category}
                  category={entity.category}
                  size={64}
                />
              </div>
              <h1 className="font-heading text-3xl font-semibold text-foreground mb-4">
                Tu conexión con {entity.name}
              </h1>
              <p className="text-sm text-muted mb-8 max-w-md mx-auto">
                Para ver tu conexión con {entity.name}, primero necesitás crear tu perfil personal.
              </p>
              <Button size="lg" onClick={() => router.push("/onboarding")}>
                Crear mi perfil
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                <span>›</span>
                <Link href="/explore" className="hover:text-foreground transition-colors">Explorar</Link>
                <span>›</span>
                <span className="text-foreground font-medium">{entity.name}</span>
              </nav>

              {/* 1+2. Entidad + conexión concreta */}
              <motion.section {...fadeUp} className="mb-12 text-center">
                <EntityVisual
                  name={entity.name}
                  emoji={entity.emoji}
                  type={entity.category}
                  category={entity.category}
                  size={72}
                  shape="circle"
                  className="mx-auto mb-4"
                />
                <p className="font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-2">
                  {entity.name}
                </p>
                <p className="text-sm text-muted mb-6">
                  {CATEGORY_LABELS[entity.category] || entity.category} · {entity.context.keyThemes.slice(0, 3).join(" · ")}
                </p>

                {chinese && (
                  <>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
                      Una conexión con tu mapa
                    </p>
                    <p className="text-sm text-foreground font-medium mb-8">
                      {formatAnimalSimple(chinese.entityAnimal)} · {chinese.label}
                    </p>

                    {/* 3. Evidencia */}
                    <div className="mb-8 px-4">
                      <p className="text-sm text-foreground leading-relaxed max-w-md mx-auto">
                        {chinese.evidence || entity.context.description}
                      </p>
                    </div>
                  </>
                )}
              </motion.section>

              {/* 4. Cómo se obtiene */}
              <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-metodo">
                <CollapsibleSection title="Cómo se obtiene este resultado" id="section-metodo">
                  <p className="text-xs text-muted leading-relaxed">
                    El zodíaco chino compara tu animal con el de {entity.name} usando la relación
                    tradicional entre animales del ciclo de 12 años — el mismo motor que usan las
                    páginas de afinidad. La numerología compara tu Camino de Vida real con el número
                    simbólico asignado a {entity.name}: solo se lee una coincidencia cuando el número
                    es exactamente el mismo. La astrología occidental compara el elemento tradicional
                    de cada signo solar (fuego, tierra, aire, agua). El arquetipo se muestra como dato
                    descriptivo: no existe una regla documentada de compatibilidad entre arquetipos
                    distintos, así que no se interpreta.
                  </p>
                </CollapsibleSection>
              </motion.section>

              {/* 5. Lecturas por sistema */}
              <motion.section {...fadeUp} className="mb-12">
                <SectionHeader title="Lecturas por sistema" />
                <div className="space-y-3">
                  {chinese && (
                    <CollapsibleSection title="Zodiaco chino">
                      <div className="space-y-3 mb-4">
                        <DataRow label="Tu animal" value={formatAnimalSimple(chinese.userAnimal)} />
                        <DataRow label={`Animal de ${entity.name}`} value={formatAnimalSimple(chinese.entityAnimal)} />
                        {chinese.eventLabel && (
                          <>
                            <DataRow label="Evento" value={`${chinese.eventLabel} (${chinese.eventYear})`} />
                            <DataRow label="Fuente" value={chinese.eventSource || ""} />
                          </>
                        )}
                      </div>
                      <div className="h-px bg-border my-4" />
                      <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Lectura simbólica</p>
                      <p className="text-sm text-foreground leading-relaxed">{chinese.description}</p>
                    </CollapsibleSection>
                  )}

                  {numerology && (
                    <CollapsibleSection title="Numerología">
                      <div className="space-y-3 mb-4">
                        <DataRow label="Tu Camino de Vida" value={String(numerology.userLifePath)} />
                        <DataRow label={`Camino de Vida de ${entity.name}`} value={String(numerology.entityLifePath)} />
                      </div>
                      {numerology.sameNumber && (
                        <>
                          <div className="h-px bg-border my-4" />
                          <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Lectura simbólica</p>
                          <p className="text-sm text-foreground leading-relaxed">
                            Comparten el mismo número de Camino de Vida.
                          </p>
                        </>
                      )}
                    </CollapsibleSection>
                  )}

                  {astrology && (
                    <CollapsibleSection title="Astrología occidental">
                      <div className="space-y-3 mb-4">
                        <DataRow label="Tu signo solar" value={`${astrology.userSign} (${astrology.userElement})`} />
                        <DataRow label={`Signo de ${entity.name}`} value={`${astrology.entitySign} (${astrology.entityElement})`} />
                      </div>
                      {astrology.reading && (
                        <>
                          <div className="h-px bg-border my-4" />
                          <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Lectura simbólica</p>
                          <p className="text-sm text-foreground leading-relaxed capitalize">{astrology.reading}</p>
                        </>
                      )}
                    </CollapsibleSection>
                  )}

                  {entity.symbolism.archetype && (
                    <CollapsibleSection title="Arquetipos">
                      <div className="space-y-3">
                        <DataRow label="Tu arquetipo" value={profile.archetype} />
                        <DataRow label={`Arquetipo de ${entity.name}`} value={entity.symbolism.archetype} />
                      </div>
                      <p className="text-xs text-muted italic mt-4">
                        Dato descriptivo — no hay una regla tradicional documentada para comparar arquetipos entre sí.
                      </p>
                    </CollapsibleSection>
                  )}
                </div>
              </motion.section>

              {/* 6. Exploración */}
              {otherEntities.length > 0 && (
                <motion.section {...fadeUp} className="mb-12">
                  <SectionHeader title="Explorá otras conexiones" />
                  <div className="divide-y divide-border border-t border-b border-border">
                    {otherEntities.map(({ entity: other, relation }) => (
                      <Link
                        key={other.id}
                        href={`/compatibility/${other.id}`}
                        className="flex items-center justify-between gap-4 py-4 hover:bg-muted/20 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <EntityVisual
                            name={other.name}
                            emoji={other.emoji}
                            type={other.category}
                            category={other.category}
                            size={32}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{other.name}</p>
                            <p className="text-xs text-muted">{CATEGORY_LABELS[other.category] || other.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-accent uppercase tracking-wide">{relation.label}</span>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-card rounded-md border border-border text-center space-y-2">
                <p className="text-xs text-muted">
                  Resultado para <span className="font-medium">{profile.name || "vos"}</span> con {entity.name}
                </p>
                <p className="text-xs text-muted">
                  Lectura simbólica basada en zodíaco chino, numerología y astrología occidental — no una medición científica.
                </p>
              </div>

              {/* Share */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-wider text-muted hover:text-accent transition-colors border border-border hover:border-accent rounded-md"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Compartir resultado
                </button>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
