"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const SYSTEMS = [
  { title: "Numerolog\u00eda", subtitle: "El lenguaje de los n\u00fameros", description: "Tu Camino de Vida, Expression, Alma y Personalidad revelan capas diferentes de qui\u00e9n sos.", href: "/numerologia", color: "var(--element-fire)" },
  { title: "Astrolog\u00eda", subtitle: "El mapa del cielo de tu nacimiento", description: "Tu signo solar, los planetas y las casas forman un mapa del cielo en el momento de tu nacimiento.", href: "/astrologia", color: "var(--layer-astrology)" },
  { title: "Zodiaco Chino", subtitle: "El ciclo de 12 animales", description: "Un sistema de 12 animales y 5 elementos que se repite cada 60 a\u00f1os. Tu animal y elemento definen tu estilo.", href: "/zodiaco-chino", color: "var(--layer-moment)" },
];

const CONCEPTS = [
  { title: "Arquetipos", description: "Los 9 arquetipos numerol\u00f3gicos y lo que revelan sobre tu energ\u00eda natural.", href: "/numerologia" },
  { title: "Elementos", description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", href: "/astrologia" },
  { title: "Ciclos", description: "Tu a\u00f1o, mes y d\u00eda personal. C\u00f3mo cambia tu energ\u00eda a lo largo del tiempo.", href: "/profile" },
  { title: "N\u00fameros maestros", description: "11, 22, 33. N\u00fameros especiales que amplifican la energ\u00eda de tu Camino de Vida.", href: "/numerologia" },
  { title: "Modalidades", description: "Cardinal, Fijo, Mutable. C\u00f3mo implement\u00e1s tu energ\u00eda en el mundo.", href: "/astrologia" },
  { title: "Compatibilidad", description: "C\u00f3mo conect\u00e1s con personas, pa\u00edses, marcas y conceptos a trav\u00e9s de tus sistemas.", href: "/compatibility/countries" },
];

const STEPS = [
  { number: "01", title: "Cre\u00e1 tu perfil", description: "Ingres\u00e1 tu nombre y fecha de nacimiento. Molino calcula tu mapa a partir de m\u00faltiples sistemas simb\u00f3licos." },
  { number: "02", title: "Conoc\u00e9 tu mapa", description: "Numerolog\u00eda, astrolog\u00eda, zodiaco chino y arquetipos conectados en una sola lectura." },
  { number: "03", title: "Explor\u00e1 tus patrones", description: "Descubr\u00ed fortalezas, zonas de atenci\u00f3n y ciclos personales." },
  { number: "04", title: "Conect\u00e1 con el mundo", description: "Compar\u00e1 tu perfil con pa\u00edses, marcas, personas y conceptos." },
  { number: "05", title: "Tom\u00e1 perspectiva", description: "Us\u00e1 la informaci\u00f3n como herramienta de autoconocimiento y reflexi\u00f3n." },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* ═══ 1. HERO ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Inteligencia Personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
            Conoc&eacute; tu mapa.
            <br />
            <span className="text-muted">Entend&eacute; tus patrones.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Molino conecta numerolog&iacute;a, astrolog&iacute;a, zodiaco chino y otros sistemas simb&oacute;licos para ayudarte a explorar patrones, ciclos, compatibilidades y decisiones.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-3 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[48px]">
              Crear mi perfil
            </button>
            <button type="button" onClick={() => router.push("/explore")} className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-8 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent min-h-[48px]">
              Explorar Molino
            </button>
          </div>
        </motion.section>

        {/* ═══ 2. LOS TRES SISTEMAS — Left-aligned, editorial ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los tres sistemas</h2>
          </div>
          <div className="space-y-4">
            {SYSTEMS.map((system, i) => (
              <motion.button key={system.href} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.08, duration: 0.5 }} onClick={() => router.push(system.href)} className="w-full text-left p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: system.color }} />
                  <div className="flex-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">{system.title}</h3>
                    <p className="text-sm text-muted mt-1">{system.subtitle}</p>
                    <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">{system.description}</p>
                  </div>
                  <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0 hidden sm:block">Explorar &rarr;</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ═══ 3. DARK SECTION — CÓMO FUNCIONA ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28 section-dark py-16 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-background/20" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-background/60 font-medium">C&oacute;mo funciona</h2>
            </div>
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <motion.div key={step.number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06, duration: 0.4 }} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-5 border-b border-background/10 last:border-b-0">
                  <span className="number-display text-2xl sm:text-3xl number-display-accent">{step.number}</span>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-background">{step.title}</h3>
                    <p className="text-sm text-background/60 mt-1 leading-relaxed max-w-lg">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══ 4. HERRAMIENTAS — Tools section ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Calcul&aacute; tu identidad</h2>
          </div>
          <p className="text-sm text-muted mb-6 max-w-lg">Sin registro. Sin guardar datos. Resultado inmediato.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Camino de Vida", icon: "\ud83d\udd22", href: "/herramientas/camino-de-vida", desc: "Tu n\u00famero numerol\u00f3gico" },
              { title: "Signo Solar", icon: "\u2b50", href: "/herramientas/signo-solar", desc: "Tu signo zodiacal" },
              { title: "Zod\u00edaco Chino", icon: "\ud83d\udc09", href: "/herramientas/zodiaco-chino", desc: "Tu animal y elemento" },
              { title: "Compatibilidad", icon: "\u2726", href: "/herramientas/compatibilidad", desc: "Conect\u00e1 dos perfiles" },
            ].map((tool) => (
              <button key={tool.href} type="button" onClick={() => router.push(tool.href)} className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent transition-all group">
                <p className="text-2xl mb-2">{tool.icon}</p>
                <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors">{tool.title}</p>
                <p className="text-xs text-muted mt-1">{tool.desc}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ═══ 5. COMPATIBILIDAD ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">&iquest;Con qu&eacute; reson&aacute;s?</h2>
          </div>
          <p className="text-sm text-muted mb-6 max-w-lg">Compatibiliz&aacute; tu perfil con pa&iacute;ses, marcas, personas y m&aacute;s.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: "\ud83c\udf0d", label: "Pa\u00edses", desc: "197 pa\u00edses", href: "/compatibility/countries" },
              { icon: "\u2726", label: "Marcas", desc: "235 marcas", href: "/compatibility/brands" },
              { icon: "\ud83d\udc64", label: "Personas", desc: "Compar\u00e1 tu mapa", href: "/explore" },
              { icon: "\ud83d\udca1", label: "Conceptos", desc: "Explor\u00e1 conexiones", href: "/explore" },
            ].map((item) => (
              <button key={item.label} type="button" onClick={() => router.push(item.href)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors group">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors">{item.label}</p>
                <p className="text-xs text-muted mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ═══ 6. KNOWLEDGE — Conceptos ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Conceptos clave</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONCEPTS.map((concept, i) => (
              <motion.button key={concept.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.05, duration: 0.4 }} onClick={() => router.push(concept.href)} className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent transition-all group">
                <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{concept.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{concept.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ═══ 7. CTA FINAL ═══ */}
        <motion.section {...fadeUp}>
          <div className="w-8 h-px bg-border mx-auto mb-8" />
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">Tu mapa es el comienzo.</h2>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">Cre&aacute; tu perfil personal y explor&aacute; las conexiones entre identidad, patrones, timing y decisiones.</p>
            <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]">
              Crear mi perfil
            </button>
          </div>
        </motion.section>

      </main>

      <UniversityFooter />
    </div>
  );
}
