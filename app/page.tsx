"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const SYSTEMS = [
  { title: "Numerolog\u00eda", subtitle: "El lenguaje simb\u00f3lico de los n\u00fameros", description: "Tu Life Path, Expression, Alma y Personalidad revelan capas diferentes de qui\u00e9n sos.", href: "/numerologia", color: "var(--element-fire)" },
  { title: "Astrolog\u00eda", subtitle: "El mapa del cielo de tu nacimiento", description: "Tu signo solar, los planetas y las casas forman un mapa del cielo en el momento de tu nacimiento.", href: "/astrologia", color: "var(--layer-astrology)" },
  { title: "Zodiaco Chino", subtitle: "Animales, elementos y ciclos de 60 a\u00f1os", description: "Un sistema de 12 animales y 5 elementos que se repite cada 60 a\u00f1os. Tu animal y elemento definen tu estilo.", href: "/zodiaco-chino", color: "var(--layer-moment)" },
  { title: "Arquetipos", subtitle: "Patrones simb\u00f3licos de personalidad", description: "Los 9 arquetipos numerol\u00f3gicos que revelan tu energ\u00eda natural y tu camino de crecimiento.", href: "/numerologia", color: "var(--layer-patterns)" },
];

const CONCEPTS = [
  { title: "Arquetipos", description: "Los 9 arquetipos numerol\u00f3gicos y lo que revelan sobre tu energ\u00eda natural.", href: "/numerologia" },
  { title: "Elementos", description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", href: "/astrologia" },
  { title: "Ciclos", description: "Tu a\u00f1o, mes y d\u00eda personal. C\u00f3mo cambia tu energ\u00eda a lo largo del tiempo.", href: "/profile" },
  { title: "N\u00fameros maestros", description: "11, 22, 33. N\u00fameros especiales que amplifican la energ\u00eda de tu Life Path.", href: "/numerologia" },
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

const INTELLIGENCE = [
  { title: "Perfil", description: "Tu identidad central", href: "/profile" },
  { title: "Timing", description: "Tu momento actual", href: "/daily-energy" },
  { title: "Decisiones", description: "Herramienta de reflexi\u00f3n", href: "/decisions" },
  { title: "Patrones", description: "Tus patrones dominantes", href: "/profile" },
];

const UNIVERSE = [
  { title: "Pa\u00edses", description: "197 pa\u00edses", href: "/compatibility/countries", icon: "\ud83c\udf0d" },
  { title: "Marcas", description: "235 marcas", href: "/compatibility/brands", icon: "\u2726" },
  { title: "Personas", description: "Compar\u00e1 tu mapa", href: "/explore", icon: "\ud83d\udc64" },
  { title: "Conceptos", description: "Explor\u00e1 conexiones", href: "/explore", icon: "\ud83d\udca1" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* 1. HERO */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Inteligencia Personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Molino transforma sistemas simb\u00f3licos en una experiencia de autoconocimiento
            <br />
            <span className="text-muted">interactiva, transparente y profundamente personalizada.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Numerolog\u00eda, astrolog\u00eda, zod\u00edaco chino y compatibilidad. Todo calculado, todo explicado, todo tuyo.
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

        {/* 2. LAS GRANDES AREAS */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Las grandes \u00e1reas de Molino</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Inteligencia Personal */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Inteligencia Personal</p>
              <div className="space-y-2">
                {INTELLIGENCE.map((item) => (
                  <button key={item.title} type="button" onClick={() => router.push(item.href)} className="w-full text-left flex items-center justify-between py-2 text-sm text-foreground hover:text-accent transition-colors">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tu Universo */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Tu universo</p>
              <div className="space-y-2">
                {UNIVERSE.map((item) => (
                  <button key={item.title} type="button" onClick={() => router.push(item.href)} className="w-full text-left flex items-center justify-between py-2 text-sm text-foreground hover:text-accent transition-colors">
                    <span className="flex items-center gap-2"><span>{item.icon}</span>{item.title}</span>
                    <span className="text-xs text-muted">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tu Conocimiento */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Tu conocimiento</p>
              <div className="space-y-2">
                {["Numerolog\u00eda", "Astrolog\u00eda", "Zodiaco Chino", "Arquetipos", "Elementos", "Ciclos"].map((item) => (
                  <button key={item} type="button" onClick={() => router.push("/explore")} className="w-full text-left py-2 text-sm text-foreground hover:text-accent transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 2.5 HERRAMIENTAS — Sin perfil, sin registro */}
        <motion.section {...fadeUpDelayed(0.12)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Calcul\u00e1 tu identidad</h2>
          </div>
          <p className="text-sm text-muted mb-6 max-w-lg">
            Sin registro. Sin guardar datos. Resultado inmediato.
          </p>
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

        {/* 3. COMO FUNCIONA */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">C\u00f3mo funciona</h2>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06, duration: 0.4 }} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-6 border-b border-border last:border-b-0">
                <span className="number-display text-3xl sm:text-4xl number-display-accent">{step.number}</span>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 4. LOS SISTEMAS */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los sistemas</h2>
          </div>
          <div className="space-y-4">
            {SYSTEMS.map((system, i) => (
              <motion.button key={system.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06, duration: 0.4 }} onClick={() => router.push(system.href)} className="w-full text-left p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: system.color }} />
                  <div className="flex-1">
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{system.title}</h3>
                    <p className="text-sm text-muted mt-1">{system.subtitle}</p>
                    <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">{system.description}</p>
                  </div>
                  <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0">Explorar &rarr;</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* 5. COMPATIBILIDAD */}
        <motion.section {...fadeUpDelayed(0.25)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">&iquest;Con qu\u00e9 reson\u00e1s?</h2>
          </div>
          <p className="text-sm text-muted mb-6 max-w-lg">
            Compatibiliz\u00e1 tu perfil con pa\u00edses, marcas, personas y m\u00e1s.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: "\ud83c\udf0d", label: "Pa\u00edses", description: "197 pa\u00edses", href: "/compatibility/countries" },
              { icon: "\u2726", label: "Marcas", description: "235 marcas", href: "/compatibility/brands" },
              { icon: "\ud83d\udc64", label: "Personas", description: "Compar\u00e1 tu mapa", href: "/explore" },
              { icon: "\ud83c\udfac", label: "Pel\u00edculas", description: "Explor\u00e1 conexiones", href: "/explore" },
              { icon: "\ud83c\udfb5", label: "M\u00fasica", description: "Explor\u00e1 conexiones", href: "/explore" },
              { icon: "\ud83d\udca1", label: "Conceptos", description: "Explor\u00e1 conexiones", href: "/explore" },
            ].map((item, i) => (
              <motion.button key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.4 }} onClick={() => router.push(item.href)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors group">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors">{item.label}</p>
                <p className="text-xs text-muted mt-1">{item.description}</p>
              </motion.button>
            ))}
          </div>
          <div className="mt-6">
            <button type="button" onClick={() => router.push("/explore")} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">Explorar compatibilidad &rarr;</button>
          </div>
        </motion.section>

        {/* 6. CONOCIMIENTO */}
        <motion.section {...fadeUpDelayed(0.3)} className="mb-20 sm:mb-28">
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
          <div className="mt-6">
            <button type="button" onClick={() => router.push("/explore")} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">Explorar conocimiento &rarr;</button>
          </div>
        </motion.section>

        {/* 7. MI MAPA */}
        <motion.section {...fadeUpDelayed(0.35)}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu mapa es el comienzo</h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted flex-wrap">
            <span className="font-medium text-foreground">Identidad</span>
            <span className="text-border">&rarr;</span>
            <span className="font-medium text-foreground">Ciclos</span>
            <span className="text-border">&rarr;</span>
            <span className="font-medium text-foreground">Patrones</span>
            <span className="text-border">&rarr;</span>
            <span className="font-medium text-foreground">Decisiones</span>
            <span className="text-border">&rarr;</span>
            <span className="font-medium text-foreground">Compatibilidad</span>
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]">
              Crear mi perfil
            </button>
            <button type="button" onClick={() => router.push("/explore")} className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-transparent text-foreground border border-border hover:border-accent hover:text-accent min-h-[44px]">
              Explorar Molino
            </button>
          </div>
        </motion.section>

      </main>

      <UniversityFooter />
    </div>
  );
}
