import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { Animal } from "@/lib/data/animalRelations";
import EntitySignSection from "@/components/affinity/EntitySignSection";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import Link from "next/link";
import RelationWheel from "@/components/knowledge/RelationWheel";
import { KnowledgeHero, KnowledgeSection, Note, MARKS, CONTAINER } from "@/components/knowledge/Kit";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { ANIMALS as ANIMAL_ORDER } from "@/lib/data/animalRelations";
import { animalsByKind } from "@/lib/engines/personalMapEngine";
import { entityLinkRel } from "@/lib/seo/entity-links";
import { getAllCountryISOs, getAtlasNeighbors } from "@/lib/data/atlas-queries";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import { affinityListingOf } from "@/lib/data/brand-kinds";

// Solo los países con página en /atlas (los que tienen entidades además de la
// propia ficha de país). Enlazar al resto daba 404: 26 en Search Console.
const ATLAS_ISOS = new Set(getAllCountryISOs());

// formatDisplayDate vive en AffinitySectionPrimitives.tsx ("use client") — no
// se puede invocar como función desde un Server Component, solo importar el
// componente. Copia local mínima de la misma lógica pura (mismo formato que
// usa AffinityDeepDive) para no forzar ese archivo a moverse de boundary.
function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}

/**
 * Capa 1 — contenido editorial público de una entidad Affinity. Server
 * Component puro: sin "use client", sin hooks de perfil, sin localStorage,
 * sin cálculo de afinidad. Se renderiza siempre, con o sin perfil — la
 * personalización (AffinityDetailContent) va debajo, nunca reemplaza esto.
 */
export default function AffinityEditorialContent({
  entity,
  meta,
  children,
}: {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
  children?: React.ReactNode;
}) {
  const primaryEvent = getPrimaryEvent(entity);
  const light = toLightweightEntity(entity);
  const signo = primaryEvent?.date && light.animal && !light.isApproximate ? (light.animal as Animal) : null;

  const kinds = signo ? animalsByKind(signo) : null;
  const nameSize =
    entity.name.length > 26
      ? "text-[clamp(2.25rem,4.6vw,3.75rem)]"
      : entity.name.length > 14
        ? "text-[clamp(2.5rem,6vw,4.75rem)]"
        : undefined;

  return (
    <>
      <KnowledgeHero
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/affinity", label: "Afinidades" },
          { href: `/affinity/${affinityListingOf(entity)}`, label: meta.plural },
          { label: entity.name },
        ]}
        eyebrow={`${meta.label}${entity.country ? ` · ${entity.country}` : ""}${entity.city ? ` · ${entity.city}` : ""}`}
        title={entity.name}
        titleClassName={nameSize}
        lead={entity.description || undefined}
        meta={
          <div className="space-y-2">
            {primaryEvent && (
              <p className="text-lg text-foreground">
                {primaryEvent.label}, {primaryEvent.date ? formatDisplayDate(primaryEvent.date) : `año ${primaryEvent.year}`}
                {signo && <span className="text-muted">: año {signo}.</span>}
              </p>
            )}
            {entity.keyThemes.length > 0 && <p>Temas: {entity.keyThemes.join(", ").toLowerCase()}.</p>}
            {entity.countryISO && ATLAS_ISOS.has(entity.countryISO) && entity.country && (
              <p>
                <Link href={`/atlas/${entity.countryISO}`} className="underline underline-offset-4 hover:no-underline">
                  Todo {entity.country} en el Atlas
                </Link>
              </p>
            )}
          </div>
        }
        legend={
          signo && kinds
            ? [
                { mark: MARKS.ink, text: <>En negro, el signo de {entity.name}: <span className="text-foreground">{signo}</span>.</> },
                { mark: MARKS.trine, text: <>El triángulo rojo lo une con sus dos amigos: <span className="text-foreground">{kinds.amigo.join(" y ")}</span>.</> },
                ...(kinds.enemigo[0] ? [{ mark: MARKS.dashed, text: <>La línea punteada cruza hasta su opuesto: <span className="text-foreground">{kinds.enemigo[0]}</span>.</> }] : []),
              ]
            : undefined
        }
        aside={
          signo ? (
            <RelationWheel
              items={CHINESE_ANIMALS.map((a) => ({ key: a.name, label: a.name, icon: <ZodiacAnimalIcon animal={a.name} size={40} /> }))}
              active={ANIMAL_ORDER.indexOf(signo)}
              center={<ZodiacAnimalIcon animal={signo} size={64} />}
              ariaLabel={`Rueda del zodíaco chino: ${entity.name} es ${signo}.`}
              className="mx-auto max-w-[34rem]"
            />
          ) : (
            <div className="mx-auto max-w-[22rem] aspect-square border border-ink/15 bg-paper-alt flex items-center justify-center">
              <EntityVisual
                visualType={entity.visualType}
                emoji={entity.emoji}
                imageUrl={entity.imageUrl}
                name={entity.name}
                countryISO={entity.countryISO}
                size={180}
                shape="circle"
              />
            </div>
          )
        }
      />

      {/* Lo personal: tu afinidad (con mapa) o la fecha rápida (sin mapa) */}
      {children && (
        <KnowledgeSection label="Tu afinidad">
          {children}
        </KnowledgeSection>
      )}

      {primaryEvent && (
        <KnowledgeSection label="El origen" title="Lo que dice la fecha" tone="alt">
          <dl className="border-t-2 border-ink max-w-4xl divide-y divide-ink/15">
            {[
              ["Hito", primaryEvent.label],
              ...(primaryEvent.description && primaryEvent.description !== entity.sourceNote ? [["Qué pasó", primaryEvent.description]] : []),
              primaryEvent.date ? ["Fecha", formatDisplayDate(primaryEvent.date)] : ["Año", String(primaryEvent.year)],
              ["Fuente", primaryEvent.source],
              ...(entity.sourceNote ? [["Nota", entity.sourceNote]] : []),
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-x-8 gap-y-1 py-4">
                <dt className="font-display text-xl text-foreground">{k}</dt>
                <dd className="text-lg text-foreground/85 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-base text-muted">
            {primaryEvent.date
              ? "Registro con fecha exacta: el signo se puede afirmar."
              : "Solo está documentado el año: si cae entre el 21 de enero y el 21 de febrero, el signo podría ser el anterior."}
          </p>
        </KnowledgeSection>
      )}

      {signo && primaryEvent?.date && (
        <KnowledgeSection label="El signo">
          <EntitySignSection name={entity.name} animal={signo} eventLabel={primaryEvent.label} eventDate={primaryEvent.date} />
        </KnowledgeSection>
      )}

      {signo && <EntityNeighbors entity={entity} animal={signo} />}

      <section className="bg-background">
        <div className={`${CONTAINER} py-12`}>
          <Note>
            <p>
              La afinidad es una lectura simbólica de la tradición del zodíaco chino, no una medición: compara el signo
              del año en que naciste con el del año de origen de cada entrada.
            </p>
          </Note>
        </div>
      </section>
    </>
  );
}

