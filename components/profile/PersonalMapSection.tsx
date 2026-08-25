"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import {
  buildPersonalMap,
  type AnimalRelationEntry,
  type MapDomain,
  type RelationGroup,
  type MapRelation,
} from "@/lib/engines/personalMapEngine";

/**
 * EL MAPA APLICADO — la parte de "Mi Mapa" que sale del retrato y aterriza en
 * decisiones: dónde vivir, adónde ir, cómo vestirse, qué manejar, de qué
 * equipo sentirse, dónde estudiar, con quién comparte el año, qué mirar.
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
 * Bloque `ink` full-bleed: es el cambio de registro de la página. Arriba se
 * describe cómo está configurada la persona; acá empieza lo que puede hacer
 * con eso.
 */

const NUMERAL = ["01", "02", "03", "04", "05", "06", "07"];

/** La palabra corta de cada casilla, para la tabla del ciclo. */
const KIND_SHORT: Record<MapRelation, string> = {
  mismo: "vos",
  amigo: "amigo",
  enemigo: "enemigo",
  otro: "—",
};

/** Peso visual por casilla. El enemigo no se esconde: se marca. */
const KIND_TONE: Record<MapRelation, { accent: string; bar: string }> = {
  mismo: { accent: "text-accent-light", bar: "bg-accent-light" },
  amigo: { accent: "text-accent-light", bar: "bg-accent-light/60" },
  enemigo: { accent: "text-paper/55", bar: "bg-paper/30" },
  otro: { accent: "text-paper/40", bar: "bg-paper/12" },
};

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
    <li className="border-b border-paper/10">
      <Row {...(rowProps as { href: string })} className="block py-4 group">
        <span className="flex items-center gap-4">
          <EntityVisual
            visualType={entity.visualType}
            emoji={entity.emoji}
            imageUrl={entity.imageUrl}
            name={entity.name}
            countryISO={entity.countryISO}
            size={32}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-base font-bold text-paper group-hover:text-accent-light transition-colors truncate">
              {entity.name}
            </span>
            {(entity.country && entity.country !== entity.name) || local ? (
              <span className="block font-mono text-xs text-paper/40 truncate">
                {entity.country !== entity.name ? entity.country : ""}
                {local && (
                  <span className="text-accent-light/80">
                    {entity.country && entity.country !== entity.name ? " · " : ""}tu país
                  </span>
                )}
              </span>
            ) : null}
          </span>
          {/* La fecha exacta es el insumo, no un adorno: de ahí sale el signo,
              y sin ella la entidad no estaría en esta lista. */}
          <span className="shrink-0 text-right font-mono text-xs tabular-nums">
            <span className="block text-paper/70">{fecha ?? entity.year}</span>
            <span className="block text-accent-light/70">año {animal}</span>
          </span>
        </span>

        {entity.originNote && (
          <span className="mt-2 block pl-12 text-xs text-paper/50 leading-relaxed">
            {entity.originLabel && (
              <span className="font-mono uppercase tracking-[0.14em] text-paper/35">
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
}: {
  group: RelationGroup<LightweightEntity>;
  domainHref: string;
  userCountryISO: string | null;
}) {
  const tone = KIND_TONE[group.kind];
  const restantes = group.total - group.entities.length;

  return (
    <div className="pt-8 first:pt-0">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`h-2.5 w-2.5 shrink-0 self-center ${tone.bar}`} aria-hidden="true" />
        <h4 className="font-heading text-lg font-bold text-paper uppercase tracking-tight">
          {group.title}
        </h4>
        {group.chinese && (
          <span className={`font-mono text-xs ${tone.accent}`}>{group.chinese}</span>
        )}
        <span className="font-mono text-xs text-paper/35 tabular-nums ml-auto">
          {group.total} {group.total === 1 ? "entrada" : "entradas"}
        </span>
      </div>

      <p className="mt-2 max-w-2xl font-mono text-xs text-paper/55 leading-relaxed">{group.rule}</p>

      <ul className="mt-4 border-t border-paper/15">
        {group.entities.map((e) => (
          <EntityRow
            key={e.id}
            entity={e}
            animal={e.animal}
            local={Boolean(userCountryISO) && e.countryISO === userCountryISO}
          />
        ))}
      </ul>

      {restantes > 0 && (
        <Link
          href={domainHref}
          className="mt-3 inline-block font-mono text-xs text-paper/45 hover:text-accent-light transition-colors underline decoration-dotted underline-offset-4"
        >
          + {restantes} más en esta relación →
        </Link>
      )}
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

  // El orden es la recomendación: primero tu propio signo, después el de tus
  // dos amigos, y al final la energía opuesta — que se muestra completa, no
  // plegada: "qué evitar" es una respuesta tan concreta como "qué elegir".
  const afines = domain.groups.filter((g) => g.kind === "mismo" || g.kind === "amigo");
  const opuesta = domain.groups.find((g) => g.kind === "enemigo") ?? null;

  return (
    <section
      className="py-14 border-b border-paper/15 last:border-b-0"
      aria-labelledby={`dominio-${domain.id}`}
    >
      <div className="flex items-baseline gap-5 flex-wrap">
        <span
          className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] text-paper/20"
          aria-hidden="true"
        >
          {numeral}
        </span>
        <h3
          id={`dominio-${domain.id}`}
          className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[0.9] tracking-tight text-paper uppercase"
        >
          {domain.question}
        </h3>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
          {domain.label}
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-sm sm:text-base text-paper/70 leading-relaxed">
        {domain.reading}
      </p>
      <p className="mt-2 max-w-2xl font-mono text-xs text-paper/35 leading-relaxed">
        {domain.scope}
        {domain.descartadas > 0 && (
          <>
            {" "}
            <span className="text-paper/25">
              {domain.descartadas} quedaron afuera por no tener fecha exacta documentada.
            </span>
          </>
        )}
      </p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {afines.map((g) => (
          <GroupBlock key={g.kind} group={g} domainHref={domain.href} userCountryISO={userCountryISO} />
        ))}
      </div>

      {opuesta && (
        <div className="mt-12 border-t border-paper/20 pt-10">
          {/* Solo la etiqueta: la regla y el conteo ya los trae el grupo de
              abajo, repetirlos acá era decir dos veces lo mismo. */}
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40 mb-6">
            Lo que conviene evitar
          </p>
          <div className="max-w-3xl">
            <GroupBlock group={opuesta} domainHref={domain.href} userCountryISO={userCountryISO} />
          </div>
        </div>
      )}

      <Link
        href={domain.href}
        className="mt-10 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent-light hover:text-paper transition-colors underline decoration-dotted underline-offset-4"
      >
        Ver las {domain.evaluated} entradas del dominio →
      </Link>
    </section>
  );
}

/** El ciclo completo: los doce signos y qué es cada uno para vos. */
function CycleTable({ animal, entries }: { animal: string; entries: AnimalRelationEntry[] }) {
  return (
    <div className="border-t border-paper/15 pt-10 pb-4">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40 mb-2">
        El ciclo entero, leído desde {animal}
      </h3>
      <p className="max-w-2xl text-xs text-paper/45 leading-relaxed mb-6">
        Los doce signos, numerados en el orden del ciclo. Cada signo tiene dos amigos y un
        enemigo, y la cuenta se puede hacer a ojo: los amigos son los dos que están a cuatro
        posiciones (三合 San He) y el enemigo el que está a seis (六冲 Liu Chong), contando en
        círculo. Los otros ocho no dicen nada. Cada entidad del atlas cae en una de estas doce
        casillas según el año en que nació. No hay nada más en el cálculo.
      </p>
      {/* La posición en el ciclo va impresa. Sin ella la grilla se llena de
          izquierda a derecha y bajar por una columna saltea de a cuatro
          signos: el orden se lee roto. Numerada, además, las dos reglas se
          pueden contar a ojo — los amigos están a cuatro posiciones, el
          enemigo a seis. */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 border-t border-paper/20">
        {entries.map((e, i) => {
          const tone = KIND_TONE[e.kind];
          const propio = e.kind === "mismo";
          return (
            <li
              key={e.animal}
              className="flex items-baseline gap-3 py-3 border-b border-paper/10"
            >
              <span className="font-mono text-xs tabular-nums text-paper/30 shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`h-2 w-2 shrink-0 self-center ${tone.bar}`} aria-hidden="true" />
              <span
                className={`font-heading text-sm font-bold ${propio ? "text-accent-light" : "text-paper"}`}
              >
                {e.animal}
              </span>
              <span className={`ml-auto font-mono text-xs text-right ${tone.accent}`}>
                {KIND_SHORT[e.kind]}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
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
    <section className="section-full-bleed bg-ink text-paper overflow-hidden">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* ── Encabezado ───────────────────────────────────────────── */}
        <div className="pt-20 lg:pt-28 pb-10 lg:pb-14">
          <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase mb-6 text-accent-light">
            EL MAPA APLICADO
          </p>
          <h2 className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.88] tracking-tight max-w-4xl text-paper">
            DÓNDE TU SIGNO
            <br />
            TOCA EL MUNDO.
          </h2>
          <p className="text-base lg:text-lg mt-8 max-w-xl leading-relaxed text-paper/70">
            Sos {map.animal}
            {map.element ? ` de ${map.element}` : ""}. Cada país, ciudad, auto, prenda, club,
            universidad, persona y película del atlas también tiene un signo: el del año en que
            nació. Cruzar
            los dos es todo el cálculo — {evaluadas.toLocaleString("es-AR")} entradas con fecha de
            origen <strong className="font-normal text-paper">exacta</strong>, repartidas en las
            tres casillas que el ciclo reconoce: tu propio signo, tus dos amigos y tu enemigo.
          </p>

          {/* El país no cambia una sola afinidad: cambia qué ves primero
              dentro de una casilla que el signo ya decidió. Se dice, para que
              no parezca que el cálculo te favorece por ser de acá. */}
          {userCountryISO && country && (
            <p className="mt-4 max-w-xl font-mono text-xs text-paper/45 leading-relaxed">
              Dentro de cada casilla van primero hasta tres de {country}, y después el mundo. El
              orden atiende a dónde estás; la afinidad, solo al signo.
            </p>
          )}
        </div>

        {/* ── El ciclo entero, como clave de lectura ────────────────── */}
        <CycleTable animal={map.animal} entries={map.relationMap} />

        {/* ── Los cuatro dominios ──────────────────────────────────── */}
        <div className="mt-4">
          {visibles.map((d, i) => (
            <DomainBlock
              key={d.id}
              domain={d}
              numeral={NUMERAL[i] ?? String(i + 1)}
              userCountryISO={map.userCountryISO}
            />
          ))}
        </div>

        {enEspera.length > 0 && (
          <div className="mt-14 border-t border-paper/15 pt-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40 mb-2">
              Todavía sin fecha exacta
            </p>
            <p className="max-w-2xl text-sm text-paper/55 leading-relaxed mb-6">
              Están cargados en el atlas, pero casi ninguna de sus entradas documenta el día
              exacto de su origen. Mejor anunciarlos pendientes que abrir una sección con dos
              opciones adentro.
            </p>
            <ul className="border-t border-paper/15 max-w-2xl">
              {enEspera.map((d) => (
                <li
                  key={d.id}
                  className="flex items-baseline justify-between gap-4 py-3 border-b border-paper/10"
                >
                  <span className="font-heading text-sm font-bold text-paper/70">{d.question}</span>
                  <span className="font-mono text-xs text-paper/35 tabular-nums shrink-0">
                    {d.evaluated > 0 ? `${d.evaluated} con fecha · ` : ""}
                    {d.descartadas} sin fecha
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 max-w-2xl text-xs text-paper/50 leading-relaxed">
          <strong className="font-normal text-paper/75">Por qué hay entidades que no aparecen.</strong>{" "}
          El Año Nuevo chino cae entre el 21 de enero y el 21 de febrero: un origen fechado solo
          por año podría pertenecer al signo anterior, y una fecha anterior a 1886 cae fuera de la
          tabla de cortes documentados. En los dos casos el signo no se puede afirmar y la entidad
          queda afuera, aunque siga en el Atlas. Una lista más corta antes que una recomendación
          construida sobre una duda.
        </p>

        <p className="mt-6 max-w-2xl text-xs text-paper/40 italic leading-relaxed">
          El cruce es una sola operación sobre dos fechas: la tuya y la de origen de cada entidad,
          cada una llevada a su signo con el corte real del Año Nuevo chino. Que dos fechas caigan
          en la misma casilla del ciclo es comprobable; que eso signifique algo sobre dónde vivir o
          qué usar es una lectura de una tradición, no una medición. El mapa propone; la decisión
          es tuya.
        </p>

        <div className="h-20 lg:h-28" />
      </div>
    </section>
  );
}
