"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { type AffinityResult } from "@/lib/engines/affinityEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { UserProfile } from "@/types/user";
import { buildEntityConnectionStory } from "@/lib/engines/entityStoryEngine";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

/**
 * Tu afinidad con una entidad, en el lenguaje de Mi Mapa: el veredicto en
 * grande, la cuenta a la vista (tu año → tu animal; su año → su animal) y la
 * historia detrás. Lo usan el flujo con perfil y el de fecha rápida.
 */
export default function AffinityHero({
  result,
  entity,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  meta?: { label: string; plural: string; icon: string; description: string };
  type?: EntityType;
}) {
  const L = useL();
  // La historia solo necesita tu animal: sirve igual sin perfil guardado.
  const story = buildEntityConnectionStory({ chineseZodiac: result.userAnimal } as UserProfile, entity);
  const headline = story?.headline ?? L(`${entity.name} y vos: ${result.relationship}.`, `${entity.name} and you: ${result.relationship}.`);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h3 className="font-display font-normal text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-foreground max-w-3xl">
        {headline}
      </h3>
      {story?.subtitle && <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl">{story.subtitle}</p>}

      {/* La cuenta: dos años, dos animales */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15 max-w-3xl">
        {[
          { label: L("Tu año de nacimiento", "Your year of birth"), year: result.userYear, animal: result.userAnimal },
          { label: `${entity.name}: ${result.primaryEvent?.label ?? "origen"}`, year: result.entityYear, animal: result.entityAnimal },
        ].map((c) => (
          <div key={c.label} className="bg-background p-6 flex items-center gap-5">
            <ZodiacAnimalIcon animal={c.animal} size={56} className="text-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-muted leading-snug">{c.label}</p>
              <p className="mt-1 font-display text-4xl leading-none text-foreground tabular-nums">{c.year}</p>
              <p className="mt-1 text-lg text-foreground">{c.animal}</p>
            </div>
          </div>
        ))}
      </div>

      {story?.explanation && (
        <p className="mt-8 text-lg sm:text-xl text-foreground/85 leading-relaxed max-w-3xl">{story.explanation}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-base">{L(<>
        <Link href={`/affinity/compare?from=${entity.id}`} className="underline underline-offset-4 hover:no-underline">
          Comparar {entity.name} con otra entrada
        </Link>
        <Link href="/lectura" className="underline underline-offset-4 hover:no-underline">
          Abrir mi lectura completa
        </Link>
      </>, <><Link href={`/affinity/compare?from=${entity.id}`} className="underline underline-offset-4 hover:no-underline">Compare {entity.name} with another entry</Link><Link href="/lectura" className="underline underline-offset-4 hover:no-underline">Open my complete reading</Link></>)}</div>
    </motion.div>
  );
}
