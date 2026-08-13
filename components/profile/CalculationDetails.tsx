import type { UserProfile } from "@/types/user";
import { ChevronDown } from "lucide-react";

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
  const birthDate = profile.birthDate || "";
  const lifePath = Number(profile.lifePath) || 0;
  const steps = buildLifePathSteps(birthDate);
  const sunSign = profile.sunSign || "—";
  const animal = profile.chineseZodiac || "—";
  const element = profile.chineseZodiacInfo?.element || "";
  const birthYear = birthDate.slice(0, 4);

  return (
    <details className="group border border-ink/10 rounded-md bg-background/50">
      <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          ¿Cómo se calculó esto?
        </span>
        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
      </summary>

      <div className="space-y-5 px-4 pb-5 pt-1 text-sm text-muted">
        {/* Camino de Vida */}
        <section>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground">
            Camino de Vida
          </h3>
          <p className="mt-2">
            Fecha ingresada:{" "}
            <span className="font-mono text-foreground">{birthDate}</span>
          </p>
          <ol className="mt-1 space-y-1">
            {steps.map((step, i) => (
              <li key={i} className="font-mono">
                <span className="text-foreground">{step.label}</span> ={" "}
                {i === steps.length - 1 ? (
                  <span className="font-mono text-accent">{step.result}</span>
                ) : (
                  step.result
                )}
                {step.master && (
                  <span className="ml-2 font-sans text-xs text-muted">
                    (número maestro, no se reduce)
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-2">
            Camino de Vida:{" "}
            <span className="font-mono text-accent">{lifePath}</span>
          </p>
        </section>

        {/* Signo Solar */}
        <section>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground">
            Signo solar
          </h3>
          <p className="mt-2">
            Rango del signo:{" "}
            <span className="font-mono text-foreground">
              {sunSignSummary(sunSign)}
            </span>
          </p>
          <p>
            Tu fecha cae dentro de este intervalo →{" "}
            <span className="font-mono text-accent">{sunSign}</span>
          </p>
        </section>

        {/* Zodíaco Chino */}
        <section>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground">
            Zodíaco chino
          </h3>
          <p className="mt-2">
            Año {birthYear}: ciclo de 12 animales según el Año Nuevo Chino →{" "}
            <span className="font-mono text-accent">{animal}</span>
          </p>
          <p>
            Elemento:{" "}
            <span className="font-mono text-foreground">
              {element}, del ciclo de 5 elementos {birthYear} años × 2 años)
            </span>
          </p>
        </section>

        <a
          href={FORMULA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-accent hover:text-accent-hover"
        >
          Ver fórmula en GitHub →
        </a>
      </div>
    </details>
  );
}