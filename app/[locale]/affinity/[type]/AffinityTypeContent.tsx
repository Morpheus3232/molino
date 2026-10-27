"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { entityLinkRel } from "@/lib/seo/entity-links";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { relacionCon, animalsByKind, type MapRelation } from "@/lib/engines/personalMapEngine";
import { TIER_META } from "@/lib/engines/affinityEngine";
import { getZodiacDisplay, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface AffinityTypeContentProps {
  meta: { label: string; plural: string; icon: string; description: string };
  entities: LightweightEntity[];
  initialAnimal?: string;
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

type RelationGroupKey = MapRelation;

// Solo las tres casillas que dicen algo: tu propio signo → tus dos amigos →
// tu enemigo (lo que conviene evitar). El resto del ciclo no se lista.
const GROUPS: { key: RelationGroupKey; label: string; chinese: string; note?: string }[] = [
  { key: "mismo", label: "Tu propio signo", chinese: "本命" },
  { key: "amigo", label: "Tus dos amigos", chinese: "三合 San He" },
  { key: "enemigo", label: "Tu enemigo", chinese: "六冲 Liu Chong", note: "Lo que conviene evitar." },
];

const PAGE_SIZE = 8;

/**
 * Agrupa por las cuatro casillas del ciclo (relacionCon, la misma regla que
 * Mi Mapa). Liu He y Liu Hai caen en "otro". Una entidad que pasa el filtro
 * de búsqueda SIEMPRE termina en algún grupo, nunca se descarta en silencio.
 */
export function groupByRelation(userAnimal: Animal, sorted: LightAffinityResult[]): Record<RelationGroupKey, LightAffinityResult[]> {
  const groups: Record<RelationGroupKey, LightAffinityResult[]> = { mismo: [], amigo: [], enemigo: [], otro: [] };
  for (const result of sorted) groups[relacionCon(userAnimal, result.animal)].push(result);
  return groups;
}

export default function AffinityTypeContent({ meta, entities, initialAnimal }: AffinityTypeContentProps) {
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const userCountry = useUserContext().country;

  const validInitial = (initialAnimal && ANIMALS.includes(initialAnimal as Animal))
    ? (initialAnimal as Animal)
    : null;

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(validInitial);
  const [searchQuery, setSearchQuery] = useState("");
  const activeAnimal: Animal = selectedAnimal
    ?? ((profile?.chineseZodiac as Animal) || "Rata");

  useEffect(() => {
    if (validInitial) {
      setSelectedAnimal(validInitial);
    }
  }, [validInitial]);

  const sorted = useMemo(
    () => sortLightEntities(activeAnimal, entities, userCountry),
    [activeAnimal, entities, userCountry]
  );

  // Filter results based on search query
  const filteredSorted = useMemo(() => {
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase().trim();
    return sorted.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.country || "").toLowerCase().includes(query) ||
      r.animal.toLowerCase().includes(query)
    );
  }, [sorted, searchQuery]);

  const groups = useMemo(() => groupByRelation(activeAnimal, filteredSorted), [activeAnimal, filteredSorted]);

  const [visibleCounts, setVisibleCounts] = useState<Record<RelationGroupKey, number>>({ mismo: PAGE_SIZE, amigo: PAGE_SIZE, enemigo: PAGE_SIZE, otro: PAGE_SIZE });
  useEffect(() => {
    setVisibleCounts({ mismo: PAGE_SIZE, amigo: PAGE_SIZE, enemigo: PAGE_SIZE, otro: PAGE_SIZE });
  }, [activeAnimal, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        {/* El título va fuera de la espera: así llega en el HTML del servidor
            (Google y quien comparte el enlace lo ven) y no parpadea al montar.
            Solo la lista, que depende del signo del perfil, espera al navegador. */}
        {/* HERO */}
        <div className="border-t border-ink/10 py-6 sm:py-8">
          <nav className="flex items-center gap-2 text-xs text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/affinity" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Afinidad</Link>
            <span>›</span>
            <span className="text-foreground font-medium">{meta.plural}</span>
          </nav>
          <h1 className="page-title text-foreground">
            Cómo resuena cada {meta.label.toLowerCase()}
          </h1>
          <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">
            Cada entidad tiene un signo según su fecha de origen. Se compara signo contra signo con el tuyo: tu propio signo, tus dos amigos, tu enemigo o el resto del ciclo. Una lectura simbólica, no una predicción.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!mounted ? (
            <motion.div key="loading" variants={transitionVariants} initial="enter" animate="show" exit="exit">
              <p className="sr-only" role="status" aria-label="Cargando afinidades...">
                Cargando afinidades...
              </p>
              <div className="animate-pulse border-t border-ink/10 py-8">
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10" />
              </div>
            </motion.div>
          ) : (
            <motion.div key="content" variants={transitionVariants} initial="enter" animate="show" exit="exit">
              {/* SELECTOR DE ANIMAL — los 12 en una grilla pareja, en orden
                  del ciclo. Cada casilla dice qué es respecto del signo
                  elegido (amigo / enemigo), que es como se agrupa la lista. */}
              <div className="border-t border-ink/10 py-8">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <p className="label-micro">Signo</p>
                  <p className="text-xs text-muted" aria-hidden="true">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermilion align-middle mr-1" /> amigo{" "}
                    <span className="mx-1">·</span>
                    <span>✕</span> enemigo
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Elegí un signo del zodíaco chino"
                  className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 border-l border-t border-ink/15"
                >
                  {ANIMALS.map((animal, i) => {
                    const display = getZodiacDisplay(animal);
                    const isActive = animal === activeAnimal;
                    const isMine = profile?.chineseZodiac === animal;
                    const rel = isActive ? "mismo" : relacionCon(activeAnimal, animal);
                    return (
                      <button
                        key={animal}
                        type="button"
                        onClick={() => setSelectedAnimal(animal)}
                        aria-pressed={isActive}
                        aria-label={`${display.name}${isMine ? ", tu signo" : ""}${rel === "amigo" ? `, amigo de ${activeAnimal}` : rel === "enemigo" ? `, enemigo de ${activeAnimal}` : ""}`}
                        className={`group relative flex flex-col items-center justify-center gap-1.5 px-1 pt-4 pb-3 min-h-[96px] border-r border-b border-ink/15 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                          isActive
                            ? "bg-ink text-paper"
                            : "text-foreground hover:bg-ink/[0.04]"
                        }`}
                      >
                        <span
                          className={`absolute top-1.5 left-2 font-mono text-[10px] ${isActive ? "text-paper/50" : "text-muted/60"}`}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {rel === "amigo" && (
                          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-vermilion" aria-hidden="true" />
                        )}
                        {rel === "enemigo" && (
                          <span className="absolute top-1 right-2 text-xs text-muted" aria-hidden="true">✕</span>
                        )}
                        <ZodiacAnimalIcon
                          animal={animal}
                          size={38}
                          className={isActive ? "text-paper" : "text-foreground/80 group-hover:text-foreground"}
                        />
                        <span className="text-sm leading-tight">{display.name}</span>
                        <span
                          className={`h-3 text-[10px] leading-3 label-caps ${isActive ? "text-paper/70" : "text-vermilion"}`}
                          aria-hidden="true"
                        >
                          {isMine ? "tuyo" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted mt-4 leading-relaxed" aria-live="polite">
                  {(() => {
                    const kinds = animalsByKind(activeAnimal);
                    const amigos = kinds.amigo;
                    const enemigo = kinds.enemigo[0];
                    return (
                      <>
                        <span className="text-foreground font-medium">
                          {profile?.chineseZodiac === activeAnimal ? "Tu signo, " : ""}
                          {activeAnimal}
                        </span>
                        {amigos.length > 0 && <> · amigos: {amigos.join(" y ")}</>}
                        {enemigo && <> · enemigo: {enemigo}</>}.
                      </>
                    );
                  })()}
                </p>
              </div>

              {/* SEARCH — Available for all types, shows before selecting entity */}
              <div className="border-t border-ink/10 py-8">
                <p className="label-micro mb-4">Buscar</p>
                <input
                  type="search"
                  placeholder={`Buscar ${meta.plural.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent rounded-lg"
                  aria-label={`Buscar ${meta.plural.toLowerCase()}`}
                />
                {searchQuery && (() => {
                  const shown = groups.mismo.length + groups.amigo.length + groups.enemigo.length;
                  return (
                    <p className="text-sm text-muted mt-2">
                      {shown > 0
                        ? `${shown} resultado${shown !== 1 ? "s" : ""} para "${searchQuery}" entre tu signo, tus amigos y tu enemigo`
                        : `Ningún resultado para "${searchQuery}" entre tu signo, tus amigos y tu enemigo.`}
                    </p>
                  );
                })()}
              </div>

              {/* RESULTADOS AGRUPADOS POR CASILLA: tu signo, tus dos amigos y tu
                  enemigo. El resto del ciclo no se muestra. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAnimal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-ink/10"
                >
                  {GROUPS.map((group) => {
                    const all = groups[group.key];
                    if (all.length === 0) return null;
                    const visible = visibleCounts[group.key];
                    const items = all.slice(0, visible);
                    const hasMore = all.length > visible;
                    return (
                      <div key={group.key} className="py-8 border-b border-ink/10 last:border-b-0">
                        <div className="mb-4">
                          <h2 className="font-heading text-lg font-semibold text-foreground">
                            {group.label}
                            {group.chinese && <span className="text-sm font-normal text-muted"> · {group.chinese}</span>}
                            <span className="text-sm font-normal text-muted"> · {all.length}</span>
                          </h2>
                          {group.note && <p className="text-sm text-muted mt-1">{group.note}</p>}
                        </div>
                        <div className="space-y-0">
                          {items.map((result) => (
                            <ResultRow key={result.id} result={result} href={`/affinity/${result.type}/${result.id}`} />
                          ))}
                        </div>
                        {hasMore && (
                          <button
                            type="button"
                            onClick={() => setVisibleCounts((prev) => ({ ...prev, [group.key]: prev[group.key] + PAGE_SIZE }))}
                            className="mt-4 text-sm text-accent hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                          >
                            Ver más
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ResultRow({
  result,
  href,
}: {
  result: LightAffinityResult;
  href: string;
}) {
  // Tonos de marca (accent/muted) — nunca semáforo verde/rojo.
  const { color: tierColor, label: tierLabel } = TIER_META[result.tier];

  return (
    <Link
      href={href}
      rel={entityLinkRel(result)}
      className="block w-full text-left py-4 border-b border-ink/10 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex items-start sm:items-center gap-4">
        <EntityVisual
          visualType={result.visualType as VisualType}
          emoji={result.emoji}
          imageUrl={result.imageUrl}
          name={result.name}
          type={result.type}
          category={result.category}
          countryISO={result.countryISO}
          size={40}
        />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground group-hover:text-accent transition-colors sm:truncate">
              {result.name}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formatAnimalSimple(result.animal)}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-sm font-display font-semibold label-caps" style={{ color: tierColor }}>{tierLabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
