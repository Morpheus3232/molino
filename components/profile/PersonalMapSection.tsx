"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { editorialReveal } from "@/lib/utils/motion";
import { encodeProfileData } from "@/lib/utils/profileShare";
import {
  MapPin,
  Car,
  Shirt,
  GraduationCap,
  Trophy,
  Users,
  Clapperboard,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import {
  buildPersonalMap,
  type AnimalRelationEntry,
  type MapDomain,
  type RelationGroup,
  type MapRelation,
  type DomainId,
} from "@/lib/engines/personalMapEngine";

/**
 * EL MAPA APLICADO — la parte de "Mi Mapa" que sale del retrato y aterriza en
 * decisiones: dónde vivir, adónde ir, cómo vestirse, qué manejar, dónde
 * estudiar, de qué equipo sentirse, con quién comparte el año, qué mirar.
 *
 * Una sola regla: tu signo contra el signo del año de origen de cada
 * entidad, y de ese cruce solo tres casillas — tu propio signo, tus dos
 * amigos, tu enemigo. Como la regla es categórica, la página agrupa en vez
 * de rankear: no hay un "87 sobre 100" que sugiera una precisión que el
 * sistema no tiene. Cada grupo lleva su regla escrita al lado, comprobable
 * contra las tablas del ciclo.
 *
 * Menú interactivo de categorías para navegar por dominios de afinidad sin
 * saturar el espacio, con enlaces directos a cada sección del Atlas
 * prefiltrada con el animal del usuario.
 */

const NUMERAL = ["01", "02", "03", "04", "05", "06", "07"];

/** La palabra corta de cada casilla, para la tabla del ciclo. */
const KIND_SHORT: Record<MapRelation, string> = {
  mismo: "vos",
  amigo: "amigo",
  enemigo: "enemigo",
  otro: "—",
};

/** Peso visual por casilla bajo la paleta editorial. */
const KIND_TONE: Record<MapRelation, { accent: string; bar: string; badge?: string }> = {
  mismo: { accent: "text-accent", bar: "bg-accent" },
  amigo: { accent: "text-accent/80", bar: "bg-accent/60" },
  enemigo: {
    accent: "text-foreground",
    bar: "bg-accent",
    badge: "bg-accent/10 border border-accent/30 rounded-sm px-1.5 py-0.5 text-accent font-semibold",
  },
  otro: { accent: "text-muted", bar: "bg-border" },
};

/** Dominios secundarios donde se prioriza acotar la cantidad visible inicial. */
const SECONDARY_DOMAINS = new Set(["cancha", "gente", "pantalla"]);

/** Tipos sin ruta de ficha propia — ver components/atlas/EntityCard.tsx. */
const SIN_FICHA = new Set(["football_player"]);

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

interface DomainMetaInfo {
  icon: typeof MapPin;
  atlasLinks: (animal: string) => { label: string; href: string }[];
}

const DOMAIN_EXTRA_META: Record<DomainId, DomainMetaInfo> = {
  territorio: {
    icon: MapPin,
    atlasLinks: (animal) => [
      { label: `Ver Países de ${animal} en Atlas`, href: `/affinity/country?animal=${encodeURIComponent(animal)}` },
      { label: `Ver Ciudades de ${animal} en Atlas`, href: `/affinity/city?animal=${encodeURIComponent(animal)}` },
    ],
  },
  autos: {
    icon: Car,
    atlasLinks: (animal) => [
      { label: `Ver Autos de ${animal} en Atlas`, href: `/affinity/brand?animal=${encodeURIComponent(animal)}` },
    ],
  },
  vestimenta: {
    icon: Shirt,
    atlasLinks: (animal) => [
      { label: `Ver Vestimenta de ${animal} en Atlas`, href: `/affinity/brand?animal=${encodeURIComponent(animal)}` },
    ],
  },
  aula: {
    icon: GraduationCap,
    atlasLinks: (animal) => [
      { label: `Ver Universidades de ${animal} en Atlas`, href: `/affinity/university?animal=${encodeURIComponent(animal)}` },
    ],
  },
  cancha: {
    icon: Trophy,
    atlasLinks: (animal) => [
      { label: `Ver Clubes de ${animal} en Atlas`, href: `/affinity/team?animal=${encodeURIComponent(animal)}` },
    ],
  },
  gente: {
    icon: Users,
    atlasLinks: (animal) => [
      { label: `Ver Gente Famosa de ${animal} en Atlas`, href: `/affinity/artist?animal=${encodeURIComponent(animal)}` },
    ],
  },
  pantalla: {
    icon: Clapperboard,
    atlasLinks: (animal) => [
      { label: `Ver Películas de ${animal} en Atlas`, href: `/affinity/movie?animal=${encodeURIComponent(animal)}` },
    ],
  },
};

/** Formatea "1903-06-16" como "16 de junio de 1903" sin pasar por Date UTC */
function fechaLarga(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

/** Fila de entidad: el origen documentado, su fecha exacta y el signo que sale de ahí. */
function EntityRow({
  entity,
  animal,
  local,
}: {
  entity: LightweightEntity;
  animal: string;
  local?: boolean;
}) {
  const conFicha = !SIN_FICHA.has(entity.type);
  const Row = conFicha ? Link : "div";
  const rowProps = conFicha ? { href: `/affinity/${entity.type}/${entity.id}` } : {};
  const fecha = fechaLarga(entity.originDate);

  return (
    <li className="border-b border-border/60 last:border-b-0">
      <Row {...(rowProps as { href: string })} className="block py-3.5 sm:py-4 group">
        <span className="flex items-center gap-3.5 sm:gap-4">
          <EntityVisual
            visualType={entity.visualType}
            emoji={entity.emoji}
            imageUrl={entity.imageUrl}
            name={entity.name}
            countryISO={entity.countryISO}
            type={entity.type}
            category={entity.category}
            size={36}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors truncate">
              {entity.name}
            </span>
            {(entity.country && entity.country !== entity.name) || local ? (
              <span className="block font-mono text-xs text-muted truncate mt-0.5">
                {entity.country !== entity.name ? entity.country : ""}
                {local && (
                  <span className="text-accent font-semibold ml-1">
                    {entity.country && entity.country !== entity.name ? "· " : ""}tu país
                  </span>
                )}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 text-right font-mono text-xs tabular-nums">
            <span className="block text-foreground/85 font-medium">{fecha ?? entity.year}</span>
            <span className="block text-accent">año {animal}</span>
          </span>
        </span>

        {entity.originNote && (
          <span className="mt-2 block pl-12 sm:pl-13 text-xs sm:text-sm text-muted leading-relaxed font-serif">
            {entity.originLabel && (
              <span className="font-mono uppercase tracking-[0.14em] text-muted/70 text-[11px]">
                {entity.originLabel} ·{" "}
              </span>
            )}
            {entity.originNote}
          </span>
        )}
      </Row>
    </li>
  );
}

function GroupBlock({
  group,
  domainHref,
  userCountryISO,
  isSecondary,
}: {
  group: RelationGroup<LightweightEntity>;
  domainHref: string;
  userCountryISO: string | null;
  isSecondary?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const tone = KIND_TONE[group.kind];

  const initialLimit = isSecondary || group.kind === "enemigo" ? 3 : 4;
  const hasMoreInline = group.entities.length > initialLimit;
  const visibleEntities = expanded ? group.entities : group.entities.slice(0, initialLimit);
  const restantesAtlas = group.total - group.entities.length;

  return (
    <div className="pt-8 first:pt-0">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`h-2.5 w-2.5 shrink-0 self-center ${tone.bar}`} aria-hidden="true" />
        <h4 className="font-heading text-base sm:text-lg font-bold text-foreground uppercase tracking-tight">
          {group.title}
        </h4>
        {group.chinese && (
          <span className={`font-mono text-xs ${tone.accent}`}>{group.chinese}</span>
        )}
        <span className="font-mono text-xs text-muted tabular-nums ml-auto">
          {group.total} {group.total === 1 ? "entrada" : "entradas"}
        </span>
      </div>

      <p className="mt-2 max-w-2xl font-mono text-xs text-muted/80 leading-relaxed">{group.rule}</p>

      <ul className="mt-4 border-t border-border">
        {visibleEntities.map((e) => (
          <EntityRow
            key={e.id}
            entity={e}
            animal={e.animal}
            local={Boolean(userCountryISO) && e.countryISO === userCountryISO}
          />
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {hasMoreInline && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-xs text-accent hover:text-foreground transition-colors underline decoration-dotted underline-offset-4 py-1"
          >
            {expanded ? "− Ver menos" : `+ Ver más (${group.entities.length - initialLimit} restantes)`}
          </button>
        )}

        {restantesAtlas > 0 && (
          <Link
            href={domainHref}
            className="font-mono text-xs text-muted hover:text-accent transition-colors underline decoration-dotted underline-offset-4 py-1 inline-flex items-center gap-1"
          >
            <span>+ {restantesAtlas} más en el Atlas</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

function DomainBlock({
  domain,
  numeral,
  userAnimal,
  userCountryISO,
}: {
  domain: MapDomain<LightweightEntity>;
  numeral: string;
  userAnimal: string;
  userCountryISO: string | null;
}) {
  if (domain.groups.length === 0) return null;

  const isSecondary = SECONDARY_DOMAINS.has(domain.id);
  const afines = domain.groups.filter((g) => g.kind === "mismo" || g.kind === "amigo");
  const opuesta = domain.groups.find((g) => g.kind === "enemigo") ?? null;
  const meta = DOMAIN_EXTRA_META[domain.id];
  const links = meta?.atlasLinks ? meta.atlasLinks(userAnimal) : [];

  return (
    <motion.section
      {...editorialReveal}
      className="py-12 sm:py-16 border-b border-border last:border-b-0"
      aria-labelledby={`dominio-${domain.id}`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
        <span
          className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold"
          aria-hidden="true"
        >
          {numeral} / {domain.label}
        </span>

        {/* Links directos a la sección del Atlas con el animal preseleccionado */}
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[--radius-sm] text-xs font-mono font-medium border border-ink/15 text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>
          ))}
        </div>
      </div>

      <h3
        id={`dominio-${domain.id}`}
        className="mt-3 font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground uppercase leading-[1.05]"
      >
        {domain.question}
      </h3>

      <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted leading-relaxed font-serif">
        {domain.reading}
      </p>

      <p className="mt-2 max-w-3xl font-mono text-xs text-muted/80 leading-relaxed">
        {domain.scope}
        {domain.descartadas > 0 && (
          <span className="text-muted/60">
            {" "}{domain.descartadas} quedaron afuera por no tener fecha exacta documentada.
          </span>
        )}
      </p>

      {isSecondary && (
        <p className="mt-3 font-mono text-xs text-muted bg-paper-alt border border-border/80 rounded-[--radius-sm] px-3.5 py-2 inline-block">
          Este dominio cuenta con {domain.evaluated} entradas. Se muestran hasta 3 ejemplos por casilla para mantener la lectura ágil.
        </p>
      )}

      {/* Grilla de entidades afines */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {afines.map((g) => (
          <GroupBlock
            key={g.kind}
            group={g}
            domainHref={domain.href}
            userCountryISO={userCountryISO}
            isSecondary={isSecondary}
          />
        ))}
      </div>

      {/* Casilla opuesta (enemigo) */}
      {opuesta && (
        <div className="mt-12 sm:mt-16 border-t border-border pt-8 sm:pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-6">
            Lo que conviene evitar (六冲)
          </p>
          <div className="max-w-3xl">
            <GroupBlock
              group={opuesta}
              domainHref={domain.href}
              userCountryISO={userCountryISO}
              isSecondary={isSecondary}
            />
          </div>
        </div>
      )}

      {/* Botón inferior de derivación al Atlas */}
      <div className="mt-8 pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-border/60">
        <Link
          href={`/affinity/${domain.id === "territorio" ? "country" : domain.id === "autos" || domain.id === "vestimenta" ? "brand" : domain.id === "aula" ? "university" : domain.id === "cancha" ? "team" : domain.id === "gente" ? "artist" : "movie"}?animal=${encodeURIComponent(userAnimal)}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
        >
          <span>Abrir sección completa de {domain.label} en Atlas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.section>
  );
}

/** El ciclo completo: los doce signos y qué es cada uno para vos. */
function CycleTable({ animal, entries }: { animal: string; entries: AnimalRelationEntry[] }) {
  return (
    <motion.div {...editorialReveal} className="border-t border-border pt-10 sm:pt-12 pb-6">
      <div className="max-w-3xl mb-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
          El ciclo entero, leído desde {animal}
        </h3>
        <p className="text-sm sm:text-base text-muted font-serif leading-relaxed">
          Los doce signos del zodíaco chino. Cada entidad del atlas cae en una de estas casillas
          según su fecha de origen documentada: tu propio signo, tus dos amigos (三合 San He) y tu
          energía opuesta (六冲 Liu Chong).
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 border-t border-border">
        {entries.map((e, i) => {
          const tone = KIND_TONE[e.kind];
          const propio = e.kind === "mismo";
          return (
            <li
              key={e.animal}
              className={`flex items-center gap-2.5 py-3 border-b ${
                propio ? "border-accent/40" : "border-border/60"
              }`}
            >
              <span className="font-mono text-xs tabular-nums text-muted/60 shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`h-2 w-2 shrink-0 self-center ${tone.bar}`} aria-hidden="true" />
              <ZodiacAnimalIcon
                animal={e.animal}
                size={16}
                className={`shrink-0 ${propio ? "text-accent" : "text-foreground/70"}`}
              />
              <span
                className={`font-heading text-sm font-bold ${propio ? "text-accent" : "text-foreground"}`}
              >
                {e.animal}
              </span>
              <span
                className={`ml-auto font-mono text-[11px] text-right uppercase tracking-wide ${tone.accent} ${tone.badge ?? ""}`}
              >
                {KIND_SHORT[e.kind]}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function PersonalMapSection({
  profile,
  catalog,
}: {
  profile: UserProfile;
  catalog?: LightweightEntity[];
}) {
  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);

  const userBirthYear = useMemo(() => {
    const y = Number(String(profile.birthDate ?? "").slice(0, 4));
    return Number.isFinite(y) && y > 1900 ? y : null;
  }, [profile.birthDate]);

  const map = useMemo(() => {
    if (!catalog || catalog.length === 0) return null;
    return buildPersonalMap(profile, catalog, { userCountryISO, userBirthYear });
  }, [profile, catalog, userCountryISO, userBirthYear]);

  const visibles = useMemo(() => {
    if (!map) return [];
    return map.domains.filter((d) => d.groups.length > 0 && !d.insuficiente);
  }, [map]);

  const [activeTab, setActiveTab] = useState<DomainId | "all">("territorio");

  // Si cambia el mapa o el dominio activo no está visible, ajustar
  const activeDomain = useMemo(() => {
    if (activeTab === "all") return null;
    return visibles.find((d) => d.id === activeTab) || visibles[0] || null;
  }, [activeTab, visibles]);

  const lecturaHref = useMemo(() => {
    const encoded = encodeProfileData(profile);
    return `/lectura#${encoded}`;
  }, [profile]);

  if (!map || map.domains.length === 0 || visibles.length === 0) return null;

  const enEspera = map.domains.filter((d) => d.insuficiente || d.groups.length === 0);
  const evaluadas = map.domains.reduce((sum, d) => sum + d.evaluated, 0);

  return (
    <section
      className="border-b border-border bg-background text-foreground overflow-hidden"
      aria-labelledby="mapa-aplicado-heading"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* ── Encabezado Resumido ───────────────────────────────────── */}
        <motion.div {...editorialReveal} className="pt-16 lg:pt-24 pb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <p className="font-mono text-xs font-semibold tracking-[0.25em] uppercase text-accent">
              EL MAPA APLICADO
            </p>

            {/* Acceso rápido a Lectura */}
            <Link
              href={lecturaHref}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span>Ver tu Lectura interpretativa →</span>
            </Link>
          </div>

          <h2
            id="mapa-aplicado-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight max-w-4xl text-foreground uppercase leading-[0.95]"
          >
            DÓNDE TU SIGNO
            <br />
            TOCA EL MUNDO.
          </h2>

          <p className="font-serif text-base sm:text-lg mt-5 max-w-3xl leading-relaxed text-muted">
            Sos <strong className="font-semibold text-foreground">{map.animal}</strong>
            {map.element ? ` de ${map.element}` : ""}. Cada país, ciudad, prenda, auto, universidad,
            club, persona y película del atlas también tiene un signo: el del año en que nació.
            Cruzar los dos es todo el cálculo —{" "}
            <strong className="font-semibold text-foreground">
              {evaluadas.toLocaleString("es-AR")} entradas
            </strong>{" "}
            con fecha exacta repartidas en tu propio signo, tus dos amigos y tu enemigo.
          </p>

          {userCountryISO && country && (
            <p className="mt-3 max-w-2xl font-mono text-xs text-muted/90 leading-relaxed border-l-2 border-accent/40 pl-3 py-0.5">
              Dentro de cada casilla van primero hasta tres de {country}, y después el mundo. El
              orden atiende a dónde estás; la afinidad, solo al signo.
            </p>
          )}
        </motion.div>

        {/* ── El ciclo entero, como clave de lectura ────────────────── */}
        <CycleTable animal={map.animal} entries={map.relationMap} />

        {/* ── Menú interactivo de Categorías de Afinidades ──────────── */}
        <div className="mt-12 pt-8 border-t border-border" id="categorias-afinidades">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent block mb-1">
                CATEGORÍAS DE AFINIDAD
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                Elegí qué afinidad explorar
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab((prev) => (prev === "all" ? visibles[0]?.id || "territorio" : "all"))}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:text-foreground transition-colors underline decoration-dotted underline-offset-4 py-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{activeTab === "all" ? "Vista por pestañas" : "Ver todos los rubros juntos"}</span>
            </button>
          </div>

          {/* Selector de pestañas ordenado */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pb-2">
            {visibles.map((domain, index) => {
              const isActive = activeTab === domain.id;
              const meta = DOMAIN_EXTRA_META[domain.id];
              const IconComp = meta?.icon || MapPin;
              const totalAfines = domain.groups
                .filter((g) => g.kind === "mismo" || g.kind === "amigo")
                .reduce((acc, g) => acc + g.total, 0);

              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setActiveTab(domain.id)}
                  className={`text-left p-3.5 sm:p-4 rounded-[--radius-md] border transition-all relative ${
                    isActive
                      ? "bg-paper-alt border-accent text-foreground shadow-sm ring-1 ring-accent"
                      : "bg-background border-border hover:border-ink/30 text-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] text-muted">
                      {NUMERAL[index] || String(index + 1).padStart(2, "0")}
                    </span>
                    <IconComp className={`w-4 h-4 ${isActive ? "text-accent" : "text-muted/70"}`} />
                  </div>

                  <span className="block font-heading text-sm sm:text-base font-bold truncate">
                    {domain.label}
                  </span>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-accent font-semibold">{totalAfines} afines</span>
                    <span className="text-muted/60">{domain.evaluated} tot.</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desglose del Dominio Activo o Todos ─────────────────────── */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "all" ? (
              <motion.div
                key="all-domains"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {visibles.map((d, i) => (
                  <DomainBlock
                    key={d.id}
                    domain={d}
                    numeral={NUMERAL[i] ?? String(i + 1).padStart(2, "0")}
                    userAnimal={map.animal}
                    userCountryISO={map.userCountryISO}
                  />
                ))}
              </motion.div>
            ) : activeDomain ? (
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DomainBlock
                  domain={activeDomain}
                  numeral={
                    NUMERAL[visibles.findIndex((v) => v.id === activeDomain.id)] || "01"
                  }
                  userAnimal={map.animal}
                  userCountryISO={map.userCountryISO}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* ── Banner Puente Hacia Lectura ──────────────────────────── */}
        <motion.div
          {...editorialReveal}
          className="mt-16 p-8 sm:p-10 rounded-[--radius-lg] bg-ink text-paper border border-paper/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light block">
              SÍNTESIS INTERPRETATIVA
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-paper uppercase leading-tight">
              De las afinidades del mundo a tu mundo interno
            </h3>
            <p className="text-sm text-paper/75 font-serif leading-relaxed">
              Tu mapa aplicado conecta tu signo con la realidad exterior. En tu Lectura encontrás
              el cuadro de nacimiento, la convergencia de tus energías y la dirección de tus próximos movimientos.
            </p>
          </div>

          <Link
            href={lecturaHref}
            className="shrink-0 px-6 py-3.5 rounded-[--radius-md] bg-paper text-ink hover:bg-accent hover:text-white font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-colors inline-flex items-center gap-2 relative z-10"
          >
            <span>Ir a tu Lectura personal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── Todavía sin fecha exacta (Colapsable) ─────────────────── */}
        {enEspera.length > 0 && (
          <motion.div {...editorialReveal} className="mt-14 border-t border-border pt-10">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-2 select-none">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                    Todavía sin fecha exacta
                  </span>
                  <span className="font-mono text-xs text-muted/70 tabular-nums">
                    · {enEspera.length} {enEspera.length === 1 ? "dominio en espera" : "dominios en espera"}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted group-open:hidden">
                  [+ Desplegar]
                </span>
                <span className="font-mono text-xs text-accent hidden group-open:inline">
                  [− Colapsar]
                </span>
              </summary>

              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="max-w-2xl text-sm font-serif text-muted leading-relaxed mb-6">
                  Están cargados en el atlas, pero casi ninguna de sus entradas documenta el día
                  exacto de su origen. Mejor anunciarlos pendientes que abrir una sección con pocas
                  opciones adentro.
                </p>
                <ul className="border-t border-border/60 max-w-2xl">
                  {enEspera.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-baseline justify-between gap-4 py-3 border-b border-border/60"
                    >
                      <span className="font-heading text-sm font-bold text-foreground/80">{d.question}</span>
                      <span className="font-mono text-xs text-muted tabular-nums shrink-0">
                        {d.evaluated > 0 ? `${d.evaluated} con fecha · ` : ""}
                        {d.descartadas} sin fecha
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </motion.div>
        )}

        {/* ── Disclaimer final sutil ──────────────────────────────── */}
        <div className="mt-14 pt-8 border-t border-border space-y-4 max-w-3xl">
          <p className="text-xs sm:text-sm text-muted font-serif leading-relaxed">
            <strong className="font-semibold text-foreground">Por qué hay entidades que no aparecen.</strong>{" "}
            El Año Nuevo chino cae entre el 21 de enero y el 21 de febrero: un origen fechado solo
            por año podría pertenecer al signo anterior, y una fecha anterior a 1886 cae fuera de la
            tabla de cortes documentados. En los dos casos el signo no se puede afirmar y la entidad
            queda afuera, aunque siga en el Atlas. Una lista más corta antes que una recomendación
            construida sobre una duda.
          </p>

          <p className="text-xs sm:text-sm text-muted/80 font-serif italic leading-relaxed">
            El cruce es una sola operación sobre dos fechas: la tuya y la de origen de cada entidad,
            cada una llevada a su signo con el corte real del Año Nuevo chino. Que dos fechas caigan
            en la misma casilla del ciclo es comprobable; que eso signifique algo sobre dónde vivir o
            qué usar es una lectura de una tradición, no una medición. El mapa propone; la decisión
            es tuya.
          </p>
        </div>

        <div className="h-16 lg:h-24" />
      </div>
    </section>
  );
}
