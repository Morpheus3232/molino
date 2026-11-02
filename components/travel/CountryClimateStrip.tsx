import { getL } from "@/lib/i18n/server";
import { Link } from "@/lib/i18n/navigation";
import { classifyMonth, CLIMATE_THRESHOLDS, type ClimateNormals, type Capital } from "@/lib/engines/travelEngine";

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "Cuándo ir" en la ficha de un país: los doce meses de su capital con el
 * mismo criterio del viaje por tu signo. Server Component: llega en el HTML.
 */
export default async function CountryClimateStrip({
  name,
  animal,
  capital,
  climate,
}: {
  name: string;
  animal: string;
  capital: Capital;
  climate: ClimateNormals;
}) {
  const L = await getL();
  const MONTHS = L.locale === "en" ? MONTHS_EN : MONTHS_ES;
  const verdicts = MONTHS.map((_, m) => classifyMonth(climate, m));
  const ideal = verdicts.map((v, m) => (v.cls === "ideal" ? MONTHS[m] : null)).filter(Boolean) as string[];
  const bueno = verdicts.map((v, m) => (v.cls === "bueno" ? MONTHS[m] : null)).filter(Boolean) as string[];
  const city = L.locale === "en" ? capital.en : capital.es;

  return (
    <section aria-labelledby="cuando-ir" className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pb-16">
      <div className="border-t-2 border-ink pt-8">
        <p className="label-caps text-sm text-muted">{L("Cuándo ir", "When to go")}</p>
        <h2 id="cuando-ir" className="mt-1 font-display text-3xl text-foreground">
          {L(`El clima de ${city}, mes por mes`, `${city}'s weather, month by month`)}
        </h2>
        <p className="mt-2 text-base text-foreground/85 max-w-2xl">
          {ideal.length > 0
            ? L(`Mejores meses para ir a ${name}: ${ideal.join(", ")}.`, `Best months to visit ${L.t(name)}: ${ideal.join(", ")}.`)
            : bueno.length > 0
              ? L(`Ningún mes ideal en la capital; buenos: ${bueno.join(", ")}.`, `No ideal month in the capital; good ones: ${bueno.join(", ")}.`)
              : L("En la capital ningún mes cae dentro de lo agradable para viajar.", "In the capital no month falls within comfortable travel weather.")}
        </p>
        <ol className="mt-6 grid grid-cols-6 sm:grid-cols-12 border-l border-t border-ink/15">
          {verdicts.map((v, m) => (
            <li
              key={m}
              className={`border-r border-b border-ink/15 px-1 py-3 text-center ${v.cls === "ideal" ? "bg-vermilion text-white" : v.cls === "bueno" ? "bg-card" : ""}`}
            >
              <span className="block text-sm label-caps">{MONTHS[m]}</span>
              <span className="block text-lg leading-tight">{Math.round(v.t)}°</span>
              <span className={`block text-xs ${v.cls === "ideal" ? "text-white/85" : "text-muted"}`}>{v.p} mm</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted max-w-2xl">
          {L(
            `En bermellón, ideal (${CLIMATE_THRESHOLDS.ideal.tMin}–${CLIMATE_THRESHOLDS.ideal.tMax} °C de media y hasta ${CLIMATE_THRESHOLDS.ideal.pMax} mm); en gris, bueno (${CLIMATE_THRESHOLDS.bueno.tMin}–${CLIMATE_THRESHOLDS.bueno.tMax} °C y hasta ${CLIMATE_THRESHOLDS.bueno.pMax} mm). Temperatura media y lluvia del mes en la capital, promedio 2001–2025 (NASA POWER).`,
            `In vermilion, ideal (${CLIMATE_THRESHOLDS.ideal.tMin}–${CLIMATE_THRESHOLDS.ideal.tMax} °C average and up to ${CLIMATE_THRESHOLDS.ideal.pMax} mm); in grey, good (${CLIMATE_THRESHOLDS.bueno.tMin}–${CLIMATE_THRESHOLDS.bueno.tMax} °C and up to ${CLIMATE_THRESHOLDS.bueno.pMax} mm). Average temperature and monthly rainfall in the capital, 2001–2025 average (NASA POWER).`,
          )}
        </p>
        <Link
          href={`/affinity/country?animal=${encodeURIComponent(animal)}#viaje`}
          className="mt-5 inline-flex items-center gap-2 text-base text-vermilion underline underline-offset-4 hover:no-underline"
        >
          {L(`Armá un viaje solo entre países ${animal}`, `Plan a trip only among ${L.t(animal)} countries`)}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
