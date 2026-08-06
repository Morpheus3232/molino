import Link from "next/link";

interface JourneyProps {
  hasProfile?: boolean;
}

const steps: Array<{
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}> = [
  { number: "01", title: "DESCUBRÍ", description: "Creá tu mapa con tu fecha de nacimiento. Sin registro, al instante.", href: "/onboarding", cta: "EMPEZÁ AHORA" },
  { number: "02", title: "ENTENDÉ", description: "Conocé tu mapa de numerología, zodíaco y astrología en un solo lugar.", href: "/profile", cta: "ARMÁ TU MAPA" },
  { number: "03", title: "EXPLORÁ", description: "Descubrí patrones, ciclos y sincronías ocultas en tu perfil.", href: "/explore", cta: "MIRÁ TUS PATRONES" },
  { number: "04", title: "CONECTÁ", description: "Mirá cómo aparecen tus patrones en países, ciudades y marcas.", href: "/affinity", cta: "VER TUS RESONANCIAS" },
  { number: "05", title: "REFLEXIONÁ", description: "Tomá perspectiva con tu lectura completa de todos los sistemas.", href: "/profile", cta: "LEÉ TU MAPA" },
];

export default function Journey({ hasProfile = false }: JourneyProps) {
  const resolved = hasProfile
    ? [
        { ...steps[0], description: "Tu mapa ya está listo: identidad, mundo, círculo y lectura en un solo lugar.", href: "/profile", cta: "VER MI MAPA" },
        ...steps.slice(1),
      ]
    : steps;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <ol className="space-y-8 lg:space-y-10">
          {resolved.map((step, i) => (
            <li key={step.number} className="grid lg:grid-cols-[auto_1fr_auto] gap-8 lg:gap-12 items-center">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-muted/50 shrink-0 lg:shrink-0">{step.number}</span>
              <div className="max-w-2xl">
                <h3 className="font-display uppercase text-2xl sm:text-3xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">{step.description}</p>
              </div>
              <Link
                href={step.href}
                className="shrink-0 group inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors px-4 py-2 border border-accent/30 rounded hover:border-accent/60"
              >
                {step.cta}
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}