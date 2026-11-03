/**
 * Países del Atlas listos para el viaje: solo los que tienen fecha exacta
 * (es lo único que produce su signo), capital y clima cargados.
 */
import { getEntitiesByType, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { TravelDestination } from "@/lib/engines/travelEngine";
import { CAPITALS } from "./capitals";
import { CLIMATE } from "./climate";
import { ARRIVALS } from "./arrivals";

export function getTravelDestinations(): TravelDestination[] {
  const seen = new Set<string>();
  const out: TravelDestination[] = [];
  for (const e of getEntitiesByType("country").map(toLightweightEntity)) {
    const iso = e.countryISO;
    if (!iso || !e.originDate || e.isApproximate || seen.has(iso)) continue;
    const capital = CAPITALS[iso];
    const climate = CLIMATE[iso];
    if (!capital || !climate) continue;
    seen.add(iso);
    out.push({
      iso,
      name: e.name,
      entityId: e.id,
      animal: e.animal,
      originDate: e.originDate,
      originLabel: e.originLabel,
      originNote: e.originNote,
      flag: e.emoji,
      capital,
      climate,
      arrivals: ARRIVALS[iso]?.[0],
      arrivalsYear: ARRIVALS[iso]?.[1],
    });
  }
  return out;
}
