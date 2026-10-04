import Link from "next/link";
import { ANIMALS, ANIMAL_PROFILES, getClashPartner, type Animal } from "@/lib/data/animalRelations";
import { CHINESE_NEW_YEAR_DATES } from "@/lib/data/chinese-new-year";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const corta = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
};
const diaAnterior = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

/**
 * Años lunares de `animal` con su rango exacto (de Año Nuevo chino a la
 * víspera del siguiente). 1924-2019 cubre a todo el público de 18 a 99 años.
 */
export function lunarYearsOf(animal: Animal, from = 1924, to = 2019) {
  const idx = ANIMALS.indexOf(animal);
  const out: { year: number; start: string; end: string }[] = [];
  for (let y = from; y <= to; y++) {
    if ((((y - 1900) % 12) + 12) % 12 !== idx) continue;
    const start = CHINESE_NEW_YEAR_DATES[y];
    const next = CHINESE_NEW_YEAR_DATES[y + 1];
    if (start && next) out.push({ year: y, start, end: diaAnterior(next) });
  }
  return out;
}

const signoHref = (a: Animal) => `/conocimiento/zodiaco-chino/${a.toLowerCase()}`;

/**
 * El signo chino de la entidad y con quién resuena, en el HTML del servidor.
 * Antes todo esto se armaba en el cliente y Google veía "Cargando lectura
 * personalizada…": ~90 palabras por ficha. Es dato, no prosa inventada: sale
 * de la fecha exacta y de la regla del sitio (mismo signo → dos amigos 三合 →
 * enemigo 六冲). Sin fecha exacta no se renderiza (CLAUDE.md: fecha exacta o
 * no se muestra).
 */
export default function EntitySignSection({
  name,
  animal,
  eventLabel,
  eventDate,
}: {
  name: string;
  animal: Animal;
  eventLabel: string;
  eventDate: string;
}) {
  const friends = ANIMAL_PROFILES[animal].harmonyPartners;
  const enemy = getClashPartner(animal);
  const own = lunarYearsOf(animal);

  return (
    <section className="mb-10" aria-labelledby="section-signo-chino">
      <h2 id="section-signo-chino" className="font-heading text-xl font-semibold text-foreground mb-3">
        El signo chino de {name}: {animal}
      </h2>
      <p className="text-sm text-foreground leading-relaxed mb-4">
        {eventLabel} el {corta(eventDate)}, en el año del{" "}
        <Link href={signoHref(animal)} className="underline underline-offset-4 decoration-dotted hover:text-accent">
          {animal}
        </Link>{" "}
        del calendario chino. En Molino la afinidad se mide signo contra signo: el tuyo, según tu fecha de
        nacimiento, contra el de {name}.
      </p>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-foreground">Mismo signo: {animal}</dt>
          <dd className="text-muted leading-relaxed mt-1">
            Resonás más con {name} si naciste entre{" "}
            {own.map((r, i) => (
              <span key={r.year}>
                {corta(r.start)} y {corta(r.end)}
                {i < own.length - 2 ? "; " : i === own.length - 2 ? " o " : "."}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">
            Sus dos amigos (三合 San He):{" "}
            {friends.map((f, i) => (
              <span key={f}>
                <Link href={signoHref(f)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{f}</Link>
                {i === 0 ? " y " : ""}
              </span>
            ))}
          </dt>
          <dd className="text-muted leading-relaxed mt-1">
            También resuena con quienes nacieron en años {friends.join(" o ")}:{" "}
            {friends.map((f) => `${f}, ${lunarYearsOf(f).map((r) => r.year).join(", ")}`).join("; ")}.
          </dd>
        </div>
        {enemy && (
          <div>
            <dt className="font-semibold text-foreground">
              Su enemigo (六冲 Liu Chong):{" "}
              <Link href={signoHref(enemy)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{enemy}</Link>
            </dt>
            <dd className="text-muted leading-relaxed mt-1">
              La energía opuesta. Si naciste en año {enemy} ({lunarYearsOf(enemy).map((r) => r.year).join(", ")}),
              {" "}la de {name} es la relación que conviene evitar.
            </dd>
          </div>
        )}
      </dl>
      <p className="text-xs text-muted mt-4">
        El año chino empieza entre el 21 de enero y el 21 de febrero: si naciste en esas semanas, mirá el rango
        exacto en la página de tu signo.
      </p>
    </section>
  );
}
