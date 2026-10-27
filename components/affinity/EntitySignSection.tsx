import { useL } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
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
  const L = useL();
  const friends = ANIMAL_PROFILES[animal].harmonyPartners;
  const enemy = getClashPartner(animal);
  const own = lunarYearsOf(animal);

  return (
    <section aria-labelledby="section-signo-chino">
      <h2 id="section-signo-chino" className="section-title text-foreground mb-4">{L(<>
        El signo chino de {name}: {animal}
      </>, <>The Chinese sign of {name}: {animal}</>)}</h2>
      <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed mb-8 max-w-3xl">{L(<>
        {eventLabel} el {corta(eventDate)}, en el año del{" "}
        <Link href={signoHref(animal)} className="underline underline-offset-4 decoration-dotted hover:text-accent">
          {animal}
        </Link>{" "}
        del calendario chino. En Molino la afinidad se mide signo contra signo: el tuyo, según tu fecha de
        nacimiento, contra el de {name}.
      </>, <>{eventLabel} on {corta(eventDate)}, in the year of the{" "}<Link href={signoHref(animal)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{animal}</Link>{" "}in the Chinese calendar. On Molino, affinity is measured sign against sign: yours, according to your date of birth, against that of {name}.</>)}</p>

      <dl className="border-t-2 border-ink max-w-4xl divide-y divide-ink/15">
        <div className="py-5">
          <dt className="font-display text-2xl text-foreground">{L(<>Mismo signo: {animal}</>, <>Same sign: {animal}</>)}</dt>
          <dd className="text-lg text-muted leading-relaxed mt-2">
            {L("Resonás más con ", "You resonate most with")} {name} {L(" si naciste entre", " if you were born between")}{" "}
            {own.map((r, i) => (
              <span key={r.year}>{L(<>
                {corta(r.start)} y {corta(r.end)}
                {i < own.length - 2 ? "; " : i === own.length - 2 ? " o " : "."}
              </>, <>{corta(r.start)} and {corta(r.end)}{i < own.length - 2 ? "; " : i === own.length - 2 ? " or " : "."}</>)}</span>
            ))}
          </dd>
        </div>
        <div className="py-5">
          <dt className="font-display text-2xl text-foreground">
            {L("Sus dos amigos (三合 San He):", "Its two friends (三合 San He):")}{" "}
            {friends.map((f, i) => (
              <span key={f}>
                <Link href={signoHref(f)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{f}</Link>
                {i === 0 ? " y " : ""}
              </span>
            ))}
          </dt>
          <dd className="text-lg text-muted leading-relaxed mt-2">
            {L("También resuena con quienes nacieron en años ", "It also resonates with people born in years of the")} {friends.join(" o ")}:{" "}
            {friends.map((f) => `${f}, ${lunarYearsOf(f).map((r) => r.year).join(", ")}`).join("; ")}.
          </dd>
        </div>
        {enemy && (
          <div className="py-5">
            <dt className="font-display text-2xl text-foreground">{L(<>
              Su enemigo (六冲 Liu Chong):{" "}
              <Link href={signoHref(enemy)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{enemy}</Link>
            </>, <>Its enemy (六冲 Liu Chong):{" "}<Link href={signoHref(enemy)} className="underline underline-offset-4 decoration-dotted hover:text-accent">{enemy}</Link></>)}</dt>
            <dd className="text-lg text-muted leading-relaxed mt-2">
              {L("La energía opuesta. Si naciste en año ", "The opposite energy. If you were born in a year of the")} {enemy} ({lunarYearsOf(enemy).map((r) => r.year).join(", ")}),
              {" "}{L("la de ", "the one with")} {name} {L(" es la relación que conviene evitar.", " is the relationship best avoided.")}
            </dd>
          </div>
        )}
      </dl>
      <p className="text-base text-muted mt-6 max-w-3xl">{L("El año chino empieza entre el 21 de enero y el 21 de febrero: si naciste en esas semanas, mirá el rango exacto en la página de tu signo.", "The Chinese year starts between January 21 and February 21: if you were born in those weeks, check the exact range on your sign's page.")}</p>
    </section>
  );
}
