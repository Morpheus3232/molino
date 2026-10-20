import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { Animal } from "@/lib/data/animalRelations";
import EntitySignSection from "@/components/affinity/EntitySignSection";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";
import { CollapsibleSection, DataRow, SectionHeader } from "@/components/affinity/AffinitySectionPrimitives";
import Link from "next/link";
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
  type,
}: {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}) {
  const primaryEvent = getPrimaryEvent(entity);
  const light = toLightweightEntity(entity);
  const signo = primaryEvent?.date && light.animal && !light.isApproximate ? (light.animal as Animal) : null;

  return (
    <div className="mb-12">
      <AtlasBreadcrumbs
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/affinity", label: "Afinidades" },
          { href: `/affinity/${affinityListingOf(entity)}`, label: meta.plural },
          { label: entity.name },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <EntityVisual
          visualType={entity.visualType}
          emoji={entity.emoji}
          imageUrl={entity.imageUrl}
          name={entity.name}
          countryISO={entity.countryISO}
          size={56}
          shape="circle"
        />
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.1]">
            {entity.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted mt-1">
            <span>{meta.label}</span>
            {entity.country && (
              <>
                <span aria-hidden="true">·</span>
                {entity.countryISO && ATLAS_ISOS.has(entity.countryISO) ? (
                  <Link
                    href={`/atlas/${entity.countryISO}`}
                    className="text-foreground hover:text-accent underline underline-offset-4 decoration-dotted transition-colors"
                  >
                    {entity.country}
                  </Link>
                ) : (
                  <span>{entity.country}</span>
                )}
              </>
            )}
            {entity.city && (
              <>
                <span aria-hidden="true">·</span>
                <span>{entity.city}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {entity.description && (
        <p className="text-sm text-foreground leading-relaxed mb-6">{entity.description}</p>
      )}

      {entity.keyThemes.length > 0 && (
        <p className="text-xs text-muted mb-8">
          <span className=" label-caps">Temas clave</span>
          <span aria-hidden="true"> · </span>
          {entity.keyThemes.join(", ")}
        </p>
      )}

      {primaryEvent && (
        <section className="mb-8" aria-labelledby="section-evento-documentado">
          <CollapsibleSection title="Evento documentado" id="section-evento-documentado" defaultOpen>
            <div className="space-y-3">
              <DataRow label="Hito histórico" value={primaryEvent.label} />
              {primaryEvent.description && primaryEvent.description !== entity.sourceNote && (
                <DataRow label="Qué pasó" value={primaryEvent.description} />
              )}
              {primaryEvent.date ? (
                <DataRow label="Fecha documentada" value={formatDisplayDate(primaryEvent.date)} />
              ) : (
                <DataRow label="Año documentado" value={String(primaryEvent.year)} />
              )}
              <DataRow label="Fuente" value={primaryEvent.source} />
              {entity.sourceNote && <DataRow label="Nota de registro" value={entity.sourceNote} />}
            </div>
            <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${primaryEvent.date ? "bg-success" : "bg-accent"}`} />
              {primaryEvent.date ? "Registro histórico con fecha exacta" : "Registro histórico con año documentado"}
            </p>
          </CollapsibleSection>
        </section>
      )}

      {signo && primaryEvent?.date && (
        <EntitySignSection name={entity.name} animal={signo} eventLabel={primaryEvent.label} eventDate={primaryEvent.date} />
      )}

      {signo && <EntityNeighbors entity={entity} animal={signo} />}
    </div>
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
        <section key={list.id} className="mb-10" aria-labelledby={list.id}>
          <h2 id={list.id} className="font-heading text-xl font-semibold text-foreground mb-3">
            {list.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">{list.intro}</p>
          <ul className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
            {list.items.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/affinity/${e.type}/${e.id}`}
                  className="flex items-baseline justify-between gap-4 py-2.5 min-h-[44px] hover:text-accent transition-colors"
                >
                  <span className="text-foreground">{e.name}</span>
                  <span className="text-xs text-muted text-right shrink-0">
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
            <p className="text-xs text-muted mt-3">
              Y {list.total - list.items.length} más en{" "}
              <Link href={`/atlas/explorar/${animal}`} className="underline underline-offset-4 decoration-dotted hover:text-accent">
                el Atlas, signo {animal}
              </Link>
              .
            </p>
          )}
        </section>
      ))}
    </>
  );
}
