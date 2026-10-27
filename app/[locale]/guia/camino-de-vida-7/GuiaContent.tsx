import { useL } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
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

        <p className="text-sm text-accent font-medium mb-4 label-caps">{L("Camino de Vida", "Life Path")}</p>
        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[0.9] mb-4">
          7
        </h1>
        <p className="font-heading text-2xl sm:text-3xl text-foreground/80 leading-tight mb-12">{L("El buscador de la verdad", "The seeker of truth")}</p>

        <SectionCover imageKey="guia/camino-de-vida-7" priority className="mb-12" />

        <div className="space-y-10 text-base sm:text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Significado", "Meaning")}</h2>
            <p>{L("El 7 es el número de la introspección, el análisis y la sabiduría. Representa al buscador incansable de conocimiento, al investigador que no se conforma con respuestas superficiales. En casi todas las tradiciones — desde el pitagorismo hasta la kabbalah — el 7 es considerado un número sagrado: los 7 planetas clásicos, los 7 días de la semana, los 7 chakras, las 7 notas musicales.", "7 is the number of introspection, analysis and wisdom. It represents the tireless seeker of knowledge, the researcher who isn't satisfied with superficial answers. In almost every tradition — from Pythagoreanism to Kabbalah — 7 is considered a sacred number: the 7 classical planets, the 7 days of the week, the 7 chakras, the 7 musical notes.")}</p>
            <p className="mt-4">{L("Quienes tienen Camino de Vida 7 vienen con una misión clara: comprender las capas más profundas de la realidad. No se trata de acumular datos, sino de encontrar el significado detrás de los patrones. Su búsqueda es tanto espiritual como intelectual.", "People with Life Path 7 come with a clear mission: to understand the deepest layers of reality. It's not about piling up data, but about finding the meaning behind the patterns. Their search is as spiritual as it is intellectual.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Personalidad", "Personality")}</h2>
            <p>{L("Analítico, reservado y perceptivo. El 7 observa antes de actuar. Procesa todo internamente antes de compartir sus conclusiones. Esto puede hacerlo parecer distante o misterioso, pero en realidad está procesando información a una profundidad que pocos alcanzan.", "Analytical, reserved and perceptive. The 7 observes before acting. It processes everything internally before sharing its conclusions. That can make it seem distant or mysterious, but in reality it's processing information at a depth few people reach.")}</p>
            <p className="mt-4">{L("Valora su soledad no como aislamiento, sino como espacio sagrado de reflexión. Necesita tiempo a solas para recargar y dar sentido a sus experiencias. No es antisocial — es selectivo con su energía social.", "It values solitude not as isolation but as a sacred space for reflection. It needs time alone to recharge and make sense of its experiences. It isn't antisocial — it's selective with its social energy.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Fortalezas", "Strengths")}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Mente analítica:</strong> capacidad de ver patrones donde otros ven caos.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Analytical mind:</strong> the ability to see patterns where others see chaos.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Sabiduría intuitiva:</strong> combina lógica con corazonadas certeras.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Intuitive wisdom:</strong> combines logic with accurate hunches.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Independencia intelectual:</strong> no sigue modas, sigue evidencias y convicciones.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Intellectual independence:</strong> doesn't follow trends; follows evidence and convictions.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Profundidad espiritual:</strong> conexión natural con lo trascendente.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Spiritual depth:</strong> a natural connection with the transcendent.</span></>)}</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Desafíos", "Challenges")}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Aislamiento excesivo:</strong> puede desconectarse del mundo real.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Excessive isolation:</strong> can disconnect from the real world.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Escepticismo paralizante:</strong> busca tantas pruebas que nunca actúa.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Paralyzing skepticism:</strong> looks for so much proof that it never acts.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Distancia emocional:</strong> le cuesta mostrar vulnerabilidad.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Emotional distance:</strong> finds it hard to show vulnerability.</span></>)}</li>
              <li className="flex items-start gap-3">{L(<>
                <span className="text-accent mt-1 shrink-0">→</span>
                <span><strong>Perfeccionismo:</strong> nada alcanza su estándar.</span>
              </>, <><span className="text-accent mt-1 shrink-0">→</span><span><strong>Perfectionism:</strong> nothing meets its standard.</span></>)}</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("En relaciones", "In relationships")}</h2>
            <p>{L("En el amor, el 7 busca una conexión mental y espiritual antes que física. Necesita alguien que respete su necesidad de espacio y que pueda seguir sus conversaciones profundas. No es el tipo de persona que quiere charlas triviales — busca compartir descubrimientos, lecturas y reflexiones.", "In love, the 7 looks for a mental and spiritual connection before a physical one. It needs someone who respects its need for space and can keep up with its deep conversations. It's not the kind of person who wants small talk — it wants to share discoveries, books and reflections.")}</p>
            <p className="mt-4">{L("Compatibilidad natural con números 1, 5 y 9. El desafío está en encontrar a alguien que entienda que su silencio no es rechazo, sino procesamiento interno.", "Natural compatibility with numbers 1, 5 and 9. The challenge is finding someone who understands that its silence isn't rejection but internal processing.")}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{L("Camino de crecimiento", "Path of growth")}</h2>
            <p>{L("La lección del 7 es aprender a bajar del mundo de las ideas al mundo de la acción. El conocimiento sin aplicación se vuelve esterilidad. El 7 crece cuando comparte lo que descubre, cuando confía en su intuición sin necesidad de pruebas absolutas, y cuando permite que otros vean su mundo interior.", "The lesson of the 7 is learning to come down from the world of ideas into the world of action. Knowledge without application turns sterile. The 7 grows when it shares what it discovers, when it trusts its intuition without needing absolute proof, and when it lets others see its inner world.")}</p>
            <p className="mt-4">{L(<>
              Practicar la vulnerabilidad, tomar decisiones sin tener toda la información, y compartir el conocimiento generosamente son las llaves de su evolución personal. Si tu Camino de Vida es 11, 22 o 33, tu lectura tiene una capa adicional — mirá la guía de{" "}
              <Link href="/guia/numeros-maestros" className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">
                Números Maestros
              </Link>.
            </>, <>Practicing vulnerability, making decisions without having all the information, and sharing knowledge generously are the keys to its personal evolution. If your Life Path is 11, 22 or 33, your reading has an extra layer — see the guide to{" "}<Link href="/guia/numeros-maestros" className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">Master Numbers</Link>.</>)}</p>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-neutral-200/60">{L(<>
          <Link href="/guia" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">
            ← Todos los artículos
          </Link>
          <Link href="/onboarding" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors ml-8 label-caps">
            Calcular mi Camino de Vida →
          </Link>
        </>, <><Link href="/guia" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors label-caps">← All articles</Link><Link href="/onboarding" className="group inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors ml-8 label-caps">Calculate my Life Path →</Link></>)}</div>

        <div className="mt-8 p-6 sm:p-8 rounded-lg bg-accent/5 border border-accent/20 text-center">
          <p className="font-heading text-lg sm:text-xl text-foreground mb-4">{L("¿Querés ver tu Camino de Vida ahora?", "Want to see your Life Path now?")}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold text-gold-foreground font-heading text-sm font-bold hover:bg-gold-hover transition-colors label-caps"
          >{L("Crear mi mapa", "Create my map")}</Link>
        </div>
      </main>
    </div>
  );
}
