import { useL } from "@/lib/i18n/useL";
import type { UserProfile } from "@/types/user";

const FORMULA_URL =
  "https://github.com/search?q=path%3Alib%2Fengines%2FnumerologyEngine.ts&type=code";

/* Rango de fechas por signo, idéntico a lib/calculations.ts → getZodiacSign. */
const SUN_SIGN_RANGES: Record<string, [string, string]> = {
  "Aries": ["21 mar", "19 abr"],
  "Tauro": ["20 abr", "20 may"],
  "Géminis": ["21 may", "20 jun"],
  "Cáncer": ["21 jun", "22 jul"],
  "Leo": ["23 jul", "22 ago"],
  "Virgo": ["23 ago", "22 sep"],
  "Libra": ["23 sep", "22 oct"],
  "Escorpio": ["23 oct", "21 nov"],
  "Sagitario": ["22 nov", "21 dic"],
  "Capricornio": ["22 dic", "19 ene"],
  "Acuario": ["20 ene", "18 feb"],
  "Piscis": ["19 feb", "20 mar"],
};

const MONTH_NAMES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
] as const;

interface LifePathStep {
  label: string;
  result: number;
  master?: true;
}

/** Reduce los dígitos de la fecha igual que calculateLifePath (con maestros 11/22/33). */
function buildLifePathSteps(birthDate: string): LifePathStep[] {
  const digits = birthDate.replace(/-/g, "");
  const steps: LifePathStep[] = [];
  let sum = digits.split("").reduce((acc, c) => acc + Number(c), 0);
  steps.push({ label: digits.split("").join("+"), result: sum });

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const s = String(sum);
    const next = s.split("").reduce((acc, c) => acc + Number(c), 0);
    steps.push({ label: s.split("").join("+"), result: next });
    sum = next;
  }

  if (sum === 11 || sum === 22 || sum === 33) {
    steps[steps.length - 1].master = true;
  }

  return steps;
}

/** Devuelve el símbolo + el rango de fechas del signo, o los muestra tal cual. */
function sunSignSummary(sign: string): string {
  const range = SUN_SIGN_RANGES[sign];
  return range ? `${range[0]} → ${range[1]}` : sign;
}

export default function CalculationDetails({ profile }: { profile: UserProfile }) {
  const L = useL();
  const birthDate = profile.birthDate || "";
  const lifePath = Number(profile.lifePath) || 0;
  const steps = buildLifePathSteps(birthDate);
  const sunSign = profile.sunSign || "—";
  const animal = profile.chineseZodiac || "—";
  const element = profile.chineseZodiacInfo?.element || "";
  const birthYear = birthDate.slice(0, 4);

  return (
    <section className="border border-ink/10 rounded-md bg-background/50 px-4 py-5 sm:px-5 sm:py-6">
      <h2 className="text-sm text-muted mb-5 label-caps">{L("¿Cómo se calculó esto?", "How was this calculated?")}</h2>

      <div className="space-y-5 text-sm text-muted">
        {/* Camino de Vida */}
        <section>
          <h3 className="text-sm text-foreground label-caps">{L("Camino de Vida", "Life Path")}</h3>
          <p className="mt-2">{L(<>
            Fecha ingresada:{" "}
            <span className="font-mono text-foreground">{L.t(birthDate)}</span>
          </>, <>Date entered:{" "}<span className="font-mono text-foreground">{L.t(birthDate)}</span></>)}</p>
          <ol className="mt-1 space-y-1">
            {steps.map((step, i) => (
              <li key={i} className="font-mono">
                <span className="text-foreground">{L.t(step.label)}</span> ={" "}
                {i === steps.length - 1 ? (
                  <span className="font-mono text-accent">{L.t(step.result)}</span>
                ) : (
                  step.result
                )}
                {step.master && (
                  <span className="ml-2 font-sans text-xs text-muted">{L("(número maestro, no se reduce)", "(master number, not reduced)")}</span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-2">{L(<>
            Camino de Vida:{" "}
            <span className="font-mono text-accent">{L.t(lifePath)}</span>
          </>, <>Life Path:{" "}<span className="font-mono text-accent">{L.t(lifePath)}</span></>)}</p>
        </section>

        {/* Signo Solar */}
        <section>
          <h3 className="text-sm text-foreground label-caps">{L("Signo solar", "Sun sign")}</h3>
          <p className="mt-2">{L(<>
            Rango del signo:{" "}
            <span className="font-mono text-foreground">
              {L.t(sunSignSummary(sunSign))}
            </span>
          </>, <>Range of the sign:{" "}<span className="font-mono text-foreground">{L.t(sunSignSummary(sunSign))}</span></>)}</p>
          <p>{L(<>
            Tu fecha cae dentro de este intervalo →{" "}
            <span className="font-mono text-accent">{L.t(sunSign)}</span>
          </>, <>Your date falls within this range →{" "}<span className="font-mono text-accent">{L.t(sunSign)}</span></>)}</p>
        </section>

        {/* Zodíaco Chino */}
        <section>
          <h3 className="text-sm text-foreground label-caps">{L("Zodíaco chino", "Chinese zodiac")}</h3>
          <p className="mt-2">{L(<>
            Año {birthYear}: ciclo de 12 animales según el Año Nuevo Chino →{" "}
            <span className="font-mono text-accent">{L.t(animal)}</span>
          </>, <>Year {birthYear}: cycle of 12 animals according to Chinese New Year →{" "}<span className="font-mono text-accent">{L.t(animal)}</span></>)}</p>
          <p>{L(<>
            Elemento:{" "}
            <span className="font-mono text-foreground">
              {L.t(element)} — 5 elementos × 2 años cada uno, se repite cada 10
            </span>
          </>, <>Element:{" "}<span className="font-mono text-foreground">{L.t(element)} — 5 elements × 2 years each, repeating every 10</span></>)}</p>
        </section>

        <a
          href={FORMULA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover label-caps"
        >{L("Ver fórmula en GitHub →", "See the formula on GitHub →")}</a>
      </div>
    </section>
  );
}