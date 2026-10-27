import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { metadataFor } from "@/lib/seo";
import { SIGN_FACTS, WESTERN_SIGNS, type WesternSign } from "@/lib/data/facts/astrology-facts";
import { ASPECT_BY_DISTANCE, calculateElementSynergy, type ElementName } from "@/lib/seo/compat-matrix";
import { SIGN_SLUGS, canonicalPairSlug } from "@/lib/seo/programmatic";
import SectionCover from "@/components/ui/SectionCover";

export const generateMetadata = metadataFor({
  title: ["Compatibilidad astrológica: elementos, modalidades y aspectos", "Astrological compatibility: elements, modalities and aspects"],
  description:
    ["Cómo se relacionan los signos según su elemento (Fuego, Tierra, Aire, Agua), su modalidad y la distancia en la rueda. Las reglas clásicas detrás de cada par.", "How the signs relate according to their element (Fire, Earth, Air, Water), their modality and their distance on the wheel. The classical rules behind each pair."],
  path: "/guia/compatibilidad-astrologica",
});

// Todo lo de esta guía sale de las mismas reglas que arman las 78 lecturas de
// /compatibilidad/[par] (lib/seo/compat-matrix.ts): nada escrito a mano por par.
const ELEMENTS: ElementName[] = ["Fuego", "Tierra", "Aire", "Agua"];
const ELEMENT_NOTE = (L: Pick2): Record<ElementName, string> => ({
  Fuego: L("Impulso, entusiasmo, iniciativa.", "Drive, enthusiasm, initiative."),
  Tierra: L("Constancia, sentido práctico, cuerpo.", "Steadiness, practicality, the body."),
  Aire: L("Ideas, palabra, vínculo social.", "Ideas, words, social bonds."),
  Agua: L("Emoción, intuición, cuidado.", "Emotion, intuition, care."),
});
const MODALITIES = (L: Pick2) => ([
  { name: "Cardinal", role: L("Inicia", "Initiates"), text: L("Abre cada estación: arranca, propone, toma la delantera.", "Opens each season: starts, proposes, takes the lead.") },
  { name: "Fijo", role: L("Sostiene", "Sustains"), text: L("Está en el centro de la estación: consolida, persiste, cuida lo que hay.", "Sits in the middle of the season: consolidates, persists, looks after what's there.") },
  { name: "Mutable", role: L("Adapta", "Adapts"), text: L("Cierra la estación: flexibiliza, conecta, prepara el cambio.", "Closes the season: bends, connects, prepares the change.") },
]);

const signsOf = (pick: (s: WesternSign) => boolean) => WESTERN_SIGNS.filter(pick);
const slugOf = (s: WesternSign) => SIGN_SLUGS[WESTERN_SIGNS.indexOf(s)];

const ELEMENT_PAIRS: [ElementName, ElementName][] = [];
ELEMENTS.forEach((a, i) => ELEMENTS.slice(i).forEach((b) => ELEMENT_PAIRS.push([a, b])));

