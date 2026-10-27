import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { metadataFor } from "@/lib/seo";
import { ShieldCheck, Users, BookOpen, Lock, Compass, CheckCircle2, XCircle } from "lucide-react";
import { PageHero, KnowledgeSection, Columns, Closing, PrimaryLink } from "@/components/knowledge/Kit";

const WHAT_WE_DONT_DO = (L: Pick2) => ([
  L("No reemplazamos terapia profesional", "We don't replace professional therapy"),
  L("No hacemos diagnósticos", "We don't make diagnoses"),
  L("No predecimos el futuro", "We don't predict the future"),
]);

const WHAT_WE_DO = (L: Pick2) => ([
  L("Marco estructurado para reflexión", "A structured framework for reflection"),
  L("Herramienta de conversación", "A conversation tool"),
  L("Recurso complementario", "A complementary resource"),
]);

export const generateMetadata = metadataFor({
  title: ["Molino para Coaches: Herramienta de Reflexión", "Molino for Coaches: A Tool for Reflection"],
  description:
    ["Sumá numerología y astrología a tus sesiones como coach, con marco estructurado y sin sesgos. 100% privado, cálculo local, sin registro. Probalo gratis.", "Add numerology and astrology to your coaching sessions, with a structured, unbiased framework. 100% private, calculated on your device, no sign-up. Try it free."],
  path: "/profesionales",
  ogDescription:
    ["Sumá numerología y astrología a tus sesiones como coach, con marco estructurado y sin sesgos. 100% privado, cálculo local, sin registro. Probalo gratis.", "Add numerology and astrology to your coaching sessions, with a structured, unbiased framework. 100% private, calculated on your device, no sign-up. Try it free."],
});

const PILLARS = (L: Pick2) => ([
  {
    icon: Lock,
    title: L("Privacidad Ética & Total", "Ethical, Complete Privacy"),
    desc: L("Cálculo básico 100% en el navegador, sin servidor. Para IA: datos se envían bajo acuerdo de confidencialidad, nunca para entrenar modelos. Tu consultante nunca queda registrado.", "Basic calculation 100% in the browser, no server. For AI: data is sent under a confidentiality agreement, never to train models. Your client is never registered."),
  },
  {
    icon: Compass,
    title: L("Marco Estructurado, No Determinista", "A Structured, Non-Deterministic Framework"),
    desc: L("Arquetipos, ciclos y dinámicas como herramienta de reflexión estructurada. Describe patrones, no predice resultados. Tú sostenés el encuadre.", "Archetypes, cycles and dynamics as a tool for structured reflection. It describes patterns; it doesn't predict outcomes. You hold the frame."),
  },
  {
    icon: Users,
    title: L("Análisis de Dinámicas Vincular", "Relationship Dynamics Analysis"),
    desc: L("Comparativa clara de arquetipos, ciclos y polaridades entre dos personas. Despersonaliza tensiones y facilita el diálogo sin sesgos.", "A clear comparison of archetypes, cycles and polarities between two people. It depersonalizes tensions and makes unbiased dialogue easier."),
  },
]);

const STEPS = (L: Pick2) => ([
  {
    title: L("El mapa en la primera sesión", "The map in the first session"),
    text: L("Generá el mapa con la fecha de nacimiento de tu consultante para contrastar lo que cuenta con los ritmos y arquetipos de su perfil.", "Generate the map with your client's date of birth to contrast what they tell you with the rhythms and archetypes in their profile."),
  },
  {
    title: L("Trabajo vincular y de pareja", "Relationship and couples work"),
    text: L("Usá el Modo Pareja en pantalla compartida para despersonalizar tensiones y mirar las polaridades de los dos con más distancia.", "Use Couple Mode on a shared screen to depersonalize tensions and look at both people's polarities from a little more distance."),
  },
  {
    title: L("Seguimiento por ciclos", "Follow-up by cycles"),
    text: L("El año, el mes y el día personal dan un lenguaje común para revisar en qué momento está cada proceso entre sesiones.", "The personal year, month and day give you a common language to review where each process stands between sessions."),
  },
]);