/**
 * Lo que la ficha comparte con otras del Atlas, por dos criterios que se dicen
 * en el título de cada lista: mismo país y signo, o mismo año chino. Sale de
 * las fechas cargadas; no hay ranking.
 */
function EntityNeighbors({ entity, animal }: { entity: SymbolicEntity; animal: Animal }) {
  const n = getAtlasNeighbors(entity.id);
  const lists = [
    entity.country && n.sameCountrySign.length > 0 && {
      id: "section-mismo-signo-pais",
      title: `También ${animal} en ${entity.country}`,
      intro: `${n.sameCountrySignTotal === 1 ? "La otra entrada" : `Las ${n.sameCountrySignTotal} entradas`} del Atlas de ${entity.country} cuyo origen cae en un año ${animal}, como ${entity.name}.`,
      items: n.sameCountrySign,
      total: n.sameCountrySignTotal,
    },
    n.lunarYear !== null && n.sameLunarYear.length > 0 && {
      id: "section-mismo-ano-chino",
      title: `Del mismo año chino: ${animal} de ${n.lunarYear}`,
      intro: `Entradas del Atlas fechadas dentro del mismo año del calendario chino que ${entity.name}${entity.country ? `, primero las de ${entity.country}` : ""}.`,
      items: n.sameLunarYear,
      total: n.sameLunarYearTotal,
    },
  ].filter((l): l is Exclude<typeof l, false | "" | undefined> => Boolean(l));

  if (lists.length === 0) return null;

  return (
    <>
      {lists.map((list) => (
        <section key={list.id} className="bg-background border-b border-ink/10" aria-labelledby={list.id}>
          <div className={`${CONTAINER} py-16 sm:py-20`}>
          <p className="text-sm text-muted mb-3 label-caps">En el Atlas</p>
          <h2 id={list.id} className="section-title text-foreground mb-3">
            {list.title}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-6 max-w-2xl">{list.intro}</p>
          <ul className="divide-y divide-ink/15 border-y-2 border-ink text-base max-w-4xl">
            {list.items.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/affinity/${e.type}/${e.id}`}
                  rel={entityLinkRel(e)}
                  className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-0.5 py-3 min-h-[44px] hover:bg-ink/[0.03] transition-colors"
                >
                  <span className="font-display text-xl text-foreground group-hover:underline underline-offset-4">{e.name}</span>
                  <span className="text-sm text-muted sm:text-right shrink-0">
                    {ENTITY_TYPES[e.type as EntityType]?.label}
                    {e.country && e.country !== entity.country ? ` · ${e.country}` : ""}
                    {" · "}
                    {e.originLabel} {e.originDate && formatDisplayDate(e.originDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {list.total > list.items.length && (
            <p className="text-base text-muted mt-4">
              Y {list.total - list.items.length} más en{" "}
              <Link href={`/atlas/explorar/${animal}`} className="underline underline-offset-4 decoration-dotted hover:text-accent">
                el Atlas, signo {animal}
              </Link>
              .
            </p>
          )}
          </div>
        </section>
      ))}
    </>
  );
}
