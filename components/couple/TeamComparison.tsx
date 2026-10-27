"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import { calculatePartnershipCompatibility } from "@/lib/engines/partnershipEngine";
import PartnershipComparison from "@/components/couple/PartnershipComparison";
import { PersonCard } from "@/components/couple/CoupleComparison";

interface TeamComparisonProps {
  profiles: UserProfile[];
  labels: string[];
}

/**
 * Modo Socios con 3 a 5 personas. El motor compara de a dos, así que el
 * equipo se lee como todos sus pares (hasta 10), en el orden en que se
 * cargaron — sin ranking: cada par muestra su nivel y se abre al detalle
 * completo, el mismo que ve una sociedad de dos.
 */
export default function TeamComparison({ profiles, labels }: TeamComparisonProps) {
  const L = useL();
  const pairs = useMemo(
    () =>
      profiles.flatMap((a, i) =>
        profiles.slice(i + 1).map((b, k) => {
          const j = i + 1 + k;
          return { i, j, result: calculatePartnershipCompatibility(a, b) };
        })
      ),
    [profiles]
  );
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((profile, i) => (
          <PersonCard key={i} profile={profile} badgeLabel={labels[i]} colorScheme="blue" />
        ))}
      </div>

      <section aria-labelledby="team-pairs" className="space-y-4">
        <div className="text-center">
          <h2 id="team-pairs" className="font-display text-2xl sm:text-3xl text-foreground">{L("El equipo, de a pares", "The team, in pairs")}</h2>
          <p className="text-sm text-muted mt-2">{L(<>
            {pairs.length} combinaciones entre {profiles.length} personas. Abrí cada una para ver el detalle.
          </>, <>{pairs.length} combinations among {profiles.length} people. Open each one to see the detail.</>)}</p>
        </div>

        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {pairs.map(({ i, j, result }) => {
            const id = `${i}-${j}`;
            const isOpen = open === id;
            return (
              <li key={id} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 group"
                >{L(<>
                  <span className="font-display text-xl text-foreground sm:w-64 shrink-0">
                    {labels[i]} <span className="italic text-muted">y</span> {labels[j]}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-foreground font-semibold label-caps">{result.level}</span>
                    <span className="block text-sm text-muted leading-relaxed mt-1">{result.summary}</span>
                  </span>
                  <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                    {isOpen ? "Cerrar" : "Ver detalle"}
                  </span>
                </>, <><span className="font-display text-xl text-foreground sm:w-64 shrink-0">{labels[i]} <span className="italic text-muted">and</span> {labels[j]}</span><span className="flex-1"><span className="block text-sm text-foreground font-semibold label-caps">{result.level}</span><span className="block text-sm text-muted leading-relaxed mt-1">{result.summary}</span></span><span className="text-sm text-muted group-hover:text-foreground transition-colors">{isOpen ? "Close" : "See detail"}</span></>)}</button>
                {isOpen && (
                  <div className="mt-6">
                    <PartnershipComparison profileA={profiles[i]} profileB={profiles[j]} labelA={labels[i]} labelB={labels[j]} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
