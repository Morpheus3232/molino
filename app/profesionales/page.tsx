import Link from "next/link";
import { createRouteMetadata } from "@/lib/seo";
import { ShieldCheck, Users, BookOpen, Lock, Compass, CheckCircle2, XCircle } from "lucide-react";
import { PageHero, KnowledgeSection, Columns, Closing, PrimaryLink } from "@/components/knowledge/Kit";

const WHAT_WE_DONT_DO = [
  "No reemplazamos terapia profesional",
  "No hacemos diagnósticos",
  "No predecimos el futuro",
];

const WHAT_WE_DO = [
  "Marco estructurado para reflexión",
  "Herramienta de conversación",
  "Recurso complementario",
];

export const metadata = createRouteMetadata({
  title: "Molino para Coaches: Herramienta de Reflexión",
  description:
    "Sumá numerología y astrología a tus sesiones como coach, con marco estructurado y sin sesgos. 100% privado, cálculo local, sin registro. Probalo gratis.",
  path: "/profesionales",
  ogDescription:
    "Sumá numerología y astrología a tus sesiones como coach, con marco estructurado y sin sesgos. 100% privado, cálculo local, sin registro. Probalo gratis.",
});

const PILLARS = [
  {
    icon: Lock,
    title: "Privacidad Ética & Total",
    desc: "Cálculo básico 100% en el navegador, sin servidor. Para IA: datos se envían bajo acuerdo de confidencialidad, nunca para entrenar modelos. Tu consultante nunca queda registrado.",
  },
  {
    icon: Compass,
    title: "Marco Estructurado, No Determinista",
    desc: "Arquetipos, ciclos y dinámicas como herramienta de reflexión estructurada. Describe patrones, no predice resultados. Tú sostenés el encuadre.",
  },
  {
    icon: Users,
    title: "Análisis de Dinámicas Vincular",
    desc: "Comparativa clara de arquetipos, ciclos y polaridades entre dos personas. Despersonaliza tensiones y facilita el diálogo sin sesgos.",
  },
];

const STEPS = [
  {
    title: "El mapa en la primera sesión",
    text: "Generá el mapa con la fecha de nacimiento de tu consultante para contrastar lo que cuenta con los ritmos y arquetipos de su perfil.",
  },
  {
    title: "Trabajo vincular y de pareja",
    text: "Usá el Modo Pareja en pantalla compartida para despersonalizar tensiones y mirar las polaridades de los dos con más distancia.",
  },
  {
    title: "Seguimiento por ciclos",
    text: "El año, el mes y el día personal dan un lenguaje común para revisar en qué momento está cada proceso entre sesiones.",
  },
];

export default function ProfesionalesPage() {
  return (
    <main id="main-content" className="bg-background text-foreground">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Para profesionales" }]}
        eyebrow="Para coaches y terapeutas"
        title="Un marco de reflexión para tus sesiones"
        lead="Arquetipos, ciclos y dinámicas como estructura para conversar, no como predicción. El mapa básico se calcula en el navegador, sin servidor."
        imageKey="paginas/profesionales"
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <PrimaryLink href="/onboarding">Probar con una fecha</PrimaryLink>
          <Link href="/pareja" className="text-lg underline underline-offset-4 hover:no-underline">Modo Pareja</Link>
          <Link href="/premium" className="text-lg underline underline-offset-4 hover:no-underline">Planes y precios</Link>
        </div>
      </PageHero>

      <KnowledgeSection label="Con honestidad" title="Para coaches que valoran la honestidad">
        <div className="max-w-3xl space-y-5 text-xl text-foreground/85 leading-relaxed">
          <p>
            Molino no es una herramienta clínica validada: es un marco de reflexión hecho por gente apasionada por estos
            sistemas. Si buscás instrumentos con respaldo empírico, esto no es para vos. Si buscás algo complementario para
            ordenar conversaciones, puede servirte.
          </p>
          <p className="text-lg text-muted">
            Las interpretaciones con IA envían el perfil simbólico a proveedores bajo acuerdos de procesamiento de datos,
            nunca para entrenar modelos.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
          {[
            { title: "Qué no hacemos", items: WHAT_WE_DONT_DO, Icon: XCircle },
            { title: "Qué sí hacemos", items: WHAT_WE_DO, Icon: CheckCircle2 },
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

      <KnowledgeSection label="Los pilares" title="En qué se apoya" tone="alt">
        <Columns cols={PILLARS.map((p) => ({ title: p.title, body: p.desc }))} />
      </KnowledgeSection>

      <KnowledgeSection label="En la práctica" title="Cómo integrar Molino en tu práctica">
        <ol className="border-t-2 border-ink">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_minmax(0,4fr)_minmax(0,7fr)] gap-x-8 gap-y-2 py-8 border-b border-ink/15 items-baseline">
              <span className="font-display text-4xl sm:text-5xl leading-none tabular-nums">{i + 1}</span>
              <h3 className="font-display text-2xl sm:text-3xl leading-tight">{s.title}</h3>
              <p className="col-start-2 sm:col-start-auto text-lg text-foreground/80 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16">
          <Closing title="Probalo con tu propia fecha" text="Antes de usarlo con alguien, mirá qué dice de vos: el mapa básico es gratis y no se guarda." href="/onboarding" cta="Crear mi mapa" />
        </div>
      </KnowledgeSection>
    </main>
  );
}
