import type { Metadata } from "next";
import Link from "next/link";
import { Hash, Sun, ArrowRight } from "lucide-react";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { ARCHETYPE_DESCRIPTIONS as ARCHETYPE_INTRO, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ANIMAL_PROFILES } from "@/lib/data/animalRelations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Ejemplo de mapa personal",
  description: "Mirá cómo se ve un mapa personal de Molino: una persona, un mapa, muchas señales. Numerología, astrología y zodíaco chino cruzados, con el perfil ficticio de María.",
  alternates: {
    canonical: siteUrl("/ejemplo"),
  },
  openGraph: {
    title: "Ejemplo de mapa personal — Molino",
    description: "Una persona, un mapa, muchas señales: numerología, astrología y zodíaco chino cruzados en un mapa personal. Este es un ejemplo ficticio de cómo se ve el tuyo.",
    type: "article",
    url: siteUrl("/ejemplo"),
    images: [siteUrl("/opengraph-image")],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ejemplo" },
    ],
  },
];

const profile = calculateUserProfile("María", "1990-03-15", { birthPlace: "Buenos Aires, Argentina" });
const archetypeIntro = ARCHETYPE_INTRO[profile.lifePath as keyof typeof ARCHETYPE_INTRO];
const caballo = ANIMAL_PROFILES.Caballo;
const moonSign = "Cáncer";
const risingSign = "Escorpio";

