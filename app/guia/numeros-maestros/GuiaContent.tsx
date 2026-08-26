import Link from "next/link";
import MasterNumberPersonalization from "@/components/guia/MasterNumberPersonalization";

export default function GuiaContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[700px] px-6 sm:px-8 py-16 sm:py-28" id="main-content">
        <nav className="mb-12">
          <Link href="/guia" className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium hover:text-accent/80 transition-colors">
            ← volver a la guía
          </Link>
        </nav>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Numerología</p>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[0.9] mb-4">
          Números Maestros
        </h1>
        <p className="font-heading text-2xl sm:text-3xl text-foreground/80 leading-tight mb-12">
          11, 22, 33 — las frecuencias que no se reducen
        </p>

        <MasterNumberPersonalization />

        <div className="space-y-10 text-base sm:text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Qué son
            </h2>
            <p>
              En numerología, cualquier número de varias cifras se reduce sumando sus dígitos hasta llegar a un número del 1 al 9. El 29, por ejemplo, se convierte en 2+9=11 y ese 11 se reduciría a su vez en 1+1=2. Los números maestros son la excepción a esa regla: 11, 22 y 33 no se reducen más allá de esa primera suma, porque se considera que llevan una carga simbólica propia, distinta de la del número al que reducirían (2, 4 y 6 respectivamente).
            </p>
            <p className="mt-4">
              Aparecen del mismo modo que cualquier otro número del perfil — en el Camino de Vida (a partir de la fecha de nacimiento), en el número de Expresión (a partir del nombre) o en Personalidad (a partir del día) — solo que, cuando la suma da 11, 22 o 33 antes de reducirse a un dígito, la tradición numerológica los trata como una capa adicional de intensidad sobre el número base.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              11 — El intuitivo
            </h2>
            <p>
              Duplica la energía del 1 (iniciativa, individualidad) y la lleva a un plano más sensible: percepción, inspiración, visión. A quienes les aparece se les suele describir como personas que captan lo que todavía no tiene forma — una idea, un cambio, un estado de ánimo ajeno — antes de que sea evidente para el resto.
            </p>
            <p className="mt-4">
              El desafío del 11 es sostener esa sensibilidad sin que se vuelva ansiedad. Es un número exigente: la misma intensidad que permite percibir más también puede saturar. Aterrizar la intuición en algo concreto — un proyecto, una obra, una conversación honesta — es lo que distingue a un 11 integrado de uno disperso.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              22 — El constructor maestro
            </h2>
            <p>
              Duplica la energía del 2 (cooperación, diplomacia) y la combina con la capacidad estructural del 4, ya que 22 reduce a 4. Es el número que en la tradición numerológica se asocia con llevar ideas grandes a una forma concreta y duradera: no soñar con un cambio, sino construirlo con método.
            </p>
            <p className="mt-4">
              Su fortaleza es la visión a largo plazo combinada con los pies en la tierra. Su desafío es el peso de la propia ambición: al pedirse resultados a escala, un 22 puede paralizarse por la distancia entre lo que imagina y lo que todavía no logró. La clave suele estar en dividir lo grande en pasos ejecutables.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              33 — El maestro sanador
            </h2>
            <p>
              El menos frecuente de los tres. Duplica la energía del 3 (expresión, creatividad) y suma la vocación de cuidado del 6, número al que reduce. Se lo describe como el número del servicio desinteresado: usar la propia sensibilidad creativa para sostener, enseñar o sanar a otros, más que para el lucimiento personal.
            </p>
            <p className="mt-4">
              Su desafío característico es el sacrificio excesivo — dar tanto de sí que no queda margen para las propias necesidades. Un 33 integrado encuentra el punto donde cuidar a otros no implica desaparecer del propio mapa.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Cómo identificarlos en tu mapa
            </h2>
            <p>
              No hace falta calcular nada a mano: si tu Camino de Vida, tu número de Expresión o tu Personalidad dan 11, 22 o 33 antes de reducirse, Molino ya lo señala como tal en tu mapa personal — no lo simplifica a 2, 4 o 6. Si ninguno de tus números da uno de estos tres valores, es simplemente porque tu fecha de nacimiento y tu nombre no producen esa combinación específica; no es ni mejor ni peor que tener un número de un solo dígito, es otro patrón.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-ink/10">
          <Link href="/guia" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors">
            ← Todos los artículos
          </Link>
          <Link href="/onboarding" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors ml-8">
            Calcular mi mapa →
          </Link>
        </div>
      </main>
    </div>
  );
}