export default function ProfesionalesPage() {
  const L = useL();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Para profesionales", "For professionals") }]}
        eyebrow={L("Para coaches y terapeutas", "For coaches and therapists")}
        title={L("Un marco de reflexión para tus sesiones", "A framework for reflection in your sessions")}
        lead={L("Arquetipos, ciclos y dinámicas como estructura para conversar, no como predicción. El mapa básico se calcula en el navegador, sin servidor.", "Archetypes, cycles and dynamics as a structure for conversation, not as prediction. The basic map is calculated in the browser, with no server.")}
        imageKey="paginas/profesionales"
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <PrimaryLink href="/onboarding">{L("Probar con una fecha", "Try it with a date")}</PrimaryLink>
          <Link href="/pareja" className="text-lg underline underline-offset-4 hover:no-underline">{L("Modo Pareja", "Couple Mode")}</Link>
          <Link href="/premium" className="text-lg underline underline-offset-4 hover:no-underline">{L("Planes y precios", "Plans and pricing")}</Link>
        </div>
      </PageHero>

      <KnowledgeSection label={L("Con honestidad", "Honestly")} title={L("Para coaches que valoran la honestidad", "For coaches who value honesty")}>
        <div className="max-w-3xl space-y-5 text-xl text-foreground/85 leading-relaxed">
          <p>{L("Molino no es una herramienta clínica validada: es un marco de reflexión hecho por gente apasionada por estos sistemas. Si buscás instrumentos con respaldo empírico, esto no es para vos. Si buscás algo complementario para ordenar conversaciones, puede servirte.", "Molino isn't a validated clinical tool: it's a framework for reflection made by people passionate about these systems. If you're looking for instruments with empirical backing, this isn't for you. If you're looking for something complementary to organize conversations, it may be useful.")}</p>
          <p className="text-lg text-muted">{L("Las interpretaciones con IA envían el perfil simbólico a proveedores bajo acuerdos de procesamiento de datos, nunca para entrenar modelos.", "AI interpretations send the symbolic profile to providers under data processing agreements, never to train models.")}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
          {[
            { title: L("Qué no hacemos", "What we don't do"), items: WHAT_WE_DONT_DO(L), Icon: XCircle },
            { title: L("Qué sí hacemos", "What we do"), items: WHAT_WE_DO(L), Icon: CheckCircle2 },
          ].map(({ title, items, Icon }) => (
            <div key={title} className="bg-background p-7 sm:p-9">
              <h3 className="font-display text-3xl text-foreground">{title}</h3>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg text-foreground/85 leading-snug">
                    <Icon className="w-5 h-5 mt-0.5 shrink-0 text-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </KnowledgeSection>

      <KnowledgeSection label={L("Los pilares", "The pillars")} title={L("En qué se apoya", "What it rests on")} tone="alt">
        <Columns cols={PILLARS(L).map((p) => ({ title: p.title, body: p.desc }))} />
      </KnowledgeSection>

      <KnowledgeSection label={L("En la práctica", "In practice")} title={L("Cómo integrar Molino en tu práctica", "How to bring Molino into your practice")}>
        <ol className="border-t-2 border-ink">
          {STEPS(L).map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_minmax(0,4fr)_minmax(0,7fr)] gap-x-8 gap-y-2 py-8 border-b border-ink/15 items-baseline">
              <span className="font-display text-4xl sm:text-5xl leading-none tabular-nums">{i + 1}</span>
              <h3 className="font-display text-2xl sm:text-3xl leading-tight">{s.title}</h3>
              <p className="col-start-2 sm:col-start-auto text-lg text-foreground/80 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16">
          <Closing title={L("Probalo con tu propia fecha", "Try it with your own date")} text={L("Antes de usarlo con alguien, mirá qué dice de vos: el mapa básico es gratis y no se guarda.", "Before using it with someone else, see what it says about you: the basic map is free and isn't saved.")} href="/onboarding" cta={L("Crear mi mapa", "Create my map")} />
        </div>
      </KnowledgeSection>
    </main>
  );
}
