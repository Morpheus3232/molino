import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Antes acá había una tabla de 4 filas ("¿Qué hace?", "¿Se guardan tus datos?",
// "¿Cómo se verifica?", "¿Para quién es?") que era un FAQ duplicado: tres de
// esas cuatro respuestas ya estaban, más completas, en la sección de Preguntas
// frecuentes al pie, y la privacidad ya se promete en el hero ("Cálculo 100%
// local", con escudo, debajo del form). En su lugar va
// lo único que esta parte de la página tiene que decir y no dice ninguna otra:
// qué son los tres sistemas y qué aporta cada uno.
const SYSTEMS = [
  {
    n: "01",
    name: "Numerología",
    lead: "Tu Camino de Vida y tus ciclos",
    body: "Aritmética pitagórica sobre los dígitos de tu fecha. Cada reducción queda a la vista.",
  },
  {
    n: "02",
    name: "Astrología",
    lead: "Tu signo solar y sus tensiones",
    body: "La posición del Sol el día que naciste, y los arquetipos que tira en direcciones opuestas.",
  },
  {
    n: "03",
    name: "Zodíaco chino",
    lead: "Tu signo del año y con qué resuena",
    body: "El animal de tu año, tus dos amigos del ciclo y tu opuesto. Una sola regla: signo contra signo.",
  },
];

export default function ClaritySection() {
  return (
    <section className="bg-background border-b border-border px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Qué se calcula
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Tres sistemas,{" "}
            <em className="text-gradient-warm">una sola fecha.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {SYSTEMS.map((s) => (
            <div key={s.n} className="p-7 sm:p-9 space-y-3">
              <span className="font-mono text-xs text-accent tracking-[0.2em]">{s.n}</span>
              <h3 className="font-display italic text-2xl text-foreground">{s.name}</h3>
              <p className="font-heading text-sm font-bold text-foreground">{s.lead}</p>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          Ninguno de los tres se mezcla con los otros dentro de un mismo número.{" "}
          <Link
            href="/metodos-y-fuentes"
            className="group inline-flex items-center gap-1.5 text-accent font-medium underline-offset-4 hover:underline"
          >
            Ver métodos y fuentes
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </p>

        {/* El matiz del claim "100% local". Los tres cálculos de arriba SÍ
            corren enteros en el navegador. Lo que no: la Lectura Pro y las
            preguntas a la IA, que mandan la fecha a un proveedor de modelo
            para poder redactarse. Decirlo acá, al lado del claim, en vez de
            dejar que "100% local" se lea como si valiera para todo. */}
        <p className="mt-3 text-xs text-muted leading-relaxed max-w-2xl">
          Estos tres cálculos corren enteros en tu navegador: tu fecha no sale de tu
          dispositivo. Las dos funciones que usan IA —la Lectura Pro y las preguntas— sí la
          envían a un proveedor de modelo para poder escribirse, y el acceso pago se valida
          con un hash de tu perfil, nunca con tu fecha en claro.{" "}
          <Link
            href="/privacidad"
            className="text-accent font-medium underline-offset-4 hover:underline"
          >
            Política de privacidad
          </Link>
        </p>
      </div>
    </section>
  );
}
