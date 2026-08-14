import { Suspense } from "react";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import ComparePicker from "./ComparePickerClient";

export default function ComparePickerPage() {
  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
            <p className="sr-only" role="status" aria-label="Cargando...">
              Cargando...
            </p>
            <div className="animate-pulse">
              <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
              <div className="h-8 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
              <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ComparePicker catalog={catalog} />
    </Suspense>
  );
}
