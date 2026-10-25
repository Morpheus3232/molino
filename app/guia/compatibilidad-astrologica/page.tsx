import Link from "next/link";
import { createRouteMetadata } from "@/lib/seo";
import { SIGN_FACTS, WESTERN_SIGNS, type WesternSign } from "@/lib/data/facts/astrology-facts";
import { ASPECT_BY_DISTANCE, calculateElementSynergy, type ElementName } from "@/lib/seo/compat-matrix";
import { SIGN_SLUGS, canonicalPairSlug } from "@/lib/seo/programmatic";
import SectionCover from "@/components/ui/SectionCover";

export const metadata = createRouteMetadata({
  title: "Compatibilidad astrológica: elementos, modalidades y aspectos",
  description:
    "Cómo se relacionan los signos según su elemento (Fuego, Tierra, Aire, Agua), su modalidad y la distancia en la rueda. Las reglas clásicas detrás de cada par.",
  path: "/guia/compatibilidad-astrologica",
});

// Todo lo de esta guía sale de las mismas reglas que arman las 78 lecturas de
// /compatibilidad/[par] (lib/seo/compat-matrix.ts): nada escrito a mano por par.
const ELEMENTS: ElementName[] = ["Fuego", "Tierra", "Aire", "Agua"];
const ELEMENT_NOTE: Record<ElementName, string> = {
  Fuego: "Impulso, entusiasmo, iniciativa.",
  Tierra: "Constancia, sentido práctico, cuerpo.",
  Aire: "Ideas, palabra, vínculo social.",
  Agua: "Emoción, intuición, cuidado.",
};
const MODALITIES = [
  { name: "Cardinal", role: "Inicia", text: "Abre cada estación: arranca, propone, toma la delantera." },
  { name: "Fijo", role: "Sostiene", text: "Está en el centro de la estación: consolida, persiste, cuida lo que hay." },
  { name: "Mutable", role: "Adapta", text: "Cierra la estación: flexibiliza, conecta, prepara el cambio." },
];

const signsOf = (pick: (s: WesternSign) => boolean) => WESTERN_SIGNS.filter(pick);
const slugOf = (s: WesternSign) => SIGN_SLUGS[WESTERN_SIGNS.indexOf(s)];

const ELEMENT_PAIRS: [ElementName, ElementName][] = [];
ELEMENTS.forEach((a, i) => ELEMENTS.slice(i).forEach((b) => ELEMENT_PAIRS.push([a, b])));

export default function CompatibilidadAstrologicaPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[760px] px-6 sm:px-8 py-16 sm:py-24" id="main-content">
        <nav className="mb-12">
          <Link href="/guia" className="text-sm text-accent font-medium hover:underline underline-offset-4 label-caps">
            ← volver a la guía
          </Link>
        </nav>

        <p className="text-sm text-muted mb-4 label-caps">Astrología · elementos y modalidades</p>
        <h1 className="page-title text-foreground mb-6">Compatibilidad astrológica</h1>
        <p className="text-lg text-foreground/80 leading-relaxed mb-14">
          La astrología clásica no compara signos por simpatía: mira tres cosas — de qué elemento es cada uno, qué
          modalidad tiene y a qué distancia quedan en la rueda. Con esas tres reglas se arma la lectura de cualquier par.
        </p>

        <SectionCover imageKey="guia/compatibilidad-astrologica" priority className="mb-14" />

        <div className="space-y-16 text-base text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">1. Los cuatro elementos</h2>
            <p className="mb-6">
              Cada signo pertenece a un elemento, y cada elemento agrupa tres signos. Los del mismo elemento comparten
              motivaciones; los de elementos afines (Fuego con Aire, Tierra con Agua) se complementan.
            </p>
            <dl className="border-t border-ink/15">
              {ELEMENTS.map((el) => (
                <div key={el} className="grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr_auto] gap-x-4 gap-y-1 py-3 border-b border-ink/15">
                  <dt className="font-heading text-lg text-foreground">{el}</dt>
                  <dd className="text-foreground">{signsOf((s) => SIGN_FACTS[s].element === el).join(", ")}</dd>
                  <dd className="col-start-2 sm:col-start-3 text-sm text-muted">{ELEMENT_NOTE[el]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">2. Cómo combinan los elementos</h2>
            <p className="mb-6">Las diez combinaciones posibles, con la dinámica que la tradición le asigna a cada una:</p>
            <div className="border-t border-ink/15">
              {ELEMENT_PAIRS.map(([a, b]) => {
                const { level, desc } = calculateElementSynergy(a, b);
                return (
                  <div key={`${a}-${b}`} className="py-4 border-b border-ink/15 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <p className="text-foreground">
                      {a === b ? `${a} con ${a}` : `${a} y ${b}`}
                      <span className="block text-sm text-muted">{level}</span>
                    </p>
                    <p className="mt-1 sm:mt-0 text-[0.95rem]">{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">3. Las tres modalidades</h2>
            <p className="mb-6">
              La modalidad dice cómo se mueve cada signo. Dos signos de la misma modalidad quieren lo mismo — empezar,
              sostener o adaptarse — y por eso a veces compiten por el mismo lugar.
            </p>
            <div className="grid gap-px bg-ink/15 border border-ink/15 sm:grid-cols-3">
              {MODALITIES.map((m) => (
                <div key={m.name} className="bg-background p-5">
                  <p className="text-sm text-muted label-caps">{m.role}</p>
                  <p className="font-heading text-xl text-foreground mt-1">{m.name}</p>
                  <p className="text-sm mt-2">{m.text}</p>
                  <p className="text-sm text-foreground mt-3">
                    {signsOf((s) => SIGN_FACTS[s].modality === m.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">4. La distancia en la rueda</h2>
            <p className="mb-6">
              Contando cuántos signos separan a dos personas en la rueda (de 0 a 6) sale el aspecto entre ellos. Es la
              regla que más pesa en la lectura de un par:
            </p>
            <div className="border-t border-ink/15">
              {ASPECT_BY_DISTANCE.map((a, i) => (
                <div key={a.name} className="py-4 border-b border-ink/15 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <p className="text-foreground">
                    <span className="capitalize">{a.name}</span>
                    <span className="block text-sm text-muted tabular-nums">
                      {i === 0 ? "mismo signo" : `${i} ${i === 1 ? "signo" : "signos"} · ${a.angle}°`} · {a.verdict}
                    </span>
                  </p>
                  <p className="mt-1 sm:mt-0 text-[0.95rem]">Los dos {a.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">Buscá tu par</h2>
            <p className="mb-6">Cada combinación tiene su lectura completa, armada con estas mismas reglas.</p>
            <div className="space-y-5">
              {WESTERN_SIGNS.map((a) => (
                <div key={a}>
                  <p className="text-sm text-muted label-caps mb-1.5">{a}</p>
                  <p className="text-sm leading-7">
                    {WESTERN_SIGNS.map((b, j) => (
                      <span key={b}>
                        <Link
                          href={`/compatibilidad/${canonicalPairSlug(slugOf(a), slugOf(b))}`}
                          className="text-foreground underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                        >
                          {b}
                        </Link>
                        {j < WESTERN_SIGNS.length - 1 && <span className="text-muted"> · </span>}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <p className="text-sm text-muted border-t border-ink/15 pt-6">
            La compatibilidad por signo solar es solo una capa. Con las dos fechas completas, el{" "}
            <Link href="/pareja" className="underline underline-offset-4 hover:text-foreground">Modo Pareja</Link> cruza
            también numerología y zodíaco chino. Ninguna de estas lecturas predice cómo va a ir un vínculo.
          </p>
        </div>
      </main>
    </div>
  );
}
