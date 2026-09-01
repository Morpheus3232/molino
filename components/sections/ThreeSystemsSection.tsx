import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SYSTEMS = [
  {
    n: "01",
    name: "Numerología",
    lead: "Aritmética pitagórica",
    body: "Tu Camino de Vida, Expresión y Personalidad surgen de la reducción de los dígitos de tu fecha y nombre. Cada número queda a la vista — sin interpretación obligada.",
  },
  {
    n: "02",
    name: "Astrología",
    lead: "Posición solar y arquetipos",
    body: "El signo, el elemento y la modalidad del Sol al nacer dibujan un mapa de tensiones y energías. Todo verificable contra efemérides.",
  },
  {
    n: "03",
    name: "Zodíaco chino",
    lead: "Animal del año y ciclo",
    body: "Tu rama terrestre, elemento y polaridad según el calendario chino real (CNY). Una sola regla: signo contra signo.",
  },
];

export default function ThreeSystemsSection() {
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