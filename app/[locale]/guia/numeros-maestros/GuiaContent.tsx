import { useL } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import MasterNumberPersonalization from "@/components/guia/MasterNumberPersonalization";
import SectionCover from "@/components/ui/SectionCover";

export default function GuiaContent() {
  const L = useL();
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[700px] px-6 sm:px-8 py-16 sm:py-28" id="main-content">
        <nav className="mb-12">{L(<>
          <Link href="/guia" className="text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">
            ← volver a la guía
          </Link>
        </>, <><Link href="/guia" className="text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">← back to the guide</Link></>)}</nav>

        <p className="text-sm text-accent font-medium mb-4 label-caps">{L("Numerología", "Numerology")}</p>
        <h1 className="page-title text-foreground mb-4">{L("Números Maestros", "Master Numbers")}</h1>
        <p className="font-heading text-2xl sm:text-3xl text-foreground/80 leading-tight mb-12">{L("11, 22, 33 — las frecuencias que no se reducen", "11, 22, 33 — the frequencies that don't reduce")}</p>

        <SectionCover imageKey="guia/numeros-maestros" priority className="mb-12" />

        <MasterNumberPersonalization />

        <div className="space-y-10 text-base sm:text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Qué son", "What they are")}</h2>
            <p>{L("En numerología, cualquier número de varias cifras se reduce sumando sus dígitos hasta llegar a un número del 1 al 9. El 29, por ejemplo, se convierte en 2+9=11 y ese 11 se reduciría a su vez en 1+1=2. Los números maestros son la excepción a esa regla: 11, 22 y 33 no se reducen más allá de esa primera suma, porque se considera que llevan una carga simbólica propia, distinta de la del número al que reducirían (2, 4 y 6 respectivamente).", "In numerology, any multi-digit number is reduced by adding its digits until you reach a number from 1 to 9. 29, for example, becomes 2+9=11, and that 11 would in turn reduce to 1+1=2. Master numbers are the exception to that rule: 11, 22 and 33 aren't reduced beyond that first sum, because they're considered to carry a symbolic weight of their own, different from the number they would reduce to (2, 4 and 6 respectively).")}</p>
            <p className="mt-4">{L("Aparecen del mismo modo que cualquier otro número del perfil — en el Camino de Vida (a partir de la fecha de nacimiento), en el número de Expresión (a partir del nombre) o en Personalidad (a partir del día) — solo que, cuando la suma da 11, 22 o 33 antes de reducirse a un dígito, la tradición numerológica los trata como una capa adicional de intensidad sobre el número base.", "They show up the same way as any other number in the profile — in the Life Path (from the date of birth), in the Expression number (from the name) or in Personality (from the day) — except that when the sum gives 11, 22 or 33 before reducing to a single digit, the numerological tradition treats them as an extra layer of intensity on top of the base number.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("11 — El intuitivo", "11 — The Intuitive")}</h2>
            <p>{L("Duplica la energía del 1 (iniciativa, individualidad) y la lleva a un plano más sensible: percepción, inspiración, visión. A quienes les aparece se les suele describir como personas que captan lo que todavía no tiene forma — una idea, un cambio, un estado de ánimo ajeno — antes de que sea evidente para el resto.", "It doubles the energy of 1 (initiative, individuality) and takes it to a more sensitive plane: perception, inspiration, vision. People who have it are often described as those who pick up on what doesn't have a shape yet — an idea, a change, someone else's mood — before it's obvious to everyone else.")}</p>
            <p className="mt-4">{L("El desafío del 11 es sostener esa sensibilidad sin que se vuelva ansiedad. Es un número exigente: la misma intensidad que permite percibir más también puede saturar. Aterrizar la intuición en algo concreto — un proyecto, una obra, una conversación honesta — es lo que distingue a un 11 integrado de uno disperso.", "The challenge of 11 is holding that sensitivity without letting it turn into anxiety. It's a demanding number: the same intensity that lets you perceive more can also overwhelm. Grounding intuition in something concrete — a project, a piece of work, an honest conversation — is what sets an integrated 11 apart from a scattered one.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("22 — El constructor maestro", "22 — The Master Builder")}</h2>
            <p>{L("Duplica la energía del 2 (cooperación, diplomacia) y la combina con la capacidad estructural del 4, ya que 22 reduce a 4. Es el número que en la tradición numerológica se asocia con llevar ideas grandes a una forma concreta y duradera: no soñar con un cambio, sino construirlo con método.", "It doubles the energy of 2 (cooperation, diplomacy) and combines it with the structural ability of 4, since 22 reduces to 4. In the numerological tradition it's the number associated with turning big ideas into a concrete, lasting form: not dreaming of change, but building it methodically.")}</p>
            <p className="mt-4">{L("Su fortaleza es la visión a largo plazo combinada con los pies en la tierra. Su desafío es el peso de la propia ambición: al pedirse resultados a escala, un 22 puede paralizarse por la distancia entre lo que imagina y lo que todavía no logró. La clave suele estar en dividir lo grande en pasos ejecutables.", "Its strength is long-term vision combined with having its feet on the ground. Its challenge is the weight of its own ambition: by demanding results at scale, a 22 can freeze in the gap between what it imagines and what it hasn't achieved yet. The key is usually breaking the big thing into doable steps.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("33 — El maestro sanador", "33 — The Master Healer")}</h2>
            <p>{L("El menos frecuente de los tres. Duplica la energía del 3 (expresión, creatividad) y suma la vocación de cuidado del 6, número al que reduce. Se lo describe como el número del servicio desinteresado: usar la propia sensibilidad creativa para sostener, enseñar o sanar a otros, más que para el lucimiento personal.", "The rarest of the three. It doubles the energy of 3 (expression, creativity) and adds the caring vocation of 6, the number it reduces to. It's described as the number of selfless service: using one's own creative sensitivity to support, teach or heal others, rather than to shine personally.")}</p>
            <p className="mt-4">{L("Su desafío característico es el sacrificio excesivo — dar tanto de sí que no queda margen para las propias necesidades. Un 33 integrado encuentra el punto donde cuidar a otros no implica desaparecer del propio mapa.", "Its characteristic challenge is excessive sacrifice — giving so much of itself that there's no room left for its own needs. An integrated 33 finds the point where caring for others doesn't mean disappearing from its own map.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Cómo identificarlos en tu mapa", "How to spot them in your map")}</h2>
            <p>{L("No hace falta calcular nada a mano: si tu Camino de Vida, tu número de Expresión o tu Personalidad dan 11, 22 o 33 antes de reducirse, Molino ya lo señala como tal en tu mapa personal — no lo simplifica a 2, 4 o 6. Si ninguno de tus números da uno de estos tres valores, es simplemente porque tu fecha de nacimiento y tu nombre no producen esa combinación específica; no es ni mejor ni peor que tener un número de un solo dígito, es otro patrón.", "You don't need to calculate anything by hand: if your Life Path, your Expression number or your Personality add up to 11, 22 or 33 before reducing, Molino already marks it as such in your personal map — it doesn't simplify it to 2, 4 or 6. If none of your numbers gives one of these three values, it's simply because your date of birth and your name don't produce that specific combination; it's neither better nor worse than having a single-digit number, just a different pattern.")}</p>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-ink/10">{L(<>
          <Link href="/guia" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">
            ← Todos los artículos
          </Link>
          <Link href="/onboarding" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors ml-8 label-caps">
            Calcular mi mapa →
          </Link>
        </>, <><Link href="/guia" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">← All articles</Link><Link href="/onboarding" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors ml-8 label-caps">Calculate my map →</Link></>)}</div>
      </main>
    </div>
  );
}