export default function EjemploPage() {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Ejemplo</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-14">
          <Badge variant="muted" className="mb-5">Perfil de ejemplo</Badge>
          <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tight text-foreground leading-[0.95] mb-3">
            María
          </h1>
          <p className="text-base sm:text-lg text-muted/70">
            15 de marzo de 1990 · Buenos Aires, Argentina
          </p>
          <p className="text-sm text-muted/70 max-w-lg mx-auto mt-4 leading-relaxed">
            Una persona, un mapa, muchas señales. Este perfil es ficticio: te mostramos cómo se ve el resultado antes de que ingreses tu propia fecha.
          </p>
        </header>

        {/* Tu mapa — la señal primero */}
        <section aria-labelledby="resumen-heading" className="mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent text-center mb-4">
            Tu mapa
          </p>
          <h2 id="resumen-heading" className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground text-center mb-8">
            Lo que aparece primero
          </h2>
          <Card padding="lg" className="max-w-2xl mx-auto">
            <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed">
              <p>
                María tiene Camino de Vida {profile.lifePath}: nació con una energía de liderazgo natural, la
                necesidad de abrir caminos propios y una fuerte independencia. Es un impulso que empuja hacia
                adelante, hacia decisiones propias antes que heredadas.
              </p>
              <p>
                Su Sol en {profile.sunSign} suaviza ese impulso con intuición y sensibilidad: no lidera a fuerza de
                imponerse, sino leyendo lo que no se dice. Su Luna en {moonSign} profundiza esa escucha emocional,
                y un Ascendente en {risingSign} le da la determinación para sostener lo que empieza.
              </p>
              <p>
                El {profile.chineseZodiacInfo.animal} de {profile.chineseZodiacInfo.element} completa el cruce:
                en el zodíaco chino, 1990 trae una energía de movimiento e independencia. Numerología, astrología
                y zodíaco chino no repiten lo mismo tres veces — se completan.
              </p>
            </div>
          </Card>
        </section>

        <div className="border-t border-ink/10 mb-14" />

        {/* De dónde salen esas señales — los sistemas debajo, como transparencia */}
        <section className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted text-center mb-3">
            Transparencia
          </p>
          <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground text-center mb-10">
            De dónde salen esas señales
          </h2>
          <p className="text-sm text-muted/70 text-center max-w-xl mx-auto mb-12 leading-relaxed">
            Detrás de cada señal hay un sistema de lectura. Así se cruzan tres lenguajes para construir un solo mapa.
          </p>

          {/* Numerología */}
          <section aria-labelledby="numerologia-heading" className="mb-16">
            <div className="flex items-center gap-3 justify-center mb-8">
              <Hash className="w-5 h-5 text-accent" aria-hidden="true" />
              <h3 id="numerologia-heading" className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Numerología
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Número de vida</p>
                <p className="font-display text-5xl font-bold text-foreground mb-2">{profile.lifePath}</p>
                <p className="text-sm text-muted">{profile.archetype}</p>
              </Card>
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Número de expresión</p>
                <p className="font-display text-5xl font-bold text-foreground mb-2">{profile.expressionNumber}</p>
                <p className="text-sm text-muted">Cómo se manifiesta hacia afuera</p>
              </Card>
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Número del alma</p>
                <p className="font-display text-5xl font-bold text-foreground mb-2">{profile.soulNumber}</p>
                <p className="text-sm text-muted">Lo que motiva por dentro</p>
              </Card>
            </div>

            {archetypeIntro && (
              <p className="text-sm text-muted/80 text-center max-w-xl mx-auto leading-relaxed">
                {archetypeIntro}
              </p>
            )}
          </section>

          <div className="border-t border-ink/10 mb-16" />

          {/* Astrología */}
          <section aria-labelledby="astrologia-heading" className="mb-16">
            <div className="flex items-center gap-3 justify-center mb-8">
              <Sun className="w-5 h-5 text-accent" aria-hidden="true" />
              <h3 id="astrologia-heading" className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Astrología
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Signo solar</p>
                <p className="text-4xl mb-2" aria-hidden="true">{ZODIAC_SYMBOLS[profile.sunSign]}</p>
                <p className="font-heading text-lg font-semibold text-foreground">{profile.sunSign}</p>
                <p className="text-sm text-muted mt-1">{profile.element} · {profile.modality}</p>
              </Card>
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Signo lunar</p>
                <p className="text-4xl mb-2" aria-hidden="true">{ZODIAC_SYMBOLS[moonSign]}</p>
                <p className="font-heading text-lg font-semibold text-foreground">{moonSign}</p>
                <p className="text-sm text-muted mt-1">Agua</p>
              </Card>
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Ascendente</p>
                <p className="text-4xl mb-2" aria-hidden="true">{ZODIAC_SYMBOLS[risingSign]}</p>
                <p className="font-heading text-lg font-semibold text-foreground">{risingSign}</p>
                <p className="text-sm text-muted mt-1">Agua</p>
              </Card>
            </div>

            <p className="text-sm text-muted/80 text-center max-w-xl mx-auto leading-relaxed mb-3">
              Con el Sol en {profile.sunSign}, María percibe lo que otros no dicen. {moonSign} en la Luna amplifica esa sensibilidad emocional, mientras {risingSign} como Ascendente le da la profundidad para sostener lo que siente y transformarlo en decisión.
            </p>

            <p className="text-xs text-muted/70 text-center max-w-xl mx-auto leading-relaxed">
              * Luna y Ascendente son ilustrativos en este ejemplo: calcularlos con precisión requiere la hora exacta de nacimiento.
            </p>
          </section>

          <div className="border-t border-ink/10 mb-16" />

          {/* Zodíaco Chino */}
          <section aria-labelledby="zodiaco-heading" className="mb-16">
            <div className="flex items-center gap-3 justify-center mb-8">
              <span className="text-xl" aria-hidden="true">{caballo.emoji}</span>
              <h3 id="zodiaco-heading" className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Zodíaco chino
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 max-w-lg mx-auto">
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Animal</p>
                <p className="text-4xl mb-2" aria-hidden="true">{caballo.emoji}</p>
                <p className="font-heading text-lg font-semibold text-foreground">{profile.chineseZodiacInfo.animal}</p>
                <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                  {caballo.traits.map((trait) => (
                    <Badge key={trait} variant="outline">{trait}</Badge>
                  ))}
                </div>
              </Card>
              <Card padding="lg" className="text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Elemento</p>
                <p className="font-heading text-5xl font-bold text-foreground mb-2">{profile.chineseZodiacInfo.element}</p>
                <p className="text-sm text-muted">Determinación y estructura</p>
              </Card>
            </div>

            <p className="text-sm text-muted/80 text-center max-w-xl mx-auto leading-relaxed">
              El {profile.chineseZodiacInfo.animal} trae movimiento y exploración; el elemento {profile.chineseZodiacInfo.element} agrega determinación y estructura. Juntos, refuerzan la independencia del Camino de Vida {profile.lifePath} y suavizan la intuición de {profile.sunSign} con acción concreta.
            </p>
          </section>
        </section>

        {/* CTA */}
        <section className="text-center border-t border-ink/10 pt-16">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
            ¿Querés ver tu propio mapa?
          </h2>
          <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
            Generá tu mapa personal con tu fecha de nacimiento real.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/">
              Generar mi mapa
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <p className="font-mono text-xs text-muted/70 tracking-wide mt-4">
            Gratis · Sin registro
          </p>
        </section>
      </main>
    </div>
  );
}
