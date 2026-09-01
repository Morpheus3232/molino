import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LEVELS = [
  {
    n: "01",
    name: "El Mapa",
    question: "¿Qué hay?",
    body: "Tus coordenadas exactas en los tres sistemas, con la cuenta que las produce a la vista, y dónde tocan el mundo.",
    tag: "Gratis",
    href: "/onboarding",
    cta: "Crear mi mapa",
  },
  {
    n: "02",
    name: "La Lectura",
    question: "¿Qué significa junto?",
    body: "Dónde dos o tres sistemas coinciden, dónde se contradicen, y qué NO se puede afirmar de vos. La síntesis, no un resumen.",
    tag: "Gratis",
    href: "/ejemplo",
    cta: "Ver un ejemplo",
  },
  {
    n: "03",
    name: "Preguntale",
    question: "¿Y en mi caso?",
    body: "Tu mapa entero —patrones, cruces, tensiones e incertidumbre— se pone al servicio de una pregunta tuya. La IA piensa con tus coordenadas, no las impone.",
    tag: "Pro",
    href: "/ai",
    cta: "Cómo funciona",
  },
];

export default function MapToReadingSection() {
  return (
    <section className="bg-background border-b border-border px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Cómo se lee
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Primero la estructura.{" "}
            <em className="text-gradient-warm">Después el sentido.</em>
          </h2>
        </div>

        <ol className="border-t border-border">
          {LEVELS.map((l) => (
            <li
              key={l.n}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-x-8 gap-y-3 items-baseline py-8 sm:py-10 border-b border-border"
            >
              <div className="flex items-baseline gap-4 md:w-56">
                <span className="font-mono text-xs text-accent tracking-[0.2em]">{l.n}</span>
                <span className="font-display italic text-2xl text-foreground">{l.name}</span>
              </div>

              <div className="max-w-xl">
                <p className="font-heading text-sm font-bold text-foreground">{l.question}</p>
                <p className="text-sm text-muted leading-relaxed mt-1.5">{l.body}</p>
              </div>

              <div className="flex items-center gap-5 md:justify-end shrink-0">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    l.tag === "Pro" ? "text-accent" : "text-muted"
                  }`}
                >
                  {l.tag}
                </span>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-foreground hover:text-accent transition-colors whitespace-nowrap"
                >
                  {l.cta}
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-muted leading-relaxed max-w-2xl">
          Los dos primeros niveles corren enteros en tu navegador, sin cuenta
          ni registro. El tercero necesita mandarle tu mapa a un modelo para
          poder responder.{" "}
          <Link
            href="/privacidad"
            className="group inline-flex items-center gap-1.5 text-accent font-medium underline-offset-4 hover:underline"
          >
            Política de privacidad
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </p>
      </div>
    </section>
  );
}