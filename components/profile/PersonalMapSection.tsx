"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { editorialReveal } from "@/lib/utils/motion";
import {
  buildPersonalMap,
  type AnimalRelationEntry,
  type MapDomain,
  type RelationGroup,
  type MapRelation,
} from "@/lib/engines/personalMapEngine";

/**
 * EL MAPA APLICADO — la parte de "Mi Mapa" que sale del retrato y aterriza en
 * decisiones: dónde vivir, adónde ir, cómo vestirse, qué manejar, dónde
 * estudiar, de qué equipo sentirse, con quién comparte el año, qué mirar.
 *
 * No hay un dominio genérico de "marcas": vestimenta y autos van cada uno por
 * su lado, porque son dos preguntas distintas y ninguna se responde con una
 * lista que mezcle bancos, gaseosas y zapatillas.
 *
 * Una sola regla: tu signo contra el signo del año de origen de cada
 * entidad, y de ese cruce solo tres casillas — tu propio signo, tus dos
 * amigos, tu enemigo. Como la regla es categórica, la página agrupa en vez
 * de rankear: no hay un "87 sobre 100" que sugiera una precisión que el
 * sistema no tiene. Cada grupo lleva su regla escrita al lado, comprobable
 * contra las tablas del ciclo.
 *
 * Jerarquía visual editorial: integrada con el fondo claro/oscuro del perfil,
 * con espaciado amplio, tipografía rigurosa y sin cards con sombras.
 */

const NUMERAL = ["01", "02", "03", "04", "05", "06", "07"];

/** La palabra corta de cada casilla, para la tabla del ciclo. */
const KIND_SHORT: Record<MapRelation, string> = {
  mismo: "vos",
  amigo: "amigo",
  enemigo: "enemigo",
  otro: "—",
};

/**
 * Peso visual por casilla bajo la paleta editorial.
 */
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

/**
 * Formatea "1903-06-16" como "16 de junio de 1903" sin pasar por Date: un
 * `new Date("1903-06-16")` se interpreta en UTC y en zonas al oeste vuelve un
 * día atrás, que en el borde del Año Nuevo chino cambiaría el signo mostrado.
 */
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
  /** La entidad es del país del usuario: va primero y se marca. */
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
          {/* La fecha exacta es el insumo, no un adorno: de ahí sale el signo */}
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

  // Principales: 4 iniciales. Secundarios o enemigo: 3 iniciales.
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
            className="font-mono text-xs text-muted hover:text-accent transition-colors underline decoration-dotted underline-offset-4 py-1"
          >
            + {restantesAtlas} más en el Atlas →
          </Link>
        )}
      </div>
    </div>
  );
}

function DomainBlock({
  domain,
  numeral,
  userCountryISO,
}: {
  domain: MapDomain<LightweightEntity>;
  numeral: string;
  userCountryISO: string | null;
}) {
  if (domain.groups.length === 0) return null;

  const isSecondary = SECONDARY_DOMAINS.has(domain.id);
  const afines = domain.groups.filter((g) => g.kind === "mismo" || g.kind === "amigo");
  const opuesta = domain.groups.find((g) => g.kind === "enemigo") ?? null;

  return (
    <motion.section
      {...editorialReveal}
      className="py-16 sm:py-20 lg:py-24 border-b border-border last:border-b-0"
      aria-labelledby={`dominio-${domain.id}`}
    >
      <div className="flex items-baseline gap-4 flex-wrap">
        <span
          className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold"
          aria-hidden="true"
        >
          {numeral} / {domain.label}
        </span>
      </div>

      <h3
        id={`dominio-${domain.id}`}
        className="mt-2 font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground uppercase leading-[1.0]"
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
        <p className="mt-3 font-mono text-xs text-muted bg-paper-alt border border-border/80 rounded-md px-3.5 py-2 inline-block">
          Este dominio cuenta con {domain.evaluated} entradas. Se muestran hasta 3 ejemplos por casilla para mantener la lectura ágil.
        </p>
      )}

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

      <Link
        href={domain.href}
        className="mt-8 sm:mt-10 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors underline decoration-dotted underline-offset-4"
      >
        Ver las {domain.evaluated} entradas del dominio →
      </Link>
    </motion.section>
  );
}

