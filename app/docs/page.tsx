import Link from "next/link";
import { siteUrl, SITE_URL, createRouteMetadata } from "@/lib/seo";
import { Code2, ArrowRight, ShieldCheck, Terminal, Sparkles, Cpu, Layers, Heart, Sun } from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata = createRouteMetadata({
  title: "API Pública & Documentación para Desarrolladores",
  description:
    "Documentación completa de la API REST v1 de Molino. Endpoints con soporte CORS para consultar mapas simbólicos, compatibilidad y energía diaria en JSON.",
  path: "/docs",
});

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/map",
    title: "Mapa Personal Completo",
    desc: "Calcula Camino de Vida, signo solar, animal del zodíaco chino y ciclos anuales.",
    params: [
      { name: "date", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha de nacimiento (ej: 1990-03-15)" },
      { name: "name", type: "string", required: false, desc: "Nombre opcional del consultante" },
    ],
    example: `${SITE_URL}/api/v1/map?date=1990-03-15&name=Ana`,
    response: `{
  "status": "success",
  "query": { "date": "1990-03-15", "name": "Ana" },
  "map": {
    "numerology": { "lifePath": 1, "archetype": "El Iniciador" },
    "astrology": { "sunSign": "Piscis", "element": "Agua" },
    "chineseZodiac": { "animal": "Caballo", "element": "Metal" },
    "cycles": { "personalYear": 9, "personalDay": 1 }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/daily",
    title: "Energía & Foco Diario",
    desc: "Calcula la vibración diaria, fase lunar, áreas de foco y recomendaciones.",
    params: [
      { name: "birthDate", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha de nacimiento" },
      { name: "targetDate", type: "string (YYYY-MM-DD)", required: false, desc: "Fecha a consultar (default: hoy)" },
    ],
    example: `${SITE_URL}/api/v1/daily?birthDate=1990-03-15`,
    response: `{
  "status": "success",
  "dailyEnergy": {
    "personalDay": 1,
    "theme": "Iniciación",
    "moonPhase": { "phase": "Luna Nueva", "emoji": "🌑" },
    "areas": { "work": { "score": 85 }, "creativity": { "score": 90 } }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/compatibility",
    title: "Compatibilidad & Sinastría",
    desc: "Cruza dos mapas para obtener puntuación de sinastría, conexiones y desafíos.",
    params: [
      { name: "dateA", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha nacimiento persona A" },
      { name: "dateB", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha nacimiento persona B" },
    ],
    example: `${SITE_URL}/api/v1/compatibility?dateA=1990-03-15&dateB=1988-07-22`,
    response: `{
  "status": "success",
  "compatibility": {
    "score": 88,
    "level": "Alta Resonancia",
    "summary": "Excelente equilibrio entre agua y fuego.",
    "connections": [...]
  }
}`,
  },
];

export default function DocsPage() {
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Code2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              Desarrolladores & API v1
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase">
            API Pública de Molino
          </h1>

          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            Integrá el motor de cálculo simbólico de Molino en tus propias aplicaciones, bots, widgets o sitios de terapeutas. <strong>Gratuita, con soporte CORS y sin registrarte.</strong>
          </p>
        </header>

        {/* Quick Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <Card padding="md" className="border-ink/10 bg-card/60">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-accent mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Sin Guardado</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Las consultas son stateless. No persistimos fechas ni identificadores en servidores.
            </p>
          </Card>

          <Card padding="md" className="border-ink/10 bg-card/60">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-accent mb-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>CORS Habilitado (*)</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Consumible directamente desde navegadores (`fetch`), scripts frontend o backends Node/Python.
            </p>
          </Card>

          <Card padding="md" className="border-ink/10 bg-card/60">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-accent mb-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Determinismo Puro</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Mismos parámetros siempre devuelven exactamente los mismos resultados numéricos y astrológicos.
            </p>
          </Card>
        </div>

        {/* Endpoints List */}
        <div className="space-y-12 mb-16">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              id={ep.path.replace(/[/]/g, "-")}
              className="p-6 sm:p-8 rounded-3xl bg-card border border-ink/10 shadow-sm space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-foreground">
                    {ep.path}
                  </span>
                </div>
                <span className="font-heading text-sm text-accent font-semibold">
                  {ep.title}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {ep.desc}
              </p>

              {/* Parameters Table */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-3">
                  Parámetros de consulta (Query Params)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-ink/10 text-muted">
                        <th className="py-2 pr-4">Parámetro</th>
                        <th className="py-2 pr-4">Tipo</th>
                        <th className="py-2 pr-4">Requerido</th>
                        <th className="py-2">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {ep.params.map((p) => (
                        <tr key={p.name}>
                          <td className="py-2.5 pr-4 font-bold text-accent">{p.name}</td>
                          <td className="py-2.5 pr-4 text-muted">{p.type}</td>
                          <td className="py-2.5 pr-4">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                p.required
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-ink/5 text-muted"
                              }`}
                            >
                              {p.required ? "Sí" : "Opcional"}
                            </span>
                          </td>
                          <td className="py-2.5 text-muted">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example Request & Response */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">Ejemplo de respuesta (JSON):</span>
                  <a
                    href={ep.example}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Probar en vivo <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <pre className="p-4 rounded-2xl bg-background border border-ink/10 text-[11px] font-mono text-foreground/90 overflow-x-auto leading-relaxed">
                  <code>{ep.response}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Embed & Engines crosslinks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/embed"
            className="p-6 rounded-3xl bg-accent/5 border border-accent/20 hover:border-accent/40 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider block mb-1">
                Widget Embebible
              </span>
              <h4 className="font-heading text-base font-bold text-foreground">
                Incrustar calculadora en tu sitio web
              </h4>
              <p className="text-xs text-muted mt-1">
                Código iframe de 1 línea listo para usar.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/docs/motores"
            className="p-6 rounded-3xl bg-card border border-ink/10 hover:border-accent/40 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-mono text-xs text-muted font-bold uppercase tracking-wider block mb-1">
                Fórmulas & Algoritmos
              </span>
              <h4 className="font-heading text-base font-bold text-foreground">
                Documentación de Motores Matemáticos
              </h4>
              <p className="text-xs text-muted mt-1">
                Explicación de Swiss Ephemeris y Pitágoras.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
