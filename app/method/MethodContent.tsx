import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function MethodContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">📐 Method</span>
            <h1 className="font-heading text-3xl font-bold text-foreground mt-3">Cómo funciona Molino</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">
              Transparencia total: cómo se calculan los números, las limitaciones de cada sistema y las fuentes en las que se basa.
            </p>
          </div>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <div className="mb-4">
              <span className="badge">Cálculos base</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Camino de Vida (Camino de Vida)</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Se reduce la fecha de nacimiento completa a un solo dígito, excepto cuando se obtiene 11, 22 o 33,
                  considerados números maestros. No interpreta el &#34;futuro&#34;: describe tendencias y patrones dominantes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Número de Expresión</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Se asignan valores a las letras del nombre completo, se suman y se reducen. Refleja la energía que la persona
                  proyecta, no una identidad fija ni un destino cerrado.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Número del Alma</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Usa solo las vocales del nombre completo. Se interpreta como motivación interna y deseos centrales,
                  sin determinar comportamientos ni resultados concretos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Número de Personalidad</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Sale exclusivamente del día de nacimiento (no del nombre): el día del mes reducido a un dígito.
                  Representa la energía que proyectás hacia afuera, no una caracterización definitiva de la persona.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <div className="mb-4">
              <span className="badge">Limitaciones y contexto</span>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted leading-relaxed">
                Molino presenta sistemas simbólicos comomapas de reflexión, no como verdades absolutas ni herramientas de predicción.
                Cada sistema está limitado por su propia tradición, contexto cultural y forma de cálculo.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                La numerología occidental, la astrología, el zodiaco chino y otros marcos tienen valores simbólicos y culturales,
                pero no reemplazan el juicio crítico ni las decisiones personales. Los resultados son interpretaciones abiertas.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                No se garantiza precisión en contextos fuera de los supuestos de cada sistema. Las comparaciones y compatibilidades
                son referencias orientativas, no diagnósticos ni veredictos.
              </p>
            </div>
          </Card>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <div className="mb-4">
              <span className="badge">Fuentes y tradiciones</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Numerología</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Basada en la tradición pitagórica y desarrollada posteriormente por autores como L. Dow Balliett y modernamente por
                  Matthew Goodwin. Se apoya en reducciones numéricas y correspondencias con letras del alfabeto.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Astrología occidental</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Cálculo de signos, planetas, casas y aspectos según la tradición helenística y renacentista.
                  Autores de referencia: William Lilly, Dane Rudhyar, Liz Greene.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Zodiaco Chino</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Ciclo sexagenario combinado de 12 animales y 5 elementos. Interpretaciones modernas deben considerarse adaptaciones
                  culturales, no versiones oficiales de ninguna institución tradicional.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Human Design, Eneagrama</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Cada uno tiene sus propias fuentes: el sistema Human Design de Ra Uru Hu,
                  y las corrientes contemporáneas del Eneagrama. Se presentan como marcos orientativos.
                </p>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}