/** El ciclo completo: los doce signos y qué es cada uno para vos. */
function CycleTable({ animal, entries }: { animal: string; entries: AnimalRelationEntry[] }) {
  return (
    <motion.div {...editorialReveal} className="border-t border-border pt-12 sm:pt-16 pb-6">
      <div className="max-w-3xl mb-8">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
          El ciclo entero, leído desde {animal}
        </h3>
        <p className="text-sm sm:text-base text-muted font-serif leading-relaxed">
          Los doce signos, numerados en el orden del ciclo. Cada signo tiene dos amigos y un
          enemigo, y la cuenta se puede hacer a ojo: los amigos son los dos que están a cuatro
          posiciones (三合 San He) y el enemigo el que está a seis (六冲 Liu Chong), contando en
          círculo. Los otros ocho no dicen nada. Cada entidad del atlas cae en una de estas doce
          casillas según el año en que nació. No hay nada más en el cálculo.
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 border-t border-border">
        {entries.map((e, i) => {
          const tone = KIND_TONE[e.kind];
          const propio = e.kind === "mismo";
          return (
            <li
              key={e.animal}
              className={`flex items-baseline gap-3 py-3.5 border-b ${
                propio ? "border-accent/40" : "border-border/60"
              }`}
            >
              <span className="font-mono text-xs tabular-nums text-muted/60 shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`h-2 w-2 shrink-0 self-center ${tone.bar}`} aria-hidden="true" />
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

  // La fecha de nacimiento ya está en el perfil: la edad no se le pide a
  // nadie. Se usa para acercar primero a las personas de la misma generación
  // (su año de nacimiento está cargado) y para nada más — el atlas no tiene
  // un dato de "para qué edad es" en marcas o autos, y suponerlo sería
  // inventar. Ver la nota de deuda de datos en CLAUDE.md.
  const userBirthYear = useMemo(() => {
    const y = Number(String(profile.birthDate ?? "").slice(0, 4));
    return Number.isFinite(y) && y > 1900 ? y : null;
  }, [profile.birthDate]);

  const map = useMemo(() => {
    if (!catalog || catalog.length === 0) return null;
    return buildPersonalMap(profile, catalog, { userCountryISO, userBirthYear });
  }, [profile, catalog, userCountryISO, userBirthYear]);

  // Silencio explícito: sin catálogo o sin animal resuelto no hay nada
  // verdadero que decir, así que la sección no se monta.
  if (!map || map.domains.length === 0) return null;

  const visibles = map.domains.filter((d) => d.groups.length > 0 && !d.insuficiente);
  if (visibles.length === 0) return null;

  // Dominios que el atlas tiene cargados pero cuyas entradas no llegan al
  // corte de fecha exacta. Se nombran en vez de desaparecer: que falten es un
  // dato sobre los datos, y esconderlo haría parecer que el dominio no existe.
  const enEspera = map.domains.filter((d) => d.insuficiente || d.groups.length === 0);

  const evaluadas = map.domains.reduce((sum, d) => sum + d.evaluated, 0);

  return (
    <section
      className="border-b border-border bg-background text-foreground overflow-hidden"
      aria-labelledby="mapa-aplicado-heading"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* ── Encabezado ───────────────────────────────────────────── */}
        <motion.div {...editorialReveal} className="pt-20 lg:pt-28 pb-12 lg:pb-16">
          <p className="font-mono text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-accent">
            EL MAPA APLICADO
          </p>
          <h2
            id="mapa-aplicado-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight max-w-4xl text-foreground uppercase leading-[0.95]"
          >
            DÓNDE TU SIGNO
            <br />
            TOCA EL MUNDO.
          </h2>
          <p className="font-serif text-base sm:text-lg mt-6 max-w-2xl leading-relaxed text-muted">
            Sos {map.animal}
            {map.element ? ` de ${map.element}` : ""}. Cada país, ciudad, prenda, auto, universidad, club,
            persona y película del atlas también tiene un signo: el del año en que
            nació. Cruzar los dos es todo el cálculo — {evaluadas.toLocaleString("es-AR")} entradas con fecha de
            origen <strong className="font-semibold text-foreground">exacta</strong>, repartidas en las
            tres casillas que el ciclo reconoce: tu propio signo, tus dos amigos y tu enemigo.
          </p>

          {/* El país no cambia una sola afinidad: cambia qué ves primero
              dentro de una casilla que el signo ya decidió. Se dice, para que
              no parezca que el cálculo te favorece por ser de acá. */}
          {userCountryISO && country && (
            <p className="mt-4 max-w-2xl font-mono text-xs text-muted/90 leading-relaxed border-l-2 border-accent/40 pl-3 py-0.5">
              Dentro de cada casilla van primero hasta tres de {country}, y después el mundo. El
              orden atiende a dónde estás; la afinidad, solo al signo.
            </p>
          )}
        </motion.div>

        {/* ── El ciclo entero, como clave de lectura ────────────────── */}
        <CycleTable animal={map.animal} entries={map.relationMap} />

        {/* ── Los dominios aplicados ───────────────────────────────── */}
        <div className="mt-8">
          {visibles.map((d, i) => (
            <DomainBlock
              key={d.id}
              domain={d}
              numeral={NUMERAL[i] ?? String(i + 1).padStart(2, "0")}
              userCountryISO={map.userCountryISO}
            />
          ))}
        </div>

        {/* ── Todavía sin fecha exacta (Colapsable) ─────────────────── */}
        {enEspera.length > 0 && (
          <motion.div {...editorialReveal} className="mt-16 border-t border-border pt-10">
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
        <div className="mt-16 pt-8 border-t border-border space-y-4 max-w-3xl">
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