export default function CompatibilidadAstrologicaPage() {
  const L = useL();
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[760px] px-6 sm:px-8 py-16 sm:py-24" id="main-content">
        <nav className="mb-12">{L(<>
          <Link href="/guia" className="text-sm text-accent font-medium hover:underline underline-offset-4 label-caps">
            ← volver a la guía
          </Link>
        </>, <><Link href="/guia" className="text-sm text-accent font-medium hover:underline underline-offset-4 label-caps">← back to the guide</Link></>)}</nav>

        <p className="text-sm text-muted mb-4 label-caps">{L("Astrología · elementos y modalidades", "Astrology · elements and modalities")}</p>
        <h1 className="page-title text-foreground mb-6">{L("Compatibilidad astrológica", "Astrological compatibility")}</h1>
        <p className="text-lg text-foreground/80 leading-relaxed mb-14">{L("La astrología clásica no compara signos por simpatía: mira tres cosas — de qué elemento es cada uno, qué modalidad tiene y a qué distancia quedan en la rueda. Con esas tres reglas se arma la lectura de cualquier par.", "Classical astrology doesn't compare signs by sympathy: it looks at three things — which element each one belongs to, which modality it has and how far apart they sit on the wheel. With those three rules you can build the reading of any pair.")}</p>

        <SectionCover imageKey="guia/compatibilidad-astrologica" priority className="mb-14" />

        <div className="space-y-16 text-base text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">{L("1. Los cuatro elementos", "1. The four elements")}</h2>
            <p className="mb-6">{L("Cada signo pertenece a un elemento, y cada elemento agrupa tres signos. Los del mismo elemento comparten motivaciones; los de elementos afines (Fuego con Aire, Tierra con Agua) se complementan.", "Each sign belongs to an element, and each element groups three signs. Signs of the same element share motivations; those of compatible elements (Fire with Air, Earth with Water) complement each other.")}</p>
            <dl className="border-t border-ink/15">
              {ELEMENTS.map((el) => (
                <div key={el} className="grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr_auto] gap-x-4 gap-y-1 py-3 border-b border-ink/15">
                  <dt className="font-heading text-lg text-foreground">{el}</dt>
                  <dd className="text-foreground">{signsOf((s) => SIGN_FACTS[s].element === el).join(", ")}</dd>
                  <dd className="col-start-2 sm:col-start-3 text-sm text-muted">{ELEMENT_NOTE(L)[el]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">{L("2. Cómo combinan los elementos", "2. How the elements combine")}</h2>
            <p className="mb-6">{L("Las diez combinaciones posibles, con la dinámica que la tradición le asigna a cada una:", "The ten possible combinations, with the dynamic tradition assigns to each one:")}</p>
            <div className="border-t border-ink/15">
              {ELEMENT_PAIRS.map(([a, b]) => {
                const { level, desc } = calculateElementSynergy(a, b);
                return (
                  <div key={`${a}-${b}`} className="py-4 border-b border-ink/15 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <p className="text-foreground">
                      {a === b ? L(`${a} con ${a}`, `${a} with ${a}`) : `${a} y ${b}`}
                      <span className="block text-sm text-muted">{level}</span>
                    </p>
                    <p className="mt-1 sm:mt-0 text-[0.95rem]">{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">{L("3. Las tres modalidades", "3. The three modalities")}</h2>
            <p className="mb-6">{L("La modalidad dice cómo se mueve cada signo. Dos signos de la misma modalidad quieren lo mismo — empezar, sostener o adaptarse — y por eso a veces compiten por el mismo lugar.", "Modality says how each sign moves. Two signs of the same modality want the same thing — to start, to sustain or to adapt — and that's why they sometimes compete for the same place.")}</p>
            <div className="grid gap-px bg-ink/15 border border-ink/15 sm:grid-cols-3">
              {MODALITIES(L).map((m) => (
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
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">{L("4. La distancia en la rueda", "4. Distance on the wheel")}</h2>
            <p className="mb-6">{L("Contando cuántos signos separan a dos personas en la rueda (de 0 a 6) sale el aspecto entre ellos. Es la regla que más pesa en la lectura de un par:", "Counting how many signs separate two people on the wheel (from 0 to 6) gives you the aspect between them. It's the rule that weighs most in the reading of a pair:")}</p>
            <div className="border-t border-ink/15">
              {ASPECT_BY_DISTANCE.map((a, i) => (
                <div key={a.name} className="py-4 border-b border-ink/15 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <p className="text-foreground">
                    <span className="capitalize">{a.name}</span>
                    <span className="block text-sm text-muted tabular-nums">
                      {i === 0 ? L("mismo signo", "same sign") : `${i} ${i === 1 ? "signo" : "signos"} · ${a.angle}°`} · {a.verdict}
                    </span>
                  </p>
                  <p className="mt-1 sm:mt-0 text-[0.95rem]">{L(<>Los dos {a.answer}</>, <>Both {a.answer}</>)}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">{L("Buscá tu par", "Find your pair")}</h2>
            <p className="mb-6">{L("Cada combinación tiene su lectura completa, armada con estas mismas reglas.", "Each combination has its full reading, built with these same rules.")}</p>
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

          <p className="text-sm text-muted border-t border-ink/15 pt-6">{L(<>
            La compatibilidad por signo solar es solo una capa. Con las dos fechas completas, el{" "}
            <Link href="/pareja" className="underline underline-offset-4 hover:text-foreground">Modo Pareja</Link> cruza
            también numerología y zodíaco chino. Ninguna de estas lecturas predice cómo va a ir un vínculo.
          </>, <>Sun-sign compatibility is just one layer. With both full dates, <Link href="/pareja" className="underline underline-offset-4 hover:text-foreground">Couple Mode</Link> also crosses numerology and the Chinese zodiac. None of these readings predicts how a relationship will go.</>)}</p>
        </div>
      </main>
    </div>
  );
}
