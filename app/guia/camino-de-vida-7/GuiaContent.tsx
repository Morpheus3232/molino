"use client";

import Link from "next/link";

export default function GuiaContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[700px] px-6 sm:px-8 py-16 sm:py-28" id="main-content">
        <nav className="mb-12">
          <Link href="/guia" className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium hover:text-accent/80 transition-colors">
            ← volver a la guía
          </Link>
        </nav>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Camino de Vida</p>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[0.9] mb-4">
          7
        </h1>
        <p className="font-heading text-2xl sm:text-3xl text-foreground/80 leading-tight mb-12">
          El buscador de la verdad
        </p>

        <div className="space-y-10 text-base sm:text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Significado
            </h2>
            <p>
              El 7 es el número de la introspección, el análisis y la sabiduría. Representa al buscador incansable de conocimiento, al investigador que no se conforma con respuestas superficiales. En casi todas las tradiciones — desde el pitagorismo hasta la kabbalah — el 7 es considerado un número sagrado: los 7 planetas clásicos, los 7 días de la semana, los 7 chakras, las 7 notas musicales.
            </p>
            <p className="mt-4">
              Quienes tienen Camino de Vida 7 vienen con una misión clara: comprender las capas más profundas de la realidad. No se trata de acumular datos, sino de encontrar el significado detrás de los patrones. Su búsqueda es tanto espiritual como intelectual.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Personalidad
            </h2>
            <p>
              Analítico, reservado y perceptivo. El 7 observa antes de actuar. Procesa todo internamente antes de compartir sus conclusiones. Esto puede hacerlo parecer distante o misterioso, pero en realidad está procesando información a una profundidad que pocos alcanzan.
            </p>
            <p className="mt-4">
              Valora su soledad no como aislamiento, sino como espacio sagrado de reflexión. Necesita tiempo a solas para recargar y dar sentido a sus experiencias. No es antisocial — es selectivo con su energía social.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Fortalezas
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Mente analítica:</strong> capacidad de ver patrones donde otros ven caos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Sabiduría intuitiva:</strong> combina lógica con corazonadas certeras.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Independencia intelectual:</strong> no sigue modas, sigue evidencias y convicciones.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Profundidad espiritual:</strong> conexión natural con lo trascendente.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Desafíos
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Aislamiento excesivo:</strong> puede desconectarse del mundo real.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Escepticismo paralizante:</strong> busca tantas pruebas que nunca actúa.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Distancia emocional:</strong> le cuesta mostrar vulnerabilidad.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Perfeccionismo:</strong> nada alcanza su estándar.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              En relaciones
            </h2>
            <p>
              En el amor, el 7 busca una conexión mental y espiritual antes que física. Necesita alguien que respete su necesidad de espacio y que pueda seguir sus conversaciones profundas. No es el tipo de persona que quiere charlas triviales — busca compartir descubrimientos, lecturas y reflexiones.
            </p>
            <p className="mt-4">
              Compatibilidad natural con números 1, 5 y 9. El desafío está en encontrar a alguien que entienda que su silencio no es rechazo, sino procesamiento interno.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Camino de crecimiento
            </h2>
            <p>
              La lección del 7 es aprender a bajar del mundo de las ideas al mundo de la acción. El conocimiento sin aplicación se vuelve esterilidad. El 7 crece cuando comparte lo que descubre, cuando confía en su intuición sin necesidad de pruebas absolutas, y cuando permite que otros vean su mundo interior.
            </p>
            <p className="mt-4">
              Practicar la vulnerabilidad, tomar decisiones sin tener toda la información, y compartir el conocimiento generosamente son las llaves de su evolución personal.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-neutral-200/60">
          <Link href="/guia" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors">
            ← Todos los artículos
          </Link>
          <Link href="/onboarding" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors ml-8">
            Calcular mi Camino de Vida →
          </Link>
        </div>
      </main>
    </div>
  );
}
