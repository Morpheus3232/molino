import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Fecha",
    body: "Ingresá tu fecha de nacimiento. Solo eso. No te pedimos nombre, email ni nada más.",
  },
  {
    step: "02",
    title: "Cálculo local",
    body: "Los tres sistemas corren en tu navegador. Tu fecha nunca sale de tu dispositivo. El código es abierto.",
  },
  {
    step: "03",
    title: "Mapa",
    body: "Obtenés tu patrón: Camino de Vida, signo solar, animal chino, y cómo se cruzan entre sí.",
  },
];

export default function OpenKnowledgeSection() {
  return (
    <section className="bg-background border-b border-border px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Aprendé cómo funciona
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Sin misterio.{" "}
            <em className="text-gradient-warm">Matemática visible.</em>
          </h2>
        </div>

        <ol className="border-t border-border">
          {HOW_IT_WORKS.map((item) => (
            <li
              key={item.step}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-baseline py-8 sm:py-10 border-b border-border"
            >
              <span className="font-mono text-xs text-accent tracking-[0.2em]">{item.step}</span>
              <div>
                <h3 className="font-display italic text-xl text-foreground">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed mt-2">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-lg border border-border bg-card p-7 sm:p-9 space-y-4">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
            Qué no hacemos
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-muted leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-success shrink-0" aria-hidden="true" />
              No guardamos tu fecha en servidor
            </li>
            <li className="flex items-start gap-2 text-sm text-muted leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-success shrink-0" aria-hidden="true" />
              No usamos cookies de rastreo ni analytics de terceros
            </li>
            <li className="flex items-start gap-2 text-sm text-muted leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-success shrink-0" aria-hidden="true" />
              No predecimos el futuro: identificamos patrones
            </li>
            <li className="flex items-start gap-2 text-sm text-muted leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-success shrink-0" aria-hidden="true" />
              No mezclamos sistemas: cada cálculo vive en su propio dominio
            </li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-muted leading-relaxed max-w-2xl">
          El conocimiento que generás es tuyo. Podés exportarlo, compararlo con otros mapas
          o simplemente mirarlo. <Link
            href="/transparencia"
            className="group inline-flex items-center gap-1.5 text-accent font-medium underline-offset-4 hover:underline"
          >
            Detalle técnico completo
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