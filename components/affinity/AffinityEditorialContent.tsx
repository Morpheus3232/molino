import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";
import { CollapsibleSection, DataRow, SectionHeader } from "@/components/affinity/AffinitySectionPrimitives";
import Link from "next/link";

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

  return (
    <div className="mb-12">
      <AtlasBreadcrumbs
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/affinity", label: "Afinidades" },
          { href: `/affinity/${type}`, label: meta.plural },
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
                {entity.countryISO ? (
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
          <span className="uppercase tracking-[0.15em]">Temas clave</span>
          <span aria-hidden="true"> · </span>
          {entity.keyThemes.join(", ")}
        </p>
      )}

      {primaryEvent && (
        <section className="mb-8" aria-labelledby="section-evento-documentado">
          <CollapsibleSection title="Evento documentado" id="section-evento-documentado" defaultOpen>
            <div className="space-y-3">
              <DataRow label="Hito histórico" value={primaryEvent.label} />
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

    </div>
  );
}
